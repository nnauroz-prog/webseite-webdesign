import { ImageResponse } from "next/og";

import { getAllPaketSlugs, getPaketBySlug } from "@/lib/pakete-data";
import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Per-Paket Open-Graph-Bild. Statisch zur Build-Zeit für Starter,
 * Business und Premium vorgerendert. Wenn jemand /pakete/business
 * teilt, sieht der Empfänger eine echte Paket-Karte mit Preis und
 * Beschreibung — kein generischer Hero-Crop.
 */

export const runtime = "nodejs";
export const alt = "Sitalo Webdesign — Paket";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  muted: "#7A6F62",
  gold: "#C9A24F",
  accent: "#EFE6D4",
  highlightBg: "#231F1B",
  highlightFg: "#FAF7F1",
};

export function generateStaticParams() {
  return getAllPaketSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paket = getPaketBySlug(slug);

  if (!paket) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: COLORS.background,
            color: COLORS.foreground,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "serif",
            fontSize: 64,
            fontWeight: 600,
          }}
        >
          Sitalo Webdesign
        </div>
      ),
      { ...size },
    );
  }

  const isHighlight = paket.slug === "business";

  const eyebrow = "SITALO · PAKET";
  const headline = `${paket.name}-Paket`;
  const priceLine = `${paket.setup} einmalig`;
  const url = `sitalo.de/pakete/${paket.slug}`;
  const allItalic = priceLine;
  const allBold = `${headline}${url}`;
  const allReg = `${eyebrow}${paket.description}`;

  const [serifItalic, sansBold, sansRegular] = await Promise.all([
    loadGoogleFont({
      family: "Cormorant Garamond",
      weight: 500,
      italic: true,
      text: allItalic,
    }),
    loadGoogleFont({
      family: "Inter",
      weight: 700,
      text: allBold,
    }),
    loadGoogleFont({
      family: "Inter",
      weight: 500,
      text: allReg,
    }),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: isHighlight ? COLORS.highlightBg : COLORS.background,
          color: isHighlight ? COLORS.highlightFg : COLORS.foreground,
          display: "flex",
          flexDirection: "column",
          padding: "72px 96px",
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: COLORS.gold,
            opacity: isHighlight ? 0.28 : 0.18,
            filter: "blur(80px)",
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
              color: isHighlight
                ? "rgba(250, 247, 241, 0.65)"
                : COLORS.muted,
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Paket-Name als Big-Display */}
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
              fontSize: 110,
              lineHeight: 1.0,
              letterSpacing: -4,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              letterSpacing: -2,
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontWeight: 500,
              color: isHighlight
                ? "rgba(250, 247, 241, 0.78)"
                : COLORS.muted,
              marginTop: 12,
              display: "flex",
            }}
          >
            {priceLine}
          </div>
        </div>

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
              lineHeight: 1.35,
              opacity: 0.82,
              maxWidth: 720,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {paket.description}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.foreground,
              background: isHighlight ? COLORS.gold : COLORS.accent,
              padding: "12px 22px",
              borderRadius: 999,
              display: "flex",
              whiteSpace: "nowrap",
            }}
          >
            {url}
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
