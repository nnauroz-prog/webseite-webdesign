"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * CountUp — zählt eine Zahl beim ersten Sichtkontakt von `from` auf
 * `to` (auch rückwärts, z. B. Google-Platz 20 → 3). Server und
 * No-JS sehen sofort den Endwert; bei prefers-reduced-motion bleibt
 * es dabei.
 */
export function CountUp({
  from,
  to,
  duration = 1600,
  prefix = "",
}: {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Schon im Bild (z. B. Reload mitten auf der Seite): nicht zählen.
    const r = node.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    setValue(from);
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setValue(Math.round(from + (to - from) * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">
        {prefix}
        {to}
      </span>
      <span aria-hidden="true">
        {prefix}
        {value}
      </span>
    </span>
  );
}

/**
 * SpotlightLink — Karte, deren Rand und Fläche dort leicht
 * aufleuchten, wo der Mauszeiger steht. Reine CSS-Variablen, kein
 * Re-Render. Auf Touch ohne Effekt.
 */
export function SpotlightLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
      className={`spotlight-card ${className}`}
    >
      {children}
    </Link>
  );
}
