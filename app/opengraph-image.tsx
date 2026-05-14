import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Default Open-Graph-Bild der Sitalo-Webseite.
 *
 * Stil bewusst nicht generisch: Cormorant-Garamond-Italic im Headline-
 * Akzent (gleiche Schrift wie auf der Seite selbst), warmes Cream-
 * Background, Espresso-Foreground, dezenter Gold-Akzent. Per-Routen-
 * OG-Bilder (z. B. /pakete/[slug]) erben diese Sprache, überschreiben
 * aber den Inhalt.
 */

export const runtime = "nodejs";
export const alt =
  "Sitalo Webdesign — Websites für lokale Unternehmen aus Hamburg.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  muted: "#7A6F62",
  gold: "#C9A24F",
  accent: "#EFE6D4",
};

const HEADLINE_BOLD = "Hand-gebaute Websites";
const HEADLINE_ITALIC = "für lokale Unternehmen.";
const EYEBROW = "SITALO · AUS HAMBURG";
const SUBLINE =
  "Sie schicken uns drei Sachen. Wir liefern den Rest — meist in 1–2 Werktagen.";
const PRICE_PILL = "ab 499 € · sitalo.de";

export default async function Image() {
  // Charset auf das beschränken, was wir wirklich zeichnen — spart
  // Bytes und macht den Build robust gegen Netz-Hiccups.
  const allText = `${HEADLINE_BOLD}${HEADLINE_ITALIC}${EYEBROW}${SUBLINE}${PRICE_PILL}`;
  const [serifItalic, sansBold, sansRegular] = await Promise.all([
    loadGoogleFont({
      family: "Cormorant Garamond",
      weight: 500,
      italic: true,
      text: HEADLINE_ITALIC,
    }),
    loadGoogleFont({
      family: "Inter",
      weight: 700,
      text: `${HEADLINE_BOLD}${PRICE_PILL}`,
    }),
    loadGoogleFont({
      family: "Inter",
      weight: 500,
      text: `${EYEBROW}${SUBLINE}`,
    }),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: COLORS.background,
          color: COLORS.foreground,
          display: "flex",
          flexDirection: "column",
          padding: "72px 96px",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {/* Gold-Halo links oben — die signature Brand-Atmosphäre */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: COLORS.gold,
            opacity: 0.18,
            filter: "blur(80px)",
            display: "flex",
          }}
        />
        {/* Konzentrische Kreise rechts unten als Editorial-Akzent */}
        <div
          style={{
            position: "absolute",
            right: -140,
            bottom: -140,
            width: 420,
            height: 420,
            borderRadius: 9999,
            border: `1px solid ${COLORS.muted}`,
            opacity: 0.18,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -80,
            bottom: -80,
            width: 300,
            height: 300,
            borderRadius: 9999,
            border: `1px solid ${COLORS.muted}`,
            opacity: 0.18,
            display: "flex",
          }}
        />

        {/* Brand-Marker — Gold-Strich + Eyebrow in Sperrsatz */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 32,
              height: 4,
              background: COLORS.gold,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 16,
              letterSpacing: 8,
              color: COLORS.muted,
              fontWeight: 500,
            }}
          >
            {EYEBROW}
          </span>
        </div>

        {/* Hauptaussage: bold sans + serif italic accent */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 90,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: -3,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {HEADLINE_BOLD}
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: -3,
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontWeight: 500,
              color: COLORS.muted,
              marginTop: 8,
              display: "flex",
            }}
          >
            {HEADLINE_ITALIC}
          </div>
        </div>

        {/* Unterzeile + Preisanker */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.35,
              color: COLORS.foreground,
              opacity: 0.75,
              maxWidth: 720,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {SUBLINE}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.foreground,
              background: COLORS.accent,
              padding: "12px 22px",
              borderRadius: 999,
              display: "flex",
              whiteSpace: "nowrap",
            }}
          >
            {PRICE_PILL}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: sansBold, style: "normal", weight: 700 },
        { name: "Inter", data: sansRegular, style: "normal", weight: 500 },
        {
          name: "Cormorant",
          data: serifItalic,
          style: "italic",
          weight: 500,
        },
      ],
    },
  );
}
