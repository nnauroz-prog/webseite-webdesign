import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { CheckoutButton } from "@/components/pricing/checkout-button";
import { SitaloLogo } from "@/components/sitalo-logo";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanId } from "@/lib/stripe/plans";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preise — Sitalo",
  description:
    "Drei einfache Pakete für lokale Dienstleister. Monatlich kündbar, keine Einrichtungsgebühr.",
};

type ComparisonRow = {
  feature: string;
  basic: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
};

const comparison: ComparisonRow[] = [
  { feature: "Öffentliche Website", basic: true, pro: true, premium: true },
  { feature: "Branchen-Template", basic: true, pro: true, premium: true },
  { feature: "Logo, Hero, Über-uns", basic: true, pro: true, premium: true },
  { feature: "Leistungen, Team, Galerie", basic: true, pro: true, premium: true },
  { feature: "Kontaktformular", basic: true, pro: true, premium: true },
  { feature: "DSGVO-Pflichtseiten", basic: true, pro: true, premium: true },
  { feature: "Sitemap & robots.txt", basic: true, pro: true, premium: true },
  { feature: "Bewerbungsformular", basic: false, pro: true, premium: true },
  { feature: "Erweiterte SEO-Felder", basic: false, pro: true, premium: true },
  { feature: "OpenGraph-Bilder", basic: false, pro: true, premium: true },
  { feature: "E-Mail-Support", basic: false, pro: true, premium: true },
  { feature: "Eigene Domain", basic: false, pro: false, premium: true },
  { feature: "Setup-Service (wir bauen)", basic: false, pro: false, premium: true },
  { feature: "Priorisierter Support", basic: false, pro: false, premium: true },
  { feature: "Monatlicher Performance-Report", basic: false, pro: false, premium: true },
];

const pricingFaq = [
  {
    q: "Gibt es eine Mindestlaufzeit?",
    a: "Nein. Du buchst monatsweise und kannst jederzeit zum Ende des aktuellen Abrechnungs­zeitraums kündigen — direkt im Stripe-Kundenportal.",
  },
  {
    q: "Was ist im Demo-Modus enthalten?",
    a: "Du kannst dich kostenlos registrieren und deine Website komplett im Dashboard aufbauen — Texte, Bilder, Team, Leistungen, alles. Erst wenn du sie öffentlich schalten willst, brauchst du ein Paket.",
  },
  {
    q: "Kann ich später das Paket wechseln?",
    a: "Ja. Im Stripe-Kundenportal kannst du jederzeit hoch- oder runterstufen. Stripe rechnet anteilig ab, du zahlst keine Doppelmonate.",
  },
  {
    q: "Was passiert bei einer fehlgeschlagenen Zahlung?",
    a: "Stripe versucht die Zahlung mehrfach automatisch erneut. Schlägt sie endgültig fehl, geht deine öffentliche Website offline — bis du die Zahlungs­methode aktualisierst und die offene Rechnung beglichst.",
  },
  {
    q: "Bekomme ich eine ordentliche Rechnung?",
    a: "Ja. Stripe stellt automatisch eine MwSt.-konforme Rechnung pro Monat aus, die du im Kunden­portal als PDF herunterladen kannst.",
  },
  {
    q: "Kann ich auch über die Webseite testen, bevor ich bezahle?",
    a: "Ja, das ist genau der Demo-Modus: Konto anlegen, Inhalte einpflegen, Vorschau ansehen — komplett kostenlos. Bezahlt wird erst, wenn die Site öffentlich gehen soll.",
  },
];

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
          <Link href="/" aria-label="Sitalo Webdesign">
            <SitaloLogo size="md" priority />
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

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="border-border bg-secondary text-secondary-foreground mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            Drei Pakete · Monatlich kündbar
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Einfache Preise. Keine versteckten Kosten.
          </h1>
          <p className="text-muted-foreground mt-5 text-pretty">
            Bau deine Website kostenlos im Demo-Modus. Erst wenn du live gehen
            willst, wählst du ein Paket — und kannst jederzeit wieder kündigen.
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
      </section>

      {/* Plan cards */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
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
      </section>

      {/* Comparison table */}
      <section className="bg-secondary/30 border-border/60 border-y">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Vergleich
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Was steckt in welchem Paket?
            </h2>
            <p className="text-muted-foreground mt-4 text-pretty">
              Genauer Funktionsvergleich. Alle Pakete enthalten die Basis — Pro
              und Premium ergänzen Recruiting, eigene Domain und Service.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="border-border bg-background min-w-full overflow-hidden rounded-2xl border text-sm">
              <thead className="bg-muted/50 text-left text-xs tracking-wide uppercase">
                <tr>
                  <th className="text-muted-foreground px-5 py-4 font-medium">
                    Funktion
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className={cn(
                        "text-foreground px-5 py-4 text-center text-sm font-semibold",
                        p.highlight && "bg-primary/5",
                      )}
                    >
                      <div>{p.name}</div>
                      <div className="text-muted-foreground mt-1 text-xs font-normal">
                        {p.price_eur_per_month}&nbsp;€ / Monat
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-5 py-3 font-medium">{row.feature}</td>
                    {(["basic", "pro", "premium"] as PlanId[]).map((id) => {
                      const plan = PLANS.find((p) => p.id === id);
                      return (
                        <td
                          key={id}
                          className={cn(
                            "px-5 py-3 text-center",
                            plan?.highlight && "bg-primary/5",
                          )}
                        >
                          <CompCell value={row[id]} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td className="text-muted-foreground px-5 py-4 text-xs">
                    Buchen
                  </td>
                  {PLANS.map((plan) => (
                    <td
                      key={plan.id}
                      className={cn(
                        "px-5 py-4 text-center",
                        plan.highlight && "bg-primary/5",
                      )}
                    >
                      {isLoggedIn ? (
                        <CheckoutButton
                          plan={plan.id}
                          label="Wählen"
                          variant={plan.highlight ? "default" : "outline"}
                        />
                      ) : (
                        <Button
                          asChild
                          size="sm"
                          variant={plan.highlight ? "default" : "outline"}
                        >
                          <Link href="/register">Konto anlegen</Link>
                        </Button>
                      )}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* Promise / value strip */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <PromiseCard
            title="Keine Einrichtungs­gebühr"
            body="Konto anlegen, Inhalte pflegen, veröffentlichen. Wir berechnen keinen einmaligen Setup-Preis — nur den monatlichen Beitrag deines Pakets."
          />
          <PromiseCard
            title="DSGVO & EU-Hosting"
            body="Alles auf EU-Servern (Vercel + Supabase Frankfurt). Pflichtseiten Impressum & Datenschutz sind eingebaut, du füllst nur deine Daten ein."
          />
          <PromiseCard
            title="Monatlich kündbar"
            body="Keine Mindestlaufzeit, keine versteckten Klauseln. Kündigen direkt im Stripe-Kundenportal — ohne Mail, ohne Anruf."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/30 border-border/60 border-y">
        <div className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Preise — Details
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Häufige Fragen zur Abrechnung.
            </h2>
          </div>
          <div className="bg-background mt-12 divide-y rounded-2xl border">
            {pricingFaq.map(({ q, a }) => (
              <details
                key={q}
                className="group p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  <span>{q}</span>
                  <span className="text-muted-foreground transition-transform group-open:rotate-90">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </summary>
                <p className="text-muted-foreground mt-3 text-sm text-pretty">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Erst bauen, dann zahlen.
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-pretty">
          Leg ein kostenloses Konto an und bau im Demo-Modus deine Website. Du
          kannst sie jederzeit live schalten — und genauso wieder offline
          nehmen.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Zum Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/register">Kostenlos starten</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Ich habe schon ein Konto</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs">
          <span>© {new Date().getFullYear()} Sitalo</span>
          <Link href="/" className="hover:text-foreground">
            Zurück zur Startseite
          </Link>
        </div>
      </footer>
    </main>
  );
}

function CompCell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center text-emerald-700 dark:text-emerald-300">
        <Check className="h-4 w-4" />
        <span className="sr-only">Enthalten</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="text-muted-foreground inline-flex items-center justify-center">
        <Minus className="h-4 w-4" />
        <span className="sr-only">Nicht enthalten</span>
      </span>
    );
  }
  return <span className="font-medium">{value}</span>;
}

function PromiseCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-border bg-background rounded-2xl border p-6">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm text-pretty">{body}</p>
    </div>
  );
}
