"use client";

import { useEffect, useState, type ComponentType } from "react";

import type { PaletteSearchDoc } from "@/components/marketing/command-palette";

/**
 * Suchfenster (⌘K), Tastenkürzel und Kürzel-Hilfe. Niemand braucht sie in
 * der ersten Sekunde, deshalb laden sie erst, wenn der Browser Luft hat
 * (requestIdleCallback, spätestens nach 3 s) oder bei der ersten Taste.
 * So bleibt das JavaScript für den ersten Bildschirm kleiner.
 *
 * Geladen wird mit einfachem import() und erst danach eingesetzt, bewusst
 * nicht über next/dynamic: Dessen Nachladen läuft über Suspense, und React
 * startete dafür jedes Mal einen Seitenwechsel (View Transition,
 * seiten-wechsel.tsx). Wer in dem Moment gerade scrollte, sah die ganze
 * Seite einmal aus- und wieder einblenden.
 */
type Teile = {
  CommandPalette: ComponentType<{ searchIndex: PaletteSearchDoc[] }>;
  KeyboardChords: ComponentType;
  ShortcutHelp: ComponentType;
};

/** Ereignis, mit dem die Kopfzeile die Suche öffnet. */
export const SUCHE_EVENT = "sitalo:suche";

export function GlobalExtras({
  searchIndex,
}: {
  searchIndex: PaletteSearchDoc[];
}) {
  const [teile, setTeile] = useState<Teile | null>(null);

  useEffect(() => {
    if (teile) return;
    let aktiv = true;
    let laedt = false;
    const start = () => {
      if (laedt) return;
      laedt = true;
      Promise.all([
        import("@/components/marketing/command-palette"),
        import("@/components/marketing/keyboard-chords"),
        import("@/components/marketing/shortcut-help"),
      ])
        .then(([palette, kuerzel, hilfe]) => {
          if (!aktiv) return;
          setTeile({
            CommandPalette: palette.CommandPalette,
            KeyboardChords: kuerzel.KeyboardChords,
            ShortcutHelp: hilfe.ShortcutHelp,
          });
        })
        .catch(() => {
          // Netz weg: beim nächsten Anlass noch einmal versuchen.
          laedt = false;
        });
    };
    // Suche-Knopf in der Kopfzeile: Palette sofort laden und öffnen
    // (command-palette.tsx liest window.__sucheOffen beim Start).
    const suche = () => {
      (window as Window & { __sucheOffen?: boolean }).__sucheOffen = true;
      start();
    };
    window.addEventListener("keydown", start);
    window.addEventListener(SUCHE_EVENT, suche);
    const w = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idle = 0;
    let timer = 0;
    if (w.requestIdleCallback)
      idle = w.requestIdleCallback(start, { timeout: 3000 });
    else timer = window.setTimeout(start, 1500);
    return () => {
      aktiv = false;
      window.removeEventListener("keydown", start);
      window.removeEventListener(SUCHE_EVENT, suche);
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, [teile]);

  if (!teile) return null;
  const { CommandPalette, KeyboardChords, ShortcutHelp } = teile;
  return (
    <>
      <CommandPalette searchIndex={searchIndex} />
      <KeyboardChords />
      <ShortcutHelp />
    </>
  );
}
