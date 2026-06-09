import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Lexikon — Webbegriffe in Klartext.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · LEXIKON · ZWÖLF BEGRIFFE",
    headlineBold: "Webbegriffe,",
    headlineItalic: "ohne Einschüchterung.",
    subline:
      "Hosting, SSL, CMS, SEO, DSGVO — in ehrlichem Deutsch, jeweils mit dem einen Satz, der für Ihre Entscheidung zählt.",
    urlPill: "sitalo.de/lexikon",
  });
}
