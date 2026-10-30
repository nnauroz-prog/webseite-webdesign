/**
 * Verfügbarkeits-Konfiguration für /termin.
 *
 * Bewusst statisch und manuell gepflegt — kein Google-Calendar-
 * Sync, kein Cron-Job, keine Konflikte mit der Backend-Lose-
 * Architektur. Wenn jemand bucht, kommt eine Mail bei uns rein,
 * und wir bestätigen oder schlagen einen Alternativ-Slot vor.
 *
 * Pflege:
 *   - `BLOCKED_DATES` füllen, wenn ganze Tage rausfallen sollen
 *     (z. B. Urlaub, Feiertage). ISO-Datum (yyyy-mm-dd).
 *   - Slots-Konfiguration anpassen, wenn die Arbeitszeit sich
 *     verschiebt.
 *
 * Die UI generiert daraus automatisch die nächsten 14 Werktage.
 */

/** ISO-Daten, an denen keine Termine gebucht werden können. */
export const BLOCKED_DATES: string[] = [
  // Beispiel-Format:
  // "2026-06-12",  // Brückentag
];

/** 30-Minuten-Raster, Mittagspause 12:00–13:30. */
export const SLOT_TIMES: string[] = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  // Mittagspause 12:00 – 13:30
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export const SLOT_DURATION_MIN = 30;

/**
 * Mindest-Vorlauf für Buchungen am selben Tag. Die Seite verspricht
 * Bestätigung innerhalb von 15 Minuten — ein Slot, der in einer
 * halben Stunde beginnt, wäre trotzdem nicht seriös zu halten.
 */
export const MIN_LEAD_MINUTES = 120;

/**
 * Gesetzliche Feiertage in Hamburg (yyyy-mm-dd → Name). Wird pro
 * Jahr berechnet, damit niemand die Liste jährlich pflegen muss.
 * Hamburg: bundesweite Feiertage plus Reformationstag (seit 2018).
 */
export function hamburgHolidays(year: number): Map<string, string> {
  const easter = easterSunday(year);
  const offset = (days: number) => {
    const d = new Date(easter);
    d.setDate(d.getDate() + days);
    return isoDate(d);
  };
  return new Map([
    [`${year}-01-01`, "Neujahr"],
    [offset(-2), "Karfreitag"],
    [offset(1), "Ostermontag"],
    [`${year}-05-01`, "Tag der Arbeit"],
    [offset(39), "Christi Himmelfahrt"],
    [offset(50), "Pfingstmontag"],
    [`${year}-10-03`, "Tag der Deutschen Einheit"],
    [`${year}-10-31`, "Reformationstag"],
    [`${year}-12-25`, "1. Weihnachtstag"],
    [`${year}-12-26`, "2. Weihnachtstag"],
  ]);
}

/** Ostersonntag nach der anonymen gregorianischen Osterformel. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Aktuelle Uhrzeit in Hamburg als Minuten seit Mitternacht. */
function berlinMinutesNow(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const h = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
  const m = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
  return h * 60 + m;
}

function slotMinutes(slot: string): number {
  const [h, m] = slot.split(":").map((n) => parseInt(n, 10));
  return h * 60 + m;
}

/**
 * Ob ein Slot heute schon vorbei ist oder zu knapp beginnt. An
 * anderen Tagen als heute immer false.
 */
export function isSlotTooSoon(
  day: Pick<DayCell, "isToday">,
  slot: string,
  now: Date = new Date(),
): boolean {
  if (!day.isToday) return false;
  return slotMinutes(slot) < berlinMinutesNow(now) + MIN_LEAD_MINUTES;
}

/**
 * Erzeugt die nächsten N Werktage (Mo–Fr) ab heute (Europe/Berlin).
 * Datums-Slots werden client-seitig gefiltert gegen BLOCKED_DATES.
 *
 * Format: { iso, weekday, day, month, isToday }
 */
export type DayCell = {
  iso: string;
  weekday: string;
  day: string;
  month: string;
  isToday: boolean;
  isBlocked: boolean;
  /** Grund der Sperre für Tooltip / Screenreader, z. B. „Reformationstag". */
  blockedReason?: string;
};

export function nextWorkdays(count: number, fromDate?: Date): DayCell[] {
  const out: DayCell[] = [];
  const base = fromDate ?? new Date();
  // Auf Europe/Berlin normalisieren — wir wollen den Tag in Hamburg,
  // nicht in UTC.
  const berlin = new Date(
    base.toLocaleString("en-US", { timeZone: "Europe/Berlin" }),
  );
  berlin.setHours(0, 0, 0, 0);

  const todayIso = isoDate(berlin);
  const cursor = new Date(berlin);

  // Wenn heute Sa/So → spring auf Montag
  while (cursor.getDay() === 0 || cursor.getDay() === 6) {
    cursor.setDate(cursor.getDate() + 1);
  }

  const holidaysByYear = new Map<number, Map<string, string>>();
  const holidayName = (date: Date, iso: string) => {
    const y = date.getFullYear();
    if (!holidaysByYear.has(y)) holidaysByYear.set(y, hamburgHolidays(y));
    return holidaysByYear.get(y)!.get(iso);
  };

  while (out.length < count) {
    const d = cursor.getDay();
    if (d !== 0 && d !== 6) {
      const iso = isoDate(cursor);
      const isToday = iso === todayIso;
      const holiday = holidayName(cursor, iso);
      // Heute ist nur buchbar, solange noch ein Slot mit genug
      // Vorlauf übrig ist.
      const todayExhausted =
        isToday && SLOT_TIMES.every((s) => isSlotTooSoon({ isToday }, s, base));
      const blockedReason = holiday
        ? holiday
        : BLOCKED_DATES.includes(iso)
          ? "nicht verfügbar"
          : todayExhausted
            ? "heute keine Termine mehr"
            : undefined;
      out.push({
        iso,
        weekday: cursor.toLocaleDateString("de-DE", {
          weekday: "short",
          timeZone: "Europe/Berlin",
        }),
        day: String(cursor.getDate()).padStart(2, "0"),
        month: cursor.toLocaleDateString("de-DE", {
          month: "short",
          timeZone: "Europe/Berlin",
        }),
        isToday,
        isBlocked: blockedReason !== undefined,
        blockedReason,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return out;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
