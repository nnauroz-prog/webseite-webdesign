import type { PlanId } from "@/lib/stripe/plans";

/**
 * Lemon Squeezy variant catalog. Plan slugs are the same as for Stripe
 * (basic / pro / premium). Variant IDs are configured in the operator's
 * Lemon dashboard and wired in via env vars.
 *
 * Returns undefined when the env var is missing — the checkout endpoint
 * will then refuse with a friendly "not buyable right now" message.
 */
export function getLemonVariantId(id: PlanId): string | undefined {
  switch (id) {
    case "basic":
      return process.env.LEMONSQUEEZY_VARIANT_BASIC;
    case "pro":
      return process.env.LEMONSQUEEZY_VARIANT_PRO;
    case "premium":
      return process.env.LEMONSQUEEZY_VARIANT_PREMIUM;
  }
}

/** Reverse lookup for webhook events: variant ID → our plan slug. */
export function planIdFromLemonVariantId(
  variantId: string | null,
): PlanId | null {
  if (!variantId) return null;
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_BASIC) return "basic";
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_PRO) return "pro";
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_PREMIUM) return "premium";
  return null;
}

/** Maps Lemon Squeezy subscription state to our internal "active" check. */
export const LEMON_ACTIVE_STATUSES = ["on_trial", "active"] as const;

export function isLemonActiveStatus(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return (LEMON_ACTIVE_STATUSES as readonly string[]).includes(status);
}
