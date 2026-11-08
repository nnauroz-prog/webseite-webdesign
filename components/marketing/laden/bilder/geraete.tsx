import type { ReactNode } from "react";

/**
 * Geräte-Baukasten für die gezeichneten Bilder: Handy, Tablet, Laptop
 * (frontal) und Monitor auf Standfuß. Jedes Gerät zeichnet sich in das
 * Koordinatensystem des umgebenden SVG; der Bildschirminhalt ist ein
 * verschachteltes <svg> mit eigener viewBox (z. B. eine Musterseite in
 * 960 × 600 oder 390 × 780) und wird vom Rahmen darüber sauber in die
 * Rundung geschnitten (Rahmen als Ring mit evenodd, ohne clipPath).
 *
 * Details: Rahmen mit leichtem Verlauf, 1 px Innenlicht, Spiegelung als
 * diagonaler Weißverlauf (url(#ld-glanz), defs.tsx), Bodenschatten.
 */

/** Pfad eines gerundeten Rechtecks (für Ringe mit evenodd). */
export function rr(x: number, y: number, w: number, h: number, r: number) {
  const q = Math.min(r, w / 2, h / 2);
  return `M${x + q} ${y}H${x + w - q}A${q} ${q} 0 0 1 ${x + w} ${y + q}V${y + h - q}A${q} ${q} 0 0 1 ${x + w - q} ${y + h}H${x + q}A${q} ${q} 0 0 1 ${x} ${y + h - q}V${y + q}A${q} ${q} 0 0 1 ${x + q} ${y}Z`;
}

type Schirm = {
  /** viewBox des Bildschirminhalts */
  vb: string;
  inhalt: ReactNode;
};

/** Weicher Bodenschatten als Ellipse. */
export function Boden({
  cx,
  cy,
  rx,
  ry,
  stark = false,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  stark?: boolean;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={stark ? "url(#ld-kontakt)" : "url(#ld-boden)"}
    />
  );
}

/**
 * Handy hochkant. Maße nach dem Bauplan: Rahmen ≈ 4,7 % der Breite,
 * Radius ≈ 20 %, runder Kamerapunkt statt Insel.
 */
export function Handy({
  x,
  y,
  w,
  h,
  vb = "0 0 390 780",
  inhalt,
  dreh = 0,
  schatten = true,
  farbe = "#1d1d1f",
}: Schirm & {
  x: number;
  y: number;
  w: number;
  h: number;
  dreh?: number;
  schatten?: boolean;
  farbe?: string;
}) {
  const b = Math.max(3, w * 0.047);
  const r = w * 0.2;
  const ri = r - b;
  const cx = x + w / 2;
  return (
    <g transform={dreh ? `rotate(${dreh} ${cx} ${y + h / 2})` : undefined}>
      {schatten ? (
        <Boden cx={cx + w * 0.06} cy={y + h - 2} rx={w * 0.62} ry={w * 0.09} />
      ) : null}
      <svg
        x={x + b}
        y={y + b}
        width={w - 2 * b}
        height={h - 2 * b}
        viewBox={vb}
        preserveAspectRatio="xMidYMin slice"
      >
        {inhalt}
      </svg>
      <path
        d={rr(x + b, y + b, w - 2 * b, h - 2 * b, ri)}
        fill="url(#ld-glanz)"
      />
      {/* Rahmen als Ring: schneidet die Ecken des Bildschirms */}
      <path
        d={`${rr(x, y, w, h, r)}${rr(x + b, y + b, w - 2 * b, h - 2 * b, ri)}`}
        fill={farbe}
        fillRule="evenodd"
      />
      <path
        d={rr(x + 0.75, y + 0.75, w - 1.5, h - 1.5, r - 0.75)}
        fill="none"
        stroke="#fff"
        strokeOpacity=".22"
        strokeWidth="1.2"
      />
      {/* Tasten an der Seite */}
      <rect
        x={x - 1.6}
        y={y + h * 0.2}
        width="2"
        height={h * 0.07}
        rx="1"
        fill={farbe}
      />
      <rect
        x={x + w - 0.4}
        y={y + h * 0.26}
        width="2"
        height={h * 0.11}
        rx="1"
        fill={farbe}
      />
      <circle
        cx={cx}
        cy={y + b + w * 0.06}
        r={Math.max(2, w * 0.022)}
        fill="#3a3a3c"
      />
    </g>
  );
}

/** Tablet (hoch oder quer, je nach w/h), Rahmen ≈ 5 %, Radius 10 %. */
export function Tablet({
  x,
  y,
  w,
  h,
  vb,
  inhalt,
  dreh = 0,
  farbe = "#2c2c2e",
}: Schirm & {
  x: number;
  y: number;
  w: number;
  h: number;
  dreh?: number;
  farbe?: string;
}) {
  const b = Math.max(4, Math.min(w, h) * 0.05);
  const r = Math.min(w, h) * 0.1;
  const ri = Math.max(2, r - b);
  return (
    <g
      transform={dreh ? `rotate(${dreh} ${x + w / 2} ${y + h / 2})` : undefined}
    >
      <Boden
        cx={x + w / 2 + w * 0.05}
        cy={y + h - 2}
        rx={w * 0.6}
        ry={Math.max(6, w * 0.06)}
      />
      <svg
        x={x + b}
        y={y + b}
        width={w - 2 * b}
        height={h - 2 * b}
        viewBox={vb}
        preserveAspectRatio="xMidYMin slice"
      >
        {inhalt}
      </svg>
      <path
        d={rr(x + b, y + b, w - 2 * b, h - 2 * b, ri)}
        fill="url(#ld-glanz)"
      />
      <path
        d={`${rr(x, y, w, h, r)}${rr(x + b, y + b, w - 2 * b, h - 2 * b, ri)}`}
        fill={farbe}
        fillRule="evenodd"
      />
      <path
        d={rr(x + 0.75, y + 0.75, w - 1.5, h - 1.5, r - 0.75)}
        fill="none"
        stroke="#fff"
        strokeOpacity=".2"
        strokeWidth="1.2"
      />
    </g>
  );
}

/**
 * Laptop frontal: Deckel mit schwarzem Rand und heller Kante, darunter
 * die Grundplatte als flaches Trapez mit Mulde zum Aufklappen.
 * w = Breite des Deckels, h = Höhe des Deckels.
 */
export function Laptop({
  x,
  y,
  w,
  h,
  vb = "0 0 960 600",
  inhalt,
  dunkelGrund = false,
}: Schirm & {
  x: number;
  y: number;
  w: number;
  h: number;
  dunkelGrund?: boolean;
}) {
  const b = Math.max(4, w * 0.018);
  const oben = b * 1.35;
  const r = Math.max(6, w * 0.03);
  const ueber = w * 0.055;
  const fuss = Math.max(7, w * 0.034);
  const yb = y + h;
  return (
    <g>
      <Boden
        cx={x + w / 2}
        cy={yb + fuss}
        rx={w * 0.66}
        ry={Math.max(6, w * 0.035)}
        stark={!dunkelGrund}
      />
      {/* Deckel: Alukante, schwarzer Rand, Bildschirm */}
      <path
        d={`M${x} ${yb}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${yb}Z`}
        fill="#c7c7cc"
      />
      <path
        d={`M${x + 1.5} ${yb}V${y + r}A${r - 1.5} ${r - 1.5} 0 0 1 ${x + r} ${y + 1.5}H${x + w - r}A${r - 1.5} ${r - 1.5} 0 0 1 ${x + w - 1.5} ${y + r}V${yb}Z`}
        fill="#0b0b0c"
      />
      <svg
        x={x + b}
        y={y + oben}
        width={w - 2 * b}
        height={h - oben - b * 0.6}
        viewBox={vb}
        preserveAspectRatio="xMidYMin slice"
      >
        {inhalt}
      </svg>
      <rect
        x={x + b}
        y={y + oben}
        width={w - 2 * b}
        height={h - oben - b * 0.6}
        fill="url(#ld-glanz)"
      />
      <circle
        cx={x + w / 2}
        cy={y + oben / 2 + 0.5}
        r={Math.max(1, b * 0.18)}
        fill="#2c2c2e"
      />
      {/* Grundplatte */}
      <path
        d={`M${x - ueber} ${yb}H${x + w + ueber}V${yb + fuss * 0.55}Q${x + w + ueber} ${yb + fuss} ${x + w + ueber - fuss * 1.4} ${yb + fuss}H${x - ueber + fuss * 1.4}Q${x - ueber} ${yb + fuss} ${x - ueber} ${yb + fuss * 0.55}Z`}
        fill="url(#ld-alu)"
      />
      <rect
        x={x - ueber}
        y={yb}
        width={w + 2 * ueber}
        height="1.2"
        fill="#fff"
        fillOpacity=".8"
      />
      <path
        d={`M${x + w / 2 - w * 0.09} ${yb}H${x + w / 2 + w * 0.09}V${yb + fuss * 0.28}Q${x + w / 2 + w * 0.09} ${yb + fuss * 0.45} ${x + w / 2 + w * 0.07} ${yb + fuss * 0.45}H${x + w / 2 - w * 0.07}Q${x + w / 2 - w * 0.09} ${yb + fuss * 0.45} ${x + w / 2 - w * 0.09} ${yb + fuss * 0.28}Z`}
        fill="#a1a1a6"
        fillOpacity=".7"
      />
    </g>
  );
}

/** Monitor auf Aluminium-Standfuß; w × h ist der ganze Bildschirm samt Rand. */
export function Monitor({
  x,
  y,
  w,
  h,
  vb = "0 0 960 600",
  inhalt,
}: Schirm & { x: number; y: number; w: number; h: number }) {
  const b = Math.max(4, w * 0.02);
  const kinn = h * 0.1;
  const cx = x + w / 2;
  const halsB = w * 0.16;
  const halsH = h * 0.26;
  const yf = y + h + kinn + halsH;
  return (
    <g>
      <Boden
        cx={cx}
        cy={yf + 5}
        rx={w * 0.38}
        ry={Math.max(5, w * 0.03)}
        stark
      />
      {/* Hals und Fuß */}
      <path
        d={`M${cx - halsB / 2} ${y + h}H${cx + halsB / 2}L${cx + halsB * 0.42} ${yf}H${cx - halsB * 0.42}Z`}
        fill="url(#ld-alu-quer)"
      />
      <path
        d={`M${cx - halsB / 2} ${y + h}H${cx + halsB / 2}V${y + h + 10}H${cx - halsB / 2}Z`}
        fill="#000"
        fillOpacity=".12"
      />
      <path d={rr(cx - w * 0.17, yf - 2, w * 0.34, 9, 3)} fill="url(#ld-alu)" />
      {/* Gehäuse: oben Bildschirm mit schwarzem Rand, unten Kinn in Alu */}
      <path
        d={rr(x, y, w, h + kinn, Math.max(6, w * 0.022))}
        fill="url(#ld-alu-quer)"
      />
      <path
        d={`M${x} ${y + Math.max(6, w * 0.022)}A${Math.max(6, w * 0.022)} ${Math.max(6, w * 0.022)} 0 0 1 ${x + Math.max(6, w * 0.022)} ${y}H${x + w - Math.max(6, w * 0.022)}A${Math.max(6, w * 0.022)} ${Math.max(6, w * 0.022)} 0 0 1 ${x + w} ${y + Math.max(6, w * 0.022)}V${y + h}H${x}Z`}
        fill="#0b0b0c"
      />
      <svg
        x={x + b}
        y={y + b}
        width={w - 2 * b}
        height={h - 2 * b}
        viewBox={vb}
        preserveAspectRatio="xMidYMin slice"
      >
        {inhalt}
      </svg>
      <rect
        x={x + b}
        y={y + b}
        width={w - 2 * b}
        height={h - 2 * b}
        fill="url(#ld-glanz)"
      />
      <rect
        x={x}
        y={y + h + kinn - 1.5}
        width={w}
        height="1.5"
        fill="#000"
        fillOpacity=".12"
      />
    </g>
  );
}
