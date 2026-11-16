import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DbProblem } from "@/app/admin/db-problem";
import { NotizKarte } from "@/app/admin/kunden/[id]/notiz-karte";
import { PflegeKarte } from "@/app/admin/kunden/[id]/pflege-karte";
import { SchritteKarte } from "@/app/admin/kunden/[id]/schritte-karte";
import { KundenBackLink } from "@/app/admin/kunden/back-link";
import { SchemaNotice } from "@/app/admin/schema-notice";
import { formatDatum, formatEuro } from "@/lib/admin/angebote";
import { requireAdmin } from "@/lib/admin/auth";
import { berlinDateIso } from "@/lib/admin/berlin-time";
import { projektSicht } from "@/lib/admin/projekte";
import { checkSchema } from "@/lib/admin/schema";
import { parseId } from "@/lib/admin/validate";
import { getProjektAngebot, getProjektByAngebot } from "@/lib/projekte-store";

// Bewusst generisch: Kundennamen im <title> landeten im Safari-Verlauf,
// in iCloud-Tabs und im App-Umschalter.
export const metadata: Metadata = { title: "Projekt" };

async function load(id: string) {
  const [schema, angebot] = await Promise.all([
    checkSchema(),
    getProjektAngebot(id),
  ]);
  const projekt =
    angebot && schema.projekte === "ok" ? await getProjektByAngebot(id) : null;
  return { schema, angebot, projekt };
}

/**
 * `/admin/kunden/[id]` — ein Projekt (id ist die des angenommenen
 * Angebots): Schritte bis zum Livegang, Angebot, Pflege und Notiz.
 */
export default async function ProjektPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = parseId((await params).id);
  if (!id) notFound();
  const now = new Date();

  let data: Awaited<ReturnType<typeof load>>;
  try {
    data = await load(id);
  } catch (err) {
    return (
      <div>
        <KundenBackLink />
        <h1 className="sr-only">Projekt</h1>
        <DbProblem error={err} retryHref={`/admin/kunden/${id}`} />
      </div>
    );
  }
  const { schema, angebot, projekt } = data;
  if (!angebot || angebot.status !== "angenommen") notFound();

  const p = projektSicht(angebot, projekt, now);
  const heute = berlinDateIso(now);
  const enabled = schema.projekte === "ok";

  return (
    <div>
      <KundenBackLink />
      <p className="text-muted-foreground mt-1 text-[13px] tabular-nums">
        Projekt · {angebot.nummer}
      </p>
      <h1 className="mt-0.5 text-[24px] leading-tight tracking-tight break-words lg:text-[28px]">
        {p.kunde}
      </h1>
      {p.ansprechpartner ? (
        <p className="text-muted-foreground mt-0.5 text-[15px]">
          {p.ansprechpartner}
        </p>
      ) : null}
      <SchemaNotice schema={schema} />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-x-8">
        <div>
          <SchritteKarte
            angebotId={angebot.id}
            schritte={p.schritte}
            heute={heute}
            enabled={enabled}
          />
          <NotizKarte
            angebotId={angebot.id}
            notiz={projekt?.notiz ?? ""}
            enabled={enabled}
          />
        </div>

        <div>
          <section
            aria-labelledby="angebot-title"
            className="border-border bg-card mt-4 rounded-[4px] border"
          >
            <h2
              id="angebot-title"
              className="px-4 pt-4 text-[16px] font-semibold"
            >
              Angebot
            </h2>
            <dl className="divide-border mt-1 divide-y">
              <Zeile dt="Nummer" dd={angebot.nummer} />
              <Zeile dt="Titel" dd={angebot.titel || "Ohne Titel"} />
              {p.angenommenAm ? (
                <Zeile dt="Angenommen am" dd={formatDatum(p.angenommenAm)} />
              ) : null}
              <Zeile
                dt="Einmalig"
                dd={formatEuro(p.summen.einmalig.brutto)}
                zahl
              />
              {p.summen.monatlich.brutto > 0 ? (
                <Zeile
                  dt="Monatlich"
                  dd={formatEuro(p.summen.monatlich.brutto)}
                  zahl
                />
              ) : null}
            </dl>
            <p className="text-muted-foreground px-4 pb-1 text-[13px]">
              Beträge brutto (inkl. USt), wie im Angebot.
            </p>
            <div className="border-border border-t px-4 py-1">
              <Link
                href={`/admin/anfragen/${angebot.lead_id}`}
                className="inline-flex h-11 items-center gap-1.5 text-[15px] font-medium underline underline-offset-4"
              >
                Zur Anfrage
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>

          {p.pflege.monatlich > 0 ? (
            <PflegeKarte
              angebotId={angebot.id}
              monatlich={p.pflege.monatlich}
              seit={p.pflege.seit}
              seitQuelle={
                projekt?.pflege_seit
                  ? "gespeichert"
                  : projekt?.livegang_am
                    ? "livegang"
                    : "annahme"
              }
              bis={p.pflege.bis}
              aktiv={p.pflege.aktiv}
              heute={heute}
              enabled={enabled}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Zeile({
  dt,
  dd,
  zahl = false,
}: {
  dt: string;
  dd: string;
  zahl?: boolean;
}) {
  return (
    <div className="px-4 py-2.5">
      <dt className="text-muted-foreground text-[13px]">{dt}</dt>
      <dd className={zahl ? "text-[16px] tabular-nums" : "text-[16px]"}>
        {dd}
      </dd>
    </div>
  );
}
