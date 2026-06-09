import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Manifest — Acht Sätze. Was wir tun, was nicht.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "SITALO · MANIFEST · MMXXVI",
    headlineBold: "Acht Sätze.",
    headlineItalic: "Kein Verkaufstext.",
    subline:
      "Was wir tun, was wir nicht tun — geschrieben für Inhaber, denen Verbindlichkeit wichtiger ist als Werbung.",
    urlPill: "sitalo.de/manifest",
  });
}
