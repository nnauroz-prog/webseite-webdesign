import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { CheckoutButton } from "@/components/pricing/checkout-button";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe/plans";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preise — SitePilot",
  description:
    "Drei einfache Pakete für lokale Dienstleister. Monatlich kündbar, keine Einrichtungsgebühr.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <main className="flex flex-1 flex-col">
      <header className="border-border/60 border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            SitePilot
          </Link>
          <nav className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition hover:opacity-90"
              >
                Zum Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:bg-secondary inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition hover:opacity-90"
                >
                  Kostenlos starten
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Einfache Preise. Monatlich kündbar.
          </h1>
          <p className="text-muted-foreground mt-5 text-pretty">
            Bau deine Website kostenlos im Demo-Modus. Erst wenn du live gehen
            willst, wählst du ein Paket. Keine Einrichtungsgebühr.
          </p>
        </div>

        {params.checkout === "cancelled" ? (
          <p className="text-muted-foreground mx-auto mt-8 max-w-md rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm dark:border-amber-900/40 dark:bg-amber-950/30">
            Checkout abgebrochen. Du kannst jederzeit erneut versuchen.
          </p>
        ) : null}
        {params.error === "no_subscription" ? (
          <p className="text-muted-foreground mx-auto mt-8 max-w-md rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm dark:border-amber-900/40 dark:bg-amber-950/30">
            Du hast noch kein aktives Abo. Bitte wähle zuerst ein Paket.
          </p>
        ) : null}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "border-border bg-background relative flex flex-col rounded-2xl border p-8 shadow-sm",
                plan.highlight && "ring-primary border-primary ring-2",
              )}
            >
              {plan.highlight ? (
                <span className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                  Beliebteste Wahl
                </span>
              ) : null}
              <h2 className="text-2xl font-semibold tracking-tight">
                {plan.name}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm text-pretty">
                {plan.tagline}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price_eur_per_month}&nbsp;€
                </span>
                <span className="text-muted-foreground text-sm">/ Monat</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                zzgl. MwSt. · monatlich kündbar
              </p>

              <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-pretty">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {isLoggedIn ? (
                  <CheckoutButton
                    plan={plan.id}
                    label={plan.highlight ? "Jetzt buchen" : "Plan wählen"}
                    variant={plan.highlight ? "default" : "outline"}
                  />
                ) : (
                  <Button
                    asChild
                    variant={plan.highlight ? "default" : "outline"}
                    className="w-full"
                  >
                    <Link href="/register">Konto anlegen</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Was passiert, wenn ich kündige?
          </h2>
          <p className="text-muted-foreground mt-3 text-pretty">
            Wenn dein Abo endet, geht deine öffentliche Website offline. Deine
            Daten im Dashboard bleiben erhalten — du kannst jederzeit erneut
            buchen und mit einem Klick wieder live gehen.
          </p>
        </div>
      </section>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs">
          <span>© {new Date().getFullYear()} SitePilot</span>
          <Link href="/" className="hover:text-foreground">
            Zurück zur Startseite
          </Link>
        </div>
      </footer>
    </main>
  );
}
