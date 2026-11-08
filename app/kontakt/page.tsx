import type { Metadata } from "next";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  FotoRahmen,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM, uhrzeitKurz } from "@/lib/sprechstunde-data";
import { STANDORTE } from "@/lib/standorte-data";

export const metadata: Metadata = {
  title: "Kontakt · schreiben Sie uns direkt",
  description:
    "Am Telefon sprechen Sie mit uns selbst, nicht mit einer Zentrale. Anfragen über das Formular beantworten wir meist am selben Werktag.",
  alternates: { canonical: "/kontakt" },
};

/**
 * `/kontakt` im Apple-Stil: zentrierter Kopf mit der Nummer groß und
 * der Visitenkarte als Bild, darunter alle Wege als Karten und zum
 * Schluss Treffen in Hamburg mit der Stadtteil-Karte.
 */
export default function KontaktPage() {
  // ContactPage-Schema + Breadcrumb. ContactPage signalisiert
  // Google explizit, dass das die kanonische Kontakt-Seite ist
  // (statt /impressum oder Footer als Kontakt-Surrogat). Verlinkt
  // auf die LocalBusiness-Entity aus app/layout.tsx via @id.
  const contactPageLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontakt — Sitalo Webdesign",
    description:
      "Anrufen oder schreiben: Sitalo Webdesign in Hamburg antwortet meist am selben Werktag.",
    url: `${SITE_URL}/kontakt`,
    mainEntity: { "@id": `${SITE_URL}/#business` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kontakt",
        item: `${SITE_URL}/kontakt`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <Produktleiste titel="Kontakt" links={[]} cta={{ href: "/anfrage", label: "Anfragen" }} />

      <UnterseiteMain className="pb-16 sm:pb-24">
        <Briefkopf />
        <Wege />
        <Treffen />
      </UnterseiteMain>

      <MarketingFooter crumb="Kontakt" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([contactPageLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Kopf: Nummer groß, Formular als Hauptweg, darunter die Speicherstadt
 * als breites Bild. Die Visitenkarte ist eine Zeile mit Download-Pille.
 * ---------------------------------------------------------------- */
function Briefkopf() {
  return (
    <SeitenKopf
      krumen="Kontakt"
      eyebrow="Kontor · Sitalo Webdesign"
      titel="Kontakt"
      unter="Am Telefon sprechen Sie mit uns selbst, nicht mit einer Zentrale. Anfragen über das Formular beantworten wir meist am selben Werktag."
      aktionen={
        <>
          <a
            href="tel:+491607621876"
            className="text-foreground hover:text-gold-ink basis-full text-[40px] leading-[48px] font-semibold tracking-[-0.025em] whitespace-nowrap tabular-nums sm:text-[56px] sm:leading-[64px]"
          >
            0160&nbsp;7621876
          </a>
          <Link href="/anfrage" className="btn-signal btn-gross">
            Anfrage schreiben
          </Link>
          <MehrLink href="/termin" groesse="unter">
            Erstgespräch buchen
          </MehrLink>
        </>
      }
      meta={
        <>
          Für das Adressbuch im Handy:{" "}
          <a
            href="/sitalo-kontakt.vcf"
            download="Sitalo-Webdesign.vcf"
            className="inline-flex min-h-11 items-center underline-offset-2 hover:underline"
          >
            Visitenkarte speichern
          </a>
        </>
      }
      bild={
        <FotoRahmen
          vorab
          src="/images/hamburg-speicherstadt.webp"
          alt="Speicherstadt in Hamburg in der Abendsonne, im Hintergrund die Elbphilharmonie"
          aspect="21 / 9"
          aspectMobil="16 / 10"
          position="50% 55%"
        />
      }
      unterschrift="Speicherstadt, früher Abend · im Hintergrund die Elbphilharmonie"
    />
  );
}

/* ------------------------------------------------------------------
 * Alle Wege als 2×2-Raster, das Formular schwarz hervorgehoben.
 * ---------------------------------------------------------------- */
const WEGE: { name: string; text: string; href: string; link: string }[] = [
  {
    name: "Formular",
    text: "Drei Felder für Ihr Vorhaben. Die Antwort kommt meist am selben Werktag.",
    href: "/anfrage",
    link: "Anfrage schreiben",
  },
  {
    name: "Termin",
    text: "Bis zu 30 Minuten, meist reicht eine Viertelstunde. Am Telefon, per Video oder in Hamburg; Tag und Uhrzeit wählen Sie selbst.",
    href: "/termin",
    link: "Termin buchen",
  },
  {
    name: "Sprechstunde",
    text: `Jeden ersten Donnerstag im Monat von ${uhrzeitKurz(SPRECHSTUNDE_BEGINN_HHMM)} bis ${uhrzeitKurz(SPRECHSTUNDE_ENDE_HHMM)}\u00A0Uhr am Telefon, offen für alle.`,
    href: "/sprechstunde",
    link: "Nächste Termine",
  },
  {
    name: "Erreichbarkeit",
    text: "Was wir zur Antwortzeit zusagen und was gilt, wenn wir im Urlaub sind.",
    href: "/erreichbarkeit",
    link: "Zeiten ansehen",
  },
];

function Wege() {
  return (
    <Abschnitt id="wege" fett="Weitere Wege zu uns." grau="Wählen Sie, was Ihnen liegt.">
      <BildRaster>
        {WEGE.map((w, i) => (
          <BildKachel
            key={w.name}
            ton={i === 0 ? "schwarz" : "weiss"}
            titel={w.name}
            zeile={w.text}
            mehr={w.link}
            href={w.href}
          />
        ))}
      </BildRaster>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Treffen in Hamburg: Bildkachel, darunter die Stadtteile als Chips.
 * ---------------------------------------------------------------- */
function Treffen() {
  return (
    <Abschnitt id="treffen" fett="Treffen in Hamburg." grau="In Ihrem Betrieb oder im Café.">
      <BildRaster>
        <BildKachel
          breit
          gross
          titel="Die Website wird dieselbe."
          zeile="Wer in Hamburg sitzt, kann uns gern treffen: in Ihrem Betrieb oder in einem Café. Alle anderen sprechen mit uns am Telefon oder per Video."
          foto={{
            src: "/images/cafe-eimsbuettel.webp",
            alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel",
            position: "50% 60%",
            sizes: "(min-width: 1068px) 980px, calc(100vw - 32px)",
          }}
        />
      </BildRaster>
      <p className={`${u.abschnittUnter} mt-8`}>
        Für {STANDORTE.length} Hamburger Stadtteile gibt es eine eigene Seite.
      </p>
      <ul role="list" className={`${u.chips} mt-4`}>
        {STANDORTE.map((s) => (
          <li key={s.slug}>
            <Link href={`/standorte/${s.slug}`} className={u.chip}>
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
      <MehrLink href="/standorte" className="mt-4">
        Alle Stadtteile
      </MehrLink>
    </Abschnitt>
  );
}
