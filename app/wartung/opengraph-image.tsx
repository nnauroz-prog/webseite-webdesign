import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Wartung: Hosting, Updates und kleine Änderungen ab 49 € im Monat.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "hell",
    eyebrow: "Sitalo · Wartung",
    headline: "Wartung für Websites, die schon online sind.",
    subline: "Hosting, Updates und kleine Änderungen, auch für Seiten, die nicht von uns stammen. Ab 49 € im Monat.",
    url: "sitalo.de/wartung",
  });
}
