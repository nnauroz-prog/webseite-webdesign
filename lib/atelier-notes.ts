/**
 * Atelier-Notizen — was gerade wirklich im Atelier passiert.
 *
 * Eine Datenquelle für zwei Konsumenten: die „Aus dem Atelier"-
 * Sektion auf der Homepage und die /jetzt-Seite (Now-Page).
 *
 * Pflege-Regeln (gelten unverändert):
 *   - jeden Eintrag mit dem, was wirklich diese/letzte Woche
 *     im Atelier passiert ist
 *   - Branche + Stadtteil ok, Klar-Namen nur mit Kundenfreigabe
 *   - bei lange keiner Aktivität: auf zwei ehrliche Einträge
 *     reduzieren — lieber knapp als erfunden
 *   - mindestens 2 Einträge, sonst wirkt die Liste einsam
 */

export type AtelierNote = {
  /** Relative Zeit-Anker, z. B. „Diese Woche", „Mittwoch", „KW 20". */
  when: string;
  /** Ein-Satz-Beschreibung der Tätigkeit. Anonymisiert (Branche +
   *  Stadtteil, kein Name). Möglichst konkret, was wirklich gemacht
   *  wurde. */
  text: string;
};

export const ATELIER_NOTES: AtelierNote[] = [
  {
    when: "Diese Woche",
    text: "Pflegedienst aus Wandsbek — Bewerbungsformular und Team-Bereich aufgebaut.",
  },
  {
    when: "Letzte Woche",
    text: "Café in Eppendorf — Speisekarte selbst pflegbar übergeben.",
  },
  {
    when: "Vor zwei Wochen",
    text: "Friseur Eimsbüttel — Online-Termin-Buchung live geschaltet.",
  },
  {
    when: "Diesen Monat",
    text: "Drei Erstgespräche aus Hamburg-Nord, zwei laufen weiter.",
  },
];

/**
 * Was wir gerade lernen/lesen/ausprobieren — der persönlichere
 * Teil der Now-Page. Gleiche Ehrlichkeits-Regel: nur eintragen,
 * was wirklich auf dem Schreibtisch liegt.
 */
export const ATELIER_GERADE: { label: string; text: string }[] = [
  {
    label: "Auf dem Schreibtisch",
    text: "Die View-Transitions-API für sanftere Seitenwechsel — vorsichtig, weil sie mit unseren Reveal-Animationen kollidieren kann.",
  },
  {
    label: "Gerade gelernt",
    text: "Wie Google-Business-Profile von Pflegediensten in Hamburg tatsächlich gepflegt sind — Stichprobe von vierzig Einträgen, zwei von fünf faktisch unsichtbar. Daraus wurde ein Journal-Essay.",
  },
  {
    label: "Im Ohr",
    text: "Beim Bauen meistens Stille oder NDR Info — Hamburg-Klischee, stimmt aber.",
  },
];
