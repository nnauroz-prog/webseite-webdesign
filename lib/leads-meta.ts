/**
 * Typen, Status und Labels für Anfragen. Ohne Imports und ohne
 * Server-Code: im Client, auf dem Server und unter node --test nutzbar.
 */

export type LeadKind = "anfrage" | "audit" | "termin";

/** Eine Anfrage, wie sie von den Website-Formularen kommt. */
export type Lead = {
  kind: LeadKind;
  subject: string;
  /** Feld-Label → Wert, in Anzeige-Reihenfolge. */
  fields: [string, string][];
  replyTo: string;
};

export const LEAD_STATUSES = [
  "neu",
  "in_arbeit",
  "erledigt",
  "archiviert",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  neu: "Neu",
  in_arbeit: "In Arbeit",
  erledigt: "Erledigt",
  archiviert: "Archiviert",
};

export const KIND_LABELS = {
  anfrage: "Anfrage",
  audit: "Audit",
  termin: "Termin",
} as const;

/** Ergebnis einer abgeschlossenen Anfrage. */
export const OUTCOMES = ["gewonnen", "verloren"] as const;
export type LeadOutcome = (typeof OUTCOMES)[number];

export const OUTCOME_LABELS: Record<LeadOutcome, string> = {
  gewonnen: "Auftrag erhalten",
  verloren: "Kein Auftrag",
};

export const LOST_REASONS = [
  "preis",
  "keine_rueckmeldung",
  "anderer_anbieter",
  "kein_bedarf",
  "zeitpunkt",
  "passt_nicht",
  "sonstiges",
] as const;
export type LostReason = (typeof LOST_REASONS)[number];

export const LOST_REASON_LABELS: Record<LostReason, string> = {
  preis: "Preis",
  keine_rueckmeldung: "Keine Rückmeldung",
  anderer_anbieter: "Anderer Anbieter",
  kein_bedarf: "Kein Bedarf mehr",
  zeitpunkt: "Falscher Zeitpunkt",
  passt_nicht: "Passt nicht zu uns",
  sonstiges: "Sonstiges",
};

/** Gründe für das endgültige Löschen einer archivierten Anfrage. */
export const DELETE_REASONS = [
  "anfrage_person",
  "frist",
  "spam",
  "sonstiges",
] as const;
export type DeleteReason = (typeof DELETE_REASONS)[number];

export const DELETE_REASON_LABELS: Record<DeleteReason, string> = {
  anfrage_person: "Löschanfrage der Person",
  frist: "Aufbewahrung nicht mehr nötig",
  spam: "Spam/Test",
  sonstiges: "Sonstiges",
};

/** Erlaubte Ergebnisse einer Kontakt-Rückfrage je Kanal. */
export const CONTACT_RESULTS = {
  anruf: ["erreicht", "mailbox", "nicht_erreicht"],
  mail: ["gesendet"],
} as const;
export type ContactChannel = keyof typeof CONTACT_RESULTS;
export type ContactResult = (typeof CONTACT_RESULTS)[ContactChannel][number];

export const CONTACT_RESULT_LABELS: Record<ContactResult, string> = {
  erreicht: "Erreicht",
  mailbox: "Mailbox",
  nicht_erreicht: "Nicht erreicht",
  gesendet: "Mail gesendet",
};

/**
 * Eine gespeicherte Anfrage (Tabelle public.leads). Die drei
 * optionalen Felder fehlen, solange die Migration
 * 20261101000000_admin_ausbau.sql nicht ausgeführt ist.
 */
export type LeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  kind: LeadKind;
  subject: string;
  reply_to: string;
  fields: [string, string][];
  status: LeadStatus;
  notes: string;
  delivered_via: string | null;
  delivery_error: string | null;
  follow_up_on?: string | null;
  outcome?: LeadOutcome | null;
  lost_reason?: string | null;
};

export type LeadEventAction =
  | "status"
  | "kontakt"
  | "wiedervorlage"
  | "ergebnis"
  | "notiz"
  | "notizen"
  /** Angebote: detail { was, nummer } (lib/admin/angebote.ts). */
  | "angebot";

export type LeadEvent = {
  id: string;
  lead_id: string;
  created_at: string;
  actor: string;
  action: LeadEventAction;
  detail: Record<string, unknown>;
};

/** Zustand vor einem Statuswechsel, für „Rückgängig“. */
export type LeadSnapshot = {
  status: LeadStatus;
  follow_up_on: string | null;
  outcome: LeadOutcome | null;
  lost_reason: string | null;
};

/** Wert eines Formularfelds nach Label, z. B. „Name“ oder „Telefon“. */
export function fieldValue(
  lead: Pick<LeadRow, "fields">,
  label: string,
): string | undefined {
  const value = lead.fields.find(([k]) => k === label)?.[1]?.trim();
  return value ? value : undefined;
}
