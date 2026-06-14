"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { SitaloStempel } from "@/components/marketing/sitalo-stempel";
import { cn } from "@/lib/utils";

/**
 * AtelierBrief — diskreter Brief-Auslöser unten links auf der
 * Homepage. Klickt jemand drauf, fliegt ein Atelier-Brief von
 * unten ins Bild, mit Wachssiegel, datierter Anrede und einer
 * handgeschriebenen Notiz vom Atelier an den Besucher.
 *
 * Premium-Discovery-Element: nicht aufdringlich, aber wer es
 * findet, kriegt einen echten persönlichen Moment. Kein Newsletter-
 * Popup, kein Lead-Magnet — nur ein Stück Höflichkeit.
 *
 * Architektur:
 *   - Floating-Button unten links (fix-positioniert), max 56 px,
 *     mit kleinem Pulse-Akzent, der nach 6 s einmal erlischt.
 *   - Beim Klick öffnet sich ein Modal mit echtem Brief-Layout:
 *     Wachs-Siegel oben, Datum, Anrede, drei Absätze, Signatur.
 *   - Esc-Taste, Klick auf Overlay und der X-Button schließen.
 *   - Body wird beim Öffnen scroll-gesperrt.
 *   - Reduced-Motion: kein Slide-Up, sofortiges Erscheinen.
 *
 * Datum wird zur Render-Zeit berechnet (Europe/Berlin), bleibt
 * also pro Build stabil — wer den Brief am nächsten Tag öffnet,
 * sieht das aktuelle Datum nach Hydration.
 */

function todayLabel(): string {
  const now = new Date();
  return now.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}

export function AtelierBrief() {
  const [open, setOpen] = useState(false);
  // Lazy initializer: erstmaliger Zugriff auf todayLabel() läuft
  // ein Mal beim Mount, ohne synchronen setState im Effect (würde
  // sonst eine zweite Render-Pass triggern). Server-Render erhält
  // ein leeres Datum — suppressHydrationWarning lässt den Wechsel
  // auf Client-Datum nach Hydration zu, ohne Mismatch-Error.
  const [date] = useState<string>(() =>
    typeof window === "undefined" ? "" : todayLabel(),
  );
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Body-Scroll lock + Esc + Focus-Trap (Tab läuft innerhalb des
  // Dialogs im Kreis), damit Tastatur-Nutzer den Modal nicht versehent-
  // lich verlassen, solange er offen ist.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    dialog?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Floating-Trigger — auf Desktop unten links. Mobile bewusst
          versteckt (md:flex), weil dort die MobileCtaBar den unteren
          Bereich belegt; Discovery-Element bleibt Hover-Erlebnis. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Brief vom Atelier öffnen"
        className={cn(
          "atelier-brief-trigger fixed bottom-6 left-6 z-[60] hidden h-12 w-12",
          "items-center justify-center rounded-full",
          "border border-foreground/15 bg-card/90 text-foreground/80",
          "shadow-[0_6px_20px_-6px_rgb(35_31_27_/_0.18)]",
          "backdrop-blur-sm transition-all duration-300",
          "hover:border-foreground/35 hover:text-foreground hover:shadow-[0_10px_28px_-8px_rgb(35_31_27_/_0.28)]",
          "focus-visible:ring-2 focus-visible:ring-foreground/30 focus:outline-none",
          "md:flex print:hidden",
        )}
        data-cursor-label="Brief vom Atelier"
      >
        {/* Brief-Glyph als feines SVG — Umschlag mit Siegel-Punkt. */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            d="M3 6h18v12H3z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M3 7l9 6 9-6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="14"
            r="1.4"
            className="fill-gold"
          />
        </svg>
        {/* Pulse-Dot — fängt einmal kurz Aufmerksamkeit ein. */}
        <span
          aria-hidden="true"
          className="atelier-brief-pulse bg-gold absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
        />
      </button>

      {/* Modal-Overlay */}
      {open && (
        <div
          className="atelier-brief-overlay fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          {/* Dunkler Hintergrund, der die Seite zurückstellt */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/55 backdrop-blur-[2px]"
          />
          {/* Brief-Karte */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="atelier-brief-titel"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="atelier-brief-card relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus:outline-none sm:rounded-3xl"
          >
            {/* Schließen-Button — 44 × 44 px, WCAG 2.5.5 Target Size */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Brief schließen"
              className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 bg-card/90 text-foreground/70 backdrop-blur-sm transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus:outline-none"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Brief-Inhalt */}
            <div className="relative px-7 pt-12 pb-8 sm:px-10 sm:pt-14 sm:pb-10">
              {/* Wachssiegel oben, leicht aus der Mitte */}
              <div className="absolute right-7 top-7 opacity-90 sm:right-10 sm:top-9">
                <SitaloStempel
                  size="sm"
                  className="text-gold/80"
                />
              </div>

              {/* Sichtbarer Editorial-Header; gleichzeitig ARIA-Titel
                  für aria-labelledby des dialog-Elements (Screen-Reader
                  hört „Brief vom Atelier" beim Öffnen). */}
              <h2
                id="atelier-brief-titel"
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
              >
                <span className="sr-only">Brief vom Atelier — </span>
                Sitalo Atelier · Hamburg
              </h2>
              <p
                suppressHydrationWarning
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 mt-1"
              >
                {date || " "}
              </p>

              <p className="serif-italic text-foreground mt-8 text-balance text-2xl leading-snug tracking-[-0.01em] sm:text-[1.7rem]">
                Schön, dass Sie hier sind.
              </p>

              <div className="text-foreground/85 mt-6 space-y-4 text-pretty text-[15px] leading-[1.65]">
                <p>
                  Sie haben sich durchgeklickt, bis hierhin. Das machen
                  drei von hundert. Also wirklich: vielen Dank.
                </p>
                <p>
                  Unsere Seite ist absichtlich kein Showroom. Wir bauen
                  Websites, weil wir der Meinung sind, dass kleine
                  Hamburger Betriebe online besser dastehen sollten. Nicht
                  schicker — sondern brauchbar.
                </p>
                <p>
                  Wenn Sie irgendwann was haben, das ein Update vertragen
                  könnte, melden Sie sich. Wir gucken erstmal drüber, ohne
                  Honorar, ohne Verpflichtung. So sind wir hier eben.
                </p>
              </div>

              {/* Signatur in serif-italic, wie handgeschrieben */}
              <p className="serif-italic text-foreground/85 mt-8 text-xl leading-snug">
                — Aus dem Atelier
              </p>

              <div className="border-foreground/15 mt-7 border-t pt-6 text-[12.5px] leading-relaxed text-muted-foreground">
                <a
                  href="mailto:info@sitalo.de"
                  className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  info@sitalo.de
                </a>
                {" · "}
                <a
                  href="tel:+4915224437370"
                  className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  0152 24437370
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
