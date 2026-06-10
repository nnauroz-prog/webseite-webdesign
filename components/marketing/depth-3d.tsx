"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Depth3D — Perspektiv-Wrapper für Flächen, die wie auf einem
 * Tisch liegen sollen (Karte, Foto, Dokument). Der Inhalt kippt
 * dem Cursor entgegen, ein weicher Schatten wandert gegenläufig —
 * als würde man ein Blatt Papier leicht anheben.
 *
 * Gleiche Architektur wie TiltCard (Pointer schreibt CSS-Variablen,
 * die Transformation läuft als CSS-Transition — kein rAF-Loop),
 * aber als neutrales <div> statt Link, mit stärkerer Neigung und
 * Schatten-Choreografie für den Tisch-Effekt.
 *
 * Touch + reduced-motion: statisch, null Effekt.
 */
export function Depth3D({
  children,
  className,
  /** Maximale Neigung in Grad pro Achse. 8 wirkt wie angehobenes
   *  Papier; mehr als 12 wird Spielzeug. */
  maxTilt = 8,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--d3-rx", `${(0.5 - y) * maxTilt}deg`);
    el.style.setProperty("--d3-ry", `${(x - 0.5) * maxTilt}deg`);
    // Schatten wandert gegen die Kipprichtung — verkauft die Höhe.
    el.style.setProperty("--d3-sx", `${(0.5 - x) * 24}px`);
    el.style.setProperty("--d3-sy", `${(y - 0.5) * 24 + 18}px`);
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--d3-rx", "0deg");
    el.style.setProperty("--d3-ry", "0deg");
    el.style.setProperty("--d3-sx", "0px");
    el.style.setProperty("--d3-sy", "12px");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("depth-3d", className)}
      style={
        {
          "--d3-rx": "0deg",
          "--d3-ry": "0deg",
          "--d3-sx": "0px",
          "--d3-sy": "12px",
        } as React.CSSProperties
      }
    >
      <div className="depth-3d-inner">{children}</div>
    </div>
  );
}
