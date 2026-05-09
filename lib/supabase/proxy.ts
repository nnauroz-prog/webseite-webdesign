import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const AUTH_ONLY_PREFIXES = ["/login", "/register"];

/**
 * Refreshes the Supabase auth session on every request and forwards
 * any updated auth cookies to both the request and the outgoing response.
 *
 * Bulletproof: if env vars are missing or Supabase is unreachable, we
 * degrade to "anonymous" instead of throwing — that way users still see
 * a usable page (with a sensible error message) instead of the global
 * error boundary. Underlying issues are logged to console so they show
 * up in Vercel Runtime Logs.
 *
 * Important: this is UX only. RLS policies and per-layout server-side
 * checks (requireUser / requireAdmin) are the actual security boundary.
 *
 * Do not run any logic between createServerClient() and getUser() — the
 * Supabase SSR helper relies on that ordering for cookie rotation.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No env vars → treat user as anonymous, but never crash the request.
  if (!url || !anonKey) {
    console.error(
      "[proxy] missing supabase env",
      JSON.stringify({
        has_url: Boolean(url),
        has_anon_key: Boolean(anonKey),
        pathname,
      }),
    );
    if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  let isAuthenticated = false;
  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    try {
      const { data } = await supabase.auth.getUser();
      isAuthenticated = data.user !== null;
    } catch (err) {
      console.error("[proxy] getUser failed", {
        message: err instanceof Error ? err.message : String(err),
        pathname,
      });
    }
  } catch (err) {
    console.error("[proxy] supabase client init failed", {
      name: err instanceof Error ? err.name : "unknown",
      message: err instanceof Error ? err.message : String(err),
      pathname,
    });
    // Fall through with isAuthenticated=false — request still served.
  }

  if (!isAuthenticated && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && AUTH_ONLY_PREFIXES.some((p) => pathname === p)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
