"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wrappt seinen Inhalt und blendet ihn beim Scrollen sanft ein.
 * Nutzt IntersectionObserver — leichtgewichtig, keine Library.
 * Respektiert prefers-reduced-motion: dann sofort sichtbar, keine
 * Animation.
 *
 * Apple-style: kurze Fade-Up-Animation (12 px, 700 ms, ease-out).
 * Wird einmal pro Element ausgelöst (nicht bei jedem Re-Enter).
 */
export function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Animation-Delay in ms — für gestaffelte Reveals. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        revealed
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0"
      } ${className}`}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
