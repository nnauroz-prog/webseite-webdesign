import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

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
