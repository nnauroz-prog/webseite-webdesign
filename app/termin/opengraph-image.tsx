import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Termin: 30 Minuten, Tag und Uhrzeit selbst wählen.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Termin · 30 Minuten",
    headline: "Einen Termin direkt buchen.",
    subline: "Tag und Uhrzeit wählen Sie selbst. Die Bestätigung kommt per Mail, meist am selben Werktag.",
    url: "sitalo.de/termin",
  });
}
