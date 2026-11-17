/**
 * Die Schnittstelle zwischen Redaktion und Sprachmodell. Die Redaktion
 * (lib/redaktion/ablauf.ts) kennt nur diese Form; der echte Anschluss
 * steht in lib/redaktion/anthropic.ts, Tests setzen eine Attrappe ein.
 * Rein (ohne Server-Importe).
 */

/** Wie gründlich das Modell nachdenkt (steuert Dauer und Kosten). */
export type ModellAufwand = "low" | "medium" | "high";

/** Ein Aufruf: eine Rolle der Redaktion mit ihrer Vorgabe und ihrem Material. */
export type ModellAnfrage = {
  /** Kennung des Modells. */
  modell: string;
  /** Vorgabe für die Rolle (bleibt je Rolle gleich). */
  system: string;
  /** Material und Auftrag für diesen einen Lauf. */
  nutzer: string;
  /** JSON-Schema der Antwort. */
  schema: Record<string, unknown>;
  /** Obergrenze für Nachdenken und Antwort zusammen. */
  maxTokens: number;
  aufwand: ModellAufwand;
  /** Bricht den Aufruf ab (Frist abgelaufen, Studio geschlossen). */
  signal?: AbortSignal;
};

export type ModellAntwort = {
  /** Der Antworttext (JSON nach dem Schema). */
  text: string;
  /** Warum das Modell aufgehört hat: "end_turn", "max_tokens", "refusal" … */
  stopp: string | null;
};

export interface RedaktionModell {
  /** Wirft ModellFehler, wenn der Aufruf scheitert. */
  frage(anfrage: ModellAnfrage): Promise<ModellAntwort>;
}

/** Was beim Aufruf schiefging, unabhängig vom Anbieter. */
export type ModellFehlerArt =
  /** Schlüssel abgelehnt (401). */
  | "schluessel"
  /** Schlüssel darf das nicht (403). */
  | "rechte"
  /** Guthaben oder Abrechnung (402). */
  | "guthaben"
  /** Modell unbekannt oder für den Schlüssel nicht freigegeben (404). */
  | "modell_fehlt"
  /** Zu viele Anfragen (429). */
  | "limit"
  /** Dienst überlastet oder gestört (529, 5xx). */
  | "ueberlastet"
  /** Zu lange gedauert (Frist oder Zeitüberschreitung). */
  | "zeit"
  /** Keine Verbindung. */
  | "verbindung"
  /** Anfrage abgelehnt (400), meist eine unpassende Einstellung. */
  | "anfrage"
  /** Das Modell hat den Auftrag aus Sicherheitsgründen abgelehnt. */
  | "abgelehnt"
  /** Antwort abgeschnitten (Obergrenze erreicht). */
  | "abgeschnitten"
  /** Antwort nicht lesbar. */
  | "format"
  /** Abgebrochen, weil das Studio die Verbindung beendet hat. */
  | "abbruch"
  | "sonst";

export class ModellFehler extends Error {
  art: ModellFehlerArt;
  /** HTTP-Status, falls es einen gab. */
  status?: number;

  constructor(art: ModellFehlerArt, status?: number) {
    super(`Modell: ${art}${status ? ` (${status})` : ""}`);
    this.name = "ModellFehler";
    this.art = art;
    this.status = status;
  }
}

/** Ob ein Abbruchsignal wegen der Frist ausgelöst hat (AbortSignal.timeout). */
export function fristAbgelaufen(signal: AbortSignal | undefined): boolean {
  if (!signal?.aborted) return false;
  const grund: unknown = signal.reason;
  return (
    !!grund &&
    typeof grund === "object" &&
    (grund as { name?: unknown }).name === "TimeoutError"
  );
}
