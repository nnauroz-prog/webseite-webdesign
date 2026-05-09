import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Uses async cookies() per Next.js 16 requirements.
 *
 * If the env vars are missing we still return a client (with empty
 * placeholders) and log to console. The actual network call will fail
 * later — but the build itself doesn't crash, which is important for
 * Preview deployments that may not have all env vars wired up.
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
  }

  const cookieStore = await cookies();

  return createServerClient(url ?? "", anonKey ?? "", {
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
