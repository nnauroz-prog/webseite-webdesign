"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { imBildBeimStart } from "@/components/marketing/hafen/reveal";

/**
 * Client-Hülle des Containerstapels (container-stack.tsx). Das Markup
 * kommt vom Server; hier werden nur Beobachter und Attribute gesetzt.
 *
 * - Am Rechner läuft der ganze Stapel ein, sobald gut ein Drittel zu
 *   sehen ist (Verzögerung je Container aus `delays`).
 * - Mobil Reihe für Reihe, sobald sie ins Bild kommt.
 * - Bekommt ein noch nicht eingelaufener Container den Tastaturfokus,
 *   steht er sofort da (das CSS zeigt ihn mit :focus-within schon vorher).
 * - Reduzierte Bewegung, kein IntersectionObserver oder beim Laden schon
 *   im Bild: nichts wird versteckt.
 */
export function StapelMotor({ delays, children }: { delays: number[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const delaysKey = delays.join(",");

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const verzug = delaysKey.split(",").map(Number);
    const boxes = Array.from(root.querySelectorAll<HTMLElement>(".box"));
    const land = (b: HTMLElement, delay: number) => {
      if (b.dataset.phase) return;
      b.style.setProperty("--drop-delay", `${delay}ms`);
      b.dataset.phase = "in";
    };
    let io: IntersectionObserver | undefined;

    const scharf = () => {
      root.dataset.armed = "";
      if (window.matchMedia("(min-width: 1024px)").matches) {
        // Ganzer Stapel auf einmal, sobald gut ein Drittel zu sehen ist.
        const beob = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            boxes.forEach((b, i) => land(b, verzug[i] ?? 0));
            beob.disconnect();
          },
          { threshold: 0.32 },
        );
        beob.observe(root);
        return beob;
      }
      // Mobil: jede Reihe für sich. Was gleichzeitig ins Bild kommt,
      // läuft von links nach rechts gestaffelt ein.
      const beob = new IntersectionObserver(
        (entries) => {
          entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target as HTMLElement)
            .sort((a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft)
            .forEach((b, i) => {
              beob.unobserve(b);
              land(b, i * 140);
            });
        },
        { threshold: 0.3, rootMargin: "0px 0px -6% 0px" },
      );
      boxes.forEach((b) => beob.observe(b));
      return beob;
    };

    // Tastatur: Ein fokussierter Container läuft sofort ein, ohne Verzug.
    const onFocus = (e: FocusEvent) => {
      const b = (e.target as Element | null)?.closest?.<HTMLElement>(".box");
      if (!b || b.dataset.phase || root.dataset.armed === undefined) return;
      io?.unobserve(b);
      land(b, 0);
    };
    root.addEventListener("focusin", onFocus);

    // Schon im Bild (z. B. Sprung per Anker): nichts verstecken. Gefragt
    // per IntersectionObserver, damit das Hydrieren kein Layout erzwingt.
    const abbrechen = imBildBeimStart(root, 0.9, (imBild) => {
      if (!imBild) io = scharf();
    });

    return () => {
      abbrechen();
      io?.disconnect();
      root.removeEventListener("focusin", onFocus);
      delete root.dataset.armed;
      boxes.forEach((b) => {
        delete b.dataset.phase;
        b.style.removeProperty("--drop-delay");
      });
    };
  }, [delaysKey]);

  return (
    <div ref={ref} className="stack">
      {children}
    </div>
  );
}
