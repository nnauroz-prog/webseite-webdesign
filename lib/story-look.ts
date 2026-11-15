/**
 * Farbwelten der Spruch-Karten. Eine Quelle für beide Fassungen: die
 * Karte auf /journal (CSS, spruch-reel.tsx) und das Story-Bild im Admin
 * (Zeichenfläche, lib/story-bild.ts).
 *
 * Kräftige Flächen statt blasser Verläufe: Jede Welt hat einen Grund
 * (mit einem Licht aus derselben Farbfamilie), eine Markerfarbe für die
 * Pointe und unten eine deckende Hafenfläche mit der Fähre.
 *
 * Jeden Tag ist die nächste Farbwelt dran (lookFuer), damit beim
 * Blättern keine zwei Karten nacheinander gleich aussehen. Kontraste
 * prüft tests/story-look.test.ts.
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
];

/** Der Aufkleber sitzt jeden Tag etwas anders gedreht (Grad). */
const DREHUNG = [-6, 4, -4, 5, -7, 3];

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** Farbwelt für die fortlaufende Tagesnummer (auch negativ). */
export function lookFuer(nummer: number): StoryLook {
  return STORY_LOOKS[mod(nummer, STORY_LOOKS.length)];
}

/** Drehung des Aufklebers für die Tagesnummer. */
export function drehungFuer(nummer: number): number {
  return DREHUNG[mod(nummer, DREHUNG.length)];
}

/** Stern im Aufkleber: Orange, auf orangem Aufkleber die Schriftfarbe. */
export function stickerStern(l: StoryLook): string {
  return l.stickerBg === "#f45b1e" ? l.stickerText : "#f45b1e";
}

/** Wellenlinie in der Hafenfläche: dunkel auf heller Fläche, sonst hell. */
export function hafenLinie(l: StoryLook): string {
  return l.hafen === "#fff8ee"
    ? "rgb(15 42 58 / 0.22)"
    : "rgb(255 255 255 / 0.26)";
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
    "--k-faehre": l.faehre,
    "--k-streif": l.streif,
    "--k-akzent": l.akzent,
  };
}
