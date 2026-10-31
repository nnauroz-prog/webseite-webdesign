import Link from "next/link";

import type { CardModel } from "@/lib/admin/card-model";

import { CallButton } from "@/app/admin/call-button";
import { DueChip } from "@/app/admin/due-chip";
import { StatusPill } from "@/app/admin/status-pill";
import { cn } from "@/lib/utils";

/**
 * Listenkarte: Link auf die Detailseite, daneben (nicht darin) ein
 * eigener Anrufen-Knopf. Antworten per Mail laufen bewusst über die
 * Vorlagen der Detailseite.
 */
export function LeadCard({
  card,
  hideStatus = false,
  context,
}: {
  card: CardModel;
  /** In „Jetzt melden“ sind alle neu, die Status-Pill wäre doppelt. */
  hideStatus?: boolean;
  /** Ersetzt die Vorschau, z. B. erste Notizzeile bei Wiedervorlagen. */
  context?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-card flex items-center gap-2 rounded-2xl border",
        card.status === "neu" && "border-l-gold border-l-4",
      )}
    >
      <Link
        href={`/admin/anfragen/${card.id}`}
        className="block min-w-0 flex-1 py-3 pl-4"
      >
        <p className="truncate text-[16px] font-semibold tracking-tight">
          {card.name}
          {card.firma ? (
            <span className="text-muted-foreground font-normal">
              {" "}
              · {card.firma}
            </span>
          ) : null}
        </p>
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
          {hideStatus ? null : <StatusPill status={card.status} />}
          <span>{card.kindLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{card.when}</span>
          {card.due ? <DueChip due={card.due} /> : null}
          {card.followUp ? (
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[12.5px]",
                card.followUpDue
                  ? "border-gold text-foreground"
                  : "border-border",
              )}
            >
              {card.followUp}
            </span>
          ) : null}
          {card.outcome ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[12.5px] font-medium",
                card.outcome.won
                  ? "bg-secondary text-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {card.outcome.label}
            </span>
          ) : null}
          {card.mailFailed ? (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[12.5px] font-medium text-red-900">
              Mail fehlgeschlagen
            </span>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-1 truncate text-[14px]">
          {context ?? card.preview}
        </p>
      </Link>
      {card.tel ? (
        <div className="flex w-14 shrink-0 items-center justify-center">
          <CallButton href={card.tel} leadId={card.id} name={card.name} />
        </div>
      ) : (
        <span className="w-2 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}
