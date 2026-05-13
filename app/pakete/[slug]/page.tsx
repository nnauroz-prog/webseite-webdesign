import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  PAKETE,
  getAllPaketSlugs,
  getPaketBySlug,
} from "@/lib/pakete-data";

export function generateStaticParams() {
  return getAllPaketSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paket = getPaketBySlug(slug);
  if (!paket) return {};

  const title = `${paket.name}-Paket — Website ${paket.setup} | Sitalo Hamburg`;
  const description = paket.description;
  return {
    title,
    description,
    alternates: { canonical: `/pakete/${paket.slug}` },
    openGraph: { type: "article", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PaketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paket = getPaketBySlug(slug);
  if (!paket) notFound();

  const otherPakete = PAKETE.filter((p) => p.slug !== paket.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${paket.name}-Webdesign-Paket`,
    description: paket.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Sitalo Webdesign",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: paket.setup.replace(/[^\d]/g, ""),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "EUR",
        price: paket.monthly.replace(/[^\d]/g, ""),
        billingDuration: "P1M",
      },
    },
    url: `https://www.sitalo.de/pakete/${paket.slug}`,
  };

  const dark = paket.highlight === true;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Breadcrumb + Hero */}
        <section
          className={
            dark
              ? "bg-foreground text-background relative overflow-hidden"
              : "border-border/40 border-b"
          }
        >
          {dark ? (
            <div
              aria-hidden="true"
              className="bg-gold/15 pointer-events-none absolute -top-32 right-[8%] h-[28rem] w-[28rem] rounded-full blur-3xl"
            />
          ) : null}
          <div className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
            <nav
              aria-label="Breadcrumb"
              className={
                dark
                  ? "text-background/55 text-sm"
                  : "text-muted-foreground text-sm"
              }
            >
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className={
                      dark
                        ? "hover:text-background transition-colors"
                        : "hover:text-foreground transition-colors"
                    }
                  >
                    Sitalo
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/pakete"
                    className={
                      dark
                        ? "hover:text-background transition-colors"
                        : "hover:text-foreground transition-colors"
                    }
                  >
                    Pakete
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  className={dark ? "text-background" : "text-foreground"}
                  aria-current="page"
                >
                  {paket.name}
                </li>
              </ol>
            </nav>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
              <div>
                {paket.badge ? (
                  <span className="bg-gold/90 text-foreground inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                    {paket.badge}
                  </span>
                ) : null}
                <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[6rem]">
                  {paket.name}
                  <br />
                  <span
                    className={
                      dark
                        ? "serif-italic text-background/65 font-normal"
                        : "serif-italic text-muted-foreground font-normal"
                    }
                  >
                    {paket.detailHeadline}
                  </span>
                </h1>
                <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={`/anfrage?paket=${paket.slug}`}
                    className={
                      dark
                        ? "bg-background text-foreground hover:bg-background/90 group inline-flex h-14 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
                        : "bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
                    }
                  >
                    {paket.name} anfragen
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/pakete"
                    className={
                      dark
                        ? "text-background inline-flex h-14 items-center text-base font-medium underline-offset-[6px] hover:underline"
                        : "text-foreground inline-flex h-14 items-center text-base font-medium underline-offset-[6px] hover:underline"
                    }
                  >
                    Pakete vergleichen
                  </Link>
                </div>
              </div>
              <div className="lg:pl-8 lg:pt-8">
                <p
                  className={
                    dark
                      ? "text-background/65 text-[11px] font-medium uppercase tracking-[0.25em]"
                      : "text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]"
                  }
                >
                  Preis
                </p>
                <p className="mt-4 text-6xl font-semibold tracking-[-0.03em] sm:text-7xl">
                  {paket.setup}
                </p>
                <p
                  className={
                    dark
                      ? "text-background/65 mt-2 text-base"
                      : "text-muted-foreground mt-2 text-base"
                  }
                >
                  einmalig
                </p>
                <p
                  className={
                    dark
                      ? "text-background/85 mt-6 text-xl"
                      : "text-foreground/85 mt-6 text-xl"
                  }
                >
                  + {paket.monthly}
                </p>
                <p
                  className={
                    dark
                      ? "text-background/65 mt-1 text-sm"
                      : "text-muted-foreground mt-1 text-sm"
                  }
                >
                  laufende Betreuung
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
            <div className="space-y-8">
              {paket.detailIntro.map((paragraph, i) => (
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

        {/* What's included + What's not */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Was enthalten ist
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
                  Sie bekommen.
                </h2>
                <ul className="divide-border/60 mt-8 divide-y">
                  {paket.contents.map((c) => (
                    <li
                      key={c}
                      className="text-foreground/85 flex items-baseline gap-4 py-3 text-[15px] leading-relaxed sm:text-base"
                    >
                      <span className="text-muted-foreground/60 font-mono text-xs">
                        ✓
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Was nicht enthalten ist
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
                  <span className="serif-italic text-muted-foreground font-normal">
                    Ehrlich gesagt.
                  </span>
                </h2>
                <ul className="divide-border/60 mt-8 divide-y">
                  {paket.limits.map((l) => (
                    <li
                      key={l}
                      className="text-muted-foreground flex items-baseline gap-4 py-3 text-[15px] leading-relaxed"
                    >
                      <span className="text-muted-foreground/40 font-mono text-xs">
                        —
                      </span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-8 max-w-md text-sm leading-relaxed">
                  Was hier fehlt, gibt's im nächsthöheren Paket. Wechseln
                  ist jederzeit möglich, ohne Neuaufbau.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* After launch */}
        <section className="bg-secondary/40 border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Nach dem Launch
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                  Was{" "}
                  <span className="serif-italic text-muted-foreground font-normal">
                    danach passiert.
                  </span>
                </h2>
              </div>
              <ul className="divide-border/60 divide-y">
                {paket.afterLaunch.map((item) => (
                  <li
                    key={item}
                    className="text-foreground/85 py-4 text-[15px] leading-relaxed sm:text-base"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Recommended for */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Typische Beispiele
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
              Wer mit{" "}
              <span className="serif-italic text-muted-foreground font-normal">
                {paket.name}
              </span>{" "}
              meist gut fährt.
            </h2>
            <ul className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {paket.recommendedFor.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/branchen/${r.slug}`}
                    className="border-border/60 hover:border-foreground/40 hover:bg-secondary/40 group flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all"
                  >
                    <span className="text-foreground text-[15px] font-medium tracking-tight">
                      {r.label}
                    </span>
                    <ArrowRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-all group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-12 max-w-2xl text-pretty text-[15px] leading-relaxed">
              Konkrete Beispiele aus diesem Paket:{" "}
              {paket.examples.join(" · ")}.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.4fr] lg:gap-24">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Fragen zum {paket.name}-Paket
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                  Was Kunden
                  <br />
                  <span className="serif-italic text-muted-foreground font-normal">
                    konkret fragen.
                  </span>
                </h2>
              </div>
              <dl className="divide-border/70 -mt-4 divide-y">
                {paket.faq.map((item) => (
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

        {/* Other packages */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Andere Pakete
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              {paket.name} passt nicht ganz?
            </h2>
            <ul className="mt-12 grid gap-3 sm:grid-cols-2">
              {otherPakete.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/pakete/${other.slug}`}
                    className="border-border/60 hover:border-foreground/40 hover:bg-secondary/40 group flex items-center justify-between gap-4 rounded-2xl border px-6 py-5 transition-all"
                  >
                    <div>
                      <p className="text-foreground text-lg font-medium tracking-tight">
                        {other.name}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {other.setup} · + {other.monthly}
                      </p>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-all group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closer */}
        <section>
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="serif text-foreground max-w-xl text-balance text-3xl leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                Klingt nach {paket.name}?{" "}
                <span className="serif-italic text-muted-foreground">
                  Schreiben Sie mir kurz.
                </span>
              </p>
              <Link
                href={`/anfrage?paket=${paket.slug}`}
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 shrink-0 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
              >
                {paket.name} anfragen
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
