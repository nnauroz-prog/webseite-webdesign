/**
 * Story-Bild für Instagram: zeichnet eine Spruch-Karte als 1080 × 1920
 * auf eine Zeichenfläche (nur im Browser, genutzt von /admin/story).
 *
 * Gleiche Farbwelten und gleicher Aufbau wie die Karte auf /journal
 * (components/marketing/journal/spruch-reel.tsx): große Tageszahl oben
 * rechts, Aufkleber mit dem Kicker direkt über dem Satz, die Pointe groß
 * und kursiv auf einem Farbbalken, darunter der Zusatz mit Pfeil, der
 * Absender und unten der Hafen mit der Fähre. Oben und unten bleibt je
 * ein Streifen frei von Text: Dort liegt in der Story die Bedienung von
 * Instagram.
 */
import type { SpruchTag } from "@/lib/sprueche-data";
import {
  drehungFuer,
  hafenLinie,
  lookFuer,
  stickerStern,
  type StoryLook,
} from "@/lib/story-look";
import { KURSIV_SPERRUNG, satzPlan } from "@/lib/story-satz";

/** Ausgabeformate: Story (9:16) und Beitrag (4:5). */
export type StoryFormat = {
  name: "story" | "beitrag";
  b: number;
  h: number;
  /** Text nur zwischen diesen Linien. In der Story liegt oben und unten
   *  die Bedienung von Instagram (obere 14 %, untere 16 % frei). */
  oben: number;
  unten: number;
  /** Oberkante der Hafenfläche */
  kante: number;
};
export const FORMATE: Record<StoryFormat["name"], StoryFormat> = {
  story: {
    name: "story",
    b: 1080,
    h: 1920,
    oben: 270,
    unten: 1612,
    kante: 1660,
  },
  beitrag: {
    name: "beitrag",
    b: 1080,
    h: 1350,
    oben: 92,
    unten: 1136,
    kante: 1184,
  },
};
/** Länge des Kurzvideos in Sekunden. */
export const STORY_DAUER = 7;

const STORY_B = 1080;
const RAND = 84;
const BREITE = STORY_B - RAND * 2;

const GROTESK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif';

type Ctx = CanvasRenderingContext2D;
type Wort = { t: string; betont: boolean; breite: number };
type Zeile = { woerter: Wort[]; breite: number };

/** Fortschritt 0 bis 1 eines Auftritts, der bei start beginnt (weich auslaufend). */
function ein(t: number, start: number, dauer: number): number {
  const k = Math.min(1, Math.max(0, (t - start) / dauer));
  return 1 - (1 - k) ** 3;
}
/** Wie ein(), aber mit leichtem Überschwingen (Aufkleber). */
function schwung(t: number, start: number, dauer: number): number {
  const k = Math.min(1, Math.max(0, (t - start) / dauer));
  const c = 1.9;
  return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2;
}

/** Buchstabenabstand, wo der Browser ihn auf der Zeichenfläche kennt. */
function sperren(ctx: Ctx, px: number) {
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = `${px}px`;
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

/**
 * Gleich viele Zeilen wie beim einfachen Umbruch, aber möglichst gleich
 * lang (wie text-wrap: balance). Ein einzelnes kurzes Wort allein in
 * einer Zeile kostet extra, außer es ist die Pointe.
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
  // kosten[z][j]: beste Summe für die ersten j Wörter in z Zeilen.
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
        const einsam =
          j - i === 1 && b < max * 0.5 && !woerter[i].betont ? 0.15 : 0;
        const c = kosten[z - 1][i] + luft * luft + einsam;
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

function stern(ctx: Ctx, x: number, y: number, r: number) {
  const k = r * 0.2;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + k, y - k, x + r, y);
  ctx.quadraticCurveTo(x + k, y + k, x, y + r);
  ctx.quadraticCurveTo(x - k, y + k, x - r, y);
  ctx.quadraticCurveTo(x - k, y - k, x, y - r);
  ctx.closePath();
  ctx.fill();
}

function pille(ctx: Ctx, x: number, y: number, b: number, h: number) {
  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + b - r, y);
  ctx.arc(x + b - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + r, r, Math.PI / 2, (Math.PI * 3) / 2);
  ctx.closePath();
}

/** Leicht schiefer Balken hinter der Pointe, wie mit dem Marker gezogen. */
function balken(
  ctx: Ctx,
  x0: number,
  x1: number,
  grundlinie: number,
  px: number,
  farbe: string,
) {
  const oben = grundlinie - px * 0.76;
  const unten = grundlinie + px * 0.29;
  ctx.beginPath();
  ctx.moveTo(x0 - px * 0.1, oben + px * 0.035);
  ctx.lineTo(x1 + px * 0.13, oben - px * 0.02);
  ctx.lineTo(x1 + px * 0.09, unten + px * 0.02);
  ctx.lineTo(x0 - px * 0.14, unten - px * 0.015);
  ctx.closePath();
  ctx.fillStyle = farbe;
  ctx.fill();
}

/** Grund: Farbfläche, ein Licht, große Tageszahl, unten Hafen und Fähre. */
function grund(
  ctx: Ctx,
  l: StoryLook,
  f: StoryFormat,
  karte: SpruchTag,
  serif: string,
  t: number,
) {
  const g = ctx.createLinearGradient(0, 0, f.b, f.h);
  g.addColorStop(0, l.bg);
  g.addColorStop(1, l.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, f.b, f.h);
  const licht = ctx.createRadialGradient(940, f.oben, 0, 940, f.oben, 820);
  licht.addColorStop(0, `rgb(${l.licht} / ${l.lichtKraft})`);
  licht.addColorStop(1, `rgb(${l.licht} / 0)`);
  ctx.fillStyle = licht;
  ctx.fillRect(0, 0, f.b, f.oben + 840);

  // Tageszahl: groß, kursiv, rechts angeschnitten, Ton in Ton.
  const zahl = ein(t, 0, 0.8);
  ctx.save();
  ctx.globalAlpha = zahl;
  ctx.font = `italic 600 460px ${serif}`;
  sperren(ctx, -12);
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = `rgb(${l.ziffer})`;
  ctx.fillText(karte.tagImMonat, f.b + 34 + (1 - zahl) * 120, f.oben + 300);
  sperren(ctx, 0);
  ctx.restore();

  // Hafen: deckende Fläche mit Wellenkante, darin eine helle Wellenlinie,
  // die im Video langsam zieht.
  const lauf = Number.isFinite(t) ? (t * 26) % 360 : 0;
  const kante = (y: number, hub: number, versatz: number) => {
    ctx.moveTo(-360 - versatz, y);
    for (let x = -360 - versatz; x < f.b; x += 360) {
      ctx.quadraticCurveTo(x + 90, y - hub, x + 180, y);
      ctx.quadraticCurveTo(x + 270, y + hub, x + 360, y);
    }
  };
  ctx.beginPath();
  kante(f.kante, 22, 0);
  ctx.lineTo(f.b + 360, f.h);
  ctx.lineTo(-360, f.h);
  ctx.closePath();
  ctx.fillStyle = l.hafen;
  ctx.fill();
  ctx.beginPath();
  kante(f.kante + 80, 16, lauf);
  ctx.strokeStyle = hafenLinie(l);
  ctx.lineWidth = 4;
  ctx.stroke();

  // Fähre rechts auf der Kante (Rumpf taucht in die Fläche ein). Im
  // Video fährt sie von links ein und wiegt sich.
  const fahrt = ein(t, 0.1, 2.8);
  const wiegen = Number.isFinite(t) ? Math.sin(t * 2.4) : 0;
  ctx.save();
  ctx.translate(-260 + (752 + 260) * fahrt, f.kante - 128 + wiegen * 4);
  ctx.translate(120, 135);
  ctx.rotate((wiegen * 1.3 * Math.PI) / 180);
  ctx.translate(-120, -135);
  ctx.scale(5.2, 5.2);
  ctx.fillStyle = l.faehre;
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(46, 18);
  ctx.lineTo(41, 26);
  ctx.lineTo(5, 26);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(5, 17.2);
  ctx.lineTo(5, 10.5);
  ctx.lineTo(36, 10.5);
  ctx.lineTo(41, 17.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(9, 6, 21, 4);
  ctx.fillStyle = l.streif;
  ctx.fillRect(0, 17.2, 46, 1.9);
  ctx.fillRect(21.5, 0.5, 3.4, 5.5);
  // Fenster in der Farbe des Grundes.
  ctx.fillStyle = l.bg;
  for (const fx of [9, 14.5, 20, 25.5, 31]) ctx.fillRect(fx, 12.2, 3.4, 2.6);
  ctx.restore();
}

function kennzeile(
  ctx: Ctx,
  l: StoryLook,
  f: StoryFormat,
  datum: string,
  mono: string,
  t: number,
) {
  const y = f.oben + 34;
  ctx.save();
  ctx.globalAlpha = ein(t, 0.15, 0.5);
  ctx.fillStyle = l.dunkel ? l.marker : l.text;
  ctx.fillRect(RAND, y - 42, 64, 5);
  ctx.font = `400 30px ${mono}`;
  sperren(ctx, 3.2);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = l.weich;
  ctx.fillText(`SPRUCH DES TAGES · ${datum.toUpperCase()}`, RAND, y);
  sperren(ctx, 0);
  ctx.restore();
}

function absender(ctx: Ctx, l: StoryLook, f: StoryFormat, t: number) {
  const mitteY = f.unten - 54;
  // Erst, wenn die Fähre vorbeigefahren ist.
  const a = ein(t, 1.5, 0.6);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(0, (1 - a) * 24);
  // Siegel: weißer Kreis mit dem Doppelring.
  ctx.beginPath();
  ctx.arc(RAND + 48, mitteY, 48, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.save();
  ctx.translate(RAND + 48 - 30, mitteY - 22);
  ctx.scale(2, 2);
  ctx.strokeStyle = "#f45b1e";
  ctx.lineWidth = 1.9;
  for (const cx of [12, 18]) {
    ctx.beginPath();
    ctx.ellipse(cx, 11, 10.2, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = l.text;
  ctx.font = `700 38px ${GROTESK}`;
  sperren(ctx, -0.4);
  ctx.fillText("Sitalo Webdesign", RAND + 120, mitteY - 6);
  sperren(ctx, 0);
  ctx.fillStyle = l.weich;
  ctx.font = `500 30px ${GROTESK}`;
  ctx.fillText("Hamburg · sitalo.de", RAND + 120, mitteY + 36);
  ctx.restore();
}

const AUFKLEBER_H = 100;

/** Aufkleber mit dem Kicker: Stanzrand, harter Schatten, drei Strahlen. */
function aufkleber(
  ctx: Ctx,
  l: StoryLook,
  kicker: string,
  y: number,
  grad: number,
  t: number,
) {
  const text = kicker.toUpperCase();
  // Auftritt: klebt mit Schwung auf (Maßstab und Drehung).
  const k = schwung(t, 0.35, 0.55);
  if (k <= 0.02) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, ein(t, 0.35, 0.2));
  ctx.translate(RAND, y + AUFKLEBER_H / 2);
  ctx.rotate(((grad - (1 - k) * 16) * Math.PI) / 180);
  ctx.scale(0.4 + 0.6 * k, 0.4 + 0.6 * k);
  ctx.font = `800 42px ${GROTESK}`;
  sperren(ctx, 3.4);
  const tb = ctx.measureText(text).width;
  const h = AUFKLEBER_H;
  const b = 40 + 38 + 16 + tb + 46;
  const hellerAufkleber = l.stickerBg === "#fff8ee";
  const rand = 8;
  // Schatten, dann Stanzrand, dann die Pille.
  pille(ctx, -rand + 8, -h / 2 - rand + 10, b + rand * 2, h + rand * 2);
  ctx.fillStyle = "rgb(0 0 0 / 0.2)";
  ctx.fill();
  if (!hellerAufkleber) {
    pille(ctx, -rand, -h / 2 - rand, b + rand * 2, h + rand * 2);
    ctx.fillStyle = "#fff8ee";
    ctx.fill();
  }
  pille(ctx, 0, -h / 2, b, h);
  ctx.fillStyle = l.stickerBg;
  ctx.fill();
  ctx.fillStyle = stickerStern(l);
  stern(ctx, 40 + 19, 0, 20);
  ctx.fillStyle = l.stickerText;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 40 + 38 + 16, 3);
  sperren(ctx, 0);
  // Drei kurze Strahlen an der Ecke oben rechts.
  ctx.strokeStyle = l.akzent;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  for (const [winkel, lang] of [
    [-78, 30],
    [-45, 36],
    [-12, 30],
  ]) {
    const w = (winkel * Math.PI) / 180;
    const x0 = b + 4 + Math.cos(w) * 26;
    const y0 = -h / 2 + 6 + Math.sin(w) * 26;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(w) * lang, y0 + Math.sin(w) * lang);
    ctx.stroke();
  }
  ctx.restore();
}

function pfeil(ctx: Ctx, x: number, y: number, farbe: string) {
  // Geschwungener Pfeil vom Satz zum Zusatz: von oben links nach rechts.
  ctx.save();
  ctx.strokeStyle = farbe;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x + 6, y - 34);
  ctx.bezierCurveTo(x + 2, y - 4, x + 14, y + 6, x + 52, y + 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 36, y - 14);
  ctx.lineTo(x + 54, y + 2);
  ctx.lineTo(x + 34, y + 16);
  ctx.stroke();
  ctx.restore();
}

/** Ein Schritt des Satzes: zeichnet ab y zum Zeitpunkt t, gibt das neue y zurück. */
type Schritt = (y: number, t: number) => number;
/** Ein gesetzter Satz in einer Schriftgröße. */
type Gesetzt = { hoehe: number; schritte: Schritt[]; ende: number };

/**
 * Bereitet die Karte vor (Schriften laden, Satz setzen) und gibt eine
 * Funktion zurück, die ein Bild zum Zeitpunkt t (Sekunden) zeichnet.
 * t = Infinity ist das fertige Standbild; 0 bis STORY_DAUER ergibt den
 * Film: Tageszahl schiebt herein, Aufkleber klebt auf, der Satz steigt
 * Zeile für Zeile, der Balken der Pointe zieht durch, die Fähre fährt ein.
 */
export async function storyVorbereiten(
  canvas: HTMLCanvasElement,
  karte: SpruchTag,
  format: StoryFormat = FORMATE.story,
): Promise<(t: number) => void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;
  const f = format;
  const stil = getComputedStyle(document.documentElement);
  const serif = `${stil.getPropertyValue("--font-serif").trim() || "Georgia"}, Georgia, "Times New Roman", serif`;
  const mono = `${stil.getPropertyValue("--font-brand-mono").trim() || "ui-monospace"}, ui-monospace, Menlo, monospace`;
  try {
    await Promise.all([
      document.fonts.load(
        `italic 600 100px ${serif}`,
        karte.betont + karte.tagImMonat,
      ),
      document.fonts.load(`400 27px ${mono}`, "SPRUCH DES TAGES"),
    ]);
  } catch {
    // Ersatzschrift reicht.
  }

  const l = lookFuer(karte.nummer);
  canvas.width = f.b;
  canvas.height = f.h;
  // Luft unter der Kennzeile: Die Strahlen des Aufklebers ragen nach oben.
  const feldOben = f.oben + 132;
  const feldUnten = f.unten - 150;

  // Zusatz: feste Größe, ausgewogen umbrochen.
  const zusatzPx = 50;
  const zusatzZeile = 66;
  const zusatzEinzug = 86;
  ctx.font = `500 ${zusatzPx}px ${GROTESK}`;
  sperren(ctx, 0);
  const zusatzAbstand = ctx.measureText(" ").width;
  const zusatzZeilen = ausgewogen(
    karte.zusatz.split(" ").map((w) => ({
      t: w,
      betont: false,
      breite: ctx.measureText(w).width,
    })),
    BREITE - zusatzEinzug - 30,
    zusatzAbstand,
  );
  const zusatzHoehe = zusatzZeilen.length * zusatzZeile;

  const plan = satzPlan(karte);
  const grotesk = (g: number) => `800 ${g}px ${GROTESK}`;
  const kursiv = (p: number) => `italic 600 ${p}px ${serif}`;

  /** Wörter in Grotesk (und Pointe im Fluss kursiv) messen. */
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

  /**
   * Satz in Größe g setzen, mit platz als verfügbarer Höhe. null, wenn
   * ein Wort nicht in die Zeile passt oder die Pointe zu klein würde.
   */
  const setzen = (
    g: number,
    platz: number,
  ): (Gesetzt & { p: number; einsam: boolean }) | null => {
    const zeilenHoehe = g * 1.06;
    const abstand = g * 0.23;
    const schritte: Schritt[] = [];
    let hoehe = 0;
    let pGross = g;
    let einsam = false;
    // Auftritte: Zeile für Zeile, je 0,13 s versetzt.
    let start = 0.8;
    const zeile =
      (z: Zeile, p: number, ab: number): Schritt =>
      (y, t) => {
        const a = ein(t, ab, 0.55);
        if (a > 0) {
          const grundlinie = y + g * 0.86;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.translate(0, (1 - a) * g * 0.45);
          // Erst die Balken hinter zusammenhängenden Pointen-Wörtern …
          const zug = ein(t, ab + 0.2, 0.5);
          let x = RAND;
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
                l.marker,
              );
              von = null;
            }
            x += w.breite + abstand;
          }
          if (von !== null)
            balken(ctx, von, von + (bis - von) * zug, grundlinie, p, l.marker);
          // … dann die Schrift.
          x = RAND;
          for (const w of z.woerter) {
            ctx.font = w.betont ? kursiv(p) : grotesk(g);
            sperren(ctx, w.betont ? p * KURSIV_SPERRUNG : -g * 0.032);
            // Auf dem Balken steht die Schrift in der Balken-Schriftfarbe;
            // solange er noch zieht, in der Satzfarbe.
            ctx.fillStyle = w.betont && zug > 0.6 ? l.betont : l.text;
            ctx.fillText(w.t, x, grundlinie);
            x += w.breite + abstand;
          }
          ctx.restore();
        }
        return y + zeilenHoehe;
      };

    if (plan.art === "fluss") {
      const p = Math.round(g * 1.25);
      for (const gruppe of plan.gruppen) {
        const woerter = messen(gruppe, g, p);
        if (Math.max(...woerter.map((w) => w.breite)) > BREITE - p * 0.2)
          return null;
        const zeilen = ausgewogen(woerter, BREITE - p * 0.15, abstand);
        for (const z of zeilen) {
          schritte.push(zeile(z, p, start));
          start += 0.13;
          hoehe += zeilenHoehe;
        }
        // Steht am Ende ein kurzes Wort allein in der Zeile?
        const letzte = zeilen[zeilen.length - 1];
        einsam =
          zeilen.length > 1 &&
          letzte.woerter.length === 1 &&
          !letzte.woerter[0].betont &&
          letzte.breite < BREITE * 0.4;
      }
    } else {
      for (const gruppe of plan.vor) {
        const woerter = messen(
          gruppe.map((w) => ({ t: w, betont: false })),
          g,
          g,
        );
        if (Math.max(...woerter.map((w) => w.breite)) > BREITE) return null;
        for (const z of ausgewogen(woerter, BREITE, abstand)) {
          schritte.push(zeile(z, g, start));
          start += 0.13;
          hoehe += zeilenHoehe;
        }
      }
      // Pointe: so groß, dass ihre längste Zeile die Breite füllt.
      ctx.font = kursiv(100);
      sperren(ctx, 100 * KURSIV_SPERRUNG);
      const weiteste = Math.max(
        ...plan.pointe.map((z) => ctx.measureText(z).width / 100),
      );
      // … und so, dass der Block noch in die Höhe passt.
      const p = Math.floor(
        Math.min(
          g * 2.1,
          280,
          (BREITE - 10) / (weiteste + 0.24),
          (platz - hoehe) / (plan.pointe.length * 1.1 + 0.2),
        ),
      );
      // Deutlich größer als der Satz davor muss die Pointe bleiben.
      if (p < g * 1.2) return null;
      pGross = p;
      const pZeile = p * 1.1;
      const luft = plan.vor.length ? p * 0.1 : 0;
      const blockHoehe = luft + plan.pointe.length * pZeile + p * 0.1;
      hoehe += blockHoehe;
      const ab = start + 0.15;
      start = ab + 0.35 + plan.pointe.length * 0.18;
      schritte.push((y, t) => {
        // Der Block steht leicht schräg, wie von Hand aufgeklebt.
        const oben = y + luft;
        const mitte = oben + (plan.pointe.length * pZeile) / 2;
        ctx.save();
        ctx.translate(RAND, mitte);
        ctx.rotate((-2 * Math.PI) / 180);
        ctx.translate(-RAND, -mitte);
        ctx.font = kursiv(p);
        sperren(ctx, p * KURSIV_SPERRUNG);
        plan.pointe.forEach((z, i) => {
          // Erst zieht der Balken durch, dann erscheint die Schrift darauf.
          const zug = ein(t, ab + i * 0.18, 0.5);
          const schrift = ein(t, ab + i * 0.18 + 0.22, 0.45);
          if (zug <= 0) return;
          const grundlinie = oben + i * pZeile + p * 0.8;
          const x = RAND + p * 0.12;
          const b = ctx.measureText(z).width;
          balken(ctx, x, x + b * zug, grundlinie, p, l.marker);
          ctx.globalAlpha = schrift;
          ctx.fillStyle = l.betont;
          ctx.fillText(z, x, grundlinie + (1 - schrift) * p * 0.18);
          ctx.globalAlpha = 1;
        });
        ctx.restore();
        return y + blockHoehe;
      });
    }
    return {
      hoehe,
      schritte,
      ende: start,
      p: plan.art === "block" ? pGross : g * 1.25,
      einsam,
    };
  };

  // Größe wählen: Aufkleber, Satz und Zusatz müssen ins Feld passen.
  // Groß ist gut, eine deutlich größere Pointe ist besser.
  const aufkleberBlock = AUFKLEBER_H + 44;
  let g = 60;
  let satz: Gesetzt | null = null;
  let guete = -1;
  for (let versuch = 136; versuch >= 56; versuch -= 4) {
    const platz =
      feldUnten - feldOben - aufkleberBlock - versuch * 0.42 - zusatzHoehe;
    const s = setzen(versuch, platz);
    if (!s || s.hoehe > platz) continue;
    const wert = versuch + Math.min(s.p, versuch * 2) - (s.einsam ? 40 : 0);
    if (wert > guete) {
      guete = wert;
      g = versuch;
      satz = s;
    }
    // Im Fluss zählt vor allem die Größe; etwas kleiner ist besser, wenn
    // dafür kein kurzes Wort allein in der letzten Zeile steht.
    if (plan.art === "fluss" && (!s.einsam || versuch < g * 0.86)) break;
  }
  const gesetzt: Gesetzt = satz ??
    setzen(g, 4000) ?? { hoehe: 0, schritte: [], ende: 1 };
  const luecke = g * 0.42;
  const gesamt = aufkleberBlock + gesetzt.hoehe + luecke + zusatzHoehe;
  // Etwas über der Mitte: wirkt ruhiger als genau mittig.
  const oben = feldOben + (feldUnten - feldOben - gesamt) * 0.45;
  const grad = drehungFuer(karte.nummer);
  const zusatzAb = gesetzt.ende + 0.25;

  return (t: number) => {
    ctx.globalAlpha = 1;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    grund(ctx, l, f, karte, serif, t);
    kennzeile(ctx, l, f, karte.datumKurz, mono, t);
    absender(ctx, l, f, t);

    let y = oben;
    aufkleber(ctx, l, karte.kicker, y, grad, t);
    y += aufkleberBlock;
    ctx.textBaseline = "alphabetic";
    for (const s of gesetzt.schritte) y = s(y, t);
    sperren(ctx, 0);
    y += luecke;

    const z = ein(t, zusatzAb, 0.6);
    if (z > 0) {
      ctx.save();
      ctx.globalAlpha = z;
      ctx.translate(0, (1 - z) * 26);
      pfeil(ctx, RAND, y + 30, l.akzent);
      ctx.font = `500 ${zusatzPx}px ${GROTESK}`;
      ctx.fillStyle = l.weich;
      for (const zl of zusatzZeilen) {
        let x = RAND + zusatzEinzug;
        for (const w of zl.woerter) {
          ctx.fillText(w.t, x, y + zusatzPx);
          x += w.breite + zusatzAbstand;
        }
        y += zusatzZeile;
      }
      ctx.restore();
    }
  };
}

/** Zeichnet das fertige Standbild. */
export async function zeichneStory(
  canvas: HTMLCanvasElement,
  karte: SpruchTag,
  format: StoryFormat = FORMATE.story,
): Promise<void> {
  (await storyVorbereiten(canvas, karte, format))(Infinity);
}
