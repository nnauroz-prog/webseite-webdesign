import Link from "next/link";

import { STANDORTE } from "@/lib/standorte-data";

/**
 * Schematische Hamburg-Karte mit den Stadtteilen, die eine eigene
 * Seite haben. Keine maßstabsgetreue Karte, sondern eine Skizze wie
 * auf einem Hafenplan: gestrichelte Stadtgrenze, Elbe und Alster als
 * graue Wasserflächen, Stadtteile als kleine Quadrate.
 *
 * Jeder Stadtteil verlinkt auf /standorte/[slug]. Mit `active` wird ein
 * Stadtteil hervorgehoben (Detailseite), die übrigen treten zurück.
 *
 * Die Beschriftung ist auf dem Handy in Karten-Einheiten größer
 * gesetzt, damit sie bei kleiner Kartenbreite lesbar bleibt.
 */

// Position auf der 600×400-Karte, grob an der Lage orientiert:
// Eimsbüttel im Nordwesten, Wandsbek im Nordosten, Harburg südlich der
// Elbe, HafenCity am Hafenrand.
const PINS: Record<string, { x: number; y: number; align: "left" | "right" }> = {
  niendorf: { x: 175, y: 105, align: "left" },
  eppendorf: { x: 290, y: 118, align: "left" },
  winterhude: { x: 352, y: 98, align: "right" },
  eimsbuettel: { x: 230, y: 152, align: "left" },
  barmbek: { x: 408, y: 132, align: "right" },
  bramfeld: { x: 482, y: 106, align: "right" },
  wandsbek: { x: 462, y: 170, align: "right" },
  altona: { x: 145, y: 208, align: "left" },
  "st-pauli": { x: 245, y: 238, align: "left" },
  hafencity: { x: 305, y: 250, align: "right" },
  bergedorf: { x: 535, y: 236, align: "left" },
  harburg: { x: 280, y: 352, align: "left" },
};

export function HamburgMap({ active }: { active?: string }) {
  return (
    <figure className="-mx-3 max-w-xl sm:mx-auto">
      <svg
        viewBox="54 52 524 343"
        fill="none"
        className="block w-full"
        role="group"
        aria-label="Schematische Karte: Hamburger Stadtteile mit eigener Seite"
      >
        {/* Stadtgebiet, gestrichelt wie eine Grenze auf dem Plan */}
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
          strokeWidth="1.2"
          strokeDasharray="5 4"
          strokeLinejoin="round"
          className="text-foreground/45"
        />

        {/* Elbe als Wasserfläche, darin die Fahrrinne */}
        <path
          d="M 40 312
             Q 130 297, 210 310
             T 380 307
             T 580 314
             L 580 334
             Q 470 326, 380 329
             T 210 332
             Q 130 322, 40 334 Z"
          className="fill-[#d3d6d3]"
        />
        <path
          d="M 40 323 Q 130 310, 210 321 T 380 318 T 580 324"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeDasharray="7 6"
          className="text-foreground/35"
        />

        {/* Außenalster */}
        <path
          d="M 330 125
             C 320 135, 325 155, 345 158
             C 365 161, 380 145, 372 128
             C 365 115, 340 115, 330 125 Z"
          className="fill-[#d3d6d3]"
        />

        {/* Harburg südlich der Elbe */}
        <path
          d="M 220 365
             C 200 355, 195 375, 215 385
             C 245 393, 295 395, 335 389
             C 360 384, 365 368, 345 360
             C 310 353, 250 355, 220 365 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          strokeLinejoin="round"
          className="text-foreground/45"
        />

        {/* Beschriftung der Gewässer und Nordpfeil, in Mono */}
        <g className="fill-muted-foreground font-mono text-[13px] sm:text-[10px]" letterSpacing="1.5">
          <text x="62" y="304">ELBE</text>
          <text x="64" y="74">N ↑</text>
        </g>

        {STANDORTE.map((s) => {
          const pin = PINS[s.slug];
          if (!pin) return null;
          return (
            <Pin
              key={s.slug}
              slug={s.slug}
              name={s.name}
              x={pin.x}
              y={pin.y}
              align={pin.align}
              state={!active ? "default" : active === s.slug ? "active" : "muted"}
            />
          );
        })}
      </svg>
      <figcaption className="hafen-caption mt-3 ml-3 sm:ml-0">Karte schematisch, nicht maßstabsgetreu</figcaption>
    </figure>
  );
}

function Pin({
  slug,
  name,
  x,
  y,
  align,
  state,
}: {
  slug: string;
  name: string;
  x: number;
  y: number;
  align: "left" | "right";
  state: "default" | "active" | "muted";
}) {
  const gap = state === "active" ? 18 : 12;
  const labelX = align === "right" ? x + gap : x - gap;
  const textAnchor = align === "right" ? "start" : "end";
  const size = state === "active" ? 12 : 9;

  const squareClass =
    state === "muted"
      ? "fill-foreground/55 group-hover:fill-gold group-focus-visible:fill-gold"
      : "fill-gold group-hover:fill-foreground group-focus-visible:fill-foreground";
  const labelClass =
    state === "active"
      ? "fill-foreground font-semibold"
      : state === "muted"
        ? "fill-muted-foreground group-hover:fill-foreground group-focus-visible:fill-foreground"
        : "fill-foreground";

  return (
    <Link
      href={`/standorte/${slug}`}
      aria-label={`Webdesign in Hamburg-${name}`}
      aria-current={state === "active" ? "page" : undefined}
      className="group outline-none"
    >
      {/* Trefferfläche, größer als das sichtbare Quadrat */}
      <rect x={x - 18} y={y - 14} width="36" height="28" fill="transparent" />
      {state === "active" ? (
        <rect
          x={x - 11}
          y={y - 11}
          width="22"
          height="22"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-foreground"
        />
      ) : null}
      <rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        className={`transition-colors duration-200 ${squareClass}`}
      />
      <text
        x={labelX}
        y={y + 5}
        textAnchor={textAnchor}
        className={`text-[17px] tracking-tight transition-colors duration-200 group-hover:underline group-focus-visible:underline sm:text-[13.5px] ${labelClass}`}
      >
        {name}
      </text>
    </Link>
  );
}
