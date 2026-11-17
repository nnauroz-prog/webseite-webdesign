"use client";

import {
  Copy,
  ExternalLink,
  Images,
  Loader2,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { StorySerie } from "@/lib/story-serie";

import {
  BildUndVideo,
  dateiSichern,
  DUNKEL,
  HELL,
  kannTeilen,
  standbildDatei,
  useKartenBuehne,
  Vorschau,
} from "@/app/admin/story/buehne";
import { safeHttpUrl } from "@/lib/admin/links";
import {
  bilderText,
  serieAlsText,
  serieDateiname,
} from "@/lib/admin/studio-serie";
import { FORMATE } from "@/lib/story-bild";
import { ROLLE_LABEL, serieAlsKarten } from "@/lib/story-serie";
import { cn } from "@/lib/utils";

/**
 * Eine Story-Serie ansehen und posten: die Serie des Tages, ein frisches
 * Ergebnis der Redaktion oder ein gespeicherter Auftrag.
 *
 * - Oben die Bilder der Serie als Leiste (1 bis n, mit ihrer Aufgabe).
 *   Antippen oder Pfeiltasten wählen ein Bild.
 * - Darunter das gewählte Bild groß, im Story-Format (1080 × 1920), auf
 *   derselben Bühne wie die einzelnen Posts (buehne.tsx).
 * - Anderes Design gilt für alle Bilder der Serie zugleich, damit sie
 *   wie aus einem Guss bleibt.
 * - Alle Bilder teilen gibt die ganze Serie an das Teilen-Blatt (am
 *   Rechner werden die Bilder nacheinander gesichert). Je Bild gibt es
 *   Teilen, Sichern und das Kurzvideo.
 * - Texte kopieren legt die Sätze aller Bilder in die Zwischenablage.
 */
export function SerienBetrachter({
  serie,
  datum,
}: {
  serie: StorySerie;
  /** Kalendertag (yyyy-mm-dd), für den die Serie gedacht ist. */
  datum: string;
}) {
  const kennung = useId();
  // Am Inhalt hängen, nicht am Objekt: Lädt die Seite ihre Daten neu,
  // bleiben Auswahl und Bühne ungestört.
  const inhalt = JSON.stringify(serie);
  const karten = useMemo(
    () => serieAlsKarten(JSON.parse(inhalt) as StorySerie, datum),
    [inhalt, datum],
  );
  const von = karten.length;
  const [gewaehlt, setGewaehlt] = useState(0);
  /** „Anderes Design“ für die ganze Serie: 0 ist das Design des Tages. */
  const [versatz, setVersatz] = useState(0);
  const stelle = Math.min(gewaehlt, von - 1);
  const karte = karten[stelle];
  const flaeche = useRef<HTMLCanvasElement | null>(null);
  const buehne = useKartenBuehne(flaeche, {
    karte,
    format: "story",
    versatz,
    name: serieDateiname(datum, stelle + 1, von),
  });
  const { frei, beschaeftigt, wechseln } = buehne;
  const reiter = useRef<(HTMLButtonElement | null)[]>([]);
  /** Fertige Bilddateien der ganzen Serie, solange das Design gleich bleibt. */
  const fertig = useRef<{ schluessel: string; dateien: File[] } | null>(null);
  const [packt, setPackt] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);
  const meldungUhr = useRef(0);
  useEffect(() => () => window.clearTimeout(meldungUhr.current), []);
  const sagen = (text: string) => {
    window.clearTimeout(meldungUhr.current);
    setMeldung(text);
    meldungUhr.current = window.setTimeout(() => setMeldung(null), 6000);
  };

  const waehlen = (i: number, fokus = false) => {
    if (i < 0 || i >= von || beschaeftigt) return;
    if (i !== stelle) wechseln(() => setGewaehlt(i));
    if (fokus) reiter.current[i]?.focus();
  };

  /** Pfeiltasten in der Leiste: links, rechts, Pos1, Ende. */
  const tasten = (e: React.KeyboardEvent) => {
    const ziel =
      e.key === "ArrowRight"
        ? (stelle + 1) % von
        : e.key === "ArrowLeft"
          ? (stelle - 1 + von) % von
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? von - 1
              : null;
    if (ziel === null) return;
    e.preventDefault();
    waehlen(ziel, true);
  };

  const alleTeilen = async () => {
    const schluessel = `${inhalt}|${datum}|${versatz}`;
    let dateien =
      fertig.current?.schluessel === schluessel ? fertig.current.dateien : null;
    if (!dateien) {
      setPackt(true);
      const neu: File[] = [];
      for (const k of karten) {
        const datei = await standbildDatei(
          k,
          versatz,
          serieDateiname(datum, k.folge.nr, von),
        );
        if (!datei) break;
        neu.push(datei);
      }
      setPackt(false);
      if (neu.length !== von)
        return sagen("Die Bilder konnten nicht erzeugt werden.");
      dateien = neu;
      fertig.current = { schluessel, dateien };
    }
    if (kannTeilen(dateien)) {
      try {
        await navigator.share({ files: dateien });
      } catch (fehler) {
        // Das Handy öffnet das Teilen-Blatt nur direkt nach einem Tipp.
        // Hat das Erzeugen zu lange gedauert, liegen die Bilder jetzt
        // bereit und der nächste Tipp öffnet es sofort.
        if ((fehler as { name?: string } | null)?.name === "NotAllowedError")
          sagen(
            "Die Bilder sind fertig. Tipp noch einmal auf „Alle Bilder teilen“.",
          );
        // Sonst: abgebrochen, nichts tun.
      }
      return;
    }
    // Ohne Teilen-Blatt (Rechner): nacheinander sichern.
    for (const datei of dateien) {
      dateiSichern(datei);
      await new Promise((weiter) => window.setTimeout(weiter, 350));
    }
    sagen(`${bilderText(von)} gesichert.`);
  };

  const texte = serieAlsText(serie);
  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(texte);
      sagen("Texte kopiert.");
    } catch {
      sagen(
        "Kopieren nicht erlaubt. Öffne die Texte und markiere sie von Hand.",
      );
    }
  };

  const quelle = safeHttpUrl(serie.quelle);
  const f = FORMATE.story;

  return (
    <div>
      {/* Leiste: die Bilder der Serie */}
      <div
        role="tablist"
        aria-label={`Bilder der Serie „${serie.titel}“`}
        onKeyDown={tasten}
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
      >
        {karten.map((k, i) => {
          const aktiv = i === stelle;
          return (
            <button
              key={k.folge.nr}
              ref={(el) => {
                reiter.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${kennung}-reiter-${i}`}
              aria-selected={aktiv}
              aria-current={aktiv ? "true" : undefined}
              aria-controls={`${kennung}-bild`}
              aria-label={`Bild ${k.folge.nr} von ${von}: ${ROLLE_LABEL[k.rolle]}`}
              tabIndex={aktiv ? 0 : -1}
              disabled={beschaeftigt}
              onClick={() => waehlen(i)}
              className={cn(
                "max-w-[84px] min-w-[56px] flex-1 rounded-[10px] border-2 p-1 text-left transition-colors disabled:opacity-60",
                aktiv
                  ? "border-foreground"
                  : "hover:border-border border-transparent",
              )}
            >
              <Vorschau karte={k} versatz={versatz} />
              <span className="mt-1 block text-[12px] leading-4 font-semibold tabular-nums">
                {k.folge.nr}
              </span>
              <span className="text-muted-foreground block truncate text-[11px] leading-4">
                {ROLLE_LABEL[k.rolle]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)] sm:items-start">
        {/* Das gewählte Bild groß */}
        <div
          role="tabpanel"
          id={`${kennung}-bild`}
          aria-labelledby={`${kennung}-reiter-${stelle}`}
        >
          <canvas
            ref={flaeche}
            width={f.b}
            height={f.h}
            role="img"
            aria-label={`Bild ${stelle + 1} von ${von}, ${ROLLE_LABEL[karte.rolle]}: ${karte.kicker}. ${karte.text} ${karte.zusatz}`}
            style={{ aspectRatio: `${f.b} / ${f.h}` }}
            className="border-border mx-auto block w-full max-w-[320px] rounded-[18px] border bg-[#0f2a3a]"
          />
          <div className="mx-auto mt-3 flex max-w-[320px] flex-wrap gap-2">
            <button
              type="button"
              onClick={() => wechseln(() => setVersatz((v) => v + 1))}
              disabled={!frei || packt}
              className={cn(HELL, "flex-1")}
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
              Anderes Design
            </button>
            {versatz > 0 ? (
              <button
                type="button"
                onClick={() => wechseln(() => setVersatz(0))}
                disabled={!frei || packt}
                className={HELL}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Original
              </button>
            ) : null}
          </div>
          <p className="text-muted-foreground mx-auto mt-1.5 max-w-[320px] text-[13px] leading-5">
            Das Design gilt für alle {bilderText(von)} der Serie.
          </p>
        </div>

        {/* Werkzeuge */}
        <div className="min-w-0">
          <h4 className="mb-2 text-[15px] font-semibold tracking-tight">
            Ganze Serie
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={alleTeilen}
              disabled={!frei || packt}
              className={cn(DUNKEL, "px-3")}
            >
              {packt ? (
                <Loader2
                  className="h-4 w-4 motion-safe:animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Images className="h-4 w-4" aria-hidden="true" />
              )}
              {packt ? "Bilder entstehen …" : "Alle Bilder teilen"}
            </button>
            <button
              type="button"
              onClick={kopieren}
              className={cn(HELL, "px-3")}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Texte kopieren
            </button>
          </div>
          <p
            role="status"
            className="text-muted-foreground mt-2 min-h-5 text-[14px]"
          >
            {meldung}
          </p>
          <p className="text-muted-foreground text-[14px] leading-5">
            So postest du die Serie: Im Teilen-Menü die Bilder sichern. Dann in
            Instagram eine neue Story anlegen, „Auswählen“ antippen und die
            Bilder in der Reihenfolge 1 bis {von} markieren.
          </p>

          <div className="border-border mt-4 border-t pt-4">
            <BildUndVideo
              buehne={buehne}
              bildTitel={`Bild ${stelle + 1} von ${von} · ${ROLLE_LABEL[karte.rolle]}`}
              kopf="h4"
              betont={false}
            />
          </div>

          <details className="group border-border mt-2 rounded-[3px] border">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
              Texte aller Bilder
              <span
                aria-hidden="true"
                className="text-muted-foreground text-[13px] font-normal group-open:hidden"
              >
                zeigen
              </span>
            </summary>
            <p className="border-border bg-foreground/[0.03] border-t px-3 py-2 text-[15px] leading-6 whitespace-pre-line select-all">
              {texte}
            </p>
          </details>
          {quelle ? (
            <a
              href={quelle}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground mt-1 inline-flex h-11 items-center gap-1.5 text-[14px] underline underline-offset-4"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Quelle zur Serie
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
