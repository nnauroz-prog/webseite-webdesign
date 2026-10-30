import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";

import { LeadEditor } from "@/app/admin/anfragen/[id]/lead-editor";
import { StatusPill } from "@/app/admin/status-pill";
import { requireAdmin } from "@/lib/admin/auth";
import { getLead, KIND_LABELS, leadField } from "@/lib/leads-store";

const DATE = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Berlin",
});

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const lead = await getLead(id);
  if (!lead) notFound();

  const name = leadField(lead, "Name") ?? lead.reply_to;
  const phone = leadField(lead, "Telefon");
  const replySubject = `Re: ${lead.subject}`;

  return (
    <div>
      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[13px]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Alle Anfragen
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StatusPill status={lead.status} />
        <span className="text-muted-foreground font-mono text-[10.5px] uppercase tracking-[0.18em]">
          {KIND_LABELS[lead.kind]}
        </span>
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h1>
      <p className="text-muted-foreground mt-1 text-[14px]">
        <time dateTime={lead.created_at}>{DATE.format(new Date(lead.created_at))}</time>
      </p>

      {/* Direkt-Kontakt — auf dem Handy die wichtigsten zwei Knöpfe. */}
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`mailto:${lead.reply_to}?subject=${encodeURIComponent(replySubject)}`}
          className="bg-foreground text-background inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-medium"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Antworten
        </a>
        {phone ? (
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="border-border inline-flex h-10 items-center gap-2 rounded-full border px-5 text-[14px] font-medium"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Anrufen
          </a>
        ) : null}
      </div>

      {lead.delivery_error ? (
        <p className="mt-5 rounded-xl bg-red-50 p-4 text-[13px] leading-relaxed text-red-900">
          <strong>Die Benachrichtigungs-Mail ist nicht rausgegangen.</strong> Die
          Anfrage ist trotzdem hier gespeichert. Grund: {lead.delivery_error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <dl className="border-border bg-card divide-border divide-y rounded-2xl border">
          {lead.fields.map(([label, value]) => (
            <div key={label} className="grid gap-1 p-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-muted-foreground text-[13px]">{label}</dt>
              <dd className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <LeadEditor id={lead.id} status={lead.status} notes={lead.notes} />
      </div>
    </div>
  );
}
