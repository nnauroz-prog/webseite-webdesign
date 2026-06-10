import {
  nextSprechstunden,
  SPRECHSTUNDE_BEGINN_HHMM,
  SPRECHSTUNDE_ENDE_HHMM,
  SPRECHSTUNDE_RUFNUMMER,
} from "@/lib/sprechstunde-data";
import { SITE_URL } from "@/lib/site";

/**
 * iCalendar-Datei mit den nächsten drei Sprechstunden-Terminen.
 *
 * Vervollständigt das „Im Kalender vormerken"-Versprechen der
 * /sprechstunde-Seite: ein Klick, drei VEVENTs im Kalender des
 * Besuchers — Apple Kalender, Google Calendar und Outlook lesen
 * das Format alle nativ.
 *
 * Drei Einzel-Events statt RRULE: „erster Donnerstag im Monat"
 * wäre als RRULE (BYDAY=1TH) zwar ausdrückbar, aber Einzel-Events
 * mit konkreten Daten sind robuster gegen Client-Eigenheiten und
 * enden bewusst — niemand trägt sich einen unendlichen Serientermin
 * von einer Website ein.
 *
 * Zeiten als TZID=Europe/Berlin mit eingebetteter VTIMEZONE —
 * damit stimmt 17:00 auch über Sommerzeit-Grenzen hinweg.
 */

export const dynamic = "force-static";

function icsEscape(s: string): string {
  return s
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

/** Faltung nach RFC 5545: Zeilen max. 75 Oktette, Fortsetzung
 *  mit führendem Leerzeichen. Wir falten konservativ bei 70
 *  Zeichen — bei rein lateinischem Inhalt sicher unter 75 Bytes. */
function foldLine(line: string): string {
  if (line.length <= 70) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 70));
  rest = rest.slice(70);
  while (rest.length > 0) {
    parts.push(" " + rest.slice(0, 69));
    rest = rest.slice(69);
  }
  return parts.join("\r\n");
}

export function GET() {
  const termine = nextSprechstunden(3);
  const [bh, bm] = SPRECHSTUNDE_BEGINN_HHMM.split(":");
  const [eh, em] = SPRECHSTUNDE_ENDE_HHMM.split(":");

  const description = icsEscape(
    `Offene Telefon-Sprechstunde des Sitalo-Ateliers. Einfach anrufen: ${SPRECHSTUNDE_RUFNUMMER}. Keine Anmeldung, kein Verkauf. Details: ${SITE_URL}/sprechstunde`,
  );

  const events = termine
    .map((t) => {
      const d = t.iso.replaceAll("-", "");
      return [
        "BEGIN:VEVENT",
        `UID:sprechstunde-${t.iso}@sitalo.de`,
        `DTSTAMP:${d}T000000Z`,
        `DTSTART;TZID=Europe/Berlin:${d}T${bh}${bm}00`,
        `DTEND;TZID=Europe/Berlin:${d}T${eh}${em}00`,
        "SUMMARY:Sitalo Sprechstunde (offene Telefonzeit)",
        `DESCRIPTION:${description}`,
        `URL:${SITE_URL}/sprechstunde`,
        "END:VEVENT",
      ];
    })
    .flat();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sitalo Webdesign//Sprechstunde//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    // Europe/Berlin VTIMEZONE — Standard-Definition mit beiden
    // Übergängen, damit jeder Client die lokale Zeit korrekt hält.
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
    ...events,
    "END:VCALENDAR",
  ];

  const body = lines.map(foldLine).join("\r\n") + "\r\n";

  return new Response(body, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition":
        'attachment; filename="sitalo-sprechstunde.ics"',
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
