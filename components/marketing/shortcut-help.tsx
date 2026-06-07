"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Shortcut-Help-Overlay — "?" öffnet ein Modal, das alle aktiven
 * Tastenkürzel auflistet. Klassisch Linear-Style „cheatsheet on demand".
 *
 * "?" wird nur als Trigger erkannt, wenn der Fokus nicht in einem
 * Eingabefeld ist. Esc schließt.
 */

type Shortcut = { keys: string[]; label: string };

const SHORTCUTS: { group: string; items: Shortcut[] }[] = [
  {
    group: "Global",
    items: [
      { keys: ["⌘", "K"], label: "Schnellnavigation öffnen" },
      { keys: ["?"], label: "Diese Übersicht" },
      { keys: ["Esc"], label: "Modal schließen" },
    ],
  },
  {
    group: "Springen (G + Taste)",
    items: [
      { keys: ["G", "H"], label: "Startseite" },
      { keys: ["G", "L"], label: "Leistungen" },
      { keys: ["G", "B"], label: "Branchen" },
      { keys: ["G", "S"], label: "Standorte" },
      { keys: ["G", "P"], label: "Pakete" },
      { keys: ["G", "O"], label: "Ablauf" },
      { keys: ["G", "F"], label: "FAQ" },
      { keys: ["G", "T"], label: "Atelier" },
      { keys: ["G", "K"], label: "Kontakt" },
      { keys: ["G", "A"], label: "Anfrage" },
      { keys: ["G", "U"], label: "Audit anfordern" },
      { keys: ["G", "W"], label: "Wartung & Pflege" },
      { keys: ["G", "V"], label: "Vergleich" },
      { keys: ["G", "C"], label: "Speed-Check" },
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
        className="bg-foreground/40 absolute inset-0 backdrop-blur-sm"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/60 ring-foreground/5 relative w-full max-w-2xl overflow-hidden rounded-2xl border shadow-[0_30px_80px_-20px_rgb(0_0_0/0.3)] ring-1"
      >
        <div className="border-border/60 flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
              Tastenkürzel
            </p>
            <p className="text-foreground mt-1 text-base font-medium tracking-tight">
              Was geht hier so per Tastatur
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Schließen"
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {SHORTCUTS.map((group) => (
            <section key={group.group} className="mb-5 last:mb-0">
              <p className="text-muted-foreground/80 mb-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                {group.group}
              </p>
              <ul className="divide-border/40 divide-y">
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
                          className="border-border/70 bg-background text-foreground/80 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border px-1.5 font-mono text-[11px]"
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

        <div className="border-border/60 text-muted-foreground/80 border-t px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em]">
          Drücke <kbd className="border-border/70 mx-1 rounded border px-1 normal-case">?</kbd>{" "}
          jederzeit für diese Übersicht
        </div>
      </div>
    </div>
  );
}
