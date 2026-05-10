import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
};

/**
 * Reusable empty-state block for dashboard list pages. Shows a tinted icon
 * tile, a title, a one-line description, and up to two CTAs.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  tone = "indigo",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  tone?: "indigo" | "sky" | "emerald" | "amber" | "pink" | "orange" | "rose";
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    indigo:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    amber:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 ring-pink-500/20",
    orange:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-orange-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
  };

  return (
    <div
      className={cn(
        "border-border bg-card flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-4",
          toneClasses[tone],
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="text-foreground mt-5 text-base font-semibold tracking-tight">
        {title}
      </h3>
      {description ? (
        <p className="text-muted-foreground mx-auto mt-1.5 max-w-sm text-sm text-pretty">
          {description}
        </p>
      ) : null}
      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {primaryAction ? (
            primaryAction.href ? (
              <Button asChild size="sm">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : (
              <Button size="sm" type="button" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )
          ) : null}
          {secondaryAction ? (
            secondaryAction.href ? (
              <Button asChild size="sm" variant="outline">
                <Link href={secondaryAction.href}>
                  {secondaryAction.label}
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}
