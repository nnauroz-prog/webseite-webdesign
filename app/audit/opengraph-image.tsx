import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo: kostenlose Durchsicht Ihrer Website, drei bis fünf konkrete Punkte per Mail.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Website-Durchsicht · kostenlos",
    headline: "Wir sehen uns Ihre Website an.",
    subline: "Sie bekommen drei bis fünf konkrete Punkte per Mail, kostenlos und meist innerhalb von zwei Werktagen.",
    url: "sitalo.de/audit",
  });
}
