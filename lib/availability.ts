/**
 * Verfügbarkeits-Information für die Marketing-Site.
 *
 * Manuell gepflegt — kein Live-Counter, keine Fake-Knappheit.
 * Wenn `availableSlots` 0 ist, schwenkt das UI auf den
 * Nächste-Monat-Hinweis.
 *
 * Pflege-Hinweis: zu Monatsanfang Wert prüfen und `slotMonth`
 * anpassen. Wenn voll: `availableSlots: 0`.
 */

export type AvailabilityInfo = {
  /** Wie viele Bauplätze sind noch im laufenden Monat frei? */
  availableSlots: number;
  /** Welcher Monat ist gemeint? (Display-Form) */
  slotMonth: string;
  /** Folgemonat — gezeigt wenn voll. */
  nextMonth: string;
};

export const AVAILABILITY: AvailabilityInfo = {
  availableSlots: 2,
  slotMonth: "diesen Monat",
  nextMonth: "nächsten Monat",
};
