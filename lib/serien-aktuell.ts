import type { StorySerie } from "@/lib/story-serie";

/**
 * Story-Serie des Tages: Jeden Morgen schreibt der Morgenlauf zu den drei
 * Tageskarten (lib/posts-aktuell.ts) eine Serie aus drei bis fünf
 * Story-Bildern, die zusammen eine kleine Geschichte zum Tag erzählen.
 * Sie erscheint nur im Story-Studio (/admin/story).
 *
 * Regeln (prüft tests/story-serie.test.ts, dieselben wie in der Redaktion
 * des Studios: pruefeSerie in lib/story-serie.ts):
 * - Schlüssel ist der Kalendertag in Hamburg (yyyy-mm-dd), in zeitlicher
 *   Reihenfolge. Neue Tage NUR UNTEN ANHÄNGEN, vergangene Tage nie ändern.
 * - Drei bis fünf Bilder: zuerst der Aufhänger, dann Problem, Lösung,
 *   zuletzt die Einladung zur Anfrage.
 * - Für jedes Bild gelten die Regeln einer Karte (lib/karten-regeln.ts).
 * - titel: kurz und wahr für diesen Tag, steht auf jedem Bild.
 */
export const SERIEN_AKTUELL: Record<string, StorySerie> = {};

/** Die Serie des Tages (yyyy-mm-dd) oder null, wenn es keine gibt. */
export function serieFuer(
  datum: string,
  serien: Readonly<Record<string, StorySerie>> = SERIEN_AKTUELL,
): StorySerie | null {
  return serien[datum] ?? null;
}
