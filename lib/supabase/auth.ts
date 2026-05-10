import { redirect } from "next/navigation";

import { getActiveWebsiteId } from "@/lib/active-website";
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
 * Fetches the user's *active* website (per the active-website cookie),
 * or — when no cookie is set — their oldest website. Multiple websites
 * per user are supported as of the multi-site PR; the SiteSwitcher in
 * the dashboard rotates the cookie via switchActiveWebsiteAction.
 *
 * Defensive: if any query throws we log and fall back gracefully so a
 * stale cookie or a Supabase blip never takes the dashboard down.
 */
export async function getCurrentWebsite() {
  const { supabase, user } = await requireUser();

  let website: WebsiteRow | null = null;

  // 1. Try the cookie-selected website first.
  const activeId = await getActiveWebsiteId();
  if (activeId) {
    try {
      const { data } = await supabase
        .from("websites")
        .select("*")
        .eq("id", activeId)
        .eq("user_id", user.id)
        .maybeSingle();
      website = (data as WebsiteRow | null) ?? null;
    } catch (err) {
      console.error("[getCurrentWebsite] active-id query threw", {
        message: err instanceof Error ? err.message : String(err),
        active_id: activeId,
      });
    }
  }

  // 2. Otherwise (no cookie, or cookie points at a deleted/foreign
  //    site) fall back to the oldest website the user owns.
  if (!website) {
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
      console.error("[getCurrentWebsite] fallback query threw", {
        message: err instanceof Error ? err.message : String(err),
        user_id: user.id,
      });
      website = null;
    }
  }

  return { supabase, user, website };
}

/**
 * Lists every website the current user owns, oldest-first. Used by the
 * SiteSwitcher dropdown in the dashboard sidebar.
 */
export async function listUserWebsites(): Promise<WebsiteRow[]> {
  const { supabase, user } = await requireUser();
  try {
    const { data } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    return (data as WebsiteRow[] | null) ?? [];
  } catch (err) {
    console.error("[listUserWebsites] threw", {
      message: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
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
