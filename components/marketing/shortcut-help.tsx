"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Shortcut-Help-Overlay — "?" öffnet ein Fenster, das alle aktiven
 * Tastenkürzel auflistet. Gesetzt wie eine Tabelle mit Haarlinien,
 * Tasten als kantige Kappen in Mono.
 *
 * "?" wird nur als Trigger erkannt, wenn der Fokus nicht in einem
 * Eingabefeld ist. Esc schließt.
 */

type Shortcut = { keys: string[]; label: string };

const SHORTCUTS: { group: string; items: Shortcut[] }[] = [
  {
    group: "Überall",
    items: [
      { keys: ["⌘", "K"], label: "Schnellnavigation öffnen" },
      { keys: ["?"], label: "Diese Übersicht" },
      { keys: ["Esc"], label: "Fenster schließen" },
    ],
  },
  {
    group: "Springen: erst G, dann die Taste",
    items: [
      { keys: ["G", "H"], label: "Startseite" },
      { keys: ["G", "L"], label: "Leistungen" },
      { keys: ["G", "B"], label: "Branchen" },
      { keys: ["G", "S"], label: "Standorte" },
      { keys: ["G", "P"], label: "Pakete" },
      { keys: ["G", "O"], label: "Ablauf" },
      { keys: ["G", "F"], label: "FAQ" },
      { keys: ["G", "T"], label: "Über uns" },
      { keys: ["G", "K"], label: "Kontakt" },
      { keys: ["G", "A"], label: "Anfrage" },
      { keys: ["G", "U"], label: "Durchsicht anfordern" },
      { keys: ["G", "W"], label: "Wartung & Pflege" },
      { keys: ["G", "V"], label: "Vergleich" },
      { keys: ["G", "C"], label: "Ladezeit-Test" },
      { keys: ["G", "J"], label: "Journal" },
    ],
  },
];

export function ShortcutHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
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
          if (e.key === "Escape" && open) {
            e.preventDefault();
            setOpen(false);
          }
          return;
        }
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tastenkürzel-Übersicht"
      className="fixed inset-0 z-[75] flex items-center justify-center px-4 py-10"
      onClick={() => setOpen(false)}
    >
      <div
        aria-hidden="true"
        className="bg-foreground/60 absolute inset-0"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-foreground/20 relative w-full max-w-2xl overflow-hidden rounded-[3px] border shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)]"
      >
        <div className="border-border flex items-center justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <p className="label-mono text-muted-foreground">Tastatur</p>
            <p className="text-foreground mt-1.5 text-[17px] font-semibold tracking-tight">
              Tastenkürzel dieser Website
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Schließen"
            className="border-border text-muted-foreground hover:border-foreground hover:text-foreground inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {SHORTCUTS.map((group) => (
            <section key={group.group} className="mb-5 last:mb-0">
              <p className="label-mono text-muted-foreground mb-2">
                {group.group}
              </p>
              <ul className="border-foreground divide-border divide-y border-t">
                {group.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4 py-2.5"
                  >
                    <span className="text-foreground/90 text-[14.5px]">
                      {item.label}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1">
                      {item.keys.map((k, ki) => (
                        <kbd
                          key={ki}
                          className="border-border bg-background text-foreground inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-[2px] border border-b-2 px-1.5 font-mono text-[11.5px]"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="border-border text-muted-foreground border-t px-5 py-3 text-[13px]">
          Mit{" "}
          <kbd className="border-border mx-0.5 rounded-[2px] border px-1 font-mono text-[11.5px]">?</kbd>{" "}
          öffnen Sie diese Übersicht jederzeit.
        </div>
      </div>
    </div>
  );
}
