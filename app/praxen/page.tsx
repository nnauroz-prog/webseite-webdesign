import type { Metadata } from "next";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { VerticalLanding } from "@/components/marketing/vertical-landing";
import { SITE_URL } from "@/lib/site";
import { getVertikalLanding } from "@/lib/vertikal-landings";

const DATA = getVertikalLanding("praxen")!;

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
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Praxen" />
      <main id="main" tabIndex={-1} className="flex-1">
        <VerticalLanding data={DATA} />
      </main>
      <MarketingFooter />
    </div>
  );
}
