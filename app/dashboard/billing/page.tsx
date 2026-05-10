import type { Metadata } from "next";
import Link from "next/link";

import { ManagePlanButton } from "@/components/dashboard/billing/manage-plan-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPlan, isActiveStatus, PLANS } from "@/lib/stripe/plans";
import { requireUser } from "@/lib/supabase/auth";
import type { SubscriptionRow } from "@/types/billing";

export const metadata: Metadata = { title: "Abrechnung — Sitalo" };

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

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const subscription = (data as SubscriptionRow | null) ?? null;
  const active = isActiveStatus(subscription?.status);
  const plan =
    subscription?.plan && active ? getPlan(subscription.plan) : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Abrechnung</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Wähle dein Paket und verwalte Zahlungsmethode oder Rechnungen.
      </p>

      {params.checkout === "success" ? (
        <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100">
          Vielen Dank! Dein Abo ist aktiv. Es kann ein paar Sekunden dauern,
          bis Stripe alle Daten an uns übermittelt hat — lade die Seite kurz
          neu, falls unten noch &bdquo;kein Abo&ldquo; steht.
        </div>
      ) : null}

      <div className="mt-6 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktuelles Paket</CardTitle>
            <CardDescription>
              {active
                ? "Deine Website kann öffentlich geschaltet werden."
                : "Du bist im Demo-Modus. Wähle ein Paket, um deine Website live zu schalten."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-semibold">
                  {plan?.name ?? "Demo-Modus"}
                </span>
                {subscription?.status ? (
                  <StatusPill status={subscription.status} />
                ) : null}
              </div>
              {plan ? (
                <p className="text-muted-foreground mt-1 text-sm">
                  {plan.price_eur_per_month}&nbsp;€ pro Monat
                </p>
              ) : null}
              {subscription?.current_period_end && active ? (
                <p className="text-muted-foreground mt-1 text-xs">
                  {subscription.cancel_at_period_end
                    ? `Endet am ${formatDate(subscription.current_period_end)}.`
                    : `Nächste Abrechnung am ${formatDate(subscription.current_period_end)}.`}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              {subscription?.stripe_customer_id ? (
                <ManagePlanButton />
              ) : (
                <Button asChild>
                  <Link href="/pricing">Paket wählen</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {!active ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pakete im Überblick</CardTitle>
              <CardDescription>
                Drei Pakete, monatlich kündbar. Genaue Vergleichs-Tabelle auf
                der öffentlichen Preisseite.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  className="border-border bg-background rounded-lg border p-4"
                >
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-xl font-semibold">
                    {p.price_eur_per_month}&nbsp;€
                    <span className="text-muted-foreground text-xs font-normal">
                      {" "}
                      / Monat
                    </span>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-3">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/pricing">Pakete vergleichen & buchen</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const label = STATUS_LABEL[status] ?? status;
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
