"use client";

import { Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, useTransition } from "react";

import { appendNoteAction, updateNotesAction, type NotesState } from "@/app/admin/actions";
import { kickRender } from "@/app/admin/render-kick";
import { isRedirect, OFFLINE_ERROR, runAction } from "@/app/admin/run-action";
import { notesFingerprint } from "@/lib/admin/notes";
import { NOTE_MAX } from "@/lib/admin/validate";
import { cn } from "@/lib/utils";

// „Angebot geschickt“ entfällt: Angebote vermerken das Senden selbst
// im Verlauf (Abschnitt „Angebot“).
const QUICK = ["Rückruf vereinbart", "Mailbox, erneut anrufen"] as const;
const CHIP =
  "border-border bg-background hover:border-foreground/40 inline-flex min-h-11 items-center justify-center rounded-[3px] border px-3 py-1.5 text-center text-[15px] leading-tight font-medium transition-colors disabled:opacity-50";

/**
 * Notizen: Schnellnotiz (wächst mit, „Speichern“-Knopf, Kurz-Chips),
 * der Notizblock und „Alle Notizen bearbeiten“ mit Konfliktschutz.
 */
export function NotesPanel({ leadId, notes }: { leadId: string; notes: string }) {
  const [quick, setQuick] = useState("");
  const [error, setError] = useState<{ text: string; retry: () => void } | null>(null);
  const [pending, start] = useTransition();
  const [editorKey, setEditorKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [savedAll, setSavedAll] = useState(false);

  function append(text: string, fromField: boolean) {
    const clean = text.trim();
    if (!clean || pending) return;
    setError(null);
    start(async () => {
      const res = await runAction(() => appendNoteAction(leadId, clean));
      if (!res.ok) {
        setError({ text: res.error, retry: () => append(text, fromField) });
        return;
      }
      if (fromField) setQuick("");
    });
  }

  return (
    <section aria-labelledby="notes-title" className="border-border bg-card mt-4 rounded-[4px] border p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 id="notes-title" className="text-[16px] font-semibold">
          Notizen <span className="text-muted-foreground font-normal">(nur für dich)</span>
        </h2>
        {pending ? (
          <span role="status" className="text-muted-foreground inline-flex items-center gap-1.5 text-[13px]">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Speichert …
          </span>
        ) : null}
      </div>

      {editing ? null : (
        <form
          className="mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            append(quick, true);
          }}
        >
          <label htmlFor="quick-note" className="sr-only">
            Neue Notiz
          </label>
          <textarea
            id="quick-note"
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            data-dirty={quick.trim() ? "true" : undefined}
            rows={2}
            maxLength={NOTE_MAX}
            placeholder="Neue Notiz …"
            className="border-border bg-background focus:border-foreground/60 block max-h-48 min-h-[4.75rem] w-full resize-none rounded-[4px] border px-3.5 py-3 text-base leading-snug outline-none [field-sizing:content]"
          />
          {quick.trim() ? (
            // Mit Text: Speichern direkt unter dem Feld (auch bei offener
            // Tastatur erreichbar), die Kurz-Knöpfe treten zurück.
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="bg-foreground text-background inline-flex h-11 flex-1 items-center justify-center rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-60"
              >
                Notiz speichern
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => setQuick("")}
                className={CHIP}
              >
                Verwerfen
              </button>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-muted-foreground text-[13px]">Oder mit einem Tipp vermerken:</p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={cn(CHIP, "px-2 text-[14.5px]")}
                    disabled={pending}
                    onClick={() => append(q, false)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      )}
      {error ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p role="alert" className="text-ink-olive text-[14px]">
            {error.text}
          </p>
          <button type="button" className={CHIP} disabled={pending} onClick={error.retry}>
            Nochmal
          </button>
        </div>
      ) : null}

      {editing ? (
        <NotesEditor
          key={editorKey}
          leadId={leadId}
          notes={notes}
          onDone={(saved) => {
            setEditing(false);
            setSavedAll(saved);
          }}
        />
      ) : notes.trim() ? (
        <>
          <p className="border-border mt-4 border-t pt-3 text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            {notes}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="decoration-foreground/30 hover:decoration-foreground inline-flex h-11 items-center text-[15px] font-medium underline underline-offset-4"
              onClick={() => {
                setEditorKey((k) => k + 1);
                setEditing(true);
                setSavedAll(false);
              }}
            >
              Alle Notizen bearbeiten
            </button>
            {savedAll ? (
              <span role="status" className="text-ink-petrol text-[14px]">
                Gespeichert.
              </span>
            ) : null}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground border-border mt-4 border-t pt-3 text-[14px]">
          Noch keine Notizen.
        </p>
      )}
    </section>
  );
}

async function saveNotes(prev: NotesState, formData: FormData): Promise<NotesState> {
  try {
    const res = await updateNotesAction(prev, formData);
    kickRender();
    return res;
  } catch (err) {
    kickRender();
    if (isRedirect(err)) throw err;
    const draft = formData.get("notes");
    return { error: OFFLINE_ERROR, draft: typeof draft === "string" ? draft : "" };
  }
}

/**
 * Editor für alle Notizen. Text und Fingerabdruck werden beim Öffnen
 * eingefroren: Gesendet wird der Stand, den das Feld zeigte, nicht ein
 * späterer Prop (sonst überschriebe eine eigene Schnellnotiz still).
 */
function NotesEditor({
  leadId,
  notes,
  onDone,
}: {
  leadId: string;
  notes: string;
  onDone: (saved: boolean) => void;
}) {
  const [frozen] = useState(() => ({ text: notes, fp: notesFingerprint(notes) }));
  const [text, setText] = useState(frozen.text);
  const [copied, setCopied] = useState(false);
  const [state, action, pending] = useActionState<NotesState, FormData>(
    async (prev, formData) => {
      const res = await saveNotes(prev, formData);
      if (res.saved) onDone(true);
      return res;
    },
    {},
  );
  const changedElsewhere = notesFingerprint(notes) !== frozen.fp;
  const dirty = text !== frozen.text;

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (state.gone) {
    return (
      <div role="alert" className="mt-3 text-[15px]">
        <p className="font-semibold">Diese Anfrage gibt es nicht mehr.</p>
        <Link href="/admin" className="mt-2 inline-flex h-11 items-center underline underline-offset-4">
          Zur Übersicht
        </Link>
      </div>
    );
  }

  const conflict = state.conflict || changedElsewhere;

  return (
    <form action={action} className="mt-3 space-y-3" data-dirty={dirty ? "true" : undefined}>
      <input type="hidden" name="id" value={leadId} />
      <input type="hidden" name="fingerprint" value={frozen.fp} />
      <label htmlFor="all-notes" className="block text-[14px] font-medium">
        Alle Notizen bearbeiten
      </label>
      <textarea
        id="all-notes"
        name="notes"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        maxLength={5000}
        readOnly={Boolean(state.conflict)}
        className="border-border bg-background focus:border-foreground/60 block w-full rounded-[4px] border p-3 text-base leading-relaxed outline-none"
      />
      {conflict ? (
        <div role="alert" className="border-gold rounded-[4px] border-2 p-3 text-[15px] leading-relaxed">
          <p>
            Die Notizen wurden inzwischen an anderer Stelle geändert. Lade die Seite neu. Dein Text
            steht oben zum Kopieren.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(state.draft ?? text)}
              className={CHIP}
            >
              <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
              {copied ? "Kopiert" : "Kopieren"}
            </button>
            <button type="button" onClick={() => window.location.reload()} className={CHIP}>
              Neu laden
            </button>
          </div>
        </div>
      ) : null}
      {state.error ? (
        <p role="alert" className="text-[14px] text-ink-olive">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending || conflict}
          className={cn(
            "bg-foreground text-background inline-flex h-12 items-center rounded-[3px] px-6 text-[15px] font-medium disabled:opacity-50",
          )}
        >
          {pending ? "Speichert …" : state.error ? "Nochmal speichern" : "Notizen speichern"}
        </button>
        <button
          type="button"
          onClick={() => onDone(false)}
          disabled={pending}
          className="border-border hover:border-foreground/40 inline-flex h-12 items-center rounded-[3px] border px-5 text-[15px] font-medium transition-colors disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
