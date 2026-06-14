"use client";

import { useEffect, useState } from "react";

/**
 * Atelier-Status-Indikator für den Header. Pulsierender Punkt +
 * kontextueller Kurztext, der je nach Stunde und Wochentag variiert.
 *
 * Statt eines einzigen Open/Closed-Schalters jetzt acht Phasen,
 * die den Tag im Atelier nachzeichnen — Morgenkaffee bis
 * Nachtruhe. Wirkt deutlich lebendiger als „immer offen, immer
 * pulsierend" und passt zur Hamburger Understatement-Linie:
 * lieber ehrlich „Spätschicht" als generisch „24/7 erreichbar".
 *
 * Logik (Europe/Berlin):
 *   Wochentag 06–09 → „Morgenkaffee"
 *   Wochentag 09–12 → „Werkbank · Vormittag"
 *   Wochentag 12–14 → „Mittagspause"      (gedimmt)
 *   Wochentag 14–18 → „Werkbank · konzentriert"
 *   Wochentag 18–22 → „Spätschicht"
 *   Wochentag 22–23 → „Letzte Mails"
 *   Sa/So 09–22     → „Wochenende · läuft mit"  (gedimmt)
 *   Alle 23–06      → „Atelier ruht"      (gedimmt)
 *
 * Aktualisiert alle 3 Minuten, damit der Phasenwechsel ohne
 * Reload spürbar wird (ein Besucher, der über die volle Stunde
 * hinaus liest, sieht den Wechsel passieren).
 */
type Tone = "active" | "dimmed" | "rest" | "loading";
type Phase = { label: string; tone: Tone };

function currentPhase(now: Date): Phase {
  const dayHourStr = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  }).format(now);
  // Format ist „Di., 14"; daraus Hour als zweiten Teil extrahieren.
  const parts = dayHourStr.split(",");
  const weekdayShort = parts[0]?.trim() ?? "";
  const hour = parseInt(parts[1]?.trim() ?? "0", 10);
  const isWeekend = weekdayShort.startsWith("Sa") || weekdayShort.startsWith("So");

  // Nachtruhe gilt unabhängig vom Wochentag.
  if (hour >= 23 || hour < 6) {
    return { label: "Atelier ruht", tone: "rest" };
  }
  // Wochenende: ein einziger gedimmter Block tagsüber.
  if (isWeekend) {
    return { label: "Wochenende · läuft mit", tone: "dimmed" };
  }
  // Werktag-Phasen.
  if (hour < 9) return { label: "Morgenkaffee", tone: "active" };
  if (hour < 12) return { label: "Werkbank · Vormittag", tone: "active" };
  if (hour < 14) return { label: "Mittagspause", tone: "dimmed" };
  if (hour < 18) return { label: "Werkbank · konzentriert", tone: "active" };
  if (hour < 22) return { label: "Spätschicht", tone: "active" };
  return { label: "Letzte Mails", tone: "dimmed" };
}

function toneClasses(tone: Tone): { dot: string; text: string } {
  switch (tone) {
    case "active":
      return { dot: "bg-gold gold-pulse", text: "" };
    case "dimmed":
      return { dot: "bg-gold/55", text: "opacity-80" };
    case "rest":
      return { dot: "bg-ink-olive/70", text: "opacity-80" };
    case "loading":
      return { dot: "bg-muted-foreground/30", text: "" };
  }
}

export function AtelierStatus({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>({ label: "—", tone: "loading" });

  useEffect(() => {
    const update = () => setPhase(currentPhase(new Date()));
    update();
    // 3-Minuten-Tick — eng genug, um Phasenwechsel mitzukriegen,
    // weit genug, um nicht unnötig zu rerendern.
    const id = window.setInterval(update, 3 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const tone = toneClasses(phase.tone);

  return (
    <span
      title={
        phase.tone === "rest"
          ? "Wir antworten meist am nächsten Morgen"
          : phase.tone === "dimmed"
            ? "Mails laufen rein, Antwort meist im nächsten Werkabschnitt"
            : "Antwort meist innerhalb von 4 Stunden"
      }
      className={`text-muted-foreground inline-flex h-9 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${tone.dot}`}
      />
      <span className={tone.text}>{phase.label}</span>
    </span>
  );
}
