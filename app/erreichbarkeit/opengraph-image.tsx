import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Erreichbarkeit: Antwortzeiten, Urlaub und Vertretung.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Erreichbarkeit",
    headline: "Werktags antworten wir meist am selben Tag.",
    subline: "Hier steht, wann wir antworten, was im Urlaub gilt und wer im Notfall einspringt.",
    url: "sitalo.de/erreichbarkeit",
  });
}
