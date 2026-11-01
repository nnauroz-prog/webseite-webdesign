/**
 * Antwortzeiten, zentral an einer Stelle.
 *
 * Die Seite /erreichbarkeit zeigt diese Werte als Tabelle und im
 * Fließtext. Kanonisch (siehe auch FAQ, Anfrageformular, llms.txt):
 * werktags „meist am selben Werktag“, abends und am Wochenende am
 * nächsten Werktag. Keine Stunden-Versprechen, keine feste Urlaubszahl
 * und keine Vertretung, die wir nicht belegen können.
 *
 * Die Prosa lebt auf der Seite, weil sie sich seltener ändert.
 */

/** Mit geschütztem Leerzeichen, damit die Nummer nie umbricht. */
export const TELEFON_ANZEIGE = "0160\u00a07621876";
export const TELEFON_HREF = "tel:+491607621876";

export const ERREICHBARKEIT = {
  /** Antwortzeiten pro Tageszeit / Wochenende. */
  fenster: [
    {
      label: "Werktags, 9 bis 18 Uhr",
      zeit: "meist am selben Werktag",
    },
    {
      label: "Werktags, abends und nachts",
      zeit: "am nächsten Werktag, meist vormittags",
    },
    {
      label: "Am Wochenende",
      zeit: "am Montag, meist vormittags",
    },
    {
      label: "Wochenende, Ihre Seite ist nicht erreichbar",
      zeit: `Anruf oder SMS an ${TELEFON_ANZEIGE}`,
    },
  ],
} as const;
