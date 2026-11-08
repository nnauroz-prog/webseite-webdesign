"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type ProduktleisteLink = { href: string; label: string };

/**
 * Lokale Produktleiste im Apple-Stil (.produktleiste, app/apple.css):
 * 52 px, links der Seitenname groß, rechts kleine Anker-Links und eine
 * kleine orange Pille. Klebt nach dem Scrollen (position: sticky), das
 * Glas wird beim Kleben dichter (nur background-color wechselt).
 *
 * - „Kleben“ erkennt ein IntersectionObserver auf einem 1-px-Wächter
 *   über der Leiste, kein Scroll-Listener.
 * - Die aktive Sektion (aria-current) setzt ein zweiter Observer.
 * - Mobil (< 834 px) klappen die Links hinter einen Chevron-Knopf
 *   (44 × 44), die Pille bleibt sichtbar.
 *
 * Einbau: als DIREKTES Kind des Seiten-Wrappers rendern, direkt nach
 * <MarketingHeader cta={false} />, nicht in einem Vorfahren mit
 * overflow: hidden, transform oder filter – sonst klebt sie am iPhone
 * nicht. Die Anker (#…) müssen auf der Seite existieren.
 */
export function Produktleiste({
  titel,
  titelHref = "#main",
  links,
  cta,
}: {
  titel: string;
  titelHref?: string;
  links: ProduktleisteLink[];
  cta?: { href: string; label: string };
}) {
  const waechter = useRef<HTMLDivElement | null>(null);
  const [klebt, setKlebt] = useState(false);
  const [offen, setOffen] = useState(false);
  const [aktiv, setAktiv] = useState<string | null>(null);
  const [dunkel, setDunkel] = useState(false);
  const leiste = useRef<HTMLElement | null>(null);
  const panelId = useId();

  // Über schwarzen Flächen wechselt das Glas auf die dunkle Variante, wie
  // Apple es auf dunklen Seiten tut. Zählt jede schwarze Fläche, die
  // (fast) so breit ist wie das Fenster: Abschnitte, am Handy auch die
  // schwarzen Kacheln und Karten. Beobachtet wird die erste Pixelzeile
  // UNTER der Leiste: Die Leiste zeigt die Farbe dessen, was direkt unter
  // ihr weitergeht. Ein Abschnitt, der als Sprungziel genau an der
  // Unterkante beginnt, schaltet sie also hell, auch wenn hinter dem Glas
  // noch das Ende des vorigen schwarzen Abschnitts liegt.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    let io: IntersectionObserver | null = null;
    const dunkleFlaechen = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("main :is(.flaeche-schwarz, .bg-black, .karte-schwarz, [data-flaeche-dunkel])"),
      ).filter((el) => el.offsetWidth >= window.innerWidth * 0.85);
    const start = () => {
      io?.disconnect();
      const ziele = dunkleFlaechen();
      if (!ziele.length) return;
      const h = leiste.current?.offsetHeight ?? 52;
      // Streifen 2 px unter der Unterkante: Eine Fläche, die genau an der
      // Kante endet, berührt ihn nicht (IO zählt bloßes Berühren mit).
      const oben = h + 2;
      const unten = Math.max(0, window.innerHeight - oben - 1);
      const drin = new Set<Element>();
      io = new IntersectionObserver(
        (eintraege) => {
          for (const e of eintraege) {
            if (e.isIntersecting) drin.add(e.target);
            else drin.delete(e.target);
          }
          setDunkel(drin.size > 0);
        },
        { rootMargin: `-${oben}px 0px -${unten}px 0px` },
      );
      ziele.forEach((z) => io!.observe(z));
    };
    start();
    let t: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(start, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      io?.disconnect();
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const el = waechter.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      setKlebt(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const ziele = links
      .filter((l) => l.href.startsWith("#"))
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((e): e is HTMLElement => !!e);
    if (!ziele.length) return;
    const sichtbar = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) sichtbar.set(e.target.id, e.isIntersecting);
        const erstes = ziele.find((z) => sichtbar.get(z.id));
        setAktiv(erstes ? `#${erstes.id}` : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ziele.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, [links]);

  // Offenes Abschnittsmenü schließt wie bei Apple: Escape, ein Tipp
  // außerhalb der Leiste (auch auf den Schleier) oder Scrollen.
  useEffect(() => {
    if (!offen) return;
    const zu = () => setOffen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") zu();
    };
    const onPointer = (e: PointerEvent) => {
      const ziel = e.target as Element;
      if (!leiste.current?.contains(ziel) || ziel.classList?.contains("produktleiste-schleier")) zu();
    };
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 8) zu();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [offen]);

  return (
    <>
      <div ref={waechter} aria-hidden="true" className="-mb-px h-px" />
      <nav
        ref={leiste}
        aria-label="Seitennavigation"
        data-produktleiste=""
        data-klebt={klebt}
        data-dunkel={klebt && dunkel && !offen}
        data-offen={offen}
        className="produktleiste print:hidden"
      >
        <div className="produktleiste-innen">
          <a href={titelHref} className="produktleiste-titel" onClick={() => setOffen(false)}>
            <span className="truncate">{titel}</span>
          </a>
          <div className="produktleiste-rechts">
            <ul className="produktleiste-links">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="produktleiste-link"
                    aria-current={aktiv === l.href ? "true" : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            {links.length ? (
              <button
                type="button"
                className="produktleiste-toggle"
                aria-expanded={offen}
                aria-controls={panelId}
                aria-label={offen ? "Abschnitte ausblenden" : "Abschnitte zeigen"}
                onClick={() => setOffen((v) => !v)}
              >
                <svg width="12" height="7" viewBox="0 0 12 7" aria-hidden="true">
                  <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
            {cta ? (
              cta.href.startsWith("#") ? (
                <a href={cta.href} className="btn-signal btn-klein ml-1">
                  {cta.label}
                </a>
              ) : (
                <Link href={cta.href} className="btn-signal btn-klein ml-1">
                  {cta.label}
                </Link>
              )
            ) : null}
          </div>
        </div>
        {/* Schleier unter dem offenen Menü: dämpft die Seite, ein Tipp
            darauf schließt (pointerdown oben). */}
        {offen ? <div aria-hidden="true" className="produktleiste-schleier" /> : null}
        {links.length ? (
          <div id={panelId} hidden={!offen} className="produktleiste-panel">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOffen(false)}
                    aria-current={aktiv === l.href ? "true" : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </>
  );
}
