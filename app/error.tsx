"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Global error boundary. Server-side errors get serialized into `error`;
 * we deliberately avoid surfacing internal details to end users.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-muted-foreground text-sm tracking-wide uppercase">
        Fehler
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Da ist etwas schiefgelaufen.
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        Wir konnten diese Seite nicht laden. Versuche es bitte erneut — bleibt
        der Fehler bestehen, melde dich beim Support.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Erneut versuchen</Button>
        <Button asChild variant="outline">
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
    </main>
  );
}
