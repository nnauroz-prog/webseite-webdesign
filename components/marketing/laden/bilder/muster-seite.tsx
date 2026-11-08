import type { Preset } from "@/lib/muster-presets";

import { BranchenMotiv, MOTIV_H, MOTIV_W } from "./branchen-motive";
import { zeilenKurz } from "./farbe";
import { Handy, Laptop, Monitor, Tablet } from "./geraete";

/**
 * Musterseite einer Branche als SVG (nicht als DOM-Skizze): Wortmarke in
 * der Akzentfarbe, Navigation als Balken, Kopfmotiv, echte Überschrift,
 * Knopf in der Akzentfarbe, drei Kacheln. Gespeist aus lib/muster-presets.
 *
 * desktop: viewBox 0 0 960 600 · mobil: viewBox 0 0 390 780
 *
 * Knopftexte mit „Pro…“ (z. B. „Probetraining“) stehen nur als Balken.
 */
export const SEITE_DESKTOP = "0 0 960 600";
export const SEITE_MOBIL = "0 0 390 780";

function sicher(text: string | undefined) {
  return !text || /\bPro/.test(text) ? null : text;
}
function knopfText(p: Preset) {
  return sicher(p.cta);
}

/** Wortmarke: lange Namen kürzen (z. B. „Glanzwerk“ statt des ganzen Namens). */
function marke(p: Preset, max: number) {
  if (p.defaultName.length <= max) return p.defaultName;
  const w = p.defaultName.split(" ");
  return w.length > 1 && w[0].length > 4 ? w[0] : w.slice(-1)[0];
}

export function MusterSeite({
  preset,
  format,
  name,
  leer = false,
  motivRef,
}: {
  preset: Preset;
  format: "desktop" | "mobil";
  /** abweichender Name (z. B. „Ihr Betrieb“) */
  name?: string;
  /** ohne Überschrift und Kacheltexte: Platzhalter-Seite */
  leer?: boolean;
  /** id eines schon gezeichneten Kopfmotivs (MotivVorlage), statt es erneut zu zeichnen */
  motivRef?: string;
}) {
  return format === "desktop" ? (
    <Desktop p={preset} name={name} leer={leer} motivRef={motivRef} />
  ) : (
    <Mobil p={preset} name={name} leer={leer} motivRef={motivRef} />
  );
}

/** Kopfmotiv einmal als Vorlage (in <defs>), für mehrere Bildschirme per <use>. */
export function MotivVorlage({ preset, id }: { preset: Preset; id: string }) {
  return (
    <defs>
      <g id={id}>
        <BranchenMotiv motiv={preset.key} a={preset.accent} />
      </g>
    </defs>
  );
}

function Motiv({ p, motivRef }: { p: Preset; motivRef?: string }) {
  return motivRef ? (
    <use href={`#${motivRef}`} />
  ) : (
    <BranchenMotiv motiv={p.key} a={p.accent} />
  );
}

function Desktop({
  p,
  name,
  leer,
  motivRef,
}: {
  p: Preset;
  name?: string;
  leer: boolean;
  motivRef?: string;
}) {
  const a = p.accent;
  const titel = zeilenKurz(p.headline, 20, 3);
  const knopf = knopfText(p);
  const ty = 150 + (3 - titel.length) * 22;
  return (
    <g fontFamily="inherit">
      <rect width="960" height="600" fill="#fff" />
      {/* Navigation */}
      <text
        x="40"
        y="41"
        fontSize="22"
        fontWeight="650"
        fill={a}
        letterSpacing="-.3"
      >
        {name ?? marke(p, 26)}
      </text>
      <path
        d="M560 34h60M648 34h56M732 34h64"
        stroke="#c7c7cc"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="822" y="17" width="100" height="34" rx="17" fill={a} />
      <path
        d="M846 34h52"
        stroke="#fff"
        strokeOpacity=".9"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect y="67" width="960" height="1" fill="#e5e5ea" />
      {/* Kopf: Text links, Motiv rechts */}
      <rect y="68" width="960" height="352" fill={p.tint} />
      {leer ? (
        <path
          d="M40 160h330M40 210h280M40 260h220"
          stroke="#d2d2d7"
          strokeWidth="26"
          strokeLinecap="round"
        />
      ) : (
        <>
          <rect x="40" y={ty - 44} width="84" height="7" rx="3.5" fill={a} />
          <text
            x="38"
            y={ty}
            fontSize="40"
            fontWeight="700"
            fill="#1d1d1f"
            letterSpacing="-1.2"
          >
            {titel.map((z, i) => (
              <tspan key={z} x="38" dy={i ? 46 : 0}>
                {z}
              </tspan>
            ))}
          </text>
        </>
      )}
      <path
        d="M40 316h360M40 336h280"
        stroke="#000"
        strokeOpacity=".14"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="40" y="358" width="196" height="44" rx="22" fill={a} />
      {knopf && !leer ? (
        <text
          x="138"
          y="386"
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fill="#fff"
        >
          {knopf}
        </text>
      ) : (
        <path
          d="M76 380h124"
          stroke="#fff"
          strokeOpacity=".9"
          strokeWidth="7"
          strokeLinecap="round"
        />
      )}
      <rect
        x="248"
        y="358"
        width="112"
        height="44"
        rx="22"
        fill="#fff"
        stroke="#000"
        strokeOpacity=".12"
      />
      <path
        d="M278 380h52"
        stroke="#1d1d1f"
        strokeOpacity=".7"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <svg
        x="488"
        y="92"
        width="432"
        height="304"
        viewBox={`0 0 ${MOTIV_W} ${MOTIV_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <Motiv p={p} motivRef={motivRef} />
      </svg>
      {/* Kacheln */}
      {[40, 340, 640].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y="444"
            width="280"
            height="132"
            rx="14"
            fill="#fff"
            stroke="#e5e5ea"
            strokeWidth="1.5"
          />
          <rect
            x={x + 22}
            y="466"
            width="34"
            height="34"
            rx="9"
            fill={p.tint}
          />
          <rect x={x + 32} y="476" width="14" height="14" rx="3" fill={a} />
          {leer || !sicher(p.features[i]) ? (
            <path
              d={`M${x + 22} 528h150`}
              stroke="#d2d2d7"
              strokeWidth="12"
              strokeLinecap="round"
            />
          ) : (
            <text
              x={x + 22}
              y="533"
              fontSize="17"
              fontWeight="650"
              fill="#1d1d1f"
            >
              {p.features[i]}
            </text>
          )}
          <path
            d={`M${x + 22} 556h200`}
            stroke="#000"
            strokeOpacity=".1"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

function Mobil({
  p,
  name,
  leer,
  motivRef,
}: {
  p: Preset;
  name?: string;
  leer: boolean;
  motivRef?: string;
}) {
  const a = p.accent;
  const titel = zeilenKurz(p.headline, 17, 3);
  const knopf = knopfText(p);
  const ty = 418;
  return (
    <g fontFamily="inherit">
      <rect width="390" height="780" fill="#fff" />
      {/* Statusleiste und Navigation */}
      <path
        d="M30 22h34M318 22h40"
        stroke="#1d1d1f"
        strokeOpacity=".75"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <text
        x={name ? 38 : 24}
        y="80"
        fontSize="23"
        fontWeight="650"
        fill={a}
        letterSpacing="-.3"
      >
        {name ?? marke(p, 18)}
      </text>
      <path
        d="M334 66h28M334 75h28M334 84h28"
        stroke="#1d1d1f"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <svg
        x="0"
        y="104"
        width="390"
        height="250"
        viewBox={`0 0 ${MOTIV_W} ${MOTIV_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <Motiv p={p} motivRef={motivRef} />
      </svg>
      <rect y="354" width="390" height="426" fill={p.tint} />
      {leer ? (
        <path
          d="M24 404h300M24 444h240"
          stroke="#d2d2d7"
          strokeWidth="24"
          strokeLinecap="round"
        />
      ) : (
        <text
          x="22"
          y={ty}
          fontSize="31"
          fontWeight="700"
          fill="#1d1d1f"
          letterSpacing="-.9"
        >
          {titel.map((z, i) => (
            <tspan key={z} x="22" dy={i ? 36 : 0}>
              {z}
            </tspan>
          ))}
        </text>
      )}
      <path
        d={`M24 ${ty + titel.length * 36 + 4}h300M24 ${ty + titel.length * 36 + 22}h220`}
        stroke="#000"
        strokeOpacity=".14"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="22" y="568" width="346" height="54" rx="27" fill={a} />
      {knopf && !leer ? (
        <text
          x="195"
          y="601"
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
          fill="#fff"
        >
          {knopf}
        </text>
      ) : (
        <path
          d="M135 595h120"
          stroke="#fff"
          strokeOpacity=".9"
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}
      {[640, 708].map((y, i) => (
        <g key={y}>
          <rect x="22" y={y} width="346" height="56" rx="14" fill="#fff" />
          <rect
            x="36"
            y={y + 14}
            width="28"
            height="28"
            rx="8"
            fill={a}
            fillOpacity=".16"
          />
          <circle cx="50" cy={y + 28} r="6" fill={a} />
          {leer || !sicher(p.features[i]) ? (
            <path
              d={`M78 ${y + 28}h140`}
              stroke="#d2d2d7"
              strokeWidth="10"
              strokeLinecap="round"
            />
          ) : (
            <text
              x="78"
              y={y + 34}
              fontSize="16"
              fontWeight="600"
              fill="#1d1d1f"
            >
              {p.features[i]}
            </text>
          )}
          <path
            d={`M346 ${y + 22}l6 6-6 6`}
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

/** Kontaktseite einer Musterseite fürs zweite Handy (viewBox 390 × 780). */
function KontaktSeite({ p }: { p: Preset }) {
  const a = p.accent;
  const name = zeilenKurz(p.defaultName, 16, 2);
  const reihen = ["Öffnungszeiten", "Anfahrt", p.nav[p.nav.length - 1] ?? "Kontakt"];
  return (
    <g fontFamily="inherit">
      <rect width="390" height="780" fill="#fff" />
      <path d="M30 22h34M318 22h40" stroke="#1d1d1f" strokeOpacity=".75" strokeWidth="7" strokeLinecap="round" />
      <text x="24" y="82" fontSize="22" fontWeight="700" fill={a} letterSpacing="-.2">
        Kontakt
      </text>
      {name.map((z, i) => (
        <text key={z} x="24" y={128 + i * 36} fontSize="32" fontWeight="750" fill="#1d1d1f" letterSpacing="-.6">
          {z}
        </text>
      ))}
      {/* Stadtplan mit Nadel */}
      <rect x="22" y={186 + (name.length - 1) * 36} width="346" height="200" rx="18" fill={p.tint} />
      <g transform={`translate(0 ${(name.length - 1) * 36})`}>
        <path d="M22 300C120 250 200 330 368 270" stroke="#fff" strokeWidth="16" fill="none" />
        <path d="M140 186V386M260 186V386M22 240H368" stroke="#fff" strokeWidth="8" />
        <path d="M195 236c-18 0-30 13-30 30 0 22 30 44 30 44s30-22 30-44c0-17-12-30-30-30Z" fill={a} />
        <circle cx="195" cy="266" r="10" fill="#fff" />
        {reihen.map((r, i) => (
          <g key={r} transform={`translate(0 ${410 + i * 64})`}>
            <rect x="22" width="346" height="54" rx="14" fill="#f3f2ee" />
            <circle cx="50" cy="27" r="9" fill={a} fillOpacity=".85" />
            <text x="72" y="35" fontSize="21" fontWeight="600" fill="#1d1d1f">
              {r}
            </text>
            <path d="M344 19l7 8-7 8" stroke="#86868b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
      <rect x="22" y="672" width="346" height="58" rx="29" fill={a} />
      <text x="195" y="709" textAnchor="middle" fontSize="21" fontWeight="650" fill="#fff">
        Anrufen
      </text>
    </g>
  );
}

/**
 * Geräte-Bild einer Branchenkarte (viewBox 400 × 310, unten bündig),
 * Geräte im Wechsel: 0 Laptop mit Handy davor, 1 großes Handy gedreht mit
 * Kontaktseite dahinter, 2 Monitor auf Standfuß, 3 Tablet quer mit
 * Handy davor.
 */
export function BrancheBild({
  preset,
  variante,
}: {
  preset: Preset;
  variante: 0 | 1 | 2 | 3;
}) {
  const ref = `ld-motiv-${preset.key}`;
  return (
    <svg
      viewBox="0 0 400 310"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {variante === 0 ? (
        <>
          <MotivVorlage preset={preset} id={ref} />
          <Laptop
            x={22}
            y={34}
            w={318}
            h={204}
            vb={SEITE_DESKTOP}
            inhalt={
              <MusterSeite preset={preset} format="desktop" motivRef={ref} />
            }
          />
          <Handy
            x={292}
            y={104}
            w={90}
            h={186}
            vb={SEITE_MOBIL}
            inhalt={
              <MusterSeite preset={preset} format="mobil" motivRef={ref} />
            }
          />
        </>
      ) : variante === 1 ? (
        <>
          <Handy
            x={92}
            y={34}
            w={140}
            h={290}
            vb={SEITE_MOBIL}
            inhalt={<KontaktSeite p={preset} />}
            dreh={-10}
            farbe="#2c2c2e"
          />
          <Handy
            x={178}
            y={14}
            w={150}
            h={310}
            vb={SEITE_MOBIL}
            inhalt={<MusterSeite preset={preset} format="mobil" />}
            dreh={8}
          />
        </>
      ) : variante === 3 ? (
        <>
          <MotivVorlage preset={preset} id={ref} />
          <Tablet
            x={30}
            y={40}
            w={300}
            h={206}
            vb={SEITE_DESKTOP}
            dreh={-4}
            inhalt={<MusterSeite preset={preset} format="desktop" motivRef={ref} />}
          />
          <Handy
            x={266}
            y={96}
            w={98}
            h={202}
            vb={SEITE_MOBIL}
            dreh={6}
            farbe="#2c2c2e"
            inhalt={<KontaktSeite p={preset} />}
          />
        </>
      ) : (
        <Monitor
          x={34}
          y={14}
          w={332}
          h={202}
          vb={SEITE_DESKTOP}
          inhalt={<MusterSeite preset={preset} format="desktop" />}
        />
      )}
    </svg>
  );
}

/** Endkarte „Mit Ihrem Namen.“: Handy mit leerer Musterseite, Name markiert. */
export function SkizzeBild({ preset }: { preset: Preset }) {
  return (
    <svg
      viewBox="0 0 400 310"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <Handy
        x={116}
        y={14}
        w={168}
        h={344}
        vb={SEITE_MOBIL}
        inhalt={
          <g>
            <MusterSeite
              preset={preset}
              format="mobil"
              name="Ihr Betrieb"
              leer
            />
            <rect
              x="26"
              y="50"
              width="180"
              height="44"
              rx="8"
              fill="#f45b1e"
              fillOpacity=".08"
              stroke="#f45b1e"
              strokeWidth="3"
              strokeDasharray="9 6"
            />
            <rect x="174" y="58" width="3" height="28" fill="#1d1d1f" />
          </g>
        }
      />
    </svg>
  );
}
