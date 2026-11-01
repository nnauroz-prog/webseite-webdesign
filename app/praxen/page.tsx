import type { Metadata } from "next";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { VerticalLanding } from "@/components/marketing/vertical-landing";
import { getBrancheBySlug } from "@/lib/branchen-data";
import { SITE_URL } from "@/lib/site";
import { getVertikalLanding, type VertikalLanding } from "@/lib/vertikal-landings";

const BASE = getVertikalLanding("praxen")!;

/**
 * Sichtbare Texte dieser Seite. Sie ersetzen die Fassung aus
 * lib/vertikal-landings.ts, die noch eine unbelegte Prozentangabe und
 * eine Liste angeblich betreuter Stadtteile enthält. SEO-Felder (Titel,
 * Beschreibung) und Verknüpfungen kommen weiter aus den Daten.
 */
const COPY: Pick<
  VertikalLanding,
  "eyebrow" | "headline" | "headlineItalic" | "subhead" | "pains" | "bauteile" | "process" | "schlussZitat" | "schlussZitatItalic"
> = {
  eyebrow: "Praxis-Website aus Hamburg",
  // \u00AD: weiche Trennung, damit das lange Wort am Handy umbrechen kann.
  headline: "Websites für Arzt- und Zahnarzt\u00ADpraxen",
  headlineItalic: undefined,
  subhead:
    "Vor dem ersten Termin schauen Patient:innen nach Sprechzeiten, Anfahrt und Behandlungen. Auf Ihrer Seite finden sie das ohne Suchen und können gleich einen Termin anfragen.",
  pains: [
    {
      headline: "Die Sprechzeiten sind schwer zu finden.",
      body: "Vor dem Anruf suchen Patient:innen nach Sprechzeiten und Notdienst. Stecken die in einem PDF unter „Praxisinfo“, wählen sie die nächste Praxis. Sprechzeiten gehören oben auf jede Seite.",
    },
    {
      headline: "Die Seite wirkt veraltet.",
      body: "Wenn eine Seite am Handy verrutscht oder seit Jahren gleich aussieht, schließen Patient:innen daraus auf die Praxis. Vor dem ersten Besuch haben sie nichts anderes, woran sie sich halten können.",
    },
    {
      headline: "Jeder Termin läuft über das Telefon.",
      body: "Ohne Online-Anfrage muss jeder Erstkontakt über die Anmeldung, und dort ist die Leitung oft belegt. Ein Formular mit Wunschterminen nimmt dem Telefon einen Teil der Anfragen ab.",
    },
  ],
  bauteile: [
    {
      name: "Sprechzeiten oben",
      what: "Auf jeder Seite sichtbar, mit Hinweis auf den Notdienst. Wer die Seite öffnet, sieht sofort, ob heute geöffnet ist.",
    },
    {
      name: "Terminanfrage",
      what: "Ein Formular mit drei Wunschterminen. Die Anfrage kommt als E-Mail in der Praxis an. Auf Wunsch binden wir Doctolib oder Jameda ein.",
    },
    {
      name: "Behandlungen",
      what: "Ihre Leistungen in Alltagssprache. Patient:innen suchen mit ihren eigenen Worten. Finden sie die nicht, nehmen sie an, dass Sie es nicht anbieten.",
    },
    {
      name: "Team",
      what: "Porträts von Ärzt:innen und Praxisteam, zu jeder Person ein paar Sätze. Man möchte wissen, zu wem man geht.",
    },
    {
      name: "Anfahrt und Parken",
      what: "Karte, Haltestellen, Parkplätze und ob es einen Aufzug gibt. Für ältere Patient:innen gibt das oft den Ausschlag.",
    },
    {
      name: "Datenschutz",
      what: "Impressum, Datenschutzerklärung und Cookie-Hinweis richten wir vor dem Start passend zu den Funktionen der Seite ein. Praxen werden häufig abgemahnt, deshalb nehmen wir das genau.",
    },
  ],
  process: [
    {
      woche: "Woche 1",
      what: "Erstes Gespräch und ein Blick auf Ihre bisherige Seite. Sie schicken Texte, Fotos und Angaben zum Team. Wo Texte fehlen, schreiben wir sie.",
    },
    {
      woche: "Woche 2",
      what: "Wir bauen die Seite. Sie bekommen einen Test-Link und schauen sie in Ruhe durch.",
    },
    {
      woche: "Woche 3",
      what: "Eine gesammelte Korrekturrunde, dann geht die Seite online. Das Terminformular testen wir vorher mit Ihrer Anmeldung.",
    },
  ],
  schlussZitat: "Eine Praxis-Seite muss seriös wirken, bevor jemand bei Ihnen klingelt.",
  schlussZitatItalic: undefined,
};

const DATA: VertikalLanding = { ...BASE, ...COPY };
const BRANCHE = getBrancheBySlug(DATA.brancheSlug);
const FAQ = BRANCHE?.faq ?? [];

export const metadata: Metadata = {
  title: DATA.seoTitle,
  description: DATA.seoDescription,
  alternates: { canonical: "/praxen" },
  openGraph: {
    type: "website",
    title: DATA.seoTitle,
    description: DATA.seoDescription,
    url: `${SITE_URL}/praxen`,
  },
};

export default function PraxenLandingPage() {
  // Service + BreadcrumbList + FAQPage als JSON-LD, wie auf /branchen/[slug].
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Praxis-Website aus Hamburg",
    description: DATA.seoDescription,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Sitalo Webdesign",
    },
    areaServed: { "@type": "City", name: "Hamburg" },
    serviceType: "Webdesign für Arzt- und Zahnarztpraxen",
    url: `${SITE_URL}/praxen`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Praxen",
        item: `${SITE_URL}/praxen`,
      },
    ],
  };

  const faqLd =
    FAQ.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  const jsonLd = faqLd ? [serviceLd, breadcrumbLd, faqLd] : [serviceLd, breadcrumbLd];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Praxen" />
      <main id="main" tabIndex={-1} className="flex-1">
        <VerticalLanding data={DATA} faq={FAQ} />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
