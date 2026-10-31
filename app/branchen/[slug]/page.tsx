import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { BODY_OFFSET, SectionHead } from "@/components/marketing/home-sections";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import {
  BRANCHEN,
  getAllBrancheSlugs,
  getBrancheBySlug,
} from "@/lib/branchen-data";
import { getPost, JOURNAL_BY_BRANCHE } from "@/lib/journal-data";
import { getStandorteForBranche } from "@/lib/standorte-data";

function JournalHinweis({ brancheSlug }: { brancheSlug: string }) {
  const postSlug = JOURNAL_BY_BRANCHE[brancheSlug];
  if (!postSlug) return null;
  const post = getPost(postSlug);
  if (!post) return null;

  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6">
        <Link href={`/journal/${post.slug}`} className="group block max-w-3xl">
          <p className="text-muted-foreground text-[12px] font-medium">
            Aus dem Journal · {post.readingMinutes} Min
          </p>
          <h2 className="serif text-foreground mt-3 text-2xl leading-[1.2] tracking-[-0.01em] text-balance group-hover:underline sm:text-3xl">
            {post.title}
          </h2>
        </Link>
      </div>
    </section>
  );
}

/**
 * Stadtteil-Hinweise: zeigt Hamburger Standorte, in denen diese
 * Branche zu den `empfohleneBranchen` gehört. Bidirektionales
 * Cross-Linking — Standort-Seiten zeigen ihre Top-Branchen, hier
 * laufen die Branchen-Seiten zurück auf passende Stadtteile.
 *
 * Wird nicht gerendert, wenn keine Standorte diese Branche im
 * `empfohleneBranchen`-Feld haben. So bleiben Branchen ohne
 * lokale Konzentration sauber.
 */
function StandortHinweise({ brancheSlug }: { brancheSlug: string }) {
  const standorte = getStandorteForBranche(brancheSlug);
  if (standorte.length === 0) return null;

  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6">
        <h2 className="text-muted-foreground text-[12px] font-medium">
          In Hamburg besonders gefragt in
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {standorte.map((st) => (
            <li key={st.slug}>
              <Link
                href={`/standorte/${st.slug}`}
                className="border-border/70 hover:border-foreground/40 inline-flex rounded-full border px-4 py-1.5 text-[14px] transition-colors"
              >
                {st.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

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

  const title = `Website für ${branche.label} — aus Hamburg`;
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

  /* JSON-LD: Service-Schema + BreadcrumbList als Array. Service
   * beschreibt das branche-spezifische Angebot, BreadcrumbList
   * gibt Google die hierarchische Position für Rich-Results-
   * Breadcrumbs in den SERPs. */
  const serviceLd = {
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
        name: "Branchen",
        item: "https://www.sitalo.de/branchen",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: branche.label,
        item: `https://www.sitalo.de/branchen/${branche.slug}`,
      },
    ],
  };

  /* FAQPage-Schema aus den branche-spezifischen FAQs — schaltet
   * auf der SERP-Seite expandable FAQ-Snippets unter dem normalen
   * Treffer frei. */
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: branche.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const jsonLd = [serviceLd, breadcrumbLd, faqLd];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section={`Branchen › ${branche.label}`} />

      <main id="main" tabIndex={-1} className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="aurora pointer-events-none absolute inset-0 -z-10"
          >
            <span />
            <span />
            <span />
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-12 pb-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <EditorialEyebrow>Branche</EditorialEyebrow>
              <h1 className="mt-5 text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
                Website für{" "}
                <span className="serif-italic text-muted-foreground font-normal">
                  {branche.label}.
                </span>
              </h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
                {branche.detailHeadline}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href={`/anfrage?branche=${branche.inquirySlug}&paket=${branche.recommendedPackage}`}
                  className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
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
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgb(15_25_50/0.4)] ring-1 ring-black/5">
                <Image
                  src={branche.image.src}
                  alt={branche.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </section>

        {/* Einordnung: ein Absatz, darunter typischer Aufbau als Chips */}
        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <p className="serif text-foreground max-w-3xl text-2xl leading-[1.35] tracking-[-0.01em] text-balance sm:text-3xl">
              {branche.detailIntro[0]}
            </p>
            <h2 className="text-muted-foreground mt-10 text-[12px] font-medium">
              Typischer Aufbau
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {branche.typicalPages.map((page) => (
                <li
                  key={page}
                  className="border-border/70 bg-card rounded-full border px-4 py-1.5 text-[14px]"
                >
                  {page}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Was dabei wichtig ist */}
        <section className="border-border/40 bg-secondary/30 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <SectionHead label="Schwerpunkte" title="Worauf es ankommt." />
            <ul
              className={`mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 ${BODY_OFFSET}`}
            >
              {branche.features.map((feat) => (
                <li
                  key={feat.title}
                  className="border-border/70 bg-card rounded-2xl border p-5 sm:p-6"
                >
                  <h3 className="flex gap-2.5 text-[17px] font-semibold tracking-tight">
                    <Check
                      className="text-gold mt-1 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    {feat.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-[14.5px] leading-relaxed">
                    {feat.body}
                  </p>
                </li>
              ))}
            </ul>
            <div className={`mt-6 ${BODY_OFFSET}`}>
              <div className="border-border/70 bg-card flex flex-col items-start gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <p className="text-[15px]">
                  Für {branche.label} empfehlen wir meist das{" "}
                  <span className="font-semibold capitalize">
                    {branche.recommendedPackage}
                  </span>
                  -Paket.
                </p>
                <Link
                  href={`/pakete#${branche.recommendedPackage}`}
                  className="text-foreground inline-flex items-center gap-1.5 text-[14px] font-medium underline-offset-4 hover:underline"
                >
                  Paket ansehen{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Branchen-FAQ */}
        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <SectionHead label="Fragen" title="Häufige Fragen." />
            <div
              className={`divide-border/60 mt-10 divide-y lg:mt-14 ${BODY_OFFSET}`}
            >
              {branche.faq.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground text-xl transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 text-[14.5px] leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <JournalHinweis brancheSlug={branche.slug} />
        <StandortHinweise brancheSlug={branche.slug} />

        {/* Weitere Branchen */}
        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6">
            <h2 className="text-muted-foreground text-[12px] font-medium">
              Weitere Branchen
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {otherBranchen.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/branchen/${other.slug}`}
                    className="border-border/70 hover:border-foreground/40 inline-flex rounded-full border px-4 py-1.5 text-[14px] transition-colors"
                  >
                    {other.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-foreground text-background relative overflow-hidden">
          <div
            aria-hidden="true"
            className="aurora aurora-dark pointer-events-none absolute inset-0"
          >
            <span />
            <span />
            <span />
          </div>
          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
            <h2 className="serif text-3xl leading-tight text-balance sm:text-5xl">
              Klingt nach Ihrem Betrieb?{" "}
              <span className="serif-italic text-background/70">
                Schreiben Sie uns.
              </span>
            </h2>
            <Link
              href={`/anfrage?branche=${branche.inquirySlug}&paket=${branche.recommendedPackage}`}
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
