import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { MehrLink } from "@/components/marketing/apple";
import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MusterFenster } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Briefkarte } from "@/components/marketing/vertical-landing";
import {
  BRANCHEN,
  getAllBrancheSlugs,
  getBrancheBySlug,
  type Branche,
} from "@/lib/branchen-data";
import { BRANCHEN_SEO } from "@/lib/branchen-seo";
import { getPost, JOURNAL_BY_BRANCHE } from "@/lib/journal-data";
import { getPaketBySlug, nachDauer } from "@/lib/pakete-data";
import { getStandorteForBranche } from "@/lib/standorte-data";
import { SITE_URL } from "@/lib/site";


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

  // Titel und Beschreibung je Branche: lib/branchen-seo.ts (Landingpage führt „erstellen lassen").
  const seo = BRANCHEN_SEO[branche.slug];
  const title = seo?.title ?? `Website für ${seo?.seoLabel ?? branche.label} erstellen lassen`;
  const lead =
    branche.shortBody.length > 100 ? branche.shortBody.split(". ")[0].replace(/\.$/, "") + "." : branche.shortBody;
  const description = seo?.description ?? `${lead} Website zum Festpreis ${getPaketBySlug("starter")?.setup ?? "ab 599\u00A0€"}, gebaut in Hamburg.`;
  return {
    title,
    description,
    alternates: { canonical: `/branchen/${branche.slug}` },
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
    // Das Unternehmen selbst beschreibt das Root-Layout (ProfessionalService).
    provider: { "@id": `${SITE_URL}/#business` },
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
        <Briefkarte title="Aus Ihren Stichpunkten schreiben wir die Texte für die Seite." inquiryHref={inquiryHref}>
          Schicken Sie uns, was Sie anbieten und für wen. Den Festpreis bekommen Sie schriftlich, bevor wir anfangen.
        </Briefkarte>
      </main>

      <MarketingFooter crumb={`${branche.label}`} />

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
  const landing = BRANCHEN_SEO[branche.slug]?.landing;
  const zweitlink = "text-gold-ink underline underline-offset-2 hover:decoration-2";
  return (
    <section className="flaeche-weiss pt-12 pb-16 text-center sm:pt-16 sm:pb-20 lg:pt-20">
      <div className="inhalt">
        <p className="t-eyebrow">{landing ? "Seitenplan und Muster" : "Website erstellen lassen"}</p>
        <h1 className="t-hero mx-auto mt-2 max-w-[16ch] hyphens-auto sm:hyphens-none">Website für {branche.label}</h1>
        <p className="t-unter mx-auto mt-4 sm:mt-5">{branche.shortBody}</p>
        <div className="aktionen mt-7 sm:mt-8">
          <Link href={inquiryHref} className="btn-signal">
            Anfrage schreiben
          </Link>
          <MehrLink href="/website-erstellen-lassen" groesse="unter">
            Festpreis und Ablauf
          </MehrLink>
        </div>
      </div>
      <figure data-auftritt="skala" className="mx-auto mt-12 w-full max-w-[860px] px-[max(var(--rinne),env(safe-area-inset-left))] sm:mt-14">
        <div className="karte overflow-hidden p-4 sm:p-10">
          <MusterFenster branche={branche.slug} className="shadow-[0_24px_48px_-32px_rgb(0_0_0/0.45)]" />
        </div>
        <figcaption className="text-muted-foreground mt-3 text-[12px]">Skizze einer Musterseite · {branche.label}</figcaption>
      </figure>
      {paket ? (
        <p className="text-muted-foreground mx-auto mt-8 max-w-[40em] px-[var(--rinne)] text-[14px] leading-[1.43]">
          Meist empfohlen:{" "}
          <Link href={`/pakete#${paket.slug}`} className={zweitlink}>
            {paket.name}
          </Link>
          , <span className="tabular-nums">{paket.setup}</span> einmalig und{" "}
          <span className="tabular-nums">{paket.monthly.replace(/\s*\/\s*Monat$/, "")}</span> im Monat, inkl.
          MwSt. Online {nachDauer(paket.dauer)} ab vollständigen Unterlagen.{" "}
          {landing ? (
            <Link href={landing.href} className={zweitlink}>
              {landing.label}
            </Link>
          ) : (
            <Link href="/website-erstellen-lassen" className={zweitlink}>
              Preise und Ablauf: Website erstellen lassen
            </Link>
          )}
        </p>
      ) : null}
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
    <section className="flaeche-hell abschnitt">
      <div className="mx-auto grid w-full max-w-[1068px] gap-12 px-[max(var(--rinne),env(safe-area-inset-left))] lg:grid-cols-12 lg:gap-8">
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
        <div data-auftritt="" className="karte karte-weiss self-start p-7 sm:p-8 lg:col-span-5 lg:col-start-8">
          <h2 className="t-karte text-[21px]">Typischer Seitenplan</h2>
          <p className="mt-5 flex items-center gap-3 text-[15.5px] font-semibold">
            <span aria-hidden="true" className="bg-gold inline-block h-[9px] w-[9px] shrink-0 rounded-full" />
            {root}
          </p>
          <ul className="border-foreground/35 mt-1 ml-[4px] border-l">
            {pages.map((page) => (
              <li
                key={page}
                className="before:bg-foreground/35 relative py-1.5 last:after:bg-white pl-5 text-[15px] leading-snug before:absolute before:top-[16px] before:left-0 before:h-px before:w-3.5 last:after:absolute last:after:top-[17px] last:after:bottom-0 last:after:-left-px last:after:w-px"
              >
                {page}
              </li>
            ))}
          </ul>
          {branche.typicalPagesHinweis ? (
            <p className="text-muted-foreground mt-4 text-[13.5px] leading-snug">{branche.typicalPagesHinweis}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Schwerpunkte als Verzeichnis mit Haarlinien, auf dunklem Grund:
 * der Kern der Seite und die einzige dunkle Fläche vor dem Fuß.
 * ---------------------------------------------------------------- */
function Schwerpunkte({ branche }: { branche: Branche }) {
  return (
    <section className="flaeche-schwarz abschnitt">
      <div className="inhalt abschnitt-kopf">
        <h2 data-auftritt="titel" className="t-abschnitt hyphens-auto sm:hyphens-none">
          Was eine Website für {branche.label} braucht
        </h2>
        <p className="t-unter">
          Welche Teile Ihr Betrieb davon braucht, klären wir im ersten Gespräch. Den Rest lassen wir weg.
        </p>
      </div>
      <dl
        className={`mx-auto grid gap-3 px-[max(var(--rinne),env(safe-area-inset-left))] sm:grid-cols-2 ${
          branche.features.length % 3 === 0 ? "max-w-[1200px] lg:grid-cols-3" : "max-w-[1012px]"
        }`}
      >
        {branche.features.map((feat) => (
          <div key={feat.title} data-auftritt="" className="rounded-[var(--radius-karte)] bg-[#1d1d1f] p-7 sm:p-8">
            <dt className="text-[21px] leading-[1.19] font-semibold tracking-[-0.015em] text-[#f5f5f7]">{feat.title}</dt>
            <dd className="text-text-2-dark mt-3 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty">{feat.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Fragen offen gesetzt, zweispaltig.
 * ---------------------------------------------------------------- */
function Fragen({ branche }: { branche: Branche }) {
  return (
    <section className="flaeche-weiss abschnitt">
      <div className="inhalt">
        <h2 data-auftritt="titel" className="zweiton">
          <span>Fragen aus der Branche.</span> <span className="grau">Kurz beantwortet.</span>
        </h2>
        <dl className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:mt-10">
          {branche.faq.map((item) => (
            <div key={item.q} data-auftritt="" className="karte p-7 sm:p-8">
              <dt className="text-[21px] leading-[1.19] font-semibold tracking-[-0.015em]">{item.q}</dt>
              <dd className="text-muted-foreground mt-3 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty">{item.a}</dd>
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
    <section className="flaeche-hell abschnitt">
      <div className="mx-auto grid w-full max-w-[1068px] gap-12 px-[max(var(--rinne),env(safe-area-inset-left))] md:grid-cols-3 md:gap-8">
        {post ? (
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.022em]">Aus dem Journal</h2>
            <Link href={`/journal/${post.slug}`} className="group karte karte-regal mt-4 block p-6">
              <span className="block text-[21px] leading-[1.19] font-semibold tracking-[-0.015em]">
                {post.title}
              </span>
              <span className="text-muted-foreground mt-2 block text-[14.5px] leading-relaxed">{post.dek}</span>
              <span className="link-chevron mt-3 text-[14px]">
                Lesen, {post.readingMinutes} Min <span aria-hidden="true" className="chev">›</span>
              </span>
            </Link>
          </div>
        ) : null}
        {standorte.length > 0 ? (
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.022em]">Stadtteilseiten Hamburg</h2>
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
          <h2 className="text-[17px] font-semibold tracking-[-0.022em]">Weitere Branchen</h2>
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
