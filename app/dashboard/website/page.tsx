import type { Metadata } from "next";

import { AboutForm } from "@/components/dashboard/website/about-form";
import { FormsToggleForm } from "@/components/dashboard/website/forms-toggle-form";
import { HeroForm } from "@/components/dashboard/website/hero-form";
import { LegalForm } from "@/components/dashboard/website/legal-form";
import { LogoForm } from "@/components/dashboard/website/logo-form";
import { MetaForm } from "@/components/dashboard/website/meta-form";
import { PublishForm } from "@/components/dashboard/website/publish-form";
import { SeoForm } from "@/components/dashboard/website/seo-form";
import { SlugForm } from "@/components/dashboard/website/slug-form";
import { requireCurrentWebsite } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Website" };

export default async function WebsitePage() {
  const { website } = await requireCurrentWebsite();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Website-Inhalte
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Jede Sektion wird einzeln gespeichert.
        </p>
      </div>

      <PublishForm website={website} />
      <MetaForm website={website} />
      <LogoForm website={website} />
      <HeroForm website={website} />
      <AboutForm website={website} />
      <SeoForm website={website} />
      <LegalForm website={website} />
      <FormsToggleForm website={website} />
      <SlugForm website={website} />
    </div>
  );
}
