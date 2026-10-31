"use client";

import { useActionState } from "react";

import { updateLeadAction, type ActionState } from "@/app/admin/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatus } from "@/lib/leads-meta";

export function LeadEditor({
  id,
  status,
  notes,
}: {
  id: string;
  status: LeadStatus;
  notes: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateLeadAction,
    {},
  );

  return (
    <form action={action} className="border-border bg-card space-y-5 rounded-2xl border p-5">
      <input type="hidden" name="id" value={id} />
      <fieldset className="min-w-0">
        <legend className="text-[13px] font-medium">Status</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEAD_STATUSES.map((s) => (
            <label
              key={s}
              className="border-border has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background flex h-10 cursor-pointer items-center justify-center rounded-full border text-[13px] font-medium transition-colors"
            >
              <input
                type="radio"
                name="status"
                value={s}
                defaultChecked={s === status}
                className="sr-only"
              />
              {STATUS_LABELS[s]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="lead-notes">Notizen (nur für dich)</Label>
        <Textarea
          id="lead-notes"
          name="notes"
          defaultValue={notes}
          rows={5}
          maxLength={5000}
          placeholder="Angerufen am …, Angebot geschickt …"
        />
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} className="h-10 rounded-full px-6">
          {pending ? "Speichern …" : "Speichern"}
        </Button>
        {state.saved && !pending ? (
          <span role="status" className="text-ink-olive text-[13px]">
            Gespeichert.
          </span>
        ) : null}
      </div>
    </form>
  );
}
