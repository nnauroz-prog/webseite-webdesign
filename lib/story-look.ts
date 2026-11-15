/**
 * Farbwelten der Spruch-Karten. Eine Quelle für beide Fassungen: die
 * Karte auf /journal (CSS, spruch-reel.tsx) und das Story-Bild im Admin
 * (Zeichenfläche, lib/story-bild.ts).
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
    name: "minze",
    dunkel: false,
    bg: "#c9f0de",
    bg2: "#b2e7cf",
    licht: "236 255 246",
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
    name: "rosa",
    dunkel: false,
    bg: "#ffd9cf",
    bg2: "#ffc7ba",
    licht: "255 242 238",
    lichtKraft: 0.75,
    text: "#1d1d1f",
    weich: "#4a3530",
    betont: "#fff8ee",
    marker: "#0f2a3a",
    stickerBg: "#f45b1e",
    stickerText: "#1d1d1f",
    ziffer: "255 255 255 / 0.45",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#f45b1e",
    akzent: "#0f2a3a",
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
    name: "flieder",
    dunkel: false,
    bg: "#ddd2ff",
    bg2: "#cdbfff",
    licht: "246 242 255",
    lichtKraft: 0.75,
    text: "#1d1d1f",
    weich: "#3a3357",
    betont: "#ffd84d",
    marker: "#0f2a3a",
    stickerBg: "#1d1d1f",
    stickerText: "#ffffff",
    ziffer: "255 255 255 / 0.42",
    hafen: "#0f2a3a",
    faehre: "#0f2a3a",
    streif: "#ffd84d",
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

const HELL = ["#fff8ee", "#ffd54a"];

/** Stern im Aufkleber: Orange; auf orangem oder gelbem Aufkleber die Schriftfarbe. */
export function stickerStern(l: StoryLook): string {
  return l.stickerBg === "#f45b1e" || l.stickerBg === "#ffd54a"
    ? l.stickerText
    : "#f45b1e";
}

/** Stanzrand um den Aufkleber: cremeweiß; ein heller Aufkleber braucht keinen. */
export function stickerRand(l: StoryLook): string {
  return HELL.includes(l.stickerBg) ? l.stickerBg : "#fff8ee";
}

/** Wellenlinie in der Hafenfläche: dunkel auf heller Fläche, sonst hell. */
export function hafenLinie(l: StoryLook): string {
  return HELL.includes(l.hafen)
    ? "rgb(15 42 58 / 0.24)"
    : "rgb(255 255 255 / 0.26)";
}

/** Zarte Muster im Grund (Raster, Streifen): „r g b“ in der Schriftrichtung. */
export function musterFarbe(l: StoryLook): string {
  return l.dunkel ? "255 255 255" : "15 42 58";
}

/** Die Farbwelt als CSS-Variablen für die Karte auf der Website. */
export function lookVariablen(l: StoryLook): Record<string, string> {
  return {
    "--k-bg": l.bg,
    "--k-bg2": l.bg2,
    "--k-licht": `rgb(${l.licht} / ${l.lichtKraft})`,
    "--k-licht-aus": `rgb(${l.licht} / 0)`,
    "--k-text": l.text,
    "--k-weich": l.weich,
    "--k-betont": l.betont,
    "--k-marker": l.marker,
    "--k-sticker-bg": l.stickerBg,
    "--k-sticker-text": l.stickerText,
    "--k-sticker-stern": stickerStern(l),
    "--k-ziffer": `rgb(${l.ziffer})`,
    "--k-hafen": l.hafen,
    "--k-hafen-linie": hafenLinie(l),
    "--k-sticker-rand": stickerRand(l),
    "--k-muster": `rgb(${musterFarbe(l)} / 0.07)`,
    "--k-faehre": l.faehre,
    "--k-streif": l.streif,
    "--k-akzent": l.akzent,
  };
}
