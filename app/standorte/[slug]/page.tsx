import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MehrLink } from "@/components/marketing/apple";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import {
  Abschnitt,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { formatDate, getPost, JOURNAL_BY_STANDORT } from "@/lib/journal-data";
import { getPaketBySlug } from "@/lib/pakete-data";
import { ogFor } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import {
  STANDORTE,
  getAllStandortSlugs,
  getStandortBySlug,
  type Standort,
} from "@/lib/standorte-data";

const ZAHLWORT: Record<number, string> = {
  1: "Eine",
  2: "Zwei",
  3: "Drei",
  4: "Vier",
  5: "Fünf",
};

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

  const title = `Webdesign ${standort.name}: Website erstellen lassen`;
  const description = `Webdesign in Hamburg-${standort.name}: ${standort.metaHint}, Festpreis ${getPaketBySlug("starter")?.setup ?? "ab 599\u00A0€"}. Jetzt anfragen.`;
  return {
    title,
    description,
    alternates: { canonical: `/standorte/${standort.slug}` },
    openGraph: ogFor(`/standorte/${standort.slug}`, title, description),
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
    // Dienstleistung mit Einsatzgebiet statt eines eigenen Firmeneintrags
    // je Stadtteil: Sitalo hat dort kein Büro, das Büro ist eines.
    "@type": "Service",
    name: `Website erstellen lassen ${standort.inName}`,
    description: standort.tagline,
    url: `${SITE_URL}/standorte/${standort.slug}`,
    serviceType: "Webdesign",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": "Place",
      name: `Hamburg-${standort.name}`,
      containedInPlace: { "@type": "City", name: "Hamburg" },
    },
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
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen={[
            { href: "/standorte", label: "Standorte" },
            { label: standort.name },
          ]}
          eyebrow={`Webdesign in Hamburg-${standort.name}`}
          titel={`Website erstellen lassen ${standort.inName}`}
          unter={standort.tagline}
          aktionen={
            <>
              <Link
                href={`/anfrage?ort=${standort.slug}`}
                className="btn-signal btn-gross"
              >
                Anfrage schreiben
              </Link>
              <MehrLink href="/website-erstellen-lassen" groesse="unter">
                Festpreis und Ablauf
              </MehrLink>
            </>
          }
          bild={
            <div className="rounded-[18px] bg-white px-4 py-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10 sm:py-10">
              <HamburgMap active={standort.slug} />
            </div>
          }
        />
        <Viertel standort={standort} />
        <Branchen standort={standort} />
        <Weiter standort={standort} />
        <KontaktKarte
          id="abschluss"
          titel={`Das erste Gespräch führen wir am Telefon, per Video oder bei Ihnen ${standort.inName}.`}
          zeile="Den Festpreis bekommen Sie schriftlich, bevor wir anfangen. Vor dem Start schicken wir Ihnen einen Test-Link."
          pille={{
            href: `/anfrage?ort=${standort.slug}`,
            label: "Anfrage schreiben",
          }}
          link={{ href: "/standorte", label: "Alle Stadtteile" }}
          foto={{
            src: "/images/cafe-eimsbuettel.webp",
            alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Hamburg",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb={`${standort.name}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Das Viertel: Fließtext auf weißer Karte, daneben Orte und eine
 * Beobachtung als Randnotiz.
 * ---------------------------------------------------------------- */
function Viertel({ standort }: { standort: Standort }) {
  return (
    <Abschnitt
      id="viertel"
      fett={`Webdesign ${standort.inName}.`}
      grau="Das Viertel."
    >
      <div className="grid gap-3 sm:gap-5 lg:grid-cols-12">
        <div className={`${u.blatt} lg:col-span-8`}>
          <p className="text-[21px] leading-[1.4] font-semibold tracking-[-0.018em] text-pretty sm:text-[24px]">
            {standort.intro}
          </p>
          <div className="mt-6 space-y-4">
            {standort.body.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.5] tracking-[-0.022em] text-pretty text-[#424245]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        <aside className="grid content-start gap-3 sm:gap-5 lg:col-span-4">
          <div className={u.blatt}>
            <h2>
              <span className="kennzeile-mono">Orte im Viertel</span>
            </h2>
            <ul className="mt-4 divide-y divide-black/10">
              {standort.anker.map((ank) => (
                <li
                  key={ank}
                  className="py-2.5 text-[15px] text-[#1d1d1f] sm:text-[17px]"
                >
                  {ank}
                </li>
              ))}
            </ul>
          </div>
          <figure className={u.blatt}>
            <figcaption className="notiz-mono">
              Beobachtung · {standort.name}
            </figcaption>
            <blockquote className="mt-3 border-l-2 border-[var(--gold)] pl-4 text-[17px] leading-[1.47] tracking-[-0.016em] text-pretty sm:text-[19px]">
              {standort.pullQuote}
            </blockquote>
          </figure>
        </aside>
      </div>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Passende Branchen als Liste auf weißer Karte, je Branche eine
 * Zeile mit Begründung und Link.
 * ---------------------------------------------------------------- */
function Branchen({ standort }: { standort: Standort }) {
  const n = standort.empfohleneBranchen.length;
  return (
    <Abschnitt
      id="branchen"
      fett={`${ZAHLWORT[n] ?? n} Branchen, die ${standort.zuName} passen.`}
      unter="Zu jeder Branche gibt es eine eigene Seite mit Musterseite und typischem Seitenplan."
    >
      <ul
        role="list"
        className="divide-y divide-black/10 rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10"
      >
        {standort.empfohleneBranchen.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/branchen/${b.slug}`}
              className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-6 sm:grid-cols-[14rem_1fr_auto] sm:gap-x-8"
            >
              <h3 className="text-[19px] leading-snug font-semibold tracking-[-0.016em] underline-offset-4 group-hover:underline sm:text-[21px]">
                {b.label}
              </h3>
              <span
                aria-hidden="true"
                className="text-gold-ink text-[19px] leading-snug sm:order-last"
              >
                ›
              </span>
              <p className="col-span-2 text-[15px] leading-relaxed text-pretty text-[#6e6e73] sm:col-span-1 sm:text-[17px]">
                {b.warum}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Abschnitt>
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
    <Abschnitt
      id="weiter"
      fett="Weiterlesen."
      grau="Aus dem Journal und aus anderen Vierteln."
    >
      <div className="grid gap-3 sm:gap-5 lg:grid-cols-12">
        {post ? (
          <Link
            href={`/journal/${post.slug}`}
            className={`${u.blatt} group block transition-shadow hover:shadow-[0_18px_40px_-16px_rgb(16_32_48/0.28)] lg:col-span-5`}
          >
            <span className="notiz-mono block">
              Aus dem Journal · {formatDate(post.publishedAt)}
            </span>
            <span className="mt-3 block text-[24px] leading-tight font-semibold tracking-[-0.02em] underline-offset-4 group-hover:underline sm:text-[28px]">
              {post.title}
            </span>
            <span className="mt-3 block max-w-md text-[15px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
              {post.dek}
            </span>
            <span className="text-gold-ink mt-4 inline-flex text-[15px] font-semibold sm:text-[17px]">
              Lesen, {post.readingMinutes} Min ›
            </span>
          </Link>
        ) : null}
        <div
          className={`${u.blatt} ${post ? "lg:col-span-7" : "lg:col-span-12"}`}
        >
          <h2>
            <span className="kennzeile-mono">Weitere Stadtteile</span>
          </h2>
          <ul
            className={`mt-4 columns-2 gap-6 sm:gap-8 ${post ? "" : "sm:columns-3 lg:columns-4"}`}
          >
            {andere.map((other) => (
              <li key={other.slug} className="break-inside-avoid">
                <Link
                  href={`/standorte/${other.slug}`}
                  className="flex items-center justify-between gap-3 border-b border-black/10 py-2.5 text-[15px] underline-offset-4 hover:underline sm:text-[17px]"
                >
                  {other.name}
                  <span aria-hidden="true" className="text-[#6e6e73]">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Abschnitt>
  );
}
