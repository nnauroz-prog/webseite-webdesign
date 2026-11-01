import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "So läuft Ihr Website-Projekt ab — Schritt für Schritt",
  description:
    "So läuft es bei uns: Sie schreiben uns, wir sprechen kurz, wir bauen, Sie prüfen den Test-Link, die Seite geht online. Mit Festpreis vorab.",
  alternates: { canonical: "/ablauf" },
};

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/**
 * Die Halte des Ablaufs. `number` bleibt zweistellig, weil die Anker
 * (#step-01 …) im HowTo-Schema darauf zeigen. `wer` und `hinweis`
 * stehen als Fahrplan-Spalten neben dem Text.
 */
const STEPS = [
  {
    number: "01",
    title: "Sie schreiben uns",
    body: `Über das Formular mit drei Feldern oder per Mail an ${CONTACT_EMAIL}. Ein paar Sätze dazu, was Sie brauchen, reichen.`,
    wer: "Sie",
    hinweis: "Antwort meist am selben Werktag",
  },
  {
    number: "02",
    title: "Gespräch und Festpreis",
    body: "Eine Viertelstunde am Telefon oder per Video, in Hamburg auf Wunsch bei einem Kaffee. Danach schicken wir Ihnen den Festpreis schriftlich.",
    wer: "Sie und wir",
    hinweis: "15 Minuten",
  },
  {
    number: "03",
    title: "Sie schicken Ihre Unterlagen",
    body: "Ihr Logo in jedem Format, ein paar Fotos und Stichpunkte zu Ihren Leistungen. Handyfotos reichen, und wenn etwas fehlt, sagen wir Bescheid.",
    wer: "Sie",
    hinweis: "Fertige Texte brauchen wir nicht",
  },
  {
    number: "04",
    title: "Wir bauen die Seite",
    body: "Aus Ihren Stichpunkten schreiben wir die Texte, dann gestalten und bauen wir die Seite für Handy und Rechner. Kleine Seiten stehen oft nach ein bis zwei Werktagen.",
    wer: "Wir",
    hinweis: "Kleine Seiten oft in 1–2 Werktagen",
  },
  {
    number: "05",
    title: "Sie prüfen den Test-Link",
    body: "Sie sehen die fertige Seite unter einer Testadresse und schicken Ihre Änderungswünsche gesammelt. Eine Runde ist im Preis, freigegeben wird erst, wenn alles stimmt.",
    wer: "Sie",
    hinweis: "Eine Änderungsrunde inklusive",
  },
  {
    number: "06",
    title: "Die Seite geht online",
    body: "Domain, SSL-Zertifikat und Hosting richten wir ein und prüfen Formular und Karte auf echten Geräten. Danach erreichen Sie uns unter derselben Nummer wie vorher.",
    wer: "Wir",
    hinweis: "Zum vereinbarten Termin",
  },
];

export default function AblaufPage() {
  // HowTo-Schema mit den 6 Schritten plus BreadcrumbList für die
  // Hierarchie. Keine totalTime: Kleine Seiten stehen oft nach ein bis
  // zwei Werktagen, größere bekommen einen eigenen Termin. Eine feste
  // Gesamtdauer würde einer der beiden Aussagen widersprechen.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "So läuft Ihr Website-Projekt mit Sitalo ab",
    description:
      "Sechs Halte vom ersten Anruf bis zur fertigen Seite, mit Festpreis vorab und verbindlichem Termin.",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
      url: `${SITE_URL}/ablauf#step-${s.number}`,
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
        name: "Ablauf",
        item: `${SITE_URL}/ablauf`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Ablauf"
          eyebrow="Ablauf"
          title="So läuft Ihr Website-Projekt ab"
          meta={
            <a href="tel:+491607621876" className="text-stahl-hell hover:text-background font-mono text-[12px] transition-colors">
              Eine Nummer für alle Fragen: 0160 7621876
            </a>
          }
        >
          Sechs Halte vom ersten Anruf bis zur fertigen Seite. Sie sprechen dabei die ganze Zeit mit denselben Leuten, und
          größere Projekte bekommen vorab einen verbindlichen Termin.
        </PageHero>
        <Fahrplan />
        <Abschluss />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([howToLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Fahrplan: eine senkrechte Linie mit Haltestellen. Links die Linie,
 * in der Mitte was passiert, rechts wer dran ist und was es dauert.
 * Die Punkte wachsen beim Scrollen über .ablauf-dot (globals.css),
 * bei reduzierter Bewegung stehen sie still.
 * ---------------------------------------------------------------- */
function Fahrplan() {
  const last = STEPS.length - 1;
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="text-muted-foreground hidden grid-cols-[2.5rem_minmax(0,1fr)_17rem] gap-x-10 pb-3 lg:grid">
          <span aria-hidden="true" />
          <span className="label-mono">Halt und was passiert</span>
          <span className="label-mono">Wer · Hinweis</span>
        </div>
        <ol className="border-foreground border-b">
          {STEPS.map((step, i) => (
            <li
              key={step.number}
              id={`step-${step.number}`}
              className="grid scroll-mt-24 grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 sm:gap-x-8 lg:grid-cols-[2.5rem_minmax(0,1fr)_17rem] lg:gap-x-10"
            >
              {/* Linie und Haltestelle */}
              <div aria-hidden="true" className="relative row-span-2 lg:row-span-1">
                <span
                  className={`bg-foreground absolute left-1/2 w-[3px] -translate-x-1/2 ${
                    i === 0 ? "top-[41px] bottom-0 lg:top-[49px]" : i === last ? "top-0 h-[41px] lg:h-[49px]" : "inset-y-0"
                  }`}
                />
                <span className="absolute inset-x-0 top-[33px] flex justify-center lg:top-[41px]">
                  <span
                    className={`ablauf-dot block h-4 w-4 rounded-full border-[3px] ${
                      i === last ? "bg-gold border-foreground" : "bg-background border-foreground"
                    }`}
                  />
                </span>
              </div>

              <div className={`border-t pt-8 pb-3 lg:py-10 ${i === 0 ? "border-foreground" : "border-border"}`}>
                <p className="label-mono text-gold">{i === last ? "Endhalt" : `Halt ${i + 1}`}</p>
                <h2 className="mt-2 text-[1.6rem] leading-[1.1] tracking-[-0.025em] sm:text-[2rem]">{step.title}</h2>
                <p className="text-foreground/80 mt-3 max-w-xl text-[16px] leading-relaxed">{step.body}</p>
              </div>

              <dl
                className={`col-start-2 grid grid-cols-[auto_minmax(0,1fr)] content-start gap-x-4 gap-y-1.5 pb-8 text-[14.5px] lg:col-start-3 lg:grid-cols-1 lg:gap-y-1 lg:border-t lg:py-10 ${
                  i === 0 ? "lg:border-foreground" : "lg:border-border"
                }`}
              >
                <dt className="label-mono text-muted-foreground pt-[3px] text-[11px] lg:pt-0">Wer</dt>
                <dd className="font-semibold">{step.wer}</dd>
                <dt className="label-mono text-muted-foreground pt-[3px] text-[11px] lg:mt-3 lg:pt-0">Hinweis</dt>
                <dd className="text-muted-foreground leading-snug">{step.hinweis}</dd>
              </dl>
            </li>
          ))}
        </ol>
        <div className="text-muted-foreground mt-6 flex flex-col justify-between gap-3 font-mono text-[12px] sm:flex-row">
          <span>Was eine Seite kostet, steht vorher fest. Kommt etwas dazu, sprechen wir vorher darüber.</span>
          <span className="flex gap-5">
            <Link href="/pakete" className="hover:text-foreground underline-offset-4 hover:underline">
              Pakete →
            </Link>
            <Link href="/faq" className="hover:text-foreground underline-offset-4 hover:underline">
              Fragen →
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: Telefonnummer groß, daneben Mail und Anfrage.
 * ---------------------------------------------------------------- */
function Abschluss() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-stahl-hell text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
            Der erste Halt ist ein Anruf oder eine Mail.
          </h2>
          <a
            href="tel:+491607621876"
            className="hover:text-gold mt-5 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[4rem] lg:text-[4.4rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160 7621876
          </a>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-stahl-hell text-[16px] leading-relaxed">
            Wer lieber schreibt, nutzt das Formular oder schickt eine Mail. Danach geht es mit Halt 2 weiter.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold">
            {CONTACT_EMAIL}
          </a>
          <div className="mt-7">
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben {ARROW}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
