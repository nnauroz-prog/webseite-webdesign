import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Jetzt: freie Plätze, nächste Sprechstunde, neue Beiträge.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · Jetzt",
    headline: "Was bei uns gerade ansteht.",
    subline: "Freie Plätze, die nächste Sprechstunde und die neuesten Beiträge aus dem Journal.",
    url: "sitalo.de/jetzt",
  });
}
