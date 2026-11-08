import { presetFuer } from "@/lib/muster-presets";

import { ContainerPlastisch, CONTAINER } from "./container-plastisch";
import { Handy, Laptop, rr, Tablet } from "./geraete";
import { SEITE_DESKTOP, SEITE_MOBIL } from "./muster-seite";
import { Speisekarte } from "./paket-bilder";

/**
 * Kleine Bilder der Bildreihe unter dem Kopf: viewBox 0 0 104 68,
 * transparent, Licht von oben links, Bodenschatten als Ellipse.
 */
/** Vereinfachte Musterseite für winzige Bildschirme (wenige Flächen). */
function MiniMobil({
  a,
  tint,
  kopf,
}: {
  a: string;
  tint: string;
  kopf: string;
}) {
  return (
    <g>
      <rect width="390" height="780" fill="#fff" />
      <path d="M30 76h150" stroke={a} strokeWidth="22" strokeLinecap="round" />
      <rect y="110" width="390" height="250" fill={kopf} />
      <rect y="360" width="390" height="420" fill={tint} />
      <path
        d="M30 420h300M30 470h220"
        stroke="#1d1d1f"
        strokeOpacity=".8"
        strokeWidth="30"
        strokeLinecap="round"
      />
      <rect x="30" y="560" width="330" height="64" rx="32" fill={a} />
    </g>
  );
}
function MiniDesktop({
  a,
  tint,
  kopf,
}: {
  a: string;
  tint: string;
  kopf: string;
}) {
  return (
    <g>
      <rect width="960" height="600" fill="#fff" />
      <path d="M50 34h200" stroke={a} strokeWidth="22" strokeLinecap="round" />
      <rect y="68" width="960" height="352" fill={tint} />
      <path
        d="M60 170h330M60 230h260"
        stroke="#1d1d1f"
        strokeOpacity=".8"
        strokeWidth="36"
        strokeLinecap="round"
      />
      <rect x="60" y="300" width="200" height="56" rx="28" fill={a} />
      <rect x="500" y="100" width="410" height="290" rx="16" fill={kopf} />
      <path
        d="M60 500h240M360 500h240M660 500h240"
        stroke="#e5e5ea"
        strokeWidth="90"
      />
    </g>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 104 68" aria-hidden="true" focusable="false">
      <ellipse cx="52" cy="64.5" rx="40" ry="3" fill="url(#ld-boden)" />
      {children}
    </svg>
  );
}

export function ReiheStarter() {
  return (
    <Svg>
      <Handy
        x={37}
        y={3}
        w={30}
        h={60}
        vb={SEITE_MOBIL}
        inhalt={<MiniMobil a="#b4572a" tint="#fff" kopf="#c98a5a" />}
        schatten={false}
      />
    </Svg>
  );
}

export function ReiheBusiness() {
  const p = presetFuer("pflege");
  return (
    <Svg>
      <Laptop
        x={18}
        y={12}
        w={64}
        h={42}
        vb={SEITE_DESKTOP}
        inhalt={<MiniDesktop a={p.accent} tint={p.tint} kopf="#cfe0d9" />}
      />
      <Handy
        x={76}
        y={30}
        w={16}
        h={32}
        vb={SEITE_MOBIL}
        inhalt={<MiniMobil a={p.accent} tint={p.tint} kopf="#cfe0d9" />}
        schatten={false}
      />
    </Svg>
  );
}

export function ReihePremium() {
  return (
    <Svg>
      <Tablet
        x={20}
        y={14}
        w={62}
        h={46}
        vb="0 0 480 340"
        inhalt={<SpeisekarteQuer />}
      />
      {/* Stift */}
      <g transform="rotate(38 84 30)">
        <rect x="81" y="10" width="6" height="34" rx="2" fill="#1d1d1f" />
        <path d="M81 44h6l-3 6Z" fill="#c7c7cc" />
        <rect
          x="81"
          y="10"
          width="2"
          height="34"
          fill="#fff"
          fillOpacity=".25"
        />
      </g>
    </Svg>
  );
}

/** Speisekarte quer (viewBox 480 × 340) für das kleine Tablet. */
function SpeisekarteQuer() {
  return (
    <g>
      <rect width="480" height="340" fill="#fffaf6" />
      <rect width="480" height="56" fill="#9a4b2c" />
      <path
        d="M28 28h120"
        stroke="#fff"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {[96, 148, 200, 252].map((y, i) => (
        <g key={y}>
          {i === 1 ? (
            <rect
              x="14"
              y={y - 24}
              width="452"
              height="46"
              rx="10"
              fill="#fff3ec"
              stroke="#f45b1e"
              strokeWidth="4"
            />
          ) : null}
          <path
            d={`M34 ${y}h150`}
            stroke="#1d1d1f"
            strokeOpacity=".65"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d={`M210 ${y}H370`}
            stroke="#c7b8ab"
            strokeWidth="4"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <path
            d={`M396 ${y}h50`}
            stroke="#9a4b2c"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

export function ReiheStudio() {
  const farben = ["#1f2f4f", "#c9a96e", "#e8e1d6", "#f45b1e"];
  return (
    <Svg>
      {/* Briefkopf */}
      <g transform="rotate(8 66 34)">
        <rect
          x="52"
          y="8"
          width="34"
          height="48"
          rx="1.5"
          fill="#000"
          fillOpacity=".1"
          transform="translate(1.5 2)"
        />
        <rect x="52" y="8" width="34" height="48" rx="1.5" fill="#fff" />
        <rect x="57" y="13" width="12" height="3" rx="1" fill="#1f2f4f" />
        <path
          d="M57 24h22M57 28h18M57 32h22M57 36h14"
          stroke="#1d1d1f"
          strokeOpacity=".2"
          strokeWidth="1.4"
        />
      </g>
      {/* Blatt Aa */}
      <g>
        <rect
          x="35"
          y="10"
          width="34"
          height="48"
          rx="1.5"
          fill="#000"
          fillOpacity=".1"
          transform="translate(1.5 2)"
        />
        <rect x="35" y="10" width="34" height="48" rx="1.5" fill="#fff" />
        <text
          x="52"
          y="38"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill="#1d1d1f"
          fontFamily="inherit"
        >
          Aa
        </text>
        <path
          d="M41 46h22M41 50h16"
          stroke="#1d1d1f"
          strokeOpacity=".2"
          strokeWidth="1.4"
        />
      </g>
      {/* Farbtafel */}
      <g transform="rotate(-8 34 36)">
        <rect
          x="16"
          y="12"
          width="34"
          height="48"
          rx="1.5"
          fill="#000"
          fillOpacity=".1"
          transform="translate(1.5 2)"
        />
        <rect x="16" y="12" width="34" height="48" rx="1.5" fill="#fff" />
        {farben.map((c, i) => (
          <rect
            key={c}
            x={20 + (i % 2) * 14}
            y={16 + Math.floor(i / 2) * 14}
            width="12"
            height="12"
            rx="2"
            fill={c}
          />
        ))}
        <path
          d="M20 48h22M20 52h14"
          stroke="#1d1d1f"
          strokeOpacity=".2"
          strokeWidth="1.4"
        />
      </g>
    </Svg>
  );
}

export function ReiheWartung() {
  return (
    <Svg>
      <ContainerPlastisch
        x={34}
        y={45}
        L={50}
        H={17}
        t={14}
        farbe={CONTAINER.gruen}
        rippen={9}
        schatten={false}
      />
      <ContainerPlastisch
        x={30}
        y={28}
        L={50}
        H={17}
        t={14}
        farbe={CONTAINER.zink}
        rippen={9}
        schatten={false}
      />
      <ContainerPlastisch
        x={34}
        y={11}
        L={50}
        H={17}
        t={14}
        farbe={CONTAINER.signal}
        rippen={9}
        schatten={false}
      />
    </Svg>
  );
}

export function ReiheBranchen() {
  const keys = ["pflege", "friseur", "gastro"] as const;
  return (
    <Svg>
      {keys.map((k, i) => (
        <Handy
          key={k}
          x={38}
          y={5}
          w={28}
          h={57}
          vb={SEITE_MOBIL}
          inhalt={
            <MiniMobil
              a={presetFuer(k).accent}
              tint={presetFuer(k).tint}
              kopf={presetFuer(k).accent}
            />
          }
          dreh={(i - 1) * 16}
          schatten={false}
        />
      ))}
    </Svg>
  );
}

export function ReiheWerkzeuge() {
  return (
    <Svg>
      {/* Halbkreis-Tacho mit Skala, ohne Zahlen */}
      <path d="M18 56a34 34 0 0 1 68 0Z" fill="#1d1d1f" />
      <path
        d="M18 56a34 34 0 0 1 68 0"
        fill="none"
        stroke="#fff"
        strokeOpacity=".22"
        strokeWidth="1"
      />
      <path
        d="M26 56a26 26 0 0 1 9-19.7"
        fill="none"
        stroke="#e5484d"
        strokeWidth="5"
      />
      <path
        d="M36.6 35.2a26 26 0 0 1 30.8 0"
        fill="none"
        stroke="#f5a524"
        strokeWidth="5"
      />
      <path
        d="M69 36.3A26 26 0 0 1 78 56"
        fill="none"
        stroke="#30a46c"
        strokeWidth="5"
      />
      <path
        d="M52 56L72 40"
        stroke="#f45b1e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="52" cy="56" r="5" fill="#3a3a3c" />
      <circle cx="52" cy="56" r="2" fill="#f45b1e" />
      <rect x="16" y="56" width="72" height="5" rx="2.5" fill="#3a3a3c" />
    </Svg>
  );
}

/** Anrufbildschirm (viewBox 390 × 780) */
function Anruf() {
  return (
    <g>
      <defs>
        <linearGradient id="ld-anruf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b2e" />
          <stop offset="1" stopColor="#1d1d1f" />
        </linearGradient>
      </defs>
      <rect width="390" height="780" fill="url(#ld-anruf)" />
      <circle cx="195" cy="210" r="62" fill="#f45b1e" />
      <path
        d="M150 340h90M165 372h60"
        stroke="#fff"
        strokeOpacity=".8"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <circle cx="105" cy="640" r="44" fill="#ff453a" />
      <circle cx="285" cy="640" r="44" fill="#30d158" />
      <path
        d="M270 620l9 10c2 2 2 5 0 7l-4 4c4 8 11 15 19 19l4-4c2-2 5-2 7 0l10 9c2 2 2 5 0 7l-4 4c-4 4-9 5-14 3-15-7-28-20-35-35-2-5-1-10 3-14l4-4c2-2 5-2 7 0Z"
        fill="#fff"
        transform="translate(-14 -10) scale(1)"
      />
      <path d={rr(81, 632, 48, 16, 8)} fill="#fff" />
    </g>
  );
}

export function ReiheKontakt() {
  return (
    <Svg>
      <Handy
        x={37}
        y={3}
        w={30}
        h={60}
        vb={SEITE_MOBIL}
        inhalt={<Anruf />}
        schatten={false}
      />
    </Svg>
  );
}

export { Speisekarte };
