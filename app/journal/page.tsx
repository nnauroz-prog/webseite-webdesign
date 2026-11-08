import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { JournalBild } from "@/components/marketing/laden/bilder/journal-bilder";
import a from "@/components/marketing/hafen/atelier.module.css";
import {
  Abschnitt,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { JOURNAL_POSTS, formatDate, type JournalPost } from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM, uhrzeitKurz } from "@/lib/sprechstunde-data";

export const metadata: Metadata = {
  title: "Journal · Webdesign-Wissen für Betriebe",
  description:
    "Texte von Sitalo aus Hamburg über Preise, Arbeitsweise, lokales SEO, Gastronomie, Pflege und den Umzug vom Baukasten.",
  alternates: {
    canonical: "/journal",
    types: { "application/rss+xml": "/journal/feed.xml" },
  },
};


/** Datum für die Tabellenspalte: 12.06.2026. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** „Neu“ nur, solange der Beitrag jünger als etwa einen Monat ist. Die
 *  Seite wird stündlich neu erzeugt, das Etikett veraltet also nicht. */
const NEU_TAGE = 30;
function istNeu(iso: string): boolean {
  const alter = Date.now() - new Date(`${iso}T12:00:00Z`).getTime();
  return alter >= 0 && alter < NEU_TAGE * 24 * 60 * 60 * 1000;
}

/**
 * `/journal` — Inhaltsverzeichnis wie in einer Zeitschrift.
 *
 * Laden-Fläche wie die übrigen Unterseiten: Seitenkopf, darunter der
 * neueste Beitrag als großer Aufmacher mit Bild, die übrigen als
 * Bildkacheln. Bilder: die Hafen-Zeichnungen aus public/laden (Google,
 * Pflichtangaben, Domain, Skyline) und passende Fotos aus public/images.
 */
/** Bild je Beitrag: Zeichnung zum Thema oder ein passendes Foto. */
function beitragBild(slug: string): { src: string; alt: string; position?: string } {
  if (slug.includes("google"))
    return { src: "/laden/journal-google.svg", alt: "Gezeichneter Stadtplan mit einer Stecknadel und einem Unternehmensprofil" };
  if (slug.includes("pflichtangaben"))
    return { src: "/laden/journal-pflichtangaben.svg", alt: "Gezeichnete Blätter für Impressum und Datenschutz" };
  if (slug.includes("domain"))
    return { src: "/laden/journal-domain.svg", alt: "Gezeichnete Adresszeile mit einem Schlüssel für Domain und Hosting" };
  const fotos: Record<string, { src: string; alt: string; position?: string }> = {
    "die-zweite-frage": {
      src: "/images/cafe-eimsbuettel.webp",
      alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel",
      position: "50% 60%",
    },
    "der-preis-einer-website": {
      src: "/images/workspace-macbook.webp",
      alt: "Hände an einer Laptop-Tastatur, daneben ein Notizbuch mit Stichpunkten",
    },
    "warum-wir-keine-mockups-zeigen": {
      src: "/images/workspace-prints.webp",
      alt: "Drei gerahmte Entwürfe mit Logo, Farben und Schrift an einer hellen Wand",
      position: "50% 40%",
    },
    "cafe-website-hamburg-2026": {
      src: "/images/atmosphere/gastro-cafe.webp",
      alt: "Café mit kupferner Espressomaschine und Holztischen",
    },
    "pflegedienst-google-maps-hamburg": {
      src: "/images/atmosphere/pflege-eingang.webp",
      alt: "Heller Empfang eines Pflegedienstes mit Holztresen und Pflanze",
      position: "50% 60%",
    },
    "was-wir-an-wix-migrationen-lernen": {
      src: "/images/workspace-typing.webp",
      alt: "Hände auf der Tastatur eines Laptops in warmem Licht",
    },
  };
  return (
    fotos[slug] ?? {
      src: "/laden/journal-skyline.svg",
      alt: "Gezeichnete Hamburger Skyline mit Kran und Containerschiff am Abend",
    }
  );
}

/** Aufmacher: der neueste Beitrag als große Karte mit Bild. */
function Aufmacher({ post }: { post: JournalPost }) {
  const b = beitragBild(post.slug);
  return (
    <article
      id="aufmacher"
      className="kante-stark relative grid scroll-mt-28 overflow-hidden bg-[#fafaf8] text-left has-[.karte-link:focus-visible]:outline-2 has-[.karte-link:focus-visible]:outline-offset-2 has-[.karte-link:focus-visible]:outline-[#f45b1e] lg:grid-cols-12"
    >
      <div className="relative aspect-[16/10] bg-[#e7e6e1] lg:col-span-7 lg:aspect-auto lg:min-h-[400px]">
        {b.src.endsWith(".svg") ? (
          // Zeichnung inline: kein Bild-Download vor dem ersten Bild (LCP bleibt die Überschrift).
          <div role="img" aria-label={b.alt} className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full">
            <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true" focusable="false">
              <defs>
                <radialGradient id="ld-kontakt">
                  <stop offset="0" stopColor="#000" stopOpacity=".34" />
                  <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            <JournalBild slug={post.slug} />
          </div>
        ) : (
          <Image
            src={b.src}
            alt={b.alt}
            fill
            preload
            fetchPriority="high"
            sizes="(min-width: 1068px) 572px, 70vw"
            quality={60}
            className="object-cover"
            style={b.position ? { objectPosition: b.position } : undefined}
          />
        )}
      </div>
      <div className="flex flex-col justify-center px-[22px] py-7 sm:p-10 lg:col-span-5">
        <p className="text-muted-foreground font-mono text-[11.5px] leading-5 tracking-[0.06em] uppercase">
          <span className="text-gold-ink">{istNeu(post.publishedAt) ? "Neu" : "Zuletzt erschienen"}</span> ·{" "}
          {formatDate(post.publishedAt)} · <span className="whitespace-nowrap">{post.readingMinutes} Min Lesezeit</span>
        </p>
        <h2 className="mt-3 text-[26px] leading-[1.1] font-[740] tracking-[-0.025em] text-balance [font-stretch:114%] sm:text-[34px]">
          <Link href={`/journal/${post.slug}`} className="karte-link after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h2>
        <p className="text-muted-foreground mt-3 text-[15px] leading-[1.55] text-pretty sm:text-[17px]">{post.dek}</p>
        <p className="mt-5 text-[15px] leading-5 font-semibold">
          Beitrag lesen<span aria-hidden="true" className="text-gold-ink">{"\u00A0"}→</span>
        </p>
      </div>
    </article>
  );
}

export default function JournalPage() {
  const [hero, ...rest] = JOURNAL_POSTS;

  // Blog-Schema mit den ersten 10 BlogPosting-Einträgen als
  // blogPosts-Array. Plus Breadcrumb.
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Sitalo Journal",
    description:
      "Texte von Sitalo aus Hamburg über Preise, Arbeitsweise und lokales SEO.",
    url: `${SITE_URL}/journal`,
    publisher: { "@id": `${SITE_URL}/#business` },
    inLanguage: "de-DE",
    blogPost: JOURNAL_POSTS.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.dek,
      datePublished: p.publishedAt,
      url: `${SITE_URL}/journal/${p.slug}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: `${SITE_URL}/journal`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Journal"
          eyebrow={`Logbuch · ${JOURNAL_POSTS.length} Beiträge`}
          titel="Wissen für Betriebe mit Website"
          unter="Längere Texte über das, was uns bei der Arbeit an Websites für kleine Betriebe auffällt. Zum Beispiel, was eine Website kostet und wann sie besser noch warten kann."
          aktionen={
            <MehrLink href="/journal/feed.xml" groesse="unter">
              RSS-Feed abonnieren
            </MehrLink>
          }
          bild={hero ? <Aufmacher post={hero} /> : null}
        />

        {rest.length > 0 ? (
          <Abschnitt id="weitere" eyebrow="Logbuch · ältere Einträge" fett="Ältere Beiträge, der Reihe nach">
            <ol className={a.logbuch}>
              {rest.map((post) => (
                <li key={post.slug}>
                  <Link href={`/journal/${post.slug}`} className={a.logZeile}>
                    <time dateTime={post.publishedAt} className={a.logDatum}>
                      {shortDate(post.publishedAt)}
                    </time>
                    <span>
                      <span className={a.logTitel}>{post.title}</span>
                      <span className={a.logSatz}>{post.dek}</span>
                    </span>
                    <span className={a.logMeta}>
                      {post.readingMinutes} Min <span className="text-gold-ink">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className={a.lvFuss}>
              <span>Eingetragen im Büro in Hamburg.</span>
            </p>
          </Abschnitt>
        ) : null}

        <KontaktKarte
          eyebrow="Sprechstunde"
          titel="Fragen zu einem Beitrag beantworten wir am Telefon."
          zeile={`Jeden ersten Donnerstag im Monat von ${uhrzeitKurz(SPRECHSTUNDE_BEGINN_HHMM)} bis ${uhrzeitKurz(SPRECHSTUNDE_ENDE_HHMM)} Uhr ist unsere offene Sprechstunde. Wer nicht so lange warten will, ruft an oder schreibt uns über das Anfrageformular.`}
          pille={{ href: "/sprechstunde", label: "Zur Sprechstunde" }}
          link={{ href: "/anfrage", label: "Anfrage schreiben" }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Journal" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}
