"use client";

import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";

import { imBildBeimStart, useLaufzeit } from "@/components/marketing/hafen/reveal";

import type { PaketeKurz } from "./paket-kurz";

/**
 * Preise als Abfahrtstafel „Anleger Sitalo“ (Styles: app/hafen.css,
 * Block „Preise“). Linien-Schilder, Paketnamen in Fallblatt-Modulen,
 * Preise in Punktmatrix, Uhrzeit für Hamburg, Lauftext mit dem
 * Monatsbeitrag. Preise kommen aus lib/pakete-data.ts, auf dem Server
 * aufgelöst und als Prop `pakete` übergeben (paket-kurz.ts).
 *
 * Bewegung:
 * - Beim ersten Sichtkontakt blättern die Paketnamen wie eine
 *   Fallblattanzeige von links nach rechts ein. Die Preise stehen fest
 *   (ein Festpreis würfelt nicht).
 * - Der Doppelpunkt der Uhr blinkt im Sekundentakt, der Lauftext zieht
 *   langsam durch; beides nur, solange die Tafel im Bild ist.
 * - Zeiger oder Tastaturfokus auf einer Zeile: LED-Pfeil, Zeile heller.
 * Ohne Script und bei reduzierter Bewegung steht alles sofort.
 */

const ROWS = [
  { slug: "starter", linie: "S", desc: "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten." },
  { slug: "business", linie: "B", desc: "Bis zu fünf Unterseiten, mit Team, Leistungen und Galerie." },
  { slug: "premium", linie: "P", desc: "Eigene Struktur. Speisekarte, Angebote oder Termine pflegen Sie selbst." },
] as const;

function priceOf(pakete: PaketeKurz, slug: (typeof ROWS)[number]["slug"]) {
  const p = pakete[slug];
  // „ab 2.499 €" → „2.499"
  return { name: p.name, value: p.setup.replace(/^ab\s*/, "").replace(/\s*€$/, ""), monthly: p.monthly };
}

const fmt = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });

/* ------------------------------------------------------------------
 * Fallblatt: ein Modul pro Zeichen mit vier Blättern.
 *   .ft  obere Hälfte, steht (neues Zeichen)
 *   .fb  untere Hälfte, steht (altes Zeichen, bis das Blatt fällt)
 *   .ff  obere Hälfte des alten Zeichens, klappt nach unten weg
 *   .fl  untere Hälfte des neuen Zeichens, fällt herab
 * Server und Browser rendern das Zielwort; das Blättern setzt nur
 * Textinhalte und Web-Animations per Ref, React rendert dabei nicht.
 * ---------------------------------------------------------------- */

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FLAP_MS = 78;

type Cell = { ft: HTMLElement; fb: HTMLElement; ff: HTMLElement; fl: HTMLElement; cur: string };

function cellsOf(root: HTMLElement): Cell[] {
  return Array.from(root.querySelectorAll<HTMLElement>(".flap-cell")).map((c) => {
    const [ft, fb, ff, fl] = Array.from(c.children) as HTMLElement[];
    return { ft, fb, ff, fl, cur: ft.textContent ?? "" };
  });
}

function setAll(cell: Cell, ch: string) {
  cell.ft.textContent = ch;
  cell.fb.textContent = ch;
  cell.ff.textContent = ch;
  cell.fl.textContent = ch;
  cell.cur = ch;
}

function flip(cell: Cell, next: string) {
  const prev = cell.cur;
  cell.ft.textContent = next;
  cell.fb.textContent = prev;
  cell.ff.textContent = prev;
  cell.fl.textContent = next;
  cell.cur = next;
  const half = FLAP_MS / 2;
  cell.ff.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], {
    duration: half,
    easing: "cubic-bezier(0.5, 0, 1, 0.6)",
  });
  cell.fl.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], {
    duration: half,
    delay: half,
    easing: "cubic-bezier(0, 0.4, 0.5, 1)",
    fill: "backwards",
  });
}

const Fallblatt = memo(function Fallblatt({ text, go, armed, delay }: { text: string; go: boolean; armed: boolean; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Vor dem ersten Sichtkontakt: leere Module, damit das Wort sichtbar
  // einblättert. Nur wenn die Tafel beim Laden noch nicht im Bild war.
  useEffect(() => {
    const root = ref.current;
    if (!root || !armed) return;
    const cells = cellsOf(root);
    cells.forEach((c) => setAll(c, " "));
    return () => cells.forEach((c, i) => setAll(c, text[i] ?? " "));
  }, [armed, text]);

  useEffect(() => {
    const root = ref.current;
    if (!root || !go) return;
    const cells = cellsOf(root);
    // Jedes Modul blättert eine eigene Zahl Blätter durch, weiter
    // rechts etwas mehr: so läuft das Wort von links nach rechts ein.
    const plans = cells.map((cell, i) => {
      const steps = 3 + i + Math.floor(Math.random() * 4);
      let k = Math.floor(Math.random() * FLAP_CHARS.length);
      const seq: string[] = [];
      for (let s = 0; s < steps; s++) seq.push(FLAP_CHARS[k++ % FLAP_CHARS.length]);
      seq.push(text[i] ?? " ");
      return { cell, seq, done: 0, start: delay + i * 36 };
    });
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = now - t0;
      let busy = false;
      for (const pl of plans) {
        const due = Math.min(pl.seq.length, Math.floor((t - pl.start) / FLAP_MS) + 1);
        if (t >= pl.start && due > pl.done) {
          pl.done = due;
          flip(pl.cell, pl.seq[due - 1]);
        }
        if (pl.done < pl.seq.length) busy = true;
      }
      if (busy) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      cells.forEach((c, i) => {
        c.ff.getAnimations().forEach((a) => a.cancel());
        c.fl.getAnimations().forEach((a) => a.cancel());
        setAll(c, text[i] ?? " ");
      });
    };
  }, [go, text, delay]);

  return (
    <span ref={ref} className="flap" aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span key={i} className="flap-cell">
          <span className="ft">{ch}</span>
          <span className="fb">{ch}</span>
          <span className="ff">{ch}</span>
          <span className="fl">{ch}</span>
        </span>
      ))}
    </span>
  );
});

/** Preis in Punktmatrix, Tausenderpunkt aus der Mono-Schrift. */
function Ziffern({ value }: { value: string }) {
  const parts = value.split(".");
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

/** Uhrzeit Hamburg. Der Doppelpunkt blinkt per CSS im Takt der echten Sekunde. */
function Uhr() {
  const [time, setTime] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const now = new Date();
      setTime(fmt.format(now));
      setOffset(now.getMilliseconds());
      // Auf den nächsten Minutenwechsel warten.
      timer = window.setTimeout(tick, 60000 - now.getSeconds() * 1000 - now.getMilliseconds() + 30);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  const [hh, mm] = (time ?? "--:--").split(":");
  return (
    <span
      className="led text-[1.5rem] leading-none whitespace-nowrap"
      role={time ? "timer" : undefined}
      aria-label={time ? `Uhrzeit in Hamburg: ${time}` : undefined}
      style={{ "--colon-delay": `-${offset}ms` } as React.CSSProperties}
    >
      <span aria-hidden="true">
        {hh}
        <span className="board-colon">:</span>
        {mm}
      </span>
    </span>
  );
}

/** Dot-Matrix-Pfeil: drei Spalten, die nacheinander aufleuchten. */
function LedPfeil() {
  return (
    <svg className="board-arrow" viewBox="0 0 7 11" aria-hidden="true">
      <g>
        {[1, 3.25, 5.5, 7.75, 10].map((y) => (
          <circle key={`a${y}`} className="c1" cx="1" cy={y} r="0.95" />
        ))}
        {[3.25, 5.5, 7.75].map((y) => (
          <circle key={`b${y}`} className="c2" cx="3.5" cy={y} r="0.95" />
        ))}
        <circle className="c3" cx="6" cy="5.5" r="0.95" />
      </g>
    </svg>
  );
}

export function Abfahrtstafel({ pakete }: { pakete: PaketeKurz }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [armed, setArmed] = useState(false);
  const rows = ROWS.map((r) => ({ ...r, ...priceOf(pakete, r.slug) }));
  const starterMonthly = rows[0].monthly.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");

  useLaufzeit(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let io: IntersectionObserver | undefined;
    // Beim Laden schon im Bild: Tafel steht, nichts blättert nach. Gefragt
    // per IntersectionObserver, damit das Hydrieren kein Layout erzwingt.
    const abbrechen = imBildBeimStart(el, 0.85, (imBild) => {
      if (imBild) return;
      setArmed(true);
      const beob = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setRun(true);
            beob.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      beob.observe(el);
      io = beob;
    });
    return () => {
      abbrechen();
      io?.disconnect();
    };
  }, []);

  const ticker = [
    `Monatsbeitrag ab ${starterMonthly} für Hosting und kleine Änderungen`,
    "Kleine Seiten oft in 1–2 Werktagen online",
    "Festpreis vorab, Test-Link vor dem Start",
    "Telefon 0160 7621876",
  ];

  return (
    <div ref={ref} className="board">
      <div className="board-in">
        <div className="flex items-center gap-2.5 border-b border-[#2a2d2f] px-4 py-4 sm:gap-3.5 sm:px-[1.35rem]">
          <span className="text-[15px] uppercase tracking-[0.14em]" style={{ fontStretch: "115%", fontWeight: 760 }}>
            Abfahrten
          </span>
          <span className="text-stahl-hell hidden font-mono text-[12px] md:inline">Anleger Sitalo</span>
          <span className="board-status led led-gruen ml-auto" aria-hidden="true">
            pünktlich
          </span>
          <Uhr />
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
            <LedPfeil />
            <span className="board-linie" aria-hidden="true">
              {r.linie}
            </span>
            <span className="led text-[1.05rem] leading-none sm:text-[1.15rem]">
              <span className="sr-only">{r.name}</span>
              {/* Fallblatt-Tafeln führen Versalien. */}
              <Fallblatt text={r.name.toUpperCase()} go={run} armed={armed} delay={i * 220} />
            </span>
            <span className="board-desc font-mono text-[13px] leading-snug text-[#b9bebf]">{r.desc}</span>
            <span className="board-price led text-right text-[1.4rem] leading-none whitespace-nowrap sm:text-[1.6rem]">
              <span className="sr-only">ab </span>
              <Ziffern value={r.value} /> €
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
