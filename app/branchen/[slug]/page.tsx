import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  BRANCHEN,
  getAllBrancheSlugs,
  getBrancheBySlug,
} from "@/lib/branchen-data";

/**
 * Pre-render every branche page statically. Adding a new branche to
 * `lib/branchen-data.ts` automatically creates a new static page.
 */
export function generateStaticParams() {
  return getAllBrancheSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const branche = getBrancheBySlug(slug);
  if (!branche) return {};

  const title = `Website für ${branche.label} — aus Hamburg | Sitalo`;
  const description = `${branche.shortBody} Persönlich gemacht, in Hamburg.`;
  return {
    title,
    description,
    alternates: { canonical: `/branchen/${branche.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      images: branche.image
        ? [
            {
              url: branche.image.src,
              width: 1600,
              height: 1000,
              alt: branche.image.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: branche.image ? [branche.image.src] : undefined,
    },
  };
}

export default async function BranchePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branche = getBrancheBySlug(slug);
  if (!branche) notFound();

  const otherBranchen = BRANCHEN.filter((b) => b.slug !== branche.slug);

  /* JSON-LD: Service schema describing this branche-specific offering. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Webdesign für ${branche.label}`,
    description: branche.shortBody,
    provider: {
      "@type": "LocalBusiness",
      name: "Sitalo Webdesign",
      areaServed: "DE",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Webdesign",
    url: `https://www.sitalo.de/branchen/${branche.slug}`,
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Breadcrumb + Hero */}
        <section className="border-border/40 border-b">
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
                    href="/branchen"
                    className="hover:text-foreground transition-colors"
                  >
                    Branchen
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground" aria-current="page">
                  {branche.label}
                </li>
              </ol>
            </nav>

            <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Branche · {branche.label}
                </p>
                <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-[5.25rem]">
                  <span className="serif-italic text-muted-foreground font-normal">
                    {branche.detailHeadline}
                  </span>
                </h1>
                <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={`/anfrage?branche=${branche.inquirySlug}`}
                    className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
                  >
                    Diese Seite anfragen
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/pakete"
                    className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
                  >
                    Pakete & Preise
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              {branche.image ? (
                <div className="relative mx-auto w-full max-w-[640px]">
                  <div
                    aria-hidden="true"
                    className="bg-gold/15 absolute -inset-10 -z-10 rounded-[3rem] blur-[80px]"
                  />
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.3)] ring-1 ring-black/5">
                    <Image
                      src={branche.image.src}
                      alt={branche.image.alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 640px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Atmosphäre-Bild — emotional anchor zwischen Hero und Intro */}
        {branche.atmosphere ? (
          <section className="border-border/40 border-b">
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9] lg:aspect-[3/1]">
              <Image
                src={branche.atmosphere.src}
                alt={branche.atmosphere.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </section>
        ) : null}

        {/* Intro — editorial pull-quote style */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
            <div className="space-y-8">
              {branche.detailIntro.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "serif text-foreground text-balance text-2xl leading-[1.4] tracking-[-0.01em] sm:text-3xl lg:text-[2.25rem]"
                      : "text-foreground/80 max-w-3xl text-pretty text-lg leading-relaxed sm:text-xl"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Typical pages + features — two-column editorial */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Typischer Aufbau
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  Diese Seiten
                  <br />
                  <span className="serif-italic text-muted-foreground font-normal">
                    bauen wir.
                  </span>
                </h2>
                <ol className="border-border/60 mt-10 border-t">
                  {branche.typicalPages.map((page, i) => (
                    <li
                      key={page}
                      className="border-border/60 flex items-baseline gap-4 border-b py-3 text-[15px] sm:text-base"
                    >
                      <span className="text-muted-foreground/70 font-mono text-xs tracking-[0.15em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-foreground/85">{page}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Was dabei wichtig ist
                </p>
                <ul className="divide-border/60 mt-6 divide-y">
                  {branche.features.map((feat) => (
                    <li key={feat.title} className="py-6 sm:py-8">
                      <h3 className="text-foreground text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                        {feat.title}
                      </h3>
                      <p className="text-foreground/75 mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed sm:text-base">
                        {feat.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended package — quiet pull-out */}
        <section className="bg-secondary/40 border-border/40 border-b">
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Empfehlung
                </p>
                <p className="serif text-foreground mt-4 text-balance text-2xl leading-[1.25] tracking-[-0.015em] sm:text-3xl lg:text-4xl">
                  Für {branche.label} empfehlen wir meist das{" "}
                  <span className="serif-italic text-muted-foreground capitalize">
                    {branche.recommendedPackage}-Paket
                  </span>{" "}
                  als Ausgangspunkt.
                </p>
              </div>
              <Link
                href={`/pakete#${branche.recommendedPackage}`}
                className="border-foreground text-foreground hover:bg-foreground hover:text-background group inline-flex h-12 shrink-0 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-colors"
              >
                Paket ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Branche-specific FAQ */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.4fr] lg:gap-24">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Fragen aus der {branche.label.split(" ")[0]}-Praxis
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  Was Kunden
                  <br />
                  <span className="serif-italic text-muted-foreground font-normal">
                    typischerweise fragen.
                  </span>
                </h2>
              </div>
              <dl className="divide-border/70 -mt-4 divide-y">
                {branche.faq.map((item) => (
                  <details key={item.q} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.01em] sm:text-xl">
                      {item.q}
                      <span className="text-muted-foreground transition-transform group-open:rotate-45">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="text-muted-foreground mt-4 max-w-2xl text-[15px] leading-relaxed text-pretty">
                      {item.a}
                    </p>
                  </details>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Related branches */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Weitere Branchen
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              Was sonst noch zu uns kommt.
            </h2>
            <ul className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {otherBranchen.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/branchen/${other.slug}`}
                    className="border-border/60 hover:border-foreground/40 hover:bg-secondary/40 group flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all"
                  >
                    <span className="text-foreground text-[15px] font-medium tracking-tight">
                      {other.label}
                    </span>
                    <ArrowRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-all group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA closer */}
        <section>
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="serif text-foreground max-w-xl text-balance text-3xl leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                Klingt nach Ihrer Branche?{" "}
                <span className="serif-italic text-muted-foreground">
                  Schreiben Sie uns kurz.
                </span>
              </p>
              <Link
                href={`/anfrage?branche=${branche.inquirySlug}`}
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 shrink-0 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
              >
                Anfrage starten
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
