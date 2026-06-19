import type { Metadata } from "next";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { VerticalLanding } from "@/components/marketing/vertical-landing";
import { getBrancheBySlug } from "@/lib/branchen-data";
import { SITE_URL } from "@/lib/site";
import { getVertikalLanding } from "@/lib/vertikal-landings";

const DATA = getVertikalLanding("pflege")!;
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
  // Service + BreadcrumbList + FAQPage als JSON-LD-Trio — gleicher
  // SEO-Footprint wie /branchen/[slug], damit die Vertikal-Landing
  // bei „Pflegedienst Website Hamburg" konkurrenzfähig rankt.
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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
