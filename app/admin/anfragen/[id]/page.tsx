import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { CardLead } from "@/lib/admin/card-model";
import type { LeadRow } from "@/lib/leads-meta";

import { DeleteLead } from "@/app/admin/anfragen/[id]/delete-lead";
import { FollowUpCard } from "@/app/admin/anfragen/[id]/follow-up-card";
import { NotesPanel } from "@/app/admin/anfragen/[id]/notes-panel";
import { BackLink, ResultLine } from "@/app/admin/anfragen/[id]/small-parts";
import { TerminBox } from "@/app/admin/anfragen/[id]/termin-box";
import { ThumbBar } from "@/app/admin/anfragen/[id]/thumb-bar";
import { Timeline } from "@/app/admin/anfragen/[id]/timeline";
import { PhoneLink } from "@/app/admin/call-button";
import { DbProblem } from "@/app/admin/db-problem";
import { DueChip } from "@/app/admin/due-chip";
import { SchemaNotice } from "@/app/admin/schema-notice";
import { StatusPill } from "@/app/admin/status-pill";
import { requireAdmin } from "@/lib/admin/auth";
import {
  berlinDateIso,
  berlinTime,
  formatLongDay,
  formatShortDay,
  nextWorkday,
  relativeTime,
} from "@/lib/admin/berlin-time";
import { relativeDay, shownFields } from "@/lib/admin/card-model";
import { followUpChips, followUpView } from "@/lib/admin/follow-up";
import { safeEmail, safeHttpUrl, telHref } from "@/lib/admin/links";
import { dueState } from "@/lib/admin/reply-due";
import { checkSchema } from "@/lib/admin/schema";
import { relatedLeads } from "@/lib/admin/search";
import { freeSlotChoices, parseTerminSlot } from "@/lib/admin/termin-slot";
import { hasOutcomeEvent, outcomeText } from "@/lib/admin/timeline";
import { parseId } from "@/lib/admin/validate";
import { explainDeliveryError } from "@/lib/lead-mail";
import { fieldValue, KIND_LABELS, STATUS_LABELS } from "@/lib/leads-meta";
import { getLead, listEvents, listLeads } from "@/lib/leads-store";

// Bewusst generisch: Name oder Firma im <title> landeten im Safari-
// Verlauf, in iCloud-Tabs und im App-Umschalter.
export const metadata: Metadata = { title: "Anfrage" };

async function load(id: string) {
  const [lead, schema, events, all] = await Promise.all([
    getLead(id),
    checkSchema(),
    listEvents(id),
    listLeads(),
  ]);
  return { lead, schema, events, all };
}

export default async function AdminLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = parseId((await params).id);
  if (!id) notFound();
  const now = new Date();
  const nowIso = now.toISOString();

  let data: Awaited<ReturnType<typeof load>>;
  try {
    data = await load(id);
  } catch (err) {
    // Direktlink aus der Mail bei pausiertem Projekt: erklären statt
    // einer leeren Fehlerseite.
    return (
      <div>
        <BackLink />
        <h1 className="sr-only">Anfrage</h1>
        <DbProblem error={err} retryHref={`/admin/anfragen/${id}`} />
      </div>
    );
  }
  const { lead, schema, events, all } = data;
  if (!lead) notFound();

  const v2 = schema.leadsV2 === "ok";
  const today = berlinDateIso(now);
  const name = fieldValue(lead, "Name") ?? (lead.reply_to || "Ohne Namen");
  const firma = fieldValue(lead, "Firma");
  const created = new Date(lead.created_at);
  const due = lead.status === "neu" ? dueState(lead.kind, created, now) : null;
  const tel = telHref(fieldValue(lead, "Telefon"));
  const replyTo = safeEmail(lead.reply_to);
  // Weder Nummer noch (irgendeine) Adresse: Eine Antwort ist nicht möglich.
  const unreachable = !tel && !lead.reply_to;
  const open = lead.status === "neu" || lead.status === "in_arbeit";
  const slot = lead.kind === "termin" ? parseTerminSlot(lead) : null;
  const related = relatedLeads(lead, all);
  const nextDay = nextWorkday(today);

  // Ohne interne Notizen an den Client (Vorlagen brauchen sie nicht).
  const clientLead: CardLead = { ...lead };
  delete clientLead.notes;

  const relatedLabel = (r: LeadRow) =>
    `${formatShortDay(berlinDateIso(new Date(r.created_at)))} · ${KIND_LABELS[r.kind]} · ${STATUS_LABELS[r.status]}`;

  // Ergebnis-Zeile bei erledigt (und archiviert mit Ergebnis).
  let result: { text: string; action: string } | null = null;
  if (lead.status === "erledigt" || (lead.status === "archiviert" && lead.outcome)) {
    if (lead.outcome) {
      result = { text: `Ergebnis: ${outcomeText(lead.outcome, lead.lost_reason)}`, action: "Ändern" };
    } else if (hasOutcomeEvent(events)) {
      result = { text: "Ergebnis: ohne Angabe", action: "Ändern" };
    } else if (lead.kind !== "audit") {
      result = { text: "Ergebnis fehlt", action: "nachtragen" };
    }
  }

  const fields = shownFields(lead, { slotShown: slot !== null });
  const fieldMail = fieldValue(lead, "E-Mail");

  return (
    // Ab lg zwei Spalten: links Kopf, Aktionen und Angaben, rechts
    // Wiedervorlage, Notizen und Verlauf. Am iPhone eine Spalte.
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-x-10">
      <div className="min-w-0">
        <BackLink />

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px]">
          <StatusPill status={lead.status} />
          <span className="text-muted-foreground">{KIND_LABELS[lead.kind]}</span>
          <span className="text-muted-foreground" aria-hidden="true">
            ·
          </span>
          <time dateTime={lead.created_at} className="text-muted-foreground">
            {relativeTime(created, now)}
          </time>
          {due && !unreachable ? <DueChip due={due} /> : null}
        </div>
        <h1 className="mt-2 text-[24px] leading-tight font-semibold tracking-tight break-words lg:text-[28px]">
          {name}
        </h1>
        {firma ? (
          <p className="text-muted-foreground mt-0.5 text-[15px] break-words">{firma}</p>
        ) : null}
        <p className="text-muted-foreground mt-1 text-[13px]">Stand {berlinTime(now)}</p>

        <SchemaNotice schema={schema} />

        {/* Am iPhone fest am unteren Rand, ab lg als Knopfreihe hier. */}
        <ThumbBar
          lead={clientLead}
          name={name}
          status={lead.status}
          tel={tel}
          canReply={replyTo !== null}
          v2={v2}
          nowIso={nowIso}
          slotDays={freeSlotChoices(now, 5).map((d) => ({
            dateIso: d.dateIso,
            label: formatLongDay(d.dateIso),
            times: d.times,
          }))}
          nextWorkdayIso={nextDay}
          nextWorkdayLabel={formatShortDay(nextDay)}
        />

        {lead.kind === "termin" ? (
          slot ? (
            <TerminBox
              leadId={lead.id}
              when={`${formatLongDay(slot.dateIso)} · ${slot.time}–${berlinTime(slot.end)}`}
              relative={
                slot.end.getTime() < now.getTime()
                  ? `vorbei (${relativeDay(slot.dateIso, now)})`
                  : relativeDay(slot.dateIso, now)
              }
              confirmed={lead.status !== "neu"}
              icsHref={`/admin/anfragen/${lead.id}/kalender.ics`}
              askDone={open && slot.end.getTime() < now.getTime()}
            />
          ) : (
            <p className="border-border bg-card mt-4 rounded-[4px] border p-4 text-[15px]">
              Termin: siehe Wunsch-Slot unten
            </p>
          )
        ) : null}

        {lead.delivery_error ? (
          <p className="border-ink-olive/30 bg-ink-olive/8 mt-4 rounded-[4px] border p-4 text-[14px] leading-relaxed">
            <strong className="text-ink-olive">Die Benachrichtigungs-Mail ist nicht rausgegangen.</strong>{" "}
            Die Anfrage ist trotzdem hier gespeichert. Grund:{" "}
            {explainDeliveryError(lead.delivery_error)}
          </p>
        ) : null}

        {lead.reply_to && !replyTo ? (
          <div className="border-gold bg-card mt-4 rounded-[4px] border-2 p-4 text-[15px] leading-relaxed">
            <p className="font-semibold">E-Mail-Adresse sieht ungewöhnlich aus</p>
            <p className="mt-1">
              Antworten per Vorlage ist deshalb aus. Bitte die Adresse von Hand prüfen, bevor
              du schreibst.
            </p>
            {lead.reply_to !== fieldMail ? (
              <p className="mt-2 font-mono text-[14px] break-all">{lead.reply_to}</p>
            ) : null}
          </div>
        ) : null}

        {lead.fields.length === 0 || unreachable ? (
          <p className="border-border text-muted-foreground mt-4 rounded-[4px] border border-dashed p-4 text-[15px] leading-relaxed">
            {lead.fields.length === 0 ? "Keine Angaben übermittelt. " : null}
            {unreachable ? "Keine Kontaktdaten vorhanden, eine Antwort ist nicht möglich." : null}
          </p>
        ) : null}

        {fields.length > 0 ? (
          <dl className="border-border bg-card divide-border mt-4 divide-y rounded-[4px] border">
            {fields.map(([label, value], i) => {
              const url = label === "Audit-URL" ? safeHttpUrl(value) : null;
              const phone = label === "Telefon" ? telHref(value) : null;
              return (
                <div key={`${label}-${i}`} className="px-4 py-3">
                  <dt className="text-muted-foreground text-[13px]">{label}</dt>
                  <dd className="mt-0.5 text-[16px] leading-relaxed break-words whitespace-pre-wrap">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="decoration-foreground/30 hover:decoration-foreground py-3 break-all underline underline-offset-4"
                      >
                        {value}
                      </a>
                    ) : phone ? (
                      <PhoneLink href={phone} leadId={lead.id} name={name}>
                        {value}
                      </PhoneLink>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        ) : null}

        {related.length > 0 ? (
          <section className="border-border bg-card mt-4 rounded-[4px] border p-4">
            <h2 className="text-[16px] font-semibold">Schon einmal angefragt ({related.length})</h2>
            <p className="text-muted-foreground text-[13px]">Gleiche E-Mail oder Telefonnummer</p>
            <ul className="mt-1">
              {related.slice(0, 20).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/admin/anfragen/${r.id}`}
                    className="decoration-foreground/30 hover:decoration-foreground flex min-h-11 items-center text-[15px] underline underline-offset-4"
                  >
                    {relatedLabel(r)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {result ? <ResultLine text={result.text} actionLabel={result.action} enabled={v2} /> : null}
      </div>

      <div className="min-w-0 lg:[&>*:first-child]:mt-0">
        {open ? (
          <FollowUpCard
            leadId={lead.id}
            view={lead.follow_up_on ? followUpView(lead.follow_up_on, now) : null}
            chips={followUpChips(now)}
            todayIso={today}
            enabled={v2}
          />
        ) : null}

        <NotesPanel leadId={lead.id} notes={lead.notes ?? ""} />

        <Timeline events={events} lead={lead} />

        {lead.status === "archiviert" ? (
          <DeleteLead
            leadId={lead.id}
            related={related.map((r) => ({ id: r.id, label: relatedLabel(r) }))}
          />
        ) : null}
      </div>
    </div>
  );
}
