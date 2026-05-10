import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/portal
 *
 * Creates a Stripe Customer Portal session and returns its URL.
 * Replaces the prior `createPortalAction` server action.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Bitte melde dich zuerst an.", redirect: "/login" },
        { status: 401 },
      );
    }

    const { data } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const customerId = (
      data as { stripe_customer_id: string | null } | null
    )?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json(
        {
          ok: false,
          message: "Du hast noch kein aktives Abo. Wähle zuerst ein Paket.",
          redirect: "/pricing?error=no_subscription",
        },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const baseUrl = getSiteUrl();
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard/billing`,
    });

    return NextResponse.json({ ok: true, redirect: portal.url });
  } catch (err) {
    console.error("[api/billing/portal] thrown", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error
            ? `Portal nicht verfügbar: ${err.message}`
            : "Portal gerade nicht verfügbar.",
      },
      { status: 500 },
    );
  }
}
