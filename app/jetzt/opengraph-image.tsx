import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Jetzt — was im Atelier gerade passiert.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "SITALO · JETZT · MONATLICH ERNEUERT",
    headlineBold: "Jetzt.",
    headlineItalic: "Was im Atelier gerade passiert.",
    subline:
      "Werkbank, Bauplätze, nächste Sprechstunde, zuletzt geschrieben — eine Momentaufnahme, keine Broschüre.",
    urlPill: "sitalo.de/jetzt",
  });
}
