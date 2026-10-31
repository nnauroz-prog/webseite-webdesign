import type { LeadEvent, LeadRow } from "@/lib/leads-meta";

import { timelineLines } from "@/lib/admin/timeline";

/** Verlauf, standardmäßig zugeklappt, neueste zuerst. */
export function Timeline({
  events,
  lead,
}: {
  /** null: Tabelle lead_events fehlt noch. */
  events: LeadEvent[] | null;
  lead: Pick<LeadRow, "created_at" | "delivered_via" | "delivery_error">;
}) {
  const lines = timelineLines(events ?? [], lead);
  return (
    <details className="border-border bg-card mt-4 rounded-2xl border">
      <summary className="flex min-h-12 cursor-pointer items-center px-4 text-[16px] font-semibold">
        Verlauf ({lines.length})
      </summary>
      <div className="px-4 pb-4">
        {events === null ? (
          <p className="text-muted-foreground mb-2 text-[14px]">
            Verlauf startet nach dem Datenbank-Update.
          </p>
        ) : null}
        <ol className="divide-border divide-y text-[15px]">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-3 py-2">
              <time dateTime={l.at} className="text-muted-foreground w-28 shrink-0 text-[13.5px] tabular-nums">
                {l.time}
              </time>
              <span className="min-w-0">{l.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
