import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Inventar: Werkzeuge und Hosting, jeweils mit Begründung.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Inventar",
    headline: "Was wir verwenden, und warum.",
    subline: "Werkzeuge, Hosting und Empfehlungen, jeweils mit Begründung. Am Ende steht, was wir bewusst nicht einsetzen.",
    url: "sitalo.de/inventar",
  });
}
