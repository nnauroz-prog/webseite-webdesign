"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { PaletteSearchDoc } from "@/components/marketing/command-palette";

/**
 * Suchfenster (⌘K), Tastenkürzel und Kürzel-Hilfe. Niemand braucht sie in
 * der ersten Sekunde, deshalb laden sie erst, wenn der Browser Luft hat
 * (requestIdleCallback, spätestens nach 3 s) oder bei der ersten Taste.
 * So bleibt das JavaScript für den ersten Bildschirm kleiner.
 */
const CommandPalette = dynamic(
  () => import("@/components/marketing/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);
const KeyboardChords = dynamic(
  () => import("@/components/marketing/keyboard-chords").then((m) => m.KeyboardChords),
  { ssr: false },
);
const ShortcutHelp = dynamic(
  () => import("@/components/marketing/shortcut-help").then((m) => m.ShortcutHelp),
  { ssr: false },
);

/** Ereignis, mit dem die Kopfzeile die Suche öffnet. */
export const SUCHE_EVENT = "sitalo:suche";

export function GlobalExtras({ searchIndex }: { searchIndex: PaletteSearchDoc[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const start = () => setReady(true);
    // Suche-Knopf in der Kopfzeile: Palette sofort laden und öffnen
    // (command-palette.tsx liest window.__sucheOffen beim Start).
    const suche = () => {
      (window as Window & { __sucheOffen?: boolean }).__sucheOffen = true;
      setReady(true);
    };
    window.addEventListener("keydown", start, { once: true });
    window.addEventListener(SUCHE_EVENT, suche);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idle = 0;
    let timer = 0;
    if (w.requestIdleCallback) idle = w.requestIdleCallback(start, { timeout: 3000 });
    else timer = window.setTimeout(start, 1500);
    return () => {
      window.removeEventListener("keydown", start);
      window.removeEventListener(SUCHE_EVENT, suche);
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, [ready]);

  if (!ready) return null;
  return (
    <>
      <CommandPalette searchIndex={searchIndex} />
      <KeyboardChords />
      <ShortcutHelp />
    </>
  );
}
