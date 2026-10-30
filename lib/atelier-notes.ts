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
  /** Absoluter Zeit-Anker, z. B. „Mitte Juni", „Ende Mai". Keine
   *  relativen Angaben wie „Diese Woche" — die Seiten sind statisch
   *  und würden sonst Monate später noch „diese Woche" behaupten. */
  when: string;
  /** Ein-Satz-Beschreibung der Tätigkeit. Anonymisiert (Branche +
   *  Stadtteil, kein Name). Möglichst konkret, was wirklich gemacht
   *  wurde. */
  text: string;
};

/**
 * Wann die Notizen zuletzt gepflegt wurden (yyyy-mm-dd). Die
 * Überschriften auf Homepage und /jetzt zeigen dieses Datum statt
 * des aktuellen Monats — beim Aktualisieren der Notizen mitziehen.
 */
export const ATELIER_STAND = "2026-06-14";

export const ATELIER_NOTES: AtelierNote[] = [
  {
    when: "Mitte Juni",
    text: "Pflegedienst aus Wandsbek — Bewerbungsformular und Team-Bereich aufgebaut.",
  },
  {
    when: "Anfang Juni",
    text: "Café in Eppendorf — Speisekarte selbst pflegbar übergeben.",
  },
  {
    when: "Ende Mai",
    text: "Friseur Eimsbüttel — Online-Termin-Buchung live geschaltet.",
  },
  {
    when: "Im Juni",
    text: "Drei Erstgespräche aus Hamburg-Nord, zwei laufen weiter.",
  },
];

/** „Juni 2026" — Monat des Notizen-Stands. */
export function atelierStandMonth(): string {
  return new Date(`${ATELIER_STAND}T12:00:00Z`).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}

/** „14. Juni 2026" — voller Notizen-Stand. */
export function atelierStandDate(): string {
  return new Date(`${ATELIER_STAND}T12:00:00Z`).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}

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
