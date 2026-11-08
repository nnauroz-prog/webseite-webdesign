import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { MehrLink } from "@/components/marketing/apple";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
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
 * Bilder je Branche: das Gerätefoto der Musterseite (Kopf, frei
 * erfundener Betrieb) und ein Stimmungsbild aus der Branche mit einem
 * Satz dazu (Mitte der Seite).
 */
const BILDER: Record<
  string,
  { geraet: string; geraetAlt: string; geraetPos?: string; foto: string; fotoAlt: string; fotoPos?: string; satz: string }
> = {
  pflege: {
    geraet: "/images/sitalo-pflege-laptop.webp",
    geraetAlt: "Laptop mit der Musterseite eines Pflegedienstes auf einem hellen Schreibtisch",
    foto: "/images/atmosphere/pflege-eingang.webp",
    fotoAlt: "Heller Empfang eines Pflegedienstes mit Holztresen und Pflanze",
    satz: "Angehörige suchen zuerst Vertrauen und eine Nummer, die erreichbar ist.",
  },
  praxis: {
    geraet: "/images/sitalo-praxis-laptop.webp",
    geraetAlt: "Laptop mit der Musterseite einer Zahnarztpraxis auf einem hellen Empfangstresen",
    foto: "/images/atmosphere/praxis-raum.webp",
    fotoAlt: "Ruhiges Sprechzimmer mit Schreibtisch, Tablet und Sessel",
    satz: "Patientinnen und Patienten suchen Sprechzeiten und den Weg zum Termin.",
  },
  friseur: {
    geraet: "/images/sitalo-friseur-mobile.webp",
    geraetAlt: "Handy mit der Musterseite eines Friseurs, daneben Visitenkarten auf einem Holztisch",
    geraetPos: "55% 50%",
    foto: "/images/atmosphere/friseur-stuhl.webp",
    fotoAlt: "Lederner Friseurstuhl vor einem runden Spiegel",
    satz: "Erst die Bilder, dann der Preis, dann der Termin.",
  },
  gastro: {
    geraet: "/images/sitalo-cafe-mobile.webp",
    geraetAlt: "Handy mit der Musterseite eines Cafés mit Speisekarte auf einem Holztisch",
    foto: "/images/atmosphere/gastro-cafe.webp",
    fotoAlt: "Café mit kupferner Espressomaschine und Holztischen",
    satz: "Wer ein Café sucht, will zuerst die Karte und die Öffnungszeiten sehen.",
  },
  handwerker: {
    geraet: "/images/sitalo-handwerker-laptop.webp",
    geraetAlt: "Laptop in einer Tischlerwerkstatt mit der Musterseite einer Tischlerei",
    foto: "/images/atmosphere/handwerker-werkbank.webp",
    fotoAlt: "Werkbank einer Tischlerei mit Hobel und Spänen",
    satz: "Im Handwerk zählen Referenzen und ein schneller Rückruf.",
  },
  reinigung: {
    geraet: "/images/sitalo-reinigung-laptop.webp",
    geraetAlt: "Laptop mit der Musterseite einer Gebäudereinigung auf einer Edelstahlfläche",
    foto: "/images/atmosphere/reinigung-flur.webp",
    fotoAlt: "Frisch gereinigter, heller Flur mit Reinigungswagen",
    satz: "Gewerbekunden wollen wissen, wo und zu welchen Zeiten Sie reinigen.",
  },
  kanzlei: {
    geraet: "/images/sitalo-kanzlei-laptop.webp",
    geraetAlt: "Laptop mit der Musterseite einer Kanzlei neben einer grünen Schreibtischlampe",
    foto: "/images/atmosphere/kanzlei-buecher.webp",
    fotoAlt: "Gesetzbücher in einem dunklen Holzregal neben einer Messinglampe",
    satz: "Mandanten suchen ihr Rechtsgebiet und einen klaren Weg zur Erstberatung.",
  },
  fitness: {
    geraet: "/images/sitalo-fitness-laptop.webp",
    geraetAlt: "Laptop mit der Musterseite eines Fitnessstudios am Empfang",
    foto: "/images/atmosphere/fitness-studio.webp",
    fotoAlt: "Lichtdurchflutetes Fitnessstudio mit Kettlebells am Fenster",
    satz: "Wer ein Studio sucht, will Kurse, Preise und ein Probetraining.",
  },
  kosmetik: {
    geraet: "/images/sitalo-kosmetik-laptop.webp",
    geraetAlt: "Laptop mit der Musterseite eines Kosmetikstudios auf einer Marmorablage",
    foto: "/images/atmosphere/friseur-stuhl.webp",
    fotoAlt: "Behandlungsstuhl aus Leder vor einem runden Spiegel",
    satz: "Bei Kosmetik entscheiden Bilder und eine klare Preisliste.",
  },
  hotel: {
    geraet: "/images/sitalo-hotel-laptop.webp",
    geraetAlt: "Laptop mit der Musterseite eines Hotels an einer Rezeption",
    foto: "/images/atmosphere/gastro-espresso.webp",
    fotoAlt: "Heller Frühstücksraum mit Siebträgermaschine am Tresen und Holztischen am Fenster",
    satz: "Gäste buchen gern direkt, wenn Zimmer und Lage klar zu sehen sind.",
  },
};

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
      <MarketingHeader cta={false} />
      <Produktleiste titel={branche.label} links={[]} cta={{ href: inquiryHref, label: "Anfragen" }} />

      <UnterseiteMain>
        <Hero branche={branche} inquiryHref={inquiryHref} />
        <Einordnung branche={branche} />
        <Stimmung branche={branche} />
        <Schwerpunkte branche={branche} />
        <Fragen branche={branche} />
        <Weiter branche={branche} />
        <KontaktKarte
          eyebrow="Texte inklusive"
          titel="Aus Ihren Stichpunkten schreiben wir die Texte für die Seite."
          zeile="Schicken Sie uns, was Sie anbieten und für wen. Den Festpreis bekommen Sie schriftlich, bevor wir anfangen."
          pille={{ href: inquiryHref, label: "Anfrage schreiben" }}
        />
      </UnterseiteMain>

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
  const bild = BILDER[branche.slug];
  const zweitlink = "text-gold-ink underline underline-offset-2 hover:decoration-2";
  return (
    <SeitenKopf
      krumen={[{ href: "/branchen", label: "Branchen" }, { label: branche.label }]}
      eyebrow={landing ? "Ladeliste · Seitenplan und Muster" : "Ladeliste · Website erstellen lassen"}
      titel={<span className="hyphens-auto sm:hyphens-none">Website für {branche.label}</span>}
      unter={branche.shortBody}
      aktionen={
        <>
          <Link href={inquiryHref} className="btn-signal btn-gross">
            Anfrage schreiben
          </Link>
          <MehrLink href="/website-erstellen-lassen" groesse="unter">
            Festpreis und Ablauf
          </MehrLink>
        </>
      }
      bild={
        bild ? (
          <FotoRahmen
            vorab
            src={bild.geraet}
            alt={bild.geraetAlt}
            aspect="3 / 2"
            aspectMobil="4 / 3"
            position={bild.geraetPos ?? "50% 55%"}
            muster
          />
        ) : null
      }
      unterschrift={
        <>
          {bild ? <>Musterseite, frei erfunden. Ihre Seite gestalten wir eigens für Ihren Betrieb. </> : null}
          <Link href="/branchen#vorschau" className={zweitlink}>
            Erste Skizze mit Ihrem Namen
          </Link>
          {paket ? (
            <span className="mx-auto mt-3 block max-w-[40em]">
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
            </span>
          ) : null}
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------
 * Einordnung als Fließtext, daneben der typische Seitenplan als
 * kleiner Strukturbaum.
 * ---------------------------------------------------------------- */
function Einordnung({ branche }: { branche: Branche }) {
  const [root, ...pages] = branche.typicalPages;
  return (
    <section className={u.abschnitt} aria-label="Einordnung">
      <div className="inhalt grid gap-8 lg:grid-cols-12 lg:gap-5">
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
        <div className={`${u.blatt} self-start lg:col-span-5`}>
          <h2 className="text-[21px] leading-[25px] font-bold">Typischer Seitenplan</h2>
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
 * Stimmung: das Foto aus der Branche ganz breit (21:9, am Handy 4:3),
 * ein Satz darauf. Lazy.
 * ---------------------------------------------------------------- */
function Stimmung({ branche }: { branche: Branche }) {
  const bild = BILDER[branche.slug];
  if (!bild) return null;
  return (
    <div className="inhalt mt-14 sm:mt-20">
      <figure>
        <FotoRahmen
          src={bild.foto}
          alt={bild.fotoAlt}
          aspect="21 / 9"
          aspectMobil="4 / 3"
          position={bild.fotoPos}
          sizes="(min-width: 1068px) 980px, calc(100vw - 32px)"
          satz={bild.satz}
        />
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Schwerpunkte auf Schwarz: die Teile der Seite als dunkle Kacheln.
 * ---------------------------------------------------------------- */
function Schwerpunkte({ branche }: { branche: Branche }) {
  return (
    <Abschnitt
      id="schwerpunkte"
      dunkel
      fett={`Was eine Website für ${branche.label} braucht.`}
      grau="Den Rest lassen wir weg."
      unter="Welche Teile Ihr Betrieb davon braucht, klären wir im ersten Gespräch."
    >
      <dl className={`grid gap-3 sm:grid-cols-2 lg:gap-5 ${branche.features.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
        {branche.features.map((feat, i) => (
          <div key={feat.title} className="rounded-[18px] bg-[#1d1d1f] p-6 sm:p-8">
            <p aria-hidden="true" className="text-[12px] leading-4 font-semibold text-[#ff9f5a] tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </p>
            <dt className="mt-2 text-[21px] leading-[25px] font-bold text-[#f5f5f7]">{feat.title}</dt>
            <dd className="mt-3 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty text-[#a1a1a6]">{feat.body}</dd>
          </div>
        ))}
      </dl>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Fragen offen gesetzt, zweispaltig.
 * ---------------------------------------------------------------- */
function Fragen({ branche }: { branche: Branche }) {
  return (
    <Abschnitt id="fragen" fett="Fragen aus der Branche." grau="Kurz beantwortet.">
      <dl className="grid gap-3 sm:gap-5 md:grid-cols-2">
        {branche.faq.map((item) => (
          <div key={item.q} className={u.blatt}>
            <dt className="text-[19px] leading-[1.21] font-semibold tracking-[-0.015em] sm:text-[21px]">{item.q}</dt>
            <dd className="mt-3 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty text-[#6e6e73]">{item.a}</dd>
          </div>
        ))}
      </dl>
    </Abschnitt>
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
    <section className={u.abschnitt} aria-label="Weiterlesen">
      <div className="inhalt grid gap-10 md:grid-cols-3 md:gap-8">
        {post ? (
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.022em]">Aus dem Journal</h2>
            <Link href={`/journal/${post.slug}`} className={`group ${u.blatt} mt-4 block !p-6`}>
              <span className="block text-[21px] leading-[1.19] font-semibold tracking-[-0.015em]">
                {post.title}
              </span>
              <span className="text-muted-foreground mt-2 block text-[14.5px] leading-relaxed">{post.dek}</span>
              <span className="link-chevron mt-3 inline-block text-[14px]">
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
