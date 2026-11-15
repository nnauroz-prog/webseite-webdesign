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
export const STORY_DAUER = 7;

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
};

/** Farben eines Satzes. */
type SatzFarben = {
  text: string;
  /** Balken hinter der Pointe und die Schrift darauf */
  balken: string;
  pointe: string;
};

// ---------------------------------------------------------------- Hilfen

/** Fortschritt 0 bis 1 eines Auftritts, der bei start beginnt (weich auslaufend). */
function ein(t: number, start: number, dauer: number): number {
  const k = Math.min(1, Math.max(0, (t - start) / dauer));
  return 1 - (1 - k) ** 3;
}
/** Wie ein(), aber mit leichtem Überschwingen. */
function schwung(t: number, start: number, dauer: number): number {
  const k = Math.min(1, Math.max(0, (t - start) / dauer));
  const c = 1.9;
  return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2;
}
/** Zeit im Film; im Standbild 0 (für Wehen, Blinken, Drehen). */
const lauf = (t: number) => (Number.isFinite(t) ? t : 0);

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
  k.ctx.shadowBlur = weite * k.skala;
  k.ctx.shadowOffsetY = versatz * k.skala;
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
function balken(
  ctx: Ctx,
  x0: number,
  x1: number,
  grundlinie: number,
  px: number,
  farbe: string,
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
  ctx.fillStyle = farbe;
  ctx.fill();
}

// Feines Korn über dem ganzen Bild: nimmt den Flächen das Glatte.
let kornMuster: HTMLCanvasElement | null = null;
function korn(k: Basis, deck: number) {
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
  const muster = k.ctx.createPattern(kornMuster, "repeat");
  if (!muster) return;
  k.ctx.save();
  k.ctx.globalAlpha = deck;
  k.ctx.globalCompositeOperation = "overlay";
  k.ctx.fillStyle = muster;
  k.ctx.fillRect(0, 0, k.f.b, k.f.h);
  k.ctx.restore();
}

// ---------------------------------------------------------------- Text

/** Ein gesetzter Satz: Höhe, Ende des Auftritts und die Zeichenfunktion. */
type Gesetzt = {
  hoehe: number;
  ende: number;
  /** Größe der Grundschrift */
  g: number;
  zeichne: (x: number, y: number, t: number, farben: SatzFarben) => void;
};

/**
 * Setzt den Satz der Karte so groß wie möglich in ein Feld der Breite
 * breite und der Höhe platz. Die Pointe steht kursiv auf einem Balken:
 * am Satzende als eigener, großer Block, mitten im Satz in der Zeile.
 * start ist der Beginn des Auftritts im Film (Zeile für Zeile).
 */
function setzeSatz(
  k: Basis,
  plan: SatzPlan,
  breite: number,
  platz: number,
  start: number,
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

  type Schritt = (x: number, y: number, t: number, f: SatzFarben) => number;
  type Versuch = {
    hoehe: number;
    schritte: Schritt[];
    ende: number;
    p: number;
    einsam: boolean;
  };

  const versuche = (g: number): Versuch | null => {
    const zeilenHoehe = g * 1.06;
    const abstand = g * 0.23;
    const schritte: Schritt[] = [];
    let hoehe = 0;
    let pGross = g * 1.25;
    let einsam = false;
    let ab = start;
    // Eine Zeile mit Farbstreifen bekommt Luft nach oben und unten, damit
    // der Streifen keine Nachbarzeile berührt.
    const zeile =
      (z: Zeile, p: number, beginn: number, davor = 0, danach = 0): Schritt =>
      (x0, yOben, t, farben) => {
        const y = yOben + davor;
        const a = ein(t, beginn, 0.55);
        if (a > 0) {
          const grundlinie = y + g * 0.86;
          ctx.save();
          ctx.globalAlpha *= a;
          ctx.translate(0, (1 - a) * g * 0.45);
          const zug = ein(t, beginn + 0.2, 0.5);
          let x = x0;
          let von: number | null = null;
          let bis = 0;
          for (const w of z.woerter) {
            if (w.betont) {
              if (von === null) von = x;
              bis = x + w.breite;
            } else if (von !== null) {
              balken(
                ctx,
                von,
                von + (bis - von) * zug,
                grundlinie,
                p,
                farben.balken,
              );
              von = null;
            }
            x += w.breite + abstand;
          }
          if (von !== null)
            balken(
              ctx,
              von,
              von + (bis - von) * zug,
              grundlinie,
              p,
              farben.balken,
            );
          x = x0;
          for (const w of z.woerter) {
            ctx.font = w.betont ? kursiv(p) : grotesk(g);
            sperren(ctx, w.betont ? p * KURSIV_SPERRUNG : -g * 0.032);
            ctx.fillStyle = w.betont && zug > 0.6 ? farben.pointe : farben.text;
            ctx.fillText(w.t, x, grundlinie);
            x += w.breite + abstand;
          }
          ctx.restore();
        }
        return y + zeilenHoehe + danach;
      };

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
          const streifen = z.woerter.some((w) => w.betont);
          const davor = streifen && schritte.length ? g * 0.16 : 0;
          const danach = streifen ? g * 0.14 : 0;
          schritte.push(zeile(z, p, ab, davor, danach));
          ab += 0.13;
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
          schritte.push(zeile(z, g, ab));
          ab += 0.13;
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
      // Zeilenabstand der Pointe: Zwischen zwei Streifen bleibt ein
      // gleichmäßiger Spalt; zum Satz darüber etwas Luft.
      const pZeile = p * 1.14;
      const luft = plan.vor.length ? p * 0.16 : 0;
      const blockHoehe = luft + plan.pointe.length * pZeile + p * 0.06;
      hoehe += blockHoehe;
      const beginn = ab + 0.15;
      ab = beginn + 0.35 + plan.pointe.length * 0.18;
      schritte.push((x0, y, t, farben) => {
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
          const zug = ein(t, beginn + i * 0.18, 0.5);
          const schrift = ein(t, beginn + i * 0.18 + 0.22, 0.45);
          if (zug <= 0) return;
          const grundlinie = oben + i * pZeile + p * 0.8;
          const x = x0 + p * 0.12;
          const b = ctx.measureText(z).width;
          balken(ctx, x, x + b * zug, grundlinie, p, farben.balken);
          ctx.globalAlpha = deck * schrift;
          ctx.fillStyle = farben.pointe;
          ctx.fillText(z, x, grundlinie + (1 - schrift) * p * 0.18);
          ctx.globalAlpha = deck;
        });
        ctx.restore();
        return y + blockHoehe;
      });
    }
    return { hoehe, schritte, ende: ab, p: pGross, einsam };
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
      ende: start,
      p: 52,
      einsam: false,
    };
  sperren(ctx, 0);
  return {
    hoehe: satz.hoehe,
    ende: satz.ende,
    g,
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
  zeichne: (x: number, y: number, farbe: string) => void;
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
    zeichne: (x, y, farbe) => {
      ctx.font = schrift(fest.px);
      sperren(ctx, fest.px * sperrung);
      ctx.fillStyle = farbe;
      ctx.textBaseline = "alphabetic";
      zeilen.forEach((z, i) => {
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
      const a = ein(t, start, 0.6);
      if (a <= 0) return;
      const { ctx } = k;
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.translate(0, (1 - a) * 26);
      // Geschwungener Pfeil vom Satz zum Zusatz.
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
      frei.zeichne(x + einzug, y, farbe);
      ctx.restore();
    },
  };
}

// ---------------------------------------------------------------- Rahmen

/** Grund: Verlauf in der Farbwelt, ein Licht, eine große ruhige Fläche. */
function grund(k: Basis, l: StoryLook) {
  const { ctx, f, v } = k;
  const g = ctx.createLinearGradient(0, 0, f.b, f.h);
  g.addColorStop(0, l.bg);
  g.addColorStop(1, l.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, f.b, f.h);
  const licht = ctx.createRadialGradient(940, f.oben, 0, 940, f.oben, 860);
  licht.addColorStop(0, `rgb(${l.licht} / ${l.lichtKraft})`);
  licht.addColorStop(1, `rgb(${l.licht} / 0)`);
  ctx.fillStyle = licht;
  ctx.fillRect(0, 0, f.b, f.oben + 880);
  // Eine große, ruhige Fläche Ton in Ton gibt dem Grund Tiefe: an manchen
  // Tagen eine schräge Teilung, an anderen ein Kreis, sonst nur das Licht.
  ctx.fillStyle = ton(l, 0.55, 0.1);
  ctx.beginPath();
  if (v.grund === "geteilt") {
    ctx.moveTo(0, f.h * 0.74);
    ctx.lineTo(f.b, f.h * 0.5);
    ctx.lineTo(f.b, f.h);
    ctx.lineTo(0, f.h);
  } else if (v.grund === "raster") {
    ctx.arc(f.b * 0.08, f.h * 0.9, f.b * 0.62, 0, Math.PI * 2);
  }
  ctx.closePath();
  ctx.fill();
}

/** Oben: Etikett der Reihe links, Datum rechts. */
function kopf(
  k: Basis,
  t: number,
  farben: { etikett: string; etikettText: string; datum: string },
  etikett: string | null,
) {
  const { ctx, f, karte, mono } = k;
  const a = ein(t, 0.15, 0.5);
  ctx.save();
  ctx.globalAlpha = a;
  if (etikett) {
    const text = etikett.toUpperCase();
    ctx.font = `700 26px ${GROTESK}`;
    sperren(ctx, 3.4);
    const b = ctx.measureText(text).width + 62;
    rund(ctx, RAND, f.oben + 6 - (1 - a) * 12, b, 62, 31);
    ctx.fillStyle = farben.etikett;
    ctx.fill();
    ctx.fillStyle = farben.etikettText;
    ctx.textBaseline = "middle";
    ctx.fillText(text, RAND + 31, f.oben + 39 - (1 - a) * 12);
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
 * (SITAL und der Doppelring) und die Adresse.
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
  const a = ein(t, 0.4, 0.7);
  ctx.save();
  ctx.globalAlpha = a;
  // Die Elbe: eine feine Welle über die ganze Breite, darunter Wasser bis
  // zum unteren Rand. So schwimmt das Schiff auf etwas.
  const welle = () => {
    ctx.beginPath();
    ctx.moveTo(RAND - 152, y0);
    for (let x = RAND - 152; x < f.b; x += 152)
      ctx.bezierCurveTo(x + 38, y0 - 7, x + 114, y0 + 7, x + 152, y0);
  };
  welle();
  ctx.lineTo(f.b + 160, f.h);
  ctx.lineTo(RAND - 152, f.h);
  ctx.closePath();
  ctx.fillStyle = farben.hell
    ? "rgb(15 42 58 / 0.055)"
    : "rgb(255 255 255 / 0.05)";
  ctx.fill();
  welle();
  ctx.strokeStyle = farben.linie;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Kleines Schiff auf der Linie (jeden Tag ein anderes); im Film fährt es ein.
  const s = 2.4;
  const m = v.motiv;
  const ziel = f.b - RAND - 46 - m.b * s;
  const fahrt = m.faehrt ? ein(t, 0.3, 2.6) : 1;
  const wiegen = m.faehrt ? Math.sin(lauf(t) * 2.4) : 0;
  ctx.save();
  ctx.globalAlpha = m.faehrt ? a : ein(t, 0.4, 0.8);
  ctx.translate(
    RAND + (ziel - RAND) * fahrt,
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

  // Wortmarke und Adresse.
  ctx.save();
  ctx.globalAlpha = a;
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

/**
 * Ein riesiges Satzzeichen in der freien Fläche über dem Satz: ganz
 * sichtbar, an den Rand des Satzspiegels gerückt und nie hinter Text.
 * Bei zu wenig Platz entfällt es.
 */
function grossZeichen(
  k: Basis,
  zeichen: string,
  oben: number,
  unten: number,
  da: number,
  stil: {
    farbe: string;
    /** fette Grotesk statt der kursiven Serife */
    fett?: boolean;
    umriss?: boolean;
    links?: boolean;
    hoechstens?: number;
    /** kleiner als so (Standard 150) entfällt das Zeichen */
    mindestens?: number;
  },
) {
  const { ctx, f, serif } = k;
  const hoehe = Math.min(unten - oben, stil.hoechstens ?? 720);
  if (hoehe < (stil.mindestens ?? 150) || da <= 0) return;
  const schrift = (px: number) =>
    stil.fett ? `800 ${px}px ${GROTESK}` : `italic 600 ${px}px ${serif}`;
  ctx.save();
  ctx.font = schrift(1000);
  const m = ctx.measureText(zeichen);
  const s = hoehe / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
  ctx.font = schrift(1000 * s);
  ctx.globalAlpha = da;
  const x = stil.links
    ? RAND + m.actualBoundingBoxLeft * s - (1 - da) * 60
    : f.b - RAND - m.actualBoundingBoxRight * s + (1 - da) * 90;
  const y = unten - m.actualBoundingBoxDescent * s;
  if (stil.umriss) {
    ctx.strokeStyle = stil.farbe;
    ctx.lineWidth = 9;
    ctx.lineJoin = "round";
    ctx.strokeText(zeichen, x, y);
  } else {
    ctx.fillStyle = stil.farbe;
    ctx.fillText(zeichen, x, y);
  }
  ctx.restore();
}

type Maler = (t: number) => void;

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
    0.85,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  // Hot Take: Der Satz steht unten, darüber das Ausrufezeichen.
  const y =
    art === "Hot Take"
      ? k.unten - gesamt
      : lage(k, k.oben + zeichenHoehe, k.unten, gesamt);
  return (t) => {
    grund(k, l);
    const da = ein(t, 0, 0.9);
    if (art === "Hot Take") {
      // Großes Ausrufezeichen in der Akzentfarbe: das lauteste Bild der Reihe.
      grossZeichen(k, "!", f.oben + 96, y - 56, da, {
        farbe: marke(l),
        fett: true,
      });
    } else if (art === "Kurz gesagt") {
      // Großes Anführungszeichen direkt über dem Satz.
      grossZeichen(k, "“", k.oben + 4, y - 44, da, {
        farbe: marke(l),
        links: true,
        hoechstens: zeichenHoehe * 0.66,
        mindestens: 84,
      });
    } else if (art === "Website-Wahrheit") {
      // „www.“ groß als Umriss, so breit wie der Satzspiegel, über dem Satz.
      ctx.save();
      ctx.globalAlpha = da * 0.92;
      ctx.font = `800 100px ${GROTESK}`;
      sperren(ctx, -2);
      const m = ctx.measureText("www.");
      const px = Math.min(
        (breite / (m.actualBoundingBoxLeft + m.actualBoundingBoxRight)) * 100,
        zeichenHoehe * 1.3,
      );
      ctx.font = `800 ${px}px ${GROTESK}`;
      sperren(ctx, -px * 0.02);
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";
      ctx.strokeStyle = l.text;
      ctx.strokeText(
        "www.",
        RAND + (m.actualBoundingBoxLeft * px) / 100 + (1 - da) * 80,
        y - 46,
      );
      sperren(ctx, 0);
      ctx.restore();
    } else {
      // Runder Stempel mit umlaufender Schrift und dem Doppelring der
      // Marke; im Film dreht er sich langsam.
      const r = zeichenHoehe * 0.5;
      ctx.save();
      ctx.globalAlpha = da;
      ctx.translate(f.b - RAND - r - 4, k.oben + zeichenHoehe * 0.5 - 4);
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
      ctx.restore();
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    kopf(k, t, farben.kopf, art);
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
    0.9,
    120,
  );
  const blase = satz.hoehe + 132;
  const gesamt = blase + 124 + zusatz.hoehe;
  const y = k.oben + 20 + Math.max(0, hoch - 20 - gesamt) * 0.42;
  const x = RAND;
  const stark = kraeftig(l);
  return (t) => {
    grund(k, l);
    kopf(k, t, farben.kopf, karte.kicker);
    // Blase springt auf (leichtes Überschwingen).
    const s = schwung(t, 0.3, 0.6);
    if (s > 0.02) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, ein(t, 0.3, 0.25));
      ctx.translate(x + 150, y + blase);
      ctx.scale(0.6 + 0.4 * s, 0.6 + 0.4 * s);
      ctx.translate(-(x + 150), -(y + blase));
      schatten(k, 70, 30, 0.26);
      ctx.fillStyle = PAPIER;
      // Blase und Spitze (unten links) aus einem Stück: ein Schatten.
      rund(ctx, x, y, aussen, blase, 64);
      ctx.moveTo(x + 96, y + blase - 6);
      ctx.lineTo(x + 70, y + blase + 82);
      ctx.lineTo(x + 208, y + blase - 6);
      ctx.closePath();
      ctx.fill();
      ohneSchatten(ctx);
      satz.zeichne(x + 62, y + 66, t, {
        text: TINTE,
        balken: stark,
        pointe: schriftAuf(stark),
      });
      ctx.restore();
    }
    zusatz.zeichne(
      RAND,
      y + blase + 124,
      t,
      satz.ende + 0.25,
      l.weich,
      l.akzent,
    );
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
  const kk = { ...k, l };
  const farben = rahmenFarben(l);
  const breite = f.b - RAND * 2;
  const hoch = k.unten - k.oben;
  const fahne = Math.round(hoch * (f.name === "story" ? 0.27 : 0.22));
  // Der Mast endet über dem Satz: Das Textfeld beginnt erst darunter.
  const mast = Math.round(fahne * 1.2);
  const feldOben = k.oben + mast + 36;
  const zusatz = setzeZusatz(kk, breite);
  const satz = setzeSatz(
    kk,
    satzPlan(karte),
    breite,
    k.unten - feldOben - zusatz.hoehe - 50,
    0.95,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  const y = feldOben + Math.max(0, k.unten - feldOben - gesamt) * 0.6;
  return (t) => {
    grund(kk, l);
    // Mast und Flagge oben rechts; die Flagge weht (im Film bewegt).
    const mastX = f.b * 0.56;
    const oben = k.oben - 6;
    const da = ein(t, 0.1, 0.9);
    ctx.save();
    ctx.globalAlpha = da;
    ctx.translate(0, (1 - da) * -60);
    const y0 = oben + 16;
    const hoehe = fahne * 0.8;
    const lang = f.b - mastX + 40;
    const phase = lauf(t) * 2.6;
    // Das Tuch besteht aus schmalen senkrechten Streifen, die einer Welle
    // folgen: So wirft es Falten, und im Film weht es.
    const welle = (x: number) =>
      Math.sin((x / lang) * Math.PI * 2.3 - phase) *
      fahne *
      0.085 *
      (0.25 + (x / lang) * 0.9);
    schatten(k, 30, 14, 0.14);
    ctx.fillStyle = farbe;
    ctx.beginPath();
    ctx.moveTo(mastX + 6, y0);
    for (let x = 0; x <= lang; x += 12)
      ctx.lineTo(mastX + 6 + x, y0 + welle(x));
    for (let x = lang; x >= 0; x -= 12)
      ctx.lineTo(mastX + 6 + x, y0 + hoehe + welle(x) * 1.15);
    ctx.closePath();
    ctx.fill();
    ohneSchatten(ctx);
    // Licht auf den Wellenbergen, Schatten in den Tälern.
    ctx.save();
    ctx.clip();
    for (let x = 0; x < lang; x += 8) {
      const steigung = welle(x + 8) - welle(x);
      ctx.fillStyle =
        steigung > 0
          ? `rgb(0 0 0 / ${Math.min(0.11, steigung * 0.026)})`
          : `rgb(255 255 255 / ${Math.min(0.1, -steigung * 0.024)})`;
      ctx.fillRect(mastX + 6 + x, y0 - 60, 8.5, hoehe + 120);
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
      kk,
      t,
      { etikett: farbe, etikettText: "#ffffff", datum: l.weich },
      karte.kicker,
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
    fuss(kk, t, farben.fuss);
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
  return (t) => {
    grund(k, l);
    // Unten ein Blatt Papier mit schräger Oberkante.
    const hoch = ein(t, 0.2, 0.8);
    ctx.save();
    ctx.translate(0, (1 - hoch) * 240);
    schatten(k, 60, -14, 0.2);
    ctx.fillStyle = PAPIER;
    ctx.beginPath();
    ctx.moveTo(0, teilung + 34);
    ctx.lineTo(f.b, teilung - 34);
    ctx.lineTo(f.b, f.h + 300);
    ctx.lineTo(0, f.h + 300);
    ctx.closePath();
    ctx.fill();
    ohneSchatten(ctx);
    ctx.restore();

    kopf(k, t, farben.kopf, "Mythos");
    // Der Irrtum, dann zieht der Strich durch jede Zeile.
    const da = ein(t, 0.7, 0.6);
    ctx.save();
    ctx.globalAlpha = da;
    irrtum.zeichne(RAND, yIrrtum, l.text);
    ctx.restore();
    ctx.strokeStyle = marke(l);
    ctx.lineWidth = Math.max(7, irrtum.px * 0.075);
    ctx.lineCap = "round";
    irrtum.zeilen.forEach((z, i) => {
      const zug = ein(t, 1.5 + i * 0.22, 0.5);
      if (zug <= 0) return;
      const yy = yIrrtum + i * irrtum.px * 1.08 + irrtum.px * 0.58;
      ctx.beginPath();
      ctx.moveTo(RAND - 14, yy + 7);
      ctx.lineTo(RAND - 14 + (z.breite + 28) * zug, yy + 7 - 14 * zug);
      ctx.stroke();
    });

    // Die Richtigstellung auf dem Papier.
    const ab = 1.9 + irrtum.zeilen.length * 0.22;
    const w = ein(t, ab, 0.6);
    ctx.save();
    ctx.globalAlpha = w;
    ctx.translate(0, (1 - w) * 30);
    const yMarke = teilung + 78;
    ctx.font = `700 26px ${GROTESK}`;
    sperren(ctx, 3.4);
    const mb = ctx.measureText("STIMMT NICHT").width + 62;
    rund(ctx, RAND, yMarke, mb, 62, 31);
    ctx.fillStyle = stark;
    ctx.fill();
    ctx.fillStyle = pillenSchrift(stark);
    ctx.textBaseline = "middle";
    ctx.fillText("STIMMT NICHT", RAND + 31, yMarke + 33);
    sperren(ctx, 0);
    ctx.textBaseline = "alphabetic";
    wahr.zeichne(RAND, yMarke + 96, TINTE);
    ctx.restore();

    fuss(k, t, {
      schrift: TINTE,
      weich: "#4a433d",
      linie: "rgb(15 42 58 / 0.28)",
      ring: ORANGE,
      schiff: TINTE,
      flaeche: PAPIER,
      hell: true,
    });
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
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    breite,
    hoch - zusatz.hoehe - 170,
    0.9,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  const y = k.oben + 26 + Math.max(0, hoch - 80 - gesamt) * 0.5;
  return (t) => {
    ctx.fillStyle = "#0c0c0f";
    ctx.fillRect(0, 0, f.b, f.h);
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
    ctx.fillRect(0, 0, f.b, f.h);
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
    ctx.fillRect(0, 0, f.b, f.h);

    // Eckmarken des Suchers, um Kopf, Satz und Fuß herum.
    const a = ein(t, 0.1, 0.7);
    const [x0, y0, x1, y1] = [
      RAND - 36,
      f.oben - 30,
      f.b - RAND + 36,
      f.unten + 30,
    ];
    const arm = 70;
    const weit = (1 - a) * 40;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = "rgb(255 255 255 / 0.92)";
    ctx.lineWidth = 5;
    ctx.lineCap = "square";
    for (const [ex, ey, dx, dy] of [
      [x0 - weit, y0 - weit, 1, 1],
      [x1 + weit, y0 - weit, -1, 1],
      [x0 - weit, y1 + weit, 1, -1],
      [x1 + weit, y1 + weit, -1, -1],
    ]) {
      ctx.beginPath();
      ctx.moveTo(ex + dx * arm, ey);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex, ey + dy * arm);
      ctx.stroke();
    }
    // Roter Punkt (blinkt im Film), „POV“ und das Datum.
    const an = Number.isFinite(t) ? t % 1.1 < 0.7 : true;
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
    korn(k, 0.16);
  };
}

/** Frage (Hand aufs Herz, Mal ehrlich): ein großes Fragezeichen als Umriss über dem Satz. */
function frage(k: Basis): Maler {
  const { l, karte } = k;
  const farben = rahmenFarben(l);
  const breite = k.f.b - RAND * 2;
  const hoch = k.unten - k.oben;
  const zusatz = setzeZusatz(k, breite);
  const satz = setzeSatz(
    k,
    satzPlan(karte),
    breite,
    hoch -
      Math.round(hoch * (k.f.name === "story" ? 0.26 : 0.21)) -
      zusatz.hoehe -
      60,
    0.85,
  );
  const luecke = satz.g * 0.42;
  const gesamt = satz.hoehe + luecke + zusatz.hoehe;
  // Der Satz steht unten, das Fragezeichen füllt die Fläche darüber.
  const y = k.unten - gesamt;
  return (t) => {
    grund(k, l);
    grossZeichen(k, "?", k.f.oben + 96, y - 56, ein(t, 0, 1), {
      farbe: l.text,
      umriss: true,
    });
    kopf(k, t, farben.kopf, karte.kicker);
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
    1.0,
    116,
  );
  const zettel = kopfLuft + satz.hoehe + 50 + zusatz.hoehe + 72;
  const x = RAND;
  const y = k.oben + 44 + Math.max(0, hoch - 70 - zettel) * 0.45;
  const schraeg = ((merken ? 0 : klein ? 1.5 : -1.8) * Math.PI) / 180;
  const ecke = klein ? 84 : 0;
  const band = l.name === "koralle" ? "#0f2a3a" : ORANGE;
  return (t) => {
    grund(k, l);
    kopf(k, t, farben.kopf, karte.kicker);
    // Der Zettel fällt von oben ins Bild und bleibt liegen.
    const s = schwung(t, 0.25, 0.7);
    const da = Math.min(1, ein(t, 0.25, 0.3));
    if (da > 0) {
      ctx.save();
      ctx.globalAlpha = da;
      ctx.translate(f.b / 2, y + zettel / 2 - (1 - s) * 260);
      ctx.rotate(schraeg + (1 - s) * 0.12);
      ctx.translate(-f.b / 2, -(y + zettel / 2));
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
      if (merken) {
        // Lesezeichen oben rechts, kurz genug, dass es über dem Satz endet.
        ctx.fillStyle = stark;
        ctx.beginPath();
        ctx.moveTo(x + aussen - 124, y - 20);
        ctx.lineTo(x + aussen - 60, y - 20);
        ctx.lineTo(x + aussen - 60, y + 80);
        ctx.lineTo(x + aussen - 92, y + 54);
        ctx.lineTo(x + aussen - 124, y + 80);
        ctx.closePath();
        ctx.fill();
      } else {
        // Klebestreifen: liegt auf der Oberkante, mit gezackten Enden.
        ctx.save();
        ctx.translate(f.b / 2, y + 2);
        ctx.rotate((-4 * Math.PI) / 180);
        ctx.globalAlpha = da * 0.9;
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
    }
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
 * Bereitet die Karte vor (Schriften laden, Satz setzen) und gibt eine
 * Funktion zurück, die ein Bild zum Zeitpunkt t (Sekunden) zeichnet.
 * t = Infinity ist das fertige Standbild; 0 bis STORY_DAUER ergibt den
 * Film (Motiv erscheint, Satz steigt Zeile für Zeile, der Balken der
 * Pointe zieht durch, das Schiff fährt ein).
 */
export async function storyVorbereiten(
  canvas: HTMLCanvasElement,
  karte: SpruchTag,
  format: StoryFormat = FORMATE.story,
  optionen: { skala?: number; versatz?: number } = {},
): Promise<(t: number) => void> {
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
  };
  const male = formatFuer(karte.kicker)(basis);
  // Für die Prüfung aller Karten: Hat ein Text nicht in sein Feld gepasst?
  canvas.dataset.eng = basis.eng.wert ? "1" : "";
  canvas.dataset.schrift = String(basis.eng.klein);
  return (t: number) => {
    ctx.setTransform(skala, 0, 0, skala, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ohneSchatten(ctx);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
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
