import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Untyped on purpose until
 * `npx supabase gen types` runs and we replace types/database.ts.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
