/**
 * Kopfbild der Startseite: Blick von Steinwerder über die Elbe.
 *
 * Rechts eine Containerbrücke in Signal-Orange am Kai, links davon ein
 * Containerschiff in Heckansicht („SITALO / HAMBURG“). Am Horizont
 * Hamburg im Dunst, von West nach Ost so, wie man es vom Südufer sieht:
 * Tanzende Türme, Landungsbrücken mit Pegelturm, Heinrich-Hertz-Turm,
 * Michel, Elbphilharmonie.
 *
 * Die Zeichnung ist eine Bühne: Server-Markup im Startzustand der
 * Zeitleiste (hero-zeitleiste.ts), bewegt wird sie im Browser von
 * hero-buehne.tsx über die data-kb-Haken. Ohne JavaScript und bei
 * reduzierter Bewegung bleibt ein ruhiges, vollständiges Bild stehen.
 *
 * Ebenen: Himmel nach Tageszeit (hafen-hero.tsx, hinter allem), Szene,
 * darüber Lichter und Beschriftungen. Zur Tageszeit wechseln nur Stadt,
 * Wasser und Himmel ihre Farbe.
 *
 * Koordinaten: viewBox "-160 0 960 760", Wasserlinie bei y = 640.
 */

import type { CSSProperties } from "react";

import { getPaketBySlug } from "@/lib/pakete-data";

import s from "./hero.module.css";
import {
  BOX_B,
  FARBEN,
  KAI_SPALTEN,
  LADEPLAETZE,
  LADUNG,
  PLATZ_OBEN,
  SEIL_OBEN,
  dunkel,
  lageY,
  stapelX,
  zyklus,
  type Farbe,
} from "./hero-zeitleiste";

const SKY_LINE = 640;

/* Feste Zufallsfolge, damit Server und Browser dasselbe Bild zeichnen. */
function seeded(seed: number) {
  let v = seed;
  return () => {
    v = (v * 16807) % 2147483647;
    return v / 2147483647;
  };
}

/* Niedrige Dächer der Stadt im Dunst, westlich der Wahrzeichen. Unten
   reichen sie bis unter den Horizont, damit beim Parallax-Absinken keine
   Lücke entsteht. */
const ROOFS = (() => {
  const rnd = seeded(7);
  let d = "";
  const unten = SKY_LINE + 30;
  for (let x = -1500; x < 110; ) {
    const w = 8 + Math.round(rnd() * 16);
    const h = 3 + Math.round(rnd() * 9);
    const kind = Math.floor(rnd() * 3);
    const t = SKY_LINE - h;
    if (kind === 0) d += `M${x} ${unten}V${t}H${x + w}V${unten}Z`;
    else if (kind === 1) d += `M${x} ${unten}V${t}L${x + w / 2} ${t - 4}L${x + w} ${t}V${unten}Z`;
    else d += `M${x} ${unten}V${t + 2}L${x + 2} ${t}H${x + w - 2}L${x + w} ${t + 2}V${unten}Z`;
    x += w + Math.round(rnd() * 3);
  }
  return d;
})();

/* Wahrzeichen als Silhouetten (eine Farbe, etwas dunkler als die Dächer). */
const LANDMARKS = [
  // Tanzende Türme: zwei geknickte Hochhäuser am Ende der Reeperbahn
  "M-292 670L-289 614L-294 590H-277L-272 614L-275 670Z",
  "M-270 670L-268 622L-264 604H-251L-254 622L-257 670Z",
  // Landungsbrücken: lange Halle mit zwei Kuppeltürmen und dem Pegelturm
  "M-236 670V628L-232 625H-150L-146 628V670Z",
  "M-221 625V616H-214V625Z M-221 616Q-217.5 607 -214 616Z M-218 609h1v-6h-1Z",
  "M-188 625V616H-181V625Z M-188 616Q-184.5 607 -181 616Z M-185 609h1v-6h-1Z",
  "M-166 625V596H-157V625Z M-167 596L-161.5 586L-156 596Z M-162 587h1v-6h-1Z",
  // Heinrich-Hertz-Turm: schlanker Schaft, zwei Kanzeln, Antennenmast
  "M-75.8 670L-72.6 566H-68.4L-65.2 670Z",
  "M-78 566H-63V559H-78Z M-76 559H-65V552H-76Z M-77.5 549H-63.5V546H-77.5Z",
  "M-71.2 552V514H-69.8V552Z",
  // Michel: Kirchenschiff, Turmschaft, Glockengeschoss, Haube, Laterne, Spitze
  "M-60 670V617L-48 609H-22L-10 617V670Z",
  "M-42 670V590H-28V670Z",
  "M-40.5 590V576H-29.5V590Z M-42 591h17v-2h-17Z",
  "M-40.5 576Q-35 563 -29.5 576Z",
  "M-37 570V562H-33V570Z",
  "M-36.2 562L-35 548L-33.8 562Z",
  // Elbphilharmonie: Backstein-Speicher, darauf der Glasbau mit Wellendach
  "M-12 670V606H96V670Z",
  "M-12 606V588Q-8 580 -2 571Q8 586 22 581Q32 572 44 574Q56 586 68 583Q78 578 86 584Q92 586 96 592V606Z",
];

/* Fenster, die nachts leuchten: Glasbau der Elbphilharmonie, Speicher,
   Landungsbrücken, Tanzende Türme, verstreut in der Stadt. */
const FENSTER = (() => {
  const rnd = seeded(23);
  const f: { x: number; y: number; w: number; o: number; spaet?: boolean }[] = [];
  // Elbphilharmonie: Glasbau (unter dem Wellendach), unregelmäßig hell
  for (let row = 0; row < 3; row++) {
    for (let x = -9; x < 93; x += 4.2) {
      if (rnd() < 0.42) continue;
      f.push({ x, y: 592 + row * 4.6, w: 2.4, o: 0.55 + rnd() * 0.45 });
    }
  }
  // Speicher: kleine Fenster, nur wenige erleuchtet
  for (let row = 0; row < 4; row++) {
    for (let x = -8; x < 92; x += 6) {
      if (rnd() < 0.78) continue;
      f.push({ x, y: 612 + row * 6, w: 1.6, o: 0.5 + rnd() * 0.3 });
    }
  }
  // Landungsbrücken: durchgehende Fensterreihe der Halle
  for (let x = -232; x < -150; x += 4) f.push({ x, y: 631, w: 2.2, o: 0.8 });
  // Tanzende Türme
  for (let i = 0; i < 9; i++) f.push({ x: -290 + rnd() * 12, y: 596 + rnd() * 34, w: 1.6, o: 0.7 });
  for (let i = 0; i < 6; i++) f.push({ x: -266 + rnd() * 9, y: 608 + rnd() * 24, w: 1.6, o: 0.7 });
  // Dächer
  for (let x = -1480; x < 100; x += 9 + rnd() * 26) {
    if (x > -300 && x < 100 && rnd() < 0.6) continue;
    f.push({ x, y: 632 + rnd() * 5, w: 1.6, o: 0.35 + rnd() * 0.4 });
  }
  // Abends brennt erst gut die Hälfte, die übrigen gehen nachts an.
  for (const fe of f) fe.spaet = rnd() < 0.45;
  return f;
})();

/* Fenster als wenige Pfade statt einzelner Rechtecke, gruppiert nach
   „spät“ und Helligkeit (auf 0,1 gerundet). Sieht gleich aus, spart aber
   rund 150 Knoten, die der Browser sonst beim Hydrieren abgleicht. */
const FENSTER_PFADE = (() => {
  const gruppen = new Map<string, { spaet: boolean; o: number; d: string }>();
  for (const f of FENSTER) {
    const o = Math.round(f.o * 10) / 10;
    const key = `${f.spaet ? "s" : "f"}${o}`;
    let g = gruppen.get(key);
    if (!g) {
      g = { spaet: !!f.spaet, o, d: "" };
      gruppen.set(key, g);
    }
    g.d += `M${f.x.toFixed(1)} ${f.y.toFixed(1)}h${f.w}v1.6h-${f.w}z`;
  }
  return Array.from(gruppen, ([key, g]) => ({ key, ...g }));
})();

/* Fachwerk im Ausleger, Lüftungsschlitze im Maschinenhaus. */
const LATTICE = (() => {
  let d = "M103 256";
  for (let i = 0, x = 103; x < 790; i++) {
    x += 16;
    d += `L${x} ${i % 2 ? 256 : 274}`;
  }
  return d;
})();
const LOUVER = (() => {
  let d = "";
  for (let x = 692; x < 792; x += 7) d += `M${x} 221V244`;
  return d;
})();

/* Ladung des Schiffs. Stapel 0 bis 4 sind voll, auf Stapel 5 bis 8 ist
   oben je ein Platz frei: dort setzt die Brücke im Zyklus ab. */
const STACKS: Farbe[][] = [
  ["z", "r", "g"],
  ["g", "w", "t"],
  ["r", "o", "z"],
  ["t", "w", "r"],
  ["w", "g", "z"],
  ["o", "z"],
  ["g", "t"],
  ["z", "r"],
  ["t", "g"],
];
const CARGO = STACKS.flatMap((stack, ci) =>
  stack.map((c, ti) => ({ key: `${ci}-${ti}`, x: stapelX(ci), y: lageY(ti), c })),
);

/* Elbe: Wellenstriche mit unterschiedlicher Länge und Geschwindigkeit. */
const WAVES = Array.from({ length: 10 }, (_, r) => ({
  y: 649 + r * 12 + (r % 2 ? 2 : 0),
  dash: `${8 + ((r * 7) % 5) * 5} ${36 + ((r * 11) % 4) * 12}`,
  offset: r * 37,
  opacity: (0.24 - r * 0.016).toFixed(3),
  duration: `${26 + r * 6}s`,
}));
/* Gebrochene Spiegelung des Rumpfs. */
const REFLECTION: [number, string, number, number][] = [
  [645, "34 5", 0.5, 2.4],
  [650, "24 9", 0.38, 2],
  [656, "14 13", 0.27, 1.8],
  [663, "8 18", 0.18, 1.6],
  [671, "4 24", 0.11, 1.4],
];
/* Spiegelung der Ladung: unter dem Rumpf in den Farben der Stapel, nach
   unten immer stärker zerrissen. */
const LADUNG_SPIEGEL = STACKS.flatMap((stack, ci) =>
  [0, 1, 2].map((r) => ({
    key: `${ci}-${r}`,
    x: stapelX(ci) + 3,
    y: 679 + r * 8 + (ci % 2) * 1.5,
    w: 40 - r * 6,
    dash: ["18 4 9 6", "9 7 5 10", "4 9 3 14"][r],
    off: (ci * 7 + r * 5) % 13,
    c: FARBEN[stack[Math.min(r, stack.length - 1)]],
    o: [0.26, 0.17, 0.1][r],
  })),
);
/* Lichtreflexe auf dem Wasser, die langsam auf- und abblenden. */
const FUNKELN = (() => {
  const rnd = seeded(41);
  return Array.from({ length: 18 }, (_, i) => {
    const y = 650 + rnd() * 104;
    return {
      key: i,
      x: -150 + rnd() * 700,
      y,
      w: 5 + rnd() * 12 * (1 - (y - 650) / 200),
      dur: (5.5 + rnd() * 5).toFixed(2),
      delay: (-rnd() * 10).toFixed(2),
    };
  });
})();

/* Beschriftungen der abgesetzten Container. Die Seriennummer ist der
   Einstiegspreis und zählt hoch; als Eigentümerkennung steht der
   Markenname statt eines (womöglich vergebenen) ISO-Präfixes. */
const STARTER = getPaketBySlug("starter")?.setup ?? "ab 499\u00A0€";
const SCHILDER = [
  { serie: "000499", text: `Festpreis vorab · ${STARTER}` },
  { serie: "000500", text: "Test-Link vor dem Start" },
  { serie: "000501", text: "Texte aus Ihren Stichpunkten" },
  { serie: "000502", text: "Kleine Seiten oft in 1–2 Werktagen" },
];

/* Lage der Beschriftung: rechts oben neben dem Container, Hinweislinie
   zur Ecke. Prozentwerte der viewBox (-160 0 960 760). */
const SCHILD_ABSTAND = 16;
const SCHILD_UNTEN = 406;
const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

type BoxProps = {
  x: number;
  y: number;
  c: Farbe;
  kb?: string;
  hidden?: boolean;
  className?: string;
  marke?: boolean;
};

function Box({ x, y, c, kb, hidden, className, marke }: BoxProps) {
  const dark = dunkel(c);
  return (
    <g
      transform={`translate(${x} ${y})`}
      data-kb={kb}
      className={className}
      color={dark ? "#fff" : "#000"}
      visibility={hidden ? "hidden" : undefined}
    >
      <rect width={BOX_B} height="49" fill={FARBEN[c]} data-kb-farbe="" />
      <rect x="2" y="2" width="42" height="45" fill="none" stroke="currentColor" strokeOpacity={dark ? 0.15 : 0.2} />
      <path
        d="M23 3V46M9 6V43M16 6V43M30 6V43M37 6V43"
        stroke="currentColor"
        strokeOpacity={dark ? 0.23 : 0.24}
        strokeWidth="1.1"
      />
      <path d="M0 0h5v4H0zM41 0h5v4h-5zM0 45h5v4H0zM41 45h5v4h-5z" fill="#000" fillOpacity=".35" />
      {marke ? <rect x="27" y="7" width="13" height="3" fill="#F45B1E" /> : null}
    </g>
  );
}

export function Containerbruecke({ hub = 0 }: { hub?: number }) {
  const z = zyklus(hub);
  const st = z.zustand(z.T0);
  const lift = hub ? `translate(0 ${-hub})` : undefined;
  const lastFarbe: Farbe = LADUNG[Math.max(0, st.last)];

  return (
    <div className={s.art} data-kb="art" data-hub={hub} aria-hidden="true">
      {/* ---------------- Szene ---------------- */}
      <svg className={s.szene} viewBox="-160 0 960 760" preserveAspectRatio="xMaxYMax meet" focusable="false">
        <defs>
          <clipPath id="kb-wasser">
            <rect x="-1800" y="641" width="2390" height="160" />
          </clipPath>
        </defs>

        {/* Stadt im Dunst (Parallax: fern) */}
        <g data-kb="fern">
          <path className={s.dach} d={ROOFS} />
          <g className={s.wahrzeichen}>
            {LANDMARKS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          {/* Glasfuge der Elbphilharmonie über dem Speicher */}
          <path d="M-12 606H96" stroke="#EEEEEB" strokeOpacity=".7" strokeWidth="1.2" />

          {/* Hafenfähre (Linie 72/62): legt an der Elbphilharmonie ab,
              hält an den Landungsbrücken, läuft weiter nach Westen. */}
          <g transform={`translate(70 ${SKY_LINE})`}>
            <g className={s.faehre}>
              <path className={s.kielwasser} d="M23 -0.8H62" stroke="#F7F7F5" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M-1 -3.6H25L23.4 -0.4H1.4Z" fill="#9EA29F" />
              <rect x="3" y="-7.4" width="17" height="3.9" fill="#E3E4E0" />
              <path d="M4.2 -6.2H18.8" stroke="#8F9390" strokeWidth="1" strokeDasharray="1.6 1" />
              <rect x="5" y="-10" width="6" height="2.7" fill="#D6D8D4" />
              <path d="M8 -10V-13.4" stroke="#9EA29F" strokeWidth=".6" />
            </g>
          </g>
        </g>

        {/* Elbe und Schiff, mit dem Pegel gehoben oder gesenkt */}
        <g transform={lift}>
          {/* Schiff, Heckansicht */}
          <g data-kb="schiff">
            <path d="M110 590H570L563 630Q556 652 520 660H160Q124 652 117 630Z" fill="#1B1D1E" />
            <rect x="114" y="584" width="452" height="6" fill="#26292B" />
            <path d="M118 630H562L560 640H120Z" fill="#A8382A" />
            <text
              x="340"
              y="612"
              textAnchor="middle"
              fill="#EEEEEB"
              fontSize="12.5"
              letterSpacing="3.5"
              style={{ fontFamily: "var(--font-brand-sans)", fontStretch: "125%", fontWeight: 760 }}
            >
              SITALO
            </text>
            <text
              x="340"
              y="624"
              textAnchor="middle"
              fill="#EEEEEB"
              fillOpacity=".72"
              fontSize="7"
              letterSpacing="2.4"
              style={{ fontFamily: "var(--font-brand-mono)" }}
            >
              HAMBURG
            </text>
            {CARGO.map((b) => (
              <Box key={b.key} x={b.x} y={b.y} c={b.c} />
            ))}
            {LADEPLAETZE.map((x, k) => (
              <Box
                key={x}
                x={x}
                y={PLATZ_OBEN}
                c={LADUNG[k]}
                kb="platz"
                className={s.platz}
                hidden={k >= st.geladen}
                marke={k === 0}
              />
            ))}
          </g>

          {/* Schlepper, nur beim Ab- und Anlegen längsseits */}
          <g data-kb="schlepper" className={s.schlepper} transform={`translate(52 ${SKY_LINE})`} opacity="0" visibility="hidden">
            <path d="M-46 -6H-4L1 -13H3V2H-44Z" fill="#26292B" />
            <path d="M-45 -3.4H1.6" stroke="#A8382A" strokeWidth="1.6" />
            <rect x="-1" y="-13.5" width="4.6" height="14" fill="#0F1011" />
            <rect x="-33" y="-14" width="19" height="8" fill="#E4E5E1" />
            <rect x="-29" y="-22" width="12" height="8" fill="#E4E5E1" />
            <path d="M-28 -18.6H-18" stroke="#26292B" strokeWidth="2" />
            <rect x="-38.5" y="-18" width="3.6" height="12" fill="#3A3E40" />
            <path d="M-23 -22V-31M-26 -28H-20" stroke="#26292B" strokeWidth=".9" />
          </g>

          {/* Wasser */}
          <rect className={s.wasser} x="-1800" y={SKY_LINE} width="2400" height="160" />

          {/* Spiegelung von Rumpf und Ladung, bewegt sich mit dem Schiff */}
          <g data-kb="schiff" fill="none">
            {REFLECTION.map(([y, dash, op, sw], i) => (
              <line
                key={y}
                x1="122"
                y1={y}
                x2="558"
                y2={y}
                stroke="#1B1D1E"
                strokeDasharray={dash}
                strokeOpacity={op}
                strokeWidth={sw}
                strokeDashoffset={i * 9}
              />
            ))}
            {LADUNG_SPIEGEL.map((r) => (
              <line
                key={r.key}
                x1={r.x}
                y1={r.y}
                x2={r.x + r.w}
                y2={r.y}
                stroke={r.c}
                strokeOpacity={r.o}
                strokeWidth="2"
                strokeDasharray={r.dash}
                strokeDashoffset={r.off}
              />
            ))}
          </g>

          {/* Vordergrund-Wasser (Parallax: nah) */}
          <g clipPath="url(#kb-wasser)">
            <g data-kb="nah">
              <g fill="none" stroke="#1B1D1E">
                {WAVES.map((w) => (
                  <line
                    key={w.y}
                    className={s.welle}
                    x1="-1800"
                    y1={w.y}
                    x2="588"
                    y2={w.y}
                    strokeOpacity={w.opacity}
                    strokeWidth="1.1"
                    strokeDasharray={w.dash}
                    strokeDashoffset={w.offset}
                    style={{ animationDuration: w.duration }}
                  />
                ))}
              </g>
              {/* Gebrochene Spiegelung des Auslegers, weit vorn im Wasser */}
              <g fill="none" stroke="#F45B1E" strokeWidth="2">
                <line className={s.welle} x1="100" y1="744" x2="586" y2="744" strokeDasharray="30 9 12 16" strokeOpacity=".2" style={{ animationDuration: "48s" }} />
                <line className={s.welle} x1="104" y1="751" x2="586" y2="751" strokeDasharray="14 14 6 22" strokeOpacity=".13" strokeDashoffset="11" style={{ animationDuration: "58s" }} />
              </g>
              {/* Lichtreflexe */}
              <g stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round">
                {FUNKELN.map((f) => (
                  <line
                    key={f.key}
                    className={s.funkeln}
                    x1={f.x.toFixed(1)}
                    y1={f.y.toFixed(1)}
                    x2={(f.x + f.w).toFixed(1)}
                    y2={f.y.toFixed(1)}
                    style={{ animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
                  />
                ))}
              </g>
            </g>
          </g>
          <line x1="-1800" y1="640.5" x2="590" y2="640.5" stroke="#1B1D1E" strokeOpacity=".38" />
        </g>

        {/* Kai: Spundwand mit Fugen, Fender, Poller */}
        <rect x="588" y="605" width="320" height="175" fill="#2A2E30" />
        <rect x="588" y="605" width="320" height="5" fill="#5A5F61" />
        <path d="M588 628H908M588 652H908M588 676H908M588 700H908" stroke="#1B1D1E" strokeOpacity=".55" />
        <path d="M640 610V780M700 610V780M760 610V780M820 610V780" stroke="#1B1D1E" strokeOpacity=".3" />
        <path d="M582 614h7v24h-7z M582 650h7v24h-7z M582 686h7v24h-7z" fill="#0F1011" />
        <path d="M596 605v-6q0-3 3-3h3q3 0 3 3v6z" fill="#1B1D1E" />
        {/* Festmacherleine vom Heck zum Poller */}
        <path
          data-kb="leine"
          d={`M566 ${593 - hub}Q585 ${606 - hub} 601 600`}
          fill="none"
          stroke="#1B1D1E"
          strokeWidth="1.3"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={(1 - st.leine).toFixed(3)}
        />

        {/* Kaistapel unter dem Portal. Vorn in jeder Reihe der nächste
            Container; was die Brücke wegnimmt, gibt den Blick auf den
            dahinter frei. */}
        <Box x={KAI_SPALTEN[1]} y={556} c="z" />
        <Box x={KAI_SPALTEN[0]} y={556} c="r" />
        <Box x={KAI_SPALTEN[1]} y={507} c={LADUNG[st.kai[1]]} kb="kai-l" />
        <Box x={KAI_SPALTEN[0]} y={507} c={LADUNG[st.kai[0]]} kb="kai-r" />

        {/* Containerbrücke */}
        <g fill="#F45B1E">
          <rect x="684" y="212" width="112" height="38" fill="#F7F7F5" />
          <path d={LOUVER} stroke="#1B1D1E" strokeOpacity=".32" strokeWidth="1.2" />
          <rect x="684" y="212" width="112" height="4" fill="#1B1D1E" fillOpacity=".85" />
          <rect x="612" y="280" width="14" height="318" />
          <rect x="752" y="280" width="14" height="318" />
          <rect x="612" y="298" width="154" height="13" />
          <rect x="626" y="466" width="126" height="7" />
          <path d="M626 311L689 352L752 311" fill="none" stroke="#F45B1E" strokeWidth="5" />
          <rect x="603" y="596" width="32" height="9" fill="#1B1D1E" />
          <rect x="743" y="596" width="32" height="9" fill="#1B1D1E" />
          <rect x="98" y="250" width="702" height="6" />
          <rect x="98" y="274" width="702" height="6" />
          <rect x="794" y="250" width="6" height="30" />
          <rect x="96" y="250" width="7" height="30" />
          <path d={LATTICE} fill="none" stroke="#F45B1E" strokeWidth="2.6" />
          <path d="M612 250H626L671 100H661Z M752 250H766L679 100H669Z" />
          <rect x="638" y="176" width="84" height="6" />
          <rect x="656" y="88" width="28" height="14" rx="1.5" />
          <path d="M668 96L380 250M668 96L112 250M672 96L797 250" fill="none" stroke="#F45B1E" strokeWidth="2.4" />
        </g>
        <circle className={s.blink} cx="670" cy="82" r="3.4" fill="#E02A1B" />

        {/* Laufkatze mit Führerhaus, Seilen, Spreader und Last */}
        <g data-kb="katze" transform={`translate(${st.katze.toFixed(2)} 0)`}>
          <rect x="-24" y="280" width="48" height="12" fill="#1B1D1E" />
          <rect x="-50" y="282" width="24" height="22" fill="#26292B" />
          <rect x="-47" y="286" width="18" height="8" fill="#EEEEEB" fillOpacity=".85" />
          <g data-kb="pendel">
            <line data-kb="seil" x1="-14" y1={SEIL_OBEN} x2="-14" y2={st.haken - 8} stroke="#1B1D1E" strokeWidth="1.3" />
            <line data-kb="seil" x1="14" y1={SEIL_OBEN} x2="14" y2={st.haken - 8} stroke="#1B1D1E" strokeWidth="1.3" />
            <g data-kb="spreader" transform={`translate(0 ${st.haken})`}>
              <rect x="-30" y="-8" width="60" height="8" fill="#1B1D1E" />
              <rect x="-30" y="-8" width="60" height="2" fill="#F45B1E" />
              <Box x={-BOX_B / 2} y={0} c={lastFarbe} kb="last" className={s.last} hidden={st.last < 0} />
            </g>
          </g>
        </g>

        {/* Hinweislinien zu den Beschriftungen */}
        <g transform={lift}>
          {LADEPLAETZE.map((x, k) => (
            <g key={x} data-kb="leader" data-on={k === st.schild ? "1" : "0"} className={s.leader}>
              <path
                d={`M${x - SCHILD_ABSTAND} ${SCHILD_UNTEN}L${x + 2} ${PLATZ_OBEN + 3}`}
                fill="none"
                stroke="#1B1D1E"
                strokeWidth="1"
                pathLength={1}
              />
              <circle cx={x + 2} cy={PLATZ_OBEN + 3} r="2.2" fill="#1B1D1E" />
            </g>
          ))}
        </g>
      </svg>

      {/* ---------------- Lichter (nachts und abends sichtbar) ---------------- */}
      <svg className={s.lichter} viewBox="-160 0 960 760" preserveAspectRatio="xMaxYMax meet" focusable="false">
        <defs>
          <linearGradient id="kb-kegel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF4DC" stopOpacity=".55" />
            <stop offset="1" stopColor="#FFF4DC" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="kb-schein">
            <stop offset="0" stopColor="#FFE7B8" stopOpacity=".9" />
            <stop offset="1" stopColor="#FFE7B8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g data-kb="fern">
          <g fill="#FFD48A">
            {FENSTER_PFADE.map((g) => (
              <path
                key={g.key}
                className={g.spaet ? `${s.fenster} ${s.spaet}` : s.fenster}
                d={g.d}
                style={{ "--o": g.o.toFixed(1) } as CSSProperties}
              />
            ))}
          </g>
          {/* Michel-Uhr, Flugwarnlichter am Fernsehturm */}
          <circle cx="-35" cy="583" r="1.7" fill="#FFE2A6" />
          <circle cx="-70.5" cy="515" r="1.3" fill="#FF4A3A" />
          <circle cx="-70.5" cy="548" r="1" fill="#FF4A3A" />
        </g>
        <g transform={lift}>
          <g data-kb="schiff">
            {/* Hecklicht und Decksleuchten */}
            <circle cx="340" cy="586" r="9" fill="url(#kb-schein)" />
            <circle cx="340" cy="586" r="1.8" fill="#FFFFFF" />
            <circle cx="150" cy="584" r="1.3" fill="#FFE7B8" />
            <circle cx="530" cy="584" r="1.3" fill="#FFE7B8" />
          </g>
        </g>
        {/* Flutlicht unter dem Ausleger auf das Schiff und den Kai */}
        <g className={s.flut}>
          <path d="M248 281H256L302 590H202Z" fill="url(#kb-kegel)" />
          <path d="M478 281H486L534 590H430Z" fill="url(#kb-kegel)" />
          <path d="M685 312H693L736 556H642Z" fill="url(#kb-kegel)" fillOpacity=".7" />
          <rect x="246" y="279" width="12" height="3" fill="#FFF4DC" />
          <rect x="476" y="279" width="12" height="3" fill="#FFF4DC" />
          <rect x="683" y="310" width="12" height="3" fill="#FFF4DC" />
        </g>
        <g data-kb="katze" transform={`translate(${st.katze.toFixed(2)} 0)`}>
          <circle cx="-38" cy="290" r="5" fill="url(#kb-schein)" />
          <rect x="-47" y="286" width="18" height="8" fill="#FFE2A6" fillOpacity=".9" />
        </g>
      </svg>

      {/* ---------------- Beschriftungen ---------------- */}
      {SCHILDER.map((sch, k) => {
        const rechts = LADEPLAETZE[k] - SCHILD_ABSTAND;
        return (
          <p
            key={sch.serie}
            className={s.schild}
            data-kb="schild"
            data-on={k === st.schild ? "1" : "0"}
            style={{
              right: pct((800 - rechts) / 960),
              bottom: pct((760 - SCHILD_UNTEN + hub) / 760),
              maxWidth: pct((rechts + 160) / 960 - 0.012),
            }}
          >
            <span className={s.schildNr}>
              SITALO {sch.serie}
            </span>
            <span className={s.schildText}>{sch.text}</span>
          </p>
        );
      })}
    </div>
  );
}
