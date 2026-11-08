import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Abschluss as AppleAbschluss, MehrLink } from "@/components/marketing/apple";
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
          aktionen={false}
          meta={
            <nav aria-label="Themen" className="flex flex-wrap">
              {GROUPS.map((g) => (
                <a key={g.id} href={`#${g.id}`}>
                  {g.label}
                </a>
              ))}
            </nav>
          }
        >
          Nach Themen sortiert. Steht Ihre Frage nicht dabei, rufen Sie an oder schreiben Sie uns.
        </PageHero>
        {GROUPS.map((g, i) => (
          <GroupSection key={g.id} group={g} hell={i % 2 === 1} />
        ))}
        <Closer />
      </main>
      <MarketingFooter crumb="Fragen" />
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
function GroupSection({ group, hell }: { group: FaqGroup; hell: boolean }) {
  return (
    <section
      id={group.id}
      aria-labelledby={`${group.id}-titel`}
      className={`scroll-mt-20 ${hell ? "flaeche-hell" : "flaeche-weiss"} py-16 sm:py-20 lg:py-24`}
    >
      <div className="mx-auto grid w-full max-w-[1068px] gap-6 px-[max(var(--rinne),env(safe-area-inset-left))] lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <p className="t-eyebrow text-[14px]">{group.items.length} Fragen</p>
          <h2
            id={`${group.id}-titel`}
            className="mt-2 text-balance text-[32px] leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
          >
            {group.label}
          </h2>
        </div>
        <div className={`karte ${hell ? "karte-weiss" : ""} min-w-0 divide-y divide-[var(--border)] px-6 sm:px-8 lg:col-span-8`}>
          {group.items.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] leading-snug tracking-[-0.01em] sm:text-[18.5px]">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="group-open:bg-gold-ink mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--hell-2)] text-[17px] leading-none transition-colors group-open:text-white"
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
    <AppleAbschluss
      id="kontakt"
      titel="Ihre Frage war nicht dabei"
      zwischen={
        <a href="tel:+491607621876" className="abschluss-nummer">
          0160&nbsp;7621876
        </a>
      }
      unter={
        <>
          Dann fragen Sie uns direkt. Mails beantworten wir meist am selben Werktag. Am ersten Donnerstag im Monat gibt
          es außerdem eine{" "}
          <Link href="/sprechstunde" className="text-[#f5f5f7] underline underline-offset-4">
            offene Telefonsprechstunde
          </Link>
          .
        </>
      }
      pille={{ href: "/anfrage", label: "Website anfragen" }}
      link={{ href: "/kontakt", label: "Alle Kontaktwege" }}
    >
      <MehrLink href="mailto:info@sitalo.de">info@sitalo.de</MehrLink>
    </AppleAbschluss>
  );
}
