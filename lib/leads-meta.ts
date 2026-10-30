/** Status und Labels für Anfragen — ohne Server-Code, auch im Client nutzbar. */

export const LEAD_STATUSES = ["neu", "in_arbeit", "erledigt", "archiviert"] as const;
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
