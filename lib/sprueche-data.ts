/**
 * Spruch des Tages für /journal und für die Story im Admin (/admin/story).
 *
 * Zuerst gelten die tagesaktuellen Karten aus lib/posts-aktuell.ts: Ein
 * Lauf schreibt sie jeden Morgen zu dem, was an diesem Tag ansteht
 * (Anlässe in lib/anlaesse.ts). Fehlt ein Tag oder ein Platz, springt die
 * Reserve ein: lib/sprueche-liste.ts (Spruch des Tages) und
 * lib/sprueche-extra.ts (Zusatz-Posts), Reihenfolge nach dem Datum in
 * Hamburg (spruchFuer, extraFuer).
 *
 * Regeln für die Karten prüft tests/sprueche.test.ts.
 */
import { POSTS_AKTUELL, type AktuellerPost } from "@/lib/posts-aktuell";
import { SPRUECHE_EXTRA } from "@/lib/sprueche-extra";
import { SPRUECHE } from "@/lib/sprueche-liste";

export { POSTS_AKTUELL, SPRUECHE, SPRUECHE_EXTRA };
export type { AktuellerPost };

/** Tagesaktuelle Karten je Kalendertag (yyyy-mm-dd), siehe lib/posts-aktuell.ts. */
export type AktuelleKarten = Readonly<Record<string, readonly AktuellerPost[]>>;

/**
 * Posts je Tag: der Spruch des Tages (Platz 0, auch auf /journal) und
 * zwei Zusatz-Posts (Platz 1 und 2, nur im Story-Studio).
 */
export const POSTS_PRO_TAG = 3;

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

/**
 * Was am Anlass nur Zustand ist, nicht Name: „Winterdom läuft“ wird zu
 * #winterdom, „Black Friday in Sicht“ zu #blackfriday, „Letzter Tag
 * Winterdom“ ebenfalls zu #winterdom.
 */
const ANLASS_RAND = [
  /^(bald|noch|wieder|endlich)\s+/i,
  /^letzter tag\s+/i,
  /\s+(ab|am|bis|seit)\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute)$/i,
  /\s+(in|über|für)\s+hamburg$/i,
  /\s+(läuft|naht|beginnt|startet|endet|eröffnet|kommt|offen|in sicht)$/i,
];

/**
 * Schlagwort zum Anlass eines tagesaktuellen Posts: klein, ohne
 * Leerzeichen, Umlaute bleiben („Erster Advent“ → #ersteradvent). Null,
 * wenn nichts Sinnvolles übrig bleibt oder das Schlagwort ohnehin dabei ist.
 */
export function anlassTag(anlass: string | null | undefined): string | null {
  if (!anlass) return null;
  let kern = anlass.trim();
  for (const rand of ANLASS_RAND) kern = kern.replace(rand, "");
  const wort = kern.toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (wort.length < 3) return null;
  const tag = `#${wort}`;
  const vorhanden = [...FESTE_TAGS, ...Object.values(THEMA_TAGS).flat()];
  return vorhanden.includes(tag) ? null : tag;
}

/**
 * Beitragstext für Instagram: Satz, Zusatz, Schlagworte. Tagesaktuelle
 * Posts bekommen am Ende ein Schlagwort zu ihrem Anlass (#blackfriday).
 */
export function storyBeschriftung(
  s: Pick<Spruch, "text" | "zusatz" | "thema"> & {
    anlass?: string | null;
  },
): string {
  const zumAnlass = anlassTag(s.anlass);
  const tags = [
    ...FESTE_TAGS,
    ...THEMA_TAGS[s.thema],
    ...(zumAnlass ? [zumAnlass] : []),
  ];
  return `${s.text}\n${s.zusatz}\n\n${tags.join(" ")}`;
}

const TAG_MS = 24 * 60 * 60 * 1000;
/**
 * Tag 0 der Zählung: Karte 0 der Liste gehört zu diesem Tag, Karte 1 zum
 * nächsten und so weiter. Der Start liegt sechs Tage vor dem ersten
 * Erscheinen, damit auch die „letzten sieben Tage“ eigene Karten haben.
 */
const START = Date.UTC(2026, 10, 9);

/** Erster Tag mit Zusatz-Posts: Karte 0 und 1 von SPRUECHE_EXTRA. */
const EXTRA_START = Date.UTC(2026, 10, 15);

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

/** Tage seit dem ersten Tag mit Zusatz-Posts (negativ: davor). */
function extraNummer(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - EXTRA_START) / TAG_MS);
}

/**
 * Zusatz-Post für einen Kalendertag (platz 1 oder 2). Vor dem ersten
 * Tag gibt es keine. Ist der Vorrat aufgebraucht, beginnt die Liste
 * notgedrungen von vorn (siehe vorratTageExtra).
 */
export function extraFuer(iso: string, platz: number): Spruch | null {
  const tag = extraNummer(iso);
  const n = SPRUECHE_EXTRA.length;
  if (tag < 0 || n === 0 || platz < 1 || platz >= POSTS_PRO_TAG) return null;
  return SPRUECHE_EXTRA[(tag * (POSTS_PRO_TAG - 1) + platz - 1) % n];
}

/** Wie viele Tage die Zusatz-Posts noch reichen, heute mitgezählt. */
export function vorratTageExtra(jetzt: Date): number {
  return (
    Math.floor(SPRUECHE_EXTRA.length / (POSTS_PRO_TAG - 1)) -
    Math.max(0, extraNummer(tagInHamburg(jetzt)))
  );
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
  /** fortlaufende Tagesnummer: bestimmt mit dem Platz das Bild (lib/story-variante.ts) */
  nummer: number;
  /** 0 = Spruch des Tages, 1 und 2 = Zusatz-Posts */
  platz: number;
  /** Anlass eines tagesaktuellen Posts („Black Friday“), bei Reserve-Karten null. */
  anlass: string | null;
  /** „aktuell“: am Morgen zum Tag geschrieben; „vorrat“: Karte aus der Reserve. */
  herkunft: "aktuell" | "vorrat";
};

/** Ein Kalendertag (yyyy-mm-dd) um n Tage versetzt. */
export function tagVersetzt(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * TAG_MS)
    .toISOString()
    .slice(0, 10);
}

type TagKopf = Pick<
  SpruchTag,
  "datum" | "datumText" | "datumKurz" | "tagImMonat" | "nummer"
>;

/** Datumsangaben eines Kalendertags (yyyy-mm-dd), für alle Posts des Tages gleich. */
function tagKopf(datum: string): TagKopf {
  const [y, m, d] = datum.split("-").map(Number);
  const tag = new Date(Date.UTC(y, m - 1, d));
  return {
    datum,
    datumText: BERLIN_LANG.format(tag),
    datumKurz: BERLIN_KURZ.format(tag),
    tagImMonat: String(tag.getUTCDate()),
    nummer: tagNummer(datum),
  };
}

/**
 * Ein Post aus Karte und Tag. Die Felder werden einzeln übernommen, damit
 * nichts von einer Karte auf eine andere durchrutscht (etwa der Anlass).
 */
function alsTag(
  kopf: TagKopf,
  s: Spruch,
  platz: number,
  anlass: string | null,
  herkunft: SpruchTag["herkunft"],
): SpruchTag {
  return {
    kicker: s.kicker,
    text: s.text,
    betont: s.betont,
    zusatz: s.zusatz,
    thema: s.thema,
    ...kopf,
    platz,
    anlass,
    herkunft,
  };
}

/**
 * Alle Posts eines Kalendertags (yyyy-mm-dd): Platz 0 ist der Spruch des
 * Tages, Platz 1 und 2 die Zusatz-Posts. Tagesaktuelle Karten (am Morgen
 * zum Tag geschrieben) haben Vorrang; wo es keine gibt, springt die
 * Reserve ein (spruchFuer, extraFuer).
 */
export function postsFuer(
  datum: string,
  aktuell: AktuelleKarten = POSTS_AKTUELL,
): SpruchTag[] {
  const kopf = tagKopf(datum);
  const heute = aktuell[datum] ?? [];
  const posts: SpruchTag[] = [];
  for (let platz = 0; platz < POSTS_PRO_TAG; platz++) {
    const a = heute[platz];
    if (a) {
      posts.push(alsTag(kopf, a, platz, a.anlass, "aktuell"));
      continue;
    }
    const reserve = platz === 0 ? spruchFuer(datum) : extraFuer(datum, platz);
    if (reserve) posts.push(alsTag(kopf, reserve, platz, null, "vorrat"));
  }
  return posts;
}

/** Der Spruch des Tages (Platz 0) für einen Kalendertag, mit Datum zum Anzeigen. */
export function spruchTag(
  datum: string,
  aktuell: AktuelleKarten = POSTS_AKTUELL,
): SpruchTag {
  return postsFuer(datum, aktuell)[0];
}

/** Heute und die Tage davor, heute zuerst. */
export function spruecheBis(
  jetzt: Date,
  anzahl = 7,
  aktuell: AktuelleKarten = POSTS_AKTUELL,
): SpruchTag[] {
  const heute = tagInHamburg(jetzt);
  return Array.from({ length: anzahl }, (_, i) =>
    spruchTag(tagVersetzt(heute, -i), aktuell),
  );
}
