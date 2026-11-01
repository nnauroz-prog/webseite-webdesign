"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  calculate,
  findCheapest,
  findSitalo,
  formatEur,
  formatHours,
  type Inputs,
  type Profile,
  type Result,
} from "@/lib/tco-logic";
import { cn } from "@/lib/utils";

/**
 * Interaktiver 3-Jahres-TCO-Rechner.
 *
 * Drei Inputs (Profile, Updates/Monat, Stunden-Wert), fünf Ergebnis-
 * Balken in normalisierter Skala. User sieht in Echtzeit, wie sich
 * die Gesamtkosten verschieben, wenn er seinen Stunden-Wert
 * anpasst.
 *
 * Bei einem Stundenwert von 0 € gewinnt der günstigste Baukasten.
 * Das ist gewollt und kein Fehler.
 *
 * Persistenz: bewusst keine — der Rechner ist ein Spiel-Tool, das
 * man durchklickt; State über Session hinaus zu halten würde
 * Confusion stiften.
 */

const PROFILES: { slug: Profile; label: string; detail: string }[] = [
  {
    slug: "neu",
    label: "Ganz neu",
    detail: "Die erste Website für den Betrieb",
  },
  {
    slug: "umzug",
    label: "Umzug",
    detail: "Eine bestehende Seite wird ersetzt",
  },
  {
    slug: "eigenbau",
    label: "Code-affin",
    detail: "Sie können selbst mit Code umgehen",
  },
];

export function TcoRechner() {
  const [profile, setProfile] = useState<Profile>("neu");
  const [updates, setUpdates] = useState(2);
  const [hourly, setHourly] = useState(40);

  const inputs: Inputs = useMemo(
    () => ({ profile, updatesPerMonth: updates, hourlyValue: hourly }),
    [profile, updates, hourly],
  );

  const results = useMemo(() => calculate(inputs), [inputs]);
  const cheapest = useMemo(() => findCheapest(results), [results]);
  const sitalo = useMemo(() => findSitalo(results), [results]);
  const maxTotal = useMemo(
    () => Math.max(...results.map((r) => r.totalEur), 1),
    [results],
  );

  const sitaloWins = cheapest.slug === "sitalo";
  const sitaloDelta =
    sitalo && cheapest.slug !== "sitalo"
      ? sitalo.totalEur - cheapest.totalEur
      : 0;

  return (
    <div className="bg-card border-border border-t-foreground border border-t-[3px] px-5 py-7 shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)] sm:px-9 sm:py-9">
      {/* Eingaben */}
      <div className="grid gap-9 md:grid-cols-3 md:gap-8">
        <fieldset className="min-w-0">
          <legend className="label-mono text-muted-foreground">Ihre Ausgangslage</legend>
          <div className="mt-4 space-y-2">
            {PROFILES.map((p) => {
              const active = profile === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setProfile(p.slug)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[2px] border px-3.5 py-3 text-left transition-colors",
                    active ? "border-foreground bg-background" : "border-border hover:border-foreground/50",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[3px] inline-block h-3 w-3 shrink-0 border-[1.5px]",
                      active ? "border-foreground bg-gold" : "border-foreground/40",
                    )}
                  />
                  <span>
                    <span className="text-foreground block text-[14.5px] font-semibold">{p.label}</span>
                    <span className="text-muted-foreground mt-0.5 block text-[13px] leading-snug">{p.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="min-w-0">
          <label htmlFor="tco-updates" className="label-mono text-muted-foreground block">
            Änderungen pro Monat
          </label>
          <p className="serif text-foreground mt-3 text-[2.4rem] leading-none tracking-[-0.03em]">{updates}</p>
          <p className="text-muted-foreground mt-2 text-[13.5px] leading-snug">
            Neue Speisekarte, geänderte Öffnungszeiten, ein neuer Name im Team
          </p>
          <input
            id="tco-updates"
            type="range"
            min={0}
            max={10}
            step={1}
            value={updates}
            onChange={(e) => setUpdates(parseInt(e.target.value, 10))}
            className="accent-gold mt-5 w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between font-mono text-[12px]">
            <span>0</span>
            <span>10</span>
          </div>
        </div>

        <div className="min-w-0">
          <label htmlFor="tco-hourly" className="label-mono text-muted-foreground block">
            Wert Ihrer Stunde
          </label>
          <p className="serif text-foreground mt-3 text-[2.4rem] leading-none tracking-[-0.03em]">{hourly} €</p>
          <p className="text-muted-foreground mt-2 text-[13.5px] leading-snug">
            Bei 0 € zählt nur, was Sie an Anbieter zahlen.
          </p>
          <input
            id="tco-hourly"
            type="range"
            min={0}
            max={150}
            step={5}
            value={hourly}
            onChange={(e) => setHourly(parseInt(e.target.value, 10))}
            className="accent-gold mt-5 w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between font-mono text-[12px]">
            <span>0 €</span>
            <span>150 €</span>
          </div>
        </div>
      </div>

      {/* Ergebnis */}
      <div className="border-foreground mt-10 border-t pt-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="label-mono text-foreground">Gesamtkosten über 36 Monate</h2>
          <p className="text-muted-foreground text-[13.5px]">Euro an den Anbieter plus Ihre Arbeitszeit</p>
        </div>

        <ul className="mt-6 space-y-5" aria-live="polite">
          {results
            .slice()
            .sort((a, b) => a.totalEur - b.totalEur)
            .map((r) => (
              <ResultBar key={r.slug} result={r} maxTotal={maxTotal} isCheapest={r.slug === cheapest.slug} />
            ))}
        </ul>

        {/* Ergebnis als Summenzeile, wie unter einer Rechnung */}
        {sitalo && (
          <div className="border-foreground mt-9 grid gap-2 border-t-2 pt-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <p className="label-mono text-muted-foreground sm:pt-2">Unterm Strich</p>
            <p className="text-balance text-[1.35rem] leading-snug font-semibold tracking-[-0.015em] sm:text-[1.55rem]">
              {sitaloWins ? (
                <>
                  Mit diesen Angaben ist Sitalo über drei Jahre am günstigsten, weil bei den anderen Wegen Ihre eigene
                  Arbeitszeit mitzählt.
                </>
              ) : (
                <>
                  Sitalo kostet über drei Jahre {formatEur(sitaloDelta)} mehr als {cheapest.label}. Dafür sparen Sie{" "}
                  {formatHours(cheapest.hoursCost - sitalo.hoursCost)} eigene Arbeit.
                </>
              )}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground max-w-xl text-[13px] leading-relaxed">
            Die Tarife sind gerundete Monatspreise der Anbieter, die Stunden sind unsere Schätzung. Alle Annahmen stehen
            unter dem Rechner.
          </p>
          <Link href="/anfrage?paket=business" className="btn-signal h-12 shrink-0 text-[15px]">
            Business anfragen
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResultBar({
  result,
  maxTotal,
  isCheapest,
}: {
  result: Result;
  maxTotal: number;
  isCheapest: boolean;
}) {
  const widthPct = Math.max(2, (result.totalEur / maxTotal) * 100);
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-foreground text-[15px] font-semibold tracking-tight">{result.label}</span>
          {isCheapest && <span className="label-mono text-gold text-[10.5px]">am günstigsten</span>}
        </div>
        <span className="serif text-foreground shrink-0 text-[17px]">{formatEur(result.totalEur)}</span>
      </div>
      <div className="bg-border mt-2 h-2.5 w-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
            result.highlight ? "bg-foreground" : isCheapest ? "bg-gold" : "bg-zink",
          )}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <p className="text-muted-foreground mt-1.5 font-mono text-[11.5px]">
        Euro {formatEur(result.euroCost)} · Eigenzeit {formatHours(result.hoursCost)} ({formatEur(result.hoursEur)})
      </p>
    </li>
  );
}
