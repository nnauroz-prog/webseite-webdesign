import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Erreichbarkeit: Antwortzeiten und Urlaub.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Erreichbarkeit",
    headline: "Werktags antworten wir meist am selben Tag.",
    subline: "Hier steht, wann wir antworten und was gilt, wenn wir im Urlaub sind.",
    url: "sitalo.de/erreichbarkeit",
  });
}
