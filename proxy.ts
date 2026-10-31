import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { parseNext } from "@/lib/admin/validate";
import { normalizeSupabaseUrl } from "@/lib/supabase/env";

/**
 * Erneuert die Supabase-Login-Sitzung für den Admin-Bereich, bevor
 * die Seite rendert. Supabase rotiert das Refresh-Token bei jeder
 * Erneuerung; Server Components dürfen keine Cookies setzen — ohne
 * diesen Schritt ginge das neue Token verloren und man flöge nach
 * etwa einer Stunde raus.
 *
 * Ohne Sitzung leitet er sofort auf /admin/login um. Der eigentliche
 * Zugangsschutz (gültiger Nutzer UND auf ADMIN_EMAILS) bleibt
 * requireAdmin() in jeder Admin-Seite und Server Action
 * (lib/admin/auth.ts).
 */
export async function proxy(request: NextRequest) {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Antworten mit Sitzungs-Cookies dürfen nicht im CDN landen.
        for (const [k, v] of Object.entries(headers)) {
          response.headers.set(k, v);
        }
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  // Optimistischer Check: ohne Sitzung gar nicht erst rendern, sondern
  // per echtem 307 zum Login. (Ein redirect() in der Seite käme wegen
  // app/loading.tsx erst gestreamt mit HTTP 200.) Ob die Sitzung auch
  // zu einem Admin gehört, prüft weiterhin requireAdmin().
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  if (!data?.claims && !isLogin) {
    const login = new URL("/admin/login", request.url);
    // Direktlink aus der Benachrichtigungs-Mail: nach dem Login zurück
    // zur Anfrage. Nur /admin und /admin/anfragen/<uuid> (ohne Query),
    // login() prüft das Ziel noch einmal mit parseNext.
    if (parseNext(pathname)) login.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(login);
    for (const c of response.cookies.getAll()) redirect.cookies.set(c);
    return redirect;
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
