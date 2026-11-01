import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Gemeinsames Vorschaubild (Open Graph) für die Unterseiten, im Stil
 * der Startseite (app/opengraph-image.tsx): Elbnebel-Grau oder
 * Teerschwarz, Signal-Orange als einziger Akzent, Überschrift in
 * Mona Sans, Beschriftungen in IBM Plex Mono.
 *
 * Aufbau: Kopfzeile mit orangem Quadrat, eine Überschrift als ein
 * Satz in einer Farbe, darunter ein sachlicher Satz, unten links die
 * Adresse der Seite über einer Haarlinie, unten ein orangener Balken.
 *
 * Zwei Varianten:
 *   - "hell":   Elbnebel-Grau, Teer-Schrift
 *   - "dunkel": Teerschwarz, helle Schrift
 */

export const OG_SIZE = { width: 1200, height: 630 };

type Variant = "hell" | "dunkel";

const PALETTES: Record<
  Variant,
  { background: string; foreground: string; muted: string; line: string }
> = {
  hell: {
    background: "#EEEEEB",
    foreground: "#1B1D1E",
    muted: "#565B5D",
    line: "rgba(27, 29, 30, 0.22)",
  },
  dunkel: {
    background: "#1B1D1E",
    foreground: "#EEEEEB",
    muted: "#A3A8A9",
    line: "rgba(238, 238, 235, 0.18)",
  },
};

const SIGNAL = "#F45B1E";

export async function editorialOgImage(config: {
  variant: Variant;
  /** Kopfzeile, wird in Versalien gesetzt. */
  eyebrow: string;
  /** Ein Satz, eine Farbe. */
  headline: string;
  subline: string;
  /** Adresse ohne Protokoll, z. B. „sitalo.de/pakete“. */
  url: string;
}): Promise<ImageResponse> {
  const { variant, headline, subline, url } = config;
  const eyebrow = config.eyebrow.toUpperCase();
  const colors = PALETTES[variant];

  const [display, sans, mono] = await Promise.all([
    loadGoogleFont({ family: "Mona Sans", weight: 800, text: headline }),
    loadGoogleFont({ family: "Mona Sans", weight: 500, text: subline }),
    loadGoogleFont({ family: "IBM Plex Mono", weight: 500, text: `${eyebrow}${url}SITALO WEBDESIGN · HAMBURG` }),
  ]);

  // Lange Überschriften (Beitragstitel, Branchen-Sätze) brauchen
  // kleinere Größen, sonst bricht die Zeile zu oft. Stufen statt
  // stufenlos, damit es vorhersagbar bleibt.
  const size = headline.length <= 28 ? 96 : headline.length <= 48 ? 76 : headline.length <= 72 ? 62 : 52;

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
          padding: "68px 84px 0 84px",
          position: "relative",
          fontFamily: "Mona Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 16, height: 16, background: SIGNAL, display: "flex" }} />
          <span style={{ fontFamily: "Plex Mono", fontSize: 19, letterSpacing: 3, color: colors.muted }}>
            {eyebrow}
          </span>
        </div>

        <div
          style={{
            marginTop: 54,
            fontSize: size,
            lineHeight: 0.98,
            letterSpacing: size >= 76 ? -3.5 : -2.5,
            fontWeight: 800,
            maxWidth: 1000,
            display: "flex",
          }}
        >
          {headline}
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 27,
            lineHeight: 1.38,
            color: colors.muted,
            fontWeight: 500,
            maxWidth: 860,
            display: "flex",
          }}
        >
          {subline}
        </div>

        <div
          style={{
            marginTop: "auto",
            marginBottom: 34,
            paddingTop: 18,
            borderTop: `1.5px solid ${colors.line}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Plex Mono",
            fontSize: 20,
          }}
        >
          <span style={{ display: "flex" }}>{url}</span>
          <span style={{ display: "flex", color: colors.muted }}>SITALO WEBDESIGN · HAMBURG</span>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: SIGNAL, display: "flex" }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Mona Sans", data: display, style: "normal", weight: 800 },
        { name: "Mona Sans", data: sans, style: "normal", weight: 500 },
        { name: "Plex Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
