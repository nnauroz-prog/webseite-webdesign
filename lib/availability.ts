/**
 * Verfügbarkeits-Information für die Marketing-Site.
 *
 * Manuell gepflegt — kein Live-Counter, keine Fake-Knappheit.
 * Konkrete Termine statt „ein paar Slots" bringen messbar bessere
 * Konversion, weil Scarcity zeit-konkret wird statt rhetorisch.
 *
 * Pflege-Hinweis: `nextSlots` als ISO-Daten (yyyy-mm-dd) eintragen.
 * Vergangene Termine fallen beim Rendern automatisch raus — ein
 * vergessenes Update zeigt also nie einen Termin von vor Monaten,
 * sondern schwenkt auf „Aktuell N Bauplätze frei" zurück.
 */

export type AvailabilityInfo = {
  /** Wie viele Bauplätze sind noch im laufenden Monat frei? */
  availableSlots: number;
  /** Welcher Monat ist gemeint? (Display-Form) */
  slotMonth: string;
  /** Folgemonat — gezeigt wenn voll. */
  nextMonth: string;
  /**
   * Konkrete nächste freie Werktage als ISO-Datum (yyyy-mm-dd).
   * Maximal zwei werden angezeigt; mehr wirkt wieder unkonkret.
   */
  nextSlots: string[];
};

export const AVAILABILITY: AvailabilityInfo = {
  availableSlots: 2,
  slotMonth: "diesen Monat",
  nextMonth: "nächsten Monat",
  nextSlots: [],
};

const SLOT_LABEL = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Berlin",
});

/** Heutiges Datum in Europe/Berlin als yyyy-mm-dd. */
function berlinTodayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Die noch nicht vergangenen Termine aus `nextSlots`, formatiert
 * als „Mi., 25. Juni". Leer, wenn alle gepflegten Termine vorbei
 * sind oder keine eingetragen wurden.
 */
export function upcomingSlotLabels(max = 2): string[] {
  const today = berlinTodayIso();
  return AVAILABILITY.nextSlots
    .filter((iso) => /^\d{4}-\d{2}-\d{2}$/.test(iso) && iso >= today)
    .sort()
    .slice(0, max)
    .map((iso) => SLOT_LABEL.format(new Date(`${iso}T12:00:00Z`)));
}
