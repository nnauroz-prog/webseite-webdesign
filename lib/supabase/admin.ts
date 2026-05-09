import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Service-role Supabase client. Server-only.
 *
 * Bypasses Row Level Security and is used exclusively from contexts that
 * authenticate by other means (Stripe webhook signature, scheduled jobs).
 *
 * NEVER import this from a Client Component or expose its results to a
 * browser response — it can read/write any row.
 */
export function createAdminClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Service role client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  cached = createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
