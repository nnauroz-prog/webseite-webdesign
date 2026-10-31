import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Minus } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { BODY_OFFSET, SectionHead } from "@/components/marketing/home-sections";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PAKETE, getAllPaketSlugs, getPaketBySlug } from "@/lib/pakete-data";

const SECTION = "border-border/50 border-t";
const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";

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

  const title = `Website-Paket ${paket.name}: ${paket.setup} Festpreis`;
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

  /* JSON-LD: Service-Schema (mit Offer + FAQPage) + BreadcrumbList
   * als Array. Service beschreibt das Paket-Angebot mit Preis und FAQ,
   * BreadcrumbList gibt Google die Hierarchie für Rich-Results in
   * den SERPs. */
  const serviceLd = {
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
        name: "Pakete",
        item: "https://www.sitalo.de/pakete",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: paket.name,
        item: `https://www.sitalo.de/pakete/${paket.slug}`,
      },
    ],
  };

  /* FAQPage-Schema aus den paket-spezifischen FAQs — schaltet auf
   * der SERP-Seite expandable FAQ-Snippets unter dem normalen
   * Treffer frei. */
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: paket.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const jsonLd = [serviceLd, breadcrumbLd, faqLd];

  const dark = paket.highlight === true;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section={`Pakete › ${paket.name}`} />

      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero: Name und Kernaussage links, Preis rechts */}
        <section className={dark ? "bg-foreground text-background" : ""}>
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <p
                className={`flex items-center gap-2.5 text-[13px] font-medium ${dark ? "text-background/60" : "text-muted-foreground"}`}
              >
                <span
                  aria-hidden="true"
                  className="bg-gold inline-block h-px w-8"
                />
                {paket.badge ? `Paket · ${paket.badge}` : "Paket"}
              </p>
              <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
                {paket.name}.{" "}
                <span
                  className={
                    dark ? "text-background/60" : "text-muted-foreground"
                  }
                >
                  {paket.detailHeadline}
                </span>
              </h1>
              <p
                className={`mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg ${dark ? "text-background/75" : "text-muted-foreground"}`}
              >
                {paket.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href={`/anfrage?paket=${paket.slug}`}
                  className={`group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight ${
                    dark
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {paket.name} anfragen
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/pakete"
                  className={`inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline ${dark ? "text-background" : "text-foreground"}`}
                >
                  Pakete vergleichen
                </Link>
              </div>
            </div>
            <div
              className={`self-end border-t pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 ${dark ? "border-background/15" : "border-border"}`}
            >
              <p
                className={`text-[13px] font-medium ${dark ? "text-background/60" : "text-muted-foreground"}`}
              >
                Festpreis
              </p>
              <p className="serif mt-3 text-6xl leading-none tracking-[-0.03em] lining-nums">
                {paket.setup}
              </p>
              <p
                className={`mt-2 text-[14px] ${dark ? "text-background/65" : "text-muted-foreground"}`}
              >
                einmalig, zzgl. MwSt.
              </p>
              <p className="mt-5 text-lg font-medium">+ {paket.monthly}</p>
              <p
                className={`mt-1 text-[14px] ${dark ? "text-background/65" : "text-muted-foreground"}`}
              >
                Hosting, Updates und Betreuung
              </p>
            </div>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Überblick"
              title={`Für wen ${paket.name} gemacht ist.`}
            />
            <div
              className={`mt-10 max-w-3xl space-y-5 lg:mt-14 ${BODY_OFFSET}`}
            >
              {paket.detailIntro.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-foreground text-xl leading-[1.5] tracking-[-0.01em] text-pretty"
                      : "text-foreground/80 text-[16px] leading-[1.7] text-pretty"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className={`${SECTION} bg-secondary/30`}>
          <div className={INNER}>
            <SectionHead
              label="Leistungsumfang"
              title="Was enthalten ist, und was nicht."
            />
            <div
              className={`mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:mt-14 ${BODY_OFFSET}`}
            >
              <div>
                <h3 className="text-[15px] font-semibold">Enthalten</h3>
                <ul className="border-border mt-3 border-t">
                  {paket.contents.map((c) => (
                    <li
                      key={c}
                      className="border-border flex gap-3 border-b py-3 text-[15px] leading-relaxed"
                    >
                      <Check
                        className="text-gold mt-1 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold">Nicht enthalten</h3>
                <ul className="border-border mt-3 border-t">
                  {paket.limits.map((l) => (
                    <li
                      key={l}
                      className="border-border text-muted-foreground flex gap-3 border-b py-3 text-[15px] leading-relaxed"
                    >
                      <Minus
                        className="mt-1 h-4 w-4 shrink-0 opacity-60"
                        aria-hidden="true"
                      />
                      {l}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-4 text-[13.5px]">
                  Was hier fehlt, gibt es im nächsthöheren Paket. Wechseln geht
                  jederzeit, ohne Neuaufbau.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead label="Nach dem Start" title="Was danach passiert." />
            <div className={`mt-10 lg:mt-14 ${BODY_OFFSET}`}>
              <ol className="border-border border-t">
                {paket.afterLaunch.map((item, i) => (
                  <li
                    key={item}
                    className="border-border flex gap-4 border-b py-4 text-[15.5px] leading-relaxed"
                  >
                    <span className="text-gold pt-0.5 text-[13px] font-semibold tabular-nums">
                      0{i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className={`${SECTION} bg-secondary/30`}>
          <div className={INNER}>
            <SectionHead
              label="Passt zu"
              title={`Wer mit ${paket.name} gut fährt.`}
            />
            <div className={`mt-10 lg:mt-14 ${BODY_OFFSET}`}>
              <ul className="flex flex-wrap gap-2">
                {paket.recommendedFor.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/branchen/${r.slug}`}
                      className="border-border/70 bg-card hover:border-foreground/40 inline-flex rounded-full border px-4 py-2 text-[14px] transition-colors"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 max-w-2xl text-[14.5px] leading-relaxed text-pretty">
                Typische Projekte: {paket.examples.join(" · ")}.
              </p>
            </div>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Fragen"
              title={`Fragen zum ${paket.name}-Paket.`}
            />
            <div
              className={`divide-border/60 border-border/60 mt-10 divide-y border-y lg:mt-14 ${BODY_OFFSET}`}
            >
              {paket.faq.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <h3 className="text-[16px] leading-snug font-medium sm:text-[17px]">
                      {item.q}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground text-xl transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Andere Pakete"
              title={`${paket.name} passt nicht ganz?`}
            />
            <div className={`mt-10 lg:mt-14 ${BODY_OFFSET}`}>
              <ul className="border-border border-t">
                {otherPakete.map((other) => (
                  <li key={other.slug} className="border-border border-b">
                    <Link
                      href={`/pakete/${other.slug}`}
                      className="group flex items-baseline justify-between gap-6 py-5"
                    >
                      <span className="text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                        {other.name}
                      </span>
                      <span className="text-muted-foreground text-[14px] tabular-nums">
                        {other.setup} · + {other.monthly}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
            <h2 className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
              Klingt nach {paket.name}?{" "}
              <span className="text-background/65">Schreiben Sie uns.</span>
            </h2>
            <Link
              href={`/anfrage?paket=${paket.slug}`}
              className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              {paket.name} anfragen
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
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
