/**
 * Kalender-Datei für eine Terminbuchung im Admin-Bereich
 * (/admin/anfragen/[id]/kalender.ics). Rein, unter node --test testbar.
 *
 * DESCRIPTION besteht nur aus den Formularfeldern „Wunsch-Slot“,
 * „Telefon“ und „Notiz“ (vom Kunden), nie aus lead.notes (interne
 * Notizen). Kein Admin-Link, kein URL-Feld, kein LOCATION (das Format
 * des Gesprächs ist noch offen).
 */

import type { TerminSlot } from "@/lib/admin/termin-slot";
import type { LeadRow } from "@/lib/leads-meta";

import { berlinDateIso, berlinTime } from "@/lib/admin/berlin-time";
import {
  icsDocument,
  icsEscape,
  icsLocalTime,
  icsUtcStamp,
  VTIMEZONE_BERLIN,
} from "@/lib/ics";
import { fieldValue } from "@/lib/leads-meta";

/** Formularfelder, die in die Beschreibung dürfen. */
export const TERMIN_ICS_FIELDS = ["Wunsch-Slot", "Telefon", "Notiz"] as const;

export function terminIcsFilename(slot: TerminSlot): string {
  return `termin-${slot.dateIso}-${slot.time.replace(":", "")}.ics`;
}

export function buildTerminIcs(
  lead: Pick<LeadRow, "id" | "fields">,
  slot: TerminSlot,
  now: Date,
): string {
  const name = fieldValue(lead, "Name");
  const summary = name
    ? `Erstgespräch: ${name} (Sitalo Webdesign)`
    : "Erstgespräch (Sitalo Webdesign)";
  const description = TERMIN_ICS_FIELDS.map((label) => {
    const value = fieldValue(lead, label);
    return value ? `${label}: ${value}` : null;
  })
    .filter(Boolean)
    .join("\n");

  return icsDocument([
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sitalo Webdesign//Admin Termin//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...VTIMEZONE_BERLIN,
    "BEGIN:VEVENT",
    // Feste UID: Ein erneuter Import aktualisiert den Eintrag.
    `UID:${lead.id}@sitalo.de`,
    `DTSTAMP:${icsUtcStamp(now)}`,
    `DTSTART;TZID=Europe/Berlin:${icsLocalTime(slot.dateIso, slot.time)}`,
    `DTEND;TZID=Europe/Berlin:${icsLocalTime(berlinDateIso(slot.end), berlinTime(slot.end))}`,
    `SUMMARY:${icsEscape(summary)}`,
    ...(description ? [`DESCRIPTION:${icsEscape(description)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ]);
}
