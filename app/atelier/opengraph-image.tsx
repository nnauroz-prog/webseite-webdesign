import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Über Sitalo: ein kleines Büro für Webdesign in Hamburg.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Über Sitalo · Hamburg",
    headline: "Ein kleines Büro für Webdesign in Hamburg.",
    subline: "Wer bei uns anruft, spricht mit jemandem, der die Seiten auch selbst baut.",
    url: "sitalo.de/atelier",
  });
}
