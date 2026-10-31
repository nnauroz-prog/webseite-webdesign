"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getPaketBySlug } from "@/lib/pakete-data";

/**
 * Preise als Abfahrtstafel „Anleger Sitalo“: Linien-Schilder, Paketnamen
 * und Preise in Punktmatrix, Uhrzeit für Hamburg, Lauftext mit dem
 * Monatsbeitrag. Die Preise blättern beim ersten Sichtkontakt einmal
 * durch. Preise kommen aus lib/pakete-data.ts.
 */

const ROWS = [
  { slug: "starter", linie: "S", desc: "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten." },
  { slug: "business", linie: "B", desc: "Bis zu fünf Unterseiten, mit Team, Leistungen und Galerie." },
  { slug: "premium", linie: "P", desc: "Eigene Struktur. Speisekarte, Angebote oder Termine pflegen Sie selbst." },
] as const;

function priceOf(slug: string) {
  const p = getPaketBySlug(slug);
  if (!p) throw new Error(`Paket "${slug}" fehlt in lib/pakete-data.ts`);
  // „ab 2.499 €" → „2.499"
  return { name: p.name, value: p.setup.replace(/^ab\s*/, "").replace(/\s*€$/, ""), monthly: p.monthly };
}

const fmt = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });

function Flip({ value, run, index }: { value: string; run: boolean; index: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame > 9 + index * 3) {
        setShown(value);
        window.clearInterval(id);
        return;
      }
      setShown(value.replace(/\d/g, () => String(Math.floor(Math.random() * 10))));
    }, 55);
    return () => window.clearInterval(id);
  }, [run, value, index]);
  const parts = shown.split(".");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 ? <span className="led-dot">.</span> : null}
          {part}
        </span>
      ))}
    </>
  );
}

export function Abfahrtstafel() {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string | null>(null);
  const [run, setRun] = useState(false);
  const rows = ROWS.map((r) => ({ ...r, ...priceOf(r.slug) }));
  const starterMonthly = rows[0].monthly.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ticker = [
    `Monatsbeitrag ab ${starterMonthly} für Hosting und kleine Änderungen`,
    "Kleine Seiten oft in 1–2 Werktagen online",
    "Telefon 0160 7621876",
  ];

  return (
    <div ref={ref} className="board">
      <div className="board-in">
        <div className="flex items-center gap-3.5 border-b border-[#2a2d2f] px-[1.35rem] py-4">
          <span className="text-[15px] uppercase tracking-[0.14em]" style={{ fontStretch: "115%", fontWeight: 760 }}>
            Abfahrten
          </span>
          <span className="text-stahl-hell hidden font-mono text-[12px] sm:inline">Anleger Sitalo</span>
          <span className="led ml-auto text-[1.5rem] leading-none" aria-label={time ? `Uhrzeit in Hamburg: ${time}` : undefined}>
            {time ?? "--:--"}
          </span>
        </div>
        <div
          aria-hidden="true"
          className="board-row hidden py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#878d8e] sm:grid"
        >
          <span>Linie</span>
          <span>Paket</span>
          <span>Was dabei ist</span>
          <span className="text-right">ab</span>
        </div>
        {rows.map((r, i) => (
          <Link key={r.slug} href={`/pakete/${r.slug}`} className="board-row">
            <span className="board-linie" aria-hidden="true">
              {r.linie}
            </span>
            <span className="led text-[1.4rem] leading-none sm:text-[1.6rem]">{r.name}</span>
            <span className="board-desc font-mono text-[13px] leading-snug text-[#b9bebf]">{r.desc}</span>
            <span className="board-price led text-right text-[1.4rem] leading-none whitespace-nowrap sm:text-[1.6rem]">
              <span className="sr-only">ab </span>
              <Flip value={r.value} run={run} index={i} /> €
            </span>
          </Link>
        ))}
        <div className="board-ticker">
          <p className="sr-only">{ticker.join(". ")}.</p>
          <div className="led" aria-hidden="true">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
