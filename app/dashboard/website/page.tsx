import type { Metadata } from "next";

import { LivePreview } from "@/components/dashboard/live-preview";
import { AboutForm } from "@/components/dashboard/website/about-form";
import { AboutImageForm } from "@/components/dashboard/website/about-image-form";
import { CustomDomainForm } from "@/components/dashboard/website/custom-domain-form";
import { FormsToggleForm } from "@/components/dashboard/website/forms-toggle-form";
import { HeroForm } from "@/components/dashboard/website/hero-form";
import { HeroImageForm } from "@/components/dashboard/website/hero-image-form";
import { LegalForm } from "@/components/dashboard/website/legal-form";
import { LogoForm } from "@/components/dashboard/website/logo-form";
import { MetaForm } from "@/components/dashboard/website/meta-form";
import { PublishForm } from "@/components/dashboard/website/publish-form";
import { SeoForm } from "@/components/dashboard/website/seo-form";
import { SlugForm } from "@/components/dashboard/website/slug-form";
import { TemplateForm } from "@/components/dashboard/website/template-form";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import type { TemplateRow } from "@/types/website";

export const metadata: Metadata = { title: "Website" };

export default async function WebsitePage() {
  const { supabase, website } = await requireCurrentWebsite();

  const { data: templatesRows } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("name");
  const templates = (templatesRows as TemplateRow[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Website-Inhalte
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Links bearbeiten, rechts live prüfen. Jede Sektion wird einzeln
          gespeichert.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <PublishForm website={website} />
          <TemplateForm website={website} templates={templates} />
          <MetaForm website={website} />
          <LogoForm website={website} />
          <HeroForm website={website} />
          <HeroImageForm website={website} />
          <AboutForm website={website} />
          <AboutImageForm website={website} />
          <SeoForm website={website} />
          <LegalForm website={website} />
          <FormsToggleForm website={website} />
          <SlugForm website={website} />
          <CustomDomainForm website={website} />
        </div>
        <div className="hidden lg:block">
          <LivePreview slug={website.slug} />
        </div>
      </div>
    </div>
  );
}
