"use client";

import { ListChecks, Loader2, Mail, Phone } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";

import type { SlotDay } from "@/app/admin/anfragen/[id]/reply-sheet";
import type { StatusDone } from "@/app/admin/client-state";
import type { CardLead } from "@/lib/admin/card-model";
import type { LeadStatus } from "@/lib/leads-meta";

import { restoreLeadAction } from "@/app/admin/actions";
import { ReplySheet } from "@/app/admin/anfragen/[id]/reply-sheet";
import { StatusSheet } from "@/app/admin/anfragen/[id]/status-sheet";
import {
  markContact,
  OPEN_OUTCOME_EVENT,
  OPEN_REPLY_EVENT,
  STATUS_DONE_EVENT,
} from "@/app/admin/client-state";
import { ContactPrompt } from "@/app/admin/contact-prompt";
import { runAction } from "@/app/admin/run-action";
import { cn } from "@/lib/utils";

const UNDO_MS = 10_000;

type Sheet =
  | { kind: "none" }
  | { kind: "status"; step: "status" | "outcome"; done: StatusDone | null; key: number }
  | { kind: "reply"; key: number };

function isTextField(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.closest("dialog")) return false;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  if (el instanceof HTMLInputElement) {
    return !["button", "submit", "checkbox", "radio", "hidden", "reset"].includes(el.type);
  }
  return el.isContentEditable;
}

/**
 * Daumenleiste der Detailseite (Anrufen | Antworten | Status), fest am
 * unteren Rand, darüber bei Bedarf der Kontakt- bzw. Rückgängig-
 * Streifen. Bei offener Tastatur ausgeblendet. Die Höhe der Streifen
 * steht in --strip-h (Seitenabstand im Layout).
 */
export function ThumbBar({
  lead,
  name,
  status,
  tel,
  canReply,
  v2,
  nowIso,
  slotDays,
  nextWorkdayIso,
  nextWorkdayLabel,
}: {
  lead: CardLead;
  name: string;
  status: LeadStatus;
  tel: string | null;
  canReply: boolean;
  v2: boolean;
  nowIso: string;
  slotDays: SlotDay[];
  nextWorkdayIso: string;
  nextWorkdayLabel: string;
}) {
  const [sheet, setSheet] = useState<Sheet>({ kind: "none" });
  const [strip, setStrip] = useState<StatusDone | null>(null);
  const [stripError, setStripError] = useState<string | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const pendingStrip = useRef<StatusDone | null>(null);
  /** key des offenen Status-Sheets, sonst null. */
  const statusOpen = useRef<number | null>(null);
  const counter = useRef(0);
  const stripsRef = useRef<HTMLDivElement>(null);
  const [undoing, startUndo] = useTransition();

  function openStatus(step: "status" | "outcome", done: StatusDone | null) {
    counter.current += 1;
    pendingStrip.current = done;
    statusOpen.current = counter.current;
    setSheet({ kind: "status", step, done, key: counter.current });
  }

  function openReply() {
    counter.current += 1;
    pendingStrip.current = null;
    statusOpen.current = null;
    setSheet({ kind: "reply", key: counter.current });
  }

  function showStrip(done: StatusDone) {
    setStrip(done);
    setStripError(null);
  }

  function closeSheet() {
    statusOpen.current = null;
    setSheet({ kind: "none" });
    // Rückmeldung erst nach dem Schließen zeigen, nie hinter dem Modal.
    if (pendingStrip.current) {
      showStrip(pendingStrip.current);
      pendingStrip.current = null;
    }
  }

  // Ereignisse aus anderen Teilen der Seite (Termin-Box, Ergebnis-Zeile).
  useEffect(() => {
    const onDone = (e: Event) => {
      const detail = (e as CustomEvent<StatusDone>).detail;
      if (detail.askOutcome) {
        counter.current += 1;
        pendingStrip.current = detail;
        statusOpen.current = counter.current;
        setSheet({ kind: "status", step: "outcome", done: detail, key: counter.current });
      } else {
        setStrip(detail);
        setStripError(null);
      }
    };
    const onOutcome = () => {
      counter.current += 1;
      pendingStrip.current = null;
      statusOpen.current = counter.current;
      setSheet({ kind: "status", step: "outcome", done: null, key: counter.current });
    };
    const onReply = () => {
      counter.current += 1;
      pendingStrip.current = null;
      statusOpen.current = null;
      setSheet({ kind: "reply", key: counter.current });
    };
    window.addEventListener(STATUS_DONE_EVENT, onDone);
    window.addEventListener(OPEN_OUTCOME_EVENT, onOutcome);
    window.addEventListener(OPEN_REPLY_EVENT, onReply);
    return () => {
      window.removeEventListener(STATUS_DONE_EVENT, onDone);
      window.removeEventListener(OPEN_OUTCOME_EVENT, onOutcome);
      window.removeEventListener(OPEN_REPLY_EVENT, onReply);
    };
  }, []);

  // Rückgängig-Streifen: 10 s, pausiert, solange die Seite verborgen ist.
  useEffect(() => {
    if (!strip || undoing) return;
    let left = UNDO_MS;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      left -= 250;
      if (left <= 0) {
        window.clearInterval(id);
        setStrip(null);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [strip, undoing]);

  // Tastatur: Leiste und Streifen ausblenden, solange ein Feld den Fokus hat.
  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (isTextField(e.target)) setKeyboard(true);
    };
    const onOut = () => {
      window.setTimeout(() => setKeyboard(isTextField(document.activeElement)), 50);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  // Höhe der Streifen für den Seitenabstand.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = stripsRef.current;
    if (!el) return;
    const set = () => root.style.setProperty("--strip-h", `${keyboard ? 0 : el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--strip-h");
    };
  }, [keyboard]);

  function undo() {
    const current = strip;
    if (!current) return;
    setStripError(null);
    startUndo(async () => {
      const res = await runAction(() => restoreLeadAction(lead.id, current.undo));
      if (!res.ok) {
        setStripError(res.error);
        return;
      }
      setStrip(null);
    });
  }

  const sheetKey = sheet.kind === "none" ? null : sheet.key;
  const item =
    "flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[13px] font-medium active:bg-background/10";

  return (
    <div
      data-thumb-bar=""
      className={cn("fixed inset-x-0 bottom-0 z-40", keyboard && "hidden")}
    >
      <div ref={stripsRef}>
        {strip ? (
          <div
            role="status"
            className="bg-card border-border mx-auto flex w-full max-w-2xl flex-wrap items-center gap-2 border-t px-4 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
          >
            <p className="min-w-0 flex-1 text-[15px] font-medium">{strip.label}</p>
            <button
              type="button"
              onClick={undo}
              disabled={undoing}
              className="inline-flex h-11 items-center gap-2 rounded-[3px] px-3 text-[15px] font-semibold underline underline-offset-4 disabled:opacity-60"
            >
              {undoing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {stripError ? "Nochmal" : "Rückgängig"}
            </button>
            {stripError ? (
              <p role="alert" className="w-full text-[14px] text-red-800">
                {stripError}
              </p>
            ) : null}
          </div>
        ) : null}
        <ContactPrompt
          currentLeadId={lead.id}
          v2={v2}
          nextWorkdayIso={nextWorkdayIso}
          nextWorkdayLabel={nextWorkdayLabel}
          onWriteMail={canReply ? openReply : undefined}
        />
      </div>

      <nav
        aria-label="Aktionen"
        className="bg-foreground text-background pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto flex max-w-2xl">
          {tel ? (
            <a
              href={tel}
              onClick={() => markContact({ leadId: lead.id, kanal: "anruf", name })}
              className={item}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Anrufen
            </a>
          ) : null}
          {canReply ? (
            <button type="button" onClick={openReply} className={cn(item, !tel && "flex-[2]")}>
              <Mail className="h-5 w-5" aria-hidden="true" />
              Antworten
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => openStatus("status", null)}
            className={item}
          >
            <ListChecks className="h-5 w-5" aria-hidden="true" />
            Status
          </button>
        </div>
      </nav>

      {sheet.kind === "status" ? (
        <StatusSheet
          key={sheet.key}
          open
          leadId={lead.id}
          status={status}
          initialStep={sheet.step}
          initialDone={sheet.done}
          onSaved={(done) => {
            // Sheet schon zu (während „Speichert …“ geschlossen)? Dann den
            // Streifen sofort zeigen, sonst nach dem Schließen.
            if (statusOpen.current === sheetKey) pendingStrip.current = done;
            else showStrip(done);
          }}
          onUndone={() => {
            pendingStrip.current = null;
          }}
          onClose={closeSheet}
        />
      ) : null}
      {sheet.kind === "reply" ? (
        <ReplySheet
          key={sheet.key}
          open
          lead={lead}
          name={name}
          nowIso={nowIso}
          slotDays={slotDays}
          onClose={closeSheet}
        />
      ) : null}
    </div>
  );
}
