"use client";

import { useState } from "react";
import { BookOpen, X } from "lucide-react";

import { ATELIER_NOTES } from "@/lib/atelier-notes";
import { useModal } from "@/lib/use-modal";
import { cn } from "@/lib/utils";

/**
 * AtelierTagebuch — diskreter Trigger unten links (über dem
 * AtelierBrief), der ein papier-gestaltetes Tagebuch-Modal
 * öffnet. Inhalt sind die echten ATELIER_NOTES (Werkstatt-Log),
 * gerendert als linierte Notizbuchseite mit Datums-Streifen,
 * Ink-Tinten-Variation und einer kleinen leeren Zeile am Ende
 * („…").
 *
 * Sinn: das, was die ImAtelier-Sektion auf der Homepage in einer
 * Liste zeigt, kriegt einen eigenen, intimeren Lese-Modus. Wer
 * neugierig ist, klickt drauf und sieht die Atelier-Notizen wie
 * in einem echten Skizzenbuch.
 *
 * Architektur:
 *   - Trigger gegenüber dem AtelierBrief (unten links, ca. 60 px
 *     weiter rechts), gleicher visueller Stil, anderes Glyph.
 *   - Modal mit Papier-Textur, eingerückten Zeilen, datierten
 *     Einträgen.
 *   - Esc, Overlay-Klick, X-Button schließen.
 *   - Body-Scroll-Lock beim Öffnen.
 *   - prefers-reduced-motion: keine Slide-Up-Animation, sofortiges
 *     Erscheinen.
 */
export function AtelierTagebuch() {
  const [open, setOpen] = useState(false);
  // Geteilte Modal-Logik (Focus-Trap, Body-Scroll-Lock, Esc-Handler)
  // in lib/use-modal, gemeinsam mit AtelierBrief. Vorher dreimal
  // dupliziert; jetzt einmalig.
  const { dialogRef } = useModal(open, () => setOpen(false));

  return (
    <>
      {/* Trigger — neben AtelierBrief auf Desktop, 4 rem rechts versetzt
          (3 rem Button + 1 rem Abstand). md:flex damit Mobile-Bottom
          frei bleibt für die MobileCtaBar. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Werkstatt-Tagebuch öffnen"
        className={cn(
          "atelier-tagebuch-trigger fixed bottom-6 left-[5.25rem] z-[60] hidden h-12 w-12",
          "items-center justify-center rounded-full",
          "border border-foreground/15 bg-card/90 text-foreground/80",
          "shadow-[0_6px_20px_-6px_rgb(35_31_27_/_0.18)]",
          "backdrop-blur-sm transition-all duration-300",
          "hover:border-foreground/35 hover:text-foreground hover:shadow-[0_10px_28px_-8px_rgb(35_31_27_/_0.28)]",
          "focus-visible:ring-2 focus-visible:ring-foreground/30 focus:outline-none",
          "md:flex print:hidden",
        )}
        data-cursor-label="Werkstatt-Tagebuch"
      >
        <BookOpen className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="atelier-tagebuch-overlay fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/55 backdrop-blur-[2px]"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="atelier-tagebuch-titel"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="atelier-tagebuch-card relative w-full max-w-xl overflow-hidden rounded-2xl bg-card shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus:outline-none sm:rounded-3xl"
          >
            {/* Schließen-Button — 44 × 44 px, WCAG 2.5.5 Target Size */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tagebuch schließen"
              className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 bg-card/90 text-foreground/70 backdrop-blur-sm transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus:outline-none"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Papier-Linien-Hintergrund — sehr dezent, blaue
                Notizbuch-Optik. */}
            <div
              aria-hidden="true"
              className="atelier-tagebuch-paper pointer-events-none absolute inset-0"
            />

            <div className="relative px-7 pt-12 pb-8 sm:px-10 sm:pt-14 sm:pb-10">
              <h2
                id="atelier-tagebuch-titel"
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
              >
                <span className="sr-only">Werkstatt-Tagebuch — </span>
                Sitalo
              </h2>
              <p className="serif-italic text-foreground mt-3 text-balance text-2xl leading-snug tracking-[-0.01em] sm:text-[1.7rem]">
                Was hier zuletzt passiert ist.
              </p>

              <ol className="mt-9 space-y-7">
                {ATELIER_NOTES.map((note, i) => (
                  <li
                    key={note.when + note.text}
                    className="flex gap-5 sm:gap-7"
                  >
                    {/* Datums-Streifen links — Mono, sehr klein,
                        wie Ringbuch-Heftung. */}
                    <span className="text-muted-foreground/85 mt-1 shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] sm:w-[6.5rem]">
                      {note.when}
                    </span>
                    {/* Eintragstext, leicht serif-italic getönt für
                        Hand-geschriebene-Optik. Erste Note bekommt
                        eine Spur dunklere Tinte. */}
                    <p
                      className={cn(
                        "text-pretty text-[15px] leading-[1.65]",
                        i === 0 ? "text-foreground/90" : "text-foreground/75",
                      )}
                    >
                      {note.text}
                    </p>
                  </li>
                ))}
                {/* Leerzeile am Ende — gibt das Gefühl, dass das
                    Tagebuch weiterläuft. */}
                <li className="flex gap-5 sm:gap-7">
                  <span className="text-muted-foreground/50 mt-1 shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] sm:w-[6.5rem]">
                    …
                  </span>
                  <p className="text-muted-foreground/55 text-[14px] italic">
                    wird weitergeschrieben.
                  </p>
                </li>
              </ol>

              <div className="border-foreground/15 mt-9 border-t pt-6 text-[12.5px] leading-relaxed text-muted-foreground">
                <a
                  href="/jetzt"
                  className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  /jetzt
                </a>{" "}
                hat die vollständige Now-Page mit Sprechstunden, Slots
                und allem, was gerade aufm Tisch liegt.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
