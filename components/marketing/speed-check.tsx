"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, Monitor, Smartphone } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Speed-Check-Tool — Live-PageSpeed-Analyse über /api/speed-check.
 *
 * Aufbau im Hafen-Stil: ein Prüfschein mit Haarlinien statt Karten,
 * die vier Lighthouse-Werte als Skalen mit Tabellenziffern statt
 * Ringen, Core Web Vitals als Zeilen. Die Bewertung steht immer auch
 * als Wort neben der Zahl, damit sie nicht nur an der Farbe hängt.
 *
 * Farben: Hafengrün ab 90, Signal-Orange 50 bis 89, Container-Rot
 * unter 50 (die Schwellen von Lighthouse).
 *
 * Abgrenzung zu /audit: hier misst Google automatisch die Technik,
 * im Audit sehen wir uns die Seite selbst an.
 */

type Strategy = "mobile" | "desktop";

type ScoreData = {
  analyzedUrl: string;
  strategy: Strategy;
  scores: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  metrics: {
    lcp: string | null;
    cls: string | null;
    inp: string | null;
  };
};

/** Ersatz-Ergebnis, wenn Google nicht antwortet (lib/basic-site-check.ts). */
type BasicData = {
  analyzedUrl: string;
  mode: "basic";
  items: { label: string; ok: boolean; detail: string }[];
};

type Status =
  | { kind: "idle" }
  | { kind: "loading"; url: string }
  | { kind: "success"; data: ScoreData }
  | { kind: "basic"; data: BasicData }
  | { kind: "error"; message: string };

export function SpeedCheck() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function check(e: React.FormEvent) {
    e.preventDefault();
    // Doppel-Submit-Schutz: solange „loading", kein zweiter Lauf.
    if (status.kind === "loading") return;
    const trimmed = url.trim();
    if (trimmed.length < 4) return;

    setStatus({ kind: "loading", url: trimmed });
    // 60-Sekunden-Client-Timeout, leicht über dem Server-maxDuration
    // von 60 s. AbortController bricht den Fetch sauber ab, statt die
    // UI auf „lädt" stehen zu lassen, wenn der Tab im Hintergrund war.
    const abort = new AbortController();
    const timeoutId = window.setTimeout(() => abort.abort(), 60_000);
    try {
      const res = await fetch("/api/speed-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, strategy }),
        signal: abort.signal,
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? `HTTP ${res.status}`,
        });
        return;
      }
      setStatus(data.mode === "basic" ? { kind: "basic", data } : { kind: "success", data });
    } catch (err) {
      const isAbort =
        err instanceof Error &&
        (err.name === "AbortError" || err.name === "TimeoutError");
      setStatus({
        kind: "error",
        message: isAbort
          ? "Die Messung hat zu lange gedauert. Bitte versuchen Sie es noch einmal."
          : err instanceof Error
            ? err.message
            : "Die Verbindung ist abgebrochen. Bitte versuchen Sie es noch einmal.",
      });
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={check} className="bg-card border-border rounded-[3px] border">
        <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <Label htmlFor="check-url" className="text-foreground text-[15px] font-semibold">
              Adresse der Website
            </Label>
            <Input
              id="check-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="z. B. cafe-nordlicht.de"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-3 h-12 rounded-[2px] text-[16px] shadow-none"
              required
            />
            <p className="text-muted-foreground mt-2 text-[13px]">
              Mit oder ohne https://, beides geht.
            </p>
          </div>

          <fieldset className="min-w-0">
            <legend className="text-foreground text-[15px] font-semibold">
              Gemessen wird
            </legend>
            <div className="border-border mt-3 inline-flex rounded-[2px] border p-[3px]">
              <StrategyButton
                active={strategy === "mobile"}
                onClick={() => setStrategy("mobile")}
                icon={Smartphone}
                label="am Handy"
              />
              <StrategyButton
                active={strategy === "desktop"}
                onClick={() => setStrategy("desktop")}
                icon={Monitor}
                label="am Rechner"
              />
            </div>
          </fieldset>
        </div>

        <div className="border-border flex flex-col gap-4 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-muted-foreground max-w-md text-[13.5px] leading-relaxed">
            Die Handy-Messung ist strenger. Google bewertet Seiten in erster
            Linie nach der Ansicht auf dem Handy.
          </p>
          <button
            type="submit"
            disabled={status.kind === "loading" || url.trim().length < 4}
            className="btn-signal h-12 shrink-0 text-[15px]"
          >
            {status.kind === "loading" ? (
              <>
                Wird gemessen
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              </>
            ) : (
              <>
                Geschwindigkeit testen
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>

      {status.kind === "loading" && <LoadingPanel url={status.url} />}

      {status.kind === "error" && (
        <Alert variant="destructive" className="rounded-[3px]">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      {status.kind === "success" && <ResultPanel data={status.data} />}
      {status.kind === "basic" && <BasicPanel data={status.data} />}
    </div>
  );
}

function StrategyButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-[2px] px-4 text-[14px] font-semibold transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function LoadingPanel({ url }: { url: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-card border-border animate-fade-up flex items-start gap-4 rounded-[3px] border p-5 sm:p-8"
    >
      <Loader2 className="text-gold mt-1 h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-foreground text-[17px] font-semibold break-words">
          Google lädt {url} gerade.
        </p>
        <p className="text-muted-foreground mt-2 max-w-xl text-[14px] leading-relaxed">
          PageSpeed Insights öffnet die Seite einmal komplett, so wie ein
          Besucher. Das dauert 15 bis 30 Sekunden, manchmal etwas länger.
        </p>
      </div>
    </div>
  );
}

function BasicPanel({ data }: { data: BasicData }) {
  const passed = data.items.filter((i) => i.ok).length;
  return (
    <div className="animate-fade-up space-y-6">
      <div className="bg-card border-border rounded-[3px] border">
        <div className="border-border flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-5 py-4 sm:px-8">
          <p className="label-mono text-muted-foreground">
            Basis-Check · {passed} von {data.items.length} in Ordnung
          </p>
          <p className="text-foreground min-w-0 font-mono text-[13px] break-all">
            {data.analyzedUrl}
          </p>
        </div>
        <p className="text-muted-foreground px-5 pt-5 text-[14px] leading-relaxed sm:px-8">
          Google PageSpeed ist gerade ausgelastet. Diese Werte haben wir
          selbst gemessen.
        </p>
        <ul className="divide-border mt-3 divide-y px-5 pb-2 sm:px-8">
          {data.items.map((item) => (
            <li key={item.label} className="flex items-start gap-3 py-3.5">
              <span
                aria-hidden="true"
                className={cn(
                  "text-background mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] text-[11px] font-bold",
                  item.ok ? "bg-ink-petrol" : "bg-ink-olive",
                )}
              >
                {item.ok ? "✓" : "!"}
              </span>
              <span className="min-w-0">
                <span className="sr-only">{item.ok ? "In Ordnung: " : "Problem: "}</span>
                <span className="text-foreground block text-[15px] font-semibold">{item.label}</span>
                <span className="text-muted-foreground block text-[13.5px] break-words">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/audit" className="btn-signal h-12 text-[15px]">
        Audit anfordern
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

const SCORE_LABELS: { key: keyof ScoreData["scores"]; label: string; original: string }[] = [
  { key: "performance", label: "Ladezeit", original: "Performance" },
  { key: "accessibility", label: "Barrierefreiheit", original: "Accessibility" },
  { key: "bestPractices", label: "Technik", original: "Best Practices" },
  { key: "seo", label: "Google-Grundlagen", original: "SEO" },
];

function ResultPanel({ data }: { data: ScoreData }) {
  const { scores, metrics, analyzedUrl, strategy } = data;
  const worst = Math.min(
    ...(Object.values(scores).filter((s): s is number => s != null)),
  );
  const veryBad = worst < 50;
  const okay = worst >= 50 && worst < 80;
  const great = worst >= 80;

  const vitals = [
    { code: "LCP", text: "Größter Inhalt sichtbar nach", value: metrics.lcp },
    { code: "CLS", text: "Verschieben beim Laden", value: metrics.cls },
    { code: "INP", text: "Reaktion auf Klick oder Tippen", value: metrics.inp },
  ].filter((v): v is { code: string; text: string; value: string } => v.value != null);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="bg-card border-border overflow-hidden rounded-[3px] border">
        <div className="border-border flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-5 py-4 sm:px-8">
          <p className="label-mono text-muted-foreground">
            Messung {strategy === "mobile" ? "am Handy" : "am Rechner"}
          </p>
          <p className="text-foreground min-w-0 font-mono text-[13px] break-all">
            {analyzedUrl}
          </p>
        </div>

        <dl className="bg-border grid grid-cols-2 gap-px lg:grid-cols-4">
          {SCORE_LABELS.map((s) => (
            <ScoreCell
              key={s.key}
              label={s.label}
              original={s.original}
              score={scores[s.key]}
            />
          ))}
        </dl>

        {vitals.length > 0 && (
          <div className="border-border border-t px-5 py-5 sm:px-8">
            <p className="label-mono text-muted-foreground">Core Web Vitals</p>
            <dl className="divide-border mt-2 divide-y">
              {vitals.map((v) => (
                <div
                  key={v.code}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="min-w-0 text-[14.5px]">
                    <span className="text-foreground mr-3 font-mono text-[12.5px] font-semibold">
                      {v.code}
                    </span>
                    <span className="text-muted-foreground">{v.text}</span>
                  </dt>
                  <dd className="serif text-foreground shrink-0 text-[17px]">
                    {v.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {veryBad && (
        <div className="bg-foreground text-background rounded-[3px] p-6 sm:p-8">
          <p className="label-mono text-stahl-hell">Was das heißt</p>
          <p className="serif mt-3 max-w-2xl text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.85rem]">
            Mindestens ein Wert liegt unter 50. Google stuft das als schlecht
            ein.
          </p>
          <p className="text-stahl-hell mt-4 max-w-2xl text-[15px] leading-relaxed">
            Woran es liegt, schreiben wir Ihnen im Audit auf. Beheben lässt es
            sich mit einer neuen Seite oder an Ihrer bestehenden über unsere
            Wartung, auch wenn wir die Seite nicht gebaut haben.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/audit" className="btn-signal h-12 text-[15px]">
              Audit anfordern
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/wartung" className="btn-line h-12 text-[15px]">
              Wartung ansehen
            </Link>
          </div>
        </div>
      )}

      {okay && (
        <div className="border-border rounded-[3px] border p-6 sm:p-8">
          <p className="label-mono text-muted-foreground">Was das heißt</p>
          <p className="serif text-foreground mt-3 max-w-2xl text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.85rem]">
            Der schwächste Wert liegt zwischen 50 und 79.
          </p>
          <p className="text-muted-foreground mt-4 max-w-2xl text-[15px] leading-relaxed">
            Die Seite funktioniert, lässt aber etwas liegen. Welche Stelle sich
            zuerst lohnt, schreiben wir Ihnen im Audit auf.
          </p>
          <Link href="/audit" className="btn-signal mt-6 h-12 text-[15px]">
            Audit anfordern
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}

      {great && (
        <div className="border-border rounded-[3px] border p-6 sm:p-8">
          <p className="label-mono text-muted-foreground">Was das heißt</p>
          <p className="serif text-foreground mt-3 max-w-2xl text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.85rem]">
            Alle gemessenen Werte liegen bei 80 oder darüber.
          </p>
          <p className="text-muted-foreground mt-4 max-w-2xl text-[15px] leading-relaxed">
            Technisch ist die Seite in Ordnung. Ob Besucher die Telefonnummer
            finden und verstehen, was Sie anbieten, misst der Test nicht. Das
            sehen wir uns im Audit an.
          </p>
          <Link
            href="/audit"
            className="text-foreground decoration-gold mt-5 inline-flex items-center gap-2 text-[15px] font-semibold underline decoration-2 underline-offset-[6px]"
          >
            Audit anfordern
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}

function rating(score: number) {
  if (score >= 90) return { word: "gut", text: "text-ink-petrol", bar: "bg-ink-petrol" };
  if (score >= 50) return { word: "mittel", text: "text-gold", bar: "bg-gold" };
  return { word: "schwach", text: "text-ink-olive", bar: "bg-ink-olive" };
}

function ScoreCell({
  label,
  original,
  score,
}: {
  label: string;
  original: string;
  score: number | null;
}) {
  const r = score == null ? null : rating(score);
  return (
    <div className="bg-card flex min-w-0 flex-col p-4 sm:p-6">
      <dt>
        <span className="text-foreground block text-[14.5px] leading-snug font-semibold">
          {label}
        </span>
        <span className="text-muted-foreground block font-mono text-[11.5px]">
          {original}
        </span>
      </dt>
      <dd className="mt-4 flex items-baseline gap-1.5">
        <span
          className={cn(
            "serif text-[2.5rem] leading-none tracking-[-0.03em] sm:text-[2.9rem]",
            r ? r.text : "text-muted-foreground",
          )}
        >
          {score ?? "–"}
        </span>
        {r ? (
          <span className="text-muted-foreground font-mono text-[12px]">/ 100</span>
        ) : null}
      </dd>
      <dd className="text-muted-foreground mt-2 font-mono text-[12px]">
        {r ? r.word : "nicht gemessen"}
      </dd>
      <dd aria-hidden="true" className="bg-border mt-2.5 h-1.5">
        {r && score != null ? (
          <span
            className={cn("block h-full transition-[width] duration-700 ease-out", r.bar)}
            style={{ width: `${Math.max(2, Math.min(100, score))}%` }}
          />
        ) : null}
      </dd>
    </div>
  );
}
