import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Uses async cookies() per Next.js 16 requirements.
 *
 * Logs to console.error if the env vars are missing/empty so issues show
 * up in Vercel Runtime Logs instead of crashing pages with the global
 * error boundary.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error(
      "[supabase/server] missing env",
      JSON.stringify({
        has_url: Boolean(url),
        has_anon_key: Boolean(anonKey),
        url_length: url?.length ?? 0,
      }),
    );
    throw new Error(
      "Supabase ist nicht konfiguriert (NEXT_PUBLIC_SUPABASE_URL oder NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt im Server-Env).",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll was called from a Server Component — safe to ignore,
          // session refresh is handled by proxy.ts on the next request.
        }
      },
    },
  });
}
