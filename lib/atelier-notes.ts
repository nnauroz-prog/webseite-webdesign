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
 *   - bei lange keiner Aktivität: lieber leer als erfunden
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

/**
 * Derzeit leer: Die früheren Einträge nannten Kundenprojekte, die sich
 * nicht belegen ließen. Nur eintragen, was wirklich passiert ist und
 * vom Kunden freigegeben wurde. Wird zur Zeit auf keiner Seite gezeigt.
 */
export const ATELIER_NOTES: AtelierNote[] = [];

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
 * Teil der Now-Page. Gleiche Regel: nur eintragen,
 * was wirklich auf dem Schreibtisch liegt.
 */
export const ATELIER_GERADE: { label: string; text: string }[] = [
  {
    label: "Auf dem Schreibtisch",
    text: "Weichere Übergänge beim Wechsel zwischen zwei Seiten. Wir testen das vorsichtig, weil es sich mit Bewegungen beim Scrollen beißen kann.",
  },
  {
    label: "Im Ohr",
    text: "Beim Bauen meistens Stille, manchmal NDR Info.",
  },
];
