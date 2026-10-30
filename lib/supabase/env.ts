/**
 * Supabase-Konfiguration aus den Umgebungsvariablen.
 *
 * NEXT_PUBLIC_SUPABASE_URL        Projekt-URL (Settings → API)
 * NEXT_PUBLIC_SUPABASE_ANON_KEY   öffentlicher Schlüssel (anon / publishable)
 * SUPABASE_SERVICE_ROLE_KEY       geheimer Schlüssel — nur Server, nie im Browser
 * ADMIN_EMAILS                    kommagetrennt, wer den Admin-Bereich sehen darf
 */

export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || undefined;
}

export function supabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || undefined;
}

export function supabaseServiceKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined;
}

/** Login + Admin-Bereich funktionieren nur, wenn alles gesetzt ist. */
export function adminConfigured(): boolean {
  return Boolean(
    supabaseUrl() && supabaseAnonKey() && supabaseServiceKey() && adminEmails().length,
  );
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
