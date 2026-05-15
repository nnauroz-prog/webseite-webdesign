import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Open-Graph-Bild für /atelier — die About-/Manifesto-Seite.
 *
 * Eigenständiger Look statt Default-Hero, damit ein Share von
 * „Wer hinter Sitalo steht" eine andere Geste hat als ein Branchen-
 * oder Pakete-Share.
 *
 * Stil: dunkler Hintergrund (Espresso) statt Cream — bricht visuell
 * raus, signalisiert „über uns" statt „Angebot". Serif-Italic
 * Headline, kleinere Gold-Marker, ruhige Komposition.
 */

export const runtime = "nodejs";
export const alt = "Sitalo Atelier — Wer wir sind, warum wir das machen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#231F1B",
  foreground: "#FAF7F1",
  muted: "rgba(250, 247, 241, 0.6)",
  gold: "#C9A24F",
  accent: "rgba(201, 162, 79, 0.18)",
};

const EYEBROW = "SITALO · DAS ATELIER";
const HEADLINE_BOLD = "Eine kleine Werkstatt.";
const HEADLINE_ITALIC = "In Hamburg.";
const SUBLINE =
  "Hand-gebaute Websites für lokale Unternehmen — kein Konzern, kein Callcenter, kein Verkaufsteam.";
const URL_PILL = "sitalo.de/atelier";

export default async function Image() {
  const allText = `${HEADLINE_BOLD}${HEADLINE_ITALIC}${EYEBROW}${SUBLINE}${URL_PILL}`;

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
      text: `${HEADLINE_BOLD}${URL_PILL}`,
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
        {/* Warmer Gold-Halo rechts oben — atmosphärisch, nicht
            dominant. Auf dem Espresso-Background kommt er goldener
            durch als auf Cream. */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: COLORS.gold,
            opacity: 0.28,
            filter: "blur(80px)",
            display: "flex",
          }}
        />
        {/* Konzentrische Kreise unten links — Editorial-Ankerelement
            wie auf dem Default-OG, aber gespiegelt für Variation. */}
        <div
          style={{
            position: "absolute",
            left: -140,
            bottom: -140,
            width: 420,
            height: 420,
            borderRadius: 9999,
            border: `1px solid ${COLORS.muted}`,
            opacity: 0.25,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -80,
            width: 300,
            height: 300,
            borderRadius: 9999,
            border: `1px solid ${COLORS.muted}`,
            opacity: 0.25,
            display: "flex",
          }}
        />

        {/* Brand-Marker */}
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

        {/* Hauptaussage */}
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
              fontSize: 88,
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
              fontSize: 88,
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

        {/* Subline + URL-Chip */}
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
              fontSize: 24,
              lineHeight: 1.4,
              opacity: 0.78,
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
            {URL_PILL}
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
