/**
 * Vergleich von Kartentexten für die Tests: fängt Beinahe-Doppelungen ab,
 * wenn neue Karten oder Story-Serien dazukommen. Gemeinsam genutzt von
 * tests/sprueche.test.ts (Reserve, tagesaktuelle Posts) und
 * tests/story-serie.test.ts (Serien des Tages).
 */

/** Wörter ab fünf Buchstaben, klein, ohne Satzzeichen und Ziffern. */
export const woerter = (text: string, ohne: ReadonlySet<string> = new Set()) =>
  new Set(
    text
      .toLowerCase()
      .replace(/[^a-zäöüß ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !ohne.has(w)),
  );

/** Beinahe-Doppelung: drei gemeinsame Wörter und halbe Überschneidung. */
export function zuAehnlich(a: Set<string>, b: Set<string>): boolean {
  const gemeinsam = [...a].filter((w) => b.has(w)).length;
  const anteil = gemeinsam / (a.size + b.size - gemeinsam || 1);
  return gemeinsam >= 3 && anteil >= 0.5;
}

/** Wörter, die an einem Anlass hängen und deshalb nicht als Doppelung zählen. */
export const GENERISCH = [
  "heute",
  "morgen",
  "jetzt",
  "gerade",
  "hamburg",
  "hamburger",
  "woche",
  "wochenende",
];

/** Wörter, die beim Vergleich nicht zählen: die allgemeinen und die der Anlässe. */
export const ohneAnlass = (...anlaesse: string[]) =>
  new Set([...GENERISCH, ...anlaesse.flatMap((a) => [...woerter(a)])]);
