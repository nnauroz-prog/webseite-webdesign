import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import type { FaqGroup } from "@/lib/faq-data";

import { FAQ_GROUPS } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Häufige Fragen rund um Ihre neue Website",
  description:
    "Antworten auf das, was Kunden uns am häufigsten fragen — Preise, Ablauf, Hosting, Google-Suche, Betreuung.",
  alternates: { canonical: "/faq" },
};

const GROUPS: FaqGroup[] = FAQ_GROUPS;

const QUESTION_COUNT = GROUPS.reduce((n, g) => n + g.items.length, 0);

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Fragen"
          eyebrow={`FAQ · ${QUESTION_COUNT} Antworten`}
          title="Häufige Fragen"
          meta={
            <nav aria-label="Themen" className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12.5px]">
              {GROUPS.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="text-background/80 hover:text-background underline-offset-4 hover:underline"
                >
                  {g.label}
                </a>
              ))}
            </nav>
          }
        >
          Nach Themen sortiert. Steht Ihre Frage nicht dabei, rufen Sie an oder schreiben Sie uns.
        </PageHero>
        {GROUPS.map((g, i) => (
          <GroupSection key={g.id} group={g} first={i === 0} />
        ))}
        <Closer />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Eine Themengruppe: links Name und Zahl der Fragen (auf breiten
 * Schirmen mitlaufend), rechts die Fragen zum Aufklappen.
 * ---------------------------------------------------------------- */
function GroupSection({ group, first }: { group: FaqGroup; first: boolean }) {
  return (
    <section id={group.id} aria-labelledby={`${group.id}-titel`} className={`scroll-mt-20 ${first ? "" : "border-border border-t"}`}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <p className="label-mono text-muted-foreground">{group.items.length} Fragen</p>
          <h2
            id={`${group.id}-titel`}
            className="mt-3 text-balance text-[1.75rem] leading-[1.05] tracking-[-0.028em] sm:text-[2.2rem]"
          >
            {group.label}
          </h2>
        </div>
        <div className="border-foreground divide-border min-w-0 divide-y border-t border-b lg:col-span-8">
          {group.items.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] leading-snug tracking-[-0.01em] sm:text-[18.5px]">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="border-foreground/70 group-open:bg-foreground group-open:text-background group-open:border-foreground mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border font-mono text-[15px] leading-none transition-colors"
                >
                  <span className="transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p
                className={`text-foreground/80 max-w-2xl text-pretty text-[15.5px] leading-relaxed sm:pr-12 ${item.link ? "pb-2" : "pb-6"}`}
              >
                {item.a}
              </p>
              {item.link ? (
                <Link
                  href={item.link.href}
                  className="text-foreground mb-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                >
                  {item.link.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Schluss: keine Frage als Überschrift, sondern die Wege, auf denen
 * eine fehlende Antwort am schnellsten kommt.
 * ---------------------------------------------------------------- */
function Closer() {
  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-6">
          <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">
            Ihre Frage war nicht dabei
          </h2>
          <p className="text-muted-foreground mt-5 max-w-md text-[16.5px] leading-relaxed">
            Dann fragen Sie uns direkt. Mails beantworten wir meist am selben Werktag. Am ersten Donnerstag im Monat
            gibt es außerdem eine{" "}
            <Link href="/sprechstunde" className="text-foreground underline underline-offset-4">
              offene Telefonsprechstunde
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <a
            href="tel:+491607621876"
            className="hover:text-gold block text-[2.1rem] leading-none tracking-[-0.03em] whitespace-nowrap transition-colors sm:text-[3rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160&nbsp;7621876
          </a>
          <a
            href="mailto:info@sitalo.de"
            className="border-gold mt-4 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold"
          >
            info@sitalo.de
          </a>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/anfrage" className="btn-signal">
              Website anfragen <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
            >
              Alle Kontaktwege <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
