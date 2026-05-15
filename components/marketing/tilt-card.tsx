"use client";

import Link from "next/link";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Wrapper für Karten, die beim Hover dezent in 3D kippen.
 *
 * Der Effekt ist bewusst zurückhaltend (max ~5° Neigung), nicht das
 * laute "Awwwards"-Tilt. Pointer-Position wird in CSS-Variablen
 * geschrieben — die eigentliche Transformation läuft in einer
 * CSS-Transition, das verhindert ruckelige rAF-Loops.
 *
 * Auf Touch + reduced-motion: 0 % Effekt, ganz normaler Link.
 */
export function TiltCard({
  href,
  children,
  className,
  ariaLabel,
  cursorLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Optional Cursor-Label-Text — zeigt sich am Cursor beim Hover,
   *  wenn CursorLabel im Layout gemountet ist. */
  cursorLabel?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  function onPointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    if (event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width; // 0..1
    const y = (event.clientY - rect.top) / rect.height; // 0..1
    const rotateY = (x - 0.5) * 6; // max ~3° pro Seite
    const rotateX = (0.5 - y) * 6;
    el.style.setProperty("--tilt-x", `${rotateX}deg`);
    el.style.setProperty("--tilt-y", `${rotateY}deg`);
    el.style.setProperty("--tilt-shine-x", `${x * 100}%`);
    el.style.setProperty("--tilt-shine-y", `${y * 100}%`);
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      data-cursor-label={cursorLabel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("tilt-card group block", className)}
      style={{ "--tilt-x": "0deg", "--tilt-y": "0deg" } as React.CSSProperties}
    >
      {children}
    </Link>
  );
}
