/**
 * Spruch des Tages für /journal und für die Story im Admin (/admin/story).
 *
 * Die Karten stehen in lib/sprueche-liste.ts. Jeden Tag ist automatisch
 * eine andere dran (spruchFuer): Die Reihenfolge ergibt sich aus dem
 * Datum in Hamburg. Neue Karten einfach unten an die Liste anhängen.
 *
 * Regeln für die Karten prüft tests/sprueche.test.ts.
 */
import { SPRUECHE } from "@/lib/sprueche-liste";

export { SPRUECHE };

export type SpruchThema =
  | "eindruck"
  | "google"
  | "texte"
  | "handy"
  | "vertrauen"
  | "tempo"
  | "pflege"
  | "anfrage";

/** Die kleine Zeile über dem Satz, im Ton einer Story. */
export const KICKER = [
  "Real Talk",
  "Hot Take",
  "Reminder",
  "Kleiner Reminder",
  "Unpopular Opinion",
  "Hand aufs Herz",
  "Mal ehrlich",
  "Red Flag",
  "Green Flag",
  "Mythos",
  "Merken",
  "POV",
  "Kurz gesagt",
  "Website-Wahrheit",
] as const;
export type SpruchKicker = (typeof KICKER)[number];

export type Spruch = {
  kicker: SpruchKicker;
  /** Der Satz, der groß auf der Karte steht. */
  text: string;
  /** Wörtlicher Ausschnitt aus text, der hervorgehoben wird (die Pointe). */
  betont: string;
  /** Ein kurzer Satz dazu, kleiner darunter. */
  zusatz: string;
  thema: SpruchThema;
};

export const THEMA_LABEL: Record<SpruchThema, string> = {
  eindruck: "Erster Eindruck",
  google: "Gefunden werden",
  texte: "Texte",
  handy: "Am Handy",
  vertrauen: "Vertrauen",
  tempo: "Tempo",
  pflege: "Pflege",
  anfrage: "Anfragen",
};

/** Schlagworte für den Beitragstext (nur im Admin, nie auf der Website). */
const THEMA_TAGS: Record<SpruchThema, string[]> = {
  eindruck: ["#erstereindruck", "#websitetipps"],
  google: ["#gefundenwerden", "#lokalsichtbar"],
  texte: ["#websitetexte", "#klartext"],
  handy: ["#mobilfirst", "#websitetipps"],
  vertrauen: ["#vertrauen", "#kleinebetriebe"],
  tempo: ["#ladezeit", "#websitetipps"],
  pflege: ["#websitepflege", "#aktuellbleiben"],
  anfrage: ["#kundenanfragen", "#kontakt"],
};
const FESTE_TAGS = ["#webdesign", "#hamburg", "#sitalo"];

/** Satz in drei Teile: vor, betont, nach. Fehlt die Stelle, ist alles „vor“. */
export function teileSatz(
  text: string,
  betont: string,
): [string, string, string] {
  const i = betont ? text.indexOf(betont) : -1;
  if (i < 0) return [text, "", ""];
  return [text.slice(0, i), betont, text.slice(i + betont.length)];
}

/** Beitragstext für Instagram: Satz, Zusatz, Schlagworte. */
export function storyBeschriftung(s: Spruch): string {
  return `${s.text}\n${s.zusatz}\n\n${[...FESTE_TAGS, ...THEMA_TAGS[s.thema]].join(" ")}`;
}

const TAG_MS = 24 * 60 * 60 * 1000;
/**
 * Tag 0 der Zählung: Karte 0 der Liste gehört zu diesem Tag, Karte 1 zum
 * nächsten und so weiter. Der Start liegt sechs Tage vor dem ersten
 * Erscheinen, damit auch die „letzten sieben Tage“ eigene Karten haben.
 */
const START = Date.UTC(2026, 10, 9);

const BERLIN_ISO = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const BERLIN_KURZ = new Intl.DateTimeFormat("de-DE", {
  timeZone: "UTC",
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});
const BERLIN_LANG = new Intl.DateTimeFormat("de-DE", {
  timeZone: "UTC",
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Kalendertag in Hamburg als yyyy-mm-dd. */
export function tagInHamburg(jetzt: Date): string {
  return BERLIN_ISO.format(jetzt);
}

function tagNummer(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - START) / TAG_MS);
}

/**
 * Der Spruch für einen Kalendertag (yyyy-mm-dd). Jeder Tag hat seine
 * eigene Karte, solange der Vorrat reicht (siehe vorratTage). Erst wenn
 * die Liste aufgebraucht ist, beginnt sie notgedrungen von vorn.
 */
export function spruchFuer(iso: string): Spruch {
  const n = SPRUECHE.length;
  return SPRUECHE[((tagNummer(iso) % n) + n) % n];
}

/**
 * Wie viele Tage der Vorrat noch reicht, heute mitgezählt. 0 oder
 * weniger heißt: Die Liste ist aufgebraucht und wiederholt sich.
 */
export function vorratTage(jetzt: Date): number {
  return SPRUECHE.length - tagNummer(tagInHamburg(jetzt));
}

export type SpruchTag = Spruch & {
  /** yyyy-mm-dd */
  datum: string;
  /** „Sa., 14.11.2026“ */
  datumText: string;
  /** „Sa., 14.11.“ */
  datumKurz: string;
  /** Tag im Monat */
  tagImMonat: string;
  /** fortlaufende Tagesnummer: bestimmt die Farbwelt (lib/story-look.ts) */
  nummer: number;
};

/** Ein Kalendertag (yyyy-mm-dd) um n Tage versetzt. */
export function tagVersetzt(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * TAG_MS)
    .toISOString()
    .slice(0, 10);
}

/** Die Karte für einen Kalendertag (yyyy-mm-dd), mit Datum zum Anzeigen. */
export function spruchTag(datum: string): SpruchTag {
  const [y, m, d] = datum.split("-").map(Number);
  const tag = new Date(Date.UTC(y, m - 1, d));
  return {
    ...spruchFuer(datum),
    datum,
    datumText: BERLIN_LANG.format(tag),
    datumKurz: BERLIN_KURZ.format(tag),
    tagImMonat: String(tag.getUTCDate()),
    nummer: tagNummer(datum),
  };
}

/** Heute und die Tage davor, heute zuerst. */
export function spruecheBis(jetzt: Date, anzahl = 7): SpruchTag[] {
  const heute = tagInHamburg(jetzt);
  return Array.from({ length: anzahl }, (_, i) =>
    spruchTag(tagVersetzt(heute, -i)),
  );
}
