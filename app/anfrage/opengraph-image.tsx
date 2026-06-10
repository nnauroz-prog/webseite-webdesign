import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Anfrage — Drei Felder. Zwei Minuten.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · ANFRAGE",
    headlineBold: "Drei Felder.",
    headlineItalic: "Zwei Minuten.",
    subline:
      "Antwort meist noch am selben Tag — persönlich, kostenlos, kein Vertrag, der gleich mitkommt.",
    urlPill: "sitalo.de/anfrage",
  });
}
