import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Atelier — Wer wir sind, warum wir das machen.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "SITALO · DAS ATELIER",
    headlineBold: "Eine kleine Werkstatt.",
    headlineItalic: "In Hamburg.",
    subline:
      "Professionelle Websites für lokale Unternehmen — kein Konzern, kein Callcenter, kein Verkaufsteam.",
    urlPill: "sitalo.de/atelier",
  });
}
