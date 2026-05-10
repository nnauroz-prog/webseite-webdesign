import Link from "next/link";
import { AlertTriangle, Clock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Subscription = {
  status: string | null;
  current_period_end: string | null;
};

/**
 * Banner shown above the dashboard hero. Three states:
 *
 *   1. No subscription row yet → "Probezeit startet sobald du
 *      veröffentlichst" hint (light, encouraging).
 *   2. Trialing + days remaining → countdown + add-payment CTA.
 *   3. Trialing but already expired (or past_due) → red "Site offline"
 *      banner with payment CTA.
 *
 * The component is server-rendered — it just reads the subscription
 * shape passed from the dashboard server component.
 */
export function TrialBanner({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  // No subscription yet — encourage the trial start.
  if (!subscription) {
    return (
      <div className="border-primary/30 bg-primary/5 mb-6 flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4">
        <div className="flex items-start gap-3">
          <span className="bg-primary/15 text-primary inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-foreground font-medium">
              7 Tage gratis testen
            </p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Sobald du veröffentlichst, startet eine 7-tägige Probezeit —
              ohne Zahlungsdaten. Bezahlung fügst du erst hinzu, wenn du
              danach weitermachen willst.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const status = subscription.status ?? "";
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end)
    : null;
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = periodEnd
    ? Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / msPerDay))
    : null;

  // Active paid sub — no banner.
  if (status === "active") return null;

  // Trial still running.
  if (status === "trialing" && daysLeft !== null && daysLeft > 0) {
    const urgent = daysLeft <= 2;
    return (
      <div
        className={cn(
          "mb-6 flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4",
          urgent
            ? "border-amber-300 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30"
            : "border-primary/30 bg-primary/5",
        )}
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              urgent
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "bg-primary/15 text-primary",
            )}
          >
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <p className="text-foreground font-medium">
              {urgent
                ? `Noch ${daysLeft} ${daysLeft === 1 ? "Tag" : "Tage"} Probezeit`
                : `${daysLeft} Tage gratis testen`}
            </p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {urgent
                ? "Hinterlege jetzt eine Zahlungsmethode, damit deine Site online bleibt — sonst geht sie automatisch offline."
                : "Probezeit läuft. Du kannst jederzeit eine Zahlungsmethode hinzufügen, sonst geht die Site nach Ablauf offline."}
            </p>
          </div>
        </div>
        <Button asChild size="sm" variant={urgent ? "default" : "outline"}>
          <Link href="/pricing">Plan wählen</Link>
        </Button>
      </div>
    );
  }

  // Trial expired or otherwise inactive — site is offline.
  if (
    (status === "trialing" && daysLeft === 0) ||
    ["past_due", "unpaid", "canceled", "cancelled", "expired"].includes(status)
  ) {
    return (
      <div className="border-destructive/40 bg-destructive/5 mb-6 flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4">
        <div className="flex items-start gap-3">
          <span className="bg-destructive/15 text-destructive inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <p className="text-foreground font-medium">
              Probezeit abgelaufen — Site ist offline
            </p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Hinterlege eine Zahlungsmethode, um deine Website wieder zu
              veröffentlichen. Alle Inhalte bleiben gespeichert.
            </p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href="/pricing">Plan wählen</Link>
        </Button>
      </div>
    );
  }

  // Default: no banner.
  return null;
}
