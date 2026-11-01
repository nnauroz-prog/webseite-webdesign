import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";
import { getAllBrancheSlugs, getBrancheBySlug } from "@/lib/branchen-data";

/** Vorschaubild je Branche, Texte aus lib/branchen-data.ts. */

export const runtime = "nodejs";
export const alt = "Sitalo Webdesign: Websites nach Branche";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBrancheSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branche = getBrancheBySlug(slug);
  if (!branche) {
    return editorialOgImage({
      variant: "hell",
      eyebrow: "Sitalo · Branchen",
      headline: "Websites für Ihre Branche",
      subline: "Für jede Branche eine Musterseite und ein typischer Seitenplan.",
      url: "sitalo.de/branchen",
    });
  }
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · Branche",
    headline: `Websites für ${branche.label}`,
    subline: branche.detailHeadline,
    url: `sitalo.de/branchen/${branche.slug}`,
  });
}
