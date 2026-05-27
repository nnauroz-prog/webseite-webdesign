"use client";

import { useEffect, useState } from "react";

/**
 * Klassisches Konami-Code-Easter-Egg.
 *
 *   ↑ ↑ ↓ ↓ ← → ← → B A
 *
 * Wird der Code irgendwo auf der Seite getippt, blendet ein kleines
 * Atelier-Briefing rein — kein Fake-Rabatt, kein Newsletter-Pop-up,
 * nur eine ehrliche kleine Anerkennung an alle, die das hier suchen.
 *
 * Vollkommen entbehrlich. Genau deswegen tut es gut.
 */

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiEgg() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let index = 0;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQUENCE[index];
      if (key === expected) {
        index += 1;
        if (index === SEQUENCE.length) {
          setOpen(true);
          index = 0;
        }
      } else {
        // Falls die erste Taste passt, reset auf 1 statt 0
        index = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atelier-Briefing"
      className="fixed inset-0 z-[85] flex items-center justify-center px-4"
      onClick={() => setOpen(false)}
    >
      <div
        aria-hidden="true"
        className="bg-foreground/50 absolute inset-0 backdrop-blur-md"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/60 ring-foreground/5 relative w-full max-w-md overflow-hidden rounded-2xl border p-8 text-center shadow-[0_30px_80px_-20px_rgb(0_0_0/0.4)] ring-1"
      >
        <div className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span aria-hidden="true" className="bg-gold inline-block h-1 w-6" />
          Geheimes Atelier-Briefing
        </div>
        <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug tracking-[-0.01em]">
          Du hast den{" "}
          <span className="serif-italic text-muted-foreground">Konami-Code</span>{" "}
          gefunden.
        </p>
        <p className="text-muted-foreground mt-4 text-pretty text-[14.5px] leading-relaxed">
          Wer das tut, hat einen Blick fürs Detail. Genau wie wir.
          Schick uns kurz eine Mail mit dem Wort „Konami" — wir
          antworten dir innerhalb einer Stunde, gepokerter Hanseaten-
          Ehrenwort.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="mailto:info@sitalo.de?subject=Konami"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium tracking-tight"
            onClick={() => setOpen(false)}
          >
            info@sitalo.de
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground inline-flex h-10 items-center px-3 text-sm transition-colors"
          >
            Zurück zum Atelier
          </button>
        </div>
        <p
          aria-hidden="true"
          className="text-muted-foreground/50 mt-6 font-mono text-[10px] uppercase tracking-[0.22em]"
        >
          ↑ ↑ ↓ ↓ ← → ← → B A
        </p>
      </div>
    </div>
  );
}
