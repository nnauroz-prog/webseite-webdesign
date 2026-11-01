import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo 3-Jahres-Rechner: Gesamtkosten neben Wix, Squarespace, Jimdo und Selbstbau.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · 3-Jahres-Rechner",
    headline: "Was kostet eine Website über drei Jahre?",
    subline: "Sitalo neben Wix, Squarespace, Jimdo und Selbstbau, Ihre eigene Arbeitszeit eingerechnet.",
    url: "sitalo.de/rechner",
  });
}
