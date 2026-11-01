/**
 * Erstveröffentlichung und letzte inhaltliche Überarbeitung (ISO) der
 * Ratgeber- und Geldseiten. Eine Quelle für die sichtbare Zeile
 * „zuletzt überarbeitet am …", das Article-Schema, og:modified_time und
 * lastModified in der Sitemap.
 *
 * Bei jeder inhaltlichen Änderung einer Seite `stand` mitziehen. Reine
 * Tippfehler oder Gestaltung zählen nicht als Überarbeitung.
 */
export const SEITEN_STAND = {
  "/webseite-erstellen": { veroeffentlicht: "2026-11-01", stand: "2026-11-01" },
  "/website-kosten": { veroeffentlicht: "2026-10-31", stand: "2026-11-01" },
  "/vergleich": { veroeffentlicht: "2026-06-07", stand: "2026-11-01" },
  "/website-erstellen-lassen": { stand: "2026-11-01" },
} as const satisfies Record<
  string,
  { veroeffentlicht?: string; stand: string }
>;

/**
 * Fester Stand für alle übrigen statischen Seiten in der Sitemap. Ein
 * festes Datum statt „jetzt", damit Google lastmod nicht als Rauschen
 * lernt. Beim nächsten größeren Umbau einer Seite eintragen, wann.
 */
export const STAND_UEBRIGE_SEITEN = "2026-11-01";
