import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe/client";
import { getStripePriceId, type PlanId } from "@/lib/stripe/plans";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_PLANS: readonly PlanId[] = ["basic", "pro", "premium"];

function isPlanId(value: unknown): value is PlanId {
  return (
    typeof value === "string" &&
    (VALID_PLANS as readonly string[]).includes(value)
  );
}

async function resolveStripeCustomerId(
  userId: string,
  email: string,
): Promise<string> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  const cached = (existing as { stripe_customer_id: string | null } | null)
    ?.stripe_customer_id;
  if (cached) return cached;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("subscriptions") as any).upsert(
    { user_id: userId, stripe_customer_id: customer.id },
    { onConflict: "user_id" },
  );

  return customer.id;
}

/**
 * POST /api/billing/checkout
 *
 * Creates a Stripe Checkout Session and returns its URL.
 * Replaces the prior `createCheckoutAction` server action.
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

  const priceId = getStripePriceId(plan);
  if (!priceId) {
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
        { ok: false, message: "Bitte melde dich zuerst an.", redirect: "/login" },
        { status: 401 },
      );
    }
    if (!user.email) {
      return NextResponse.json(
        { ok: false, message: "Bitte hinterlege zuerst eine E-Mail." },
        { status: 400 },
      );
    }

    const customerId = await resolveStripeCustomerId(user.id, user.email);
    const baseUrl = getSiteUrl();
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${baseUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
      metadata: { supabase_user_id: user.id, plan },
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, message: "Stripe hat keine Checkout-URL geliefert." },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, redirect: session.url });
  } catch (err) {
    console.error("[api/billing/checkout] thrown", {
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
