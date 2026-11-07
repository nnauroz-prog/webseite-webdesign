"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * „Nach oben“ am Rechner: ein Teer-Quadrat (44 × 44) unten rechts, das
 * nach zwei Bildschirmhöhen erscheint. Beim Zeigen füllt es sich von
 * links in Signal-Orange wie .btn-signal (app/globals.css, .nach-oben).
 *
 * Unter 768 px ausgeblendet: Auf dem iPhone springt ein Tippen auf die
 * Statusleiste nach oben, und unten steht schon die CTA-Leiste.
 *
 * Sprung: Ab drei Bildschirmhöhen sofort statt eines langen Wischers,
 * darunter weich; bei reduzierter Bewegung immer sofort.
 *
 * Eingebunden über MarketingFooter, damit jede Marketingseite es hat.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const pruefen = () => {
      raf = 0;
      setVisible(window.scrollY > window.innerHeight * 2);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(pruefen);
    };
    pruefen();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const hoch = () => {
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weit = window.scrollY > window.innerHeight * 3;
    window.scrollTo({ top: 0, behavior: ruhig || weit ? "instant" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={hoch}
      aria-label="Zurück nach oben"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-sichtbar={visible}
      className="nach-oben print:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
