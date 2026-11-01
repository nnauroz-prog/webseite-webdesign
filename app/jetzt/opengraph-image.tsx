import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Jetzt: nächster freier Tag für ein Erstgespräch, nächste Sprechstunde, neue Beiträge.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · Jetzt",
    headline: "Was bei uns gerade ansteht.",
    subline: "Der nächste freie Tag für ein Erstgespräch, die nächste Sprechstunde und die neuesten Beiträge aus dem Journal.",
    url: "sitalo.de/jetzt",
  });
}
