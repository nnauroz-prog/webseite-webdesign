import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Website erstellen lassen bei Sitalo — Festpreis ab 499 €, persönlich aus Hamburg.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "WEBDESIGN ZUM FESTPREIS",
    headlineBold: "Website erstellen lassen.",
    headlineItalic: "Ab 499 €, persönlich betreut.",
    subline: "Individuell gestaltet, für Handy und Google optimiert. Aus Hamburg, für Betriebe in ganz Deutschland.",
    urlPill: "sitalo.de/website-erstellen-lassen",
  });
}
