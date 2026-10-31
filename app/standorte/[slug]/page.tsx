import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { BODY_OFFSET, SectionHead } from "@/components/marketing/home-sections";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  STANDORTE,
  getAllStandortSlugs,
  getStandortBySlug,
} from "@/lib/standorte-data";
import { formatDate, getPost, JOURNAL_BY_STANDORT } from "@/lib/journal-data";

function StandortJournalHinweis({ standortSlug }: { standortSlug: string }) {
  const postSlug = JOURNAL_BY_STANDORT[standortSlug];
  if (!postSlug) return null;
  const post = getPost(postSlug);
  if (!post) return null;

  return (
    <section className="border-border/50 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <Link
          href={`/journal/${post.slug}`}
          className="group block lg:pl-[calc(25%+0.5rem)]"
        >
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[13px]">
            <span
              aria-hidden="true"
              className="bg-gold inline-block h-px w-10"
            />
            Aus dem Journal · {formatDate(post.publishedAt)}
          </p>
          <h2 className="text-foreground mt-4 max-w-3xl text-2xl leading-[1.15] font-semibold tracking-[-0.02em] text-balance group-hover:underline sm:text-3xl">
            {post.title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-[15.5px] leading-relaxed text-pretty">
            {post.dek}
          </p>
          <span className="text-foreground mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] group-hover:underline">
            Essay lesen · {post.readingMinutes} Min
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}

const SECTION = "border-border/50 border-t";
const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";

export function generateStaticParams() {
  return getAllStandortSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const standort = getStandortBySlug(slug);
  if (!standort) return {};

  const title = `Website erstellen lassen in Hamburg-${standort.name} · Webdesign`;
  const description = `Website erstellen lassen in ${standort.name}: individuell gestaltet, zum Festpreis ab 499 €, persönlich betreut aus Hamburg. ${standort.tagline}`;
  return {
    title,
    description,
    alternates: { canonical: `/standorte/${standort.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StandortPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const standort = getStandortBySlug(slug);
  if (!standort) notFound();

  const otherStandorte = STANDORTE.filter((s) => s.slug !== standort.slug);

  /* JSON-LD: LocalBusiness + BreadcrumbList als Array. LocalBusiness
   * verknüpft den Stadtteil mit Sitalo, BreadcrumbList gibt Google die
   * Hierarchie für Rich-Results-Breadcrumbs in den SERPs. */
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Sitalo Webdesign — ${standort.name}`,
    description: standort.tagline,
    url: `https://www.sitalo.de/standorte/${standort.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hamburg",
      addressRegion: standort.name,
      addressCountry: "DE",
    },
    areaServed: {
      "@type": "Place",
      name: `Hamburg ${standort.name}`,
    },
    telephone: "+491607621876",
    email: "info@sitalo.de",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sitalo",
        item: "https://www.sitalo.de/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Standorte",
        item: "https://www.sitalo.de/standorte",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: standort.name,
        item: `https://www.sitalo.de/standorte/${standort.slug}`,
      },
    ],
  };

  const jsonLd = [localBusinessLd, breadcrumbLd];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section={`Standorte › ${standort.name}`} />
      <main id="main" tabIndex={-1} className="flex-1">
        <section>
          <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20">
            <p className="text-muted-foreground flex items-center gap-2.5 text-[13px] font-medium">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-8"
              />
              Webdesign in Hamburg-{standort.name}
            </p>
            <h1 className="mt-5 max-w-4xl text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
              Website erstellen lassen{" "}
              <span className="text-muted-foreground">in {standort.name}.</span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
              {standort.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href={`/anfrage?ort=${standort.slug}`}
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              >
                Website anfragen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/website-erstellen-lassen"
                className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
              >
                Kosten und Ablauf
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Der Stadtteil"
              title={`Webdesign für ${standort.name}.`}
            />
            <div
              className={`mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_16rem] ${BODY_OFFSET}`}
            >
              <div className="space-y-5">
                <p className="text-foreground text-xl leading-[1.5] tracking-[-0.01em] text-pretty">
                  {standort.intro}
                </p>
                {standort.body.map((p, i) => (
                  <p
                    key={i}
                    className="text-foreground/85 text-[16px] leading-[1.7] text-pretty"
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-muted-foreground text-[13px] font-medium">
                  Anker im Viertel
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {standort.anker.map((ank) => (
                    <li
                      key={ank}
                      className="border-border/70 bg-card rounded-full border px-3 py-1.5 text-[13px]"
                    >
                      {ank}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className={INNER}>
            <SectionHead
              dark
              label="Beobachtung"
              title={`Was uns in ${standort.name} auffällt.`}
            />
            <p
              className={`text-background/85 mt-8 max-w-3xl text-xl leading-[1.5] text-pretty sm:text-2xl ${BODY_OFFSET}`}
            >
              {standort.pullQuote}
            </p>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Branchen"
              title={`Was in ${standort.name} besonders gefragt ist.`}
            />
            <div className={`mt-10 lg:mt-14 ${BODY_OFFSET}`}>
              <ul className="border-border border-t">
                {standort.empfohleneBranchen.map((b, i) => (
                  <li key={b.slug} className="border-border border-b">
                    <Link
                      href={`/branchen/${b.slug}`}
                      className="group flex items-start gap-5 py-6"
                    >
                      <span className="text-gold pt-1 text-[13px] tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block text-xl font-semibold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1">
                          Website für {b.label}
                        </span>
                        <span className="text-muted-foreground mt-1 block text-[14.5px] leading-relaxed">
                          {b.warum}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1.5 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <StandortJournalHinweis standortSlug={standort.slug} />

        <section className={`${SECTION} bg-secondary/30`}>
          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6">
            <h2 className="text-muted-foreground text-[13px] font-medium">
              Weitere Stadtteile
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {otherStandorte.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/standorte/${other.slug}`}
                    className="border-border/70 bg-card hover:border-foreground/40 inline-flex rounded-full border px-4 py-1.5 text-[14px] transition-colors"
                  >
                    {other.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
            <h2 className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
              Website für {standort.name}?{" "}
              <span className="text-background/65">Schreiben Sie uns.</span>
            </h2>
            <Link
              href={`/anfrage?ort=${standort.slug}`}
              className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              Website anfragen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
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
