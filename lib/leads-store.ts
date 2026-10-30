import "server-only";

import type { Lead } from "@/lib/lead-mail";
import type { LeadStatus } from "@/lib/leads-meta";
import { serviceClient } from "@/lib/supabase/service";

export { KIND_LABELS, LEAD_STATUSES, STATUS_LABELS } from "@/lib/leads-meta";
export type { LeadStatus } from "@/lib/leads-meta";

export type StoredLead = {
  id: string;
  created_at: string;
  updated_at: string;
  kind: Lead["kind"];
  subject: string;
  reply_to: string;
  fields: [string, string][];
  status: LeadStatus;
  notes: string;
  delivered_via: string | null;
  delivery_error: string | null;
};

/**
 * Speichert eine eingehende Anfrage. Gibt die ID zurück, oder null,
 * wenn Supabase nicht konfiguriert ist bzw. das Speichern scheitert
 * (dann wird geloggt; die Mail-Zustellung läuft trotzdem weiter).
 */
export async function saveLead(lead: Lead): Promise<string | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("leads")
    .insert({
      kind: lead.kind,
      subject: lead.subject,
      reply_to: lead.replyTo,
      fields: lead.fields,
    })
    .select("id")
    .single();
  if (error) {
    console.error("[anfrage] Speichern in Supabase fehlgeschlagen", error.message);
    return null;
  }
  return data.id as string;
}

export async function recordDelivery(
  id: string,
  result: { via: string } | { error: string },
): Promise<void> {
  const db = serviceClient();
  if (!db) return;
  const { error } = await db
    .from("leads")
    .update(
      "via" in result
        ? { delivered_via: result.via, delivery_error: null }
        : { delivered_via: null, delivery_error: result.error.slice(0, 500) },
    )
    .eq("id", id);
  if (error) console.error("[anfrage] Zustell-Status nicht gespeichert", error.message);
}

// --- Admin-Bereich (nur nach requireAdmin() aufrufen) ---

export async function listLeads(status?: LeadStatus): Promise<StoredLead[]> {
  const db = serviceClient();
  if (!db) return [];
  let query = db.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(`Anfragen konnten nicht geladen werden: ${error.message}`);
  return (data ?? []) as StoredLead[];
}

export async function countByStatus(): Promise<Record<LeadStatus, number>> {
  const counts = { neu: 0, in_arbeit: 0, erledigt: 0, archiviert: 0 };
  const db = serviceClient();
  if (!db) return counts;
  const { data, error } = await db.from("leads").select("status");
  if (error) throw new Error(`Zählung fehlgeschlagen: ${error.message}`);
  for (const row of data ?? []) {
    const s = row.status as LeadStatus;
    if (s in counts) counts[s]++;
  }
  return counts;
}

export async function getLead(id: string): Promise<StoredLead | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Anfrage konnte nicht geladen werden: ${error.message}`);
  return (data as StoredLead) ?? null;
}

export async function updateLead(
  id: string,
  patch: { status?: LeadStatus; notes?: string },
): Promise<void> {
  const db = serviceClient();
  if (!db) throw new Error("Supabase ist nicht konfiguriert.");
  const { error } = await db.from("leads").update(patch).eq("id", id);
  if (error) throw new Error(`Speichern fehlgeschlagen: ${error.message}`);
}

/** Name und Telefon aus den Formularfeldern, für Listen und Links. */
export function leadField(lead: StoredLead, label: string): string | undefined {
  return lead.fields.find(([k]) => k === label)?.[1];
}
