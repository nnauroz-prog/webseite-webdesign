"use client";

import Link from "next/link";

/**
 * Rückfallebene für unerwartete Fehler im Admin-Bereich. Datenbank-
 * Probleme erklären die Seiten selbst (DbProblem); hier landet nur,
 * was dort nicht abgefangen wurde. In Produktion kommt die Meldung
 * aus Server Components nur generisch an, deshalb kein Rohtext.
 */
export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div
      role="alert"
      className="border-border bg-card mt-2 rounded-[4px] border p-5 text-[15px] leading-relaxed"
    >
      <h1 className="text-[18px] leading-tight font-semibold tracking-tight">
        Da ist etwas schiefgelaufen
      </h1>
      <p className="text-muted-foreground mt-2">
        Bei schwachem Netz hilft meist „Neu laden“. Deine Daten in der
        Datenbank sind davon nicht betroffen.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground mt-2 font-mono text-[12px]">
          Fehler-ID {error.digest}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="bg-foreground text-background h-12 rounded-[3px] px-6 text-[15px] font-medium"
        >
          Neu laden
        </button>
        <Link
          href="/admin"
          className="border-border hover:border-foreground/40 inline-flex h-12 items-center rounded-[3px] border px-6 text-[15px] font-medium transition-colors"
        >
          Zur Übersicht
        </Link>
      </div>
    </div>
  );
}
