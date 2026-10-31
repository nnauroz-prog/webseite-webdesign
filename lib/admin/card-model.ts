/**
 * Anzeige-Daten für eine Listenkarte, aus einer Anfrage und „jetzt“.
 *
 * Rein (ohne React), damit Server-Seiten und die Suche im Client
 * dieselben Texte erzeugen. `now` kommt immer vom Server (nowIso),
 * sonst drohen Hydration-Abweichungen an Minuten- und Tagesgrenzen.
 */

import type { DueState } from "@/lib/admin/reply-due";
import type { LeadRow, LeadStatus } from "@/lib/leads-meta";

import {
  addDays,
  berlinDateIso,
  daysBetween,
  formatShortDay,
  relativeTime,
} from "@/lib/admin/berlin-time";
import { telHref } from "@/lib/admin/links";
import { dueState } from "@/lib/admin/reply-due";
import { fieldValue, KIND_LABELS, OUTCOME_LABELS } from "@/lib/leads-meta";

/** Eine Anfrage ohne interne Notizen (z. B. Suchtreffer im Client). */
export type CardLead = Omit<LeadRow, "notes"> & { notes?: string };

export type CardModel = {
  id: string;
  name: string;
  firma?: string;
  status: LeadStatus;
  kindLabel: string;
  /** „vor 25 Min“, „gestern 18:40“ … */
  when: string;
  /** Antwortfrist, nur bei status neu. */
  due: DueState | null;
  /** „Wiedervorlage Mi 4.11.“, nur bei offenen Anfragen. */
  followUp: string | null;
  followUpDue: boolean;
  outcome: { label: string; won: boolean } | null;
  mailFailed: boolean;
  preview: string;
  /** tel:-Link (geprüft) oder null. */
  tel: string | null;
};

const isOpen = (s: LeadStatus) => s === "neu" || s === "in_arbeit";

/** Erste nicht leere Zeile der Notizen (für „Wiedervorlage fällig“). */
export function firstNoteLine(notes: string | undefined): string | undefined {
  const line = (notes ?? "")
    .split(/\r\n?|\n/)
    .map((l) => l.trim())
    .find(Boolean);
  return line || undefined;
}

export function cardModel(lead: CardLead, now: Date): CardModel {
  const created = new Date(lead.created_at);
  const today = berlinDateIso(now);
  const followUpOn =
    isOpen(lead.status) && typeof lead.follow_up_on === "string"
      ? lead.follow_up_on
      : null;
  return {
    id: lead.id,
    name: fieldValue(lead, "Name") ?? (lead.reply_to || "Ohne Namen"),
    firma: fieldValue(lead, "Firma"),
    status: lead.status,
    kindLabel: KIND_LABELS[lead.kind],
    when: relativeTime(created, now),
    due: lead.status === "neu" ? dueState(lead.kind, created, now) : null,
    followUp: followUpOn ? `Wiedervorlage ${formatShortDay(followUpOn)}` : null,
    followUpDue: followUpOn !== null && followUpOn <= today,
    outcome: lead.outcome
      ? {
          label: OUTCOME_LABELS[lead.outcome],
          won: lead.outcome === "gewonnen",
        }
      : null,
    mailFailed: Boolean(lead.delivery_error),
    preview:
      fieldValue(lead, "Nachricht") ??
      fieldValue(lead, "Wunsch-Slot") ??
      fieldValue(lead, "Audit-URL") ??
      lead.subject,
    tel: telHref(fieldValue(lead, "Telefon")),
  };
}

/** „heute“, „morgen“, „in 3 Tagen“, „gestern“, „vor 2 Tagen“ */
export function relativeDay(iso: string, now: Date): string {
  const diff = daysBetween(berlinDateIso(now), iso);
  if (diff === 0) return "heute";
  if (diff === 1) return "morgen";
  if (diff === -1) return "gestern";
  return diff > 0 ? `in ${diff} Tagen` : `vor ${-diff} Tagen`;
}

/** „Heute“, „Morgen“ oder „Mo 2.11.“ für Terminzeilen. */
export function dayLabel(iso: string, now: Date): string {
  const today = berlinDateIso(now);
  if (iso === today) return "Heute";
  if (iso === addDays(today, 1)) return "Morgen";
  return formatShortDay(iso);
}

/**
 * Link in den SQL Editor des Supabase-Projekts. Die Projekt-Kennung
 * steht im Host der Project URL ({ref}.supabase.co); bei anderen
 * Adressen (z. B. lokal) das allgemeine Dashboard.
 */
export function sqlEditorUrl(supabaseUrl: string | undefined): string {
  try {
    const host = new URL(supabaseUrl ?? "").hostname;
    const m = /^([a-z0-9]{10,40})\.supabase\.co$/i.exec(host);
    if (m) return `https://supabase.com/dashboard/project/${m[1]}/sql/new`;
  } catch {
    // ungültige URL: allgemeines Dashboard
  }
  return "https://supabase.com/dashboard";
}
