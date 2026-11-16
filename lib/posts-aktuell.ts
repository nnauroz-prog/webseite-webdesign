import type { Spruch } from "@/lib/sprueche-data";

/**
 * Tagesaktuelle Posts: Jeden Morgen schreibt ein automatischer Lauf ein
 * bis drei Karten zu dem, was an diesem Tag in Hamburg los ist (Anlass,
 * Wetter, Termine, Neuigkeiten für kleine Betriebe). Sie haben Vorrang vor
 * der Reserve in lib/sprueche-liste.ts und lib/sprueche-extra.ts; fehlt ein
 * Tag hier, springt die Reserve ein (lib/sprueche-data.ts, postsFuer).
 *
 * Regeln (prüft tests/sprueche.test.ts):
 * - Schlüssel ist der Kalendertag in Hamburg (yyyy-mm-dd), in zeitlicher
 *   Reihenfolge. Neue Tage NUR UNTEN ANHÄNGEN, vergangene Tage nie ändern
 *   (das Journal zeigt die letzten sieben Tage).
 * - Ein bis drei Karten je Tag; die Reihenfolge ist der Platz (0 = Spruch
 *   des Tages, auch auf /journal). Verschiedene Kicker je Tag.
 * - Für jede Karte gelten dieselben Regeln wie für die Reserve: Längen,
 *   Sie-Form oder ohne Anrede, keine Ziffern, Preise, Marken (außer
 *   Google), Garantien, keine erfundenen Zahlen, Kunden, Bewertungen.
 * - anlass: kurz und wahr (3 bis 28 Zeichen, ohne Ziffern), steht auf dem
 *   Bild, etwa „Black Friday“, „Erster Advent“, „Sturm über Hamburg“.
 * - quelle: Adresse, auf die sich der Anlass stützt (nur im
 *   Mitgliederbereich zu sehen, nie auf dem Bild).
 * - Kein Satz darf schon in der Reserve oder an einem anderen Tag stehen.
 */
export type AktuellerPost = Spruch & {
  /** Kurzer, wahrer Anlass, steht auf dem Bild: „Black Friday“. */
  anlass: string;
  /** Worauf sich der Anlass stützt (Adresse), nur im Mitgliederbereich. */
  quelle?: string;
};

export const POSTS_AKTUELL: Record<string, AktuellerPost[]> = {};
