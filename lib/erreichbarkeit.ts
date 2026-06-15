/**
 * Antwortzeit-Versprechen, zentral und ehrlich.
 *
 * Aus der L7-Wahrheits-Analyse (§ 03 — die unsichtbaren Verträge):
 * das implizite Versprechen „wir gehen ans Telefon" wird ohne
 * Offenlegung der Grenzen zur Brand-Falle, sobald die Kundenzahl
 * wächst. Diese Datei hält die Grenzen einsehbar — Antwortzeiten
 * nach Fenster, Urlaubs-Regelung, Vertretung, Fallback wenn nichts
 * kommt.
 *
 * Bewusst nur die echten Zahlen und Regeln hier. Die Prosa lebt
 * auf der Seite, weil sie sich seltener ändert und stilistisch
 * Hand drauf gehört.
 */

export const ERREICHBARKEIT = {
  /** Antwortzeit-Versprechen pro Tageszeit / Wochenende. */
  fenster: [
    {
      label: "Werktags, 9 bis 18 Uhr",
      zeit: "meist in vier Stunden",
    },
    {
      label: "Werktags, abends und nachts",
      zeit: "am nächsten Werktag bis Mittag",
    },
    {
      label: "Wochenende, regulär",
      zeit: "Montag bis 12 Uhr",
    },
    {
      label: "Wochenende, Live-Seite down",
      zeit: "Notfall-Nummer, auch Samstag",
    },
  ],

  /** Urlaubs-Regel — konkrete Wochen-Zahl, kein „bei Bedarf". */
  urlaub: {
    wochenProJahr: 3,
    maxAmStueck: 3,
  },

  /** Vertretung im Akutfall. */
  vertretung: {
    rolle: "Eine Hamburger Webentwicklerin aus unserem Netzwerk",
    kann: "technisch handeln, wenn die Live-Seite kippt",
    kannNicht: "Sitalo-Ton, Strategie-Gespräche, neue Layouts",
  },
} as const;
