import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { isActiveStatus } from "@/lib/stripe/plans";
import { requireAdmin } from "@/lib/supabase/auth";
import type { SubscriptionRow } from "@/types/billing";

type ProfileLite = { id: string; email: string; full_name: string | null };

export const metadata: Metadata = { title: "Abonnements — Admin" };

const STATUS_LABEL: Record<string, string> = {
  active: "Aktiv",
  trialing: "Test-Phase",
  past_due: "Zahlung überfällig",
  unpaid: "Unbezahlt",
  canceled: "Gekündigt",
  incomplete: "Unvollständig",
  incomplete_expired: "Abgelaufen",
  paused: "Pausiert",
};

export default async function AdminSubscriptionsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: subs }, { data: profiles }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*")
      .order("updated_at", { ascending: false }),
    supabase.from("profiles").select("id, email, full_name"),
  ]);

  const rows = (subs as SubscriptionRow[] | null) ?? [];
  const ownerById = new Map<string, ProfileLite>();
  for (const p of (profiles as ProfileLite[] | null) ?? []) {
    ownerById.set(p.id, p);
  }

  const activeCount = rows.filter((r) => isActiveStatus(r.status)).length;
  const mrrCents = rows
    .filter((r) => isActiveStatus(r.status))
    .reduce((sum, r) => sum + estimateMonthlyEur(r.plan) * 100, 0);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Abonnements</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Übersicht aller Stripe-Abos. Verwaltung erfolgt im Stripe-Dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Aktive Abos" value={String(activeCount)} />
        <StatCard label="Abos gesamt" value={String(rows.length)} />
        <StatCard
          label="MRR (geschätzt)"
          value={`${(mrrCents / 100).toLocaleString("de-DE")} €`}
        />
      </div>

      {rows.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          Noch keine Abonnements abgeschlossen.
        </div>
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-left text-xs tracking-wide uppercase">
              <tr>
                <th className="px-4 py-3">Kunde</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Nächste Abrechnung</th>
                <th className="px-4 py-3">Stripe</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {rows.map((row) => {
                const owner = ownerById.get(row.user_id);
                return (
                  <tr key={row.user_id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {owner?.full_name || owner?.email || "—"}
                      </div>
                      {owner?.full_name ? (
                        <div className="text-muted-foreground text-xs">
                          {owner.email}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {row.plan ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {row.current_period_end
                        ? new Date(row.current_period_end).toLocaleDateString(
                            "de-DE",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "—"}
                      {row.cancel_at_period_end ? (
                        <span className="text-amber-700 dark:text-amber-400">
                          {" "}
                          (Kündigung)
                        </span>
                      ) : null}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                      {row.stripe_subscription_id ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-muted-foreground text-xs tracking-wide uppercase">
          {label}
        </div>
        <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const label = status ? (STATUS_LABEL[status] ?? status) : "—";
  const tone = isActiveStatus(status)
    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100"
    : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100";
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      {label}
    </span>
  );
}

function estimateMonthlyEur(plan: string | null): number {
  switch (plan) {
    case "basic":
      return 29;
    case "pro":
      return 49;
    case "premium":
      return 89;
    default:
      return 0;
  }
}
