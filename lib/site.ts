/**
 * Kanonische Site-URL — einzige Stelle, an der der Fallback und
 * die Normalisierung (trim + trailing slash) definiert sind.
 * Vorher lag dieselbe Zeile in sechs Dateien; eine Domain-Änderung
 * musste sechsmal nachgezogen werden.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://www.sitalo.de";

/** Telefon für Kundentexte (Antwort-Vorlagen im Admin). */
export const CONTACT_PHONE_DISPLAY = "+49 160 7621876";

/** Kontakt-Adresse für Kundentexte. */
export const CONTACT_EMAIL = "info@sitalo.de";
