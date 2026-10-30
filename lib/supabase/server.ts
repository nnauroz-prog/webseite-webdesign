import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Supabase-Client für Server Components und Server Actions, mit der
 * Login-Sitzung aus den Cookies. Pro Request neu erzeugen, nie teilen.
 *
 * In Server Components dürfen keine Cookies gesetzt werden — dort
 * schluckt setAll den Fehler. Das Erneuern der Sitzung übernimmt
 * proxy.ts, bevor die Seite rendert.
 */
export async function sessionClient() {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) return null;
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Aufruf aus einer Server Component — proxy.ts erneuert die Sitzung.
        }
      },
    },
  });
}
