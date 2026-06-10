"use client";

import Image from "next/image";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * ParallaxHeroFrame — gerahmtes Hero-Bild mit drei Tiefenebenen,
 * die der Maus folgen. Architektonisch wie TiltCard (Pointer
 * schreibt CSS-Variablen, alle Bewegungen laufen als CSS-
 * Transitions auf transform), aber sichtbar räumlich:
 *
 *   - Bild selbst kippt leicht und übersetzt minimal
 *   - Atelier-Plakette (Wachssiegel-artig, Gold) schwebt deutlich
 *     vor dem Bild
 *   - Notiz-Zettel mit dem Zitat schwebt noch weiter vorn
 *   - Schatten unter jeder Ebene wandert gegenläufig zur Neigung
 *
 * Touch + reduced-motion: alles auf Ruhewerten, statisches Bild.
 */
export function ParallaxHeroFrame({
  src,
  alt,
  quote,
  caption,
}: {
  src: string;
  alt: string;
  quote: string;
  caption: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    // Normierte Achsen -1..1, mit weichem Easing
    const nx = x * 2 - 1;
    const ny = y * 2 - 1;
    el.style.setProperty("--ph-rx", `${ny * -8}deg`);
    el.style.setProperty("--ph-ry", `${nx * 10}deg`);
    el.style.setProperty("--ph-img-x", `${nx * -10}px`);
    el.style.setProperty("--ph-img-y", `${ny * -10}px`);
    el.style.setProperty("--ph-seal-x", `${nx * -22}px`);
    el.style.setProperty("--ph-seal-y", `${ny * -22}px`);
    el.style.setProperty("--ph-note-x", `${nx * -34}px`);
    el.style.setProperty("--ph-note-y", `${ny * -34}px`);
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    for (const key of [
      "--ph-rx",
      "--ph-ry",
      "--ph-img-x",
      "--ph-img-y",
      "--ph-seal-x",
      "--ph-seal-y",
      "--ph-note-x",
      "--ph-note-y",
    ]) {
      el.style.setProperty(
        key,
        key === "--ph-rx" || key === "--ph-ry" ? "0deg" : "0px",
      );
    }
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="parallax-hero relative aspect-[4/5] w-full sm:aspect-[5/6]"
      style={
        {
          "--ph-rx": "0deg",
          "--ph-ry": "0deg",
          "--ph-img-x": "0px",
          "--ph-img-y": "0px",
          "--ph-seal-x": "0px",
          "--ph-seal-y": "0px",
          "--ph-note-x": "0px",
          "--ph-note-y": "0px",
        } as React.CSSProperties
      }
    >
      {/* Tiefen-Schatten direkt unter dem Bild — wandert
          gegenläufig zur Neigung, „verkauft" die Höhe. */}
      <div className="parallax-hero-shadow" aria-hidden="true" />

      {/* Ebene 1: Bild selbst (am weitesten hinten) */}
      <div className="parallax-hero-stage">
        <div className="parallax-hero-image ring-foreground/5 relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 sm:aspect-[5/6]">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="from-foreground/45 pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent"
          />
        </div>

        {/* Ebene 2: Wachssiegel-artige Atelier-Plakette, schwebt
            deutlich vor dem Bild, dreht selbst etwas stärker. */}
        <div
          className={cn(
            "parallax-hero-seal",
            "border-gold/50 bg-card/95 text-foreground absolute top-5 left-5 inline-flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-md sm:top-7 sm:left-7",
          )}
        >
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1.5 w-1.5 rounded-full"
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
            Sitalo Atelier · MMXXVI
          </span>
        </div>

        {/* Ebene 3: Notiz-Zettel mit Zitat, schwebt am stärksten
            vor dem Rest — wirkt wie ein angeheftetes Papier. */}
        <figure className="parallax-hero-note absolute right-5 bottom-5 left-5 sm:right-7 sm:bottom-7 sm:left-7">
          <blockquote className="serif-italic text-background text-lg leading-snug tracking-[-0.005em] sm:text-xl">
            {quote}
          </blockquote>
          <figcaption className="text-background/75 mt-3 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-5"
            />
            {caption}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
