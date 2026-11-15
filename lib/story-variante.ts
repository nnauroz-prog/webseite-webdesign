/**
 * Welches Bild an welchem Tag? Jeder Tag bekommt eine eigene
 * Zusammenstellung aus Farbwelt, Hafen-Motiv, Schmuck, Grundmuster,
 * Lage des Textes, Form des Aufklebers und Art des Balkens. Zusammen
 * mit dem Spruch ergibt das jeden Tag ein neues Bild.
 *
 * Die Zusammenstellung folgt aus der fortlaufenden Tagesnummer: Sie wird
 * mit einer zur Anzahl teilerfremden Zahl vervielfacht und dann in ihre
 * Stellen zerlegt. So kommt jede Zusammenstellung genau einmal vor,
 * bevor sich die erste wiederholt (bei über 20 000 Möglichkeiten und
 * drei Posts am Tag nach rund 19 Jahren). Beim Spruch des Tages wechseln
 * Farbwelt, Motiv, Schmuck, Grundmuster und Lage jeden Tag, dieselbe
 * Farbwelt kommt frühestens nach einer Woche wieder, und die drei Posts
 * eines Tages haben verschiedene Farbwelten, Motive und Schmuckformen.
 * Dazu kommt der Ablauf des Films (Auftritt der Pointe, Weg der Kamera):
 * Er wechselt ebenfalls täglich und ist bei den drei Posts eines Tages
 * verschieden. Geprüft in tests/story-look.test.ts.
 */
import { STORY_LOOKS, type StoryLook } from "@/lib/story-look";
import { MOTIVE, SCHMUCK, type Motiv, type Schmuck } from "@/lib/story-teile";

/**
 * Fläche im Grund. Das gemalte Bild (lib/story-bild.ts) zeichnet bei
 * „raster“ einen großen Kreis, bei „geteilt“ eine schräge Teilung, sonst
 * nur das Licht. Schmuck, Aufkleber und Balken zählen dort nur noch als
 * Stellen im täglichen Wechsel: Sie halten die Reihenfolge der Tage
 * stabil, auch wenn das Bild sie nicht mehr eigens zeichnet.
 */
export const GRUENDE = ["glatt", "raster", "streifen", "geteilt"] as const;
export type Grund = (typeof GRUENDE)[number];
/** Lage von Aufkleber, Satz und Zusatz im freien Feld. */
export const ANKER = ["mitte", "oben", "unten"] as const;
export type Anker = (typeof ANKER)[number];
export const AUFKLEBER = ["pille", "band"] as const;
export type Aufkleber = (typeof AUFKLEBER)[number];
/** Balken hinter der Pointe: gefüllt oder nur als Rahmen. */
export const BALKEN = ["gefuellt", "rahmen"] as const;
export type Balken = (typeof BALKEN)[number];

/**
 * Wie die Pointe im Film ins Bild kommt: am Kran abgesetzt, als Klapptafel
 * umgeschlagen, unter einem Klebeband freigelegt, wie ein Stempel
 * aufgedrückt oder mit dem Marker angestrichen.
 */
export const AUFTRITTE = [
  "kran",
  "klappe",
  "abziehen",
  "presse",
  "marker",
] as const;
export type Auftritt = (typeof AUFTRITTE)[number];
/**
 * Weg der Kamera im Film: vom Requisit zurück in die Totale, aus der
 * Totale langsam heran, von der Lücke der Pointe zurück oder am Hafen
 * entlang.
 */
export const KAMERAS = ["rueckzug", "anfahrt", "luecke", "hafen"] as const;
export type Kamera = (typeof KAMERAS)[number];

/** Der Aufkleber sitzt jeden Tag etwas anders gedreht (Grad). */
const DREHUNG = [-6, 4, -4, 5, -7, 3];

export type Variante = {
  look: StoryLook;
  motiv: Motiv;
  schmuck: Schmuck;
  grund: Grund;
  anker: Anker;
  aufkleber: Aufkleber;
  balken: Balken;
  /** Drehung des Aufklebers in Grad */
  dreh: number;
  /** Ablauf des Films: Auftritt der Pointe und Weg der Kamera */
  auftritt: Auftritt;
  kamera: Kamera;
  /** Nummer der Zusammenstellung (0 bis VARIANTEN - 1) */
  schluessel: number;
};

const STELLEN = [
  STORY_LOOKS.length,
  MOTIVE.length,
  SCHMUCK.length,
  GRUENDE.length,
  ANKER.length,
  AUFKLEBER.length,
  BALKEN.length,
];
/** Anzahl aller Zusammenstellungen. */
export const VARIANTEN = STELLEN.reduce((a, b) => a * b, 1);
/**
 * Teilerfremd zu VARIANTEN (weder durch 2 noch durch 3 teilbar) und so
 * gewählt, dass sich von Tag zu Tag möglichst viele Stellen ändern und
 * die drei Posts eines Tages deutlich verschieden aussehen.
 */
const SCHRITT = 749;
/** Posts je Tag (wie POSTS_PRO_TAG in lib/sprueche-data.ts). */
const PLAETZE = 3;
/** Tag, an dem die Karten online gingen: Er bekommt die Zusammenstellung 0. */
const ERSTER_TAG = 6;
/** Sprung für „Anderes Design“ im Story-Studio. */
const VERSATZ = 4099;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * Zusammenstellung für die fortlaufende Tagesnummer (auch negativ) und
 * den Platz am Tag (0 = Spruch des Tages, 1 und 2 = Zusatz-Posts).
 * versatz wählt von Hand ein anderes Design (Story-Studio).
 */
export function varianteFuer(nummer: number, platz = 0, versatz = 0): Variante {
  const schluessel = mod(
    ((nummer - ERSTER_TAG) * PLAETZE + platz) * SCHRITT + versatz * VERSATZ,
    VARIANTEN,
  );
  let rest = schluessel;
  const stelle = (anzahl: number) => {
    const z = rest % anzahl;
    rest = Math.floor(rest / anzahl);
    return z;
  };
  const farbe = stelle(STORY_LOOKS.length);
  const motiv = stelle(MOTIVE.length);
  const schmuck = stelle(SCHMUCK.length);
  const grund = stelle(GRUENDE.length);
  const anker = stelle(ANKER.length);
  const aufkleber = stelle(AUFKLEBER.length);
  const balken = stelle(BALKEN.length);
  // Die Farbwelt wird mit den anderen Stellen verschoben: So läuft die
  // Farbfolge nicht alle zwölf Tage gleich ab, und trotzdem bleibt jede
  // Zusammenstellung einmalig (für feste übrige Stellen ist die
  // Verschiebung nur eine Drehung der Farben). Dieselbe Farbwelt kommt
  // frühestens nach einer Woche wieder.
  const look = mod(
    farbe + 11 * schmuck + 4 * grund + 4 * anker,
    STORY_LOOKS.length,
  );
  return {
    look: STORY_LOOKS[look],
    motiv: MOTIVE[motiv],
    schmuck: SCHMUCK[schmuck],
    grund: GRUENDE[grund],
    anker: ANKER[anker],
    aufkleber: AUFKLEBER[aufkleber],
    balken: BALKEN[balken],
    dreh: DREHUNG[mod(nummer, DREHUNG.length)],
    // Der Film wechselt unabhängig vom Bild: Die drei Posts eines Tages
    // laufen verschieden ab, und der Spruch des Tages hat jeden Tag einen
    // anderen Auftritt und einen anderen Kameraweg als am Vortag.
    auftritt:
      AUFTRITTE[
        mod(
          (nummer - ERSTER_TAG) * PLAETZE + platz + versatz * 2,
          AUFTRITTE.length,
        )
      ],
    kamera: KAMERAS[mod(nummer - ERSTER_TAG + platz + versatz, KAMERAS.length)],
    schluessel,
  };
}
