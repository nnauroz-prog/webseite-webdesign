import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";

import { MehrLink } from "@/components/marketing/apple";
import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SitaloLogo } from "@/components/sitalo-logo";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM, uhrzeitKurz } from "@/lib/sprechstunde-data";
import { STANDORTE } from "@/lib/standorte-data";

export const metadata: Metadata = {
  title: "Kontakt · schreiben Sie uns direkt",
  description:
    "Rufen Sie an oder schreiben Sie uns über das Formular oder per E-Mail. Wir antworten meist am selben Werktag.",
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
      <MarketingHeader />
      <EditorialMasthead section="Kontakt" />

      <main id="main" tabIndex={-1} className="flex-1">
        <Briefkopf />
        <Wege />
        <Treffen />
      </main>

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
 * Briefkopf als zentrierter Apple-Kopf: Nummer groß, Mail als Link,
 * darunter die Visitenkarte als „Produktbild“.
 * ---------------------------------------------------------------- */
function Briefkopf() {
  return (
    <section className="flaeche-weiss pt-12 pb-20 text-center sm:pt-16 lg:pt-20 lg:pb-24">
      <div className="inhalt">
        <p className="t-eyebrow">Sitalo Webdesign · Hamburg</p>
        <h1 className="t-hero mt-2">Kontakt</h1>
        <p className="t-unter mx-auto mt-4 sm:mt-5">
          Am Telefon sprechen Sie mit uns selbst, nicht mit einer Zentrale. Mails beantworten wir meist am selben
          Werktag.
        </p>
        <a href="tel:+491607621876" className="abschluss-nummer !text-foreground hover:!text-gold-ink mt-8">
          0160&nbsp;7621876
        </a>
        <div className="aktionen mt-6">
          <Link href="/anfrage" className="btn-signal">
            Anfrage schreiben
          </Link>
          <MehrLink href="mailto:info@sitalo.de" groesse="unter">
            info@sitalo.de
          </MehrLink>
        </div>
      </div>
      <div data-auftritt="skala" className="inhalt mt-14 sm:mt-16">
        <Visitenkarte />
      </div>
    </section>
  );
}

function Visitenkarte() {
  return (
    <figure className="mx-auto w-full max-w-[26rem]">
      <div className="karte karte-regal relative flex aspect-[85/55] flex-col justify-between p-6 text-left sm:p-8">
        <SitaloLogo size="sm" />
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[14px] sm:text-[15px]">
          <span className="text-muted-foreground pt-px text-[12px]">Telefon</span>
          <span className="tabular-nums">0160&nbsp;7621876</span>
          <span className="text-muted-foreground pt-px text-[12px]">Mail</span>
          <span className="truncate">info@sitalo.de</span>
          <span className="text-muted-foreground pt-px text-[12px]">Web</span>
          <span>sitalo.de</span>
          <span className="text-muted-foreground pt-px text-[12px]">Ort</span>
          <span>Hamburg</span>
        </div>
      </div>
      <figcaption className="mt-6 flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-[14px]">Für das Adressbuch im Handy</span>
        <a href="/sitalo-kontakt.vcf" download="Sitalo-Webdesign.vcf" className="btn-line btn-mittel">
          <Download className="h-4 w-4" aria-hidden="true" />
          Visitenkarte speichern
        </a>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------
 * Alle Wege als Tabelle: was es ist, was Sie erwartet, wohin der Link
 * führt.
 * ---------------------------------------------------------------- */
const WEGE: { name: string; text: string; href: string; link: string; extern?: boolean }[] = [
  {
    name: "Formular",
    text: "Drei Felder für Ihr Vorhaben. Die Antwort kommt meist am selben Werktag.",
    href: "/anfrage",
    link: "Anfrage schreiben",
  },
  {
    name: "E-Mail",
    text: "An info@sitalo.de, gern mit Fotos oder der Adresse Ihrer jetzigen Seite.",
    href: "mailto:info@sitalo.de",
    link: "Mail schreiben",
    extern: true,
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
    <section className="flaeche-hell abschnitt" aria-labelledby="wege-titel">
      <div className="inhalt">
        <h2 id="wege-titel" data-auftritt="titel" className="zweiton">
          <span>Weitere Wege zu uns.</span> <span className="grau">Wählen Sie, was Ihnen liegt.</span>
        </h2>
      </div>
      <ul role="list" className="mx-auto mt-8 grid max-w-[1200px] gap-3 px-[max(var(--rinne),env(safe-area-inset-left))] sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-4">
        {WEGE.map((w, i) => (
          <li
            key={w.name}
            data-auftritt=""
            className={`karte karte-weiss karte-hover flex flex-col p-7 sm:p-8 ${i === 0 ? "lg:col-span-1" : ""}`}
          >
            <h3 className="t-karte">{w.name}</h3>
            <p className="text-muted-foreground mt-3 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty">{w.text}</p>
            <div className="mt-auto pt-6">
              <MehrLink href={w.href} kontext={w.name} groesse="klein" frei={false} className="karte-link">
                {w.link}
              </MehrLink>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Treffen in Hamburg, daneben die Karte mit den Stadtteil-Seiten.
 * ---------------------------------------------------------------- */
function Treffen() {
  return (
    <section className="flaeche-weiss abschnitt" aria-labelledby="treffen-titel">
      <div className="mx-auto grid w-full max-w-[1068px] items-center gap-12 px-[max(var(--rinne),env(safe-area-inset-left))] lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="treffen-titel" data-auftritt="titel" className="t-abschnitt">
            Treffen in Hamburg
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty">
            Wer in Hamburg sitzt, kann uns gern treffen: in Ihrem Betrieb oder in einem Café. Alle anderen
            sprechen mit uns am Telefon oder per Video. Die Website wird dieselbe.
          </p>
          <p className="text-muted-foreground mt-4 max-w-md text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty">
            Für {STANDORTE.length} Hamburger Stadtteile gibt es eine eigene Seite. Ein Klick auf den Namen in der
            Karte führt hin.
          </p>
          <MehrLink href="/standorte" className="mt-4">
            Alle Stadtteile
          </MehrLink>
        </div>
        <div className="karte min-w-0 p-4 sm:p-8 lg:col-span-7">
          <HamburgMap />
        </div>
      </div>
    </section>
  );
}
