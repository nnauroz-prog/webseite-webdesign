"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hamburg-Silhouette, die sich beim ersten Sichtkontakt in Goldlinien
 * selbst zeichnet und danach leise lebt: Lichter in der Elbphilharmonie,
 * blinkendes Flugwarnlicht am Fernsehturm, ein Containerschiff auf der
 * Elbe, Wellen, zwei Möwen.
 *
 * Vom Elbufer gesehen, West → Ost: Köhlbrandbrücke, Containerbrücken,
 * Dancing Towers, Landungsbrücken mit Pegelturm, Michel,
 * Heinrich-Hertz-Turm, Elbphilharmonie, St. Katharinen, St. Nikolai,
 * Rathaus, St. Petri, St. Jacobi, Speicherstadt. Abstände gestaucht —
 * erkennbar, nicht kartengenau.
 *
 * Farbe kommt über currentColor (auf dunklem Grund: text-gold).
 * Mobil wird links und rechts beschnitten (xMidYMax slice), damit die
 * Wahrzeichen in der Mitte (Michel bis Rathaus) groß bleiben. Bei prefers-reduced-motion
 * steht die fertige Silhouette ohne Bewegung da.
 */

// Jede Form einzeln, damit sie nacheinander gezeichnet werden kann.
// Reihenfolge wie vom Elbufer gesehen, West → Ost.
const SHAPES: { d: string; fill?: boolean }[] = [
  // Köhlbrandbrücke: geschwungenes Deck, zwei Pylone, Seilfächer
  { d: "M0 196Q72 164 150 190" },
  { d: "M46 181V96M104 178V100" },
  { d: "M46 100L14 190M46 100L28 186M46 100L64 176M46 100L80 175M104 104L84 176M104 104L94 177M104 104L122 182M104 104L138 187" },
  // Containerbrücken (STS-Kräne): A-Rahmen, langer Ausleger übers Wasser
  { d: "M178 200L184 138M214 200L208 138M150 138H236M188 128h16v10h-16zM184 138L196 112L208 138M196 112L152 138M196 112L234 138" },
  { d: "M232 200L237 146M262 200L257 146M210 146H282M240 137h13v9h-13zM237 146L247 124L257 146M247 124L212 146M247 124L280 146" },
  // Dancing Towers
  { d: "M296 200L294 156L304 118H320L313 156L316 200Z", fill: true },
  { d: "M322 200L324 162L336 132H350L340 162L340 200Z", fill: true },
  // Landungsbrücken mit Kuppeltürmen und Pegelturm
  { d: "M362 200V172H476V200", fill: true },
  { d: "M372 172V160H384V172M372 160Q378 148 384 160M418 172V158H430V172M418 158Q424 144 430 158", fill: true },
  { d: "M462 172V128H474V172M462 128L468 112L474 128M468 112V104", fill: true },
  // Michel: Kirchenschiff + barocker Turm, Kuppel, Laterne, Spitze
  { d: "M498 200V164L520 148L538 164V200", fill: true },
  { d: "M536 200V110H570V200M540 110V88H566V110M543 88Q553 64 563 88M549 70V56H557V70M553 56V30", fill: true },
  // Heinrich-Hertz-Turm
  { d: "M600 200L603 92H609L612 200", fill: true },
  { d: "M591 96H621M593 88H619M595 80H617L615 72H597Z", fill: true },
  { d: "M606 72V20" },
  // Elbphilharmonie: Backsteinsockel, Glasaufbau — höchster Punkt im
  // Westen, die Wellen fallen nach Osten ab.
  { d: "M640 200V148H800V200", fill: true },
  { d: "M640 148V90Q656 82 674 100Q694 86 714 104Q736 96 756 112Q778 104 800 120V148", fill: true },
  { d: "M646 162H794M646 175H794M646 188H794" },
  // St. Katharinen (barocke Haube)
  { d: "M826 200V128H840V200M826 128Q833 108 840 128M829 114Q833 96 837 114M833 98V68", fill: true },
  // St. Nikolai — die höchste, schlankste Spitze
  { d: "M862 200V118H878V200M862 118L870 28L878 118", fill: true },
  // Rathaus mit Mittelturm
  { d: "M896 200V162L908 154H990L1002 162V200", fill: true },
  { d: "M941 154V108H957V154M939 108L949 84L959 108M949 84V60", fill: true },
  // St. Petri
  { d: "M1022 200V116H1036V200M1022 116L1029 50L1036 116", fill: true },
  // St. Jacobi
  { d: "M1060 200V122H1074V200M1060 122L1067 58L1074 122", fill: true },
  // Speicherstadt: Giebelreihe mit Türmchen, im Vordergrund
  { d: "M1092 200V168L1102 156L1112 168L1122 156L1132 168V150L1137 142L1142 150V168L1152 156L1162 168L1172 156L1182 168L1192 156L1200 164V200", fill: true },
];

// Fenster im Glasaufbau der Elbphilharmonie, die nacheinander leuchten.
const ELPHI_LIGHTS = [
  [650, 110], [672, 116], [694, 116], [716, 120], [740, 124], [764, 128], [784, 132],
  [660, 130], [686, 132], [712, 134], [738, 136], [764, 140],
];

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
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Silhouette von Hamburg: Köhlbrandbrücke, Containerbrücken, Dancing Towers, Landungsbrücken, Michel, Fernsehturm, Elbphilharmonie, Kirchtürme, Rathaus und Speicherstadt"
      className={`hh-skyline ${drawn ? "is-drawn" : ""} ${className}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        {SHAPES.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            className={s.fill ? "hh-draw hh-fill" : "hh-draw"}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
      </g>

      {/* Lichter */}
      <g className="hh-lights" fill="currentColor">
        {ELPHI_LIGHTS.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="5" height="3" rx="0.5" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </g>
      <circle className="hh-beacon" cx="606" cy="20" r="2.6" fill="#e5484d" />

      {/* Möwen */}
      <g className="hh-gulls" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M640 50q6-6 12 0q6-6 12 0" />
        <path d="M672 36q4-4 8 0q4-4 8 0" />
      </g>

      {/* Elbe: Wasserlinie, Wellen, Schiff */}
      <path d="M0 200.5H1200" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <g className="hh-waves" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35">
        <path d="M0 214q15-5 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0" />
        <path d="M-15 228q15-4 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0" />
      </g>
      <g className="hh-ship" fill="currentColor">
        <path d="M0 196h92l-8 12H8z" />
        <rect x="14" y="184" width="14" height="12" opacity="0.9" />
        <rect x="30" y="184" width="14" height="12" opacity="0.7" />
        <rect x="46" y="184" width="14" height="12" opacity="0.9" />
        <rect x="30" y="174" width="14" height="10" opacity="0.6" />
        <rect x="66" y="176" width="10" height="20" />
        <rect x="69" y="170" width="4" height="6" />
      </g>
    </svg>
  );
}
