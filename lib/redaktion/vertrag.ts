/**
 * Vertrag zwischen Story-Studio (Browser) und Redaktion (Server): Das
 * Studio schickt einen Auftrag, die Redaktion antwortet als Strom von
 * Zeilen (eine JSON-Zeile je Ereignis, NDJSON). Reine Typen und
 * Konstanten, damit Browser, Server und Tests dieselbe Form benutzen.
 */
import type { StorySerie } from "@/lib/story-serie";

/** Adresse der Redaktion (POST, nur angemeldet). */
export const REDAKTION_PFAD = "/admin/story/redaktion";

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
