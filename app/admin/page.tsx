import Link from "next/link";
import { cache } from "react";

import type { LeadRow, LeadStatus } from "@/lib/leads-meta";

import { ContactPrompt } from "@/app/admin/contact-prompt";
import { DbProblem } from "@/app/admin/db-problem";
import { DeletedNotice } from "@/app/admin/deleted-notice";
import { HomeScreenTip } from "@/app/admin/home-screen-tip";
import { LeadCard } from "@/app/admin/lead-card";
import { LeadSearch } from "@/app/admin/lead-search";
import { MailStatus } from "@/app/admin/mail-status";
import { SchemaNotice } from "@/app/admin/schema-notice";
import { requireAdmin } from "@/lib/admin/auth";
import {
  berlinDateIso,
  berlinTime,
  formatHeaderDay,
  formatShortDay,
  nextWorkday,
} from "@/lib/admin/berlin-time";
import { cardModel, dayLabel, firstNoteLine } from "@/lib/admin/card-model";
import { checkSchema } from "@/lib/admin/schema";
import { buildToday } from "@/lib/admin/today";
import { mailSetup } from "@/lib/lead-mail";
import {
  DELETE_REASON_LABELS,
  fieldValue,
  KIND_LABELS,
  LEAD_STATUSES,
  STATUS_LABELS,
} from "@/lib/leads-meta";
import { countByStatus, listDeletions, listLeads } from "@/lib/leads-store";
import { cn } from "@/lib/utils";

const LIST_LIMIT = 500;
const WEEK_MS = 7 * 24 * 60 * 60_000;

/**
 * Alle Daten der Startseite in einem Durchgang. Die Jetzt-Ansicht
 * nutzt immer die ungefilterte Liste; die gefilterte nur der aktive
 * Reiter. Beginnt selbst mit requireAdmin (service_role-Abfragen nur
 * für Admins).
 */
const loadOverview = cache(async (status: LeadStatus | null) => {
  await requireAdmin();
  const [all, filtered, counts, schema, deletions] = await Promise.all([
    listLeads(),
    status ? listLeads(status) : Promise.resolve(null),
    countByStatus(),
    checkSchema(),
    listDeletions(20),
  ]);
  return { all, filtered, counts, schema, deletions };
});

function parseTab(raw: string | string[] | undefined): LeadStatus | null {
  return typeof raw === "string" &&
    (LEAD_STATUSES as readonly string[]).includes(raw)
    ? (raw as LeadStatus)
    : null;
}

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    geloescht?: string | string[];
    weitere?: string | string[];
  }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = parseTab(sp.status);
  const now = new Date();
  const nowIso = now.toISOString();

  let data: Awaited<ReturnType<typeof loadOverview>>;
  try {
    data = await loadOverview(status);
  } catch (err) {
    return (
      <>
        <DateLine now={now} />
        <DbProblem error={err} retryHref={status ? `/admin?status=${status}` : "/admin"} />
      </>
    );
  }

  const { all, filtered, counts, schema, deletions } = data;
  const today = buildToday(all, now);
  const v2 = schema.leadsV2 === "ok";
  const nextDay = nextWorkday(berlinDateIso(now));

  const list = filtered ?? all.filter((l) => l.status !== "archiviert");
  const tabs: { key: LeadStatus | null; label: string; count: number }[] = [
    {
      key: null,
      label: "Alle (ohne Archiv)",
      count: counts.neu + counts.in_arbeit + counts.erledigt,
    },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], count: counts[s] })),
  ];

  const mail = mailSetup();
  const recentFailures = all.filter(
    (l) =>
      l.delivery_error &&
      now.getTime() - new Date(l.created_at).getTime() < WEEK_MS,
  ).length;
  const mailProblem = mail.provider === null || recentFailures > 0;

  const geloescht = sp.geloescht === "1" || sp.geloescht === "2" ? sp.geloescht : null;
  const weitere =
    typeof sp.weitere === "string" && /^\d{1,3}$/.test(sp.weitere)
      ? Number(sp.weitere)
      : 0;
  const nothingUrgent =
    today.melden.length === 0 &&
    today.termine.length === 0 &&
    today.wiedervorlagen.length === 0;

  return (
    <div>
      <SchemaNotice schema={schema} />

      {geloescht ? (
        <DeletedNotice>
          <p className="font-semibold">Anfrage gelöscht.</p>
          <p className="mt-1">
            Lösche auch die Benachrichtigungs-Mail in deinem Postfach und, falls
            genutzt, den Eintrag bei Formspree. Prüfe außerdem den
            Kalendereintrag (falls übernommen) und deine Antworten im Ordner
            Gesendet.
          </p>
          {weitere > 0 ? (
            <p className="mt-1 font-medium">
              Noch {weitere} {weitere === 1 ? "weiterer Eintrag" : "weitere Einträge"} dieser
              Person vorhanden. Du findest {weitere === 1 ? "ihn" : "sie"} über die Suche.
            </p>
          ) : null}
          {geloescht === "2" ? (
            <p className="mt-1">
              Protokoll nicht geschrieben, das Datenbank-Update steht noch aus.
            </p>
          ) : null}
        </DeletedNotice>
      ) : null}

      <DateLine now={now} />

      <LeadSearch nowIso={nowIso}>
        {/* Suche direkt unter der Datumszeile; Hinweise darunter. */}
        {mailProblem ? (
          <MailStatus {...mail} recentFailures={recentFailures} problem />
        ) : null}

        {nothingUrgent ? (
          <p className="border-border text-muted-foreground mt-5 rounded-2xl border border-dashed p-4 text-[15px]">
            Nichts Dringendes.
            {today.naechsteWiedervorlage
              ? ` Nächste Wiedervorlage: ${formatShortDay(today.naechsteWiedervorlage)}`
              : null}
          </p>
        ) : null}

        {today.melden.length > 0 ? (
          <Section title={`Jetzt melden (${today.melden.length})`}>
            <ul className="space-y-2">
              {today.melden.map((lead) => (
                <li key={lead.id}>
                  <LeadCard card={cardModel(lead, now)} hideStatus />
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {today.termine.length > 0 ? (
          <Section title="Termine">
            <ul className="border-border bg-card divide-border divide-y rounded-2xl border">
              {today.termine.map(({ lead, slot }) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/anfragen/${lead.id}`}
                    className="flex min-h-12 items-center gap-2 px-4 py-2.5 text-[15px]"
                  >
                    <span className="shrink-0 font-semibold whitespace-nowrap tabular-nums">
                      {dayLabel(slot.dateIso, now)} {slot.time}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="min-w-0 truncate">{nameOf(lead)}</span>
                    {lead.status === "neu" ? (
                      <span className="text-muted-foreground ml-auto inline-flex shrink-0 items-center gap-1.5 text-[13px]">
                        <span className="bg-gold h-2 w-2 rounded-full" aria-hidden="true" />
                        {/* Unter 360px nur der Punkt, damit der Name lesbar bleibt. */}
                        <span className="sr-only min-[360px]:not-sr-only">unbestätigt</span>
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {today.wiedervorlagen.length > 0 ? (
          <Section title={`Wiedervorlage fällig (${today.wiedervorlagen.length})`}>
            <ul className="space-y-2">
              {today.wiedervorlagen.map((lead) => (
                <li key={lead.id}>
                  <LeadCard card={cardModel(lead, now)} context={firstNoteLine(lead.notes)} />
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <h2 className="mt-8 text-[19px] font-semibold tracking-tight">Alle Anfragen</h2>
        <nav
          aria-label="Nach Status filtern"
          className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none]"
        >
          <ul className="flex w-max gap-2">
            {tabs.map((t) => {
              const active = t.key === status;
              return (
                <li key={t.label}>
                  <Link
                    href={t.key ? `/admin?status=${t.key}` : "/admin"}
                    // Reiter stehen weit unten: Position halten statt nach oben.
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[14px] font-medium whitespace-nowrap transition-colors",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card",
                    )}
                  >
                    {t.label}
                    <span
                      className={cn(
                        "tabular-nums",
                        active ? "text-background/70" : "text-muted-foreground",
                      )}
                    >
                      {t.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {list.length === 0 ? (
          <p className="border-border text-muted-foreground mt-4 rounded-2xl border border-dashed p-6 text-center text-[15px]">
            Hier ist gerade nichts.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {list.map((lead) => (
              <li key={lead.id}>
                <LeadCard card={cardModel(lead, now)} />
              </li>
            ))}
          </ul>
        )}
        {all.length >= LIST_LIMIT || (filtered?.length ?? 0) >= LIST_LIMIT ? (
          <p className="text-muted-foreground mt-3 text-[13px]">
            Gezeigt und durchsucht werden die neuesten 500 Anfragen.
          </p>
        ) : null}

        <HomeScreenTip />

        {mailProblem ? null : (
          <details className="border-border bg-card group mt-6 rounded-2xl border">
            <summary className="flex min-h-12 cursor-pointer items-center px-4 text-[15px] font-medium">
              E-Mail-Benachrichtigung aktiv · Test-Mail senden
            </summary>
            <div className="px-4 pb-4">
              <MailStatus {...mail} />
            </div>
          </details>
        )}

        <details className="border-border bg-card mt-3 rounded-2xl border">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 text-[15px] font-medium">
            Löschprotokoll
          </summary>
          <div className="px-4 pb-4 text-[14px]">
            {deletions === null ? (
              <p className="text-muted-foreground">
                Das Löschprotokoll startet nach dem Datenbank-Update.
              </p>
            ) : deletions.length === 0 ? (
              <p className="text-muted-foreground">Noch nichts gelöscht.</p>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Die letzten {deletions.length} Löschungen, ohne Namen oder Inhalte.
                </p>
                <ul className="divide-border mt-2 divide-y">
                  {deletions.map((d, i) => (
                    <li key={`${d.deleted_at}-${i}`} className="py-2">
                      <span className="tabular-nums">
                        {formatShortDay(berlinDateIso(new Date(d.deleted_at)))}{" "}
                        {berlinTime(new Date(d.deleted_at))}
                      </span>
                      {" · "}
                      {d.lead_kind && d.lead_kind in KIND_LABELS
                        ? KIND_LABELS[d.lead_kind as keyof typeof KIND_LABELS]
                        : "Anfrage"}
                      {" · "}
                      {d.reason in DELETE_REASON_LABELS
                        ? DELETE_REASON_LABELS[d.reason as keyof typeof DELETE_REASON_LABELS]
                        : d.reason}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </details>
      </LeadSearch>

      {/* Anruf über den Rundknopf einer Karte: danach „Erreicht?“ */}
      <ContactPrompt
        standalone
        v2={v2}
        nextWorkdayIso={nextDay}
        nextWorkdayLabel={formatShortDay(nextDay)}
      />
    </div>
  );
}

function nameOf(lead: LeadRow): string {
  return fieldValue(lead, "Name") ?? lead.reply_to;
}

function DateLine({ now }: { now: Date }) {
  return (
    <p className="text-muted-foreground mt-1 text-[14px]">
      {formatHeaderDay(now)} · Stand {berlinTime(now)}
    </p>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[17px] font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
