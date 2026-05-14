"use client";

import { useEffect, useRef } from "react";

/**
 * Dünne Gold-Linie ganz oben am Viewport, die sich mit dem
 * Scroll-Fortschritt füllt. Vercel/Linear-Pattern — sehr subtiles
 * Premium-Signal, das beim Scrollen Orientierung gibt und gleichzeitig
 * die Brand-Farbe nochmal aufgreift.
 *
 * Bewusst NICHT als Top-Border, sondern als `fixed top-0`, damit
 * sich der Header darüber nicht verschiebt. z-Index hoch genug, dass
 * sie über allem liegt, aber unter dem Mobile-Menü.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      el.style.display = "none";
      return;
    }

    let ticking = false;
    const update = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      el.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[#C9A24F] via-[#D9B670] to-[#C9A24F] transition-transform duration-75 ease-out"
      ref={ref}
      style={{ transform: "scaleX(0)" }}
    />
  );
}
