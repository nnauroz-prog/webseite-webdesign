/**
 * Datum und Uhrzeit in Hamburg (Europe/Berlin).
 *
 * Vercel läuft in UTC, deshalb rechnet alles hier ausdrücklich über
 * Intl mit der Zeitzone Europe/Berlin. ISO-Daten (yyyy-mm-dd) stehen
 * immer für den Kalendertag in Hamburg.
 */

import { BLOCKED_DATES, hamburgHolidays } from "@/lib/calendar-availability";

export const TIME_ZONE = "Europe/Berlin";

const WEEKDAYS_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const WEEKDAYS_LONG = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];
export const MONTHS_LONG = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export type BerlinParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 0 = Sonntag … 6 = Samstag */
  weekday: number;
};

const partsFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function rawParts(d: Date) {
  const out: Record<string, number> = {};
  for (const p of partsFormat.formatToParts(d)) {
    if (p.type !== "literal") out[p.type] = parseInt(p.value, 10);
  }
  return out;
}

export function berlinParts(d: Date): BerlinParts {
  const p = rawParts(d);
  return {
    year: p.year,
    month: p.month,
    day: p.day,
    hour: p.hour,
    minute: p.minute,
    weekday: new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay(),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function toIso(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Kalendertag in Hamburg als yyyy-mm-dd. */
export function berlinDateIso(d: Date): string {
  const p = berlinParts(d);
  return toIso(p.year, p.month, p.day);
}

/** Uhrzeit in Hamburg als HH:MM. */
export function berlinTime(d: Date): string {
  const p = berlinParts(d);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

/** Minuten seit Mitternacht in Hamburg. */
export function berlinMinutes(d: Date): number {
  const p = berlinParts(d);
  return p.hour * 60 + p.minute;
}

function parseIso(iso: string): [number, number, number] {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return [y, m, d];
}

/** Abstand Hamburger Wandzeit zu UTC in Millisekunden für einen Zeitpunkt. */
function offsetAt(ms: number): number {
  const p = rawParts(new Date(ms));
  const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wall - Math.floor(ms / 1000) * 1000;
}

/**
 * Hamburger Wandzeit (Datum + HH:MM) → UTC-Zeitpunkt. Sicher über die
 * Zeitumstellung: der Offset wird zweimal abgeglichen.
 */
export function berlinWallToUtc(iso: string, hhmm: string): Date {
  const [y, m, d] = parseIso(iso);
  const [hh, mm] = hhmm.split(":").map((n) => parseInt(n, 10));
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const first = guess - offsetAt(guess);
  const second = guess - offsetAt(first);
  return new Date(second);
}

/** Wochentag eines ISO-Datums (0 = Sonntag). */
export function weekdayOf(iso: string): number {
  const [y, m, d] = parseIso(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = parseIso(iso);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return toIso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/** Ganze Kalendertage von a bis b (b − a). */
export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = parseIso(a);
  const [y2, m2, d2] = parseIso(b);
  return Math.round(
    (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DAY,
  );
}

const holidayCache = new Map<number, Map<string, string>>();

function isHoliday(iso: string): boolean {
  const year = parseIso(iso)[0];
  let map = holidayCache.get(year);
  if (!map) {
    map = hamburgHolidays(year);
    holidayCache.set(year, map);
  }
  return map.has(iso);
}

/** Mo–Fr, kein Hamburger Feiertag und nicht in BLOCKED_DATES. */
export function isWorkday(iso: string): boolean {
  const wd = weekdayOf(iso);
  if (wd === 0 || wd === 6) return false;
  if (isHoliday(iso)) return false;
  return !BLOCKED_DATES.includes(iso);
}

/** Der nächste Werktag nach iso (nicht iso selbst). */
export function nextWorkday(iso: string): string {
  let cursor = addDays(iso, 1);
  // Sicherheitsgrenze gegen eine versehentlich endlose BLOCKED_DATES-Liste.
  for (let i = 0; i < 400 && !isWorkday(cursor); i++)
    cursor = addDays(cursor, 1);
  return cursor;
}

/** iso plus n Werktage (n = 0 → iso). */
export function addWorkdays(iso: string, n: number): string {
  let cursor = iso;
  for (let i = 0; i < n; i++) cursor = nextWorkday(cursor);
  return cursor;
}

/** iso, falls Werktag, sonst der nächste Werktag. */
export function workdayOnOrAfter(iso: string): string {
  return isWorkday(iso) ? iso : nextWorkday(iso);
}

/** „Mi 4.11.“ */
export function formatShortDay(iso: string): string {
  const [, m, d] = parseIso(iso);
  return `${WEEKDAYS_SHORT[weekdayOf(iso)]} ${d}.${m}.`;
}

/** „Dienstag, 3. November“ (mit year: „Dienstag, 3. November 2026“) */
export function formatLongDay(iso: string, withYear = false): string {
  const [y, m, d] = parseIso(iso);
  const base = `${WEEKDAYS_LONG[weekdayOf(iso)]}, ${d}. ${MONTHS_LONG[m - 1]}`;
  return withYear ? `${base} ${y}` : base;
}

/** „Sa, 31. Oktober“ für Datumszeilen. */
export function formatHeaderDay(d: Date): string {
  const iso = berlinDateIso(d);
  const [, m, day] = parseIso(iso);
  return `${WEEKDAYS_SHORT[weekdayOf(iso)]}, ${day}. ${MONTHS_LONG[m - 1]}`;
}

/** „Mo 2.11. 12:00“ */
export function formatDayTime(d: Date): string {
  return `${formatShortDay(berlinDateIso(d))} ${berlinTime(d)}`;
}

/**
 * Kurze Angabe eines Zeitpunkts relativ zu jetzt, für Fristen:
 * heute → „15:10“, in den nächsten 6 Tagen → „Mo 12:00“, sonst
 * „Mo 2.11. 12:00“.
 */
export function formatMoment(d: Date, now: Date): string {
  const day = berlinDateIso(d);
  const diff = daysBetween(berlinDateIso(now), day);
  if (diff === 0) return berlinTime(d);
  if (diff > 0 && diff < 7)
    return `${WEEKDAYS_SHORT[weekdayOf(day)]} ${berlinTime(d)}`;
  return formatDayTime(d);
}

/** Dauer in Worten: „40 Min“, „2 Std“, „1 Tag“, „3 Tagen“ (für „seit …“). */
export function formatDurationSince(ms: number): string {
  const minutes = Math.max(1, Math.floor(ms / MINUTE));
  if (minutes < 60) return `${minutes} Min`;
  const hours = Math.floor(ms / HOUR);
  if (hours < 24) return `${hours} Std`;
  const days = Math.floor(ms / DAY);
  return days === 1 ? "1 Tag" : `${days} Tagen`;
}

/**
 * „gerade eben“ / „vor 25 Min“ / „heute 14:05“ / „gestern 18:40“ /
 * „Mo 26.10.“ / „12.08.25“ (anderes Jahr).
 */
export function relativeTime(d: Date, now: Date): string {
  const diff = now.getTime() - d.getTime();
  if (diff < MINUTE) return "gerade eben";
  if (diff < HOUR) return `vor ${Math.floor(diff / MINUTE)} Min`;
  const day = berlinDateIso(d);
  const today = berlinDateIso(now);
  if (day === today) return `heute ${berlinTime(d)}`;
  if (day === addDays(today, -1)) return `gestern ${berlinTime(d)}`;
  const [y, m, dd] = parseIso(day);
  if (y === parseIso(today)[0]) return formatShortDay(day);
  return `${pad(dd)}.${pad(m)}.${String(y).slice(-2)}`;
}
