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
 * verschieden. Aus der Schmuck-Stelle folgt die Gestaltung des ganzen
 * Plakats (klassik, magazin, farbfeld, raster, schlagzeile, riese; dazu
 * das Kalenderblatt für tagesaktuelle Posts): Sie wechselt beim Spruch
 * des Tages täglich, und die drei Posts eines Tages sind verschieden
 * gestaltet. Geprüft in tests/story-look.test.ts.
 *
 * Eine Story-Serie (lib/story-serie.ts) teilt sich Tagesnummer und Platz
 * und damit Farbwelt und Motiv. Ihre Gestaltung ist für alle Bilder
 * dieselbe und eine andere als die der drei Posts des Tages
 * (serieGestaltung); der Film dreht von Bild zu Bild weiter
 * (filmFuerFolge).
 */
import { STORY_LOOKS, type StoryLook } from "@/lib/story-look";
import { MOTIVE, SCHMUCK, type Motiv, type Schmuck } from "@/lib/story-teile";

/**
 * Fläche im Grund. Das gemalte Bild (lib/story-bild.ts) zeichnet bei
 * „raster“ einen großen Kreis, bei „geteilt“ eine schräge Teilung, sonst
 * nur das Licht. Schmuck, Aufkleber und Balken zeichnet das Bild nicht
 * mehr eigens: Die Schmuck-Stelle wählt die Gestaltung (layout), der
 * Aufkleber die Achse im Magazin (pille: mittig, band: links); alle
 * halten die Reihenfolge der Tage stabil.
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

/**
 * Gestaltung des ganzen Plakats, wie ein Grafiker eine Serie anlegt:
 *
 * - „klassik“: das Format der Reihe (Flagge, Mythos, POV, Frage, Notiz,
 *   Sprechblase, Plakat), fette Grotesk, Pointe auf dem Farbstreifen.
 * - „magazin“: wie ein Titelblatt, große Serife auf strenger Achse,
 *   Haarlinien, Kicker in Kapitälchen, viel Luft.
 * - „farbfeld“: eine kräftige Farbfläche über dem größten Teil, darunter
 *   ruhiges Papier; die Elbe-Linie mit der Stadt ist der Horizont.
 * - „raster“: Schweizer Stil, sichtbarer Satzspiegel aus Spalten und
 *   Linien, riesige Grotesk linksbündig im Flattersatz, ein Quadrat in
 *   der Akzentfarbe, der Zusatz in seiner eigenen Spalte.
 * - „schlagzeile“: wie eine Titelseite, Kopfbalken mit Anlass oder
 *   Reihe und Datum, der Satz in fetten Versalien, der Zusatz als Zitat.
 * - „riese“: die Pointe als riesiges Wort über die ganze Breite, der
 *   übrige Satz klein darüber mit einer Lücke, wo sie hingehört.
 * - „kalenderblatt“: nur für tagesaktuelle Posts, ein Abreißkalender mit
 *   Wochentag, großer Tageszahl und Monat, der Anlass als Überschrift.
 */
export const LAYOUTS = [
  "klassik",
  "magazin",
  "farbfeld",
  "raster",
  "schlagzeile",
  "riese",
  "kalenderblatt",
] as const;
export type Layout = (typeof LAYOUTS)[number];
/**
 * Reihenfolge der Gestaltungen im Wechsel, sechs Plätze wie die
 * Schmuck-Stelle, jede Gestaltung einmal. Der Spruch des Tages nimmt den
 * Platz seiner Schmuck-Stelle, die beiden Zusatz-Posts die zwei
 * folgenden. So sind die drei Posts eines Tages immer verschieden
 * gestaltet (geprüft in tests/story-look.test.ts). Das Kalenderblatt
 * steht nicht in der Folge: Es braucht einen Anlass (gestaltungFuer).
 */
export const LAYOUT_FOLGE: readonly Layout[] = [
  "klassik",
  "farbfeld",
  "raster",
  "magazin",
  "schlagzeile",
  "riese",
];

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
  /** Gestaltung des Plakats (lib/story-bild.ts wählt danach den Aufbau) */
  layout: Layout;
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
  const schluesselFuer = (p: number) =>
    mod(
      ((nummer - ERSTER_TAG) * PLAETZE + p) * SCHRITT + versatz * VERSATZ,
      VARIANTEN,
    );
  const schluessel = schluesselFuer(platz);
  // Schmuck-Stelle des Spruchs des Tages: Sie wechselt täglich um eins
  // oder zwei weiter und gibt so die Gestaltung der drei Posts vor.
  const schmuckDesTages =
    Math.floor(schluesselFuer(0) / (STORY_LOOKS.length * MOTIVE.length)) %
    SCHMUCK.length;
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
    // Die Gestaltung folgt der Schmuck-Stelle, die das Bild nicht mehr
    // eigens zeichnet: Der Spruch des Tages wechselt sie täglich, die
    // drei Posts eines Tages sind verschieden gestaltet.
    layout: LAYOUT_FOLGE[mod(schmuckDesTages + platz, LAYOUT_FOLGE.length)],
    schluessel,
  };
}

/**
 * Gestaltungen, die eine Story-Serie tragen (lib/story-serie.ts): Alle
 * Bilder einer Serie stehen in derselben. Die klassische fehlt, weil sie
 * je Reihe ein anderes Format hat (Flagge, Zettel, Sucher) und die Bilder
 * dann nicht mehr wie aus einem Guss wirken; das Kalenderblatt fehlt,
 * weil es denselben Abreißkalender auf jedes Bild setzen würde.
 */
export const SERIE_LAYOUTS: readonly Layout[] = [
  "magazin",
  "farbfeld",
  "raster",
  "schlagzeile",
  "riese",
];

/** Stelle eines Bildes in einer Story-Serie (wie SerieKarte.folge). */
export type Folge = { nr: number; von: number };

/** Ist das ein Bild einer Serie (ganze Zahlen, nr von 1 bis von)? */
export function istFolge(folge: Folge | null | undefined): folge is Folge {
  return (
    !!folge &&
    Number.isInteger(folge.nr) &&
    Number.isInteger(folge.von) &&
    folge.von >= 2 &&
    folge.nr >= 1 &&
    folge.nr <= folge.von
  );
}

/**
 * Gestaltung einer Story-Serie an einem Tag: für alle ihre Bilder
 * dieselbe, immer aus SERIE_LAYOUTS. Die drei Posts des Tages belegen im
 * Wechsel drei Plätze hintereinander; die Serie nimmt den Platz danach.
 * So ist sie anders gestaltet als jeder Post desselben Tages. Stünde dort
 * die klassische, weicht sie auf einen der beiden übrigen freien Plätze
 * aus, und zwar auf den, der morgen nicht dran ist: So wechselt auch die
 * Gestaltung der Serie jeden Tag. versatz wie bei varianteFuer.
 */
export function serieGestaltung(nummer: number, versatz = 0): Layout {
  const n = LAYOUT_FOLGE.length;
  const platzFuer = (tag: number, schritt: number) =>
    LAYOUT_FOLGE[
      mod(
        LAYOUT_FOLGE.indexOf(varianteFuer(tag, 0, versatz).layout) + schritt,
        n,
      )
    ];
  const frei = [PLAETZE, PLAETZE + 1, PLAETZE + 2].map((s) =>
    platzFuer(nummer, s),
  );
  if (SERIE_LAYOUTS.includes(frei[0])) return frei[0];
  const morgen = platzFuer(nummer + 1, PLAETZE);
  return (
    frei.slice(1).find((l) => SERIE_LAYOUTS.includes(l) && l !== morgen) ??
    SERIE_LAYOUTS[0]
  );
}

/**
 * Ablauf des Films für ein Bild: der des Tages (varianteFuer), bei einem
 * Bild einer Serie von Bild zu Bild weitergedreht. So kommt die Pointe in
 * jedem Bild der Serie anders ins Bild, und die Kamera nimmt jedes Mal
 * einen anderen Weg (bei fünf Bildern wiederholt sich erst im fünften
 * der Kameraweg des ersten).
 */
export function filmFuerFolge(
  karte: { nummer: number; platz: number; folge?: Folge | null },
  versatz = 0,
): { auftritt: Auftritt; kamera: Kamera } {
  const v = varianteFuer(karte.nummer, karte.platz, versatz);
  if (!istFolge(karte.folge)) return { auftritt: v.auftritt, kamera: v.kamera };
  const schritt = karte.folge.nr - 1;
  return {
    auftritt:
      AUFTRITTE[mod(AUFTRITTE.indexOf(v.auftritt) + schritt, AUFTRITTE.length)],
    kamera: KAMERAS[mod(KAMERAS.indexOf(v.kamera) + schritt, KAMERAS.length)],
  };
}

/**
 * Gestaltung eines Posts: die des Wechsels (varianteFuer), außer beim
 * tagesaktuellen Spruch des Tages an jedem zweiten Tag: Dann steht er als
 * Kalenderblatt mit seinem Anlass. Ohne Anlass gibt es kein
 * Kalenderblatt. Weil es nie im Wechsel steht und nur Platz 0 es
 * bekommt, bleiben die drei Posts eines Tages verschieden gestaltet.
 * Ein Bild einer Story-Serie (folge) bekommt die Gestaltung der Serie
 * (serieGestaltung), nie das Kalenderblatt und nie die klassische.
 * versatz wie bei varianteFuer („Anderes Design“ im Story-Studio).
 */
export function gestaltungFuer(
  karte: {
    nummer: number;
    platz: number;
    anlass: string | null;
    folge?: Folge | null;
  },
  versatz = 0,
): Layout {
  if (istFolge(karte.folge)) return serieGestaltung(karte.nummer, versatz);
  if (
    karte.anlass?.trim() &&
    karte.platz === 0 &&
    mod(karte.nummer + versatz, 2) === 0
  )
    return "kalenderblatt";
  return varianteFuer(karte.nummer, karte.platz, versatz).layout;
}
