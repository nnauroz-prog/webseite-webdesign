import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/**
 * Permissive schema for the service-role client.
 *
 * We deliberately use index signatures rather than the literal-keyed
 * `types/database.ts` shape, because the strict Database constraint in
 * recent @supabase/supabase-js versions has rejected the literal form,
 * collapsing Row/Insert types to `never` and breaking upsert calls at
 * type-check time. Runtime behaviour is unaffected — the service-role
 * client bypasses RLS, schema validation happens in Postgres.
 */
type AnyTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

type AdminDatabase = {
  // Recent @supabase/supabase-js (≥ 2.49) reads this marker to size up the
  // Postgrest version. Including it keeps strict Database constraints happy
  // even when we don't otherwise care about its value.
  __InternalSupabase: { PostgrestVersion: "12" };
  public: {
    Tables: { [name: string]: AnyTable };
    Views: { [name: string]: { Row: Record<string, unknown> } };
    Functions: {
      [name: string]: { Args: Record<string, unknown>; Returns: unknown };
    };
    Enums: { [name: string]: unknown };
    CompositeTypes: { [name: string]: unknown };
  };
};

let cached: SupabaseClient<AdminDatabase> | null = null;

/**
 * Service-role Supabase client. Server-only.
 *
 * Bypasses Row Level Security and is used exclusively from contexts that
 * authenticate by other means (Stripe webhook signature, scheduled jobs).
 *
 * NEVER import this from a Client Component or expose its results to a
 * browser response — it can read/write any row.
 */
export function createAdminClient(): SupabaseClient<AdminDatabase> {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Service role client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  cached = createSupabaseClient<AdminDatabase>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
