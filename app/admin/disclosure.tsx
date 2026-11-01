import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Aufklappbarer Kasten (natives <details>) mit eigenem Pfeil: Safari
 * und Chrome zeigen den Standard-Marker sonst unterschiedlich oder gar
 * nicht. Ganze Kopfzeile ist Tippfläche (mindestens 48 px hoch).
 */
export function Disclosure({
  title,
  children,
  className,
  summaryClassName,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  summaryClassName?: string;
}) {
  return (
    <details className={cn("group border-border bg-card rounded-[4px] border", className)}>
      <summary
        className={cn(
          "flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden",
          summaryClassName,
        )}
      >
        <span className="min-w-0">{title}</span>
        <ChevronDown
          className="text-muted-foreground h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  );
}
