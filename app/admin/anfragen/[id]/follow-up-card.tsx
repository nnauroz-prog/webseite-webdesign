"use client";

import { CalendarClock, Loader2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import type { FollowUpChip, FollowUpView } from "@/lib/admin/follow-up";

import { setFollowUpAction } from "@/app/admin/actions";
import { runAction } from "@/app/admin/run-action";
import { PAST_DATE_ERROR } from "@/lib/admin/follow-up";
import { cn } from "@/lib/utils";

const CHIP =
  "border-border bg-background hover:border-foreground/40 inline-flex h-11 items-center justify-center rounded-[3px] border px-4 text-[15px] font-medium transition-colors disabled:opacity-50";
/** Zweizeiliger Datums-Knopf: „Nächster Werktag“ über „Mo 2.11.“. */
const DAY =
  "border-border bg-background hover:border-foreground/40 flex min-h-14 flex-col items-start justify-center rounded-[3px] border px-3 py-1.5 text-left transition-colors disabled:opacity-50";

/**
 * Wiedervorlage mit Ein-Tipp-Daten. Die Chips rechnet der Server
 * (Hamburger Zeit, Werktage), hier wird nur gespeichert.
 */
export function FollowUpCard({
  leadId,
  view,
  chips,
  todayIso,
  enabled,
}: {
  leadId: string;
  view: FollowUpView | null;
  chips: FollowUpChip[];
  todayIso: string;
  /** false ohne Datenbank-Update: nur ein Hinweis. */
  enabled: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<{ text: string; retry: (() => void) | null } | null>(
    null,
  );
  const [pending, start] = useTransition();
  const dateRef = useRef<HTMLInputElement>(null);

  function save(iso: string | null) {
    setError(null);
    const wasEditing = editing;
    start(async () => {
      const res = await runAction(() => setFollowUpAction(leadId, iso));
      if (!res.ok) {
        // Datum leeren, damit dieselbe Wahl wieder onChange auslöst.
        if (dateRef.current) dateRef.current.value = "";
        // Ein abgelehntes Datum wird durch „Nochmal“ nicht gültiger.
        const fixable = res.error !== PAST_DATE_ERROR && res.error !== "Ungültige Eingabe.";
        setError({ text: res.error, retry: fixable ? () => save(iso) : null });
        return;
      }
      // Nur bei echter Änderung (siehe render-kick.tsx zu hängenden
      // Transitionen).
      if (wasEditing) start(() => setEditing(false));
    });
  }

  const showChips = enabled && (!view || editing);

  return (
    <section
      aria-labelledby="wv-title"
      className={cn(
        "bg-card mt-4 rounded-[4px] border p-4",
        view?.due ? "border-gold border-2" : "border-border",
      )}
    >
      <div className="flex items-start gap-2">
        <CalendarClock className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id="wv-title" className="text-[16px] font-semibold">
            {view ? `Wiedervorlage ${view.day}` : "Wiedervorlage"}
          </h2>
          {view ? (
            <p className={cn("text-[14px]", view.due ? "font-medium" : "text-muted-foreground")}>
              {view.hint}
            </p>
          ) : enabled ? (
            <p className="text-muted-foreground text-[14px]">
              Wann willst du dich wieder darum kümmern?
            </p>
          ) : null}
        </div>
        {pending ? (
          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" aria-label="Speichert" />
        ) : null}
      </div>

      {!enabled ? (
        <p className="text-muted-foreground mt-2 text-[14px]">
          Geht nach dem Datenbank-Update (siehe Hinweis oben).
        </p>
      ) : null}

      {view && enabled && !editing ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={CHIP} disabled={pending} onClick={() => setEditing(true)}>
            Verschieben
          </button>
          <button type="button" className={CHIP} disabled={pending} onClick={() => save(null)}>
            Entfernen
          </button>
        </div>
      ) : null}

      {showChips ? (
        <fieldset disabled={pending} className="mt-3 grid grid-cols-2 gap-2">
          <legend className="sr-only">Wiedervorlage setzen</legend>
          {chips.map((c) => (
            <button
              key={c.iso}
              type="button"
              className={DAY}
              aria-label={c.label}
              onClick={() => save(c.iso)}
            >
              <span className="text-[15px] leading-tight font-medium">{c.name}</span>
              <span className="text-muted-foreground text-[13px] leading-tight">{c.day}</span>
            </button>
          ))}
          <label
            className={cn(
              DAY,
              "has-[:focus-visible]:outline-gold relative cursor-pointer has-[:disabled]:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
            )}
          >
            <span className="text-[15px] leading-tight font-medium">Anderes Datum</span>
            <span className="text-muted-foreground text-[13px] leading-tight">im Kalender wählen</span>
            <input
              type="date"
              min={todayIso}
              aria-label="Datum für die Wiedervorlage wählen"
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker?.();
                } catch {
                  // iOS öffnet den Picker ohnehin beim Tipp
                }
              }}
              ref={dateRef}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                // iOS-Safari hält sich nicht immer an min.
                if (value < todayIso) {
                  e.target.value = "";
                  setError({ text: PAST_DATE_ERROR, retry: null });
                  return;
                }
                save(value);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer text-base opacity-0"
            />
          </label>
          {editing ? (
            <button
              type="button"
              className={cn(CHIP, "text-muted-foreground h-auto min-h-14")}
              onClick={() => setEditing(false)}
            >
              Abbrechen
            </button>
          ) : null}
        </fieldset>
      ) : null}

      {error ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p role="alert" className="text-ink-olive text-[14px]">
            {error.text}
          </p>
          {error.retry ? (
            <button type="button" className={CHIP} disabled={pending} onClick={error.retry}>
              Nochmal
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
