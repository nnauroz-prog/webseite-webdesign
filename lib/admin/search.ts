/**
 * Suche über Anfragen (rein, im Speicher). Groß-/Kleinschreibung egal,
 * Umlaute gefaltet (ä→ae, ö→oe, ü→ue, ß→ss), Telefonnummern über
 * normalizePhoneDigits aus lib/admin/links.ts.
 */

import type { LeadRow } from "@/lib/leads-meta";

import { normalizePhoneDigits } from "@/lib/admin/links";
import { fieldValue } from "@/lib/leads-meta";

export { normalizePhoneDigits } from "@/lib/admin/links";

export function foldText(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß|ẞ/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const PHONE_QUERY_RE = /^[\d\s+()/.-]+$/;

/** Ziffern der Suchanfrage, wenn sie wie eine Telefonnummer aussieht (≥ 4 Ziffern). */
function phoneQuery(q: string): string | null {
  const trimmed = q.trim();
  if (!PHONE_QUERY_RE.test(trimmed)) return null;
  const digits = normalizePhoneDigits(trimmed);
  return digits.replace(/\D/g, "").length >= 4 ? digits : null;
}

function haystack(lead: LeadRow): string {
  return foldText(
    [
      fieldValue(lead, "Name"),
      lead.reply_to,
      fieldValue(lead, "E-Mail"),
      fieldValue(lead, "Firma"),
      fieldValue(lead, "Audit-URL"),
      lead.subject,
      lead.notes,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

/** Passt die Anfrage zur Suche? Alle Wörter müssen vorkommen. */
export function matchLead(lead: LeadRow, q: string): boolean {
  const folded = foldText(q);
  if (!folded) return false;

  const phone = phoneQuery(q);
  if (phone) {
    const tel = fieldValue(lead, "Telefon");
    if (tel && normalizePhoneDigits(tel).includes(phone)) return true;
  }

  const hay = haystack(lead);
  return folded.split(" ").every((token) => hay.includes(token));
}

/**
 * Weitere Anfragen derselben Person: gleiche E-Mail (ohne Rücksicht
 * auf Groß-/Kleinschreibung) oder gleiche Telefonnummer (0176 … und
 * +49 176 … gelten als gleich). Die Anfrage selbst ist nicht dabei.
 */
export function relatedLeads<
  T extends Pick<LeadRow, "id" | "reply_to" | "fields">,
>(lead: Pick<LeadRow, "id" | "reply_to" | "fields">, all: T[]): T[] {
  const mail = lead.reply_to.trim().toLowerCase();
  const tel = fieldValue(lead, "Telefon");
  const phone = tel ? normalizePhoneDigits(tel) : "";
  return all.filter((other) => {
    if (other.id === lead.id) return false;
    if (mail && other.reply_to?.trim().toLowerCase() === mail) return true;
    if (phone.length >= 6) {
      const otherTel = fieldValue(other, "Telefon");
      if (otherTel && normalizePhoneDigits(otherTel) === phone) return true;
    }
    return false;
  });
}
