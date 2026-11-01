import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

/**
 * Standard-Vorschaubild der Website (Google, WhatsApp, LinkedIn …),
 * im Stil der Startseite: Elbnebel-Grau, Teerschwarz, Signal-Orange,
 * rechts eine Containerbrücke über einem kleinen Containerstapel.
 */

export const runtime = "nodejs";
export const alt = "Sitalo Webdesign aus Hamburg: Websites für Betriebe in ganz Deutschland, Festpreis ab 499\u00A0€.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  nebel: "#EEEEEB",
  teer: "#1B1D1E",
  stahl: "#565B5D",
  signal: "#F45B1E",
  rost: "#A8382A",
  gruen: "#2E5C4D",
  zink: "#B3B6B2",
  wasser: "#D3D6D3",
};

const LABEL = "SITALO · WEBDESIGN AUS HAMBURG";
const HEADLINE = "Wir bauen Websites für Betriebe.";
const SUBLINE = "Festpreis ab 499\u00A0€ · Test-Link vor dem Start";

const STACK = [
  [C.zink, C.rost],
  [C.gruen, "#D9D9D4", "#3A3E40"],
  [C.rost, C.signal, C.zink],
  ["#3A3E40", "#D9D9D4"],
  ["#D9D9D4", C.gruen, C.rost],
];

export default async function Image() {
  const [display, mono, sans] = await Promise.all([
    loadGoogleFont({ family: "Mona Sans", weight: 800, text: HEADLINE }),
    loadGoogleFont({ family: "IBM Plex Mono", weight: 500, text: LABEL }),
    loadGoogleFont({ family: "Mona Sans", weight: 500, text: SUBLINE }),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: C.nebel,
          color: C.teer,
          display: "flex",
          position: "relative",
          fontFamily: "Mona Sans",
        }}
      >
        {/* Elbe */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 74, background: C.wasser, display: "flex" }} />

        {/* Containerbrücke mit Schiff, rechts */}
        <svg width="520" height="540" viewBox="0 0 520 540" style={{ position: "absolute", right: -40, bottom: 0 }}>
          <path d="M60 420H400L394 452Q388 468 360 474H100Q72 468 66 452Z" fill={C.teer} />
          <path d="M66 452H394L392 460H68Z" fill={C.rost} />
          {STACK.flatMap((col, ci) =>
            col.map((fill, ti) => (
              <rect key={`${ci}-${ti}`} x={74 + ci * 64} y={372 - ti * 50} width="60" height="48" fill={fill} />
            )),
          )}
          <rect x="410" y="430" width="140" height="110" fill="#2A2E30" />
          <rect x="420" y="150" width="12" height="282" fill={C.signal} />
          <rect x="500" y="150" width="12" height="282" fill={C.signal} />
          <rect x="420" y="170" width="92" height="10" fill={C.signal} />
          <rect x="40" y="120" width="520" height="8" fill={C.signal} />
          <rect x="40" y="142" width="520" height="8" fill={C.signal} />
          <path d="M420 120L462 20L470 20L432 120Z M512 120L474 20L466 20L500 120Z" fill={C.signal} />
          <path d="M466 22L60 120M466 22L250 120" stroke={C.signal} strokeWidth="3" fill="none" />
          <rect x="279" y="150" width="34" height="10" fill={C.teer} />
          <path d="M288 160V270M304 160V270" stroke={C.teer} strokeWidth="2" />
          <rect x="266" y="270" width="60" height="48" fill="#2B2F31" />
          <rect x="266" y="270" width="60" height="4" fill={C.signal} />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", padding: "70px 0 0 84px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 16, height: 16, background: C.signal, display: "flex" }} />
            <span style={{ fontFamily: "Plex Mono", fontSize: 19, letterSpacing: 3, color: C.stahl }}>{LABEL}</span>
          </div>
          <div
            style={{
              marginTop: 58,
              fontSize: 100,
              lineHeight: 0.96,
              letterSpacing: -4,
              fontWeight: 800,
              display: "flex",
            }}
          >
            {HEADLINE}
          </div>
          <div style={{ marginTop: 38, fontSize: 28, lineHeight: 1.35, color: C.stahl, fontWeight: 500, display: "flex", maxWidth: 620 }}>
            {SUBLINE}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 84,
            bottom: 24,
            fontFamily: "Plex Mono",
            fontSize: 20,
            color: C.teer,
            display: "flex",
          }}
        >
          sitalo.de
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Mona Sans", data: display, style: "normal", weight: 800 },
        { name: "Mona Sans", data: sans, style: "normal", weight: 500 },
        { name: "Plex Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
