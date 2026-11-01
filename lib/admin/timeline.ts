/**
 * Verlaufszeilen aus lead_events. Notiz-Ereignisse („notiz“,
 * „notizen“) werden ausgeblendet: Der Notizblock hat eigene
 * Zeitstempel und würde den Verlauf nur verdoppeln.
 */

import type { LeadEvent, LeadRow } from "@/lib/leads-meta";

import { angebotEventText } from "@/lib/admin/angebote";
import { berlinParts, formatShortDay } from "@/lib/admin/berlin-time";
import {
  CONTACT_RESULT_LABELS,
  LEAD_STATUSES,
  LOST_REASON_LABELS,
  OUTCOME_LABELS,
  STATUS_LABELS,
} from "@/lib/leads-meta";

export type TimelineLine = { key: string; at: string; time: string; text: string };

const pad = (n: number) => String(n).padStart(2, "0");

/** „31.10., 14:02“ in Hamburger Zeit. */
export function timelineStamp(d: Date): string {
  const p = berlinParts(d);
  return `${p.day}.${p.month}., ${pad(p.hour)}:${pad(p.minute)}`;
}

const TEMPLATE_LABELS: Record<string, string> = {
  telefonat: "Telefonat vorschlagen",
  rueckfragen: "Rückfragen zum Projekt",
  nachfassen: "Nachfassen",
  audit_eingang: "Eingang bestätigen",
  termin_bestaetigen: "Termin bestätigen",
  termin_alternativ: "Anderen Termin vorschlagen",
  absage: "Freundliche Absage",
  leer: "Leere Mail",
};

function statusLabel(v: unknown): string {
  return typeof v === "string" &&
    (LEAD_STATUSES as readonly string[]).includes(v)
    ? STATUS_LABELS[v as keyof typeof STATUS_LABELS]
    : "?";
}

/** Ergebnis-Text: „Kein Auftrag (Preis)“, „Auftrag erhalten“, „ohne Angabe“. */
export function outcomeText(
  outcome: unknown,
  reason: unknown,
): string {
  if (outcome !== "gewonnen" && outcome !== "verloren") return "ohne Angabe";
  const base = OUTCOME_LABELS[outcome];
  const r =
    typeof reason === "string" && reason in LOST_REASON_LABELS
      ? LOST_REASON_LABELS[reason as keyof typeof LOST_REASON_LABELS]
      : null;
  return r && outcome === "verloren" ? `${base} (${r})` : base;
}

/** Text einer Verlaufszeile oder null (ausgeblendet). */
export function eventText(event: Pick<LeadEvent, "action" | "detail">): string | null {
  const d = event.detail ?? {};
  switch (event.action) {
    case "status": {
      const text = `Status: ${statusLabel(d.from)} → ${statusLabel(d.to)}`;
      return d.rueckgaengig ? `${text} (rückgängig)` : text;
    }
    case "kontakt": {
      const ergebnis =
        typeof d.ergebnis === "string" && d.ergebnis in CONTACT_RESULT_LABELS
          ? CONTACT_RESULT_LABELS[d.ergebnis as keyof typeof CONTACT_RESULT_LABELS]
          : "?";
      if (d.kanal === "anruf") return `Anruf: ${ergebnis}`;
      const vorlage =
        typeof d.vorlage === "string" ? TEMPLATE_LABELS[d.vorlage] : undefined;
      return vorlage ? `Mail gesendet: ${vorlage}` : "Mail gesendet";
    }
    case "wiedervorlage":
      return typeof d.am === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d.am)
        ? `Wiedervorlage auf ${formatShortDay(d.am)}`
        : "Wiedervorlage entfernt";
    case "ergebnis":
      return `Ergebnis: ${outcomeText(d.outcome, d.lost_reason)}`;
    case "angebot":
      return angebotEventText(d);
    default:
      return null;
  }
}

/**
 * Verlauf, neueste zuerst; unten immer „Benachrichtigung …“ und
 * „Eingegangen“ aus den vorhandenen Spalten.
 */
export function timelineLines(
  events: LeadEvent[],
  lead: Pick<LeadRow, "created_at" | "delivered_via" | "delivery_error">,
): TimelineLine[] {
  const lines: TimelineLine[] = [];
  for (const e of events) {
    const text = eventText(e);
    if (!text) continue;
    lines.push({
      key: e.id,
      at: e.created_at,
      time: timelineStamp(new Date(e.created_at)),
      text,
    });
  }
  const created = new Date(lead.created_at);
  const delivery = lead.delivery_error
    ? "Benachrichtigung fehlgeschlagen"
    : lead.delivered_via
      ? `Benachrichtigung über ${lead.delivered_via === "resend" ? "Resend" : lead.delivered_via === "formspree" ? "Formspree" : lead.delivered_via}`
      : null;
  if (delivery) {
    lines.push({
      key: "zustellung",
      at: lead.created_at,
      time: timelineStamp(created),
      text: delivery,
    });
  }
  lines.push({
    key: "eingang",
    at: lead.created_at,
    time: timelineStamp(created),
    text: "Eingegangen",
  });
  return lines;
}

/** Gibt es schon ein Ergebnis-Ereignis (auch „ohne Angabe“)? */
export function hasOutcomeEvent(events: LeadEvent[] | null): boolean {
  return (events ?? []).some((e) => e.action === "ergebnis");
}
