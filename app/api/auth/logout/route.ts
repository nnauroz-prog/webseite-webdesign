import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[api/auth/logout] thrown", {
      message: err instanceof Error ? err.message : String(err),
    });
  }
  return NextResponse.json({ ok: true, redirect: "/login" });
}
