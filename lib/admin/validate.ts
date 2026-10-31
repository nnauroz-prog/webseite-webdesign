/**
 * Eingabeprüfung für die Server Actions im Admin-Bereich. Jede
 * Funktion gibt bei ungültiger Eingabe null zurück; die Action zeigt
 * dann nur „Ungültige Eingabe.“, nie einen rohen Datenbank-Fehler.
 */

import type {
  ContactChannel,
  ContactResult,
  DeleteReason,
  LeadOutcome,
  LeadSnapshot,
  LeadStatus,
  LostReason,
} from "@/lib/leads-meta";

import { addDays, berlinDateIso } from "@/lib/admin/berlin-time";
import { NOTES_MAX } from "@/lib/admin/notes";
import {
  CONTACT_RESULTS,
  DELETE_REASONS,
  LEAD_STATUSES,
  LOST_REASONS,
  OUTCOMES,
} from "@/lib/leads-meta";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const NOTE_MAX = 500;

function oneOf<T extends string>(list: readonly T[], v: unknown): T | null {
  return typeof v === "string" && (list as readonly string[]).includes(v)
    ? (v as T)
    : null;
}

export function parseId(v: unknown): string | null {
  return typeof v === "string" && UUID_RE.test(v) ? v.toLowerCase() : null;
}

export function parseStatus(v: unknown): LeadStatus | null {
  return oneOf(LEAD_STATUSES, v);
}

export function parseOutcome(v: unknown): LeadOutcome | null {
  return oneOf(OUTCOMES, v);
}

export function parseLostReason(v: unknown): LostReason | null {
  return oneOf(LOST_REASONS, v);
}

export function parseDeleteReason(v: unknown): DeleteReason | null {
  return oneOf(DELETE_REASONS, v);
}

/** Echtes Kalenderdatum yyyy-mm-dd, sonst null. */
function realDate(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const m = ISO_DATE_RE.exec(v);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  if (
    t.getUTCFullYear() !== y ||
    t.getUTCMonth() !== mo - 1 ||
    t.getUTCDate() !== d
  ) {
    return null;
  }
  return v;
}

/**
 * Neues Datum (z. B. Wiedervorlage): echtes Datum von gestern bis
 * 400 Tage voraus, Hamburger Zeit.
 */
export function parseIsoDate(v: unknown, now: Date): string | null {
  const iso = realDate(v);
  if (!iso) return null;
  const today = berlinDateIso(now);
  if (iso < addDays(today, -1) || iso > addDays(today, 400)) return null;
  return iso;
}

/**
 * Bereits gespeichertes Datum (z. B. für „Rückgängig“): echtes Datum
 * zwischen 2020 und 2100, ohne Bezug auf heute. So lässt sich auch
 * eine überfällige Wiedervorlage wiederherstellen.
 */
export function parseStoredDate(v: unknown): string | null {
  const iso = realDate(v);
  if (!iso) return null;
  const year = Number(iso.slice(0, 4));
  return year >= 2020 && year <= 2100 ? iso : null;
}

/** Schnellnotiz: getrimmt, 1–500 Zeichen. */
export function parseNote(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const text = v.trim();
  return text.length >= 1 && text.length <= NOTE_MAX ? text : null;
}

/** Alle Notizen: höchstens 5000 Zeichen (leer ist erlaubt). */
export function parseNotes(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const text = v.replace(/\r\n?/g, "\n");
  return text.length <= NOTES_MAX ? text : null;
}

export function parseConfirm(v: unknown): boolean {
  return v === "ja";
}

export function parseContact(
  kanal: unknown,
  ergebnis: unknown,
): { kanal: ContactChannel; ergebnis: ContactResult } | null {
  if (kanal !== "anruf" && kanal !== "mail") return null;
  const allowed: readonly string[] = CONTACT_RESULTS[kanal];
  if (typeof ergebnis !== "string" || !allowed.includes(ergebnis)) return null;
  return { kanal, ergebnis: ergebnis as ContactResult };
}

/** Schnappschuss für „Rückgängig“, komplett neu geprüft. */
export function parseSnapshot(v: unknown): LeadSnapshot | null {
  if (!v || typeof v !== "object") return null;
  const s = v as Record<string, unknown>;
  const status = parseStatus(s.status);
  if (!status) return null;

  let follow_up_on: string | null = null;
  if (s.follow_up_on != null) {
    follow_up_on = parseStoredDate(s.follow_up_on);
    if (!follow_up_on) return null;
  }

  let outcome: LeadOutcome | null = null;
  if (s.outcome != null) {
    outcome = parseOutcome(s.outcome);
    if (!outcome) return null;
  }

  let lost_reason: string | null = null;
  if (s.lost_reason != null) {
    lost_reason = parseLostReason(s.lost_reason);
    if (!lost_reason) return null;
  }

  return { status, follow_up_on, outcome, lost_reason };
}

/** IDs der Antwort-Vorlagen aus lib/admin/reply-templates.ts. */
export const REPLY_TEMPLATE_IDS = [
  "telefonat",
  "rueckfragen",
  "nachfassen",
  "audit_eingang",
  "termin_bestaetigen",
  "termin_alternativ",
  "absage",
  "leer",
] as const;
export type ReplyTemplateId = (typeof REPLY_TEMPLATE_IDS)[number];

export function parseTemplateId(v: unknown): ReplyTemplateId | null {
  return oneOf(REPLY_TEMPLATE_IDS, v);
}

/** Fingerabdruck aus notesFingerprint (8 Hex-Zeichen). */
export function parseFingerprint(v: unknown): string | null {
  return typeof v === "string" && /^[0-9a-f]{8}$/.test(v) ? v : null;
}

/** Suchbegriff: getrimmt, höchstens 100 Zeichen (leer ist erlaubt). */
export function parseQuery(v: unknown): string | null {
  if (v == null) return "";
  if (typeof v !== "string") return null;
  const q = v.replace(/\s+/g, " ").trim();
  return q.length <= 100 ? q : null;
}

const NEXT_RE =
  /^\/admin(\/anfragen\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?$/i;

/**
 * Ziel nach dem Login: nur /admin oder /admin/anfragen/<uuid>. Alles
 * andere (fremde Hosts, //, Backslashes, ..) ergibt null, damit die
 * Login-Seite keine offene Weiterleitung wird.
 */
export function parseNext(v: unknown): string | null {
  return typeof v === "string" && NEXT_RE.test(v) ? v : null;
}
