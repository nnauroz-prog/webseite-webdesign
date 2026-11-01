"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Globale Fehlerseite. Server-Fehler werden in `error` serialisiert;
 * interne Details geben wir bewusst nicht an Besucher weiter, nur die
 * Referenz (digest), damit wir den Fehler im Log wiederfinden.
 * Gestaltet wie der Kopf einer Unterseite: Mono-Kopfzeile, breite
 * Überschrift, Hafen-Knöpfe.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-seitig hat Next.js den Fehler schon geloggt. Hier lokal
    // in der Browser-Konsole für die Fehlersuche.
    if (typeof console !== "undefined") {
      console.error("[sitalo] Global-Error:", error);
    }
  }, [error]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="bg-background mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-24 focus:outline-none sm:px-6"
    >
      <p className="label-mono text-muted-foreground">Fehler</p>
      <h1 className="mt-6 max-w-3xl text-balance text-[2.4rem] leading-[0.98] tracking-[-0.036em] sm:text-6xl">
        Die Seite ließ sich gerade nicht laden.
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl text-pretty text-[16.5px] leading-relaxed sm:text-lg">
        Versuchen Sie es bitte noch einmal. Bleibt der Fehler, schreiben Sie uns an{" "}
        <a
          href="mailto:info@sitalo.de"
          className="text-foreground font-semibold underline decoration-[var(--gold)] decoration-2 underline-offset-4"
        >
          info@sitalo.de
        </a>
        , dann sehen wir nach.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => reset()} className="btn-signal">
          Erneut versuchen <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <Link href="/" className="btn-line">
          Zur Startseite
        </Link>
      </div>
      {error?.digest ? (
        <p className="text-muted-foreground mt-10 font-mono text-[12px]">Referenz: {error.digest}</p>
      ) : null}
    </main>
  );
}
