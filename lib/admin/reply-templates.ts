/**
 * Antwort-Vorlagen für das eigene Mail-Programm (mailto).
 *
 * Kundentexte in Sie-Form, ohne geratenes Herr/Frau. Sätze mit
 * fehlenden Angaben entfallen ganz. Es gibt bewusst KEINE
 * [Platzhalter]: Wo eine Uhrzeit nötig ist, wählt der Inhaber vorher
 * freie Zeiten (picks), sonst fragt der Text offen nach.
 */

import type { LeadRow } from "@/lib/leads-meta";

import {
  berlinDateIso,
  formatLongDay,
  nextWorkday,
} from "@/lib/admin/berlin-time";
import { clampBody, MAILTO_BODY_MAX } from "@/lib/admin/links";
import { replyDue } from "@/lib/admin/reply-due";
import { parseTerminSlot } from "@/lib/admin/termin-slot";
import { SLOT_DURATION_MIN } from "@/lib/calendar-availability";
import { fieldValue } from "@/lib/leads-meta";
import { PAKETE } from "@/lib/pakete-data";
import { CONTACT_PHONE_DISPLAY, SITE_URL } from "@/lib/site";
import { PACKAGE_LABELS } from "@/lib/validations/inquiries";

/** Eine vom Inhaber gewählte freie Zeit. */
export type SlotPick = { dateIso: string; time: string };

export type ReplyTemplate = {
  id: string;
  label: string;
  subject: string;
  body: string;
  /** Wie viele Zeiten vorher gewählt werden (0 = keine Auswahl). */
  slots: 0 | 1 | 2;
};

const SIGNATURE = `Viele Grüße\nSitalo Webdesign\n${CONTACT_PHONE_DISPLAY} · sitalo.de`;

/** „Dienstag, 3. November, um 10:00 Uhr“ */
export function formatSlotForCustomer(dateIso: string, time: string): string {
  return `${formatLongDay(dateIso)}, um ${time} Uhr`;
}

/** Link auf die öffentliche Kalender-Datei (ohne Personendaten). */
export function calendarLink(dateIso: string, time: string): string {
  return `${SITE_URL}/termin/kalender.ics?start=${dateIso}T${time}`;
}

function greeting(lead: LeadRow): string {
  const name = fieldValue(lead, "Name");
  return name ? `Guten Tag ${name},` : "Guten Tag,";
}

/** Absätze zusammensetzen; leere (fehlende Angaben) fallen weg. */
function compose(
  lead: LeadRow,
  ...paragraphs: (string | false | undefined | null)[]
): string {
  const parts = [
    greeting(lead),
    ...paragraphs.filter((p): p is string => Boolean(p)),
    SIGNATURE,
  ];
  return clampBody(parts.join("\n\n"));
}

function packageSentence(lead: LeadRow): string | undefined {
  const label = fieldValue(lead, "Paket-Wunsch");
  if (!label) return undefined;
  const slug = (
    Object.keys(PACKAGE_LABELS) as (keyof typeof PACKAGE_LABELS)[]
  ).find((k) => PACKAGE_LABELS[k] === label);
  if (slug === "unsicher")
    return "Welches Paket passt, klären wir gern gemeinsam.";
  const paket = PAKETE.find((p) => p.slug === slug);
  if (!paket) return undefined;
  return `Sie interessieren sich für das Paket ${paket.name} (${paket.setup}).`;
}

function thanks(lead: LeadRow, what: string): string {
  const firma = fieldValue(lead, "Firma");
  return `vielen Dank für Ihre ${what}${firma ? ` für ${firma}` : ""}.`;
}

function telefonat(lead: LeadRow, picks: SlotPick[]): string {
  const tel = fieldValue(lead, "Telefon");
  const intro = [
    thanks(lead, "Anfrage"),
    packageSentence(lead),
    wunschzeitraum(lead),
  ]
    .filter(Boolean)
    .join(" ");
  const pick = picks[0];
  const vorschlag = pick
    ? `Am besten besprechen wir alles in einem kurzen Telefonat. Passt es Ihnen am ${formatSlotForCustomer(pick.dateIso, pick.time)}? Dann rufen wir Sie ${tel ? `unter ${tel} ` : ""}an.`
    : `Am besten besprechen wir alles in einem kurzen Telefonat. Wann passt es Ihnen${tel ? ` und erreichen wir Sie unter ${tel}` : ""}?`;
  return compose(
    lead,
    intro,
    vorschlag,
    `Wenn Ihnen das lieber ist, wählen Sie direkt selbst einen Termin: ${SITE_URL}/termin`,
  );
}

function wunschzeitraum(lead: LeadRow): string | undefined {
  const z = fieldValue(lead, "Wunschzeitraum");
  return z ? `Ihr Wunschzeitraum: ${z}.` : undefined;
}

function rueckfragen(lead: LeadRow): string {
  const fragen: string[] = [];
  if (!fieldValue(lead, "Branche"))
    fragen.push("In welcher Branche sind Sie tätig?");
  if (!fieldValue(lead, "Paket-Wunsch")) {
    fragen.push(
      "Wie viel soll die Website umfassen, eher eine einzelne Seite oder mehrere Unterseiten?",
    );
  }
  if (!fieldValue(lead, "Wunschzeitraum"))
    fragen.push("Bis wann soll die neue Website online sein?");
  fragen.push("Gibt es bereits eine Website oder Domain?");
  if (!fieldValue(lead, "Telefon"))
    fragen.push("Unter welcher Nummer erreichen wir Sie am besten?");
  return compose(
    lead,
    `${thanks(lead, "Anfrage")} Damit wir Ihnen ein passendes Angebot machen können, haben wir noch ein paar Fragen:`,
    fragen.map((f, i) => `${i + 1}. ${f}`).join("\n"),
    "Eine kurze Antwort genügt, gern auch stichwortartig.",
  );
}

function nachfassen(lead: LeadRow): string {
  const firma = fieldValue(lead, "Firma");
  return compose(
    lead,
    `wir wollten uns noch einmal zu Ihrer Anfrage${firma ? ` für ${firma}` : ""} melden. Sind noch Fragen offen, oder sollen wir den nächsten Schritt planen?`,
    "Sie erreichen uns jederzeit per Antwort auf diese Mail oder telefonisch.",
  );
}

/**
 * Zusage für das Audit, auf den Tag gerundet (keine Uhrzeit mitten in
 * der Nacht). Ist die 48-h-Frist schon vorbei, gilt der nächste Werktag.
 */
export function auditPromiseDay(lead: Pick<LeadRow, "created_at">, now: Date): string {
  const due = replyDue("audit", new Date(lead.created_at)).spaetestens;
  return due.getTime() >= now.getTime()
    ? berlinDateIso(due)
    : nextWorkday(berlinDateIso(now));
}

function auditEingang(lead: LeadRow, now: Date): string {
  const url = fieldValue(lead, "Audit-URL");
  return compose(
    lead,
    `vielen Dank für Ihre Audit-Anfrage${url ? ` für ${url}` : ""}. Wir sehen uns die Website jetzt in Ruhe an.`,
    `Ihre Einschätzung bekommen Sie bis ${formatLongDay(auditPromiseDay(lead, now))}.`,
  );
}

function terminBestaetigen(lead: LeadRow): string {
  const slot = parseTerminSlot(lead);
  const wunsch = fieldValue(lead, "Wunsch-Slot");
  const wann = slot
    ? `${formatSlotForCustomer(slot.dateIso, slot.time)} (${SLOT_DURATION_MIN} Minuten)`
    : wunsch;
  return compose(
    lead,
    wann
      ? `vielen Dank für Ihre Terminbuchung. Hiermit bestätigen wir Ihren Termin am ${wann}.`
      : "vielen Dank für Ihre Terminbuchung. Hiermit bestätigen wir Ihren Wunschtermin.",
    "Wie möchten Sie sprechen: Telefon, Video-Call oder vor Ort in Hamburg?",
    slot && `Für Ihren Kalender: ${calendarLink(slot.dateIso, slot.time)}`,
    "Falls etwas dazwischenkommt, antworten Sie einfach auf diese Mail.",
  );
}

function terminAlternativ(lead: LeadRow, picks: SlotPick[], now: Date): string {
  const slot = parseTerminSlot(lead);
  const wunsch = fieldValue(lead, "Wunsch-Slot");
  const first = slot
    ? slot.end.getTime() < now.getTime()
      ? `vielen Dank für Ihre Terminbuchung. Leider konnten wir Ihren Wunschtermin am ${formatSlotForCustomer(slot.dateIso, slot.time)} nicht mehr rechtzeitig bestätigen.`
      : `vielen Dank für Ihre Terminbuchung. Leider ist Ihr Wunschtermin am ${formatSlotForCustomer(slot.dateIso, slot.time)} schon vergeben.`
    : wunsch
      ? `vielen Dank für Ihre Terminbuchung. Leider ist der gewünschte Termin, ${wunsch}, schon vergeben.`
      : "vielen Dank für Ihre Terminbuchung. Leider ist Ihr Wunschtermin schon vergeben.";
  const options = picks.slice(0, 2);
  if (options.length === 0) {
    return compose(
      lead,
      first,
      `Welche Zeiten passen Ihnen in den nächsten Tagen? Gern können Sie auch direkt einen neuen Termin wählen: ${SITE_URL}/termin`,
    );
  }
  const list = options
    .map(
      (p, i) =>
        `${i + 1}. ${formatSlotForCustomer(p.dateIso, p.time)}\n   Für Ihren Kalender: ${calendarLink(p.dateIso, p.time)}`,
    )
    .join("\n");
  return compose(
    lead,
    first,
    options.length === 1
      ? "Wir können Ihnen diese Zeit anbieten:"
      : "Wir können Ihnen diese Zeiten anbieten:",
    list,
    "Antworten Sie einfach kurz, welche Zeit Ihnen passt.",
  );
}

function absage(lead: LeadRow): string {
  return compose(
    lead,
    "vielen Dank für Ihre Anfrage und Ihr Interesse an Sitalo Webdesign.",
    "Leider können wir Ihr Vorhaben derzeit nicht übernehmen. Wir wünschen Ihnen dafür alles Gute und viel Erfolg.",
  );
}

function leer(lead: LeadRow): string {
  return `${greeting(lead)}\n\n\n\n${SIGNATURE}`;
}

/**
 * Vorlagen passend zur Art der Anfrage, bezogen auf `now` (Fristen,
 * vergangene Termine). `picks` sind die vorher
 * gewählten freien Zeiten für „Telefonat vorschlagen“ (1) bzw.
 * „Anderen Termin vorschlagen“ (2).
 */
export function templatesFor(
  lead: LeadRow,
  now: Date,
  picks: SlotPick[] = [],
): ReplyTemplate[] {
  const subject = `Re: ${lead.subject}`;
  const t = (
    id: string,
    label: string,
    body: string,
    slots: 0 | 1 | 2 = 0,
  ): ReplyTemplate => ({
    id,
    label,
    subject,
    body: body.length > MAILTO_BODY_MAX ? clampBody(body) : body,
    slots,
  });

  const list: ReplyTemplate[] = [];
  if (lead.kind === "anfrage") {
    list.push(
      t("telefonat", "Telefonat vorschlagen", telefonat(lead, picks), 1),
    );
    list.push(t("rueckfragen", "Rückfragen zum Projekt", rueckfragen(lead)));
    if (lead.status === "in_arbeit")
      list.push(t("nachfassen", "Nachfassen", nachfassen(lead)));
  } else if (lead.kind === "audit") {
    list.push(
      t("audit_eingang", "Eingang bestätigen", auditEingang(lead, now)),
    );
  } else {
    // Ein schon vergangener Termin lässt sich nicht mehr bestätigen
    // (der Kalender-Link darin wäre auch ungültig).
    const slot = parseTerminSlot(lead);
    if (!slot || slot.end.getTime() >= now.getTime()) {
      list.push(
        t("termin_bestaetigen", "Termin bestätigen", terminBestaetigen(lead)),
      );
    }
    list.push(
      t(
        "termin_alternativ",
        "Anderen Termin vorschlagen",
        terminAlternativ(lead, picks, now),
        2,
      ),
    );
  }
  list.push(t("absage", "Freundliche Absage", absage(lead)));
  list.push(t("leer", "Leere Mail", leer(lead)));
  return list;
}
