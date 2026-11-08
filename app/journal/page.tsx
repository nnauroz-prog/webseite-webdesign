import type { Metadata } from "next";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { JOURNAL_POSTS, formatDate } from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM, uhrzeitKurz } from "@/lib/sprechstunde-data";

export const metadata: Metadata = {
  title: "Journal · Webdesign-Wissen für Betriebe",
  description:
    "Texte von Sitalo aus Hamburg über Preise, Arbeitsweise, lokales SEO, Gastronomie, Pflege und den Umzug vom Baukasten.",
  alternates: {
    canonical: "/journal",
    types: { "application/rss+xml": "/journal/feed.xml" },
  },
};


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
        {/* Kopf: zentriert wie eine Apple-Produktseite */}
        <section className="flaeche-weiss pt-12 pb-14 text-center sm:pt-16 sm:pb-16 lg:pt-20">
          <div className="inhalt">
            <p className="t-eyebrow">Sitalo · {JOURNAL_POSTS.length} Beiträge</p>
            <h1 className="t-hero mt-2">Journal</h1>
            <p className="t-unter mx-auto mt-4 sm:mt-5">
              Längere Texte über das, was uns bei der Arbeit an Websites für kleine Betriebe auffällt. Zum Beispiel,
              was eine Website kostet und wann sie besser noch warten kann.
            </p>
            <div className="aktionen mt-6">
              <MehrLink href="/journal/feed.xml" groesse="klein">
                RSS-Feed abonnieren
              </MehrLink>
            </div>
          </div>
        </section>

        {/* Aufmacher: große schwarze Kachel */}
        {hero && (
          <section className="flaeche-weiss pb-3">
            <div className="mx-auto max-w-[1200px] px-[max(var(--rinne),env(safe-area-inset-left))]">
              <article data-auftritt="skala" className="karte karte-schwarz karte-hover px-7 py-14 text-center sm:px-14 sm:py-20">
                <p className="t-eyebrow text-[14px]">
                  {istNeu(hero.publishedAt) ? "Neu" : "Zuletzt erschienen"} · {formatDate(hero.publishedAt)} ·{" "}
                  <span className="whitespace-nowrap">{hero.readingMinutes} Min Lesezeit</span>
                </p>
                <h2 className="t-abschnitt mx-auto mt-3 !max-w-[22ch] text-[#f5f5f7]">{hero.title}</h2>
                <p className="t-unter mx-auto mt-5">{hero.dek}</p>
                <div className="mt-8">
                  <MehrLink href={`/journal/${hero.slug}`} kontext={hero.title} groesse="unter" className="karte-link">
                    Beitrag lesen
                  </MehrLink>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Übrige Beiträge als Karten-Raster */}
        {rest.length > 0 && (
          <section className="flaeche-weiss pt-16 pb-20 sm:pb-24 lg:pt-20" aria-labelledby="weitere-titel">
            <div className="inhalt">
              <h2 id="weitere-titel" data-auftritt="titel" className="zweiton">
                <span>Ältere Beiträge.</span> <span className="grau">Ratgeber für Betriebe.</span>
              </h2>
            </div>
            <ul role="list" className="mx-auto mt-8 grid max-w-[1200px] gap-3 px-[max(var(--rinne),env(safe-area-inset-left))] sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-4">
              {rest.map((post) => (
                <li key={post.slug} className="flex">
                  <article data-auftritt="" className="karte karte-hover flex w-full flex-col p-7 sm:p-8">
                    <p className="text-muted-foreground text-[12px] leading-[1.33] font-semibold">
                      <time dateTime={post.publishedAt}>{shortDate(post.publishedAt)}</time> · {post.readingMinutes} Min
                      Lesezeit
                    </p>
                    <h3 className="t-karte mt-2 text-balance">{post.title}</h3>
                    <p className="text-muted-foreground mt-3 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty">
                      {post.dek}
                    </p>
                    <div className="mt-auto pt-6">
                      <MehrLink href={`/journal/${post.slug}`} kontext={post.title} groesse="klein" frei={false} className="karte-link">
                        Beitrag lesen
                      </MehrLink>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Schluss */}
        <section className="flaeche-hell abschnitt">
          <div className="inhalt abschnitt-kopf">
            <h2 data-auftritt="titel" className="t-abschnitt">
              Fragen zu einem Beitrag beantworten wir am Telefon
            </h2>
            <p className="t-unter">
              Jeden ersten Donnerstag im Monat von {uhrzeitKurz(SPRECHSTUNDE_BEGINN_HHMM)} bis{" "}
              {uhrzeitKurz(SPRECHSTUNDE_ENDE_HHMM)}&nbsp;Uhr ist unsere offene Sprechstunde. Wer nicht so lange
              warten will, ruft einfach an oder schreibt an{" "}
              <a href="mailto:info@sitalo.de" className="text-gold-ink underline underline-offset-2 hover:decoration-2">
                info@sitalo.de
              </a>
              .
            </p>
            <div className="aktionen mt-8">
              <Link href="/sprechstunde" className="btn-signal">
                Zur Sprechstunde
              </Link>
              <MehrLink href="tel:+491607621876" groesse="unter">
                0160&nbsp;7621876
              </MehrLink>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter crumb="Journal" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}
