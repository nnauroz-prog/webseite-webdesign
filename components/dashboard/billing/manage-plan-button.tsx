"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function ManagePlanButton({
  label = "Plan verwalten",
}: {
  label?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/billing/portal", { method: "POST" });
        const body = (await res.json()) as {
          ok: boolean;
          message?: string;
          redirect?: string;
        };
        if (body.redirect) {
          window.location.href = body.redirect;
          return;
        }
        if (!body.ok) {
          setError(body.message ?? "Portal nicht verfügbar.");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `Portal nicht verfügbar: ${err.message}`
            : "Portal nicht verfügbar.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button type="button" disabled={pending} onClick={onClick}>
        {pending ? "Öffne Stripe …" : label}
      </Button>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
