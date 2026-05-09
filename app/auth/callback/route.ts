import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * GET /auth/callback?code=...&next=/dashboard
 *
 * Used by:
 *  - Email-confirmation links after sign up
 *  - Password reset links (next=/update-password)
 *
 * Exchanges the one-time code for a session cookie, then redirects to `next`.
 * `next` is validated to be a same-origin path to prevent open redirects.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const rawNext = url.searchParams.get("next") ?? "/dashboard";

  // Reject anything that isn't a clean same-origin path.
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", url.origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
