import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { LEXIKON } from "@/lib/lexikon-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lexikon — Webbegriffe in Klartext",
  description:
    "Hosting, SSL, CMS, SEO, DSGVO — die Begriffe, mit denen Agenturen einschüchtern, in ehrlichem Deutsch erklärt. Mit dem einen Satz, der für Ihre Entscheidung zählt.",
  alternates: { canonical: "/lexikon" },
};


/**
 * `/lexikon` — Klartext-Glossar.
 *
 * Service-Geste + Long-Tail-SEO: sechzehn Begriffe, mit denen
 * Agenturen lokale Inhaber regelmäßig einschüchtern, ehrlich
 * erklärt. Pro Begriff eine „Entscheidend ist"-Zeile — der eine
 * Satz, der für die Kaufentscheidung zählt.
 *
 * Form: alphabetisch sortierte Liste mit Anchor-Slugs, sticky
 * Begriffs-Register oben für schnellen Sprung. DefinedTermSet-
 * JSON-LD für Suchmaschinen.
 */
export default function LexikonPage() {
  const sorted = [...LEXIKON].sort((a, b) =>
    a.term.localeCompare(b.term, "de"),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/lexikon#glossar`,
    name: "Sitalo Lexikon — Webbegriffe in Klartext",
    description:
      "Glossar für lokale Unternehmen: Hosting, SSL, CMS, SEO, DSGVO und mehr, in ehrlichem Deutsch erklärt.",
    hasDefinedTerm: sorted.map((e) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/lexikon#${e.slug}`,
      name: e.term,
      description: e.plain,
    })),
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Lexikon" />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
            <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-10"
              />
              Sechzehn Begriffe · Klartext
            </p>
            <h1 className="serif text-foreground mt-8 text-balance text-5xl font-normal leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Lexikon.
            </h1>
            <p className="serif-italic text-muted-foreground mt-4 text-balance text-3xl leading-snug tracking-[-0.01em] sm:text-4xl">
              Webbegriffe, ohne Einschüchterung.
            </p>
            <div className="border-foreground/15 mt-12 border-l-2 pl-6">
              <p className="text-foreground/85 text-pretty text-[17px] leading-[1.7]">
                Hosting, SSL, CMS, SEO — Begriffe, mit denen sich gut
                Angst verkaufen lässt. Hier stehen sie in ehrlichem
                Deutsch, jeweils mit dem einen Satz, der für Ihre
                Entscheidung tatsächlich zählt. Keine Anmeldung, kein
                PDF, keine Gegenleistung.
              </p>
            </div>

            {/* Begriffs-Register für schnellen Sprung */}
            <nav
              aria-label="Begriffe"
              className="mt-12 flex flex-wrap gap-2"
            >
              {sorted.map((e) => (
                <a
                  key={e.slug}
                  href={`#${e.slug}`}
                  className="border-border/70 text-foreground/70 hover:border-foreground hover:text-foreground inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-medium transition-colors"
                >
                  {e.term}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="border-border/40 border-b">
          <dl className="divide-border/40 mx-auto w-full max-w-3xl divide-y px-6">
            {sorted.map((e) => (
              <div
                key={e.slug}
                id={e.slug}
                className="scroll-mt-24 py-14 sm:py-16"
              >
                <dt className="serif text-foreground text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
                  {e.term}
                </dt>
                <dd className="mt-6">
                  <p className="text-foreground/85 text-pretty text-[16.5px] leading-[1.7]">
                    {e.plain}
                  </p>
                  <p className="border-gold/40 mt-6 border-l-2 pl-5">
                    <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                      Entscheidend ist
                    </span>
                    <span className="serif-italic text-foreground mt-2 block text-balance text-xl leading-snug sm:text-[1.35rem]">
                      {e.bottomLine}
                    </span>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
            <p className="serif text-foreground text-balance text-3xl font-normal leading-[1.25] tracking-[-0.01em] sm:text-4xl">
              Ein Begriff fehlt,{" "}
              <span className="serif-italic text-muted-foreground">
                der Ihnen gerade Kopfzerbrechen macht?
              </span>
            </p>
            <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-[15.5px] leading-relaxed">
              Schreiben Sie uns den Begriff — wir antworten mit einer
              ehrlichen Erklärung und nehmen ihn beim nächsten
              Aktualisieren mit auf. Das Lexikon wächst aus echten
              Fragen, nicht aus Keyword-Listen.
            </p>
            <div className="border-border/40 mt-12 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <a
                href="mailto:info@sitalo.de?subject=Lexikon-Frage"
                className="text-foreground inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
              >
                Begriff einsenden
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/check"
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-tight"
              >
                Ladezeit live testen
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
