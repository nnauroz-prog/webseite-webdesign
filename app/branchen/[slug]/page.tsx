import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  BRANCHEN,
  getAllBrancheSlugs,
  getBrancheBySlug,
  type Branche,
} from "@/lib/branchen-data";
import { getPost, JOURNAL_BY_BRANCHE } from "@/lib/journal-data";
import { getPaketBySlug } from "@/lib/pakete-data";
import { getStandorteForBranche } from "@/lib/standorte-data";

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

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

  const title = `Website für ${branche.label} erstellen lassen`;
  const lead =
    branche.shortBody.length > 100 ? branche.shortBody.split(". ")[0].replace(/\.$/, "") + "." : branche.shortBody;
  const description = `${lead} Website zum Festpreis ab 499 €, persönlich aus Hamburg.`;
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

  const inquiryHref = `/anfrage?branche=${branche.inquirySlug}&paket=${branche.recommendedPackage}`;

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

  /* FAQPage-Schema aus den branche-spezifischen FAQs. Die Fragen
   * stehen auf der Seite offen, Schema und Text stimmen überein. */
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
        <Hero branche={branche} inquiryHref={inquiryHref} />
        <Einordnung branche={branche} />
        <Schwerpunkte branche={branche} />
        <Fragen branche={branche} />
        <Weiter branche={branche} />
        <Schluss inquiryHref={inquiryHref} />
      </main>

      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Kopf: links Überschrift und Einordnung, rechts die Musterseite.
 * ---------------------------------------------------------------- */
function Hero({ branche, inquiryHref }: { branche: Branche; inquiryHref: string }) {
  const paket = getPaketBySlug(branche.recommendedPackage);
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-6">
          <p className="label-mono text-muted-foreground">Website erstellen lassen</p>
          <h1 className="mt-6 text-balance text-[2.3rem] leading-[0.98] tracking-[-0.038em] hyphens-auto sm:text-[3.4rem] lg:text-[3.75rem]">
            Website für {branche.label}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[#33383a] sm:text-[18px]">
            {branche.shortBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={inquiryHref} className="btn-signal grow sm:grow-0">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href="/website-erstellen-lassen" className="btn-line grow sm:grow-0">
              Kosten und Ablauf
            </Link>
          </div>
          {paket ? (
            <p className="text-muted-foreground mt-6 text-[14.5px] leading-relaxed">
              Meist empfohlen:{" "}
              <Link
                href={`/pakete#${paket.slug}`}
                className="text-foreground font-semibold underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
              >
                {paket.name}
              </Link>
              , <span className="tabular-nums">{paket.setup}</span> einmalig und{" "}
              <span className="tabular-nums">{paket.monthly.replace(/\s*\/\s*Monat$/, "")}</span> im Monat.
            </p>
          ) : null}
        </div>
        {branche.image ? (
          <figure className="lg:col-span-6 lg:col-start-7">
            <div className="bg-secondary border-border relative aspect-[4/3] w-full overflow-hidden border shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)]">
              <Image
                src={branche.image.src}
                alt={branche.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="label-mono text-muted-foreground mt-3 text-[11px]">
              Musterseite · {branche.label}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Einordnung als Fließtext, daneben der typische Seitenplan als
 * kleiner Strukturbaum.
 * ---------------------------------------------------------------- */
function Einordnung({ branche }: { branche: Branche }) {
  const [root, ...pages] = branche.typicalPages;
  return (
    <section className="border-border border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-7">
          {branche.detailIntro.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-pretty text-[21px] leading-[1.45] tracking-[-0.01em] sm:text-[24px]"
                  : "text-muted-foreground text-pretty text-[16.5px] leading-relaxed sm:text-[17px]"
              }
            >
              {p}
            </p>
          ))}
        </div>
        <div className="bg-card border-border self-start border p-5 sm:p-6 lg:col-span-4 lg:col-start-9">
          <h2 className="label-mono text-muted-foreground">Typischer Seitenplan</h2>
          <p className="mt-5 flex items-center gap-3 text-[15.5px] font-semibold">
            <span aria-hidden="true" className="bg-foreground inline-block h-[9px] w-[9px] shrink-0" />
            {root}
          </p>
          <ul className="border-foreground/35 mt-1 ml-[4px] border-l">
            {pages.map((page) => (
              <li
                key={page}
                className="before:bg-foreground/35 last:after:bg-card relative py-1.5 pl-5 text-[15px] leading-snug before:absolute before:top-[16px] before:left-0 before:h-px before:w-3.5 last:after:absolute last:after:top-[17px] last:after:bottom-0 last:after:-left-px last:after:w-px"
              >
                {page}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Schwerpunkte als Verzeichnis mit Haarlinien.
 * ---------------------------------------------------------------- */
function Schwerpunkte({ branche }: { branche: Branche }) {
  return (
    <section className="bg-card border-border border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] hyphens-auto sm:text-5xl lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          Was eine Website für {branche.label} braucht
        </h2>
        <dl className="border-foreground border-t lg:col-span-8">
          {branche.features.map((feat) => (
            <div
              key={feat.title}
              className="border-border grid gap-2 border-b py-5 sm:grid-cols-[15rem_1fr] sm:gap-8 sm:py-6"
            >
              <dt className="text-[17px] font-semibold leading-snug tracking-[-0.01em]">{feat.title}</dt>
              <dd className="text-muted-foreground text-pretty text-[15.5px] leading-relaxed">{feat.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Fragen offen gesetzt, zweispaltig.
 * ---------------------------------------------------------------- */
function Fragen({ branche }: { branche: Branche }) {
  return (
    <section className="border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
          Fragen aus der Branche
        </h2>
        <dl className="mt-12 grid gap-x-10 gap-y-10 sm:mt-14 md:grid-cols-2">
          {branche.faq.map((item) => (
            <div key={item.q} className="border-foreground border-t pt-5">
              <dt className="text-[18px] font-semibold leading-snug tracking-[-0.01em]">{item.q}</dt>
              <dd className="text-muted-foreground mt-3 text-pretty text-[15.5px] leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Weiterlesen: Journal, Stadtteilseiten und die übrigen Branchen als
 * schlichtes Register in drei Spalten.
 * ---------------------------------------------------------------- */
function Weiter({ branche }: { branche: Branche }) {
  const postSlug = JOURNAL_BY_BRANCHE[branche.slug];
  const post = postSlug ? getPost(postSlug) : undefined;
  const standorte = getStandorteForBranche(branche.slug);
  const andere = BRANCHEN.filter((b) => b.slug !== branche.slug);

  const linkRow =
    "border-border flex items-center justify-between gap-4 border-b py-2.5 text-[15.5px] hover:underline underline-offset-4";

  return (
    <section className="bg-card border-border border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-20 md:grid-cols-3 md:gap-8">
        {post ? (
          <div>
            <h2 className="label-mono text-muted-foreground">Aus dem Journal</h2>
            <Link href={`/journal/${post.slug}`} className="group border-foreground mt-4 block border-t pt-4">
              <span className="block text-[21px] leading-tight tracking-[-0.02em] group-hover:underline underline-offset-4" style={{ fontStretch: "108%", fontWeight: 680 }}>
                {post.title}
              </span>
              <span className="text-muted-foreground mt-2 block text-[14.5px] leading-relaxed">{post.dek}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[14.5px] font-semibold">
                Lesen, {post.readingMinutes} Min {ARROW}
              </span>
            </Link>
          </div>
        ) : null}
        {standorte.length > 0 ? (
          <div>
            <h2 className="label-mono text-muted-foreground">Stadtteilseiten Hamburg</h2>
            <ul className="border-foreground mt-4 border-t">
              {standorte.map((st) => (
                <li key={st.slug}>
                  <Link href={`/standorte/${st.slug}`} className={linkRow}>
                    {st.name}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className={!post && standorte.length === 0 ? "md:col-span-3" : !post || standorte.length === 0 ? "md:col-span-2" : ""}>
          <h2 className="label-mono text-muted-foreground">Weitere Branchen</h2>
          <ul
            className={`border-foreground mt-4 border-t ${
              !post || standorte.length === 0 ? "sm:columns-2 sm:gap-8" : ""
            }`}
          >
            {andere.map((other) => (
              <li key={other.slug} className="break-inside-avoid">
                <Link href={`/branchen/${other.slug}`} className={linkRow}>
                  {other.label}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: Satz links, Kontaktwege rechts.
 * ---------------------------------------------------------------- */
function Schluss({ inquiryHref }: { inquiryHref: string }) {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl lg:col-span-7">
          Aus Ihren Stichpunkten schreiben wir die Texte für die Seite.
        </h2>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-stahl-hell text-[16.5px] leading-relaxed">
            Schicken Sie uns, was Sie anbieten und für wen. Wir antworten meist am selben Werktag. Den Festpreis bekommen
            Sie schriftlich, bevor wir anfangen.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={inquiryHref} className="btn-signal grow sm:grow-0">
              Anfrage schreiben {ARROW}
            </Link>
            <a href="tel:+491607621876" className="btn-line grow tabular-nums sm:grow-0">
              0160 7621876
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
