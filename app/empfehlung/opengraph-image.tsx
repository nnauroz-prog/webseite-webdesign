import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Paket-Quiz — Welches Paket passt zu Ihnen?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · PAKET-QUIZ · FÜNF FRAGEN",
    headlineBold: "Welches Paket",
    headlineItalic: "passt zu Ihnen?",
    subline:
      "Fünf Fragen, eine ehrliche Empfehlung mit Begründung. Kein Lockruf, keine E-Mail-Pflicht.",
    urlPill: "sitalo.de/empfehlung",
  });
}
