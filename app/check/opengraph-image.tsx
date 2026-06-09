import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Speed-Check — Wie schnell ist Ihre Seite?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "SITALO · SPEED-CHECK · LIVE",
    headlineBold: "Wie schnell ist",
    headlineItalic: "Ihre Seite?",
    subline:
      "Live-Lighthouse-Test in 30 Sekunden. Vier Scores plus Core Web Vitals — ohne Anmeldung, ohne Kontaktdaten.",
    urlPill: "sitalo.de/check",
  });
}
