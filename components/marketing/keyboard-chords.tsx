"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * G-Prefix-Tastenkürzel — Navigation per Tastatur.
 *
 * Drücke "G" (außerhalb von Eingabefeldern), dann innerhalb von
 * 1.5 Sekunden eine zweite Taste:
 *
 *   G H — Startseite (/)
 *   G L — Leistungen
 *   G B — Branchen
 *   G S — Standorte
 *   G A — Anfrage
 *   G P — Pakete
 *   G K — Kontakt
 *   G F — FAQ
 *   G O — Ablauf
 *   G T — Atelier
 *
 * Ein kleines Schild rechts unten zeigt "G…", sobald der Chord-Modus
 * aktiv ist. Verschwindet nach Match oder Timeout.
 */

const ROUTES: Record<string, { path: string; label: string }> = {
  h: { path: "/", label: "Startseite" },
  l: { path: "/leistungen", label: "Leistungen" },
  b: { path: "/branchen", label: "Branchen" },
  s: { path: "/standorte", label: "Standorte" },
  a: { path: "/anfrage", label: "Anfrage" },
  p: { path: "/pakete", label: "Pakete" },
  k: { path: "/kontakt", label: "Kontakt" },
  f: { path: "/faq", label: "FAQ" },
  o: { path: "/ablauf", label: "Ablauf" },
  t: { path: "/atelier", label: "Über uns" },
  u: { path: "/audit", label: "Durchsicht" },
  w: { path: "/wartung", label: "Wartung" },
  v: { path: "/vergleich", label: "Vergleich" },
  c: { path: "/check", label: "Ladezeit-Test" },
  j: { path: "/journal", label: "Journal" },
};

export function KeyboardChords() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const clear = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      // Ignorieren wenn Modal/Input/CE im Spiel ist
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
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (!active) {
        if (key === "g") {
          e.preventDefault();
          setActive(true);
          setHint(null);
          clear();
          timerRef.current = window.setTimeout(() => {
            setActive(false);
            setHint(null);
          }, 1500);
        }
        return;
      }

      // Im Chord-Modus
      e.preventDefault();
      clear();
      const route = ROUTES[key];
      if (route) {
        setHint(`→ ${route.label}`);
        router.push(route.path);
        timerRef.current = window.setTimeout(() => {
          setActive(false);
          setHint(null);
        }, 600);
      } else if (key === "escape") {
        setActive(false);
        setHint(null);
      } else {
        // Unbekannte Taste — Chord abbrechen
        setActive(false);
        setHint(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clear();
    };
  }, [active, router]);

  if (!active) return null;

  return (
    <div
      aria-live="polite"
      className="bg-foreground text-background pointer-events-none fixed right-6 bottom-6 z-[70] hidden items-center gap-2.5 rounded-[2px] px-3.5 py-2 font-mono text-[12px] shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)] md:inline-flex print:hidden"
    >
      <kbd className="border-background/30 rounded-[2px] border px-1.5 py-0.5 text-[11px]">
        G
      </kbd>
      <span>{hint ?? "…"}</span>
    </div>
  );
}
