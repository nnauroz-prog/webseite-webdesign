import type { Metadata } from "next";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { VerticalLanding } from "@/components/marketing/vertical-landing";
import { getBrancheBySlug } from "@/lib/branchen-data";
import { SITE_URL } from "@/lib/site";
import { getVertikalLanding, type VertikalLanding } from "@/lib/vertikal-landings";

const DATA: VertikalLanding = getVertikalLanding("praxen")!;
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
    // Das Unternehmen selbst beschreibt das Root-Layout (ProfessionalService).
    provider: { "@id": `${SITE_URL}/#business` },
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
