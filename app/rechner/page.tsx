import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { TcoRechner } from "@/components/marketing/tco-rechner";
import { SITE_URL } from "@/lib/site";
import { calculate, formatEur } from "@/lib/tco-logic";

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
 * Annahmen des Rechners, direkt aus lib/tco-logic.ts abgeleitet:
 * Euro über 36 Monate, Aufbau-Stunden (Profil „neu") und Minuten
 * Eigenarbeit je Änderung. So stimmt die Tabelle immer mit dem
 * Rechner überein.
 */
function annahmen() {
  const ohne = calculate({ profile: "neu", updatesPerMonth: 0, hourlyValue: 0 });
  const eine = calculate({ profile: "neu", updatesPerMonth: 1, hourlyValue: 0 });
  return ohne.map((r) => {
    const proAenderung = ((eine.find((e) => e.slug === r.slug)?.hoursCost ?? r.hoursCost) - r.hoursCost) / 36;
    return {
      slug: r.slug,
      label: r.label,
      highlight: r.highlight,
      euro: formatEur(r.euroCost),
      aufbau: r.hoursCost > 0 ? `${Math.round(r.hoursCost)} h` : "–",
      pflege: proAenderung > 0 ? `${Math.round(proAenderung * 60)} Min.` : "–",
    };
  });
}

/**
 * `/rechner` — 3-Jahres-Kostenrechner.
 *
 * Die Logik steht offen in lib/tco-logic.ts, ohne versteckte
 * Aufschläge. Wer die Eigenzeit auf 0 €/h setzt, sieht den günstigsten
 * Baukasten vorn.
 */
export default function RechnerPage() {
  const zeilen = annahmen();
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero crumb="3-Jahres-Rechner" eyebrow="Kostenrechner · 36 Monate" title="Was kostet eine Website über drei Jahre?">
          Sitalo neben Wix, Squarespace, Jimdo und dem Selbstbau mit ChatGPT. Ihre eigene Arbeitszeit zählt mit, zu dem
          Stundenwert, den Sie im Rechner einstellen.
        </PageHero>

        <section>
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
            <TcoRechner />
          </div>
        </section>

        {/* Annahmen offen als Tabelle */}
        <section id="annahmen" className="border-border scroll-mt-20 border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Womit der Rechner rechnet
              </h2>
              <div className="text-muted-foreground mt-5 space-y-4 text-[15.5px] leading-relaxed">
                <p>
                  Die Monatspreise sind gerundete Tarife der Anbieter. Wir rechnen dabei nicht mit dem günstigsten
                  Einstiegstarif, sondern mit einem, der für eine Firmenseite üblich ist. Die Einstiegspreise stehen im{" "}
                  <Link href="/vergleich" className="text-foreground underline underline-offset-4">
                    Vergleich
                  </Link>
                  . Die Stunden für Aufbau und Pflege schätzen wir, sie gelten für jemanden, der zum ersten Mal eine Website
                  baut.
                </p>
                <p>
                  Bei einem Umzug rechnen wir 30 % mehr Aufbauzeit. Wer mit Code umgehen kann, braucht beim Selbstbau 30 %
                  weniger, im Baukasten dafür 40 % mehr.
                </p>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-7 lg:col-start-6">
              <table className="w-full border-collapse text-left text-[14.5px]">
                <caption className="sr-only">Annahmen des 3-Jahres-Rechners</caption>
                <thead>
                  <tr className="border-foreground border-t-[3px]">
                    <th scope="col" className="label-mono text-muted-foreground py-3 tracking-[0.08em] sm:tracking-[0.14em] pr-3 text-[11px] font-medium">
                      Weg
                    </th>
                    <th scope="col" className="label-mono text-muted-foreground py-3 tracking-[0.08em] sm:tracking-[0.14em] pr-3 text-right text-[11px] font-medium">
                      Euro<span className="hidden sm:inline"> in 3 Jahren</span>
                    </th>
                    <th scope="col" className="label-mono text-muted-foreground py-3 tracking-[0.08em] sm:tracking-[0.14em] pr-3 text-right text-[11px] font-medium">
                      Aufbau
                    </th>
                    <th scope="col" className="label-mono text-muted-foreground py-3 tracking-[0.08em] sm:tracking-[0.14em] text-right text-[11px] font-medium">
                      Pflege<span className="hidden sm:inline"> je Änderung</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {zeilen.map((z) => (
                    <tr key={z.slug} className={`border-border border-t ${z.highlight ? "bg-card" : ""}`}>
                      <th scope="row" className={`py-4 pr-3 font-semibold ${z.highlight ? "pl-3" : ""}`}>
                        {z.label}
                      </th>
                      <td className="py-4 pr-3 text-right whitespace-nowrap">{z.euro}</td>
                      <td className="py-4 pr-3 text-right whitespace-nowrap">{z.aufbau}</td>
                      <td className={`py-4 text-right whitespace-nowrap ${z.highlight ? "pr-3" : ""}`}>{z.pflege}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-muted-foreground mt-4 text-[13px] leading-relaxed">
                Bei Sitalo sind Aufbau und kleine Änderungen im Preis, eigene Zeit brauchen Sie nur für Ihre Inhalte.
                Gerechnet wird mit Business und drei Änderungen im Monat. Stellen Sie mehr ein, rechnet der Rechner jede
                weitere mit einer halben Stunde zum Stundensatz oder nimmt Premium beziehungsweise Studio, wenn das
                günstiger ist. Preise der Anbieter ändern sich, prüfen Sie im Zweifel dort nach.
              </p>
            </div>
          </div>
        </section>

        {/* Termin */}
        <section className="bg-card border-foreground border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Die Zahlen lieber gemeinsam durchgehen
              </h2>
              <p className="text-muted-foreground mt-5 max-w-xl text-[16.5px] leading-relaxed">
                Im Erstgespräch rechnen wir mit Ihren Angaben nach. Es dauert bis zu 30 Minuten, meist reicht eine
                Viertelstunde, am Telefon, per Video oder in Hamburg, und kostet nichts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
              <Link href="/termin" className="btn-signal grow sm:grow-0">
                Termin buchen <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="tel:+491607621876" className="text-[15px] font-semibold whitespace-nowrap underline-offset-4 hover:underline">
                0160 7621876
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
