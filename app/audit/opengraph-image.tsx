import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Website-Audit: drei bis fünf konkrete Punkte per Mail, kostenlos.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Website-Audit · 48 h",
    headline: "Wir sehen uns Ihre Website an.",
    subline: "Sie bekommen drei bis fünf konkrete Punkte per Mail, kostenlos und innerhalb von 48 Stunden.",
    url: "sitalo.de/audit",
  });
}
