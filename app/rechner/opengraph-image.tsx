import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo 3-Jahres-Rechner — Was kostet es wirklich?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "SITALO · 3-JAHRES-RECHNER",
    headlineBold: "Was kostet es",
    headlineItalic: "über drei Jahre?",
    subline:
      "Sitalo, Wix, Squarespace, Jimdo, KI-Selbstbau — mit Ihrer Eigenzeit als echtem Geld gerechnet. Drei Slider, fünf Balken.",
    urlPill: "sitalo.de/rechner",
  });
}
