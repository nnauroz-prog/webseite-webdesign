import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { TcoRechner } from "@/components/marketing/tco-rechner";
import { SITE_URL } from "@/lib/site";

const WEBAPP_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sitalo 3-Jahres-Kostenrechner",
  description:
    "Was kostet eine Website über 3 Jahre? Sitalo vs Wix, Squarespace, Jimdo, ChatGPT-Selbstbau. Inkl. Eigenzeit als Geld bewertet.",
  url: `${SITE_URL}/rechner`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "3-Jahres-Rechner",
      item: `${SITE_URL}/rechner`,
    },
  ],
};

export const metadata: Metadata = {
  title: "3-Jahres-Kostenrechner",
  description:
    "Was kostet Ihre Website über 3 Jahre? Sitalo vs Wix, Squarespace, Jimdo, ChatGPT-Selbstbau. Inkl. Eigenzeit als echtes Geld.",
  alternates: { canonical: "/rechner" },
};

/**
 * `/rechner` — 3-Jahres-TCO-Rechner.
 *
 * Hochwertiges Beratungs-Tool für Visitor in der Consideration-
 * Phase. Zeigt in Echtzeit, wie sich Gesamtkosten verschieben,
 * wenn man Eigenzeit ehrlich einrechnet.
 *
 * Bewusst transparent — die Logik steht offen im Code, keine
 * Sitalo-Bias-Multiplikatoren. Wenn jemand Eigenzeit auf 0 €/h
 * setzt, gewinnt der Baukasten. Das gehört zur Ehrlichkeit.
 */
export default function RechnerPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="3-Jahres-Rechner"
          eyebrow="Eigenzeit als echtes Geld"
          title="Was kostet eine Website"
          accent="über drei Jahre?"
        >
          Sitalo, Baukästen und Selbstbau im Vergleich, inklusive Ihrer eigenen
          Zeit zum Stundenwert Ihrer Wahl.
        </PageHero>

        <section>
          <div className="mx-auto w-full max-w-5xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
            <div>
              <TcoRechner />
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
              Lieber jemand erklärt's
            </p>
            <p className="serif text-foreground mt-6 text-2xl leading-snug text-balance sm:text-3xl">
              Wir reden 30 Minuten über Ihre Situation.{" "}
              <span className="serif-italic text-muted-foreground">
                Kostenlos, ohne Verkaufsschnack.
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
