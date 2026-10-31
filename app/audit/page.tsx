import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, FileText, Mail } from "lucide-react";

import { AuditForm } from "@/components/marketing/audit-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kostenloser Website-Audit",
  description:
    "Drei bis fünf konkrete Punkte zu Ihrer aktuellen Seite, persönlich aus Hamburg. Keine generische SEO-Score-Karte, kein Vertriebs-Anruf danach.",
  alternates: { canonical: "/audit" },
};

/**
 * `/audit` — Lead-Magnet-Seite.
 *
 * Versprechen: ein ehrlicher Mini-Audit per Mail innerhalb 48 h.
 * Keine generischen Lighthouse-Reports, keine Score-Karten —
 * stattdessen 3–5 konkrete Punkte aus echter Auge-drauf-Sicht.
 *
 * Bewusst eigenständig (nicht in /anfrage gewurschtelt), weil
 * das Versprechen ein anderes ist: hier wird noch keine Anfrage
 * gestellt, hier wird zuerst Vertrauen aufgebaut.
 */
export default function AuditPage() {
  // Service + BreadcrumbList JSON-LD — der kostenlose Mini-Audit ist
  // ein eigenständiger Service (free Lead-Magnet mit konkretem
  // Deliverable: 3-5 Punkte per Mail in 48 h).
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kostenloser Website-Audit",
    description:
      "Persönlicher Audit-Report Ihrer aktuellen Website. Drei bis fünf konkrete Verbesserungspunkte per Mail innerhalb 48 Stunden — kein Lighthouse-Score, kein Vertriebs-Anruf.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Sitalo Webdesign",
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Website-Audit",
    url: `${SITE_URL}/audit`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sitalo",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mini-Audit",
        item: `${SITE_URL}/audit`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />

      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Mini-Audit"
          eyebrow="Kostenlos · persönlich · 48 h"
          title="Wir sehen uns Ihre Seite an."
          accent="Ehrlich."
        >
          Drei bis fünf konkrete Punkte: was gut läuft und was wir an Ihrer
          Stelle zuerst angehen würden. Kein Vertriebsanruf danach.
        </PageHero>

        <section>
          <div className="mx-auto w-full max-w-4xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
            <div>
              <AuditForm />
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
              <div>
                <p className="text-muted-foreground inline-flex items-center gap-2 text-[13px] font-medium">
                  <span
                    aria-hidden="true"
                    className="bg-gold gold-pulse inline-block h-1 w-6"
                  />
                  Was Sie bekommen
                </p>
                <h2 className="mt-6 text-3xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl">
                  Eine E-Mail.
                  <br />
                  <span className="serif-italic text-muted-foreground font-normal">
                    Mehr nicht.
                  </span>
                </h2>
                <p className="text-foreground/75 mt-6 max-w-md text-[15.5px] leading-relaxed text-pretty">
                  Kein PDF-Report, kein automatisches Tool. Wir öffnen Ihre
                  Seite, gucken sie uns am Schreibtisch in Hamburg an und
                  schreiben Ihnen, was uns aufgefallen ist — in einer Sprache,
                  die nicht nach Marketing klingt.
                </p>
              </div>

              <ul className="space-y-5">
                <AuditItem
                  icon={Eye}
                  title="Erster Eindruck auf dem Smartphone"
                  body="Was sieht ein Kunde in den ersten drei Sekunden? Ist die Telefonnummer erreichbar? Funktioniert der Speisekarten-Link? Sind die Öffnungszeiten zu finden?"
                />
                <AuditItem
                  icon={FileText}
                  title="Konkretes vor Generischem"
                  body="Wir nennen die Stelle, die uns aufgefallen ist — nicht abstraktes Meta-Tag-Geblubber. Sondern: auf der Startseite steht ein Willkommen, das Ihre Kunden über Sie nichts erfahren lässt — und genau das fehlt da."
                />
                <AuditItem
                  icon={Mail}
                  title="Persönlich, nicht automatisch"
                  body="Sie bekommen die Mail direkt aus dem Atelier — von einem Menschen geschrieben, nicht von einem Tool. Wenn Sie zurück schreiben, antwortet auch ein Mensch. Kein Funnel, kein Drip, kein Auto-Responder."
                />
              </ul>
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
              Klare Ansage
            </p>
            <p className="serif text-foreground mt-6 text-2xl leading-snug text-balance sm:text-3xl">
              Es kommt kein Vertriebs-Anruf danach.{" "}
              <span className="serif-italic text-muted-foreground">
                Wenn Sie Lust haben, melden Sie sich. Wenn nicht, auch gut.
              </span>
            </p>
            <p className="text-muted-foreground mt-6 text-[14.5px] leading-relaxed">
              Wir machen das, weil wir gut darin sind, kurze ehrliche Audits zu
              schreiben — und weil sich daraus immer wieder schöne Projekte
              ergeben. Ihre Zeit nehmen wir nicht in Anspruch, wenn Sie sie
              nicht hergeben.
            </p>
            <Link
              href="/anfrage"
              className="text-foreground mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
            >
              Lieber direkt anfragen
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
          __html: JSON.stringify([serviceLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

function AuditItem({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <li className="border-border/40 flex items-start gap-4 border-b pb-5 last:border-b-0">
      <span className="border-border/60 text-foreground/70 mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-foreground text-lg font-medium tracking-[-0.01em]">
          {title}
        </p>
        <p className="text-muted-foreground mt-1.5 text-[14.5px] leading-relaxed">
          {body}
        </p>
      </div>
    </li>
  );
}
