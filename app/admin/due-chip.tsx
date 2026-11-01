import type { DueState } from "@/lib/admin/reply-due";

import { cn } from "@/lib/utils";

/**
 * Antwortfrist als ruhiger Chip: offen neutral, 4-Std-Ziel verpasst
 * mit Gold-Rand, überfällig gedeckt rot. Keine Animation.
 */
export function DueChip({ due }: { due: DueState }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2 py-0.5 text-[12.5px] leading-snug font-medium",
        due.level === "offen" && "border-border text-muted-foreground",
        due.level === "ziel_verpasst" && "border-gold text-foreground",
        due.level === "ueberfaellig" && "border-red-200 bg-red-50 text-red-900",
      )}
    >
      {due.label}
    </span>
  );
}
