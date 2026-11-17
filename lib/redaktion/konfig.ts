import "server-only";

/**
 * Ob die Redaktion im Story-Studio arbeiten kann: Sie braucht den
 * API-Schlüssel in den Umgebungsvariablen (nur auf dem Server, nie im
 * Code oder im Browser). Einrichtung: docs/vercel-einrichtung.md.
 */
export function redaktionBereit(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
