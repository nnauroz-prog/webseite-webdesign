"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, Smartphone, Monitor } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Speed-Check-Tool — Live-PageSpeed-Analyse über /api/speed-check.
 *
 * UX:
 *   - URL-Input + Strategie-Toggle (Mobile / Desktop)
 *   - Loading-Animation während der ~15-30 s Wartezeit
 *   - Vier Score-Ringe (Performance, Accessibility, Best Practices, SEO)
 *   - Core Web Vitals als kompakte Metric-Pills
 *   - Conditional CTA: bei schlechten Scores → /audit, sonst dezent
 *
 * Bewusst klar gerahmt als „technisch und automatisch" — Abgrenzung
 * zu /audit (menschlich, 48 h, persönlich).
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

type Status =
  | { kind: "idle" }
  | { kind: "loading"; url: string }
  | { kind: "success"; data: ScoreData }
  | { kind: "error"; message: string };

export function SpeedCheck() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function check(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed.length < 4) return;

    setStatus({ kind: "loading", url: trimmed });
    try {
      const res = await fetch("/api/speed-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, strategy }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? `HTTP ${res.status}`,
        });
        return;
      }
      setStatus({ kind: "success", data });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Netzwerkfehler — bitte erneut versuchen.",
      });
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={check}
        className="border-border/60 bg-card/60 ring-foreground/5 space-y-5 rounded-2xl border p-6 ring-1 sm:p-8"
      >
        <div>
          <Label htmlFor="check-url" className="text-foreground text-sm">
            Welche Seite testen wir?
          </Label>
          <Input
            id="check-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="z. B. cafe-nordlicht.de"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2"
            required
          />
          <p className="text-muted-foreground mt-1.5 text-[12.5px]">
            Mit oder ohne https:// — wir richten das.
          </p>
        </div>

        <div>
          <Label className="text-foreground text-sm">
            Auf welchem Gerät?
          </Label>
          <div className="mt-3 inline-flex rounded-full border border-border/70 p-1">
            <StrategyButton
              active={strategy === "mobile"}
              onClick={() => setStrategy("mobile")}
              icon={Smartphone}
              label="Mobile"
            />
            <StrategyButton
              active={strategy === "desktop"}
              onClick={() => setStrategy("desktop")}
              icon={Monitor}
              label="Desktop"
            />
          </div>
          <p className="text-muted-foreground mt-2 text-[12.5px]">
            Mobile ist meist strenger — wie Google indexiert.
          </p>
        </div>

        <Button
          type="submit"
          disabled={status.kind === "loading" || url.trim().length < 4}
          className="bg-foreground text-background hover:bg-foreground/90 group h-12 rounded-full px-6 text-[15px] font-medium tracking-tight"
        >
          {status.kind === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird analysiert…
            </>
          ) : (
            <>
              Geschwindigkeit testen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>

      {status.kind === "loading" && <LoadingPanel url={status.url} />}

      {status.kind === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      {status.kind === "success" && <ResultPanel data={status.data} />}
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
        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-medium tracking-tight transition-all",
        active
          ? "bg-foreground text-background"
          : "text-foreground/65 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function LoadingPanel({ url }: { url: string }) {
  return (
    <div className="border-border/60 bg-card/30 ring-foreground/5 animate-fade-up rounded-2xl border p-8 text-center ring-1">
      <Loader2 className="text-foreground/70 mx-auto h-8 w-8 animate-spin" />
      <p className="text-foreground mt-5 text-balance text-lg font-medium">
        Wir gucken uns {url} gerade an.
      </p>
      <p className="text-muted-foreground mt-2 text-[13.5px] leading-relaxed">
        Das dauert ehrlich gesagt 15–30 Sekunden — PageSpeed Insights
        rendert Ihre Seite einmal komplett durch. Bitte kurz Geduld.
      </p>
    </div>
  );
}

function ResultPanel({ data }: { data: ScoreData }) {
  const { scores, metrics, analyzedUrl, strategy } = data;
  const worst = Math.min(
    ...(Object.values(scores).filter((s): s is number => s != null)),
  );
  const veryBad = worst < 50;
  const okay = worst >= 50 && worst < 80;
  const great = worst >= 80;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="border-border/60 bg-card/60 ring-foreground/5 rounded-2xl border p-6 ring-1 sm:p-8">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1 w-6"
          />
          Ergebnisse · {strategy === "mobile" ? "Mobile" : "Desktop"}
        </p>
        <p className="text-foreground mt-3 text-[14px] tabular-nums">
          {analyzedUrl}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreRing label="Performance" score={scores.performance} />
          <ScoreRing label="Accessibility" score={scores.accessibility} />
          <ScoreRing label="Best Practices" score={scores.bestPractices} />
          <ScoreRing label="SEO" score={scores.seo} />
        </div>

        {(metrics.lcp || metrics.cls || metrics.inp) && (
          <div className="border-border/40 mt-8 border-t pt-6">
            <p className="text-muted-foreground/80 mb-3 font-mono text-[10px] uppercase tracking-[0.22em]">
              Core Web Vitals
            </p>
            <div className="flex flex-wrap gap-3">
              {metrics.lcp && <MetricPill label="LCP" value={metrics.lcp} />}
              {metrics.cls && <MetricPill label="CLS" value={metrics.cls} />}
              {metrics.inp && <MetricPill label="INP" value={metrics.inp} />}
            </div>
          </div>
        )}
      </div>

      {/* Adaptive Take */}
      <div
        className={cn(
          "rounded-2xl border p-6",
          veryBad && "border-foreground bg-foreground text-background",
          okay && "border-foreground/15 bg-foreground/[0.04]",
          great && "border-border/60 bg-card/40",
        )}
      >
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.22em]",
            veryBad ? "text-background/65" : "text-muted-foreground",
          )}
        >
          Was das heißt
        </p>
        {veryBad && (
          <>
            <p className="serif mt-3 text-balance text-2xl leading-snug">
              Ihre Seite ist{" "}
              <span className="serif-italic">deutlich zu langsam</span> für
              das, was Google heute sehen will. Das kostet Sie messbar
              Sichtbarkeit.
            </p>
            <p className="text-background/80 mt-3 text-[14.5px] leading-relaxed">
              Wir können das in ein paar Tagen begradigen — entweder
              im Rahmen einer Neuerstellung oder als gezielten
              Wartungs-Sprint.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/audit"
                className="bg-background text-foreground hover:bg-background/90 inline-flex h-11 items-center rounded-full px-5 text-[14px] font-medium tracking-tight"
              >
                Ehrlichen Audit anfordern
              </Link>
              <Link
                href="/wartung"
                className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-11 items-center rounded-full border px-5 text-[14px] font-medium tracking-tight transition-all"
              >
                Wartungs-Sprint
              </Link>
            </div>
          </>
        )}
        {okay && (
          <>
            <p className="serif mt-3 text-balance text-2xl leading-snug">
              Solide{" "}
              <span className="serif-italic text-muted-foreground">
                Mittelfeld
              </span>{" "}
              — aber Luft nach oben.
            </p>
            <p className="text-foreground/80 mt-3 text-[14.5px] leading-relaxed">
              Mit ein paar gezielten Eingriffen ist hier deutlich mehr
              drin. Wir gucken uns das gerne im persönlichen Audit
              detailliert an.
            </p>
            <Link
              href="/audit"
              className="bg-foreground text-background hover:bg-foreground/90 mt-5 inline-flex h-11 items-center rounded-full px-5 text-[14px] font-medium tracking-tight"
            >
              Persönlichen Audit anfordern
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </>
        )}
        {great && (
          <>
            <p className="serif text-foreground mt-3 text-balance text-2xl leading-snug">
              Glückwunsch.{" "}
              <span className="serif-italic text-muted-foreground">
                Das läuft.
              </span>
            </p>
            <p className="text-foreground/80 mt-3 text-[14.5px] leading-relaxed">
              Technisch sieht das gut aus. Ob die Seite auch das
              Richtige für Ihre Kunden tut, sehen automatische Tests
              allerdings nicht — dafür gibt's unseren persönlichen
              Audit.
            </p>
            <Link
              href="/audit"
              className="text-foreground mt-5 inline-flex items-center gap-2 text-[14px] font-medium underline-offset-[6px] hover:underline"
            >
              Persönlichen Audit für die Inhalts-Seite
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function ScoreRing({ label, score }: { label: string; score: number | null }) {
  if (score == null) {
    return (
      <div className="text-center">
        <div className="border-border/60 mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full border">
          <span className="text-muted-foreground/60 text-2xl font-semibold">
            —
          </span>
        </div>
        <p className="text-muted-foreground mt-3 text-[12.5px] font-medium tracking-tight">
          {label}
        </p>
      </div>
    );
  }
  const color =
    score >= 90
      ? "text-emerald-700 dark:text-emerald-400"
      : score >= 50
        ? "text-gold"
        : "text-red-700 dark:text-red-400";
  const ringColor =
    score >= 90
      ? "stroke-emerald-600 dark:stroke-emerald-400"
      : score >= 50
        ? "stroke-gold"
        : "stroke-red-600 dark:stroke-red-400";
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="text-center">
      <div className="relative mx-auto inline-block h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            className="stroke-border/50"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(ringColor, "transition-[stroke-dashoffset] duration-700 ease-out")}
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums tracking-tight",
            color,
          )}
        >
          {score}
        </span>
      </div>
      <p className="text-foreground mt-3 text-[12.5px] font-medium tracking-tight">
        {label}
      </p>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="border-border/60 inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
      <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.18em]">
        {label}
      </span>
      <span className="text-foreground text-[13px] font-medium tabular-nums">
        {value}
      </span>
    </span>
  );
}
