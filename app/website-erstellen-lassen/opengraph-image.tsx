import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Website erstellen lassen bei Sitalo: Festpreis ab 499\u00A0€.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Webdesign zum Festpreis",
    headline: "Website erstellen lassen, zum Festpreis ab 499\u00A0€.",
    subline: "Sie schicken Stichpunkte und Handyfotos. Wir bauen daraus Ihre Website und halten sie danach aktuell.",
    url: "sitalo.de/website-erstellen-lassen",
  });
}
