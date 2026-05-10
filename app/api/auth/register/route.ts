import { NextResponse } from "next/server";

import { registerSchema } from "@/lib/validations/auth";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Ungültige Anfrage." },
      { status: 400 },
    );
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Bitte prüfe deine Angaben.", fieldErrors },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.full_name },
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      console.error("[api/auth/register] supabase error", {
        code: (error as { code?: string }).code,
        status: (error as { status?: number }).status,
        message: error.message,
      });
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("[api/auth/register] thrown", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error
            ? `Fehler bei der Registrierung: ${err.message}`
            : "Konto-Erstellung gerade nicht möglich. Bitte später erneut versuchen.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Konto erstellt. Bitte bestätige deine E-Mail über den Link, den wir dir geschickt haben.",
  });
}
