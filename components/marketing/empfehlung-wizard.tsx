"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";

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
import { cn } from "@/lib/utils";

/**
 * Empfehlungs-Wizard — fünf Fragen, eine Empfehlung.
 *
 * Anders als das frühere Anfrage-Wizard (rückgebaut, zu viele
 * Klicks für Erstkontakt): das hier ist ein Beratungs-Tool, kein
 * Submission-Flow. Output ist eine personalisierte Paket-
 * Empfehlung mit nachvollziehbarer Begründung — dann freier
 * Übergang in /anfrage oder zurück zum Quiz.
 *
 * Zustands-Persistenz in localStorage: User kann zur Seite zurück-
 * kommen und macht da weiter wo er aufgehört hat. Wenn die
 * Empfehlung schon berechnet wurde, sieht er die direkt.
 */

const STORAGE_KEY = "sitalo-empfehlung-v1";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

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

  // Keyboard: Enter forwards, Esc resets
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      if (e.key === "Enter" && canForward && step < 6) {
        e.preventDefault();
        forward();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canForward, step]);

  return (
    <div
      className={cn(
        "border-border/60 bg-card/70 ring-foreground/5 rounded-3xl border p-6 ring-1 sm:p-10",
        "transition-opacity duration-300",
        hydrated ? "opacity-100" : "opacity-0",
      )}
    >
      <StepIndicator step={step} />

      <div className="mt-8 min-h-[280px] sm:min-h-[320px]">
        {step === 1 && (
          <StepShell
            eyebrow="Frage 1 von 5"
            title="Was machen Sie?"
            subtitle="Damit wir die typischen Anforderungen Ihrer Branche kennen."
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
            eyebrow="Frage 2 von 5"
            title="Wie groß ist Ihr Betrieb?"
            subtitle="Wirkt sich auf die Struktur aus — Team-Seite, mehrere Standorte, Stellenangebote."
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
            eyebrow="Frage 3 von 5"
            title="Was haben Sie schon parat?"
            subtitle="Mehrfachauswahl möglich. Wir helfen bei dem, was fehlt — keine Sorge."
          >
            <Grid cols={2}>
              {MATERIAL_OPTIONS.map((o) => (
                <OptionCard
                  key={o.slug}
                  label={o.label}
                  detail={o.detail}
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
            eyebrow="Frage 4 von 5"
            title="Wann soll's live sein?"
            subtitle="Ehrliche Einschätzung — Termindruck verändert die sinnvolle Paket-Größe."
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
            eyebrow="Frage 5 von 5"
            title="Haben Sie schon eine Website?"
            subtitle="Wichtig für den Umzug, das Timing, und ob Wartung nebenher Sinn ergibt."
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
        <div className="border-border/40 mt-8 flex items-center justify-between border-t pt-6">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className={cn(
              "text-muted-foreground hover:text-foreground inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              step === 1 && "invisible",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </button>

          <button
            type="button"
            onClick={forward}
            disabled={!canForward}
            className={cn(
              "bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium tracking-tight transition-all",
              !canForward && "opacity-40 hover:bg-foreground",
            )}
          >
            {step === 5 ? "Empfehlung anzeigen" : "Weiter"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= step;
        const current = i === step;
        return (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-500",
              active ? "bg-foreground" : "bg-border/60",
              current && "bg-gold",
            )}
          />
        );
      })}
    </div>
  );
}

function StepShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up">
      <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
        {eyebrow}
      </p>
      <h2 className="text-foreground mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-4xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-xl text-pretty text-[15px] leading-relaxed">
        {subtitle}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Grid({ cols, children }: { cols: 2 | 3; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
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
  onClick,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-foreground bg-foreground/[0.04] shadow-sm"
          : "border-border/60 bg-background/40 hover:border-foreground/40 hover:bg-foreground/[0.02]",
      )}
    >
      <div>
        <p className="text-foreground text-[14.5px] font-medium tracking-[-0.005em]">
          {label}
        </p>
        {detail && (
          <p className="text-muted-foreground mt-0.5 text-[12.5px] leading-snug">
            {detail}
          </p>
        )}
      </div>
      <span
        className={cn(
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
          selected
            ? "border-foreground bg-foreground text-background"
            : "border-border/60 bg-transparent",
        )}
      >
        {selected && <Check className="h-3 w-3" aria-hidden="true" />}
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

  return (
    <div className="animate-fade-up">
      <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        Unsere Empfehlung für Sie
      </p>
      <h2 className="text-foreground mt-3 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
        Paket{" "}
        <span className="serif-italic text-muted-foreground font-normal">
          {empfehlung.paketLabel}.
        </span>
      </h2>
      <p className="text-muted-foreground mt-2 text-[14px] font-medium">
        {empfehlung.preisLabel}
      </p>

      <div className="border-border/40 mt-8 border-t pt-6">
        <p className="text-muted-foreground/80 mb-4 font-mono text-[10px] uppercase tracking-[0.22em]">
          Warum diese Empfehlung
        </p>
        <ul className="space-y-3">
          {empfehlung.begruendung.map((r, i) => (
            <li
              key={i}
              className="text-foreground/85 flex items-start gap-3 text-[14.5px] leading-relaxed"
            >
              <span
                aria-hidden="true"
                className="bg-gold mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
              />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {empfehlung.zusatzHinweis && (
        <div className="border-foreground/15 mt-6 rounded-2xl border bg-foreground/[0.04] p-4">
          <p className="text-foreground/85 text-[14px] leading-relaxed">
            {empfehlung.zusatzHinweis}
          </p>
          <Link
            href="/wartung"
            className="text-foreground mt-2 inline-flex items-center gap-1 text-[13px] font-medium underline underline-offset-4"
          >
            Wartung-Tarife ansehen
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      <div className="border-border/40 mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground inline-flex h-10 items-center gap-2 self-start rounded-full px-4 text-sm font-medium transition-colors sm:self-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Quiz neu starten
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href={`/pakete/${empfehlung.paket}`}
            className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-[14.5px] font-medium tracking-tight transition-all"
          >
            Paket-Details
          </Link>
          <Link
            href={anfrageHref}
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[14.5px] font-medium tracking-tight"
          >
            Mit dieser Empfehlung anfragen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
