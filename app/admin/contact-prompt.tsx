"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";

import type { ContactMark } from "@/app/admin/client-state";
import type { LeadSnapshot, LostReason } from "@/lib/leads-meta";

import {
  logContactAction,
  restoreLeadAction,
  setFollowUpAction,
  setOutcomeAction,
} from "@/app/admin/actions";
import { noteHidden, takeContact } from "@/app/admin/client-state";
import { runAction } from "@/app/admin/run-action";
import { LOST_REASON_LABELS, LOST_REASONS, STATUS_LABELS } from "@/lib/leads-meta";
import { cn } from "@/lib/utils";

type Phase =
  | { kind: "ask" }
  | { kind: "followup" }
  | { kind: "reason"; undo?: LeadSnapshot }
  | { kind: "done"; text: string; undo?: LeadSnapshot };

const DONE_MS = 10_000;

/**
 * Kontakt-Rückfrage nach „Anrufen“ oder einer Mail-Vorlage:
 * „Erreicht?“ [Erreicht] [Mailbox] [Nicht erreicht] bzw.
 * „Mail gesendet?“ [Ja] [Nein], rechts immer ein ✕.
 *
 * Erscheint nur, wenn die Seite nach dem Tipp wirklich mindestens 5 s
 * verborgen war (sonst wurde z. B. „Anrufen?“ abgebrochen), und nur
 * einmal je Vormerkung.
 *
 * `standalone`: eigener Streifen am unteren Rand (Startseite). Sonst
 * rendert die Daumenleiste den Inhalt über sich.
 */
export function ContactPrompt({
  currentLeadId,
  v2,
  nextWorkdayIso,
  nextWorkdayLabel,
  onWriteMail,
  standalone = false,
}: {
  currentLeadId?: string;
  v2: boolean;
  nextWorkdayIso: string;
  nextWorkdayLabel: string;
  onWriteMail?: () => void;
  standalone?: boolean;
}) {
  const [mark, setMark] = useState<ContactMark | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "ask" });
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState<(() => void) | null>(null);
  const [pending, start] = useTransition();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      if (document.visibilityState !== "visible") return;
      const m = takeContact(Date.now());
      if (m) {
        setMark(m);
        setPhase({ kind: "ask" });
        setError(null);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") noteHidden(Date.now());
      else check();
    };
    const onHide = () => noteHidden(Date.now());
    check();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", check);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", check);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  // Bestätigung nach 10 s ausblenden (pausiert, solange verborgen).
  useEffect(() => {
    if (phase.kind !== "done") return;
    let left = DONE_MS;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      left -= 250;
      if (left <= 0) {
        window.clearInterval(id);
        setMark(null);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  // Höhe für den Seitenabstand (--strip-h), nur im eigenen Streifen.
  useLayoutEffect(() => {
    if (!standalone) return;
    const root = document.documentElement;
    const el = boxRef.current;
    if (!el) {
      root.style.removeProperty("--strip-h");
      return;
    }
    const set = () => root.style.setProperty("--strip-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--strip-h");
    };
  }, [standalone, mark]);

  if (!mark) return null;
  const m = mark;
  const otherLead = currentLeadId !== undefined && m.leadId !== currentLeadId;
  const who = m.name && (standalone || otherLead) ? ` (${m.name})` : "";

  function close() {
    setMark(null);
    setError(null);
  }

  function run(task: () => Promise<void>) {
    setError(null);
    start(async () => {
      await task();
    });
  }

  function fail(message: string, again: () => void) {
    setError(message);
    setRetry(() => again);
  }

  function answer(ergebnis: "erreicht" | "mailbox" | "nicht_erreicht" | "gesendet") {
    const again = () => answer(ergebnis);
    run(async () => {
      const res = await runAction(() =>
        logContactAction(m.leadId, m.kanal, ergebnis, m.vorlage),
      );
      if (!res.ok) return fail(res.error, again);
      if (res.askReason) {
        setPhase({ kind: "reason", undo: res.undo });
      } else if (ergebnis === "mailbox" || ergebnis === "nicht_erreicht") {
        setPhase({ kind: "followup" });
      } else {
        setPhase({
          kind: "done",
          text: res.statusChanged
            ? `Gespeichert, auf ${STATUS_LABELS[res.newStatus]} gesetzt.`
            : res.asNote
              ? "Als Notiz gespeichert."
              : "Gespeichert.",
          undo: res.statusChanged ? res.undo : undefined,
        });
      }
    });
  }

  function undo(snapshot: LeadSnapshot) {
    const again = () => undo(snapshot);
    run(async () => {
      const res = await runAction(() => restoreLeadAction(m.leadId, snapshot));
      if (!res.ok) return fail(res.error, again);
      setPhase({ kind: "done", text: "Rückgängig gemacht." });
    });
  }

  function reason(r: LostReason) {
    const again = () => reason(r);
    run(async () => {
      const res = await runAction(() => setOutcomeAction(m.leadId, "verloren", r));
      if (!res.ok) return fail(res.error, again);
      setPhase({ kind: "done", text: `Kein Auftrag (${LOST_REASON_LABELS[r]}) gespeichert.` });
    });
  }

  function followUp() {
    const again = () => followUp();
    run(async () => {
      const res = await runAction(() => setFollowUpAction(m.leadId, nextWorkdayIso));
      if (!res.ok) return fail(res.error, again);
      setPhase({ kind: "done", text: `Wiedervorlage ${nextWorkdayLabel} gesetzt.` });
    });
  }

  const btn =
    "inline-flex h-11 items-center justify-center rounded-full px-4 text-[15px] font-medium disabled:opacity-60";
  const primary = cn(btn, "bg-foreground text-background");
  const secondary = cn(btn, "border-border bg-background border");

  let title: string;
  let buttons: React.ReactNode;
  if (phase.kind === "ask") {
    title = m.kanal === "anruf" ? `Erreicht?${who}` : `Mail gesendet?${who}`;
    buttons =
      m.kanal === "anruf" ? (
        <>
          <button type="button" className={primary} onClick={() => answer("erreicht")}>
            Erreicht
          </button>
          <button type="button" className={secondary} onClick={() => answer("mailbox")}>
            Mailbox
          </button>
          <button type="button" className={secondary} onClick={() => answer("nicht_erreicht")}>
            Nicht erreicht
          </button>
        </>
      ) : (
        <>
          <button type="button" className={primary} onClick={() => answer("gesendet")}>
            Ja
          </button>
          <button type="button" className={secondary} onClick={close}>
            Nein
          </button>
        </>
      );
  } else if (phase.kind === "followup") {
    const canMail = Boolean(onWriteMail) && !otherLead;
    // Auf derselben Anfrage würde „Zur Anfrage“ nur neu laden.
    const showLink = !canMail && (otherLead || currentLeadId === undefined);
    title =
      canMail || showLink || v2
        ? `Versuch vermerkt${who}. Wie weiter?`
        : `Versuch vermerkt${who}.`;
    buttons = (
      <>
        {canMail && onWriteMail ? (
          <button
            type="button"
            className={secondary}
            onClick={() => {
              close();
              onWriteMail();
            }}
          >
            Stattdessen Mail schreiben
          </button>
        ) : showLink ? (
          <Link href={`/admin/anfragen/${m.leadId}`} className={secondary} onClick={close}>
            Zur Anfrage
          </Link>
        ) : null}
        {v2 ? (
          <button type="button" className={secondary} onClick={followUp}>
            Wiedervorlage {nextWorkdayLabel}
          </button>
        ) : null}
      </>
    );
  } else if (phase.kind === "reason") {
    const snapshot = phase.undo;
    title = "Absage vermerkt: Erledigt, kein Auftrag. Grund?";
    buttons = (
      <>
        {LOST_REASONS.map((r) => (
          <button key={r} type="button" className={secondary} onClick={() => reason(r)}>
            {LOST_REASON_LABELS[r]}
          </button>
        ))}
        {snapshot ? (
          <button type="button" className={secondary} onClick={() => undo(snapshot)}>
            Rückgängig
          </button>
        ) : null}
      </>
    );
  } else {
    const snapshot = phase.undo;
    title = phase.text;
    buttons = snapshot ? (
      <button type="button" className={secondary} onClick={() => undo(snapshot)}>
        Rückgängig
      </button>
    ) : null;
  }

  const content = (
    <div
      role="status"
      aria-live="polite"
      className="bg-card border-border mx-auto w-full max-w-2xl border-t px-4 pt-3 pb-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 py-2.5 text-[15px] font-semibold">
          {title}
          {pending ? (
            <Loader2 className="ml-2 inline h-4 w-4 animate-spin" aria-label="Speichert" />
          ) : null}
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Schließen"
          className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {error ? (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p role="alert" className="text-[14px] text-red-800">
            {error}
          </p>
          {retry ? (
            <button
              type="button"
              className={secondary}
              disabled={pending}
              onClick={() => retry()}
            >
              Nochmal
            </button>
          ) : null}
        </div>
      ) : null}
      {buttons ? (
        <fieldset disabled={pending} className="mt-1 flex flex-wrap gap-2">
          {buttons}
        </fieldset>
      ) : null}
    </div>
  );

  if (!standalone) return content;
  return (
    <div
      ref={boxRef}
      className="bg-card fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]"
    >
      {content}
    </div>
  );
}
