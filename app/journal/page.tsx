import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { JournalBild } from "@/components/marketing/laden/bilder/journal-bilder";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
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
      className="relative grid scroll-mt-28 overflow-hidden rounded-[20px] bg-white text-left shadow-[0_4px_16px_rgb(0_0_0/0.08)] transition-shadow hover:shadow-[0_18px_40px_-16px_rgb(16_32_48/0.28)] has-[.karte-link:focus-visible]:outline-2 has-[.karte-link:focus-visible]:outline-offset-2 has-[.karte-link:focus-visible]:outline-[#f45b1e] sm:rounded-[28px] lg:grid-cols-12"
    >
      <div className="relative aspect-[16/10] bg-[#e8e8ed] lg:col-span-7 lg:aspect-auto lg:min-h-[400px]">
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
        <p className="text-gold-ink text-[12px] leading-4 font-semibold sm:text-[14px] sm:leading-5">
          {istNeu(post.publishedAt) ? "Neu" : "Zuletzt erschienen"} · {formatDate(post.publishedAt)} ·{" "}
          <span className="whitespace-nowrap">{post.readingMinutes} Min Lesezeit</span>
        </p>
        <h2 className="mt-2 text-[24px] leading-[28px] font-bold tracking-[-0.01em] text-balance sm:text-[32px] sm:leading-[36px]">
          <Link href={`/journal/${post.slug}`} className="karte-link after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-[15px] leading-[22px] text-pretty text-[#6e6e73] sm:text-[17px] sm:leading-[25px]">
          {post.dek}
        </p>
        <p className="text-gold-ink mt-5 text-[15px] leading-5 font-semibold">
          Beitrag lesen<span aria-hidden="true"> ›</span>
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
      <Produktleiste
        titel="Journal"
        links={[
          { href: "#aufmacher", label: "Neu" },
          { href: "#weitere", label: "Beiträge" },
          { href: "#kontakt", label: "Fragen" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
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
          <Abschnitt id="weitere" fett="Ältere Beiträge." grau="Ratgeber für Betriebe.">
            <BildRaster>
              {rest.map((post) => {
                const b = beitragBild(post.slug);
                return (
                  <BildKachel
                    key={post.slug}
                    spalten={4}
                    eyebrow={`${shortDate(post.publishedAt)} · ${post.readingMinutes} Min Lesezeit`}
                    titel={post.title}
                    zeile={post.dek}
                    mehr="Beitrag lesen"
                    href={`/journal/${post.slug}`}
                    foto={{
                      src: b.src,
                      alt: b.alt,
                      position: b.position,
                      sizes: "(min-width: 1068px) 320px, (min-width: 640px) 50vw, calc(100vw - 32px)",
                    }}
                  />
                );
              })}
            </BildRaster>
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
