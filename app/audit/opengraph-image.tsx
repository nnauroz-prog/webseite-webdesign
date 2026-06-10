import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";

export const runtime = "nodejs";
export const alt =
  "Sitalo Mini-Audit — Wir gucken uns Ihre Seite an. Ehrlich. Kostenlos.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return editorialOgImage({
    variant: "cream",
    eyebrow: "SITALO · MINI-AUDIT · 48 H",
    headlineBold: "Wir gucken uns",
    headlineItalic: "Ihre Seite an.",
    subline:
      "Drei bis fünf konkrete Punkte per Mail. Kein Lighthouse-Report, kein Vertriebs-Anruf danach. Persönlich, aus Hamburg.",
    urlPill: "sitalo.de/audit",
  });
}
