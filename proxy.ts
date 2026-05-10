import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

/**
 * Hostnames that this app considers "ours". Custom-domain rewriting
 * only applies to other hosts.
 */
const PRIMARY_HOSTS = new Set<string>([
  "sitalo.app",
  "www.sitalo.app",
  "localhost:3000",
  "localhost",
]);

function isPrimaryHost(host: string): boolean {
  if (PRIMARY_HOSTS.has(host)) return true;
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

/**
 * Look up a custom-domain host in the websites table. Returns the
 * matching slug + verification state, or null. Uses the anon key —
 * the lookup only reads slug + boolean fields and the row is meant
 * to be publicly visible. Failures fall through to "no match" so a
 * Supabase outage never breaks marketing traffic.
 */
async function resolveCustomDomain(host: string): Promise<{
  slug: string;
  verified: boolean;
  active: boolean;
} | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: { getAll: () => [], setAll: () => {} },
    });
    const { data } = await supabase
      .from("websites")
      .select("slug, is_active, custom_domain_verified_at")
      .eq("custom_domain", host)
      .maybeSingle();
    if (!data) return null;
    type Row = {
      slug: string;
      is_active: boolean;
      custom_domain_verified_at: string | null;
    };
    const row = data as Row;
    return {
      slug: row.slug,
      verified: row.custom_domain_verified_at !== null,
      active: row.is_active,
    };
  } catch (err) {
    console.error("[proxy] custom-domain lookup failed", {
      host,
      message: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  // 1) Custom-domain handling. Runs FIRST so non-primary hosts never
  //    pass through the auth-session refresh (those public-site
  //    requests don't have or need our auth cookies).
  if (host && !isPrimaryHost(host)) {
    const url = request.nextUrl.clone();

    // If the URL is already a /site/<slug> path, this is an internal
    // rewrite we already produced — pass through to avoid loops.
    if (url.pathname.startsWith("/site/")) {
      return NextResponse.next();
    }

    const match = await resolveCustomDomain(host);
    if (!match || !match.active || !match.verified) {
      // Domain points at us but isn't verified yet — render the
      // friendly placeholder page instead of a 404.
      url.pathname = "/domain-pending";
      return NextResponse.rewrite(url);
    }

    const suffix = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/site/${match.slug}${suffix}`;
    return NextResponse.rewrite(url);
  }

  // 2) Primary-host requests: keep the existing auth-session refresh.
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public assets with file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
