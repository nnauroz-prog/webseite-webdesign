import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";
import { LEXIKON } from "@/lib/lexikon-data";

export const runtime = "nodejs";
export const alt = "Sitalo Lexikon: Webbegriffe in Alltagsdeutsch erklärt.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: `Sitalo · Lexikon · ${LEXIKON.length} Begriffe`,
    headline: "Webbegriffe in Alltagsdeutsch.",
    subline: "Hosting, SSL, CMS, SEO und DSGVO, jeweils mit dem Satz, der für Ihre Entscheidung zählt.",
    url: "sitalo.de/lexikon",
  });
}
