"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * Primary-CTA mit subtilem magnetischen Verhalten.
 *
 * Wenn der Cursor sich dem Button nähert (innerhalb eines Radius
 * von ~80px), zieht sich der Button leicht in Cursor-Richtung —
 * maximal ~6px in jede Richtung. Beim Verlassen federt er zurück.
 *
 * Bewusst klein gehalten: zu starkes Magnetisieren wirkt
 * verspielt; ein Hauch genügt für den Apple-Premium-Feel.
 *
 * Auf Touch / reduced-motion: 100 % normaler Button.
 */
export function MagneticButton({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const RADIUS = 90;
    const PULL = 0.18; // wie stark sich der Button zur Maus zieht

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const factor = (1 - dist / RADIUS) * PULL;
        el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      } else {
        el.style.transform = "translate(0, 0)";
      }
    };
    const onLeave = () => {
      el.style.transform = "translate(0, 0)";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const sharedStyle = {
    transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "transform",
  } as React.CSSProperties;

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        className={className}
        style={sharedStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} className={className} style={sharedStyle}>
      {children}
    </Link>
  );
}
