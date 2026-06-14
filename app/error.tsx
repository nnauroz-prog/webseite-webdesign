"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Global Error-Boundary. Server-Fehler werden in `error` serialisiert;
 * wir geben bewusst keine internen Details an Besucher weiter. Voice
 * wie auf der restlichen Seite (Sie-Form, Hamburg-Verdichtung) und
 * mit echter Kontakt-Adresse statt anonymem „Support".
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
    // im Browser-Console für Debugging, ohne Internals an User leak.
    if (typeof console !== "undefined") {
      console.error("[sitalo] Global-Error:", error);
    }
  }, [error]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center focus:outline-none"
    >
      <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.28em]">
        Fehler
      </p>
      <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Hier hat was geklemmt.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md text-pretty leading-relaxed">
        Die Seite konnte gerade nicht geladen werden. Versuchen Sie's
        nochmal — wenn's bleibt, schreiben Sie uns kurz an{" "}
        <a
          href="mailto:info@sitalo.de"
          className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          info@sitalo.de
        </a>
        , wir gucken nach.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Erneut versuchen</Button>
        <Button asChild variant="outline">
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
      {error?.digest && (
        <p className="text-muted-foreground/55 mt-8 font-mono text-[10.5px]">
          Ref: {error.digest}
        </p>
      )}
    </main>
  );
}
