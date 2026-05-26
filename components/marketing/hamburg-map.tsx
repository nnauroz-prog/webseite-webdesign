import Link from "next/link";

import { STANDORTE } from "@/lib/standorte-data";

/**
 * Hand-gezeichnete Hamburg-Karte mit den 8 Sitalo-Stadtteilen.
 *
 * Bewusst keine geografisch exakte Karte (das wäre Tourismus-
 * Broschüre), sondern eine STYLISIERTE Sketch-Abstraktion. Die
 * Stadtteil-Positionen sind nur grob-orientierend in
 * West/Ost/Nord/Süd korrekt — die Karte ist Sitalo-Identitäts-
 * Element, kein Navi.
 *
 * Jeder Stadtteil ist ein klickbarer Punkt, der zur jeweiligen
 * /standorte/[slug]-Seite linkt. Eyebrow-Label schwebt rechts neben
 * dem Punkt, mit subtilem Hover-Highlight.
 *
 * SVG bewusst mit unregelmäßigen Kurven gezeichnet — sieht nach
 * Filzstift aus, nicht nach Auto-CAD. Anti-Generic-Geste, die kein
 * Konkurrent kopiert hat.
 */

// Stadtteil-Position auf der 600×400-Karte. Reihenfolge spiegelt
// grob die Hamburg-Geografie wider — Eimsbüttel NW, Wandsbek NO,
// Harburg unten südlich der Elbe.
const PINS: Record<string, { x: number; y: number; align: "left" | "right" }> = {
  eppendorf: { x: 290, y: 110, align: "right" },
  winterhude: { x: 360, y: 95, align: "right" },
  eimsbuettel: { x: 220, y: 145, align: "left" },
  wandsbek: { x: 440, y: 160, align: "right" },
  altona: { x: 145, y: 200, align: "left" },
  "st-pauli": { x: 245, y: 235, align: "left" },
  bergedorf: { x: 510, y: 250, align: "right" },
  harburg: { x: 280, y: 340, align: "left" },
};

export function HamburgMap() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <svg
        viewBox="0 0 600 400"
        fill="none"
        className="block w-full"
        aria-label="Hamburg-Karte mit den Sitalo-Stadtteilen"
        role="img"
      >
        {/* Atmosphärischer Gold-Schimmer hinter der Karte */}
        <defs>
          <radialGradient id="hamburg-glow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="oklch(0.66 0.13 80)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="oklch(0.66 0.13 80)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#hamburg-glow)" />

        {/* Hauptstadt-Blob — gestylte Form, kein 1:1 Hamburg-Outline */}
        <path
          d="M 80 180
             C 60 130, 110 80, 180 70
             C 250 60, 330 65, 410 80
             C 480 95, 540 130, 555 180
             C 565 230, 530 270, 470 285
             C 400 295, 320 295, 250 290
             C 180 285, 110 270, 90 235
             C 75 215, 75 195, 80 180 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground/35"
        />

        {/* Alster — kleiner See im Zentrum-Norden */}
        <path
          d="M 330 125
             C 320 135, 325 155, 345 158
             C 365 161, 380 145, 372 128
             C 365 115, 340 115, 330 125 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          className="text-ink-petrol/50"
        />

        {/* Elbe — wellige Linie quer durch unten */}
        <path
          d="M 50 320
             Q 130 305, 210 318
             T 380 315
             T 560 322"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          className="text-ink-petrol/60"
        />
        {/* Zweite Elbe-Linie — leicht versetzt, gibt Tiefe */}
        <path
          d="M 50 332
             Q 130 320, 210 330
             T 380 328
             T 560 335"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          className="text-ink-petrol/35"
        />

        {/* Harburg-Blob — südlich der Elbe, kleinere Form */}
        <path
          d="M 220 360
             C 200 350, 195 370, 215 380
             C 245 390, 295 395, 335 388
             C 360 383, 365 365, 345 355
             C 310 348, 250 350, 220 360 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground/35"
        />

        {/* Atmosphärische Schraffur-Linien im Hintergrund */}
        <g className="text-foreground/8" stroke="currentColor" strokeWidth="0.8">
          <line x1="120" y1="100" x2="125" y2="115" />
          <line x1="135" y1="105" x2="140" y2="120" />
          <line x1="480" y1="120" x2="485" y2="135" />
          <line x1="495" y1="115" x2="500" y2="130" />
        </g>

        {/* Compass-Mini-Element unten links — typografische Geste */}
        <g
          transform="translate(45 380)"
          className="text-muted-foreground/45 font-mono"
        >
          <text fontSize="9" letterSpacing="2" fill="currentColor">
            N ↑
          </text>
        </g>

        {/* Stadtteil-Punkte als klickbare Anker */}
        {STANDORTE.map((s, i) => {
          const pin = PINS[s.slug];
          if (!pin) return null;
          return (
            <Pin
              key={s.slug}
              slug={s.slug}
              name={s.name}
              number={i + 1}
              x={pin.x}
              y={pin.y}
              align={pin.align}
            />
          );
        })}
      </svg>
    </div>
  );
}

function Pin({
  slug,
  name,
  number,
  x,
  y,
  align,
}: {
  slug: string;
  name: string;
  number: number;
  x: number;
  y: number;
  align: "left" | "right";
}) {
  // Label-Position: links oder rechts vom Punkt, je nach Karten-Quadrant
  const labelX = align === "right" ? x + 14 : x - 14;
  const numberX = align === "right" ? x + 14 : x - 14;
  const textAnchor = align === "right" ? "start" : "end";

  return (
    <Link
      href={`/standorte/${slug}`}
      aria-label={`Webdesign in Hamburg-${name}`}
    >
      <g className="group cursor-pointer">
        {/* Hit-Area — größer als sichtbar, damit Hover/Touch leichter trifft */}
        <circle cx={x} cy={y} r="22" fill="transparent" />

        {/* Pulse-Ring beim Hover */}
        <circle
          cx={x}
          cy={y}
          r="10"
          className="fill-none stroke-gold opacity-0 transition-opacity duration-300 group-hover:opacity-60"
          strokeWidth="1"
        />

        {/* Hauptpunkt — Gold, gefüllt */}
        <circle
          cx={x}
          cy={y}
          r="4.5"
          className="fill-gold transition-transform duration-300 group-hover:scale-125"
          style={{ transformOrigin: `${x}px ${y}px` }}
        />

        {/* Numeral oberhalb des Labels — Mono-Font, dezent */}
        <text
          x={numberX}
          y={y - 4}
          fontSize="8"
          textAnchor={textAnchor}
          className="fill-muted-foreground font-mono uppercase tracking-[0.15em]"
        >
          {String(number).padStart(2, "0")}
        </text>

        {/* Label — Stadtteilname */}
        <text
          x={labelX}
          y={y + 9}
          fontSize="13"
          textAnchor={textAnchor}
          className="fill-foreground font-medium tracking-tight transition-colors group-hover:fill-foreground"
        >
          {name}
        </text>
      </g>
    </Link>
  );
}
