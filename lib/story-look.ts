/**
 * Farbwelten der Spruch-Karten: für das gemalte Bild (lib/story-bild.ts),
 * das auf /journal und im Story-Studio (/admin/story) erscheint.
 *
 * Kräftige Flächen statt blasser Verläufe: Jede Welt hat einen Grund
 * (mit einem Licht aus derselben Farbfamilie), eine Markerfarbe für die
 * Pointe und unten eine deckende Hafenfläche mit einem Hafen-Motiv.
 *
 * Welche Farbwelt an welchem Tag dran ist, bestimmt zusammen mit Motiv,
 * Schmuck und Anordnung lib/story-variante.ts. Kontraste prüft
 * tests/story-look.test.ts.
 */
export type StoryLook = {
  name: string;
  /** helle Schrift auf dunklem Grund */
  dunkel: boolean;
  /** Grund: Verlauf innerhalb einer Farbfamilie, links oben nach rechts unten */
  bg: string;
  bg2: string;
  /** ein weiches Licht oben rechts: Farbe als „r g b“ und Deckkraft */
  licht: string;
  lichtKraft: number;
  /** Satz, Absender */
  text: string;
  /** Zusatz, Kennzeile */
  weich: string;
  /** Pointe: Schrift auf dem Marker, und der Marker selbst */
  betont: string;
  marker: string;
  /** Aufkleber mit dem Kicker */
  stickerBg: string;
  stickerText: string;
  /** große Tageszahl oben rechts, Ton in Ton: „r g b / a“ */
  ziffer: string;
  /** Hafenfläche am unteren Rand, Fähre darauf, Streifen und Schornstein */
  hafen: string;
  faehre: string;
  streif: string;
  /** Pfeil vor dem Zusatz und Strahlen am Aufkleber */
  akzent: string;
};

export const STORY_LOOKS: StoryLook[] = [
  {
    name: "koralle",
    dunkel: false,
    bg: "#f45b1e",
    bg2: "#ff7438",
    licht: "255 168 110",
    lichtKraft: 0.55,
    text: "#1d1d1f",
    weich: "#2a1206",
    betont: "#1d1d1f",
    marker: "#ffffff",
    stickerBg: "#1d1d1f",
    stickerText: "#ffffff",
    ziffer: "255 255 255 / 0.2",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#ffffff",
    akzent: "#ffffff",
  },
  {
    name: "hafen",
    dunkel: true,
    bg: "#0f2a3a",
    bg2: "#134a57",
    licht: "38 140 140",
    lichtKraft: 0.5,
    text: "#ffffff",
    weich: "#d5e3ea",
    betont: "#ffffff",
    marker: "#f45b1e",
    stickerBg: "#fff8ee",
    stickerText: "#0f2a3a",
    ziffer: "255 255 255 / 0.08",
    hafen: "#fff8ee",
    faehre: "#fff8ee",
    streif: "#f45b1e",
    akzent: "#ff9a66",
  },
  {
    name: "creme",
    dunkel: false,
    bg: "#fff3e0",
    bg2: "#ffe6c8",
    licht: "255 255 255",
    lichtKraft: 0.75,
    text: "#1d1d1f",
    weich: "#4a433d",
    betont: "#ffffff",
    marker: "#f45b1e",
    stickerBg: "#1d1d1f",
    stickerText: "#ffffff",
    ziffer: "244 91 30 / 0.16",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#f45b1e",
    akzent: "#f45b1e",
  },
  {
    name: "nacht",
    dunkel: true,
    bg: "#141416",
    bg2: "#232329",
    licht: "78 78 92",
    lichtKraft: 0.55,
    text: "#ffffff",
    weich: "#d9d9de",
    betont: "#ffffff",
    marker: "#f45b1e",
    stickerBg: "#f45b1e",
    stickerText: "#1d1d1f",
    ziffer: "255 255 255 / 0.07",
    hafen: "#f45b1e",
    faehre: "#ffffff",
    streif: "#141416",
    akzent: "#ff9a66",
  },
  {
    name: "gelb",
    dunkel: false,
    bg: "#ffd54a",
    bg2: "#ffc72e",
    licht: "255 238 160",
    lichtKraft: 0.75,
    text: "#1d1d1f",
    weich: "#3a2e05",
    betont: "#fff8ee",
    marker: "#0f2a3a",
    stickerBg: "#f45b1e",
    stickerText: "#1d1d1f",
    ziffer: "255 255 255 / 0.42",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#f45b1e",
    akzent: "#0f2a3a",
  },
  {
    // Entsättigtes Seegrün statt Mint: hanseatisch, nicht bonbonfarben.
    name: "seegruen",
    dunkel: false,
    bg: "#d5e4e0",
    bg2: "#c2d7d2",
    licht: "240 248 246",
    lichtKraft: 0.75,
    text: "#0f2a3a",
    weich: "#2f4b58",
    betont: "#ffffff",
    marker: "#f45b1e",
    stickerBg: "#0f2a3a",
    stickerText: "#ffffff",
    ziffer: "15 42 58 / 0.09",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#f45b1e",
    akzent: "#f45b1e",
  },
  {
    name: "tinte",
    dunkel: true,
    bg: "#1b2a4a",
    bg2: "#24386a",
    licht: "70 100 180",
    lichtKraft: 0.5,
    text: "#ffffff",
    weich: "#dbe4f5",
    betont: "#1d1d1f",
    marker: "#ffd54a",
    stickerBg: "#ffd54a",
    stickerText: "#1d1d1f",
    ziffer: "255 255 255 / 0.08",
    hafen: "#ffd54a",
    faehre: "#ffffff",
    streif: "#f45b1e",
    akzent: "#ffd54a",
  },
  {
    // Backstein wie die Speicherstadt.
    name: "backstein",
    dunkel: true,
    bg: "#8a3a28",
    bg2: "#74301f",
    licht: "190 96 70",
    lichtKraft: 0.45,
    text: "#ffffff",
    weich: "#f7e3da",
    betont: "#6a2a1b",
    marker: "#fff8ee",
    stickerBg: "#fff8ee",
    stickerText: "#1d1d1f",
    ziffer: "255 255 255 / 0.08",
    hafen: "#fff8ee",
    faehre: "#fff8ee",
    streif: "#f45b1e",
    akzent: "#ffd9a8",
  },
  {
    name: "petrol",
    dunkel: true,
    bg: "#1f7a78",
    bg2: "#176a6c",
    licht: "80 180 170",
    lichtKraft: 0.5,
    text: "#ffffff",
    weich: "#eaf6f4",
    betont: "#0f2a3a",
    marker: "#fff8ee",
    stickerBg: "#0f2a3a",
    stickerText: "#ffffff",
    ziffer: "255 255 255 / 0.1",
    hafen: "#0f2a3a",
    faehre: "#fff8ee",
    streif: "#f45b1e",
    akzent: "#ffd9a8",
  },
  {
    name: "nebel",
    dunkel: false,
    bg: "#e3eaf0",
    bg2: "#d3dee8",
    licht: "255 255 255",
    lichtKraft: 0.75,
    text: "#0f2a3a",
    weich: "#33505f",
    betont: "#ffffff",
    marker: "#f45b1e",
    stickerBg: "#0f2a3a",
    stickerText: "#ffffff",
    ziffer: "15 42 58 / 0.08",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#f45b1e",
    akzent: "#f45b1e",
  },
  {
    // Stahlblau wie der Himmel über dem Hafen.
    name: "stahl",
    dunkel: false,
    bg: "#cdd9e4",
    bg2: "#bccbd9",
    licht: "242 247 251",
    lichtKraft: 0.75,
    text: "#0f2a3a",
    weich: "#2c4656",
    betont: "#ffffff",
    marker: "#0f2a3a",
    stickerBg: "#f45b1e",
    stickerText: "#1d1d1f",
    ziffer: "255 255 255 / 0.4",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#f45b1e",
    akzent: "#f45b1e",
  },
  {
    name: "sand",
    dunkel: false,
    bg: "#ead9c2",
    bg2: "#dfc9ab",
    licht: "252 244 230",
    lichtKraft: 0.75,
    text: "#1d1d1f",
    weich: "#4b3f31",
    betont: "#fff8ee",
    marker: "#0f2a3a",
    stickerBg: "#f45b1e",
    stickerText: "#1d1d1f",
    ziffer: "255 255 255 / 0.38",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#f45b1e",
    akzent: "#f45b1e",
  },
];
