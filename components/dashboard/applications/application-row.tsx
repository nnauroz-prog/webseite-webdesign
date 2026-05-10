"use client";

import { useActionState } from "react";

import { FormStatus } from "@/components/dashboard/form-status";
import { StatusPill } from "@/components/dashboard/status-pill";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { updateApplicationStatusAction } from "@/lib/actions/applications";
import { initialApplicationState } from "@/lib/actions/states";
import type {
  ApplicationRow as ApplicationModel,
  ApplicationStatus,
} from "@/types/website";

const LABELS: Record<ApplicationStatus, string> = {
  new: "Neu",
  reviewed: "Geprüft",
  accepted: "Angenommen",
  rejected: "Abgelehnt",
};

const ORDER: ApplicationStatus[] = ["new", "reviewed", "accepted", "rejected"];

export function ApplicationRow({
  application,
}: {
  application: ApplicationModel;
}) {
  const [state, formAction] = useActionState(
    updateApplicationStatusAction,
    initialApplicationState,
  );

  return (
    <article className="rounded-lg border p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base leading-tight font-semibold">
            {application.name}
          </h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            <a
              href={`mailto:${application.email}`}
              className="hover:text-foreground hover:underline"
            >
              {application.email}
            </a>
            {application.phone && (
              <>
                {" · "}
                <a
                  href={`tel:${application.phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground hover:underline"
                >
                  {application.phone}
                </a>
              </>
            )}
          </p>
          {application.desired_position && (
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Position:</span>{" "}
              <span className="font-medium">
                {application.desired_position}
              </span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusPill
            status={application.status}
            label={LABELS[application.status]}
          />
          <time
            dateTime={application.created_at}
            className="text-muted-foreground text-xs"
          >
            {formatDate(application.created_at)}
          </time>
        </div>
      </header>

      <p className="text-foreground/90 mt-4 text-sm leading-relaxed whitespace-pre-line">
        {application.message}
      </p>

      <form
        action={formAction}
        className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4"
      >
        <input type="hidden" name="id" value={application.id} />
        <label
          htmlFor={`ap-status-${application.id}`}
          className="text-muted-foreground text-xs tracking-wide uppercase"
        >
          Status
        </label>
        <select
          id={`ap-status-${application.id}`}
          name="status"
          defaultValue={application.status}
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
