import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import type {
  ModellAnfrage,
  ModellAntwort,
  RedaktionModell,
} from "@/lib/redaktion/modell";

import { fristAbgelaufen, ModellFehler } from "@/lib/redaktion/modell";

/*
 * Der echte Anschluss der Redaktion an die Claude API (offizielles SDK).
 * Nur auf dem Server: Der Schlüssel kommt aus ANTHROPIC_API_KEY und
 * verlässt den Server nie. Geloggt wird hier nichts.
 *
 * Je Aufruf:
 * - Die Antwort wird gestreamt und am Ende als Ganzes gelesen
 *   (finalMessage): So läuft auch ein längerer Aufruf nicht in eine
 *   Zeitüberschreitung der Verbindung.
 * - Nachdenken regelt das Modell selbst (adaptive), die Gründlichkeit
 *   steuert aufwand (effort). Sampling-Parameter gibt es bewusst keine.
 * - Die Form der Antwort erzwingt die API über das JSON-Schema
 *   (output_config.format). Ob der Inhalt die Regeln für Karten einhält,
 *   prüft danach der Code.
 * - Die Vorgabe der Rolle (system) ist je Rolle immer gleich und wird
 *   zum Zwischenspeichern markiert; das spart bei mehreren Aufträgen
 *   kurz hintereinander und in der zweiten Runde des Lektorats.
 */

/** Was dieser Anschluss vom SDK braucht (Tests setzen eine Attrappe ein). */
export type AnthropicAnschluss = {
  messages: Pick<Anthropic["messages"], "stream">;
};

/** Wiederholungen des SDK bei 429, 5xx und Verbindungsfehlern. */
const WIEDERHOLUNGEN = 1;

/**
 * Macht aus einem Fehler des SDK einen ModellFehler. Reihenfolge von
 * speziell nach allgemein: Abbruch und Zeitüberschreitung sind
 * Unterklassen des Verbindungsfehlers, der wiederum ein APIError ist.
 */
export function modellFehlerAus(
  err: unknown,
  signal?: AbortSignal,
): ModellFehler {
  if (err instanceof ModellFehler) return err;
  if (err instanceof Anthropic.APIUserAbortError)
    return new ModellFehler(fristAbgelaufen(signal) ? "zeit" : "abbruch");
  if (err instanceof Anthropic.APIConnectionTimeoutError)
    return new ModellFehler("zeit");
  if (err instanceof Anthropic.APIConnectionError)
    return new ModellFehler("verbindung");
  if (err instanceof Anthropic.AuthenticationError)
    return new ModellFehler("schluessel", err.status);
  if (err instanceof Anthropic.PermissionDeniedError)
    return new ModellFehler("rechte", err.status);
  if (err instanceof Anthropic.NotFoundError)
    return new ModellFehler("modell_fehlt", err.status);
  if (err instanceof Anthropic.RateLimitError)
    return new ModellFehler("limit", err.status);
  if (err instanceof Anthropic.BadRequestError)
    return new ModellFehler("anfrage", err.status);
  if (err instanceof Anthropic.APIError) {
    // Auch Fehler mitten im Strom landen hier: ohne Status, aber mit Typ.
    const status = err.status ?? undefined;
    if (status === 402 || err.type === "billing_error")
      return new ModellFehler("guthaben", status);
    if (err.type === "rate_limit_error")
      return new ModellFehler("limit", status);
    if (err.type === "timeout_error") return new ModellFehler("zeit", status);
    if (
      err.type === "overloaded_error" ||
      err.type === "api_error" ||
      (status !== undefined && status >= 500)
    )
      return new ModellFehler("ueberlastet", status);
    if (err.type === "authentication_error")
      return new ModellFehler("schluessel", status);
    if (err.type === "permission_error")
      return new ModellFehler("rechte", status);
    if (err.type === "not_found_error")
      return new ModellFehler("modell_fehlt", status);
    return new ModellFehler("sonst", status);
  }
  // Abbruch außerhalb des SDK (etwa schon vor dem Absenden).
  if (signal?.aborted)
    return new ModellFehler(fristAbgelaufen(signal) ? "zeit" : "abbruch");
  return new ModellFehler("sonst");
}

/**
 * Wartet auf die Antwort, aber nie länger als das Abbruchsignal erlaubt.
 * Das SDK gibt das Signal zwar an die Anfrage weiter; wartet es aber
 * nach einem 429 auf den nächsten Versuch (retry-after), hört es in
 * dieser Pause nicht auf das Signal. Frist und Abbruch gelten deshalb
 * hier noch einmal, unabhängig vom SDK.
 */
function bisAbbruch<T>(
  arbeit: Promise<T>,
  signal: AbortSignal | undefined,
  stoppe: () => void,
): Promise<T> {
  if (!signal) return arbeit;
  return new Promise<T>((fertig, fehl) => {
    const ab = () => {
      try {
        stoppe();
      } catch {
        // Der Strom war schon zu.
      }
      fehl(new ModellFehler(fristAbgelaufen(signal) ? "zeit" : "abbruch"));
    };
    if (signal.aborted) {
      // Die Arbeit läuft schon: ihr späteres Scheitern nicht unbehandelt lassen.
      arbeit.catch(() => {});
      ab();
      return;
    }
    signal.addEventListener("abort", ab, { once: true });
    arbeit
      .then(fertig, fehl)
      .finally(() => signal.removeEventListener("abort", ab));
  });
}

/**
 * Die Redaktion an der Claude API. Ohne Argument entsteht der Anschluss
 * aus der Umgebung (ANTHROPIC_API_KEY).
 */
export function anthropicModell(
  anschluss: AnthropicAnschluss = new Anthropic(),
): RedaktionModell {
  return {
    async frage(anfrage: ModellAnfrage): Promise<ModellAntwort> {
      try {
        const strom = anschluss.messages.stream(
          {
            model: anfrage.modell,
            max_tokens: anfrage.maxTokens,
            system: [
              {
                type: "text",
                text: anfrage.system,
                cache_control: { type: "ephemeral" },
              },
            ],
            messages: [{ role: "user", content: anfrage.nutzer }],
            thinking: { type: "adaptive" },
            output_config: {
              effort: anfrage.aufwand,
              format: { type: "json_schema", schema: anfrage.schema },
            },
          },
          { signal: anfrage.signal, maxRetries: WIEDERHOLUNGEN },
        );
        const nachricht = await bisAbbruch(
          strom.finalMessage(),
          anfrage.signal,
          () => (strom as { abort?: () => void }).abort?.(),
        );
        const text = nachricht.content
          .map((block) => (block.type === "text" ? block.text : ""))
          .join("");
        return { text, stopp: nachricht.stop_reason };
      } catch (err) {
        throw modellFehlerAus(err, anfrage.signal);
      }
    },
  };
}
