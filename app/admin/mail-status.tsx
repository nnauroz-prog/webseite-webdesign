"use client";

import { useActionState } from "react";

import { sendTestMail, type ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

/**
 * Zeigt, ob neue Anfragen per E-Mail rausgehen, und erlaubt eine
 * Test-Mail über denselben Weg wie echte Anfragen.
 */
export function MailStatus({
  provider,
  to,
}: {
  provider: "resend" | "formspree" | null;
  to: string;
}) {
  const [state, action, pending] = useActionState<ActionState>(sendTestMail, {});
  const ok = provider !== null;
  return (
    <section
      aria-label="E-Mail-Benachrichtigung"
      className={cn(
        "mt-6 rounded-2xl border p-4 text-[14px] sm:p-5",
        ok ? "border-border bg-card" : "border-amber-300 bg-amber-50 text-amber-950",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          aria-hidden="true"
          className={cn("inline-block h-2.5 w-2.5 rounded-full", ok ? "bg-emerald-500" : "bg-amber-500")}
        />
        <p className="font-medium">
          {ok
            ? `E-Mail-Benachrichtigung aktiv (${provider === "resend" ? "Resend" : "Formspree"}) an ${to}`
            : "E-Mail-Benachrichtigung ist noch nicht eingerichtet"}
        </p>
        {ok ? (
          <form action={action} className="ml-auto">
            <button
              type="submit"
              disabled={pending}
              className="border-border hover:border-foreground/40 inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-medium disabled:opacity-60"
            >
              {pending ? "Sende…" : "Test-Mail senden"}
            </button>
          </form>
        ) : null}
      </div>
      {!ok ? (
        <p className="mt-2 leading-relaxed">
          Anfragen werden hier gespeichert, aber Sie bekommen keine Mail. In Vercel unter
          Settings → Environment Variables <code className="font-mono text-[13px]">RESEND_API_KEY</code> und{" "}
          <code className="font-mono text-[13px]">LEAD_MAIL_TO</code> eintragen, dann neu deployen.
        </p>
      ) : null}
      {state.info ? (
        <p role="status" className="mt-3 text-emerald-800">
          {state.info}
        </p>
      ) : null}
      {state.error ? (
        <p role="alert" className="mt-3 text-red-800">
          Test fehlgeschlagen: {state.error}
        </p>
      ) : null}
    </section>
  );
}
