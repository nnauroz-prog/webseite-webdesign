"use client";

import { useEffect, useRef } from "react";

/**
 * Page-wide Cursor-Glow — sehr großer, sehr weicher Gold-Halo,
 * der dem Mauszeiger über die GESAMTE Seite folgt (nicht
 * sektions-lokal wie CursorSpotlight). Das ist das Linear-/
 * Vercel-Ambient-Light-Pattern.
 *
 * Mix-blend-mode „plus-lighter" mischt den Gold-Schimmer additiv
 * mit dem Hintergrund — funktioniert auf cream-Sektionen UND
 * auf den dunklen Sektionen (FinalCta, PersonalNote), ohne dass
 * man je nach Background-Farbe schaltet.
 *
 * Touch + reduced-motion: kein Effekt (Komponente bleibt
 * unsichtbar). Auf Mobile macht der Glow eh keinen Sinn — kein
 * Pointer, der zu folgen wäre.
 *
 * Einmal in app/layout.tsx mounten (nicht pro Seite). Das fixed-
 * positioned Element überlagert alles, aber pointer-events-none
 * + extrem niedrige Opazität verhindert dass irgendwas dadrunter
 * gestört wird.
 */
export function PageCursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let dirty = false;

    const apply = () => {
      raf = 0;
      if (!dirty) return;
      dirty = false;
      el.style.setProperty("--cursor-x", `${x}px`);
      el.style.setProperty("--cursor-y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      dirty = true;
      // Erst Opacity hoch beim ersten Move — bevor der User die Maus
      // bewegt, soll der Glow nicht im Layout schwingen.
      el.style.opacity = "1";
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden opacity-0 transition-opacity duration-700 md:block"
      style={{
        background:
          "radial-gradient(700px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), oklch(0.66 0.13 80 / 0.08), transparent 60%)",
        mixBlendMode: "plus-lighter",
      }}
    />
  );
}
