/**
 * Zeichnet eine Spruch-Karte auf eine Zeichenfläche (nur im Browser):
 * als Story (1080 × 1920) oder Beitrag (1080 × 1350) für Instagram im
 * Story-Studio (/admin/story) und als Karte (3:4) auf /journal. So sieht
 * die Website genauso aus wie die Posts.
 *
 * Jede Reihe hat ihr eigenes Format, so wie ein Grafiker Serien anlegt:
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
 * Der Film (acht Sekunden) ist ein einziger Take mit Kamera: Nahaufnahme
 * am Requisit der Reihe, Schwenk zum Satz (die Pointe fehlt noch, an
 * ihrer Stelle steht ein blasser Platzhalter), Crash-Zoom, die Pointe
 * landet mit einem Schlag, Rückfahrt in die Totale, ruhiges Bild zum
 * Lesen. Das letzte Bild ist das Standbild. Tiefe entsteht durch Ebenen,
 * die sich bei Fahrten gegeneinander verschieben; im gerechneten Video
 * (lib/story-video.ts) kommt Bewegungsunschärfe dazu.
 */
import type { SpruchTag } from "@/lib/sprueche-data";
import { STORY_LOOKS, type StoryLook } from "@/lib/story-look";
import { KURSIV_SPERRUNG, satzPlan, type SatzPlan } from "@/lib/story-satz";
import { MOTIV_WASSER } from "@/lib/story-teile";
import { varianteFuer, type Variante } from "@/lib/story-variante";

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
 * Zeichnet das Bild zur Zeit t (Sekunden; Infinity = Standbild). Mit
 * voll = true kommen Bewegungsunschärfe, Schärfeziehen und Aufglühen
 * dazu: für das gerechnete Video. Ohne (Website, Vorschau) bleibt es
 * leicht genug für Echtzeit.
 */
export type StoryZeichner = (t: number, voll?: boolean) => void;

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
   *  ebene ist der Zoom der Ebene, die gerade dran ist (für Schatten). */
  kam: { x: number; y: number; z: number; roll: number; ebene: number };
  /** Regie des Films; jedes Format legt sie beim Vorbereiten fest. */
  regie: Regie;
};

/** Kamera: Blickpunkt (Bildkoordinaten), Zoom (1 = Standbild), Rollen (Bogenmaß). */
type Pose = { x: number; y: number; z: number; roll?: number };
type Kurve = "gerade" | "weich" | "aus" | "ein" | "reiss" | "sinus";
/**
 * Regie eines Films: ein einziger Take. Die Kamera fährt von Einstellung
 * zu Einstellung (jede mit der Kurve, in der sie erreicht wird); dazu
 * Schläge (kurzer Ruck, wenn etwas aufsetzt), ein Lichtblitz zum
 * Höhepunkt und das Schwanken einer Handkamera (0 Stativ bis 3 Gehen).
 */
type Regie = {
  fahrt: { t: number; pose: Pose; kurve?: Kurve }[];
  schlaege: { t: number; kraft: number }[];
  blitz: number | null;
  /** Stärke des Blitzes (auf dunklem Grund schwächer) */
  blitzKraft?: number;
  hand: 0 | 1 | 2 | 3;
  /**
   * Kopfzeile (Etikett, Datum): ab wann sie da ist und in welcher Zeit
   * sie verschwindet (in Nahaufnahmen stünde sie angeschnitten am Rand).
   */
  kopf?: { ab: number; weg: [number, number] | null };
  /** Unschärfe 0 bis 1 über die Zeit (Schärfe ziehen), nur im gerechneten Video */
  unscharf?: (t: number) => number;
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
/** Auftritt, der schnell beginnt und lang ausläuft (Schrift aus der Maske). */
function aus(t: number, start: number, dauer: number): number {
  const k = klemme((t - start) / dauer);
  return k >= 1 ? 1 : 1 - 2 ** (-10 * k);
}
/** Auftritt, der langsam beginnt und hart ankommt (Fall, Aufschlag). */
function hart(t: number, start: number, dauer: number): number {
  const k = klemme((t - start) / dauer);
  return k <= 0 ? 0 : k >= 1 ? 1 : 2 ** (10 * k - 10);
}
/** Auftritt mit einem Überschwinger; c bestimmt, wie weit er übers Ziel geht. */
function zurueck(t: number, start: number, dauer: number, c = 1.3): number {
  const k = klemme((t - start) / dauer);
  return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2;
}
/** Fester Zufall 0 bis 1 aus einer Zahl (gleiche Zahl, gleicher Wert). */
function zufall(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// ---------------------------------------------------------------- Uhr

/**
 * Die Uhr des Films, für alle Reihen gleich: Aufmacher am Requisit, ab
 * T_SATZ baut sich der Satz auf (die Pointe fehlt noch, ihre Lücke bleibt
 * offen), bei T_SCHLAG landet die Pointe, ab T_RUECK fährt die Kamera in
 * die Totale zurück, ab T_STAND steht das ganze Bild zum Lesen und läuft
 * bis T_RUHE aus. Die letzten 0,4 s sind das Standbild.
 */
const T_SATZ = 1.38;
const T_SCHLAG = 3.5;
const T_RUECK = 4.3;
const T_STAND = 5.4;
const T_RUHE = 7.6;

/**
 * Tempo der Schleifen (Wehen, Wiegen, Wasser, Drehen): Vor dem Schlag
 * hält das Bild die Luft an, danach kurz Zeitlupe, zum Schluss läuft
 * alles aus.
 */
function tempoBei(t: number): number {
  if (t < T_SCHLAG - 0.6) return 1;
  if (t < T_SCHLAG) return 0.4;
  if (t < T_RUECK - 0.1) return 0.3;
  if (t < T_RUECK) return 0.3 + 7 * (t - T_RUECK + 0.1);
  if (t < T_STAND + 0.8) return 1;
  return Math.max(0, (T_RUHE - t) / (T_RUHE - T_STAND - 0.8));
}
const LAUF: number[] = [0];
for (let i = 1; i <= STORY_DAUER * 120; i++)
  LAUF.push(LAUF[i - 1] + tempoBei((i - 0.5) / 120) / 120);
/**
 * Zeit der Schleifen: läuft auf das Standbild zu und ist dort 0. So geht
 * der Film ohne Sprung in das Standbild über.
 */
function lauf(t: number): number {
  if (!Number.isFinite(t)) return 0;
  const i = klemme(t / STORY_DAUER) * (LAUF.length - 1);
  const a = Math.floor(i);
  const b = Math.min(LAUF.length - 1, a + 1);
  return LAUF[a] + (LAUF[b] - LAUF[a]) * (i - a) - LAUF[LAUF.length - 1];
}

// ---------------------------------------------------------------- Kamera

/** Tiefe der Ebenen: 1 ist die Schrift; der Grund liegt dahinter, Staub davor. */
const TIEFE_GRUND = 0.85;
const TIEFE_REQUISIT = 0.93;

/**
 * Stellt die Kamera für eine Ebene ein. Ebenen hinter der Schrift bewegen
 * sich bei Fahrten weniger, Ebenen davor mehr (Parallaxe): Erst dadurch
 * wirkt das flache Plakat wie ein Raum. Im Standbild (Kamera neutral)
 * liegen alle Ebenen deckungsgleich.
 */
function kameraAn(k: Basis, tiefe: number) {
  const { ctx, f, kam, skala } = k;
  const [mx, my] = [f.b / 2, f.h / 2];
  const z = 1 + (kam.z - 1) * tiefe;
  ctx.setTransform(skala, 0, 0, skala, 0, 0);
  ctx.translate(mx, my);
  if (kam.roll) ctx.rotate(kam.roll * Math.min(1, tiefe));
  ctx.scale(z, z);
  ctx.translate(-(mx + (kam.x - mx) * tiefe), -(my + (kam.y - my) * tiefe));
  kam.ebene = z;
}
/** Zeichnet etwas in einer anderen Tiefe als der Schriftebene. */
function ebene(k: Basis, tiefe: number, zeichne: () => void) {
  const { ctx, kam } = k;
  const zoom = kam.ebene;
  ctx.save();
  kameraAn(k, tiefe);
  zeichne();
  ctx.restore();
  kam.ebene = zoom;
}
/** Zeichnet etwas fest auf den Bildschirm (macht Fahrt und Zoom nicht mit). */
function schirm(k: Basis, zeichne: () => void) {
  const { ctx, kam } = k;
  const zoom = kam.ebene;
  ctx.save();
  ctx.setTransform(k.skala, 0, 0, k.skala, 0, 0);
  kam.ebene = 1;
  zeichne();
  ctx.restore();
  kam.ebene = zoom;
}

const KURVE: Record<Kurve, (u: number) => number> = {
  gerade: (u) => u,
  weich: (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2),
  aus: (u) => (u >= 1 ? 1 : 1 - 2 ** (-10 * u)),
  ein: (u) => u ** 4,
  reiss: (u) => (u < 0.5 ? 8 * u ** 4 : 1 - (-2 * u + 2) ** 4 / 2),
  sinus: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
};

/** Wo steht die Kamera zur Zeit t? Am Ende und im Standbild neutral. */
function kameraBei(k: Basis, t: number): Required<Pose> {
  const { f, regie } = k;
  const neutral = { x: f.b / 2, y: f.h / 2, z: 1, roll: 0 };
  if (!(t < T_RUHE)) return neutral;
  const zeit = Math.max(0, t);
  const fahrt = regie.fahrt;
  let { x, y, z, roll } = neutral;
  const i = fahrt.findIndex((e) => e.t > zeit);
  const fest = i === 0 ? fahrt[0] : i < 0 ? fahrt[fahrt.length - 1] : null;
  if (fest) {
    ({ x, y, z } = fest.pose);
    roll = fest.pose.roll ?? 0;
  } else if (i > 0) {
    const [a, b] = [fahrt[i - 1], fahrt[i]];
    const e = KURVE[b.kurve ?? "weich"]((zeit - a.t) / (b.t - a.t));
    x = a.pose.x + (b.pose.x - a.pose.x) * e;
    y = a.pose.y + (b.pose.y - a.pose.y) * e;
    // Zoom im Verhältnis mischen: So wirkt die Fahrt gleichmäßig.
    z = a.pose.z * (b.pose.z / a.pose.z) ** e;
    roll = (a.pose.roll ?? 0) + ((b.pose.roll ?? 0) - (a.pose.roll ?? 0)) * e;
  }
  // Schlag: ein gerichteter Ruck, zwei gedämpfte Schwingungen, nach
  // 0,3 s vorbei (10 Bildpunkte bei voller Kraft).
  for (const s of regie.schlaege) {
    const dt = zeit - s.t;
    if (dt < 0 || dt > 0.3) continue;
    const kraft = s.kraft * Math.exp(-dt / 0.085);
    x -= (10 / z) * kraft * Math.cos((dt / 0.14) * Math.PI * 2);
    // Rückstoß: Die Kamera ruckt heran und federt zurück.
    z *= 1 + 0.055 * s.kraft * Math.exp(-dt / 0.06);
  }
  // Handkamera: weiches Schwanken (nie Zittern), klingt mit der Rückfahrt aus.
  if (regie.hand) {
    const ruhe = 1 - klemme((zeit - T_RUECK) / (T_STAND - T_RUECK));
    const weite = ([0, 2, 5, 9][regie.hand] * ruhe) / z;
    const takt = [0, 1.9, 5.6, 8.2][regie.hand];
    x +=
      (Math.sin(zeit * takt) + Math.sin(zeit * takt * 0.57 + 1.3)) *
      0.5 *
      weite;
    y +=
      (Math.sin(zeit * takt * 0.83 + 0.7) + Math.sin(zeit * takt * 0.41)) *
      0.5 *
      weite;
    if (z > 1.1)
      roll +=
        Math.sin(zeit * takt * 0.6 + 0.4) *
        [0, 0, 0.007, 0.016][regie.hand] *
        ruhe;
  }
  // Blickpunkt begrenzen: Die Schriftebene füllt immer das ganze Bild.
  const frei = Math.max(0, 1 - (1 + 2 * Math.abs(roll)) / z);
  x = Math.min(Math.max(x, (f.b / 2) * (1 - frei)), (f.b / 2) * (1 + frei));
  y = Math.min(Math.max(y, (f.h / 2) * (1 - frei)), (f.h / 2) * (1 + frei));
  return { x, y, z, roll };
}

/** So weit fährt die Kamera zurück, bevor sie auf das Standbild zuschleicht. */
const ZOOM_WEIT = 0.974;
/** Größter Zoom für Nahaufnahmen (im gedrungenen Beitrag etwas weniger). */
const zoomMax = (k: Basis) => (k.f.name === "story" ? 2.4 : 2.1);

/**
 * Die Fahrt, der alle Reihen folgen (ein Take, ein Höhepunkt): Aufmacher
 * am Requisit, Schwenk zum Satz, ruhige Lesefahrt, Crash-Zoom auf die
 * Lücke der Pointe (im Schlag steht die Kamera schon richtig: der ganze
 * Farbstreifen ist im Bild), kurz Luft anhalten, dann zurück in die
 * Totale, die in das Standbild ausrollt. Leise Reihen fahren weich heran
 * statt hart, mit schwächerem Schlag und ohne Blitz.
 */
function regieStandard(
  k: Basis,
  a: {
    /** Aufmacher: Einstellungen bis etwa 1 s (Nahaufnahme am Requisit) */
    auftakt: Regie["fahrt"];
    /** Dauer des Schwenks zum Satz: kurz = Reißschwenk, lang = Kranfahrt */
    schwenk?: number;
    /** linke obere Ecke des Satzes */
    x: number;
    y: number;
    satz: Gesetzt;
    /** Zettel oder Blase um den Satz: linke Kante und Breite */
    rahmen?: { x: number; b: number };
    laut: boolean;
    /** Schläge im Aufmacher (z. B. wenn der Stempel aufsetzt) */
    schlaege?: Regie["schlaege"];
    hand?: Regie["hand"];
  },
): Regie {
  const { f } = k;
  const p = a.satz.pointe;
  const totale = { x: f.b / 2, y: f.h / 2, z: 1 };
  // Lesen: Der ganze Satz samt Lücke steht im Bild, mit Rand links und
  // rechts, etwas über der Bildmitte. Steht der Satz auf einem Zettel
  // oder in einer Blase, bleibt auch deren Rand im Bild.
  const zLesen = Math.max(
    1,
    Math.min(
      1.3,
      (0.86 * f.b) / a.satz.b,
      (0.8 * f.h) / a.satz.hoehe,
      a.rahmen ? (0.96 * f.b) / a.rahmen.b : 9,
    ),
  );
  // Bei kaum Zoom bleibt die Kamera in der Bildmitte (reine Totale).
  const lesen: Pose =
    zLesen < 1.08
      ? { ...totale, z: zLesen }
      : {
          x: a.rahmen ? a.rahmen.x + a.rahmen.b / 2 : a.x + a.satz.b / 2,
          y: a.y + a.satz.hoehe / 2 + (0.07 * f.h) / zLesen,
          z: zLesen,
        };
  // Pointe: Der Farbstreifen füllt das Bild, mit Rand auf beiden Seiten.
  // Entweder klar nah, dann zielt die Kamera auf den Streifen. Oder (bei
  // breiten Streifen) nur ein Stück heran, dann bleibt der ganze Satz im
  // Bild: Ein Mittelding sähe nach Beschnittfehler aus.
  const zPasst = Math.min(zoomMax(k), f.b / (p.b * 1.2), (0.7 * f.h) / p.h);
  const nah = zPasst >= 1.45;
  const zStreifen = nah
    ? zPasst
    : Math.max(
        zLesen,
        Math.min(zPasst, 1.15, (0.94 * f.b) / (a.rahmen?.b ?? a.satz.b)),
      );
  const streifen = {
    x: nah ? a.x + p.x + p.b / 2 : lesen.x,
    y: a.y + p.y + p.h / 2,
    z: zStreifen,
  };
  const ab = a.auftakt[a.auftakt.length - 1].t;
  const schwenk = a.schwenk ?? 0.34;
  const fahrt: Regie["fahrt"] = [
    ...a.auftakt,
    { t: ab + schwenk, pose: lesen, kurve: schwenk < 0.45 ? "reiss" : "weich" },
    {
      // Laute Reihen: kurzer Crash-Zoom. Leise: eine längere Zufahrt.
      t: p.t - (a.laut ? 0.24 : 0.6),
      pose: { ...lesen, z: lesen.z * 1.03 },
      kurve: "gerade",
    },
    { t: p.t, pose: streifen, kurve: "ein" },
    {
      t: T_RUECK,
      pose: { ...streifen, z: zStreifen * 1.02 },
      kurve: "gerade",
    },
    // Die Rückfahrt geht etwas über die Totale hinaus; von dort schleicht
    // die Kamera bis zum Schluss auf das Standbild zu.
    { t: T_STAND, pose: { ...totale, z: ZOOM_WEIT }, kurve: "aus" },
    { t: T_RUHE, pose: totale, kurve: "gerade" },
  ];
  const kraft = a.laut ? 1 : 0.4;
  return {
    fahrt,
    schlaege: [
      ...(a.schlaege ?? []),
      { t: p.t, kraft },
      ...(p.zeilen > 1 ? [{ t: p.t + 0.18, kraft: kraft * 0.6 }] : []),
    ],
    blitz: a.laut ? p.t : null,
    hand: a.hand ?? 0,
  };
}

/**
 * Deckkraft der Kopfzeile: Sie kommt mit dem Schwenk zum Satz, tritt für
 * die Nahaufnahme der Pointe zurück und ist in der Totale wieder da. Im
 * Standbild steht sie immer.
 */
function kopfDeck(k: Basis, t: number): number {
  if (!Number.isFinite(t)) return 1;
  const { ab, weg } = k.regie.kopf ?? {
    ab: 1.05,
    weg: [T_SCHLAG - 0.3, T_RUECK + 0.05] as [number, number],
  };
  const da = klemme((t - ab) / 0.3);
  if (!weg) return da;
  return (
    da * Math.max(1 - klemme((t - weg[0]) / 0.1), klemme((t - weg[1]) / 0.4))
  );
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
  k.ctx.shadowBlur = weite * k.skala * k.kam.ebene;
  k.ctx.shadowOffsetY = versatz * k.skala * k.kam.ebene;
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
 * Farbstreifen hinter der Pointe: Ober- und Unterkante laufen parallel,
 * die Enden neigen sich wie die Kursive. Die Höhe folgt der Schrift
 * (Oberlänge bis Unterlänge), damit kein Buchstabe an die Kante stößt.
 */
function streifenPfad(
  ctx: Ctx,
  x0: number,
  x1: number,
  grundlinie: number,
  px: number,
) {
  const oben = grundlinie - px * 0.74;
  const unten = grundlinie + px * 0.31;
  const schub = px * 0.045;
  ctx.beginPath();
  ctx.moveTo(x0 - px * 0.13 + schub, oben);
  ctx.lineTo(x1 + px * 0.1 + schub, oben);
  ctx.lineTo(x1 + px * 0.1 - schub, unten);
  ctx.lineTo(x0 - px * 0.13 - schub, unten);
  ctx.closePath();
}
/**
 * Zeichnet den Farbstreifen zur Zeit t. Bis zum Schlag steht an seiner
 * Stelle ein blasser Platzhalter (ab `vorAb`): So liest sich die Lücke
 * als Absicht. Ab `ab` schießt der Streifen von links herein (mit einem
 * kleinen Überschwinger) und glüht kurz auf; wenn die Kamera in der
 * Totale ankommt, wandert einmal ein Lichtstreif darüber.
 */
function streifen(
  ctx: Ctx,
  x0: number,
  x1: number,
  grundlinie: number,
  px: number,
  farbe: string,
  t: number,
  ab: number,
  vorAb: number,
) {
  const zug = t > ab ? zurueck(t, ab, 0.22) : 0;
  if (zug < 1) {
    // Der Platzhalter bleibt stehen, bis der Streifen ihn überdeckt.
    const blass = 0.15 * klemme((t - vorAb) / 0.4);
    if (blass > 0) {
      ctx.save();
      ctx.globalAlpha *= blass;
      streifenPfad(ctx, x0, x1, grundlinie, px);
      ctx.fillStyle = farbe;
      ctx.fill();
      ctx.restore();
    }
    if (t <= ab) return;
  }
  streifenPfad(ctx, x0, x0 + (x1 - x0) * zug, grundlinie, px);
  ctx.fillStyle = farbe;
  ctx.fill();
  const glut = 1 - (t - ab - 0.1) / 0.35;
  if (glut > 0 && glut <= 1) {
    ctx.fillStyle = `rgb(255 255 255 / ${0.24 * glut * glut})`;
    ctx.fill();
  }
  const q = (t - (T_STAND - 0.6)) / 0.6;
  if (q > 0 && q < 1) {
    ctx.save();
    ctx.clip();
    const b = px * 0.9;
    const x = x0 - px * 0.2 - b + (x1 - x0 + px * 0.4 + b * 2) * q;
    const g = ctx.createLinearGradient(x, 0, x + b, 0);
    g.addColorStop(0, "rgb(255 255 255 / 0)");
    g.addColorStop(0.5, "rgb(255 255 255 / 0.32)");
    g.addColorStop(1, "rgb(255 255 255 / 0)");
    ctx.fillStyle = g;
    // 20 Grad schräg, wie die Kursive.
    ctx.transform(1, 0, -0.36, 1, 0.36 * grundlinie, 0);
    ctx.fillRect(x, grundlinie - px, b, px * 1.6);
    ctx.restore();
  }
}

/**
 * Staub im Vordergrund: wenige große, weiche Lichtpunkte. Sie ziehen bei
 * Fahrten schneller durchs Bild als alles andere; daran liest das Auge
 * die Kamera. Im Standbild gibt es sie nicht, deshalb laufen sie aus.
 */
function staub(k: Basis, t: number) {
  if (!Number.isFinite(t)) return;
  const sicht = 1 - klemme((t - T_STAND - 0.8) / (T_RUHE - T_STAND - 0.8));
  if (sicht <= 0) return;
  const { ctx, f, karte, l } = k;
  const zeit = lauf(t);
  const hoch = f.h + 320;
  for (let i = 0; i < 14; i++) {
    const n = karte.nummer * 31 + i * 7;
    const r = 26 + zufall(n + 2) * 70;
    const x =
      -140 + zufall(n + 3) * (f.b + 280) + Math.sin(zeit * 0.5 + i) * 18;
    const fall = zufall(n + 4) * hoch + zeit * (10 + zufall(n + 5) * 22);
    const y = (((fall % hoch) + hoch) % hoch) - 160;
    // Über Wasser, Schiff und Wortmarke soll nichts schweben.
    const frei = klemme((f.unten - 230 - y) / 120);
    if (frei <= 0) continue;
    const deck =
      (0.05 + zufall(n + 6) * 0.09) * sicht * frei * (l.dunkel ? 1 : 1.5);
    ebene(k, 1.3 + zufall(n + 1) * 0.5, () => {
      const g = ctx.createRadialGradient(x, y, r * 0.15, x, y, r);
      g.addColorStop(0, `rgb(255 250 240 / ${deck})`);
      g.addColorStop(1, "rgb(255 250 240 / 0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    });
  }
}

// Feines Korn über dem ganzen Bild: nimmt den Flächen das Glatte.
let kornMuster: HTMLCanvasElement | null = null;
/**
 * Abschluss jedes Bildes, fest auf dem Bildschirm: Staub, im Film eine
 * Vignette (dunkler Rand, am stärksten zum Höhepunkt), der Lichtblitz im
 * Schlag und das Korn.
 */
function abschluss(k: Basis, t: number, deck: number) {
  staub(k, t);
  const { ctx, f, regie } = k;
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
  const film = Number.isFinite(t);
  schirm(k, () => {
    if (film && t < T_STAND) {
      const rand =
        t < T_SCHLAG - 0.3
          ? 0.3
          : t < T_SCHLAG
            ? 0.3 + ((t - T_SCHLAG + 0.3) / 0.3) * 0.25
            : t < T_RUECK
              ? 0.55
              : 0.55 * (1 - (t - T_RUECK) / (T_STAND - T_RUECK));
      const weit = Math.hypot(f.b, f.h) / 2;
      const g = ctx.createRadialGradient(
        f.b / 2,
        f.h / 2,
        weit * 0.45,
        f.b / 2,
        f.h / 2,
        weit * 1.05,
      );
      g.addColorStop(0, "rgb(0 0 0 / 0)");
      g.addColorStop(1, `rgb(0 0 0 / ${rand * 0.62})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, f.b, f.h);
    }
    // Lichtblitz: zwei Bilder voll, dann schnell aus (warmes Weiß).
    const dt = regie.blitz === null ? -1 : t - regie.blitz;
    if (film && dt >= 0 && dt < 0.28) {
      const voll = regie.blitzKraft ?? 0.09;
      const hell = dt < 0.067 ? voll : voll * 2 ** ((-10 * (dt - 0.067)) / 0.2);
      ctx.fillStyle = `rgb(255 244 228 / ${hell})`;
      ctx.fillRect(0, 0, f.b, f.h);
    }
    const muster = kornMuster && ctx.createPattern(kornMuster, "repeat");
    if (!muster) return;
    // Im Film flimmert das Korn (jedes Bild ein anderer Ausschnitt).
    const bild = film ? Math.floor(t * 30) : 0;
    const [ox, oy] = film
      ? [zufall(bild) * 192, zufall(bild + 0.5) * 192]
      : [0, 0];
    ctx.globalAlpha = deck;
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = muster;
    ctx.translate(-ox, -oy);
    ctx.fillRect(ox, oy, f.b, f.h);
  });
}

// ---------------------------------------------------------------- Text

/** Ein gesetzter Satz: Höhe, Ende des Auftritts und die Zeichenfunktion. */
type Gesetzt = {
  hoehe: number;
  ende: number;
  /** Größe der Grundschrift */
  g: number;
  /** Breite der längsten Zeile */
  b: number;
  /**
   * Die Pointe: wann sie landet und wo ihr Farbstreifen liegt (relativ
   * zur linken oberen Ecke des Satzes). Dorthin fährt die Kamera.
   */
  pointe: {
    t: number;
    x: number;
    y: number;
    b: number;
    h: number;
    zeilen: number;
  };
  zeichne: (x: number, y: number, t: number, farben: SatzFarben) => void;
};

/**
 * Setzt den Satz der Karte so groß wie möglich in ein Feld der Breite
 * breite und der Höhe platz. Die Pointe steht kursiv auf einem
 * Farbstreifen: am Satzende als eigener, großer Block, mitten im Satz in
 * der Zeile.
 *
 * Im Film steigen die Zeilen ab T_SATZ nacheinander aus einer Maske. Die
 * Pointe fehlt zunächst (ihre Lücke bleibt offen) und landet bei
 * T_SCHLAG: Der Streifen schießt herein, die Schrift steigt darin auf.
 */
function setzeSatz(
  k: Basis,
  plan: SatzPlan,
  breite: number,
  platz: number,
  maxG = 132,
  /** Beginn der ersten Zeile im Film */
  ab = T_SATZ,
): Gesetzt {
  const { ctx, serif } = k;
  const grotesk = (g: number) => `800 ${g}px ${GROTESK}`;
  const kursiv = (p: number) => `italic 600 ${p}px ${serif}`;
  const messen = (
    woerter: { t: string; betont: boolean }[],
    g: number,
    p: number,
  ): Wort[] =>
    woerter.map((w) => {
      ctx.font = w.betont ? kursiv(p) : grotesk(g);
      sperren(ctx, w.betont ? p * KURSIV_SPERRUNG : -g * 0.032);
      return { ...w, breite: ctx.measureText(w.t).width };
    });

  type Schritt = (x: number, y: number, t: number, f: SatzFarben) => number;
  type Versuch = {
    hoehe: number;
    schritte: Schritt[];
    p: number;
    b: number;
    einsam: boolean;
    pointe: Gesetzt["pointe"] | null;
  };

  const versuche = (g: number): Versuch | null => {
    const zeilenHoehe = g * 1.06;
    const abstand = g * 0.23;
    const schritte: Schritt[] = [];
    let hoehe = 0;
    let pGross = g * 1.25;
    let weite = 0;
    let einsam = false;
    let pointe: Gesetzt["pointe"] | null = null;
    // Eine Zeile mit Farbstreifen bekommt Luft nach oben und unten, damit
    // der Streifen keine Nachbarzeile berührt.
    const zeile = (
      z: Zeile,
      p: number,
      nummer: number,
      davor = 0,
      danach = 0,
      streifenAb = T_SCHLAG,
    ): Schritt => {
      const beginn = ab + nummer * 0.12;
      weite = Math.max(weite, z.breite);
      const hoch = z.woerter.some((w) => w.betont) ? Math.max(g, p) : g;
      return (x0, yOben, t, farben) => {
        const y = yOben + davor;
        if (t > beginn) {
          const grundlinie = y + g * 0.86;
          const deck = ctx.globalAlpha;
          // Farbstreifen hinter den betonten Wörtern.
          let x = x0;
          let von: number | null = null;
          let bis = 0;
          for (const w of z.woerter) {
            if (w.betont) {
              if (von === null) von = x;
              bis = x + w.breite;
            } else if (von !== null) {
              streifen(
                ctx,
                von,
                bis,
                grundlinie,
                p,
                farben.balken,
                t,
                streifenAb,
                beginn + 0.25,
              );
              von = null;
            }
            x += w.breite + abstand;
          }
          if (von !== null)
            streifen(
              ctx,
              von,
              bis,
              grundlinie,
              p,
              farben.balken,
              t,
              streifenAb,
              beginn + 0.25,
            );
          // Die Wörter steigen aus einer Maske; die Pointe erst mit dem
          // Streifen. Steht alles, entfällt die Maske.
          const steht = t > Math.max(beginn + 0.8, streifenAb + 0.5);
          ctx.save();
          if (!steht) {
            ctx.beginPath();
            ctx.rect(
              x0 - hoch * 0.4,
              grundlinie - hoch * 0.98,
              z.breite + hoch * 0.8,
              hoch * 1.32,
            );
            ctx.clip();
          }
          x = x0;
          z.woerter.forEach((w, i) => {
            const a = w.betont
              ? aus(t, streifenAb + 0.06, 0.36)
              : aus(t, beginn + i * 0.03, 0.45);
            if (a > 0) {
              ctx.font = w.betont ? kursiv(p) : grotesk(g);
              sperren(ctx, w.betont ? p * KURSIV_SPERRUNG : -g * 0.032);
              ctx.fillStyle = w.betont ? farben.pointe : farben.text;
              ctx.globalAlpha = deck * Math.min(1, a * 3);
              ctx.fillText(w.t, x, grundlinie + (1 - a) * hoch * 1.1);
            }
            x += w.breite + abstand;
          });
          ctx.restore();
        }
        return y + zeilenHoehe + danach;
      };
    };

    if (plan.art === "fluss") {
      const p = Math.round(g * 1.25);
      let letzte: Zeile[] = [];
      let geteilt = false;
      let streifenNr = 0;
      for (const gruppe of plan.gruppen) {
        const woerter = messen(gruppe, g, p);
        if (Math.max(...woerter.map((w) => w.breite)) > breite - p * 0.2)
          return null;
        letzte = ausgewogen(woerter, breite - p * 0.15, abstand);
        // Läuft die Pointe über zwei Zeilen, ist eine kleinere Schrift,
        // in der sie zusammenbleibt, die bessere Wahl.
        letzte.forEach((z, i) => {
          const naechste = letzte[i + 1];
          if (z.woerter.at(-1)?.betont && naechste?.woerter[0].betont)
            geteilt = true;
        });
        for (const z of letzte) {
          const erstes = z.woerter.findIndex((w) => w.betont);
          const davor = erstes >= 0 && schritte.length ? g * 0.16 : 0;
          const danach = erstes >= 0 ? g * 0.14 : 0;
          // Der zweite Streifen einer geteilten Pointe landet kurz danach.
          const streifenAb = T_SCHLAG + streifenNr * 0.18;
          if (erstes >= 0) {
            const vor = z.woerter
              .slice(0, erstes)
              .reduce((b, w) => b + w.breite + abstand, 0);
            const betont = z.woerter.filter((w) => w.betont);
            const b =
              betont.reduce((s, w) => s + w.breite, 0) +
              abstand * (betont.length - 1);
            const oben = hoehe + davor + g * 0.86 - p * 0.74;
            if (pointe) {
              // Geteilte Pointe: Die Kamera rahmt beide Streifen.
              const rechts = Math.max(pointe.x + pointe.b, vor + b);
              pointe.x = Math.min(pointe.x, vor);
              pointe.b = rechts - pointe.x;
              pointe.h = oben + p * 1.05 - pointe.y;
              pointe.zeilen++;
            } else
              pointe = {
                t: T_SCHLAG,
                x: vor,
                y: oben,
                b,
                h: p * 1.05,
                zeilen: 1,
              };
            streifenNr++;
          }
          schritte.push(
            zeile(z, p, schritte.length, davor, danach, streifenAb),
          );
          hoehe += zeilenHoehe + davor + danach;
        }
      }
      const ende = letzte[letzte.length - 1];
      einsam =
        geteilt ||
        (letzte.length > 1 &&
          ende.woerter.length === 1 &&
          !ende.woerter[0].betont &&
          ende.breite < breite * 0.4);
    } else {
      for (const gruppe of plan.vor) {
        const woerter = messen(
          gruppe.map((w) => ({ t: w, betont: false })),
          g,
          g,
        );
        if (Math.max(...woerter.map((w) => w.breite)) > breite) return null;
        for (const z of ausgewogen(woerter, breite, abstand)) {
          schritte.push(zeile(z, g, schritte.length));
          hoehe += zeilenHoehe;
        }
      }
      // Pointe: so groß, dass ihre längste Zeile die Breite füllt und
      // der Block noch in die Höhe passt.
      ctx.font = kursiv(100);
      sperren(ctx, 100 * KURSIV_SPERRUNG);
      const weiteste = Math.max(
        ...plan.pointe.map((z) => ctx.measureText(z).width / 100),
      );
      const p = Math.floor(
        Math.min(
          g * 2.1,
          290,
          (breite - 10) / (weiteste + 0.24),
          (platz - hoehe) / (plan.pointe.length * 1.14 + 0.26),
        ),
      );
      if (p < g * 1.2) return null;
      pGross = p;
      ctx.font = kursiv(p);
      sperren(ctx, p * KURSIV_SPERRUNG);
      const weiten = plan.pointe.map((z) => ctx.measureText(z).width);
      // Zeilenabstand der Pointe: Zwischen zwei Streifen bleibt ein
      // gleichmäßiger Spalt; zum Satz darüber etwas Luft.
      const pZeile = p * 1.14;
      const luft = plan.vor.length ? p * 0.16 : 0;
      const blockHoehe = luft + plan.pointe.length * pZeile + p * 0.06;
      pointe = {
        t: T_SCHLAG,
        x: 0,
        y: hoehe + luft,
        b: Math.max(...weiten) + p * 0.23,
        h: plan.pointe.length * pZeile,
        zeilen: plan.pointe.length,
      };
      weite = Math.max(weite, pointe.b);
      hoehe += blockHoehe;
      // Der Platzhalter der Pointe erscheint nach der letzten Zeile davor.
      const blockAb = ab + schritte.length * 0.12 + 0.2;
      schritte.push((x0, y, t, farben) => {
        if (t > blockAb) {
          // Der Block steht leicht schräg, wie von Hand aufgeklebt.
          const oben = y + luft;
          const mitte = oben + (plan.pointe.length * pZeile) / 2;
          ctx.save();
          ctx.translate(x0, mitte);
          ctx.rotate((-2 * Math.PI) / 180);
          ctx.translate(-x0, -mitte);
          ctx.font = kursiv(p);
          sperren(ctx, p * KURSIV_SPERRUNG);
          const deck = ctx.globalAlpha;
          plan.pointe.forEach((z, i) => {
            const landet = T_SCHLAG + i * 0.18;
            const grundlinie = oben + i * pZeile + p * 0.8;
            const x = x0 + p * 0.12;
            streifen(
              ctx,
              x,
              x + weiten[i],
              grundlinie,
              p,
              farben.balken,
              t,
              landet,
              blockAb,
            );
            // Die Schrift steigt im Streifen auf.
            const a = aus(t, landet + 0.06, 0.36);
            if (a <= 0) return;
            ctx.save();
            if (a < 1) {
              streifenPfad(ctx, x, x + weiten[i], grundlinie, p);
              ctx.clip();
            }
            ctx.globalAlpha = deck * Math.min(1, a * 3);
            ctx.fillStyle = farben.pointe;
            ctx.fillText(z, x, grundlinie + (1 - a) * p * 0.95);
            ctx.restore();
          });
          ctx.restore();
        }
        return y + blockHoehe;
      });
    }
    return { hoehe, schritte, p: pGross, b: weite, einsam, pointe };
  };

  // Größe wählen: groß ist gut, eine deutlich größere Pointe ist besser,
  // ein kurzes Wort allein in der letzten Zeile oder eine über zwei
  // Zeilen geteilte Pointe ist schlecht.
  let g = 56;
  let beste: Versuch | null = null;
  let guete = -1;
  for (let versuch = maxG; versuch >= 52; versuch -= 4) {
    const s = versuche(versuch);
    if (!s || s.hoehe > platz) continue;
    const wert = versuch + Math.min(s.p, versuch * 2) - (s.einsam ? 40 : 0);
    if (wert > guete) {
      guete = wert;
      g = versuch;
      beste = s;
    }
    if (plan.art === "fluss" && (!s.einsam || versuch < g * 0.86)) break;
  }
  if (!beste) k.eng.wert = true;
  k.eng.klein = Math.min(k.eng.klein, g);
  const satz = beste ??
    versuche(52) ?? {
      hoehe: 0,
      schritte: [],
      p: 52,
      b: breite,
      einsam: false,
      pointe: null,
    };
  sperren(ctx, 0);
  return {
    hoehe: satz.hoehe,
    ende: T_RUECK,
    g,
    b: satz.b || breite,
    // Ohne betontes Wort gilt der ganze Satz als Ziel der Kamera.
    pointe: satz.pointe ?? {
      t: T_SCHLAG,
      x: 0,
      y: 0,
      b: breite,
      h: satz.hoehe,
      zeilen: 1,
    },
    zeichne: (x, y, t, farben) => {
      let yy = y;
      for (const s of satz.schritte) yy = s(x, yy, t, farben);
      sperren(ctx, 0);
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
  /** auftritt: Fortschritt 0 bis 1 je Zeile (im Film steigt sie aus einer Maske) */
  zeichne: (
    x: number,
    y: number,
    farbe: string,
    auftritt?: (zeile: number) => number,
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
    zeichne: (x, y, farbe, auftritt) => {
      ctx.font = schrift(fest.px);
      sperren(ctx, fest.px * sperrung);
      ctx.fillStyle = farbe;
      ctx.textBaseline = "alphabetic";
      zeilen.forEach((z, i) => {
        const a = auftritt ? auftritt(i) : 1;
        if (a <= 0) return;
        let xx = x;
        const grundlinie = y + i * fest.px * zeilenFaktor + fest.px * 0.86;
        if (a < 1) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            x - fest.px * 0.3,
            grundlinie - fest.px * 0.98,
            z.breite + fest.px * 0.6,
            fest.px * 1.3,
          );
          ctx.clip();
          ctx.globalAlpha *= Math.min(1, a * 3);
        }
        for (const w of z.woerter) {
          ctx.fillText(w.t, xx, grundlinie + (1 - a) * fest.px * 1.1);
          xx += w.breite + fest.abstand;
        }
        if (a < 1) ctx.restore();
      });
      sperren(ctx, 0);
    },
  };
}

/** Der Zusatz unter dem Satz: ruhige Schrift mit geschwungenem Pfeil. */
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
      start: number,
      farbe: string,
      akzent: string,
    ) => {
      if (t <= start) return;
      const { ctx } = k;
      ctx.save();
      // Geschwungener Pfeil vom Satz zum Zusatz; im Film zieht er sich.
      const zug = aus(t, start, 0.4);
      if (zug < 1) {
        ctx.beginPath();
        ctx.rect(x - 12, y - 30, 12 + frei.px * 1.4 * zug, frei.px * 2);
        ctx.clip();
      }
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
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 36 * s, py - 14 * s);
      ctx.lineTo(x + 54 * s, py + 2 * s);
      ctx.lineTo(x + 34 * s, py + 16 * s);
      ctx.stroke();
      ctx.restore();
      frei.zeichne(x + einzug, y, farbe, (i) =>
        aus(t, start + 0.02 + i * 0.1, 0.45),
      );
    },
  };
}

// ---------------------------------------------------------------- Rahmen

/**
 * Grund: Verlauf in der Farbwelt, ein Licht, eine große ruhige Fläche.
 * Er liegt hinter der Schrift und ragt über den Bildrand hinaus, damit
 * bei Fahrten und beim Rollen nirgends ein Rand frei wird.
 */
function grund(k: Basis, l: StoryLook) {
  const { ctx, f, v } = k;
  const u = 260;
  ebene(k, TIEFE_GRUND, () => {
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
    if (v.grund === "geteilt") {
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
  });
}

/** Oben: Etikett der Reihe links, Datum rechts. */
function kopf(
  k: Basis,
  farben: { etikett: string; etikettText: string; datum: string },
  etikett: string | null,
  t: number,
) {
  const { ctx, f, karte, mono } = k;
  const deck = kopfDeck(k, t);
  if (deck <= 0) return;
  ctx.save();
  ctx.globalAlpha *= deck;
  if (etikett) {
    const text = etikett.toUpperCase();
    ctx.font = `700 26px ${GROTESK}`;
    sperren(ctx, 3.4);
    const b = ctx.measureText(text).width + 62;
    rund(ctx, RAND, f.oben + 6, b, 62, 31);
    ctx.fillStyle = farben.etikett;
    ctx.fill();
    ctx.fillStyle = farben.etikettText;
    ctx.textBaseline = "middle";
    ctx.fillText(text, RAND + 31, f.oben + 39);
    sperren(ctx, 0);
  }
  ctx.font = `400 26px ${mono}`;
  sperren(ctx, 1.2);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = farben.datum;
  ctx.fillText(karte.datumKurz.toUpperCase(), f.b - RAND + 3, f.oben + 39);
  sperren(ctx, 0);
  ctx.restore();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

/**
 * Unten: die Elbe-Linie mit einem kleinen Schiff, darunter die Wortmarke
 * (SITAL und der Doppelring) und die Adresse. Im Film ist das Kulisse:
 * Linie, Wasser und Wortmarke stehen ab dem ersten Bild; das Wasser
 * fließt und glitzert, ein Schiff fährt erst ein, wenn die Kamera in die
 * Totale zurückkommt (Leuchtturm und Kran stehen von Anfang an).
 */
function fuss(
  k: Basis,
  t: number,
  farben: {
    schrift: string;
    weich: string;
    linie: string;
    ring: string;
    schiff: string;
    flaeche: string;
    /** helle Fläche (Papier, helle Farbwelt): Das Wasser wird dunkler getönt */
    hell: boolean;
  },
  /** Ab wann das Schiff einfährt */
  schiffAb = T_RUECK + 0.1,
) {
  const { ctx, f, v, karte, serif, mono } = k;
  const y0 = f.unten - 112;
  const film = Number.isFinite(t);
  const zeit = lauf(t);
  ctx.save();
  // Die Elbe: eine feine Welle über die ganze Breite, darunter Wasser bis
  // zum unteren Rand. So schwimmt das Schiff auf etwas. Im Film zieht
  // die Welle langsam nach rechts.
  const schub = ((zeit * 16) % 152) + (zeit < 0 ? 152 : 0);
  const links = RAND - 304 + schub - 152;
  const welle = () => {
    ctx.beginPath();
    ctx.moveTo(links, y0);
    for (let x = links; x < f.b + 200; x += 152)
      ctx.bezierCurveTo(x + 38, y0 - 7, x + 114, y0 + 7, x + 152, y0);
  };
  welle();
  ctx.lineTo(f.b + 400, f.h + 300);
  ctx.lineTo(links, f.h + 300);
  ctx.closePath();
  ctx.fillStyle = farben.hell
    ? "rgb(15 42 58 / 0.055)"
    : "rgb(255 255 255 / 0.05)";
  ctx.fill();
  welle();
  ctx.strokeStyle = farben.linie;
  ctx.lineWidth = 3;
  ctx.stroke();
  // Glitzern auf dem Wasser (nur im Film; läuft zum Standbild hin aus).
  const sicht = film
    ? 1 - klemme((t - T_STAND - 0.8) / (T_RUHE - T_STAND - 0.8))
    : 0;
  if (sicht > 0) {
    ctx.fillStyle = farben.hell ? "#ffffff" : "rgb(255 255 255 / 0.8)";
    for (let i = 0; i < 9; i++) {
      const n = karte.nummer * 13 + i * 5;
      const funke = Math.max(0, Math.sin(zeit * 2.3 + i * 1.7)) ** 3;
      if (funke < 0.03) continue;
      const b = 16 + zufall(n) * 26;
      ctx.globalAlpha = funke * 0.5 * sicht;
      // Direkt unter der Linie und (in der hohen Story) unter der
      // Wortmarke, nie in der Zeile von Wortmarke und Adresse.
      const tief = i % 2 === 1 && f.h - f.unten > 150;
      rund(
        ctx,
        RAND + zufall(n + 1) * (f.b - RAND * 2 - b),
        tief
          ? f.unten + 30 + zufall(n + 2) * (f.h - f.unten - 110)
          : y0 + 12 + zufall(n + 2) * 22,
        b,
        3,
        1.5,
      );
      ctx.fill();
    }
  }
  ctx.restore();

  // Kleines Schiff auf der Linie (jeden Tag ein anderes).
  const s = 2.4;
  const m = v.motiv;
  const ziel = f.b - RAND - 46 - m.b * s;
  // Es fährt zügig ein und gleitet dann bis zum Schluss langsam weiter.
  const fahrt = m.faehrt
    ? 0.86 * aus(t, schiffAb, 0.9) +
      0.14 * klemme((t - schiffAb) / (T_RUHE - schiffAb))
    : 1;
  const wiegen = m.faehrt ? Math.sin(zeit * 2.4) : 0;
  if (fahrt > 0) {
    ctx.save();
    ctx.translate(
      ziel + (1 - fahrt) * (f.b + 40 - ziel),
      y0 + 2 - MOTIV_WASSER * s + wiegen * 1.6,
    );
    ctx.translate((m.b * s) / 2, MOTIV_WASSER * s);
    ctx.rotate((wiegen * 1.2 * Math.PI) / 180);
    ctx.translate((-m.b * s) / 2, -MOTIV_WASSER * s);
    ctx.scale(s, s);
    // Nur der Teil über der Wasserlinie.
    ctx.beginPath();
    ctx.rect(-4, -10, m.b + 8, MOTIV_WASSER + 10);
    ctx.clip();
    const deck = ctx.globalAlpha;
    const teilFarbe = {
      faehre: farben.schiff,
      streif: farben.ring,
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
  ctx.lineWidth = 3.4;
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
    kopf: { etikett: l.stickerBg, etikettText: l.stickerText, datum: l.weich },
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
 * Wo trennt sich das Ausrufezeichen in Balken und Punkt? Die Lücke liegt
 * je nach Schrift des Geräts woanders, deshalb wird sie am gezeichneten
 * Zeichen gesucht (Anteil der Höhe, von oben).
 */
function ausrufeSpalt(k: Basis): number {
  const c = document.createElement("canvas");
  c.width = 120;
  c.height = 180;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return 0.775;
  x.font = zeichenSchrift(k, true, 150);
  const m = x.measureText("!");
  const b = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight);
  const h = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
  if (b < 2 || h < 8 || b > 110 || h > 170) return 0.775;
  x.fillText("!", 4 + m.actualBoundingBoxLeft, 4 + m.actualBoundingBoxAscent);
  const daten = x.getImageData(4, 4, b, h).data;
  const leer = (zeile: number) => {
    for (let i = 0; i < b; i++)
      if (daten[(zeile * b + i) * 4 + 3] > 24) return false;
    return true;
  };
  // Die längste leere Strecke im Inneren ist die Lücke.
  let beste = [0, 0];
  let start = -1;
  for (let zeile = 1; zeile < h - 1; zeile++) {
    if (!leer(zeile)) start = -1;
    else {
      if (start < 0) start = zeile;
      if (zeile + 1 - start > beste[1] - beste[0]) beste = [start, zeile + 1];
    }
  }
  return beste[1] > beste[0] ? (beste[0] + beste[1]) / 2 / h : 0.775;
}

/**
 * Malt das große Zeichen zur Zeit t. Im Film hat jedes seinen Auftritt:
 * Beim Ausrufezeichen steht der Punkt schon da, der Balken fällt von
 * oben darauf; die Anführungszeichen setzen groß auf; der Umriss des
 * Fragezeichens deckt sich von oben nach unten auf.
 */
function zeichenMalen(
  k: Basis,
  zeichen: string,
  m: ZeichenMass,
  t: number,
  stil: {
    farbe: string;
    fett?: boolean;
    auftritt: "ausrufe" | "zitat" | "schreiben";
    /** Anteil der Höhe, bei dem sich Balken und Punkt trennen */
    spalt?: number;
    /** Über diese Linie (Kopfzeile) ragt der fallende Balken nicht hinaus */
    decke: number;
  },
) {
  const { ctx } = k;
  ctx.save();
  ctx.font = zeichenSchrift(k, stil.fett, m.px);
  ctx.fillStyle = stil.farbe;
  if (stil.auftritt === "schreiben") {
    ctx.strokeStyle = stil.farbe;
    ctx.lineWidth = 9;
    ctx.lineJoin = "round";
    // Schon im ersten Bild ist der Bogen angeschnitten zu sehen.
    const q = 0.14 + 0.86 * KURVE.weich(klemme(t / 0.7));
    if (q < 1) {
      ctx.beginPath();
      ctx.rect(m.l - 30, m.o - 30, m.b + 60, (m.h + 60) * q);
      ctx.clip();
    }
    ctx.strokeText(zeichen, m.x, m.y);
    ctx.restore();
    return;
  }
  if (stil.auftritt === "zitat") {
    // Die Anführungszeichen stehen schon im ersten Bild, groß und blass,
    // und setzen dann hart auf ihren Platz auf.
    const auf = hart(t, 0.08, 0.17);
    const [mx, my] = [(m.l + m.r) / 2, (m.o + m.u) / 2];
    ctx.globalAlpha = 0.35 + 0.65 * auf;
    ctx.translate(mx, my);
    ctx.scale(1.7 - 0.7 * auf, 1.7 - 0.7 * auf);
    ctx.translate(-mx, -my);
    ctx.fillText(zeichen, m.x, m.y);
    const glut = 1 - (t - 0.25) / 0.3;
    if (glut > 0 && glut <= 1) {
      ctx.fillStyle = `rgb(255 255 255 / ${0.45 * glut})`;
      ctx.fillText(zeichen, m.x, m.y);
    }
    ctx.restore();
    return;
  }
  // Ausrufezeichen: Der Punkt steht, der Balken fällt von oben darauf.
  const teilung = m.o + m.h * (stil.spalt ?? 0.775);
  ctx.beginPath();
  ctx.rect(-4000, stil.decke, 9000, 9000);
  ctx.clip();
  ctx.save();
  ctx.beginPath();
  ctx.rect(m.l - 40, teilung, m.b + 80, m.h);
  ctx.clip();
  ctx.fillText(zeichen, m.x, m.y);
  ctx.restore();
  const da = hart(t, 0.05, 0.2);
  if (da > 0.001) {
    ctx.translate(0, -(1 - da) * m.h * 1.6);
    ctx.beginPath();
    ctx.rect(m.l - 40, m.o - 40, m.b + 80, teilung - m.o + 40);
    ctx.clip();
    ctx.fillText(zeichen, m.x, m.y);
    // Beim Aufsetzen glüht der Balken kurz auf.
    const glut = 1 - (t - 0.25) / 0.3;
    if (glut > 0 && glut <= 1) {
      ctx.fillStyle = `rgb(255 255 255 / ${0.45 * glut})`;
      ctx.fillText(zeichen, m.x, m.y);
    }
  }
  ctx.restore();
}

type Maler = (t: number) => void;

/** Nahaufnahme, die bis kurz vor dem Schwenk fast stillsteht. */
const nahaufnahme = (pose: Pose, bis = 1): Regie["fahrt"] => [
  { t: 0, pose },
  { t: bis, pose: { ...pose, z: pose.z * 0.96 }, kurve: "gerade" },
];

// ---------------------------------------------------------------- Formate

/** Plakat: reine Schrift, dazu ein großes Zeichen oder ein runder Stempel. */
function plakat(k: Basis): Maler {
  const { ctx, f, l, karte } = k;
  const farben = rahmenFarben(l);
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
  const zMax = zoomMax(k);

  // Das Requisit der Reihe und sein Aufmacher.
  const ausrufe =
    art === "Hot Take"
      ? zeichenMass(k, "!", f.oben + 96, y - 56, { fett: true })
      : null;
  const spalt = ausrufe ? ausrufeSpalt(k) : undefined;
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
  // Ohne Requisit (zu wenig Platz): Nahaufnahme auf das Etikett.
  let auftakt = nahaufnahme({ x: RAND + 170, y: f.oben + 37, z: zMax * 0.8 });
  let schlaege: Regie["schlaege"] = [];
  let kopfAb = -1;
  if (ausrufe) {
    // Nahaufnahme auf den Punkt: Dort schlägt der Balken ein.
    auftakt = nahaufnahme({
      x: (ausrufe.l + ausrufe.r) / 2,
      y: ausrufe.u - ausrufe.h * 0.24,
      z: Math.min(zMax, (0.8 * f.h) / ausrufe.h),
    });
    schlaege = [{ t: 0.25, kraft: 0.7 }];
    kopfAb = 1.05;
  } else if (zitat) {
    auftakt = nahaufnahme({
      x: (zitat.l + zitat.r) / 2,
      y: (zitat.o + zitat.u) / 2,
      z: Math.min(zMax, (0.5 * f.b) / zitat.b),
    });
    schlaege = [{ t: 0.25, kraft: 0.7 }];
    kopfAb = 1.05;
  } else if (www) {
    // Der Umriss deckt sich von links auf, die Kamera fährt dabei zurück,
    // bis das ganze „www.“ im Bild steht.
    const wy = y - 46 - www.px * 0.28;
    auftakt = [
      { t: 0, pose: { x: RAND + www.b * 0.3, y: wy, z: 1.7 } },
      {
        t: 0.95,
        pose: { x: RAND + www.b / 2, y: wy, z: (0.9 * f.b) / www.b },
        kurve: "aus",
      },
    ];
    kopfAb = 1.05;
  } else if (stempel) {
    auftakt = nahaufnahme({
      x: stempel.x,
      y: stempel.y,
      z: Math.min(zMax, (0.7 * f.b) / (stempel.r * 2)),
    });
    schlaege = [{ t: 0.26, kraft: 0.7 }];
    kopfAb = 1.05;
  }
  k.regie = {
    ...regieStandard(k, {
      auftakt,
      x: RAND,
      y,
      satz,
      laut: true,
      schlaege,
      hand: 1,
    }),
    kopf: { ab: kopfAb, weg: [T_SCHLAG - 0.3, T_RUECK + 0.05] },
  };

  return (t) => {
    grund(k, l);
    ebene(k, TIEFE_REQUISIT, () => {
      if (ausrufe) {
        // Großes Ausrufezeichen in der Akzentfarbe: das lauteste Bild der Reihe.
        zeichenMalen(k, "!", ausrufe, t, {
          farbe: marke(l),
          fett: true,
          auftritt: "ausrufe",
          spalt,
          decke: f.oben + 84,
        });
      } else if (zitat) {
        // Großes Anführungszeichen direkt über dem Satz.
        zeichenMalen(k, "“", zitat, t, {
          farbe: marke(l),
          auftritt: "zitat",
          decke: f.oben + 84,
        });
      } else if (www) {
        // „www.“ groß als Umriss, so breit wie der Satzspiegel, über dem
        // Satz; im Film deckt es sich von links nach rechts auf.
        const q = 0.12 + 0.88 * KURVE.weich(klemme(t / 0.75));
        if (q < 1) {
          ctx.beginPath();
          ctx.rect(RAND - 30, y - 46 - www.px, (www.b + 60) * q, www.px * 1.3);
          ctx.clip();
        }
        ctx.globalAlpha = 0.92;
        ctx.font = `800 ${www.px}px ${GROTESK}`;
        sperren(ctx, -www.px * 0.02);
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.strokeStyle = l.text;
        ctx.strokeText("www.", www.x, y - 46);
        sperren(ctx, 0);
      } else if (stempel) {
        // Runder Stempel mit umlaufender Schrift und dem Doppelring der
        // Marke. Im Film setzt er hart auf und dreht sich dann langsam
        // in seine Lage.
        const { r } = stempel;
        const auf = hart(t, 0.12, 0.14);
        ctx.globalAlpha = 0.3 + 0.7 * auf;
        ctx.translate(stempel.x, stempel.y);
        ctx.scale(1.8 - 0.8 * auf, 1.8 - 0.8 * auf);
        ctx.rotate(((-14 + lauf(t) * 9) * Math.PI) / 180);
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
    });
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    kopf(k, farben.kopf, art, t);
    satz.zeichne(RAND, y, t, satzFarben(k));
    zusatz.zeichne(
      RAND,
      y + satz.hoehe + luecke,
      t,
      satz.ende + 0.25,
      l.weich,
      l.akzent,
    );
    fuss(k, t, farben.fuss);
    abschluss(k, t, 0.1);
  };
}

/** Sprechblase (Real Talk): der Satz in einer großen Blase auf Papier. */
function sprechblase(k: Basis): Maler {
  const { ctx, f, l, karte } = k;
  const farben = rahmenFarben(l);
  const aussen = f.b - RAND * 2;
  const innen = aussen - 124;
  const zusatz = setzeZusatz(k, f.b - RAND * 2);
  const hoch = k.unten - k.oben;
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    innen,
    hoch - zusatz.hoehe - 300,
    120,
  );
  const blase = satz.hoehe + 132;
  const gesamt = blase + 136 + zusatz.hoehe;
  const y = k.oben + 20 + Math.max(0, hoch - 20 - gesamt) * 0.42;
  const x = RAND;
  const stark = kraeftig(l);
  // Die Spitze der Blase: Aus ihr wächst die Blase heraus. Die Kamera
  // beginnt nah an der Spitze und wird von der Blase zurückgedrückt.
  const spitze = { x: x + 70, y: y + blase + 82 };
  const ganz = { x: x + aussen / 2, y: y + blase / 2 + 30, z: 1.22 };
  k.regie = regieStandard(k, {
    auftakt: [
      { t: 0, pose: { x: spitze.x + 160, y: spitze.y - 150, z: 1.7 } },
      { t: 0.6, pose: ganz, kurve: "aus" },
      { t: 1, pose: { ...ganz, z: 1.2 }, kurve: "gerade" },
    ],
    schwenk: 0.3,
    x: x + 62,
    y: y + 66,
    satz,
    rahmen: { x, b: aussen },
    laut: true,
    hand: 2,
  });
  return (t) => {
    grund(k, l);
    kopf(k, farben.kopf, karte.kicker, t);
    // Die Blase wächst aus ihrer Spitze (ein kleiner Überschwinger).
    const s = 0.25 + 0.75 * zurueck(t, 0, 0.42, 0.9);
    ctx.save();
    ctx.translate(spitze.x, spitze.y);
    ctx.scale(s, s);
    ctx.translate(-spitze.x, -spitze.y);
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
    // Bevor der Satz kommt, tippt jemand: drei Punkte pulsieren.
    const tippt = Number.isFinite(t)
      ? klemme((t - 0.3) / 0.2) * (1 - klemme((t - T_SATZ + 0.2) / 0.15))
      : 0;
    if (tippt > 0) {
      ctx.fillStyle = TINTE;
      for (let i = 0; i < 3; i++) {
        const puls = 0.5 + 0.5 * Math.sin(t * 9 - i * 1.1);
        ctx.globalAlpha = tippt * (0.22 + 0.5 * puls);
        ctx.beginPath();
        ctx.arc(
          x + 84 + i * 46,
          y + 66 + satz.g * 0.5 - puls * 6,
          13,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    satz.zeichne(x + 62, y + 66, t, {
      text: TINTE,
      balken: stark,
      pointe: schriftAuf(stark),
    });
    ctx.restore();
    zusatz.zeichne(
      RAND,
      y + blase + 136,
      t,
      satz.ende + 0.25,
      l.weich,
      l.akzent,
    );
    fuss(k, t, farben.fuss);
    abschluss(k, t, 0.1);
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
  const lang = f.b - mastX + 120;
  // Aufmacher: Das Tuch füllt das Bild und schießt als Böe vom Mast; die
  // Kamera fährt zurück, bis Mast und Tuch im Bild stehen, dann wie ein
  // Kran hinunter zum Satz.
  const zMax = zoomMax(k);
  const tuch = { x: mastX + 150, y: y0 + hoehe / 2 };
  k.regie = regieStandard(k, {
    auftakt: [
      { t: 0, pose: { ...tuch, z: zMax, roll: 0.03 } },
      {
        t: 0.7,
        pose: { x: mastX + 110, y: oben + mast * 0.5, z: zMax * 0.7 },
        kurve: "aus",
      },
      {
        t: 0.85,
        pose: { x: mastX + 110, y: oben + mast * 0.5, z: zMax * 0.69 },
        kurve: "gerade",
      },
    ],
    schwenk: 0.58,
    x: RAND,
    y,
    satz,
    laut: rot,
    hand: rot ? 2 : 1,
  });
  return (t) => {
    grund(k, l);
    ebene(k, TIEFE_REQUISIT, () => {
      // Das Tuch ist vom ersten Bild an da, schießt als Böe heraus und
      // beruhigt sich; beim Schlag der Pointe antwortet es mit einer
      // zweiten Böe.
      const laenge = lang * (0.55 + 0.45 * aus(t, 0, 0.4));
      const boee =
        1 +
        0.9 * (1 - klemme(t / 0.9)) +
        (t >= T_SCHLAG ? 0.5 * Math.exp(-(t - T_SCHLAG) * 2.5) : 0);
      const phase = lauf(t) * 2.6;
      // Das Tuch besteht aus schmalen senkrechten Streifen, die einer Welle
      // folgen: So wirft es Falten, und im Film weht es.
      const welle = (x: number) =>
        Math.sin((x / lang) * Math.PI * 2.3 - phase) *
        fahne *
        0.085 *
        boee *
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
    });

    kopf(
      k,
      { etikett: farbe, etikettText: "#ffffff", datum: l.weich },
      karte.kicker,
      t,
    );
    satz.zeichne(RAND, y, t, {
      text: l.text,
      balken: farbe,
      pointe: "#ffffff",
    });
    zusatz.zeichne(
      RAND,
      y + satz.hoehe + luecke,
      t,
      satz.ende + 0.25,
      l.weich,
      farbe,
    );
    fuss(k, t, farben.fuss);
    abschluss(k, t, 0.1);
  };
}

/** Mythos: oben der Irrtum kursiv und durchgestrichen, unten auf Papier die Richtigstellung. */
function mythos(k: Basis): Maler {
  const { ctx, f, l, karte, serif } = k;
  const farben = rahmenFarben(l);
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
  const stark = kraeftig(l);
  const yMarke = teilung + 78;
  ctx.font = `700 26px ${GROTESK}`;
  sperren(ctx, 3.4);
  const marke0 = ctx.measureText("STIMMT NICHT").width + 62;
  sperren(ctx, 0);

  // Die Uhr dieser Reihe: Der Höhepunkt kommt früher (3,0 s), weil danach
  // noch die Richtigstellung gelesen wird. Nahaufnahme auf den Anfang des
  // Irrtums, Rückfahrt, während seine Zeilen kommen; dann wird er Zeile
  // für Zeile durchgestrichen, die Kamera reißt nach unten, das Papier
  // schiebt sich ihr entgegen, und „Stimmt nicht“ schlägt auf.
  const striche = irrtum.zeilen.map((_, i) => 2.2 + i * 0.12);
  const papierAb = 2.62;
  const schlag = 3.0;
  const weite = Math.max(...irrtum.zeilen.map((z) => z.breite));
  const zIrrtum = Math.max(1.02, Math.min(1.3, (0.86 * f.b) / weite));
  const aufIrrtum: Pose = {
    x: RAND + weite / 2,
    y: yIrrtum + irrtum.hoehe / 2 + (0.06 * f.h) / zIrrtum,
    z: zIrrtum,
  };
  const zPapier = Math.max(1, Math.min(1.1, (0.86 * f.b) / breite));
  const aufPapier: Pose = {
    x: f.b / 2,
    y: yMarke + (96 + wahr.hoehe) / 2 - (0.04 * f.h) / zPapier,
    z: zPapier,
  };
  // Der Riss landet nah auf „Stimmt nicht“ und der ersten Zeile.
  const aufPille: Pose = {
    x: RAND + Math.max(marke0, wahr.zeilen[0]?.breite ?? 0) * 0.5,
    y: yMarke + 62 + wahr.px * 0.6,
    z: Math.min(
      1.7,
      Math.max(
        zPapier,
        (0.84 * f.b) / Math.max(marke0, wahr.zeilen[0]?.breite ?? 0),
      ),
    ),
  };
  const totale = { x: f.b / 2, y: f.h / 2, z: 1 };
  k.regie = {
    fahrt: [
      {
        t: 0,
        pose: {
          x: RAND + irrtum.px * 1.6,
          y: yIrrtum + irrtum.px * 0.6,
          z: zoomMax(k) * 0.9,
          roll: -0.021,
        },
      },
      { t: 0.8, pose: aufIrrtum, kurve: "aus" },
      {
        t: papierAb,
        pose: { ...aufIrrtum, z: aufIrrtum.z * 1.04 },
        kurve: "gerade",
      },
      { t: schlag - 0.02, pose: aufPille, kurve: "reiss" },
      {
        t: schlag + 0.5,
        pose: { ...aufPille, z: aufPille.z * 1.02 },
        kurve: "gerade",
      },
      { t: schlag + 0.95, pose: aufPapier },
      {
        t: T_RUECK + 0.25,
        pose: { ...aufPapier, z: aufPapier.z * 1.02 },
        kurve: "gerade",
      },
      { t: T_STAND + 0.15, pose: { ...totale, z: ZOOM_WEIT }, kurve: "aus" },
      { t: T_RUHE, pose: totale, kurve: "gerade" },
    ],
    schlaege: [
      ...striche.map((s) => ({ t: s + 0.08, kraft: 0.3 })),
      { t: schlag, kraft: 1 },
    ],
    blitz: schlag,
    hand: 1,
    kopf: { ab: 0.75, weg: null },
  };
  return (t) => {
    grund(k, l);
    // Unten ein Blatt Papier mit schräger Oberkante, darauf der Fuß.
    const schub = (1 - aus(t, papierAb, 0.38)) * (f.h - teilung + 120);
    const neigung = (300 * 68) / f.b;
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
    ctx.restore();

    kopf(k, farben.kopf, "Mythos", t);
    // Die erste Zeile des Irrtums steht schon im ersten Bild, die
    // weiteren steigen aus der Maske; dann zieht der Strich hart durch
    // jede Zeile.
    irrtum.zeichne(RAND, yIrrtum, l.text, (i) => aus(t, -0.3 + i * 0.4, 0.5));
    ctx.strokeStyle = marke(l);
    ctx.lineWidth = Math.max(7, irrtum.px * 0.075);
    ctx.lineCap = "round";
    irrtum.zeilen.forEach((z, i) => {
      const zug = klemme((t - striche[i]) / 0.1);
      if (zug <= 0) return;
      const yy = yIrrtum + i * irrtum.px * 1.08 + irrtum.px * 0.58;
      ctx.beginPath();
      ctx.moveTo(RAND - 14, yy + 7);
      ctx.lineTo(RAND - 14 + (z.breite + 28) * zug, yy + 7 - 14 * zug);
      ctx.stroke();
    });

    // Die Richtigstellung auf dem Papier: Die Pille schlägt auf, dann
    // steigen die Zeilen nacheinander aus der Maske.
    const auf = hart(t, schlag - 0.14, 0.14);
    if (auf > 0.001) {
      ctx.save();
      ctx.translate(0, schub);
      ctx.save();
      // Wie ein Stempel: groß und schief heran, hart auf den Platz.
      ctx.translate(RAND + marke0 / 2, yMarke + 31);
      ctx.scale(2.4 - 1.4 * auf, 2.4 - 1.4 * auf);
      ctx.rotate(((1 - zurueck(t, schlag, 0.25)) * -6 * Math.PI) / 180);
      ctx.globalAlpha = 0.3 + 0.7 * auf;
      rund(ctx, -marke0 / 2, -31, marke0, 62, 31);
      ctx.fillStyle = stark;
      ctx.fill();
      ctx.font = `700 26px ${GROTESK}`;
      sperren(ctx, 3.4);
      ctx.fillStyle = pillenSchrift(stark);
      ctx.textBaseline = "middle";
      ctx.fillText("STIMMT NICHT", -marke0 / 2 + 31, 2);
      sperren(ctx, 0);
      ctx.restore();
      ctx.textBaseline = "alphabetic";
      wahr.zeichne(RAND, yMarke + 96, TINTE, (i) =>
        aus(t, schlag + (i === 0 ? 0.15 : 0.72 + (i - 1) * 0.3), 0.45),
      );
      ctx.restore();
    }
    abschluss(k, t, 0.1);
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
  // Hier gibt es kein Requisit: Der Satz selbst ist das Bild. Er beginnt
  // deshalb früher als in den anderen Reihen.
  const satzAb = 0.32;
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    breite,
    hoch - zusatz.hoehe - 170,
    132,
    satzAb,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  const y = k.oben + 26 + Math.max(0, hoch - 80 - gesamt) * 0.5;
  // Aufmacher: Der Sucher zieht sich zusammen, der Autofokus sucht, die
  // Handkamera findet den Satz.
  const blick = { x: RAND + satz.b * 0.4, y: y + satz.hoehe * 0.3 };
  k.regie = {
    ...regieStandard(k, {
      auftakt: [
        { t: 0, pose: { ...blick, z: 1.6 } },
        { t: 0.1, pose: { ...blick, z: 1.57 }, kurve: "gerade" },
      ],
      schwenk: 0.36,
      x: RAND,
      y,
      satz,
      laut: true,
      hand: 3,
    }),
    // Auf Schwarz wäre der volle Blitz ein grauer Schleier.
    blitzKraft: 0.06,
    kopf: { ab: -1, weg: [T_SCHLAG - 0.3, T_RUECK + 0.05] },
    // Der Autofokus sucht: unscharf, scharf, noch einmal kurz weg, scharf.
    unscharf: (t) =>
      t < 0.3
        ? 1 - t / 0.3
        : t < 0.5
          ? ((t - 0.3) / 0.2) * 0.35
          : t < 0.7
            ? 0.35 * (1 - (t - 0.5) / 0.2)
            : 0,
  };
  return (t) => {
    ebene(k, TIEFE_GRUND, () => {
      const u = 260;
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
    });

    // Sucher: hängt am Objektiv, macht also Fahrt und Zoom nicht mit.
    schirm(k, () => {
      // Die Ecken ziehen sich von außen an ihren Platz.
      const weit = (1 - aus(t, 0, 0.45)) * 34;
      const [x0, y0, x1, y1] = [
        RAND - 40 - weit,
        f.oben - 30 - weit,
        f.b - RAND + 40 + weit,
        f.unten + 42 + weit,
      ];
      const arm = 70;
      ctx.strokeStyle = "rgb(255 255 255 / 0.92)";
      ctx.lineWidth = 5;
      ctx.lineCap = "square";
      for (const [ex, ey, dx, dy] of [
        [x0, y0, 1, 1],
        [x1, y0, -1, 1],
        [x0, y1, 1, -1],
        [x1, y1, -1, -1],
      ]) {
        ctx.beginPath();
        ctx.moveTo(ex + dx * arm, ey);
        ctx.lineTo(ex, ey);
        ctx.lineTo(ex, ey + dy * arm);
        ctx.stroke();
      }
      // Roter Punkt (blinkt im Film), „POV“ und das Datum. In der
      // Nahaufnahme der Pointe treten sie zurück.
      ctx.globalAlpha = kopfDeck(k, t);
      const an = t < T_RUHE ? t % 1.1 < 0.7 : true;
      ctx.fillStyle = an ? "#ff3b30" : "rgb(255 59 48 / 0.25)";
      ctx.beginPath();
      ctx.arc(RAND + 12, f.oben + 37, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `500 30px ${mono}`;
      sperren(ctx, 5);
      ctx.fillStyle = "#ffffff";
      ctx.textBaseline = "middle";
      ctx.fillText("POV", RAND + 40, f.oben + 39);
      ctx.font = `400 26px ${mono}`;
      sperren(ctx, 1.2);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgb(255 255 255 / 0.72)";
      ctx.fillText(karte.datumKurz.toUpperCase(), f.b - RAND + 3, f.oben + 39);
      sperren(ctx, 0);
    });
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
      satz.ende + 0.25,
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
    abschluss(k, t, 0.16);
  };
}

/** Frage (Hand aufs Herz, Mal ehrlich): ein großes Fragezeichen als Umriss über dem Satz. */
function frage(k: Basis): Maler {
  const { f, l, karte } = k;
  const farben = rahmenFarben(l);
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
  // Aufmacher: Der Umriss deckt sich auf, die Kamera folgt vom Bogen den
  // Schaft hinunter. Eine leise Reihe: Die Pointe ist ein Geständnis,
  // kein Knall.
  const z =
    zeichen &&
    Math.min(zoomMax(k), (0.6 * f.b) / zeichen.b, (0.8 * f.h) / zeichen.h);
  k.regie = {
    ...regieStandard(k, {
      auftakt:
        zeichen && z
          ? [
              {
                t: 0,
                pose: {
                  x: (zeichen.l + zeichen.r) / 2,
                  y: zeichen.o + zeichen.h * 0.36,
                  z,
                },
              },
              {
                t: 0.9,
                pose: {
                  x: (zeichen.l + zeichen.r) / 2,
                  y: zeichen.o + zeichen.h * 0.58,
                  z: z * 0.95,
                },
              },
            ]
          : nahaufnahme({ x: RAND + 170, y: f.oben + 37, z: zoomMax(k) * 0.8 }),
      schwenk: 0.5,
      x: RAND,
      y,
      satz,
      laut: false,
      hand: 1,
    }),
    kopf: {
      ab: zeichen ? 1.05 : -1,
      weg: [T_SCHLAG - 0.3, T_RUECK + 0.05],
    },
  };
  return (t) => {
    grund(k, l);
    if (zeichen)
      ebene(k, TIEFE_REQUISIT, () =>
        zeichenMalen(k, "?", zeichen, t, {
          farbe: l.text,
          auftritt: "schreiben",
          decke: f.oben + 84,
        }),
      );
    kopf(k, farben.kopf, karte.kicker, t);
    satz.zeichne(RAND, y, t, satzFarben(k));
    zusatz.zeichne(
      RAND,
      y + satz.hoehe + luecke,
      t,
      satz.ende + 0.25,
      l.weich,
      l.akzent,
    );
    fuss(k, t, farben.fuss);
    abschluss(k, t, 0.1);
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
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    innen,
    hoch - zusatz.hoehe - 310,
    116,
  );
  const zettel = kopfLuft + satz.hoehe + 50 + zusatz.hoehe + 72;
  const x = RAND;
  const y = k.oben + 44 + Math.max(0, hoch - 70 - zettel) * 0.45;
  const schraeg = ((merken ? 0 : klein ? 1.5 : -1.8) * Math.PI) / 180;
  const ecke = klein ? 84 : 0;
  const band = l.name === "koralle" ? "#0f2a3a" : ORANGE;
  // Aufmacher: Nahaufnahme auf die Oberkante des Zettels, dort, wo gleich
  // der Klebestreifen (oder das Lesezeichen) aufgesetzt wird. Der Zettel
  // fällt ins Bild und landet: der laute Moment dieser Reihe. Die Pointe
  // wird später leise darauf gesetzt.
  const landung = 0.3;
  const halt = merken
    ? { x: x + aussen - 150, y: y + 60, z: zoomMax(k) * 0.92 }
    : { x: f.b / 2, y: y + 70, z: 1.9 };
  k.regie = regieStandard(k, {
    auftakt: nahaufnahme(halt, 0.75),
    schwenk: 0.5,
    x: x + rand,
    y: y + kopfLuft,
    satz,
    rahmen: { x, b: aussen },
    laut: false,
    schlaege: [
      { t: landung, kraft: 0.6 },
      { t: 0.56, kraft: 0.3 },
    ],
    hand: 1,
  });
  return (t) => {
    grund(k, l);
    kopf(k, farben.kopf, karte.kicker, t);
    // Der Zettel fällt verdreht ins Bild (im ersten Bild ist er schon zu
    // sehen), landet und pendelt mit einem Überschwinger in seine Lage.
    const fall = hart(t, -0.05, landung + 0.05);
    const liegt = zurueck(t, landung, 0.3);
    ctx.save();
    ctx.translate(f.b / 2, y + zettel / 2 - (1 - fall) * 460);
    ctx.rotate(schraeg + ((1 - liegt) * 6 * Math.PI) / 180);
    ctx.translate(-f.b / 2, -(y + zettel / 2));
    // Im Fall ist der Schatten weit und weich, bei der Landung zieht er
    // sich zusammen.
    schatten(
      k,
      70 + (1 - fall) * 90,
      34 + (1 - fall) * 70,
      0.3 - (1 - fall) * 0.14,
    );
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
    // Lesezeichen oder Klebestreifen: Sie werden aufgesetzt, kurz
    // nachdem der Zettel liegt.
    const fest = hart(t, 0.42, 0.14);
    if (fest > 0.001 && merken) {
      // Lesezeichen oben rechts, kurz genug, dass es über dem Satz endet.
      ctx.save();
      ctx.globalAlpha *= fest;
      ctx.translate(0, -(1 - fest) * 90);
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
    } else if (fest > 0.001) {
      // Klebestreifen: liegt auf der Oberkante, mit gezackten Enden.
      ctx.save();
      ctx.translate(f.b / 2, y + 2);
      ctx.rotate((-4 * Math.PI) / 180);
      ctx.scale(1.6 - 0.6 * fest, 1.6 - 0.6 * fest);
      ctx.globalAlpha *= 0.9 * fest;
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
    satz.zeichne(x + rand, y + kopfLuft, t, {
      text: TINTE,
      balken: stark,
      pointe: schriftAuf(stark),
    });
    zusatz.zeichne(
      x + rand,
      y + kopfLuft + satz.hoehe + 50,
      t,
      satz.ende + 0.25,
      "#4a433d",
      stark,
    );
    ctx.restore();
    fuss(k, t, farben.fuss);
    abschluss(k, t, 0.1);
  };
}

/** Welches Format gehört zu welcher Reihe? */
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
 * ergibt den Film: ein Take mit Kamerafahrt, die im Standbild endet.
 */
export async function storyVorbereiten(
  canvas: HTMLCanvasElement,
  karte: SpruchTag,
  format: StoryFormat = FORMATE.story,
  optionen: { skala?: number; versatz?: number } = {},
): Promise<StoryZeichner> {
  // skala < 1 zeichnet ein kleines Vorschaubild, versatz wählt ein
  // anderes Design als das des Tages.
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
      ...lade("italic 600 100px", serifRoh, `${karte.text}?!“`),
      ...lade("500 54px", serifRoh, "SITAL"),
      ...lade("400 26px", monoRoh, "sitalo.de POV"),
    ]),
    // Hängt das Netz, wird nach drei Sekunden mit Ersatzschrift gemalt.
    new Promise((fertig) => setTimeout(fertig, 3000)),
  ]);
  canvas.width = Math.round(format.b * skala);
  canvas.height = Math.round(format.h * skala);
  ctx.setTransform(skala, 0, 0, skala, 0, 0);
  const v = varianteFuer(karte.nummer, karte.platz, optionen.versatz ?? 0);
  const basis: Basis = {
    ctx,
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
    kam: { x: format.b / 2, y: format.h / 2, z: 1, roll: 0, ebene: 1 },
    regie: { fahrt: [], schlaege: [], blitz: null, hand: 0 },
  };
  const male = formatFuer(karte.kicker)(basis);
  // Für die Prüfung aller Karten: Hat ein Text nicht in sein Feld gepasst?
  canvas.dataset.eng = basis.eng.wert ? "1" : "";
  canvas.dataset.schrift = String(basis.eng.klein);

  /** Ein Bild der Szene durch die Kamera, wie sie zur Zeit t steht. */
  const szene = (t: number) => {
    Object.assign(basis.kam, kameraBei(basis, t), { ebene: 1 });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.setLineDash([]);
    ohneSchatten(ctx);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    kameraAn(basis, 1);
    male(t);
  };

  // Hilfsflächen für das gerechnete Video (erst bei Bedarf angelegt).
  let sammel: HTMLCanvasElement | null = null;
  let klein: HTMLCanvasElement | null = null;
  const unscharf = (t: number) =>
    basis.regie.unscharf ? basis.regie.unscharf(t) : 1 - aus(t, 0, 0.45);

  return (t, voll = false) => {
    if (!voll || !(t < T_RUHE)) return szene(t);
    // Bewegungsunschärfe wie aus einer echten Kamera: Bei schnellen
    // Fahrten wird das Bild aus mehreren Zwischenbildern gemittelt
    // (halbe Bilddauer belichtet). Das Bild des Schlags bleibt scharf.
    const [jetzt, davor] = [kameraBei(basis, t), kameraBei(basis, t - 1 / 30)];
    const weg =
      (Math.abs(jetzt.x - davor.x) + Math.abs(jetzt.y - davor.y)) * jetzt.z +
      (Math.abs(Math.log(jetzt.z / davor.z)) +
        Math.abs(jetzt.roll - davor.roll)) *
        format.h *
        0.5;
    const imSchlag = basis.regie.schlaege.some(
      (s) => t >= s.t && t - s.t < 1 / 30,
    );
    const n = imSchlag || weg < 5 ? 1 : Math.min(16, Math.ceil(weg / 5) + 1);
    if (n === 1) szene(t);
    else {
      sammel ??= document.createElement("canvas");
      if (sammel.width !== canvas.width || sammel.height !== canvas.height) {
        sammel.width = canvas.width;
        sammel.height = canvas.height;
      }
      const s = sammel.getContext("2d");
      if (!s) return szene(t);
      for (let j = n - 1; j >= 0; j--) {
        szene(t - (j / n) * (0.5 / 30));
        s.globalAlpha = 1 / (n - j);
        s.drawImage(canvas, 0, 0);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(sammel, 0, 0);
      // Die Zwischenbilder liegen bei sehr schnellen Fahrten sichtbar
      // auseinander. Dasselbe Bild noch einmal, um einen halben Schritt
      // versetzt (verschoben und um die Bildmitte vergrößert), glättet
      // die Stufen zu echter Unschärfe.
      const halb = 0.25 / n;
      const zoom = (jetzt.z / davor.z) ** halb;
      const [mx, my] = [canvas.width / 2, canvas.height / 2];
      ctx.globalAlpha = 0.5;
      ctx.setTransform(
        zoom,
        0,
        0,
        zoom,
        mx * (1 - zoom) + (davor.x - jetzt.x) * jetzt.z * skala * halb,
        my * (1 - zoom) + (davor.y - jetzt.y) * jetzt.z * skala * halb,
      );
      ctx.drawImage(sammel, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    }
    // Schärfe ziehen: Das Bild beginnt unscharf und wird scharf.
    const weichheit = unscharf(t);
    if (weichheit > 0.02) {
      klein ??= document.createElement("canvas");
      klein.width = Math.max(8, Math.round(canvas.width / 10));
      klein.height = Math.max(8, Math.round(canvas.height / 10));
      const c = klein.getContext("2d");
      if (!c) return;
      c.imageSmoothingQuality = "high";
      c.drawImage(canvas, 0, 0, klein.width, klein.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = Math.min(1, weichheit * 1.6);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(klein, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  };
}

/** Zeichnet das fertige Standbild. */
export async function zeichneStory(
  canvas: HTMLCanvasElement,
  karte: SpruchTag,
  format: StoryFormat = FORMATE.story,
  optionen: { skala?: number; versatz?: number } = {},
): Promise<void> {
  (await storyVorbereiten(canvas, karte, format, optionen))(Infinity);
}
