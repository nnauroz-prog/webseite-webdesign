/**
 * Antwortstrom aus JSON-Zeilen (NDJSON) für lange Läufe im Admin-Bereich:
 * die Redaktion im Story-Studio (lib/redaktion/strom.ts) und das Posten
 * auf Instagram (app/admin/instagram/posten/route.ts). Sorgt dafür, dass
 * der jeweilige Vertrag auch im Fehlerfall hält:
 * - Zeilen vom Typ „schritt“ sind Fortschritt; jede andere Zeile ist die
 *   Schlusszeile. Danach kommt nichts mehr.
 * - Wirft der Lauf oder endet er ohne Schlusszeile, wird die Ersatzzeile
 *   (ein Fehler mit dem Code „unbekannt“) nachgeschoben.
 * - Schließt der Browser die Verbindung, bekommt der Lauf ein
 *   Abbruchsignal.
 * Rein (ohne Server-Importe).
 */

/** Jede Zeile hat einen Typ; „schritt“ ist Fortschritt, alles andere Schluss. */
export type NdjsonEreignis = { typ: string };

export type NdjsonLauf<E extends NdjsonEreignis> = (
  sende: (ereignis: E) => void,
  signal: AbortSignal,
) => Promise<void>;

/**
 * Der Strom zu einem Lauf. ersatz ist die Schlusszeile, wenn der Lauf
 * wirft oder ohne Schlusszeile endet.
 */
export function ndjsonStromAus<E extends NdjsonEreignis>(
  lauf: NdjsonLauf<E>,
  ersatz: E,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const abbruch = new AbortController();
  /** Verbindung steht noch. */
  let offen = true;
  /** Schlusszeile ist raus. */
  let fertig = false;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const sende = (ereignis: E) => {
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
          sende(ersatz);
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

/** Die Antwort zu einem Lauf: immer HTTP 200 mit Zeilenstrom, nie zwischengespeichert. */
export function ndjsonAntwortAus<E extends NdjsonEreignis>(
  lauf: NdjsonLauf<E>,
  ersatz: E,
  inhaltstyp: string,
): Response {
  return new Response(ndjsonStromAus(lauf, ersatz), {
    headers: {
      "content-type": inhaltstyp,
      "cache-control": "private, no-store, no-transform",
      "x-content-type-options": "nosniff",
    },
  });
}
