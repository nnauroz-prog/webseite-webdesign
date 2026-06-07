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
 * Ehrlich: bei Stunden-Wert 0 €/h gewinnt der Baukasten — das ist
 * Teil des Bildes, nicht ein Bug.
 *
 * Persistenz: bewusst keine — der Rechner ist ein Spiel-Tool, das
 * man durchklickt; State über Session hinaus zu halten würde
 * Confusion stiften.
 */

const PROFILES: { slug: Profile; label: string; detail: string }[] = [
  {
    slug: "neu",
    label: "Ganz neu",
    detail: "Erste Website überhaupt",
  },
  {
    slug: "umzug",
    label: "Umzug",
    detail: "Bestehende Seite wird ersetzt",
  },
  {
    slug: "eigenbau",
    label: "Code-affin",
    detail: "Sie selbst können mit Code umgehen",
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
    <div className="border-border/60 bg-card/70 ring-foreground/5 rounded-3xl border p-6 ring-1 sm:p-10">
      {/* Inputs */}
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <Label>Ihr Profil</Label>
          <div className="mt-3 space-y-2">
            {PROFILES.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setProfile(p.slug)}
                aria-pressed={profile === p.slug}
                className={cn(
                  "w-full rounded-2xl border p-3 text-left transition-all",
                  profile === p.slug
                    ? "border-foreground bg-foreground/[0.04]"
                    : "border-border/60 hover:border-foreground/40",
                )}
              >
                <p className="text-foreground text-[14px] font-medium">
                  {p.label}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[12.5px]">
                  {p.detail}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Updates pro Monat</Label>
          <p className="text-foreground mt-3 text-3xl font-semibold tracking-[-0.02em] tabular-nums">
            {updates}
          </p>
          <p className="text-muted-foreground text-[12.5px]">
            Speisekarte, Angebote, Team-Änderungen …
          </p>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={updates}
            onChange={(e) => setUpdates(parseInt(e.target.value, 10))}
            className="accent-foreground mt-4 w-full"
            aria-label="Updates pro Monat"
          />
          <div className="text-muted-foreground/60 mt-1 flex justify-between text-[10px] font-mono uppercase tracking-[0.18em]">
            <span>0</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <Label>Ihre Stunde wert in €</Label>
          <p className="text-foreground mt-3 text-3xl font-semibold tracking-[-0.02em] tabular-nums">
            {hourly} €
          </p>
          <p className="text-muted-foreground text-[12.5px]">
            Was kostet Sie eine Stunde Zeit?
          </p>
          <input
            type="range"
            min={0}
            max={150}
            step={5}
            value={hourly}
            onChange={(e) => setHourly(parseInt(e.target.value, 10))}
            className="accent-foreground mt-4 w-full"
            aria-label="Stunden-Wert in Euro"
          />
          <div className="text-muted-foreground/60 mt-1 flex justify-between text-[10px] font-mono uppercase tracking-[0.18em]">
            <span>0 €</span>
            <span>150 €</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="border-border/40 mt-10 border-t pt-8">
        <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
          Gesamtkosten über 36 Monate
        </p>
        <p className="text-foreground mt-2 text-[15px]">
          Euro-Kosten plus Ihre Eigenzeit, umgerechnet zu Ihrem
          Stunden-Wert.
        </p>

        <ul className="mt-6 space-y-3">
          {results
            .slice()
            .sort((a, b) => a.totalEur - b.totalEur)
            .map((r) => (
              <ResultBar
                key={r.slug}
                result={r}
                maxTotal={maxTotal}
                isCheapest={r.slug === cheapest.slug}
              />
            ))}
        </ul>

        {sitalo && (
          <div
            className={cn(
              "mt-8 rounded-2xl border p-5",
              sitaloWins
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/15 bg-foreground/[0.04]",
            )}
          >
            <p
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.22em]",
                sitaloWins ? "text-background/65" : "text-muted-foreground",
              )}
            >
              Was das für Sie heißt
            </p>
            {sitaloWins ? (
              <p className="serif mt-3 text-balance text-2xl leading-snug">
                Mit Ihren Inputs ist Sitalo{" "}
                <span className="serif-italic">die günstigste Option</span> —
                trotz höherem Preisschild. Weil Ihre Eigenzeit es macht.
              </p>
            ) : (
              <p className="serif mt-3 text-balance text-2xl leading-snug">
                Sitalo kostet Sie über 3 Jahre{" "}
                <span className="serif-italic">{formatEur(sitaloDelta)} mehr</span>{" "}
                als die billigste Option — dafür sparen Sie sich{" "}
                <span className="serif-italic">
                  {formatHours(cheapest.hoursCost - sitalo.hoursCost)}
                </span>{" "}
                Eigenarbeit.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground/80 text-[12.5px] leading-relaxed">
            Vergleich basiert auf realen Tarifen Stand{" "}
            {new Date().toLocaleDateString("de-DE", {
              month: "long",
              year: "numeric",
              timeZone: "Europe/Berlin",
            })}
            . Eigenzeit-Schätzungen aus Erfahrung mit Hamburger Lokal-
            Kunden, die von einer dieser Optionen zu uns gewechselt sind.
          </p>
          <Link
            href="/anfrage?paket=business"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-tight"
          >
            Mit Sitalo starten
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
      {children}
    </p>
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
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-foreground text-[14.5px] font-medium tracking-tight",
              isCheapest && "font-semibold",
            )}
          >
            {result.label}
          </span>
          {isCheapest && (
            <span className="bg-gold text-foreground inline-flex h-5 items-center rounded-full px-2 font-mono text-[9px] uppercase tracking-[0.16em]">
              Billiger
            </span>
          )}
          {result.highlight && !isCheapest && (
            <span className="border-foreground/30 text-muted-foreground inline-flex h-5 items-center rounded-full border px-2 font-mono text-[9px] uppercase tracking-[0.16em]">
              Sitalo
            </span>
          )}
        </div>
        <span className="text-foreground font-mono text-[14px] font-medium tabular-nums">
          {formatEur(result.totalEur)}
        </span>
      </div>
      <div className="bg-border/40 mt-2 h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full transition-[width] duration-500 ease-out",
            result.highlight
              ? "bg-foreground"
              : isCheapest
                ? "bg-gold"
                : "bg-muted-foreground/40",
          )}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <p className="text-muted-foreground mt-1.5 text-[12px]">
        davon Euro: {formatEur(result.euroCost)} · Eigenzeit:{" "}
        {formatHours(result.hoursCost)} ({formatEur(result.hoursEur)})
      </p>
    </li>
  );
}
