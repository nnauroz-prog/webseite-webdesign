import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EmpfehlungWizard } from "@/components/marketing/empfehlung-wizard";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PAKETE } from "@/lib/pakete-data";
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

/** Kurzer Umfang je Paket, gleichlautend mit Abfahrtstafel und /pakete.
 *  Preise kommen aus lib/pakete-data.ts. */
const UMFANG: Record<string, string> = {
  starter: "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten",
  business: "Bis zu fünf Unterseiten, etwa für Leistungen, Team und Galerie",
  premium: "Eigene Struktur, Speisekarte, Angebote oder Termine pflegen Sie selbst",
  studio: "Eigene Gestaltung, bis zu drei Korrekturrunden und ein Treffen vor Ort",
};

/**
 * `/empfehlung` — interaktives Quiz-Tool.
 *
 * Hier ist das Quiz das Hauptziel, nicht ein vorgelagertes Hindernis
 * vor der Anfrage. Ergebnis ist eine Empfehlung mit nachvollziehbarer
 * Begründung. Darunter stehen alle Pakete als Preisaushang, für alle,
 * die lieber selbst vergleichen.
 *
 * Zustand wird in localStorage gespeichert — wer zurückkommt, fängt
 * nicht von vorn an.
 */
export default function EmpfehlungPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Paket-Empfehlung"
          eyebrow="Paket-Empfehlung"
          title="Fünf Fragen, dann wissen Sie, welches Paket passt."
        >
          Am Ende steht unsere Empfehlung mit Begründung. Ob sie für Ihren
          Betrieb wirklich passt, klären wir im ersten Telefonat. Ihre
          Antworten bleiben in Ihrem Browser.
        </PageHero>

        <section aria-label="Fragen">
          <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
            <EmpfehlungWizard />
          </div>
        </section>

        <section className="bg-card border-border border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <p className="label-mono text-muted-foreground">Selbst vergleichen</p>
                <h2 className="mt-5 text-balance text-[2rem] leading-[1.04] tracking-[-0.032em] sm:text-[2.5rem]">
                  Alle Pakete mit Preis
                </h2>
                <p className="text-muted-foreground mt-5 max-w-sm text-[15.5px] leading-relaxed text-pretty">
                  Die Preise sind Einstiegspreise. Den Festpreis für Ihre
                  Seite schicken wir Ihnen schriftlich, bevor wir anfangen.
                </p>
                <Link
                  href="/pakete"
                  className="text-foreground mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                >
                  Pakete im Detail
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="min-w-0 lg:col-span-8">
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">
                    Pakete mit einmaligem und monatlichem Preis
                  </caption>
                  <thead>
                    <tr className="border-foreground border-b-2">
                      <th scope="col" className="label-mono text-muted-foreground pb-3 font-medium">
                        Paket
                      </th>
                      <th scope="col" className="label-mono text-muted-foreground hidden pb-3 font-medium sm:table-cell">
                        Umfang
                      </th>
                      <th scope="col" className="label-mono text-muted-foreground pb-3 text-right font-medium">
                        Einmalig
                      </th>
                      <th scope="col" className="label-mono text-muted-foreground pb-3 pl-4 text-right font-medium">
                        Monatlich
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAKETE.map((p) => (
                      <tr key={p.slug} className="border-border border-b align-baseline">
                        <th scope="row" className="py-4 pr-4 font-normal">
                          <Link
                            href={`/pakete/${p.slug}`}
                            className="text-foreground text-[1.1rem] font-bold tracking-[-0.01em] [font-stretch:110%] underline-offset-4 hover:underline"
                          >
                            {p.name}
                          </Link>
                          <span className="text-muted-foreground mt-1 block text-[13.5px] leading-snug sm:hidden">
                            {UMFANG[p.slug]}
                          </span>
                        </th>
                        <td className="text-muted-foreground hidden py-4 pr-6 text-[14.5px] leading-snug sm:table-cell">
                          {UMFANG[p.slug]}
                        </td>
                        <td className="serif text-foreground py-4 text-right text-[1.05rem] whitespace-nowrap">
                          {p.setup}
                        </td>
                        <td className="serif text-foreground py-4 pl-4 text-right text-[1.05rem] whitespace-nowrap">
                          {p.monthly.replace(/\s*\/\s*Monat$/, "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
