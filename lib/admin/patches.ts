/**
 * Zustandsregeln für Status, Kontakt und Rückgängig als reine
 * Funktionen (getestet in tests/patches.test.ts). Die Server Actions
 * schicken nur, was hier herauskommt.
 *
 * Grundregel: follow_up_on, outcome und lost_reason stehen nur im
 * Patch, wenn v2 (die neuen Spalten sind sicher vorhanden) gilt.
 * Sonst bricht Supabase den ganzen Update mit PGRST204 ab.
 */

import type { ReplyTemplateId } from "@/lib/admin/validate";
import type {
  ContactChannel,
  ContactResult,
  LeadRow,
  LeadSnapshot,
  LeadStatus,
} from "@/lib/leads-meta";
import type { LeadPatch } from "@/lib/leads-store";

/**
 * Patch für einen Statuswechsel. Mit den neuen Spalten: Erledigt und
 * Archiviert leeren die Wiedervorlage, Neu und In Arbeit das Ergebnis.
 */
export function statusPatch(status: LeadStatus, v2: boolean): LeadPatch {
  const patch: LeadPatch = { status };
  if (!v2) return patch;
  if (status === "erledigt" || status === "archiviert") {
    patch.follow_up_on = null;
  } else {
    patch.outcome = null;
    patch.lost_reason = null;
  }
  return patch;
}

export type ContactPlan = {
  /** Ohne Notizen; die Action ergänzt sie, falls der Verlauf fehlt. */
  patch: LeadPatch;
  /** Gesendete Absage (Vorlage „absage“). */
  isAbsage: boolean;
  /** Nach der Absage den Grund abfragen (nur mit v2). */
  askReason: boolean;
};

/**
 * Antwort auf „Erreicht?“ bzw. „Mail gesendet?“.
 *
 * - Erreicht oder Mail gesendet: Status neu wird In Arbeit.
 * - Mailbox und Nicht erreicht ändern nichts.
 * - Gesendete Absage: Erledigt (außer schon Erledigt/Archiviert); mit
 *   v2 zusätzlich Kein Auftrag und leere Wiedervorlage.
 */
export function contactPatch(
  lead: Pick<LeadRow, "status">,
  contact: { kanal: ContactChannel; ergebnis: ContactResult },
  vorlage: ReplyTemplateId | null,
  v2: boolean,
): ContactPlan {
  const patch: LeadPatch = {};
  const isAbsage =
    contact.kanal === "mail" &&
    contact.ergebnis === "gesendet" &&
    vorlage === "absage";
  let askReason = false;
  if (isAbsage) {
    if (lead.status !== "erledigt" && lead.status !== "archiviert") {
      patch.status = "erledigt";
    }
    if (v2) {
      patch.follow_up_on = null;
      patch.outcome = "verloren";
      patch.lost_reason = null;
      askReason = true;
    }
  } else if (
    (contact.ergebnis === "erreicht" || contact.ergebnis === "gesendet") &&
    lead.status === "neu"
  ) {
    patch.status = "in_arbeit";
  }
  return { patch, isAbsage, askReason };
}

/**
 * Patch für „Rückgängig“. null: Der Schnappschuss enthält neue Spalten,
 * obwohl sie nicht sicher vorhanden sind (ungültig).
 */
export function restorePatch(snapshot: LeadSnapshot, v2: boolean): LeadPatch | null {
  const patch: LeadPatch = { status: snapshot.status };
  if (v2) {
    patch.follow_up_on = snapshot.follow_up_on;
    patch.outcome = snapshot.outcome;
    patch.lost_reason =
      snapshot.outcome === "verloren" ? snapshot.lost_reason : null;
    return patch;
  }
  if (snapshot.follow_up_on || snapshot.outcome) return null;
  return patch;
}
