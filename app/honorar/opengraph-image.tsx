import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Honorar — Offen vorgerechnet.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · HONORAR · OPEN-BOOK",
    headlineBold: "Honorar.",
    headlineItalic: "Offen vorgerechnet.",
    subline:
      "Stundensatz, Aufwand pro Paket, was wir nicht abrechnen. Open-Book-Honorar-Modell statt verschlossener Marge.",
    urlPill: "sitalo.de/honorar",
  });
}
