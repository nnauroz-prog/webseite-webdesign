/**
 * Atelier-Notizen — was gerade wirklich im Atelier passiert.
 *
 * Datenquelle für die /jetzt-Seite. Bewusst ohne festes Stand-Datum:
 * ein Datum, das niemand nachzieht, sieht nach wenigen Wochen veraltet
 * aus.
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
 * Derzeit leer: Die früheren Einträge nannten Kundenprojekte, die sich
 * nicht belegen ließen. Nur eintragen, was wirklich passiert ist und
 * vom Kunden freigegeben wurde. Wird zur Zeit auf keiner Seite gezeigt.
 */
export const ATELIER_NOTES: AtelierNote[] = [];

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
