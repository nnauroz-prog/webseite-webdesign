"use client";

import { useEffect, useRef } from "react";

import { clearAdminSession } from "@/app/admin/client-state";

/**
 * Hinweis nach dem Löschen. Leert den Sitzungsspeicher des Admins.
 * Nach der Weiterleitung von der (langen)
 * Detailseite bleibt die Scrollposition sonst mitten in der Liste
 * stehen, und der Hinweis oben wäre nicht zu sehen.
 */
export function DeletedNotice({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Falls die Weiterleitung am Lösch-Formular vorbeiging: Suchbegriff
    // und Vormerkungen können Daten der gelöschten Person enthalten.
    clearAdminSession();
    const id = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      ref.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="border-ink-petrol/35 bg-ink-petrol/8 text-foreground mt-3 rounded-[4px] border p-4 text-[15px] leading-relaxed outline-none"
    >
      {children}
    </div>
  );
}
