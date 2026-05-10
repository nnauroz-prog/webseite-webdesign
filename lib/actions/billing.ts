"use server";

import { redirect } from "next/navigation";

import { fail, idleState, type ActionState } from "@/lib/actions/shared";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe/client";
import { getStripePriceId, type PlanId } from "@/lib/stripe/plans";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/auth";


const VALID_PLANS: readonly PlanId[] = ["basic", "pro", "premium"];

function isPlanId(value: unknown): value is PlanId {
  return (
    typeof value === "string" && (VALID_PLANS as readonly string[]).includes(value)
  );
}

/**
 * Resolves the Stripe customer for the current user. If we already created
 * one in a previous checkout, reuse it. Otherwise create a new customer in
 * Stripe and persist the id via the service-role client (RLS blocks writes
 * for the user themselves).
 */
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

  // Cast: same reason as in app/api/stripe/webhook/route.ts — bypass the
  // strict generic, schema correctness is enforced by Postgres at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin.from("subscriptions") as any).upsert(
    { user_id: userId, stripe_customer_id: customer.id },
    { onConflict: "user_id" },
  );

  return customer.id;
}

// ---------------------------------------------------------------------------
//  createCheckoutAction
//  Form action: <form action={createCheckoutAction}><input name="plan" .../>
// ---------------------------------------------------------------------------
export async function createCheckoutAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const plan = formData.get("plan");
  if (!isPlanId(plan)) return fail("Ungültiges Paket.");

  const priceId = getStripePriceId(plan);
  if (!priceId) {
    return fail(
      "Dieses Paket ist gerade nicht buchbar. Bitte versuche es später erneut.",
    );
  }

  const { user } = await requireUser();
  if (!user.email) return fail("Bitte hinterlege zuerst eine E-Mail.");

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

  if (!session.url) return fail("Stripe hat keine Checkout-URL geliefert.");
  redirect(session.url);
}

// ---------------------------------------------------------------------------
//  createPortalAction
//  Sends the customer to the Stripe-hosted Customer Portal where they can
//  update payment method, view invoices, or cancel. Wired up as a plain
//  form action — no input fields needed.
// ---------------------------------------------------------------------------
export async function createPortalAction(): Promise<void> {
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const customerId = (
    data as { stripe_customer_id: string | null } | null
  )?.stripe_customer_id;

  if (!customerId) {
    redirect("/pricing?error=no_subscription");
  }

  const stripe = getStripe();
  const baseUrl = getSiteUrl();
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/dashboard/billing`,
  });

  redirect(portal.url);
}
