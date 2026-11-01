import { CircleCheck, Inbox } from "lucide-react";
import Link from "next/link";
import { cache } from "react";

import type { LeadRow, LeadStatus } from "@/lib/leads-meta";

import { ContactPrompt } from "@/app/admin/contact-prompt";
import { DbProblem } from "@/app/admin/db-problem";
import { DeletedNotice } from "@/app/admin/deleted-notice";
import { Disclosure } from "@/app/admin/disclosure";
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
import { explainDeliveryError, mailSetup } from "@/lib/lead-mail";
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
        <h1 className="sr-only">Anfragen</h1>
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
  // Neueste zuerst (listLeads sortiert absteigend).
  const failed = all.filter(
    (l) =>
      l.delivery_error &&
      now.getTime() - new Date(l.created_at).getTime() < WEEK_MS,
  );
  const recentFailures = failed.length;
  const lastFailure = failed[0]?.delivery_error
    ? explainDeliveryError(failed[0].delivery_error)
    : undefined;
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
  const total = counts.neu + counts.in_arbeit + counts.erledigt + counts.archiviert;

  const extras = (
    <div className="space-y-3">
      <HomeScreenTip />

      {mailProblem ? null : (
        <Disclosure title="E-Mail-Benachrichtigung aktiv">
          <MailStatus {...mail} />
        </Disclosure>
      )}

      <Disclosure title="Löschprotokoll">
        <div className="text-[14px]">
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
                    {formatShortDay(berlinDateIso(new Date(d.deleted_at)))}{" "}
                    {berlinTime(new Date(d.deleted_at))}
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
      </Disclosure>
    </div>
  );

  return (
    <div>
      <h1 className="sr-only">Anfragen</h1>
      <DateLine now={now} />
      <SchemaNotice schema={schema} />

      {geloescht ? (
        <DeletedNotice>
          <p className="flex items-center gap-2 font-semibold">
            <CircleCheck className="text-ink-petrol h-5 w-5 shrink-0" aria-hidden="true" />
            Anfrage gelöscht.
          </p>
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

      <LeadSearch nowIso={nowIso}>
        {mailProblem ? (
          <MailStatus {...mail} recentFailures={recentFailures} lastFailure={lastFailure} problem />
        ) : null}

        {total === 0 ? (
          <>
            <div className="border-border bg-card mt-6 flex flex-col items-center rounded-[4px] border border-dashed px-6 py-10 text-center">
              <Inbox className="text-muted-foreground h-7 w-7" aria-hidden="true" />
              <h2 className="mt-3 text-[17px] font-semibold tracking-tight">Noch keine Anfragen</h2>
              <p className="text-muted-foreground mt-1 max-w-sm text-[15px] leading-relaxed">
                Sobald jemand auf sitalo.de ein Formular abschickt, steht die Anfrage hier.
              </p>
            </div>
            <div className="mt-8">{extras}</div>
          </>
        ) : (
          // Ab lg zwei Spalten: links „Jetzt“ und die Extras, rechts die
          // ganze Liste (über beide Zeilen). Am iPhone eine Spalte in
          // derselben Reihenfolge.
          <div className="lg:grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10">
            <div className="mt-6 space-y-6 lg:col-start-1 lg:row-start-1">
              {nothingUrgent ? (
                <div className="border-border rounded-[4px] border border-dashed p-4">
                  <h2 className="text-[16px] font-semibold tracking-tight">Nichts Dringendes</h2>
                  <p className="text-muted-foreground mt-1 text-[14px] leading-relaxed">
                    Niemand wartet auf eine Antwort, keine Termine in den nächsten Tagen.
                    {today.naechsteWiedervorlage
                      ? ` Nächste Wiedervorlage: ${formatShortDay(today.naechsteWiedervorlage)}.`
                      : null}
                  </p>
                </div>
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
                  <ul className="border-border bg-card divide-border divide-y rounded-[4px] border">
                    {today.termine.map(({ lead, slot }) => (
                      <li key={lead.id}>
                        <Link
                          href={`/admin/anfragen/${lead.id}`}
                          className="hover:bg-background/60 flex min-h-12 items-center gap-2 px-4 py-2.5 text-[15px] transition-colors"
                        >
                          <span className="shrink-0 font-semibold whitespace-nowrap">
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
            </div>

            <section
              aria-labelledby="alle-title"
              className="mt-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-6"
            >
              <h2 id="alle-title" className="text-[19px] font-semibold tracking-tight">
                Alle Anfragen
              </h2>
              <nav
                aria-label="Nach Status filtern"
                className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0"
              >
                <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
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
                            "inline-flex h-11 items-center gap-2 rounded-[3px] border px-4 text-[14px] font-medium whitespace-nowrap transition-colors",
                            active
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-card hover:border-foreground/40",
                          )}
                        >
                          {t.label}
                          <span className={active ? "text-background/75" : "text-muted-foreground"}>
                            {t.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {list.length === 0 ? (
                <p className="border-border text-muted-foreground mt-3 rounded-[4px] border border-dashed p-6 text-center text-[15px]">
                  {emptyTabText(status, counts.archiviert)}
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
            </section>

            <div className="mt-8 lg:col-start-1 lg:row-start-2 lg:mt-8">{extras}</div>
          </div>
        )}
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

/** Leerer Reiter: sagen, was fehlt, statt „Hier ist nichts“. */
function emptyTabText(status: LeadStatus | null, archived: number): string {
  switch (status) {
    case "neu":
      return "Keine neuen Anfragen.";
    case "in_arbeit":
      return "Gerade ist nichts in Arbeit.";
    case "erledigt":
      return "Noch nichts erledigt.";
    case "archiviert":
      return "Das Archiv ist leer.";
    default:
      return archived > 0
        ? "Keine offenen oder erledigten Anfragen. Ältere stehen im Archiv."
        : "Keine Anfragen.";
  }
}

function nameOf(lead: LeadRow): string {
  return fieldValue(lead, "Name") ?? lead.reply_to;
}

function DateLine({ now }: { now: Date }) {
  return (
    <p className="text-muted-foreground text-[14px]">
      {formatHeaderDay(now)} · Stand {berlinTime(now)}
    </p>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-[17px] font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
