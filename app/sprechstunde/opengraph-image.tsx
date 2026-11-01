import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Sprechstunde: jeden ersten Donnerstag im Monat, 17 bis 18:30 Uhr am Telefon.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · Sprechstunde",
    headline: "Jeden ersten Donnerstag im Monat am Telefon.",
    subline: "Von 17 bis 18:30 Uhr beantworten wir Fragen zu Ihrer Website, auch wenn Sie nie Kunde werden.",
    url: "sitalo.de/sprechstunde",
  });
}
