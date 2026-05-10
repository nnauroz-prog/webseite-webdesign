/**
 * Plan catalog for Sitalo.
 *
 * Stripe holds the source of truth for prices. We map our human-friendly
 * plan slugs ('basic' | 'pro' | 'premium') to the Stripe Price IDs that the
 * operator created in the Stripe dashboard, via env vars.
 *
 * Pricing/feature copy lives here so the marketing/dashboard pages render
 * deterministically without an extra Stripe call on every request.
 */

export type PlanId = "basic" | "pro" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  price_eur_per_month: number;
  features: string[];
  highlight?: boolean;
};

export const PLANS: readonly Plan[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Eine professionelle Website. Live in Minuten.",
    price_eur_per_month: 9,
    features: [
      "1 öffentliche Website",
      "Kontaktformular mit DSGVO-Hinweis",
      "Eigene URL (sitalo.app/site/...)",
      "Logo, Hero, Leistungen, Team, Galerie",
      "SEO-Grundlagen + Sitemap",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Alles aus Basic — plus aktive Recruiting-Funktion.",
    price_eur_per_month: 19,
    features: [
      "Alles aus Basic",
      "Bewerbungsformular für offene Stellen",
      "Branchen-Templates inkl. Theming",
      "Erweiterte SEO-Felder & OpenGraph",
      "E-Mail-Support",
    ],
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Für Praxen mit eigener Domain & vollem Service.",
    price_eur_per_month: 39,
    features: [
      "Alles aus Pro",
      "Eigene Domain (CNAME-Anbindung)",
      "Priorisierter Support",
      "Setup-Service: wir bauen die erste Version",
      "Monatlicher Performance-Report",
    ],
  },
] as const;

export function getPlan(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}

/**
 * Returns the Stripe Price ID configured for a plan slug, or undefined when
 * the env var is missing (operator hasn't finished setup yet).
 */
export function getStripePriceId(id: PlanId): string | undefined {
  switch (id) {
    case "basic":
      return process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC;
    case "pro":
      return process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO;
    case "premium":
      return process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM;
  }
}

/**
 * Reverse lookup — given a Stripe Price ID coming from a webhook event,
 * resolve the corresponding plan slug. Returns null when the price isn't
 * one of our configured plans (could happen during plan migrations).
 */
export function planIdFromPriceId(priceId: string | null): PlanId | null {
  if (!priceId) return null;
  for (const plan of PLANS) {
    if (getStripePriceId(plan.id) === priceId) return plan.id;
  }
  return null;
}

/**
 * Subscription statuses that grant access to the product. Mirrors Stripe's
 * lifecycle vocabulary; see stripe.com/docs/api/subscriptions/object#subscription_object-status.
 */
export const ACTIVE_STATUSES = ["active", "trialing"] as const;
export type ActiveStatus = (typeof ACTIVE_STATUSES)[number];

export function isActiveStatus(status: string | null | undefined): boolean {
  if (!status) return false;
  return (ACTIVE_STATUSES as readonly string[]).includes(status);
}
