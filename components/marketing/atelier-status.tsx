"use client";

import { useEffect, useState } from "react";

/**
 * Atelier-Status-Indikator für den Header. Zeigt einen pulsierenden
 * Punkt + kurzen Status-Text.
 *
 * Logik (Europe/Berlin):
 *   06–23  →  gold + „Atelier offen"
 *   23–06  →  ink-olive (gedimmt) + „Atelier ruht · meist morgens"
 *
 * Bewusst keine Lüge — wenn wir nachts schlafen, soll das auch
 * dastehen. Ehrlich + lebendig zugleich.
 *
 * Nur auf lg+ sichtbar, sonst wird der Header zu eng.
 */
export function AtelierStatus({ className }: { className?: string }) {
  const [state, setState] = useState<"open" | "rest" | "loading">("loading");

  useEffect(() => {
    const update = () => {
      const hourStr = new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        hour12: false,
      }).format(new Date());
      const hour = parseInt(hourStr, 10);
      setState(hour >= 6 && hour < 23 ? "open" : "rest");
    };
    update();
    const id = window.setInterval(update, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  if (state === "loading") {
    return (
      <span
        className={`text-muted-foreground inline-flex h-9 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] ${className ?? ""}`}
      >
        <span aria-hidden="true" className="bg-muted-foreground/30 inline-block h-1.5 w-1.5 rounded-full" />
        <span className="text-muted-foreground/60">—</span>
      </span>
    );
  }

  const open = state === "open";
  return (
    <span
      title={
        open
          ? "Antwort meist innerhalb von 4 Stunden"
          : "Wir antworten meist am nächsten Morgen"
      }
      className={`text-muted-foreground inline-flex h-9 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          open ? "bg-gold gold-pulse" : "bg-ink-olive/70"
        }`}
      />
      <span>{open ? "Atelier offen" : "Atelier ruht"}</span>
    </span>
  );
}
