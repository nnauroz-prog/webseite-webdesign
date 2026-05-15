import { ImageResponse } from "next/og";

import {
  STANDORTE,
  getStandortBySlug,
} from "@/lib/standorte-data";
import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Per-Stadtteil Open-Graph-Bild. Statisch zur Build-Zeit für alle 8
 * Standorte vorgerendert. Wer /standorte/eimsbuettel teilt, sieht
 * beim Empfänger eine Eimsbüttel-spezifische Karte — kein
 * generisches Sitalo-Hero.
 *
 * Pattern parallel zu /pakete/[slug] und /branchen/[slug], damit
 * dynamische Routen einheitlich wirken. Hier mit Olive-Tint statt
 * Gold als Akzent — kleines visuelles Distinguisher für „Standorte
 * vs. Branchen".
 */

export const runtime = "nodejs";
export const alt = "Sitalo Webdesign — Hamburger Stadtteil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  muted: "#7A6F62",
  olive: "#7B8A4B",
  accent: "#EFE6D4",
};

export function generateStaticParams() {
  return STANDORTE.map((s) => ({ slug: s.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const standort = getStandortBySlug(slug);

  if (!standort) {
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

  const eyebrow = "SITALO · STADTTEIL";
  const headline = standort.name;
  const italicLine = standort.tagline;
  const description = `Webdesign für Unternehmen aus ${standort.name} — individuell aus dem Hamburger Atelier.`;
  const url = `sitalo.de/standorte/${standort.slug}`;

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
            background: COLORS.olive,
            opacity: 0.16,
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
              background: COLORS.olive,
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

        {/* Stadtteil-Name als Big-Display */}
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
              fontSize: 124,
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
              fontSize: 40,
              lineHeight: 1.2,
              letterSpacing: -1.2,
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
