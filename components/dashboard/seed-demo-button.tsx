"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { seedDemoContentAction } from "@/lib/actions/website";

export function SeedDemoButton({
  label = "Demo-Inhalte einfügen",
}: {
  label?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await seedDemoContentAction();
        if (result.status === "error") {
          setError(result.message ?? "Demo-Inhalte konnten nicht eingefügt werden.");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `Fehler: ${err.message}`
            : "Demo-Inhalte konnten nicht eingefügt werden.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" disabled={pending} onClick={onClick}>
        {pending ? "Inhalte werden eingefügt …" : label}
      </Button>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
