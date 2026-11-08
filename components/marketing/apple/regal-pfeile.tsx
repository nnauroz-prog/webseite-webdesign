"use client";

import { useEffect, useState } from "react";

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
      setAnfang(spur.scrollLeft <= 4);
      setEnde(spur.scrollLeft + spur.clientWidth >= spur.scrollWidth - 4);
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
    const schritt = karte ? karte.getBoundingClientRect().width + 20 : spur.clientWidth * 0.8;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    spur.scrollBy({ left: richtung * schritt, behavior: ruhig ? "auto" : "smooth" });
  };

  return (
    <div className="regal-pfeile">
      <button
        type="button"
        className="regal-pfeil"
        onClick={() => blaettern(-1)}
        disabled={anfang}
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
        onClick={() => blaettern(1)}
        disabled={ende}
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
