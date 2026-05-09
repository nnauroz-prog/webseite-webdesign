import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const AUTH_ONLY_PREFIXES = ["/login", "/register"];

/**
 * Refreshes the Supabase auth session on every request and forwards
 * any updated auth cookies to both the request and the outgoing response.
 *
 * Also handles UX-level redirects:
 *  - Unauthenticated users hitting /dashboard or /admin → /login
 *  - Authenticated users hitting /login or /register → /dashboard
 *
 * Important: This is UX only. RLS policies and per-layout server-side
 * checks (requireUser / requireAdmin) are the actual security boundary.
 *
 * Do not run any logic between createServerClient() and getUser() — the
 * Supabase SSR helper relies on that ordering for cookie rotation.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );

  // Auth lookup is best-effort: if Supabase is unreachable or env vars are
  // misconfigured we treat the user as anonymous instead of 500-ing every
  // request. Layout-level requireUser() / requireAdmin() guards still apply.
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] =
    null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;

  if (!user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user && AUTH_ONLY_PREFIXES.some((p) => pathname === p)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
