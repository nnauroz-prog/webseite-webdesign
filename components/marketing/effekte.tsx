"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Kleine Besonderheiten, einmal im Layout eingesetzt:
 *
 * 1. Fähre als Lesefortschritt: Am oberen Bildrand fährt eine kleine
 *    Fähre von links nach rechts, so weit wie die Seite gescrollt ist,
 *    und zieht eine orange Linie hinter sich her.
 * 2. Karten kippen am Rechner leicht zum Mauszeiger ([data-kipp]) und
 *    bekommen einen Lichtfleck. Nur mit feinem Zeiger, nie am Handy.
 *
 * Bei reduzierter Bewegung bleibt beides aus. Nichts davon trägt Inhalt.
 */
export function Effekte() {
  const pfad = usePathname();
  const spurRef = useRef<HTMLDivElement | null>(null);
  const aus = pfad?.startsWith("/admin") || pfad?.startsWith("/angebot/");

  useEffect(() => {
    const spur = spurRef.current;
    if (!spur || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let raf = 0;
    const messen = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 200 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      spur.style.setProperty("--p", p.toFixed(4));
      spur.dataset.an = p > 0.012 ? "1" : "0";
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(messen);
    };
    messen();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pfad]);

  useEffect(() => {
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let aktiv: HTMLElement | null = null;
    const loesen = () => {
      if (!aktiv) return;
      aktiv.removeAttribute("data-kipp-an");
      aktiv.style.removeProperty("--kx");
      aktiv.style.removeProperty("--ky");
      aktiv = null;
    };
    const onMove = (e: PointerEvent) => {
      const ziel =
        e.target instanceof Element
          ? e.target.closest<HTMLElement>("[data-kipp]")
          : null;
      if (ziel !== aktiv) loesen();
      if (!ziel) return;
      aktiv = ziel;
      const r = ziel.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ziel.setAttribute("data-kipp-an", "");
      ziel.style.setProperty("--kx", `${((x - 0.5) * 5).toFixed(2)}deg`);
      ziel.style.setProperty("--ky", `${((0.5 - y) * 5).toFixed(2)}deg`);
      ziel.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      ziel.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", loesen);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", loesen);
      loesen();
    };
  }, []);

  if (aus) return null;
  return (
    <div
      ref={spurRef}
      className="faehr-fortschritt"
      data-an="0"
      aria-hidden="true"
    >
      <span className="faehr-linie" />
      <span className="faehr-boot">
        <svg viewBox="0 0 26 14" width="26" height="14" focusable="false">
          <path
            d="M1 8h24l-2.6 4.2a2 2 0 0 1-1.7.8H5.3a2 2 0 0 1-1.7-.8z"
            fill="#1d1d1f"
          />
          <path d="M1.6 8h22.8l-.7 1.2H2.3z" fill="#f45b1e" />
          <rect
            x="6"
            y="3.2"
            width="12"
            height="4.8"
            rx="1"
            fill="#fff"
            stroke="#1d1d1f"
            strokeWidth="0.8"
          />
          <rect x="8" y="4.6" width="2" height="1.6" fill="#1d1d1f" />
          <rect x="11.2" y="4.6" width="2" height="1.6" fill="#1d1d1f" />
          <rect x="14.4" y="4.6" width="2" height="1.6" fill="#1d1d1f" />
          <rect x="15.4" y="0.6" width="1.8" height="2.6" fill="#f45b1e" />
        </svg>
      </span>
    </div>
  );
}
