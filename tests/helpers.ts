import type { LeadRow } from "@/lib/leads-meta";

let counter = 0;

/** Test-Anfrage mit sinnvollen Standardwerten. */
export function makeLead(partial: Partial<LeadRow> = {}): LeadRow {
  counter += 1;
  const id = `00000000-0000-4000-8000-${String(counter).padStart(12, "0")}`;
  return {
    id,
    created_at: "2026-10-30T09:00:00.000Z",
    updated_at: "2026-10-30T09:00:00.000Z",
    kind: "anfrage",
    subject: "Neue Anfrage von Lisa Weber",
    reply_to: "lisa@example.de",
    fields: [["Name", "Lisa Weber"]],
    status: "neu",
    notes: "",
    delivered_via: "resend",
    delivery_error: null,
    ...partial,
  };
}
