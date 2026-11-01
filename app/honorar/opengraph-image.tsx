import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Honorar: Stundensatz und Aufwand je Paket.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Honorar",
    headline: "So entstehen unsere Preise.",
    subline: "Stundensatz, Aufwand je Paket und was wir nicht abrechnen.",
    url: "sitalo.de/honorar",
  });
}
