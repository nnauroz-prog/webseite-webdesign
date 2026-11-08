"use client";

import { useEffect, useState } from "react";

/** Fehlen weniger als so viele Pixel bis zum Rand, gilt er als erreicht. */
const REST = 24;

/**
 * Seitenpfeile fürs Regal (ab 1024 px sichtbar, .regal-pfeile). Blättert
 * die Spur mit der id spurId um etwa eine Kartenbreite weiter und
 * schaltet die Pfeile an den Enden ab. Scroll-Listener nur auf der Spur,
 * passiv und per requestAnimationFrame gedrosselt.
 */
export function RegalPfeile({ spurId, label }: { spurId: string; label: string }) {
  const [anfang, setAnfang] = useState(true);
  const [ende, setEnde] = useState(false);

  useEffect(() => {
    const spur = document.getElementById(spurId);
    if (!spur) return;
    let raf = 0;
    const pruefen = () => {
      raf = 0;
      setAnfang(spur.scrollLeft <= REST);
      setEnde(spur.scrollLeft + spur.clientWidth >= spur.scrollWidth - REST);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pruefen);
    };
    pruefen();
    spur.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      spur.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [spurId]);

  const blaettern = (richtung: 1 | -1) => {
    const spur = document.getElementById(spurId);
    if (!spur) return;
    const karte = spur.querySelector("li");
    const liste = karte?.parentElement;
    const abstand = liste ? parseFloat(getComputedStyle(liste).columnGap) || 0 : 0;
    const schritt = karte ? karte.getBoundingClientRect().width + abstand : spur.clientWidth * 0.8;
    const max = spur.scrollWidth - spur.clientWidth;
    let ziel = spur.scrollLeft + richtung * schritt;
    // Geht der Rest nicht in Kartenschritten auf, beim letzten Schritt
    // ganz bis ans Ende: Die letzte Karte steht dann bündig an der
    // Inhaltskante, und kein Mini-Schritt von 20 px bleibt übrig.
    if (max - ziel < schritt * 0.5) ziel = max;
    if (ziel < schritt * 0.5) ziel = 0;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    spur.scrollTo({ left: ziel, behavior: ruhig ? "auto" : "smooth" });
  };

  return (
    <div className="regal-pfeile">
      <button
        type="button"
        className="regal-pfeil"
        onClick={() => {
          if (!anfang) blaettern(-1);
        }}
        aria-disabled={anfang}
        aria-label={`${label}: zurück`}
        aria-controls={spurId}
      >
        <svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true">
          <path d="M8.5 1.5L1.5 9l7 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className="regal-pfeil"
        onClick={() => {
          if (!ende) blaettern(1);
        }}
        aria-disabled={ende}
        aria-label={`${label}: weiter`}
        aria-controls={spurId}
      >
        <svg width="10" height="18" viewBox="0 0 10 18" aria-hidden="true">
          <path d="M1.5 1.5L8.5 9l-7 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
