import "server-only";

import type {
  DeleteReason,
  Lead,
  LeadEvent,
  LeadEventAction,
  LeadOutcome,
  LeadRow,
  LeadStatus,
} from "@/lib/leads-meta";

import { DbError, isMissingTable } from "@/lib/admin/db-errors";
import { serviceClient } from "@/lib/supabase/service";

export { KIND_LABELS, LEAD_STATUSES, STATUS_LABELS } from "@/lib/leads-meta";
export type { LeadStatus } from "@/lib/leads-meta";

/** Gespeicherte Anfrage. Der Typ liegt in lib/leads-meta.ts (LeadRow). */
export type StoredLead = LeadRow;

type PgError = { message: string; code?: string };

function dbError(prefix: string, error: PgError): DbError {
  return new DbError(`${prefix}: ${error.message}`, error.code);
}

/**
 * Speichert eine eingehende Anfrage. Gibt die ID zurück, oder null,
 * wenn Supabase nicht konfiguriert ist bzw. das Speichern scheitert
 * (dann wird geloggt; die Mail-Zustellung läuft trotzdem weiter).
 *
 * Bewusst nur kind, subject, reply_to und fields: So läuft das
 * Speichern vor und nach jeder Migration gleich.
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
  if (error) throw dbError("Anfragen konnten nicht geladen werden", error);
  return (data ?? []) as StoredLead[];
}

export async function countByStatus(): Promise<Record<LeadStatus, number>> {
  const counts = { neu: 0, in_arbeit: 0, erledigt: 0, archiviert: 0 };
  const db = serviceClient();
  if (!db) return counts;
  const { data, error } = await db.from("leads").select("status");
  if (error) throw dbError("Zählung fehlgeschlagen", error);
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
  if (error) throw dbError("Anfrage konnte nicht geladen werden", error);
  return (data as StoredLead) ?? null;
}

/**
 * Felder follow_up_on, outcome und lost_reason nur senden, wenn
 * checkSchema().leadsV2 === 'ok' ist (sonst PGRST204).
 */
export type LeadPatch = {
  status?: LeadStatus;
  notes?: string;
  follow_up_on?: string | null;
  outcome?: LeadOutcome | null;
  lost_reason?: string | null;
};

/** found: false, wenn es die Anfrage nicht (mehr) gibt. */
export async function updateLead(id: string, patch: LeadPatch): Promise<{ found: boolean }> {
  const db = serviceClient();
  if (!db) throw new DbError("Supabase ist nicht konfiguriert.");
  const { data, error } = await db.from("leads").update(patch).eq("id", id).select("id");
  if (error) throw dbError("Speichern fehlgeschlagen", error);
  return { found: (data ?? []).length > 0 };
}

export type EarlierLead = Pick<StoredLead, "id" | "created_at" | "kind" | "status" | "subject">;

/**
 * Frühere Anfragen derselben E-Mail-Adresse (Groß-/Kleinschreibung
 * egal), höchstens 20, neueste zuerst.
 *
 * Bewusst ohne Filter auf reply_to in der Abfrage: Sonst stünde die
 * Kunden-Adresse in der URL und damit in den Supabase-API-Logs.
 * Verglichen wird im Speicher über die neuesten 500 Anfragen.
 */
export async function listLeadsByReplyTo(
  replyTo: string,
  excludeId: string,
): Promise<EarlierLead[]> {
  const wanted = replyTo.trim().toLowerCase();
  if (!wanted) return [];
  const db = serviceClient();
  if (!db) return [];
  const { data, error } = await db
    .from("leads")
    .select("id,created_at,kind,status,subject,reply_to")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw dbError("Frühere Anfragen konnten nicht geladen werden", error);
  return ((data ?? []) as (EarlierLead & { reply_to: string })[])
    .filter((row) => row.id !== excludeId && row.reply_to?.trim().toLowerCase() === wanted)
    .slice(0, 20)
    .map((row) => ({
      id: row.id,
      created_at: row.created_at,
      kind: row.kind,
      status: row.status,
      subject: row.subject,
    }));
}

/** Verlauf einer Anfrage, neueste zuerst. null, wenn die Tabelle fehlt. */
export async function listEvents(leadId: string): Promise<LeadEvent[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("lead_events")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Verlauf konnte nicht geladen werden", error);
  }
  return (data ?? []) as LeadEvent[];
}

/**
 * Schreibt einen Verlaufseintrag, wenn möglich. Wirft nie: Fehlt die
 * Tabelle oder scheitert das Schreiben, gibt es false (geloggt werden
 * nur ID und Fehlercode, keine Inhalte).
 */
export async function addEvent(
  leadId: string,
  actor: string,
  action: LeadEventAction,
  detail: Record<string, unknown> = {},
): Promise<boolean> {
  try {
    const db = serviceClient();
    if (!db) return false;
    const { error } = await db
      .from("lead_events")
      .insert({ lead_id: leadId, actor, action, detail });
    if (error) {
      if (!isMissingTable(error)) {
        console.error("[admin] Verlauf nicht gespeichert", { leadId, code: error.code ?? "?" });
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error("[admin] Verlauf nicht gespeichert", {
      leadId,
      code: err instanceof DbError ? err.code : "exception",
    });
    return false;
  }
}

/**
 * Löscht eine archivierte Anfrage endgültig (Verlauf per Cascade mit).
 * deleted ist nur true, wenn genau diese eine Zeile gelöscht wurde;
 * eine nicht archivierte Anfrage bleibt stehen (auch wenn sie
 * zwischendurch auf einem anderen Gerät wieder geöffnet wurde).
 * logged: Eintrag in lead_deletions (ohne Name, E-Mail oder Inhalte).
 */
export async function deleteLead(
  id: string,
  actor: string,
  reason: DeleteReason,
): Promise<{ deleted: boolean; logged: boolean }> {
  const db = serviceClient();
  if (!db) throw new DbError("Supabase ist nicht konfiguriert.");

  const { data: before, error: readError } = await db
    .from("leads")
    .select("kind,created_at")
    .eq("id", id)
    .maybeSingle();
  if (readError) throw dbError("Anfrage konnte nicht geladen werden", readError);
  if (!before) return { deleted: false, logged: false };

  const { data, error } = await db
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("status", "archiviert")
    .select("id");
  if (error) throw dbError("Löschen fehlgeschlagen", error);
  if ((data ?? []).length !== 1) return { deleted: false, logged: false };

  let logged = false;
  try {
    const { error: logError } = await db.from("lead_deletions").insert({
      lead_id: id,
      lead_kind: before.kind as string,
      lead_created_at: before.created_at as string,
      reason,
      deleted_by: actor,
    });
    logged = !logError;
    if (logError && !isMissingTable(logError)) {
      console.error("[admin] Löschprotokoll nicht geschrieben", { leadId: id, code: logError.code ?? "?" });
    }
  } catch {
    console.error("[admin] Löschprotokoll nicht geschrieben", { leadId: id, code: "exception" });
  }
  return { deleted: true, logged };
}

export type DeletionRow = { deleted_at: string; lead_kind: string | null; reason: string };

/** Letzte Einträge im Löschprotokoll. null, wenn die Tabelle fehlt. */
export async function listDeletions(limit = 20): Promise<DeletionRow[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("lead_deletions")
    .select("deleted_at,lead_kind,reason")
    .order("deleted_at", { ascending: false })
    .limit(limit);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Löschprotokoll konnte nicht geladen werden", error);
  }
  return (data ?? []) as DeletionRow[];
}

/** Name und Telefon aus den Formularfeldern, für Listen und Links. */
export function leadField(lead: StoredLead, label: string): string | undefined {
  return lead.fields.find(([k]) => k === label)?.[1];
}
