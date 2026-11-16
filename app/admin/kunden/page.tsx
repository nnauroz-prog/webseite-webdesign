import type { Metadata } from "next";

import { BriefcaseBusiness, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cache } from "react";

import type { ProjektSicht } from "@/lib/admin/projekte";

import { DbProblem } from "@/app/admin/db-problem";
import { Disclosure } from "@/app/admin/disclosure";
import { FortschrittBalken } from "@/app/admin/kunden/fortschritt-balken";
import { SchemaNotice } from "@/app/admin/schema-notice";
import { formatDatum, formatEuro } from "@/lib/admin/angebote";
import { requireAdmin } from "@/lib/admin/auth";
import {
  fortschrittText,
  pflegeUebersicht,
  projektSichten,
  SCHRITT_LABELS,
  sortiereProjekte,
} from "@/lib/admin/projekte";
import { checkSchema } from "@/lib/admin/schema";
import {
  listAngenommeneAngebote,
  listProjekte,
  PROJEKTE_LIMIT,
} from "@/lib/projekte-store";

// Generisch: keine Kundennamen im <title> (Verlauf, Tabs, App-Umschalter).
export const metadata: Metadata = { title: "Kunden" };

/**
 * Angenommene Angebote und ihre Projekte. Beginnt selbst mit
 * requireAdmin (service_role-Abfragen nur für Admins). Ohne
 * Datenbank-Update fehlen nur die Projekt-Zeilen: Die Liste steht
 * trotzdem, Abhaken ist aus.
 */
const loadKunden = cache(async () => {
  await requireAdmin();
  const schema = await checkSchema();
  const [angebote, projekte] = await Promise.all([
    schema.angebote === "ok" ? listAngenommeneAngebote() : null,
    schema.projekte === "ok" ? listProjekte() : null,
  ]);
  return { schema, angebote, projekte };
});

/**
 * `/admin/kunden` — Kunden & Projekte: jedes angenommene Angebot als
 * Projekt mit fünf Schritten bis zum Livegang, darunter die
 * Pflege-Kunden mit ihrem Monatsbeitrag.
 */
export default async function KundenPage() {
  await requireAdmin();
  const now = new Date();

  let data: Awaited<ReturnType<typeof loadKunden>>;
  try {
    data = await loadKunden();
  } catch (err) {
    return (
      <>
        <h1 className="sr-only">Kunden & Projekte</h1>
        <DbProblem error={err} retryHref="/admin/kunden" />
      </>
    );
  }

  const { schema, angebote, projekte } = data;
  const sichten = projektSichten(angebote ?? [], projekte ?? [], now);
  const { inArbeit, fertig } = sortiereProjekte(sichten);
  const pflege = pflegeUebersicht(sichten);
  const projekteAus = schema.projekte !== "ok";

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-[22px] font-semibold tracking-tight">
          Kunden & Projekte
        </h1>
        {sichten.length > 0 ? (
          <p className="text-muted-foreground text-[14px] tabular-nums">
            {projekteAus
              ? `${sichten.length} angenommen`
              : `${inArbeit.length} in Arbeit · ${fertig.length} fertig`}
          </p>
        ) : null}
      </div>
      <SchemaNotice schema={schema} />

      {angebote === null ? (
        <p className="border-border text-muted-foreground mt-4 rounded-[4px] border border-dashed p-4 text-[15px] leading-relaxed">
          Projekte entstehen aus angenommenen Angeboten. Angebote gehen erst
          nach dem Datenbank-Update (siehe Hinweis oben).
        </p>
      ) : sichten.length === 0 ? (
        <div className="border-border bg-card mt-6 flex flex-col items-center rounded-[4px] border border-dashed px-6 py-10 text-center">
          <BriefcaseBusiness
            className="text-muted-foreground h-7 w-7"
            aria-hidden="true"
          />
          <h2 className="mt-3 text-[17px] font-semibold tracking-tight">
            Noch keine Projekte
          </h2>
          <p className="text-muted-foreground mt-1 max-w-sm text-[15px] leading-relaxed">
            Sobald ein Kunde ein Angebot annimmt, steht sein Projekt hier, mit
            den Schritten bis zum Livegang.
          </p>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-x-10">
          <div className="lg:col-start-1">
            {projekteAus ? (
              // Ohne Tabelle projekte gibt es keinen Fortschritt: nur die
              // angenommenen Angebote, statt überall „0 von 5“.
              <section aria-labelledby="angenommen" className="mt-6">
                <h2
                  id="angenommen"
                  className="text-[17px] font-semibold tracking-tight"
                >
                  Angenommene Angebote ({sichten.length})
                </h2>
                <p className="text-muted-foreground mt-0.5 mb-2 text-[14px] leading-relaxed">
                  Die Schritte bis zum Livegang lassen sich nach dem
                  Datenbank-Update abhaken.
                </p>
                <ul className="border-border bg-card divide-border divide-y rounded-[4px] border">
                  {[...sichten]
                    .sort((a, b) =>
                      (b.angebot.accepted_at ?? "").localeCompare(
                        a.angebot.accepted_at ?? "",
                      ),
                    )
                    .map((p) => (
                      <li key={p.angebot.id}>
                        <Link
                          href={`/admin/kunden/${p.angebot.id}`}
                          className="hover:bg-background/60 flex min-h-12 items-center gap-3 px-4 py-2.5 transition-colors"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-medium">
                              {p.kunde}
                            </span>
                            <span className="text-muted-foreground block text-[13px] tabular-nums">
                              {p.angebot.nummer}
                              {p.angenommenAm
                                ? ` · angenommen ${formatDatum(p.angenommenAm)}`
                                : ""}
                            </span>
                          </span>
                          <span className="text-muted-foreground shrink-0 text-[14px] tabular-nums">
                            {formatEuro(p.summen.einmalig.brutto)}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            ) : (
              <section aria-labelledby="in-arbeit" className="mt-6">
                <h2
                  id="in-arbeit"
                  className="mb-2 text-[17px] font-semibold tracking-tight"
                >
                  In Arbeit{inArbeit.length > 0 ? ` (${inArbeit.length})` : ""}
                </h2>
                {inArbeit.length === 0 ? (
                  <p className="border-border text-muted-foreground rounded-[4px] border border-dashed p-4 text-center text-[15px]">
                    Gerade ist kein Projekt offen. Alle angenommenen Angebote
                    sind online.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {inArbeit.map((p) => (
                      <li key={p.angebot.id}>
                        <ProjektKarte p={p} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {!projekteAus && fertig.length > 0 ? (
              <section aria-labelledby="fertig" className="mt-8">
                <h2
                  id="fertig"
                  className="mb-2 text-[17px] font-semibold tracking-tight"
                >
                  Fertig ({fertig.length})
                </h2>
                <ul className="border-border bg-card divide-border divide-y rounded-[4px] border">
                  {fertig.map((p) => (
                    <li key={p.angebot.id}>
                      <Link
                        href={`/admin/kunden/${p.angebot.id}`}
                        className="hover:bg-background/60 flex min-h-12 items-center gap-3 px-4 py-2.5 transition-colors"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium">
                            {p.kunde}
                          </span>
                          <span className="text-muted-foreground block text-[13px]">
                            {p.schritte.livegang
                              ? `Online seit ${formatDatum(p.schritte.livegang)}`
                              : "Online"}
                          </span>
                        </span>
                        <ChevronRight
                          className="text-muted-foreground h-5 w-5 shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <section
            aria-labelledby="pflege"
            className="mt-8 lg:col-start-2 lg:row-start-1 lg:mt-6"
          >
            <h2
              id="pflege"
              className="mb-2 text-[17px] font-semibold tracking-tight"
            >
              Pflege-Kunden
            </h2>
            {pflege.aktiv.length === 0 ? (
              <p className="border-border text-muted-foreground rounded-[4px] border border-dashed p-4 text-center text-[15px]">
                {pflege.beendet.length > 0
                  ? "Gerade läuft bei keinem Kunden eine Pflege."
                  : "Noch kein angenommenes Angebot mit Monatsbeitrag."}
              </p>
            ) : (
              <div className="border-border bg-card rounded-[4px] border">
                <div className="px-4 pt-4 pb-3">
                  <p className="text-muted-foreground text-[14px]">
                    Monatlich zusammen
                  </p>
                  <p className="text-[28px] leading-tight font-semibold tracking-tight tabular-nums">
                    {formatEuro(pflege.summeMonatlich)}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[13px]">
                    {pflege.aktiv.length}{" "}
                    {pflege.aktiv.length === 1 ? "Kunde" : "Kunden"} · brutto,
                    wie in den Angeboten
                  </p>
                </div>
                <ul className="divide-border border-border divide-y border-t">
                  {pflege.aktiv.map((p) => (
                    <li key={p.angebot.id}>
                      <PflegeZeile p={p} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pflege.beendet.length > 0 ? (
              <Disclosure
                className="mt-3"
                title={`Pflege beendet (${pflege.beendet.length})`}
              >
                <ul className="divide-border -mx-4 divide-y">
                  {pflege.beendet.map((p) => (
                    <li key={p.angebot.id}>
                      <PflegeZeile p={p} />
                    </li>
                  ))}
                </ul>
              </Disclosure>
            ) : null}
          </section>
        </div>
      )}

      {(angebote?.length ?? 0) >= PROJEKTE_LIMIT ? (
        <p className="text-muted-foreground mt-4 text-[13px]">
          Gezeigt werden die zuletzt angenommenen {PROJEKTE_LIMIT} Angebote.
        </p>
      ) : null}
    </div>
  );
}

function ProjektKarte({ p }: { p: ProjektSicht }) {
  const naechster = p.fortschritt.naechster;
  return (
    <Link
      href={`/admin/kunden/${p.angebot.id}`}
      className="border-border bg-card hover:border-foreground/40 block rounded-[4px] border p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold">{p.kunde}</p>
          <p className="text-muted-foreground truncate text-[13px]">
            {p.angebot.nummer}
            {p.ansprechpartner ? ` · ${p.ansprechpartner}` : ""}
          </p>
        </div>
        <span className="shrink-0 text-[14px] font-medium tabular-nums">
          {fortschrittText(p.fortschritt)}
          <span className="sr-only"> Schritten erledigt</span>
        </span>
      </div>
      <FortschrittBalken schritte={p.schritte} className="mt-3" />
      <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[14px]">
        <span>
          Als Nächstes:{" "}
          <span className="font-semibold">
            {naechster ? SCHRITT_LABELS[naechster] : "nichts"}
          </span>
        </span>
        <span className="text-muted-foreground tabular-nums">
          {formatEuro(p.summen.einmalig.brutto)}
          {p.pflege.monatlich > 0
            ? ` + ${formatEuro(p.pflege.monatlich)}/Monat`
            : ""}
        </span>
      </div>
    </Link>
  );
}

function PflegeZeile({ p }: { p: ProjektSicht }) {
  const { seit, bis, aktiv } = p.pflege;
  const zeit = aktiv
    ? [
        seit ? `seit ${formatDatum(seit)}` : null,
        bis ? `endet ${formatDatum(bis)}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : bis
      ? `beendet ${formatDatum(bis)}`
      : "";
  return (
    <Link
      href={`/admin/kunden/${p.angebot.id}`}
      className="hover:bg-background/60 flex min-h-12 items-center gap-3 px-4 py-2.5 transition-colors"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium">
          {p.kunde}
        </span>
        {zeit ? (
          <span className="text-muted-foreground block text-[13px]">
            {zeit}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-[15px] tabular-nums">
        {formatEuro(p.pflege.monatlich)}
      </span>
    </Link>
  );
}
