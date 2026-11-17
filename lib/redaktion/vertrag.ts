/**
 * Vertrag zwischen Story-Studio (Browser) und Redaktion (Server): Das
 * Studio schickt einen Auftrag, die Redaktion antwortet als Strom von
 * Zeilen (eine JSON-Zeile je Ereignis, NDJSON). Reine Typen und
 * Konstanten, damit Browser, Server und Tests dieselbe Form benutzen.
 *
 * So antwortet der Server (app/admin/story/redaktion/route.ts):
 * - Immer HTTP 200 mit dem Inhaltstyp REDAKTION_INHALTSTYP, auch wenn
 *   etwas nicht geht: Fehlt der Schlüssel, ist die Eingabe ungültig
 *   oder das Tageslimit erreicht, besteht der Strom aus genau einer
 *   Zeile vom Typ „fehler“ (Codes kein_schluessel, eingabe, zu_viele).
 * - Die letzte Zeile ist immer „serie“ oder „fehler“; danach endet der
 *   Strom. Davor stehen nur Zeilen vom Typ „schritt“.
 * - Jeder Schritt meldet „laeuft“ und danach „fertig“. Das Lektorat kann
 *   „laeuft“ ein zweites Mal melden (zweite Runde, neuer Hinweis).
 * - Die Serie in der Zeile „serie“ hält alle Regeln ein (pruefeSerie)
 *   und ist, wenn es die Tabelle gibt, schon gespeichert (id).
 * - Eine Antwort ohne 2xx oder mit anderem Inhaltstyp kommt nicht von
 *   der Redaktion, etwa die Anmeldeseite nach einer abgelaufenen Sitzung
 *   oder ein Abbruch der Plattform: Das Studio behandelt sie wie den
 *   Code „unbekannt“.
 * - Schließt das Studio die Verbindung, bricht die Redaktion ab.
 * Die Redaktion braucht bis zu rund 100 Sekunden.
 */
import type { StorySerie } from "@/lib/story-serie";

/** Adresse der Redaktion (POST, nur angemeldet). */
export const REDAKTION_PFAD = "/admin/story/redaktion";

/** Inhaltstyp der Antwort (eine JSON-Zeile je Ereignis). */
export const REDAKTION_INHALTSTYP = "application/x-ndjson; charset=utf-8";

/** Längster Auftrag in Zeichen. Leer heißt: „Mach was zu heute“. */
export const AUFTRAG_MAX = 500;

/** Was das Studio schickt. */
export type RedaktionAuftrag = {
  /** Freier Text des Inhabers, höchstens AUFTRAG_MAX Zeichen, darf leer sein. */
  auftrag: string;
  /** Kalendertag in Hamburg (yyyy-mm-dd), für den die Serie gedacht ist. */
  datum: string;
};

/** Arbeitsschritte der Redaktion, in dieser Reihenfolge. */
export const REDAKTION_SCHRITTE = [
  "idee",
  "text",
  "lektorat",
  "gestaltung",
] as const;
export type RedaktionSchritt = (typeof REDAKTION_SCHRITTE)[number];

export const SCHRITT_LABEL: Record<RedaktionSchritt, string> = {
  idee: "Idee",
  text: "Text",
  lektorat: "Lektorat",
  gestaltung: "Gestaltung",
};

export type RedaktionFehlerCode =
  | "kein_schluessel"
  | "zu_viele"
  | "eingabe"
  | "modell"
  | "regeln"
  | "unbekannt";

/** Eine Zeile im Antwortstrom. */
export type RedaktionEreignis =
  | {
      typ: "schritt";
      schritt: RedaktionSchritt;
      stand: "laeuft" | "fertig";
      /** Ein kurzer Satz, was gerade passiert (Du-Form), optional. */
      hinweis?: string;
    }
  | {
      /** Letzte Zeile bei Erfolg. */
      typ: "serie";
      serie: StorySerie;
      /** Kennung in der Datenbank oder null, wenn nicht gespeichert. */
      id: string | null;
    }
  | {
      /** Letzte Zeile bei Misserfolg. */
      typ: "fehler";
      code: RedaktionFehlerCode;
      /** Kurzer Satz für den Inhaber (Du-Form). */
      text: string;
    };
