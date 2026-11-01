import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";
import { getAllPaketSlugs, getPaketBySlug } from "@/lib/pakete-data";

/**
 * Vorschaubild je Paket: Name und Einmalpreis als Überschrift,
 * Monatsbeitrag und Kurzbeschreibung darunter (aus lib/pakete-data.ts).
 */

export const runtime = "nodejs";
export const alt = "Sitalo Webdesign: Website-Paket mit Festpreis";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPaketSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paket = getPaketBySlug(slug);
  if (!paket) {
    return editorialOgImage({
      variant: "hell",
      eyebrow: "Sitalo · Pakete",
      headline: "Website-Pakete ab 499 €",
      subline: "Dazu ab 49 € im Monat für Hosting, Updates und kleine Änderungen.",
      url: "sitalo.de/pakete",
    });
  }
  const monatlich = paket.monthly.replace(/\s*\/\s*Monat$/, " im Monat");
  return editorialOgImage({
    variant: paket.highlight ? "dunkel" : "hell",
    eyebrow: "Sitalo · Website-Paket",
    headline: `${paket.name}, ${paket.setup}`,
    subline: `Dazu ${monatlich}. ${paket.description}`,
    url: `sitalo.de/pakete/${paket.slug}`,
  });
}
