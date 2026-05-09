import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { WebsiteRow } from "@/types/website";

/**
 * Resolve the current authenticated user, or redirect to /login.
 * Use inside Server Components that require authentication.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, user };
}

/**
 * Resolve the current admin user, or redirect.
 *  - no session -> /login
 *  - logged in but not an admin -> /dashboard
 *
 * Authoritative source is the `admin_roles` table (RLS-readable only by
 * admins themselves), so we trust that the row exists iff the user is admin.
 */
export async function requireAdmin() {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("admin_roles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) redirect("/dashboard");
  return { supabase, user };
}

/**
 * Fetches the current user's primary website (oldest one), or null.
 * The MVP UI assumes one user → one website, but the data model allows N.
 */
export async function getCurrentWebsite() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    supabase,
    user,
    website: (data as WebsiteRow | null) ?? null,
  };
}

/**
 * Like getCurrentWebsite but redirects to /dashboard if no website exists,
 * because the user has not finished onboarding yet.
 */
export async function requireCurrentWebsite() {
  const ctx = await getCurrentWebsite();
  if (!ctx.website) redirect("/dashboard");
  return ctx as {
    supabase: typeof ctx.supabase;
    user: typeof ctx.user;
    website: WebsiteRow;
  };
}
