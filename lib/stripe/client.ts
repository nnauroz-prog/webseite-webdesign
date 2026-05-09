import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Server-only Stripe client. Lazily instantiated to avoid throwing at import
 * time during build, where env vars may not yet be present.
 */
export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your environment.",
    );
  }

  cached = new Stripe(key, {
    typescript: true,
    appInfo: { name: "SitePilot", version: "0.1.0" },
  });
  return cached;
}
