/**
 * Ruft eine Server Action aus einem Ein-Tipp-Knopf auf.
 *
 * Bei schwachem Netz (U-Bahn, Keller) wirft der Aufruf („Failed to
 * fetch“). Ohne Abfangen landet das in app/admin/error.tsx und ersetzt
 * die ganze Seite, ein Entwurf wäre weg. Hier wird daraus eine normale
 * Fehlermeldung, die im selben Streifen mit „Nochmal“ erscheint.
 */

import { kickRender } from "@/app/admin/render-kick";

export const OFFLINE_ERROR = "Keine Verbindung. Nicht gespeichert.";

export type Failure = { ok: false; error: string };

export async function runAction<T extends { ok: boolean }>(
  fn: () => Promise<T>,
): Promise<T | Failure> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { ok: false, error: OFFLINE_ERROR };
  }
  try {
    return await fn();
  } catch (err) {
    // Abgelaufene Sitzung: requireAdmin leitet zum Login um, der Router
    // navigiert bereits; hier nur passend benennen.
    if (isRedirect(err)) return { ok: false, error: SESSION_ERROR };
    return { ok: false, error: OFFLINE_ERROR };
  } finally {
    // Die Antwort der Action bringt die neuen Seitendaten mit; falls
    // React beim Übernehmen hängen bleibt, anstoßen (siehe render-kick).
    kickRender();
  }
}

export const SESSION_ERROR = "Bitte neu anmelden.";

export function isRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

/** Fehlertext aus einem Ergebnis von runAction (oder null). */
export function errorOf(result: { ok: boolean } & { error?: string }): string | null {
  return result.ok ? null : (result.error ?? OFFLINE_ERROR);
}
