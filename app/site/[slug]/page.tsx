import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Ga4Script } from "@/components/site/ga4-script";
import { PreviewBanner } from "@/components/site/preview-banner";
import { SiteAbout } from "@/components/site/site-about";
import { SiteApplication } from "@/components/site/site-application";
import { SiteBanner } from "@/components/site/site-banner";
import { SiteBooking } from "@/components/site/site-booking";
import { SiteContact } from "@/components/site/site-contact";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteGallery } from "@/components/site/site-gallery";
import { SiteHeader } from "@/components/site/site-header";
import { SiteHero } from "@/components/site/site-hero";
import { SiteHeroFullbleed } from "@/components/site/site-hero-fullbleed";
import { SiteHeroSplit } from "@/components/site/site-hero-split";
import { SiteServices } from "@/components/site/site-services";
import { SiteTeam } from "@/components/site/site-team";
import { SiteWhatsappButton } from "@/components/site/site-whatsapp-button";
import { getPublicSite } from "@/lib/site-data";
import { buildLocalBusinessJsonLd } from "@/lib/site-jsonld";
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

  // Search-engine site verification — only attached when the operator
  // pasted their token. Next renders these as <meta name="..."> tags.
  const verification: Metadata["verification"] = {};
  if (website.seo_google_site_verification) {
    verification.google = website.seo_google_site_verification;
  }
  if (website.seo_bing_site_verification) {
    verification.other = {
      "msvalidate.01": website.seo_bing_site_verification,
    };
  }

  return {
    title: { absolute: title },
    description,
    robots: website.is_active
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: { canonical: url },
    verification:
      Object.keys(verification).length > 0 ? verification : undefined,
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
  const canonicalUrl = `${getSiteUrl()}/site/${website.slug}`;
  const jsonLd = buildLocalBusinessJsonLd({
    website,
    services,
    team,
    template,
    url: canonicalUrl,
  });

  // Brand color override — when set, replaces --primary on the wrapper
  // and recomputes a readable foreground color (cream on dark, espresso
  // on light) using a simple luminance check so primary buttons stay
  // legible without us asking the user to pick a foreground too.
  const brandStyle = website.brand_primary_color
    ? buildBrandColorStyle(website.brand_primary_color)
    : undefined;

  return (
    <div
      data-template={templateKey}
      data-personality={meta.personality}
      style={brandStyle}
      className="bg-background flex min-h-screen flex-1 flex-col"
    >
      {/* Structured data + analytics — only on the live site. Preview
          renders stay out of the index and never report to GA. */}
      {!isPreview && (
        <>
          <script
            type="application/ld+json"
            // JSON.stringify is safe — no user-content concatenation.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {website.analytics_ga4_id ? (
            <Ga4Script measurementId={website.analytics_ga4_id} />
          ) : null}
        </>
      )}
      {isPreview && <PreviewBanner />}
      <SiteBanner website={website} />
      <SiteHeader website={website} />
      <main className="flex-1">
        {meta.hero === "split" ? (
          <SiteHeroSplit website={website} meta={meta} />
        ) : meta.hero === "fullbleed" ? (
          <SiteHeroFullbleed website={website} meta={meta} />
        ) : (
          <SiteHero website={website} meta={meta} />
        )}
        <SiteServices services={services} />
        <SiteAbout website={website} />
        <SiteTeam team={team} />
        <SiteGallery images={gallery} />
        <SiteBooking website={website} services={services} />
        <SiteContact website={website} />
        <SiteApplication website={website} />
      </main>
      <SiteFooter website={website} />
      <SiteWhatsappButton website={website} />
    </div>
  );
}

function truncate(value: string | null | undefined, max: number): string {
  const s = value?.trim();
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Build inline CSS-vars from a customer-chosen `#rrggbb`. Uses a
 * relative-luminance test so primary-foreground flips between cream
 * and espresso depending on whether the chosen color is dark or
 * light. Bad input falls back to no override.
 */
function buildBrandColorStyle(
  hex: string,
): React.CSSProperties | undefined {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return undefined;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 0xff;
  const g = (int >> 8) & 0xff;
  const b = int & 0xff;
  // Rec. 709 luma — quick & good enough for a contrast check.
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const fg = luma < 0.55 ? "#fbf6e8" : "#22160c";
  // CSS custom property assignment via the React style API.
  return {
    ["--primary" as string]: hex,
    ["--primary-foreground" as string]: fg,
    ["--ring" as string]: hex,
  };
}
