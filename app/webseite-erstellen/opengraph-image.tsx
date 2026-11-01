import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt =
  "Webseite erstellen: Schritte, Wege und Kosten. Ratgeber von Sitalo Webdesign.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Ratgeber",
    headline: "Webseite erstellen: Schritte, Wege, Kosten",
    subline:
      "Sieben Schritte vom Ziel bis zur Pflege, alle Wege nebeneinander, mit Kosten, Dauer und Entscheidungshilfe.",
    url: "sitalo.de/webseite-erstellen",
  });
}
