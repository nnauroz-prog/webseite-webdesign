/**
 * Post-Planer: was an welchem Tag schon gepostet ist (Story und
 * Beitrag je Post), die Serie und der Stand der Woche, dazu der Stand
 * des Morgenlaufs (tagesaktuelle Karten oder Reserve).
 *
 * Rein (ohne Server- oder Next-Importe): in Seiten, Client-Komponenten,
 * Server Actions und unter node --test nutzbar. Gespeichert wird über
 * lib/post-status-store.ts (server-only), Tabelle public.post_status
 * (supabase/migrations/20261116000000_ausbau.sql).
 */

import type { SpruchTag } from "@/lib/sprueche-data";

import { addDays, berlinDateIso, weekdayOf } from "@/lib/admin/berlin-time";

export const POST_FORMATE = ["story", "beitrag"] as const;
export type PostFormat = (typeof POST_FORMATE)[number];

export const FORMAT_LABELS: Record<PostFormat, string> = {
  story: "Story",
  beitrag: "Beitrag",
};

/** Name je Platz (0 = Spruch des Tages, auch auf /journal). */
export const PLATZ_NAME = [
  "Spruch des Tages",
  "Zusatz-Post 1",
  "Zusatz-Post 2",
];

export function platzName(platz: number): string {
  return PLATZ_NAME[platz] ?? `Post ${platz + 1}`;
}

/** So weit zurück lässt sich noch nachtragen, was gepostet wurde. */
export const NACHTRAGEN_TAGE = 30;

/** Höchstlänge des gespeicherten Satzes (die Datenbank prüft dasselbe). */
export const POST_TEXT_MAX = 500;

/** Eine Zeile der Tabelle public.post_status. */
export type PostStatusRow = {
  /** yyyy-mm-dd (Hamburg) */
  datum: string;
  platz: number;
  format: PostFormat;
  /** Der Satz, der gepostet wurde (Schnappschuss). */
  text: string;
  gepostet_at: string;
};

/** Alle Spalten (select und Schema-Prüfung). */
export const POST_STATUS_COLUMNS = [
  "datum",
  "platz",
  "format",
  "text",
  "gepostet_at",
] as const satisfies readonly (keyof PostStatusRow)[];

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function echtesDatum(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const m = ISO_DATE_RE.exec(v);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  return t.getUTCFullYear() === y &&
    t.getUTCMonth() === mo - 1 &&
    t.getUTCDate() === d &&
    y >= 2020 &&
    y <= 2100
    ? v
    : null;
}

export function parsePostFormat(v: unknown): PostFormat | null {
  return typeof v === "string" &&
    (POST_FORMATE as readonly string[]).includes(v)
    ? (v as PostFormat)
    : null;
}

export function parsePlatz(v: unknown): number | null {
  return typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 2
    ? v
    : null;
}

/**
 * Tag eines Posts zum Abhaken: echtes Datum, nicht in der Zukunft und
 * höchstens NACHTRAGEN_TAGE zurück (Hamburger Zeit).
 */
export function parsePostDatum(v: unknown, now: Date): string | null {
  const iso = echtesDatum(v);
  if (!iso) return null;
  const heute = berlinDateIso(now);
  return iso <= heute && iso >= addDays(heute, -NACHTRAGEN_TAGE) ? iso : null;
}

/** Der gepostete Satz: getrimmt, 1 bis POST_TEXT_MAX Zeichen. */
export function parsePostText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const text = v.trim();
  return text.length >= 1 && text.length <= POST_TEXT_MAX ? text : null;
}

/** Datenbank-Zeile → PostStatusRow, kaputte Zeilen ergeben null. */
export function postStatusAusZeile(data: unknown): PostStatusRow | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const datum = echtesDatum(
    typeof row.datum === "string" ? row.datum.slice(0, 10) : null,
  );
  const platz = parsePlatz(Number(row.platz));
  const format = parsePostFormat(row.format);
  if (!datum || platz === null || !format) return null;
  return {
    datum,
    platz,
    format,
    text: typeof row.text === "string" ? row.text : "",
    gepostet_at: String(row.gepostet_at ?? ""),
  };
}

export function postKey(datum: string, platz: number, format: PostFormat) {
  return `${datum}|${platz}|${format}`;
}

/** Schneller Zugriff: Schlüssel (postKey) → Zeile. */
export function postStatusMap(
  rows: readonly PostStatusRow[],
): Map<string, PostStatusRow> {
  return new Map(rows.map((r) => [postKey(r.datum, r.platz, r.format), r]));
}

/** Stand eines Posts je Format: nicht gepostet, gepostet, oder eine frühere Karte gepostet. */
export type PostStand = "offen" | "gepostet" | "andere";

export function postStand(
  map: ReadonlyMap<string, PostStatusRow>,
  post: Pick<SpruchTag, "datum" | "platz" | "text">,
  format: PostFormat,
): PostStand {
  const row = map.get(postKey(post.datum, post.platz, format));
  if (!row) return "offen";
  return row.text === post.text ? "gepostet" : "andere";
}

/**
 * Serie: wie viele Tage in Folge mindestens ein Post online ging, bis
 * heute. Ist heute noch nichts gepostet, zählt die Serie bis gestern
 * (der Tag ist ja noch nicht vorbei).
 */
export function serieTage(rows: readonly PostStatusRow[], heute: string) {
  const tage = new Set(rows.map((r) => r.datum));
  let tag = tage.has(heute) ? heute : addDays(heute, -1);
  let n = 0;
  while (tage.has(tag) && n < 3660) {
    n += 1;
    tag = addDays(tag, -1);
  }
  return n;
}

/** Montag der Woche (ISO-Woche, Hamburger Kalendertag). */
export function wochenStart(heute: string): string {
  return addDays(heute, -((weekdayOf(heute) + 6) % 7));
}

/**
 * Stand der laufenden Woche (Montag bis heute): wie oft gepostet wurde
 * (Story und Beitrag zählen einzeln) und an wie vielen Tagen.
 */
export function wochenStand(
  rows: readonly PostStatusRow[],
  heute: string,
): { gepostet: number; tageMitPost: number; tageBisher: number } {
  const start = wochenStart(heute);
  const dieseWoche = rows.filter((r) => r.datum >= start && r.datum <= heute);
  return {
    gepostet: dieseWoche.length,
    tageMitPost: new Set(dieseWoche.map((r) => r.datum)).size,
    // Montag 1 … Sonntag 7
    tageBisher: ((weekdayOf(heute) + 6) % 7) + 1,
  };
}

/**
 * Was der Morgenlauf für einen Tag geliefert hat: wie viele Posts zum
 * Tag geschrieben sind (herkunft „aktuell“), wie viele aus der Reserve
 * kommen, und die Anlässe (ohne Doppelte).
 */
export function morgenlaufStand(
  posts: readonly Pick<SpruchTag, "herkunft" | "anlass">[],
): {
  aktuell: number;
  reserve: number;
  anlaesse: string[];
  geliefert: boolean;
} {
  const aktuell = posts.filter((p) => p.herkunft === "aktuell");
  const anlaesse = [
    ...new Set(aktuell.map((p) => p.anlass).filter((a): a is string => !!a)),
  ];
  return {
    aktuell: aktuell.length,
    reserve: posts.length - aktuell.length,
    anlaesse,
    geliefert: aktuell.length > 0,
  };
}
