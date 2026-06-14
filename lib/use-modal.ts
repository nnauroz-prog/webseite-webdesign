"use client";

import { useEffect, useRef } from "react";

/**
 * useModal — geteilte Logik für alle modalen Dialoge auf der Seite
 * (AtelierBrief, AtelierTagebuch und ähnliche). Vorher dreimal
 * dupliziert: Body-Scroll-Lock, Esc-Handler, Focus-Trap (Tab + Shift-
 * Tab im Kreis), Initial-Focus aufs Dialog-Element.
 *
 * Verwendung:
 *   const { dialogRef } = useModal(open, () => setOpen(false));
 *   ...
 *   <div ref={dialogRef} role="dialog" aria-modal="true" ... />
 *
 * Semantik:
 *   - Beim Öffnen: body.overflow = "hidden", Esc-Listener registriert,
 *     Focus ins Dialog-Element verschoben.
 *   - Solange offen: Tab und Shift-Tab laufen innerhalb der
 *     fokussierbaren Kinder im Kreis.
 *   - Beim Schließen: Body-Overflow zurück, Listener entfernt.
 *
 * Nicht im Scope:
 *   - Overlay-Klick zum Schließen (gehört in den Component-JSX,
 *     weil die Stop-Propagation auf der Card geregelt wird).
 *   - aria-labelledby — gehört zum Caller, weil jeder Dialog seinen
 *     eigenen Titel hat.
 *   - Transition-Animationen — gehören in CSS pro Komponente.
 */
export function useModal(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

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
        onClose();
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
  }, [open, onClose]);

  return { dialogRef };
}
