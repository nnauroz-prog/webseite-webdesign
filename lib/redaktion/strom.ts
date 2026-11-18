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
 * Der Strom selbst steht in lib/ndjson-strom.ts (auch fürs Posten auf
 * Instagram). Rein (ohne Server-Importe).
 */
import {
  ndjsonAntwortAus,
  ndjsonStromAus,
  type NdjsonLauf,
} from "@/lib/ndjson-strom";
import {
  REDAKTION_INHALTSTYP,
  type RedaktionEreignis,
} from "@/lib/redaktion/vertrag";

export type RedaktionLauf = NdjsonLauf<RedaktionEreignis>;

const UNBEKANNT: RedaktionEreignis = {
  typ: "fehler",
  code: "unbekannt",
  text: "Da ist etwas schiefgelaufen. Versuch es gleich noch einmal.",
};

export function ndjsonStrom(lauf: RedaktionLauf): ReadableStream<Uint8Array> {
  return ndjsonStromAus(lauf, UNBEKANNT);
}

/** Die Antwort der Redaktion: immer HTTP 200 mit Zeilenstrom. */
export function ndjsonAntwort(lauf: RedaktionLauf): Response {
  return ndjsonAntwortAus(lauf, UNBEKANNT, REDAKTION_INHALTSTYP);
}
