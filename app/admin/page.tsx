import Link from "next/link";

import { MailStatus } from "@/app/admin/mail-status";
import { StatusPill } from "@/app/admin/status-pill";
import { requireAdmin } from "@/lib/admin/auth";
import { mailSetup } from "@/lib/lead-mail";
import {
  countByStatus,
  KIND_LABELS,
  LEAD_STATUSES,
  leadField,
  listLeads,
  STATUS_LABELS,
  type LeadStatus,
} from "@/lib/leads-store";
import { cn } from "@/lib/utils";

const DATE = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Berlin",
});

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status: raw } = await searchParams;
  // Ohne Filter: alles außer Archiv — das Archiv ist eigener Reiter.
  const status = LEAD_STATUSES.includes(raw as LeadStatus)
    ? (raw as LeadStatus)
    : undefined;

  const [counts, all] = await Promise.all([countByStatus(), listLeads(status)]);
  const leads = status ? all : all.filter((l) => l.status !== "archiviert");
  const openCount = counts.neu + counts.in_arbeit + counts.erledigt;

  const tabs: { key?: LeadStatus; label: string; count: number }[] = [
    { label: "Alle offenen", count: openCount },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], count: counts[s] })),
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Anfragen</h1>
      <p className="text-muted-foreground mt-1 text-[14px]">
        {counts.neu === 0
          ? "Keine neuen Anfragen."
          : `${counts.neu} neue ${counts.neu === 1 ? "Anfrage" : "Anfragen"}.`}
      </p>

      <MailStatus {...mailSetup()} />

      <nav aria-label="Nach Status filtern" className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-2">
          {tabs.map((t) => {
            const active = t.key === status;
            return (
              <li key={t.label}>
                <Link
                  href={t.key ? `/admin?status=${t.key}` : "/admin"}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground/80 hover:border-foreground/40",
                  )}
                >
                  {t.label}
                  <span className={cn("tabular-nums", active ? "text-background/70" : "text-muted-foreground")}>
                    {t.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {leads.length === 0 ? (
        <p className="border-border text-muted-foreground mt-8 rounded-2xl border border-dashed p-8 text-center text-[14px]">
          Hier ist gerade nichts.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads.map((lead) => {
            const name = leadField(lead, "Name") ?? lead.reply_to;
            const preview =
              leadField(lead, "Nachricht") ??
              leadField(lead, "Wunsch-Slot") ??
              leadField(lead, "Audit-URL") ??
              lead.subject;
            return (
              <li key={lead.id}>
                <Link
                  href={`/admin/anfragen/${lead.id}`}
                  className={cn(
                    "border-border bg-card hover:border-foreground/30 block rounded-2xl border p-4 transition-colors sm:p-5",
                    lead.status === "neu" && "border-l-gold border-l-4",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={lead.status} />
                    <span className="text-muted-foreground font-mono text-[10.5px] uppercase tracking-[0.18em]">
                      {KIND_LABELS[lead.kind]}
                    </span>
                    {lead.delivery_error ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800">
                        Mail fehlgeschlagen
                      </span>
                    ) : null}
                    <time
                      dateTime={lead.created_at}
                      className="text-muted-foreground ml-auto text-[12.5px] tabular-nums"
                    >
                      {DATE.format(new Date(lead.created_at))}
                    </time>
                  </div>
                  <p className="mt-2 text-[16px] font-medium tracking-tight">{name}</p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-[14px] leading-relaxed">
                    {preview}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
