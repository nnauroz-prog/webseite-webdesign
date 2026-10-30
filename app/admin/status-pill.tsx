import { STATUS_LABELS, type LeadStatus } from "@/lib/leads-meta";
import { cn } from "@/lib/utils";

const STYLES: Record<LeadStatus, string> = {
  neu: "bg-gold/20 text-foreground",
  in_arbeit: "bg-ink-petrol/15 text-ink-petrol",
  erledigt: "bg-ink-olive/15 text-ink-olive",
  archiviert: "bg-muted text-muted-foreground",
};

export function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11.5px] font-medium", STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
