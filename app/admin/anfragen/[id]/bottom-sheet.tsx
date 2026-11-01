"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * Natives <dialog> als Bottom-Sheet (showModal: Fokus bleibt im Sheet,
 * Escape und Tipp auf den Hintergrund schließen).
 */
export function BottomSheet({
  open,
  onClose,
  title,
  titleId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Nur der Hintergrund (das <dialog> selbst, nicht der Inhalt).
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      // Am iPhone unten angedockt, ab lg mittig als Dialog.
      className="bg-card text-foreground backdrop:bg-foreground/40 mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[4px] p-0 lg:my-auto lg:max-w-lg lg:rounded-[4px] lg:shadow-xl"
    >
      <div className="pt-2 pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(env(safe-area-inset-bottom)+1rem)] pl-[max(1rem,env(safe-area-inset-left))] lg:pb-5">
        <div className="flex items-center justify-between gap-2">
          <h2 id={titleId} className="text-[17px] font-semibold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Schließen"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[3px]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
