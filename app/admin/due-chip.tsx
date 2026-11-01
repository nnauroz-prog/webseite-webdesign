import type { DueState } from "@/lib/admin/reply-due";

import { cn } from "@/lib/utils";

/**
 * Antwortfrist als ruhiger Chip: offen neutral, über 4 Std. offen
 * mit Signal-Rand, überfällig in Container-Rot. Keine Animation.
 */
export function DueChip({ due }: { due: DueState }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-[3px] border px-2 py-0.5 text-[12.5px] leading-snug font-medium",
        due.level === "offen" && "border-border text-muted-foreground",
        due.level === "ziel_verpasst" && "border-gold text-foreground",
        due.level === "ueberfaellig" && "border-ink-olive/30 bg-ink-olive/10 text-ink-olive",
      )}
    >
      {due.label}
    </span>
  );
}
