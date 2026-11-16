import type { Schritte } from "@/lib/admin/projekte";

import { PROJEKT_SCHRITTE, SCHRITT_LABELS } from "@/lib/admin/projekte";
import { cn } from "@/lib/utils";

/**
 * Fünf Striche, je Schritt einer: erledigt dunkel, offen hell. Rein
 * zur Orientierung (aria-hidden); die Zahl „3 von 5“ steht daneben.
 */
export function FortschrittBalken({
  schritte,
  className,
}: {
  schritte: Schritte;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("flex gap-1", className)}>
      {PROJEKT_SCHRITTE.map((s) => (
        <span
          key={s}
          title={SCHRITT_LABELS[s]}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            schritte[s] ? "bg-foreground" : "bg-foreground/[0.12]",
          )}
        />
      ))}
    </div>
  );
}
