"use client";

import { useEffect, useRef, useState } from "react";

import s from "./signatur.module.css";

/**
 * Handgezeichnete Signatur „Sitalo“ mit Schwung und orangem Tüpfelchen.
 * Sie zeichnet sich einmal per stroke-dashoffset, sobald sie zu 30 % im
 * Bild ist (Schriftzug, dann Schwung, dann Punkt; rund 2 s). Bei
 * reduzierter Bewegung und ohne IntersectionObserver steht sie sofort.
 *
 * Nur das Kürzel „Sitalo“, kein Name: Der Name des Inhabers steht nur auf
 * /impressum und /datenschutz.
 */
export function SitaloSignatur({ caption, className = "" }: { caption?: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [zustand, setZustand] = useState<"wartet" | "zeichnet" | "steht">("wartet");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setZustand("steht");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setZustand("zeichnet");
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} data-zustand={zustand} className={`${s.signatur} ${className}`}>
      <svg viewBox="0 0 290 120" fill="none" role="img" aria-label="Signatur: Sitalo" className={s.svg}>
        <path
          d="M 30 55 C 28 38, 50 28, 70 32 C 85 36, 88 50, 78 56 C 65 64, 38 60, 38 75 C 38 90, 60 92, 78 86
             M 92 50 C 92 52, 92 88, 92 88 M 92 38 C 92 38, 96 36, 96 36
             M 110 50 C 110 50, 110 80, 110 88 C 110 92, 116 92, 120 90 M 102 50 C 102 50, 122 50, 122 50
             M 134 78 C 134 90, 148 94, 158 86 C 168 76, 162 56, 150 56 C 140 56, 132 64, 132 76
             M 174 50 C 174 50, 174 88, 174 88
             M 196 78 C 196 90, 212 94, 222 86 C 232 76, 230 60, 218 56 C 206 52, 192 60, 194 78 Z"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={s.text}
        />
        <path
          d="M 28 106 C 70 98, 130 96, 180 100 C 220 103, 250 106, 266 98 C 272 95, 272 92, 268 92"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={s.schwung}
        />
        <circle cx="268" cy="92" r="2.2" className={s.punkt} />
      </svg>
      {caption ? <p className={s.caption}>{caption}</p> : null}
    </div>
  );
}
