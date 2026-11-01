/**
 * Termin-Zeitpunkt aus einer Terminbuchung lesen.
 *
 * Primär aus dem Betreff, den components/marketing/termin-booking.tsx
 * erzeugt („Terminbuchung von X — 2026-11-03 10:00“), sonst aus dem
 * Feld „Wunsch-Slot“ („Dienstag, 3. November 2026 um 10:00 Uhr
 * (30 Min)“). Ohne Treffer null, damit nichts Falsches angezeigt wird.
 */

import type { LeadRow } from "@/lib/leads-meta";

import {
  berlinDateIso,
  berlinWallToUtc,
  MONTHS_LONG,
  nextWorkday,
  workdayOnOrAfter,
} from "@/lib/admin/berlin-time";
import {
  MIN_LEAD_MINUTES,
  SLOT_DURATION_MIN,
  SLOT_TIMES,
} from "@/lib/calendar-availability";
import { fieldValue } from "@/lib/leads-meta";

export type TerminSlot = {
  start: Date;
  end: Date;
  /** yyyy-mm-dd (Hamburg) */
  dateIso: string;
  /** HH:MM (Hamburg) */
  time: string;
};

const SUBJECT_RE = /(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})\s*$/;
const FIELD_RE = new RegExp(
  `(\\d{1,2})\\.\\s*(${MONTHS_LONG.join("|")})\\s+(\\d{4})\\s+um\\s+(\\d{1,2})[:.](\\d{2})`,
  "i",
);

const pad = (n: number) => String(n).padStart(2, "0");

function build(
  y: number,
  m: number,
  d: number,
  hh: number,
  mm: number,
): TerminSlot | null {
  if (hh > 23 || mm > 59) return null;
  const check = new Date(Date.UTC(y, m - 1, d));
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  const dateIso = `${y}-${pad(m)}-${pad(d)}`;
  const time = `${pad(hh)}:${pad(mm)}`;
  const start = berlinWallToUtc(dateIso, time);
  const end = new Date(start.getTime() + SLOT_DURATION_MIN * 60_000);
  return { start, end, dateIso, time };
}

export function parseTerminSlot(
  lead: Pick<LeadRow, "subject" | "fields">,
): TerminSlot | null {
  const s = SUBJECT_RE.exec(lead.subject ?? "");
  if (s) {
    const slot = build(+s[1], +s[2], +s[3], +s[4], +s[5]);
    if (slot) return slot;
  }
  const wunsch = fieldValue(lead, "Wunsch-Slot");
  const f = wunsch ? FIELD_RE.exec(wunsch) : null;
  if (f) {
    const month =
      MONTHS_LONG.findIndex(
        (name) => name.toLowerCase() === f[2].toLowerCase(),
      ) + 1;
    return build(+f[3], month, +f[1], +f[4], +f[5]);
  }
  return null;
}

/**
 * Freie Zeiten für Vorschläge an Kunden: die nächsten `days` Werktage
 * (ohne Feiertage und BLOCKED_DATES) mal SLOT_TIMES, ohne Zeiten, die
 * vor jetzt + MIN_LEAD_MINUTES beginnen.
 */
export function freeSlotChoices(
  now: Date,
  days = 5,
): { dateIso: string; times: string[] }[] {
  const out: { dateIso: string; times: string[] }[] = [];
  let day = workdayOnOrAfter(berlinDateIso(now));
  const earliest = now.getTime() + MIN_LEAD_MINUTES * 60_000;
  // Ein Tag ohne freie Zeit (heute ist schon zu spät) zählt nicht mit.
  for (let guard = 0; out.length < days && guard < days + 30; guard++) {
    const times = SLOT_TIMES.filter(
      (t) => berlinWallToUtc(day, t).getTime() >= earliest,
    );
    if (times.length) out.push({ dateIso: day, times });
    day = nextWorkday(day);
  }
  return out;
}

/** Ist das eine gültige, buchbare Startzeit laut SLOT_TIMES? */
export function isSlotTime(time: string): boolean {
  return SLOT_TIMES.includes(time);
}
