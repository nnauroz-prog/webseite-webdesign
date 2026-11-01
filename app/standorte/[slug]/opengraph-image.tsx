import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";
import { getAllStandortSlugs, getStandortBySlug } from "@/lib/standorte-data";

/** Vorschaubild je Stadtteil, Texte aus lib/standorte-data.ts. */

export const runtime = "nodejs";
export const alt = "Sitalo Webdesign: Website erstellen lassen in Hamburg";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllStandortSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const standort = getStandortBySlug(slug);
  if (!standort) {
    return editorialOgImage({
      variant: "hell",
      eyebrow: "Sitalo · Hamburg",
      headline: "Webdesign in Hamburger Stadtteilen",
      subline: "Für jeden Stadtteil eine eigene Seite mit den Suchbegriffen, die dort zählen.",
      url: "sitalo.de/standorte",
    });
  }
  return editorialOgImage({
    variant: "hell",
    eyebrow: `Webdesign in Hamburg-${standort.name}`,
    headline: `Website erstellen lassen in ${standort.name}`,
    subline: standort.tagline,
    url: `sitalo.de/standorte/${standort.slug}`,
  });
}
