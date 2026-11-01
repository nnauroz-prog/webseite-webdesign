"use client";

import { CalendarPlus, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { setStatusAction } from "@/app/admin/actions";
import { emitStatusDone, statusDoneLabel } from "@/app/admin/client-state";
import { runAction } from "@/app/admin/run-action";

/**
 * Termin oben auf der Detailseite: Datum, Uhrzeit, Abstand zu heute,
 * „In meinen Kalender“ (.ics) und, wenn der Termin vorbei ist,
 * ein Ein-Tipp-Knopf für Erledigt.
 */
export function TerminBox({
  leadId,
  when,
  relative,
  confirmed,
  icsHref,
  askDone,
}: {
  leadId: string;
  /** „Dienstag, 3. November · 10:00–10:30“ */
  when: string;
  /** „in 3 Tagen“ */
  relative: string;
  /** Status nicht mehr „neu“: Der Termin gilt als bestätigt. */
  confirmed: boolean;
  icsHref: string;
  askDone: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function done() {
    setError(null);
    start(async () => {
      const res = await runAction(() => setStatusAction(leadId, "erledigt"));
      if (!res.ok) {
        setError(res.error);
        return;
      }
      emitStatusDone({
        label: statusDoneLabel("erledigt"),
        undo: res.undo,
        askOutcome: res.askOutcome,
      });
    });
  }

  return (
    <section aria-labelledby="termin-title" className="border-border bg-card mt-4 rounded-[4px] border p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="termin-title" className="label-mono text-muted-foreground">
          Gebuchter Termin
        </h2>
        {confirmed ? null : (
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[13px]">
            <span className="bg-gold h-2 w-2 rounded-full" aria-hidden="true" />
            noch nicht bestätigt
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[17px] font-semibold">{when}</p>
      <p className="text-muted-foreground text-[14px]">{relative}</p>
      <a
        href={icsHref}
        className="border-border bg-background hover:border-foreground/40 mt-3 inline-flex h-11 items-center gap-2 rounded-[3px] border px-4 text-[15px] font-medium transition-colors"
      >
        <CalendarPlus className="h-5 w-5" aria-hidden="true" />
        In meinen Kalender
      </a>
      {askDone ? (
        <div className="border-border mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-3">
          <p className="text-[15px] font-medium">Termin vorbei. Erledigt?</p>
          <button
            type="button"
            onClick={done}
            disabled={pending}
            className="bg-foreground text-background inline-flex h-11 items-center gap-2 rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {error ? "Nochmal" : "Auf Erledigt setzen"}
          </button>
          {error ? (
            <p role="alert" className="text-ink-olive w-full text-[14px]">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
