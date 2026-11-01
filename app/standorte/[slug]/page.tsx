import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Briefkarte } from "@/components/marketing/vertical-landing";
import { formatDate, getPost, JOURNAL_BY_STANDORT } from "@/lib/journal-data";
import {
  STANDORTE,
  getAllStandortSlugs,
  getStandortBySlug,
  type Standort,
} from "@/lib/standorte-data";

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

const ZAHLWORT: Record<number, string> = { 1: "Eine", 2: "Zwei", 3: "Drei", 4: "Vier", 5: "Fünf" };

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

  const title = `Website erstellen lassen ${standort.name} · Hamburg`;
  const description = `Website erstellen lassen in Hamburg-${standort.name}: individuell gestaltet, für Handy und Google optimiert, Festpreis ab 499 €, Test-Link vor dem Start.`;
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
        <Hero standort={standort} />
        <Viertel standort={standort} />
        <Branchen standort={standort} />
        <Weiter standort={standort} />
        <Briefkarte
          title={`Das erste Gespräch führen wir am Telefon oder bei Ihnen in ${standort.name}.`}
          inquiryHref={`/anfrage?ort=${standort.slug}`}
        >
          Den Festpreis bekommen Sie schriftlich, bevor wir anfangen. Vor dem Start schicken wir Ihnen einen Test-Link.
        </Briefkarte>
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
 * Kopf: Überschrift links, rechts die Karte mit dem Stadtteil markiert.
 * ---------------------------------------------------------------- */
function Hero({ standort }: { standort: Standort }) {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-6">
          <p className="label-mono text-muted-foreground">Webdesign in Hamburg-{standort.name}</p>
          <h1 className="mt-6 text-balance text-[2.4rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[3.75rem]">
            Website erstellen lassen in {standort.name}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[#33383a] sm:text-[18px]">
            {standort.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/anfrage?ort=${standort.slug}`} className="btn-signal grow sm:grow-0">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href="/website-erstellen-lassen" className="btn-line grow sm:grow-0">
              Kosten und Ablauf
            </Link>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <HamburgMap active={standort.slug} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Das Viertel: Fließtext, daneben Orte und eine Randnotiz.
 * ---------------------------------------------------------------- */
function Viertel({ standort }: { standort: Standort }) {
  return (
    <section className="border-border border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
            Webdesign für {standort.name}
          </h2>
          <p className="mt-8 text-pretty text-[20px] leading-[1.5] tracking-[-0.01em] sm:text-[22px]">
            {standort.intro}
          </p>
          <div className="mt-6 space-y-5">
            {standort.body.map((p, i) => (
              <p key={i} className="text-muted-foreground text-pretty text-[16.5px] leading-[1.7]">
                {p}
              </p>
            ))}
          </div>
        </div>
        <aside className="space-y-12 lg:col-span-4 lg:col-start-9 lg:pt-3">
          <div>
            <h2 className="label-mono text-muted-foreground">Orte im Viertel</h2>
            <ul className="border-foreground mt-4 border-t">
              {standort.anker.map((ank) => (
                <li key={ank} className="border-border border-b py-2.5 text-[15.5px]">
                  {ank}
                </li>
              ))}
            </ul>
          </div>
          <figure className="border-foreground border-l-2 pl-5">
            <figcaption className="label-mono text-muted-foreground">Beobachtung</figcaption>
            <blockquote className="mt-3 text-pretty text-[19px] leading-[1.45] tracking-[-0.01em]">
              {standort.pullQuote}
            </blockquote>
          </figure>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Passende Branchen als Register auf dunklem Grund: Überschrift
 * links, je Branche eine Zeile mit Begründung und Link.
 * ---------------------------------------------------------------- */
function Branchen({ standort }: { standort: Standort }) {
  const n = standort.empfohleneBranchen.length;
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
            {ZAHLWORT[n] ?? n} Branchen, die zu {standort.name} passen
          </h2>
          <p className="text-stahl-hell mt-6 max-w-xs text-[15.5px] leading-relaxed">
            Zu jeder Branche gibt es eine eigene Seite mit Musterseite und typischem Seitenplan.
          </p>
        </div>
        <ul className="border-background/40 border-t lg:col-span-8">
          {standort.empfohleneBranchen.map((b) => (
            <li key={b.slug} className="border-background/15 border-b">
              <Link
                href={`/branchen/${b.slug}`}
                className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-6 sm:grid-cols-[14rem_1fr_auto] sm:gap-x-8"
              >
                <h3 className="text-background text-[19px] leading-snug tracking-[-0.015em] underline-offset-4 group-hover:underline sm:text-[20px]">
                  {b.label}
                </h3>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 sm:order-last"
                  aria-hidden="true"
                />
                <p className="text-stahl-hell col-span-2 text-pretty text-[15.5px] leading-relaxed sm:col-span-1">
                  {b.warum}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Weiterlesen: Journal-Beitrag (falls vorhanden) und die übrigen
 * Stadtteile als Register.
 * ---------------------------------------------------------------- */
function Weiter({ standort }: { standort: Standort }) {
  const postSlug = JOURNAL_BY_STANDORT[standort.slug];
  const post = postSlug ? getPost(postSlug) : undefined;
  const andere = STANDORTE.filter((s) => s.slug !== standort.slug);

  return (
    <section className="bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        {post ? (
          <div className="lg:col-span-5">
            <h2 className="label-mono text-muted-foreground">Aus dem Journal · {formatDate(post.publishedAt)}</h2>
            <Link href={`/journal/${post.slug}`} className="group border-foreground mt-4 block border-t pt-4">
              <span
                className="block text-[24px] leading-tight tracking-[-0.02em] underline-offset-4 group-hover:underline sm:text-[28px]"
                style={{ fontStretch: "110%", fontWeight: 700 }}
              >
                {post.title}
              </span>
              <span className="text-muted-foreground mt-3 block max-w-md text-[15.5px] leading-relaxed">{post.dek}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold">
                Lesen, {post.readingMinutes} Min {ARROW}
              </span>
            </Link>
          </div>
        ) : null}
        <div className={post ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-12"}>
          <h2 className="label-mono text-muted-foreground">Weitere Stadtteile</h2>
          <ul
            className={`border-foreground mt-4 columns-2 gap-6 border-t sm:gap-8 ${post ? "" : "sm:columns-3 lg:columns-4"}`}
          >
            {andere.map((other) => (
              <li key={other.slug} className="break-inside-avoid">
                <Link
                  href={`/standorte/${other.slug}`}
                  className="border-border flex items-center justify-between gap-3 border-b py-2.5 text-[15.5px] underline-offset-4 hover:underline"
                >
                  {other.name}
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
