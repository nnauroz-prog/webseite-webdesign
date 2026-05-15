"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor-Label — schwebt der Maus hinterher und zeigt einen kleinen
 * Action-Hint, wenn der Cursor über einem Element mit
 * `data-cursor-label="..."` steht.
 *
 * Anwendung: irgendwo im Markup ein
 *   <Link data-cursor-label="Beispiel ansehen">…</Link>
 * setzen — beim Hover schwebt das Label am Cursor.
 *
 * Touch + reduced-motion: kein Effekt (Label bleibt versteckt).
 *
 * Einmal pro Page-Layout mounten (nicht pro Karte). Die Komponente
 * registriert sich global auf document-level und liest beim Hover
 * das `data-cursor-label`-Attribut des Ziels.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let dirty = false;

    const apply = () => {
      raf = 0;
      if (!dirty) return;
      dirty = false;
      // translate3d weil GPU-accelerated; ohne Layout-Shift
      el.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      // Cursor-Position relativ zum Viewport (fixed-positioned Label)
      // Plus kleiner Versatz nach unten-rechts, damit das Label
      // nicht direkt vom Cursor verdeckt wird.
      lastX = event.clientX + 14;
      lastY = event.clientY + 14;
      dirty = true;
      if (!raf) raf = window.requestAnimationFrame(apply);

      // Closest-Element mit data-cursor-label finden
      const target = (event.target as Element | null)?.closest?.(
        "[data-cursor-label]",
      );
      const next = target?.getAttribute("data-cursor-label") ?? null;
      setLabel((current) => (current === next ? current : next));
    };

    const onLeave = () => {
      setLabel(null);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[60] hidden whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11.5px] font-medium tracking-tight backdrop-blur-md transition-opacity duration-200 md:inline-flex ${
        label
          ? "bg-foreground/95 text-background opacity-100"
          : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100%, -100%, 0)",
        // smooth-follow per CSS-Transition statt rAF-pro-Frame —
        // gibt das gleiche "trail behind cursor"-Feeling wie auf
        // Linear/Vercel
        transition: label
          ? "opacity 200ms ease, transform 180ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "opacity 200ms ease",
      }}
    >
      {label}
    </div>
  );
}
