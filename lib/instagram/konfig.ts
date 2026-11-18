import "server-only";

/*
 * Einstellungen fürs Posten auf Instagram, alle aus den
 * Umgebungsvariablen (nur auf dem Server, nie im Code oder im Browser).
 *
 *   INSTAGRAM_TOKEN        Pflicht. Zugangsschlüssel eines Systemnutzers
 *                          aus dem Meta Business Manager (läuft nicht ab).
 *                          Ohne ihn ist Instagram „nicht verbunden“.
 *   INSTAGRAM_KONTO_ID     Optional: Kennung des Instagram-Business-Kontos.
 *                          Ohne sie sucht der Server das Konto über die
 *                          Facebook-Seiten des Schlüssels (me/accounts).
 *   INSTAGRAM_API_VERSION  Optional: Version der Graph API (Standard unten).
 *   INSTAGRAM_GRAPH_URL    NUR FÜR TESTS: andere Adresse statt
 *                          graph.facebook.com (lokale Attrappe). Gilt
 *                          nicht im Produktivbetrieb (NODE_ENV production),
 *                          damit der Schlüssel nie an eine andere Adresse
 *                          geht.
 *
 * Nur dieses Modul liest INSTAGRAM_TOKEN (geprüft in
 * tests/instagram-posten.test.ts). Der Schlüssel wird nie geloggt.
 */

/** Graph-API-Version, wenn nichts eingestellt ist. */
export const STANDARD_VERSION = "v26.0";

/** Adresse der Graph API (Instagram über Facebook Login, Business-Konto). */
export const GRAPH_STANDARD = "https://graph.facebook.com";

export type InstagramKonfig = {
  /** Geheimer Zugangsschlüssel; nur für den Authorization-Header. */
  token: string;
  /** Kennung des Instagram-Kontos aus INSTAGRAM_KONTO_ID, sonst null. */
  kontoId: string | null;
  /** Etwa „v26.0“. */
  version: string;
  /** Ursprung der Graph API ohne Schrägstrich am Ende. */
  basis: string;
};

/** Der Schlüssel, wenn er brauchbar aussieht (kein Leerraum, nicht zu kurz). */
function token(): string | null {
  const roh = process.env.INSTAGRAM_TOKEN?.trim() ?? "";
  return roh.length >= 20 && roh.length <= 2000 && !/\s/.test(roh)
    ? roh
    : null;
}

/**
 * Ob Instagram verbunden ist: Der Zugangsschlüssel steht in den
 * Umgebungsvariablen. Ob er gilt, zeigt erst die Prüfung bei Instagram.
 */
export function instagramBereit(): boolean {
  return token() !== null;
}

/** Kennung des Kontos aus INSTAGRAM_KONTO_ID (nur Ziffern), sonst null. */
export function instagramKontoId(): string | null {
  const roh = process.env.INSTAGRAM_KONTO_ID?.trim() ?? "";
  return /^\d{5,30}$/.test(roh) ? roh : null;
}

/** Version aus INSTAGRAM_API_VERSION (etwa „v26.0“), sonst der Standard. */
export function instagramVersion(): string {
  const roh = process.env.INSTAGRAM_API_VERSION?.trim() ?? "";
  return /^v\d{1,3}\.\d{1,2}$/.test(roh) ? roh : STANDARD_VERSION;
}

/**
 * Ursprung der Graph API. INSTAGRAM_GRAPH_URL gilt nur außerhalb des
 * Produktivbetriebs (Tests und lokale Attrappen).
 */
export function graphBasis(): string {
  const roh = process.env.INSTAGRAM_GRAPH_URL?.trim();
  if (!roh || process.env.NODE_ENV === "production") return GRAPH_STANDARD;
  try {
    const url = new URL(roh);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : GRAPH_STANDARD;
  } catch {
    return GRAPH_STANDARD;
  }
}

/** Alles für einen Aufruf, oder null ohne brauchbaren Schlüssel. */
export function instagramKonfig(): InstagramKonfig | null {
  const t = token();
  if (!t) return null;
  return {
    token: t,
    kontoId: instagramKontoId(),
    version: instagramVersion(),
    basis: graphBasis(),
  };
}
