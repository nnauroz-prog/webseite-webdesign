/**
 * Startansicht „Jetzt“: wer eine Antwort bekommt, welche Termine
 * anstehen und welche Wiedervorlagen fällig sind.
 */

import type { LeadRow } from "@/lib/leads-meta";
import type { TerminSlot } from "@/lib/admin/termin-slot";

import { addWorkdays, berlinDateIso } from "@/lib/admin/berlin-time";
import { replyDue } from "@/lib/admin/reply-due";
import { parseTerminSlot } from "@/lib/admin/termin-slot";

export type TodayView = {
  /** status neu, nach „spätestens“ aufsteigend */
  melden: LeadRow[];
  /** Termine heute plus die nächsten 2 Werktage, offen, nach Beginn */
  termine: { lead: LeadRow; slot: TerminSlot }[];
  /** Wiedervorlage heute oder früher, offen, älteste zuerst */
  wiedervorlagen: LeadRow[];
  /** nächste künftige Wiedervorlage (yyyy-mm-dd) */
  naechsteWiedervorlage?: string;
};

const isOpen = (l: LeadRow) => l.status === "neu" || l.status === "in_arbeit";

export function buildToday(leads: LeadRow[], now: Date): TodayView {
  const today = berlinDateIso(now);
  const windowEnd = addWorkdays(today, 2);

  const melden = leads
    .filter((l) => l.status === "neu")
    .map((lead) => ({
      lead,
      key: replyDue(lead.kind, new Date(lead.created_at)).spaetestens.getTime(),
    }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.lead);

  const termine: TodayView["termine"] = [];
  for (const lead of leads) {
    if (lead.kind !== "termin" || !isOpen(lead)) continue;
    const slot = parseTerminSlot(lead);
    if (slot && slot.dateIso >= today && slot.dateIso <= windowEnd)
      termine.push({ lead, slot });
  }
  termine.sort((a, b) => a.slot.start.getTime() - b.slot.start.getTime());

  const withFollowUp = leads.filter(
    (l): l is LeadRow & { follow_up_on: string } =>
      isOpen(l) && typeof l.follow_up_on === "string",
  );
  const wiedervorlagen = withFollowUp
    .filter((l) => l.follow_up_on <= today)
    .sort((a, b) => a.follow_up_on.localeCompare(b.follow_up_on));
  const future = withFollowUp
    .map((l) => l.follow_up_on)
    .filter((d) => d > today)
    .sort();

  return {
    melden,
    termine,
    wiedervorlagen,
    ...(future[0] ? { naechsteWiedervorlage: future[0] } : {}),
  };
}
