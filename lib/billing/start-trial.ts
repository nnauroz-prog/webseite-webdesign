import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Idempotently start a 7-day trial subscription for the given user.
 *
 * This is the "first publish" gate — without an access-granting
 * subscription row, websites stay private. We extract this as a
 * helper so both the explicit publish toggle and the new auto-
 * publish-on-create path can call it without duplicating code.
 *
 * No-op if the user already has any subscription row, regardless of
 * status. We never overwrite billing state.
 */
export async function ensureTrialSubscription(
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing) return { ok: true };

  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from("subscriptions") as any).insert({
    user_id: userId,
    provider: "stripe",
    status: "trialing",
    current_period_end: trialEnd.toISOString(),
    plan: "basic",
  });

  if (error) {
    console.error("[ensureTrialSubscription] insert failed", {
      message: error.message,
      user_id: userId,
    });
    return { ok: false, message: error.message };
  }

  return { ok: true };
}
