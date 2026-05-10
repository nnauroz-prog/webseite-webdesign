import { NextResponse } from "next/server";

import { loginSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/login
 *
 * Replaces the server action that kept tripping Next 16 / Turbopack's
 * "use server" validator. Plain JSON-in / JSON-out endpoint that the
 * login form posts to via fetch.
 */
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

  const parsed = loginSchema.safeParse(body);
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
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (error) {
      const status = (error as { status?: number }).status;
      const code = (error as { code?: string }).code;
      console.error("[api/auth/login] supabase error", {
        code,
        status,
        message: error.message,
      });
      const isAuthFailure = status === 400 || code === "invalid_credentials";
      return NextResponse.json(
        {
          ok: false,
          message: isAuthFailure
            ? "E-Mail oder Passwort ist falsch."
            : `Login fehlgeschlagen: ${error.message}`,
        },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("[api/auth/login] thrown", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error
            ? `Login fehlgeschlagen: ${err.message}`
            : "Login gerade nicht möglich. Bitte später erneut versuchen.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, redirect: "/dashboard" });
}
