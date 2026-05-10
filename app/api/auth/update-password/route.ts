import { NextResponse } from "next/server";

import { updatePasswordSchema } from "@/lib/validations/auth";
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

  const parsed = updatePasswordSchema.safeParse(body);
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Sitzung abgelaufen. Bitte fordere einen neuen Reset-Link an.",
        },
        { status: 401 },
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("[api/auth/update-password] thrown", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error
            ? `Aktualisierung fehlgeschlagen: ${err.message}`
            : "Aktualisierung gerade nicht möglich.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, redirect: "/dashboard" });
}
