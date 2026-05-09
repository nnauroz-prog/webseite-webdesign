"use client";

import { useActionState } from "react";

import { FormStatus } from "@/components/dashboard/form-status";
import { StatusPill } from "@/components/dashboard/status-pill";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { initialLeadState, updateLeadStatusAction } from "@/lib/actions/leads";
import type { LeadRow as LeadModel, LeadStatus } from "@/types/website";

const LABELS: Record<LeadStatus, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  closed: "Abgeschlossen",
};

const ORDER: LeadStatus[] = ["new", "contacted", "closed"];

export function LeadRow({ lead }: { lead: LeadModel }) {
  const [state, formAction] = useActionState(
    updateLeadStatusAction,
    initialLeadState,
  );

  return (
    <article className="rounded-lg border p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base leading-tight font-semibold">{lead.name}</h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            <a
              href={`mailto:${lead.email}`}
              className="hover:text-foreground hover:underline"
            >
              {lead.email}
            </a>
            {lead.phone && (
              <>
                {" · "}
                <a
                  href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground hover:underline"
                >
                  {lead.phone}
                </a>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={lead.status} label={LABELS[lead.status]} />
          <time
            dateTime={lead.created_at}
            className="text-muted-foreground text-xs"
          >
            {formatDate(lead.created_at)}
          </time>
        </div>
      </header>

      <p className="text-foreground/90 mt-4 text-sm leading-relaxed whitespace-pre-line">
        {lead.message}
      </p>

      <form
        action={formAction}
        className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4"
      >
        <input type="hidden" name="id" value={lead.id} />
        <label
          htmlFor={`status-${lead.id}`}
          className="text-muted-foreground text-xs tracking-wide uppercase"
        >
          Status
        </label>
        <select
          id={`status-${lead.id}`}
          name="status"
          defaultValue={lead.status}
          className="border-input bg-background h-9 rounded-md border px-3 text-sm shadow-sm"
        >
          {ORDER.map((s) => (
            <option key={s} value={s}>
              {LABELS[s]}
            </option>
          ))}
        </select>
        <SubmitButton label="Speichern" variant="outline" size="sm" />
        <div className="ml-auto">
          <FormStatus state={state} />
        </div>
      </form>
    </article>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
