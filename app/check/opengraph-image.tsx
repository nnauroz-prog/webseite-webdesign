import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Ladezeit-Test: Ladezeit Ihrer Website in etwa 30 Sekunden messen.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: "Sitalo · Ladezeit-Test",
    headline: "Wie schnell lädt Ihre Website?",
    subline: "Der Test misst Ihre Seite mit Google PageSpeed in etwa 30 Sekunden. Eine Anmeldung brauchen Sie nicht.",
    url: "sitalo.de/check",
  });
}
