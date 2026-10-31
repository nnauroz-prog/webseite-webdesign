"use client";

import { ChevronRight, Mail } from "lucide-react";
import { useState } from "react";

import type { CardLead } from "@/lib/admin/card-model";
import type { SlotPick } from "@/lib/admin/reply-templates";

import { BottomSheet } from "@/app/admin/anfragen/[id]/bottom-sheet";
import { markContact } from "@/app/admin/client-state";
import { mailtoHref } from "@/lib/admin/links";
import { templatesFor } from "@/lib/admin/reply-templates";
import { cn } from "@/lib/utils";

export type SlotDay = { dateIso: string; label: string; times: string[] };

/** Erste Inhaltszeile (nach der Anrede) als Vorschau. */
function previewOf(body: string): string {
  const parts = body.split("\n\n");
  return (parts[1] ?? parts[0] ?? "").split("\n")[0] ?? "";
}

/** Hinweis in der Fußzeile, solange noch Zeiten fehlen. */
function missingText(left: number): string {
  if (left <= 0) return "Zeiten gewählt";
  if (left === 1) return "Noch eine Zeit wählen";
  return `Noch ${left === 2 ? "zwei" : left} Zeiten wählen`;
}

/**
 * Antwort-Vorlagen: Jeder Eintrag öffnet die Mail-App fertig
 * formuliert (mailto, Versand aus dem eigenen Postfach). Für
 * „Telefonat vorschlagen“ und „Anderen Termin vorschlagen“ werden
 * vorher freie Zeiten gewählt, damit keine Platzhalter rausgehen.
 * Beim Tipp schließt das Sheet, damit „Mail gesendet?“ danach nicht
 * hinter dem Modal liegt.
 */
export function ReplySheet({
  open,
  lead,
  name,
  nowIso,
  slotDays,
  onClose,
}: {
  open: boolean;
  lead: CardLead;
  name: string;
  nowIso: string;
  slotDays: SlotDay[];
  onClose: () => void;
}) {
  const [picking, setPicking] = useState<string | null>(null);
  const [picks, setPicks] = useState<SlotPick[]>([]);

  const full = { ...lead, notes: lead.notes ?? "" };
  const now = new Date(nowIso);
  const plain = templatesFor(full, now);
  const withPicks = picks.length ? templatesFor(full, now, picks) : plain;

  function sent(templateId: string) {
    markContact({ leadId: lead.id, kanal: "mail", vorlage: templateId, name });
    onClose();
  }

  function toggle(dateIso: string, time: string, max: number) {
    setPicks((prev) => {
      const exists = prev.some((p) => p.dateIso === dateIso && p.time === time);
      if (exists) return prev.filter((p) => !(p.dateIso === dateIso && p.time === time));
      const next = [...prev, { dateIso, time }];
      return next.slice(-max);
    });
  }

  return (
    <BottomSheet open={open} onClose={onClose} titleId="reply-sheet-title" title="Antworten">
      <p className="text-muted-foreground text-[14px]">
        Öffnet dein Mail-Programm mit fertigem Text. Vor dem Senden kannst du alles ändern.
      </p>
      <ul className="mt-3 space-y-2">
        {plain.map((t) => {
          const filled = withPicks.find((x) => x.id === t.id) ?? t;
          const href = mailtoHref(lead.reply_to, t.subject, t.body);
          if (!href) return null;
          if (t.slots === 0) {
            return (
              <li key={t.id}>
                <a
                  href={href}
                  onClick={() => sent(t.id)}
                  className="border-border bg-background flex min-h-13 items-center gap-3 rounded-2xl border px-4 py-2.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium">{t.label}</span>
                    <span className="text-muted-foreground block truncate text-[13px]">
                      {previewOf(t.body)}
                    </span>
                  </span>
                  <Mail className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />
                </a>
              </li>
            );
          }
          const isOpen = picking === t.id;
          const needed = t.slots;
          const ready = isOpen && picks.length === needed;
          const pickedHref = ready ? mailtoHref(lead.reply_to, filled.subject, filled.body) : null;
          return (
            <li key={t.id} className="border-border bg-background rounded-2xl border">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  setPicking(isOpen ? null : t.id);
                  setPicks([]);
                }}
                className="flex min-h-13 w-full items-center gap-3 px-4 py-2.5 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-medium">{t.label}</span>
                  <span className="text-muted-foreground block text-[13px]">
                    {needed === 1 ? "Erst eine freie Zeit wählen" : "Erst zwei freie Zeiten wählen"}
                  </span>
                </span>
                <ChevronRight
                  className={cn("text-muted-foreground h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-90")}
                  aria-hidden="true"
                />
              </button>
              {isOpen ? (
                <div className="px-4">
                  <div className="space-y-3">
                    {slotDays.map((day) => (
                      <div key={day.dateIso}>
                        <p className="text-muted-foreground text-[13px]">{day.label}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {day.times.map((time) => {
                            const on = picks.some((p) => p.dateIso === day.dateIso && p.time === time);
                            return (
                              <button
                                key={time}
                                type="button"
                                aria-pressed={on}
                                onClick={() => toggle(day.dateIso, time, needed)}
                                className={cn(
                                  "inline-flex h-11 min-w-16 items-center justify-center rounded-full border px-3 text-[15px] tabular-nums",
                                  on
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-card",
                                )}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Fußzeile klebt am unteren Rand des Sheets: „Mail öffnen“
                      ist sofort sichtbar, auch bei vielen Tagen darüber. */}
                  <div className="bg-background border-border sticky bottom-0 -mx-4 mt-3 rounded-b-2xl border-t px-4 pt-2 pb-[env(safe-area-inset-bottom)]">
                    {pickedHref ? (
                      <a
                        href={pickedHref}
                        onClick={() => sent(t.id)}
                        className="bg-foreground text-background flex h-12 items-center justify-center gap-2 rounded-full text-[16px] font-medium"
                      >
                        <Mail className="h-5 w-5" aria-hidden="true" />
                        Mail öffnen
                      </a>
                    ) : (
                      <p
                        aria-live="polite"
                        className="border-border text-muted-foreground flex h-12 items-center justify-center rounded-full border border-dashed text-[15px]"
                      >
                        {missingText(needed - picks.length)}
                      </p>
                    )}
                    <a
                      href={href}
                      onClick={() => sent(t.id)}
                      className="text-muted-foreground flex h-11 items-center justify-center text-[14px] underline underline-offset-4"
                    >
                      Ohne feste Zeit öffnen
                    </a>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
