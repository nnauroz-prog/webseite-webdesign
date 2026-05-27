"use client";

import { useEffect, useState } from "react";

/**
 * Editorial-Echtzeit-Uhr mit Sekunden, Hamburg-Lokalzeit.
 *
 * Bewusst klein und ruhig — kein blinkender Doppelpunkt, kein
 * Neon-Look. Statisches Mono-Format mit fixer Breite (tabular-nums),
 * damit die Ziffern beim Tick nicht springen.
 *
 * Zeigt zusätzlich den Wochentag und den Tag/Monat — vermittelt
 * das Gefühl, dass die Seite "lebt" und nicht generisch ist.
 *
 * Wird beim SSR mit Placeholder-Text gerendert, um Hydration-
 * Mismatches zu vermeiden. Tick startet erst nach Mount.
 */
export function HamburgClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <span className="text-background/55 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums">
        <span aria-hidden="true" className="bg-gold inline-block h-1 w-1 rounded-full" />
        <span>—:—:— · Hamburg</span>
      </span>
    );
  }

  const time = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const weekday = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "long",
  }).format(now);

  return (
    <span
      title={`${weekday}, ${now.toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" })}`}
      className="text-background/55 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums"
    >
      <span
        aria-hidden="true"
        className="bg-gold gold-pulse inline-block h-1 w-1 rounded-full"
      />
      <span>{time}</span>
      <span aria-hidden="true" className="text-background/35">·</span>
      <span>Hamburg</span>
    </span>
  );
}
