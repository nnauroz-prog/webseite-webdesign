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

export function GlobalExtras({ searchIndex }: { searchIndex: PaletteSearchDoc[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const start = () => setReady(true);
    window.addEventListener("keydown", start, { once: true });
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
