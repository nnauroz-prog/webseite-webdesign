/**
 * Bildband für „Der Weg.“: eine durchgehende Elbe über vier Karten
 * (Gesamtszene 1200 × 88, jede Karte zeigt ihr 300 px breites Stück).
 * Die Szene steht einmal im Markup (Karte 1); die übrigen Karten holen
 * sie per <use>. Eine Fähre liegt in jeder Karte eine Station weiter;
 * im Hintergrund Landungsbrücken, Michel, Kräne und am Ende die
 * Elbphilharmonie im Abendlicht.
 */

const W = 1200;

function Faehre({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {/* Innere Gruppe wiegt sich (CSS .weg-faehre); die äußere trägt die Position. */}
      <g className="weg-faehre">
        <ellipse
          cx="22"
          cy="66"
          rx="30"
          ry="2.2"
          fill="#fff"
          fillOpacity=".55"
        />
        <path d="M0 58h46l-5 7H5Z" fill="#1d1d1f" />
        <rect x="0" y="57" width="46" height="2.2" fill="#f45b1e" />
        <path d="M6 57V50h30l4 7Z" fill="#fff" />
        <path d="M10 46h20v4H10Z" fill="#fff" />
        <path
          d="M9 52.5h3M14 52.5h3M19 52.5h3M24 52.5h3M29 52.5h3"
          stroke="#6f7b84"
          strokeWidth="2"
        />
        <rect x="22" y="40" width="3" height="6" fill="#f45b1e" />
      </g>
    </g>
  );
}

function Anleger({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y="58" width="34" height="5" fill="#8e9499" />
      <rect x={x} y="57" width="34" height="1.5" fill="#fff" fillOpacity=".7" />
      <rect x={x + 4} y="46" width="2" height="12" fill="#6f7b84" />
      <rect x={x} y="44" width="12" height="5" rx="1" fill="#1f5f6b" />
    </g>
  );
}

export function WegSzene() {
  return (
    <g id="ld-weg-szene">
      {/* Himmel: links kühl, rechts Abendlicht */}
      <rect width={W} height="88" fill="url(#ld-weg-himmel)" />
      {/* Kräne (Hintergrund, Containerbrücken-Formen) */}
      <g fill="#6d8f98">
        <path d="M600 58V22h4v36ZM618 58V22h4v36ZM584 22h66v3h-66ZM598 14l12 8h-4l-10-6Z" />
        <path d="M680 58V28h3v30ZM694 58V28h3v30ZM668 28h52v2.5h-52Z" />
      </g>
      {/* Landungsbrücken: Halle mit Kuppeltürmen und Pegelturm */}
      <g fill="#4f727c">
        <path d="M120 58V44l3-2h96l3 2v14Z" />
        <path d="M140 42v-8h8v8ZM140 34q4-8 8 0ZM186 42v-8h8v8ZM186 34q4-8 8 0ZM206 42V22h9v20ZM205 22l5.5-9 5.5 9Z" />
      </g>
      {/* Michel */}
      <g fill="#4f727c">
        <path d="M330 58V40l8-5h20l8 5v18Z" />
        <path d="M342 58V20h12v38Z" />
        <path d="M343 20q5-12 10 0ZM347 12h2V4h-2Z" />
      </g>
      {/* Dächer der Stadt */}
      <path
        d="M0 58V52h40v-4h30v5h44v-3h8v8ZM236 58v-6h34v-5h26v6h30v5ZM380 58v-7h40v-3h36v4h44v6ZM520 58v-5h44v5ZM740 58v-6h40v-4h30v10Z"
        fill="#7d9aa2"
      />
      {/* Elbphilharmonie im Abendlicht */}
      <g>
        <path d="M1010 58V40h120v18Z" fill="#7a3f27" />
        <path
          d="M1010 40V30q8-10 18-12 14 8 26 3 12-9 26-6 14 9 26 5 10-2 24 6v14Z"
          fill="#4c6470"
        />
        <path
          d="M1016 28h108M1016 33h110M1016 37h112"
          stroke="#ffd27a"
          strokeWidth="2"
          strokeDasharray="3 4"
        />
        <path
          d="M1016 44h108M1016 50h108"
          stroke="#ffd27a"
          strokeOpacity=".6"
          strokeWidth="1.6"
          strokeDasharray="2 6"
        />
        <ellipse
          cx="1070"
          cy="34"
          rx="70"
          ry="22"
          fill="url(#ld-schein)"
          opacity=".5"
        />
      </g>
      {/* Wasser */}
      <rect y="58" width={W} height="30" fill="url(#ld-weg-wasser)" />
      <path
        d="M20 70h60M140 78h80M300 68h50M420 76h90M560 70h60M700 79h80M840 70h70M980 77h60M1100 70h70"
        stroke="#fff"
        strokeOpacity=".4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M1010 64h120M1030 70h90M1050 76h50"
        stroke="#ffd27a"
        strokeOpacity=".55"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Anleger je Station und die Fähre, die weiterfährt */}
      <Anleger x={36} />
      <Anleger x={360} />
      <Anleger x={660} />
      <Anleger x={960} />
      <Faehre x={84} />
      <Faehre x={420} />
      <Faehre x={714} />
      <Faehre x={1000} />
    </g>
  );
}

/** Zeichen je Halt: Hörer, Stift, Link, Haken (weißes Schild oben links). */
const ZEICHEN = [
  "M-4.6-5.4c.6-.6 1.6-.6 2.2 0l1.5 1.6c.5.6.5 1.4 0 2l-.8.8c.7 1.5 1.9 2.7 3.4 3.4l.8-.8c.6-.5 1.4-.5 2 0l1.6 1.5c.6.6.6 1.6 0 2.2l-.9.9C3.4 7.4.6 6.4-2 3.9-4.5 1.4-5.6-1.4-5.5-3.3Z",
  "M-5 5l1-3.6L3.4-6c.6-.6 1.5-.6 2 0l.6.6c.6.6.6 1.5 0 2L-1.4 4Z",
  "M-1.2 1.2l2.4-2.4M-2.8-.4l-1.4 1.4a2.4 2.4 0 0 0 3.4 3.4l1.4-1.4M2.8.4l1.4-1.4A2.4 2.4 0 0 0 .8-4.4L-.6-3",
  "M-4.5.2l3 3 6-6.4",
];

/**
 * Band für Karte i (0–3). Karte 0 enthält die Szene, die übrigen nutzen
 * sie. teile: in wie viele Stücke die Szene geteilt wird (Startseite 4,
 * /ablauf 6); zeichen: welches Zeichen (0 Telefon, 1 Stift, 2 Link,
 * 3 Haken) im Kreis steht.
 */
export function WegBand({
  i,
  teile = 4,
  zeichen,
}: {
  i: number;
  teile?: number;
  zeichen?: number;
}) {
  const breite = W / teile;
  const z = zeichen ?? Math.min(i, 3);
  const voll = z === 0 || z === 1;
  return (
    <svg
      viewBox={`${i * breite} 0 ${breite} 88`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      width="100%"
      height="100%"
    >
      {i === 0 ? <WegDefs /> : null}
      {i === 0 ? <WegSzene /> : <use href="#ld-weg-szene" />}
      <g transform={`translate(${i * breite + 26} 24)`}>
        <circle r="15" fill="#fff" />
        <path
          d={ZEICHEN[z] ?? ZEICHEN[3]}
          fill={voll ? "#f45b1e" : "none"}
          stroke="#f45b1e"
          strokeWidth={voll ? 0 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function WegDefs() {
  return (
    <defs>
      <linearGradient
        id="ld-weg-himmel"
        x1="0"
        y1="0"
        x2={W}
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#bcdbe3" />
        <stop offset=".4" stopColor="#d9e6e6" />
        <stop offset=".7" stopColor="#f6cfa8" />
        <stop offset="1" stopColor="#f29a62" />
      </linearGradient>
      <linearGradient
        id="ld-weg-wasser"
        x1="0"
        y1="58"
        x2="0"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#3f8796" />
        <stop offset="1" stopColor="#245866" />
      </linearGradient>
    </defs>
  );
}
