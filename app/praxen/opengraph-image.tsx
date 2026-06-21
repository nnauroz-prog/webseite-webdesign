import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt =
  "Sitalo Praxis-Website aus Hamburg — Sprechzeiten, Online-Termin-Anfrage, seriöser Auftritt.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "FÜR PRAXEN IN HAMBURG",
    headlineBold: "Eine Praxis-Seite,",
    headlineItalic: "die Termine bringt.",
    subline:
      "Seriös, klar, mobil. Patient:innen prüfen vor dem ersten Termin, ob Ihre Praxis seriös wirkt — wenn die Seite das nicht signalisiert, ruft niemand an.",
    urlPill: "sitalo.de/praxen",
  });
}
