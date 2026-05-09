import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { WebsiteRow } from "@/types/website";

/**
 * Resolve the current authenticated user, or redirect to /login.
 *
 * Defensive: if `supabase.auth.getUser()` throws (network blip, malformed
 * cookie, broken env), we log it and treat the user as anonymous instead
 * of bubbling the throw into the global error boundary. This is the
 * difference between users seeing a white "Da ist etwas schiefgelaufen"
 * page and a clean redirect back to /login.
 */
export async function requireUser() {
  const supabase = await createClient();

  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] =
    null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error("[requireUser] getUser threw", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    redirect("/login?error=session");
  }

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

  let data: { user_id: string } | null = null;
  let error: { message: string } | null = null;
  try {
    const result = await supabase
      .from("admin_roles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    data = result.data as { user_id: string } | null;
    error = result.error;
  } catch (err) {
    console.error("[requireAdmin] admin_roles query threw", {
      message: err instanceof Error ? err.message : String(err),
    });
    redirect("/dashboard");
  }

  if (error || !data) redirect("/dashboard");
  return { supabase, user };
}

/**
 * Fetches the current user's primary website (oldest one), or null.
 * The MVP UI assumes one user → one website, but the data model allows N.
 *
 * Defensive: if the websites query throws we log and return null so the
 * dashboard shows the onboarding form instead of crashing.
 */
export async function getCurrentWebsite() {
  const { supabase, user } = await requireUser();

  let website: WebsiteRow | null = null;
  try {
    const { data } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    website = (data as WebsiteRow | null) ?? null;
  } catch (err) {
    console.error("[getCurrentWebsite] websites query threw", {
      message: err instanceof Error ? err.message : String(err),
      user_id: user.id,
    });
    website = null;
  }

  return { supabase, user, website };
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
