"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import type { ProjektSchritt, Schritte } from "@/lib/admin/projekte";

import { FortschrittBalken } from "@/app/admin/kunden/fortschritt-balken";
import { setProjektSchrittAction } from "@/app/admin/projekt-actions";
import { runAction } from "@/app/admin/run-action";
import { formatDatum } from "@/lib/admin/angebote";
import {
  fortschritt,
  fortschrittText,
  PROJEKT_SCHRITTE,
  SCHRITT_HINWEISE,
  SCHRITT_LABELS,
} from "@/lib/admin/projekte";
import { cn } from "@/lib/utils";

const CHIP =
  "border-border bg-background hover:border-foreground/40 inline-flex h-11 items-center justify-center rounded-[3px] border px-3 text-[14px] font-medium transition-colors disabled:opacity-50";

type Meldung =
  | { art: "ok"; text: string; rueckgaengig?: () => void }
  | { art: "fehler"; text: string; nochmal: (() => void) | null };

/**
 * Die fünf Schritte eines Projekts. Antippen hakt mit dem heutigen Tag
 * ab, bei erledigten lässt sich das Datum ändern; nochmal Antippen
 * öffnet den Schritt wieder (mit „Rückgängig“).
 */
export function SchritteKarte({
  angebotId,
  schritte,
  heute,
  enabled,
}: {
  angebotId: string;
  schritte: Schritte;
  /** yyyy-mm-dd (Hamburg) */
  heute: string;
  /** false ohne Datenbank-Update: nur ansehen. */
  enabled: boolean;
}) {
  const [pending, start] = useTransition();
  const [aktiv, setAktiv] = useState<ProjektSchritt | null>(null);
  const [meldung, setMeldung] = useState<Meldung | null>(null);
  const f = fortschritt(schritte);

  // Erfolgsmeldungen räumen sich nach 8 s selbst weg.
  useEffect(() => {
    if (meldung?.art !== "ok") return;
    const t = window.setTimeout(() => setMeldung(null), 8000);
    return () => window.clearTimeout(t);
  }, [meldung]);

  function speichern(
    schritt: ProjektSchritt,
    datum: string | null,
    erfolg: Meldung | null,
  ) {
    setMeldung(null);
    setAktiv(schritt);
    start(async () => {
      const res = await runAction(() =>
        setProjektSchrittAction(angebotId, schritt, datum),
      );
      setAktiv(null);
      if (!res.ok) {
        const behebbar = res.error !== "Ungültige Eingabe.";
        setMeldung({
          art: "fehler",
          text: res.error,
          nochmal: behebbar ? () => speichern(schritt, datum, erfolg) : null,
        });
        return;
      }
      setMeldung(erfolg);
    });
  }

  function umschalten(schritt: ProjektSchritt) {
    const vorher = schritte[schritt];
    const label = SCHRITT_LABELS[schritt];
    if (vorher) {
      speichern(schritt, null, {
        art: "ok",
        text: `${label} wieder offen.`,
        rueckgaengig: () => speichern(schritt, vorher, null),
      });
    } else {
      speichern(schritt, heute, { art: "ok", text: `${label} erledigt.` });
    }
  }

  return (
    <section
      aria-labelledby="schritte-title"
      className="border-border bg-card mt-4 rounded-[4px] border"
    >
      <div className="px-4 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="schritte-title" className="text-[16px] font-semibold">
            Fortschritt
          </h2>
          <span className="text-[14px] font-medium tabular-nums">
            {fortschrittText(f)}
            <span className="sr-only"> Schritten erledigt</span>
          </span>
        </div>
        <FortschrittBalken schritte={schritte} className="mt-2.5" />
        <p className="mt-2 text-[14px]">
          {f.naechster ? (
            <>
              Als Nächstes:{" "}
              <span className="font-semibold">
                {SCHRITT_LABELS[f.naechster]}
              </span>
            </>
          ) : (
            "Alles erledigt. Die Seite ist online."
          )}
        </p>
        {!enabled ? (
          <p className="text-muted-foreground mt-1 text-[14px]">
            Abhaken geht nach dem Datenbank-Update (siehe Hinweis oben).
          </p>
        ) : null}
      </div>

      <ol className="divide-border border-border mt-3 divide-y border-t">
        {PROJEKT_SCHRITTE.map((s, i) => {
          const datum = schritte[s];
          // Gold-Ring nur, wenn sich der Schritt auch abhaken lässt.
          const naechster = enabled && f.naechster === s;
          const laeuft = pending && aktiv === s;
          return (
            <li key={s} className="flex items-center gap-2 py-1 pr-3 pl-2">
              <button
                type="button"
                aria-pressed={Boolean(datum)}
                disabled={!enabled || pending}
                onClick={() => umschalten(s)}
                className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-[3px] px-2 py-1.5 text-left disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-semibold tabular-nums",
                    datum
                      ? "border-foreground bg-foreground text-background"
                      : naechster
                        ? "border-gold"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {laeuft ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-label="Speichert"
                    />
                  ) : datum ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] leading-tight font-medium">
                    {SCHRITT_LABELS[s]}
                  </span>
                  <span className="text-muted-foreground block text-[13px] leading-snug">
                    {datum
                      ? `Erledigt am ${formatDatum(datum)}`
                      : SCHRITT_HINWEISE[s]}
                  </span>
                </span>
              </button>
              {datum && enabled ? (
                <label
                  className={cn(
                    CHIP,
                    "has-[:focus-visible]:outline-gold relative shrink-0 cursor-pointer has-[:disabled]:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                  )}
                >
                  Datum
                  <input
                    // Neu nach dem Speichern (Datum kommt vom Server).
                    key={datum}
                    type="date"
                    max={heute}
                    defaultValue={datum}
                    disabled={pending}
                    aria-label={`Datum für ${SCHRITT_LABELS[s]} ändern`}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {
                        // iOS öffnet den Picker ohnehin beim Tipp
                      }
                    }}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v || v === datum) return;
                      // iOS-Safari hält sich nicht immer an max.
                      if (v > heute) {
                        setMeldung({
                          art: "fehler",
                          text: "Das Datum liegt in der Zukunft.",
                          nochmal: null,
                        });
                        return;
                      }
                      speichern(s, v, {
                        art: "ok",
                        text: `${SCHRITT_LABELS[s]}: ${formatDatum(v)}.`,
                      });
                    }}
                    // -inset-px: deckt auch den Rand (ganze 44 px Tippfläche).
                    className="absolute -inset-px cursor-pointer text-base opacity-0"
                  />
                </label>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="border-border min-h-0 border-t px-4 empty:hidden">
        {meldung?.art === "ok" ? (
          <div className="flex flex-wrap items-center gap-x-3 py-1.5">
            <p
              role="status"
              className="text-ink-petrol py-1.5 text-[14.5px] font-medium"
            >
              {meldung.text}
            </p>
            {meldung.rueckgaengig ? (
              <button
                type="button"
                className={CHIP}
                disabled={pending}
                onClick={meldung.rueckgaengig}
              >
                Rückgängig
              </button>
            ) : null}
          </div>
        ) : meldung?.art === "fehler" ? (
          <div className="flex flex-wrap items-center gap-x-3 py-1.5">
            <p role="alert" className="text-ink-olive py-1.5 text-[14px]">
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
      </div>
    </section>
  );
}
