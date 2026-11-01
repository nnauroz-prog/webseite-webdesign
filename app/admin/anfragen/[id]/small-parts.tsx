"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { backTarget, openOutcome } from "@/app/admin/client-state";

/**
 * „‹ Zurück“: Wurde die Detailseite aus dem Admin heraus geöffnet,
 * springt router.back() zurück (Suche, Reiter und Scrollposition
 * bleiben). Sonst, z. B. über den Direktlink aus der Mail, auf /admin.
 */
export function BackLink() {
  const router = useRouter();
  return (
    <Link
      href="/admin"
      onClick={(e) => {
        if (backTarget() === window.location.pathname && window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
      className="-ml-2 inline-flex h-11 items-center gap-0.5 rounded-[3px] pr-3 pl-1 text-[15px] font-medium"
    >
      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      Zurück
    </Link>
  );
}

/** Ergebnis-Zeile: „Ergebnis: Kein Auftrag (Preis) · Ändern“. */
export function ResultLine({
  text,
  actionLabel,
  enabled,
}: {
  text: string;
  actionLabel: string;
  enabled: boolean;
}) {
  return (
    <div className="border-border bg-card mt-4 flex flex-wrap items-center gap-x-2 rounded-[4px] border py-1 pr-1 pl-4 text-[15px]">
      <span className="py-2">{text}</span>
      {enabled ? (
        <button
          type="button"
          onClick={openOutcome}
          className="ml-auto inline-flex h-11 items-center rounded-[3px] px-3 font-medium underline underline-offset-4"
        >
          {actionLabel}
        </button>
      ) : (
        <span className="text-muted-foreground ml-auto px-3 py-2 text-[13px]">
          nach dem Datenbank-Update
        </span>
      )}
    </div>
  );
}
