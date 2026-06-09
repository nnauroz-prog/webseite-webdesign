import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Wartung — Für die Seite, die schon läuft.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · WARTUNG & PFLEGE",
    headlineBold: "Für die Seite,",
    headlineItalic: "die schon läuft.",
    subline:
      "Hosting, Updates, kleine Änderungen — auch für Websites, die nicht von uns stammen. Ab 49 € im Monat.",
    urlPill: "sitalo.de/wartung",
  });
}
