"use client";

import { useEffect, useRef } from "react";

/**
 * Ablauf als Fährlinie mit vier Halten. Beim Scrollen fährt eine kleine
 * Hafenfähre die Linie entlang und färbt sie orange. Mobil steht die
 * Linie senkrecht, die Fähre entfällt. Bei reduzierter Bewegung ist die
 * Linie voll gezeichnet und die Fähre steht am Endhalt.
 */

const HALTE = [
  {
    halt: "Halt 1",
    title: "Anruf",
    text: "Sie erzählen uns eine Viertelstunde lang, was Ihr Betrieb macht. Danach bekommen Sie einen Festpreis und einen Termin.",
  },
  {
    halt: "Halt 2",
    title: "Entwurf",
    text: "Wir bauen die Seite mit Ihren Fotos und Stichpunkten. Fehlt etwas, rufen wir kurz an.",
  },
  {
    halt: "Halt 3",
    title: "Test-Link",
    text: "Sie sehen sich alles in Ruhe an, am Handy und am Rechner, und sagen uns, was anders werden soll.",
  },
  {
    halt: "Endhalt",
    title: "Online",
    text: "Die Seite geht unter Ihrer Adresse live. Kleine Seiten sind oft nach ein bis zwei Werktagen so weit.",
  },
];

export function Faehrlinie() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.82 - r.top) / (r.height + vh * 0.25)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="route">
      <div aria-hidden="true" className="route-line">
        <i />
      </div>
      <svg className="route-ferry" viewBox="0 0 84 52" aria-hidden="true">
        {/* Hafenfähre: Rumpf, Fahrgastdeck, Steuerhaus, Mast */}
        <path d="M2 36H82L75 46H9Z" fill="#EEEEEB" />
        <path d="M2 36H82L80.5 39H3.5Z" fill="#F45B1E" />
        <path d="M13 36V25H67L72 36Z" fill="#EEEEEB" />
        <path d="M17 28H24V32H17Z M28 28H35V32H28Z M39 28H46V32H39Z M50 28H57V32H50Z" fill="#1B1D1E" />
        <path d="M28 25V17H51L54 25Z" fill="#EEEEEB" />
        <path d="M32 19.5H49V22.5H32Z" fill="#1B1D1E" />
        <path d="M40 17V8H42V17Z" fill="#EEEEEB" />
        <path d="M42 9H48L42 12Z" fill="#F45B1E" />
      </svg>
      <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
        {HALTE.map((h) => (
          <li key={h.title} className="stop">
            <span className="label-mono text-gold">{h.halt}</span>
            <h3 className="mt-2 text-[1.6rem] tracking-[-0.02em]">{h.title}</h3>
            <p className="text-stahl-hell mt-2.5 max-w-[26em] text-[15.5px] leading-relaxed">{h.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
