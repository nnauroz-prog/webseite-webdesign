import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EmpfehlungWizard } from "@/components/marketing/empfehlung-wizard";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SITE_URL } from "@/lib/site";

const WEBAPP_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sitalo Paket-Empfehlung",
  description:
    "Fünf-Fragen-Quiz, das aus Branche, Größe, Zeit und Materialien das passende Paket empfiehlt. Begründung sichtbar, keine Black-Box.",
  url: `${SITE_URL}/empfehlung`,
  applicationCategory: "BusinessApplication",
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
      name: "Empfehlung",
      item: `${SITE_URL}/empfehlung`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Welches Paket passt?",
  description:
    "Welches Website-Paket passt zu Ihnen? Fünf Fragen zu Branche, Größe und Zeitplan, danach eine begründete Empfehlung. Kostenlos.",
  alternates: { canonical: "/empfehlung" },
};

/**
 * `/empfehlung` — interaktives Quiz-Tool.
 *
 * Anders als das frühere /anfrage-Wizard (rückgebaut wegen zu
 * vieler Klicks für Erstkontakt): hier ist das Quiz das Hauptziel,
 * nicht ein vorgelagertes Hindernis. User bekommt eine personali-
 * sierte Empfehlung mit nachvollziehbarer Begründung.
 *
 * Zustand wird in localStorage gespeichert — User kann zurück-
 * kommen, ohne von vorn anzufangen.
 */
export default function EmpfehlungPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Paket-Empfehlung"
          eyebrow="Fünf Fragen · ehrliche Empfehlung"
          title="Welches Paket"
          accent="passt zu Ihnen?"
        >
          Branche, Größe, vorhandene Inhalte und Zeitplan. Danach sagen wir
          ehrlich, womit Sie am besten fahren. Ohne E-Mail-Pflicht.
        </PageHero>

        <section>
          <div className="mx-auto w-full max-w-5xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
            <div>
              <EmpfehlungWizard />
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[13px] font-medium">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Lieber selbst entscheiden
            </p>
            <p className="serif text-foreground mt-6 text-2xl leading-snug text-balance sm:text-3xl">
              Drei Pakete, klar erklärt.{" "}
              <span className="serif-italic text-muted-foreground">
                Mehr Detail, mehr Beispiele.
              </span>
            </p>
            <Link
              href="/pakete"
              className="text-foreground mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
            >
              Alle Pakete im Detail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([WEBAPP_LD, BREADCRUMB_LD]),
        }}
      />
    </div>
  );
}
