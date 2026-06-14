"use client";

import { useEffect, useState } from "react";

import { SitaloStempel } from "@/components/marketing/sitalo-stempel";

/**
 * SiegelIntro — beim ersten Besuch in der Session erscheint der
 * Sitalo-Stempel zentriert, presst sich aus dem Off ins Papier
 * und löst sich dann auf. Nach der Animation ist der Pfropfen
 * weg, die Seite wird sichtbar.
 *
 * Architektur:
 *   - Pure CSS-Animation (keyframes), nur ein winziger Mount-State
 *     trägt die ersten 1,4 s.
 *   - sessionStorage statt localStorage: jede frische Session
 *     bekommt einen einmaligen Eindruck, aber wer hin- und
 *     herklickt, wird nicht jedes Mal aufgehalten.
 *   - Reduced-Motion: kein Intro, Seite ist sofort sichtbar.
 *   - Touch & alle Geräte: gleiche Geste, weil sie nicht hover-
 *     abhängig ist — sondern ein einzelner Moment beim Eintritt.
 *
 * Performance: das Overlay liegt fixed über allem, lädt mit der
 * Seite, blockiert nichts. SitaloStempel ist serverseitig schon
 * vorgemalt; Animation auf der GPU (transform/opacity only).
 */
const STORAGE_KEY = "sitalo-siegel-seen";
const PLAY_DURATION_MS = 1500;

export function SiegelIntro() {
  // SSR-sicher: Initial false, damit Server- und erste-Client-Render
  // identisch sind. Erst nach Mount entscheiden wir, ob wir spielen.
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");

  useEffect(() => {
    // Reduced-Motion respektieren — kein Intro.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setPhase("done");
      return;
    }
    // Schon mal gesehen in dieser Session — kein zweites Mal.
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // sessionStorage kann in Private-Mode/Safari blockiert sein —
      // dann spielen wir lieber einmal extra als gar nicht.
    }
    if (seen) {
      setPhase("done");
      return;
    }
    setPhase("playing");
    const t = setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignoriert — Animation hat trotzdem gespielt.
      }
    }, PLAY_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Sitalo-Siegel wird geprägt"
      data-phase={phase}
      className="siegel-intro"
    >
      {/* Papier-Hintergrund — derselbe Cream-Ton wie der Page-Background.
          So entsteht der Übergang vom Stempel zum Inhalt nahtlos. */}
      <div className="siegel-intro-paper" />
      {/* Stempel-Bühne — übernimmt die Stempel-Press-Choreografie:
          aus dem Off oben einsinken, in der Mitte halten, dann
          mit dem Overlay verblassen. */}
      <div className="siegel-intro-stage">
        <SitaloStempel size="lg" className="text-foreground/85" />
      </div>
      {/* Editorial-Sperrsatz unter dem Siegel — verkauft den Moment
          als bewusste Geste, nicht als Splash-Screen. */}
      <p className="siegel-intro-eyebrow">
        Sitalo · Hamburg · MMXXVI
      </p>
    </div>
  );
}
