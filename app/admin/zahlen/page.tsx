import type { Metadata } from "next";

import type { PflegeKachel, Summen } from "@/lib/admin/zahlen";

import { DbProblem } from "@/app/admin/db-problem";
import { Disclosure } from "@/app/admin/disclosure";
import { SchemaNotice } from "@/app/admin/schema-notice";
import { requireAdmin } from "@/lib/admin/auth";
import {
  berlinDateIso,
  berlinTime,
  formatHeaderDay,
  formatShortDay,
} from "@/lib/admin/berlin-time";
import { checkSchema } from "@/lib/admin/schema";
import {
  ANGEBOTE_GRENZE,
  angeboteFuerZahlen,
  LEADS_GRENZE,
  leadsFuerZahlen,
  pflegeFuerZahlen,
  reaktionenFuerZahlen,
} from "@/lib/admin/zahlen-store";
import {
  ANTWORT_TAGE,
  angeboteZahlen,
  anfragenZahlen,
  antwortFensterIds,
  antwortZahlen,
  anzahl,
  ARTEN,
  ergebnisZahlen,
  formatAnteil,
  formatDauer,
  formatEuroGanz,
  leseAb,
  MIN_ANTWORTEN,
  MIN_ENTSCHIEDEN,
  pflegeAusAngeboten,
  pflegeAusProjekten,
  wochenSpanne,
} from "@/lib/admin/zahlen";
import { KIND_LABELS, OUTCOME_LABELS } from "@/lib/leads-meta";
import { PROJEKTE_LIMIT } from "@/lib/projekte-store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Zahlen" };

const RETRY = "/admin/zahlen";
/** Höhe des höchsten Balkens in px. */
const BALKEN_MAX = 96;

type Versuch<T> = { ok: true; value: T } | { ok: false; error: unknown };

async function versuch<T>(p: Promise<T>): Promise<Versuch<T>> {
  try {
    return { ok: true, value: await p };
  } catch (error) {
    return { ok: false, error };
  }
}

/**
 * `/admin/zahlen` — Zahlen und Überblick: Anfragen, Angebote,
 * Antwortzeit, laufende Pflege und Ergebnis. Nur echte Daten aus der
 * Datenbank, Hamburger Zeit, Wochen ab Montag. Jeder Abschnitt kommt
 * mit einer fehlenden Tabelle zurecht; scheitert das Lesen der
 * Anfragen, steht oben eine Erklärung statt der Zahlen.
 */
export default async function ZahlenPage() {
  await requireAdmin();
  const now = new Date();
  const schema = await checkSchema();
  const v2 = schema.leadsV2 === "ok";

  const [leads, angebote, pflegeDaten] = await Promise.all([
    versuch(leadsFuerZahlen(leseAb(now), v2)),
    schema.angebote === "fehlt"
      ? Promise.resolve(null)
      : versuch(angeboteFuerZahlen()),
    // Mit der Tabelle projekte wie auf /admin/kunden: Beginn und Ende
    // der Pflege sind bekannt.
    schema.angebote === "ok" && schema.projekte === "ok"
      ? versuch(pflegeFuerZahlen())
      : Promise.resolve(null),
  ]);

  if (!leads.ok) {
    return (
      <>
        <Kopf now={now} />
        <DbProblem error={leads.error} retryHref={RETRY} />
      </>
    );
  }

  const rows = leads.value.rows;
  const reaktionen =
    schema.events === "fehlt"
      ? null
      : await versuch(reaktionenFuerZahlen(antwortFensterIds(rows, now)));

  const anfragen = anfragenZahlen(rows, now);
  const ergebnis = ergebnisZahlen(rows, now);
  const angeboteDaten =
    angebote && angebote.ok && angebote.value
      ? {
          zahlen: angeboteZahlen(angebote.value.rows, now),
          gekappt: angebote.value.gekappt,
        }
      : null;
  // null: Tabelle fehlt (Datenbank-Update), sonst Fehler beim Lesen.
  const angeboteFehler = angebote && !angebote.ok ? angebote.error : null;
  const pflegeFehler =
    pflegeDaten && !pflegeDaten.ok ? pflegeDaten.error : null;
  // Mit Projekten dieselbe Rechnung wie /admin/kunden, sonst nur aus
  // den angenommenen Angeboten (Kündigungen unbekannt).
  const pflege: PflegeKachel | null =
    pflegeDaten && pflegeDaten.ok && pflegeDaten.value
      ? pflegeAusProjekten(
          pflegeDaten.value.angebote,
          pflegeDaten.value.projekte,
          now,
          pflegeDaten.value.gekappt ? PROJEKTE_LIMIT : null,
        )
      : !pflegeFehler && angeboteDaten
        ? pflegeAusAngeboten(
            angeboteDaten.zahlen.pflege,
            angeboteDaten.gekappt ? ANGEBOTE_GRENZE : null,
          )
        : null;

  return (
    <>
      <Kopf now={now} />
      <SchemaNotice schema={schema} />
      {leads.value.gekappt ? (
        <p className="text-muted-foreground mt-3 text-[13px]">
          Gezählt wurden die neuesten {LEADS_GRENZE} Anfragen seit{" "}
          {formatShortDay(
            berlinDateIso(new Date(rows[rows.length - 1].created_at)),
          )}
          . Ältere fehlen in den Zahlen.
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Karte id="anfragen" titel="Anfragen" className="lg:col-span-2">
          <div className="lg:grid lg:grid-cols-2 lg:gap-10">
            <AnfragenTabelle z={anfragen} />
            <WochenBalken z={anfragen} />
          </div>
        </Karte>

        <Karte id="angebote" titel="Angebote">
          {angeboteFehler ? (
            <DbProblem compact error={angeboteFehler} retryHref={RETRY} />
          ) : !angeboteDaten ? (
            <Leise>Angebote gibt es nach dem Datenbank-Update.</Leise>
          ) : (
            <AngeboteInhalt
              z={angeboteDaten.zahlen}
              gekappt={angeboteDaten.gekappt}
            />
          )}
        </Karte>

        <Karte
          id="antwortzeit"
          titel="Antwortzeit"
          untertitel={`Anfragen der letzten ${ANTWORT_TAGE} Tage`}
        >
          {reaktionen === null ? (
            <Leise>
              Antwortzeiten gibt es nach dem Datenbank-Update (Verlauf).
            </Leise>
          ) : !reaktionen.ok ? (
            <DbProblem compact error={reaktionen.error} retryHref={RETRY} />
          ) : reaktionen.value === null ? (
            <Leise>
              Antwortzeiten gibt es nach dem Datenbank-Update (Verlauf).
            </Leise>
          ) : (
            <AntwortInhalt
              z={antwortZahlen(rows, reaktionen.value.rows, now)}
              gekappt={reaktionen.value.gekappt}
            />
          )}
        </Karte>

        <Karte id="pflege" titel="Laufende Pflege">
          {pflege ? (
            <>
              <Kennzahl
                label="Pro Monat"
                wert={formatEuroGanz(pflege.monatlich)}
              />
              {pflege.hinweise.map((h) => (
                <Hinweis key={h}>{h}</Hinweis>
              ))}
            </>
          ) : pflegeFehler ? (
            <DbProblem compact error={pflegeFehler} retryHref={RETRY} />
          ) : angeboteFehler ? (
            <Leise>Gerade nicht lesbar, siehe Angebote.</Leise>
          ) : (
            <Leise>Gibt es nach dem Datenbank-Update für Angebote.</Leise>
          )}
        </Karte>

        <Karte
          id="ergebnis"
          titel={`Ergebnis ${ergebnis.jahr}`}
          untertitel="Anfragen seit 1. Januar"
        >
          {v2 ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Kennzahl
                  label={OUTCOME_LABELS.gewonnen}
                  wert={String(ergebnis.gewonnen)}
                />
                <Kennzahl
                  label={OUTCOME_LABELS.verloren}
                  wert={String(ergebnis.verloren)}
                />
              </div>
              <Hinweis>
                Gezählt, wo du ein Ergebnis eingetragen hast. Es zählt der
                Eingang der Anfrage.
              </Hinweis>
            </>
          ) : (
            <Leise>Ergebnisse gibt es nach dem Datenbank-Update.</Leise>
          )}
        </Karte>
      </div>
    </>
  );
}

function Kopf({ now }: { now: Date }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h1 className="text-[22px] font-semibold tracking-tight">Zahlen</h1>
      <p className="text-muted-foreground text-[14px]">
        {formatHeaderDay(now)} · Stand {berlinTime(now)}
      </p>
    </div>
  );
}

function Karte({
  id,
  titel,
  untertitel,
  className,
  children,
}: {
  id: string;
  titel: string;
  untertitel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-titel`}
      className={cn(
        "border-border bg-card rounded-[4px] border p-4",
        className,
      )}
    >
      <h2
        id={`${id}-titel`}
        className="text-[17px] font-semibold tracking-tight"
      >
        {titel}
      </h2>
      {untertitel ? (
        <p className="text-muted-foreground text-[13px]">{untertitel}</p>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Kennzahl({
  label,
  wert,
  zusatz,
  ohneWert = false,
}: {
  label: string;
  wert: string;
  zusatz?: React.ReactNode;
  /** wert ist ein Satz („Noch zu wenig Daten“), keine Zahl. */
  ohneWert?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-[13px]">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-semibold tracking-tight",
          ohneWert ? "text-[17px]" : "text-[28px] leading-tight",
        )}
      >
        {wert}
      </p>
      {zusatz ? (
        <div className="mt-0.5 text-[15px] tabular-nums">{zusatz}</div>
      ) : null}
    </div>
  );
}

function Hinweis({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mt-3 text-[13px] leading-relaxed">
      {children}
    </p>
  );
}

function Leise({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-[15px] leading-relaxed">
      {children}
    </p>
  );
}

const Trenner = () => <div className="border-border my-4 border-t" />;

// ---------------------------------------------------------------------
// Anfragen
// ---------------------------------------------------------------------

type AnfragenZ = ReturnType<typeof anfragenZahlen>;

function AnfragenTabelle({ z }: { z: AnfragenZ }) {
  const zeilen = [
    ["Diese Woche", z.dieseWoche],
    ["Letzte Woche", z.letzteWoche],
    [z.monatName, z.dieserMonat],
    [z.vormonatName, z.letzterMonat],
  ] as const;
  const zahl = "w-14 py-2 pl-2 text-right";
  return (
    <table className="w-full self-start text-[15px] tabular-nums">
      <caption className="sr-only">Anfragen nach Zeitraum und Art</caption>
      <thead>
        <tr className="text-muted-foreground text-[13px]">
          <th scope="col" className="py-1.5 text-left font-normal">
            <span className="sr-only">Zeitraum</span>
          </th>
          <th scope="col" className={cn(zahl, "py-1.5 font-normal")}>
            Alle
          </th>
          {ARTEN.map((a) => (
            <th key={a} scope="col" className={cn(zahl, "py-1.5 font-normal")}>
              {KIND_LABELS[a]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-border border-border divide-y border-t">
        {zeilen.map(([label, werte]) => (
          <tr key={label}>
            <th scope="row" className="py-2 text-left font-normal">
              {label}
            </th>
            <td className={cn(zahl, "text-[17px] font-semibold")}>
              {werte.alle}
            </td>
            {ARTEN.map((a) => (
              <td
                key={a}
                className={cn(zahl, werte[a] === 0 && "text-muted-foreground")}
              >
                {werte[a]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function WochenBalken({ z }: { z: AnfragenZ }) {
  const erste = z.wochen[0];
  const letzte = z.wochen[z.wochen.length - 1];
  if (z.summe === 0) {
    // Zwölf leere Säulen sagen nichts; ein Satz reicht.
    return (
      <div className="mt-6 lg:mt-0">
        <p className="text-[15px] font-semibold">
          Letzte {z.wochen.length} Wochen
        </p>
        <p className="text-muted-foreground mt-1 text-[15px]">
          Keine Anfragen in KW {erste.kw} bis {letzte.kw}.
        </p>
      </div>
    );
  }
  return (
    <figure className="mt-6 lg:mt-0">
      <figcaption>
        <span className="block text-[15px] font-semibold">
          Letzte {z.wochen.length} Wochen
        </span>
        <span className="text-muted-foreground block text-[13px]">
          {anzahl(z.summe, "Anfrage", "Anfragen")} in KW {erste.kw} bis{" "}
          {letzte.kw}. Die helle Säule ist die laufende Woche.
        </span>
      </figcaption>

      {/* Bild der Zahlen; dieselben Werte stehen in der Tabelle darunter. */}
      <div aria-hidden="true" className="mt-3">
        <div className="border-border flex items-end gap-1 border-b">
          {z.wochen.map((w) => {
            const h = Math.round((w.zahlen.alle / z.max) * BALKEN_MAX);
            return (
              <div
                key={w.montag}
                title={`KW ${w.kw} (${wochenSpanne(w.montag)}): ${w.zahlen.alle}`}
                className="flex min-w-0 flex-1 flex-col items-center justify-end"
                style={{ height: BALKEN_MAX + 20 }}
              >
                <span
                  className={cn(
                    "mb-1 text-[13px] leading-none tabular-nums",
                    w.zahlen.alle === 0 && "text-muted-foreground",
                  )}
                >
                  {w.zahlen.alle}
                </span>
                {h > 0 ? (
                  <div
                    className={cn(
                      "w-full max-w-6 rounded-t-[4px]",
                      w.laufend ? "bg-foreground/25" : "bg-foreground/75",
                    )}
                    style={{ height: Math.max(h, 3) }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex gap-1">
          {z.wochen.map((w) => (
            <span
              key={w.montag}
              className="text-muted-foreground min-w-0 flex-1 text-center text-[13px] tabular-nums"
            >
              {w.kw}
            </span>
          ))}
        </div>
      </div>

      <Disclosure
        title="Je Woche als Tabelle"
        className="mt-4"
        summaryClassName="text-[15px]"
      >
        <table className="w-full text-[15px] tabular-nums">
          <caption className="sr-only">
            Anfragen je Kalenderwoche, neueste zuerst
          </caption>
          <thead>
            <tr className="text-muted-foreground text-[13px]">
              <th scope="col" className="py-1.5 text-left font-normal">
                Woche
              </th>
              <th scope="col" className="py-1.5 pl-2 text-right font-normal">
                Alle
              </th>
              {ARTEN.map((a) => (
                <th
                  key={a}
                  scope="col"
                  className="py-1.5 pl-2 text-right font-normal"
                >
                  {KIND_LABELS[a]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border border-border divide-y border-t">
            {[...z.wochen].reverse().map((w) => (
              <tr key={w.montag}>
                <th scope="row" className="py-1.5 text-left font-normal">
                  KW {w.kw}
                  {w.laufend ? (
                    <span className="text-muted-foreground"> · läuft</span>
                  ) : null}
                  <span className="text-muted-foreground block text-[13px] whitespace-nowrap">
                    {wochenSpanne(w.montag)}
                  </span>
                </th>
                <td className="py-1.5 pl-2 text-right font-semibold">
                  {w.zahlen.alle}
                </td>
                {ARTEN.map((a) => (
                  <td
                    key={a}
                    className={cn(
                      "py-1.5 pl-2 text-right",
                      w.zahlen[a] === 0 && "text-muted-foreground",
                    )}
                  >
                    {w.zahlen[a]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Disclosure>
    </figure>
  );
}

// ---------------------------------------------------------------------
// Angebote
// ---------------------------------------------------------------------

function Betraege({ s }: { s: Summen }) {
  if (s.anzahl === 0) return null;
  return (
    <>
      {s.einmalig > 0 ? <p>{formatEuroGanz(s.einmalig)} einmalig</p> : null}
      {s.monatlich > 0 ? <p>{formatEuroGanz(s.monatlich)} monatlich</p> : null}
    </>
  );
}

function AngeboteInhalt({
  z,
  gekappt,
}: {
  z: ReturnType<typeof angeboteZahlen>;
  gekappt: boolean;
}) {
  return (
    <>
      <Kennzahl
        label="Offen (gesendet und noch gültig)"
        wert={anzahl(z.offen.anzahl, "Angebot", "Angebote")}
        zusatz={<Betraege s={z.offen} />}
      />
      <Trenner />
      <div className="grid gap-4 sm:grid-cols-2">
        <Kennzahl
          label={`Angenommen im ${z.monatName}`}
          wert={String(z.angenommenMonat.anzahl)}
          zusatz={<Betraege s={z.angenommenMonat} />}
        />
        <Kennzahl
          label={`Angenommen ${z.jahr}`}
          wert={String(z.angenommenJahr.anzahl)}
          zusatz={<Betraege s={z.angenommenJahr} />}
        />
      </div>
      <Trenner />
      <Kennzahl
        label="Annahmequote"
        wert={z.quote === null ? "Noch zu wenig Daten" : formatAnteil(z.quote)}
        ohneWert={z.quote === null}
        zusatz={
          z.entschieden > 0 ? (
            <p>
              {z.angenommen} von {z.entschieden} entschiedenen
            </p>
          ) : undefined
        }
      />
      <Hinweis>
        Angenommen geteilt durch alle entschiedenen Angebote (angenommen,
        abgelehnt, zurückgezogen oder abgelaufen)
        {z.quote === null ? `, ab ${MIN_ENTSCHIEDEN} entschiedenen` : ""}.
      </Hinweis>
      <Hinweis>
        Beträge inkl. USt, wie im Angebot.
        {gekappt
          ? ` Gezählt wurden die neuesten ${ANGEBOTE_GRENZE} Angebote.`
          : ""}
      </Hinweis>
    </>
  );
}

// ---------------------------------------------------------------------
// Antwortzeit
// ---------------------------------------------------------------------

function AntwortInhalt({
  z,
  gekappt,
}: {
  z: ReturnType<typeof antwortZahlen>;
  gekappt: boolean;
}) {
  if (z.anfragen === 0) {
    return <Leise>Keine Anfragen in den letzten {ANTWORT_TAGE} Tagen.</Leise>;
  }
  return (
    <>
      {z.medianMs === null || z.anteilImZiel === null ? (
        <Kennzahl
          label="Bis zur ersten Reaktion"
          wert="Noch zu wenig Daten"
          ohneWert
          zusatz={
            <p>
              Ab {MIN_ANTWORTEN} beantworteten Anfragen, bisher {z.beantwortet}.
            </p>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Kennzahl
            label="Bis zur ersten Reaktion (Median)"
            wert={formatDauer(z.medianMs)}
          />
          <Kennzahl
            label="Im Antwortziel"
            wert={formatAnteil(z.anteilImZiel)}
            zusatz={
              <p>
                {z.imZiel} von {z.beantwortet}
              </p>
            }
          />
        </div>
      )}
      <Hinweis>
        Erste Reaktion: Status weg von „Neu“, Anruf erreicht, Mail gesendet oder
        Angebot verschickt. Gerechnet in echter Zeit, auch über Nacht und
        Wochenende.
      </Hinweis>
      <Hinweis>
        Antwortziel wie auf der Website: Anfrage werktags meist in 4 Std., sonst
        bis 12 Uhr am nächsten Werktag; Audit in 2 Werktagen; Termin am selben
        Werktag.
      </Hinweis>
      {z.ohneReaktion > 0 ? (
        <Hinweis>Noch ohne erfasste Reaktion: {z.ohneReaktion}.</Hinweis>
      ) : null}
      {gekappt ? (
        <Hinweis>Nicht alle Verlaufseinträge gelesen, Werte gekürzt.</Hinweis>
      ) : null}
    </>
  );
}
