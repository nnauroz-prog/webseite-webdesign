import { ImageResponse } from "next/og";

import { BRANCHEN, getBrancheBySlug } from "@/lib/branchen-data";
import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Per-Branche Open-Graph-Bild. Statisch zur Build-Zeit für alle 10
 * Branchen vorgerendert. Wer /branchen/pflege teilt, sieht beim
 * Empfänger eine Pflege-spezifische Karte — kein generisches Hero.
 *
 * Pattern parallel zu /pakete/[slug]/opengraph-image.tsx, damit die
 * Brand-Karte über alle dynamischen Routen einheitlich wirkt.
 */

export const runtime = "nodejs";
export const alt = "Sitalo Webdesign — Branche";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  muted: "#7A6F62",
  gold: "#C9A24F",
  accent: "#EFE6D4",
};

export function generateStaticParams() {
  return BRANCHEN.map((b) => ({ slug: b.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branche = getBrancheBySlug(slug);

  if (!branche) {
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

  const eyebrow = "SITALO · BRANCHE";
  const headline = branche.label;
  const italicLine = branche.detailHeadline;
  const description = branche.shortBody;
  const url = `sitalo.de/branchen/${branche.slug}`;

  // Charset auf das einschränken, was tatsächlich gerendert wird —
  // hält die Font-Files klein, Build schneller.
  const allItalic = italicLine;
  const allBold = `${headline}${url}`;
  const allReg = `${eyebrow}${description}`;

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
          background: COLORS.background,
          color: COLORS.foreground,
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
            opacity: 0.18,
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
              color: COLORS.muted,
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Branche-Name als Big-Display */}
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
              fontSize: 108,
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
              fontSize: 44,
              lineHeight: 1.15,
              letterSpacing: -1.5,
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontWeight: 500,
              color: COLORS.muted,
              marginTop: 18,
              maxWidth: 920,
              display: "flex",
            }}
          >
            {italicLine}
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
              fontSize: 22,
              lineHeight: 1.4,
              opacity: 0.78,
              maxWidth: 720,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {description}
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
