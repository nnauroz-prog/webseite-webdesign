import type { PlanId } from "@/lib/stripe/plans";

/**
 * Stripe subscription lifecycle statuses we mirror into our DB. Kept as a
 * permissive string union so we tolerate any future status Stripe adds.
 */
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "unpaid"
  | (string & {});

export type SubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  plan: PlanId | null;
  status: SubscriptionStatus | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};
