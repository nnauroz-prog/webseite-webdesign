import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Brand-Favicon — generiertes Icon im Sitalo-Look.
 *
 * Eingesetzt überall, wo das Favicon erscheint: Browser-Tab,
 * Lesezeichen, Google-SERP-Snippet, Mobile-Verlauf. Ersetzt das
 * Next.js-Default-Dreieck, das viele für ein Vercel-Logo halten.
 *
 * Look: serifes „S" (Cormorant Garamond) auf Cream, mit dezentem
 * Gold-Halo unten rechts — passt zur OG-Image-Sprache.
 */

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const COLORS = {
  background: "#FAF7F1",
  foreground: "#231F1B",
  gold: "#C9A24F",
};

export default async function Icon() {
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
          fontSize: 28,
          fontWeight: 600,
          position: "relative",
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        {/* Gold-Akzent unten rechts — dezent, nicht dominant. */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 3,
            width: 6,
            height: 6,
            borderRadius: 9999,
            background: COLORS.gold,
            display: "flex",
          }}
        />
        <span style={{ display: "flex", marginTop: -2 }}>S</span>
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
