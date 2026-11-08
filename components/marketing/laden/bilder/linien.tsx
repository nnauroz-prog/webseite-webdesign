import type { ReactNode } from "react";

/**
 * Linienzeichnungen im Hafen-Duktus: ein Strich (1,75 px bei 48er
 * viewBox, skaliert nicht mit), Farbe aus currentColor (#1d1d1f), je
 * Motiv genau ein Akzent in Orange (.la, Farbe über --linie-akzent).
 * Keine Verläufe, kein Hintergrundkasten, keine nachgemachten
 * Bedienelemente. Für die Bildreihe (48 px) und die Karten „Der
 * Unterschied“ (40 px). Rein dekorativ: aria-hidden.
 */
function Linie({ children, groesse = 48 }: { children: ReactNode; groesse?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={groesse}
      height={groesse}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-linie=""
    >
      {children}
    </svg>
  );
}

const A = { stroke: "var(--linie-akzent, #f45b1e)" } as const;
const AF = { fill: "var(--linie-akzent, #f45b1e)", stroke: "none" } as const;

/** Container mit Rippen (x, y = linke obere Ecke). */
function Box({ x, y, w, h, akzent = false }: { x: number; y: number; w: number; h: number; akzent?: boolean }) {
  const rippen: string[] = [];
  const n = Math.max(2, Math.round(w / 5) - 1);
  for (let i = 1; i <= n; i++) {
    const rx = x + (w / (n + 1)) * i;
    rippen.push(`M${rx.toFixed(1)} ${y + 3}v${h - 6}`);
  }
  return (
    <g style={akzent ? A : undefined}>
      <rect x={x} y={y} width={w} height={h} rx="1.2" />
      <path d={rippen.join("")} strokeWidth="1" opacity=".55" />
    </g>
  );
}

/* ---------- Bildreihe ---------- */

/** Starter: ein Container auf dem Kai. */
export function LinieStarter() {
  return (
    <Linie>
      <path d="M5 38h38" />
      <Box x={10} y={21} w={28} h={15} />
      <rect x="29" y="25" width="5" height="3" rx=".5" style={AF} />
    </Linie>
  );
}

/** Business: drei Container, gestapelt. */
export function LinieBusiness() {
  return (
    <Linie>
      <path d="M4 40h40" />
      <Box x={6} y={27} w={18} h={11} />
      <Box x={24} y={27} w={18} h={11} />
      <Box x={15} y={14} w={18} h={11} akzent />
    </Linie>
  );
}

/** Premium: Container mit Stift (selbst pflegen). */
export function LiniePremium() {
  return (
    <Linie>
      <path d="M4 40h40" />
      <Box x={6} y={24} w={24} h={14} />
      <path d="M33 33l9-19 3 1.4-9 19-3.6 1.6z" />
      <path d="M33 33l-.6 3.6" style={A} />
      <path d="M40.2 17.6l3 1.4" />
    </Linie>
  );
}

/** Studio: Kran mit Haken und Last (neues Erscheinungsbild). */
export function LinieStudio() {
  return (
    <Linie>
      <path d="M4 42h40" />
      <path d="M14 42V9M18 42V9M14 9h4" />
      <path d="M14 42l4-6-4-6 4-6-4-6 4-6" strokeWidth="1" opacity=".6" />
      <path d="M8 9h36M16 4v5M16 4L8 9M16 4l26 5" />
      <path d="M36 9v14" />
      <path d="M36 23c0 2-2.5 2-2.5 0" />
      <rect x="30" y="27" width="12" height="7" rx="1" style={A} />
    </Linie>
  );
}

/** Wartung: Schraubenschlüssel am Poller. */
export function LinieWartung() {
  return (
    <Linie>
      <path d="M4 42h40" />
      <path d="M11 42V30c0-2 2-3 5-3s5 1 5 3v12M10 30h12M13 24c0-1.6 1.4-2.4 3-2.4s3 .8 3 2.4v3" />
      <g transform="translate(22 8) scale(1.05)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"
        />
      </g>
      <circle cx="26" cy="29" r="1.4" style={AF} />
    </Linie>
  );
}

/** Branchen: Speicherstadt-Giebel mit Fenstern. */
export function LinieBranchen() {
  return (
    <Linie>
      <path d="M4 42h40" />
      <path d="M10 42V22h3v-4h3v-4h3v-4h10v4h3v4h3v4h3v20" />
      <path d="M17 26v4M22 26v4M26 26v4M31 26v4M17 34v4M31 34v4" />
      <path d="M21.5 42v-8h5v8" />
      <path d="M22 18h4" style={A} />
    </Linie>
  );
}

/** Werkzeuge: Peilkompass. */
export function LinieWerkzeuge() {
  return (
    <Linie>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 8v3M24 37v3M8 24h3M37 24h3" strokeWidth="1.25" />
      <path d="M24 24l5-11-5 4z" style={{ ...AF }} />
      <path d="M24 24l-5 11 5-4z" />
      <circle cx="24" cy="24" r="1.4" />
    </Linie>
  );
}

/** Anfrage: Signalflagge am Mast. */
export function LinieAnfrage() {
  return (
    <Linie>
      <path d="M4 42h40" />
      <path d="M13 42V6" />
      <path d="M13 8h22v14H13" />
      <path d="M13 8l22 14" style={A} />
      <path d="M9 42h8" />
    </Linie>
  );
}

/* ---------- Der Unterschied (40 px) ---------- */

/** Gestaltet: Pinsel über einem Container. */
export function LiniePinsel() {
  return (
    <Linie groesse={40}>
      <Box x={5} y={26} w={26} h={14} />
      <path d="M34 6l7 7-9.5 9.5-7-7z" />
      <path d="M24.5 15.5l-4 4c-1.6 1.6-1.6 4 0 5.6" style={A} />
      <path d="M37.5 9.5l-2 2" strokeWidth="1.25" />
    </Linie>
  );
}

/** Hosting und Pflege: Containerstapel als Server. */
export function LinieStapel() {
  return (
    <Linie groesse={40}>
      <Box x={8} y={8} w={32} h={9} />
      <Box x={8} y={19} w={32} h={9} />
      <Box x={8} y={30} w={32} h={9} />
      <circle cx="35" cy="34.5" r="1.4" style={AF} />
    </Linie>
  );
}

/** Texte: Stahlfeder. */
export function LinieFeder() {
  return (
    <Linie groesse={40}>
      <path d="M24 4l9 14-9 22-9-22z" />
      <path d="M24 40V24" />
      <circle cx="24" cy="21" r="2.4" style={A} />
      <path d="M17 18h14" strokeWidth="1.25" />
    </Linie>
  );
}

/** Anfragen: Signalflagge. */
export function LinieFlagge() {
  return (
    <Linie groesse={40}>
      <path d="M12 44V5" />
      <path d="M12 7h24l-6 8 6 8H12" />
      <path d="M12 15h18" style={A} />
    </Linie>
  );
}

/** Bei Google: Peilkompass. */
export function LinieKompass() {
  return (
    <Linie groesse={40}>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 7v3M24 38v3M7 24h3M38 24h3" strokeWidth="1.25" />
      <path d="M24 24l6-12-6 4.5z" style={AF} />
      <path d="M24 24l-6 12 6-4.5z" />
    </Linie>
  );
}

/** Selbst pflegen: Logbuch mit Lesezeichen. */
export function LinieLogbuch() {
  return (
    <Linie groesse={40}>
      <path d="M10 8h24a2 2 0 0 1 2 2v30H12a2 2 0 0 1-2-2z" />
      <path d="M10 36a2 2 0 0 1 2-2h24" />
      <path d="M16 16h13M16 21h13M16 26h8" strokeWidth="1.25" />
      <path d="M30 8v9l2.5-2 2.5 2V8" style={A} />
    </Linie>
  );
}

/** Direkt mit uns: Hörer. */
export function LinieHoerer() {
  return (
    <Linie groesse={40}>
      <path d="M14 7l5 1.5 2 8-4 3c2 4.5 5.5 8 10 10l3-4 8 2 1.5 5c-1 3-4 5-7 4.5C21 35 13 27 11 16c-.5-3 1.5-6.5 3-9z" />
      <path d="M28 8c5 1 9 5 10 10" style={A} />
      <path d="M28 14c2 .6 3.6 2.2 4.2 4.2" strokeWidth="1.25" />
    </Linie>
  );
}
