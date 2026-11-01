import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Auswahl: welche Aufträge wir annehmen und wonach wir entscheiden.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · Auswahl",
    headline: "Welche Aufträge wir annehmen.",
    subline: "Hier steht, wonach wir entscheiden, welche Aufträge wir annehmen.",
    url: "sitalo.de/auswahl",
  });
}
