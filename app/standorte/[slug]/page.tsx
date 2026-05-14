import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MagneticButton } from "@/components/marketing/magnetic-button";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  STANDORTE,
  getAllStandortSlugs,
  getStandortBySlug,
} from "@/lib/standorte-data";

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

  const title = `Webdesign ${standort.name} — aus dem Atelier nebenan | Sitalo`;
  const description = `${standort.tagline} Hand-gebaute Websites für ${standort.name}er Unternehmen — schnell, persönlich, auf den Stadtteil zugeschnitten.`;
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

  /* JSON-LD: LocalBusiness mit areaServed = dieser Stadtteil. */
  const jsonLd = {
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
    telephone: "+4915224437370",
    email: "info@sitalo.de",
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section={`Standorte · ${standort.name}`} />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-border/40 relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px]"
          />
          <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
            <nav
              aria-label="Breadcrumb"
              className="text-muted-foreground text-sm"
            >
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Sitalo
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/standorte"
                    className="hover:text-foreground transition-colors"
                  >
                    Standorte
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground" aria-current="page">
                  {standort.name}
                </li>
              </ol>
            </nav>

            <div className="mt-10 max-w-4xl">
              <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <span
                  aria-hidden="true"
                  className="bg-gold gold-pulse inline-block h-1 w-6"
                />
                Webdesign in Hamburg-{standort.name}
              </p>
              <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-5xl lg:text-[5.25rem] lg:tracking-[-0.04em]">
                Websites für{" "}
                <span className="serif-italic text-muted-foreground font-normal">
                  {standort.name}.
                </span>
              </h1>
              <p className="text-foreground/80 mt-7 max-w-2xl text-pretty text-lg leading-relaxed sm:mt-9 sm:text-xl">
                {standort.tagline}
              </p>
              <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <MagneticButton
                  href={`/anfrage?ort=${standort.slug}`}
                  className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
                >
                  Anfrage starten
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </MagneticButton>
                <Link
                  href="/pakete"
                  className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
                >
                  Pakete & Preise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Intro + Body — editorial prose */}
        <section className="border-border/40 border-b bg-secondary/40">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <div>
                <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em]">
                  <span
                    aria-hidden="true"
                    className="bg-ink-olive inline-block h-1 w-5"
                  />
                  Über den Stadtteil
                </p>
                <p className="serif-italic text-foreground/80 mt-6 text-pretty text-xl leading-snug sm:text-2xl">
                  {standort.intro}
                </p>
                <div className="mt-8">
                  <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
                    Anker im Viertel
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {standort.anker.map((ank) => (
                      <li
                        key={ank}
                        className="border-border/60 bg-background text-foreground/80 inline-flex items-center rounded-full border px-3 py-1.5 text-[13px]"
                      >
                        {ank}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                {standort.body.map((p, i) => (
                  <p
                    key={i}
                    className="text-foreground/85 text-pretty text-[16px] leading-[1.7] sm:text-[17px]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pull-Quote */}
        <section className="bg-foreground text-background relative overflow-hidden">
          <div
            aria-hidden="true"
            className="bg-gold/15 pointer-events-none absolute -top-32 right-[8%] h-[28rem] w-[28rem] rounded-full blur-[120px]"
          />
          <div className="relative mx-auto w-full max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="bg-gold/60 gold-pulse inline-block h-1 w-8"
              />
              <p className="text-background/55 text-[11px] font-medium uppercase tracking-[0.3em]">
                Beobachtung
              </p>
            </div>
            <blockquote className="relative mt-8 max-w-4xl">
              <span
                aria-hidden="true"
                className="serif text-gold/40 absolute -top-6 -left-1 text-[4.5rem] leading-none sm:-top-8 sm:-left-3 sm:text-[6rem] lg:-top-10 lg:-left-4 lg:text-[8rem]"
              >
                „
              </span>
              <p className="serif text-balance text-2xl leading-[1.25] tracking-[-0.015em] sm:text-3xl lg:text-[2.75rem] lg:leading-[1.15]">
                {standort.pullQuote}
              </p>
            </blockquote>
          </div>
        </section>

        {/* Branchen-Empfehlung */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="max-w-3xl">
              <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <span
                  aria-hidden="true"
                  className="bg-gold gold-pulse inline-block h-1 w-6"
                />
                Was für {standort.name} besonders passt
              </p>
              <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
                Drei Branchen, die wir
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  hier besonders gut kennen.
                </span>
              </h2>
            </div>
            <ul className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {standort.empfohleneBranchen.map((b, i) => (
                <li key={b.slug}>
                  <Link
                    href={`/branchen/${b.slug}`}
                    className="border-border/60 bg-card/70 ring-foreground/5 group flex h-full flex-col overflow-hidden rounded-3xl border p-7 ring-1 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="serif text-ink-petrol/60 text-[3rem] font-normal leading-none tracking-[-0.04em] sm:text-[3.5rem]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="text-muted-foreground mt-2 h-5 w-5 transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                    <h3 className="text-foreground mt-6 text-2xl font-medium leading-snug tracking-[-0.015em]">
                      {b.label}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-pretty text-[15px] leading-relaxed">
                      {b.warum}
                    </p>
                    <p className="text-muted-foreground mt-5 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em]">
                      Branche im Detail
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Weitere Stadtteile */}
        <section className="bg-secondary/40 border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Weitere Stadtteile
            </p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {otherStandorte.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/standorte/${other.slug}`}
                    className="border-border/60 hover:border-foreground/40 hover:bg-background group flex items-center justify-between gap-4 rounded-2xl border bg-background/60 px-5 py-4 transition-all"
                  >
                    <span className="text-foreground text-[15px] font-medium tracking-tight">
                      {other.name}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final-CTA */}
        <section>
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="serif text-foreground max-w-xl text-balance text-3xl leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                Lohnt sich {standort.name}?{" "}
                <span className="serif-italic text-muted-foreground">
                  Schreiben Sie uns kurz.
                </span>
              </p>
              <MagneticButton
                href={`/anfrage?ort=${standort.slug}`}
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 shrink-0 items-center rounded-full px-8 text-base font-medium tracking-tight"
              >
                Anfrage starten
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
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
