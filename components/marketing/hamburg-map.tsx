import Link from "next/link";

import { STANDORTE } from "@/lib/standorte-data";

/**
 * Lageplan der Hamburger Stadtteile, die eine eigene Seite haben.
 *
 * Die Punkte stehen an ihrer wirklichen Lage (Breite und Länge, in eine
 * maßstäbliche Fläche umgerechnet), darum stimmt auch die Maßstabsleiste.
 * Elbe (Norderelbe, Süderelbe, Köhlbrand) und Alster sind vereinfacht
 * als Wasser gezeichnet und beschriftet. Eine Stadtgrenze gibt es
 * bewusst nicht: Sie wäre hier nur eine erfundene Linie.
 *
 * Jeder Stadtteil verlinkt auf /standorte/[slug]. Mit `active` wird ein
 * Stadtteil hervorgehoben (Detailseite), die übrigen treten zurück.
 *
 * Die Beschriftung ist auf dem Handy in Karten-Einheiten größer gesetzt,
 * damit sie bei kleiner Kartenbreite lesbar bleibt.
 */

type Seite = "links" | "rechts" | "oben";

/** Mitte des Stadtteils (Grad Nord, Grad Ost) und Seite der Beschriftung. */
const ORTE: Record<
  string,
  { lat: number; lon: number; seite: Seite; dy?: number }
> = {
  niendorf: { lat: 53.617, lon: 9.95, seite: "links" },
  eppendorf: { lat: 53.594, lon: 9.983, seite: "links" },
  winterhude: { lat: 53.596, lon: 10.006, seite: "rechts", dy: -9 },
  eimsbuettel: { lat: 53.574, lon: 9.957, seite: "links" },
  barmbek: { lat: 53.587, lon: 10.044, seite: "rechts" },
  bramfeld: { lat: 53.613, lon: 10.078, seite: "rechts" },
  wandsbek: { lat: 53.573, lon: 10.086, seite: "rechts" },
  altona: { lat: 53.55, lon: 9.935, seite: "links" },
  "st-pauli": { lat: 53.55, lon: 9.964, seite: "oben" },
  hafencity: { lat: 53.5435, lon: 9.996, seite: "rechts" },
  bergedorf: { lat: 53.488, lon: 10.213, seite: "links" },
  harburg: { lat: 53.46, lon: 9.983, seite: "rechts" },
};

// Kartenausschnitt und Maßstab. Auf 53,55° Nord ist ein Längengrad rund
// 66,1 km breit, ein Breitengrad 111,2 km hoch.
const LON_WEST = 9.87;
const LAT_NORD = 53.64;
const KM_JE_LON = 66.1;
const KM_JE_LAT = 111.2;
const EINHEIT_JE_KM = 23.26;
const BREITE = 600;
const HOEHE = 517;

function punkt(lat: number, lon: number) {
  return {
    x: (lon - LON_WEST) * KM_JE_LON * EINHEIT_JE_KM,
    y: (LAT_NORD - lat) * KM_JE_LAT * EINHEIT_JE_KM,
  };
}

/** Weicher Linienzug durch Wegpunkte (lat, lon). */
function fluss(wegpunkte: [number, number][]) {
  const p = wegpunkte.map(([lat, lon]) => punkt(lat, lon));
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i].x + p[i + 1].x) / 2;
    const my = (p[i].y + p[i + 1].y) / 2;
    d += ` Q ${p[i].x.toFixed(1)} ${p[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const z = p[p.length - 1];
  return `${d} L ${z.x.toFixed(1)} ${z.y.toFixed(1)}`;
}

// Unterelbe und Norderelbe von West nach Ost, dann stromauf nach Südosten.
const NORDERELBE = fluss([
  [53.547, 9.845],
  [53.545, 9.89],
  [53.543, 9.925],
  [53.544, 9.952],
  [53.545, 9.97],
  [53.541, 9.985],
  [53.536, 10.005],
  [53.532, 10.027],
  [53.522, 10.048],
  [53.505, 10.06],
  [53.485, 10.062],
  [53.464, 10.064],
  [53.452, 10.09],
  [53.44, 10.115],
  [53.425, 10.14],
]);
// Süderelbe an Harburg vorbei und durch den Köhlbrand zurück zur Norderelbe.
const SUEDERELBE = fluss([
  [53.464, 10.064],
  [53.468, 10.035],
  [53.474, 10.005],
  [53.478, 9.985],
  [53.484, 9.96],
  [53.497, 9.94],
  [53.515, 9.937],
  [53.53, 9.94],
  [53.543, 9.932],
]);

const AUSSENALSTER = punkt(53.569, 10.003);
const BINNENALSTER = punkt(53.5545, 9.996);
const FUENF_KM = 5 * EINHEIT_JE_KM;

export function HamburgMap({ active }: { active?: string }) {
  const aktiv = active ? STANDORTE.find((s) => s.slug === active) : undefined;
  return (
    <figure className="mx-auto max-w-xl">
      <p className="kennzeile-mono mb-3">
        {aktiv
          ? `Lageplan · ${aktiv.name}`
          : `Lageplan · ${STANDORTE.length} Stadtteile`}
      </p>
      <svg
        viewBox={`-26 -12 ${BREITE + 52} ${HOEHE + 30}`}
        fill="none"
        className="block w-full"
        role="group"
        aria-label={
          aktiv
            ? `Lageplan: ${aktiv.name} und die übrigen Hamburger Stadtteile mit eigener Seite`
            : "Lageplan: Hamburger Stadtteile mit eigener Seite"
        }
      >
        {/* Wasser: Elbe mit beiden Armen, Alster */}
        <g
          stroke="#cfdfe8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={NORDERELBE} strokeWidth="14" />
          <path d={SUEDERELBE} strokeWidth="10" />
        </g>
        <g fill="#cfdfe8" aria-hidden="true">
          <ellipse
            cx={AUSSENALSTER.x}
            cy={AUSSENALSTER.y}
            rx="8"
            ry="29"
            transform={`rotate(8 ${AUSSENALSTER.x} ${AUSSENALSTER.y})`}
          />
          <circle cx={BINNENALSTER.x} cy={BINNENALSTER.y} r="5.500" />
        </g>

        {/* Gewässernamen, Nordpfeil und Maßstab in Mono */}
        <g
          aria-hidden="true"
          className="fill-[#5d7f93] font-mono text-[17px] sm:text-[12px]"
          letterSpacing="1.2"
        >
          <text x="-18" y="274">
            ELBE
          </text>
          <text x={AUSSENALSTER.x + 16} y={AUSSENALSTER.y + 12}>
            ALSTER
          </text>
        </g>
        <g
          aria-hidden="true"
          className="fill-muted-foreground font-mono text-[17px] sm:text-[12px]"
        >
          <text x="-18" y="8">
            N ↑
          </text>
          <text
            x={BREITE - FUENF_KM + FUENF_KM / 2}
            y={HOEHE - 2}
            textAnchor="middle"
          >
            5 km
          </text>
        </g>
        <path
          aria-hidden="true"
          d={`M ${BREITE - FUENF_KM} ${HOEHE - 26} v 8 h ${FUENF_KM} v -8`}
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-muted-foreground"
        />

        {STANDORTE.map((s) => {
          const ort = ORTE[s.slug];
          if (!ort) return null;
          const { x, y } = punkt(ort.lat, ort.lon);
          return (
            <Pin
              key={s.slug}
              slug={s.slug}
              name={s.name}
              x={x}
              y={y}
              seite={ort.seite}
              dy={ort.dy ?? 0}
              state={
                !active ? "default" : active === s.slug ? "active" : "muted"
              }
            />
          );
        })}
      </svg>
      <figcaption className="notiz-mono mt-3">
        Maßstäblich nach Lage, Elbe und Alster vereinfacht.{" "}
        {aktiv
          ? "Tippen wechselt den Stadtteil."
          : "Tippen öffnet den Stadtteil."}
      </figcaption>
    </figure>
  );
}

function Pin({
  slug,
  name,
  x,
  y,
  seite,
  dy,
  state,
}: {
  slug: string;
  name: string;
  x: number;
  y: number;
  seite: Seite;
  /** Beschriftung etwas höher oder tiefer, wo Nachbarn eng stehen */
  dy: number;
  state: "default" | "active" | "muted";
}) {
  const abstand = state === "active" ? 17 : 12;
  const labelX =
    seite === "rechts" ? x + abstand : seite === "links" ? x - abstand : x;
  const labelY = (seite === "oben" ? y - abstand - 2 : y + 7) + dy;
  const anker =
    seite === "rechts" ? "start" : seite === "links" ? "end" : "middle";
  const radius = state === "active" ? 6.5 : 4.5;

  const punktKlasse =
    state === "active"
      ? "fill-gold"
      : state === "muted"
        ? "fill-foreground/50 group-hover:fill-gold group-focus-visible:fill-gold"
        : "fill-gold group-hover:fill-foreground group-focus-visible:fill-foreground";
  const labelKlasse =
    state === "active"
      ? "fill-foreground font-semibold"
      : state === "muted"
        ? "fill-[#515154] group-hover:fill-foreground group-focus-visible:fill-foreground"
        : "fill-foreground";

  // Trefferfläche: Punkt und Beschriftung zusammen. Höher ginge nur auf Kosten
  // der Nachbarn (Winterhude und Barmbek liegen 23 Einheiten auseinander).
  const breite = name.length * 13 + abstand + 14;
  const hitX =
    seite === "rechts"
      ? x - 14
      : seite === "links"
        ? x - breite + 14
        : x - breite / 2;
  const hitY = seite === "oben" ? y - 46 : y - 28;
  const hitH = seite === "oben" ? 62 : 56;

  return (
    <Link
      href={`/standorte/${slug}`}
      aria-label={`Webdesign in Hamburg-${name}`}
      aria-current={state === "active" ? "page" : undefined}
      className="group outline-none"
    >
      <rect
        x={hitX}
        y={hitY}
        width={breite}
        height={hitH}
        rx="10"
        fill="transparent"
      />
      {state === "active" ? (
        <>
          <circle cx={x} cy={y} r="13" className="karte-ruf fill-gold/25" />
          <circle
            cx={x}
            cy={y}
            r="13"
            stroke="currentColor"
            strokeWidth="1.4"
            className="text-gold"
          />
        </>
      ) : null}
      <circle
        cx={x}
        cy={y}
        r={radius}
        className={`transition-colors duration-200 ${punktKlasse}`}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor={anker}
        stroke="#fff"
        strokeWidth="5"
        strokeLinejoin="round"
        paintOrder="stroke"
        className={`text-[23px] tracking-tight transition-colors duration-200 group-hover:underline group-focus-visible:underline sm:text-[16px] ${labelKlasse}`}
      >
        {name}
      </text>
    </Link>
  );
}
