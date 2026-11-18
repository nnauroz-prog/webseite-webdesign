/**
 * Zeichnet eine Spruch-Karte auf eine Zeichenfläche (nur im Browser):
 * als Story (1080 × 1920) oder Beitrag (1080 × 1350) für Instagram im
 * Story-Studio (/admin/story) und als Karte (3:4) auf /journal. So sieht
 * die Website genauso aus wie die Posts.
 *
 * Jeder Post hat eine Gestaltung (lib/story-variante.ts, wechselt täglich,
 * die drei Posts eines Tages verschieden; malerFuer wählt den Aufbau):
 *
 * - Magazin: wie ein Titelblatt, große aufrechte Cormorant auf strenger
 *   Achse, Kennzeile mit Haarlinie, Kicker in Kapitälchen, kursiver
 *   Vorspann unter einer kurzen Linie.
 * - Farbfeld: eine kräftige Farbfläche, darunter ruhiges Papier; die
 *   Elbe-Linie mit Hamburg ist der Horizont dazwischen.
 * - Raster: Schweizer Stil, sichtbarer Satzspiegel (Linien, Spalten-
 *   marken), riesige Grotesk im Flattersatz, ein Quadrat in der
 *   Akzentfarbe, der Zusatz in seiner eigenen Spalte.
 * - Schlagzeile: Titelseite auf Zeitungspapier, Kopfbalken mit Anlass
 *   oder Reihe und Datum, fette Versalien, der Zusatz als Zitat.
 * - Riese: die Pointe riesig über die ganze Breite, der Satz klein
 *   darüber mit einer Lücke, wo sie hingehört.
 * - Kalenderblatt (nur tagesaktuell): ein Abreißkalender mit Wochentag,
 *   Tageszahl und Monat, daneben der Anlass als Überschrift.
 * - Klassik: das Format der Reihe (siehe unten).
 *
 * Bei tagesaktuellen Posts steht der Anlass mit auf dem Bild (neben dem
 * Datum, in der Titelzeile, im Kopfbalken oder als Überschrift); passt
 * er nicht, meldet es die Prüfung (canvas.dataset.kopf). In der
 * klassischen Gestaltung hat jede Reihe ihr eigenes Format, so wie ein
 * Grafiker Serien anlegt:
 *
 * - Flagge (Red Flag, Green Flag): große wehende Flagge, Satz darunter.
 * - Mythos: oben der Irrtum kursiv und durchgestrichen, unten auf Papier
 *   die Richtigstellung in großer Schrift.
 * - POV: dunkles Bild wie durch einen Sucher, mit Eckmarken und rotem Punkt.
 * - Frage (Hand aufs Herz, Mal ehrlich): ein großes Fragezeichen als
 *   Umriss über dem Satz.
 * - Notiz: Merken ist eine Karteikarte mit Lesezeichen, Reminder eine
 *   schief aufgeklebte Karte, Kleiner Reminder ein gelber Zettel mit
 *   Eselsohr.
 * - Sprechblase (Real Talk): der Satz in einer großen Sprechblase.
 * - Plakat (Hot Take, Unpopular Opinion, Kurz gesagt, Website-Wahrheit):
 *   reine Schrift mit einem großen Zeichen oder einem runden Stempel.
 *
 * Allen gemeinsam: derselbe Rahmen (Etikett oben links, Datum oben
 * rechts, unten die Elbe-Linie mit kleinem Schiff, Wortmarke und
 * Adresse), dieselben Schriften, die Pointe groß und kursiv auf einem
 * Farbstreifen. Regeln, die für alle gelten: Kein Streifen, Zeichen oder
 * Hafen-Motiv berührt Text; Zeilen brechen nach Sinn um; ein Akzent
 * (Orange). Farbwelt und Einzelheiten wählt lib/story-variante.ts für
 * jeden Tag neu. Bei der Story bleibt oben und unten ein Streifen frei
 * von Text: Dort liegt die Bedienung von Instagram.
 *
 * Der Film (acht Sekunden) folgt einem Satz: Jedes Ding bewegt sich so,
 * wie es wiegt, und Gedrucktes bewegt sich gar nicht. Das Plakat steht
 * vom ersten Bild an fertig gedruckt da, nur die Pointe fehlt noch. Wie
 * sie kommt und welchen Weg die Kamera nimmt, wechselt von Post zu Post
 * (lib/story-variante.ts), damit kein Film abläuft wie der davor:
 *
 * - Auftritt der Pointe: am Kran an zwei Seilen abgesetzt, als
 *   Klapptafel umgeschlagen, unter einem Klebeband freigelegt, wie ein
 *   Stempel aufgedrückt oder mit dem Marker angestrichen.
 * - Kamera: vom Requisit der Reihe zurück in die Totale, von der Lücke
 *   der Pointe zurück in die Totale, oder aus der Totale langsam heran.
 *
 * Dazu hat jede Reihe ihre Geste (Stempel, Umriss, Zettel, Flagge), und
 * auf der Wasserlinie fährt ein Schiff ein, das am Ende anlegt. Das
 * letzte Bild ist das Standbild. Keine Lichteffekte, keine Unschärfe.
 *
 * Story-Serien (lib/story-serie.ts) sind drei bis fünf Bilder, die
 * zusammen eine kleine Geschichte erzählen. Sie wirken wie aus einem
 * Guss: Alle Bilder tragen dieselbe Farbwelt, dasselbe Hafen-Motiv und
 * dieselbe Gestaltung (Magazin, Farbfeld, Raster, Schlagzeile oder
 * Riese; nie die klassische, nie das Kalenderblatt). Oben steht der
 * Titel der Serie und statt des Datums die Stelle des Bildes („2/4“).
 * Kopf, Zusatz und Linien stehen in jedem Bild an derselben Stelle, der
 * Satz mittig dazwischen. Die Aufgabe des Bildes gibt den Takt:
 *
 * - Aufhänger: das Titelblatt. Der Titel steht in der gefüllten Pille
 *   (in der Schlagzeile im hohen Kopfbalken), die Schrift darf am größten
 *   werden, und am rechten Rand steht „weiter“ mit einem Winkel.
 * - Problem und Lösung: ein Paar. Dasselbe Feld um die Pointe ist beim
 *   Problem leer (nur der Rahmen) und bei der Lösung gefüllt; im Raster
 *   gilt dasselbe für das Quadrat. Ein Winkel am Rand zeigt weiter.
 * - Einladung: der Satz und darunter der Kontaktblock, eine gefüllte
 *   Pille mit der Adresse des Anfrageformulars, daneben das Telefon.
 *
 * Auf jedem Bild steht höchstens eine orange Pille. Der Film läuft in
 * jedem Bild der Serie anders ab (filmFuerFolge in lib/story-variante.ts);
 * der Winkel und der Kontaktblock kommen nach dem Zusatz ins Bild.
 * Wo der enge Zeilenabstand zwei Zeilen zusammenstoßen ließe, bekommt
 * die untere etwas Luft (SatzStil.luft): unter einem „, das über einem
 * großen A, O oder U wie ein Umlaut stünde, in der Schlagzeile auch über
 * großen Umlauten und unter einem Komma.
 */
import {
  HAMBURG_HORIZONT,
  HAMBURG_OST,
  HAMBURG_WAHRZEICHEN,
  HAMBURG_WEST,
} from "@/lib/hamburg-skyline";
import {
  teileSatz,
  type SpruchKicker,
  type SpruchTag,
} from "@/lib/sprueche-data";
import { TELEFON_ANZEIGE } from "@/lib/erreichbarkeit";
import { STORY_LOOKS, type StoryLook } from "@/lib/story-look";
import {
  KURSIV_SPERRUNG,
  klebeband,
  satzPlan,
  type Kanten,
  type SatzPlan,
} from "@/lib/story-satz";
import {
  abbildungFuer,
  bildWeg,
  kinoBereit,
  kinoZeichnen,
  sichtbarerBereich,
  type KinoKamera,
} from "@/lib/story-kino";
import { MOTIV_WASSER } from "@/lib/story-teile";
import type { SerieRolle } from "@/lib/story-serie";
import {
  LAYOUT_FOLGE,
  SERIE_LAYOUTS,
  filmFuerFolge,
  gestaltungFuer,
  istFolge,
  serieGestaltung,
  varianteFuer,
  type Auftritt,
  type Folge,
  type Kamera,
  type Layout,
  type Variante,
} from "@/lib/story-variante";

/**
 * Was der Zeichner nimmt: ein Post oder ein Bild einer Story-Serie
 * (lib/story-serie.ts, SerieKarte). Ein Bild einer Serie trägt seine
 * Stelle (folge) und seine Aufgabe (rolle).
 */
export type StoryKarte = SpruchTag & {
  rolle?: SerieRolle;
  folge?: Folge | null;
};

/** Ausgabeformate: Story (9:16), Beitrag (4:5) und die Karte der Website (3:4). */
export type StoryFormat = {
  name: "story" | "beitrag" | "karte";
  b: number;
  h: number;
  /** Text nur zwischen diesen Linien. In der Story liegt oben und unten
   *  die Bedienung von Instagram (obere 14 %, untere 16 % frei). */
  oben: number;
  unten: number;
};
export const FORMATE: Record<StoryFormat["name"], StoryFormat> = {
  story: { name: "story", b: 1080, h: 1920, oben: 270, unten: 1640 },
  beitrag: { name: "beitrag", b: 1080, h: 1350, oben: 62, unten: 1298 },
  // Karte auf /journal (3:4): oben Platz für die Fortschrittsstriche.
  karte: { name: "karte", b: 1080, h: 1440, oben: 112, unten: 1372 },
};
/** Länge des Kurzvideos in Sekunden. */
export const STORY_DAUER = 8;
/**
 * Zeichnet das Bild zur Zeit t (Sekunden; Infinity = Standbild). fein =
 * true: für das gerechnete Video, mit Bewegungsunschärfe (nur mit der
 * Kino-Kamera).
 */
export type StoryZeichner = ((t: number, fein?: boolean) => void) & {
  /**
   * Nur mit der Kino-Kamera vorhanden: auf false gesetzt, wird wieder
   * flach gezeichnet (etwa wenn ein Gerät für die Kamera zu langsam ist).
   */
  kino?: boolean;
};

const RAND = 84;
const PAPIER = "#fff8ee";
const TINTE = "#1d1d1f";
const ORANGE = "#f45b1e";

const GROTESK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif';

type Ctx = CanvasRenderingContext2D;
type Wort = { t: string; betont: boolean; breite: number };
type Zeile = { woerter: Wort[]; breite: number };

/** Alles, was ein Format zum Zeichnen braucht. */
type Basis = {
  ctx: Ctx;
  f: StoryFormat;
  v: Variante;
  l: StoryLook;
  karte: SpruchTag;
  serif: string;
  mono: string;
  /** Maßstab der Zeichenfläche (Vorschaubilder sind kleiner). */
  skala: number;
  /** Oberkante und Unterkante des Textfelds */
  oben: number;
  unten: number;
  /** Wird gesetzt, wenn ein Text auch in der kleinsten Schrift nicht in
   *  sein Feld gepasst hat (für die Prüfung aller Karten). */
  eng: { wert: boolean; klein: number };
  /** Kamera des Bildes, das gerade gezeichnet wird (im Standbild neutral);
   *  dy ist das Federn des ganzen Plakats in Bildpunkten. */
  kam: { x: number; y: number; z: number; dy: number };
  /** Ablauf des Films: wie die Pointe ins Bild kommt, welchen Weg die Kamera nimmt. */
  film: { auftritt: Auftritt; kamera: Kamera };
  /** Regie des Films; jedes Format legt sie beim Vorbereiten fest. */
  regie: Regie;
  /** Mit der Kino-Kamera: fester Ausschnitt statt der Kamerafahrt (die übernimmt die Kino-Kamera). */
  kamFest: Basis["kam"] | null;
  /** Mit der Kino-Kamera: höchste sichtbare Stelle zwischen zwei Zeiten. */
  sichtOben: ((von: number, bis: number) => number) | null;
  /** Wohin der Blick im Film geht, während die Pointe kommt (Mitte der Pointe oder des Satzes). */
  fokus: { x: number; y: number } | null;
  /** true, solange ein Bild für die Kino-Kamera gezeichnet wird (Einblendungen kommen danach). */
  kinoBild: boolean;
  /** Mit der Kino-Kamera: wo der Ausschnitt auf der Zeichenfläche beginnt (Bildpunkte). */
  versatz: [number, number];
  /** Deckkraft des Korns, das das Format zuletzt wollte (für die Einblendung über dem Kinobild). */
  kornDeck: number;
  /** Was am Objektiv hängt (der Sucher bei POV): mit der Kino-Kamera über das gefilmte Bild gelegt. */
  ueberlagerung: ((c: Ctx, t: number) => void) | null;
  /** Gestaltung des Plakats (klassik, magazin, farbfeld). */
  layout: Layout;
  /** Wird gesetzt, wenn die Kopfzeile (Etikett, Anlass, Datum) nicht passt. */
  kopfEng: boolean;
  /** Gefüllte orange Pillen auf dem Bild: höchstens eine (pillenFarbe). */
  orangePillen: number;
  /** Wasserlinie, wenn die Gestaltung sie verlegt (sonst über dem Fuß). */
  horizont: number | null;
  /** Freies Band um die Wasserlinie (oben, unten): Dort darf die Hafen-Kamera filmen, ohne Text anzuschneiden. */
  hafenBand: [number, number] | null;
  /** Größe der Stadt am Horizont (1 = wie über dem Fuß) */
  stadtGross: number;
  /** Bild einer Story-Serie: Stelle und Aufgabe (sonst null). */
  serie: { nr: number; von: number; rolle: SerieRolle } | null;
};

/** Kamera: Blickpunkt (Bildkoordinaten) und Zoom (1 = Standbild). */
type Pose = { x: number; y: number; z: number };
/** Station der Kamera: Zur Zeit t steht sie in dieser Lage; kurve formt den Weg dorthin. */
type Station = { t: number; pose: Pose; kurve?: (u: number) => number };
/**
 * Regie eines Films: die Stationen der Kamera in zeitlicher Folge (vor
 * der ersten steht sie schon dort, die letzte ist die Totale), dazu das
 * Federn des ganzen Plakats, wenn etwas Schweres aufsetzt (Weg in
 * Bildpunkten, nach unten positiv).
 */
type Regie = {
  fahrt: Station[];
  feder: { t: number; px: number; weich?: boolean }[];
  /** Wo die Pointe aufsetzt (x im Bild) und wie schwer sie ist (0,35 bis 1) */
  ladung: { x: number; masse: number } | null;
};

/** Farben eines Satzes. */
type SatzFarben = {
  text: string;
  /** Balken hinter der Pointe und die Schrift darauf */
  balken: string;
  pointe: string;
};

// ---------------------------------------------------------------- Hilfen

const klemme = (k: number) => Math.min(1, Math.max(0, k));
/** Kurve wie cubic-bezier(x1, y1, x2, y2): Fortschritt 0 bis 1. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const bei = (a: number, b: number, s: number) =>
    3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  return (u: number): number => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    let [von, bis] = [0, 1];
    for (let i = 0; i < 22; i++) {
      const s = (von + bis) / 2;
      if (bei(x1, x2, s) < u) von = s;
      else bis = s;
    }
    return bei(y1, y2, (von + bis) / 2);
  };
}
/** Schwere Fahrt zum Satz: zögert, zieht an, läuft lang aus. */
const FAHRT_HIN = bezier(0.5, 0, 0.2, 1);
/** Gleiten am Hafen entlang: schon in Fahrt, läuft ruhig aus. */
const GLEITEN = bezier(0.15, 0.5, 0.35, 1);
/** Langsame Anfahrt aus der Totale auf den Satz. */
const ANFAHRT = bezier(0.3, 0, 0.35, 1);
/** Rückfahrt in die Totale. */
const FAHRT_ZURUECK = bezier(0.4, 0, 0.1, 1);
/** Senken der Ladung: volle Fahrt, bremst am Ende. */
const SENKEN = bezier(0.25, 0.25, 0.3, 1);
/** Seile ziehen nach oben weg: erst langsam, dann schnell. */
const EINHOLEN = bezier(0.5, 0, 1, 0.6);
/** „#rrggbb“ als Farbe mit Deckkraft. */
function mitDeck(hex: string, deck: number): string {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return `rgb(${r} ${g} ${b} / ${deck})`;
}

// ---------------------------------------------------------------- Uhr

/**
 * Die Uhr des Films, für alle Reihen und Abläufe gleich:
 *
 * - bis T_NAH steht die Kamera nah (am Requisit oder an der Lücke),
 * - bis T_SATZ fährt sie in die Totale; bei der Anfahrt rückt sie
 *   stattdessen langsam heran und fährt von T_RUECK bis T_STAND zurück,
 * - bei T_SCHLAG ist die Pointe da (abgesetzt, umgeschlagen, freigelegt,
 *   aufgedrückt oder angestrichen),
 * - das Schiff fährt ab T_SCHIFF ein und legt bei T_RUHE an. Danach
 *   steht das Standbild.
 */
const T_NAH = 0.4;
const T_SATZ = 1.7;
const T_SCHLAG = 3.63;
const T_RUECK = 4.3;
const T_STAND = 5.6;
const T_RUHE = 7.4;
/** Auflösung: Der Pfeil wird gezogen, dann steht die Unterzeile da. */
const T_PFEIL = 4.5;
const T_ZUSATZ = 4.87;
/** Das Schiff fährt ein. */
const T_SCHIFF = 1.6;

/**
 * Zeit der Wasserlinie: Sie zieht ruhig und kommt mit dem Anlegen des
 * Schiffs zur Ruhe, in der Lage des Standbilds (dort 0).
 */
function lauf(t: number): number {
  if (!(t < T_RUHE)) return 0;
  const rest = T_RUHE - Math.max(0, t);
  // Die letzte Sekunde läuft sie aus (Weg = halbe Zeit).
  return -(rest > 1 ? rest - 0.5 : (rest * rest) / 2);
}

// ---------------------------------------------------------------- Kamera

/**
 * Stellt die Kamera ein: Das ganze Plakat wird als ein Blatt bewegt
 * (alles Gedruckte gemeinsam, keine Ebenen gegeneinander). Im Standbild
 * ist die Kamera neutral.
 */
function kameraAn(k: Basis) {
  const { ctx, f, kam, skala } = k;
  ctx.setTransform(skala, 0, 0, skala, k.versatz[0], k.versatz[1]);
  ctx.translate(f.b / 2, f.h / 2 + kam.dy);
  ctx.scale(kam.z, kam.z);
  ctx.translate(-kam.x, -kam.y);
}
/** Zeichnet etwas fest auf den Bildschirm (macht die Fahrt nicht mit). */
function schirm(k: Basis, zeichne: () => void) {
  const { ctx } = k;
  ctx.save();
  ctx.setTransform(k.skala, 0, 0, k.skala, 0, 0);
  zeichne();
  ctx.restore();
}

/** Blickpunkt begrenzen: Das Blatt füllt immer das ganze Bild. */
function imBild(k: Basis, pose: Pose): Pose {
  const { f } = k;
  const frei = Math.max(0, 1 - 1 / pose.z);
  return {
    x: Math.min(
      Math.max(pose.x, (f.b / 2) * (1 - frei)),
      (f.b / 2) * (1 + frei),
    ),
    y: Math.min(
      Math.max(pose.y, (f.h / 2) * (1 - frei)),
      (f.h / 2) * (1 + frei),
    ),
    z: pose.z,
  };
}

/**
 * Federn des Plakats, wenn etwas aufsetzt: im Aufsetzbild der volle Weg,
 * dann zurück über die Ruhelage hinaus und aus (alle vier Bilder ein
 * Umkehrpunkt, dazwischen weich).
 */
function federWeg(dt: number): number {
  if (dt < 0 || dt >= 0.4) return 0;
  const weg = [1, -0.3, 0.1, 0];
  const i = Math.min(2, Math.floor(dt / (4 / 30)));
  const u = dt / (4 / 30) - i;
  return weg[i] + (weg[i + 1] - weg[i]) * (0.5 - Math.cos(Math.PI * u) / 2);
}
/**
 * Weiches Nachgeben, wenn etwas sacht abgesetzt wird: Das Plakat sinkt
 * in zwei Bildern ein und kommt ruhig zurück.
 */
function federWeich(dt: number): number {
  if (dt < 0 || dt >= 0.3) return 0;
  return dt < 2 / 30 ? dt / (2 / 30) : (1 - (dt - 2 / 30) / (7 / 30)) ** 2;
}

/** Lage der Kamera zur Zeit t, ohne das Federn. Im Standbild neutral. */
function kameraPose(k: Basis, t: number): Pose {
  const { f, regie } = k;
  const s = regie.fahrt;
  if (!(t < T_RUHE) || !s.length) return { x: f.b / 2, y: f.h / 2, z: 1 };
  if (t <= s[0].t) return s[0].pose;
  for (let i = 1; i < s.length; i++) {
    if (t >= s[i].t) continue;
    const [a, b] = [s[i - 1].pose, s[i].pose];
    const u = (t - s[i - 1].t) / (s[i].t - s[i - 1].t);
    const kurve = s[i].kurve;
    const e = kurve ? kurve(u) : u;
    return {
      x: a.x + (b.x - a.x) * e,
      y: a.y + (b.y - a.y) * e,
      // Zoom im Verhältnis mischen: So wirkt die Fahrt gleichmäßig.
      z: a.z * (b.z / a.z) ** e,
    };
  }
  return s[s.length - 1].pose;
}

/** Wo steht die Kamera zur Zeit t, samt Federn des Plakats? */
function kameraBei(k: Basis, t: number): Basis["kam"] {
  let dy = 0;
  if (t < T_RUHE)
    for (const s of k.regie.feder)
      dy += (s.weich ? federWeich : federWeg)(t - s.t) * s.px;
  return { ...imBild(k, kameraPose(k, t)), dy };
}

// ---------------------------------------------------------------- Kino

/** Rand um das Plakat, der für die Kino-Kamera mitgezeichnet wird (der Grund reicht weiter). */
const KINO_RAND = 240;
const SANFT = bezier(0.45, 0, 0.55, 1);

/**
 * Lage der Kino-Kamera zur Zeit t. Sie folgt der Kamerafahrt der Regie
 * (Ziel und Nähe) und fügt hinzu, was eine echte Kamera ausmacht:
 *
 * - Je näher sie ist, desto schräger blickt sie auf das Plakat, mit
 *   kürzerer Brennweite und geringer Schärfentiefe. Wie schräg und von
 *   wo, hängt vom Kameraweg ab (Rückzug von oben, Lücke von unten, Hafen
 *   flach über dem Wasser, Anfahrt von der Seite).
 * - Während die Pointe kommt, steht sie leicht schräg und etwas näher
 *   an der Pointe und schiebt sich langsam heran.
 * - Setzt etwas Schweres auf, gibt das Bild nach (das Federn der Regie).
 * - Ab T_STAND steht sie gerade vor dem Plakat: Das Bild ist dann genau
 *   das Standbild.
 */
function kinoKamera(k: Basis, t: number): KinoKamera {
  const { f } = k;
  const zweiD = imBild(k, kameraPose(k, t));
  const fokus = k.fokus ?? { x: f.b / 2, y: f.h / 2 };
  // Halt während die Pointe kommt: von kurz vor T_SATZ bis T_RUECK, dann
  // zurück in die Totale bis T_STAND.
  const halt =
    t < T_SATZ - 0.6
      ? 0
      : t < T_SATZ + 0.4
        ? SANFT((t - (T_SATZ - 0.6)) / 1)
        : t < T_RUECK
          ? 1
          : t < T_STAND
            ? 1 - FAHRT_ZURUECK((t - T_RUECK) / (T_STAND - T_RUECK))
            : 0;
  const schub = 1 + 0.06 * klemme((t - T_SATZ) / (T_RUECK - T_SATZ));
  const z = zweiD.z * (1 + (0.16 * schub + 0.0) * halt);
  // Am Hafen blickt sie auf die Stadt selbst (die flache Kamera der Regie
  // blickt knapp darunter, damit kein Satz angeschnitten ins Bild ragt).
  const nahHafen =
    k.film.kamera === "hafen"
      ? klemme(Math.log(Math.max(1, zweiD.z)) / Math.log(2.4))
      : 0;
  const stadtY = hafenLage(k).y0 - 40 * hafenLage(k).mass;
  const vorY = zweiD.y + (stadtY - zweiD.y) * nahHafen;
  const zielX =
    zweiD.x + (f.b / 2 + (fokus.x - f.b / 2) * 0.5 - zweiD.x) * halt;
  const zielY = vorY + (f.h / 2 + (fokus.y - f.h / 2) * 0.55 - vorY) * halt;
  // Wie stark die Kamera „Kamera“ ist: nah am Requisit voll, im Halt
  // ein Teil, in der Totale nichts.
  const nah = klemme(Math.log(Math.max(1, zweiD.z)) / Math.log(2.4));
  const a = Math.max(nah, 0.55 * halt);
  const seite = k.karte.nummer % 2 ? 1 : -1;
  const weg = {
    rueckzug: { nick: -0.46, gier: 0.22 },
    luecke: { nick: 0.4, gier: 0.3 },
    // Am Hafen gleitet die Kamera seitlich an der Stadt entlang. In den
    // breiteren Formaten blickt sie weniger schräg: Sonst käme die
    // Adresse rechts unten angeschnitten ins Bild.
    hafen: { nick: 0.2, gier: f.name === "story" ? 0.5 : 0.34 },
    anfahrt: { nick: 0.26, gier: -0.4 },
  }[k.film.kamera];
  const fov = ((28 + 20 * a) * Math.PI) / 180;
  // Federn der Regie: Das Bild gibt nach, als würde die Kamera mitgehen.
  let dy = 0;
  if (t < T_RUHE)
    for (const s of k.regie.feder)
      dy += (s.weich ? federWeich : federWeg)(t - s.t) * s.px;
  return {
    tx: zielX,
    ty: zielY - dy / z,
    dist: f.h / (2 * z) / Math.tan(fov / 2),
    yaw: (weg.gier * seite + 0.03 * Math.sin(t * 0.7)) * a,
    pitch: weg.nick * a,
    roll: -0.045 * seite * a,
    fov,
    blende: 0.034 * Math.pow(a, 1.15),
    licht: a,
  };
}

/** „#rrggbb“ als Farbe 0 bis 1, abgedunkelt für den Raum um das Plakat. */
function raumFarbe(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [0, 2, 4].map(
    (i) => (parseInt(n.slice(i, i + 2), 16) / 255) * 0.14,
  ) as [number, number, number];
}

/**
 * Höchste Oberkante des Bildes zwischen zwei Zeiten: Was darüber
 * beginnt, ist sicher nicht zu sehen.
 */
function bildObenZwischen(k: Basis, von: number, bis: number): number {
  let oben = Infinity;
  for (let i = 0; i <= 10; i++) {
    const p = imBild(k, kameraPose(k, von + ((bis - von) * i) / 10));
    oben = Math.min(oben, p.y - k.f.h / 2 / p.z);
  }
  // Mit der Kino-Kamera die höhere der beiden Kanten: So kommt die Pointe
  // auch dann von oben, wenn der Film mittendrin flach weiterläuft.
  return Math.min(oben - 16, k.sichtOben ? k.sichtOben(von, bis) : Infinity);
}

/** Größter Zoom für die Nahaufnahme am Requisit. */
const ZOOM_NAH = 3;

/**
 * Nahaufnahme: Das Requisit steht mittig und füllt mit seiner längeren
 * Seite 85 Prozent der entsprechenden Bildseite. Ist satzOben gegeben
 * (Oberkante des Satzes darunter), rückt der Ausschnitt so weit hinauf
 * und so nah heran, dass kein Wort des Satzes angeschnitten ins Bild
 * ragt; geht das nicht, bleibt das Requisit mittig.
 */
function nahAuf(
  k: Basis,
  kasten: { x: number; y: number; b: number; h: number },
  hoechstens = ZOOM_NAH,
  satzOben?: number,
): Pose {
  const { f } = k;
  const z = Math.max(
    1.2,
    Math.min(
      hoechstens,
      kasten.b / f.b > kasten.h / f.h
        ? (0.85 * f.b) / kasten.b
        : (0.85 * f.h) / kasten.h,
    ),
  );
  const [x, y] = [kasten.x + kasten.b / 2, kasten.y + kasten.h / 2];
  if (satzOben !== undefined) {
    const grenze = satzOben - 24;
    const nah = Math.min(Math.max(z, f.h / grenze), 4.2);
    const pose = imBild(k, {
      x,
      y: Math.min(y, grenze - f.h / 2 / nah),
      z: nah,
    });
    const halb = f.h / 2 / nah;
    // Der Satz bleibt draußen, das Requisit ganz im Bild?
    if (
      pose.y + halb <= grenze + 1 &&
      kasten.y >= pose.y - halb + 16 &&
      kasten.y + kasten.h <= pose.y + halb - 16
    )
      return pose;
  }
  return imBild(k, { x, y, z });
}

/**
 * Stellt den Ausschnitt so, dass Etikett und Wortmarke (oder die
 * übergebenen Bänder: Oberkante, Unterkante) ganz im Bild oder ganz
 * draußen stehen: Er rückt bis zu 90 Bildpunkte nach oben oder unten;
 * reicht das nicht, geht die Kamera schrittweise weiter weg, notfalls
 * bis in die Totale.
 */
function sauberStellen(k: Basis, pose: Pose, baender?: number[][]): Pose {
  const { f } = k;
  const teile = baender ?? [
    [f.oben + 6, f.oben + 68],
    [f.unten - 84, f.unten - 14],
  ];
  for (let z = pose.z; z >= 1.05; z -= 0.03) {
    const halb = f.h / 2 / z;
    const rand = 40 / z;
    // „Draußen“ heißt mit Abstand draußen: Federt das Plakat, darf am
    // Bildrand kein Streifen vom Etikett hereinschauen.
    const fern = 18 / z;
    const sauber = (y: number) =>
      teile.every(
        ([oben, unten]) =>
          (oben >= y - halb + rand && unten <= y + halb - rand) ||
          unten <= y - halb - fern ||
          oben >= y + halb + fern,
      );
    for (let d = 0; d <= 90; d += 6)
      for (const versatz of [d, -d]) {
        const y = imBild(k, { ...pose, z, y: pose.y + versatz }).y;
        if (sauber(y)) return imBild(k, { ...pose, z, y });
      }
  }
  // Im gedrungenen Format passt oft beides nicht sauber in einen engeren
  // Ausschnitt: Dann steht die Kamera gleich in der Totale.
  return { x: f.b / 2, y: f.h / 2, z: 1 };
}

/** Buchstabenabstand, wo der Browser ihn auf der Zeichenfläche kennt. */
function sperren(ctx: Ctx, px: number) {
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = `${px}px`;
}

/** „r g b / a“ mit vervielfachter Deckkraft, für Zeichen Ton in Ton. */
function ton(l: StoryLook, faktor: number, hoechstens = 0.9): string {
  const [farbe, deck] = l.ziffer.split("/").map((s) => s.trim());
  return `rgb(${farbe} / ${Math.min(hoechstens, Number(deck) * faktor)})`;
}

/** Helligkeit einer Hex-Farbe (0 dunkel, 1 hell). */
function helligkeit(hex: string): number {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const w = parseInt(n.slice(i, i + 2), 16) / 255;
    return w <= 0.03928 ? w / 12.92 : ((w + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** Schriftfarbe, die auf einer Fläche gut lesbar ist. */
const schriftAuf = (flaeche: string) =>
  helligkeit(flaeche) > 0.36 ? TINTE : "#ffffff";

/** Schrift auf einer Pille: dunkel auf Orange und Gelb, sonst weiß. */
const pillenSchrift = (flaeche: string) =>
  helligkeit(flaeche) > 0.2 ? TINTE : "#ffffff";

/** Kontrast zweier Hex-Farben (1 bis 21). */
function kontrast(a: string, b: string): number {
  const [x, y] = [helligkeit(a), helligkeit(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** Orange für Schrift auf hellem Grund, wo das Orange der Marke zu blass wäre. */
const ORANGE_TIEF = "#c8440f";
/** Die erste Farbe, die auf allen Flächen mindestens so viel Kontrast hat. */
function farbeAuf(
  flaechen: string[],
  wahl: string[],
  mindestens: number,
): string {
  return (
    wahl.find((f) => flaechen.every((g) => kontrast(f, g) >= mindestens)) ??
    wahl[wahl.length - 1]
  );
}

/**
 * Farbe einer gefüllten Pille. Auf einem Bild steht höchstens eine
 * orange Pille: Ist sie schon vergeben, nimmt die nächste den Ersatz.
 * Beim Vorbereiten aufrufen (nicht je Bild), damit gezählt wird.
 */
function pillenFarbe(k: Basis, wunsch: string, ersatz: string): string {
  if (wunsch.toLowerCase() !== ORANGE) return wunsch;
  if (k.orangePillen >= 1) return ersatz;
  k.orangePillen++;
  return wunsch;
}

/**
 * Der eine Akzent der Marke auf dem Grund der Farbwelt: Orange. Nur wo
 * Orange nicht trägt, weicht er aus (Weiß auf Koralle, hell auf Petrol
 * und Backstein).
 */
function marke(l: StoryLook): string {
  if (l.name === "koralle") return "#ffffff";
  return l.name === "petrol" || l.name === "backstein" ? l.akzent : ORANGE;
}

/** Kräftige Farbe der Farbwelt für Balken auf Papier und im Dunkeln. */
function kraeftig(l: StoryLook): string {
  if (l.dunkel || l.name === "koralle")
    return l.name === "nacht" ? ORANGE : l.bg;
  return l.marker === "#ffffff" || helligkeit(l.marker) > 0.6
    ? ORANGE
    : l.marker;
}

/** Weicher Schatten; die Weite folgt dem Maßstab der Zeichenfläche. */
function schatten(k: Basis, weite: number, versatz: number, deck = 0.28) {
  k.ctx.shadowColor = `rgb(0 0 0 / ${deck})`;
  // Begrenzt: Sehr weite Schatten kosten in Nahaufnahmen viel Rechenzeit.
  k.ctx.shadowBlur = Math.min(weite * k.kam.z, 150) * k.skala;
  k.ctx.shadowOffsetY = versatz * k.skala * k.kam.z;
}
function ohneSchatten(ctx: Ctx) {
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

function umbrechen(woerter: Wort[], max: number, abstand: number): Zeile[] {
  const zeilen: Zeile[] = [];
  let z: Zeile = { woerter: [], breite: 0 };
  for (const w of woerter) {
    const neu = z.woerter.length ? z.breite + abstand + w.breite : w.breite;
    if (z.woerter.length && neu > max) {
      zeilen.push(z);
      z = { woerter: [w], breite: w.breite };
    } else {
      z.woerter.push(w);
      z.breite = neu;
    }
  }
  if (z.woerter.length) zeilen.push(z);
  return zeilen;
}

/** Wörter, mit denen eine Zeile nicht enden soll. */
const HAENGT = new Set(
  "der die das den dem des ein eine einen einem einer und oder in im an am auf für mit von zu zum zur bei aus nach vor über unter ihr ihre ihrer ihrem ihren".split(
    " ",
  ),
);

/**
 * Gleich viele Zeilen wie beim einfachen Umbruch, aber möglichst gleich
 * lang (wie text-wrap: balance) und nach Sinn getrennt, wie von Hand
 * gesetzt: kein kurzes Wort allein in einer Zeile (außer der Pointe),
 * kein Satzanfang und kein Artikel am Zeilenende, lieber nach einem
 * Satzzeichen umbrechen.
 */
function ausgewogen(woerter: Wort[], max: number, abstand: number): Zeile[] {
  const n = woerter.length;
  const einfach = umbrechen(woerter, max, abstand);
  const k = einfach.length;
  if (k <= 1) return einfach;
  const breite = (i: number, j: number) => {
    let b = 0;
    for (let x = i; x < j; x++) b += woerter[x].breite + (x > i ? abstand : 0);
    return b;
  };
  const kosten = Array.from({ length: k + 1 }, () =>
    Array<number>(n + 1).fill(Infinity),
  );
  const schnitt = Array.from({ length: k + 1 }, () =>
    Array<number>(n + 1).fill(0),
  );
  kosten[0][0] = 0;
  for (let z = 1; z <= k; z++) {
    for (let j = z; j <= n; j++) {
      for (let i = z - 1; i < j; i++) {
        if (kosten[z - 1][i] === Infinity) continue;
        const b = breite(i, j);
        if (b > max) continue;
        const luft = (max - b) / max;
        let strafe = 0;
        if (j - i === 1 && !woerter[i].betont) {
          if (woerter[i].t.replace(/[^\p{L}]/gu, "").length <= 4) strafe += 0.5;
          else if (b < max * 0.5) strafe += 0.15;
        }
        if (j < n) {
          const ende = woerter[j - 1].t;
          if (/[,.:;!?–]$/.test(ende)) strafe -= 0.08;
          else if (HAENGT.has(ende.toLowerCase())) strafe += 0.14;
          // Das erste Wort eines neuen Satzes hängt am Zeilenende.
          if (j - i > 1 && /[.!?:]$/.test(woerter[j - 2].t)) strafe += 0.3;
          // Ein Wort mit Komma gehört zu dem, was davor steht („Sie mal,“).
          if (/,$/.test(woerter[j].t) && !/[,.:;!?]$/.test(ende)) strafe += 0.2;
          // Die Pointe bleibt möglichst in einer Zeile.
          if (woerter[j - 1].betont && woerter[j].betont) strafe += 0.45;
        }
        const c = kosten[z - 1][i] + luft * luft + strafe;
        if (c < kosten[z][j]) {
          kosten[z][j] = c;
          schnitt[z][j] = i;
        }
      }
    }
  }
  if (kosten[k][n] === Infinity) return einfach;
  const zeilen: Zeile[] = [];
  for (let z = k, j = n; z >= 1; z--) {
    const i = schnitt[z][j];
    zeilen.unshift({ woerter: woerter.slice(i, j), breite: breite(i, j) });
    j = i;
  }
  return zeilen;
}

/** Abgerundetes Rechteck; r = halbe Höhe ergibt eine Pille. */
function rund(ctx: Ctx, x: number, y: number, b: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + b - r, y);
  ctx.arcTo(x + b, y, x + b, y + r, r);
  ctx.lineTo(x + b, y + h - r);
  ctx.arcTo(x + b, y + h, x + b - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * So weit reicht der Farbstreifen über und unter die Grundlinie (Anteil
 * der Schriftgröße). Gemessen an der Kursiven: Oberlängen (b, k, l)
 * reichen bis 0,73, große Umlaute (Ä, Ö, Ü) bis 0,81, Unterlängen (g, p,
 * f) bis 0,28. Rundum bleibt Luft, damit kein Buchstabe an die Kante
 * stößt oder mit seinen Punkten über den Streifen hinausragt.
 */
const STREIFEN_OBEN = 0.8;
const STREIFEN_OBEN_UMLAUT = 0.86;
const STREIFEN_UNTEN = 0.33;
/** Spalt zwischen zwei Streifen untereinander. */
const STREIFEN_SPALT = 0.08;
/**
 * Serie: Der Rahmen um die Pointe des Problems ist nur ein Strich (0,045
 * der Größe, innen an der Kante). Damit Unter- und Oberlängen (g, p, y,
 * f) und Kommas nicht durch ihn schneiden, wird sein Feld oben und unten
 * um Strich und etwas Luft größer als das gefüllte.
 */
const RAHMEN_LUFT = 0.09;

/**
 * Farbstreifen hinter der Pointe: Ober- und Unterkante laufen parallel,
 * die Enden neigen sich wie die Kursive. oben ist seine Höhe über der
 * Grundlinie (Anteil der Schriftgröße); innen rückt den Umriss nach
 * innen (für den Stellplatz). gerade: für eine aufrechte Pointe stehen
 * die Enden senkrecht und gleich weit über.
 */
function streifenPfad(
  ctx: Ctx,
  x0: number,
  x1: number,
  grundlinie: number,
  px: number,
  hoch: number,
  innen = 0,
  tief = STREIFEN_UNTEN,
  gerade = false,
  /** Überstand der geraden Enden (Anteil der Schriftgröße) */
  rand = 0.07,
) {
  const oben = grundlinie - px * hoch + innen;
  const unten = grundlinie + px * tief - innen;
  const schub = gerade ? 0 : px * 0.045;
  const [vorn, hinten] = gerade
    ? [px * rand, px * rand]
    : [px * 0.13, px * 0.1];
  ctx.beginPath();
  ctx.moveTo(x0 - vorn + schub + innen, oben);
  ctx.lineTo(x1 + hinten + schub - innen, oben);
  ctx.lineTo(x1 + hinten - schub - innen, unten);
  ctx.lineTo(x0 - vorn - schub + innen, unten);
  ctx.closePath();
}

// Feines Korn über dem ganzen Bild: nimmt den Flächen das Glatte. Es
// steht still wie Papierfaser, auch im Film.
let kornMuster: HTMLCanvasElement | null = null;
function korn(k: Basis, deck: number) {
  // Mit der Kino-Kamera kommt das Korn erst über das gefilmte Bild (wie
  // Filmkorn); hier nur merken, wie stark.
  k.kornDeck = deck;
  if (k.kinoBild) return;
  const { ctx, f } = k;
  if (!kornMuster) {
    kornMuster = document.createElement("canvas");
    kornMuster.width = kornMuster.height = 192;
    const c = kornMuster.getContext("2d");
    if (c) {
      const bild = c.createImageData(192, 192);
      for (let i = 0; i < bild.data.length; i += 4) {
        const g = Math.floor(Math.random() * 256);
        bild.data[i] = bild.data[i + 1] = bild.data[i + 2] = g;
        bild.data[i + 3] = 255;
      }
      c.putImageData(bild, 0, 0);
    }
  }
  schirm(k, () => {
    const muster = kornMuster && ctx.createPattern(kornMuster, "repeat");
    if (!muster) return;
    ctx.globalAlpha = deck;
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = muster;
    ctx.fillRect(0, 0, f.b, f.h);
  });
}

// ---------------------------------------------------------------- Text

/** Der Block der Pointe am Satzende steht leicht schräg (zwei Grad). */
const BLOCK_SCHRAEG = (-2 * Math.PI) / 180;
/** So weit staucht sich ein Streifen im Aufsetzbild (Anteil seiner Höhe). */
const STAUCHUNG = 0.06;

/**
 * Nimmt einen schmalen Streifen um die Strecke von a nach b von allem
 * aus, was danach gezeichnet wird (bis zum nächsten restore).
 */
function aussparen(
  ctx: Ctx,
  a: [number, number],
  b: [number, number],
  halb: number,
) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy);
  if (l < 0.01) return;
  const [ex, ey] = [dx / l, dy / l];
  const [nx, ny] = [-ey * halb, ex * halb];
  // An den Enden etwas länger, damit zwischen zwei Strecken nichts bleibt.
  const [a0, a1] = [a[0] - ex * 2, a[1] - ey * 2];
  const [b0, b1] = [b[0] + ex * 2, b[1] + ey * 2];
  ctx.beginPath();
  ctx.rect(-20000, -20000, 40000, 40000);
  ctx.moveTo(a0 + nx, a1 + ny);
  ctx.lineTo(b0 + nx, b1 + ny);
  ctx.lineTo(b0 - nx, b1 - ny);
  ctx.lineTo(a0 - nx, a1 - ny);
  ctx.closePath();
  ctx.clip("evenodd");
}

/** Ein Farbstreifen der Pointe mit den Wörtern darauf (Lage relativ zur linken oberen Ecke des Satzes). */
type Streifen = {
  x0: number;
  x1: number;
  grundlinie: number;
  /** Höhe über und Tiefe unter der Grundlinie (Anteile der Schriftgröße) */
  oben: number;
  unten: number;
  px: number;
  woerter: { t: string; x: number }[];
};

/**
 * Wie ein Satz gesetzt wird, damit jede Gestaltung ihre eigene Typografie
 * hat: Schrift, Achse, Zeilenabstand, Größen und die Art der Pointe.
 */
type SatzStil = {
  /** Grundschrift in der Größe g */
  schrift: (g: number) => string;
  /** Buchstabenabstand der Grundschrift (Anteil der Größe) */
  sperrung: number;
  /** Zeilenabstand und Wortabstand (Anteile der Größe) */
  zeile: number;
  wort: number;
  /** Grundlinie unter der Oberkante der Zeile, Höhe der Versalien (Anteile der Größe) */
  ober: number;
  kapp: number;
  /** linksbündig oder auf der Mittelachse */
  achse: "links" | "mitte";
  /** größte und kleinste Grundschrift */
  maxG: number;
  minG: number;
  /**
   * Die Pointe steht kursiv: auf dem Farbstreifen (balken), mit einem
   * kräftigen Strich darunter (linie) oder nur in der Akzentfarbe (farbe).
   */
  pointe: "balken" | "linie" | "farbe";
  /** Größe der Pointe im Satz (Anteil der Grundschrift) */
  fluss: number;
  /** Block am Satzende: höchstens, mindestens (Anteile) und absolut höchstens */
  block: number;
  blockMin: number;
  blockMax: number;
  /** Neigung des Blocks am Satzende (Bogenmaß) */
  schraeg: number;
  /**
   * Schrift der Pointe in der Größe p und ihr Buchstabenabstand (Anteil);
   * ohne Angabe die kursive Cormorant. gerade: Die Pointe steht aufrecht
   * (Stellplatz und Streifen ohne Neigung).
   */
  pointeSchrift?: (p: number) => string;
  pointeSperrung?: number;
  gerade?: boolean;
  /**
   * Ein kurzes Wort (bis vier Buchstaben) allein in einer Zeile gilt als
   * Makel: Dann ist eine etwas kleinere Schrift ohne ihn die bessere Wahl
   * (für große Schrift mit wenigen Wörtern je Zeile).
   */
  kurzAllein?: boolean;
  /**
   * Der Farbstreifen der Pointe steht nur als Rahmen da (nur mit pointe
   * „balken“). In einer Story-Serie ist das die Pointe des Problems: ein
   * leeres Feld, das die Lösung im nächsten Bild füllt.
   */
  rahmen?: boolean;
  /**
   * Zusätzliche Luft über einer Zeile, wo der enge Zeilenabstand sonst
   * zwei Zeilen zusammenstoßen lässt (Anteile der Größe; für die Bilder
   * einer Story-Serie):
   * - tief: Über einem großen A, O oder U steht in der Zeile darüber ein
   *   „ – es läse sich wie ein Umlaut („Änfrage“).
   * - umlaut: In der Zeile steht ein großer Umlaut, seine Punkte stießen
   *   an die Zeile darüber (Versalsatz).
   * - komma: Über der Zeile hängt ein Komma in ihre Buchstaben (Versalsatz).
   */
  luft?: { tief: number; umlaut?: number; komma?: number };
};

/** Ein gesetzter Satz: Maße, die Lage der Pointe und die Zeichenfunktion. */
type Gesetzt = {
  hoehe: number;
  /** Größe der Grundschrift */
  g: number;
  /** Breite der längsten Zeile und wo sie beginnt (auf der Mittelachse eingerückt) */
  b: number;
  links: number;
  /** Kasten um alle Streifen der Pointe (relativ zur linken oberen Ecke) */
  pointe: { x: number; y: number; b: number; h: number };
  /** Gewicht der Pointe (0,35 bis 1): Ein Wort ist leicht, zwei Zeilen sind schwer. */
  masse: number;
  /** Jede Zeile: Grundlinie, linker und rechter Rand der Schrift (für Linien und Striche) */
  linien: { grundlinie: number; x0: number; x1: number; g: number }[];
  zeichne: (x: number, y: number, t: number, farben: SatzFarben) => void;
};

/**
 * Setzt den Satz der Karte so groß wie möglich in ein Feld der Breite
 * breite und der Höhe platz. Die Pointe steht kursiv auf einem
 * Farbstreifen: am Satzende als eigener, großer Block, mitten im Satz in
 * der Zeile.
 *
 * Im Film steht der Satz vom ersten Bild an gedruckt da; nur die Pointe
 * fehlt. Ihr Platz ist markiert (gestrichelter Umriss, wie ein Stellplatz
 * am Kai). Dann wird sie als Ladung an zwei Seilen abgesetzt: Der
 * Streifen kommt von oben, pendelt aus, hält kurz über der Lücke und
 * setzt bei T_SCHLAG auf; im selben Bild steht das Wort darauf. Wie
 * lange das dauert und wie stark es pendelt, folgt aus dem Gewicht der
 * Pointe, nicht aus dem Zufall.
 */
/** Der Satz der klassischen Reihen: fette Grotesk, Pointe auf dem Streifen. */
const KLASSIK_SATZ: SatzStil = {
  schrift: (g) => `800 ${g}px ${GROTESK}`,
  sperrung: -0.032,
  zeile: 1.06,
  wort: 0.23,
  ober: 0.86,
  kapp: 0.76,
  achse: "links",
  maxG: 132,
  minG: 52,
  pointe: "balken",
  fluss: 1.25,
  block: 2.1,
  blockMin: 1.2,
  blockMax: 290,
  schraeg: BLOCK_SCHRAEG,
};

/**
 * Satz in der aufrechten Cormorant (500), wie auf einem Titelblatt: Die
 * Pointe steht kursiv (600) in der Akzentfarbe, ohne Streifen, gerade.
 * Ober- und Versalhöhe werden an der Schrift gemessen.
 */
function serifSatz(k: Basis, stil: Partial<SatzStil> = {}): SatzStil {
  const { ctx, serif } = k;
  ctx.font = `500 100px ${serif}`;
  const hoch = ctx.measureText("ÄÖÜHdlkf").actualBoundingBoxAscent / 100;
  const kapp = ctx.measureText("H").actualBoundingBoxAscent / 100;
  return {
    schrift: (g) => `500 ${g}px ${serif}`,
    sperrung: -0.012,
    zeile: 1.02,
    wort: 0.25,
    ober: Math.min(0.95, Math.max(0.7, hoch + 0.02)),
    kapp: Math.min(0.8, Math.max(0.55, kapp)),
    achse: "mitte",
    maxG: 150,
    minG: 56,
    pointe: "farbe",
    fluss: 1.06,
    block: 1.22,
    blockMin: 1,
    blockMax: 210,
    schraeg: 0,
    ...stil,
  };
}

/** Steht in einer gedruckten Zeile nur ein kurzes Wort (bis vier Buchstaben)? */
const kurzAllein = (zeilen: { woerter: { t: string }[] }[]) =>
  zeilen.some(
    (z) =>
      z.woerter.length === 1 &&
      z.woerter[0].t.replace(/[^\p{L}]/gu, "").length <= 4,
  );

function setzeSatz(
  k: Basis,
  plan: SatzPlan,
  breite: number,
  platz: number,
  stilWahl: Partial<SatzStil> = {},
): Gesetzt {
  const { ctx, serif } = k;
  const stil: SatzStil = { ...KLASSIK_SATZ, ...stilWahl };
  const grund = stil.schrift;
  const kursiv =
    stil.pointeSchrift ?? ((p: number) => `italic 600 ${p}px ${serif}`);
  const pSperrung = stil.pointeSperrung ?? KURSIV_SPERRUNG;
  const gerade = !!stil.gerade;
  const mitte = stil.achse === "mitte";
  const balken = stil.pointe === "balken";
  // Ein gefülltes oder gerahmtes Feld um eine aufrechte Pointe (Serie)
  // braucht an den Seiten mehr Luft als ihr gestrichelter Stellplatz.
  const geradeRand = balken && gerade ? 0.12 : 0.07;
  const messen = (
    woerter: { t: string; betont: boolean }[],
    g: number,
    p: number,
  ): Wort[] =>
    woerter.map((w) => {
      ctx.font = w.betont ? kursiv(p) : grund(g);
      sperren(ctx, w.betont ? p * pSperrung : g * stil.sperrung);
      return { ...w, breite: ctx.measureText(w.t).width };
    });

  type Versuch = {
    hoehe: number;
    /** gedruckte Zeilen: Grundlinie und die Wörter ohne die Pointe */
    zeilen: { grundlinie: number; woerter: { t: string; x: number }[] }[];
    streifen: Streifen[];
    linien: Gesetzt["linien"];
    /** Block am Satzende: Höhe seiner Mitte (er steht leicht schräg) */
    block: number | null;
    p: number;
    b: number;
    einsam: boolean;
  };

  const versuche = (g: number): Versuch | null => {
    const zeilenHoehe = g * stil.zeile;
    const abstand = g * stil.wort;
    // Steht in der Pointe ein großer Umlaut, sind alle ihre Streifen
    // etwas höher: Seine Punkte bleiben auf der Farbe.
    const pointeText =
      plan.art === "fluss"
        ? plan.gruppen
            .flat()
            .filter((w) => w.betont)
            .map((w) => w.t)
            .join(" ")
        : plan.pointe.join(" ");
    // Ohne Streifen reicht der Raum der kursiven Buchstaben selbst. Das
    // Feld um eine aufrechte Pointe (fette Grotesk) folgt ihren Maßen:
    // Punkte großer Umlaute reichen bis 0,96, Versalien haben keine
    // Unterlängen.
    const umlaut = /[ÄÖÜ]/.test(pointeText);
    const versal = pointeText === pointeText.toLocaleUpperCase("de-DE");
    // Serie (stil.luft): Ein Komma oder Semikolon in der Pointe hängt
    // auch im Versalsatz unter die Grundlinie, das Feld reicht dann so
    // tief wie bei Kleinbuchstaben.
    const kommaTief = !!stil.luft && /[,;]/.test(pointeText);
    const rahmenLuft = balken && stil.rahmen ? RAHMEN_LUFT : 0;
    const oben =
      (!balken
        ? 0.78
        : gerade
          ? umlaut
            ? 1
            : 0.86
          : umlaut
            ? STREIFEN_OBEN_UMLAUT
            : STREIFEN_OBEN) + rahmenLuft;
    const unten =
      (!balken
        ? 0.3
        : gerade
          ? versal && !kommaTief
            ? 0.14
            : 0.3
          : STREIFEN_UNTEN) + rahmenLuft;
    const spalt = balken ? STREIFEN_SPALT : -0.02;
    const zeilen: Versuch["zeilen"] = [];
    const streifen: Streifen[] = [];
    const linien: Versuch["linien"] = [];
    let hoehe = 0;
    let pGross = g * stil.fluss;
    let weite = 0;
    let einsam = false;
    let block: number | null = null;
    /** Zeichen der vorigen Zeile, die unter die Grundlinie reichen (für stil.luft). */
    let tiefDavor: { von: number; bis: number; komma: boolean }[] | null = null;
    /**
     * Luft über der eben gesetzten Zeile (stil.luft), damit sie nicht mit
     * der Zeile darüber zusammenstößt; 0, wo der Stil keine verlangt.
     * gedruckt und pointe: die Wörter der Zeile an ihrem endgültigen Ort.
     */
    const zeilenLuft = (
      gedruckt: { t: string; x: number }[],
      pointe: Streifen[],
      p: number,
    ): number => {
      const wahl = stil.luft;
      if (!wahl) return 0;
      const woerter = [
        ...gedruckt.map((w) => ({ ...w, betont: false })),
        ...pointe.flatMap((s) =>
          s.woerter.map((w) => ({ ...w, betont: true })),
        ),
      ];
      /** Wo in der Zeile die Zeichen des Musters stehen (alle: ganze Wörter). */
      const stellen = (muster: RegExp | null) => {
        const orte: { von: number; bis: number; zeichen: string }[] = [];
        for (const w of woerter) {
          ctx.font = w.betont ? kursiv(p) : grund(g);
          sperren(ctx, w.betont ? p * pSperrung : g * stil.sperrung);
          const bis = (n: number) => ctx.measureText(w.t.slice(0, n)).width;
          if (!muster)
            orte.push({ von: w.x, bis: w.x + bis(w.t.length), zeichen: w.t });
          else
            [...w.t].forEach((zeichen, i) => {
              if (muster.test(zeichen))
                orte.push({
                  von: w.x + bis(i),
                  bis: w.x + bis(i + 1),
                  zeichen,
                });
            });
        }
        sperren(ctx, 0);
        return orte;
      };
      const unter = (
        orte: { von: number; bis: number }[],
        komma: boolean,
        spiel: number,
      ) =>
        !!tiefDavor?.some(
          (t) =>
            t.komma === komma &&
            orte.some((o) => o.von < t.bis - spiel && t.von < o.bis - spiel),
        );
      let luft = 0;
      if (tiefDavor) {
        // Punkte großer Umlaute: nur ohne Farbstreifen (der hat eigene Luft).
        if (
          wahl.umlaut &&
          woerter.some((w) => !(balken && w.betont) && /[ÄÖÜ]/.test(w.t))
        )
          luft = g * wahl.umlaut;
        if (wahl.komma && unter(stellen(null), true, 0))
          luft = Math.max(luft, g * wahl.komma);
        if (unter(stellen(/[AOUÄÖÜ]/), false, g * 0.04))
          luft = Math.max(luft, g * wahl.tief);
      }
      tiefDavor = stellen(/[„‚,;]/).map((o) => ({
        von: o.von,
        bis: o.bis,
        komma: o.zeichen === "," || o.zeichen === ";",
      }));
      return luft;
    };
    /** Auf der Mittelachse: eine Zeile um ihre halbe freie Breite einrücken. */
    const einruecken = (
      breiteZeile: number,
      gedruckt: { x: number }[],
      ab: number,
    ) => {
      if (!mitte) return 0;
      const d = Math.max(0, (breite - breiteZeile) / 2);
      for (const w of gedruckt) w.x += d;
      for (const s of streifen.slice(ab)) {
        s.x0 += d;
        s.x1 += d;
        for (const w of s.woerter) w.x += d;
      }
      return d;
    };

    if (plan.art === "fluss") {
      const p = Math.round(g * stil.fluss);
      let letzte: Zeile[] = [];
      let geteilt = false;
      let kurz = false;
      for (const gruppe of plan.gruppen) {
        const woerter = messen(gruppe, g, p);
        if (Math.max(...woerter.map((w) => w.breite)) > breite - p * 0.2)
          return null;
        letzte = ausgewogen(woerter, breite - p * 0.15, abstand);
        if (kurzAllein(letzte.filter((z) => !z.woerter[0].betont))) kurz = true;
        // Läuft die Pointe über zwei Zeilen, ist eine kleinere Schrift,
        // in der sie zusammenbleibt, die bessere Wahl.
        letzte.forEach((z, i) => {
          const naechste = letzte[i + 1];
          if (z.woerter.at(-1)?.betont && naechste?.woerter[0].betont)
            geteilt = true;
        });
        for (const z of letzte) {
          // Eine Zeile mit Farbstreifen bekommt Luft nach oben und unten,
          // damit der Streifen keine Nachbarzeile berührt.
          const mitStreifen = balken && z.woerter.some((w) => w.betont);
          // Der Streifen ragt über die Zeile hinaus (die Pointe ist
          // größer gesetzt): entsprechend mehr Luft zur Zeile darüber.
          const davor =
            mitStreifen && zeilen.length ? p * oben - g * stil.kapp : 0;
          let grundlinie = hoehe + davor + g * stil.ober;
          const gedruckt: { t: string; x: number }[] = [];
          const ab = streifen.length;
          let x = 0;
          let offen: Streifen | null = null;
          // Betonte Wörter, die nebeneinander stehen, teilen sich einen Streifen.
          for (const w of z.woerter) {
            if (!w.betont) {
              offen = null;
              gedruckt.push({ t: w.t, x });
            } else {
              if (!offen) {
                // Vor dem Streifen etwas mehr Abstand: Sein linker Rand
                // steht über, und die Kursive neigt sich nach rechts.
                // So sitzt er gleich weit von beiden Nachbarn.
                if (x > 0 && balken) x += g * 0.06;
                // Am Zeilenanfang steht das Feld einer aufrechten Pointe
                // bündig mit dem Satzspiegel.
                else if (balken && gerade) x += p * geradeRand;
                offen = {
                  x0: x,
                  x1: x,
                  grundlinie,
                  oben,
                  unten,
                  px: p,
                  woerter: [],
                };
                streifen.push(offen);
              }
              offen.x1 = x + w.breite;
              offen.woerter.push({ t: w.t, x });
            }
            x += w.breite + abstand;
          }
          const d = einruecken(x - abstand, gedruckt, ab);
          const luft = zeilenLuft(gedruckt, streifen.slice(ab), p);
          if (luft) {
            grundlinie += luft;
            for (const s of streifen.slice(ab)) s.grundlinie += luft;
          }
          zeilen.push({ grundlinie, woerter: gedruckt });
          linien.push({ grundlinie, x0: d, x1: d + x - abstand, g });
          weite = Math.max(weite, x - abstand);
          hoehe += zeilenHoehe + davor + luft + (mitStreifen ? g * 0.17 : 0);
        }
      }
      const ende = letzte[letzte.length - 1];
      einsam =
        geteilt ||
        (letzte.length > 1 &&
          ende.woerter.length === 1 &&
          !ende.woerter[0].betont &&
          ende.breite < breite * 0.4) ||
        (!!stil.kurzAllein && zeilen.length > 1 && kurz);
    } else {
      for (const gruppe of plan.vor) {
        const woerter = messen(
          gruppe.map((w) => ({ t: w, betont: false })),
          g,
          g,
        );
        if (Math.max(...woerter.map((w) => w.breite)) > breite) return null;
        for (const z of ausgewogen(woerter, breite, abstand)) {
          let x = 0;
          const gedruckt = z.woerter.map((w) => {
            const lage = { t: w.t, x };
            x += w.breite + abstand;
            return lage;
          });
          const d = einruecken(z.breite, gedruckt, streifen.length);
          const luft = zeilenLuft(gedruckt, [], g);
          const grundlinie = hoehe + luft + g * stil.ober;
          zeilen.push({ grundlinie, woerter: gedruckt });
          linien.push({ grundlinie, x0: d, x1: d + z.breite, g });
          weite = Math.max(weite, z.breite);
          hoehe += zeilenHoehe + luft;
        }
      }
      if (stil.kurzAllein && kurzAllein(zeilen)) einsam = true;
      // Pointe: so groß, dass ihre längste Zeile die Breite füllt und
      // der Block noch in die Höhe passt.
      ctx.font = kursiv(100);
      sperren(ctx, 100 * pSperrung);
      // Ohne Streifen bleibt die Pointe in einer Zeile, wenn sie dort
      // fast so groß wird wie über zwei (der Plan teilt sie für den
      // großen Streifen).
      let pZeilen = plan.pointe;
      if (!balken && pZeilen.length > 1) {
        const eins = pZeilen.join(" ");
        const w = ctx.measureText(eins).width / 100;
        if ((breite - 10) / (w + 0.04) >= g * stil.block * 0.9)
          pZeilen = [eins];
      }
      const weiteste = Math.max(
        ...pZeilen.map((z) => ctx.measureText(z).width / 100),
      );
      const p = Math.floor(
        Math.min(
          g * stil.block,
          stil.blockMax,
          (breite - 10) / (weiteste + (balken ? 0.24 : 0.04)),
          (platz - hoehe) / (pZeilen.length * (oben + unten + spalt) + 0.26),
        ),
      );
      if (p < g * stil.blockMin) return null;
      pGross = p;
      ctx.font = kursiv(p);
      sperren(ctx, p * pSperrung);
      // Zeilenabstand der Pointe: Zwischen zwei Streifen bleibt ein
      // gleichmäßiger Spalt; zum Satz darüber etwas Luft.
      const pZeile = p * (oben + unten + spalt);
      const luft = plan.vor.length ? p * (balken ? 0.16 : 0.08) : 0;
      pZeilen.forEach((z, i) => {
        const b = ctx.measureText(z).width;
        // Linksbündig steht der Streifen um seinen Überstand eingerückt,
        // auf der Mittelachse mittig.
        const x0 = mitte ? (breite - b) / 2 : balken ? p * 0.12 : 0;
        const grundlinie = hoehe + luft + i * pZeile + p * (oben + 0.06);
        streifen.push({
          x0,
          x1: x0 + b,
          grundlinie,
          oben,
          unten,
          px: p,
          woerter: [{ t: z, x: x0 }],
        });
        linien.push({ grundlinie, x0, x1: x0 + b, g: p });
        weite = Math.max(weite, b + (balken ? p * 0.23 : 0));
      });
      // Der Block steht leicht schräg, wie von Hand aufgeklebt.
      block = hoehe + luft + (pZeilen.length * pZeile) / 2;
      hoehe += luft + pZeilen.length * pZeile + p * 0.06;
    }
    return {
      hoehe,
      zeilen,
      streifen,
      linien,
      block,
      p: pGross,
      b: weite,
      einsam,
    };
  };

  // Größe wählen: groß ist gut, eine deutlich größere Pointe ist besser,
  // ein kurzes Wort allein in der letzten Zeile oder eine über zwei
  // Zeilen geteilte Pointe ist schlecht.
  let g = stil.minG + 4;
  let beste: Versuch | null = null;
  let guete = -1;
  for (let versuch = stil.maxG; versuch >= stil.minG; versuch -= 4) {
    const s = versuche(versuch);
    if (!s || s.hoehe > platz) continue;
    const wert =
      versuch +
      Math.min(s.p, versuch * Math.min(2, stil.block)) -
      (s.einsam ? 40 : 0);
    if (wert > guete) {
      guete = wert;
      g = versuch;
      beste = s;
    }
    if (plan.art === "fluss" && (!s.einsam || versuch < g * 0.86)) break;
  }
  if (!beste) k.eng.wert = true;
  k.eng.klein = Math.min(k.eng.klein, g);
  const satz: Versuch = beste ??
    versuche(stil.minG) ?? {
      hoehe: 0,
      zeilen: [],
      streifen: [],
      linien: [],
      block: null,
      p: stil.minG,
      b: breite,
      einsam: false,
    };
  sperren(ctx, 0);
  const { zeilen, streifen, block } = satz;
  const schraeg = stil.schraeg;

  // Kasten um alle Streifen und ihr Gewicht.
  const kanten = streifen.map((s) => ({
    l: s.x0 - s.px * 0.13,
    r: s.x1 + s.px * 0.1,
    o: s.grundlinie - s.px * s.oben,
    u: s.grundlinie + s.px * s.unten,
  }));
  const pointe = kanten.length
    ? {
        x: Math.min(...kanten.map((e) => e.l)),
        y: Math.min(...kanten.map((e) => e.o)),
        b:
          Math.max(...kanten.map((e) => e.r)) -
          Math.min(...kanten.map((e) => e.l)),
        h:
          Math.max(...kanten.map((e) => e.u)) -
          Math.min(...kanten.map((e) => e.o)),
      }
    : {
        x: mitte ? (breite - (satz.b || breite)) / 2 : 0,
        y: 0,
        b: satz.b || breite,
        h: satz.hoehe,
      };
  const flaeche = kanten.reduce((a, e) => a + (e.r - e.l) * (e.u - e.o), 0);
  const masse = kanten.length
    ? Math.min(1, Math.max(0.35, flaeche / (1080 * 110)))
    : 0;

  // Ablauf des Absetzens: Aufsetzen bei T_SCHLAG, alles davor rückt je
  // nach Gewicht vor (schwere Ladung senkt sich länger und hält länger).
  const tFall = T_SCHLAG - 2 / 30;
  const tHalt = tFall - Math.round(3 + 4 * masse) / 30;
  const tSenk = tHalt - (0.7 + 0.4 * masse);
  const ausschlag = ((4.75 - 2.5 * masse) * Math.PI) / 180;
  const daempfung =
    Math.log(ausschlag / ((0.5 * Math.PI) / 180)) / (tHalt - tSenk);
  /** Im Aufsetzbild und den zwei Bildern danach ist der Streifen gestaucht. */
  const gestaucht = (t: number) => t >= T_SCHLAG && t - T_SCHLAG < 0.1;

  // Oberkante des Bildes, während die Pointe kommt (die Regie steht erst
  // nach dem Setzen fest, deshalb beim ersten Bild gerechnet).
  let obenRand: number | null = null;
  const bildOben = () =>
    (obenRand ??= bildObenZwischen(k, tHalt - 1.2, T_SCHLAG + 0.45));

  type Punkt = [number, number];
  /**
   * Die Ladung am Seil zur Zeit t: alle Streifen als starres Paket an
   * zwei Seilen, die sich am Knoten treffen; von dort führt ein Seil
   * nach oben aus dem Bild. Liefert Höhe und Pendel des Pakets
   * und die Seile als Linienzüge (in den Koordinaten des Satzes).
   */
  const ladungBei = (x: number, y: number, t: number) => {
    const drehe = (px: number, py: number): Punkt => {
      if (block === null) return [px, py];
      const [c, s] = [Math.cos(schraeg), Math.sin(schraeg)];
      const [dx, dy] = [px - x, py - (y + block)];
      return [x + dx * c - dy * s, y + block + dx * s + dy * c];
    };
    const oben = streifen[0];
    const kante = y + oben.grundlinie - oben.px * oben.oben;
    const [links, rechts] = [
      x + oben.x0 - oben.px * 0.13,
      x + oben.x1 + oben.px * 0.1,
    ];
    const seilAn = [0.14, 0.86].map((a) =>
      drehe(links + (rechts - links) * a, kante),
    );
    const [hx, hy] = drehe((links + rechts) / 2, kante);
    // Liegt der Satz auf einem schiefen Zettel, hängt das Seil trotzdem
    // lotrecht: „oben“ wird gegen die Drehung des Zettels gerechnet.
    const lage = ctx.getTransform();
    const schief = Math.atan2(lage.b, lage.a);
    const lot = { x: Math.sin(schief), y: Math.cos(schief) };
    const start = bildOben() - 30 - (y + pointe.y + pointe.h);
    // Die Ladung senkt sich in einem Zug, wird dabei immer langsamer und
    // setzt sacht auf.
    const hoehe =
      t < T_SCHLAG ? start * (1 - SENKEN((t - tSenk) / (T_SCHLAG - tSenk))) : 0;
    // Sie pendelt an ihrem langen Seil (der Drehpunkt liegt weit über
    // dem Bild): erst deutlich, dann gedämpft, vor dem Aufsetzen ruhig.
    const pendel =
      t < T_SCHLAG - 0.3
        ? ausschlag *
          Math.exp(-daempfung * (t - tSenk)) *
          Math.cos(((t - tSenk) / 0.9) * Math.PI * 2) *
          (1 - klemme((t - (T_SCHLAG - 0.55)) / 0.25))
        : 0;
    // Nach dem Aufsetzen hängen die Seile schlaff und werden eingeholt.
    const schlaff = t >= T_SCHLAG ? 8 : 0;
    const hub =
      t < T_SCHLAG + 0.12
        ? 0
        : EINHOLEN((t - T_SCHLAG - 0.12) / 0.3) * (hy - 150 - bildOben() + 260);
    // Knoten der beiden Seile: 150 Bildpunkte über der Mitte der Oberkante.
    const [ax, ay] = [hx - lot.x * 150, hy - lot.y * 150];
    // Drehpunkt des Pendels: 500 Bildpunkte über dem Bildrand.
    const weit = ay - (bildOben() - 500);
    const drehpunkt: Punkt = [ax - lot.x * weit, ay - lot.y * weit];
    /** Ein Punkt des Pakets (in seiner Ruhelage) dort, wo er gerade hängt. */
    const [c, s] = [Math.cos(pendel), Math.sin(pendel)];
    const haengt = (px: number, py: number): Punkt => {
      const [dx, dy] = [
        px + lot.x * hoehe - drehpunkt[0],
        py + lot.y * hoehe - drehpunkt[1],
      ];
      return [drehpunkt[0] + dx * c - dy * s, drehpunkt[1] + dx * s + dy * c];
    };
    const heben = (px: number, py: number): Punkt => [
      px - lot.x * hub,
      py - lot.y * hub,
    ];
    const knoten = haengt(...heben(ax, ay));
    const seile: Punkt[][] = [
      [knoten, drehpunkt],
      ...seilAn.map(([sx, sy], i) => {
        // Straff eine Gerade, schlaff ein flacher Bogen.
        const n = schlaff ? 8 : 1;
        const [mx, my] = [
          (sx + ax) / 2 + (i ? schlaff : -schlaff),
          (sy + ay) / 2,
        ];
        return Array.from({ length: n + 1 }, (_, j) => {
          const u = j / n;
          const [p, q, r] = [(1 - u) ** 2, 2 * (1 - u) * u, u * u];
          return haengt(
            ...heben(p * sx + q * mx + r * ax, p * sy + q * my + r * ay),
          );
        });
      }),
    ];
    return { hoehe, pendel, drehpunkt, lot, knoten, seile };
  };

  return {
    hoehe: satz.hoehe,
    g,
    b: satz.b || breite,
    links: mitte ? Math.max(0, (breite - (satz.b || breite)) / 2) : 0,
    pointe,
    masse,
    linien: satz.linien,
    zeichne: (x, y, t, farben) => {
      const art = k.film.auftritt;
      const last =
        art === "kran" && streifen.length && t > tSenk && t < T_SCHLAG + 0.45
          ? ladungBei(x, y, t)
          : null;

      // Gedrucktes steht vom ersten Bild an. Hängt ein Seil davor, bleibt
      // um das Seil ein schmaler Spalt frei: So liest man es vor der
      // Schrift, auch wenn beide dieselbe Farbe haben.
      ctx.save();
      if (last)
        for (const seil of last.seile)
          for (let i = 1; i < seil.length; i++)
            aussparen(ctx, seil[i - 1], seil[i], 6.5);
      ctx.font = grund(g);
      sperren(ctx, g * stil.sperrung);
      ctx.fillStyle = farben.text;
      for (const z of zeilen)
        for (const w of z.woerter) ctx.fillText(w.t, x + w.x, y + z.grundlinie);
      ctx.restore();
      sperren(ctx, 0);
      if (!streifen.length) return;

      /** Zeichnet im leicht schrägen Block (falls die Pointe einer ist). */
      const imBlock = (zeichne: () => void) => {
        if (block === null || !schraeg) return zeichne();
        ctx.save();
        ctx.translate(x, y + block);
        ctx.rotate(schraeg);
        ctx.translate(-x, -(y + block));
        zeichne();
        ctx.restore();
      };
      /** Das Wort eines Streifens. */
      const wortMalen = (s: Streifen, farbe: string) => {
        ctx.font = kursiv(s.px);
        sperren(ctx, s.px * pSperrung);
        ctx.fillStyle = farbe;
        for (const w of s.woerter) ctx.fillText(w.t, x + w.x, y + s.grundlinie);
        sperren(ctx, 0);
      };
      /**
       * Ein Streifen, mit oder ohne sein Wort. Ohne Farbstreifen ist es
       * der Strich unter dem Wort oder nur das Wort selbst (es wirft
       * dann seinen Schatten, solange es schwebt).
       */
      const streifenMalen = (s: Streifen, wort: boolean) => {
        if (balken && stil.rahmen) {
          // Nur der Rahmen des Streifens, innen an seiner Kante entlang.
          const strich = Math.max(5, s.px * 0.045);
          streifenPfad(
            ctx,
            x + s.x0,
            x + s.x1,
            y + s.grundlinie,
            s.px,
            s.oben,
            strich / 2,
            s.unten,
            gerade,
            geradeRand,
          );
          ctx.save();
          ctx.strokeStyle = farben.balken;
          ctx.lineWidth = strich;
          ctx.lineJoin = "miter";
          ctx.setLineDash([]);
          ctx.stroke();
          ctx.restore();
          ohneSchatten(ctx);
        } else if (balken) {
          streifenPfad(
            ctx,
            x + s.x0,
            x + s.x1,
            y + s.grundlinie,
            s.px,
            s.oben,
            0,
            s.unten,
            gerade,
            geradeRand,
          );
          ctx.fillStyle = farben.balken;
          ctx.fill();
          ohneSchatten(ctx);
        } else if (stil.pointe === "linie") {
          ctx.fillStyle = farben.balken;
          ctx.fillRect(
            x + s.x0,
            y + s.grundlinie + s.px * 0.14,
            s.x1 - s.x0,
            Math.max(4, s.px * 0.055),
          );
          ohneSchatten(ctx);
        }
        if (wort) wortMalen(s, farben.pointe);
        ohneSchatten(ctx);
      };
      /** Kanten eines Streifens: links, rechts, oben, unten. */
      const kasten = (s: Streifen): Kanten => [
        x + s.x0 - s.px * 0.13,
        x + s.x1 + s.px * 0.1,
        y + s.grundlinie - s.px * s.oben,
        y + s.grundlinie + s.px * s.unten,
      ];
      /**
       * Was die Wörter eines Streifens wirklich zeichnen, an der Schrift
       * gemessen (Kanten wie bei kasten): Punkte großer Umlaute, Ober-
       * und Unterlängen, überhängende Kursive.
       */
      const tinte = (s: Streifen) => {
        ctx.save();
        ctx.font = kursiv(s.px);
        sperren(ctx, s.px * pSperrung);
        const kanten = s.woerter.map((w) => {
          const m = ctx.measureText(w.t);
          return [
            x + w.x - m.actualBoundingBoxLeft,
            x + w.x + m.actualBoundingBoxRight,
            y + s.grundlinie - m.actualBoundingBoxAscent,
            y + s.grundlinie + m.actualBoundingBoxDescent,
          ];
        });
        sperren(ctx, 0);
        ctx.restore();
        const kante = (i: number, f: (...z: number[]) => number) =>
          f(...kanten.map((e) => e[i]));
        return [
          kante(0, Math.min),
          kante(1, Math.max),
          kante(2, Math.min),
          kante(3, Math.max),
        ] as const;
      };
      /**
       * Alle Streifen als ein Paket (Kran, Presse). versatz und weite
       * beschreiben den Schatten, solange das Paket über dem Blatt
       * schwebt.
       */
      const malePaket = (versatz: number, weite = 18) =>
        imBlock(() =>
          streifen.forEach((s) => {
            ctx.save();
            // Unter der Presse staucht sich der Streifen im Aufsetzbild
            // kurz (drei Bilder).
            if (art === "presse" && gestaucht(t)) {
              const [mx, unten] = [
                x + (s.x0 + s.x1) / 2,
                y + s.grundlinie + s.px * s.unten,
              ];
              ctx.translate(mx, unten);
              ctx.scale(1.03, 1 - STAUCHUNG);
              ctx.translate(-mx, -unten);
            }
            if (versatz > 0) {
              ctx.shadowColor = mitDeck(
                helligkeit(farben.text) > 0.7 ? "#000000" : farben.text,
                0.22,
              );
              ctx.shadowBlur = weite * k.skala * k.kam.z;
              ctx.shadowOffsetY = versatz * k.skala * k.kam.z;
            }
            // Das Wort steht im Aufsetzbild da. Ohne Farbstreifen ist das
            // Wort selbst die Ladung und schwebt von Anfang an mit.
            streifenMalen(s, t >= T_SCHLAG || !balken);
            ctx.restore();
          }),
        );

      // Standbild und Film nach dem Auftritt: Die Pointe liegt.
      if (!(t < T_SCHLAG + 0.6)) return malePaket(0);

      /** Stellplatz der Pointe: gestrichelter Umriss, bis sie da ist. */
      const stellplatz = (s: Streifen) => {
        ctx.save();
        ctx.strokeStyle = mitDeck(
          farben.text,
          helligkeit(farben.text) > 0.7 ? 0.45 : 0.38,
        );
        ctx.lineWidth = 2.5;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.setLineDash([14, 9]);
        streifenPfad(
          ctx,
          x + s.x0,
          x + s.x1,
          y + s.grundlinie,
          s.px,
          s.oben,
          3,
          s.unten,
          gerade,
          geradeRand,
        );
        ctx.stroke();
        ctx.restore();
      };

      /**
       * Klapptafel wie am Bahnhof: Der Streifen steht leer da, schlägt
       * einmal leer um und dann auf das Wort. Jeder Schlag dauert sechs
       * Bilder; die obere Hälfte fällt nach vorn und wird zur unteren.
       * Ohne Farbstreifen ist der leere Platz gestrichelt markiert.
       */
      const klappe = (s: Streifen, nr: number) => {
        const ende = T_SCHLAG + (nr * 5) / 30;
        if (!(t < ende)) return streifenMalen(s, true);
        const [links, rechts, oben, unten] = kasten(s);
        const mitte = (oben + unten) / 2;
        const haelfte = (
          obere: boolean,
          wort: boolean,
          stauch = 1,
          dunkel = 0,
        ) => {
          ctx.save();
          ctx.translate(0, mitte);
          ctx.scale(1, stauch);
          ctx.translate(0, -mitte);
          ctx.beginPath();
          ctx.rect(
            links - s.px * 0.2,
            obere ? oben - 2 : mitte,
            rechts - links + s.px * 0.4,
            (unten - oben) / 2 + 2,
          );
          ctx.clip();
          streifenMalen(s, wort);
          if (dunkel > 0 && balken) {
            streifenPfad(
              ctx,
              x + s.x0,
              x + s.x1,
              y + s.grundlinie,
              s.px,
              s.oben,
              0,
              s.unten,
              gerade,
              geradeRand,
            );
            ctx.fillStyle = `rgb(0 0 0 / ${dunkel})`;
            ctx.fill();
          }
          ctx.restore();
        };
        const schlaege = [ende - 13 / 30, ende - 6 / 30];
        const i = t >= schlaege[1] ? 1 : t >= schlaege[0] ? 0 : -1;
        const u = i < 0 ? 1 : (t - schlaege[i]) / (6 / 30);
        if (u >= 1) {
          if (balken) streifenMalen(s, false);
          else stellplatz(s);
        } else {
          // Dahinter: oben schon das neue Blatt, unten noch das alte.
          haelfte(true, i === 1);
          haelfte(false, false);
          // Davor die fallende Hälfte; je steiler, desto dunkler.
          if (u < 0.5) haelfte(true, false, 1 - 2 * u, 0.3 * (2 * u));
          else haelfte(false, i === 1, 2 * u - 1, 0.3 * (2 - 2 * u));
        }
        if (!balken) return;
        // Die Fuge zwischen den beiden Hälften.
        ctx.save();
        ctx.strokeStyle = "rgb(0 0 0 / 0.26)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(links, mitte);
        ctx.lineTo(rechts, mitte);
        ctx.stroke();
        ctx.restore();
      };

      /**
       * Klebeband: Die Pointe liegt fertig da, ist aber überklebt. Das
       * Band wird von links abgezogen, erst zögernd, dann mit einem Ruck;
       * die gelöste Lasche schlägt um und wirft einen Schatten.
       */
      const abziehen = (s: Streifen, nr: number) => {
        streifenMalen(s, true);
        const ende = T_SCHLAG + (nr * 5) / 30;
        if (!(t < ende + 0.2)) return;
        // Luft um die Tinte: mindestens anderthalb Pixel des fertigen
        // Bildes, sonst scheint in kleinen Bildern die Kantenglättung der
        // Umlautpunkte durch.
        const lage = ctx.getTransform();
        const { links, rechts, oben, unten, zahn } = klebeband(
          kasten(s),
          tinte(s),
          s.px,
          block !== null,
          Math.max(4, 1.5 / Math.hypot(lage.a, lage.b)),
        );
        const dauer = 0.45 + 0.3 * klemme((rechts - links) / 900);
        const p = klemme((t - (ende - dauer)) / dauer) ** 1.7;
        const kante = links + (rechts - links) * p;
        const hell = helligkeit(farben.text) > 0.7;
        const zacken = (xx: number, yy: number, richtung: number) => {
          for (let i = 0; i <= 6; i++)
            ctx.lineTo(
              xx - (i % 2 ? zahn : 0),
              yy + (richtung * i * (unten - oben)) / 6,
            );
        };
        ctx.save();
        if (t < ende) {
          // Was noch klebt: von der Abzugskante bis zum gezackten Ende.
          ctx.shadowColor = "rgb(0 0 0 / 0.2)";
          ctx.shadowBlur = 6 * k.skala * k.kam.z;
          ctx.shadowOffsetY = 2 * k.skala * k.kam.z;
          ctx.fillStyle = hell ? "#eadfc6" : "#d9c69c";
          ctx.beginPath();
          ctx.moveTo(kante, oben);
          zacken(rechts, oben, 1);
          ctx.lineTo(kante, unten);
          if (p <= 0)
            for (let i = 6; i >= 0; i--)
              ctx.lineTo(
                links + (i % 2 ? zahn : 0),
                oben + (i * (unten - oben)) / 6,
              );
          ctx.closePath();
          ctx.fill();
          ohneSchatten(ctx);
        }
        if (p > 0) {
          // Die Lasche: Rückseite des Bands, am freien Ende angehoben.
          // Ist das Band ab, fliegt sie nach rechts oben aus dem Bild.
          const weg = Math.max(0, t - ende);
          const lang = Math.min(kante - links, 70 + 0.3 * (kante - links));
          ctx.translate(kante + weg * 5200, (oben + unten) / 2 - weg * 1500);
          ctx.rotate(-weg * 2.5);
          ctx.translate(-kante, -(oben + unten) / 2);
          ctx.shadowColor = "rgb(0 0 0 / 0.3)";
          ctx.shadowBlur = 14 * k.skala * k.kam.z;
          ctx.shadowOffsetY = 8 * k.skala * k.kam.z;
          ctx.fillStyle = hell ? "#cfc2a4" : "#bfa977";
          ctx.beginPath();
          ctx.moveTo(kante, oben);
          zacken(kante + lang, oben - 16, 1);
          ctx.lineTo(kante, unten);
          ctx.closePath();
          ctx.fill();
          ohneSchatten(ctx);
        }
        ctx.restore();
      };

      /**
       * Marker: Das Wort steht schon gedruckt da; dann zieht der Strich
       * von links nach rechts darüber (in Stufen, 24 je Sekunde), und das
       * Wort wechselt unter ihm die Farbe.
       */
      const marker = (s: Streifen, nr: number) => {
        const ende = T_SCHLAG + (nr * 5) / 30;
        if (!(t < ende)) return streifenMalen(s, true);
        wortMalen(s, farben.text);
        const [l0, r0] = kasten(s);
        const [links, rechts] = [l0 - s.px * 0.1, r0 + s.px * 0.1];
        const dauer = 0.3 + 0.3 * klemme((rechts - links) / 900);
        const stufen = Math.ceil(dauer * 24);
        const stand = Math.floor((t - (ende - dauer)) * 24) + 1;
        if (stand <= 0) return;
        const q = FAHRT_ZURUECK(stand / stufen);
        const spitze = links + (rechts - links) * q;
        const schub = s.px * 0.07;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(links - 30, y + s.grundlinie - s.px);
        ctx.lineTo(spitze + schub, y + s.grundlinie - s.px);
        ctx.lineTo(spitze - schub, y + s.grundlinie + s.px * 0.5);
        ctx.lineTo(links - 30, y + s.grundlinie + s.px * 0.5);
        ctx.closePath();
        ctx.clip();
        streifenMalen(s, true);
        ctx.restore();
      };

      if (art === "klappe")
        return imBlock(() => streifen.forEach((s, nr) => klappe(s, nr)));
      if (art === "abziehen")
        return imBlock(() => streifen.forEach((s, nr) => abziehen(s, nr)));
      if (art === "marker")
        return imBlock(() => streifen.forEach((s, nr) => marker(s, nr)));

      // Kran und Presse: Der Platz der Pointe ist gestrichelt markiert,
      // bis sie aufsetzt.
      if (t < T_SCHLAG) imBlock(() => streifen.forEach(stellplatz));
      else if (!last) return malePaket(0);

      if (art === "presse") {
        // Presse: Die Pointe schwenkt groß und schräg von oben rechts
        // herein, schwebt über ihrem Platz und wird in zwei Bildern
        // aufgedrückt wie ein Stempel.
        const an = tHalt - (0.5 + 0.3 * masse);
        if (t <= an || t >= T_SCHLAG) return;
        const [mx, my] = [
          x + pointe.x + pointe.b / 2,
          y + pointe.y + pointe.h / 2,
        ];
        const e = t < tHalt ? SENKEN((t - an) / (tHalt - an)) : 1;
        const fall = t < tFall ? 0 : (t - tFall) / (T_SCHLAG - tFall);
        const gross = t < tHalt ? 1.9 - 0.68 * e : 1.22 - 0.22 * fall;
        const grad = t < tHalt ? -9 + 5 * e : -4 * (1 - fall);
        ctx.save();
        ctx.translate(
          mx + (1 - e) * 0.24 * k.f.b,
          my + (1 - e) * (bildOben() - 40 - pointe.h * 0.95 - my),
        );
        ctx.rotate((grad * Math.PI) / 180);
        ctx.scale(gross, gross);
        ctx.translate(-mx, -my);
        malePaket((gross - 1) * 120, 18 + (gross - 1) * 60);
        ctx.restore();
        return;
      }
      if (!last) return;

      // Kran: die Seile, am Knoten ein Schäkel, dann das Paket mit zwei
      // Ösen, an denen die Seile greifen.
      ctx.save();
      ctx.strokeStyle = farben.text;
      ctx.fillStyle = farben.text;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const seil of last.seile) {
        ctx.beginPath();
        seil.forEach(([sx, sy], i) =>
          i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy),
        );
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(last.knoten[0], last.knoten[1], 7, 0, Math.PI * 2);
      ctx.fill();
      // Das Paket hängt am Seil und pendelt mit ihm.
      ctx.save();
      ctx.translate(last.drehpunkt[0], last.drehpunkt[1]);
      ctx.rotate(last.pendel);
      ctx.translate(-last.drehpunkt[0], -last.drehpunkt[1]);
      ctx.translate(last.lot.x * last.hoehe, last.lot.y * last.hoehe);
      malePaket(Math.min(26, 0.12 * -last.hoehe));
      ctx.restore();
      for (const seil of last.seile.slice(1)) {
        ctx.beginPath();
        ctx.arc(seil[0][0], seil[0][1], 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
  };
}

/** Unschöner Umbruch: Satzanfang am Zeilenende oder ein kurzes Wort allein. */
function makel(zeilen: Zeile[]): boolean {
  return zeilen.some((z, i) => {
    const w = z.woerter;
    if (
      i < zeilen.length - 1 &&
      w.length > 1 &&
      /[.!?:]$/.test(w[w.length - 2].t)
    )
      return true;
    return (
      w.length === 1 &&
      !w[0].betont &&
      w[0].t.replace(/[^\p{L}]/gu, "").length <= 4
    );
  });
}

/** Freier Text in einer Schrift, so groß wie möglich (Mythos, Zusatz). */
type Frei = {
  hoehe: number;
  px: number;
  zeilen: Zeile[];
  /** da: ob eine Zeile schon gedruckt ist (im Film erscheint sie in einem Bild) */
  zeichne: (
    x: number,
    y: number,
    farbe: string,
    da?: (zeile: number) => boolean,
  ) => void;
};
function setzeFrei(
  k: Basis,
  text: string,
  schrift: (px: number) => string,
  sperrung: number,
  breite: number,
  platz: number,
  maxPx: number,
  minPx: number,
  zeilenFaktor = 1.12,
  achse: "links" | "mitte" = "links",
): Frei {
  const { ctx } = k;
  let px = maxPx;
  let zeilen: Zeile[] = [];
  let abstand = 0;
  // Die größte Schrift, die passt. Hängt dort ein Satzanfang am Zeilenende
  // oder steht ein kurzes Wort allein, darf sie bis zu zehn Prozent
  // kleiner werden, wenn der Umbruch dadurch sauber wird.
  let erste: { px: number; zeilen: Zeile[]; abstand: number } | null = null;
  let sauber = false;
  for (; px >= minPx; px -= 2) {
    ctx.font = schrift(px);
    sperren(ctx, px * sperrung);
    abstand = ctx.measureText(" ").width;
    const woerter = text.split(" ").map((t) => ({
      t,
      betont: false,
      breite: ctx.measureText(t).width,
    }));
    if (Math.max(...woerter.map((w) => w.breite)) > breite) continue;
    zeilen = ausgewogen(woerter, breite, abstand);
    if (zeilen.length * px * zeilenFaktor > platz) continue;
    if (!makel(zeilen)) {
      sauber = true;
      break;
    }
    erste ??= { px, zeilen, abstand };
    if (px - 2 < erste.px * 0.9) break;
  }
  if (!sauber && erste) ({ px, zeilen, abstand } = erste);
  if (px < minPx || zeilen.length * minPx * zeilenFaktor > platz + 1)
    k.eng.wert = k.eng.wert || px < minPx;
  px = Math.max(px, minPx);
  sperren(ctx, 0);
  const fest = { px, abstand };
  return {
    hoehe: zeilen.length * px * zeilenFaktor,
    px,
    zeilen,
    zeichne: (x, y, farbe, da) => {
      ctx.font = schrift(fest.px);
      sperren(ctx, fest.px * sperrung);
      ctx.fillStyle = farbe;
      ctx.textBaseline = "alphabetic";
      zeilen.forEach((z, i) => {
        if (da && !da(i)) return;
        let xx = x + (achse === "mitte" ? (breite - z.breite) / 2 : 0);
        const grundlinie = y + i * fest.px * zeilenFaktor + fest.px * 0.86;
        for (const w of z.woerter) {
          ctx.fillText(w.t, xx, grundlinie);
          xx += w.breite + fest.abstand;
        }
      });
      sperren(ctx, 0);
    },
  };
}

/**
 * Der Zusatz unter dem Satz: ruhige Schrift mit geschwungenem Pfeil. Im
 * Film ist er die Auflösung: Der Pfeil wird wie mit dem Stift gezogen
 * (in vier Stellungen), dann steht die Unterzeile da, Zeile für Zeile in
 * je einem Bild.
 */
function setzeZusatz(k: Basis, breite: number, px = 48) {
  const einzug = px * 1.7;
  const frei = setzeFrei(
    k,
    k.karte.zusatz,
    (p) => `500 ${p}px ${GROTESK}`,
    0,
    breite - einzug,
    px * 1.32 * 4,
    px,
    px - 8,
    1.32,
  );
  return {
    hoehe: frei.hoehe,
    zeichne: (
      x: number,
      y: number,
      t: number,
      farbe: string,
      akzent: string,
    ) => {
      if (t < T_PFEIL) return;
      const { ctx } = k;
      const stellung = Math.min(4, Math.floor((t - T_PFEIL) * 12) + 1);
      ctx.save();
      const s = frei.px / 48;
      ctx.strokeStyle = akzent;
      ctx.lineWidth = 6 * s;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const py = y + frei.px * 0.62;
      ctx.beginPath();
      ctx.moveTo(x + 6 * s, py - 34 * s);
      ctx.bezierCurveTo(
        x + 2 * s,
        py - 4 * s,
        x + 14 * s,
        py + 6 * s,
        x + 52 * s,
        py + 2 * s,
      );
      if (stellung < 4) ctx.setLineDash([(72 * s * stellung) / 3.4, 300 * s]);
      ctx.stroke();
      // Die Spitze kommt mit der letzten Stellung.
      if (stellung === 4) {
        ctx.beginPath();
        ctx.moveTo(x + 36 * s, py - 14 * s);
        ctx.lineTo(x + 54 * s, py + 2 * s);
        ctx.lineTo(x + 34 * s, py + 16 * s);
        ctx.stroke();
      }
      ctx.restore();
      frei.zeichne(x + einzug, y, farbe, (i) => t >= T_ZUSATZ + (i * 4) / 30);
    },
  };
}

// ---------------------------------------------------------------- Rahmen

/**
 * Grund: Verlauf in der Farbwelt, ein Licht, eine große ruhige Fläche.
 * Er ragt über den Bildrand hinaus, damit beim Federn des Plakats
 * nirgends ein Rand frei wird.
 */
function grund(k: Basis, l: StoryLook, muster = true) {
  const { ctx, f, v } = k;
  const u = 260;
  ctx.save();
  const g = ctx.createLinearGradient(0, 0, f.b, f.h);
  g.addColorStop(0, l.bg);
  g.addColorStop(1, l.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(-u, -u, f.b + u * 2, f.h + u * 2);
  const licht = ctx.createRadialGradient(940, f.oben, 0, 940, f.oben, 860);
  licht.addColorStop(0, `rgb(${l.licht} / ${l.lichtKraft})`);
  licht.addColorStop(1, `rgb(${l.licht} / 0)`);
  ctx.fillStyle = licht;
  ctx.fillRect(-u, -u, f.b + u * 2, f.oben + 880 + u);
  // Eine große, ruhige Fläche Ton in Ton gibt dem Grund Tiefe: an manchen
  // Tagen eine schräge Teilung, an anderen ein Kreis, sonst nur das Licht.
  ctx.fillStyle = ton(l, 0.55, 0.1);
  ctx.beginPath();
  if (!muster) {
    // Ruhiger Grund (Titelblatt): nur Farbe und Licht.
  } else if (v.grund === "geteilt") {
    const steigung = (f.h * 0.24) / f.b;
    ctx.moveTo(-u, f.h * 0.74 + u * steigung);
    ctx.lineTo(f.b + u, f.h * 0.5 - u * steigung);
    ctx.lineTo(f.b + u, f.h + u);
    ctx.lineTo(-u, f.h + u);
  } else if (v.grund === "raster") {
    ctx.arc(f.b * 0.08, f.h * 0.9, f.b * 0.62, 0, Math.PI * 2);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Farben der Kopfzeile: Etikett (Pille oder Schrift), Datum, Anlass. */
type KopfFarben = {
  etikett: string;
  etikettText: string;
  datum: string;
  /** Anlass eines tagesaktuellen Posts (sonst wie das Datum) */
  anlass?: string;
  /** Serie, Aufhänger: Füllung der Pille mit dem Titel (sonst der Akzent der Farbwelt) */
  titel?: string;
};

/** Stelle eines Bildes in seiner Serie („2/4“), sonst null. */
const zaehler = (k: Basis): string | null =>
  k.serie ? `${k.serie.nr}/${k.serie.von}` : null;

/**
 * Rechts oben: das Datum, bei tagesaktuellen Posts mit dem Anlass davor
 * („BLACK FRIDAY · FR., 27.11.“), fett in der Akzentfarbe. Passt das
 * nicht in eine Zeile neben das, was links steht (linksEnde), steht der
 * Anlass über dem Datum; passt auch das nicht, meldet k.kopfEng es der
 * Prüfung. Beim Vorbereiten gemessen, gezeichnet mit c (auch über dem
 * gefilmten Bild).
 */
function datumBauen(
  k: Basis,
  linksEnde: number,
  mitte: number,
  farben: { datum: string; anlass?: string },
  gross = 26,
  mitAnlass = true,
  /** Steht statt des Anlasses da (Serie, Aufhänger: die Reihe). */
  stattAnlass?: string,
): (c: Ctx) => void {
  const { ctx, f, karte, mono } = k;
  const rechts = f.b - RAND + 3;
  const frei = rechts - linksEnde - 28;
  // In einer Serie steht statt des Datums die Stelle des Bildes („2/4“).
  const datum = zaehler(k) ?? karte.datumKurz.toUpperCase();
  const anlass = mitAnlass
    ? (stattAnlass ?? karte.anlass ?? "").trim().toUpperCase()
    : "";
  const monoSchrift = (px: number) => `400 ${px}px ${mono}`;
  const fett = (px: number) => `700 ${px}px ${GROTESK}`;
  const weite = (text: string, schrift: string, sperrung: number) => {
    ctx.font = schrift;
    sperren(ctx, sperrung);
    const w = ctx.measureText(text).width;
    sperren(ctx, 0);
    return w;
  };
  const dw = (px: number) => weite(datum, monoSchrift(px), px * 0.046);
  const aw = (px: number) => weite(anlass, fett(px), px * 0.1);
  const pw = (px: number) => weite(" · ", monoSchrift(px), px * 0.046);
  type Plan = { art: "eine" | "zwei"; a: number; d: number };
  // Der Zähler einer Serie steht etwas größer als ein Datum: Er soll
  // auf jedem Bild gleich zu finden sein.
  const plus = k.serie ? 6 : 0;
  let plan: Plan = { art: "eine", a: gross, d: gross + plus };
  if (!anlass) {
    if (dw(gross + plus) > frei) k.kopfEng = true;
  } else {
    let gefunden: Plan | null = null;
    for (const px of [gross, gross - 2, gross - 4])
      if (!gefunden && aw(px) + pw(px + plus) + dw(px + plus) <= frei)
        gefunden = { art: "eine", a: px, d: px + plus };
    // Zwei Zeilen: der Anlass über dem Datum, beide rechtsbündig.
    const d2 = Math.min(22, gross - 4) + plus;
    for (let px = gross; !gefunden && px >= 18; px -= 2)
      if (aw(px) <= frei && dw(d2) <= frei)
        gefunden = { art: "zwei", a: px, d: d2 };
    if (!gefunden) k.kopfEng = true;
    plan = gefunden ?? { art: "zwei", a: 18, d: d2 };
  }
  const p = plan;
  // Breiten beim Vorbereiten messen: Beim Zeichnen würde das Messen die
  // Schrift der Zeichenfläche umstellen.
  const vor = rechts - dw(p.d);
  const vorAnlass = vor - pw(p.d);
  return (c) => {
    c.save();
    c.textBaseline = "middle";
    c.textAlign = "right";
    const datumMalen = (yy: number) => {
      c.font = monoSchrift(p.d);
      sperren(c, p.d * 0.046);
      c.fillStyle = farben.datum;
      c.fillText(datum, rechts, yy);
    };
    if (!anlass) datumMalen(mitte);
    else if (p.art === "eine") {
      datumMalen(mitte);
      c.fillText(" · ", vor, mitte);
      c.font = fett(p.a);
      sperren(c, p.a * 0.1);
      c.fillStyle = farben.anlass ?? farben.datum;
      c.fillText(anlass, vorAnlass, mitte);
    } else {
      c.font = fett(p.a);
      sperren(c, p.a * 0.1);
      c.fillStyle = farben.anlass ?? farben.datum;
      c.fillText(anlass, rechts + p.a * 0.1, mitte - 15);
      datumMalen(mitte + 17);
    }
    sperren(c, 0);
    c.restore();
  };
}

/**
 * Oben: Etikett der Reihe links, Datum (mit Anlass) rechts. Gedruckt,
 * also vom ersten Bild an da. Das Etikett ist eine Pille (klassisch),
 * eine kurze Linie mit Kapitälchen oder eine Kennzeile in Schreibmaschine
 * (Titelblatt). Beim Vorbereiten gemessen; zeichnet je Bild.
 */
function kopfBauen(
  k: Basis,
  farben: KopfFarben,
  etikett: string | null,
  art: "pille" | "linie" | "folio" | "zelle" = "pille",
  /** false: Der Anlass steht woanders (Titelzeile im Magazin). */
  mitAnlass = true,
  /** false: kein Datum rechts (das Kalenderblatt zeigt es selbst). */
  mitDatum = true,
): () => void {
  const { ctx, f, l, mono } = k;
  // Serie, Aufhänger: Der Titel der Serie steht links als gefüllte Pille
  // (die eine Pille in der Akzentfarbe), die Reihe wandert nach rechts
  // vor den Zähler. In den folgenden Bildern ist es umgekehrt: die Reihe
  // links, der Titel klein rechts.
  const titel =
    (mitAnlass &&
      mitDatum &&
      art !== "folio" &&
      rolleVon(k) === "aufhaenger" &&
      k.karte.anlass?.trim()) ||
    null;
  const text = (titel ?? etikett)?.toUpperCase() ?? "";
  const mitte = f.oben + (art === "folio" ? 30 : 39);
  // Im Raster ist die Pille ein Block mit geraden Ecken.
  const ecke = art === "zelle" ? 0 : 31;
  if (titel) art = "pille";
  // „zelle“: kleine Kennzeile im Raster, wie in einer Zelle des Satzspiegels.
  let schrift =
    art === "folio"
      ? `400 24px ${mono}`
      : art === "zelle"
        ? `700 24px ${GROTESK}`
        : `700 26px ${GROTESK}`;
  let sperrung = art === "folio" ? 3.5 : art === "zelle" ? 2.6 : 3.4;
  const messen = () => {
    ctx.font = schrift;
    sperren(ctx, sperrung);
    const w = text ? ctx.measureText(text).width : 0;
    sperren(ctx, 0);
    return w;
  };
  let textBreite = messen();
  // Ein langer Titel steht kleiner, damit rechts Reihe und Zähler passen.
  for (let px = 24; titel && px >= 20 && textBreite > 470; px -= 2) {
    schrift = `700 ${px}px ${GROTESK}`;
    sperrung = px * 0.12;
    textBreite = messen();
  }
  const b = !text
    ? 0
    : art === "pille"
      ? textBreite + 62
      : art === "linie"
        ? textBreite + 52
        : textBreite;
  // Höchstens eine orange Pille auf dem Bild.
  const pille =
    art === "pille" && text
      ? pillenFarbe(
          k,
          titel ? (farben.titel ?? marke(l)) : farben.etikett,
          l.text,
        )
      : null;
  const pillenText = titel
    ? pillenSchrift(pille ?? l.text)
    : pille && pille !== farben.etikett
      ? schriftAuf(pille)
      : farben.etikettText;
  const rechts = mitDatum
    ? datumBauen(
        k,
        RAND + b,
        mitte,
        farben,
        art === "folio" || art === "zelle" || ecke === 0 ? 24 : 26,
        mitAnlass,
        titel ? (etikett ?? "") : undefined,
      )
    : () => undefined;
  return () => {
    ctx.save();
    if (text) {
      ctx.font = schrift;
      sperren(ctx, sperrung);
      ctx.textBaseline = "middle";
      if (pille) {
        rund(ctx, RAND, f.oben + 6, b, 62, ecke);
        ctx.fillStyle = pille;
        ctx.fill();
        ctx.fillStyle = pillenText;
        ctx.fillText(text, RAND + 31, mitte);
      } else if (art === "linie") {
        ctx.fillStyle = farben.etikett;
        ctx.fillRect(RAND, mitte - 1.5, 36, 3);
        ctx.fillText(text, RAND + 52, mitte);
      } else {
        ctx.fillStyle = farben.etikett;
        ctx.fillText(text, RAND - 1, mitte);
      }
      sperren(ctx, 0);
    }
    ctx.restore();
    rechts(ctx);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  };
}

/** Maßstab der Hafen-Motive auf der Wasserlinie. */
const MOTIV_MASS = 2.4;

/**
 * Wo am Fuß was steht: die Wasserlinie, der Liegeplatz des Schiffs und
 * links davon Hamburg am anderen Ufer (Maßstab und Enden der Silhouette).
 */
function hafenLage(k: Basis) {
  const { f, v } = k;
  const y0 = k.horizont ?? f.unten - 112;
  const ziel = f.b - RAND - 46 - v.motiv.b * MOTIV_MASS;
  // In der hohen Story ist über der Linie mehr Platz als in den
  // gedrungenen Formaten.
  const mass = (f.name === "story" ? 0.7 : 0.6) * k.stadtGross;
  const ost = ziel - 34;
  return {
    y0,
    ziel,
    mass,
    ost,
    west: ost - (HAMBURG_OST - HAMBURG_WEST) * mass,
  };
}

/** Feste Zufallsfolge (gleicher Startwert, gleiche Folge). */
function folge(start: number) {
  let v = start;
  return () => {
    v = (v * 16807) % 2147483647;
    return v / 2147483647;
  };
}

/**
 * Hamburg als ein Umriss: die Wahrzeichen der Startseite, davor und
 * dazwischen niedrige Dächer. Koordinaten wie in lib/hamburg-skyline.ts.
 */
let stadtUmriss: Path2D | null = null;
function stadtPfad(): Path2D {
  if (stadtUmriss) return stadtUmriss;
  const zufall = folge(7);
  const unten = HAMBURG_HORIZONT + 30;
  let d = "";
  for (let x = -1900; x < HAMBURG_OST + 14; ) {
    const b = 8 + Math.round(zufall() * 16);
    const h = 3 + Math.round(zufall() * 9);
    const art = Math.floor(zufall() * 3);
    const o = HAMBURG_HORIZONT - h;
    if (art === 0) d += `M${x} ${unten}V${o}H${x + b}V${unten}Z`;
    else if (art === 1)
      d += `M${x} ${unten}V${o}L${x + b / 2} ${o - 4}L${x + b} ${o}V${unten}Z`;
    else
      d += `M${x} ${unten}V${o + 2}L${x + 2} ${o}H${x + b - 2}L${x + b} ${o + 2}V${unten}Z`;
    x += b + Math.round(zufall() * 3);
  }
  // Jedes Teil einzeln zur Fläche: So bleibt die Füllung überall gleich
  // dicht, auch wo sich Teile überlagern.
  const pfad = new Path2D(d);
  for (const gruppe of HAMBURG_WAHRZEICHEN)
    for (const teil of gruppe) pfad.addPath(new Path2D(teil));
  stadtUmriss = pfad;
  return pfad;
}

/** Fenster, die in dunklen Farbwelten leuchten: x, y, Breite. */
const STADT_FENSTER = (() => {
  const zufall = folge(23);
  const f: [number, number, number][] = [];
  // Glasbau der Elbphilharmonie
  for (let reihe = 0; reihe < 3; reihe++)
    for (let x = -9; x < 93; x += 4.2)
      if (zufall() >= 0.42) f.push([x, 592 + reihe * 4.6, 2.4]);
  // Speicher darunter: nur wenige Fenster hell
  for (let reihe = 0; reihe < 4; reihe++)
    for (let x = -8; x < 92; x += 6)
      if (zufall() >= 0.78) f.push([x, 612 + reihe * 6, 1.6]);
  // Halle der Landungsbrücken
  for (let x = -232; x < -150; x += 4) f.push([x, 631, 2.2]);
  // Tanzende Türme
  for (let i = 0; i < 9; i++)
    f.push([-290 + zufall() * 12, 596 + zufall() * 34, 1.6]);
  for (let i = 0; i < 6; i++)
    f.push([-266 + zufall() * 9, 608 + zufall() * 24, 1.6]);
  return f;
})();

/**
 * Unten: die Elbe-Linie mit einem kleinen Schiff, darunter die Wortmarke
 * (SITAL und der Doppelring) und die Adresse. Im Film ist das Schiff die
 * Uhr: Es fährt ein, wenn die Kamera zurückfährt, mit gleichmäßiger
 * Fahrt, bremst die letzten 0,8 Sekunden und legt bei T_RUHE an. Setzt
 * die Pointe auf, läuft von dort ein Wellenschlag über die Wasserlinie.
 */
/**
 * Die Elbe: eine feine Welle über die ganze Breite. Im Film zieht sie
 * langsam nach rechts; setzt die Pointe mit Gewicht auf, läuft von dort
 * ein Wellenschlag über die Linie. welle() zeichnet den Pfad (offen),
 * damit Fuß und Farbflächen genau dieselbe Linie nutzen.
 */
function welleBauen(k: Basis, t: number) {
  const { ctx, f } = k;
  const { y0 } = hafenLage(k);
  const zeit = lauf(t);
  const schub = ((zeit * 16) % 152) + (zeit < 0 ? 152 : 0);
  const links = RAND - 304 + schub - 152;
  // Wellenschlag: läuft vom Aufsetzpunkt mit 700 px je Sekunde nach
  // beiden Seiten und klingt in 1,2 Sekunden ab. Schwere Ladung schlägt
  // höhere Wellen.
  const seit = t - T_SCHLAG;
  const schlag =
    k.regie.ladung && seit >= 0 && seit < 1.2 ? k.regie.ladung : null;
  const hub = (x: number) => {
    if (!schlag) return 0;
    const d = Math.abs(x - schlag.x) - 700 * seit;
    if (d > 0) return 0;
    return (
      (3 + 4 * schlag.masse) *
      (1 - seit / 1.2) ** 2 *
      Math.min(1, -d / 40) *
      Math.sin(d / 18) *
      Math.exp(d / 120)
    );
  };
  /** Pfad der Welle; vorlauf beginnt ihn weit links (für Flächen bis in den Überstand). */
  const welle = (vorlauf = false) => {
    ctx.beginPath();
    if (vorlauf) {
      ctx.moveTo(-600, y0);
      ctx.lineTo(links, y0 + hub(links));
    } else ctx.moveTo(links, y0 + hub(links));
    for (let x = links; x < f.b + 200; x += 152) {
      if (!schlag) {
        ctx.bezierCurveTo(x + 38, y0 - 7, x + 114, y0 + 7, x + 152, y0);
        continue;
      }
      // Dieselbe Kurve in kurzen Strecken, damit der Schlag sie heben kann.
      for (let i = 1; i <= 16; i++) {
        const s = i / 16;
        const r = 1 - s;
        const bx =
          x + 3 * r * r * s * 38 + 3 * r * s * s * 114 + s * s * s * 152;
        ctx.lineTo(bx, y0 + 21 * r * s * (s - r) + hub(bx));
      }
    }
  };
  return { welle, links, y0 };
}

/** Farben des Fußes; die optionalen trennen Stadt (über der Linie) und Wasser (darunter). */
type FussFarben = {
  schrift: string;
  weich: string;
  linie: string;
  ring: string;
  schiff: string;
  flaeche: string;
  /** helle Fläche (Papier, helle Farbwelt): Das Wasser wird dunkler getönt */
  hell: boolean;
  /** Fläche hinter der Stadt hell (sonst wie hell) */
  stadtHell?: boolean;
  /** ohne Tönung des Wassers (wenn darunter schon eine eigene Fläche liegt) */
  ohneWasser?: boolean;
  /** Streifen am Schiff und Fenster der Stadt (sonst wie der Ring) */
  streif?: string;
  /** Farbe der Stadt (sonst Ton in Ton nach stadtHell) */
  stadt?: string;
};

function fuss(k: Basis, t: number, farben: FussFarben) {
  const { ctx, f, v, serif, mono } = k;
  const hafen = hafenLage(k);
  const { y0 } = hafen;
  const stadtHell = farben.stadtHell ?? farben.hell;
  ctx.save();
  // Die Elbe: eine feine Welle über die ganze Breite, darunter Wasser bis
  // zum unteren Rand. So schwimmt das Schiff auf etwas. Im Film zieht
  // die Welle langsam nach rechts.
  const { welle, links } = welleBauen(k, t);
  // Hamburg am anderen Ufer, Ton in Ton im Dunst: dieselbe Silhouette
  // wie im Kopfbild der Startseite. Sie steht hinter der Wasserlinie; in
  // dunklen Farbwelten leuchten Fenster.
  ctx.save();
  welle();
  ctx.lineTo(f.b + 400, -3000);
  ctx.lineTo(links, -3000);
  ctx.closePath();
  ctx.clip();
  ctx.translate(
    hafen.ost - HAMBURG_OST * hafen.mass,
    y0 + 4 - HAMBURG_HORIZONT * hafen.mass,
  );
  ctx.scale(hafen.mass, hafen.mass);
  ctx.fillStyle =
    farben.stadt ??
    (stadtHell ? "rgb(15 42 58 / 0.16)" : "rgb(255 255 255 / 0.15)");
  ctx.fill(stadtPfad());
  if (!stadtHell) {
    ctx.fillStyle = farben.streif ?? farben.ring;
    ctx.globalAlpha *= 0.9;
    for (const [fx, fy, fb] of STADT_FENSTER)
      ctx.fillRect(fx, fy, fb, fb * 1.1);
  }
  ctx.restore();

  if (!farben.ohneWasser) {
    welle();
    ctx.lineTo(f.b + 400, f.h + 300);
    ctx.lineTo(links, f.h + 300);
    ctx.closePath();
    ctx.fillStyle = farben.hell
      ? "rgb(15 42 58 / 0.055)"
      : "rgb(255 255 255 / 0.05)";
    ctx.fill();
  }
  welle();
  ctx.strokeStyle = farben.linie;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.stroke();
  // Im Film flimmert das Wasser (sechs Stellungen je Sekunde), im
  // Standbild liegt es still.
  const stand = t < T_RUHE ? Math.floor(Math.max(0, t) * 6) : 0;
  // Die Stadt spiegelt sich: gestaucht und in schmale Streifen zerlegt,
  // die im Film leicht wandern. Leuchtende Fenster spiegeln sich mit.
  ctx.save();
  ctx.beginPath();
  for (let yy = y0 + 9 + (stand % 3); yy < y0 + 44; yy += 7)
    ctx.rect(-400, yy, f.b + 800, 3.5);
  ctx.clip();
  ctx.translate(
    hafen.ost - HAMBURG_OST * hafen.mass,
    y0 + 6 + HAMBURG_HORIZONT * hafen.mass * 0.45,
  );
  ctx.scale(hafen.mass, -hafen.mass * 0.45);
  ctx.fillStyle = farben.hell
    ? "rgb(15 42 58 / 0.09)"
    : "rgb(255 255 255 / 0.08)";
  ctx.fill(stadtPfad());
  if (!farben.hell) {
    ctx.fillStyle = farben.streif ?? farben.ring;
    ctx.globalAlpha *= 0.55;
    for (const [fx, fy, fb] of STADT_FENSTER)
      ctx.fillRect(fx, fy, fb, fb * 1.1);
  }
  ctx.restore();
  // Lichter auf dem Wasser: kurze Striche unter Stadt und Liegeplatz.
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.globalAlpha *= 0.8;
  const glanz = folge(31 + stand * 7);
  for (let i = 0; i < 6; i++) {
    const [gx, lang, da] = [
      hafen.west - 30 + ((i * 0.618) % 1) * (f.b - RAND - hafen.west + 10),
      12 + ((i * 0.37) % 1) * 22,
      stand === 0 || glanz() > 0.3,
    ];
    if (!da) continue;
    const ruck = stand === 0 ? 0 : (glanz() - 0.5) * 12;
    ctx.beginPath();
    ctx.moveTo(gx + ruck, y0 + (i % 2 ? 26 : 14));
    ctx.lineTo(gx + ruck + lang, y0 + (i % 2 ? 26 : 14));
    ctx.stroke();
  }
  ctx.restore();

  // Kleines Schiff auf der Linie (jeden Tag ein anderes). Leuchtturm und
  // Kran stehen von Anfang an.
  const s = MOTIV_MASS;
  const m = v.motiv;
  const { ziel } = hafen;
  const faehrt = m.faehrt && t < T_RUHE;
  const strecke = f.b + 40 - ziel;
  const gleich = T_RUHE - 0.8 - T_SCHIFF;
  /** Anteil der vollen Fahrt zur Zeit z (0 = steht) */
  const tempo = (z: number) =>
    z < T_SCHIFF ? 0 : z < T_RUHE - 0.8 ? 1 : klemme((T_RUHE - z) / 0.8);
  let rest = 0;
  let stampfen = 0;
  if (faehrt) {
    const tau = Math.max(0, t - T_SCHIFF);
    const brems = Math.max(0, tau - gleich);
    rest =
      strecke *
      (1 -
        (Math.min(tau, gleich) + brems - (brems * brems) / 1.6) /
          (gleich + 0.4));
    // Es stampft leicht (anderthalb Bildpunkte, alle 1,4 Sekunden) und
    // kommt mit dem Anlegen zur Ruhe.
    stampfen = Math.sin((tau / 1.4) * Math.PI * 2) * tempo(t);
  }
  const sx = ziel + rest;
  if (!(m.faehrt && t < T_SCHIFF)) {
    // Kielwasser: eine feine Welle hinter dem Schiff, die 0,6 Sekunden
    // nach dem Anlegen verläuft.
    const nachlauf = m.faehrt && t < T_RUHE + 0.6 ? tempo(t - 0.6) : 0;
    if (nachlauf > 0) {
      ctx.save();
      ctx.strokeStyle = farben.schiff;
      ctx.globalAlpha = 0.5 * nachlauf;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      const heck = sx + m.b * s + 4;
      for (let d = 0; d <= 140; d += 4) {
        const wy =
          y0 +
          10 +
          Math.sin(((heck + d) / 28) * Math.PI * 2) * 3 * (1 - d / 140);
        if (d) ctx.lineTo(heck + d, wy);
        else ctx.moveTo(heck + d, wy);
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(sx, y0 + 2 - MOTIV_WASSER * s + stampfen * 1.5);
    ctx.translate((m.b * s) / 2, MOTIV_WASSER * s);
    ctx.rotate((stampfen * 0.7 * Math.PI) / 180);
    ctx.translate((-m.b * s) / 2, -MOTIV_WASSER * s);
    ctx.scale(s, s);
    // Nur der Teil über der Wasserlinie.
    ctx.beginPath();
    ctx.rect(-4, -10, m.b + 8, MOTIV_WASSER + 10);
    ctx.clip();
    const deck = ctx.globalAlpha;
    const teilFarbe = {
      faehre: farben.schiff,
      streif: farben.streif ?? farben.ring,
      grund: farben.flaeche,
    };
    for (const teil of m.teile) {
      ctx.globalAlpha = deck * (teil.deck ?? 1);
      ctx.fillStyle = teilFarbe[teil.farbe];
      ctx.fill(new Path2D(teil.d));
    }
    ctx.restore();
  }

  // Wortmarke und Adresse.
  ctx.save();
  const grundlinie = f.unten - 30;
  ctx.font = `500 54px ${serif}`;
  sperren(ctx, 4.5);
  ctx.fillStyle = farben.schrift;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("SITAL", RAND - 2, grundlinie);
  const nach = RAND - 2 + ctx.measureText("SITAL").width + 2;
  sperren(ctx, 0);
  ctx.strokeStyle = farben.ring;
  // Legt das Schiff an, antwortet der Doppelring einmal: Sein Strich wird
  // kurz kräftiger.
  const gruss = t >= T_RUHE && t < T_RUHE + 0.3 ? t - T_RUHE : 0;
  ctx.lineWidth = 3.4 + 2.2 * Math.sin((gruss / 0.3) * Math.PI);
  for (const cx of [17, 26.5]) {
    ctx.beginPath();
    ctx.ellipse(nach + cx, grundlinie - 17, 16.4, 16.2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.font = `400 26px ${mono}`;
  sperren(ctx, 2.4);
  ctx.textAlign = "right";
  ctx.fillStyle = farben.weich;
  ctx.fillText("sitalo.de", f.b - RAND + 2, grundlinie - 4);
  sperren(ctx, 0);
  ctx.restore();
  ctx.textAlign = "left";
}

/** Farben für Kopf und Fuß auf dem Grund der Farbwelt. */
function rahmenFarben(l: StoryLook) {
  return {
    kopf: {
      etikett: l.stickerBg,
      etikettText: l.stickerText,
      datum: l.weich,
      anlass: anlassFarbe(l.bg, l.bg2, l),
    } as KopfFarben,
    fuss: {
      schrift: l.text,
      weich: l.weich,
      linie: l.dunkel ? "rgb(255 255 255 / 0.3)" : "rgb(15 42 58 / 0.28)",
      ring: marke(l),
      schiff: l.text,
      flaeche: l.bg,
      hell: !l.dunkel,
    },
  };
}
/** Der Anlass in der Kopfzeile: in der Akzentfarbe, wo sie trägt, sonst in der Schrift. */
function anlassFarbe(a: string, b: string, l: StoryLook): string {
  return farbeAuf([a, b], [marke(l), ORANGE_TIEF, l.text], 3);
}
function satzFarben(k: Basis): SatzFarben {
  const { l } = k;
  return { text: l.text, balken: l.marker, pointe: l.betont };
}

/** Lage eines Blocks im Feld: oben, mittig (etwas über der Mitte) oder unten. */
function lage(k: Basis, oben: number, unten: number, hoehe: number): number {
  const faktor = { mitte: 0.46, oben: 0.04, unten: 0.96 }[k.v.anker];
  return oben + Math.max(0, unten - oben - hoehe) * faktor;
}

/** Eine Farbwelt, die nicht auf der Liste steht (z. B. kein Rot für die rote Flagge). */
function lookOhne(v: Variante, verboten: string[]): StoryLook {
  let i = STORY_LOOKS.indexOf(v.look);
  for (
    let n = 0;
    n < STORY_LOOKS.length && verboten.includes(STORY_LOOKS[i].name);
    n++
  )
    i = (i + 5) % STORY_LOOKS.length;
  return STORY_LOOKS[i];
}

/** Maße eines großen Zeichens: Schriftgröße, Ursprung und der Kasten seiner Tinte. */
type ZeichenMass = {
  px: number;
  x: number;
  y: number;
  l: number;
  r: number;
  o: number;
  u: number;
  b: number;
  h: number;
};
type ZeichenStil = {
  /** fette Grotesk statt der kursiven Serife */
  fett?: boolean;
  links?: boolean;
  hoechstens?: number;
  /** kleiner als so (Standard 150) entfällt das Zeichen */
  mindestens?: number;
};
const zeichenSchrift = (k: Basis, fett: boolean | undefined, px: number) =>
  fett ? `800 ${px}px ${GROTESK}` : `italic 600 ${px}px ${k.serif}`;

/**
 * Ein riesiges Satzzeichen in der freien Fläche über dem Satz: ganz
 * sichtbar, an den Rand des Satzspiegels gerückt und nie hinter Text.
 * Bei zu wenig Platz entfällt es (null).
 */
function zeichenMass(
  k: Basis,
  zeichen: string,
  oben: number,
  unten: number,
  stil: ZeichenStil,
): ZeichenMass | null {
  const { ctx, f } = k;
  const hoehe = Math.min(unten - oben, stil.hoechstens ?? 720);
  if (hoehe < (stil.mindestens ?? 150)) return null;
  ctx.font = zeichenSchrift(k, stil.fett, 1000);
  const m = ctx.measureText(zeichen);
  const s = hoehe / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
  const x = stil.links
    ? RAND + m.actualBoundingBoxLeft * s
    : f.b - RAND - m.actualBoundingBoxRight * s;
  const y = unten - m.actualBoundingBoxDescent * s;
  const [l, r] = [
    x - m.actualBoundingBoxLeft * s,
    x + m.actualBoundingBoxRight * s,
  ];
  return {
    px: 1000 * s,
    x,
    y,
    l,
    r,
    o: unten - hoehe,
    u: unten,
    b: r - l,
    h: hoehe,
  };
}

/**
 * Malt das große Zeichen. Gedruckte Zeichen (Ausrufezeichen,
 * Anführungszeichen) stehen vom ersten Bild an. Ein Umriss wird im Film
 * gezogen wie mit dem Stift: in elf Stellungen, zwölf je Sekunde.
 */
function zeichenMalen(
  k: Basis,
  zeichen: string,
  m: ZeichenMass,
  t: number,
  stil: { farbe: string; fett?: boolean; umriss?: boolean },
) {
  const { ctx } = k;
  ctx.save();
  ctx.font = zeichenSchrift(k, stil.fett, m.px);
  if (!stil.umriss) {
    ctx.fillStyle = stil.farbe;
    ctx.fillText(zeichen, m.x, m.y);
  } else {
    ctx.strokeStyle = stil.farbe;
    ctx.lineWidth = 9;
    ctx.lineJoin = "round";
    if (t < 11 / 12) {
      ctx.lineCap = "round";
      ctx.setLineDash([
        (m.h * 3.2 * (Math.floor(Math.max(0, t) * 12) + 1)) / 11,
        m.h * 9,
      ]);
    }
    ctx.strokeText(zeichen, m.x, m.y);
  }
  ctx.restore();
}

type Maler = (t: number) => void;

/** Ab Bild n des Films (30 Bilder je Sekunde). */
const abBild = (n: number) => n / 30 - 1e-4;

/**
 * Aufdruck wie mit dem Stempel: die ersten Bilder leer, dann sitzt er in
 * einem Bild (kurz 104 Prozent groß), zwei Bilder später in seiner
 * Größe. null = noch nicht da. Das Plakat gibt dabei 6 Bildpunkte nach.
 */
function druck(t: number): number | null {
  if (t < abBild(4)) return null;
  return t < abBild(6) ? 1.04 : 1;
}
const DRUCK_FEDER = { t: abBild(4), px: 6 };

const kasten = (m: ZeichenMass) => ({ x: m.l, y: m.o, b: m.b, h: m.h });
/** Ohne Requisit (zu wenig Platz): Nahaufnahme auf das Etikett der Reihe. */
const nahEtikett = (k: Basis): Pose =>
  nahAuf(k, { x: RAND, y: k.f.oben + 6, b: 330, h: 62 }, 2.4);

/** Der Rückzug: nah an einer Stelle, dann eine einzige Fahrt in die Totale. */
function rueckzug(k: Basis, nah: Pose, bis = T_NAH): Station[] {
  return [
    { t: bis, pose: nah },
    {
      t: T_SATZ,
      pose: { x: k.f.b / 2, y: k.f.h / 2, z: 1 },
      kurve: FAHRT_HIN,
    },
  ];
}

/**
 * Regie der Reihen mit Pointe auf dem Farbstreifen. Die Kamera nimmt
 * einen von drei Wegen; bei allen steht das ganze Plakat im Bild, wenn
 * die Pointe kommt, nichts ist angeschnitten:
 *
 * - Rückzug: nah am Requisit der Reihe, dann eine Fahrt in die Totale.
 * - Lücke: nah an der Stelle, an der die Pointe fehlt, dann die Fahrt
 *   in die Totale.
 * - Anfahrt: Das ganze Plakat steht im Bild, die Kamera rückt langsam
 *   ein Stück heran, bis die Pointe da ist, und wieder zurück.
 * - Hafen: nah an Hamburg am anderen Ufer, die Kamera gleitet an der
 *   Stadt entlang und fährt dann in die Totale.
 *
 * Das Plakat gibt nach, wenn die Pointe mit Gewicht aufsetzt: weich
 * unter der Ladung am Kran, hart unter der Presse, leicht bei der
 * Klapptafel.
 */
function regieFuer(
  k: Basis,
  a: {
    nah: Pose;
    x: number;
    y: number;
    satz: Gesetzt;
    baender?: number[][];
    feder?: Regie["feder"];
  },
): Regie {
  const { f } = k;
  const { masse, pointe } = a.satz;
  k.fokus = masse
    ? { x: a.x + pointe.x + pointe.b / 2, y: a.y + pointe.y + pointe.h / 2 }
    : { x: a.x + a.satz.links + a.satz.b / 2, y: a.y + a.satz.hoehe / 2 };
  const { auftritt, kamera } = k.film;
  const totale = { x: f.b / 2, y: f.h / 2, z: 1 };
  let fahrt = rueckzug(k, a.nah);
  if (kamera === "anfahrt") {
    // Mittig, damit an den Seiten nichts angeschnitten wird; passt der
    // engere Ausschnitt oben und unten nicht sauber, nur ein kleines Stück.
    const eng = sauberStellen(k, { ...totale, z: 1.1 }, a.baender);
    if (eng.z === 1) eng.z = 1.04;
    fahrt = [
      { t: 0.5, pose: totale },
      { t: T_SCHLAG - 0.3, pose: eng, kurve: ANFAHRT },
      { t: T_RUECK + 0.2, pose: eng },
      { t: T_STAND + 0.2, pose: totale, kurve: FAHRT_ZURUECK },
    ];
  } else if (kamera === "hafen") {
    // Eröffnung am Hafen: nah an Hamburg am anderen Ufer, die Kamera
    // gleitet nach Osten an der Stadt entlang und fährt dann zurück.
    const h = hafenLage(k);
    // So nah, dass die Stadt das Bild füllt: Horizont im oberen Drittel,
    // darunter das Wasser. Die Oberkante liegt knapp unter dem Textfeld,
    // damit kein Wort ins Bild ragt.
    let z = f.name === "story" ? 5 : 5.6;
    let y = k.unten + 2 + f.h / 2 / z;
    if (k.hafenBand) {
      // Liegt die Wasserlinie zwischen Texten (farbfeld), bleibt der
      // Ausschnitt im freien Band darum, notfalls etwas näher.
      const [bo, bu] = k.hafenBand;
      z = Math.min(9, Math.max(z, f.h / Math.max(1, bu - bo)));
      const halb = f.h / 2 / z;
      y = Math.min(Math.max(h.y0 - 40 * h.mass, bo + halb), bu - halb);
    }
    const sicht = f.b / z;
    const von = h.west + sicht / 2 - 50;
    // Die Fahrt endet, bevor die Adresse rechts unten angeschnitten ins
    // Bild käme (mit Luft für den schrägen Blick der Kino-Kamera).
    const bis = Math.max(
      von + 80,
      Math.min(h.ost - sicht / 2 + 24, f.b - RAND - 170 - sicht * 0.85),
    );
    fahrt = [
      { t: 0, pose: imBild(k, { x: von, y, z }) },
      {
        t: 1.1,
        pose: imBild(k, { x: bis, y, z }),
        kurve: GLEITEN,
      },
      { t: T_SATZ + 0.6, pose: totale, kurve: FAHRT_HIN },
    ];
  } else if (kamera === "luecke" && masse) {
    // Nah am Anfang der Lücke: Eine breite Pointe läuft rechts aus dem Bild.
    const z = Math.max(1.7, Math.min(2.2, (0.85 * f.b) / pointe.b));
    const sicht = f.b / z;
    fahrt = rueckzug(
      k,
      imBild(k, {
        x:
          pointe.b <= 0.84 * sicht
            ? a.x + pointe.x + pointe.b / 2
            : a.x + pointe.x + 0.42 * sicht,
        y: a.y + pointe.y + pointe.h / 2,
        z,
      }),
      0.5,
    );
  }
  const wucht = !masse
    ? 0
    : auftritt === "kran"
      ? 6 + 6 * masse
      : auftritt === "presse"
        ? 10 + 8 * masse
        : auftritt === "klappe"
          ? 4
          : 0;
  return {
    fahrt,
    feder: [
      // Steht die Kamera an der Lücke oder am Hafen, sieht man das
      // Requisit nicht: Dann federt das Plakat auch nicht unter seinem
      // Aufdruck.
      ...(kamera === "luecke" || kamera === "hafen" ? [] : (a.feder ?? [])),
      ...(wucht
        ? [{ t: T_SCHLAG, px: wucht, weich: auftritt === "kran" }]
        : []),
    ],
    // Nur was mit Gewicht aufsetzt, schlägt Wellen.
    ladung:
      masse && (auftritt === "kran" || auftritt === "presse")
        ? { x: a.x + pointe.x + pointe.b / 2, masse }
        : null,
  };
}

// ---------------------------------------------------------------- Formate

/** Plakat: reine Schrift, dazu ein großes Zeichen oder ein runder Stempel. */
function plakat(k: Basis): Maler {
  const { ctx, f, l, karte } = k;
  const farben = rahmenFarben(l);
  const kopf = kopfBauen(k, farben.kopf, karte.kicker);
  const breite = f.b - RAND * 2;
  const art = karte.kicker;
  const hoch = k.unten - k.oben;
  // Platz für das Zeichen über dem Satz.
  const zeichenHoehe = Math.round(hoch * (f.name === "story" ? 0.26 : 0.21));
  const zusatz = setzeZusatz(k, breite);
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    breite,
    hoch - zeichenHoehe - zusatz.hoehe - 60,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  // Hot Take: Der Satz steht unten, darüber das Ausrufezeichen.
  const y =
    art === "Hot Take"
      ? k.unten - gesamt
      : lage(k, k.oben + zeichenHoehe, k.unten, gesamt);

  // Das Requisit der Reihe.
  const ausrufe =
    art === "Hot Take"
      ? zeichenMass(k, "!", f.oben + 96, y - 56, { fett: true })
      : null;
  const zitat =
    art === "Kurz gesagt"
      ? zeichenMass(k, "“", k.oben + 4, y - 44, {
          links: true,
          hoechstens: zeichenHoehe * 0.66,
          mindestens: 84,
        })
      : null;
  let www: { px: number; x: number; b: number } | null = null;
  if (art === "Website-Wahrheit") {
    ctx.font = `800 100px ${GROTESK}`;
    sperren(ctx, -2);
    const m = ctx.measureText("www.");
    const tinte = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    const px = Math.min((breite / tinte) * 100, zeichenHoehe * 1.3);
    sperren(ctx, 0);
    www = {
      px,
      x: RAND + (m.actualBoundingBoxLeft * px) / 100,
      b: (tinte * px) / 100,
    };
  }
  const stempel =
    art === "Hot Take" || art === "Kurz gesagt" || art === "Website-Wahrheit"
      ? null
      : {
          r: zeichenHoehe * 0.44,
          x: f.b - RAND - zeichenHoehe * 0.44 - 4,
          y: k.oben + zeichenHoehe * 0.44,
        };
  k.regie = regieFuer(k, {
    nah: ausrufe
      ? nahAuf(k, kasten(ausrufe), ZOOM_NAH, y)
      : zitat
        ? nahAuf(k, kasten(zitat), ZOOM_NAH, y)
        : www
          ? nahAuf(k, {
              x: RAND,
              y: y - 46 - www.px * 0.56,
              b: www.b,
              h: www.px * 0.56,
            })
          : stempel
            ? nahAuf(
                k,
                {
                  x: stempel.x - stempel.r,
                  y: stempel.y - stempel.r,
                  b: stempel.r * 2,
                  h: stempel.r * 2,
                },
                ZOOM_NAH,
                y,
              )
            : nahEtikett(k),
    x: RAND,
    y,
    satz,
    feder: stempel ? [DRUCK_FEDER] : [],
  });

  return (t) => {
    grund(k, l);
    ctx.save();
    if (ausrufe) {
      // Großes Ausrufezeichen in der Akzentfarbe: das lauteste Bild der Reihe.
      zeichenMalen(k, "!", ausrufe, t, { farbe: marke(l), fett: true });
    } else if (zitat) {
      // Großes Anführungszeichen direkt über dem Satz.
      zeichenMalen(k, "“", zitat, t, { farbe: marke(l) });
    } else if (www) {
      // „www.“ groß als Umriss, so breit wie der Satzspiegel, über dem
      // Satz. Im Film wird es Buchstabe für Buchstabe gezogen (je drei
      // Stellungen, zwölf je Sekunde), der Punkt kommt zuletzt.
      ctx.globalAlpha = 0.92;
      ctx.font = `800 ${www.px}px ${GROTESK}`;
      sperren(ctx, -www.px * 0.02);
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";
      ctx.strokeStyle = l.text;
      const stand = t < 11 / 12 ? Math.floor(Math.max(0, t) * 12) + 1 : 99;
      if (stand > 10) ctx.strokeText("www.", www.x, y - 46);
      else {
        ctx.lineCap = "round";
        const w = ctx.measureText("w").width;
        for (let i = 0; i < 3; i++) {
          const q = klemme((stand - i * 3) / 3);
          if (q <= 0) break;
          ctx.setLineDash(q < 1 ? [www.px * 4.8 * q, www.px * 20] : []);
          ctx.strokeText(
            "w",
            www.x + ctx.measureText("www".slice(0, i + 1)).width - w,
            y - 46,
          );
        }
      }
      sperren(ctx, 0);
    } else if (stempel) {
      // Runder Stempel mit umlaufender Schrift und dem Doppelring der
      // Marke. Im Film wird er aufgedrückt: erst nichts, dann sitzt er.
      const gross = druck(t);
      if (gross !== null) {
        const { r } = stempel;
        ctx.translate(stempel.x, stempel.y);
        ctx.scale(gross, gross);
        ctx.rotate((-14 * Math.PI) / 180);
        ctx.strokeStyle = l.text;
        ctx.lineWidth = 5;
        for (const radius of [r, r * 0.62]) {
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Umschrift: gleichmäßig über den ganzen Kreis verteilt.
        const text = [...`${art.toUpperCase()} · ${art.toUpperCase()} · `];
        ctx.font = `700 100px ${GROTESK}`;
        const roh = text.map((z) => ctx.measureText(z).width);
        const umfang = Math.PI * 2 * r * 0.81;
        const px = Math.min(
          r * 0.24,
          (umfang / (roh.reduce((a, b) => a + b, 0) * 1.08)) * 100,
        );
        const weiten = roh.map((w) => (w * px) / 100);
        const summe = weiten.reduce((a, b) => a + b, 0);
        ctx.font = `700 ${px}px ${GROTESK}`;
        ctx.fillStyle = l.text;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let bogen = 0;
        text.forEach((z, i) => {
          ctx.save();
          ctx.rotate(((bogen + weiten[i] / 2) / summe) * Math.PI * 2);
          ctx.fillText(z, 0, -r * 0.81);
          ctx.restore();
          bogen += weiten[i];
        });
        ctx.strokeStyle = marke(l);
        ctx.lineWidth = Math.max(4, r * 0.055);
        for (const dx of [-0.1, 0.1]) {
          ctx.beginPath();
          ctx.arc(dx * r, 0, r * 0.24, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    kopf();
    satz.zeichne(RAND, y, t, satzFarben(k));
    zusatz.zeichne(RAND, y + satz.hoehe + luecke, t, l.weich, l.akzent);
    fuss(k, t, farben.fuss);
    korn(k, 0.1);
  };
}

/** Sprechblase (Real Talk): der Satz in einer großen Blase auf Papier. */
function sprechblase(k: Basis): Maler {
  const { ctx, f, l, karte } = k;
  const farben = rahmenFarben(l);
  const kopf = kopfBauen(k, farben.kopf, karte.kicker);
  const aussen = f.b - RAND * 2;
  const innen = aussen - 124;
  const zusatz = setzeZusatz(k, f.b - RAND * 2);
  const hoch = k.unten - k.oben;
  const satz = setzeSatz(k, satzPlan(karte), innen, hoch - zusatz.hoehe - 300, {
    maxG: 120,
  });
  const blase = satz.hoehe + 132;
  const gesamt = blase + 136 + zusatz.hoehe;
  const y = k.oben + 20 + Math.max(0, hoch - 20 - gesamt) * 0.42;
  const x = RAND;
  const stark = kraeftig(l);
  const spitze = { x: x + 70, y: y + blase + 82 };
  // Die Blase steht gedruckt da. Die Kamera beginnt nah an ihrer Spitze.
  k.regie = regieFuer(k, {
    nah: imBild(k, { x: spitze.x + 70, y: spitze.y - 50, z: 2.4 }),
    x: x + 62,
    y: y + 66,
    satz,
  });
  return (t) => {
    grund(k, l);
    kopf();
    ctx.save();
    schatten(k, 70, 30, 0.26);
    ctx.fillStyle = PAPIER;
    // Blase und Spitze (unten links) aus einem Stück: ein Schatten.
    rund(ctx, x, y, aussen, blase, 64);
    // Die Spitze läuft im selben Drehsinn wie die Blase: Sonst bliebe
    // dort, wo beide sich überlappen, ein Spalt.
    ctx.moveTo(x + 208, y + blase - 6);
    ctx.lineTo(spitze.x, spitze.y);
    ctx.lineTo(x + 96, y + blase - 6);
    ctx.closePath();
    ctx.fill();
    ohneSchatten(ctx);
    ctx.restore();
    satz.zeichne(x + 62, y + 66, t, {
      text: TINTE,
      balken: stark,
      pointe: schriftAuf(stark),
    });
    zusatz.zeichne(RAND, y + blase + 136, t, l.weich, l.akzent);
    fuss(k, t, farben.fuss);
    korn(k, 0.1);
  };
}

/** Flagge (Red Flag, Green Flag): große wehende Flagge, Satz darunter. */
function flagge(k: Basis): Maler {
  const { ctx, f, karte } = k;
  const rot = karte.kicker === "Red Flag";
  const farbe = rot ? "#e63b2e" : "#16865a";
  const l = lookOhne(
    k.v,
    rot ? ["koralle", "backstein"] : ["seegruen", "petrol"],
  );
  const farben = rahmenFarben(l);
  const kopf = kopfBauen(
    k,
    {
      etikett: farbe,
      etikettText: "#ffffff",
      datum: l.weich,
      anlass: farben.kopf.anlass,
    },
    karte.kicker,
  );
  const breite = f.b - RAND * 2;
  const hoch = k.unten - k.oben;
  const fahne = Math.round(hoch * (f.name === "story" ? 0.27 : 0.22));
  // Der Mast endet über dem Satz: Das Textfeld beginnt erst darunter.
  const mast = Math.round(fahne * 1.2);
  const feldOben = k.oben + mast + 36;
  const zusatz = setzeZusatz(k, breite);
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    breite,
    k.unten - feldOben - zusatz.hoehe - 50,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  const y = feldOben + Math.max(0, k.unten - feldOben - gesamt) * 0.6;
  const mastX = f.b * 0.56;
  const oben = k.oben - 6;
  const y0 = oben + 16;
  const hoehe = fahne * 0.8;
  // Die Welle rechnet mit der Länge bis knapp hinter den Bildrand; das
  // Tuch reicht weiter, damit bei der Fahrt kein Ende sichtbar wird.
  const lang = f.b - mastX + 40;
  const laenge = lang + 90;
  k.regie = regieFuer(k, {
    nah: nahAuf(
      k,
      { x: mastX - 30, y: oben - 21, b: f.b - mastX + 30, h: mast },
      ZOOM_NAH,
      y,
    ),
    x: RAND,
    y,
    satz,
  });
  return (t) => {
    grund(k, l);
    ctx.save();
    // Das Tuch weht ruhig und kommt mit dem Anlegen des Schiffs in der
    // Stellung des Standbilds zur Ruhe.
    const phase = lauf(t) * 2.6;
    // Es besteht aus schmalen senkrechten Streifen, die einer Welle
    // folgen: So wirft es Falten.
    const welle = (x: number) =>
      Math.sin((x / lang) * Math.PI * 2.3 - phase) *
      fahne *
      0.085 *
      (0.25 + (x / lang) * 0.9);
    schatten(k, 30, 14, 0.14);
    ctx.fillStyle = farbe;
    ctx.beginPath();
    ctx.moveTo(mastX + 6, y0);
    for (let x = 0; x <= laenge; x += 12)
      ctx.lineTo(mastX + 6 + x, y0 + welle(x));
    for (let x = laenge; x >= 0; x -= 12)
      ctx.lineTo(mastX + 6 + x, y0 + hoehe + welle(x) * 1.15);
    ctx.closePath();
    ctx.fill();
    ohneSchatten(ctx);
    // Licht auf den Wellenbergen, Schatten in den Tälern.
    ctx.save();
    ctx.clip();
    for (let x = 0; x < laenge; x += 8) {
      const steigung = welle(x + 8) - welle(x);
      ctx.fillStyle =
        steigung > 0
          ? `rgb(0 0 0 / ${Math.min(0.11, steigung * 0.026)})`
          : `rgb(255 255 255 / ${Math.min(0.1, -steigung * 0.024)})`;
      ctx.fillRect(mastX + 6 + x, y0 - 90, 8.5, hoehe + 180);
    }
    ctx.restore();
    // Mast mit Kugel; unten ein Fuß, damit er steht und nicht schwebt.
    ctx.fillStyle = l.text;
    rund(ctx, mastX - 7, oben, 14, mast, 7);
    ctx.fill();
    rund(ctx, mastX - 58, oben + mast - 12, 116, 14, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(mastX, oben - 4, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    kopf();
    satz.zeichne(RAND, y, t, {
      text: l.text,
      balken: farbe,
      pointe: "#ffffff",
    });
    zusatz.zeichne(RAND, y + satz.hoehe + luecke, t, l.weich, farbe);
    fuss(k, t, farben.fuss);
    korn(k, 0.1);
  };
}

/** Mythos: oben der Irrtum kursiv und durchgestrichen, unten auf Papier die Richtigstellung. */
function mythos(k: Basis): Maler {
  const { ctx, f, l, karte, serif } = k;
  const farben = rahmenFarben(l);
  const kopf = kopfBauen(k, farben.kopf, "Mythos");
  const breite = f.b - RAND * 2;
  const teilung = Math.round(k.oben + (k.unten - k.oben) * 0.47);
  const irrtum = setzeFrei(
    k,
    `„${karte.text}“`,
    (px) => `italic 600 ${px}px ${serif}`,
    -0.012,
    breite,
    teilung - k.oben - 70,
    118,
    64,
    1.08,
  );
  const wahr = setzeFrei(
    k,
    karte.zusatz,
    (px) => `800 ${px}px ${GROTESK}`,
    -0.03,
    breite,
    k.unten - teilung - 190,
    100,
    52,
    1.1,
  );
  const yIrrtum =
    k.oben + Math.max(0, teilung - k.oben - 60 - irrtum.hoehe) * 0.55;
  // „Stimmt nicht“ ist eine Pille: orange nur, wenn das Etikett es nicht
  // schon ist.
  const stark = pillenFarbe(k, kraeftig(l), TINTE);
  const yMarke = teilung + 78;
  ctx.font = `700 26px ${GROTESK}`;
  sperren(ctx, 3.4);
  const marke0 = ctx.measureText("STIMMT NICHT").width + 62;
  sperren(ctx, 0);

  // In dieser Reihe ist das Blatt mit der Richtigstellung die Ladung: Der
  // Irrtum steht gedruckt da und wird Zeile für Zeile durchgestrichen,
  // dann schiebt sich das Blatt von unten an seinen Platz und setzt bei
  // T_SCHLAG auf. Das Plakat gibt nach oben nach.
  const tFall = T_SCHLAG - 2 / 30;
  const tHalt = tFall - 4 / 30;
  const tSchub = tHalt - 0.7;
  const STRICH_AB = 2.3;
  // Je Zeile sechs Bilder Strich und drei Bilder Pause; bei vielen Zeilen
  // enger, damit alle durch sind, bevor das Blatt hält.
  const takt = Math.min(
    9,
    Math.floor(((tHalt - STRICH_AB) * 30) / irrtum.zeilen.length),
  );
  const stufen = Math.max(1, Math.ceil((takt * 2 * 12) / (3 * 30)));
  const weit = f.h - teilung + 160;
  const neigung = (300 * 68) / f.b;
  k.regie = {
    // Nah am öffnenden Anführungszeichen des Irrtums, dann die Totale.
    fahrt: rueckzug(
      k,
      imBild(k, {
        x: RAND + irrtum.px * 0.9,
        y: yIrrtum + irrtum.px * 0.6,
        z: 2.2,
      }),
    ),
    feder: [{ t: T_SCHLAG, px: -8 }],
    ladung: null,
  };
  // Die Kino-Kamera blickt auf die Stelle, an der „Stimmt nicht“ aufsetzt.
  k.fokus = { x: f.b / 2, y: yMarke + 30 };
  return (t) => {
    grund(k, l);
    kopf();
    // Der Irrtum steht gedruckt da; der Strich zieht in Stufen durch jede
    // Zeile und steht links und rechts 14 Bildpunkte über.
    irrtum.zeichne(RAND, yIrrtum, l.text);
    ctx.save();
    ctx.strokeStyle = marke(l);
    ctx.lineWidth = Math.max(7, irrtum.px * 0.075);
    ctx.lineCap = "round";
    irrtum.zeilen.forEach((z, i) => {
      const ab = STRICH_AB + (i * takt) / 30;
      if (t < ab) return;
      const zug = klemme((Math.floor((t - ab) * 12) + 1) / stufen);
      const yy = yIrrtum + i * irrtum.px * 1.08 + irrtum.px * 0.58;
      ctx.beginPath();
      ctx.moveTo(RAND - 14, yy + 7);
      ctx.lineTo(RAND - 14 + (z.breite + 28) * zug, yy + 7 - 14 * zug);
      ctx.stroke();
    });
    ctx.restore();

    // Stellplatz: Wo die Oberkante des Blatts hinkommt, ist gestrichelt
    // markiert, bis es aufsetzt.
    if (t < T_SCHLAG) {
      ctx.save();
      ctx.strokeStyle = mitDeck(l.text, helligkeit(l.text) > 0.7 ? 0.45 : 0.38);
      ctx.lineWidth = 2.5;
      ctx.setLineDash([14, 9]);
      ctx.beginPath();
      ctx.moveTo(-300, teilung + 37 + neigung);
      ctx.lineTo(f.b + 300, teilung - 31 - neigung);
      ctx.stroke();
      ctx.restore();
    }

    // Das Blatt Papier mit schräger Oberkante, darauf der Fuß.
    const schub = !(t < T_SCHLAG)
      ? 0
      : t < tSchub
        ? null
        : t < tHalt
          ? weit + (14 - weit) * SENKEN((t - tSchub) / (tHalt - tSchub))
          : t < tFall
            ? 14
            : 14 * (1 - (t - tFall) / (T_SCHLAG - tFall));
    if (schub !== null) {
      ctx.save();
      ctx.translate(0, schub);
      schatten(k, 60, -14, 0.2);
      ctx.fillStyle = PAPIER;
      ctx.beginPath();
      ctx.moveTo(-300, teilung + 34 + neigung);
      ctx.lineTo(f.b + 300, teilung - 34 - neigung);
      ctx.lineTo(f.b + 300, f.h + 600);
      ctx.lineTo(-300, f.h + 600);
      ctx.closePath();
      ctx.fill();
      ohneSchatten(ctx);
      fuss(k, t, {
        schrift: TINTE,
        weich: "#4a433d",
        linie: "rgb(15 42 58 / 0.28)",
        ring: ORANGE,
        schiff: TINTE,
        flaeche: PAPIER,
        hell: true,
      });
      // Sitzt das Blatt, steht „Stimmt nicht“ im selben Bild darauf; die
      // Zeilen der Richtigstellung folgen im Abstand von fünf Bildern.
      if (!(t < T_SCHLAG)) {
        rund(ctx, RAND, yMarke, marke0, 62, 31);
        ctx.fillStyle = stark;
        ctx.fill();
        ctx.font = `700 26px ${GROTESK}`;
        sperren(ctx, 3.4);
        ctx.fillStyle = pillenSchrift(stark);
        ctx.textBaseline = "middle";
        ctx.fillText("STIMMT NICHT", RAND + 31, yMarke + 33);
        sperren(ctx, 0);
        ctx.textBaseline = "alphabetic";
        wahr.zeichne(
          RAND,
          yMarke + 96,
          TINTE,
          (i) => t >= T_SCHLAG + ((i + 1) * 5) / 30,
        );
      }
      ctx.restore();
    }
    korn(k, 0.1);
  };
}

/** POV: dunkles Bild wie durch einen Sucher, mit Eckmarken und rotem Punkt. */
function pov(k: Basis): Maler {
  const { ctx, f, l, karte, mono } = k;
  const breite = f.b - RAND * 2;
  const leuchtet = l.dunkel ? (l.name === "nacht" ? ORANGE : l.akzent) : l.bg;
  const balkenFarbe = helligkeit(leuchtet) > 0.12 ? leuchtet : ORANGE;
  const zusatz = setzeZusatz(k, breite);
  const hoch = k.unten - k.oben;
  const satz = setzeSatz(k, satzPlan(karte), breite, hoch - zusatz.hoehe - 170);
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  const y = k.oben + 26 + Math.max(0, hoch - 80 - gesamt) * 0.5;
  // Die Kamera beginnt nah an der Ecke des Suchers mit dem roten Punkt.
  k.regie = regieFuer(k, {
    nah: imBild(k, { x: RAND + 130, y: f.oben + 60, z: 2.6 }),
    x: RAND,
    y,
    satz,
    // Auch die Eckmarken des Suchers stehen ganz im Bild oder gar nicht.
    baender: [
      [f.oben - 33, f.oben + 68],
      [f.unten - 84, f.unten + 45],
    ],
  });
  ctx.font = `500 30px ${mono}`;
  sperren(ctx, 5);
  const povBreite = ctx.measureText("POV").width;
  sperren(ctx, 0);
  const datum = datumBauen(k, RAND + 40 + povBreite, f.oben + 39, {
    datum: "rgb(255 255 255 / 0.72)",
    anlass: farbeAuf(["#0c0c0f"], [balkenFarbe, "#ffffff"], 4.5),
  });
  /**
   * Sucher: Die Eckmarken stehen fest, nur der rote Punkt blinkt (eine
   * halbe Sekunde an, eine halbe aus). Mit der Kino-Kamera hängt er am
   * Objektiv und wird über das gefilmte Bild gelegt, statt mit dem
   * Plakat zu kippen.
   */
  const sucher = (c: Ctx, t: number) => {
    c.save();
    const [x0, y0, x1, y1] = [
      RAND - 40,
      f.oben - 30,
      f.b - RAND + 40,
      f.unten + 42,
    ];
    const arm = 70;
    c.strokeStyle = "rgb(255 255 255 / 0.92)";
    c.lineWidth = 5;
    c.lineCap = "square";
    for (const [ex, ey, dx, dy] of [
      [x0, y0, 1, 1],
      [x1, y0, -1, 1],
      [x0, y1, 1, -1],
      [x1, y1, -1, -1],
    ]) {
      c.beginPath();
      c.moveTo(ex + dx * arm, ey);
      c.lineTo(ex, ey);
      c.lineTo(ex, ey + dy * arm);
      c.stroke();
    }
    const an = t < T_RUHE ? Math.max(0, t) % 1 < 0.5 : true;
    c.fillStyle = an ? "#ff3b30" : "rgb(255 59 48 / 0.25)";
    c.beginPath();
    c.arc(RAND + 12, f.oben + 37, 12, 0, Math.PI * 2);
    c.fill();
    c.font = `500 30px ${mono}`;
    sperren(c, 5);
    c.fillStyle = "#ffffff";
    c.textBaseline = "middle";
    c.fillText("POV", RAND + 40, f.oben + 39);
    sperren(c, 0);
    datum(c);
    c.restore();
  };
  k.ueberlagerung = sucher;
  return (t) => {
    const u = 260;
    ctx.save();
    ctx.fillStyle = "#0c0c0f";
    ctx.fillRect(-u, -u, f.b + u * 2, f.h + u * 2);
    // Lichtkegel von oben in der Farbe des Tages, dunkler Rand.
    const kegel = ctx.createRadialGradient(
      f.b * 0.5,
      f.oben - 60,
      0,
      f.b * 0.5,
      f.oben - 60,
      f.h * 0.72,
    );
    kegel.addColorStop(0, `${balkenFarbe}3d`);
    kegel.addColorStop(0.55, `${balkenFarbe}10`);
    kegel.addColorStop(1, `${balkenFarbe}00`);
    ctx.fillStyle = kegel;
    ctx.fillRect(-u, -u, f.b + u * 2, f.h + u * 2);
    const rand = ctx.createRadialGradient(
      f.b / 2,
      f.h / 2,
      f.h * 0.3,
      f.b / 2,
      f.h / 2,
      f.h * 0.75,
    );
    rand.addColorStop(0, "rgb(0 0 0 / 0)");
    rand.addColorStop(1, "rgb(0 0 0 / 0.55)");
    ctx.fillStyle = rand;
    ctx.fillRect(-u, -u, f.b + u * 2, f.h + u * 2);

    if (!k.kinoBild) sucher(ctx, t);
    ctx.restore();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    satz.zeichne(RAND, y, t, {
      text: "#ffffff",
      balken: balkenFarbe,
      pointe: schriftAuf(balkenFarbe),
    });
    zusatz.zeichne(
      RAND,
      y + satz.hoehe + luecke,
      t,
      "rgb(255 255 255 / 0.84)",
      balkenFarbe,
    );
    fuss(k, t, {
      schrift: "#ffffff",
      weich: "rgb(255 255 255 / 0.72)",
      linie: "rgb(255 255 255 / 0.3)",
      ring: ORANGE,
      schiff: "#ffffff",
      flaeche: "#0c0c0f",
      hell: false,
    });
    korn(k, 0.16);
  };
}

/** Frage (Hand aufs Herz, Mal ehrlich): ein großes Fragezeichen als Umriss über dem Satz. */
function frage(k: Basis): Maler {
  const { f, l, karte } = k;
  const farben = rahmenFarben(l);
  const kopf = kopfBauen(k, farben.kopf, karte.kicker);
  const breite = f.b - RAND * 2;
  const hoch = k.unten - k.oben;
  const zusatz = setzeZusatz(k, breite);
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    breite,
    hoch -
      Math.round(hoch * (f.name === "story" ? 0.26 : 0.21)) -
      zusatz.hoehe -
      60,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  // Der Satz steht unten, das Fragezeichen füllt die Fläche darüber.
  const y = k.unten - gesamt;
  const zeichen = zeichenMass(k, "?", f.oben + 96, y - 56, {});
  k.regie = regieFuer(k, {
    nah: zeichen ? nahAuf(k, kasten(zeichen), ZOOM_NAH, y) : nahEtikett(k),
    x: RAND,
    y,
    satz,
  });
  return (t) => {
    grund(k, l);
    if (zeichen)
      zeichenMalen(k, "?", zeichen, t, { farbe: l.text, umriss: true });
    kopf();
    satz.zeichne(RAND, y, t, satzFarben(k));
    zusatz.zeichne(RAND, y + satz.hoehe + luecke, t, l.weich, l.akzent);
    fuss(k, t, farben.fuss);
    korn(k, 0.1);
  };
}

/**
 * Notiz: ein Zettel auf farbigem Grund, je Reihe ein anderer. Merken ist
 * eine gerade Karteikarte mit Lesezeichen, Reminder eine schief
 * aufgeklebte Karte, Kleiner Reminder ein gelber Zettel mit Eselsohr.
 */
function notiz(k: Basis): Maler {
  const { ctx, f, l, karte } = k;
  const farben = rahmenFarben(l);
  const kopf = kopfBauen(k, farben.kopf, karte.kicker);
  const merken = karte.kicker === "Merken";
  const klein = karte.kicker === "Kleiner Reminder";
  const gelb = klein && l.name !== "gelb";
  const papier = gelb ? "#ffe98a" : "#fffdf7";
  const stark = kraeftig(l);
  // Der Zettel steht im Satzspiegel wie Kopf und Fuß.
  const aussen = f.b - RAND * 2;
  const rand = 64;
  const innen = aussen - rand * 2;
  const hoch = k.unten - k.oben;
  const kopfLuft = merken ? 96 : 84;
  const zusatz = setzeZusatz(k, innen, 44);
  const satz = setzeSatz(k, satzPlan(karte), innen, hoch - zusatz.hoehe - 310, {
    maxG: 116,
  });
  const zettel = kopfLuft + satz.hoehe + 50 + zusatz.hoehe + 72;
  const x = RAND;
  const y = k.oben + 44 + Math.max(0, hoch - 70 - zettel) * 0.45;
  const schraeg = ((merken ? 0 : klein ? 1.5 : -1.8) * Math.PI) / 180;
  const ecke = klein ? 84 : 0;
  const band = l.name === "koralle" ? "#0f2a3a" : ORANGE;
  // Die Kamera beginnt nah am Klebestreifen (oder am Lesezeichen).
  k.regie = regieFuer(k, {
    nah: imBild(
      k,
      merken
        ? { x: x + aussen - 92, y: y + 40, z: 2.4 }
        : { x: f.b / 2, y: y + 60, z: 2.4 },
    ),
    x: x + rand,
    y: y + kopfLuft,
    satz,
    feder: merken ? [DRUCK_FEDER] : [],
  });
  return (t) => {
    grund(k, l);
    kopf();
    ctx.save();
    ctx.translate(f.b / 2, y + zettel / 2);
    ctx.rotate(schraeg);
    ctx.translate(-f.b / 2, -(y + zettel / 2));
    // Der Zettel hängt an seinem Klebestreifen und pendelt aus: Er beginnt
    // vier Grad gegen seine Lage, jeder halbe Schwung ist 60 Prozent
    // kleiner, nach 1,2 Sekunden hängt er still.
    const pendel =
      merken || !(t < 1.2)
        ? 0
        : -Math.sign(schraeg) *
          ((4 * Math.PI) / 180) *
          Math.cos((Math.max(0, t) / 0.7) * Math.PI * 2) *
          0.4 ** (Math.max(0, t) / 0.35) *
          (1 - klemme((t - 0.9) / 0.3));
    ctx.save();
    if (pendel) {
      ctx.translate(f.b / 2, y + 2);
      ctx.rotate(pendel);
      ctx.translate(-f.b / 2, -(y + 2));
    }
    schatten(k, 70, 34, 0.3);
    ctx.fillStyle = papier;
    const r = 10;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + aussen - r, y);
    ctx.arcTo(x + aussen, y, x + aussen, y + r, r);
    if (ecke) {
      ctx.lineTo(x + aussen, y + zettel - ecke);
      ctx.lineTo(x + aussen - ecke, y + zettel);
    } else {
      ctx.lineTo(x + aussen, y + zettel - r);
      ctx.arcTo(x + aussen, y + zettel, x + aussen - r, y + zettel, r);
    }
    ctx.lineTo(x + r, y + zettel);
    ctx.arcTo(x, y + zettel, x, y + zettel - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
    ohneSchatten(ctx);
    if (ecke) {
      // Eselsohr unten rechts: die umgeschlagene Ecke.
      schatten(k, 16, 5, 0.2);
      ctx.fillStyle = gelb ? "#eccf5a" : "#e9e3d6";
      ctx.beginPath();
      ctx.moveTo(x + aussen, y + zettel - ecke);
      ctx.lineTo(x + aussen - ecke, y + zettel - ecke);
      ctx.lineTo(x + aussen - ecke, y + zettel);
      ctx.closePath();
      ctx.fill();
      ohneSchatten(ctx);
    }
    satz.zeichne(x + rand, y + kopfLuft, t, {
      text: TINTE,
      balken: stark,
      pointe: schriftAuf(stark),
    });
    zusatz.zeichne(
      x + rand,
      y + kopfLuft + satz.hoehe + 50,
      t,
      "#4a433d",
      stark,
    );
    ctx.restore();
    if (merken) {
      // Lesezeichen oben rechts, kurz genug, dass es über dem Satz endet.
      // Im Film wird es aufgedrückt wie ein Stempel.
      const gross = druck(t);
      if (gross !== null) {
        ctx.save();
        ctx.translate(x + aussen - 92, y + 30);
        ctx.scale(gross, gross);
        ctx.translate(-(x + aussen - 92), -(y + 30));
        ctx.fillStyle = stark;
        ctx.beginPath();
        ctx.moveTo(x + aussen - 124, y - 20);
        ctx.lineTo(x + aussen - 60, y - 20);
        ctx.lineTo(x + aussen - 60, y + 80);
        ctx.lineTo(x + aussen - 92, y + 54);
        ctx.lineTo(x + aussen - 124, y + 80);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    } else {
      // Klebestreifen: liegt auf der Oberkante, mit gezackten Enden. Er
      // klebt vom ersten Bild an; an ihm hängt der Zettel.
      ctx.save();
      ctx.translate(f.b / 2, y + 2);
      ctx.rotate((-4 * Math.PI) / 180);
      ctx.globalAlpha *= 0.9;
      schatten(k, 10, 3, 0.16);
      ctx.fillStyle = band;
      const [b2, h2, zahn] = [118, 31, 9];
      ctx.beginPath();
      ctx.moveTo(-b2, -h2);
      for (let i = 0; i <= 6; i++)
        ctx.lineTo(b2 - (i % 2 ? zahn : 0), -h2 + (i * h2 * 2) / 6);
      for (let i = 6; i >= 0; i--)
        ctx.lineTo(-b2 + (i % 2 ? zahn : 0), -h2 + (i * h2 * 2) / 6);
      ctx.closePath();
      ctx.fill();
      ohneSchatten(ctx);
      ctx.restore();
    }
    ctx.restore();
    fuss(k, t, farben.fuss);
    korn(k, 0.1);
  };
}

// ------------------------------------------------- Gestaltungen für alle Reihen

const FLAGGE_ROT = "#e63b2e";
const FLAGGE_GRUEN = "#16865a";

/** Farbe der Flagge (Red Flag, Green Flag), sonst null. */
function flaggenFarbe(karte: SpruchTag): string | null {
  if (karte.kicker === "Red Flag") return FLAGGE_ROT;
  if (karte.kicker === "Green Flag") return FLAGGE_GRUEN;
  return null;
}
/**
 * Flagge für die Gestaltungen aller Reihen. In einer Story-Serie färbt
 * sie nichts um: Alle Bilder der Serie tragen dieselbe Farbwelt.
 */
const flaggeFuer = (k: Basis): string | null =>
  k.serie ? null : flaggenFarbe(k.karte);
/** Farbwelt, die sich nicht mit der Flagge beißt (kein Rot zur roten Flagge). */
function lookFuer(k: Basis): StoryLook {
  const flagge = flaggeFuer(k);
  if (!flagge) return k.v.look;
  return lookOhne(
    k.v,
    flagge === FLAGGE_ROT ? ["koralle", "backstein"] : ["seegruen", "petrol"],
  );
}

/**
 * Plan des Satzes. Beim Mythos steht der Irrtum in Anführungszeichen und
 * ohne Pointe da: Er wird im Film durchgestrichen (mythosStriche).
 */
function planFuer(karte: SpruchTag): SatzPlan {
  if (karte.kicker !== "Mythos") return satzPlan(karte);
  return satzPlan({ ...karte, text: `„${karte.text}“`, betont: "" });
}

/**
 * Mythos in den neuen Gestaltungen: Der Irrtum steht gedruckt da und wird
 * ab 2,3 Sekunden Zeile für Zeile durchgestrichen (je Zeile sechs Bilder
 * Strich, drei Bilder Pause), im Standbild ganz.
 */
function mythosStriche(
  k: Basis,
  satz: { linien: Gesetzt["linien"] },
  x: number,
  y: number,
  t: number,
  farbe: string,
  hoehe: number,
) {
  const { ctx } = k;
  const takt = Math.min(9, Math.floor((1.2 * 30) / satz.linien.length));
  ctx.save();
  ctx.strokeStyle = farbe;
  ctx.lineCap = "round";
  satz.linien.forEach((z, i) => {
    const ab = 2.3 + (i * takt) / 30;
    if (t < ab) return;
    const zug = klemme((Math.floor((t - ab) * 12) + 1) / 3);
    const yy = y + z.grundlinie - z.g * hoehe;
    ctx.lineWidth = Math.max(5, z.g * 0.06);
    ctx.beginPath();
    ctx.moveTo(x + z.x0 - 12, yy + 5);
    ctx.lineTo(x + z.x0 - 12 + (z.x1 - z.x0 + 24) * zug, yy + 5 - 10 * zug);
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * Kurze Linie, die sich im Film wie mit dem Lineal gezogen zeigt (vier
 * Stellungen ab T_PFEIL), im Standbild ganz. Steht über dem Zusatz.
 */
function linieMalen(
  k: Basis,
  x: number,
  y: number,
  lang: number,
  t: number,
  farbe: string,
  mitte = false,
) {
  if (t < T_PFEIL) return;
  const stellung = Math.min(4, Math.floor((t - T_PFEIL) * 12) + 1);
  const b = (lang * stellung) / 4;
  k.ctx.fillStyle = farbe;
  k.ctx.fillRect(mitte ? x + (lang - b) / 2 : x, y, b, 2.5);
}

// ------------------------------------------------------------ Story-Serie

/** Serie: Das Zeichen, dass es weitergeht, kommt nach dem Zusatz. */
const T_WEITER = T_ZUSATZ + 0.45;
/** Serie: Der Kontaktblock der Einladung wird nach dem Zusatz aufgedrückt. */
const T_CTA = T_ZUSATZ + 0.5;
/** Wohin die Einladung führt: das Anfrageformular. */
const ANFRAGE_ADRESSE = "sitalo.de/anfrage";

/** Aufgabe des Bildes in seiner Serie (sonst null). */
const rolleVon = (k: Basis): SerieRolle | null => k.serie?.rolle ?? null;

/**
 * Serie: Am rechten Rand zeigt ein Winkel, dass es weitergeht (nicht im
 * letzten Bild). Er steht im Seitenrand neben dem Satzspiegel, wo sonst
 * nichts steht, in jedem Bild der Serie auf der Höhe des Zusatzes. Auf
 * dem Aufhänger steht darüber „weiter“, hochkant wie eine Randnotiz. Im
 * Film wird der Winkel nach dem Zusatz gezogen (zwei Stellungen), im
 * Standbild steht er.
 */
function weiterMalen(k: Basis, y: number, t: number, farbe: string) {
  const s = k.serie;
  if (!s || s.nr >= s.von || t < T_WEITER) return;
  const { ctx, f, mono } = k;
  const x = f.b - RAND / 2;
  const stellung = Math.min(2, Math.floor((t - T_WEITER) * 12) + 1);
  ctx.save();
  ctx.strokeStyle = farbe;
  ctx.fillStyle = farbe;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 20);
  ctx.lineTo(x + 10, y);
  if (stellung === 2) ctx.lineTo(x - 9, y + 20);
  ctx.stroke();
  if (s.rolle === "aufhaenger") {
    ctx.translate(x, y - 46);
    ctx.rotate(-Math.PI / 2);
    ctx.font = `400 24px ${mono}`;
    sperren(ctx, 5);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText("WEITER", 0, 1);
    sperren(ctx, 0);
  }
  ctx.restore();
}

/** Der Kontaktblock der Einladung: Höhe und Zeichenfunktion (x, y: linke obere Ecke des Feldes). */
type Cta = {
  hoehe: number;
  zeichne: (x: number, y: number, t: number) => void;
};

/**
 * Serie, Einladung: der Kontaktblock. Eine gefüllte Pille mit der Adresse
 * des Anfrageformulars und einem Pfeil (die eine orange Pille des
 * Bildes), daneben das Telefon; reicht die Breite nicht, steht es
 * darunter. Beim Vorbereiten aufrufen, und zwar vor dem Kopf: So bekommt
 * diese Pille das Orange, und das Etikett der Reihe weicht aus. Im Film
 * wird die Pille nach dem Zusatz aufgedrückt wie ein Stempel, dann steht
 * das Telefon da. null, wenn das Bild keine Einladung ist.
 */
function ctaBauen(
  k: Basis,
  breite: number,
  achse: "links" | "mitte",
  farben: {
    /** Füllung der Pille (Orange, wo es trägt) und ihr Ersatz */
    pille: string;
    ersatz: string;
    /** Telefonnummer und die kleine Zeile darüber */
    schrift: string;
    weich: string;
  },
): Cta | null {
  if (rolleVon(k) !== "einladung") return null;
  const { ctx, f, mono } = k;
  const story = f.name === "story";
  const h = story ? 96 : 84;
  const px = story ? 40 : 35;
  const schrift = `700 ${px}px ${GROTESK}`;
  const weite = (text: string, font: string, sperrung: number) => {
    ctx.font = font;
    sperren(ctx, sperrung);
    const w = ctx.measureText(text).width;
    sperren(ctx, 0);
    return w;
  };
  const textB = weite(ANFRAGE_ADRESSE, schrift, -px * 0.012);
  const pfeil = Math.round(px * 1.05);
  const innen = Math.round(h * 0.46);
  const pillenB = Math.round(innen + textB + px * 0.55 + pfeil + innen * 0.86);
  const pille = pillenFarbe(k, farben.pille, farben.ersatz);
  const aufPille = pillenSchrift(pille);
  const zeilePx = story ? 20 : 18;
  const telPx = story ? 36 : 32;
  const zeile = "ODER ANRUFEN";
  const zeileSchrift = `700 ${zeilePx}px ${GROTESK}`;
  const telSchrift = `400 ${telPx}px ${mono}`;
  const telB = Math.max(
    weite(TELEFON_ANZEIGE, telSchrift, telPx * 0.02),
    weite(zeile, zeileSchrift, zeilePx * 0.16),
  );
  const spalt = story ? 44 : 34;
  const daneben = pillenB + spalt + telB <= breite;
  if (!daneben && Math.max(pillenB, telB) > breite) k.eng.wert = true;
  const telH = zeilePx * 1.5 + telPx;
  const hoehe = daneben ? h : h + (story ? 30 : 24) + telH;
  const gesamtB = daneben ? pillenB + spalt + telB : Math.max(pillenB, telB);
  return {
    hoehe,
    zeichne: (x, y, t) => {
      if (t < T_CTA) return;
      const links = achse === "mitte" ? x + (breite - gesamtB) / 2 : x;
      const px0 =
        !daneben && achse === "mitte" ? x + (breite - pillenB) / 2 : links;
      ctx.save();
      // Aufgedrückt: zwei Bilder etwas groß, dann sitzt die Pille.
      const gross = t < T_CTA + 2 / 30 ? 1.04 : 1;
      ctx.save();
      ctx.translate(px0 + pillenB / 2, y + h / 2);
      ctx.scale(gross, gross);
      ctx.translate(-(px0 + pillenB / 2), -(y + h / 2));
      rund(ctx, px0, y, pillenB, h, h / 2);
      ctx.fillStyle = pille;
      ctx.fill();
      ctx.font = schrift;
      sperren(ctx, -px * 0.012);
      ctx.fillStyle = aufPille;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(ANFRAGE_ADRESSE, px0 + innen, y + h / 2 + 1);
      sperren(ctx, 0);
      // Pfeil in der Pille: eine gerade Linie mit offener Spitze.
      const pa = px0 + innen + textB + px * 0.55;
      const pm = y + h / 2 + 1;
      ctx.strokeStyle = aufPille;
      ctx.lineWidth = Math.max(3.5, px * 0.1);
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(pa, pm);
      ctx.lineTo(pa + pfeil, pm);
      ctx.moveTo(pa + pfeil - px * 0.34, pm - px * 0.3);
      ctx.lineTo(pa + pfeil, pm);
      ctx.lineTo(pa + pfeil - px * 0.34, pm + px * 0.3);
      ctx.stroke();
      ctx.restore();
      // Das Telefon kommt vier Bilder später.
      if (t >= T_CTA + 4 / 30) {
        const tx = daneben
          ? px0 + pillenB + spalt
          : achse === "mitte"
            ? x + (breite - telB) / 2
            : links;
        const ty = daneben ? y + (h - telH) / 2 : y + h + (story ? 30 : 24);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = zeileSchrift;
        sperren(ctx, zeilePx * 0.16);
        ctx.fillStyle = farben.weich;
        ctx.fillText(zeile, tx, ty + zeilePx * 0.86);
        ctx.font = telSchrift;
        sperren(ctx, telPx * 0.02);
        ctx.fillStyle = farben.schrift;
        ctx.fillText(TELEFON_ANZEIGE, tx - 1, ty + zeilePx * 1.5 + telPx * 0.8);
        sperren(ctx, 0);
      }
      ctx.restore();
    },
  };
}

/** Die Einladung gibt beim Aufdrücken ihres Kontaktblocks kurz nach. */
const CTA_FEDER = { t: T_CTA, px: 5 };

/**
 * Serie: wie die Pointe je nach Aufgabe des Bildes steht. Problem und
 * Lösung sind ein Paar: dasselbe Feld um die Pointe, beim Problem leer
 * (nur der Rahmen), bei der Lösung gefüllt. Aufhänger und Einladung
 * tragen die Pointe so, wie die Gestaltung sie sonst trägt.
 */
function rollenStil(k: Basis): Partial<SatzStil> {
  const rolle = rolleVon(k);
  if (rolle === "problem") return { pointe: "balken", rahmen: true };
  if (rolle === "loesung") return { pointe: "balken" };
  return {};
}
/** Farben des Satzes dazu: im gefüllten Feld der Lösung steht die Pointe in der Schrift, die darauf trägt. */
function rollenFarben(k: Basis, text: string, akzent: string): SatzFarben {
  return {
    text,
    balken: akzent,
    pointe: rolleVon(k) === "loesung" ? pillenSchrift(akzent) : akzent,
  };
}

/**
 * Magazin: wie ein Titelblatt. Oben die Kennzeile (Sitalo Journal und
 * Datum) über einer Haarlinie; darunter mit viel Luft der Kicker in
 * Kapitälchen zwischen Geviertstrichen, der Satz groß in der aufrechten
 * Cormorant, die Pointe kursiv in der Akzentfarbe, unter einer kurzen
 * Linie der Zusatz als kursiver Vorspann. Die Achse ist streng: mittig
 * oder links (je nach Tag, Stelle „aufkleber“). Bei einem Anlass steht
 * er in der Titelzeile über dem Satz, die Reihe wandert in die Kennzeile.
 * Hafen und Wortmarke stehen wie immer am Fuß.
 */
function magazin(k: Basis): Maler {
  const { ctx, f, karte, serif } = k;
  const l = lookFuer(k);
  const farben = rahmenFarben(l);
  const flagge = flaggeFuer(k);
  const achse: "links" | "mitte" = k.v.aufkleber === "band" ? "links" : "mitte";
  const mitte = achse === "mitte";
  const story = f.name === "story";
  const breite = f.b - RAND * 2;
  const flaechen = [l.bg, l.bg2];
  const akzent = farbeAuf(
    flaechen,
    [...(flagge ? [flagge] : []), marke(l), ORANGE_TIEF, l.text],
    3,
  );
  const anlass = karte.anlass?.trim() || null;
  // Serie: Titelzeile und Vorspann stehen in jedem Bild an derselben
  // Stelle, der Satz mittig dazwischen. Der Aufhänger ist das Titelblatt
  // (Titel als Pille, größte Schrift), die Einladung trägt unten den
  // Kontaktblock.
  const rolle = rolleVon(k);
  const titelblatt = rolle === "aufhaenger";
  const cta = ctaBauen(k, breite, achse, {
    pille: marke(l),
    ersatz: l.text,
    schrift: l.text,
    weich: l.weich,
  });
  // Kennzeile: links Sitalo Journal (bei einem Anlass die Reihe), rechts das Datum.
  const kopf = kopfBauen(
    k,
    { etikett: l.weich, etikettText: l.weich, datum: l.weich },
    anlass ? karte.kicker : "Sitalo Journal",
    "folio",
    false,
  );
  const haarlinie = f.oben + 62;

  // Titelzeile über dem Satz: der Kicker oder der Anlass, in Kapitälchen.
  // Auf dem Titelblatt einer Serie steht der Titel in einer gefüllten Pille.
  const titel = (anlass ?? karte.kicker).toUpperCase();
  const titelPille =
    titelblatt && anlass ? pillenFarbe(k, marke(l), l.text) : null;
  const titelText = titelPille ? titel : mitte ? `— ${titel} —` : `— ${titel}`;
  const titelSperr = titelPille ? 0.13 : 0.22;
  let titelPx = titelPille ? 26 : anlass ? 30 : 26;
  const titelSchrift = (px: number) => `700 ${px}px ${GROTESK}`;
  const titelWeite = () => {
    ctx.font = titelSchrift(titelPx);
    sperren(ctx, titelPx * titelSperr);
    const w = ctx.measureText(titelText).width - titelPx * titelSperr;
    sperren(ctx, 0);
    return w;
  };
  const titelPlatz = breite - (titelPille ? 62 : 0);
  while (titelWeite() > titelPlatz && titelPx > 18) titelPx -= 2;
  if (titelWeite() > titelPlatz) k.kopfEng = true;
  const titelB = titelWeite() + (titelPille ? 62 : 0);
  const titelH = titelPille ? 62 : Math.round(titelPx * 1.1);

  // Vorspann (Zusatz): kursiv, schmaler als der Satz.
  const deckPx = story ? 50 : 44;
  const deckBreite = Math.round(breite * (mitte ? 0.84 : 0.9));
  const deck = setzeFrei(
    k,
    karte.zusatz,
    (px) => `italic 600 ${px}px ${serif}`,
    -0.004,
    deckBreite,
    deckPx * 1.22 * 3,
    deckPx,
    deckPx - 10,
    1.22,
    achse,
  );
  const luft = story
    ? { titel: 64, linie: 60, deck: 46 }
    : { titel: 44, linie: 42, deck: 34 };
  const hoch = k.unten - k.oben;
  // Serie: fester Stand der Titelzeile oben und des Vorspanns unten.
  const rand = story ? 22 : 10;
  const ctaLuft = story ? 56 : 40;
  const ctaY = k.unten - rand - (cta?.hoehe ?? 0);
  const deckUnten = cta ? ctaY - ctaLuft : k.unten - rand;
  const platz = k.serie
    ? deckUnten -
      deck.hoehe -
      luft.deck -
      luft.linie -
      (k.oben + rand + titelH + luft.titel)
    : hoch - titelH - luft.titel - luft.linie - luft.deck - deck.hoehe - 24;
  const satz = setzeSatz(
    k,
    planFuer(karte),
    breite,
    platz,
    serifSatz(k, {
      achse,
      maxG: (story ? 152 : 128) + (titelblatt ? (story ? 32 : 24) : 0),
      ...rollenStil(k),
    }),
  );
  const gesamt =
    titelH + luft.titel + satz.hoehe + luft.linie + luft.deck + deck.hoehe;
  const oben = k.serie
    ? k.oben + rand
    : k.oben + Math.max(0, hoch - gesamt) * 0.52;
  const titelY = oben;
  const y = k.serie
    ? titelY + titelH + luft.titel + Math.max(0, platz - satz.hoehe) * 0.46
    : titelY + titelH + luft.titel;
  const linieY = k.serie
    ? deckUnten - deck.hoehe - luft.deck
    : y + satz.hoehe + luft.linie;
  const deckY = linieY + luft.deck;
  const titelX = mitte ? RAND + (breite - titelB) / 2 : RAND;
  const deckX = mitte ? RAND + (breite - deckBreite) / 2 : RAND;
  const linieLang = 96;
  const linieX = mitte ? RAND + (breite - linieLang) / 2 : RAND;
  const satzFarbe = rollenFarben(k, l.text, akzent);

  k.regie = regieFuer(k, {
    // Die Kamera beginnt nah an der Titelzeile, der Satz bleibt draußen.
    nah: nahAuf(
      k,
      { x: titelX, y: titelY - 10, b: titelB, h: titelH + 20 },
      2.6,
      y,
    ),
    x: RAND,
    y,
    satz,
  });
  if (cta) k.regie.feder.push(CTA_FEDER);

  return (t) => {
    grund(k, l, false);
    kopf();
    // Haarlinie unter der Kennzeile.
    ctx.fillStyle = mitDeck(l.text, l.dunkel ? 0.4 : 0.32);
    ctx.fillRect(RAND, haarlinie, breite, 2);
    // Titelzeile.
    ctx.save();
    if (titelPille) {
      rund(ctx, titelX, titelY, titelB, titelH, titelH / 2);
      ctx.fillStyle = titelPille;
      ctx.fill();
    }
    ctx.font = titelSchrift(titelPx);
    sperren(ctx, titelPx * titelSperr);
    ctx.fillStyle = titelPille ? pillenSchrift(titelPille) : akzent;
    ctx.textBaseline = "middle";
    ctx.fillText(
      titelText,
      titelX + (titelPille ? 31 : 0),
      titelY + titelH / 2 + (titelPille ? 2 : 0),
    );
    sperren(ctx, 0);
    ctx.restore();
    satz.zeichne(RAND, y, t, satzFarbe);
    if (karte.kicker === "Mythos")
      mythosStriche(k, satz, RAND, y, t, akzent, 0.24);
    linieMalen(k, linieX, linieY, linieLang, t, akzent);
    deck.zeichne(deckX, deckY, l.weich, (i) => t >= T_ZUSATZ + (i * 4) / 30);
    cta?.zeichne(RAND, ctaY, t);
    weiterMalen(k, k.unten - rand - deckPx * 1.22, t, l.weich);
    fuss(k, t, farben.fuss);
    korn(k, 0.08);
  };
}

/**
 * Farbfeld: Farbflächen wie auf einem Plakat. Eine kräftige Fläche füllt
 * den größten Teil, darauf der Satz in hohem Kontrast und die Pointe auf
 * einem Balken (oft in der Farbe des Papiers). Die Elbe-Linie mit Hamburg
 * ist der Horizont: Darunter liegt ruhiges Papier mit dem Zusatz und der
 * Wortmarke. Beide Flächen reichen weit über den Rand (Kamera, Federn).
 * Bei Red Flag und Green Flag ist das Feld die Farbe der Flagge.
 */
function farbfeld(k: Basis): Maler {
  const { ctx, f, karte } = k;
  const l = lookFuer(k);
  const flagge = flaggeFuer(k);
  const feld = flagge ?? l.feld;
  const feldText = flagge ? "#ffffff" : l.feldText;
  const marker = flagge ? PAPIER : l.feldMarker;
  const betont = flagge ?? l.feldBetont;
  const { papier, papierText } = l;
  const feldHell = helligkeit(feld) > 0.36;
  const story = f.name === "story";
  const breite = f.b - RAND * 2;
  // Serie: Der Horizont liegt in jedem Bild gleich hoch; nur die
  // Einladung hat mehr Papier, darauf steht ihr Kontaktblock. Das Problem
  // trägt seine Pointe im leeren Rahmen.
  const rolle = rolleVon(k);
  const cta = ctaBauen(k, breite, "links", {
    pille: ORANGE,
    ersatz: papierText,
    schrift: papierText,
    weich: mitDeck(papierText, 0.78),
  });
  const kopf = kopfBauen(
    k,
    {
      etikett: feldText,
      etikettText: feldText,
      datum: mitDeck(feldText, 0.8),
      anlass: farbeAuf([feld], [marker, feldText], 3),
      titel: marker,
    },
    karte.kicker,
    "linie",
  );
  // Papier unten: Zusatz mit Abstand unter der Linie, Wortmarke am Fuß.
  const zusatz = setzeZusatz(k, breite);
  const unterLinie = story ? 104 : 86;
  const ctaLuft = story ? 50 : 38;
  // Serie: Platz für drei Zeilen Zusatz, auch wenn er kürzer ist.
  const papierHoch = k.serie
    ? Math.max(
        48 * 1.32 * 3,
        zusatz.hoehe + (cta ? ctaLuft + cta.hoehe + (story ? 24 : 4) : 0),
      )
    : zusatz.hoehe;
  const horizont = Math.round(
    Math.min(
      f.unten - 120 - papierHoch - unterLinie,
      f.h * (story ? 0.7 : 0.74),
    ),
  );
  k.horizont = horizont;
  // Hamburg ist hier der Horizont des ganzen Plakats: größer als am Fuß.
  k.stadtGross = 1.35;
  const zusatzY = horizont + unterLinie;
  // Über der Linie steht Hamburg; der Satz endet mit Abstand darüber.
  const satzUnten = horizont - (story ? 200 : 150);
  // Die Blöcke der Pointe stehen gerade wie gedruckte Farbflächen.
  const satz = setzeSatz(k, planFuer(karte), breite, satzUnten - k.oben, {
    maxG: story ? 140 : 124,
    schraeg: 0,
    rahmen: rolle === "problem",
    // Serie: Ein „ steht nicht wie ein Umlaut über der nächsten Zeile.
    luft: k.serie ? { tief: 0.16 } : undefined,
  });
  const y = lage(k, k.oben, satzUnten, satz.hoehe);
  k.hafenBand = [y + satz.hoehe + 40, zusatzY - 30];
  const akzentPapier = farbeAuf([papier], [ORANGE, ORANGE_TIEF], 3);
  // Der leere Rahmen des Problems muss sich vom Feld abheben.
  const rahmen = kontrast(marker, feld) >= 2.2 ? marker : feldText;

  ctx.font = `700 26px ${GROTESK}`;
  sperren(ctx, 3.4);
  const etikettB = ctx.measureText(karte.kicker.toUpperCase()).width + 52;
  sperren(ctx, 0);
  k.regie = regieFuer(k, {
    nah: nahAuf(k, { x: RAND, y: f.oben + 6, b: etikettB, h: 62 }, 2.4),
    x: RAND,
    y,
    satz,
  });
  if (cta) k.regie.feder.push(CTA_FEDER);
  const fussFarben: FussFarben = {
    schrift: papierText,
    weich: mitDeck(papierText, 0.78),
    linie: mitDeck(feldHell ? "#0f2a3a" : feld, 0.45),
    ring: akzentPapier,
    schiff: feldText,
    flaeche: feld,
    hell: true,
    stadtHell: feldHell,
    ohneWasser: true,
    streif: marker === feld ? feldText : marker,
    stadt: mitDeck(feldText, feldHell ? 0.2 : 0.24),
  };

  return (t) => {
    const u = 260;
    ctx.save();
    ctx.fillStyle = feld;
    ctx.fillRect(-u, -u, f.b + u * 2, f.h + u * 2);
    // Das Papier ist das Wasser: Es beginnt genau an der Welle.
    const { welle } = welleBauen(k, t);
    welle(true);
    ctx.lineTo(f.b + 400, f.h + 400);
    ctx.lineTo(-600, f.h + 400);
    ctx.closePath();
    ctx.fillStyle = papier;
    ctx.fill();
    ctx.restore();
    kopf();
    satz.zeichne(
      RAND,
      y,
      t,
      rolle === "problem"
        ? { text: feldText, balken: rahmen, pointe: feldText }
        : { text: feldText, balken: marker, pointe: betont },
    );
    if (karte.kicker === "Mythos")
      mythosStriche(k, satz, RAND, y, t, marker, 0.36);
    zusatz.zeichne(RAND, zusatzY, t, papierText, akzentPapier);
    cta?.zeichne(RAND, zusatzY + zusatz.hoehe + ctaLuft, t);
    weiterMalen(k, zusatzY + 92, t, mitDeck(papierText, 0.78));
    fuss(k, t, fussFarben);
    korn(k, 0.08);
  };
}

/** Akzent auf den Flächen: die Flagge, sonst Orange (oder sein Ersatz), notfalls die Schrift. */
function akzentAuf(
  flaechen: string[],
  l: StoryLook,
  flagge: string | null,
  schrift = l.text,
): string {
  return farbeAuf(
    flaechen,
    [...(flagge ? [flagge] : []), marke(l), ORANGE, ORANGE_TIEF, schrift],
    // Große Schrift und Flächen: 2,9 : 1 genügt (das Orange auf dem
    // dunklen Hafenblau liegt knapp unter 3).
    2.9,
  );
}

/**
 * Satz in fetter Grotesk (800) mit aufrechter Pointe in derselben
 * Schrift: Sie hebt sich nur durch die Farbe ab (oder einen Strich
 * darunter), wie im Schweizer Satz und auf einer Titelseite.
 */
function groteskSatz(stil: Partial<SatzStil> = {}): SatzStil {
  const sperrung = stil.sperrung ?? -0.045;
  const schrift = (g: number) => `800 ${g}px ${GROTESK}`;
  return {
    ...KLASSIK_SATZ,
    schrift,
    sperrung,
    zeile: 1,
    wort: 0.22,
    ober: 0.84,
    kapp: 0.74,
    pointe: "farbe",
    fluss: 1,
    block: 1,
    blockMin: 0.8,
    blockMax: 320,
    schraeg: 0,
    pointeSchrift: schrift,
    pointeSperrung: sperrung,
    gerade: true,
    kurzAllein: true,
    ...stil,
  };
}

/** Der Satzplan in Versalien (ß wird SS). */
function versalPlan(plan: SatzPlan): SatzPlan {
  const gross = (t: string) => t.toLocaleUpperCase("de-DE");
  return plan.art === "block"
    ? {
        art: "block",
        vor: plan.vor.map((g) => g.map(gross)),
        pointe: plan.pointe.map(gross),
      }
    : {
        art: "fluss",
        gruppen: plan.gruppen.map((g) =>
          g.map((w) => ({ ...w, t: gross(w.t) })),
        ),
      };
}

/**
 * Pfeil wie mit dem Lineal gezogen (vier Stellungen ab T_PFEIL), im
 * Standbild ganz: eine gerade Linie mit offener Spitze.
 */
function linealPfeil(
  k: Basis,
  x: number,
  y: number,
  lang: number,
  t: number,
  farbe: string,
) {
  if (t < T_PFEIL) return;
  const { ctx } = k;
  const stellung = Math.min(4, Math.floor((t - T_PFEIL) * 12) + 1);
  const ende = x + (lang * stellung) / 4;
  ctx.save();
  ctx.strokeStyle = farbe;
  ctx.lineWidth = 3;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ende, y);
  if (stellung === 4) {
    ctx.moveTo(ende - 16, y - 13);
    ctx.lineTo(ende, y);
    ctx.lineTo(ende - 16, y + 13);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Raster: Schweizer Stil. Ein Satzspiegel aus sechs Spalten ist zu
 * sehen: Zwei Linien über die ganze Breite trennen Kopf, Feld und Fuß,
 * kleine Marken auf den Linien zeigen die Spalten. Oben in einer Zelle
 * steht die Reihe, rechts das Datum (mit Anlass). Der Satz steht riesig
 * in fetter Grotesk, linksbündig im Flattersatz, unten im Feld; die
 * Pointe nur in der Akzentfarbe. Oben rechts im Feld ein Quadrat in der
 * Akzentfarbe, das einzige Ornament. Der Zusatz hat seine eigene Spalte
 * (Spalten drei bis sechs), links davon zeigt ein Pfeil auf ihn.
 */
function raster(k: Basis): Maler {
  const { ctx, f, karte } = k;
  const l = lookFuer(k);
  const farben = rahmenFarben(l);
  const flagge = flaggeFuer(k);
  const story = f.name === "story";
  const breite = f.b - RAND * 2;
  const zwischen = 24;
  const spalte = (breite - zwischen * 5) / 6;
  const spalteX = (i: number) => RAND + i * (spalte + zwischen);
  const akzent = akzentAuf([l.bg, l.bg2], l, flagge);
  // Trägt keine Akzentfarbe, steht die Pointe mit einem Strich darunter.
  const mitFarbe = akzent !== l.text;
  // Serie: Die untere Linie liegt in jedem Bild gleich hoch. Beim Problem
  // ist das Quadrat leer (nur der Rahmen), bei der Lösung gefüllt; die
  // Einladung trägt statt des Quadrats unten den Kontaktblock.
  const rolle = rolleVon(k);
  const cta = ctaBauen(k, breite, "links", {
    pille: marke(l),
    ersatz: l.text,
    schrift: l.text,
    weich: l.weich,
  });
  const kopf = kopfBauen(
    k,
    {
      etikett: l.text,
      etikettText: l.text,
      datum: l.weich,
      anlass: anlassFarbe(l.bg, l.bg2, l),
      titel: akzent,
    },
    karte.kicker,
    "zelle",
  );
  const linieOben = f.oben + 80;
  // Der Zusatz in seiner Spalte, unten bündig mit dem Textfeld.
  const zPx = story ? 44 : 40;
  const zX = spalteX(2);
  const zusatz = setzeFrei(
    k,
    karte.zusatz,
    (px) => `500 ${px}px ${GROTESK}`,
    0,
    f.b - RAND - zX,
    zPx * 1.3 * 4,
    zPx,
    zPx - 8,
    1.3,
  );
  const ctaLuft = story ? 48 : 34;
  const ctaY = k.unten - (cta?.hoehe ?? 0);
  // Serie: Platz für vier Zeilen Zusatz, auch wenn er kürzer ist (bei
  // der Einladung drei: Darunter steht der Kontaktblock).
  const zusatzY = k.serie
    ? (cta ? ctaY - ctaLuft : k.unten) -
      Math.max(zusatz.hoehe, zPx * 1.3 * (cta ? 3 : 4))
    : k.unten - zusatz.hoehe;
  const linieUnten = Math.round(zusatzY - (story ? 46 : 34));
  const feldUnten = linieUnten - (story ? 54 : 40);
  // Oben im Feld bleibt mindestens Platz für ein kleines Quadrat. In
  // einer Serie ist es in jedem Bild gleich groß.
  const luft = story ? 52 : 38;
  const quadratFest = k.serie ? (story ? 104 : 84) : 72;
  const satz = setzeSatz(
    k,
    planFuer(karte),
    breite,
    feldUnten - k.oben - (cta ? 0 : quadratFest) - luft,
    groteskSatz({
      maxG: (story ? 184 : 156) + (rolle === "aufhaenger" ? 16 : 0),
      pointe: mitFarbe ? "farbe" : "linie",
      // Serie: Ein „ steht nicht wie ein Umlaut über der nächsten Zeile.
      luft: k.serie ? { tief: 0.16 } : undefined,
      ...rollenStil(k),
    }),
  );
  const y = feldUnten - satz.hoehe;
  // Das Quadrat ist eine oder zwei Spalten breit, je nach freiem Platz.
  const quadrat = cta
    ? 0
    : k.serie
      ? quadratFest
      : Math.round(
          Math.min(
            spalte * 2 + zwischen,
            (k.unten - k.oben) * 0.22,
            y - luft - k.oben,
          ),
        );
  const qx = f.b - RAND - quadrat;
  const qy = k.oben;

  k.regie = regieFuer(k, {
    nah:
      quadrat >= 40
        ? nahAuf(k, { x: qx, y: qy, b: quadrat, h: quadrat }, ZOOM_NAH, y)
        : nahEtikett(k),
    x: RAND,
    y,
    satz,
  });
  if (cta) k.regie.feder.push(CTA_FEDER);
  const satzFarbe = mitFarbe ? akzent : l.text;
  const satzFarben = k.serie
    ? rollenFarben(k, l.text, satzFarbe)
    : { text: l.text, balken: satzFarbe, pointe: satzFarbe };

  return (t) => {
    const u = 260;
    ctx.fillStyle = l.bg;
    ctx.fillRect(-u, -u, f.b + u * 2, f.h + u * 2);
    kopf();
    // Die Linien des Satzspiegels mit Marken für die Spalten.
    ctx.fillStyle = l.text;
    ctx.fillRect(RAND, linieOben, breite, 3);
    ctx.fillRect(RAND, linieUnten, breite, 3);
    ctx.fillStyle = mitDeck(l.text, l.dunkel ? 0.55 : 0.5);
    for (let i = 1; i < 6; i++) {
      const mx = spalteX(i) - zwischen / 2 - 1;
      ctx.fillRect(mx, linieOben + 3, 2, 12);
      ctx.fillRect(mx, linieUnten - 12, 2, 12);
    }
    if (quadrat >= 40) {
      if (rolle === "problem") {
        // Leeres Quadrat: nur sein Rahmen, innen an der Kante entlang.
        const strich = Math.max(6, quadrat * 0.045);
        ctx.strokeStyle = akzent;
        ctx.lineWidth = strich;
        ctx.lineJoin = "miter";
        ctx.strokeRect(
          qx + strich / 2,
          qy + strich / 2,
          quadrat - strich,
          quadrat - strich,
        );
      } else {
        ctx.fillStyle = akzent;
        ctx.fillRect(qx, qy, quadrat, quadrat);
      }
    }
    satz.zeichne(RAND, y, t, satzFarben);
    if (karte.kicker === "Mythos")
      mythosStriche(k, satz, RAND, y, t, akzent, 0.36);
    linealPfeil(
      k,
      RAND,
      zusatzY + zPx * 0.56,
      zX - zwischen - RAND - 12,
      t,
      l.text,
    );
    zusatz.zeichne(zX, zusatzY, l.text, (i) => t >= T_ZUSATZ + (i * 4) / 30);
    cta?.zeichne(RAND, ctaY, t);
    weiterMalen(k, k.unten - zPx * 1.3 * 4 + zPx * 0.56, t, l.text);
    fuss(k, t, farben.fuss);
    korn(k, 0.07);
  };
}

/**
 * Schlagzeile: wie eine Titelseite auf Zeitungspapier. Oben ein Balken
 * über die ganze Breite mit dem Anlass (sonst der Reihe) und dem Datum,
 * darunter eine doppelte Linie. Der Satz steht in fetten Versalien mit
 * engem Zeilenabstand, die Pointe in der Akzentfarbe. Unter einer Linie
 * zwei Spalten mit Spaltenlinie: links Ort und Reihe, rechts der Zusatz
 * als Zitat mit großem Anführungszeichen.
 */
function schlagzeile(k: Basis): Maler {
  const { ctx, f, karte, serif, mono } = k;
  const l = lookFuer(k);
  const flagge = flaggeFuer(k);
  const story = f.name === "story";
  const breite = f.b - RAND * 2;
  const { papier, papierText } = l;
  const kopfFarbe = flagge ?? l.feld;
  const kopfText = flagge ? "#ffffff" : l.feldText;
  const akzent = akzentAuf([papier], l, flagge, papierText);
  const mitFarbe = akzent !== papierText;
  const anlass = karte.anlass?.trim() || null;
  // Serie: Der Aufhänger ist die Titelseite mit hohem Kopfbalken und
  // großem Titel, die folgenden Bilder tragen ihn als schmale Kopfzeile;
  // rechts steht statt des Datums die Stelle des Bildes. Die Linie über
  // den Spalten liegt in jedem Bild gleich hoch, die Einladung trägt
  // unten den Kontaktblock.
  const rolle = rolleVon(k);
  const titelseite = rolle === "aufhaenger";
  const cta = ctaBauen(k, breite, "links", {
    pille: ORANGE,
    ersatz: papierText,
    schrift: papierText,
    weich: mitDeck(papierText, 0.78),
  });

  // Kopfbalken: Anlass oder Reihe links, Datum rechts.
  const balkenH = (story ? 88 : 76) + (titelseite ? (story ? 36 : 24) : 0);
  const balkenMitte = f.oben + balkenH / 2;
  const titel = (anlass ?? karte.kicker).toLocaleUpperCase("de-DE");
  const datum = zaehler(k) ?? karte.datumKurz.toUpperCase();
  const titelSchrift = (px: number) => `800 ${px}px ${GROTESK}`;
  const weite = (text: string, schrift: string, sperrung: number) => {
    ctx.font = schrift;
    sperren(ctx, sperrung);
    const w = ctx.measureText(text).width;
    sperren(ctx, 0);
    return w;
  };
  const datumPx = k.serie ? 32 : 24;
  const datumB = weite(datum, `400 ${datumPx}px ${mono}`, datumPx * 0.06);
  let titelPx = (story ? 34 : 30) + (titelseite ? (story ? 16 : 12) : 0);
  while (
    titelPx > 20 &&
    weite(titel, titelSchrift(titelPx), titelPx * 0.08) + 36 + datumB > breite
  )
    titelPx -= 2;
  const titelB = weite(titel, titelSchrift(titelPx), titelPx * 0.08);
  if (titelB + 36 + datumB > breite) k.kopfEng = true;
  const doppel = f.oben + balkenH + 12;

  // Unten zwei Spalten: Ort und Reihe, dann das Zitat.
  const zwischen = 24;
  const spalte = (breite - zwischen * 5) / 6;
  const metaB = Math.round(spalte * 2 + zwischen * 0.5);
  const spaltenLinie = RAND + metaB + 4;
  const zitatX = spaltenLinie + 28;
  const zPx = story ? 50 : 44;
  // Das große Zeichen vor dem Zitat: ein Guillemet, das auf den Text zeigt.
  const zeichenSchrift = `italic 600 ${Math.round(zPx * 2.3)}px ${serif}`;
  ctx.font = zeichenSchrift;
  const anf = ctx.measureText("»");
  const markeB = anf.actualBoundingBoxLeft + anf.actualBoundingBoxRight;
  const einzug = Math.round(markeB + zPx * 0.4);
  const zitat = setzeFrei(
    k,
    `${karte.zusatz}«`,
    (px) => `italic 600 ${px}px ${serif}`,
    -0.004,
    f.b - RAND - zitatX - einzug,
    zPx * 1.2 * 4,
    zPx,
    zPx - 10,
    1.2,
  );
  const meta = [
    { text: "HAMBURG", schrift: `800 24px ${GROTESK}`, sperrung: 2.8 },
    {
      text: (anlass ? karte.kicker : "Sitalo Journal").toUpperCase(),
      schrift: `400 22px ${mono}`,
      sperrung: 1.6,
    },
  ];
  const metaH = 24 * 1.5 + 22 * 1.5;
  // Serie: Platz für vier Zeilen Zitat, auch wenn es kürzer ist (bei der
  // Einladung drei: Darunter steht der Kontaktblock).
  const untenH = Math.max(
    zitat.hoehe,
    metaH,
    k.serie ? zPx * 1.2 * (rolle === "einladung" ? 3 : 4) : 0,
  );
  const luftLinie = story ? 40 : 30;
  const oben = Math.max(k.oben, doppel + (story ? 52 : 38));
  const luftSatz = story ? 56 : 40;
  const ctaLuft = story ? 44 : 32;
  const ctaY = k.unten - (cta?.hoehe ?? 0);
  const platz =
    (cta ? ctaY - ctaLuft : k.unten) - oben - untenH - luftLinie - luftSatz;
  const satz = setzeSatz(
    k,
    versalPlan(planFuer(karte)),
    breite,
    platz,
    groteskSatz({
      maxG: story ? 172 : 148,
      minG: 48,
      sperrung: -0.02,
      zeile: 0.96,
      ober: 0.9,
      kapp: 0.74,
      wort: 0.24,
      pointe: mitFarbe ? "farbe" : "linie",
      // Serie: Die Punkte großer Umlaute, ein „ und ein Komma stoßen
      // nicht an die Nachbarzeile.
      luft: k.serie ? { tief: 0.16, umlaut: 0.1, komma: 0.08 } : undefined,
      ...rollenStil(k),
    }),
  );
  // Die Spalten stehen unten auf dem Textfeld, die Schlagzeile etwas über
  // der Mitte des Raums darüber: kein leeres Loch am Fuß der Seite.
  const frei = Math.max(0, platz - satz.hoehe);
  const y = oben + frei * 0.42;
  const linieY = Math.round(oben + platz + luftSatz);
  const untenY = linieY + luftLinie;

  k.regie = regieFuer(k, {
    // Die Kamera beginnt nah am Kopfbalken, der Satz bleibt draußen.
    nah: nahAuf(
      k,
      { x: RAND, y: f.oben + 6, b: titelB + 20, h: balkenH - 12 },
      2.4,
      y,
    ),
    x: RAND,
    y,
    satz,
    baender: [
      [f.oben - 6, f.oben + balkenH + 22],
      [f.unten - 84, f.unten - 14],
    ],
  });
  if (cta) k.regie.feder.push(CTA_FEDER);
  const fussFarben: FussFarben = {
    schrift: papierText,
    weich: mitDeck(papierText, 0.78),
    linie: mitDeck(papierText, 0.32),
    ring: farbeAuf([papier], [ORANGE, ORANGE_TIEF], 3),
    schiff: papierText,
    flaeche: papier,
    hell: true,
  };
  const satzFarbe = mitFarbe ? akzent : papierText;
  const satzFarben = k.serie
    ? rollenFarben(k, papierText, satzFarbe)
    : { text: papierText, balken: satzFarbe, pointe: satzFarbe };

  return (t) => {
    const u = 260;
    ctx.fillStyle = papier;
    ctx.fillRect(-u, -u, f.b + u * 2, f.h + u * 2);
    // Kopfbalken über die ganze Breite (reicht über den Rand).
    ctx.fillStyle = kopfFarbe;
    ctx.fillRect(-u, f.oben, f.b + u * 2, balkenH);
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.font = titelSchrift(titelPx);
    sperren(ctx, titelPx * 0.08);
    ctx.fillStyle = kopfText;
    ctx.fillText(titel, RAND, balkenMitte + 1);
    ctx.font = `400 ${datumPx}px ${mono}`;
    sperren(ctx, datumPx * 0.06);
    ctx.fillStyle = mitDeck(kopfText, 0.86);
    ctx.textAlign = "right";
    ctx.fillText(datum, f.b - RAND + datumPx * 0.06, balkenMitte + 1);
    sperren(ctx, 0);
    ctx.restore();
    // Doppelte Linie unter dem Kopf.
    ctx.fillStyle = papierText;
    ctx.fillRect(RAND, doppel, breite, 3);
    ctx.fillRect(RAND, doppel + 8, breite, 1.5);
    satz.zeichne(RAND, y, t, satzFarben);
    if (karte.kicker === "Mythos")
      mythosStriche(k, satz, RAND, y, t, akzent, 0.38);
    // Linie über den Spalten, Spaltenlinie, links Ort und Reihe.
    ctx.fillStyle = papierText;
    ctx.fillRect(RAND, linieY, breite, 2);
    ctx.fillStyle = mitDeck(papierText, 0.6);
    ctx.fillRect(spaltenLinie, untenY - 4, 1.5, untenH + 8);
    ctx.save();
    ctx.textBaseline = "alphabetic";
    meta.forEach((m, i) => {
      ctx.font = m.schrift;
      sperren(ctx, m.sperrung);
      ctx.fillStyle = i ? mitDeck(papierText, 0.72) : papierText;
      ctx.fillText(m.text, RAND, untenY + 24 + i * 36);
    });
    sperren(ctx, 0);
    // Das große Anführungszeichen kommt mit dem Zitat (zwei Bilder
    // etwas groß, dann sitzt es).
    if (t >= T_PFEIL) {
      const gross = t < T_PFEIL + 2 / 30 ? 1.04 : 1;
      const mx = zitatX + anf.actualBoundingBoxLeft;
      // Mittig auf der Mittellänge der ersten Zeile.
      const my =
        untenY +
        zPx * 0.86 -
        zPx * 0.2 +
        (anf.actualBoundingBoxAscent - anf.actualBoundingBoxDescent) / 2;
      ctx.translate(mx, my);
      ctx.scale(gross, gross);
      ctx.font = zeichenSchrift;
      ctx.fillStyle = akzent;
      ctx.fillText("»", 0, 0);
    }
    ctx.restore();
    zitat.zeichne(
      zitatX + einzug,
      untenY,
      papierText,
      (i) => t >= T_ZUSATZ + (i * 4) / 30,
    );
    cta?.zeichne(RAND, ctaY, t);
    weiterMalen(k, k.unten - zPx * 1.2 * 4 + zPx * 0.6, t, papierText);
    fuss(k, t, fussFarben);
    korn(k, 0.1);
  };
}

const WOCHENTAGE = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];
const MONATE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
/** Wochentag, Tag und Monat eines Kalendertags (yyyy-mm-dd). */
function kalenderTag(datum: string) {
  const [j, m, t] = datum.split("-").map(Number);
  return {
    tag: String(t),
    wochentag: WOCHENTAGE[new Date(Date.UTC(j, m - 1, t)).getUTCDay()],
    monat: MONATE[m - 1],
  };
}

/**
 * Kalenderblatt (tagesaktuelle Posts): ein Abreißkalender als Requisit,
 * oben links, mit Kopfband, Lochung, Wochentag, der Tageszahl groß in der
 * Serife und dem Monat; darunter schauen die nächsten Blätter heraus.
 * Rechts daneben „Heute“ und der Anlass als Überschrift in fetten
 * Versalien, unten bündig mit dem Blatt. Darunter der Satz (Pointe
 * kursiv, unterstrichen) und der Zusatz. Ohne Anlass (nur wenn von Hand
 * gewählt) steht die Reihe als Überschrift.
 */
function kalenderblatt(k: Basis): Maler {
  const { ctx, f, karte, serif, mono } = k;
  const l = lookFuer(k);
  const farben = rahmenFarben(l);
  const flagge = flaggenFarbe(karte);
  const story = f.name === "story";
  const breite = f.b - RAND * 2;
  const akzent = akzentAuf([l.bg, l.bg2], l, flagge);
  const kal = kalenderTag(karte.datum);
  const kopf = kopfBauen(
    k,
    { etikett: l.text, etikettText: l.text, datum: l.weich },
    karte.kicker,
    "linie",
    false,
    false,
  );

  // Der Block: ein Blatt mit Kopfband und Stapel darunter.
  const bB = story ? 336 : f.name === "karte" ? 292 : 268;
  const bH = Math.round(bB * 1.16);
  const bx = RAND;
  const by = k.oben;
  const band = Math.round(bH * 0.17);
  const bandFarbe = flagge ?? ORANGE;
  const blattText = TINTE;
  const innen = bH - band;
  const tagPx = (() => {
    ctx.font = `500 100px ${serif}`;
    const m = ctx.measureText(kal.tag);
    const hoch = m.actualBoundingBoxAscent;
    return Math.min(
      (innen * 0.5 * 100) / Math.max(1, hoch),
      (bB * 0.74 * 100) / Math.max(1, m.width),
    );
  })();
  const wtPx = Math.round(bB * 0.082);
  const moPx = Math.round(bB * 0.07);

  // Rechts neben dem Block: „Heute“ und die Überschrift.
  const spaltX = bx + bB + (story ? 48 : 40);
  const spaltB = f.b - RAND - spaltX;
  const ueber = (karte.anlass?.trim() || karte.kicker).toLocaleUpperCase(
    "de-DE",
  );
  const heutePx = 24;
  const ueberschrift = setzeFrei(
    k,
    ueber,
    (px) => `800 ${px}px ${GROTESK}`,
    -0.01,
    spaltB,
    bH - band - heutePx * 2.6,
    story ? 92 : 80,
    34,
    1.0,
  );
  const ueberY = by + bH - ueberschrift.hoehe;

  // Darunter Satz und Zusatz.
  const zusatz = setzeZusatz(k, breite);
  const satzOben = by + bH + (story ? 60 : 44);
  const luecke = story ? 40 : 32;
  const platz = k.unten - satzOben - zusatz.hoehe - luecke;
  const satz = setzeSatz(k, planFuer(karte), breite, platz, {
    pointe: "linie",
    maxG: story ? 132 : 112,
    schraeg: 0,
  });
  const frei = Math.max(0, platz - satz.hoehe);
  const y = satzOben + frei * 0.35;

  k.regie = regieFuer(k, {
    nah: nahAuf(k, { x: bx, y: by, b: bB, h: bH }, ZOOM_NAH, y),
    x: RAND,
    y,
    satz,
  });

  const blattMalen = () => {
    ctx.save();
    // Die nächsten Blätter schauen unten heraus.
    for (const i of [2, 1]) {
      ctx.fillStyle = i === 2 ? "#e6dfd2" : "#f3eee5";
      rund(ctx, bx + i * 1.5, by + i * 7, bB, bH, 12);
      ctx.fill();
    }
    schatten(k, 30, 12, 0.22);
    rund(ctx, bx, by, bB, bH, 12);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ohneSchatten(ctx);
    ctx.save();
    rund(ctx, bx, by, bB, bH, 12);
    ctx.clip();
    ctx.fillStyle = bandFarbe;
    ctx.fillRect(bx, by, bB, band);
    // Zwei Ösen im Band.
    ctx.fillStyle = mitDeck("#000000", 0.32);
    for (const a of [0.28, 0.72]) {
      ctx.beginPath();
      ctx.arc(bx + bB * a, by + band * 0.5, band * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    // Lochung: Hier wurde das Blatt von gestern abgerissen.
    ctx.fillStyle = mitDeck(TINTE, 0.16);
    for (let x = bx + 16; x < bx + bB - 10; x += 15) {
      ctx.beginPath();
      ctx.arc(x, by + band + 12, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const mx = bx + bB / 2;
    ctx.font = `700 ${wtPx}px ${GROTESK}`;
    sperren(ctx, wtPx * 0.16);
    ctx.fillStyle = blattText;
    ctx.fillText(
      kal.wochentag.toUpperCase(),
      mx + wtPx * 0.08,
      by + band + innen * 0.2,
    );
    sperren(ctx, 0);
    ctx.font = `500 ${tagPx}px ${serif}`;
    ctx.fillText(kal.tag, mx, by + band + innen * 0.76);
    ctx.font = `400 ${moPx}px ${mono}`;
    sperren(ctx, moPx * 0.2);
    ctx.fillStyle = mitDeck(TINTE, 0.72);
    ctx.fillText(
      kal.monat.toUpperCase(),
      mx + moPx * 0.1,
      by + band + innen * 0.92,
    );
    sperren(ctx, 0);
    ctx.restore();
  };

  return (t) => {
    grund(k, l, false);
    kopf();
    // Rechts im Kopf der Ort (das Datum steht auf dem Blatt).
    ctx.save();
    ctx.font = `400 24px ${mono}`;
    sperren(ctx, 3.5);
    ctx.fillStyle = l.weich;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("HAMBURG", f.b - RAND + 3, f.oben + 39);
    sperren(ctx, 0);
    ctx.restore();
    blattMalen();
    ctx.save();
    ctx.font = `700 ${heutePx}px ${GROTESK}`;
    sperren(ctx, heutePx * 0.18);
    ctx.fillStyle = akzent;
    ctx.fillText("HEUTE", spaltX, ueberY - heutePx * 0.9);
    sperren(ctx, 0);
    ctx.restore();
    ueberschrift.zeichne(spaltX, ueberY, l.text);
    satz.zeichne(RAND, y, t, { text: l.text, balken: akzent, pointe: l.text });
    if (karte.kicker === "Mythos")
      mythosStriche(k, satz, RAND, y, t, akzent, 0.36);
    zusatz.zeichne(RAND, y + satz.hoehe + luecke, t, l.weich, l.akzent);
    fuss(k, t, farben.fuss);
    korn(k, 0.09);
  };
}

/** Ein kleiner Satz mit einer Lücke, wo die Pointe hingehört (Riese). */
type Lueckensatz = {
  hoehe: number;
  px: number;
  linien: Gesetzt["linien"];
  zeichne: (x: number, y: number, farbe: string, lueckeFarbe: string) => void;
};
/**
 * Setzt vor + Lücke + nach in einer Schrift, so groß wie möglich (wie
 * setzeFrei). Die Lücke ist ein Strich von lueckeEm Geviert Länge;
 * Satzzeichen direkt davor oder danach hängen an ihr. Ohne Lücke
 * (mitLuecke false) steht nur vor.
 */
function setzeLueckensatz(
  k: Basis,
  vor: string,
  nach: string,
  mitLuecke: boolean,
  schrift: (px: number) => string,
  breite: number,
  platz: number,
  maxPx: number,
  minPx: number,
  zeilenFaktor = 1.18,
  lueckeEm = 2.6,
): Lueckensatz {
  const { ctx } = k;
  const vorW = vor.split(" ").filter(Boolean);
  const nachW = nach.split(" ").filter(Boolean);
  // Hängt etwas ohne Leerzeichen an der Lücke („ davor, Komma danach)?
  const davor = mitLuecke && vor && !/\s$/.test(vor) ? (vorW.pop() ?? "") : "";
  const danach =
    mitLuecke && nach && !/^\s/.test(nach) ? (nachW.shift() ?? "") : "";
  type T = Wort & { luecke?: boolean };
  let px = maxPx;
  let zeilen: Zeile[] = [];
  let abstand = 0;
  const messen = (p: number): T[] => {
    ctx.font = schrift(p);
    sperren(ctx, 0);
    const wort = (t: string): T => ({
      t,
      betont: false,
      breite: ctx.measureText(t).width,
    });
    const luecke: T[] = mitLuecke
      ? [
          {
            t: "",
            betont: true,
            luecke: true,
            breite:
              ctx.measureText(davor).width +
              lueckeEm * p +
              ctx.measureText(danach).width,
          },
        ]
      : [];
    return [...vorW.map(wort), ...luecke, ...nachW.map(wort)];
  };
  for (; px >= minPx; px -= 2) {
    const woerter = messen(px);
    abstand = ctx.measureText(" ").width;
    if (Math.max(...woerter.map((w) => w.breite)) > breite) continue;
    zeilen = ausgewogen(woerter, breite, abstand);
    if (zeilen.length * px * zeilenFaktor <= platz) break;
  }
  if (px < minPx) {
    k.eng.wert = true;
    px = minPx;
    zeilen = ausgewogen(messen(px), breite, ctx.measureText(" ").width);
    abstand = ctx.measureText(" ").width;
  }
  const fest = { px, abstand };
  const grund = (i: number) => i * px * zeilenFaktor + px * 0.86;
  return {
    hoehe: zeilen.length * px * zeilenFaktor,
    px,
    linien: zeilen.map((z, i) => ({
      grundlinie: grund(i),
      x0: 0,
      x1: z.breite,
      g: px,
    })),
    zeichne: (x, y, farbe, lueckeFarbe) => {
      ctx.save();
      ctx.font = schrift(fest.px);
      sperren(ctx, 0);
      ctx.textBaseline = "alphabetic";
      zeilen.forEach((z, i) => {
        let xx = x;
        const gl = y + grund(i);
        for (const w of z.woerter as T[]) {
          ctx.fillStyle = farbe;
          if (!w.luecke) ctx.fillText(w.t, xx, gl);
          else {
            ctx.fillText(davor, xx, gl);
            const a = xx + ctx.measureText(davor).width + fest.px * 0.06;
            const b = lueckeEm * fest.px - fest.px * 0.12;
            ctx.fillStyle = lueckeFarbe;
            ctx.fillRect(a, gl + fest.px * 0.1, b, Math.max(4, fest.px * 0.08));
            ctx.fillStyle = farbe;
            ctx.fillText(danach, a + b + fest.px * 0.06, gl);
          }
          xx += w.breite + fest.abstand;
        }
      });
      ctx.restore();
    },
  };
}

/**
 * Riese: Die Pointe steht als riesiges Wort über die ganze Breite (so
 * groß, wie Breite und Höhe es erlauben, in einer bis drei Zeilen), in
 * der kursiven Serife und der Akzentfarbe. Darüber steht der Satz klein,
 * mit einer Lücke, wo die Pointe hingehört; darunter der Zusatz. Ohne
 * Pointe werden die letzten Wörter zum Riesen. Beim Mythos steht der
 * Irrtum klein in Anführungszeichen (im Film durchgestrichen), der Riese
 * ist „Stimmt nicht.“
 */
function riese(k: Basis): Maler {
  const { ctx, f, karte, serif } = k;
  const l = lookFuer(k);
  const farben = rahmenFarben(l);
  const flagge = flaggeFuer(k);
  const story = f.name === "story";
  const breite = f.b - RAND * 2;
  const akzent = akzentAuf([l.bg, l.bg2], l, flagge);
  // Serie: Der kleine Satz steht in jedem Bild oben an derselben Stelle,
  // der Zusatz unten, der Riese mittig dazwischen. Die Einladung trägt
  // unten den Kontaktblock (vor dem Kopf gebaut: Seine Pille bekommt das
  // Orange).
  const rolle = rolleVon(k);
  const cta = ctaBauen(k, breite, "links", {
    pille: marke(l),
    ersatz: l.text,
    schrift: l.text,
    weich: l.weich,
  });
  const kopf = kopfBauen(k, farben.kopf, karte.kicker);
  const mythos = karte.kicker === "Mythos";

  // Was wird riesig, was steht klein darüber?
  let wort: string;
  let vor: string;
  let nach = "";
  let mitLuecke = true;
  if (mythos) {
    wort = "Stimmt nicht.";
    vor = `„${karte.text}“`;
    mitLuecke = false;
  } else {
    const [a, m, b] = teileSatz(karte.text, karte.betont);
    if (m) {
      // Satzzeichen am Satzende gehen mit in den Riesen.
      const rest = /^[.,!?:;“’)]*$/.test(b) ? b : "";
      wort = m + rest;
      vor = a;
      nach = rest ? "" : b;
    } else {
      const w = karte.text.split(" ");
      const n = w.length > 2 && w[w.length - 1].length < 6 ? 2 : 1;
      wort = w.slice(-n).join(" ");
      vor = `${w.slice(0, -n).join(" ")} `;
    }
  }

  const kleinPx = story ? 60 : 52;
  const hoch = k.unten - k.oben;
  const klein = setzeLueckensatz(
    k,
    vor,
    nach,
    mitLuecke,
    (px) => `700 ${px}px ${GROTESK}`,
    breite,
    hoch * 0.34,
    kleinPx,
    38,
  );
  const zusatz = setzeZusatz(k, breite);
  const luftOben = story ? 40 : 28;
  const luftUnten = story ? 52 : 38;
  const ctaLuft = story ? 48 : 34;
  const ctaY = k.unten - (cta?.hoehe ?? 0);
  // Serie: fester Stand oben und unten (Platz für zwei Zeilen Zusatz).
  const rand = story ? 20 : 8;
  const zusatzY0 = k.serie
    ? (cta ? ctaY - ctaLuft : k.unten - rand) -
      Math.max(zusatz.hoehe, 48 * 1.32 * 2)
    : 0;
  const platz = Math.max(
    160,
    k.serie
      ? zusatzY0 - luftUnten - (k.oben + rand + klein.hoehe + luftOben)
      : hoch - klein.hoehe - zusatz.hoehe - luftOben - luftUnten,
  );

  // Zeilen des Riesen: so geteilt, dass er am größten wird (bei fast
  // gleicher Größe lieber weniger Zeilen).
  ctx.font = `italic 600 100px ${serif}`;
  sperren(ctx, 100 * KURSIV_SPERRUNG);
  const weite = (s: string) => ctx.measureText(s).width / 100;
  const teile = wort.split(" ");
  const kandidaten: string[][] = [[wort]];
  for (let i = 1; i < teile.length; i++) {
    kandidaten.push([teile.slice(0, i).join(" "), teile.slice(i).join(" ")]);
    for (let j = i + 1; j < teile.length; j++)
      kandidaten.push([
        teile.slice(0, i).join(" "),
        teile.slice(i, j).join(" "),
        teile.slice(j).join(" "),
      ]);
  }
  const hoechstens = story ? 560 : 440;
  // Im Feld (Serie: Problem und Lösung) braucht der Riese mehr Rand.
  const imFeld = rolle === "problem" || rolle === "loesung";
  const groesse = (zeilen: string[]) =>
    Math.min(
      hoechstens,
      (breite - 10) / (Math.max(...zeilen.map(weite)) + (imFeld ? 0.24 : 0.04)),
      platz / (zeilen.length * (imFeld ? 1.21 : 1.06) + 0.26),
    );
  const wert = (z: string[]) => groesse(z) * (1 - 0.1 * (z.length - 1));
  let zeilen = kandidaten[0];
  for (const z of kandidaten) if (wert(z) > wert(zeilen)) zeilen = z;
  sperren(ctx, 0);
  const klein0 = k.eng.klein;
  const gross = setzeSatz(
    k,
    { art: "block", vor: [], pointe: zeilen },
    breite,
    platz,
    {
      pointe: "farbe",
      maxG: 40,
      minG: 40,
      block: 99,
      blockMin: 0,
      blockMax: hoechstens,
      schraeg: 0,
      ...rollenStil(k),
    },
  );
  // Der Riese zählt nicht als kleinste Schrift, wohl aber der kleine Satz.
  k.eng.klein = Math.min(klein0, klein.px);
  const gesamt =
    klein.hoehe + luftOben + gross.hoehe + luftUnten + zusatz.hoehe;
  const yKlein = k.serie
    ? k.oben + rand
    : k.oben + Math.max(0, hoch - gesamt) * 0.42;
  const y = k.serie
    ? yKlein + klein.hoehe + luftOben + Math.max(0, platz - gross.hoehe) * 0.46
    : yKlein + klein.hoehe + luftOben;
  const zusatzY = k.serie ? zusatzY0 : y + gross.hoehe + luftUnten;

  k.regie = regieFuer(k, { nah: nahEtikett(k), x: RAND, y, satz: gross });
  if (cta) k.regie.feder.push(CTA_FEDER);
  const satzFarben = rollenFarben(k, l.text, akzent);

  return (t) => {
    grund(k, l, false);
    kopf();
    klein.zeichne(RAND, yKlein, l.text, akzent);
    if (mythos) mythosStriche(k, klein, RAND, yKlein, t, akzent, 0.3);
    gross.zeichne(RAND, y, t, satzFarben);
    zusatz.zeichne(RAND, zusatzY, t, l.weich, l.akzent);
    cta?.zeichne(RAND, ctaY, t);
    weiterMalen(k, k.unten - rand - 48 * 1.32 * 2 + 30, t, l.weich);
    fuss(k, t, farben.fuss);
    korn(k, 0.09);
  };
}

/**
 * Welche Gestaltung zu welcher Reihe passt. Was für eine Reihe nicht
 * passt, weicht auf die nächste passende im Wechsel aus (zuletzt die
 * klassische, die jede Reihe hat).
 */
const LAYOUT_PASST: Record<Layout, readonly SpruchKicker[] | "alle"> = {
  klassik: "alle",
  magazin: "alle",
  farbfeld: "alle",
  raster: "alle",
  schlagzeile: "alle",
  riese: "alle",
  kalenderblatt: "alle",
};
const passt = (layout: Layout, kicker: SpruchKicker) => {
  const r = LAYOUT_PASST[layout];
  return r === "alle" || r.includes(kicker);
};

/**
 * Wer malt das Plakat? Die Gestaltung des Tages (oder die von Hand
 * gewählte), sofern sie zur Reihe passt; sonst die nächste passende in
 * der Folge des Wechsels, notfalls die klassische.
 */
function malerFuer(
  karte: SpruchTag,
  v: Variante,
  layout: Layout,
): { layout: Layout; maler: (k: Basis) => Maler } {
  let wahl: Layout = "klassik";
  if (passt(layout, karte.kicker)) wahl = layout;
  else {
    const ab = LAYOUT_FOLGE.indexOf(v.layout);
    for (let i = 1; i <= LAYOUT_FOLGE.length; i++) {
      const naechste = LAYOUT_FOLGE[(ab + i) % LAYOUT_FOLGE.length];
      if (passt(naechste, karte.kicker)) {
        wahl = naechste;
        break;
      }
    }
  }
  const maler = {
    klassik: formatFuer(karte.kicker),
    magazin,
    farbfeld,
    raster,
    schlagzeile,
    riese,
    kalenderblatt,
  }[wahl];
  return { layout: wahl, maler };
}

/** Welches klassische Format gehört zu welcher Reihe? */
function formatFuer(kicker: string): (k: Basis) => Maler {
  switch (kicker) {
    case "Red Flag":
    case "Green Flag":
      return flagge;
    case "Mythos":
      return mythos;
    case "POV":
      return pov;
    case "Hand aufs Herz":
    case "Mal ehrlich":
      return frage;
    case "Reminder":
    case "Kleiner Reminder":
    case "Merken":
      return notiz;
    case "Real Talk":
      return sprechblase;
    default:
      return plakat;
  }
}

/**
 * Bereitet die Karte vor (Schriften laden, Satz setzen, Regie festlegen)
 * und gibt eine Funktion zurück, die das Bild zur Zeit t (Sekunden)
 * zeichnet. t = Infinity ist das fertige Standbild; 0 bis STORY_DAUER
 * ergibt den Film, der im Standbild endet.
 */
export async function storyVorbereiten(
  canvas: HTMLCanvasElement,
  karte: StoryKarte,
  format: StoryFormat = FORMATE.story,
  optionen: {
    skala?: number;
    versatz?: number;
    film?: { auftritt?: Auftritt; kamera?: Kamera };
    /** Gestaltung von Hand (Prüfung aller Gestaltungen, Story-Studio). */
    layout?: Layout;
    /**
     * Kino-Kamera (lib/story-kino.ts): Das Plakat wird im Raum gefilmt.
     * aufloesung: wie fein die Textur gegenüber dem Bild ist (Standard
     * 1,5). Kann der Browser das nicht, wird flach gezeichnet.
     */
    kino?: boolean | { aufloesung?: number };
  } = {},
): Promise<StoryZeichner> {
  // skala < 1 zeichnet ein kleines Vorschaubild, versatz wählt ein
  // anderes Design als das des Tages, film legt den Ablauf des Films
  // von Hand fest (für die Prüfung aller Abläufe).
  const skala = optionen.skala ?? 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;
  const stil = getComputedStyle(document.documentElement);
  const serifRoh = stil.getPropertyValue("--font-serif").trim() || "Georgia";
  const monoRoh =
    stil.getPropertyValue("--font-brand-mono").trim() || "ui-monospace";
  const serif = `${serifRoh}, Georgia, "Times New Roman", serif`;
  const mono = `${monoRoh}, ui-monospace, Menlo, monospace`;
  // Jede Schriftfamilie einzeln laden und auf alle warten: Fehlt auf dem
  // Gerät die Ersatzschrift der Liste, bricht ein gemeinsames Laden sofort
  // ab, und der Satz würde mit der falschen Schrift vermessen.
  const lade = (schnitt: string, familien: string, text: string) =>
    familien
      .split(",")
      .map((f) => document.fonts.load(`${schnitt} ${f.trim()}`, text));
  await Promise.race([
    Promise.allSettled([
      ...lade(
        "italic 600 100px",
        serifRoh,
        `${karte.text}${karte.zusatz}?!„“ Stimmt nicht.`,
      ),
      ...lade("500 54px", serifRoh, `SITAL${karte.text}„“0123456789`),
      ...lade(
        "400 26px",
        monoRoh,
        `sitalo.de POV SITALO JOURNAL ${karte.kicker.toUpperCase()} ${karte.datumKurz}${
          istFolge(karte.folge)
            ? ` ${ANFRAGE_ADRESSE} ${TELEFON_ANZEIGE} WEITER/`
            : ""
        }`,
      ),
    ]),
    // Hängt das Netz, wird nach drei Sekunden mit Ersatzschrift gemalt.
    new Promise((fertig) => setTimeout(fertig, 3000)),
  ]);
  canvas.width = Math.round(format.b * skala);
  canvas.height = Math.round(format.h * skala);
  ctx.setTransform(skala, 0, 0, skala, 0, 0);
  // Mit der Kino-Kamera wird das Plakat auf eine eigene, feinere Fläche
  // gezeichnet; die Kamera filmt sie und gibt das Bild an canvas weiter.
  const kinoAn = !!optionen.kino && kinoBereit();
  const fein =
    typeof optionen.kino === "object" ? (optionen.kino.aufloesung ?? 1.5) : 1.5;
  const plakat = kinoAn ? document.createElement("canvas") : canvas;
  if (kinoAn) {
    plakat.width = Math.round(canvas.width * fein);
    plakat.height = Math.round(canvas.height * fein);
  }
  const pctx = kinoAn ? plakat.getContext("2d") : ctx;
  if (!pctx) return () => undefined;
  const v = varianteFuer(karte.nummer, karte.platz, optionen.versatz ?? 0);
  // Bild einer Story-Serie: Stelle und Aufgabe. Fehlt die Aufgabe, folgt
  // sie aus der Stelle (erstes Bild Aufhänger, letztes Einladung).
  const folge = istFolge(karte.folge) ? karte.folge : null;
  const serie: Basis["serie"] = folge
    ? {
        nr: folge.nr,
        von: folge.von,
        rolle:
          karte.rolle ??
          (folge.nr === 1
            ? "aufhaenger"
            : folge.nr === folge.von
              ? "einladung"
              : folge.nr === 2
                ? "problem"
                : "loesung"),
      }
    : null;
  // Ablauf des Films: der des Tages, in einer Serie von Bild zu Bild
  // weitergedreht (filmFuerFolge), oder von Hand festgelegt.
  const ablauf = filmFuerFolge(karte, optionen.versatz ?? 0);
  // Die Gestaltung des Tages; der tagesaktuelle Spruch des Tages steht
  // an jedem zweiten Tag als Kalenderblatt, eine Serie in ihrer eigenen
  // Gestaltung (gestaltungFuer). Von Hand lässt sich für eine Serie nur
  // eine Gestaltung wählen, die Serien trägt.
  let layout = optionen.layout ?? gestaltungFuer(karte, optionen.versatz ?? 0);
  if (serie && !SERIE_LAYOUTS.includes(layout))
    layout = serieGestaltung(karte.nummer, optionen.versatz ?? 0);
  const basis: Basis = {
    ctx: pctx,
    f: format,
    v,
    l: v.look,
    karte,
    serif,
    mono,
    skala,
    oben: format.oben + 104,
    // Das Textfeld endet mit Abstand über dem Hafen-Motiv auf der Linie
    // (in der hohen Story mit mehr Luft als in den gedrungenen Formaten).
    unten: format.unten - (format.name === "story" ? 226 : 204),
    eng: { wert: false, klein: 999 },
    kam: { x: format.b / 2, y: format.h / 2, z: 1, dy: 0 },
    film: {
      auftritt: optionen.film?.auftritt ?? ablauf.auftritt,
      kamera: optionen.film?.kamera ?? ablauf.kamera,
    },
    regie: { fahrt: [], feder: [], ladung: null },
    kamFest: null,
    sichtOben: null,
    fokus: null,
    kinoBild: false,
    ueberlagerung: null,
    versatz: [0, 0],
    kornDeck: 0,
    layout,
    kopfEng: false,
    orangePillen: 0,
    horizont: null,
    hafenBand: null,
    stadtGross: 1,
    serie,
  };
  const wahl = malerFuer(karte, v, basis.layout);
  basis.layout = wahl.layout;
  const male = wahl.maler(basis);
  // Für die Prüfung aller Karten: Hat ein Text nicht in sein Feld gepasst,
  // die Kopfzeile nicht in ihre Zeile? Wie viele orange Pillen stehen da?
  canvas.dataset.eng = basis.eng.wert ? "1" : "";
  canvas.dataset.schrift = String(basis.eng.klein);
  canvas.dataset.kopf = basis.kopfEng ? "1" : "";
  canvas.dataset.orange = String(basis.orangePillen);
  canvas.dataset.layout = basis.layout;
  canvas.dataset.folge = zaehler(basis) ?? "";

  /** Zeichnet das Plakat flach, mit der Kamera der Regie oder einem festen Ausschnitt. */
  const flach = (t: number) => {
    Object.assign(basis.kam, basis.kamFest ?? kameraBei(basis, t));
    pctx.globalAlpha = 1;
    pctx.globalCompositeOperation = "source-over";
    pctx.setLineDash([]);
    pctx.lineCap = "butt";
    pctx.lineJoin = "miter";
    ohneSchatten(pctx);
    pctx.textBaseline = "alphabetic";
    pctx.textAlign = "left";
    kameraAn(basis);
    male(t);
  };
  if (!kinoAn) return (t) => flach(t);

  // Kino-Kamera. Wo die Pointe von oben hereinkommt (Kran, Presse), muss
  // sie oberhalb dessen beginnen, was die Kamera sieht.
  basis.sichtOben = (von, bis) => {
    let oben = Infinity;
    for (let i = 0; i <= 10; i++) {
      const kam = kinoKamera(basis, von + ((bis - von) * i) / 10);
      oben = Math.min(oben, sichtbarerBereich(kam, format.b, format.h).y0);
    }
    return Math.max(oben, -KINO_RAND + 12) - 16;
  };
  const dunkel = raumFarbe(basis.l.bg2);
  const raumHex = `rgb(${dunkel.map((w) => Math.round(w * 255)).join(" ")})`;
  /** Das Plakat flach in der Größe des Bildes, 1:1 übertragen (Standbild). */
  const standbild = (t: number) => {
    basis.skala = skala;
    basis.versatz = [0, 0];
    basis.kamFest = { x: format.b / 2, y: format.h / 2, z: 1, dy: 0 };
    flach(t);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(
      plakat,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    ctx.restore();
  };
  /** Flach mit der Kamera der Regie, 1:1 übertragen (wenn die Kino-Kamera aus ist). */
  const flachKopie = (t: number) => {
    basis.skala = skala;
    basis.versatz = [0, 0];
    basis.kamFest = null;
    flach(t);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(
      plakat,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    ctx.restore();
  };
  const zeichner: StoryZeichner = (t, genau = false) => {
    if (zeichner.kino === false) return flachKopie(t);
    // Ab kurz nach T_STAND steht die Kamera gerade vor dem Plakat: dann
    // ist das Bild das Standbild.
    if (!(t < T_STAND + 0.25)) return standbild(t);
    const kam = kinoKamera(basis, t);
    // Bewegungsunschärfe für das Video: die Kamera während einer halben
    // Bilddauer (Verschluss 180 Grad). So viele Lagen, dass zwischen zwei
    // höchstens zwei Bildpunkte liegen; steht die Kamera fast, eine.
    let kameras = [kam];
    if (genau) {
      const vorher = kinoKamera(basis, t - 0.5 / 30);
      const weg = bildWeg(kam, vorher, format.b, format.h, canvas.height);
      const n = Math.min(32, Math.max(1, Math.ceil(weg / 2)));
      if (n > 1)
        kameras = Array.from({ length: n }, (_, j) =>
          kinoKamera(basis, t - (j / (n - 1)) * (0.5 / 30)),
        );
    }
    // Feinere Textur, solange die Kamera schräg und nah ist; zum Ende hin
    // genau so fein wie das Bild, damit das letzte Kinobild dem Standbild
    // gleicht (kein Scharfziehen beim Wechsel).
    const feinJetzt = 1 + (fein - 1) * kam.licht;
    const abb = abbildungFuer(
      kameras,
      format.b,
      format.h,
      KINO_RAND,
      // Saum für die Unschärfe am Bildrand
      0.03 * format.h * kam.licht,
      { b: plakat.width, h: plakat.height },
      feinJetzt / fein,
    );
    basis.skala = skala * feinJetzt;
    basis.versatz = [abb.ox, abb.oy];
    basis.kamFest = { x: abb.cx, y: abb.cy, z: abb.zt, dy: 0 };
    // Die ganze Fläche erst leeren: Der Ausschnitt ist nicht jedes Bild
    // gleich groß, und Reste eines früheren Bildes am Rand würden beim
    // Weichzeichnen hineingezogen.
    pctx.save();
    pctx.setTransform(1, 0, 0, 1, 0, 0);
    pctx.globalAlpha = 1;
    pctx.globalCompositeOperation = "source-over";
    pctx.fillStyle = raumHex;
    pctx.fillRect(0, 0, plakat.width, plakat.height);
    pctx.restore();
    basis.kinoBild = true;
    flach(t);
    basis.kinoBild = false;
    const ok = kinoZeichnen({
      ziel: ctx,
      quelle: plakat,
      abb,
      kameras,
      b: format.b,
      h: format.h,
      rand: KINO_RAND,
      dunkel,
      zeit: t,
    });
    if (!ok) {
      zeichner.kino = false;
      flachKopie(t);
      return;
    }
    // Was am Objektiv hängt, kommt über das gefilmte Bild: der Sucher
    // (POV) und das Korn, beide fest im Bild wie beim Standbild.
    const vorher = {
      ctx: basis.ctx,
      skala: basis.skala,
      versatz: basis.versatz,
    };
    basis.ctx = ctx;
    basis.skala = skala;
    basis.versatz = [0, 0];
    ctx.save();
    ctx.setTransform(skala, 0, 0, skala, 0, 0);
    basis.ueberlagerung?.(ctx, t);
    ctx.restore();
    if (basis.kornDeck > 0) korn(basis, basis.kornDeck);
    Object.assign(basis, vorher);
  };
  zeichner.kino = true;
  return zeichner;
}

/** Zeichnet das fertige Standbild. */
export async function zeichneStory(
  canvas: HTMLCanvasElement,
  karte: StoryKarte,
  format: StoryFormat = FORMATE.story,
  optionen: { skala?: number; versatz?: number } = {},
): Promise<void> {
  (await storyVorbereiten(canvas, karte, format, optionen))(Infinity);
}
