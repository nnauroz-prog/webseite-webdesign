import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";

import { MehrLink } from "@/components/marketing/apple";
import { SpruchReel } from "@/components/marketing/journal/spruch-reel";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  KontaktKarte,
  UnterseiteMain,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM, uhrzeitKurz } from "@/lib/sprechstunde-data";
import { journalKarten } from "@/lib/sprueche-aktuell";
import { spruecheBis } from "@/lib/sprueche-data";

/** Der Spruch wechselt jeden Tag: Die Seite wird halbstündlich neu erzeugt. */
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Journal · Jeden Tag ein Gedanke zur Website",
  description:
    "Jeden Tag ein kurzer Gedanke zur eigenen Website. Dazu Ratgeber von Sitalo aus Hamburg über Preise, lokales SEO, Pflege und den Umzug vom Baukasten.",
  alternates: {
    canonical: "/journal",
    types: { "application/rss+xml": "/journal/feed.xml" },
  },
  openGraph: ogFor("/journal", undefined, undefined, "website", { defaultImage: true }),
};


/** Datum für die Tabellenspalte: 12.06.2026. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/**
 * `/journal` — oben der Spruch des Tages als hochkant laufende Karte
 * (components/marketing/journal/spruch-reel.tsx), darunter alle Ratgeber
 * als Bildkacheln zum Nachlesen. Bilder: die Hafen-Zeichnungen aus
 * public/laden und passende Fotos aus public/images.
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

export default function JournalPage() {
  const jetzt = new Date();
  // Nur die Karten zum Tag rund um heute, ohne Quelle: Damit rechnet die
  // Karte im Browser nach, wenn die Seite vom Vortag ist. Server und
  // Browser nutzen denselben Ausschnitt, also dieselben sieben Karten.
  const aktuell = journalKarten(jetzt);
  const tage = spruecheBis(jetzt, 7, aktuell);

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
          { href: "#spruch", label: "Spruch" },
          { href: "#ratgeber", label: "Ratgeber" },
          { href: "#kontakt", label: "Fragen" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <UnterseiteMain>
        <SpruchReel
          tage={tage}
          aktuell={aktuell}
          kopf={
            <>
              <p className="kennzeile-mono">Journal · Logbuch</p>
              <h1>Jeden Tag ein Gedanke zur Website.</h1>
            </>
          }
          fuss={
            <>
              <MehrLink href="/anfrage" groesse="unter">
                Anfrage schreiben
              </MehrLink>
              <MehrLink href="#ratgeber" groesse="unter">
                Ratgeber lesen
              </MehrLink>
            </>
          }
        />

        <Abschnitt
          id="ratgeber"
          fett="Ratgeber."
          grau="Zum Nachlesen."
          rechts={
            <MehrLink href="/journal/feed.xml" groesse="unter">
              RSS-Feed abonnieren
            </MehrLink>
          }
        >
          <BildRaster className="wisch-reihe">
            {JOURNAL_POSTS.map((post) => {
              const b = beitragBild(post.slug);
              return (
                <BildKachel
                  key={post.slug}
                  spalten={4}
                  eyebrow={`${shortDate(post.publishedAt)} · ${post.readingMinutes} Min Lesezeit`}
                  titel={post.title}
                  mehr="Beitrag lesen"
                  href={`/journal/${post.slug}`}
                  foto={{
                    src: b.src,
                    alt: b.alt,
                    position: b.position,
                    sizes: "(min-width: 1068px) 320px, (min-width: 640px) 50vw, 84vw",
                  }}
                />
              );
            })}
          </BildRaster>
        </Abschnitt>

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
