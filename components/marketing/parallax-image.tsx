"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef } from "react";

/**
 * Bild mit dezentem Scroll-Parallax. Bewegt sich beim Scrollen
 * langsamer als der umgebende Container, gibt der Hero-Fläche Tiefe.
 *
 * Implementierung: das Bild ist leicht überskaliert (~10 %) und wird
 * über `translate3d` per CSS-Variable auf der Y-Achse verschoben.
 * Maximale Bewegung ~ 30 px hoch/runter. Respektiert
 * prefers-reduced-motion (keine Bewegung) und nutzt
 * IntersectionObserver, damit wir nur scrollen, wenn das Bild
 * im Viewport liegt.
 */
type Props = Omit<ImageProps, "loading"> & {
  /** Maximaler vertikaler Versatz in Pixeln. Default 30. */
  intensityPx?: number;
};

export function ParallaxImage({
  intensityPx = 30,
  className,
  ...imageProps
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let inView = false;
    let ticking = false;

    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);

    const update = () => {
      if (!inView) {
        ticking = false;
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // Fortschritt 0..1: 0 = Bild gerade ins Sichtfeld unten, 1 = oben raus.
      const progress = (viewportH - rect.top) / (viewportH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      // -intensity ... +intensity px
      const offset = (clamped - 0.5) * 2 * intensityPx;
      el.style.setProperty("--parallax-y", `${offset}px`);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [intensityPx]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{ "--parallax-y": "0px" } as React.CSSProperties}
    >
      <div className="parallax-inner absolute inset-0">
        <Image {...imageProps} fill className={className} />
      </div>
    </div>
  );
}
