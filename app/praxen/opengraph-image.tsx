import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Websites für Arzt- und Zahnarztpraxen: Sprechzeiten oben, Terminanfrage direkt auf der Seite.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Für Arzt- und Zahnarztpraxen",
    headline: "Websites für Praxen.",
    subline: "Sprechzeiten, Anfahrt und Behandlungen stehen oben. Termine fragen Patienten direkt auf der Seite an.",
    url: "sitalo.de/praxen",
  });
}
