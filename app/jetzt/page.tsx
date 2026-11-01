import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { ATELIER_GERADE } from "@/lib/atelier-notes";
import { nextWorkdays } from "@/lib/calendar-availability";
import { formatDate, JOURNAL_POSTS } from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";
import {
  nextSprechstunden,
  SPRECHSTUNDE_BEGINN_HHMM,
  SPRECHSTUNDE_ENDE_HHMM,
} from "@/lib/sprechstunde-data";

export const metadata: Metadata = {
  title: "Jetzt — was bei Sitalo gerade ansteht",
  description:
    "Was bei Sitalo gerade ansteht: der nächste freie Tag für ein Erstgespräch, die nächste Sprechstunde und was wir zuletzt geschrieben haben.",
  alternates: { canonical: "/jetzt" },
};

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/**
 * `/jetzt` — Now-Page.
 *
 * Eine Seite, die sagt, was gerade ansteht, nicht was wir generell
 * anbieten. Zeigt nur Werte, die aus echten Daten berechnet werden:
 * den nächsten buchbaren Tag aus dem Terminkalender
 * (lib/calendar-availability.ts, dieselbe Quelle wie /termin), die
 * nächste Sprechstunde und die neuesten Journal-Texte. Kein festes
 * Stand-Datum und kein Zähler für freie Plätze, beides würde ohne
 * Pflege veralten. Aufbau: Kopf mit Aushang (Erstgespräch,
 * Sprechstunde), dann der Schreibtisch, dann das Journal.
 */
export default function JetztPage() {
  const sprechstunde = nextSprechstunden(1)[0];
  const latestPosts = JOURNAL_POSTS.slice(0, 2);
  const gerade = ATELIER_GERADE;
  const naechsterTag = nextWorkdays(15).find((d) => !d.isBlocked);
  const naechsterTagLabel = naechsterTag
    ? new Date(`${naechsterTag.iso}T12:00:00Z`).toLocaleDateString("de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Europe/Berlin",
      })
    : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Jetzt bei Sitalo",
    description:
      "Was bei Sitalo gerade ansteht: nächster freier Tag für ein Erstgespräch, nächste Sprechstunde, zuletzt geschrieben.",
    dateModified: JOURNAL_POSTS[0]?.publishedAt,
    author: { "@type": "Organization", name: "Sitalo Webdesign", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#business` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/jetzt` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jetzt",
        item: `${SITE_URL}/jetzt`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Jetzt" />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Kopf: links der Text, rechts der Aushang mit Erstgespräch und Sprechstunde */}
        <section>
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <p className="label-mono text-muted-foreground">Jetzt</p>
              <h1 className="mt-6 text-balance text-[2.5rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[4.25rem]">
                Was bei uns gerade ansteht
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-pretty text-[16.5px] leading-relaxed sm:text-lg">
                Hier steht, wann Sie das nächste Erstgespräch buchen können, wann die nächste Sprechstunde stattfindet
                und was auf dem Schreibtisch liegt. Den Starttermin für Ihre Seite nennen wir Ihnen im ersten Gespräch.
              </p>
            </div>

            <dl className="border-foreground self-start border-t-2 lg:col-span-5 lg:col-start-8 lg:mt-2">
              {naechsterTagLabel ? (
                <div className="border-border border-b py-6">
                  <dt className="label-mono text-muted-foreground">Nächster freier Tag für ein Erstgespräch</dt>
                  <dd className="mt-3">
                    <p
                      className="text-[1.75rem] leading-[1.1] tracking-[-0.03em] sm:text-[2.1rem]"
                      style={{ fontStretch: "112%", fontWeight: 740 }}
                    >
                      {naechsterTagLabel}
                    </p>
                    <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
                      Bis zu 30 Minuten, meist reicht eine Viertelstunde. Die Uhrzeit wählen Sie selbst.
                    </p>
                    <Link
                      href="/termin"
                      className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                    >
                      Termin buchen {ARROW}
                    </Link>
                  </dd>
                </div>
              ) : null}
              <div className="border-border border-b py-6">
                <dt className="label-mono text-muted-foreground">Nächste Sprechstunde</dt>
                <dd className="mt-3">
                  <p
                    className="text-[1.75rem] leading-[1.1] tracking-[-0.03em] sm:text-[2.1rem]"
                    style={{ fontStretch: "112%", fontWeight: 740 }}
                  >
                    {sprechstunde.longLabel}
                  </p>
                  <p className="text-muted-foreground mt-2 font-mono text-[13px] tabular-nums">
                    {SPRECHSTUNDE_BEGINN_HHMM}–{SPRECHSTUNDE_ENDE_HHMM} Uhr
                  </p>
                  <Link
                    href="/sprechstunde"
                    className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                  >
                    So läuft die Sprechstunde {ARROW}
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Schreibtisch: was abseits der Aufträge gerade dran ist */}
        {gerade.length > 0 ? (
          <section className="bg-card border-foreground border-t">
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
              <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem] lg:col-span-4">
                Abseits der Aufträge
              </h2>
              <dl className="lg:col-span-7 lg:col-start-6">
                {gerade.map((item, i) => (
                  <div
                    key={item.label}
                    className={`grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-8 ${i > 0 ? "border-border border-t" : "pt-1"}`}
                  >
                    <dt className="label-mono text-muted-foreground sm:pt-1">{item.label}</dt>
                    <dd className="text-pretty text-[16.5px] leading-[1.65]">{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {/* Zuletzt geschrieben */}
        <section className="border-border border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <h2 className="text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">Zuletzt im Journal</h2>
              <Link
                href="/journal"
                className="inline-flex items-center gap-1.5 pb-1 text-[15px] font-semibold underline-offset-4 hover:underline"
              >
                Alle Texte {ARROW}
              </Link>
            </div>
            <ul className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8">
              {latestPosts.map((post) => (
                <li key={post.slug} className="border-foreground border-t pt-5">
                  <Link href={`/journal/${post.slug}`} className="group block">
                    <span className="text-muted-foreground block font-mono text-[12px]">
                      {formatDate(post.publishedAt)} · {post.readingMinutes} Min. Lesezeit
                    </span>
                    <span className="mt-3 block text-balance text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.02em] underline-offset-4 group-hover:underline sm:text-[1.6rem]">
                      {post.title}
                    </span>
                    <span className="text-muted-foreground mt-3 block text-pretty text-[15.5px] leading-relaxed">
                      {post.dek}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}
