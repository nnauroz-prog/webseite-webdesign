import type { LeadEvent, LeadRow } from "@/lib/leads-meta";

import { Disclosure } from "@/app/admin/disclosure";
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
    <Disclosure
      className="mt-4"
      summaryClassName="text-[16px] font-semibold"
      title={`Verlauf (${lines.length})`}
    >
      {events === null ? (
        <p className="text-muted-foreground mb-2 text-[14px]">
          Verlauf startet nach dem Datenbank-Update.
        </p>
      ) : null}
      <ol className="divide-border divide-y text-[15px]">
        {lines.map((l) => (
          <li key={l.key} className="flex gap-3 py-2">
            <time dateTime={l.at} className="text-muted-foreground w-24 shrink-0 pt-px text-[13.5px]">
              {l.time}
            </time>
            <span className="min-w-0">{l.text}</span>
          </li>
        ))}
      </ol>
    </Disclosure>
  );
}
