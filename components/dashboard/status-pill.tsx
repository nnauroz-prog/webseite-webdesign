import { cn } from "@/lib/utils";

const PALETTE: Record<string, string> = {
  new: "bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-100",
  contacted:
    "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100",
  reviewed:
    "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100",
  closed: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  accepted:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100",
  rejected: "bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-100",
};

export function StatusPill({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        PALETTE[status] ?? "bg-secondary text-secondary-foreground",
      )}
    >
      {label ?? status}
    </span>
  );
}
