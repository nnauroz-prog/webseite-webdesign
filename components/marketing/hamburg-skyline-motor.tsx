"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { imBildBeimStart, useLaufzeit } from "@/components/marketing/hafen/reveal";

/**
 * Client-Hülle der Hamburg-Silhouette (hamburg-skyline.tsx). Der Inhalt
 * des <svg> kommt fertig vom Server; hier stehen nur die Zustände:
 * - is-armed: Die Linien warten unsichtbar (nur wenn die Silhouette beim
 *   Laden noch nicht im Bild war, Bewegung erlaubt ist und es einen
 *   IntersectionObserver gibt).
 * - is-drawn: Beim ersten Sichtkontakt zeichnen sich die Linien.
 * - data-run: Das Hindernisfeuer blinkt nur, solange die Silhouette im
 *   Bild ist und der Tab sichtbar ist (useLaufzeit).
 */
export function SkylineMotor({
  viewBox,
  label,
  className = "",
  children,
}: {
  viewBox: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [armed, setArmed] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useLaufzeit(ref);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let io: IntersectionObserver | undefined;
    // Beim Laden schon im Bild: fertig stehen lassen, nichts verschwindet.
    // Gefragt per IntersectionObserver, damit das Hydrieren kein Layout
    // erzwingt.
    const abbrechen = imBildBeimStart(node, 1, (imBild) => {
      if (imBild) return;
      setArmed(true);
      const beob = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setDrawn(true);
            beob.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      beob.observe(node);
      io = beob;
    });
    return () => {
      abbrechen();
      io?.disconnect();
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label={label}
      className={`hh-skyline ${armed ? "is-armed" : ""} ${drawn ? "is-drawn" : ""} ${className}`}
    >
      {children}
    </svg>
  );
}
