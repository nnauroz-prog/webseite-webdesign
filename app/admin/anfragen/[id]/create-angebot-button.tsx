"use client";

import { FilePlus2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createAngebotAction } from "@/app/admin/angebot-actions";
import { rememberBackTarget } from "@/app/admin/client-state";
import { runAction } from "@/app/admin/run-action";
import { cn } from "@/lib/utils";

/**
 * „Angebot erstellen“: legt den Entwurf aus der Anfrage an und öffnet
 * den Editor. „Zurück“ im Editor springt dann wieder hierher.
 */
export function CreateAngebotButton({
  leadId,
  big,
}: {
  leadId: string;
  /** Großer Knopf (noch kein Angebot) oder schlichter („Weiteres Angebot“). */
  big: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function create() {
    if (pending) return;
    setError(null);
    start(async () => {
      const res = await runAction(() => createAngebotAction(leadId));
      if (!res.ok) {
        setError(res.error);
        return;
      }
      rememberBackTarget(res.href);
      router.push(res.href);
    });
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={create}
        disabled={pending}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[3px] font-medium disabled:opacity-60",
          big
            ? "bg-foreground text-background h-13 w-full px-6 text-[16px] sm:w-auto"
            : "border-border bg-background hover:border-foreground/40 h-11 border px-4 text-[15px] transition-colors",
        )}
      >
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <FilePlus2 className="h-5 w-5" aria-hidden="true" />
        )}
        {pending
          ? "Erstellt …"
          : big
            ? "Angebot erstellen"
            : "Weiteres Angebot erstellen"}
      </button>
      {error ? (
        <p role="alert" className="text-ink-olive mt-2 text-[14px]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
