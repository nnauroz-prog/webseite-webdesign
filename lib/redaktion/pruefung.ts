/**
 * Die Prüfung im Lektorat, ganz ohne Modell: harte Regeln (pruefeSerie)
 * und Doppelungen mit dem, was schon erschienen ist (Vorrat, Karten zum
 * Tag, frühere Serien). Rein (ohne Server-Importe).
 *
 * - hart: Damit darf keine Serie das Studio erreichen.
 * - weich: Hinweise für den Lektor (fast gleiche Sätze, Kicker oder
 *   Pointe doppelt). Sie halten eine Serie nicht auf.
 */
import type { SerienEntwurf } from "@/lib/redaktion/lesen";

import { pruefeSerie } from "@/lib/story-serie";

/** Ein Satz, der schon erschienen ist, mit seiner Herkunft. */
export type BekannterSatz = {
  text: string;
  /** Für den Befund: „Vorrat“, „Karte vom 17.11.“, „Serie ‚Black Friday‘“. */
  woher: string;
};

export type Befund = { hart: string[]; weich: string[] };

/** Wörter ab fünf Buchstaben, klein, ohne Satzzeichen und Ziffern. */
export function woerter(
  text: string,
  ohne: ReadonlySet<string> = new Set(),
): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-zäöüß ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !ohne.has(w)),
  );
}

/**
 * Beinahe-Doppelung: drei gemeinsame Wörter und halbe Überschneidung.
 * Dieselbe Regel wie für die Karten im Code (tests/sprueche.test.ts).
 */
export function zuAehnlich(a: Set<string>, b: Set<string>): boolean {
  const gemeinsam = [...a].filter((w) => b.has(w)).length;
  const anteil = gemeinsam / (a.size + b.size - gemeinsam || 1);
  return gemeinsam >= 3 && anteil >= 0.5;
}

const gleich = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * Doppelungen einer Serie: mit bekannten Sätzen und zwischen den eigenen
 * Bildern. Wörter aus dem Titel zählen beim Vergleich nicht mit (zwei
 * Serien zum selben Anlass dürfen den Anlass beide nennen).
 */
export function doppelungen(
  serie: SerienEntwurf,
  bekannt: readonly BekannterSatz[],
): Befund {
  const hart: string[] = [];
  const weich: string[] = [];
  const titelWoerter = woerter(serie.titel);
  const eigene = serie.folien.map((f) => woerter(f.text, titelWoerter));

  serie.folien.forEach((f, i) => {
    const nr = i + 1;
    for (const b of bekannt) {
      if (gleich(f.text, b.text)) {
        hart.push(`Bild ${nr}: Der Satz ist schon erschienen (${b.woher}).`);
        break;
      }
    }
    for (const b of bekannt) {
      if (gleich(f.text, b.text)) continue;
      if (zuAehnlich(eigene[i], woerter(b.text, titelWoerter))) {
        weich.push(
          `Bild ${nr}: Der Satz ist fast derselbe wie „${b.text}“ (${b.woher}).`,
        );
        break;
      }
    }
    for (let j = 0; j < i; j++) {
      const frueher = serie.folien[j];
      if (zuAehnlich(eigene[i], eigene[j]))
        weich.push(`Bild ${j + 1} und Bild ${nr} sagen fast dasselbe.`);
      if (f.kicker && gleich(f.kicker, frueher.kicker))
        weich.push(
          `Kicker „${f.kicker}“ steht auf Bild ${j + 1} und Bild ${nr}.`,
        );
      if (f.betont && gleich(f.betont, frueher.betont))
        weich.push(
          `Pointe „${f.betont}“ steht auf Bild ${j + 1} und Bild ${nr}.`,
        );
      if (f.zusatz && gleich(f.zusatz, frueher.zusatz))
        hart.push(`Bild ${nr}: Der Zusatz steht doppelt.`);
    }
  });
  return { hart, weich };
}

/** Alle Befunde zu einem Entwurf: Regeln für Karten und Serie, Doppelungen. */
export function pruefeEntwurf(
  serie: SerienEntwurf,
  bekannt: readonly BekannterSatz[],
): Befund {
  const doppelt = doppelungen(serie, bekannt);
  return {
    hart: [...pruefeSerie(serie), ...doppelt.hart],
    weich: doppelt.weich,
  };
}
