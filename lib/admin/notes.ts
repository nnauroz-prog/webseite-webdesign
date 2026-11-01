/**
 * Notizen zu einer Anfrage: Schnellnotiz oben anfügen und
 * Fingerabdruck für den Konfliktschutz beim Bearbeiten.
 */

import { berlinParts } from "@/lib/admin/berlin-time";

export const NOTES_MAX = 5000;

const pad = (n: number) => String(n).padStart(2, "0");

/** „31.10. 14:12“ in Hamburger Zeit. */
export function noteStamp(now: Date): string {
  const p = berlinParts(now);
  return `${p.day}.${p.month}. ${pad(p.hour)}:${pad(p.minute)}`;
}

/** Mehrzeiliger Text wird zu einer Zeile („ · “ statt Zeilenumbruch). */
export function singleLine(text: string): string {
  return text
    .split(/\r\n?|\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" · ");
}

/**
 * Setzt „31.10. 14:12 · text“ als erste Zeile vor die Notizen. Über
 * NOTES_MAX Zeichen werden die ältesten Zeilen am Ende entfernt.
 */
export function prependNoteLine(
  notes: string,
  text: string,
  now: Date,
): string {
  const line = `${noteStamp(now)} · ${singleLine(text)}`.slice(0, NOTES_MAX);
  const rest = notes.replace(/\r\n?/g, "\n");
  if (!rest.trim()) return line;
  const lines = [line, ...rest.split("\n")];
  let total = lines.join("\n").length;
  while (total > NOTES_MAX && lines.length > 1) {
    const removed = lines.pop()!;
    total -= removed.length + 1;
  }
  return lines.join("\n");
}

/** FNV-1a (32 Bit) über die UTF-8-Bytes, als 8-stelliges Hex. */
export function notesFingerprint(notes: string): string {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(notes)) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
