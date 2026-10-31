"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hamburg-Silhouette als feine Linienzeichnung mit Spiegelung in der
 * Elbe. Höhen maßstäblich (1 m ≈ 0,75 Einheiten): Fernsehturm 279 m,
 * St. Nikolai 147 m, Michel und St. Petri 132 m, St. Jacobi 125 m,
 * St. Katharinen 115 m, Rathaus 112 m, Elbphilharmonie 110 m.
 *
 * Vom Elbufer gesehen, West → Ost: Köhlbrandbrücke, Containerbrücken,
 * Dancing Towers, Landungsbrücken mit Pegelturm, Michel,
 * Heinrich-Hertz-Turm, Elbphilharmonie, St. Katharinen, St. Nikolai,
 * Rathaus, St. Petri, St. Jacobi, Speicherstadt. Abstände gestaucht.
 *
 * Bewegung: die Linien zeichnen sich beim ersten Sichtkontakt einmal
 * nacheinander, Flächen und Spiegelung blenden danach ein — dann steht
 * das Bild. Bei prefers-reduced-motion sofort fertig.
 */

const W = 1600;
const WATER = 240;

/** Fachwerk zwischen zwei Gurten (Zickzack). */
function lattice(x1: number, x2: number, yTop: number, yBot: number, step: number) {
  let d = `M${x1} ${yBot}`;
  let up = true;
  for (let x = x1 + step; x <= x2; x += step) {
    d += `L${x} ${up ? yTop : yBot}`;
    up = !up;
  }
  return d;
}

/** Senkrechte Fensterschlitze in einer Reihe. */
function windows(x1: number, x2: number, y: number, h: number, step: number) {
  let d = "";
  for (let x = x1; x <= x2; x += step) d += `M${x} ${y}v${h}`;
  return d;
}

/** Rundbogenfenster in einer Reihe. */
function arches(x1: number, x2: number, y: number, step: number, w = 4, h = 8) {
  let d = "";
  for (let x = x1; x + w <= x2; x += step) {
    d += `M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}`;
  }
  return d;
}

/** Containerbrücke (STS-Kran) an Position x, Ausleger übers Wasser nach links. */
function crane(x: number) {
  return [
    // Portal: zwei Beine mit Kreuzverband, Querträger
    `M${x} ${WATER}L${x + 6} 176M${x + 48} ${WATER}L${x + 42} 176M${x + 2} 222L${x + 46} 196M${x + 46} 222L${x + 2} 196M${x - 4} 176H${x + 54}M${x - 4} 172H${x + 54}`,
    // Ausleger mit Fachwerk
    `M${x - 40} 168H${x + 92}M${x - 40} 162H${x + 92}${lattice(x - 40, x + 92, 162, 168, 6)}`,
    // A-Bock, Abspannungen, Maschinenhaus
    `M${x + 10} 172L${x + 25} 130L${x + 40} 172M${x + 25} 130L${x - 38} 162M${x + 25} 130L${x + 90} 162M${x + 16} 172V160H${x + 36}V172`,
  ];
}

type Shape = { d: string; fill?: boolean; fine?: boolean };

const ELPHI_GLASS =
  "M950 208V158Q962 152 976 160Q992 150 1010 164Q1034 152 1056 168Q1082 160 1104 174Q1132 168 1156 180Q1170 178 1180 184V208Z";

const SHAPES: Shape[] = [
  // Köhlbrandbrücke: Deck (zwei Linien), Pylone, Seilfächer
  { d: "M10 236C80 214 120 204 160 202S250 214 310 236M10 240C80 218 120 208 160 206S250 218 310 240" },
  { d: "M106 240L108 138H112L114 240M206 240L208 138H212L214 240", fill: true },
  {
    d: "M110 142L30 229M110 145L50 222M110 148L70 215M110 151L90 210M110 142L130 204M110 145L145 203M110 148L158 202M210 142L162 202M210 145L175 203M210 148L190 205M210 142L290 229M210 145L270 222M210 148L250 215M210 151L230 210",
    fine: true,
  },
  // Containerbrücken
  ...crane(370).map((d) => ({ d })),
  ...crane(452).map((d) => ({ d })),
  // Dancing Towers — zwei geknickte Hochhäuser
  { d: "M512 240L518 208L512 176H534L540 208L534 240Z", fill: true },
  { d: "M544 240L548 214L556 190H574L566 214L562 240Z", fill: true },
  { d: "M514 186H535M516 196H537M518 206H539M516 216H538M515 226H536M550 200H569M548 210H566M548 220H564M548 230H563", fine: true },
  // Landungsbrücken: Halle, Kuppeltürme, Pegelturm mit Uhr
  { d: "M592 240V222H772V240M592 222L598 216H766L772 222", fill: true },
  { d: arches(598, 744, 226, 8), fine: true },
  { d: "M616 216V200H628V216M616 200Q622 186 628 200M622 189V182M686 216V200H698V216M686 200Q692 186 698 200M692 189V182", fill: true },
  { d: "M752 222V176H764V222M750 176H766M752 176L758 158L764 176M758 158V150", fill: true },
  { d: "M761 186a3 3 0 1 0 -6 0a3 3 0 1 0 6 0M758 186V184.5", fine: true },
  // Michel: Kirchenschiff, Turm mit Säulengeschoss, Kuppel, Laterne, Spitze
  { d: "M796 240V208L818 196L840 208V240", fill: true },
  { d: arches(800, 836, 216, 9, 4, 12), fine: true },
  { d: "M840 240V186H870V240M842 186V168H868V186M845 168V158H865V168M845 158Q855 144 865 158M851 150V143H859V150M855 143V130", fill: true },
  { d: "M846 172V184M851 172V184M855 172V184M859 172V184M864 172V184M859 200a4 4 0 1 0 -8 0a4 4 0 1 0 8 0", fine: true },
  // Heinrich-Hertz-Turm
  { d: "M899 240L902 110H908L911 240Z", fill: true },
  { d: "M893 110H917M891 104H919L917 98H893ZM894 92H916L914 86H896ZM902 86H908L906 72H904Z", fill: true },
  { d: "M905 72V31M902 60H908M902 48H908", fine: true },
  // Elbphilharmonie: Backsteinsockel (gut ein Drittel der Höhe),
  // Plaza-Fuge, Glasaufbau mit Wellendach — höchster Punkt im Westen
  { d: "M950 240V212H1180V240", fill: true },
  { d: windows(956, 1176, 217, 6, 6) + windows(956, 1176, 228, 6, 6), fine: true },
  { d: "M950 212H1180M950 208H1180", fine: true },
  { d: ELPHI_GLASS, fill: true },
  // St. Katharinen — barocke, gestufte Haube
  { d: "M1196 240V186H1212V240M1196 186Q1204 176 1212 186M1199 179V172H1209V179M1199 172Q1204 164 1209 172M1204 166V154", fill: true },
  // St. Nikolai — höchste, schlanke neugotische Spitze
  { d: "M1256 240V178H1272V240M1256 178L1264 130L1272 178M1256 178L1258 170M1272 178L1270 170", fill: true },
  { d: "M1264 178V140M1259 196V206M1269 196V206", fine: true },
  // Rathaus: Mansarddach, Seitengiebel, Mittelturm
  { d: "M1292 240V208H1424V240M1292 208L1300 198H1416L1424 208", fill: true },
  { d: "M1302 198L1308 190L1314 198M1402 198L1408 190L1414 198", fill: true },
  { d: windows(1298, 1418, 214, 8, 6) + windows(1298, 1418, 228, 8, 6), fine: true },
  { d: "M1350 198V176H1366V198M1348 176H1368M1350 176L1352 168H1364L1366 176M1352 168Q1358 158 1364 168M1358 160V150", fill: true },
  // St. Petri
  { d: "M1452 240V182H1466V240M1452 182L1459 141L1466 182", fill: true },
  { d: "M1459 182V148M1455 198V208M1463 198V208", fine: true },
  // St. Jacobi
  { d: "M1494 240V188H1508V240M1494 188L1501 146L1508 188", fill: true },
  // Speicherstadt: Giebelreihe mit Türmchen
  {
    d: "M1522 240V218L1530 210L1538 218L1546 210L1554 218V206L1558 200L1562 206V218L1570 210L1578 218L1586 210L1594 218L1600 214V240",
    fill: true,
  },
  { d: windows(1526, 1596, 224, 5, 6) + windows(1526, 1596, 232, 4, 6), fine: true },
];

// Glasfugen der Elbphilharmonie, per clipPath auf den Wellenaufbau begrenzt.
const ELPHI_SEAMS = windows(956, 1176, 140, 68, 8) + "M950 178H1180M950 193H1180";

export function HamburgSkyline({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} 320`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Silhouette von Hamburg mit Spiegelung in der Elbe: Köhlbrandbrücke, Containerbrücken, Dancing Towers, Landungsbrücken, Michel, Fernsehturm, Elbphilharmonie, St. Katharinen, St. Nikolai, Rathaus, St. Petri, St. Jacobi und Speicherstadt"
      className={`hh-skyline ${drawn ? "is-drawn" : ""} ${className}`}
    >
      <defs>
        <linearGradient id="hh-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="hh-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="hh-reflect-mask" maskUnits="userSpaceOnUse" x="0" y={WATER} width={W} height="80">
          <rect x="0" y={WATER} width={W} height="80" fill="url(#hh-fade)" />
        </mask>
        <filter id="hh-ripple" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.22" numOctaves="1" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
        <clipPath id="hh-elphi-glass">
          <path d={ELPHI_GLASS} />
        </clipPath>
      </defs>

      <g id="hh-city" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
        {SHAPES.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            strokeWidth={s.fine ? 0.7 : 1.25}
            className={s.fill ? "hh-draw hh-fill" : s.fine ? "hh-draw hh-fine" : "hh-draw"}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
        <path d={ELPHI_SEAMS} clipPath="url(#hh-elphi-glass)" strokeWidth={0.6} className="hh-detail" />
      </g>

      {/* Wasserlinie */}
      <path d={`M0 ${WATER + 0.5}H${W}`} stroke="currentColor" strokeWidth="1" className="hh-detail" />

      {/* Spiegelung: gestaucht, gewellt, nach unten auslaufend */}
      <g mask="url(#hh-reflect-mask)" className="hh-reflection">
        <use href="#hh-city" transform={`matrix(1 0 0 -0.5 0 ${WATER * 1.5})`} filter="url(#hh-ripple)" />
      </g>
    </svg>
  );
}
