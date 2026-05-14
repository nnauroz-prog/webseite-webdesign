import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Apple-Touch-Icon — Brand-Icon im großen 180×180-Format für
 * iOS-Home-Screen-Bookmarks. Gleicher Look wie das kleine Favicon
 * (app/icon.tsx), aber mit etwas mehr Atmung: gold-Halo statt
 * Punkt, serifes „S" zentriert.
 */

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  gold: "#C9A24F",
  muted: "#7A6F62",
};

export default async function AppleIcon() {
  const serifBold = await loadGoogleFont({
    family: "Cormorant Garamond",
    weight: 600,
    text: "S",
  });

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
          fontFamily: "Cormorant",
          fontSize: 132,
          fontWeight: 600,
          position: "relative",
          letterSpacing: -4,
          lineHeight: 1,
        }}
      >
        {/* Gold-Halo unten rechts — dezenter Brand-Akzent. */}
        <div
          style={{
            position: "absolute",
            bottom: -40,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: 9999,
            background: COLORS.gold,
            opacity: 0.22,
            filter: "blur(24px)",
            display: "flex",
          }}
        />
        <span style={{ display: "flex", marginTop: -10 }}>S</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant",
          data: serifBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
