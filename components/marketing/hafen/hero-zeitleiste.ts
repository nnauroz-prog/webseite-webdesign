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
 *      zieht es vom Kai) und fährt quer über das Bild elbabwärts. Erst
 *      auf dem letzten Drittel der Strecke wird es kleiner und geht im
 *      Dunst auf. Die Katze holt derweil schon Ladung 0.
 *   4. Hat das auslaufende Schiff 60 % seines Weges hinter sich, kommt
 *      dahinter schon das nächste aus dem Dunst, bremst lange aus, wird
 *      an den Kai gedrückt und festgemacht. Danach steht alles wie bei 1.
 *
 * Für die Überlappung gibt es zwei Schiffe im Bild: das am Kai (wird
 * beladen, läuft ein) und eine voll beladene Kopie, die beim Ablegen an
 * seine Stelle tritt und ausläuft.
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
/** Strecke, die das auslaufende Schiff quer über das Bild fährt. */
export const AUSFAHRT = -900;
/** Wo das einlaufende Schiff aus dem Dunst kommt (Querversatz). */
export const EINFAHRT = -250;
/** Mitte des Schiffs (x), um die es in der Ferne kleiner wird. */
const SCHIFF_MITTE = 340;

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
/** Einlaufen: kommt mit Fahrt aus dem Dunst und bremst lange aus. */
const EINLAUFEN = bezier(0.25, 0.6, 0.36, 1);
const SPRUNG: Kurve = (u) => (u <= 0 ? 0 : 1);

/** Zeitanteil, zu dem eine Kurve den Wert w erreicht (Bisektion). */
function zeitBei(k: Kurve, w: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (k(m) < w) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const smooth = (u: number) => {
  const x = Math.max(0, Math.min(1, u));
  return x * x * (3 - 2 * x);
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
  /** Querversatz des Schiffs am Kai (beim Einlaufen negativ). */
  quer: number;
  /** Einlaufen: 1 noch im Dunst (unsichtbar), 0 am Kai. */
  ferne: number;
  /** Querversatz der auslaufenden Kopie (0 bis AUSFAHRT). */
  ab: number;
  /** Ob die auslaufende Kopie im Bild ist. */
  abSicht: boolean;
  /** Festmacherleine: 1 belegt, 0 eingeholt. */
  leine: number;
  /** Schlepper: 0 nicht da, 1 längsseits. */
  schlepper: number;
  /** Querversatz des Schiffs, an dem der Schlepper liegt. */
  schlepperX: number;
};

export type Zyklus = {
  dauer: number;
  /** Startzeitpunkt: die zweite Ladung hängt über ihrem Platz und wird gleich abgesenkt. */
  T0: number;
  zustand: (t: number) => Zustand;
  /** Katzposition zu einem beliebigen Zeitpunkt (für die Pendel-Rechnung). */
  katzeBei: (t: number) => number;
};

function bauen(hub: number, einAb: number): Zyklus {
  const platzOben = PLATZ_OBEN - hub;
  const kaiMitte = [mitte(KAI_SPALTEN[0]), mitte(KAI_SPALTEN[1])];

  const katze = new Spur(kaiMitte[0]);
  const haken = new Spur(FAHRHOEHE);
  const quer = new Spur(0);
  const ferne = new Spur(0);
  const aus = new Spur(0);
  const abSicht = new Schalter(0);
  const leine = new Spur(1);
  const schlepper = new Spur(0);
  const last = new Schalter(0);
  const geladen = new Schalter(0);
  const schild = new Schalter(-1);
  // Vorn auf dem Kaistapel: rechts Ladung 2, links Ladung 1 (Ladung 0 hängt schon).
  const kaiR = new Schalter(2);
  const kaiL = new Schalter(1);

  let t = 0.4;
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
    // Die letzte Beschriftung bleibt kurz stehen, die Katze holt schon
    // Ladung 0 für das nächste Schiff. Dann geht die Beschriftung, und
    // erst danach die Leine: während der Fahrt steht keine Beschriftung.
    const ablegen = oben + 1.4;
    schild.setze(ablegen - 0.4, -1);
    schlepper.fahre(ablegen - 1.2, 1.4, 1, SANFT);
    leine.fahre(ablegen, 0.7, 0, SANFT);
    // Die voll beladene Kopie übernimmt an derselben Stelle; das Schiff
    // am Kai verschwindet unsichtbar in den Dunst und wird geleert.
    const tausch = ablegen + 0.7;
    abSicht.setze(tausch, 1);
    geladen.setze(tausch, 0);
    ferne.fahre(tausch, 0.01, 1, SPRUNG);
    quer.fahre(tausch, 0.01, EINFAHRT, SPRUNG);
    // Querfahrt elbabwärts, der Schlepper bleibt die ersten Meter dran.
    const los = tausch + 0.05;
    const AUS_DAUER = 9.5;
    const weg = aus.fahre(los, AUS_DAUER, AUSFAHRT, AUSLAUFEN);
    schlepper.fahre(los + 2.4, 1.2, 0, SANFT);
    abSicht.setze(weg, 0);
    // Das nächste Schiff läuft ein, wenn das alte 60 % geschafft hat
    // (einAb; am Handy früher, siehe zyklus()).
    const EIN_DAUER = 7;
    const ein = los + AUS_DAUER * zeitBei(AUSLAUFEN, einAb);
    // Auf den letzten Metern drückt der Schlepper es an den Kai; die
    // lange Endbremsung der Kurve ist das Anlegen.
    ferne.fahre(ein, EIN_DAUER, 0, EINLAUFEN);
    const anliegen = quer.fahre(ein, EIN_DAUER, 0, EINLAUFEN);
    schlepper.fahre(anliegen - 3.4, 1.4, 1, SANFT);
    schlepper.fahre(anliegen + 0.1, 1.2, 0, SANFT);
    const fest = leine.fahre(anliegen - 0.3, 0.8, 1, SANFT);
    // Der Schlepper hat abgedreht, die Katze wartet mit Ladung 0.
    ende = Math.max(fest + 0.3, anliegen + 1.3, hoch + 0.5, weg + 0.1);
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
      ab: aus.bei(tt),
      abSicht: abSicht.bei(tt) > 0,
      leine: leine.bei(tt),
      schlepper: schlepper.bei(tt),
      schlepperX: abSicht.bei(tt) > 0 ? aus.bei(tt) : quer.bei(tt),
    };
  };
  const katzeBei = (zeit: number) => katze.bei(((zeit % dauer) + dauer) % dauer);

  return { dauer, T0, zustand, katzeBei };
}

const cache = new Map<string, Zyklus>();

/**
 * Zyklus für einen Pegel-Hub (in Einheiten, auf 0,5 gerundet).
 * einAb: Anteil der Ausfahrt, nach dem das nächste Schiff einläuft. Am
 * Rechner 0,6. Am Handy zeigt das Bild nur den Liegeplatz, das alte
 * Schiff ist dort schon nach gut einem Drittel seines Weges aus dem
 * Bild; mit 0,4 bleibt der Liegeplatz auch dort höchstens etwa eine
 * Sekunde leer. Das Startbild (T0) ist in beiden Fällen dasselbe.
 */
export function zyklus(hub = 0, einAb = 0.6): Zyklus {
  const h = Math.round(hub * 2) / 2;
  const key = `${h}:${einAb}`;
  let z = cache.get(key);
  if (!z) {
    z = bauen(h, einAb);
    cache.set(key, z);
  }
  return z;
}

/* ---------- Schiff: Umriss für den Dunstschleier ---------- */

/** Rumpf in Heckansicht (Pfad). */
export const RUMPF = "M110 590H570L563 630Q556 652 520 660H160Q124 652 117 630Z";

/**
 * Dunstschleier über einem Schiff, das in die Ferne läuft oder aus ihr
 * kommt: Umriss von Rumpf und Ladung (gefüllt in der Farbe der fernen
 * Stadt). voll = alle Ladeplätze belegt (auslaufendes Schiff).
 */
export function dunstUmriss(voll: boolean) {
  const oben = lageY(2);
  const halb = lageY(1);
  const rechts = stapelX(8) + BOX_B;
  const ladung = voll
    ? `M${stapelX(0)} 590V${oben}H${rechts}V590Z`
    : `M${stapelX(0)} 590V${oben}H${stapelX(5) - 2}V${halb}H${rechts}V590Z`;
  return `${RUMPF} ${ladung}`;
}

/* ---------- Schiff: Lage aus Querversatz und Entfernung ---------- */

type Lage = { transform: string; deckkraft: number; dunst: number };

/** Querversatz x und Maßstab m, Wasserlinie bleibt auf dem Horizont. */
function lage(x: number, m: number) {
  const tx = x + SCHIFF_MITTE * (1 - m);
  const ty = WASSERLINIE * (1 - m);
  return m > 0.9999 && Math.abs(tx) < 0.005
    ? ""
    : `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${m.toFixed(4)})`;
}

/**
 * Schiff am Kai bzw. beim Einlaufen: kommt aus Maßstab 0,85 und Dunst.
 * Sichtbar wird es auf den ersten 35 % der Strecke, der Dunstschleier
 * hält sich etwas länger.
 */
export function schiffLage(quer: number, ferne: number): Lage {
  const k = 1 - ferne;
  return {
    transform: lage(quer, 1 - 0.15 * ferne),
    deckkraft: smooth(k / 0.35),
    dunst: 0.8 * (1 - smooth(k / 0.6)),
  };
}

/**
 * Auslaufendes Schiff: fährt quer über das Bild. Kleiner wird es kaum
 * (1 → 0,88); der Dunst zieht ab einem Viertel der Strecke langsam auf,
 * ausgeblendet wird es erst auf den letzten 30 %.
 */
export function abfahrtLage(ab: number): Lage {
  const p = Math.max(0, Math.min(1, ab / AUSFAHRT));
  return {
    transform: lage(ab, 1 - 0.12 * p),
    deckkraft: 1 - smooth((p - 0.7) / 0.3),
    dunst: 0.75 * smooth((p - 0.25) / 0.6),
  };
}
