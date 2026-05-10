import { NextResponse } from "next/server";

import { forgotPasswordSchema } from "@/lib/validations/auth";
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

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Bitte prüfe deine E-Mail-Adresse.", fieldErrors },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    // Don't leak whether the email exists — always return success.
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/update-password`,
    });
  } catch (err) {
    console.error("[api/auth/forgot-password] thrown", {
      message: err instanceof Error ? err.message : String(err),
    });
    // Still respond with success to avoid enumeration / DOS attempts.
  }

  return NextResponse.json({
    ok: true,
    message:
      "Wenn ein Konto mit dieser E-Mail existiert, haben wir einen Link zum Zurücksetzen gesendet.",
  });
}
