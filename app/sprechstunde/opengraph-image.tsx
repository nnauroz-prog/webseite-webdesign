import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt =
  "Sitalo Sprechstunde — Anderthalb Stunden, geschenkt.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "SITALO · SPRECHSTUNDE · JEDEN ERSTEN DONNERSTAG",
    headlineBold: "Anderthalb Stunden,",
    headlineItalic: "geschenkt.",
    subline:
      "Monatliche offene Telefon-Sprechstunde, auch für Nicht-Kunden. Ohne Anmeldung, ohne Verkauf, ohne Folgeangebote.",
    urlPill: "sitalo.de/sprechstunde",
  });
}
