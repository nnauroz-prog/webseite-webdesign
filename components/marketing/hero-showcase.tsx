"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * HeroShowcase — Kartenstapel mit echten Branchen-Layouts, der sich
 * alle paar Sekunden weiterblättert. Die vordere Karte gleitet nach
 * links weg, die nächste rückt nach. Fünf Karten, davon drei sichtbar:
 * Position 3 wartet unsichtbar hinten, Position 4 ist die gerade
 * abgelegte — so springt nie eine Karte sichtbar quer durchs Bild.
 *
 * Pausiert bei Hover und in einem Hintergrund-Tab. Bei
 * prefers-reduced-motion bleibt der Stapel stehen.
 */
export type ShowcaseItem = {
  slug: string;
  label: string;
  src: string;
  alt: string;
};

const POS = [
  "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100 z-30",
  "translate-x-[4%] -translate-y-[6%] scale-[0.94] opacity-100 brightness-[0.85] z-20",
  "translate-x-[8%] -translate-y-[12%] scale-[0.88] opacity-100 brightness-[0.72] z-10",
  "translate-x-[8%] -translate-y-[12%] scale-[0.88] opacity-0 z-0",
  "-translate-x-[6%] translate-y-0 scale-100 opacity-0 z-40",
];

const INTERVAL = 5000;

export function HeroShowcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setActive((a) => (a + 1) % n);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, n]);

  const current = items[active];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] w-full">
        {items.map((item, i) => {
          const pos = (i - active + n) % n;
          return (
            <button
              key={item.slug}
              type="button"
              tabIndex={pos === 0 ? 0 : -1}
              aria-hidden={pos !== 0}
              aria-label="Nächstes Beispiel zeigen"
              onClick={() => setActive((a) => (a + 1) % n)}
              className={`absolute inset-0 overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgb(15_25_50/0.4)] ring-1 ring-black/10 transition-[translate,rotate,scale,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${POS[Math.min(pos, POS.length - 1)]}`}
            >
              <Image
                src={item.src}
                alt={pos === 0 ? item.alt : ""}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Glas-Etikett: welche Branche gerade vorne liegt + Fortschritt. */}
      <div className="pointer-events-none absolute -bottom-5 left-4 z-50 sm:left-6">
        <Link
          href={`/branchen/${current.slug}`}
          className="bg-background/80 border-border/60 pointer-events-auto inline-flex items-center gap-3 rounded-full border py-2 pr-4 pl-3 shadow-lg backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="bg-gold relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span className="text-[13px] font-medium tracking-tight" aria-live="polite">
            {current.label}
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {items.map((item, i) => (
              <span
                key={item.slug}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? "bg-foreground w-4" : "bg-foreground/20 w-1"
                }`}
              />
            ))}
          </span>
        </Link>
      </div>
    </div>
  );
}
