"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { BRANCHEN } from "@/lib/branchen-data";

/**
 * Hero-Visual mit rotierenden Branchen-Mockups.
 *
 * Wechselt alle 5 Sekunden crossfade-mäßig durch 4 ausgewählte
 * Mockups. Signalisiert sofort "ich baue Verschiedenes" — viel
 * stärker als ein einzelnes statisches Bild.
 *
 * Respektiert prefers-reduced-motion: dann nur erstes Bild,
 * keine Rotation.
 *
 * Alle Bilder werden mit priority geladen damit der Übergang
 * sofort funktioniert, kein Lazy-Fade beim ersten Wechsel.
 */
const MOCKUP_SLUGS = ["pflege", "praxis", "gastro", "handwerker"];

export function HeroRotatingMockups() {
  const mockups = MOCKUP_SLUGS.map((slug) =>
    BRANCHEN.find((b) => b.slug === slug),
  ).filter((b): b is NonNullable<typeof b> => Boolean(b?.image));

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    if (mockups.length < 2) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % mockups.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [mockups.length]);

  if (mockups.length === 0) return null;

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div
        aria-hidden="true"
        className="bg-gold/20 absolute -inset-10 -z-10 rounded-[3rem] blur-[80px]"
      />
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-[0_40px_80px_-20px_rgb(0_0_0/0.35),0_12px_24px_-6px_rgb(0_0_0/0.18)] ring-1 ring-black/5">
        {mockups.map((b, i) => (
          <div
            key={b.slug}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            {b.image ? (
              <Image
                src={b.image.src}
                alt={b.image.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 640px, (min-width: 640px) 80vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Branchen-Indikator unter dem Mockup */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {mockups.map((b, i) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Beispiel ${b.label} anzeigen`}
            aria-pressed={i === active}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "bg-foreground w-8"
                : "bg-foreground/20 hover:bg-foreground/40 w-1.5"
            }`}
          />
        ))}
      </div>
      <p
        key={mockups[active]?.slug}
        className="text-muted-foreground mt-3 text-center text-sm tracking-tight animate-in fade-in duration-700"
      >
        {mockups[active]?.label}
      </p>
    </div>
  );
}
