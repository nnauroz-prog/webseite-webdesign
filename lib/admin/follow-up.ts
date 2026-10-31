/**
 * Wiedervorlage: Ein-Tipp-Daten und Anzeige. Rein, auf dem Server
 * berechnet und fertig an die Client-Komponente gegeben.
 */

import {
  addDays,
  addWorkdays,
  berlinDateIso,
  daysBetween,
  formatShortDay,
  nextWorkday,
  workdayOnOrAfter,
} from "@/lib/admin/berlin-time";

export type FollowUpChip = { iso: string; label: string };

/** Meldung für ein Wiedervorlage-Datum vor heute (Client und Action). */
export const PAST_DATE_ERROR = "Bitte ein Datum ab heute wählen.";

/**
 * true, wenn raw ein Datum (yyyy-mm-dd) vor `today` (Hamburger Zeit)
 * ist. Die Action zeigt dann PAST_DATE_ERROR statt „Ungültige Eingabe.“.
 */
export function isPastDate(raw: unknown, today: string): boolean {
  return typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw) && raw < today;
}

/**
 * „Nächster Werktag (Mo 2.11.)“, „In 3 Werktagen (Mi 4.11.)“,
 * „In einer Woche (Mo 9.11.)“, „In 2 Wochen (Mo 16.11.)“. Die
 * Wochen-Chips landen immer auf einem Werktag.
 */
export function followUpChips(now: Date): FollowUpChip[] {
  const today = berlinDateIso(now);
  const chips: [string, string][] = [
    ["Nächster Werktag", nextWorkday(today)],
    ["In 3 Werktagen", addWorkdays(today, 3)],
    ["In einer Woche", workdayOnOrAfter(addDays(today, 7))],
    ["In 2 Wochen", workdayOnOrAfter(addDays(today, 14))],
  ];
  // Rund um Feiertage (z. B. Ostern) können zwei Chips auf denselben
  // Tag fallen: dann nur den ersten behalten.
  const seen = new Set<string>();
  return chips
    .filter(([, iso]) => {
      if (seen.has(iso)) return false;
      seen.add(iso);
      return true;
    })
    .map(([label, iso]) => ({
      iso,
      label: `${label} (${formatShortDay(iso)})`,
    }));
}

export type FollowUpView = {
  iso: string;
  /** „Mi 4.11.“ */
  day: string;
  due: boolean;
  /** „heute fällig“, „fällig seit 2 Tagen“, „in 3 Tagen“ */
  hint: string;
};

export function followUpView(iso: string, now: Date): FollowUpView {
  const diff = daysBetween(berlinDateIso(now), iso);
  const hint =
    diff === 0
      ? "heute fällig"
      : diff < 0
        ? `fällig seit ${-diff === 1 ? "1 Tag" : `${-diff} Tagen`}`
        : diff === 1
          ? "morgen"
          : `in ${diff} Tagen`;
  return { iso, day: formatShortDay(iso), due: diff <= 0, hint };
}
