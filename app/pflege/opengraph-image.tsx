import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt =
  "Sitalo Pflegedienst-Website aus Hamburg — Bewerbungsformular, Leistungsbereiche, Direkt-Kontakt.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "FÜR PFLEGEDIENSTE IN HAMBURG",
    headlineBold: "Eine Pflege-Website,",
    headlineItalic: "die Bewerbungen bringt.",
    subline:
      "Klar strukturiert, mit Bewerbungsformular und Leistungsbereichen. Damit Familien die richtige Entscheidung treffen und Pflegekräfte sich bewerben.",
    urlPill: "sitalo.de/pflege",
  });
}
