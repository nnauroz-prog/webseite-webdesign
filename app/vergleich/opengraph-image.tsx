import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt =
  "Sitalo Vergleich — Was passt zu Ihnen, was nicht. Wix, Squarespace, Jimdo, KI-Selbstbau.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · EHRLICHER VERGLEICH",
    headlineBold: "Was passt zu Ihnen,",
    headlineItalic: "was nicht.",
    subline:
      "Wix, Squarespace, Jimdo, ChatGPT-Selbstbau und wir — ehrlich eingeordnet, mit realistischen Kosten inklusive Eigenzeit.",
    urlPill: "sitalo.de/vergleich",
  });
}
