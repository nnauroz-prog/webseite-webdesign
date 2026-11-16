"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import {
  setPflegeBisAction,
  setPflegeSeitAction,
} from "@/app/admin/projekt-actions";
import { runAction } from "@/app/admin/run-action";
import { formatDatum, formatEuro } from "@/lib/admin/angebote";
import { cn } from "@/lib/utils";

const CHIP =
  "border-border bg-background hover:border-foreground/40 inline-flex h-11 items-center justify-center rounded-[3px] border px-3 text-[14px] font-medium transition-colors disabled:opacity-50";

const QUELLE_TEXT = {
  gespeichert: null,
  livegang: "ab Livegang",
  annahme: "ab Annahme",
} as const;

type Meldung =
  | { art: "ok"; text: string }
  | { art: "fehler"; text: string; nochmal: (() => void) | null };

/**
 * Monatliche Pflege eines Kunden: Betrag, Beginn (änderbar) und
 * „Pflege beendet“ (heute oder ein gewähltes Datum). Beendete Pflege
 * lässt sich wieder aufnehmen.
 */
export function PflegeKarte({
  angebotId,
  monatlich,
  seit,
  seitQuelle,
  bis,
  aktiv,
  heute,
  enabled,
}: {
  angebotId: string;
  /** Cent brutto */
  monatlich: number;
  seit: string | null;
  /** Woher der Beginn kommt, solange keiner gespeichert ist. */
  seitQuelle: keyof typeof QUELLE_TEXT;
  bis: string | null;
  aktiv: boolean;
  heute: string;
  enabled: boolean;
}) {
  const [pending, start] = useTransition();
  const [meldung, setMeldung] = useState<Meldung | null>(null);

  useEffect(() => {
    if (meldung?.art !== "ok") return;
    const t = window.setTimeout(() => setMeldung(null), 8000);
    return () => window.clearTimeout(t);
  }, [meldung]);

  function speichern(
    feld: "seit" | "bis",
    datum: string | null,
    erfolg: string,
  ) {
    setMeldung(null);
    start(async () => {
      const res = await runAction(() =>
        feld === "seit"
          ? setPflegeSeitAction(angebotId, datum)
          : setPflegeBisAction(angebotId, datum),
      );
      if (!res.ok) {
        const behebbar =
          res.error !== "Ungültige Eingabe." && !res.error.startsWith("Das ");
        setMeldung({
          art: "fehler",
          text: res.error,
          nochmal: behebbar ? () => speichern(feld, datum, erfolg) : null,
        });
        return;
      }
      setMeldung({ art: "ok", text: erfolg });
    });
  }

  const quelle = QUELLE_TEXT[seitQuelle];

  return (
    <section
      aria-labelledby="pflege-title"
      className="border-border bg-card mt-4 rounded-[4px] border p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="pflege-title" className="text-[16px] font-semibold">
          Pflege
        </h2>
        <span
          className={cn(
            "rounded-[3px] px-2 py-0.5 text-[12.5px] font-medium",
            aktiv
              ? "bg-ink-petrol/15 text-ink-petrol"
              : "border-border text-muted-foreground border",
          )}
        >
          {aktiv ? (bis ? "läuft noch" : "läuft") : "beendet"}
        </span>
      </div>
      <p className="mt-1 text-[24px] leading-tight font-semibold tracking-tight tabular-nums">
        {formatEuro(monatlich)}
        <span className="text-muted-foreground text-[14px] font-normal tracking-normal">
          {" "}
          im Monat
        </span>
      </p>

      <dl className="divide-border border-border mt-3 divide-y border-t">
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0">
            <dt className="text-muted-foreground text-[13px]">Seit</dt>
            <dd className="text-[16px] tabular-nums">
              {seit ? formatDatum(seit) : "offen"}
              {seit && quelle ? (
                <span className="text-muted-foreground text-[13px]">
                  {" "}
                  ({quelle})
                </span>
              ) : null}
            </dd>
          </div>
          {enabled ? (
            <DatumChip
              label="Ändern"
              aria={"Beginn der Pflege ändern"}
              wert={seit}
              max={bis ?? undefined}
              disabled={pending}
              onWahl={(v) =>
                speichern("seit", v, `Pflege seit ${formatDatum(v)}.`)
              }
            />
          ) : null}
        </div>
        {bis ? (
          <div className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <dt className="text-muted-foreground text-[13px]">
                {aktiv ? "Endet am" : "Beendet am"}
              </dt>
              <dd className="text-[16px] tabular-nums">{formatDatum(bis)}</dd>
            </div>
            {enabled ? (
              <DatumChip
                label="Ändern"
                aria="Ende der Pflege ändern"
                wert={bis}
                min={seit ?? undefined}
                disabled={pending}
                onWahl={(v) =>
                  speichern("bis", v, `Pflege endet am ${formatDatum(v)}.`)
                }
              />
            ) : null}
          </div>
        ) : null}
      </dl>

      {enabled ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {bis ? (
            <button
              type="button"
              className={CHIP}
              disabled={pending}
              onClick={() =>
                speichern(
                  "bis",
                  null,
                  aktiv ? "Ende entfernt." : "Pflege läuft wieder.",
                )
              }
            >
              {aktiv ? "Ende entfernen" : "Wieder aufnehmen"}
            </button>
          ) : (
            <>
              <button
                type="button"
                className={CHIP}
                disabled={pending}
                onClick={() => speichern("bis", heute, "Pflege beendet.")}
              >
                Pflege beendet
              </button>
              <DatumChip
                label="Enddatum wählen"
                aria="Letzten Tag der Pflege wählen"
                wert={null}
                min={seit ?? undefined}
                disabled={pending}
                onWahl={(v) =>
                  speichern("bis", v, `Pflege endet am ${formatDatum(v)}.`)
                }
              />
            </>
          )}
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Speichert" />
          ) : null}
        </div>
      ) : (
        <p className="text-muted-foreground mt-3 text-[14px]">
          Ändern geht nach dem Datenbank-Update (siehe Hinweis oben).
        </p>
      )}

      {meldung?.art === "ok" ? (
        <p
          role="status"
          className="text-ink-petrol mt-2 text-[14.5px] font-medium"
        >
          {meldung.text}
        </p>
      ) : meldung?.art === "fehler" ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p role="alert" className="text-ink-olive text-[14px]">
            {meldung.text}
          </p>
          {meldung.nochmal ? (
            <button
              type="button"
              className={CHIP}
              disabled={pending}
              onClick={meldung.nochmal}
            >
              Nochmal
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

/** Knopf mit unsichtbarem Datumsfeld darüber (öffnet den Kalender). */
function DatumChip({
  label,
  aria,
  wert,
  min,
  max,
  disabled,
  onWahl,
}: {
  label: string;
  aria: string;
  wert: string | null;
  min?: string;
  max?: string;
  disabled: boolean;
  onWahl: (iso: string) => void;
}) {
  return (
    <label
      className={cn(
        CHIP,
        "has-[:focus-visible]:outline-gold relative shrink-0 cursor-pointer has-[:disabled]:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
      )}
    >
      {label}
      <input
        key={wert ?? "leer"}
        type="date"
        defaultValue={wert ?? ""}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={aria}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker?.();
          } catch {
            // iOS öffnet den Picker ohnehin beim Tipp
          }
        }}
        onChange={(e) => {
          const v = e.target.value;
          if (!v || v === wert) return;
          onWahl(v);
        }}
        // -inset-px: deckt auch den Rand (ganze 44 px Tippfläche).
        className="absolute -inset-px cursor-pointer text-base opacity-0"
      />
    </label>
  );
}
