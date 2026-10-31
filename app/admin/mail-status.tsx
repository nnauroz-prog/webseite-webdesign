"use client";

import { useActionState } from "react";

import { sendTestMail, type ActionState } from "@/app/admin/actions";
import { OFFLINE_ERROR } from "@/app/admin/run-action";
import { cn } from "@/lib/utils";

async function safeSendTestMail(): Promise<ActionState> {
  try {
    return await sendTestMail();
  } catch {
    return { error: OFFLINE_ERROR };
  }
}

/**
 * Zeigt, ob neue Anfragen per E-Mail rausgehen, und erlaubt eine
 * Test-Mail über denselben Weg wie echte Anfragen.
 *
 * `problem`: Hinweis oben auf /admin (kein Anbieter eingerichtet oder
 * eine Benachrichtigung der letzten 7 Tage ist gescheitert). Sonst
 * ruhig im aufklappbaren Bereich unten.
 */
export function MailStatus({
  provider,
  to,
  recentFailures = 0,
  problem = false,
}: {
  provider: "resend" | "formspree" | null;
  to: string;
  recentFailures?: number;
  problem?: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState>(
    safeSendTestMail,
    {},
  );
  const ok = provider !== null;
  const providerName = provider === "resend" ? "Resend" : "Formspree";
  return (
    <section
      aria-label="E-Mail-Benachrichtigung"
      className={cn(
        "rounded-2xl text-[15px] leading-relaxed",
        problem ? "border-gold bg-card mt-3 border-2 p-4" : "pt-2",
      )}
    >
      {!ok ? (
        <>
          <p className="font-semibold">
            E-Mail-Benachrichtigung ist noch nicht eingerichtet
          </p>
          <p className="mt-1">
            Anfragen werden hier gespeichert, aber du bekommst keine Mail. Trag
            in Vercel unter Settings, Environment Variables{" "}
            <code className="font-mono text-[13px]">RESEND_API_KEY</code> und{" "}
            <code className="font-mono text-[13px]">LEAD_MAIL_TO</code> ein und
            deploye neu.
          </p>
        </>
      ) : (
        <>
          {recentFailures > 0 ? (
            <p className="font-semibold">
              {recentFailures === 1
                ? "Eine Benachrichtigung der letzten 7 Tage ist nicht rausgegangen."
                : `${recentFailures} Benachrichtigungen der letzten 7 Tage sind nicht rausgegangen.`}{" "}
              <span className="font-normal">
                Die Anfragen sind trotzdem hier gespeichert (Karte „Mail
                fehlgeschlagen“).
              </span>
            </p>
          ) : null}
          <p className={cn(recentFailures > 0 && "mt-2")}>
            Neue Anfragen erreichst du per Mail über {providerName} an {to}.
          </p>
          <form action={action} className="mt-3">
            <button
              type="submit"
              disabled={pending}
              className="border-border hover:border-foreground/40 inline-flex h-11 items-center rounded-full border px-5 text-[15px] font-medium disabled:opacity-60"
            >
              {pending ? "Sende …" : "Test-Mail senden"}
            </button>
          </form>
        </>
      )}
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
