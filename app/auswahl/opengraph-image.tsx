import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt = "Sitalo Auswahl — Wer zu uns kommt. Und wer nicht.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "espresso",
    eyebrow: "SITALO · AUFNAHMEKRITERIEN",
    headlineBold: "Wer zu uns kommt.",
    headlineItalic: "Und wer nicht.",
    subline:
      "Höchstens drei neue Aufträge pro Monat. Sechs Kriterien, zweispaltig gelesen — ehrlich statt Sales-Funnel.",
    urlPill: "sitalo.de/auswahl",
  });
}
