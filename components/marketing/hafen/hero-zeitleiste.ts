/**
 * Zeitleiste des Ladebetriebs im Kopfbild.
 *
 * Reine Rechnung ohne DOM. Der Server zeichnet mit `zustandBei(T0)` das
 * Startbild, der Browser spielt ab demselben Zeitpunkt weiter. Deshalb
 * gibt es beim Hydrieren keinen Sprung.
 *
 * Ablauf eines Zyklus (knapp 45 s, dann nahtlos von vorn):
 *   1. Die Laufkatze wartet mit Ladung 0 über dem Kaistapel.
 *   2. Viermal: zum freien Platz auf dem Schiff fahren, weich absetzen,
 *      Beschriftung erscheint, Spreader hoch, zurück zum Kai, den
 *      nächsten Container aufnehmen.
 *   3. Nach der vierten Ladung legt das Schiff ab (Leine los, Schlepper
 *      zieht es quer vom Kai, dann läuft es aus und verschwindet im Dunst).
 *      Die Katze holt derweil schon Ladung 0 für das nächste Schiff.
 *   4. Das nächste Schiff kommt aus dem Dunst, wird an den Kai gedrückt
 *      und festgemacht. Danach steht alles wie bei 1.
 *
 * Koordinaten in Einheiten der viewBox "-160 0 960 760".
 */

/* ---------- Farben der Ladung ---------- */

export type Farbe = "o" | "r" | "g" | "z" | "w" | "t" | "d";

export const FARBEN: Record<Farbe, string> = {
  o: "#F45B1E", // Signal-Orange
  r: "#A8382A", // Container-Rot
  g: "#2E5C4D", // Hafengrün
  z: "#B3B6B2", // Zink
  w: "#D9D9D4", // Weiß im Dunst
  t: "#3A3E40", // Teer
  d: "#24493D", // Dunkelgrün
};

export const dunkel = (c: Farbe) => c === "r" || c === "g" || c === "t" || c === "d";

/** Farben der vier Container, die in jedem Zyklus verladen werden. */
export const LADUNG: readonly Farbe[] = ["t", "w", "g", "o"];

/* ---------- Geometrie ---------- */

export const BOX_B = 46;
export const BOX_H = 49;

/** Linke Kante von Stapel i auf dem Schiff. */
export const stapelX = (i: number) => 124 + i * 48;
/** Oberkante eines Containers in Lage l (0 = unten) auf dem Schiff. */
export const lageY = (l: number) => 541 - l * BOX_H;

/** Freie Plätze, die in jedem Zyklus beladen werden (oberste Lage, Stapel 5 bis 8). */
export const LADEPLAETZE = [5, 6, 7, 8].map(stapelX);
export const PLATZ_OBEN = lageY(2);

/** Kaistapel unter dem Portal: rechte und linke Spalte (linke Kanten). */
export const KAI_SPALTEN = [692, 638] as const;
/** Oberkante des Containers, den die Katze vom Kai nimmt (zweite Lage). */
export const KAI_OBEN = 507;
/** Container-Oberkante bei der Fahrt, eine Containerhöhe über der Ladung. */
export const FAHRHOEHE = 345;
/** Unterkante der Katze, dort hängen die Seile. */
export const SEIL_OBEN = 292;
/** Wasserlinie und Horizont. */
export const WASSERLINIE = 640;
/** Fluchtpunkt auf dem Horizont, auf den ein auslaufendes Schiff zuläuft. */
export const FLUCHT_X = 210;
/** Querversatz, um den der Schlepper das Schiff vom Kai zieht. */
export const QUER = -46;

const mitte = (links: number) => links + BOX_B / 2;

/* ---------- Kurven ---------- */

type Kurve = (u: number) => number;

/** CSS-artige cubic-bezier-Kurve (x1, y1, x2, y2), gelöst nach Newton. */
function bezier(x1: number, y1: number, x2: number, y2: number): Kurve {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const x = (s: number) => ((ax * s + bx) * s + cx) * s;
  const dx = (s: number) => (3 * ax * s + 2 * bx) * s + cx;
  const y = (s: number) => ((ay * s + by) * s + cy) * s;
  return (u) => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    let s = u;
    for (let i = 0; i < 8; i++) {
      const d = dx(s);
      if (Math.abs(d) < 1e-6) break;
      const n = s - (x(s) - u) / d;
      if (n < 0 || n > 1) break;
      s = n;
    }
    // Absichern mit Bisektion, falls Newton nicht sauber konvergiert.
    if (Math.abs(x(s) - u) > 1e-4) {
      let lo = 0;
      let hi = 1;
      s = u;
      for (let i = 0; i < 24; i++) {
        if (x(s) < u) lo = s;
        else hi = s;
        s = (lo + hi) / 2;
      }
    }
    return y(s);
  };
}

/** Katzfahrt: zieht ruhig an, fährt, bremst etwas länger aus. */
const FAHREN = bezier(0.55, 0, 0.3, 1);
/** Absenken mit langem, weichem Auslauf: der Container setzt sanft auf. */
const AUFSETZEN = bezier(0.4, 0, 0.12, 1);
/** Heben: zügig, aber ohne Ruck. */
const HEBEN = bezier(0.45, 0, 0.35, 1);
const SANFT = bezier(0.42, 0, 0.58, 1);
/** Auslaufen: das Schiff nimmt langsam Fahrt auf. */
const AUSLAUFEN = bezier(0.5, 0, 0.85, 0.6);
/** Einlaufen: aus der Fahrt heraus lange ausgleiten. */
const EINLAUFEN = bezier(0.1, 0.45, 0.35, 1);
/** Anlegen: der Schlepper drückt, die Fender federn ein klein wenig nach. */
const ANLEGEN: Kurve = (u) => {
  const b = SANFT(Math.min(1, u * 1.08));
  const nach = u > 0.9 ? Math.sin(((u - 0.9) / 0.1) * Math.PI) * 0.012 : 0;
  return b + nach;
};

const fahrzeit = (weg: number) => 0.8 + Math.abs(weg) / 240;

/* ---------- Spuren ---------- */

type Abschnitt = { t0: number; t1: number; von: number; nach: number; k: Kurve };

class Spur {
  wert: number;
  readonly start: number;
  readonly teile: Abschnitt[] = [];
  constructor(start: number) {
    this.wert = start;
    this.start = start;
  }
  fahre(t: number, dauer: number, nach: number, k: Kurve) {
    this.teile.push({ t0: t, t1: t + dauer, von: this.wert, nach, k });
    this.wert = nach;
    return t + dauer;
  }
  bei(t: number) {
    let v = this.start;
    for (const a of this.teile) {
      if (t < a.t0) break;
      if (t >= a.t1) {
        v = a.nach;
        continue;
      }
      return a.von + (a.nach - a.von) * a.k((t - a.t0) / (a.t1 - a.t0));
    }
    return v;
  }
}

class Schalter {
  readonly punkte: { t: number; v: number }[] = [];
  constructor(start: number) {
    this.punkte.push({ t: -Infinity, v: start });
  }
  setze(t: number, v: number) {
    this.punkte.push({ t, v });
  }
  bei(t: number) {
    let v = this.punkte[0].v;
    for (const p of this.punkte) {
      if (p.t > t) break;
      v = p.v;
    }
    return v;
  }
}

/* ---------- Zyklus ---------- */

export type Zustand = {
  /** Mitte der Laufkatze (x). */
  katze: number;
  /** Oberkante des Containers am Spreader (y). */
  haken: number;
  /** Ladung am Haken (0 bis 3) oder -1 für einen leeren Spreader. */
  last: number;
  /** Wie viele Plätze auf dem Schiff schon belegt sind. */
  geladen: number;
  /** Sichtbare Beschriftung (0 bis 3) oder -1. */
  schild: number;
  /** Welche Ladung vorn auf dem Kaistapel steht (rechte, linke Spalte). */
  kai: [number, number];
  /** Querversatz des Schiffs vom Kai. */
  quer: number;
  /** Entfernung des Schiffs: 0 am Kai, 1 im Dunst verschwunden. */
  ferne: number;
  /** Festmacherleine: 1 belegt, 0 eingeholt. */
  leine: number;
  /** Schlepper: 0 nicht da, 1 längsseits. */
  schlepper: number;
};

export type Zyklus = {
  dauer: number;
  /** Startzeitpunkt: die zweite Ladung hängt über ihrem Platz und wird gleich abgesenkt. */
  T0: number;
  zustand: (t: number) => Zustand;
  /** Katzposition zu einem beliebigen Zeitpunkt (für die Pendel-Rechnung). */
  katzeBei: (t: number) => number;
};

function bauen(hub: number): Zyklus {
  const platzOben = PLATZ_OBEN - hub;
  const kaiMitte = [mitte(KAI_SPALTEN[0]), mitte(KAI_SPALTEN[1])];

  const katze = new Spur(kaiMitte[0]);
  const haken = new Spur(FAHRHOEHE);
  const quer = new Spur(0);
  const ferne = new Spur(0);
  const leine = new Spur(1);
  const schlepper = new Spur(0);
  const last = new Schalter(0);
  const geladen = new Schalter(0);
  const schild = new Schalter(-1);
  // Vorn auf dem Kaistapel: rechts Ladung 2, links Ladung 1 (Ladung 0 hängt schon).
  const kaiR = new Schalter(2);
  const kaiL = new Schalter(1);

  let t = 0.6;
  let T0 = 0;
  let ende = 0;

  for (let k = 0; k < 4; k++) {
    const ziel = mitte(LADEPLAETZE[k]);
    const fahrt = fahrzeit(ziel - katze.wert);
    katze.fahre(t, fahrt, ziel, FAHREN);

    // Absenken beginnt, während die Katze die letzten Zentimeter ausrollt.
    const senken = t + fahrt - 0.28;
    if (k === 1) T0 = senken;
    const ab = haken.fahre(senken, 1.25, platzOben, AUFSETZEN);
    last.setze(ab, -1);
    geladen.setze(ab, k + 1);
    schild.setze(ab, k);

    // Twistlocks lösen, Spreader hoch.
    const heben = ab + 0.4;
    const oben = haken.fahre(heben, 1.0, FAHRHOEHE, HEBEN);

    // Zurück zum Kai, abwechselnd linke und rechte Spalte.
    const naechste = (k + 1) % 4;
    const spalte = naechste % 2 === 0 ? 0 : 1;
    const rueck = oben - 0.3;
    const rFahrt = fahrzeit(kaiMitte[spalte] - katze.wert);
    katze.fahre(rueck, rFahrt, kaiMitte[spalte], FAHREN);
    const kSenken = rueck + rFahrt - 0.25;
    const gefasst = haken.fahre(kSenken, 1.2, KAI_OBEN, AUFSETZEN);
    last.setze(gefasst + 0.12, naechste);
    // Dahinter (in der Tiefe der Reihe) steht schon der übernächste Container.
    (spalte === 0 ? kaiR : kaiL).setze(gefasst + 0.12, (naechste + 2) % 4);
    const hoch = haken.fahre(gefasst + 0.4, 1.15, FAHRHOEHE, HEBEN);

    if (k < 3) {
      t = hoch - 0.3;
      continue;
    }

    // ---- Schiffswechsel ----
    // Die letzte Beschriftung bleibt stehen, während die Katze schon
    // Ladung 0 für das nächste Schiff holt (rund 5 s, so lange wie die
    // übrigen ungefähr). Erst dann geht die Leine los.
    const ablegen = oben + 3.6;
    schild.setze(ablegen, -1);
    schlepper.fahre(ablegen - 1.2, 1.4, 1, SANFT);
    leine.fahre(ablegen, 0.7, 0, SANFT);
    quer.fahre(ablegen + 0.55, 2.6, QUER, SANFT);
    schlepper.fahre(ablegen + 3.0, 1.2, 0, SANFT);
    const weg = ferne.fahre(ablegen + 2.7, 3.2, 1, AUSLAUFEN);
    geladen.setze(weg, 0);
    const da = ferne.fahre(weg + 0.5, 3.2, 0, EINLAUFEN);
    schlepper.fahre(da - 1.6, 1.4, 1, SANFT);
    const anliegen = quer.fahre(da - 0.5, 2.5, 0, ANLEGEN);
    schlepper.fahre(anliegen + 0.2, 1.2, 0, SANFT);
    const fest = leine.fahre(anliegen + 0.1, 0.8, 1, SANFT);
    // Der Schlepper hat abgedreht, die Katze wartet mit Ladung 0.
    ende = Math.max(fest + 0.3, anliegen + 1.45, hoch + 0.5);
  }

  // Die letzte Rückfahrt (Ladung 0 für das nächste Schiff) endet über der
  // rechten Spalte, also genau dort, wo der Zyklus beginnt.
  const dauer = ende;

  const zustand = (zeit: number): Zustand => {
    const tt = ((zeit % dauer) + dauer) % dauer;
    return {
      katze: katze.bei(tt),
      haken: haken.bei(tt),
      last: last.bei(tt),
      geladen: geladen.bei(tt),
      schild: schild.bei(tt),
      kai: [kaiR.bei(tt), kaiL.bei(tt)],
      quer: quer.bei(tt),
      ferne: ferne.bei(tt),
      leine: leine.bei(tt),
      schlepper: schlepper.bei(tt),
    };
  };
  const katzeBei = (zeit: number) => katze.bei(((zeit % dauer) + dauer) % dauer);

  return { dauer, T0, zustand, katzeBei };
}

const cache = new Map<number, Zyklus>();

/** Zyklus für einen Pegel-Hub (in Einheiten, auf 0,5 gerundet). */
export function zyklus(hub = 0): Zyklus {
  const key = Math.round(hub * 2) / 2;
  let z = cache.get(key);
  if (!z) {
    z = bauen(key);
    cache.set(key, z);
  }
  return z;
}

/* ---------- Schiff: Lage aus Querversatz und Entfernung ---------- */

/**
 * Ein Schiff, das in die Tiefe läuft, wird kleiner und rückt zum
 * Fluchtpunkt auf dem Horizont. Bei Augenhöhe auf dem Wasser bleibt die
 * Wasserlinie dabei auf dem Horizont. Maßstab ~ 1 / Entfernung.
 */
export function schiffLage(quer: number, ferne: number) {
  const s = 1 / (1 + 5.2 * ferne);
  const x = FLUCHT_X * (1 - s) + s * quer;
  const y = WASSERLINIE * (1 - s);
  // Im Dunst: erst ab etwa der halben Strecke spürbar blasser.
  const f = Math.max(0, Math.min(1, (ferne - 0.3) / 0.62));
  const deckkraft = 1 - f * f * (3 - 2 * f);
  return {
    transform: s > 0.9999 && Math.abs(x) < 0.005 ? "" : `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(4)})`,
    deckkraft,
  };
}

