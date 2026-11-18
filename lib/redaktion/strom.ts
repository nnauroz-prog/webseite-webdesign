/**
 * Der Antwortstrom der Redaktion: eine JSON-Zeile je Ereignis (NDJSON,
 * Form in lib/redaktion/vertrag.ts). Sorgt dafür, dass der Vertrag auch
 * im Fehlerfall hält:
 * - Die letzte Zeile ist immer die Serie oder ein Fehler; danach kommt
 *   nichts mehr.
 * - Wirft der Lauf oder endet er ohne Schlusszeile, wird ein Fehler mit
 *   dem Code „unbekannt“ nachgeschoben.
 * - Schließt das Studio die Verbindung, bekommt der Lauf ein
 *   Abbruchsignal (kein weiterer Aufruf des Modells).
 * Rein (ohne Server-Importe).
 */
import {
  REDAKTION_INHALTSTYP,
  type RedaktionEreignis,
} from "@/lib/redaktion/vertrag";

export type RedaktionLauf = (
  sende: (ereignis: RedaktionEreignis) => void,
  signal: AbortSignal,
) => Promise<void>;

const UNBEKANNT: RedaktionEreignis = {
  typ: "fehler",
  code: "unbekannt",
  text: "Da ist etwas schiefgelaufen. Versuch es gleich noch einmal.",
};

export function ndjsonStrom(lauf: RedaktionLauf): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const abbruch = new AbortController();
  /** Verbindung steht noch. */
  let offen = true;
  /** Schlusszeile (Serie oder Fehler) ist raus. */
  let fertig = false;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const sende = (ereignis: RedaktionEreignis) => {
        if (!offen || fertig) return;
        if (ereignis.typ !== "schritt") fertig = true;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(ereignis)}\n`));
        } catch {
          offen = false;
        }
      };
      // Nicht abwarten: Die Antwort beginnt sofort, Zeilen kommen nach.
      void lauf(sende, abbruch.signal)
        .catch(() => undefined)
        .then(() => {
          sende(UNBEKANNT);
          if (!offen) return;
          offen = false;
          try {
            controller.close();
          } catch {
            // schon geschlossen
          }
        });
    },
    cancel() {
      offen = false;
      abbruch.abort();
    },
  });
}

/** Die Antwort der Redaktion: immer HTTP 200 mit Zeilenstrom. */
export function ndjsonAntwort(lauf: RedaktionLauf): Response {
  return new Response(ndjsonStrom(lauf), {
    headers: {
      "content-type": REDAKTION_INHALTSTYP,
      "cache-control": "private, no-store, no-transform",
      "x-content-type-options": "nosniff",
    },
  });
}
