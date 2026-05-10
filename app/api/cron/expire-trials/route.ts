import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Daily cron — flips expired trial subscriptions from `trialing` to
 * `past_due`. The existing `subscriptions_sync_websites` DB trigger
 * then takes the related websites offline (is_active = false).
 *
 * Vercel Cron auth: every cron invocation carries
 *   Authorization: Bearer <CRON_SECRET>
 * via vercel.json. We refuse anything else so this endpoint can be
 * safely public.
 *
 * Idempotent: re-running the same day flips zero additional rows.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const admin = createAdminClient();
    const nowIso = new Date().toISOString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (admin.from("subscriptions") as any)
      .update({ status: "past_due" })
      .eq("status", "trialing")
      .lt("current_period_end", nowIso)
      .select("user_id");

    if (error) {
      console.error("[cron/expire-trials] update failed", {
        message: error.message,
      });
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      );
    }

    const expired = (data as { user_id: string }[] | null)?.length ?? 0;
    return NextResponse.json({ ok: true, expired });
  } catch (err) {
    console.error("[cron/expire-trials] thrown", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, message: "Internal error." },
      { status: 500 },
    );
  }
}
