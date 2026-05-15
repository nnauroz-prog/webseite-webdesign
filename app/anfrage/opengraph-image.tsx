import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Open-Graph-Bild für /anfrage — die Konvertierungs-Endpunkt-Seite.
 *
 * Stil: Cream-Background (wie Default), aber mit größerem Fokus
 * auf die Aktion. Nicht „Hier ist Sitalo", sondern „Hier startest
 * du dein Projekt". Klare Action-Karten unten statt
 * narrativem-Subline.
 *
 * Gold-Akzent über der Headline statt seitlich — bringt die
 * Aufforderungs-Geste optisch nach vorn.
 */

export const runtime = "nodejs";
export const alt =
  "Anfrage starten — drei Felder, zwei Minuten, Antwort am selben Tag.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  muted: "#7A6F62",
  gold: "#C9A24F",
  accent: "#EFE6D4",
  inkPetrol: "#3E5A6B",
};

const EYEBROW = "SITALO · ANFRAGE";
const HEADLINE_BOLD = "Drei Felder.";
const HEADLINE_ITALIC = "Zwei Minuten.";
const SUBLINE =
  "Antwort meist noch am selben Tag — persönlich, kostenlos, kein Vertrag, der gleich mitkommt.";
const URL_PILL = "sitalo.de/anfrage";

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
        {/* Gold-Halo links oben — gleiche Brand-Atmosphäre wie auf
            den anderen statischen OGs */}
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
        {/* Petrol-Halo rechts unten — zweiter Akzent als visuelle
            Spannung. Petrol ist der zweite Brand-Akzent neben Gold. */}
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: COLORS.inkPetrol,
            opacity: 0.08,
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
            {EYEBROW}
          </span>
        </div>

        {/* Hauptaussage — kürzer und direkter als /atelier OG */}
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
              fontSize: 116,
              lineHeight: 1.0,
              letterSpacing: -4,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {HEADLINE_BOLD}
          </div>
          <div
            style={{
              fontSize: 116,
              lineHeight: 1.0,
              letterSpacing: -4,
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
              color: COLORS.foreground,
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
