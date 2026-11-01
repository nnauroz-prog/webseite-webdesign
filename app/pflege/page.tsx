import type { Metadata } from "next";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { VerticalLanding } from "@/components/marketing/vertical-landing";
import { getBrancheBySlug } from "@/lib/branchen-data";
import { SITE_URL } from "@/lib/site";
import { getVertikalLanding, type VertikalLanding } from "@/lib/vertikal-landings";

const BASE = getVertikalLanding("pflege")!;

/**
 * Sichtbare Texte dieser Seite. Sie ersetzen die Fassung aus
 * lib/vertikal-landings.ts, die noch unbelegte Zahlen und eine
 * Liste angeblich betreuter Stadtteile enthält. SEO-Felder (Titel,
 * Beschreibung) und Verknüpfungen kommen weiter aus den Daten.
 */
const COPY: Pick<
  VertikalLanding,
  "eyebrow" | "headline" | "headlineItalic" | "subhead" | "pains" | "bauteile" | "process" | "schlussZitat" | "schlussZitatItalic"
> = {
  eyebrow: "Pflegedienst-Website aus Hamburg",
  headline: "Websites für Pflegedienste",
  headlineItalic: undefined,
  subhead:
    "Angehörige sollen auf den ersten Blick sehen, was Sie leisten und in welche Stadtteile Sie fahren. Pflegekräfte sollen sich vom Handy aus bei Ihnen bewerben können.",
  pains: [
    {
      headline: "Die Leistungen stehen nicht auf der Startseite.",
      body: "Familien suchen nach Grundpflege, Behandlungspflege oder 24-Stunden-Versorgung. Steht oben nur ein allgemeiner Satz wie „Wir kümmern uns um Sie“, rufen sie beim nächsten Dienst an.",
    },
    {
      headline: "Bewerben geht nur per Mail mit PDF.",
      body: "Wer als Pflegekraft mehrere Stellen vergleicht, bewirbt sich dort, wo es auf dem Handy schnell geht. Für ein erstes Gespräch reicht ein kurzes Formular.",
    },
    {
      headline: "Man sieht nicht, wer kommt.",
      body: "Angehörige wollen wissen, wer morgens vor der Tür steht. Dafür braucht die Seite Fotos vom Team, Ihre Zertifikate und einen Hinweis, wie Sie im Notfall erreichbar sind.",
    },
  ],
  bauteile: [
    {
      name: "Startseite",
      what: "Was Sie leisten, für wen und in welchem Gebiet. Die Notfallnummer steht oben in der Kopfleiste, auf jeder Seite.",
    },
    {
      name: "Leistungen",
      what: "Grundpflege, Behandlungspflege, Verhinderungspflege und Beratung nach § 37.3, klar getrennt. In Worten, die Familien verstehen und die Pflegekassen kennen.",
    },
    {
      name: "Bewerbungsformular",
      what: "Wenige Felder, auf dem Handy schnell ausgefüllt. Einen Lebenslauf kann man anhängen, muss es aber nicht.",
    },
    {
      name: "Team",
      what: "Fotos vom eigenen Team statt Bildern aus einer Datenbank, zu jeder Person ein paar Sätze.",
    },
    {
      name: "Einsatzgebiet",
      what: "Eine Karte mit Ihren Stadtteilen oder eine Liste der Postleitzahlen. So sehen Familien gleich, ob Sie zu ihnen kommen.",
    },
    {
      name: "Google-Eintrag",
      what: "Ihr Unternehmensprofil bei Google Maps richten wir mit ein. Gibt es schon einen Eintrag, bringen wir ihn auf den Stand der neuen Seite.",
    },
  ],
  process: [
    {
      woche: "Woche 1",
      what: "Erstes Gespräch am Telefon oder bei Ihnen vor Ort. Sie schicken, was schon da ist: alte Seite, Flyer, PDFs. Wir sortieren es.",
    },
    {
      woche: "Woche 2",
      what: "Wir bauen die Seite. Zum Ende der Woche bekommen Sie einen Test-Link und schauen sich alles in Ruhe an.",
    },
    {
      woche: "Woche 3",
      what: "Eine Korrekturrunde, in der wir alle Anmerkungen gesammelt umsetzen. Danach geht die Seite online, der Google-Eintrag wird parallel angepasst.",
    },
  ],
  schlussZitat: "Am Ende zählt, ob Familien anrufen und Pflegekräfte sich bewerben.",
  schlussZitatItalic: undefined,
};

const DATA: VertikalLanding = { ...BASE, ...COPY };
const BRANCHE = getBrancheBySlug(DATA.brancheSlug);
const FAQ = BRANCHE?.faq ?? [];

export const metadata: Metadata = {
  title: DATA.seoTitle,
  description: DATA.seoDescription,
  alternates: { canonical: "/pflege" },
  openGraph: {
    type: "website",
    title: DATA.seoTitle,
    description: DATA.seoDescription,
    url: `${SITE_URL}/pflege`,
  },
};

export default function PflegeLandingPage() {
  // Service + BreadcrumbList + FAQPage als JSON-LD, wie auf /branchen/[slug].
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pflegedienst-Website aus Hamburg",
    description: DATA.seoDescription,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Sitalo Webdesign",
    },
    areaServed: { "@type": "City", name: "Hamburg" },
    serviceType: "Webdesign für Pflegedienste",
    url: `${SITE_URL}/pflege`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pflegedienste",
        item: `${SITE_URL}/pflege`,
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
      <EditorialMasthead section="Pflegedienste" />
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
