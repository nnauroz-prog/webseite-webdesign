"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scramble-Text-Effekt. Beim Hover (Desktop) wird der Text kurz mit
 * Zufalls-Zeichen aufgelöst und Stück für Stück wieder „entschlüsselt".
 * Sehr Linear-/Awwwards-typisch — passt für einzelne Stilakzente,
 * nicht für Fliesstext.
 *
 * Auf Touch / reduced-motion: statischer Text, kein Effekt.
 *
 * Verwendung:
 *   <ScrambleText>Den Rest bauen wir</ScrambleText>
 *
 * Greift CSS-Klassen / Eltern-Span an — der gerenderte Wrapper ist
 * ein <span>, damit man ihn beliebig stylen kann.
 */

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·#%&@!";

export function ScrambleText({
  children,
  className,
  durationMs = 700,
}: {
  children: string;
  className?: string;
  durationMs?: number;
}) {
  const target = children;
  const [display, setDisplay] = useState(target);
  const frameRef = useRef<number | null>(null);
  const tokenRef = useRef(0);

  // Wenn sich der Zieltext ändert (selten), synchron halten.
  useEffect(() => {
    setDisplay(target);
  }, [target]);

  const start = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    const token = ++tokenRef.current;
    const startedAt = performance.now();

    const step = (now: number) => {
      if (token !== tokenRef.current) return;
      const t = Math.min(1, (now - startedAt) / durationMs);
      // Lock-Index wandert von 0 → target.length
      const lockUntil = Math.floor(t * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (ch === " " || i < lockUntil) {
          out += ch;
        } else {
          out +=
            SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
        }
      }
      setDisplay(out);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(target);
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <span
      className={className}
      onMouseEnter={start}
      onFocus={start}
      aria-label={target}
    >
      {display}
    </span>
  );
}
