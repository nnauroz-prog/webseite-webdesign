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

/** 15-Minuten-Raster — sieben Slots pro Tag. */
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

  while (out.length < count) {
    const d = cursor.getDay();
    if (d !== 0 && d !== 6) {
      const iso = isoDate(cursor);
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
        isToday: iso === todayIso,
        isBlocked: BLOCKED_DATES.includes(iso),
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
