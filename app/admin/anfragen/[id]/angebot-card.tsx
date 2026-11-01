"use client";

import { ExternalLink, Eye, Loader2, Pencil, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import type { SendAngebot } from "@/app/admin/anfragen/[id]/angebot-send-sheet";
import type { Angebot, AngebotStatus } from "@/lib/admin/angebote";

import { setStatusAction } from "@/app/admin/actions";
import {
  declineAngebotAction,
  withdrawAngebotAction,
} from "@/app/admin/angebot-actions";
import {
  ANGEBOT_PILL,
  vorschauPfad,
} from "@/app/admin/anfragen/[id]/angebot-format";
import { AngebotSendSheet } from "@/app/admin/anfragen/[id]/angebot-send-sheet";
import { emitStatusDone, statusDoneLabel } from "@/app/admin/client-state";
import { runAction } from "@/app/admin/run-action";
import { ANGEBOT_GRENZEN, istBearbeitbar } from "@/lib/admin/angebote";
import { cn } from "@/lib/utils";

const BTN =
  "inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-[3px] px-4 text-[15px] font-medium transition-colors disabled:opacity-60";
const SECONDARY =
  "border-border bg-background hover:border-foreground/40 border";
const TEXT_BTN =
  "decoration-foreground/30 hover:decoration-foreground inline-flex h-11 items-center gap-1.5 text-[14.5px] font-medium underline underline-offset-4 disabled:opacity-60";

export type CardAngebot = SendAngebot & Pick<Angebot, "abgelehnt_grund">;

/**
 * Ein Angebot auf der Detailseite: Nummer, Status, Betrag, Statuszeile
 * und die Knöpfe Bearbeiten / Senden. Bei gesendeten Angeboten
 * zusätzlich „Zurückziehen“ und „Als abgelehnt markieren“, jeweils mit
 * Rückfrage im Kasten (nicht hinter einem Modal).
 */
export function AngebotCard({
  angebot,
  pill,
  statusText,
  betrag,
  steuer,
  editHref,
  leadId,
  leadOpen,
  superseded,
}: {
  angebot: CardAngebot;
  pill: { key: AngebotStatus | "abgelaufen"; label: string };
  statusText: string;
  betrag: string;
  steuer: string;
  editHref: string;
  leadId: string;
  /** Anfrage noch offen (neu/in Arbeit): nach Annahme „Auf Erledigt setzen“ anbieten. */
  leadOpen: boolean;
  /** Es gibt ein neueres Angebot zu dieser Anfrage. */
  superseded: boolean;
}) {
  const [sending, setSending] = useState(0);
  const [panel, setPanel] = useState<"none" | "withdraw" | "decline">("none");
  const [grund, setGrund] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<{
    text: string;
    retry: () => void;
  } | null>(null);
  const [pending, start] = useTransition();

  // Bestätigung nach ein paar Sekunden ausblenden.
  useEffect(() => {
    if (!note) return;
    const id = window.setTimeout(() => setNote(null), 8000);
    return () => window.clearTimeout(id);
  }, [note]);

  const status = angebot.status;
  const editable = istBearbeitbar(status);
  const sendable = status === "entwurf" || status === "gesendet";

  function run(task: () => Promise<void>) {
    setError(null);
    start(task);
  }

  function withdraw() {
    run(async () => {
      const res = await runAction(() => withdrawAngebotAction(angebot.id));
      if (!res.ok) return setError({ text: res.error, retry: withdraw });
      setPanel("none");
      setNote(`${angebot.nummer} zurückgezogen.`);
    });
  }

  function decline() {
    run(async () => {
      const res = await runAction(() =>
        declineAngebotAction(angebot.id, grund),
      );
      if (!res.ok) return setError({ text: res.error, retry: decline });
      setPanel("none");
      setGrund("");
      setNote(`${angebot.nummer} als abgelehnt vermerkt.`);
    });
  }

  function leadDone() {
    run(async () => {
      const res = await runAction(() => setStatusAction(leadId, "erledigt"));
      if (!res.ok) return setError({ text: res.error, retry: leadDone });
      // Daumenleiste zeigt „Rückgängig“ bzw. fragt nach dem Ergebnis.
      emitStatusDone({
        label: statusDoneLabel("erledigt"),
        undo: res.undo,
        askOutcome: res.askOutcome,
      });
    });
  }

  return (
    <article
      aria-label={`Angebot ${angebot.nummer}`}
      className={cn(
        "bg-background rounded-[4px] border p-4",
        status === "angenommen"
          ? "border-ink-petrol/45 border-2"
          : "border-border",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-mono text-[13.5px] font-medium tracking-tight">
          {angebot.nummer}
        </span>
        <span
          className={cn(
            "rounded-[3px] px-2 py-0.5 text-[12.5px] font-medium",
            ANGEBOT_PILL[pill.key],
          )}
        >
          {pill.label}
        </span>
      </div>
      <p className="mt-1.5 text-[16px] leading-snug font-semibold break-words">
        {angebot.titel}
      </p>
      <p className="mt-1 text-[15px] tabular-nums">{betrag}</p>
      <p className="text-muted-foreground text-[13px]">{steuer}</p>
      {statusText !== pill.label ? (
        <p
          className={cn(
            "mt-1.5 text-[14px]",
            status === "angenommen"
              ? "text-ink-petrol font-medium"
              : "text-muted-foreground",
          )}
        >
          {statusText}
        </p>
      ) : null}
      {status === "abgelehnt" && angebot.abgelehnt_grund ? (
        <p className="mt-1 text-[14px] break-words whitespace-pre-wrap">
          <span className="text-muted-foreground">Grund: </span>
          {angebot.abgelehnt_grund}
        </p>
      ) : null}
      {superseded && status === "gesendet" ? (
        <p className="border-gold mt-2 border-l-2 pl-2 text-[14px] leading-snug">
          Es gibt ein neueres Angebot. Zieh dieses zurück, damit nur eins gilt.
        </p>
      ) : null}

      {status === "angenommen" && leadOpen ? (
        <div className="bg-ink-petrol/8 mt-3 rounded-[4px] p-3">
          <p className="text-[15px] leading-relaxed">
            <strong>Nächster Schritt:</strong> Ruf den Kunden an und nenn den
            Starttermin. Danach die Anfrage auf Erledigt setzen.
          </p>
          <button
            type="button"
            onClick={leadDone}
            disabled={pending}
            className={cn(BTN, "bg-foreground text-background mt-2 h-11")}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            Auf Erledigt setzen
          </button>
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href={editHref} className={cn(BTN, SECONDARY)}>
          {editable ? (
            <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {editable ? "Bearbeiten" : "Ansehen"}
        </Link>
        {sendable ? (
          <button
            type="button"
            onClick={() => {
              setNote(null);
              setSending((n) => n + 1);
            }}
            className={cn(
              BTN,
              "bg-foreground text-background px-3 whitespace-nowrap",
            )}
          >
            <Send
              className={cn(
                "h-4 w-4 shrink-0",
                status === "gesendet" && "max-[400px]:hidden",
              )}
              aria-hidden="true"
            />
            {status === "gesendet" ? "Erneut senden" : "Senden"}
          </button>
        ) : (
          <a
            href={vorschauPfad(angebot.token)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(BTN, SECONDARY)}
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            Kundenansicht
          </a>
        )}
      </div>

      {sendable ? (
        <div className="mt-1 flex flex-wrap items-center gap-x-5">
          <a
            href={vorschauPfad(angebot.token)}
            target="_blank"
            rel="noopener noreferrer"
            className={TEXT_BTN}
          >
            Vorschau
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          {status === "gesendet" ? (
            <>
              <button
                type="button"
                aria-expanded={panel === "withdraw"}
                onClick={() =>
                  setPanel(panel === "withdraw" ? "none" : "withdraw")
                }
                className={TEXT_BTN}
              >
                Zurückziehen
              </button>
              <button
                type="button"
                aria-expanded={panel === "decline"}
                onClick={() =>
                  setPanel(panel === "decline" ? "none" : "decline")
                }
                className={TEXT_BTN}
              >
                Als abgelehnt markieren
              </button>
            </>
          ) : null}
        </div>
      ) : null}

      {panel === "withdraw" ? (
        <div className="border-border mt-2 rounded-[4px] border p-3">
          <p className="text-[15px] leading-relaxed">
            Unter dem Link steht dann „Dieses Angebot ist nicht mehr gültig“,
            annehmen geht nicht mehr. Für einen neuen Anlauf erstellst du ein
            neues Angebot.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={withdraw}
              disabled={pending}
              className={cn(BTN, "bg-foreground text-background h-11 grow")}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              Zurückziehen
            </button>
            <button
              type="button"
              onClick={() => setPanel("none")}
              disabled={pending}
              className={cn(BTN, SECONDARY, "h-11 grow")}
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : null}

      {panel === "decline" ? (
        <form
          className="border-border mt-2 rounded-[4px] border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            decline();
          }}
        >
          <label
            htmlFor={`grund-${angebot.id}`}
            className="block text-[15px] font-medium"
          >
            Grund{" "}
            <span className="text-muted-foreground font-normal">
              (optional, nur für dich)
            </span>
          </label>
          <textarea
            id={`grund-${angebot.id}`}
            value={grund}
            onChange={(e) => setGrund(e.target.value)}
            maxLength={ANGEBOT_GRENZEN.ablehnGrund}
            rows={2}
            placeholder="z. B. zu teuer, macht es selbst"
            data-dirty={grund.trim() ? "true" : undefined}
            className="border-border bg-card focus:border-foreground/60 mt-1.5 block [field-sizing:content] min-h-[4.75rem] w-full resize-none rounded-[4px] border px-3 py-2.5 text-base leading-snug outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={pending}
              className={cn(BTN, "bg-foreground text-background h-11 grow")}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              Als abgelehnt markieren
            </button>
            <button
              type="button"
              onClick={() => setPanel("none")}
              disabled={pending}
              className={cn(BTN, SECONDARY, "h-11 grow")}
            >
              Abbrechen
            </button>
          </div>
        </form>
      ) : null}

      {note ? (
        <p
          role="status"
          className="text-ink-petrol mt-2 text-[14.5px] font-medium"
        >
          {note}
        </p>
      ) : null}
      {error ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p role="alert" className="text-ink-olive text-[14px]">
            {error.text}
          </p>
          <button
            type="button"
            onClick={error.retry}
            disabled={pending}
            className={cn(BTN, SECONDARY, "h-11")}
          >
            Nochmal
          </button>
        </div>
      ) : null}

      {sending > 0 ? (
        <AngebotSendSheet
          key={sending}
          open
          angebot={angebot}
          editHref={editHref}
          onClose={() => setSending(0)}
          onSent={({ anfrageInArbeit, erstmals }) => {
            setSending(0);
            setNote(
              `${angebot.nummer} ${erstmals ? "freigegeben und als gesendet" : "erneut als gesendet"} vermerkt.${
                anfrageInArbeit
                  ? " Die Anfrage steht jetzt auf „In Arbeit“."
                  : ""
              }`,
            );
          }}
        />
      ) : null}
    </article>
  );
}
