import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Anfrage: drei Felder, Antwort meist am selben Werktag.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Anfrage",
    headline: "Erzählen Sie uns, was Sie vorhaben.",
    subline: "Das Formular hat drei Felder. Wir antworten meist am selben Werktag, den Festpreis bekommen Sie schriftlich.",
    url: "sitalo.de/anfrage",
  });
}
