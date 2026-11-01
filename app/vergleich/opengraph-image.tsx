import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Vergleich: Wix, Squarespace, Jimdo und Selbstbau, wann welcher Weg passt.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Vergleich",
    headline: "Baukasten, Selbstbau oder Webdesign-Büro?",
    subline: "Wix, Squarespace, Jimdo und Selbstbau im Vergleich: wann welcher Weg passt und wie viel eigene Zeit er kostet.",
    url: "sitalo.de/vergleich",
  });
}
