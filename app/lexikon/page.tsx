import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { LEXIKON, type LexikonEntry } from "@/lib/lexikon-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lexikon — Webbegriffe in Klartext",
  description:
    "Hosting, SSL, CMS, SEO, DSGVO: die wichtigsten Webbegriffe in Alltagsdeutsch erklärt, jeweils mit dem Satz, der für Ihre Entscheidung zählt.",
  alternates: { canonical: "/lexikon" },
};

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/**
 * `/lexikon` — Glossar in Klartext.
 *
 * Kopf, dann ein Register nach Anfangsbuchstaben wie hinten in einem
 * Nachschlagewerk, dann die Einträge zweispaltig: links der Begriff,
 * rechts Erklärung und der Satz, der für die Entscheidung zählt.
 * DefinedTermSet-JSON-LD für Suchmaschinen.
 */
export default function LexikonPage() {
  const sorted = [...LEXIKON].sort((a, b) => a.term.localeCompare(b.term, "de"));

  // Register: Begriffe nach Anfangsbuchstaben gruppiert.
  const register = new Map<string, LexikonEntry[]>();
  for (const e of sorted) {
    const letter = e.term.charAt(0).toUpperCase();
    register.set(letter, [...(register.get(letter) ?? []), e]);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/lexikon#glossar`,
    name: "Sitalo Lexikon — Webbegriffe in Klartext",
    description:
      "Glossar für lokale Unternehmen: Hosting, SSL, CMS, SEO, DSGVO und mehr, in Alltagsdeutsch erklärt.",
    hasDefinedTerm: sorted.map((e) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/lexikon#${e.slug}`,
      name: e.term,
      description: e.plain,
    })),
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero crumb="Lexikon" eyebrow={`Glossar · ${sorted.length} Begriffe`} title="Webbegriffe in Klartext">
          Hier erklären wir die Wörter, die Ihnen in Angeboten für Websites begegnen. Zu jedem Begriff steht der eine Satz,
          der für Ihre Entscheidung zählt.
        </PageHero>

        {/* Register nach Anfangsbuchstaben */}
        <section className="border-border border-b">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
            <nav aria-labelledby="register-titel">
              <h2 id="register-titel" className="label-mono text-muted-foreground">
                Register
              </h2>
              <div className="mt-6 columns-2 gap-x-8 sm:columns-3 lg:columns-5">
                {[...register.entries()].map(([letter, entries]) => (
                  <div key={letter} className="mb-5 break-inside-avoid">
                    <p className="text-gold font-mono text-[13px] font-medium" aria-hidden="true">
                      {letter}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {entries.map((e) => (
                        <li key={e.slug}>
                          <a
                            href={`#${e.slug}`}
                            className="text-[15px] leading-snug underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
                          >
                            {e.term}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </section>

        {/* Einträge */}
        <section>
          <dl className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            {sorted.map((e) => (
              <div
                key={e.slug}
                id={e.slug}
                className="border-border grid scroll-mt-24 gap-4 border-b py-10 last:border-b-0 sm:py-14 lg:grid-cols-12 lg:gap-8"
              >
                <dt className="text-balance text-[1.7rem] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.1rem] lg:col-span-4" style={{ fontStretch: "112%" }}>
                  {e.term}
                </dt>
                <dd className="min-w-0 lg:col-span-7 lg:col-start-6">
                  <p className="text-foreground/85 text-pretty text-[16.5px] leading-[1.7]">{e.plain}</p>
                  <div className="bg-card border-foreground mt-6 border-l-[3px] px-5 py-4">
                    <p className="label-mono text-muted-foreground text-[11px]">Entscheidend ist</p>
                    <p className="mt-2 text-pretty text-[17px] font-semibold leading-snug tracking-[-0.01em]">
                      {e.bottomLine}
                    </p>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Schluss */}
        <section className="bg-card border-foreground border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
                Fehlt ein Begriff, schicken Sie ihn uns.
              </h2>
              <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-[16px] leading-relaxed">
                Sie bekommen eine Erklärung per Mail, und bei der nächsten Überarbeitung nehmen wir den Begriff ins Lexikon
                auf.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <a href="mailto:info@sitalo.de?subject=Lexikon-Frage" className="btn-signal grow sm:grow-0">
                Begriff per Mail schicken {ARROW}
              </a>
              <Link href="/check" className="btn-line grow sm:grow-0">
                Ladezeit Ihrer Seite testen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
