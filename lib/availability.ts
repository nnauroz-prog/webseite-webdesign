/**
 * Verfügbarkeits-Information für die Marketing-Site.
 *
 * Manuell gepflegt — kein Live-Counter, keine Fake-Knappheit.
 * Konkrete Termine statt „ein paar Slots" bringen messbar bessere
 * Konversion, weil Scarcity zeit-konkret wird statt rhetorisch.
 *
 * Pflege-Hinweis: zu Monatsanfang die nextSlots-Array auf die
 * tatsächlich nächsten freien Werktage anpassen. Wenn alles voll,
 * `nextSlots` leer lassen — die UI schwenkt dann auf
 * „Folgemonat"-Hinweis.
 */

export type AvailabilityInfo = {
  /** Wie viele Bauplätze sind noch im laufenden Monat frei? */
  availableSlots: number;
  /** Welcher Monat ist gemeint? (Display-Form) */
  slotMonth: string;
  /** Folgemonat — gezeigt wenn voll. */
  nextMonth: string;
  /**
   * Konkrete nächste Termine (Display-Strings) — zeigt Besuchern
   * statt „ein paar Slots" was wirklich frei ist. Maximal zwei
   * Termine pro Anzeige; mehr wirkt wieder unkonkret.
   * Pflege: Hand-aktualisiert pro Monatsanfang.
   */
  nextSlots: string[];
};

export const AVAILABILITY: AvailabilityInfo = {
  availableSlots: 2,
  slotMonth: "diesen Monat",
  nextMonth: "nächsten Monat",
  nextSlots: ["Mi., 25. Juni", "Mo., 30. Juni"],
};
