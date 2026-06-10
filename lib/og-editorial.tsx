import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Gemeinsames Editorial-OG-Template für Identitäts-Seiten
 * (/manifest, /auswahl, /inventar, /lexikon, …).
 *
 * Zwei Varianten:
 *   - "cream":    heller Hintergrund, Gold-Halo links oben
 *   - "espresso": dunkler Hintergrund, Gold-Halo rechts oben
 *
 * Komposition wie die bestehenden Hand-OGs (Brand-Marker oben,
 * Bold + Italic Headline, Subline + URL-Pill unten) — bewusst
 * dieselbe Geste, damit Shares aller Sitalo-Seiten als Familie
 * erkennbar sind.
 */

export const OG_SIZE = { width: 1200, height: 630 };

type Variant = "cream" | "espresso";

const PALETTES: Record<
  Variant,
  {
    background: string;
    foreground: string;
    muted: string;
    gold: string;
    accent: string;
  }
> = {
  cream: {
    background: "#FAF7F1",
    foreground: "#231F1B",
    muted: "rgba(35, 31, 27, 0.62)",
    gold: "#C9A24F",
    accent: "rgba(201, 162, 79, 0.16)",
  },
  espresso: {
    background: "#231F1B",
    foreground: "#FAF7F1",
    muted: "rgba(250, 247, 241, 0.6)",
    gold: "#C9A24F",
    accent: "rgba(201, 162, 79, 0.18)",
  },
};

export async function editorialOgImage(config: {
  variant: Variant;
  eyebrow: string;
  headlineBold: string;
  headlineItalic: string;
  subline: string;
  urlPill: string;
}): Promise<ImageResponse> {
  const { variant, eyebrow, headlineBold, headlineItalic, subline, urlPill } =
    config;
  const colors = PALETTES[variant];

  const [serifItalic, sansBold, sansRegular] = await Promise.all([
    loadGoogleFont({
      family: "Cormorant Garamond",
      weight: 500,
      italic: true,
      text: headlineItalic,
    }),
    loadGoogleFont({
      family: "Inter",
      weight: 700,
      text: `${headlineBold}${urlPill}`,
    }),
    loadGoogleFont({
      family: "Inter",
      weight: 500,
      text: `${eyebrow}${subline}`,
    }),
  ]);

  const haloSide = variant === "cream" ? { left: -180 } : { right: -120 };

  // Lange Zeilen (Essay-Titel als Italic) brauchen kleinere Größen,
  // sonst läuft die 1200px-Breite über. Stufen statt stufenlos —
  // bleibt vorhersagbar.
  const sizeFor = (text: string): number => {
    if (text.length <= 24) return 88;
    if (text.length <= 40) return 64;
    return 52;
  };
  const boldSize = sizeFor(headlineBold);
  const italicSize = sizeFor(headlineItalic);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: colors.background,
          color: colors.foreground,
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
            top: -200,
            ...haloSide,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: colors.gold,
            opacity: variant === "cream" ? 0.22 : 0.28,
            filter: "blur(90px)",
            display: "flex",
          }}
        />
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
              background: colors.gold,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 16,
              letterSpacing: 8,
              color: colors.muted,
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </span>
        </div>

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
              fontSize: boldSize,
              lineHeight: 1.02,
              letterSpacing: -3,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {headlineBold}
          </div>
          <div
            style={{
              fontSize: italicSize,
              lineHeight: 1.08,
              letterSpacing: -2,
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontWeight: 500,
              color: colors.muted,
              marginTop: 8,
              maxWidth: 980,
              display: "flex",
            }}
          >
            {headlineItalic}
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
              lineHeight: 1.4,
              opacity: 0.78,
              maxWidth: 720,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {subline}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.foreground,
              background: colors.accent,
              padding: "12px 22px",
              borderRadius: 999,
              display: "flex",
              whiteSpace: "nowrap",
            }}
          >
            {urlPill}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
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
