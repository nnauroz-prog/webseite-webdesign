"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Vorher/Nachher-Regler für die Startseite: dieselbe (frei erfundene)
 * Tischlerei, links als typische in die Jahre gekommene Betriebsseite,
 * rechts so, wie wir sie bauen. Der Griff lässt sich ziehen, tippen oder
 * per Tastatur bewegen (unsichtbarer range-Input liegt darüber).
 *
 * Abgeleitet von components/marketing/before-after.tsx (dort nur lesen).
 * Unterschied: Das Nachher-Beispiel spricht dieselbe Sprache wie die
 * übrige Startseite. Teer für Schrift, Hafengrün als einziger Akzent,
 * kantige Knöpfe, keine weichen Schatten, kein Braun und kein Marineblau.
 *
 * Beide Seiten sind in 960 × 600 gesetzt und werden auf die
 * Containerbreite skaliert, wie in der Live-Vorschau.
 */

const W = 960;
const H = 600;

export function VorherNachher() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [pos, setPos] = useState(38);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Einmaliger Hinweis beim ersten Sichtkontakt: Der Griff schwingt kurz
  // nach links und rechts, damit klar ist, dass man ziehen kann. Nur,
  // solange niemand selbst angefasst hat.
  const touched = useRef(false);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        [24, 62, 38].forEach((v, i) =>
          timers.push(window.setTimeout(() => !touched.current && setPos(v), 400 + i * 700)),
        );
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div className="select-none">
      <div className="mb-3 flex justify-between gap-4" aria-hidden="true">
        <span className="label-mono text-muted-foreground text-[11px]">← So oft gesehen</span>
        <span className="label-mono text-[11px]">So bauen wir →</span>
      </div>
      <div className="border-foreground/20 overflow-hidden rounded-[2px] border">
        <div className="bg-foreground flex items-center gap-2 px-3 py-2">
          <svg viewBox="0 0 12 14" className="text-stahl-hell h-3 w-3 shrink-0" aria-hidden="true">
            <path d="M3 6V4a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1.5" y="6" width="9" height="7" rx="1" fill="currentColor" />
          </svg>
          <span className="text-background/85 font-mono text-[11.5px]">www.tischlerei-nordholz.de</span>
        </div>
        <div
          ref={frameRef}
          className="relative w-full overflow-hidden bg-white"
          style={{ height: scale ? H * scale : undefined, aspectRatio: scale ? undefined : `${W}/${H}` }}
        >
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: W, height: H, transform: `scale(${scale || 0.5})`, opacity: scale ? 1 : 0 }}
          >
            <Nachher />
          </div>
          <div
            aria-hidden="true"
            className={`absolute inset-0 ${dragging ? "" : "transition-[clip-path] duration-500 ease-out"}`}
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{ width: W, height: H, transform: `scale(${scale || 0.5})`, opacity: scale ? 1 : 0 }}
            >
              <Vorher />
            </div>
          </div>

          {/* Griff */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 ${dragging ? "" : "transition-[left] duration-500 ease-out"}`}
            style={{ left: `${pos}%` }}
          >
            <div className="bg-foreground absolute inset-y-0 -left-px w-0.5" />
            <div className="bg-foreground text-background absolute top-1/2 left-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2px] ring-2 ring-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" strokeLinecap="square" />
              </svg>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => {
              touched.current = true;
              setDragging(true);
              setPos(Number(e.target.value));
            }}
            aria-label="Vorher und nachher vergleichen"
            className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
          {/* Fokus des unsichtbaren Reglers sichtbar machen. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden outline-2 -outline-offset-4 outline-[var(--gold)] peer-focus-visible:block"
          />
        </div>
      </div>
    </div>
  );
}

/** Typische Baukasten-Seite von etwa 2016: großes Titelbild mit dünner
 *  Schrift, zentrierter Willkommenstext in kleinem Grau, Öffnungszeiten
 *  als PDF, Cookie-Banner über dem Inhalt. Keine Parodie, sondern so,
 *  wie viele Betriebsseiten heute noch aussehen. */
function Vorher() {
  return (
    <div className="relative h-full w-full bg-white text-[#666]" style={{ fontFamily: "'Open Sans', Arial, sans-serif" }}>
      <div className="flex h-12 items-center justify-between bg-[#f4f4f4] px-8 text-[12px]">
        <span className="text-[15px] tracking-[0.18em] text-[#555] uppercase">Tischlerei Nordholz</span>
        <span className="flex gap-5 tracking-[0.08em] uppercase">
          <span className="text-[#c0392b]">Home</span>
          <span>Über uns</span>
          <span>Leistungen</span>
          <span>Galerie</span>
          <span>Kontakt</span>
          <span>Impressum</span>
        </span>
      </div>
      <div className="relative h-[230px] overflow-hidden">
        <Image
          src="/images/atmosphere/handwerker-werkbank.webp"
          alt=""
          fill
          sizes="960px"
          className="object-cover brightness-75 saturate-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="text-[34px] font-light tracking-[0.04em]">Willkommen</p>
          <p className="mt-1 text-[13px] font-light">bei Ihrer Tischlerei im Hamburger Raum</p>
        </div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="h-2 w-2 rounded-full bg-white/50" />
          <span className="h-2 w-2 rounded-full bg-white/50" />
        </div>
      </div>
      <div className="mx-auto max-w-[620px] px-6 py-6 text-center text-[11.5px] leading-[1.7]">
        <p className="text-[17px] font-light text-[#555]">Herzlich willkommen auf unserer Homepage</p>
        <p className="mt-3">
          Wir sind ein Familienbetrieb und fertigen Möbel, Treppen, Fenster, Türen und vieles mehr nach Ihren Wünschen.
          Qualität und Zuverlässigkeit sind für uns selbstverständlich. Weitere Informationen finden Sie unter dem
          Menüpunkt Leistungen. Wir freuen uns auf Ihren Besuch!
        </p>
        <p className="mt-3">
          <span className="text-[#c0392b] underline">Öffnungszeiten (PDF, 1,2 MB)</span> · Anfahrt siehe Kontakt
        </p>
        <p className="mt-2 text-[10px] text-[#6f6f6f]">© 2016 Tischlerei Nordholz · Erstellt mit einem Homepage-Baukasten</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-6 bg-[#333]/95 px-8 py-4 text-[11px] text-white">
        <span>
          Diese Website verwendet Cookies. Wenn Sie die Website weiter nutzen, gehen wir von Ihrem Einverständnis aus.
        </span>
        <span className="shrink-0 bg-[#c0392b] px-4 py-1.5">OK</span>
      </div>
    </div>
  );
}

/** Dieselbe Tischlerei, wie wir sie bauen: Teer, Hafengrün, kantig. */
function Nachher() {
  const teer = "#1b1d1e";
  const gruen = "#2e5c4d";
  const neben = "#565b5d";
  return (
    <div className="flex h-full w-full flex-col bg-white" style={{ color: teer, fontFamily: "var(--font-brand-sans)" }}>
      <div className="flex h-16 items-center justify-between border-b border-black/10 px-10">
        <span className="text-[22px] tracking-[-0.02em]" style={{ fontStretch: "112%", fontWeight: 740 }}>
          Nordholz
          <span className="ml-1 inline-block h-2 w-2" style={{ background: gruen }} />
        </span>
        <span className="flex items-center gap-7 text-[14px]" style={{ color: neben }}>
          <span>Leistungen</span>
          <span>Referenzen</span>
          <span>Über uns</span>
          <span className="rounded-[2px] px-4 py-2 text-[13px] font-semibold text-white" style={{ background: gruen }}>
            Angebot anfragen
          </span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[0.8fr_1fr]">
        <div className="relative">
          <Image src="/images/atmosphere/handwerker-werkbank.webp" alt="" fill sizes="520px" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-[#f1f1ee] px-10">
          <p className="font-mono text-[12px] tracking-[0.12em] uppercase" style={{ color: gruen }}>
            Tischlerei in Hamburg · seit 1987
          </p>
          <h3
            className="mt-3 text-[40px] leading-[1.02] tracking-[-0.035em]"
            style={{ fontStretch: "112%", fontWeight: 740 }}
          >
            Möbel, Treppen und Innenausbau aus eigener Werkstatt.
          </h3>
          <p className="mt-4 text-[16px] leading-relaxed" style={{ color: neben }}>
            Festes Angebot nach Aufmaß vor Ort, meist innerhalb von zwei Werktagen.
          </p>
          <div className="mt-6 flex gap-3">
            <span className="rounded-[2px] px-5 py-2.5 text-[14px] font-semibold text-white" style={{ background: gruen }}>
              Aufmaß vereinbaren
            </span>
            <span className="rounded-[2px] border border-black/25 bg-white px-5 py-2.5 text-[14px] font-semibold">
              040 123 45 67
            </span>
          </div>
          <div className="mt-8 flex gap-6 border-t border-black/10 pt-4 text-[13px]" style={{ color: neben }}>
            <span>Meisterbetrieb</span>
            <span>Mo–Fr 7–16 Uhr</span>
            <span>Einsatz bis 40 km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
