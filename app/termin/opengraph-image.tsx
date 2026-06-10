import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Termin — 30 Minuten, direkt buchen.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · TERMIN · 30 MINUTEN",
    headlineBold: "Termin",
    headlineItalic: "direkt buchen.",
    subline:
      "Tag und Uhrzeit selbst wählen, Bestätigung per Mail mit Kalender-Anhang in 15 Minuten. Kein E-Mail-Pingpong.",
    urlPill: "sitalo.de/termin",
  });
}
