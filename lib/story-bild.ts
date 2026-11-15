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
 * vom ersten Bild an fertig gedruckt da, nur die Pointe fehlt; ihr Platz
 * ist gestrichelt markiert wie ein Stellplatz am Kai. Die Kamera steht
 * nah am Requisit der Reihe, fährt einmal zum Satz und steht still. Die
 * Pointe wird wie Ladung im Hafen an zwei Seilen abgesetzt, das Plakat
 * federt nach, die Kamera fährt in die Totale, und das Schiff legt an.
 * Das letzte Bild ist das Standbild. Keine Lichteffekte, keine
 * Unschärfe: Was sich bewegt, hat ein Gewicht.
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
  /** Regie des Films; jedes Format legt sie beim Vorbereiten fest. */
  regie: Regie;
};

/** Kamera: Blickpunkt (Bildkoordinaten) und Zoom (1 = Standbild). */
type Pose = { x: number; y: number; z: number };
/**
 * Regie eines Films. Die Kamera macht nur einen schweren Rückzug: Sie
 * steht nah am Requisit der Reihe (nah), fährt zum Satz samt Lücke
 * (satz), steht dort still, bis die Pointe abgesetzt ist, und fährt dann
 * in die Totale, das Standbild. Dazu das Federn des ganzen Plakats, wenn
 * etwas Schweres aufsetzt (Weg in Bildpunkten, nach unten positiv).
 */
type Regie = {
  nah: Pose;
  satz: Pose;
  feder: { t: number; px: number }[];
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
const FAHRT_HIN = bezier(0.65, 0, 0.12, 1);
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
 * Die Uhr des Films, für alle Reihen gleich. Ein Satz ist das Gesetz:
 * Jedes Ding bewegt sich so, wie es wiegt, und Gedrucktes bewegt sich gar
 * nicht. Das Plakat ist vom ersten Bild an fertig gedruckt, nur die
 * Pointe fehlt; ihr Platz ist markiert wie ein Stellplatz am Kai.
 *
 * - bis T_NAH steht die Kamera nah am Requisit der Reihe,
 * - bis T_SATZ fährt sie zum Satz samt Lücke und steht dann still,
 * - die Pointe wird wie Ladung an zwei Seilen abgesetzt und setzt bei
 *   T_SCHLAG auf (das ganze Plakat federt nach),
 * - von T_RUECK bis T_STAND fährt die Kamera in die Totale,
 * - das Schiff fährt ein und legt bei T_RUHE an. Danach steht das
 *   Standbild.
 */
const T_NAH = 0.4;
const T_SATZ = 1.5;
const T_SCHLAG = 3.63;
const T_RUECK = 4.3;
const T_STAND = 5.6;
const T_RUHE = 7.4;
/** Auflösung: Der Pfeil wird gezogen, dann steht die Unterzeile da. */
const T_PFEIL = 4.5;
const T_ZUSATZ = 4.87;
/** Das Schiff fährt ein. */
const T_SCHIFF = 4.6;

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

/** Wo steht die Kamera zur Zeit t? Ab T_STAND und im Standbild neutral. */
function kameraBei(k: Basis, t: number): Basis["kam"] {
  const { f, regie } = k;
  const totale = { x: f.b / 2, y: f.h / 2, z: 1 };
  if (!(t < T_RUHE)) return { ...totale, dy: 0 };
  const mische = (a: Pose, b: Pose, e: number): Pose => ({
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    // Zoom im Verhältnis mischen: So wirkt die Fahrt gleichmäßig.
    z: a.z * (b.z / a.z) ** e,
  });
  const pose =
    t < T_NAH
      ? regie.nah
      : t < T_SATZ
        ? mische(
            regie.nah,
            regie.satz,
            FAHRT_HIN((t - T_NAH) / (T_SATZ - T_NAH)),
          )
        : t < T_RUECK
          ? regie.satz
          : t < T_STAND
            ? mische(
                regie.satz,
                totale,
                FAHRT_ZURUECK((t - T_RUECK) / (T_STAND - T_RUECK)),
              )
            : totale;
  let dy = 0;
  for (const s of regie.feder) dy += federWeg(t - s.t) * s.px;
  return { ...imBild(k, pose), dy };
}

/** Größter Zoom für die Nahaufnahme am Requisit. */
const ZOOM_NAH = 3;

/**
 * Nahaufnahme: Das Requisit steht mittig und füllt mit seiner längeren
 * Seite 85 Prozent der entsprechenden Bildseite.
 */
function nahAuf(
  k: Basis,
  kasten: { x: number; y: number; b: number; h: number },
  hoechstens = ZOOM_NAH,
): Pose {
  const { f } = k;
  const z =
    kasten.b / f.b > kasten.h / f.h
      ? (0.85 * f.b) / kasten.b
      : (0.85 * f.h) / kasten.h;
  return imBild(k, {
    x: kasten.x + kasten.b / 2,
    y: kasten.y + kasten.h / 2,
    z: Math.max(1.2, Math.min(hoechstens, z)),
  });
}

/**
 * Halt am Satz: Der Satzblock samt Lücke füllt 88 Prozent der Bildbreite
 * (Zoom 1,08 bis 1,35), die Lücke liegt etwas über der Bildmitte. Etikett
 * und Wortmarke stehen entweder ganz im Bild oder ganz draußen, nie
 * angeschnitten: Dafür rückt der Ausschnitt ein Stück nach oben oder
 * unten.
 */
function haltAmSatz(
  k: Basis,
  a: {
    /** linke obere Ecke des Satzes */
    x: number;
    y: number;
    satz: Gesetzt;
    /** Zettel oder Blase um den Satz: linke Kante und Breite */
    rahmen?: { x: number; b: number };
    /** Was nie angeschnitten sein darf (Standard: Etikett und Wortmarke) */
    baender?: number[][];
  },
): Pose {
  const { f } = k;
  const p = a.satz.pointe;
  const z = Math.max(
    1.08,
    Math.min(
      1.35,
      (0.88 * f.b) / a.satz.b,
      a.rahmen ? (0.94 * f.b) / a.rahmen.b : 9,
    ),
  );
  const pose = imBild(k, {
    x: a.rahmen ? a.rahmen.x + a.rahmen.b / 2 : a.x + a.satz.b / 2,
    y: a.y + p.y + p.h / 2 + (0.04 * f.h) / z,
    z,
  });
  return sauberStellen(k, pose, a.baender);
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
  const UEBER = 14;

  return {
    hoehe: satz.hoehe,
    g,
    b: satz.b || breite,
    pointe,
    masse,
    zeichne: (x, y, t, farben) => {
      // Gedrucktes steht vom ersten Bild an.
      ctx.font = grotesk(g);
      sperren(ctx, -g * 0.032);
      ctx.fillStyle = farben.text;
      for (const z of zeilen)
        for (const w of z.woerter) ctx.fillText(w.t, x + w.x, y + z.grundlinie);
      sperren(ctx, 0);
      if (!streifen.length) return;

      /** Zeichnet im leicht schrägen Block (falls die Pointe einer ist). */
      const imBlock = (zeichne: () => void) => {
        if (block === null) return zeichne();
        ctx.save();
        ctx.translate(x, y + block);
        ctx.rotate((-2 * Math.PI) / 180);
        ctx.translate(-x, -(y + block));
        zeichne();
        ctx.restore();
      };
      /** Die Streifen; schwebt = Höhe über dem Blatt (für den Schatten). */
      const maleStreifen = (schwebt: number) =>
        imBlock(() =>
          streifen.forEach((s, nr) => {
            ctx.save();
            // Im Aufsetzbild staucht sich der Streifen kurz (drei Bilder).
            const seit = t - T_SCHLAG;
            if (seit >= 0 && seit < 0.1) {
              const [mx, unten] = [
                x + (s.x0 + s.x1) / 2,
                y + s.grundlinie + s.px * 0.31,
              ];
              ctx.translate(mx, unten);
              ctx.scale(1.03, 0.94);
              ctx.translate(-mx, -unten);
            }
            if (schwebt > 0) {
              ctx.shadowColor = mitDeck(
                helligkeit(farben.text) > 0.7 ? "#000000" : farben.text,
                0.22,
              );
              ctx.shadowBlur = 18 * k.skala * k.kam.z;
              ctx.shadowOffsetY =
                Math.min(26, 0.12 * schwebt) * k.skala * k.kam.z;
            }
            streifenPfad(ctx, x + s.x0, x + s.x1, y + s.grundlinie, s.px);
            ctx.fillStyle = farben.balken;
            ctx.fill();
            ohneSchatten(ctx);
            // Das Wort steht im Aufsetzbild da, die zweite Zeile fünf
            // Bilder später.
            if (t >= T_SCHLAG + (nr * 5) / 30) {
              ctx.font = kursiv(s.px);
              sperren(ctx, s.px * KURSIV_SPERRUNG);
              ctx.fillStyle = farben.pointe;
              for (const w of s.woerter)
                ctx.fillText(w.t, x + w.x, y + s.grundlinie);
              sperren(ctx, 0);
            }
            ctx.restore();
          }),
        );

      // Standbild und Film nach dem Absetzen: Die Pointe liegt.
      if (!(t < T_SCHLAG + 0.45)) return maleStreifen(0);

      // Stellplatz: gestrichelter Umriss, bis die Ladung aufsetzt.
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
      if (t <= tSenk) return;

      // Die Ladung: alle Streifen als starres Paket an zwei Seilen.
      const drehe = (px: number, py: number): [number, number] => {
        if (block === null) return [px, py];
        const [c, s] = [Math.cos(-0.0349), Math.sin(-0.0349)];
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
      // Oberkante des Bildes, solange die Kamera am Satz steht.
      const bildOben = k.regie.satz.y - k.f.h / 2 / k.regie.satz.z;
      const start = bildOben - 30 - (y + pointe.y + pointe.h);
      const hoehe =
        t < tHalt
          ? start + (-UEBER - start) * SENKEN((t - tSenk) / (tHalt - tSenk))
          : t < tFall
            ? -UEBER
            : t < T_SCHLAG
              ? -UEBER * (1 - (t - tFall) / (T_SCHLAG - tFall))
              : 0;
      // Pendeln um den Aufhängepunkt, bis zum Halt gedämpft.
      const pendel =
        t < tHalt
          ? ausschlag *
            Math.exp(-daempfung * (t - tSenk)) *
            Math.cos(((t - tSenk) / 0.9) * Math.PI * 2) *
            (1 - klemme((t - tHalt + 0.2) / 0.2))
          : 0;
      // Nach dem Aufsetzen hängen die Seile schlaff und werden eingeholt.
      const schlaff = t >= T_SCHLAG ? 8 : 0;
      const hub =
        t < T_SCHLAG + 0.12
          ? 0
          : EINHOLEN((t - T_SCHLAG - 0.12) / 0.3) * (hy - 150 - bildOben + 260);
      // Aufhängepunkt: 150 Bildpunkte über der Mitte der Oberkante.
      const haken = {
        x: hx + lot.x * (hoehe - 150),
        y: hy + lot.y * (hoehe - 150),
      };
      ctx.save();
      ctx.strokeStyle = farben.text;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      // Das Seil vom Aufhängepunkt lotrecht nach oben aus dem Bild.
      ctx.beginPath();
      ctx.moveTo(haken.x - lot.x * hub, haken.y - lot.y * hub);
      ctx.lineTo(haken.x - lot.x * 6000, haken.y - lot.y * 6000);
      ctx.stroke();
      // Das Paket hängt am Haken und pendelt um ihn.
      ctx.translate(haken.x, haken.y);
      ctx.rotate(pendel);
      ctx.translate(-haken.x, -haken.y);
      ctx.translate(lot.x * hoehe, lot.y * hoehe);
      const [ax, ay] = [hx - lot.x * 150, hy - lot.y * 150];
      seilAn.forEach(([sx, sy], i) => {
        ctx.beginPath();
        ctx.moveTo(sx - lot.x * hub, sy - lot.y * hub);
        ctx.quadraticCurveTo(
          (sx + ax) / 2 + (i ? schlaff : -schlaff) - lot.x * hub,
          (sy + ay) / 2 - lot.y * hub,
          ax - lot.x * hub,
          ay - lot.y * hub,
        );
        ctx.stroke();
      });
      maleStreifen(-hoehe);
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
  const y0 = f.unten - 112;
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
  ctx.restore();

  // Kleines Schiff auf der Linie (jeden Tag ein anderes). Leuchtturm und
  // Kran stehen von Anfang an.
  const s = 2.4;
  const m = v.motiv;
  const ziel = f.b - RAND - 46 - m.b * s;
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

/**
 * Regie der Reihen mit abgesetzter Pointe: nah am Requisit, Halt am Satz,
 * und das Plakat federt, wenn die Pointe aufsetzt (schwere weiter).
 */
function regieFuer(
  k: Basis,
  a: {
    nah: Pose;
    x: number;
    y: number;
    satz: Gesetzt;
    rahmen?: { x: number; b: number };
    baender?: number[][];
    feder?: Regie["feder"];
  },
): Regie {
  const { masse, pointe } = a.satz;
  return {
    nah: a.nah,
    satz: haltAmSatz(k, a),
    feder: [
      ...(a.feder ?? []),
      ...(masse ? [{ t: T_SCHLAG, px: 6 + 8 * masse }] : []),
    ],
    ladung: masse ? { x: a.x + pointe.x + pointe.b / 2, masse } : null,
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
      ? nahAuf(k, kasten(ausrufe))
      : zitat
        ? nahAuf(k, kasten(zitat))
        : www
          ? nahAuf(k, {
              x: RAND,
              y: y - 46 - www.px * 0.56,
              b: www.b,
              h: www.px * 0.56,
            })
          : stempel
            ? nahAuf(k, {
                x: stempel.x - stempel.r,
                y: stempel.y - stempel.r,
                b: stempel.r * 2,
                h: stempel.r * 2,
              })
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
    rahmen: { x, b: aussen },
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
    nah: nahAuf(k, {
      x: mastX - 30,
      y: oben - 21,
      b: f.b - mastX + 30,
      h: mast * 0.8,
    }),
    x: RAND,
    y,
    satz,
  });
  return (t) => {
    grund(k, l);
    ctx.save();
    // Das Tuch weht in vier Stellungen, acht je Sekunde, wie von Hand
    // gezeichnet; mit dem Anlegen des Schiffs steht es in der Stellung
    // des Standbilds.
    const phase =
      t < T_RUHE ? -(Math.ceil((T_RUHE - t) * 8) % 4) * (Math.PI / 2) : 0;
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
  const weite = Math.max(
    marke0,
    ...irrtum.zeilen.map((z) => z.breite),
    ...wahr.zeilen.map((z) => z.breite),
  );
  k.regie = {
    // Nah am öffnenden Anführungszeichen des Irrtums.
    nah: imBild(k, {
      x: RAND + irrtum.px * 0.9,
      y: yIrrtum + irrtum.px * 0.6,
      z: 2.2,
    }),
    // Halt: der Irrtum und darunter der Platz für das Blatt.
    satz: sauberStellen(
      k,
      imBild(k, {
        x: RAND + weite / 2,
        y: (yIrrtum + yMarke + 96 + wahr.px * 1.3) / 2,
        z: Math.max(1.06, Math.min(1.3, (0.9 * f.b) / weite)),
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
    nah: zeichen ? nahAuf(k, kasten(zeichen)) : nahEtikett(k),
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
    rahmen: { x, b: aussen },
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
  const totale = { x: format.b / 2, y: format.h / 2, z: 1 };
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
    kam: { ...totale, dy: 0 },
    regie: { nah: totale, satz: totale, feder: [], ladung: null },
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
