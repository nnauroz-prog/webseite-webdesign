import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Paket-Empfehlung: fünf Fragen, danach ein Vorschlag mit Begründung.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Paket-Empfehlung",
    headline: "Fünf Fragen, danach ein Paketvorschlag.",
    subline: "Mit Begründung und Preis. Eine E-Mail-Adresse brauchen Sie dafür nicht.",
    url: "sitalo.de/empfehlung",
  });
}
