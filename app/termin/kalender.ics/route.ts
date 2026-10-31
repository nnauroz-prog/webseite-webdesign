import { addDays, berlinDateIso, isWorkday } from "@/lib/admin/berlin-time";
import { isSlotTime } from "@/lib/admin/termin-slot";
import { SLOT_DURATION_MIN } from "@/lib/calendar-availability";
import {
  icsDocument,
  icsEscape,
  icsLocalTime,
  icsUtcStamp,
  VTIMEZONE_BERLIN,
} from "@/lib/ics";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, SITE_URL } from "@/lib/site";

/**
 * Öffentliche Kalender-Datei für ein bestätigtes Erstgespräch:
 * /termin/kalender.ics?start=2026-11-03T10:00
 *
 * Enthält bewusst keine Personendaten: nur Datum, Uhrzeit und die
 * Kontaktdaten von Sitalo. Der Link steht in der Bestätigungs-Mail
 * (Vorlage „Termin bestätigen“), weil sich am iPhone keine .ics-Datei
 * an eine Mail anhängen lässt.
 *
 * Erlaubt sind nur echte Termin-Zeiten: Werktag (ohne Feiertage und
 * BLOCKED_DATES), Uhrzeit aus SLOT_TIMES, von gestern bis 60 Tage voraus.
 */

const START_RE = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/;
const MAX_DAYS_AHEAD = 60;

function realDate(iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return (
    t.getUTCFullYear() === y &&
    t.getUTCMonth() === m - 1 &&
    t.getUTCDate() === d
  );
}

function endTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + SLOT_DURATION_MIN;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function notFound(): Response {
  return new Response("Diesen Termin gibt es nicht.", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function GET(request: Request): Response {
  const start = new URL(request.url).searchParams.get("start") ?? "";
  const match = START_RE.exec(start);
  if (!match) return notFound();
  const [, dateIso, time] = match;

  const now = new Date();
  const today = berlinDateIso(now);
  if (
    !realDate(dateIso) ||
    !isSlotTime(time) ||
    !isWorkday(dateIso) ||
    dateIso < addDays(today, -1) ||
    dateIso > addDays(today, MAX_DAYS_AHEAD)
  ) {
    return notFound();
  }

  const description = icsEscape(
    `Erstgespräch mit Sitalo Webdesign (${SLOT_DURATION_MIN} Minuten). Falls etwas dazwischenkommt: ${CONTACT_PHONE_DISPLAY} oder ${CONTACT_EMAIL}.`,
  );

  const body = icsDocument([
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sitalo Webdesign//Termin//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...VTIMEZONE_BERLIN,
    "BEGIN:VEVENT",
    `UID:termin-${dateIso}-${time.replace(":", "")}@sitalo.de`,
    `DTSTAMP:${icsUtcStamp(now)}`,
    `DTSTART;TZID=Europe/Berlin:${icsLocalTime(dateIso, time)}`,
    `DTEND;TZID=Europe/Berlin:${icsLocalTime(dateIso, endTime(time))}`,
    `SUMMARY:${icsEscape("Erstgespräch mit Sitalo Webdesign")}`,
    `DESCRIPTION:${description}`,
    `URL:${SITE_URL}/termin`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]);

  return new Response(body, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="sitalo-termin-${dateIso}-${time.replace(":", "")}.ics"`,
      "cache-control": "public, max-age=3600",
    },
  });
}
