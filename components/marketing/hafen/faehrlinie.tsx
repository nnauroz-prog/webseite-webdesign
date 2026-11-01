"use client";

import { useEffect, useId, useRef } from "react";

import { imBildBeimStart, useLaufzeit } from "@/components/marketing/hafen/reveal";

/**
 * Ablauf als Fährlinie mit vier Halten (Styles: app/hafen.css, Block
 * „Ablauf“).
 *
 * Am Rechner fährt beim Scrollen eine kleine Hafenfähre die Linie
 * entlang und färbt sie orange. Hinter ihr läuft die Heckwelle, kräftig
 * solange sie Fahrt voraus macht, schwach wenn sie treibt. Erreicht die
 * Linie einen Halt, füllt sich der Kreis, ein Ring läuft einmal aus und
 * Titel und Text blenden auf. Mobil steht die Linie senkrecht, die Fähre
 * entfällt, die Halte färben sich der Reihe nach.
 *
 * Ohne Script und bei reduzierter Bewegung ist die Linie voll gezeichnet,
 * alle Halte sind erreicht und die Fähre liegt am Endhalt.
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
  const active = useRef(true);
  const kick = useRef<() => void>(() => {});
  const gid = `f${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Schleife nur, solange die Linie im Bild ist.
  useLaufzeit(ref, (run) => {
    active.current = run;
    if (run) kick.current();
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stops = Array.from(el.querySelectorAll<HTMLElement>(".stop"));
    const vertical = window.matchMedia("(max-width: 767px)");

    // Lage der Halte auf der Linie (Mitte des Kreises), relativ zur Linie.
    let marks: number[] = [];
    let length = 1;
    const measure = () => {
      const v = vertical.matches;
      marks = stops.map((s) => (v ? s.offsetTop + 12 - 6 : s.offsetLeft + 10));
      if (v) {
        // Senkrecht endet die Linie am Endhalt.
        length = Math.max(1, marks[marks.length - 1]);
        el.style.setProperty("--line-bottom", `${el.offsetHeight - 6 - length}px`);
      } else {
        length = el.offsetWidth;
        el.style.removeProperty("--line-bottom");
      }
    };

    // Reduzierte Bewegung: Linie voll, Fähre am Endhalt, nichts läuft.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      measure();
      window.addEventListener("resize", measure, { passive: true });
      return () => window.removeEventListener("resize", measure);
    }

    let frame = 0;
    let p = -1;
    let v = 0;
    let target = 0;
    const reached = stops.map(() => false);

    const progress = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (vertical.matches) {
        // Die Füllung folgt einer Lesekante bei 62 % der Bildhöhe.
        return Math.max(0, Math.min(1, (vh * 0.62 - r.top - 6) / length));
      }
      return Math.max(0, Math.min(1, (vh * 0.82 - r.top) / (r.height + vh * 0.25)));
    };

    const tick = () => {
      frame = 0;
      const next = progress();
      const dp = p < 0 ? 0 : next - p;
      p = next;
      // Heckwelle: Fahrt voraus hebt sie an, sonst klingt sie ab.
      // Zwischen den Anlegern treibt die Fähre und zieht eine schwache Spur.
      const underway = p > 0.015 && p < 0.985;
      target = Math.max(underway ? 0.4 : 0, Math.min(1, dp * 40));
      v += (target - v) * (target > v ? 0.35 : 0.06);
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--v", v.toFixed(3));

      const fill = p * length;
      stops.forEach((s, i) => {
        const now = fill >= marks[i];
        if (now === reached[i]) return;
        reached[i] = now;
        if (now) s.dataset.reached = "";
        else delete s.dataset.reached;
      });

      if (active.current && Math.abs(v - target) > 0.004) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame && active.current) frame = requestAnimationFrame(tick);
    };
    kick.current = schedule;

    const onResize = () => {
      measure();
      schedule();
    };
    // Erst messen und scharf schalten, wenn der Browser ohnehin ein Layout
    // hat (erster IntersectionObserver-Rückruf), nicht mitten im Hydrieren.
    const abbrechen = imBildBeimStart(el, 1, () => {
      measure();
      el.dataset.armed = "";
      tick();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      vertical.addEventListener("change", onResize);
    });
    return () => {
      abbrechen();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      vertical.removeEventListener("change", onResize);
      if (frame) cancelAnimationFrame(frame);
      kick.current = () => {};
      delete el.dataset.armed;
      el.style.removeProperty("--line-bottom");
      stops.forEach((s) => delete s.dataset.reached);
    };
  }, []);

  return (
    <div ref={ref} className="route">
      <div aria-hidden="true" className="route-line">
        <i />
      </div>
      <div className="route-ferry" aria-hidden="true">
        <div className="route-slide">
          {/* Heckwelle: zwei auseinanderlaufende Kämme und Schaum im Kielwasser */}
          <svg className="route-wake" viewBox="0 0 170 22" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`${gid}-wake`} x1="170" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#EEEEEB" stopOpacity="0.85" />
                <stop offset="1" stopColor="#EEEEEB" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="none" stroke={`url(#${gid}-wake)`} strokeLinecap="round">
              <path d="M170 11C140 10 90 6 0 2" strokeWidth="1.2" />
              <path d="M170 11C140 12 90 16 0 20" strokeWidth="1.2" />
              {/* Querwellen zwischen den Kämmen */}
              <path d="M150 8.6Q146 11 150 13.4M122 7Q116 11 122 15M92 5.6Q85 11 92 16.4" strokeWidth="0.9" />
              <path className="route-foam" d="M168 11H20" strokeWidth="2.2" />
            </g>
          </svg>
          {/* Hafenfähre, Bug rechts: Rumpf, Fahrgastdeck, Steuerhaus, Mast */}
          <svg className="route-boat" viewBox="0 0 84 52">
            <path d="M3 36H83L74 46H9Z" fill="#EEEEEB" />
            <path d="M3 36H83L81.6 38.4H4.4Z" fill="#F45B1E" />
            <path d="M12 36V25H66L72 36Z" fill="#EEEEEB" />
            <path d="M16 28H23V32H16Z M27 28H34V32H27Z M38 28H45V32H38Z M49 28H56V32H49Z" fill="#1B1D1E" />
            <path d="M30 25V17H52L56 25Z" fill="#EEEEEB" />
            <path d="M34 19.5H51V22.5H34Z" fill="#1B1D1E" />
            <path d="M41 17V8H43V17Z" fill="#EEEEEB" />
            {/* Flagge weht nach achtern */}
            <path d="M41 9H35L41 12Z" fill="#F45B1E" />
          </svg>
        </div>
      </div>
      <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
        {HALTE.map((h) => (
          <li key={h.title} className="stop">
            <span className="stop-dot" aria-hidden="true">
              <i />
            </span>
            <div className="stop-body">
              <span className="label-mono text-gold">{h.halt}</span>
              <h3 className="mt-2 text-[1.6rem] tracking-[-0.02em]">{h.title}</h3>
              <p className="text-stahl-hell mt-2.5 max-w-[26em] text-[15.5px] leading-relaxed">{h.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
