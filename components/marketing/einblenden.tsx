"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Weiches Einblenden beim Scrollen, einmal im Layout eingesetzt.
 *
 * Elemente mit data-ein blenden ein, sobald sie ins Bild kommen;
 * data-ein="reihe" staffelt die direkten Kinder (Karten, Kacheln).
 *
 * Regeln:
 * - Ohne JavaScript, bei reduzierter Bewegung und im Druck ist nichts
 *   versteckt: Der Startzustand gilt nur unter html.ein-bereit, und die
 *   Klasse wird erst gesetzt, nachdem feststeht, was schon im Bild ist.
 * - Was beim Laden schon zu sehen ist (oder darüber liegt), bleibt
 *   stehen (data-ein-da="0"). Nur was später kommt, bewegt sich ("1").
 * - Jedes Element genau einmal.
 */
export function Einblenden() {
  const pfad = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    // Seitenwechsel: erst neu messen, dann wieder verstecken.
    root.classList.remove("ein-bereit");
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const elemente = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ein]:not([data-ein-da])"),
    );
    if (elemente.length === 0) return;

    let erste = true;
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          const el = e.target as HTMLElement;
          if (erste) {
            const r = e.boundingClientRect;
            // Schon sichtbar oder oberhalb: ohne Bewegung stehen lassen.
            if (e.isIntersecting || (r.height > 0 && r.top < window.innerHeight)) {
              el.dataset.einDa = "0";
              io.unobserve(el);
            }
          } else if (e.isIntersecting) {
            el.dataset.einDa = "1";
            io.unobserve(el);
          }
        }
        if (erste) {
          erste = false;
          root.classList.add("ein-bereit");
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of elemente) io.observe(el);
    return () => io.disconnect();
  }, [pfad]);

  return null;
}
