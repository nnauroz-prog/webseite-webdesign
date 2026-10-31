"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Vorher/Nachher-Regler: dieselbe (fiktive) Tischlerei, links als
 * typische in die Jahre gekommene Betriebsseite, rechts so, wie wir
 * sie bauen. Der Griff lässt sich ziehen, tippen oder per Tastatur
 * bewegen (unsichtbarer range-Input liegt darüber).
 *
 * Beide Seiten sind in 960 × 600 gesetzt und werden auf die
 * Containerbreite skaliert, wie in der Live-Vorschau.
 */

const W = 960;
const H = 600;

export function BeforeAfter() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [pos, setPos] = useState(38);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Einmaliger Hinweis beim ersten Sichtkontakt: Griff schwingt kurz
  // nach links und rechts, damit klar ist, dass man ziehen kann —
  // aber nur, solange niemand selbst angefasst hat.
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
      <div className="overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgb(15_25_50/0.45)] ring-1 ring-black/10">
        <div className="flex items-center gap-2 bg-[#e9ecf1] px-3 py-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto rounded-md bg-white/80 px-3 py-0.5 text-[11px] text-[#4b5563]">
            www.tischlerei-nordholz.de
          </span>
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
            <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.15)]" />
            <div className="bg-foreground text-background absolute top-1/2 left-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg ring-4 ring-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[12px] font-medium text-white">
            Vorher
          </span>
          <span className="bg-foreground pointer-events-none absolute right-3 bottom-3 rounded-full px-3 py-1 text-[12px] font-medium text-white">
            Mit Sitalo
          </span>

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
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>
    </div>
  );
}

/** Typische ältere Betriebsseite: kleine Schrift, Tabellenoptik, Lauftext. */
function Vorher() {
  return (
    <div className="h-full w-full bg-[#dfe6ee] p-6" style={{ fontFamily: "Verdana, Tahoma, sans-serif" }}>
      <div className="mx-auto h-full w-[760px] border border-[#8aa0b8] bg-white">
        <div className="bg-gradient-to-b from-[#3d6fa6] to-[#244d7c] px-4 py-3 text-center">
          <p className="text-[26px] font-bold text-[#ffd84a]" style={{ fontFamily: "Georgia, serif", textShadow: "2px 2px 0 #102a4a" }}>
            Tischlerei Nordholz
          </p>
          <p className="text-[11px] text-white">Ihr Partner für Holz seit 1987 !!!</p>
        </div>
        <div className="flex border-y border-[#8aa0b8] bg-[#c9d6e4] text-[11px]">
          {["Home", "Über uns", "Leistungen", "Galerie", "Anfahrt", "Gästebuch", "Links", "Impressum"].map((n) => (
            <span key={n} className="border-r border-[#8aa0b8] px-3 py-1.5 text-[#1d3d63] underline">
              {n}
            </span>
          ))}
        </div>
        <div className="flex gap-4 p-4">
          <div className="w-[170px] shrink-0 space-y-2 text-[10px]">
            <div className="border border-[#8aa0b8] bg-[#eef2f6] p-2">
              <p className="font-bold text-[#244d7c]">NEWS</p>
              <p className="mt-1 text-[#333]">12.03.2019: Unsere Homepage ist online!</p>
              <p className="mt-1 text-[#333]">Wir haben Betriebsferien vom 24.12.–02.01.</p>
            </div>
            <div className="border border-[#8aa0b8] bg-[#eef2f6] p-2 text-center">
              <p className="text-[#333]">Sie sind Besucher Nr.</p>
              <p className="mt-1 bg-black px-2 font-mono text-[14px] tracking-[0.2em] text-[#36ff5a]">004817</p>
            </div>
            <div className="border border-[#8aa0b8] bg-[#fff8c4] p-2 text-center text-[#a00]">
              Diese Seite ist optimiert für Internet Explorer, 1024×768
            </div>
          </div>
          <div className="flex-1 text-[11px] leading-[1.5] text-[#333]">
            <p className="text-center text-[18px] font-bold text-[#244d7c]" style={{ fontFamily: "Georgia, serif" }}>
              Herzlich Willkommen auf unserer Homepage !
            </p>
            <div className="mt-3 flex gap-3">
              <div className="relative h-[120px] w-[160px] shrink-0 overflow-hidden border-4 border-double border-[#8aa0b8] grayscale-[40%]">
                <Image src="/images/atmosphere/handwerker-werkbank.webp" alt="" fill sizes="160px" className="object-cover" />
              </div>
              <p>
                Wir sind eine Tischlerei im Hamburger Raum und fertigen Möbel, Treppen, Fenster, Türen und vieles mehr
                nach Ihren Wünschen. Qualität ist bei uns selbstverständlich. Rufen Sie uns an oder schreiben Sie uns eine
                E-Mail, wir freuen uns auf Ihre Anfrage. Weitere Informationen finden Sie unter dem Menüpunkt
                „Leistungen“. Bitte beachten Sie auch unsere Sonderangebote.
              </p>
            </div>
            <p className="mt-3">
              <b>Kontakt:</b> Tel. 040 / 123 45 67 · Fax 040 / 123 45 68 · E-Mail: info@tischlerei-nordholz.de
            </p>
            <p className="mt-3 text-center text-[10px] text-[#666]">
              Letzte Aktualisierung: 14.06.2019 · © 2008–2019 · Webmaster
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Dieselbe Tischlerei, wie wir sie bauen. */
function Nachher() {
  const accent = "#b4572a";
  return (
    <div className="flex h-full w-full flex-col bg-white text-[#1b2333]" style={{ fontFamily: "var(--font-brand-sans)" }}>
      <div className="flex h-16 items-center justify-between border-b border-black/5 px-10">
        <span className="text-[22px] font-semibold tracking-[-0.02em]">
          Nordholz<span style={{ color: accent }}>.</span>
        </span>
        <span className="flex items-center gap-7 text-[14px] text-[#4b5563]">
          <span>Leistungen</span>
          <span>Referenzen</span>
          <span>Über uns</span>
          <span className="rounded-full px-4 py-2 text-[13px] font-medium text-white" style={{ background: accent }}>
            Angebot anfragen
          </span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[0.8fr_1fr]">
        <div className="relative">
          <Image src="/images/atmosphere/handwerker-werkbank.webp" alt="" fill sizes="520px" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-10" style={{ background: "#f8f3ee" }}>
          <p className="text-[13px] font-semibold" style={{ color: accent }}>
            Tischlerei in Hamburg · seit 1987
          </p>
          <h3 className="mt-3 text-[44px] font-semibold leading-[1.02] tracking-[-0.035em]">
            Maßarbeit aus Holz, die bleibt.
          </h3>
          <p className="mt-4 text-[16px] leading-relaxed text-[#4b5563]">
            Möbel, Treppen und Innenausbau aus eigener Werkstatt. Mit festem Angebot in 48 Stunden.
          </p>
          <div className="mt-6 flex gap-3">
            <span className="rounded-full px-5 py-2.5 text-[14px] font-medium text-white" style={{ background: accent }}>
              Kostenloses Angebot
            </span>
            <span className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-[14px] font-medium">
              040 123 45 67
            </span>
          </div>
          <div className="mt-8 flex gap-6 text-[13px] text-[#4b5563]">
            <span>★ 4,9 bei Google</span>
            <span>Meisterbetrieb</span>
            <span>Festpreis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
