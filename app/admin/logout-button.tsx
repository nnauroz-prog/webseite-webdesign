"use client";

import { useState, useTransition } from "react";

import { logout } from "@/app/admin/actions";
import { clearAdminSession } from "@/app/admin/client-state";

/**
 * Abmelden mit echtem Seitenwechsel: Nach signOut lädt
 * window.location.replace die Login-Seite als neues Dokument. So
 * verschwinden DOM, Router-Cache und die eingebetteten Seitendaten
 * (Namen, Nummern) vollständig, und die Zurück-Geste führt nicht in
 * die alte Liste. Vorher werden Suchbegriff und Vormerkungen geleert.
 */
export function LogoutButton() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          try {
            await logout();
          } catch {
            setError("Keine Verbindung. Nicht abgemeldet.");
            return;
          }
          clearAdminSession();
          window.location.replace("/admin/login");
        });
      }}
      className="flex shrink-0 flex-col items-end gap-1"
    >
      <button
        type="submit"
        disabled={pending}
        className="border-border hover:border-foreground/40 h-12 shrink-0 rounded-[3px] border px-5 text-[14px] font-medium transition-colors disabled:opacity-60"
      >
        {pending ? "Meldet ab …" : "Abmelden"}
      </button>
      {error ? (
        <p role="alert" className="text-[13px] text-red-800">
          {error}
        </p>
      ) : null}
    </form>
  );
}
