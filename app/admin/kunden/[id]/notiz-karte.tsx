"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { setProjektNotizAction } from "@/app/admin/projekt-actions";
import { runAction } from "@/app/admin/run-action";
import { PROJEKT_NOTIZ_MAX } from "@/lib/admin/projekte";

/**
 * Kurze interne Notiz zum Projekt (z. B. „Fotos kommen Freitag“).
 * Ungespeicherter Text markiert die Seite als data-dirty, damit sie
 * sich nach der Rückkehr aus dem Hintergrund nicht neu aufbaut.
 */
export function NotizKarte({
  angebotId,
  notiz,
  enabled,
}: {
  angebotId: string;
  notiz: string;
  enabled: boolean;
}) {
  const [text, setText] = useState(notiz);
  const [pending, start] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [gespeichert, setGespeichert] = useState(false);
  const dirty = text.trim() !== notiz.trim();

  useEffect(() => {
    if (!gespeichert) return;
    const t = window.setTimeout(() => setGespeichert(false), 8000);
    return () => window.clearTimeout(t);
  }, [gespeichert]);

  function speichern() {
    setFehler(null);
    setGespeichert(false);
    start(async () => {
      const res = await runAction(() => setProjektNotizAction(angebotId, text));
      if (!res.ok) return setFehler(res.error);
      setGespeichert(true);
    });
  }

  return (
    <section
      aria-labelledby="notiz-title"
      className="border-border bg-card mt-4 rounded-[4px] border p-4"
      data-dirty={dirty ? "true" : undefined}
    >
      <h2 id="notiz-title" className="text-[16px] font-semibold">
        Notiz
      </h2>
      <label htmlFor="projekt-notiz" className="sr-only">
        Notiz zum Projekt
      </label>
      <textarea
        id="projekt-notiz"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setGespeichert(false);
        }}
        disabled={!enabled}
        maxLength={PROJEKT_NOTIZ_MAX}
        rows={3}
        placeholder={
          enabled
            ? "Zum Beispiel: Fotos kommen Freitag, Logo fehlt noch."
            : "Geht nach dem Datenbank-Update."
        }
        className="border-border bg-background placeholder:text-muted-foreground mt-2 block w-full resize-y rounded-[3px] border px-3 py-2 text-base leading-snug disabled:opacity-60"
      />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={speichern}
          disabled={!enabled || !dirty || pending}
          className="bg-foreground text-background inline-flex h-11 items-center justify-center gap-2 rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          Notiz speichern
        </button>
        <span className="text-muted-foreground text-[13px] tabular-nums">
          {text.length} / {PROJEKT_NOTIZ_MAX}
        </span>
        {gespeichert ? (
          <p
            role="status"
            className="text-ink-petrol text-[14.5px] font-medium"
          >
            Gespeichert.
          </p>
        ) : null}
      </div>
      {fehler ? (
        <p role="alert" className="text-ink-olive mt-2 text-[14px]">
          {fehler}
        </p>
      ) : null}
    </section>
  );
}
