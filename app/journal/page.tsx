import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { JOURNAL_POSTS, formatDate } from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM } from "@/lib/sprechstunde-data";

export const metadata: Metadata = {
  title: "Journal · Webdesign-Wissen für Betriebe",
  description:
    "Texte von Sitalo aus Hamburg über Preise, Arbeitsweise, lokales SEO, Gastronomie, Pflege und den Umzug vom Baukasten.",
  alternates: {
    canonical: "/journal",
    types: { "application/rss+xml": "/journal/feed.xml" },
  },
};

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** Datum für die Tabellenspalte: 12.06.2026. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** „Neu“ nur, solange der Beitrag jünger als etwa einen Monat ist. Die
 *  Seite wird stündlich neu erzeugt, das Etikett veraltet also nicht. */
const NEU_TAGE = 30;
function istNeu(iso: string): boolean {
  const alter = Date.now() - new Date(`${iso}T12:00:00Z`).getTime();
  return alter >= 0 && alter < NEU_TAGE * 24 * 60 * 60 * 1000;
}

/**
 * `/journal` — Inhaltsverzeichnis wie in einer Zeitschrift.
 *
 * Kopf mit großem Titel und kurzer Einleitung, der neueste Beitrag als
 * Aufmacher über die volle Breite, die übrigen als Tabelle mit Datum,
 * Titel und Lesezeit. Keine Bilder: Hier geht es um Text.
 */
export default function JournalPage() {
  const [hero, ...rest] = JOURNAL_POSTS;

  // Blog-Schema mit den ersten 10 BlogPosting-Einträgen als
  // blogPosts-Array. Plus Breadcrumb.
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Sitalo Journal",
    description:
      "Texte von Sitalo aus Hamburg über Preise, Arbeitsweise und lokales SEO.",
    url: `${SITE_URL}/journal`,
    publisher: { "@id": `${SITE_URL}/#business` },
    inLanguage: "de-DE",
    blogPost: JOURNAL_POSTS.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.dek,
      datePublished: p.publishedAt,
      url: `${SITE_URL}/journal/${p.slug}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: `${SITE_URL}/journal`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Journal" />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Kopf */}
        <section>
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p className="label-mono text-muted-foreground">
                Sitalo · {JOURNAL_POSTS.length} Beiträge
              </p>
              <h1 className="mt-5 text-[3.4rem] leading-[0.92] tracking-[-0.045em] sm:text-[6rem] lg:text-[7rem]">
                Journal
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-muted-foreground text-pretty text-[16.5px] leading-relaxed">
                Längere Texte über das, was uns bei der Arbeit an Websites für kleine Betriebe auffällt. Zum Beispiel,
                was eine Website kostet und wann sie besser noch warten kann.
              </p>
              <a
                href="/journal/feed.xml"
                className="text-muted-foreground hover:text-foreground mt-4 inline-block font-mono text-[12.5px] underline-offset-4 hover:underline"
              >
                RSS-Feed abonnieren
              </a>
            </div>
          </div>
        </section>

        {/* Aufmacher */}
        {hero && (
          <section className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <Link
              href={`/journal/${hero.slug}`}
              className="group border-foreground grid gap-6 border-t-2 pt-6 pb-14 sm:pb-20 lg:grid-cols-12 lg:gap-8"
            >
              <p className="label-mono text-muted-foreground lg:col-span-3 lg:pt-3">
                {istNeu(hero.publishedAt) ? (
                  <span className="text-gold">Neu</span>
                ) : (
                  <span>Zuletzt erschienen</span>
                )}{" "}
                · {formatDate(hero.publishedAt)}
                <span className="mt-1 block">{hero.readingMinutes} Min Lesezeit</span>
              </p>
              <div className="min-w-0 lg:col-span-9">
                <h2 className="text-balance text-[2.6rem] leading-[0.98] tracking-[-0.038em] underline-offset-[6px] group-hover:underline sm:text-6xl lg:text-[4.4rem]">
                  {hero.title}
                </h2>
                <p className="text-foreground/80 mt-6 max-w-2xl text-pretty text-[18px] leading-relaxed sm:text-[19px]">
                  {hero.dek}
                </p>
                <span className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold">
                  Beitrag lesen {ARROW}
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Übrige Beiträge als Tabelle */}
        {rest.length > 0 && (
          <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6 sm:pb-24" aria-labelledby="weitere-titel">
            <div className="border-foreground flex items-baseline justify-between gap-4 border-t pt-4 pb-3">
              <h2 id="weitere-titel" className="label-mono text-muted-foreground">
                Ältere Beiträge
              </h2>
              <span className="label-mono text-muted-foreground hidden sm:inline">Lesezeit</span>
            </div>
            <ul>
              {rest.map((post) => (
                <li key={post.slug} className="border-border border-t">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="group grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)_4rem] sm:py-8"
                  >
                    <span className="text-muted-foreground font-mono text-[13px] tabular-nums sm:pt-2">
                      <time dateTime={post.publishedAt}>{shortDate(post.publishedAt)}</time>
                      <span className="sm:hidden"> · {post.readingMinutes} Min</span>
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-balance text-[1.45rem] leading-[1.12] tracking-[-0.022em] underline-offset-4 group-hover:underline sm:text-[1.85rem]">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 max-w-2xl text-pretty text-[15.5px] leading-relaxed">
                        {post.dek}
                      </p>
                    </div>
                    <span className="text-muted-foreground hidden text-right font-mono text-[13px] tabular-nums sm:block sm:pt-2">
                      {post.readingMinutes} Min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Schluss */}
        <section className="bg-card border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-balance text-[1.8rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
                Fragen zu einem Beitrag beantworten wir am Telefon
              </h2>
              <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-[16.5px] leading-relaxed">
                Jeden ersten Donnerstag von {SPRECHSTUNDE_BEGINN_HHMM} bis {SPRECHSTUNDE_ENDE_HHMM} Uhr ist unsere
                offene Sprechstunde. Wer nicht so lange warten will, ruft einfach an oder schreibt an{" "}
                <a href="mailto:info@sitalo.de" className="text-foreground underline underline-offset-4">
                  info@sitalo.de
                </a>
                .
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
              <Link href="/sprechstunde" className="btn-line">
                Zur Sprechstunde {ARROW}
              </Link>
              <a
                href="tel:+491607621876"
                className="font-mono text-[15px] font-medium tabular-nums underline-offset-4 hover:underline"
              >
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
          __html: JSON.stringify([blogLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}
