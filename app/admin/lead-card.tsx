import Link from "next/link";

import type { AngebotHinweis } from "@/lib/admin/angebote";
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
  angebot,
}: {
  card: CardModel;
  /** In „Jetzt melden“ sind alle neu, die Status-Pill wäre doppelt. */
  hideStatus?: boolean;
  /** Ersetzt die Vorschau, z. B. erste Notizzeile bei Wiedervorlagen. */
  context?: string;
  /** „Angebot gesendet/geöffnet/angenommen“ (angebotHinweis), sonst nichts. */
  angebot?: AngebotHinweis | null;
}) {
  const neu = card.status === "neu";
  const preview = context ?? card.preview;
  return (
    <div
      className={cn(
        "border-border bg-card hover:border-foreground/30 flex items-center gap-2 rounded-[4px] border transition-colors",
        neu && "border-l-gold hover:border-l-gold border-l-4",
      )}
    >
      <Link
        href={`/admin/anfragen/${card.id}`}
        // Der dickere Rand bei „neu“ verschiebt den Text nicht.
        className={cn("block min-w-0 flex-1 py-3", neu ? "pl-[13px]" : "pl-4")}
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
                "rounded-[3px] border px-2 py-0.5 text-[12.5px]",
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
                "rounded-[3px] px-2 py-0.5 text-[12.5px] font-medium",
                card.outcome.won
                  ? "border-ink-petrol/45 text-ink-petrol border"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {card.outcome.label}
            </span>
          ) : null}
          {angebot ? (
            <span
              className={cn(
                "rounded-[3px] border px-2 py-0.5 text-[12.5px] font-medium",
                angebot.status === "angenommen"
                  ? "border-ink-petrol/45 text-ink-petrol"
                  : "border-border text-foreground",
              )}
            >
              {angebot.text}
            </span>
          ) : null}
          {card.mailFailed ? (
            <span className="bg-ink-olive/10 text-ink-olive rounded-[3px] px-2 py-0.5 text-[12.5px] font-medium">
              Mail fehlgeschlagen
            </span>
          ) : null}
        </div>
        {preview ? (
          <p className="text-muted-foreground mt-1 truncate text-[14px]">{preview}</p>
        ) : null}
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
