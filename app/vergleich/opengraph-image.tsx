import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Vergleich: Wix, Squarespace, Jimdo und Selbstbau mit realistischen Kosten.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Vergleich",
    headline: "Baukasten, Selbstbau oder Webdesign-Büro?",
    subline: "Wix, Squarespace, Jimdo und Selbstbau im Vergleich, mit realistischen Kosten und Ihrer eigenen Zeit.",
    url: "sitalo.de/vergleich",
  });
}
