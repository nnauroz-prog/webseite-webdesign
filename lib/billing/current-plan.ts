import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "@/lib/stripe/plans";

const VALID: readonly PlanId[] = ["basic", "pro", "premium"];

/**
 * Resolve the user's active plan. Returns the plan slug only when
 * there's a row with an access-granting status AND, for trialing
 * rows, the trial hasn't run out yet (mirrors the
 * has_active_subscription DB function).
 *
 * null = no active plan → trial-tier limits apply.
 */
export async function getCurrentPlan(
  userId: string,
): Promise<PlanId | null> {
  const supabase = await createClient();
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();
    const row = data as
      | {
          plan: string | null;
          status: string | null;
          current_period_end: string | null;
        }
      | null;
    if (!row) return null;

    const status = row.status ?? "";
    if (!["active", "trialing"].includes(status)) return null;

    if (row.current_period_end) {
      if (new Date(row.current_period_end).getTime() <= Date.now()) {
        return null;
      }
    }

    const plan = row.plan;
    if (plan && (VALID as readonly string[]).includes(plan)) {
      return plan as PlanId;
    }
    return null;
  } catch {
    return null;
  }
}
