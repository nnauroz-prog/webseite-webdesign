"use client";

import { Check, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import type { StatusDone } from "@/app/admin/client-state";
import type { LeadOutcome, LeadStatus, LostReason } from "@/lib/leads-meta";

import {
  restoreLeadAction,
  setOutcomeAction,
  setStatusAction,
} from "@/app/admin/actions";
import { BottomSheet } from "@/app/admin/anfragen/[id]/bottom-sheet";
import { statusDoneLabel } from "@/app/admin/client-state";
import { runAction } from "@/app/admin/run-action";
import { outcomeText } from "@/lib/admin/timeline";
import {
  LEAD_STATUSES,
  LOST_REASON_LABELS,
  LOST_REASONS,
  STATUS_LABELS,
} from "@/lib/leads-meta";
import { cn } from "@/lib/utils";

const BIG =
  "flex min-h-13 w-full items-center justify-between gap-3 rounded-[4px] border px-4 py-2 text-left text-[16px] font-medium transition-colors disabled:opacity-60";
const CHIP =
  "border-border bg-background inline-flex h-11 items-center justify-center rounded-[3px] border px-3 text-[15px] font-medium disabled:opacity-60";

/** Kurz, was der Status bedeutet (vor allem „Archiviert“ ist sonst unklar). */
const STATUS_HINTS: Record<LeadStatus, string> = {
  neu: "Noch nicht gemeldet",
  in_arbeit: "Im Gespräch, Antwort läuft",
  erledigt: "Abgeschlossen, mit oder ohne Auftrag",
  archiviert: "Aus der Liste, kann gelöscht werden",
};

/**
 * Status-Sheet: vier große Knöpfe, ein Tipp speichert. Nach „Erledigt“
 * (mit Datenbank-Update) folgt Schritt 2 „Wie ist es ausgegangen?“;
 * oben steht dann „Auf Erledigt gesetzt · Rückgängig“ im Sheet selbst,
 * nicht verdeckt hinter dem Modal.
 */
export function StatusSheet({
  open,
  leadId,
  status,
  initialStep,
  initialDone,
  onSaved,
  onUndone,
  onClose,
}: {
  open: boolean;
  leadId: string;
  status: LeadStatus;
  initialStep: "status" | "outcome";
  /** Statuswechsel, der zu Schritt 2 geführt hat (für Rückgängig). */
  initialDone: StatusDone | null;
  onSaved: (done: StatusDone) => void;
  onUndone: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(initialStep);
  const [done, setDone] = useState<StatusDone | null>(initialDone);
  const [lost, setLost] = useState(false);
  const [error, setError] = useState<{ text: string; retry: () => void } | null>(null);
  const [pending, start] = useTransition();

  function run(task: () => Promise<void>) {
    setError(null);
    start(task);
  }

  function pick(next: LeadStatus) {
    if (next === status) {
      onClose();
      return;
    }
    run(async () => {
      const res = await runAction(() => setStatusAction(leadId, next));
      if (!res.ok) {
        setError({ text: res.error, retry: () => pick(next) });
        return;
      }
      const info: StatusDone = {
        label: statusDoneLabel(next),
        undo: res.undo,
        askOutcome: res.askOutcome,
      };
      onSaved(info);
      if (res.askOutcome) {
        setDone(info);
        setStep("outcome");
      } else {
        onClose();
      }
    });
  }

  function undo() {
    if (!done) return;
    const snapshot = done.undo;
    run(async () => {
      const res = await runAction(() => restoreLeadAction(leadId, snapshot));
      if (!res.ok) {
        setError({ text: res.error, retry: undo });
        return;
      }
      onUndone();
      onClose();
    });
  }

  function outcome(value: LeadOutcome | null, reason?: LostReason) {
    run(async () => {
      const res = await runAction(() => setOutcomeAction(leadId, value, reason));
      if (!res.ok) {
        setError({ text: res.error, retry: () => outcome(value, reason) });
        return;
      }
      // Streifen nach dem Schließen nennt dann beides; „Rückgängig“
      // stellt den Stand vor „Erledigt“ wieder her (mit Ergebnis).
      if (done) {
        onSaved({
          ...done,
          label:
            value === null
              ? `${STATUS_LABELS.erledigt}, ohne Ergebnis`
              : `${STATUS_LABELS.erledigt}: ${outcomeText(value, reason ?? null)}`,
        });
      }
      onClose();
    });
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      titleId="status-sheet-title"
      title={step === "status" ? "Status" : "Wie ist es ausgegangen?"}
    >
      {step === "outcome" && done ? (
        <div className="bg-secondary mt-1 flex min-h-11 items-center justify-between gap-2 rounded-[4px] py-0.5 pr-0.5 pl-3 text-[15px]">
          <span>{done.label}</span>
          <button
            type="button"
            onClick={undo}
            disabled={pending}
            className="inline-flex h-11 items-center rounded-[3px] px-4 font-semibold underline underline-offset-4 disabled:opacity-60"
          >
            Rückgängig
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p role="alert" className="text-[14px] text-ink-olive">
            {error.text}
          </p>
          <button type="button" className={CHIP} disabled={pending} onClick={error.retry}>
            Nochmal
          </button>
        </div>
      ) : null}

      {step === "status" ? (
        <ul className="mt-2 space-y-2">
          {LEAD_STATUSES.map((s) => {
            const current = s === status;
            return (
              <li key={s}>
                <button
                  type="button"
                  aria-pressed={current}
                  disabled={pending}
                  onClick={() => pick(s)}
                  className={cn(
                    BIG,
                    current
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block">{STATUS_LABELS[s]}</span>
                    <span
                      className={cn(
                        "block text-[13px] font-normal",
                        current ? "text-background/75" : "text-muted-foreground",
                      )}
                    >
                      {STATUS_HINTS[s]}
                    </span>
                  </span>
                  {current ? <Check className="h-5 w-5 shrink-0" aria-label="aktuell" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-3 space-y-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => outcome("gewonnen")}
            className={cn(BIG, "border-border bg-background")}
          >
            Auftrag erhalten
          </button>
          <button
            type="button"
            disabled={pending}
            aria-expanded={lost}
            onClick={() => setLost((v) => !v)}
            className={cn(
              BIG,
              lost ? "border-foreground bg-secondary" : "border-border bg-background",
            )}
          >
            Kein Auftrag
          </button>
          {lost ? (
            <div className="grid grid-cols-2 gap-2 py-1" role="group" aria-label="Grund">
              {LOST_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  disabled={pending}
                  onClick={() => outcome("verloren", r)}
                  className={CHIP}
                >
                  {LOST_REASON_LABELS[r]}
                </button>
              ))}
              <button
                type="button"
                disabled={pending}
                onClick={() => outcome("verloren")}
                className={cn(CHIP, "text-muted-foreground")}
              >
                Grund offen lassen
              </button>
            </div>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={() => outcome(null)}
            className={cn(BIG, "border-border bg-background text-muted-foreground")}
          >
            Ohne Angabe
          </button>
        </div>
      )}

      {pending ? (
        <p className="text-muted-foreground mt-3 flex items-center gap-2 text-[14px]" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Speichert …
        </p>
      ) : null}
    </BottomSheet>
  );
}
