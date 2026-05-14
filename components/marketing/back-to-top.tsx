"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Floating "scroll to top" button. Appears once the user has
 * scrolled past the first viewport-height of the page. Sits in the
 * bottom-right corner with a small safe-area inset so it clears the
 * iPhone home indicator. Anchored on z-50 — above content, below the
 * mobile menu sheet (z-40 in its backdrop, z-40 on the sheet itself
 * but transient).
 *
 * Mounted from MarketingFooter so every marketing page picks it up
 * without touching individual pages. No-op while the page is short
 * enough that there is nothing to scroll back from.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Zurück nach oben"
      className={cn(
        // Auf Mobile sitzt darunter die MobileCtaBar (md:hidden) — die
        // ist h-12 + ~14 px Padding-Bottom = ~62 px. BackToTop muss
        // darüber liegen, also bottom-20 (80 px). Auf md+ kein
        // CTA-Bar sichtbar → wieder kleineres bottom-6.
        "fixed right-4 bottom-20 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-200 md:right-6 md:bottom-6",
        "bg-background/95 border-border text-foreground backdrop-blur-sm hover:bg-secondary hover:shadow-xl",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
