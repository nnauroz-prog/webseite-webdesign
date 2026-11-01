/**
 * Antwortfristen nach dem, was die Website selbst verspricht.
 *
 * Anfrage (inquiry-form, /erreichbarkeit): „Werktags 9–18 Uhr meist
 *   innerhalb von vier Stunden, sonst spätestens am nächsten Werktag
 *   bis Mittag“, Wochenende → „Montag bis 12 Uhr“.
 *   - Eingang an einem Werktag 9:00–17:59: spätestens nächster
 *     Werktag 12:00. Ziel = Eingang + 4 h, wenn das noch am selben
 *     Tag bis 18:00 liegt, sonst Ziel = spätestens.
 *   - Sonst: Ziel = spätestens = erster Werktag-Mittag (12:00) nach
 *     dem Eingang (Di 7:00 → Di 12:00, Fr 19:00 → Mo 12:00).
 * Audit („innerhalb von 48 Stunden“): Ziel = spätestens = Eingang + 48 h.
 * Termin („Bestätigung am selben Werktag“): Eingang an einem Werktag
 *   vor 18:00 → derselbe Tag 18:00, sonst nächster Werktag 18:00.
 *   18:00 ist eine Annahme (Ende des 9–18-Uhr-Fensters).
 */

import type { LeadKind } from "@/lib/leads-meta";

import {
  addWorkdays,
  berlinDateIso,
  berlinMinutes,
  berlinWallToUtc,
  formatDurationSince,
  formatMoment,
  isWorkday,
  nextWorkday,
} from "@/lib/admin/berlin-time";

const HOUR = 3_600_000;
const OPEN_FROM = 9 * 60;
const OPEN_UNTIL = 18 * 60;
const NOON = 12 * 60;

export type ReplyDue = { ziel: Date; spaetestens: Date };

export function replyDue(kind: LeadKind, createdAt: Date): ReplyDue {
  const iso = berlinDateIso(createdAt);
  const minutes = berlinMinutes(createdAt);
  const workday = isWorkday(iso);

  if (kind === "audit") {
    // Die Website verspricht die Durchsicht „meist innerhalb von zwei
    // Werktagen“: Ende des zweiten Werktags nach Eingang, 18:00 Uhr.
    const due = berlinWallToUtc(addWorkdays(iso, 2), "18:00");
    return { ziel: due, spaetestens: due };
  }

  if (kind === "termin") {
    const day = workday && minutes < OPEN_UNTIL ? iso : nextWorkday(iso);
    const due = berlinWallToUtc(day, "18:00");
    return { ziel: due, spaetestens: due };
  }

  if (workday && minutes >= OPEN_FROM && minutes < OPEN_UNTIL) {
    const spaetestens = berlinWallToUtc(nextWorkday(iso), "12:00");
    const plus4 = new Date(createdAt.getTime() + 4 * HOUR);
    const endOfDay = berlinWallToUtc(iso, "18:00");
    return { ziel: plus4 <= endOfDay ? plus4 : spaetestens, spaetestens };
  }

  const day = workday && minutes < NOON ? iso : nextWorkday(iso);
  const due = berlinWallToUtc(day, "12:00");
  return { ziel: due, spaetestens: due };
}

export type DueLevel = "offen" | "ziel_verpasst" | "ueberfaellig";

export type DueState = { level: DueLevel; label: string; sortKey: number };

export function dueState(kind: LeadKind, createdAt: Date, now: Date): DueState {
  const { ziel, spaetestens } = replyDue(kind, createdAt);
  const sortKey = spaetestens.getTime();
  const verb = kind === "termin" ? "Bestätigen" : "Antwort";

  if (now.getTime() <= ziel.getTime()) {
    return {
      level: "offen",
      label: `${verb} bis ${formatMoment(ziel, now)}`,
      sortKey,
    };
  }
  if (now.getTime() <= spaetestens.getTime()) {
    // Diese Stufe gibt es nur, wenn das Vier-Stunden-Ziel galt (Eingang
    // werktags 9–14 Uhr): Die Anfrage ist also wirklich über 4 Std. offen.
    return {
      level: "ziel_verpasst",
      label: `Über 4 Std. offen · Antwort spätestens ${formatMoment(spaetestens, now)}`,
      sortKey,
    };
  }
  const noun = kind === "termin" ? "Bestätigung" : "Antwort";
  return {
    level: "ueberfaellig",
    label: `${noun} überfällig seit ${formatDurationSince(now.getTime() - spaetestens.getTime())}`,
    sortKey,
  };
}
