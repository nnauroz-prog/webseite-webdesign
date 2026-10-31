"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hamburg-Silhouette, die sich beim ersten Sichtkontakt in Goldlinien
 * selbst zeichnet und danach leise lebt: Lichter in der Elbphilharmonie,
 * blinkendes Flugwarnlicht am Fernsehturm, ein Containerschiff auf der
 * Elbe, Wellen, zwei Möwen.
 *
 * Von links: Containerkräne, Elbphilharmonie, Speicherstadt, Michel,
 * Heinrich-Hertz-Turm, Rathaus, St. Nikolai, St. Petri, St. Katharinen,
 * St. Jacobi, Dancing Towers, Köhlbrandbrücke. Künstlerische Freiheit
 * bei Reihenfolge und Abständen — erkennbar, nicht kartengenau.
 *
 * Farbe kommt über currentColor (auf dunklem Grund: text-gold).
 * Mobil wird rechts abgeschnitten (xMinYMax slice), damit die
 * Wahrzeichen nicht zu Strichen schrumpfen. Bei prefers-reduced-motion
 * steht die fertige Silhouette ohne Bewegung da.
 */

// Jede Form einzeln, damit sie nacheinander gezeichnet werden kann.
const SHAPES: { d: string; fill?: boolean }[] = [
  // Containerkräne
  { d: "M28 200V128M58 200V128M14 128H128M44 116h20v12H44zM96 128l-6-10h-40M58 128l38-10" },
  { d: "M120 200V140M144 200V140M110 140H196M126 130h16v10h-16zM144 140l30-8" },
  // Elbphilharmonie: Backsteinsockel + gläserner Wellenaufbau
  { d: "M214 200V150H378V200", fill: true },
  { d: "M214 150L216 112Q232 96 250 112Q268 86 292 100Q312 78 336 98Q356 88 372 108L378 116V150", fill: true },
  { d: "M220 164H372M220 178H372M220 190H372" },
  // Speicherstadt: Giebelreihe mit Türmchen
  { d: "M392 200V168L402 156L412 168L422 156L432 168V150L437 142L442 150V168L452 156L462 168L472 156L482 168V200", fill: true },
  // Michel: Kirchenschiff + barocker Turm mit Kuppel und Laterne
  { d: "M490 200V164L512 148L530 164V200", fill: true },
  { d: "M528 200V110H562V200M532 110V88H558V110M535 88Q545 64 555 88M541 70V56H549V70M545 56V30", fill: true },
  // Heinrich-Hertz-Turm
  { d: "M611 200L614 92H620L623 200", fill: true },
  { d: "M602 96H632M604 88H630M606 80H628L626 72H608Z", fill: true },
  { d: "M617 72V24" },
  // Rathaus mit Mittelturm
  { d: "M664 200V162L676 154H738L750 162V200", fill: true },
  { d: "M699 154V112H715V154M697 112L707 92L717 112M707 92V76", fill: true },
  // St. Nikolai — höchste Spitze der Altstadt
  { d: "M784 200V122H800V200M784 122L792 32L800 122", fill: true },
  // St. Petri
  { d: "M836 200V116H850V200M836 116L843 58L850 116", fill: true },
  // St. Katharinen (barocke Haube)
  { d: "M884 200V128H898V200M884 128Q891 108 898 128M887 114Q891 96 895 114M891 98V70", fill: true },
  // St. Jacobi
  { d: "M934 200V122H948V200M934 122L941 64L948 122", fill: true },
  // Dancing Towers
  { d: "M984 200L982 156L992 118H1008L1001 156L1004 200Z", fill: true },
  { d: "M1012 200L1014 162L1026 132H1040L1030 162L1030 200Z", fill: true },
  // Köhlbrandbrücke: geschwungenes Deck, zwei Pylone, Seilfächer
  { d: "M1056 200Q1128 164 1196 178" },
  { d: "M1100 186V108M1152 175V100" },
  { d: "M1100 112L1070 192M1100 112L1084 188M1100 112L1118 180M1100 112L1132 178M1152 104L1128 178M1152 104L1140 176M1152 104L1170 175M1152 104L1186 176" },
];

// Fenster in der Elbphilharmonie, die nacheinander aufleuchten.
const ELPHI_LIGHTS = [
  [236, 128], [258, 120], [282, 116], [306, 112], [330, 116], [352, 124],
  [246, 138], [272, 134], [298, 130], [322, 132], [346, 138],
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
      preserveAspectRatio="xMinYMax slice"
      role="img"
      aria-label="Silhouette von Hamburg: Hafenkräne, Elbphilharmonie, Speicherstadt, Michel, Fernsehturm, Rathaus, Kirchtürme, Dancing Towers und Köhlbrandbrücke"
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
      <circle className="hh-beacon" cx="617" cy="24" r="2.6" fill="#e5484d" />

      {/* Möwen */}
      <g className="hh-gulls" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M430 60q6-6 12 0q6-6 12 0" />
        <path d="M462 46q4-4 8 0q4-4 8 0" />
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
