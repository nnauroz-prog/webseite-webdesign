import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SpeedCheck } from "@/components/marketing/speed-check";
import { SITE_URL } from "@/lib/site";

const WEBAPP_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sitalo Ladezeit-Test",
  description:
    "Kostenloser Test mit Google PageSpeed Insights: Ladezeit, Barrierefreiheit, Technik und Google-Grundlagen einer Website in etwa 30 Sekunden.",
  url: `${SITE_URL}/check`,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Ladezeit-Test",
      item: `${SITE_URL}/check`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Website-Ladezeit kostenlos testen",
  description:
    "Kostenloser Test mit Google PageSpeed Insights: Ladezeit, Barrierefreiheit, Technik und Google-Grundlagen Ihrer Website in etwa 30 Sekunden.",
  alternates: { canonical: "/check" },
};

/**
 * Gegenüberstellung Ladezeit-Test und Durchsicht. Als Zeilen gesetzt wie ein
 * Frachtbrief: links die Frage, rechts die beiden Antworten. Am Handy
 * steht die Frage über den zwei Spalten.
 */
const VERGLEICH: { frage: string; check: string; audit: string }[] = [
  {
    frage: "Wer prüft",
    check: "Google PageSpeed Insights, automatisch",
    audit: "Wir, von Hand",
  },
  {
    frage: "Was geprüft wird",
    check: "Ladezeit, Barrierefreiheit, Technik und Google-Grundlagen, je von 0 bis 100",
    audit: "Erster Eindruck am Handy, Telefonnummer, Öffnungszeiten und Texte",
  },
  {
    frage: "Was Sie angeben",
    check: "Nur die Adresse",
    audit: "Adresse, Name und E-Mail",
  },
  {
    frage: "Dauer",
    check: "15 bis 30 Sekunden",
    audit: "Antwort meist innerhalb von zwei Werktagen",
  },
  {
    frage: "Ergebnis",
    check: "Vier Werte hier auf der Seite",
    audit: "Drei bis fünf Punkte per E-Mail",
  },
  {
    frage: "Kosten",
    check: "Keine",
    audit: "Keine",
  },
];

/**
 * `/check` — Live-PageSpeed-Test.
 *
 * Abgrenzung zu /audit:
 *   - /check: automatisch, sofort, technische Werte
 *   - /audit: Durchsicht von Hand, meist in zwei Werktagen, inhaltliche Sicht
 *
 * Die UI verlinkt nach erfolgter Analyse je nach Ergebnis weiter —
 * bei schlechten Werten deutlich auf /audit + /wartung, bei guten
 * dezent auf /audit als Ergänzung.
 */
export default function CheckPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Ladezeit-Test"
          eyebrow="Ladezeit-Test · gemessen mit Google PageSpeed"
          title="Testen Sie, wie schnell Ihre Website lädt."
        >
          Sie geben die Adresse ein, nach 15 bis 30 Sekunden stehen die Werte
          da. Kontaktdaten brauchen wir dafür nicht.
        </PageHero>

        <section aria-label="Test">
          <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
            <SpeedCheck />
          </div>
        </section>

        <section className="bg-card border-border border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <p className="label-mono text-muted-foreground">Ladezeit-Test und Durchsicht</p>
                <h2 className="mt-5 text-balance text-[2rem] leading-[1.04] tracking-[-0.032em] sm:text-[2.5rem]">
                  Der Test misst die Technik, den Rest sehen wir uns an.
                </h2>
                <p className="text-muted-foreground mt-5 max-w-sm text-[15.5px] leading-relaxed text-pretty">
                  Ob die Telefonnummer am Handy antippbar ist und die
                  Startseite sagt, was Sie anbieten, prüft kein automatischer
                  Test. Dafür gibt es die Durchsicht von Hand.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-8">
                <div className="border-foreground grid grid-cols-2 gap-x-5 border-b-2 pb-3 sm:grid-cols-[11rem_1fr_1fr] sm:gap-x-8">
                  <span aria-hidden="true" className="hidden sm:block" />
                  <h3 className="text-[1.15rem] tracking-[-0.01em] sm:text-[1.3rem]">Ladezeit-Test</h3>
                  <h3 className="text-[1.15rem] tracking-[-0.01em] sm:text-[1.3rem]">Durchsicht</h3>
                </div>
                <dl>
                  {VERGLEICH.map((row) => (
                    <div
                      key={row.frage}
                      className="border-border grid grid-cols-2 gap-x-5 gap-y-1.5 border-b py-4 sm:grid-cols-[11rem_1fr_1fr] sm:gap-x-8"
                    >
                      <dt className="label-mono text-muted-foreground col-span-2 sm:col-span-1 sm:pt-1">
                        {row.frage}
                      </dt>
                      <dd className="text-foreground min-w-0 text-[14.5px] leading-snug sm:text-[15px]">
                        <span className="sr-only">Ladezeit-Test: </span>
                        {row.check}
                      </dd>
                      <dd className="text-foreground min-w-0 text-[14.5px] leading-snug sm:text-[15px]">
                        <span className="sr-only">Durchsicht: </span>
                        {row.audit}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="grid grid-cols-2 gap-x-5 pt-5 sm:grid-cols-[11rem_1fr_1fr] sm:gap-x-8">
                  <span aria-hidden="true" className="hidden sm:block" />
                  <a
                    href="#check-url"
                    className="text-foreground inline-flex items-center gap-1.5 self-start text-[14.5px] font-semibold underline-offset-4 hover:underline"
                  >
                    Zum Test oben
                  </a>
                  <Link
                    href="/audit"
                    className="text-foreground inline-flex items-center gap-1.5 self-start text-[14.5px] font-semibold underline-offset-4 hover:underline"
                  >
                    Durchsicht anfordern
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p className="label-mono text-muted-foreground">Erstgespräch</p>
              <p className="text-foreground mt-4 max-w-xl text-balance text-[1.4rem] leading-snug font-semibold tracking-[-0.015em] sm:text-[1.65rem]">
                Im Erstgespräch gehen wir die Werte mit Ihnen durch. Meist
                reicht eine Viertelstunde, reserviert sind bis zu 30 Minuten,
                und es kostet nichts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-5 lg:justify-end">
              <Link href="/termin" className="btn-line h-12 text-[15px]">
                Termin wählen
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+491607621876"
                className="text-foreground text-[15px] font-semibold tabular-nums underline-offset-4 hover:underline"
              >
                0160&nbsp;7621876
              </a>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([WEBAPP_LD, BREADCRUMB_LD]),
        }}
      />
    </div>
  );
}
