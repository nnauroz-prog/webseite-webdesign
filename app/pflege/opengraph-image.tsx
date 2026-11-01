import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Websites für Pflegedienste: Leistungen, Einsatzgebiet und Bewerbung vom Handy.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Für Pflegedienste",
    headline: "Websites für Pflegedienste.",
    subline: "Angehörige sehen, was Sie leisten und wohin Sie fahren. Pflegekräfte bewerben sich vom Handy aus.",
    url: "sitalo.de/pflege",
  });
}
