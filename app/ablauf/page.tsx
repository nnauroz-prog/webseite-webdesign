import type { Metadata } from "next";

import { Abschluss as AppleAbschluss, MehrLink } from "@/components/marketing/apple";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ablauf: So läuft Ihr Website-Projekt ab",
  description:
    "So läuft es bei uns: Sie schreiben uns, wir sprechen kurz, wir bauen, Sie prüfen den Test-Link, die Seite geht online. Mit Festpreis vorab.",
  alternates: { canonical: "/ablauf" },
};

/**
 * Die Halte des Ablaufs. `number` bleibt zweistellig, weil die Anker
 * (#step-01 …) im HowTo-Schema darauf zeigen. `wer` und `hinweis`
 * stehen als Fahrplan-Spalten neben dem Text.
 */
const STEPS = [
  {
    number: "01",
    title: "Sie schreiben uns",
    body: `Über das Formular mit drei Pflichtfeldern oder per Mail an ${CONTACT_EMAIL}. Ein paar Sätze dazu, was Sie brauchen, reichen.`,
    wer: "Sie",
    hinweis: "Antwort meist am selben Werktag",
  },
  {
    number: "02",
    title: "Gespräch und Festpreis",
    body: "Eine Viertelstunde am Telefon oder per Video, in Hamburg auf Wunsch bei einem Kaffee. Danach schicken wir Ihnen den Festpreis schriftlich.",
    wer: "Sie und wir",
    hinweis: "Meist eine Viertelstunde",
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
    body: "Aus Ihren Stichpunkten schreiben wir die Texte, dann gestalten und bauen wir die Seite für Handy und Rechner. Ab vollständigen Unterlagen steht eine einzelne Seite oft nach ein bis zwei Werktagen, Business meist nach fünf bis zehn. Für Premium und Studio rechnen Sie mit zwei bis fünf Wochen.",
    wer: "Wir",
    hinweis: "Starter oft 1–2, Business meist 5–10 Werktage",
  },
  {
    number: "05",
    title: "Sie prüfen den Test-Link",
    body: "Sie sehen die fertige Seite unter einer Testadresse und schicken Ihre Änderungswünsche gesammelt. Eine Runde ist im Preis, bei Studio sind es bis zu drei. Freigegeben wird erst, wenn alles stimmt.",
    wer: "Sie",
    hinweis: "Eine Korrekturrunde inklusive, bei Studio bis zu drei",
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
            <a href="tel:+491607621876" className="inline-flex min-h-11 items-center">
              Eine Nummer für alle Fragen: 0160&nbsp;7621876
            </a>
          }
        >
          Sechs Halte vom ersten Anruf bis zur fertigen Seite. Sie sprechen dabei die ganze Zeit mit uns selbst, und den
          Termin, an dem die Seite online geht, nennen wir Ihnen vorab.
        </PageHero>
        <Fahrplan />
        <Abschluss />
      </main>
      <MarketingFooter crumb="Ablauf" />
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
 * Fahrplan als Apple-Kacheln: sechs gerundete Karten, je mit runder
 * Nummer, Titel, Text und „Wer · Hinweis“ darunter. Der letzte Halt ist
 * schwarz (Höhepunkt). Anker #step-01 … bleiben (HowTo-Schema).
 * ---------------------------------------------------------------- */
function Fahrplan() {
  const last = STEPS.length - 1;
  return (
    <section className="flaeche-hell abschnitt">
      <ol role="list" className="mx-auto grid max-w-[1200px] gap-3 px-[max(var(--rinne),env(safe-area-inset-left))] md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {STEPS.map((step, i) => (
          <li
            key={step.number}
            id={`step-${step.number}`}
            data-auftritt=""
            className={`karte ${i === last ? "karte-schwarz" : "karte-weiss"} flex scroll-mt-24 flex-col p-7 sm:p-9`}
          >
            <span
              aria-hidden="true"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[17px] font-semibold tabular-nums ${
                i === last ? "bg-gold text-foreground" : "bg-[var(--hell)] text-foreground"
              }`}
            >
              {i + 1}
            </span>
            <p className="t-eyebrow mt-5 text-[14px]">{i === last ? "Endhalt" : `Halt ${i + 1}`}</p>
            <h2 className="t-karte mt-1">{step.title}</h2>
            <p className="text-muted-foreground mt-3 text-[17px] leading-[1.47] tracking-[-0.022em]">{step.body}</p>
            <dl className="mt-auto grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-t border-[var(--border)] pt-5 text-[14px] leading-[1.43] [.karte-schwarz_&]:border-[#424245]">
              <dt className="text-muted-foreground">Wer</dt>
              <dd className="font-semibold">{step.wer}</dd>
              <dt className="text-muted-foreground">Hinweis</dt>
              <dd>{step.hinweis}</dd>
            </dl>
          </li>
        ))}
      </ol>
      <div className="inhalt mt-10 text-center">
        <p className="t-fuss text-[14px]">
          Was eine Seite kostet, steht vorher fest. Kommt etwas dazu, sprechen wir vorher darüber.
        </p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-8">
          <MehrLink href="/pakete">Pakete</MehrLink>
          <MehrLink href="/faq">Fragen</MehrLink>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: schwarz, Telefonnummer groß, Pille und Mail.
 * ---------------------------------------------------------------- */
function Abschluss() {
  return (
    <AppleAbschluss
      id="kontakt"
      titel="Der erste Halt ist ein Anruf oder eine Mail."
      zwischen={
        <a href="tel:+491607621876" className="abschluss-nummer">
          0160&nbsp;7621876
        </a>
      }
      unter="Wer lieber schreibt, nutzt das Formular oder schickt eine Mail. Danach geht es mit Halt 2 weiter."
      link={{ href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL }}
    />
  );
}
