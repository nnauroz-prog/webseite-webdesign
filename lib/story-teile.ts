/**
 * Bausteine der Spruch-Karten: Hafen-Motive und Schmuckformen als
 * Pfaddaten. Eine Quelle für beide Fassungen: Die Karte auf /journal
 * setzt die Pfade als SVG, das Story-Bild im Admin zeichnet dieselben
 * Pfade auf die Zeichenfläche (Path2D).
 */

/** Welche Farbe der Farbwelt ein Teil bekommt. */
export type TeilFarbe = "faehre" | "streif" | "grund";
export type MotivTeil = { d: string; farbe: TeilFarbe; deck?: number };

/**
 * Ein Hafen-Motiv am unteren Rand. Alle Motive stehen im selben Raster:
 * 40 Einheiten hoch, die Wasserlinie liegt bei y = 30 (darunter taucht
 * der Rumpf in die Hafenfläche ein). Eine Einheit ist 0,56 % der
 * Kartenbreite.
 */
export type Motiv = {
  name: string;
  /** Breite in Einheiten */
  b: number;
  /** Schiffe fahren im Film von links ein und wiegen sich; Bauten stehen. */
  faehrt: boolean;
  teile: MotivTeil[];
};
export const MOTIV_HOEHE = 40;
export const MOTIV_WASSER = 30;
/** Größe einer Motiv-Einheit in Hundertstel der Kartenbreite. */
export const MOTIV_EINHEIT = 0.56;

const fenster = (xs: number[], y: number, b = 3.4, h = 2.6): MotivTeil[] =>
  xs.map((x) => ({ d: `M${x} ${y}h${b}v${h}h${-b}Z`, farbe: "grund" }));

export const MOTIVE: Motiv[] = [
  {
    name: "faehre",
    b: 46,
    faehrt: true,
    teile: [
      { d: "M0 29h46l-5 8H5Z", farbe: "faehre" },
      { d: "M5 28.2v-6.7h31l5 6.7Z", farbe: "faehre" },
      { d: "M9 17h21v4H9Z", farbe: "faehre" },
      { d: "M0 28.2h46v1.9H0Z", farbe: "streif" },
      { d: "M21.5 11.5h3.4V17h-3.4Z", farbe: "streif" },
      ...fenster([9, 14.5, 20, 25.5, 31], 23.2),
    ],
  },
  {
    name: "frachter",
    b: 64,
    faehrt: true,
    teile: [
      { d: "M0 28h64l-5 9H6Z", farbe: "faehre" },
      // Brücke am Heck mit Mast
      { d: "M50 28V14h9v14Z", farbe: "faehre" },
      { d: "M54 14V8.5h1.3V14Z", farbe: "faehre" },
      { d: "M51.5 16.5h6v2.4h-6Z", farbe: "grund" },
      // Container, zwei Lagen
      { d: "M6 27.4v-5h8v5Z", farbe: "streif" },
      { d: "M15 27.4v-5h8v5Z", farbe: "faehre" },
      { d: "M24 27.4v-5h8v5Z", farbe: "streif" },
      { d: "M33 27.4v-5h8v5Z", farbe: "faehre" },
      { d: "M10.5 21.6v-5h8v5Z", farbe: "faehre" },
      { d: "M19.5 21.6v-5h8v5Z", farbe: "streif" },
      { d: "M28.5 21.6v-5h8v5Z", farbe: "faehre" },
      { d: "M0 28h64v1.8H0Z", farbe: "streif" },
    ],
  },
  {
    name: "segler",
    b: 40,
    faehrt: true,
    teile: [
      { d: "M3 30h34l-5 7H9Z", farbe: "faehre" },
      { d: "M19.2 3.5h1.5V30h-1.5Z", farbe: "faehre" },
      { d: "M21.8 6 35.5 27.2H21.8Z", farbe: "streif" },
      { d: "M18 9 5.5 27.2H18Z", farbe: "faehre" },
      { d: "M20.7 3.5h5.2l-5.2 3.2Z", farbe: "streif" },
      { d: "M3 30h34v1.6H3Z", farbe: "streif" },
    ],
  },
  {
    name: "leuchtturm",
    b: 42,
    faehrt: false,
    teile: [
      // Lichtkegel, Mole, Turm mit zwei Bändern, Laterne, Dach
      { d: "M20.5 8.6 42 3.5v10.2Z", farbe: "streif", deck: 0.34 },
      { d: "M2 30h30l4 8H0Z", farbe: "faehre" },
      { d: "M10.6 30 13 12h8l2.4 18Z", farbe: "faehre" },
      { d: "M12.4 16.5h9.2l.5 4H11.9Z", farbe: "streif" },
      { d: "M11.4 24h11.2l.4 3H11Z", farbe: "streif" },
      { d: "M11 10.6h12v1.6H11Z", farbe: "faehre" },
      { d: "M13.5 5.8h7v4.8h-7Z", farbe: "faehre" },
      { d: "M14.8 7h4.4v2.6h-4.4Z", farbe: "streif" },
      { d: "M12.4 5.8 17 1.8l4.6 4Z", farbe: "faehre" },
    ],
  },
  {
    name: "kran",
    b: 52,
    faehrt: false,
    teile: [
      // Kai, Portalbeine mit Strebe, Maschinenhaus, Ausleger, Seil, Container
      { d: "M1 29.6h28V38H1Z", farbe: "faehre" },
      { d: "M4.8 29.6 11 12h2.4L8.6 29.6Z", farbe: "faehre" },
      { d: "M25.2 29.6 19 12h-2.4l4.8 17.6Z", farbe: "faehre" },
      { d: "M8.4 20.6h13.2V22H8.4Z", farbe: "faehre" },
      { d: "M19 8.6 50.5 4.2v2.2L19 11.2Z", farbe: "faehre" },
      { d: "M11 8.6 1.5 11.6V9.4L11 6.4Z", farbe: "faehre" },
      { d: "M14 1.6h2V7h-2Z", farbe: "faehre" },
      { d: "M9.6 6.6h10.8v6H9.6Z", farbe: "streif" },
      { d: "M41.2 5.6h.9V18h-.9Z", farbe: "faehre" },
      { d: "M36.4 18h10.4v5.6H36.4Z", farbe: "streif" },
    ],
  },
  {
    name: "schlepper",
    b: 46,
    faehrt: true,
    teile: [
      // Rauch, Rumpf, Aufbau, Brücke, Schornstein
      {
        d: "M36 9.4a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0Z",
        farbe: "faehre",
        deck: 0.5,
      },
      {
        d: "M40 4a3.1 3.1 0 1 0 6.2 0a3.1 3.1 0 1 0-6.2 0Z",
        farbe: "faehre",
        deck: 0.32,
      },
      { d: "M0 28h46l-4 9H8Z", farbe: "faehre" },
      { d: "M11 28v-8h16v8Z", farbe: "faehre" },
      { d: "M14.5 20v-4.2h9.5V20Z", farbe: "faehre" },
      { d: "M13.5 21.8h11v3h-11Z", farbe: "grund" },
      { d: "M30 28V13.6h5.2V28Z", farbe: "streif" },
      { d: "M30 16.2h5.2v2.1H30Z", farbe: "faehre" },
      { d: "M0 28h46v1.8H0Z", farbe: "streif" },
    ],
  },
];

/**
 * Schmuck oben rechts, Ton in Ton. „ziffer“ ist die Tageszahl, „zitat“
 * ein großes Anführungszeichen (beide als Schrift gesetzt). Die übrigen
 * sind Formen in einem Feld von 100 × 64 Einheiten (eine Einheit ist
 * 1 % der Kartenbreite), Ursprung oben links an der Karte.
 */
export type SchmuckTeil = { d: string; strich?: number };
export type Schmuck =
  | { name: "ziffer" | "zitat"; art: "schrift" }
  | { name: string; art: "form"; teile: SchmuckTeil[] };
export const SCHMUCK_B = 100;
export const SCHMUCK_H = 64;

const kreis = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Strahlen: Fächer aus schmalen Keilen von der Ecke oben rechts. */
function strahlen(): SchmuckTeil[] {
  const teile: SchmuckTeil[] = [];
  const [mx, my] = [97, 9];
  for (let grad = 100; grad <= 178; grad += 13) {
    const keil = (w: number, radius: number) => {
      const a = (w * Math.PI) / 180;
      return `${r2(mx + Math.cos(a) * radius)} ${r2(my + Math.sin(a) * radius)}`;
    };
    teile.push({
      d: `M${keil(grad, 15)}L${keil(grad - 1.9, 58)}L${keil(grad + 1.9, 58)}Z`,
    });
  }
  return teile;
}

/** Punkte: lockeres Raster aus kleinen Kreisen. */
function punkte(): SchmuckTeil[] {
  let d = "";
  for (let zeile = 0; zeile < 5; zeile++)
    for (let spalte = 0; spalte < 6; spalte++)
      d += kreis(56 + spalte * 7.4, 12 + zeile * 7.4, 1.15);
  return [{ d }];
}

export const SCHMUCK: Schmuck[] = [
  { name: "ziffer", art: "schrift" },
  { name: "sonne", art: "form", teile: [{ d: kreis(86, 24, 27) }] },
  { name: "strahlen", art: "form", teile: strahlen() },
  { name: "zitat", art: "schrift" },
  {
    name: "ringe",
    art: "form",
    teile: [
      { d: kreis(96, 10, 20), strich: 2.2 },
      { d: kreis(96, 10, 32), strich: 2.2 },
      { d: kreis(96, 10, 44), strich: 2.2 },
    ],
  },
  { name: "punkte", art: "form", teile: punkte() },
];
