import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Open-Graph-Bild für /audit — Lead-Magnet-Seite.
 *
 * Stil: Cream-Background mit großem Gold-Halo links oben, ein
 * dezenter Auge-Akzent rechts. Headline cremig-warm, kein
 * Marketing-Gepolter. Signalisiert: ruhig, ehrlich, persönlich.
 */

export const runtime = "nodejs";
export const alt =
  "Sitalo Mini-Audit — Wir gucken uns Ihre Seite an. Ehrlich. Kostenlos.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  muted: "rgba(35, 31, 27, 0.62)",
  gold: "#C9A24F",
  accent: "rgba(201, 162, 79, 0.16)",
};

const EYEBROW = "SITALO · MINI-AUDIT · 48 H";
const HEADLINE_BOLD = "Wir gucken uns";
const HEADLINE_ITALIC = "Ihre Seite an.";
const SUBLINE =
  "Drei bis fünf konkrete Punkte per Mail. Kein Lighthouse-Report, kein Vertriebs-Anruf danach. Persönlich, aus Hamburg.";
const URL_PILL = "sitalo.de/audit";

export default async function Image() {
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
        {/* Großer Gold-Halo links oben — wie auf /audit selbst. */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -180,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: COLORS.gold,
            opacity: 0.22,
            filter: "blur(90px)",
            display: "flex",
          }}
        />
        {/* Dezentes konzentrisches Kreispaar rechts unten als
            Editorial-Anker — wirkt wie ein „Wir gucken hin"-Symbol. */}
        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -120,
            width: 380,
            height: 380,
            borderRadius: 9999,
            border: `1.5px solid ${COLORS.muted}`,
            opacity: 0.28,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -40,
            bottom: -40,
            width: 220,
            height: 220,
            borderRadius: 9999,
            border: `1.5px solid ${COLORS.muted}`,
            opacity: 0.32,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 32,
            bottom: 32,
            width: 100,
            height: 100,
            borderRadius: 9999,
            border: `2px solid ${COLORS.gold}`,
            opacity: 0.55,
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
