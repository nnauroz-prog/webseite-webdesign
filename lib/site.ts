/**
 * Kanonische Site-URL — einzige Stelle, an der der Fallback und
 * die Normalisierung (trim + trailing slash) definiert sind.
 * Vorher lag dieselbe Zeile in sechs Dateien; eine Domain-Änderung
 * musste sechsmal nachgezogen werden.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://www.sitalo.de";
