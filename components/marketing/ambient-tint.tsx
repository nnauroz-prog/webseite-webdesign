"use client";

import { useEffect } from "react";

/**
 * AmbientTint — schiebt einen unsichtbar-dezenten Farb-Layer
 * vor die Seite, dessen Ton sich an die Hamburger Tageszeit
 * anpasst. Morgens leicht rosé, mittags neutral, in der goldenen
 * Stunde warm-amber, abends Espresso, nachts kühl-petrol.
 *
 * Das Signal ist absichtlich knapp am Bewusstseinsschwellenwert:
 * ~4–6 % Opacity, mix-blend-overlay, fixed. Wer den ganzen Tag
 * auf der Seite ist, merkt nicht das einzelne Frame — aber dass
 * sich die Stimmung gewandelt hat. Premium-Liveness ohne Lärm.
 *
 * Architektur:
 *   - Setzt zwei CSS-Custom-Properties auf <html>:
 *     --ambient-rgb (Farbwerte) und --ambient-alpha (Stärke).
 *   - body::before-Layer in globals.css liest die Variablen aus
 *     und legt den Layer fest über die Seite.
 *   - Update alle 10 Minuten, damit Phasenwechsel über die Stunde
 *     spürbar werden ohne unnötige Re-Renders.
 *
 * Reduced-Motion: Tint trotzdem aktiv (keine Bewegung, nur Farbe).
 * Wer dunkel-themed Browser nutzt: gleiche Logik, weil's nur
 * Light-Theme gibt.
 */

type Tint = {
  rgb: string; // e.g. "245 200 150"
  alpha: number; // 0–0.08
};

function tintForHour(hour: number): Tint {
  // Reine Schwellwerte; Übergänge entstehen durch Update-Intervall.
  if (hour >= 6 && hour < 9) {
    // Morgenrot — leicht rosé-warm
    return { rgb: "240 195 165", alpha: 0.045 };
  }
  if (hour >= 9 && hour < 14) {
    // Vormittag, neutral
    return { rgb: "245 215 175", alpha: 0.025 };
  }
  if (hour >= 14 && hour < 17) {
    // Nachmittag, leicht wärmer
    return { rgb: "232 180 120", alpha: 0.04 };
  }
  if (hour >= 17 && hour < 20) {
    // Goldene Stunde, deutlich amber
    return { rgb: "220 155 90", alpha: 0.055 };
  }
  if (hour >= 20 && hour < 23) {
    // Espresso-Abend, tief warm
    return { rgb: "175 110 70", alpha: 0.05 };
  }
  // Nacht 23–06: kühl-petrol, ruhig
  return { rgb: "100 115 145", alpha: 0.045 };
}

function applyTint() {
  const hourStr = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    hour12: false,
  }).format(new Date());
  const hour = parseInt(hourStr, 10);
  const tint = tintForHour(hour);
  const root = document.documentElement;
  root.style.setProperty("--ambient-rgb", tint.rgb);
  root.style.setProperty("--ambient-alpha", String(tint.alpha));
}

export function AmbientTint() {
  useEffect(() => {
    applyTint();
    const id = window.setInterval(applyTint, 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
