import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Manifest: acht Grundsätze darüber, wie wir arbeiten.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · Manifest",
    headline: "Acht Grundsätze darüber, wie wir arbeiten.",
    subline: "Festpreis vorab, Test-Link vor dem Start und eine Telefonnummer, unter der Sie uns selbst erreichen.",
    url: "sitalo.de/manifest",
  });
}
