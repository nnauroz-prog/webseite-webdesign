import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt =
  "Sitalo Erreichbarkeit — Wir gehen ans Telefon. So oft wir können.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · ANTWORT-VERSPRECHEN",
    headlineBold: "Wir gehen ans Telefon.",
    headlineItalic: "So oft wir können.",
    subline:
      "Werktags meist innerhalb 4 Stunden. Wochenende Montag. Drei Wochen Urlaub im Jahr mit Vertretung für Akutfälle.",
    urlPill: "sitalo.de/erreichbarkeit",
  });
}
