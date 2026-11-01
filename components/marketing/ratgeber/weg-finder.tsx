"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import {
  FRAGEN,
  LEERE_ANTWORTEN,
  anzahlOffen,
  empfehleWeg,
  istVollstaendig,
  type WegAntworten,
} from "@/components/marketing/ratgeber/weg-finder-logic";

/**
 * Entscheidungshilfe im Ratgeber /webseite-erstellen, auf dunkler Fläche.
 *
 * Alle vier Fragen stehen gleichzeitig da (fieldset/legend mit echten
 * Radio-Knöpfen, mit Pfeiltasten bedienbar). Sobald alle beantwortet sind,
 * erscheint das Ergebnis; Titel und Begründung stehen in einer
 * aria-live-Region, damit Screenreader die Änderung ansagen.
 *
 * Mobil steht das Ergebnis direkt unter Frage 4 (vor „Antworten löschen“).
 * Ändert jemand danach eine frühere Frage, erscheint unter genau dieser
 * Frage ein kurzer Sprunglink zum neuen Ergebnis, statt die Seite zu
 * verschieben.
 *
 * Nur useState: nichts wird gespeichert, gemessen oder gesendet.
 */
export function WegFinder() {
  const [antworten, setAntworten] = useState<WegAntworten>(LEERE_ANTWORTEN);
  const [zuletzt, setZuletzt] = useState<keyof WegAntworten | null>(null);
  const baseId = useId();
  const ergebnisId = `${baseId}-ergebnis`;
  const formRef = useRef<HTMLFormElement>(null);

  const offen = anzahlOffen(antworten);
  const ergebnis = istVollstaendig(antworten) ? empfehleWeg(antworten) : null;
  const irgendwas = offen < FRAGEN.length;

  /** Werte kommen nur aus FRAGEN, passen also immer zum Schlüssel. */
  function setze(key: keyof WegAntworten, value: string) {
    setAntworten((prev) => ({ ...prev, [key]: value }) as WegAntworten);
    setZuletzt(key);
  }

  function loeschen() {
    setAntworten(LEERE_ANTWORTEN);
    setZuletzt(null);
    // Fokus nicht im Nichts lassen, wenn der Knopf gleich deaktiviert ist.
    formRef.current
      ?.querySelector<HTMLInputElement>('input[type="radio"]')
      ?.focus();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
      <form
        ref={formRef}
        className="min-w-0 lg:col-span-7 lg:row-start-1"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Entscheidungshilfe: Selbst machen oder machen lassen"
      >
        <div className="space-y-9">
          {FRAGEN.map((f, i) => {
            const name = `${baseId}-${f.key}`;
            const gewaehlt = antworten[f.key];
            return (
              <fieldset key={f.key} className="min-w-0">
                <legend className="w-full">
                  <span className="label-mono text-stahl-hell block">
                    Frage {i + 1} von {FRAGEN.length}
                  </span>
                  <span className="mt-2 block text-[1.2rem] leading-snug font-semibold tracking-[-0.012em] text-pretty sm:text-[1.3rem]">
                    {f.frage}
                  </span>
                </legend>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {f.optionen.map((o) => (
                    <label
                      key={o.value}
                      className="group border-background/20 hover:border-background/50 has-[:checked]:border-gold has-[:checked]:bg-background/[0.06] has-[:focus-visible]:outline-gold flex min-w-0 cursor-pointer items-start gap-3 rounded-[2px] border px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
                    >
                      <input
                        type="radio"
                        name={name}
                        value={o.value}
                        checked={gewaehlt === o.value}
                        onChange={() => setze(f.key, o.value)}
                        // Abstand nach unten, damit die feste Anfrage-Leiste am
                        // Handy die fokussierte Option nicht verdeckt.
                        className="sr-only scroll-mb-28"
                      />
                      <span
                        aria-hidden="true"
                        className="border-background/45 group-has-[:checked]:border-gold mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors"
                      >
                        <span className="bg-gold h-2 w-2 scale-0 rounded-full transition-transform group-has-[:checked]:scale-100" />
                      </span>
                      <span className="min-w-0 text-[15px] leading-snug">
                        {o.label}
                      </span>
                    </label>
                  ))}
                </div>
                {/* Mobil: Ergebnis hat sich geändert, steht aber weiter unten. */}
                {ergebnis && zuletzt === f.key && i < FRAGEN.length - 1 ? (
                  <p className="mt-3 text-[14px] lg:hidden">
                    <a
                      href={`#${ergebnisId}`}
                      className="text-background inline-flex items-center gap-1.5 font-semibold underline underline-offset-4"
                    >
                      Ergebnis: {ergebnis.titel}
                      <ArrowDown
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  </p>
                ) : null}
              </fieldset>
            );
          })}
        </div>
      </form>

      <div className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
        <div className="lg:sticky lg:top-24">
          <div
            id={ergebnisId}
            className="border-background/25 bg-teer-2 scroll-mt-24 border px-5 py-6 sm:px-7 sm:py-7"
          >
            <p className="label-mono text-stahl-hell">Ergebnis</p>

            {/* Live-Region: nur Titel und Begründung, damit die Ansage kurz bleibt. */}
            <div aria-live="polite" aria-atomic="true">
              {ergebnis ? (
                <>
                  <p
                    className="text-background mt-3 text-[1.7rem] leading-[1.08] tracking-[-0.025em] sm:text-[2rem]"
                    style={{ fontStretch: "110%", fontWeight: 720 }}
                  >
                    {ergebnis.titel}
                  </p>
                  <div className="text-background/85 mt-4 space-y-3 text-[15.5px] leading-relaxed">
                    {ergebnis.gruende.map((g) => (
                      <p key={g}>{g}</p>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            {ergebnis ? (
              <>
                <dl className="border-background/15 mt-6 border-t">
                  <div className="border-background/15 grid gap-1 border-b py-4">
                    <dt className="label-mono text-stahl-hell text-[11px]">
                      Zeitbedarf
                    </dt>
                    <dd className="text-[14.5px] leading-relaxed">
                      {ergebnis.zeitbedarf}
                    </dd>
                  </div>
                  <div className="border-background/15 grid gap-1 border-b py-4">
                    <dt className="label-mono text-stahl-hell text-[11px]">
                      Als Nächstes
                    </dt>
                    <dd className="text-[14.5px] leading-relaxed">
                      <a
                        href="#schritte"
                        className="text-background font-semibold underline underline-offset-4"
                      >
                        Die sieben Schritte
                      </a>{" "}
                      durchgehen und vor dem Start die{" "}
                      <a
                        href="#checkliste"
                        className="text-background font-semibold underline underline-offset-4"
                      >
                        Checkliste
                      </a>{" "}
                      abhaken.
                    </dd>
                  </div>
                </dl>

                {ergebnis.lassen ? (
                  <ul className="mt-5 space-y-2.5 text-[14.5px]">
                    <li>
                      <Link
                        href="/website-kosten#checkliste"
                        className="text-background inline-flex items-start gap-1.5 font-semibold underline-offset-4 hover:underline"
                      >
                        Vergleichen Sie Angebote mit sechs Fragen
                        <ArrowRight
                          className="mt-[3px] h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/website-erstellen-lassen"
                        className="text-background inline-flex items-start gap-1.5 font-semibold underline-offset-4 hover:underline"
                      >
                        Webseite erstellen lassen bei Sitalo: Festpreis und
                        Ablauf
                        <ArrowRight
                          className="mt-[3px] h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  </ul>
                ) : null}

                <p className="text-stahl-hell mt-6 text-[13.5px] leading-relaxed">
                  Unsicher, ob Sie jetzt schon eine Seite brauchen?{" "}
                  <Link
                    href="/journal/wann-eine-website-warten-kann"
                    className="text-background underline underline-offset-4"
                  >
                    Wann eine Website warten kann
                  </Link>
                </p>
              </>
            ) : (
              <p className="text-stahl-hell mt-3 text-[15.5px] leading-relaxed">
                Beantworten Sie alle vier Fragen, dann steht hier, welcher Weg
                zu Ihnen passt und warum.{" "}
                <span className="text-background/85 whitespace-nowrap">
                  {offen === 1
                    ? "Noch eine Frage offen."
                    : `Noch ${offen} Fragen offen.`}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Mobil nach dem Ergebnis, ab lg in der linken Spalte unter den Fragen. */}
      <div className="border-background/15 flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-9">
        <button
          type="button"
          onClick={loeschen}
          disabled={!irgendwas}
          className="btn-line h-11 px-5 text-[14.5px] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Antworten löschen
        </button>
        <p className="text-stahl-hell min-w-0 flex-1 basis-[16rem] text-[13px] leading-relaxed">
          Ihre Antworten bleiben in diesem Fenster. Gespeichert oder gesendet
          wird nichts.
        </p>
      </div>
    </div>
  );
}
