import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Zap } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SpeedCheck } from "@/components/marketing/speed-check";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";

export const metadata: Metadata = {
  title: "Geschwindigkeits-Test",
  description:
    "Live PageSpeed-Insights-Test für Ihre Website. Performance, Accessibility, Best Practices, SEO — in 30 Sekunden, kostenlos, automatisch.",
  alternates: { canonical: "/check" },
};

/**
 * `/check` — Live-PageSpeed-Test.
 *
 * Abgrenzung zu /audit:
 *   - /check: automatisch, sofort, technische Scores
 *   - /audit: persönlich, 48 h, inhaltliche Perspektive
 *
 * Beide haben Wert. /check ist niedrigschwellig (URL reicht, kein
 * Kontaktdatum), /audit zahlt auf Vertrauensaufbau und Lead-Qualität.
 *
 * Die UI verlinkt nach erfolgter Analyse adaptiv weiter — bei
 * schlechten Scores prominent auf /audit + /wartung, bei guten
 * dezent auf /audit als Ergänzung.
 */
export default function CheckPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Speed-Check" />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-border/40 relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-[60px] sm:blur-[120px]"
          />
          <div className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20 lg:py-24">
            <div className="text-center">
              <EditorialEyebrow>Live · Automatisch · Kostenlos</EditorialEyebrow>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Wie schnell ist
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  Ihre Seite?
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
                Live PageSpeed-Insights-Test. Performance, Accessibility,
                Best Practices, SEO. Ergebnis in 30 Sekunden, ohne
                Kontaktdaten. Kein PDF-Report, keine E-Mail-Pflicht.
              </p>
            </div>

            <div className="mt-12 sm:mt-16">
              <SpeedCheck />
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <div>
                <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
                  <span
                    aria-hidden="true"
                    className="bg-gold gold-pulse inline-block h-1 w-6"
                  />
                  Zwei Wege
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
                  Speed-Check
                  <br />
                  <span className="serif-italic text-muted-foreground font-normal">
                    oder Persönlicher Audit?
                  </span>
                </h2>
                <p className="text-foreground/75 mt-6 max-w-md text-pretty text-[15.5px] leading-relaxed">
                  Beide haben Sinn — und sie ergänzen sich. Der Speed-
                  Check sagt Ihnen, ob die Technik stimmt. Der Audit
                  sagt Ihnen, ob die Seite das Richtige für Ihre
                  Kunden tut.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Card
                  icon={Zap}
                  title="Speed-Check"
                  badge="Sofort"
                  body="Automatisch, technisch, anonym. Vier Lighthouse-Scores plus Core Web Vitals. Sagt: ist die Technik in Ordnung?"
                  cta="Auf dieser Seite"
                  href="#main"
                />
                <Card
                  icon={Eye}
                  title="Persönlicher Audit"
                  badge="48 h"
                  body="Menschlich, inhaltlich, ehrlich. Drei bis fünf konkrete Punkte per Mail aus unserer Hand-drauf-Sicht. Sagt: ist die Seite die richtige?"
                  cta="Zum Audit"
                  href="/audit"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Lieber gleich reden
            </p>
            <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug sm:text-3xl">
              30 Minuten, Hamburg-Zeit.{" "}
              <span className="serif-italic text-muted-foreground">
                Wir gucken zusammen drauf.
              </span>
            </p>
            <Link
              href="/termin"
              className="bg-foreground text-background hover:bg-foreground/90 group mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              Termin direkt buchen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  badge,
  body,
  cta,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <article className="border-border/60 bg-card/40 ring-foreground/5 flex flex-col gap-4 rounded-3xl border p-6 ring-1">
      <div className="flex items-center justify-between gap-3">
        <span className="border-border/60 text-foreground/70 inline-flex h-9 w-9 items-center justify-center rounded-full border">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
          {badge}
        </span>
      </div>
      <h3 className="text-foreground text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-muted-foreground text-[14px] leading-relaxed">
        {body}
      </p>
      <Link
        href={href}
        className="text-foreground mt-auto inline-flex items-center gap-2 text-[14px] font-medium underline-offset-[6px] hover:underline"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
