import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Custom-domain → Sitalo-site mapping.
 *
 * When a request hits `pflegedienst-mueller.de`, the host header
 * doesn't match our app's primary domain. We look up the host in
 * `websites.custom_domain` and rewrite `/...` → `/site/<slug>/...`
 * so the customer's site renders at the root of their own domain.
 *
 * Auth, dashboard, API and static assets are skipped via the matcher
 * config below — those only ever come in on the primary host.
 *
 * The lookup is per-request which is fine for low traffic. If we
 * outgrow that we'll move the mapping into Vercel Edge Config so the
 * lookup stays a single round-trip from the edge.
 */

// Hostnames that we consider "ours". Custom-domain rewriting only
// applies to other hosts.
const PRIMARY_HOSTS = new Set<string>([
  "sitalo.app",
  "www.sitalo.app",
  "localhost:3000",
  "localhost",
]);

function isPrimaryHost(host: string): boolean {
  if (PRIMARY_HOSTS.has(host)) return true;
  // Vercel preview + production deploys
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  if (!host || isPrimaryHost(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  // If the URL already starts with /site/, this is an internal rewrite
  // we already produced — pass it through unchanged to avoid loops.
  if (url.pathname.startsWith("/site/")) {
    return NextResponse.next();
  }

  // Lookup the website by custom_domain. Read-only with the standard
  // server client — the websites RLS policy allows public reads of
  // active rows.
  const supabase = await createClient();
  const { data } = await supabase
    .from("websites")
    .select("slug, is_active, custom_domain_verified_at")
    .eq("custom_domain", host)
    .maybeSingle();

  if (
    !data ||
    !data.is_active ||
    !data.custom_domain_verified_at
  ) {
    // Domain points at us but isn't verified yet — render a small
    // placeholder so visitors see something useful instead of a 404.
    url.pathname = `/domain-pending`;
    return NextResponse.rewrite(url);
  }

  const slug = data.slug as string;
  // Rewrite "/" → "/site/<slug>", "/imprint" → "/site/<slug>/imprint", etc.
  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/site/${slug}${suffix}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip auth, dashboard, admin, api routes and Next/static assets.
  // The mapping only ever needs to fire for the public site routes.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|admin|dashboard|login|register|forgot-password|update-password|sitemap.xml|robots.txt|.*\\.).*)",
  ],
};
