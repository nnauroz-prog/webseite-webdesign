/**
 * Bausteine für iCalendar-Dateien (RFC 5545), gemeinsam genutzt von
 * app/sprechstunde/termine.ics, app/termin/kalender.ics und der
 * Termin-Datei im Admin-Bereich.
 */

/**
 * Text für Eigenschaftswerte (SUMMARY, DESCRIPTION …) maskieren.
 *
 * Zeilenenden (\r\n, \r, \n) werden zu „\n“, übrige Steuerzeichen
 * entfernt. Ein nacktes \r aus einem Formularwert kann so keine
 * eigene Kalenderzeile (URL:, ATTENDEE:, BEGIN:VALARM …) einschleusen.
 */
export function icsEscape(s: string): string {
  return s
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replace(/\r\n?|\n/g, "\\n")
    .replace(/[\x00-\x08\x0B-\x1F\x7F]/g, "");
}

const encoder = new TextEncoder();
const byteLength = (s: string) => encoder.encode(s).length;

/**
 * Faltung nach RFC 5545: Zeilen höchstens 75 Oktette, Fortsetzung mit
 * führendem Leerzeichen. Gefaltet wird konservativ nach 70 Bytes (erste
 * Zeile) bzw. 69 Bytes plus Leerzeichen, nie mitten in einem Zeichen.
 * Bei reinem ASCII ist das identisch mit der früheren Faltung nach
 * 70/69 Zeichen.
 */
export function foldLine(line: string): string {
  if (byteLength(line) <= 70) return line;
  const parts: string[] = [];
  let current = "";
  let currentBytes = 0;
  let limit = 70;
  for (const ch of line) {
    const b = byteLength(ch);
    if (currentBytes + b > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
      limit = 69;
    }
    current += ch;
    currentBytes += b;
  }
  if (current) parts.push(current);
  return parts.map((p, i) => (i === 0 ? p : ` ${p}`)).join("\r\n");
}

/** VTIMEZONE für Europe/Berlin, mit beiden Übergängen. */
export const VTIMEZONE_BERLIN: readonly string[] = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Berlin",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** UTC-Zeitstempel für DTSTAMP, z. B. 20261031T141200Z. */
export function icsUtcStamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Lokale Zeit für DTSTART;TZID=…, z. B. ("2026-11-03", "10:00") → 20261103T100000. */
export function icsLocalTime(dateIso: string, hhmm: string): string {
  return `${dateIso.replaceAll("-", "")}T${hhmm.replace(":", "")}00`;
}

/** Zeilen falten und mit CRLF verbinden (inkl. abschließendem CRLF). */
export function icsDocument(lines: readonly string[]): string {
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
