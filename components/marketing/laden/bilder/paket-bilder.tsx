import { presetFuer } from "@/lib/muster-presets";

import { ContainerPlastisch, CONTAINER } from "./container-plastisch";
import { Boden, Handy, Laptop, rr, Tablet } from "./geraete";
import {
  MotivVorlage,
  MusterSeite,
  SEITE_DESKTOP,
  SEITE_MOBIL,
} from "./muster-seite";

/**
 * Bilder der Paketkarten (Regal „Die Pakete.“). Alle in einer viewBox von
 * 400 × 310 (Bildzone einer großen Karte am Rechner), unten bündig; in
 * schmaleren Karten wird seitlich angeschnitten (xMidYMax slice). Der
 * Hintergrundverlauf kommt aus dem CSS der Bildzone.
 */
export const PAKET_VB = "0 0 400 310";

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={PAKET_VB}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ---------- Starter: großes Handy mit der Tischlerei Nordholz ---------- */

/** Holz-Kopfbild aus Dielen mit Maserung (für Nordholz). */
export function Dielen({
  x,
  y,
  w,
  h,
  n = 6,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  n?: number;
}) {
  const farben = [
    "#c98a5a",
    "#b4572a",
    "#d9a477",
    "#c27a4a",
    "#d39a68",
    "#b96a3c",
  ];
  const dw = w / n;
  let maser = "";
  for (let i = 0; i < n; i++) {
    const mx = x + i * dw;
    maser += `M${mx + dw * 0.3} ${y}c${dw * 0.15} ${h * 0.3} ${-dw * 0.1} ${h * 0.6} ${dw * 0.05} ${h}M${mx + dw * 0.7} ${y}c${-dw * 0.12} ${h * 0.35} ${dw * 0.14} ${h * 0.55} ${-dw * 0.04} ${h}`;
  }
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={x + i * dw}
          y={y}
          width={dw + 0.5}
          height={h}
          fill={farben[i % farben.length]}
        />
      ))}
      <path
        d={maser}
        stroke="#8a4f25"
        strokeOpacity=".28"
        strokeWidth={dw * 0.035}
        fill="none"
      />
      <path
        d={Array.from(
          { length: n - 1 },
          (_, i) => `M${x + (i + 1) * dw} ${y}v${h}`,
        ).join("")}
        stroke="#5a2f14"
        strokeOpacity=".35"
        strokeWidth={dw * 0.03}
      />
      <rect x={x} y={y} width={w} height={h} fill="url(#ld-flaeche)" />
    </g>
  );
}

export function NordholzMobil() {
  const a = "#b4572a";
  return (
    <g fontFamily="inherit">
      <rect width="390" height="780" fill="#fff" />
      <path
        d="M30 22h34M318 22h40"
        stroke="#1d1d1f"
        strokeOpacity=".75"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <text
        x="24"
        y="80"
        fontSize="26"
        fontWeight="760"
        fill="#1d1d1f"
        letterSpacing="-.6"
      >
        Nordholz
      </text>
      <rect x="140" y="70" width="9" height="9" fill={a} />
      <path
        d="M334 66h28M334 75h28M334 84h28"
        stroke="#1d1d1f"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Dielen x={0} y={104} w={390} h={230} />
      {/* Hobel-Silhouette auf dem Holz */}
      <path d="M150 300l10-26h92l10 26Z" fill="#1d1d1f" fillOpacity=".22" />
      <text
        x="22"
        y="390"
        fontSize="30"
        fontWeight="760"
        fill="#1d1d1f"
        letterSpacing="-.9"
      >
        <tspan x="22">Möbel und Innenausbau</tspan>
        <tspan x="22" dy="38">
          nach Maß.
        </tspan>
      </text>
      <path
        d="M24 452h300M24 470h220"
        stroke="#000"
        strokeOpacity=".14"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="22" y="500" width="346" height="56" rx="28" fill={a} />
      <text
        x="195"
        y="534"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="#fff"
      >
        Rückruf anfordern
      </text>
      {[590, 652, 714].map((y) => (
        <g key={y}>
          <rect x="22" y={y} width="346" height="50" rx="12" fill="#f3f2ee" />
          <rect
            x="36"
            y={y + 13}
            width="24"
            height="24"
            rx="6"
            fill={a}
            fillOpacity=".18"
          />
          <path
            d={`M74 ${y + 25}h${y === 652 ? 120 : 150}`}
            stroke="#1d1d1f"
            strokeOpacity=".55"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d={`M346 ${y + 19}l6 6-6 6`}
            fill="none"
            stroke="#a1a1a6"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

export function BildStarter() {
  return (
    <Svg>
      <circle cx="300" cy="80" r="70" fill="#fff" fillOpacity=".5" />
      <Handy
        x={125}
        y={44}
        w={150}
        h={304}
        inhalt={<NordholzMobil />}
        vb={SEITE_MOBIL}
        dreh={-6}
      />
    </Svg>
  );
}

/* ---------- Business: Laptop mit Pflegedienst Elbblick, Handy davor ---------- */

export function BildBusiness() {
  const p = presetFuer("pflege");
  return (
    <Svg>
      <MotivVorlage preset={p} id="ld-motiv-business" />
      <Laptop
        x={30}
        y={48}
        w={300}
        h={196}
        inhalt={
          <MusterSeite
            preset={p}
            format="desktop"
            motivRef="ld-motiv-business"
          />
        }
        vb={SEITE_DESKTOP}
        dunkelGrund
      />
      <Handy
        x={286}
        y={120}
        w={84}
        h={172}
        inhalt={
          <MusterSeite preset={p} format="mobil" motivRef="ld-motiv-business" />
        }
        vb={SEITE_MOBIL}
        farbe="#2c2c2e"
      />
    </Svg>
  );
}

/* ---------- Premium: Tablet mit Speisekarte im Bearbeiten-Zustand ---------- */

/** Speisekarte des Café Kajüte (viewBox 360 × 480). */
export function Speisekarte({ telefon = false }: { telefon?: boolean }) {
  const a = "#9a4b2c";
  const zeilen = [0, 1, 2, 3, 4];
  const top = telefon ? 150 : 132;
  const abstand = telefon ? 62 : 60;
  return (
    <g fontFamily="inherit">
      <rect width="360" height={telefon ? 740 : 480} fill="#fffaf6" />
      <rect width="360" height="64" fill="#fff" />
      <text
        x="22"
        y="40"
        fontSize="20"
        fontWeight="700"
        fill={a}
        letterSpacing="-.3"
      >
        Café Kajüte
      </text>
      <path
        d="M300 32h38"
        stroke="#1d1d1f"
        strokeOpacity=".3"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect y="64" width="360" height="1" fill="#eadfd6" />
      <text
        x="22"
        y="108"
        fontSize="24"
        fontWeight="760"
        fill="#1d1d1f"
        letterSpacing="-.6"
      >
        Speisekarte
      </text>
      {telefon ? (
        <g transform="translate(300 86)">
          <circle r="16" fill="#f45b1e" />
          <path d="M-6 6l1.5-5 8-8 3.5 3.5-8 8Z" fill="#fff" />
        </g>
      ) : null}
      {zeilen.map((i) => {
        const y = top + i * abstand;
        const aktiv = i === 2;
        return (
          <g key={i}>
            {aktiv ? (
              <rect
                x="12"
                y={y - 26}
                width="336"
                height={abstand - 8}
                rx="10"
                fill="#fff3ec"
                stroke="#f45b1e"
                strokeWidth="1.5"
              />
            ) : null}
            <path
              d={`M24 ${y - 4}h${[110, 88, 124, 96, 104][i]}`}
              stroke="#1d1d1f"
              strokeOpacity=".7"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d={`M24 ${y + 14}h${[150, 120, 0, 136, 110][i]}`}
              stroke="#000"
              strokeOpacity={aktiv ? 0 : 0.1}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={`M${[150, 128, 164, 136, 144][i]} ${y - 2}H${aktiv ? 230 : 290}`}
              stroke="#c7b8ab"
              strokeWidth="2"
              strokeDasharray="1 5"
              strokeLinecap="round"
            />
            <path
              d={`M${aktiv ? 246 : 300} ${y - 4}h${aktiv ? 0 : 36}`}
              stroke={a}
              strokeWidth="9"
              strokeLinecap="round"
            />
            {aktiv ? (
              <g>
                <rect
                  x="244"
                  y={y - 18}
                  width="92"
                  height="30"
                  rx="15"
                  fill="#f45b1e"
                />
                <text
                  x="290"
                  y={y + 2}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#fff"
                >
                  Speichern
                </text>
                <rect x="236" y={y - 14} width="2" height="20" fill="#f45b1e" />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

export function BildPremium() {
  return (
    <Svg>
      <Tablet
        x={78}
        y={44}
        w={186}
        h={248}
        vb="0 0 360 480"
        inhalt={<Speisekarte />}
        dreh={-6}
      />
      <Handy
        x={268}
        y={128}
        w={80}
        h={164}
        vb="0 0 360 740"
        inhalt={<Speisekarte telefon />}
        dreh={4}
      />
    </Svg>
  );
}

/* ---------- Studio: Flachlage mit Briefkopf, Farbfächer, Visitenkarten ---------- */

export function BildStudio() {
  const faecher = ["#1f2f4f", "#c9a96e", "#e8e1d6", "#f45b1e", "#1d1d1f"];
  return (
    <Svg>
      {/* Laptop-Ecke oben rechts, angeschnitten */}
      <g transform="rotate(8 360 20)">
        <path
          d={rr(300, -60, 200, 130, 12)}
          fill="#000"
          fillOpacity=".12"
          transform="translate(6 8)"
        />
        <path d={rr(300, -60, 200, 130, 12)} fill="url(#ld-alu)" />
        <path d={rr(316, -48, 170, 100, 6)} fill="#c7c7cc" />
        <rect x="380" y="56" width="60" height="6" rx="3" fill="#a1a1a6" />
      </g>
      {/* Briefkopf A4 */}
      <g transform="rotate(-5 120 190)">
        <rect
          x="38"
          y="70"
          width="170"
          height="240"
          rx="2"
          fill="#000"
          fillOpacity=".12"
          transform="translate(8 9)"
        />
        <rect x="38" y="70" width="170" height="240" rx="2" fill="#fff" />
        <rect x="58" y="92" width="58" height="10" rx="2" fill="#1f2f4f" />
        <rect x="58" y="106" width="34" height="4" rx="2" fill="#c9a96e" />
        <path
          d="M58 138h86M58 160h130M58 172h124M58 184h130M58 196h96M58 220h120M58 232h110"
          stroke="#1d1d1f"
          strokeOpacity=".16"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect
          x="160"
          y="90"
          width="28"
          height="28"
          rx="14"
          fill="none"
          stroke="#1f2f4f"
          strokeWidth="3"
        />
      </g>
      {/* Farbfächer: fünf Streifen um einen Drehpunkt */}
      <g>
        {faecher.map((c, i) => {
          const w = -26 + i * 13;
          return (
            <g key={c} transform={`rotate(${w} 270 268)`}>
              <rect
                x="256"
                y="112"
                width="28"
                height="150"
                rx="6"
                fill="#000"
                fillOpacity=".12"
                transform="translate(5 6)"
              />
              <rect x="256" y="112" width="28" height="150" rx="6" fill={c} />
              <rect
                x="256"
                y="112"
                width="28"
                height="150"
                rx="6"
                fill="url(#ld-flaeche)"
              />
              <rect
                x="262"
                y="232"
                width="16"
                height="3"
                rx="1.5"
                fill={i === 2 ? "#1d1d1f" : "#fff"}
                fillOpacity=".55"
              />
            </g>
          );
        })}
        <circle
          cx="270"
          cy="252"
          r="5"
          fill="#d1d1d6"
          stroke="#8e9499"
          strokeWidth="1.5"
        />
      </g>
      {/* Visitenkarten */}
      <g transform="rotate(10 320 250)">
        <rect
          x="270"
          y="226"
          width="92"
          height="56"
          rx="3"
          fill="#000"
          fillOpacity=".12"
          transform="translate(5 6)"
        />
        <rect x="270" y="226" width="92" height="56" rx="3" fill="#fff" />
        <rect x="280" y="238" width="34" height="6" rx="2" fill="#1f2f4f" />
        <path
          d="M280 262h52M280 270h38"
          stroke="#1d1d1f"
          strokeOpacity=".2"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g transform="rotate(-8 200 280)">
        <rect
          x="170"
          y="252"
          width="92"
          height="56"
          rx="3"
          fill="#000"
          fillOpacity=".14"
          transform="translate(5 6)"
        />
        <rect x="170" y="252" width="92" height="56" rx="3" fill="#1d1d1f" />
        <rect x="182" y="266" width="40" height="2" fill="#c9a96e" />
        <rect x="182" y="274" width="24" height="5" rx="2" fill="#c9a96e" />
      </g>
    </Svg>
  );
}

/* ---------- Wartung: 40-Fuß-Container in Petrol am Kai ---------- */

export function BildWartung() {
  return (
    <Svg>
      {/* Kai: Beton mit Fugen und Kante */}
      <path d="M0 176H400V310H0Z" fill="#d9dbdd" />
      <path d="M0 176H400V182H0Z" fill="#fff" fillOpacity=".6" />
      <path
        d="M0 230H400M0 278H400M60 176L20 310M170 176L150 310M280 176L290 310M380 176L410 310"
        stroke="#b9bdc1"
        strokeWidth="1.5"
      />
      <path
        d="M0 196H400"
        stroke="#f5c400"
        strokeWidth="4"
        strokeDasharray="22 14"
        opacity=".8"
      />
      <ContainerPlastisch
        x={104}
        y={110}
        L={256}
        H={104}
        t={64}
        farbe={CONTAINER.petrol}
        rippen={14}
        schild="SITALO"
      />
      {/* Werkzeugkasten davor */}
      <ellipse cx="94" cy="276" rx="58" ry="8" fill="url(#ld-kontakt)" />
      <path d="M46 238h96v34H46Z" fill="#f45b1e" />
      <path d="M46 238h96v8H46Z" fill="#fff" fillOpacity=".25" />
      <path d="M52 232h84l6 6H46Z" fill="#ff7a45" />
      <path
        d="M78 232v-12h32v12"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect
        x="88"
        y="250"
        width="12"
        height="8"
        rx="1.5"
        fill="#1d1d1f"
        fillOpacity=".7"
      />
      <path d="M142 238l8 -4v32l-8 6Z" fill="#c9461a" />
      <Boden cx={330} cy={290} rx={40} ry={6} />
      {/* Poller */}
      <path d="M352 266h26v18h-26Z" fill="#3a3d40" />
      <ellipse cx="365" cy="266" rx="13" ry="5" fill="#5b5f63" />
    </Svg>
  );
}
