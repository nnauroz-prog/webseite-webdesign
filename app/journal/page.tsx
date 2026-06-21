import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { JOURNAL_POSTS, formatDate } from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Essays aus dem Hamburger Atelier — Preis-Transparenz, Arbeitsweise, Lokales SEO, Gastronomie, Pflege, Migrationen.",
  alternates: {
    canonical: "/journal",
    types: { "application/rss+xml": "/journal/feed.xml" },
  },
};

/**
 * `/journal` — Editorial-Index.
 *
 * Im Layout Magazin-mäßig: erster Beitrag als großer Aufmacher,
 * der Rest als ruhige Liste mit Hairlines. Keine Bilder-Hero —
 * wir verkaufen Text, nicht Stockphotos.
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
      "Essays aus dem Hamburger Atelier — Preis-Transparenz, Arbeitsweise, lokales SEO.",
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
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20 lg:py-24">
            <div className="text-center">
              <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <span
                  aria-hidden="true"
                  className="bg-gold gold-pulse inline-block h-1 w-6"
                />
                Aus dem Atelier
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Journal.
              </h1>
              <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
                Beobachtungen aus dem Hamburger Atelier. Keine
                Listicles, keine SEO-Karneval-Tricks. Was uns bei
                echten Projekten aufgefallen ist und für andere
                nützlich sein könnte.
              </p>
            </div>
          </div>
        </section>

        {hero && (
          <section className="border-border/40 border-b">
            <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
              <Link
                href={`/journal/${hero.slug}`}
                className="group block"
              >
                <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
                  <span
                    aria-hidden="true"
                    className="bg-gold inline-block h-1 w-6"
                  />
                  Aktueller Beitrag · {formatDate(hero.publishedAt)} ·{" "}
                  {hero.readingMinutes} Min Lesezeit
                </p>
                <h2 className="text-foreground mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  {hero.title}
                </h2>
                <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-lg leading-relaxed">
                  {hero.dek}
                </p>
                <span className="text-foreground mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] group-hover:underline">
                  Beitrag lesen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section className="border-border/40 border-b">
            <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
              <div className="mb-10 flex items-baseline justify-between gap-4">
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                  Weitere Beiträge
                </p>
                <a
                  href="/journal/feed.xml"
                  className="text-muted-foreground hover:text-foreground font-mono text-[10px] uppercase tracking-[0.22em] underline-offset-4 transition-colors hover:underline"
                >
                  RSS
                </a>
              </div>
              <ul className="divide-border/40 divide-y">
                {rest.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/journal/${post.slug}`}
                      className="group flex flex-col gap-3 py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12 sm:py-9"
                    >
                      <div>
                        <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                          {formatDate(post.publishedAt)} · {post.readingMinutes} Min
                        </p>
                        <h3 className="text-foreground mt-3 text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty text-[15px] leading-relaxed">
                          {post.dek}
                        </p>
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground inline-flex shrink-0 items-center gap-2 text-[14px] font-medium transition-colors sm:self-center">
                        Lesen
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section>
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Aus der Praxis
            </p>
            <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug sm:text-3xl">
              Hat Sie was berührt?{" "}
              <span className="serif-italic text-muted-foreground">
                Wir reden gerne.
              </span>
            </p>
            <Link
              href="/termin"
              className="bg-foreground text-background hover:bg-foreground/90 group mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              30-Min-Termin buchen
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
          __html: JSON.stringify([blogLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}
