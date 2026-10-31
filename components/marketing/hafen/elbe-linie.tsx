"use client";

import { useRef } from "react";

import { useLaufzeit } from "@/components/marketing/hafen/reveal";

/**
 * Elbe-Linie: zwei überlagerte Wellen als Übergang zum Fuß der Seite.
 * Beide driften sehr langsam gegeneinander (56 s und 44 s pro Durchlauf),
 * so verschiebt sich ihre Phase ständig, ohne dass etwas springt. Nur
 * solange die Linie im Bild ist; bei reduzierter Bewegung steht sie still.
 * Styles: app/hafen.css, Block „Elbe-Linie“.
 */

/**
 * Welle als quadratische Bögen über 2 × 1440 Einheiten. Q/T statt
 * Math.sin: ganze Zahlen, damit Server und jeder Browser exakt
 * denselben Pfad schreiben. period muss 1440 teilen (nahtlose Schleife).
 */
function wave(period: number, amp: number, y: number, invert = false) {
  const h = period / 2;
  const c = invert ? y + 2 * amp : y - 2 * amp;
  let d = `M0 ${y}Q${period / 4} ${c} ${h} ${y}`;
  for (let x = period; x <= 2880; x += h) d += `T${x} ${y}`;
  return d;
}

const LINE_A = wave(360, 9, 45);
const LINE_B = wave(288, 6, 45, true);

export function ElbeLinie({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useLaufzeit(ref);
  return (
    <svg
      ref={ref}
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`elbe-linie block h-[60px] w-full sm:h-[90px] ${className}`}
    >
      <path
        className="elbe-a"
        d={LINE_A}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="elbe-b"
        d={LINE_B}
        fill="none"
        stroke="var(--background)"
        strokeOpacity=".18"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
