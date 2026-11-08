"use client";

import { useEffect, useState } from "react";

/**
 * Begrüßung nach Tageszeit mit Uhrzeit in Hamburg, als Mono-Notiz mit
 * rundem orangem Punkt:
 * „Guten Morgen aus Hamburg · 08:14“. Nur im Browser (Server und erstes
 * Bild zeigen „Aus Hamburg · --:--“), die Zeile hat eine feste
 * Mindestbreite und eine Zeile Höhe, damit nichts springt (CLS 0).
 * Ohne Wetter-Abruf. Die Uhr tickt minütlich, ohne Blinken.
 */

const ZONE = "Europe/Berlin";

function gruss(stunde: number) {
  if (stunde >= 5 && stunde < 10) return "Guten Morgen aus Hamburg";
  if (stunde >= 10 && stunde < 12) return "Guten Vormittag aus Hamburg";
  if (stunde >= 12 && stunde < 17) return "Guten Tag aus Hamburg";
  if (stunde >= 17 && stunde < 22) return "Guten Abend aus Hamburg";
  return "Spät am Schreibtisch in Hamburg";
}

function jetzt() {
  const teile = new Intl.DateTimeFormat("de-DE", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = teile.find((t) => t.type === "hour")?.value ?? "00";
  const m = teile.find((t) => t.type === "minute")?.value ?? "00";
  return { text: gruss(parseInt(h, 10) % 24), zeit: `${h}:${m}` };
}

export function HamburgZeile({ className = "" }: { className?: string }) {
  const [stand, setStand] = useState<{ text: string; zeit: string } | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      setStand(jetzt());
      // Auf die nächste volle Minute, nur solange der Tab sichtbar ist.
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    const sichtbar = () => {
      window.clearTimeout(timer);
      if (!document.hidden) tick();
    };
    tick();
    document.addEventListener("visibilitychange", sichtbar);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", sichtbar);
    };
  }, []);

  return (
    <p
      className={`inline-flex min-h-[1.5em] min-w-[28ch] items-center gap-2 font-mono text-[12px] leading-[1.5] tracking-[0.04em] tabular-nums ${className}`}
    >
      <span aria-hidden="true" className="bg-gold inline-block h-1.5 w-1.5 shrink-0 rounded-full" />
      <span>{stand ? stand.text : "Aus Hamburg"}</span>
      <span aria-hidden="true">·</span>
      <time suppressHydrationWarning>{stand ? stand.zeit : "--:--"}</time>
    </p>
  );
}
