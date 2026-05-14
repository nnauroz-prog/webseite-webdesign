"use client";

import { useEffect, useRef } from "react";

/**
 * Sanfter Gold-Spotlight, der dem Mauszeiger im Hero folgt.
 *
 * Bewusst zurückhaltend — kein dicker Glow, keine Tracker-Linien.
 * Der Halo ist groß, weich, mit niedriger Opazität, und folgt der
 * Maus mit minimaler Trägheit (CSS-Transition statt requestAnimation-
 * Frame-Schleife). Apple/Vercel-feel.
 *
 * Auf Touch-Geräten und bei prefers-reduced-motion: kein Effekt.
 * Der statische Brand-Halo, der bereits im Hero liegt, übernimmt
 * dann die visuelle Aufgabe.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pointer-Spotlight ergibt nur Sinn für Maus — Touch-User würden
    // den Halo nie sehen, dafür wäre die mousemove-Listener-CPU-Last
    // unnötig.
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!isFinePointer || prefersReducedMotion) {
      el.style.opacity = "0";
      return;
    }

    const parent = el.parentElement;
    if (!parent) return;

    const onMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      el.style.setProperty("--spotlight-x", `${x}px`);
      el.style.setProperty("--spotlight-y", `${y}px`);
      el.style.opacity = "1";
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(560px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), oklch(0.66 0.13 80 / 0.18), transparent 60%)",
      }}
    />
  );
}
