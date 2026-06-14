"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SitaloSignatur — handgezeichnete „Sitalo"-Signatur mit Schwung
 * darunter, die sich beim Hereinscrollen Strich für Strich
 * zeichnet. Echtes SVG-Path-Animation mit stroke-dasharray, kein
 * CSS-Animations-Trick auf festem Text.
 *
 * Drei Pfade, in Reihenfolge gezeichnet:
 *   1. „Sitalo"-Schriftzug (handgesetzt, italic-Charakter)
 *   2. Schwung-Unterstrich
 *   3. Punkt am Schwung-Ende
 *
 * Gesamte Animationsdauer ~2,4 s, was sich liest wie eine echte
 * Hand, die signiert — nicht zu schnell (wirkt automatisch),
 * nicht zu langsam (wirkt zu lang ausgestellt).
 *
 * Reduced-Motion: Signatur ist sofort komplett sichtbar, ohne
 * Animation. IntersectionObserver triggert nur, wenn mindestens
 * 30 % der Signatur ins Sichtfeld kommt — verhindert Auslösen
 * beim Quer-Scrollen.
 *
 * Wiederholungs-Verhalten: einmal pro Page-Lifetime. Wer rauf-
 * und runterscrollt, sieht die Signatur danach statisch.
 */
export function SitaloSignatur({
  caption,
}: {
  /** Optionale Bildunterschrift, z. B. „— Aus dem Atelier". */
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducedMotion(reduced);
    if (reduced) {
      setDrawn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDrawn(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-drawn={drawn}
      data-reduced={reducedMotion}
      className="sitalo-signatur mx-auto w-full max-w-md text-center"
    >
      <svg
        viewBox="0 0 320 130"
        fill="none"
        role="img"
        aria-labelledby="sitalo-signatur-titel sitalo-signatur-desc"
        className="text-foreground mx-auto block h-auto w-full max-w-[260px] sm:max-w-[320px]"
      >
        <title id="sitalo-signatur-titel">Sitalo Atelier — Signatur</title>
        <desc id="sitalo-signatur-desc">
          Handgezeichneter Schriftzug Sitalo mit Schwung-Unterstrich und
          goldenem Tüpfelchen am Ende.
        </desc>
        {/* Sitalo-Schriftzug, handgezeichnet als zusammenhängende
            italic Bewegung. Path-Länge ca. 480 — passend zur
            stroke-dasharray Steuerung. */}
        <path
          d="M 30 55
             C 28 38, 50 28, 70 32
             C 85 36, 88 50, 78 56
             C 65 64, 38 60, 38 75
             C 38 90, 60 92, 78 86
             M 92 50
             C 92 52, 92 88, 92 88
             M 92 38
             C 92 38, 96 36, 96 36
             M 110 50
             C 110 50, 110 80, 110 88
             C 110 92, 116 92, 120 90
             M 102 50
             C 102 50, 122 50, 122 50
             M 134 78
             C 134 90, 148 94, 158 86
             C 168 76, 162 56, 150 56
             C 140 56, 132 64, 132 76
             M 174 50
             C 174 50, 174 88, 174 88
             M 196 78
             C 196 90, 212 94, 222 86
             C 232 76, 230 60, 218 56
             C 206 52, 192 60, 194 78 Z"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sitalo-signatur-text"
        />
        {/* Schwung-Unterstrich, leicht steigend, mit kleinem
            Ausläufer rechts — typische Handsignatur-Geste. */}
        <path
          d="M 28 110
             C 70 102, 130 100, 180 104
             C 220 107, 250 110, 268 102
             C 274 99, 274 96, 270 96"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          className="sitalo-signatur-swoosh"
        />
        {/* Tüpfelchen am Ende des Schwungs — schließt die Geste. */}
        <circle
          cx="270"
          cy="96"
          r="1.8"
          className="sitalo-signatur-dot fill-gold"
        />
      </svg>
      {caption && (
        <p className="text-muted-foreground mt-4 font-mono text-[10px] uppercase tracking-[0.28em]">
          {caption}
        </p>
      )}
    </div>
  );
}
