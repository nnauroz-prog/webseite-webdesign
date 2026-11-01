"use client";

import { Loader2, Search, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import { searchLeadsAction, type SearchState } from "@/app/admin/actions";
import {
  recallSearch,
  rememberSearch,
  SEARCH_RESET_EVENT,
} from "@/app/admin/client-state";
import { LeadCard } from "@/app/admin/lead-card";
import { isRedirect } from "@/app/admin/run-action";
import { cardModel } from "@/lib/admin/card-model";

const EMPTY: SearchState = { q: "", hits: [], more: false, truncated: false };
const SEARCH_OFFLINE = "Keine Verbindung. Bitte nochmal suchen.";

/** Langer Begriff in der Überschrift gekürzt (das Feld zeigt ihn ganz). */
function shortQuery(q: string): string {
  return q.length > 40 ? `${q.slice(0, 39)}…` : q;
}

async function search(prev: SearchState, formData: FormData): Promise<SearchState> {
  const q = String(formData.get("q") ?? "").trim();
  rememberSearch(q, Date.now());
  if (!q) return EMPTY;
  try {
    return await searchLeadsAction(prev, formData);
  } catch (err) {
    if (isRedirect(err)) throw err;
    return { ...EMPTY, q, error: SEARCH_OFFLINE };
  }
}

/**
 * Suche über alle Anfragen (auch Archiv), per POST: Adressen und
 * Nummern landen nicht in URL, Verlauf oder Logs. Der letzte Begriff
 * steht in sessionStorage und wird nur nach „‹ Zurück“ (bzw. der
 * Zurück-Geste) und höchstens 10 Min lang erneut gesucht. Nach mehr als
 * 10 Min im Hintergrund wird eine offene Suche geschlossen.
 * Bei aktiver Suche ersetzen die Treffer alles darunter (children).
 */
export function LeadSearch({
  nowIso,
  children,
}: {
  nowIso: string;
  children: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(search, EMPTY);
  const [dismissed, setDismissed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Nach „‹ Zurück“ die letzte Suche wiederholen, sonst vergessen.
  // setTimeout: Next rendert die Seite bei „Zurück“ synchron in seinem
  // popstate-Handler; erst danach ist der popstate auch bei uns vermerkt.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const q = recallSearch(Date.now());
      if (q && inputRef.current && formRef.current) {
        inputRef.current.value = q;
        formRef.current.requestSubmit();
      } else {
        rememberSearch("", Date.now());
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Lange im Hintergrund oder Kopf-Link: Suche schließen, damit
  // „Jetzt melden“ wieder sichtbar ist.
  useEffect(() => {
    const onReset = (e: Event) => {
      const input = inputRef.current;
      if (!input?.value) return;
      // Kopf-Link immer; nach dem Hintergrund nicht mitten im Tippen.
      const fromHeader = e instanceof CustomEvent && e.detail === "kopf";
      if (!fromHeader && document.activeElement === input) return;
      rememberSearch("", Date.now());
      input.value = "";
      setDismissed(true);
    };
    window.addEventListener(SEARCH_RESET_EVENT, onReset);
    return () => window.removeEventListener(SEARCH_RESET_EVENT, onReset);
  }, []);

  // Schließen ohne Server-Aufruf: ein einfacher State-Wechsel. Eine
  // Action parallel zur Navigation des Kopf-Links blieb sonst manchmal
  // hängen (Knopf dreht endlos).
  function clear() {
    rememberSearch("", Date.now());
    if (inputRef.current) inputRef.current.value = "";
    setDismissed(true);
  }

  const active = !dismissed && (state.q !== "" || Boolean(state.error));
  const now = new Date(nowIso);

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={() => setDismissed(false)}
        role="search"
        className="mt-3 flex gap-2"
      >
        <label htmlFor="admin-suche" className="sr-only">
          Anfragen durchsuchen
        </label>
        <div className="relative min-w-0 flex-1">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="admin-suche"
            name="q"
            type="search"
            defaultValue={state.q}
            placeholder="Name, E-Mail, Nummer"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={100}
            className="border-border bg-card focus:border-foreground/50 h-12 w-full rounded-[3px] border pr-4 pl-11 text-base outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="bg-foreground text-background inline-flex h-12 shrink-0 items-center justify-center rounded-[3px] px-5 text-[15px] font-medium disabled:opacity-70"
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-label="Sucht" />
          ) : (
            "Suchen"
          )}
        </button>
      </form>

      {active ? (
        <section aria-label="Suchergebnis" className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              className="min-w-0 flex-1 text-[17px] font-semibold tracking-tight [overflow-wrap:anywhere]"
              aria-live="polite"
            >
              {state.error
                ? "Suche fehlgeschlagen"
                : state.hits.length === 0
                  ? `Keine Treffer für „${shortQuery(state.q)}“.`
                  : `${state.hits.length}${state.more ? "+" : ""} Treffer für „${shortQuery(state.q)}“`}
            </h2>
            <button
              type="button"
              onClick={clear}
              className="border-border inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[3px] border px-4 text-[14px] font-medium"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Suche löschen
            </button>
          </div>
          {state.error ? (
            <p role="alert" className="mt-2 text-[15px] text-red-800">
              {state.error}
            </p>
          ) : null}
          {state.hits.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {state.hits.map((hit) => (
                <li key={hit.id}>
                  <LeadCard card={cardModel(hit, now)} />
                </li>
              ))}
            </ul>
          ) : null}
          {state.more ? (
            <p className="text-muted-foreground mt-3 text-[13px]">
              Gezeigt werden die ersten 30 Treffer. Mit einem genaueren Begriff
              findest du den Rest.
            </p>
          ) : null}
          {state.truncated ? (
            <p className="text-muted-foreground mt-2 text-[13px]">
              Durchsucht wurden die neuesten 500 Anfragen.
            </p>
          ) : null}
        </section>
      ) : (
        children
      )}
    </>
  );
}
