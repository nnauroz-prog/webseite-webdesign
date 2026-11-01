"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";

import {
  type Answers,
  BRANCHEN_OPTIONS,
  EMPTY_ANSWERS,
  GROESSE_OPTIONS,
  MATERIAL_OPTIONS,
  SITE_OPTIONS,
  ZEIT_OPTIONS,
  empfehle,
  type MaterialSlug,
} from "@/lib/empfehlung-logic";
import { getPaketBySlug } from "@/lib/pakete-data";
import { cn } from "@/lib/utils";

/**
 * Empfehlungs-Wizard — fünf Fragen, eine Empfehlung.
 *
 * Ein Beratungs-Tool, kein Submission-Flow: Ergebnis ist eine Paket-
 * Empfehlung mit nachvollziehbarer Begründung, danach freier Übergang
 * in /anfrage oder zurück zum Anfang.
 *
 * Gestaltung: ein Bogen mit Haarlinien. Rechts (ab lg) läuft eine
 * Ladeliste mit, die die bisherigen Antworten zeigt; ein Klick springt
 * zur Frage zurück. Einfachauswahl hat runde Marken (Radio), die
 * Mehrfachauswahl eckige (Checkbox).
 *
 * Zustands-Persistenz in localStorage: Wer zurückkommt, macht da
 * weiter, wo er aufgehört hat.
 */

const STORAGE_KEY = "sitalo-empfehlung-v1";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_NAMES: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Branche",
  2: "Größe",
  3: "Vorhanden",
  4: "Zeitplan",
  5: "Website",
};

export function EmpfehlungWizard() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { step: Step; answers: Answers };
        if (parsed.step && parsed.answers) {
          setStep(parsed.step);
          setAnswers(parsed.answers);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
    } catch {
      // ignore quota / private mode
    }
  }, [step, answers, hydrated]);

  const canForward = useMemo(() => {
    switch (step) {
      case 1:
        return answers.branche != null;
      case 2:
        return answers.groesse != null;
      case 3:
        return answers.materialien.length > 0;
      case 4:
        return answers.zeit != null;
      case 5:
        return answers.site != null;
      default:
        return false;
    }
  }, [step, answers]);

  function reset() {
    setAnswers(EMPTY_ANSWERS);
    setStep(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function back() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  function forward() {
    if (!canForward) return;
    if (step < 6) setStep((s) => (s + 1) as Step);
  }

  // Keyboard: Enter forwards
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          tag === "BUTTON" ||
          tag === "A" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      if (e.key === "Enter" && canForward && step < 6) {
        e.preventDefault();
        setStep((s) => (s + 1) as Step);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canForward, step]);

  const summary = summarize(answers);

  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-12 lg:gap-8",
        "transition-opacity duration-300",
        hydrated ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="bg-card border-border min-w-0 rounded-[3px] border lg:col-span-8">
        <StepIndicator step={step} />

        <div className="min-h-[300px] p-5 sm:min-h-[340px] sm:p-8">
          {step === 1 && (
            <StepShell
              step={1}
              title="Was machen Sie?"
              subtitle="Die Branche entscheidet, welche Seiten Ihre Kunden suchen, etwa Speisekarte oder Sprechzeiten."
            >
              <Grid cols={3}>
                {BRANCHEN_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.slug}
                    label={o.label}
                    selected={answers.branche === o.slug}
                    onClick={() =>
                      setAnswers({ ...answers, branche: o.slug })
                    }
                  />
                ))}
              </Grid>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              step={2}
              title="Wie groß ist Ihr Betrieb?"
              subtitle="Ab ein paar Mitarbeitern kommen meist eine Team-Seite und Stellenangebote dazu."
            >
              <Grid cols={2}>
                {GROESSE_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.slug}
                    label={o.label}
                    detail={o.detail}
                    selected={answers.groesse === o.slug}
                    onClick={() =>
                      setAnswers({ ...answers, groesse: o.slug })
                    }
                  />
                ))}
              </Grid>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell
              step={3}
              title="Was haben Sie schon?"
              subtitle="Mehrere Antworten möglich. Was fehlt, erarbeiten wir mit Ihnen. Texte schreiben wir ohnehin aus Ihren Stichpunkten."
            >
              <Grid cols={2}>
                {MATERIAL_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.slug}
                    label={o.label}
                    detail={o.detail}
                    multi
                    selected={answers.materialien.includes(o.slug)}
                    onClick={() =>
                      setAnswers({
                        ...answers,
                        materialien: toggleMaterial(answers.materialien, o.slug),
                      })
                    }
                  />
                ))}
              </Grid>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell
              step={4}
              title="Wann soll die Seite online sein?"
              subtitle="Wer es eilig hat, fängt besser mit einem kleineren Umfang an und baut später aus."
            >
              <Grid cols={2}>
                {ZEIT_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.slug}
                    label={o.label}
                    detail={o.detail}
                    selected={answers.zeit === o.slug}
                    onClick={() => setAnswers({ ...answers, zeit: o.slug })}
                  />
                ))}
              </Grid>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell
              step={5}
              title="Haben Sie schon eine Website?"
              subtitle="Davon hängt ab, was wir übernehmen und ob die alte Seite bis zum Wechsel betreut werden muss."
            >
              <Grid cols={2}>
                {SITE_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.slug}
                    label={o.label}
                    detail={o.detail}
                    selected={answers.site === o.slug}
                    onClick={() => setAnswers({ ...answers, site: o.slug })}
                  />
                ))}
              </Grid>
            </StepShell>
          )}

          {step === 6 && <Result answers={answers} onReset={reset} />}
        </div>

        {step < 6 && (
          <div className="border-border flex items-center justify-between gap-4 border-t px-5 py-4 sm:px-8 sm:py-5">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className={cn(
                "text-muted-foreground hover:text-foreground inline-flex h-11 items-center gap-2 rounded-[2px] text-[15px] font-semibold transition-colors",
                step === 1 && "invisible",
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Zurück
            </button>

            <button
              type="button"
              onClick={forward}
              disabled={!canForward}
              className="btn-signal h-12 text-[15px]"
            >
              {step === 5 ? "Empfehlung anzeigen" : "Weiter"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <aside
        aria-label="Ihre bisherigen Antworten"
        className="hidden lg:col-span-4 lg:block"
      >
        <p className="label-mono text-muted-foreground">Ihre Antworten</p>
        <ol className="border-foreground mt-5 border-t">
          {([1, 2, 3, 4, 5] as const).map((n) => {
            const value = summary[n];
            const reachable = value != null || n <= step;
            return (
              <li key={n} className="border-border border-b">
                <button
                  type="button"
                  disabled={!reachable || step === n}
                  onClick={() => setStep(n)}
                  className={cn(
                    "grid w-full grid-cols-[6.5rem_1fr] items-baseline gap-3 py-3 text-left transition-colors",
                    reachable && step !== n && "hover:bg-foreground/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "label-mono",
                      step === n ? "text-gold" : "text-muted-foreground",
                    )}
                  >
                    {STEP_NAMES[n]}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 text-[14.5px] leading-snug",
                      value ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    {value ?? "–"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="text-muted-foreground mt-4 text-[13px] leading-relaxed">
          Ein Klick auf eine Zeile führt zur Frage zurück.
        </p>
      </aside>
    </div>
  );
}

function summarize(a: Answers): Record<1 | 2 | 3 | 4 | 5, string | null> {
  const label = <T extends { slug: string; label: string }>(
    list: T[],
    slug: string | null,
  ) => list.find((o) => o.slug === slug)?.label ?? null;
  const materialien = a.materialien
    .map((m) => MATERIAL_OPTIONS.find((o) => o.slug === m)?.label)
    .filter(Boolean)
    .join(", ");
  return {
    1: label(BRANCHEN_OPTIONS, a.branche),
    2: label(GROESSE_OPTIONS, a.groesse),
    3: materialien || null,
    4: label(ZEIT_OPTIONS, a.zeit),
    5: label(SITE_OPTIONS, a.site),
  };
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="border-border flex items-center gap-4 border-b px-5 py-4 sm:px-8">
      <p className="label-mono text-muted-foreground shrink-0 tabular-nums">
        {step < 6 ? `Frage ${step} von 5` : "Ergebnis"}
      </p>
      <div aria-hidden="true" className="flex flex-1 items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 transition-colors duration-500",
              i === step ? "bg-gold" : i < step ? "bg-foreground" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function StepShell({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up" data-step={step}>
      <h2 className="text-foreground text-balance text-[1.75rem] leading-[1.06] tracking-[-0.03em] sm:text-[2.25rem]">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-xl text-pretty text-[15px] leading-relaxed">
        {subtitle}
      </p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Grid({ cols, children }: { cols: 2 | 3; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid gap-2.5",
        cols === 2 ? "sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

function OptionCard({
  label,
  detail,
  selected,
  multi = false,
  onClick,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  /** Mehrfachauswahl: eckige Marke statt runder. */
  multi?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex min-w-0 items-start gap-3 rounded-[2px] border p-3.5 text-left transition-colors sm:p-4",
        selected
          ? "border-foreground bg-background"
          : "border-border bg-background/50 hover:border-foreground/50",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-[3px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors",
          multi ? "rounded-[2px]" : "rounded-full",
          selected
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/35",
        )}
      >
        {selected &&
          (multi ? (
            <Check className="h-3 w-3" strokeWidth={3} />
          ) : (
            <span className="bg-background h-1.5 w-1.5 rounded-full" />
          ))}
      </span>
      <span className="min-w-0">
        <span className="text-foreground block text-[15px] leading-snug font-semibold break-words">
          {label}
        </span>
        {detail && (
          <span className="text-muted-foreground mt-0.5 block text-[13px] leading-snug">
            {detail}
          </span>
        )}
      </span>
    </button>
  );
}

function Result({
  answers,
  onReset,
}: {
  answers: Answers;
  onReset: () => void;
}) {
  const empfehlung = empfehle(answers);
  const anfrageHref = `/anfrage?paket=${empfehlung.paket}&branche=${answers.branche ?? ""}`;
  const paket = getPaketBySlug(empfehlung.paket);
  const einmalig = paket?.setup;
  const monatlich = paket?.monthly.replace(/\s*\/\s*Monat$/, "");

  return (
    <div className="animate-fade-up">
      <p className="label-mono text-muted-foreground">Unsere Empfehlung</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 className="text-foreground text-[2.75rem] leading-[0.95] tracking-[-0.04em] sm:text-[3.75rem]">
          {empfehlung.paketLabel}
        </h2>
        {einmalig ? (
          <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-[14px]">
            <dt className="label-mono text-muted-foreground self-center">Einmalig</dt>
            <dd className="serif text-foreground text-[1.25rem]">{einmalig}</dd>
            {monatlich ? (
              <>
                <dt className="label-mono text-muted-foreground self-center">Monatlich</dt>
                <dd className="serif text-foreground text-[1.25rem]">{monatlich}</dd>
              </>
            ) : null}
          </dl>
        ) : null}
      </div>

      <div className="mt-8">
        <h3 className="label-mono text-muted-foreground">Warum</h3>
        <ul className="border-foreground divide-border mt-3 divide-y border-t">
          {empfehlung.begruendung.map((r, i) => (
            <li
              key={i}
              className="text-foreground/85 py-3 text-[15px] leading-relaxed"
            >
              {r}
            </li>
          ))}
        </ul>
      </div>

      {empfehlung.zusatzHinweis && (
        <div className="border-border bg-background mt-6 rounded-[3px] border p-4 sm:p-5">
          <p className="text-foreground/85 text-[14.5px] leading-relaxed">
            {empfehlung.zusatzHinweis}
          </p>
          <Link
            href="/wartung"
            className="text-foreground mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold underline underline-offset-4"
          >
            Wartung ansehen
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}

      <div className="border-border mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground inline-flex h-11 items-center gap-2 self-start rounded-[2px] text-[15px] font-semibold transition-colors sm:self-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Neu beginnen
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/pakete/${empfehlung.paket}`}
            className="btn-line h-12 text-[15px]"
          >
            Paket ansehen
          </Link>
          <Link href={anfrageHref} className="btn-signal h-12 text-[15px]">
            Damit anfragen
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function toggleMaterial(
  list: MaterialSlug[],
  slug: MaterialSlug,
): MaterialSlug[] {
  // „nichts" ist exklusiv — wenn jemand das wählt, kommt alles andere raus
  if (slug === "nichts") {
    return list.includes("nichts") ? [] : ["nichts"];
  }
  const without = list.filter((s) => s !== "nichts");
  return without.includes(slug)
    ? without.filter((s) => s !== slug)
    : [...without, slug];
}
