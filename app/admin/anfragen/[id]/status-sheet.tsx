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
import { runAction } from "@/app/admin/run-action";
import {
  LEAD_STATUSES,
  LOST_REASON_LABELS,
  LOST_REASONS,
  STATUS_LABELS,
} from "@/lib/leads-meta";
import { cn } from "@/lib/utils";

const BIG =
  "flex h-13 w-full items-center justify-between rounded-2xl border px-4 text-[16px] font-medium transition-colors disabled:opacity-60";
const CHIP =
  "border-border bg-background inline-flex h-11 items-center rounded-full border px-4 text-[15px] font-medium disabled:opacity-60";

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
        label: `Auf ${STATUS_LABELS[next]} gesetzt`,
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
        <div className="bg-secondary mt-1 flex min-h-11 items-center justify-between gap-2 rounded-xl py-0.5 pr-0.5 pl-3 text-[15px]">
          <span>{done.label}</span>
          <button
            type="button"
            onClick={undo}
            disabled={pending}
            className="inline-flex h-11 items-center rounded-full px-4 font-semibold underline underline-offset-4 disabled:opacity-60"
          >
            Rückgängig
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p role="alert" className="text-[14px] text-red-800">
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
                  {STATUS_LABELS[s]}
                  {current ? <Check className="h-5 w-5" aria-label="aktuell" /> : null}
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
            <div className="flex flex-wrap gap-2 py-1" aria-label="Grund">
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
                Ohne Grund
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
