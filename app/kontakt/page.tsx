import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SitaloLogo } from "@/components/sitalo-logo";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM } from "@/lib/sprechstunde-data";
import { STANDORTE } from "@/lib/standorte-data";

export const metadata: Metadata = {
  title: "Kontakt — schreiben Sie uns direkt",
  description:
    "Rufen Sie an oder schreiben Sie uns über das Formular oder per E-Mail. Wir antworten meist am selben Werktag.",
  alternates: { canonical: "/kontakt" },
};

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/**
 * `/kontakt` — gesetzt wie ein Briefkopf: links die Nummer groß, rechts
 * die Visitenkarte zum Speichern. Darunter alle Wege als Tabelle und
 * zum Schluss Treffen in Hamburg mit der Stadtteil-Karte.
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

      <MarketingFooter />
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
 * Briefkopf: Nummer und Mail groß, daneben die Visitenkarte.
 * ---------------------------------------------------------------- */
function Briefkopf() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="min-w-0 lg:col-span-7">
          <p className="label-mono text-muted-foreground">Sitalo Webdesign · Hamburg</p>
          <h1 className="mt-5 text-[3rem] leading-[0.95] tracking-[-0.04em] sm:text-[5rem] lg:text-[5.6rem]">
            Kontakt
          </h1>
          <p className="text-muted-foreground mt-8 max-w-lg text-pretty text-[17px] leading-relaxed">
            Am Telefon sprechen Sie mit uns selbst, nicht mit einer Zentrale. Mails beantworten wir meist am selben
            Werktag.
          </p>
          <a
            href="tel:+491607621876"
            className="hover:text-gold mt-8 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[3.6rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160 7621876
          </a>
          <div>
            <a
              href="mailto:info@sitalo.de"
              className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[19px] font-semibold"
            >
              info@sitalo.de
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Visitenkarte />
        </div>
      </div>
    </section>
  );
}

function Visitenkarte() {
  return (
    <figure className="mx-auto w-full max-w-[26rem] lg:mr-0">
      <div
        className="bg-card border-border relative flex aspect-[85/55] flex-col justify-between overflow-hidden rounded-[3px] border p-5 shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)] sm:p-7"
      >
        <span aria-hidden="true" className="bg-gold absolute top-0 left-0 h-1.5 w-16" />
        <SitaloLogo size="sm" />
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[13.5px] sm:text-[14.5px]">
          <span className="label-mono text-muted-foreground pt-px text-[10.5px]">Telefon</span>
          <span className="font-mono tabular-nums">0160 7621876</span>
          <span className="label-mono text-muted-foreground pt-px text-[10.5px]">Mail</span>
          <span className="truncate font-mono">info@sitalo.de</span>
          <span className="label-mono text-muted-foreground pt-px text-[10.5px]">Web</span>
          <span className="font-mono">sitalo.de</span>
          <span className="label-mono text-muted-foreground pt-px text-[10.5px]">Ort</span>
          <span className="font-mono">Hamburg</span>
        </div>
      </div>
      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <span className="text-muted-foreground text-[14px]">Für das Adressbuch im Handy</span>
        <a href="/sitalo-kontakt.vcf" download="Sitalo-Webdesign.vcf" className="btn-line h-11 text-[14.5px]">
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
    text: `Jeden ersten Donnerstag von ${SPRECHSTUNDE_BEGINN_HHMM} bis ${SPRECHSTUNDE_ENDE_HHMM} Uhr am Telefon, offen für alle.`,
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
    <section className="bg-card border-border border-t" aria-labelledby="wege-titel">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 id="wege-titel" className="text-balance text-[2rem] leading-[1.0] tracking-[-0.032em] sm:text-[2.75rem]">
          Weitere Wege zu uns
        </h2>
        <ul className="border-foreground mt-10 border-t-2 sm:mt-12">
          {WEGE.map((w) => (
            <li
              key={w.name}
              className="border-border grid gap-x-8 gap-y-2 border-b py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline sm:py-6"
            >
              <span className="label-mono text-muted-foreground">{w.name}</span>
              <span className="text-foreground/85 max-w-xl text-pretty text-[16px] leading-relaxed">{w.text}</span>
              {w.extern ? (
                <a
                  href={w.href}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap underline-offset-4 hover:underline"
                >
                  {w.link} {ARROW}
                </a>
              ) : (
                <Link
                  href={w.href}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold whitespace-nowrap underline-offset-4 hover:underline"
                >
                  {w.link} {ARROW}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Treffen in Hamburg, daneben die Karte mit den Stadtteil-Seiten.
 * ---------------------------------------------------------------- */
function Treffen() {
  return (
    <section className="border-border border-t" aria-labelledby="treffen-titel">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2
            id="treffen-titel"
            className="text-balance text-[2rem] leading-[1.0] tracking-[-0.032em] sm:text-[2.75rem]"
          >
            Treffen in Hamburg
          </h2>
          <p className="text-foreground/85 mt-5 max-w-md text-pretty text-[16.5px] leading-relaxed">
            Wer in Hamburg sitzt, kann uns gern treffen: in Ihrem Betrieb oder in einem Café. Alle anderen
            sprechen mit uns am Telefon oder per Video. Die Website wird dieselbe.
          </p>
          <p className="text-muted-foreground mt-5 max-w-md text-pretty text-[15px] leading-relaxed">
            Für {STANDORTE.length} Hamburger Stadtteile gibt es eine eigene Seite. Ein Klick auf den Namen in der
            Karte führt hin.
          </p>
          <Link
            href="/standorte"
            className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
          >
            Alle Stadtteile {ARROW}
          </Link>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <HamburgMap />
        </div>
      </div>
    </section>
  );
}
