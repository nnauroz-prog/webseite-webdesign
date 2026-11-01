import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Was kostet eine Website? Preise für kleine Unternehmen im Überblick.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Ratgeber",
    headline: "Was kostet eine Website?",
    subline: "Baukasten, Freelancer und Agentur im Vergleich, dazu die laufenden Kosten und sechs Fragen an jedes Angebot.",
    url: "sitalo.de/website-kosten",
  });
}
