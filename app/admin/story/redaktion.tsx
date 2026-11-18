"use client";

import { Check, Circle, Loader2, RotateCcw, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { Fortschritt } from "@/lib/admin/studio-serie";
import type { Vorschlag } from "@/lib/admin/studio-vorschlaege";
import type { RedaktionSchritt } from "@/lib/redaktion/vertrag";
import type { StorySerie } from "@/lib/story-serie";

import { DUNKEL, HELL } from "@/app/admin/story/buehne";
import {
  fortschrittMit,
  fortschrittNeu,
  KEINE_VERBINDUNG,
  redaktionBeauftragen,
} from "@/lib/admin/studio-serie";
import {
  AUFTRAG_MAX,
  REDAKTION_SCHRITTE,
  SCHRITT_LABEL,
} from "@/lib/redaktion/vertrag";
import { cn } from "@/lib/utils";

/** Was die Redaktion liefert: die Serie, ihre Kennung und der Auftrag dazu. */
export type RedaktionErgebnis = {
  serie: StorySerie;
  /** Kennung in der Datenbank oder null, wenn nicht gespeichert. */
  id: string | null;
  auftrag: string;
};

/** Was unter dem Schritt steht, solange die Redaktion keinen Satz schickt. */
const STANDARD_HINWEIS: Record<RedaktionSchritt, string> = {
  idee: "Die Agenten suchen den Aufhänger.",
  text: "Die Agenten schreiben die Bilder.",
  lektorat: "Jeder Satz wird gegen die Regeln geprüft.",
  gestaltung: "Die Bilder werden gesetzt.",
};

/**
 * Die Karte ist ein div mit role="region", kein section-Element: An jedes
 * section in main hängt components/marketing/effekte.tsx data-sicht, und
 * React meldet das im Mitgliederbereich als Abweichung beim Hydrieren.
 */
const KARTE = "border-border bg-card rounded-[4px] border p-4";

/** „0:07“, „1:12“ */
function uhr(sekunden: number): string {
  return `${Math.floor(sekunden / 60)}:${String(sekunden % 60).padStart(2, "0")}`;
}

/**
 * Die Redaktion im Story-Studio: Hier bekommen die Agenten ihren Auftrag
 * („Story-Serie zu Black Friday“) und liefern eine Story-Serie.
 *
 * - Auftrag: freier Text, ein Vorschlag zum Antippen oder leer („Mach
 *   was zu heute“). Ein Tipp auf einen Vorschlag schickt ihn sofort ab.
 * - Während die Agenten arbeiten, zeigt die Karte die vier Schritte
 *   (Idee, Text, Lektorat, Gestaltung) mit dem Satz, den die Redaktion
 *   dazu schickt. Abbrechen beendet den Auftrag.
 * - Geht etwas schief, steht der Grund da, mit „Nochmal versuchen“. Der
 *   Text im Feld bleibt stehen.
 * - Die fertige Serie geht an onSerie (das Studio zeigt sie sofort).
 */
export function Redaktion({
  datum,
  heute,
  vorschlaege,
  onSerie,
}: {
  /** Kalendertag (yyyy-mm-dd), für den die Serie gedacht ist. */
  datum: string;
  /** true: datum ist heute (sonst ein kommender Tag). */
  heute: boolean;
  vorschlaege: Vorschlag[];
  onSerie: (ergebnis: RedaktionErgebnis) => void;
}) {
  const feldId = useId();
  const titelId = useId();
  const [text, setText] = useState("");
  const [lauf, setLauf] = useState<{
    auftrag: string;
    fortschritt: Fortschritt;
  } | null>(null);
  const [sekunden, setSekunden] = useState(0);
  const [fehler, setFehler] = useState<{
    text: string;
    auftrag: string;
  } | null>(null);
  const [notiz, setNotiz] = useState<string | null>(null);
  const abbruch = useRef<AbortController | null>(null);
  const kopf = useRef<HTMLHeadingElement | null>(null);
  /** Nach Start und Ende eines Auftrags die Überschrift der Karte ansteuern. */
  const fokusHolen = useRef(false);

  // Verlässt man das Studio, endet ein laufender Auftrag.
  useEffect(() => () => abbruch.current?.abort(), []);

  const laeuft = lauf !== null;
  useEffect(() => {
    if (!laeuft) return;
    const beginn = Date.now();
    const takt = window.setInterval(
      () => setSekunden(Math.floor((Date.now() - beginn) / 1000)),
      1000,
    );
    return () => window.clearInterval(takt);
  }, [laeuft]);

  // Die Karte wechselt zwischen Formular und Fortschritt: Der Knopf, der
  // den Fokus hatte, ist dann weg. Die Überschrift übernimmt ihn.
  useEffect(() => {
    if (!fokusHolen.current) return;
    fokusHolen.current = false;
    kopf.current?.focus({ preventScroll: true });
  }, [laeuft]);

  const starten = useCallback(
    async (auftrag: string) => {
      if (abbruch.current) return;
      setFehler(null);
      setNotiz(null);
      if (navigator.onLine === false) {
        setFehler({ text: KEINE_VERBINDUNG, auftrag });
        return;
      }
      const stopp = new AbortController();
      abbruch.current = stopp;
      fokusHolen.current = true;
      setSekunden(0);
      setLauf({ auftrag, fortschritt: fortschrittNeu() });
      const aus = await redaktionBeauftragen(
        { auftrag, datum },
        {
          signal: stopp.signal,
          aufSchritt: (e) =>
            setLauf((l) =>
              l ? { ...l, fortschritt: fortschrittMit(l.fortschritt, e) } : l,
            ),
        },
      );
      if (abbruch.current !== stopp) return;
      abbruch.current = null;
      fokusHolen.current = aus.art !== "serie";
      setLauf(null);
      if (aus.art === "abbruch") return setNotiz("Abgebrochen.");
      if (aus.art === "fehler") return setFehler({ text: aus.text, auftrag });
      setText("");
      onSerie({ serie: aus.serie, id: aus.id, auftrag });
    },
    [datum, onSerie],
  );

  const titel = (
    <h2
      id={titelId}
      ref={kopf}
      tabIndex={-1}
      className="flex items-center gap-2 text-[17px] font-semibold tracking-tight outline-none"
    >
      <Sparkles className="text-muted-foreground h-4 w-4" aria-hidden="true" />
      {lauf ? "Die Redaktion arbeitet" : "Redaktion"}
    </h2>
  );

  if (lauf) {
    const { fortschritt: f } = lauf;
    const hinweis = f.aktiv
      ? (f.hinweis ?? STANDARD_HINWEIS[f.aktiv])
      : "Der Auftrag ist unterwegs.";
    return (
      <div
        role="region"
        aria-labelledby={titelId}
        aria-busy="true"
        className={KARTE}
      >
        <div className="flex items-baseline justify-between gap-3">
          {titel}
          <span
            aria-hidden="true"
            className="text-muted-foreground text-[13px] tabular-nums"
          >
            {uhr(sekunden)}
          </span>
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-[14px] leading-5">
          {lauf.auftrag
            ? `Auftrag: „${lauf.auftrag}“`
            : heute
              ? "Auftrag: Mach was zu heute."
              : "Auftrag: Mach was zu diesem Tag."}
        </p>
        <ol className="mt-3">
          {REDAKTION_SCHRITTE.map((schritt) => {
            const stand = f.staende[schritt];
            return (
              <li
                key={schritt}
                aria-current={stand === "laeuft" ? "step" : undefined}
                className="flex h-8 items-center gap-2.5 text-[15px]"
              >
                {stand === "fertig" ? (
                  <Check
                    className="text-ink-petrol h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                ) : stand === "laeuft" ? (
                  <Loader2
                    className="h-4 w-4 shrink-0 motion-safe:animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className="text-border h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    stand === "laeuft" && "font-semibold",
                    stand === "wartet" && "text-muted-foreground",
                  )}
                >
                  {SCHRITT_LABEL[schritt]}
                </span>
                <span className="sr-only">
                  {stand === "fertig"
                    ? "fertig"
                    : stand === "laeuft"
                      ? "läuft"
                      : "wartet"}
                </span>
              </li>
            );
          })}
        </ol>
        <p
          aria-live="polite"
          className="text-muted-foreground mt-1 min-h-10 text-[14px] leading-5"
        >
          {f.aktiv ? (
            <span className="sr-only">{SCHRITT_LABEL[f.aktiv]}: </span>
          ) : null}
          {hinweis}
        </p>
        <button
          type="button"
          onClick={() => abbruch.current?.abort()}
          className={cn(HELL, "mt-2")}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Abbrechen
        </button>
      </div>
    );
  }

  const rest = AUFTRAG_MAX - text.length;
  return (
    <div role="region" aria-labelledby={titelId} className={KARTE}>
      {titel}
      <p className="text-muted-foreground mt-1 text-[14px] leading-5">
        Sag den Agenten, was sie machen sollen. Sie liefern eine Story-Serie:
        drei bis fünf Bilder, die zusammen eine kleine Geschichte erzählen.
      </p>
      <form
        className="mt-3 lg:max-w-3xl"
        onSubmit={(e) => {
          e.preventDefault();
          void starten(text.trim());
        }}
      >
        <label htmlFor={feldId} className="mb-1 block text-[14px] font-medium">
          Dein Auftrag
        </label>
        <textarea
          id={feldId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={AUFTRAG_MAX}
          rows={3}
          placeholder="z. B. Story-Serie zu Black Friday"
          className="border-border bg-card placeholder:text-muted-foreground focus:border-foreground/60 block w-full resize-y rounded-[4px] border px-3 py-2.5 text-base leading-snug outline-none"
        />
        {rest <= 80 ? (
          <p className="text-muted-foreground mt-1 text-[13px] tabular-nums">
            Noch {rest} Zeichen
          </p>
        ) : null}

        {fehler ? (
          <div role="alert" className="mt-3">
            <p className="text-ink-olive text-[14.5px] leading-5">
              {fehler.text}
            </p>
            <button
              type="button"
              onClick={() => void starten(fehler.auftrag)}
              className={cn(HELL, "mt-2")}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Nochmal versuchen
            </button>
          </div>
        ) : null}

        <button
          type="submit"
          className={cn(DUNKEL, "mt-3 h-12 w-full sm:w-auto sm:px-6")}
        >
          Serie erstellen
        </button>
        <p
          role="status"
          className="text-muted-foreground mt-1.5 min-h-5 text-[13px] leading-5"
        >
          {notiz ??
            (text.trim() === ""
              ? heute
                ? "Ohne Text machen die Agenten etwas zu heute."
                : "Ohne Text machen die Agenten etwas zu diesem Tag."
              : null)}
        </p>

        <p
          id={`${feldId}-tipp`}
          className="text-muted-foreground border-border mt-3 border-t pt-3 text-[13px] leading-5"
        >
          Oder tipp einen Vorschlag an, er geht gleich los:
        </p>
        <div
          role="group"
          aria-labelledby={`${feldId}-tipp`}
          className="mt-2 flex flex-wrap gap-2"
        >
          {vorschlaege.map((v) => (
            <button
              key={v.label}
              type="button"
              onClick={() => void starten(v.auftrag)}
              className="border-border bg-background hover:border-foreground/40 inline-flex h-11 max-w-full items-center rounded-[3px] border px-2.5 text-[14px] font-medium transition-colors"
            >
              <span className="truncate">{v.label}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

/**
 * Die Redaktion ohne Schlüssel: ein ruhiger Hinweis statt des Formulars.
 * Die Serie des Tages kommt trotzdem jeden Morgen.
 */
export function RedaktionOhneSchluessel() {
  const titelId = useId();
  return (
    <div role="region" aria-labelledby={titelId} className={KARTE}>
      <h2
        id={titelId}
        className="flex items-center gap-2 text-[17px] font-semibold tracking-tight"
      >
        <Sparkles
          className="text-muted-foreground h-4 w-4"
          aria-hidden="true"
        />
        Redaktion
      </h2>
      <p className="mt-1 text-[15px] leading-6">
        Hier gibst du den Agenten Aufträge, zum Beispiel „Story-Serie zu Black
        Friday“. Dafür brauchen sie einmal einen Schlüssel.
      </p>
      <p className="text-muted-foreground mt-2 text-[14px] leading-5">
        Einmal einrichten: API-Schlüssel in Vercel hinterlegen. Die Anleitung
        steht in{" "}
        <span className="text-foreground font-medium break-words">
          docs/vercel-einrichtung.md
        </span>
        .
      </p>
      <p className="text-muted-foreground mt-2 text-[14px] leading-5">
        Die Story-Serie des Tages kommt auch ohne Schlüssel jeden Morgen.
      </p>
    </div>
  );
}

/** Für vergangene Tage nimmt die Redaktion keine Aufträge an. */
export function RedaktionVergangen() {
  const titelId = useId();
  return (
    <div role="region" aria-labelledby={titelId} className={KARTE}>
      <h2
        id={titelId}
        className="flex items-center gap-2 text-[17px] font-semibold tracking-tight"
      >
        <Sparkles
          className="text-muted-foreground h-4 w-4"
          aria-hidden="true"
        />
        Redaktion
      </h2>
      <p className="text-muted-foreground mt-1 text-[14px] leading-5">
        Aufträge nehmen die Agenten für heute und kommende Tage an. Dieser Tag
        ist vorbei.
      </p>
    </div>
  );
}
