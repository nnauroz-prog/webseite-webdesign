/**
 * Satzplan der Spruch-Karten: Wie wird ein Satz gesetzt? Gemeinsam für
 * die Karte auf /journal und das Story-Bild im Admin, damit beide gleich
 * umbrechen.
 *
 * - Steht die Pointe am Satzende, bekommt sie einen eigenen Block: groß,
 *   kursiv, auf einem Farbbalken („block“).
 * - Steht sie mitten im Satz, läuft sie im Satz mit, etwas größer und
 *   mit Balken dahinter („fluss“).
 * - Nach einem Satzende beginnt immer eine neue Zeile.
 */
import { teileSatz, type Spruch } from "@/lib/sprueche-data";

/**
 * Laufweiten von Cormorant Garamond kursiv 600 in Tausendstel der
 * Schriftgröße (gemessen an der Schrift selbst). Damit lässt sich die
 * Pointe schon auf dem Server so groß rechnen, dass sie die Zeile füllt.
 */
const KURSIV: Record<string, number> = {
  a: 441,
  b: 445,
  c: 346,
  d: 448,
  e: 352,
  f: 266,
  g: 385,
  h: 452,
  i: 247,
  j: 246,
  k: 414,
  l: 244,
  m: 682,
  n: 472,
  o: 405,
  p: 406,
  q: 419,
  r: 350,
  s: 311,
  t: 299,
  u: 472,
  v: 442,
  w: 625,
  x: 427,
  y: 449,
  z: 344,
  A: 603,
  B: 547,
  C: 587,
  D: 628,
  E: 525,
  F: 484,
  G: 632,
  H: 674,
  I: 326,
  J: 304,
  K: 615,
  L: 502,
  M: 739,
  N: 654,
  O: 654,
  P: 522,
  Q: 654,
  R: 628,
  S: 467,
  T: 553,
  U: 619,
  V: 597,
  W: 830,
  X: 580,
  Y: 533,
  Z: 554,
  ä: 441,
  ö: 405,
  ü: 472,
  Ä: 603,
  Ö: 654,
  Ü: 619,
  ß: 466,
  " ": 234,
  ".": 204,
  ",": 231,
  "!": 219,
  "?": 295,
  ":": 204,
  ";": 222,
  "„": 344,
  "“": 344,
  "‚": 154,
  "‘": 187,
  "’": 188,
  "-": 305,
  "–": 515,
  "(": 287,
  ")": 287,
  "/": 305,
  "&": 760,
};
/** Buchstabenabstand der Pointe (in em), in beiden Fassungen gleich. */
export const KURSIV_SPERRUNG = -0.012;

/** Breite eines Textes in Cormorant kursiv, in em. */
export function kursivBreite(text: string): number {
  let b = 0;
  for (const z of text) b += (KURSIV[z] ?? 470) / 1000 + KURSIV_SPERRUNG;
  return b;
}

export type SatzPlan =
  | {
      art: "block";
      /** Wörter vor der Pointe; jede Gruppe beginnt in einer neuen Zeile */
      vor: string[][];
      /** Zeilen der Pointe (samt Satzzeichen) */
      pointe: string[];
    }
  | {
      art: "fluss";
      /** Wörter in Gruppen (neue Zeile nach Satzende); betont = Pointe */
      gruppen: { t: string; betont: boolean }[][];
    };

const SATZENDE = /[.!?]$/;

/** Wörter in Gruppen teilen: Nach einem Satzende beginnt eine neue. */
function gruppen<T>(woerter: T[], text: (w: T) => string): T[][] {
  const out: T[][] = [];
  let g: T[] = [];
  woerter.forEach((w, i) => {
    g.push(w);
    if (SATZENDE.test(text(w)) && i < woerter.length - 1) {
      out.push(g);
      g = [];
    }
  });
  if (g.length) out.push(g);
  return out;
}

/** Pointe in eine oder zwei Zeilen teilen, sodass sie möglichst groß wird. */
function pointeZeilen(pointe: string): string[] {
  const w = pointe.split(" ");
  // Kurz genug für eine Zeile in ordentlicher Größe.
  if (w.length === 1 || kursivBreite(pointe) <= 5.2) return [pointe];
  let beste = [pointe];
  let weite = Infinity;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(" ");
    const b = w.slice(i).join(" ");
    const m = Math.max(kursivBreite(a), kursivBreite(b));
    if (m < weite) {
      weite = m;
      beste = [a, b];
    }
  }
  return beste;
}

export function satzPlan(s: Spruch): SatzPlan {
  const [vor, mitte, nach] = teileSatz(s.text, s.betont);
  // Pointe am Satzende: eigener Block. Danach dürfen nur noch Satzzeichen
  // stehen oder ein einzelnes kurzes Wort („überfliegt sie.“), das mit
  // in den Block kommt.
  if (mitte && /^[.,!?:;“’)]*( [^ ]{1,5})?$/.test(nach)) {
    // Ein öffnendes Anführungszeichen direkt vor der Pointe gehört zu ihr.
    const auf = /[„‚(]$/.exec(vor)?.[0] ?? "";
    const rest = vor.slice(0, vor.length - auf.length).trim();
    return {
      art: "block",
      vor: gruppen(rest ? rest.split(" ") : [], (w) => w),
      pointe: pointeZeilen(auf + mitte + nach),
    };
  }
  const von = mitte ? vor.length : -1;
  const bis = von + mitte.length;
  let pos = 0;
  const woerter = s.text.split(" ").map((t) => {
    const a = pos;
    pos += t.length + 1;
    // Betont ist jedes Wort, das in die Pointe hineinreicht: auch eines,
    // das mit einem Anführungszeichen vor der Pointe beginnt.
    return { t, betont: von >= 0 && a < bis && a + t.length > von };
  });
  return { art: "fluss", gruppen: gruppen(woerter, (w) => w.t) };
}
