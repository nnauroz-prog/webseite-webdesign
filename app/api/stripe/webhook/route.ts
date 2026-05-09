import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe/client";
import { planIdFromPriceId } from "@/lib/stripe/plans";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook endpoint.
 *
 *   POST /api/stripe/webhook
 *   Header:  Stripe-Signature: t=...,v1=...
 *
 * Stripe signs the raw request body with STRIPE_WEBHOOK_SECRET; we verify
 * the signature, then mirror subscription state into our `subscriptions`
 * table. The DB trigger `subscriptions_sync_websites` flips
 * `websites.is_active` to false whenever the status leaves the
 * access-granting set ('active', 'trialing'), so the public site goes
 * offline within seconds of a failed payment or cancellation.
 *
 * IMPORTANT: this route MUST stay on the Node.js runtime. Edge would have
 * to verify the signature using the WebCrypto async API, and we'd need a
 * different Stripe SDK path. Node + the SDK's built-in verifier is simpler.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe-Signature header.", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook is not configured.", { status: 500 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return new Response(`Signature verification failed: ${message}`, {
      status: 400,
    });
  }

  try {
    await handleEvent(stripe, event);
  } catch (err) {
    console.error("[stripe webhook] handler failed", event.type, err);
    // 500 → Stripe will retry with exponential backoff.
    return new Response("Webhook handler error.", { status: 500 });
  }

  return new Response(null, { status: 204 });
}

async function handleEvent(stripe: Stripe, event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") return;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      if (!subscriptionId) return;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await upsertSubscription(subscription);
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscription(subscription);
      return;
    }

    // We don't write directly on payment events — Stripe always emits a
    // matching customer.subscription.updated for status transitions, and
    // that's the row we care about. Listening here keeps event volume
    // visible in logs without duplicating writes.
    case "invoice.payment_failed":
    case "invoice.payment_succeeded":
      return;

    default:
      return;
  }
}

/**
 * Reflects the given Stripe subscription into our `subscriptions` table.
 * The user is identified via the `supabase_user_id` metadata we attach
 * when creating the checkout session.
 */
async function upsertSubscription(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) {
    console.warn(
      "[stripe webhook] subscription without supabase_user_id metadata",
      subscription.id,
    );
    return;
  }

  const item = subscription.items.data[0];
  const priceId = item?.price.id ?? null;
  const plan = planIdFromPriceId(priceId);

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  // current_period_end is a Unix timestamp on the subscription item in the
  // current API; keep a fallback to the legacy top-level field so we work
  // across SDK minor versions.
  const periodEndUnix =
    item?.current_period_end ??
    (subscription as unknown as { current_period_end?: number })
      .current_period_end ??
    null;

  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      plan,
      status: subscription.status,
      current_period_end: periodEndUnix
        ? new Date(periodEndUnix * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}
