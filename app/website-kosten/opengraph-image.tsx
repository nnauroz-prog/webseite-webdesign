import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Was kostet eine Website? Preise für kleine Unternehmen im Überblick.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "RATGEBER",
    headlineBold: "Was kostet",
    headlineItalic: "eine Website?",
    subline: "Baukasten, Freelancer, Agentur im Vergleich. Laufende Kosten und sechs Fragen an jedes Angebot.",
    urlPill: "sitalo.de/website-kosten",
  });
}
