import { NextResponse } from "next/server";

import { createLemonCheckout } from "@/lib/lemon/client";
import { getLemonVariantId } from "@/lib/lemon/plans";
import { getSiteUrl } from "@/lib/site-url";
import type { PlanId } from "@/lib/stripe/plans";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_PLANS: readonly PlanId[] = ["basic", "pro", "premium"];

function isPlanId(value: unknown): value is PlanId {
  return (
    typeof value === "string" &&
    (VALID_PLANS as readonly string[]).includes(value)
  );
}

/**
 * POST /api/billing/lemon/checkout
 *
 * Creates a Lemon Squeezy checkout session and returns its URL.
 * Mirrors the contract of /api/billing/checkout (Stripe) so the
 * frontend can switch providers via a single env-driven endpoint.
 */
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

  const plan = (body as { plan?: unknown } | null)?.plan;
  if (!isPlanId(plan)) {
    return NextResponse.json(
      { ok: false, message: "Ungültiges Paket." },
      { status: 400 },
    );
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = getLemonVariantId(plan);
  if (!storeId || !variantId) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Dieses Paket ist gerade nicht buchbar. Bitte versuche es später erneut.",
      },
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
          message: "Bitte melde dich zuerst an.",
          redirect: "/login",
        },
        { status: 401 },
      );
    }
    if (!user.email) {
      return NextResponse.json(
        { ok: false, message: "Bitte hinterlege zuerst eine E-Mail." },
        { status: 400 },
      );
    }

    const baseUrl = getSiteUrl();
    const url = await createLemonCheckout({
      storeId,
      variantId,
      email: user.email,
      // Custom data lands on the webhook payload — we use it to map a
      // Lemon subscription back to the right Supabase user.
      customData: { supabase_user_id: user.id, plan },
      redirectUrl: `${baseUrl}/dashboard/billing?checkout=success`,
      receiptLinkUrl: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ ok: true, redirect: url });
  } catch (err) {
    console.error("[api/billing/lemon/checkout] thrown", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error
            ? `Checkout fehlgeschlagen: ${err.message}`
            : "Checkout gerade nicht möglich.",
      },
      { status: 500 },
    );
  }
}
