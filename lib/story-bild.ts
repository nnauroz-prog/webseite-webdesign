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
 */
import {
  HAMBURG_HORIZONT,
  HAMBURG_OST,
  HAMBURG_WAHRZEICHEN,
  HAMBURG_WEST,
} from "@/lib/hamburg-skyline";
import type { SpruchTag } from "@/lib/sprueche-data";
import { STORY_LOOKS, type StoryLook } from "@/lib/story-look";
import { KURSIV_SPERRUNG, satzPlan, type SatzPlan } from "@/lib/story-satz";
import { MOTIV_WASSER } from "@/lib/story-teile";
import {
  varianteFuer,
  type Auftritt,
  type Kamera,
  type Variante,
} from "@/lib/story-variante";

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
/** Zeichnet das Bild zur Zeit t (Sekunden; Infinity = Standbild). */
export type StoryZeichner = (t: number) => void;

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
  ctx.setTransform(skala, 0, 0, skala, 0, 0);
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
  return oben - 16;
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
 * Farbstreifen hinter der Pointe: Ober- und Unterkante laufen parallel,
 * die Enden neigen sich wie die Kursive. Die Höhe folgt der Schrift
 * (Oberlänge bis Unterlänge), damit kein Buchstabe an die Kante stößt.
 * innen rückt den Umriss nach innen (für den Stellplatz).
 */
function streifenPfad(
  ctx: Ctx,
  x0: number,
  x1: number,
  grundlinie: number,
  px: number,
  innen = 0,
) {
  const oben = grundlinie - px * 0.74 + innen;
  const unten = grundlinie + px * 0.31 - innen;
  const schub = px * 0.045;
  ctx.beginPath();
  ctx.moveTo(x0 - px * 0.13 + schub + innen, oben);
  ctx.lineTo(x1 + px * 0.1 + schub - innen, oben);
  ctx.lineTo(x1 + px * 0.1 - schub - innen, unten);
  ctx.lineTo(x0 - px * 0.13 - schub + innen, unten);
  ctx.closePath();
}

// Feines Korn über dem ganzen Bild: nimmt den Flächen das Glatte. Es
// steht still wie Papierfaser, auch im Film.
let kornMuster: HTMLCanvasElement | null = null;
function korn(k: Basis, deck: number) {
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
  px: number;
  woerter: { t: string; x: number }[];
};

/** Ein gesetzter Satz: Maße, die Lage der Pointe und die Zeichenfunktion. */
type Gesetzt = {
  hoehe: number;
  /** Größe der Grundschrift */
  g: number;
  /** Breite der längsten Zeile */
  b: number;
  /** Kasten um alle Streifen der Pointe (relativ zur linken oberen Ecke) */
  pointe: { x: number; y: number; b: number; h: number };
  /** Gewicht der Pointe (0,35 bis 1): Ein Wort ist leicht, zwei Zeilen sind schwer. */
  masse: number;
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
function setzeSatz(
  k: Basis,
  plan: SatzPlan,
  breite: number,
  platz: number,
  maxG = 132,
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

  type Versuch = {
    hoehe: number;
    /** gedruckte Zeilen: Grundlinie und die Wörter ohne die Pointe */
    zeilen: { grundlinie: number; woerter: { t: string; x: number }[] }[];
    streifen: Streifen[];
    /** Block am Satzende: Höhe seiner Mitte (er steht leicht schräg) */
    block: number | null;
    p: number;
    b: number;
    einsam: boolean;
  };

  const versuche = (g: number): Versuch | null => {
    const zeilenHoehe = g * 1.06;
    const abstand = g * 0.23;
    const zeilen: Versuch["zeilen"] = [];
    const streifen: Streifen[] = [];
    let hoehe = 0;
    let pGross = g * 1.25;
    let weite = 0;
    let einsam = false;
    let block: number | null = null;

    if (plan.art === "fluss") {
      const p = Math.round(g * 1.25);
      let letzte: Zeile[] = [];
      let geteilt = false;
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
          // Eine Zeile mit Farbstreifen bekommt Luft nach oben und unten,
          // damit der Streifen keine Nachbarzeile berührt.
          const mitStreifen = z.woerter.some((w) => w.betont);
          const davor = mitStreifen && zeilen.length ? g * 0.16 : 0;
          const grundlinie = hoehe + davor + g * 0.86;
          const gedruckt: { t: string; x: number }[] = [];
          let x = 0;
          let offen: Streifen | null = null;
          // Betonte Wörter, die nebeneinander stehen, teilen sich einen Streifen.
          for (const w of z.woerter) {
            if (!w.betont) {
              offen = null;
              gedruckt.push({ t: w.t, x });
            } else {
              if (!offen) {
                offen = { x0: x, x1: x, grundlinie, px: p, woerter: [] };
                streifen.push(offen);
              }
              offen.x1 = x + w.breite;
              offen.woerter.push({ t: w.t, x });
            }
            x += w.breite + abstand;
          }
          zeilen.push({ grundlinie, woerter: gedruckt });
          weite = Math.max(weite, z.breite);
          hoehe += zeilenHoehe + davor + (mitStreifen ? g * 0.14 : 0);
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
          let x = 0;
          zeilen.push({
            grundlinie: hoehe + g * 0.86,
            woerter: z.woerter.map((w) => {
              const lage = { t: w.t, x };
              x += w.breite + abstand;
              return lage;
            }),
          });
          weite = Math.max(weite, z.breite);
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
      // Zeilenabstand der Pointe: Zwischen zwei Streifen bleibt ein
      // gleichmäßiger Spalt; zum Satz darüber etwas Luft.
      const pZeile = p * 1.14;
      const luft = plan.vor.length ? p * 0.16 : 0;
      plan.pointe.forEach((z, i) => {
        const b = ctx.measureText(z).width;
        streifen.push({
          x0: p * 0.12,
          x1: p * 0.12 + b,
          grundlinie: hoehe + luft + i * pZeile + p * 0.8,
          px: p,
          woerter: [{ t: z, x: p * 0.12 }],
        });
        weite = Math.max(weite, b + p * 0.23);
      });
      // Der Block steht leicht schräg, wie von Hand aufgeklebt.
      block = hoehe + luft + (plan.pointe.length * pZeile) / 2;
      hoehe += luft + plan.pointe.length * pZeile + p * 0.06;
    }
    return { hoehe, zeilen, streifen, block, p: pGross, b: weite, einsam };
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
  const satz: Versuch = beste ??
    versuche(52) ?? {
      hoehe: 0,
      zeilen: [],
      streifen: [],
      block: null,
      p: 52,
      b: breite,
      einsam: false,
    };
  sperren(ctx, 0);
  const { zeilen, streifen, block } = satz;

  // Kasten um alle Streifen und ihr Gewicht.
  const kanten = streifen.map((s) => ({
    l: s.x0 - s.px * 0.13,
    r: s.x1 + s.px * 0.1,
    o: s.grundlinie - s.px * 0.74,
    u: s.grundlinie + s.px * 0.31,
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
    : { x: 0, y: 0, b: satz.b || breite, h: satz.hoehe };
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
      const [c, s] = [Math.cos(BLOCK_SCHRAEG), Math.sin(BLOCK_SCHRAEG)];
      const [dx, dy] = [px - x, py - (y + block)];
      return [x + dx * c - dy * s, y + block + dx * s + dy * c];
    };
    const oben = streifen[0];
    const kante = y + oben.grundlinie - oben.px * 0.74;
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
    pointe,
    masse,
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
      ctx.font = grotesk(g);
      sperren(ctx, -g * 0.032);
      ctx.fillStyle = farben.text;
      for (const z of zeilen)
        for (const w of z.woerter) ctx.fillText(w.t, x + w.x, y + z.grundlinie);
      ctx.restore();
      sperren(ctx, 0);
      if (!streifen.length) return;

      /** Zeichnet im leicht schrägen Block (falls die Pointe einer ist). */
      const imBlock = (zeichne: () => void) => {
        if (block === null) return zeichne();
        ctx.save();
        ctx.translate(x, y + block);
        ctx.rotate(BLOCK_SCHRAEG);
        ctx.translate(-x, -(y + block));
        zeichne();
        ctx.restore();
      };
      /** Das Wort eines Streifens. */
      const wortMalen = (s: Streifen, farbe: string) => {
        ctx.font = kursiv(s.px);
        sperren(ctx, s.px * KURSIV_SPERRUNG);
        ctx.fillStyle = farbe;
        for (const w of s.woerter) ctx.fillText(w.t, x + w.x, y + s.grundlinie);
        sperren(ctx, 0);
      };
      /** Ein Streifen, mit oder ohne sein Wort. */
      const streifenMalen = (s: Streifen, wort: boolean) => {
        streifenPfad(ctx, x + s.x0, x + s.x1, y + s.grundlinie, s.px);
        ctx.fillStyle = farben.balken;
        ctx.fill();
        ohneSchatten(ctx);
        if (wort) wortMalen(s, farben.pointe);
      };
      /** Kanten eines Streifens: links, rechts, oben, unten. */
      const kasten = (s: Streifen) => [
        x + s.x0 - s.px * 0.13,
        x + s.x1 + s.px * 0.1,
        y + s.grundlinie - s.px * 0.74,
        y + s.grundlinie + s.px * 0.31,
      ];
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
                y + s.grundlinie + s.px * 0.31,
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
            // Das Wort steht im Aufsetzbild da.
            streifenMalen(s, t >= T_SCHLAG);
            ctx.restore();
          }),
        );

      // Standbild und Film nach dem Auftritt: Die Pointe liegt.
      if (!(t < T_SCHLAG + 0.6)) return malePaket(0);

      /**
       * Klapptafel wie am Bahnhof: Der Streifen steht leer da, schlägt
       * einmal leer um und dann auf das Wort. Jeder Schlag dauert sechs
       * Bilder; die obere Hälfte fällt nach vorn und wird zur unteren.
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
          if (dunkel > 0) {
            streifenPfad(ctx, x + s.x0, x + s.x1, y + s.grundlinie, s.px);
            ctx.fillStyle = `rgb(0 0 0 / ${dunkel})`;
            ctx.fill();
          }
          ctx.restore();
        };
        const schlaege = [ende - 13 / 30, ende - 6 / 30];
        const i = t >= schlaege[1] ? 1 : t >= schlaege[0] ? 0 : -1;
        const u = i < 0 ? 1 : (t - schlaege[i]) / (6 / 30);
        if (u >= 1) streifenMalen(s, false);
        else {
          // Dahinter: oben schon das neue Blatt, unten noch das alte.
          haelfte(true, i === 1);
          haelfte(false, false);
          // Davor die fallende Hälfte; je steiler, desto dunkler.
          if (u < 0.5) haelfte(true, false, 1 - 2 * u, 0.3 * (2 * u));
          else haelfte(false, i === 1, 2 * u - 1, 0.3 * (2 - 2 * u));
        }
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
        // Das Band ist rundum größer als der Streifen, an den gezackten
        // Enden deutlich: Nichts von der Pointe schaut vorher heraus.
        const rand = Math.max(10, s.px * 0.07);
        const [l0, r0, o0, u0] = kasten(s);
        const [links, rechts, oben, unten] = [
          l0 - rand - 14,
          r0 + rand + 14,
          o0 - rand / 2,
          u0 + rand / 2,
        ];
        const dauer = 0.45 + 0.3 * klemme((rechts - links) / 900);
        const p = klemme((t - (ende - dauer)) / dauer) ** 1.7;
        const kante = links + (rechts - links) * p;
        const hell = helligkeit(farben.text) > 0.7;
        const zacken = (xx: number, yy: number, richtung: number) => {
          for (let i = 0; i <= 6; i++)
            ctx.lineTo(
              xx - (i % 2 ? 9 : 0),
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
                links + (i % 2 ? 9 : 0),
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
      if (t < T_SCHLAG)
        imBlock(() => {
          ctx.save();
          ctx.strokeStyle = mitDeck(
            farben.text,
            helligkeit(farben.text) > 0.7 ? 0.45 : 0.38,
          );
          ctx.lineWidth = 2.5;
          ctx.lineCap = "butt";
          ctx.lineJoin = "miter";
          ctx.setLineDash([14, 9]);
          for (const s of streifen) {
            streifenPfad(ctx, x + s.x0, x + s.x1, y + s.grundlinie, s.px, 3);
            ctx.stroke();
          }
          ctx.restore();
        });
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
        let xx = x;
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
function grund(k: Basis, l: StoryLook) {
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
  ctx.restore();
}

/** Oben: Etikett der Reihe links, Datum rechts. Gedruckt, also vom ersten Bild an da. */
function kopf(
  k: Basis,
  farben: { etikett: string; etikettText: string; datum: string },
  etikett: string | null,
) {
  const { ctx, f, karte, mono } = k;
  ctx.save();
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

/** Maßstab der Hafen-Motive auf der Wasserlinie. */
const MOTIV_MASS = 2.4;

/**
 * Wo am Fuß was steht: die Wasserlinie, der Liegeplatz des Schiffs und
 * links davon Hamburg am anderen Ufer (Maßstab und Enden der Silhouette).
 */
function hafenLage(k: Basis) {
  const { f, v } = k;
  const y0 = f.unten - 112;
  const ziel = f.b - RAND - 46 - v.motiv.b * MOTIV_MASS;
  // In der hohen Story ist über der Linie mehr Platz als in den
  // gedrungenen Formaten.
  const mass = f.name === "story" ? 0.7 : 0.6;
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
) {
  const { ctx, f, v, serif, mono } = k;
  const hafen = hafenLage(k);
  const { y0 } = hafen;
  const zeit = lauf(t);
  ctx.save();
  // Die Elbe: eine feine Welle über die ganze Breite, darunter Wasser bis
  // zum unteren Rand. So schwimmt das Schiff auf etwas. Im Film zieht
  // die Welle langsam nach rechts.
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
  const welle = () => {
    ctx.beginPath();
    ctx.moveTo(links, y0 + hub(links));
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
  ctx.fillStyle = farben.hell
    ? "rgb(15 42 58 / 0.16)"
    : "rgb(255 255 255 / 0.15)";
  ctx.fill(stadtPfad());
  if (!farben.hell) {
    ctx.fillStyle = farben.ring;
    ctx.globalAlpha *= 0.9;
    for (const [fx, fy, fb] of STADT_FENSTER)
      ctx.fillRect(fx, fy, fb, fb * 1.1);
  }
  ctx.restore();

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
    ctx.fillStyle = farben.ring;
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
    const z = f.name === "story" ? 5 : 5.6;
    const sicht = f.b / z;
    const y = k.unten + 2 + f.h / 2 / z;
    fahrt = [
      { t: 0, pose: imBild(k, { x: h.west + sicht / 2 - 50, y, z }) },
      {
        t: 1.1,
        pose: imBild(k, { x: h.ost - sicht / 2 + 24, y, z }),
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

    kopf(k, farben.kopf, art);
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
    kopf(k, farben.kopf, karte.kicker);
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

    kopf(
      k,
      { etikett: farbe, etikettText: "#ffffff", datum: l.weich },
      karte.kicker,
    );
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
  return (t) => {
    grund(k, l);
    kopf(k, farben.kopf, "Mythos");
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

    // Sucher: Die Eckmarken stehen fest, nur der rote Punkt blinkt (eine
    // halbe Sekunde an, eine halbe aus).
    const [x0, y0, x1, y1] = [
      RAND - 40,
      f.oben - 30,
      f.b - RAND + 40,
      f.unten + 42,
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
    const an = t < T_RUHE ? Math.max(0, t) % 1 < 0.5 : true;
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
    kopf(k, farben.kopf, karte.kicker);
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
    kopf(k, farben.kopf, karte.kicker);
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
 * ergibt den Film, der im Standbild endet.
 */
export async function storyVorbereiten(
  canvas: HTMLCanvasElement,
  karte: SpruchTag,
  format: StoryFormat = FORMATE.story,
  optionen: {
    skala?: number;
    versatz?: number;
    film?: { auftritt?: Auftritt; kamera?: Kamera };
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
    kam: { x: format.b / 2, y: format.h / 2, z: 1, dy: 0 },
    film: {
      auftritt: optionen.film?.auftritt ?? v.auftritt,
      kamera: optionen.film?.kamera ?? v.kamera,
    },
    regie: { fahrt: [], feder: [], ladung: null },
  };
  const male = formatFuer(karte.kicker)(basis);
  // Für die Prüfung aller Karten: Hat ein Text nicht in sein Feld gepasst?
  canvas.dataset.eng = basis.eng.wert ? "1" : "";
  canvas.dataset.schrift = String(basis.eng.klein);

  return (t) => {
    Object.assign(basis.kam, kameraBei(basis, t));
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.setLineDash([]);
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ohneSchatten(ctx);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    kameraAn(basis);
    male(t);
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
