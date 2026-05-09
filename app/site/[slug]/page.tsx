import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PreviewBanner } from "@/components/site/preview-banner";
import { SiteAbout } from "@/components/site/site-about";
import { SiteContact } from "@/components/site/site-contact";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteGallery } from "@/components/site/site-gallery";
import { SiteHeader } from "@/components/site/site-header";
import { SiteHero } from "@/components/site/site-hero";
import { SiteHeroSplit } from "@/components/site/site-hero-split";
import { SiteServices } from "@/components/site/site-services";
import { SiteTeam } from "@/components/site/site-team";
import { getPublicSite } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";
import { getTemplateMeta, resolveTemplateKey } from "@/lib/templates";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicSite(slug);
  if (!data) return { title: "Nicht gefunden" };
  const { website } = data;

  const title =
    website.seo_title?.trim() ||
    [website.business_name, website.industry].filter(Boolean).join(" · ") ||
    website.business_name;

  const description =
    website.seo_description?.trim() ||
    website.hero_subtitle?.trim() ||
    truncate(website.about_text, 155) ||
    `Offizielle Website von ${website.business_name}.`;

  const url = `${getSiteUrl()}/site/${website.slug}`;

  return {
    title: { absolute: title },
    description,
    robots: website.is_active
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: website.business_name,
      images: website.logo_url ? [{ url: website.logo_url }] : undefined,
      locale: "de_DE",
    },
    twitter: {
      card: website.logo_url ? "summary" : "summary_large_image",
      title,
      description,
      images: website.logo_url ? [website.logo_url] : undefined,
    },
  };
}

export default async function PublicSitePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const data = await getPublicSite(slug);
  if (!data) notFound();

  const { website, services, team, gallery, template, isPreview } = data;
  const templateKey = resolveTemplateKey(template);
  const meta = getTemplateMeta(templateKey);

  return (
    <div
      data-template={templateKey}
      className="bg-background flex min-h-screen flex-1 flex-col"
    >
      {isPreview && <PreviewBanner />}
      <SiteHeader website={website} />
      <main className="flex-1">
        {meta.hero === "split" ? (
          <SiteHeroSplit website={website} meta={meta} />
        ) : (
          <SiteHero website={website} meta={meta} />
        )}
        <SiteServices services={services} />
        <SiteAbout website={website} />
        <SiteTeam team={team} />
        <SiteGallery images={gallery} />
        <SiteContact website={website} />
      </main>
      <SiteFooter website={website} />
    </div>
  );
}

function truncate(value: string | null | undefined, max: number): string {
  const s = value?.trim();
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
