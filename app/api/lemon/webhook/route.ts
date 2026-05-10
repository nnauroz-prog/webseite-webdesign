import {
  type LemonSubscriptionEvent,
  verifyLemonSignature,
} from "@/lib/lemon/webhook";
import {
  isLemonActiveStatus,
  planIdFromLemonVariantId,
} from "@/lib/lemon/plans";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Lemon Squeezy webhook endpoint.
 *
 *   POST /api/lemon/webhook
 *   Header:  X-Signature: <hex hmac sha256 of body using the webhook secret>
 *
 * Mirrors subscription state into our `subscriptions` table. The same
 * DB trigger that gates websites.is_active on Stripe status also fires
 * for Lemon rows, so a cancelled/expired Lemon subscription takes the
 * customer's site offline automatically.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook is not configured.", { status: 500 });
  }

  const signature = request.headers.get("x-signature");
  const rawBody = await request.text();

  if (!verifyLemonSignature(rawBody, signature, secret)) {
    return new Response("Signature verification failed.", { status: 400 });
  }

  let event: LemonSubscriptionEvent;
  try {
    event = JSON.parse(rawBody) as LemonSubscriptionEvent;
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error("[lemon webhook] handler failed", event.meta.event_name, err);
    return new Response("Webhook handler error.", { status: 500 });
  }

  return new Response(null, { status: 204 });
}

async function handleEvent(event: LemonSubscriptionEvent): Promise<void> {
  const eventName = event.meta.event_name;

  // Only subscription events shape our DB. Order/refund events are ignored
  // for now — they don't gate access to the product.
  if (!eventName.startsWith("subscription_")) return;

  const userId = event.meta.custom_data?.supabase_user_id;
  if (!userId) {
    console.warn(
      "[lemon webhook] subscription event without supabase_user_id",
      eventName,
      event.data.id,
    );
    return;
  }

  const attrs = event.data.attributes;
  const variantId = String(attrs.variant_id);
  const customerId = String(attrs.customer_id);
  const subscriptionId = event.data.id;

  // Lemon's `status` enum: on_trial, active, paused, past_due, unpaid,
  // cancelled, expired. We translate "is currently entitled" via
  // isLemonActiveStatus() — paused/past_due/etc. drop access.
  const status = isLemonActiveStatus(attrs.status) ? "active" : attrs.status;

  const plan = planIdFromLemonVariantId(variantId);
  const periodEnd = attrs.renews_at ?? attrs.ends_at;

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from("subscriptions") as any).upsert(
    {
      user_id: userId,
      provider: "lemon",
      lemon_customer_id: customerId,
      lemon_subscription_id: subscriptionId,
      lemon_variant_id: variantId,
      plan,
      status,
      current_period_end: periodEnd,
      cancel_at_period_end: attrs.cancelled,
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}
