import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * App- und Tab-Symbol in der Hafen-Palette: ein „S“ aus der Antiqua der
 * Wortmarke auf Teer, rechts unten der Doppelring aus dem Logo in
 * Signal-Orange (wie das „O“ in SITAL◎). Ersetzt das alte Symbol in
 * Braun, Creme und Gold.
 */
export async function brandIcon(px: number): Promise<ImageResponse> {
  const font = await loadGoogleFont({ family: "Cormorant Garamond", weight: 500, text: "S" });
  const ring = Math.round(px * 0.3);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1D1E",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Cormorant",
            fontWeight: 500,
            fontSize: px * 1.18,
            lineHeight: 1,
            color: "#EEEEEB",
            marginTop: -px * 0.12,
            marginLeft: -px * 0.14,
          }}
        >
          S
        </div>
        <svg
          width={ring * 1.3}
          height={ring}
          viewBox="0 0 30 22"
          style={{ position: "absolute", right: px * 0.08, bottom: px * 0.14 }}
        >
          <g fill="none" stroke="#F45B1E" strokeWidth={px < 64 ? 3 : 1.8}>
            <ellipse cx="12" cy="11" rx="10.2" ry="10" />
            <ellipse cx="18" cy="11" rx="10.2" ry="10" />
          </g>
        </svg>
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: [{ name: "Cormorant", data: font, style: "normal", weight: 500 }],
    },
  );
}
