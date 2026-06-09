import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Inventar — Was wir verwenden, mit Begründung.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · INVENTAR · OFFEN EINSEHBAR",
    headlineBold: "Was wir verwenden.",
    headlineItalic: "Und was bewusst nicht.",
    subline:
      "Werkzeuge, Hosting, Lieferanten — alles offen gelistet, jede Position begründet. Eine Werkstatt ohne verschlossene Schubladen.",
    urlPill: "sitalo.de/inventar",
  });
}
