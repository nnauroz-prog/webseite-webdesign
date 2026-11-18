import "server-only";

/*
 * Einstellungen der Redaktion im Story-Studio, alle aus den
 * Umgebungsvariablen (nur auf dem Server, nie im Code oder im Browser).
 * Einrichtung: docs/vercel-einrichtung.md.
 *
 *   ANTHROPIC_API_KEY  Pflicht. Ohne ihn arbeitet die Redaktion nicht.
 *   STUDIO_MODELL      Optional: Kennung des Modells (Standard unten).
 *   STUDIO_TAGESLIMIT  Optional: Aufträge je Tag (Standard unten).
 */

/** Modell, mit dem die Redaktion schreibt, wenn nichts eingestellt ist. */
export const STANDARD_MODELL = "claude-opus-5-5";

/**
 * Springt ein, wenn es das eingestellte Modell für den Schlüssel nicht
 * gibt oder wenn es einen Auftrag ablehnt.
 */
export const ERSATZ_MODELL = "claude-opus-4-7";

/** Aufträge je Kalendertag in Hamburg, wenn nichts eingestellt ist. */
export const TAGESLIMIT_STANDARD = 40;

/**
 * Ob die Redaktion im Story-Studio arbeiten kann: Sie braucht den
 * API-Schlüssel in den Umgebungsvariablen (nur auf dem Server, nie im
 * Code oder im Browser). Einrichtung: docs/vercel-einrichtung.md.
 */
export function redaktionBereit(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Kennung des Modells aus STUDIO_MODELL, sonst der Standard. */
export function studioModell(): string {
  const roh = process.env.STUDIO_MODELL?.trim();
  return roh && /^[a-z0-9][a-z0-9.:@-]{2,80}$/i.test(roh)
    ? roh
    : STANDARD_MODELL;
}

/** Haupt- und Ersatzmodell für einen Auftrag. */
export function studioModelle(): { haupt: string; ersatz: string | null } {
  const haupt = studioModell();
  return { haupt, ersatz: haupt === ERSATZ_MODELL ? null : ERSATZ_MODELL };
}

/**
 * Aufträge je Kalendertag aus STUDIO_TAGESLIMIT (0 bis 1000; 0 hält die
 * Redaktion an), sonst der Standard.
 */
export function studioTageslimit(): number {
  const roh = process.env.STUDIO_TAGESLIMIT?.trim() ?? "";
  if (!/^\d{1,4}$/.test(roh)) return TAGESLIMIT_STANDARD;
  const n = Number(roh);
  return n <= 1000 ? n : TAGESLIMIT_STANDARD;
}
