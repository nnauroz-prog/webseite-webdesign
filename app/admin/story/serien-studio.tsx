"use client";

import { Check, ChevronDown, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import type { RedaktionErgebnis } from "@/app/admin/story/redaktion";
import type { SerieZiel } from "@/lib/admin/studio-serie";
import type { Vorschlag } from "@/lib/admin/studio-vorschlaege";
import type { SerieZeile } from "@/lib/serien-store";
import type { StorySerie } from "@/lib/story-serie";

import { SERIEN_KEY } from "@/app/admin/client-state";
import { runAction } from "@/app/admin/run-action";
import {
  serieGepostetAction,
  serieLoeschenAction,
} from "@/app/admin/serien-actions";
import { DUNKEL, HELL } from "@/app/admin/story/buehne";
import {
  Redaktion,
  RedaktionOhneSchluessel,
  RedaktionVergangen,
} from "@/app/admin/story/redaktion";
import { SerienBetrachter } from "@/app/admin/story/serien-betrachter";
import {
  bilderText,
  istLokal,
  lokaleSerienAus,
  lokaleSerienMit,
  lokaleZeile,
  tagKurz,
} from "@/lib/admin/studio-serie";
import { cn } from "@/lib/utils";

/**
 * Der Serien-Teil des Story-Studios, in dieser Reihenfolge:
 *
 * 1. Redaktion: Hier bekommen die Agenten ihren Auftrag (redaktion.tsx).
 *    Die fertige Serie erscheint sofort darunter, aufgeklappt.
 * 2. Story-Serie des Tages: die Serie, die der Morgenlauf geschrieben hat.
 * 3. Deine Aufträge: die gespeicherten Serien, neueste zuerst. Antippen
 *    klappt eine auf; dort lässt sie sich als gepostet abhaken oder
 *    löschen. Ohne Datenbank-Update merkt sich nur dieses Gerät die
 *    letzten Serien (bis zum Abmelden).
 *
 * Aufgeklappt ist immer höchstens eine Serie: Jede offene Serie hält
 * eine große Zeichenfläche, und am Handy ist der Speicher knapp.
 */

/** Schlüssel der Serie des Tages in „offen“ (Aufträge stehen unter ihrer Kennung). */
const TAG = "tag";
/** So viele Aufträge stehen ohne „Ältere zeigen“ da. */
const ZUERST = 5;

const PILLE = "rounded-[3px] px-2 py-0.5 text-[12.5px] font-medium";
const LEER =
  "border-border text-muted-foreground rounded-[4px] border border-dashed p-4 text-[15px] leading-relaxed";

function lokalLesen(): SerieZeile[] {
  try {
    return lokaleSerienAus(window.sessionStorage.getItem(SERIEN_KEY));
  } catch {
    // Ohne Speicher (privates Fenster) gilt nur, was gerade offen ist.
    return [];
  }
}

function lokalSchreiben(liste: SerieZeile[]): void {
  try {
    if (liste.length > 0)
      window.sessionStorage.setItem(SERIEN_KEY, JSON.stringify(liste));
    else window.sessionStorage.removeItem(SERIEN_KEY);
  } catch {
    // Nicht speicherbar: gilt dann nur bis zum Neuladen.
  }
}

/** Eine Serie zum Auf- und Zuklappen: Kopfzeile als Knopf, darunter der Inhalt. */
function Klappe({
  domId,
  titel,
  meta,
  auftrag,
  marken,
  offen,
  onToggle,
  children,
}: {
  domId: string;
  titel: string;
  /** „Fr 27.11. · 4 Bilder“ */
  meta: string;
  auftrag?: string;
  marken?: React.ReactNode;
  offen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const feld = useId();
  return (
    <div
      id={domId}
      className="border-border bg-card scroll-mt-3 rounded-[4px] border"
    >
      <h3>
        <button
          type="button"
          data-kopf=""
          aria-expanded={offen}
          aria-controls={offen ? feld : undefined}
          onClick={onToggle}
          className="flex min-h-14 w-full items-center gap-3 rounded-[4px] px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[16px] leading-snug font-semibold">
                {titel}
              </span>
              {marken}
            </span>
            <span className="text-muted-foreground block text-[13px] leading-5 font-normal">
              {meta}
            </span>
            {auftrag ? (
              <span className="text-muted-foreground block truncate text-[14px] leading-5 font-normal">
                {auftrag}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              "text-muted-foreground h-5 w-5 shrink-0 transition-transform",
              offen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      {offen ? (
        <div id={feld} className="border-border border-t p-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Ein Auftrag aus der Liste (oder das frische Ergebnis), mit Abhaken und Löschen. */
function AuftragKarte({
  zeile,
  frisch = false,
  offen,
  onToggle,
  onLokalGepostet,
  onLokalLoeschen,
  onGeloescht,
}: {
  zeile: SerieZeile;
  /** Gerade von der Redaktion gekommen. */
  frisch?: boolean;
  offen: boolean;
  onToggle: () => void;
  onLokalGepostet: (zeile: SerieZeile, gepostet: boolean) => void;
  onLokalLoeschen: (zeile: SerieZeile) => void;
  /** Aus der Datenbank gelöscht: sofort aus der Liste nehmen. */
  onGeloescht: (zeile: SerieZeile) => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [laeuft, setLaeuft] = useState<"haken" | "loeschen" | null>(null);
  const [fragt, setFragt] = useState(false);
  const [meldung, setMeldung] = useState<{
    art: "ok" | "fehler";
    text: string;
  } | null>(null);
  const lokal = istLokal(zeile.id);
  const gepostet = zeile.gepostet_at !== null;

  useEffect(() => {
    if (!meldung) return;
    const t = window.setTimeout(
      () => setMeldung(null),
      meldung.art === "ok" ? 4200 : 10_000,
    );
    return () => window.clearTimeout(t);
  }, [meldung]);

  const haken = () => {
    setMeldung(null);
    if (lokal) return onLokalGepostet(zeile, !gepostet);
    setLaeuft("haken");
    start(async () => {
      const res = await runAction(() =>
        serieGepostetAction(zeile.id, !gepostet),
      );
      setLaeuft(null);
      if (!res.ok) return setMeldung({ art: "fehler", text: res.error });
      setMeldung({
        art: "ok",
        text: gepostet ? "Wieder offen." : "Als gepostet abgehakt.",
      });
      router.refresh();
    });
  };

  const loeschen = () => {
    setMeldung(null);
    if (lokal) return onLokalLoeschen(zeile);
    setLaeuft("loeschen");
    start(async () => {
      const res = await runAction(() => serieLoeschenAction(zeile.id));
      setLaeuft(null);
      if (!res.ok) {
        setFragt(false);
        return setMeldung({ art: "fehler", text: res.error });
      }
      onGeloescht(zeile);
      router.refresh();
    });
  };

  return (
    <Klappe
      domId={`serie-${zeile.id}`}
      titel={zeile.serie.titel}
      meta={`${tagKurz(zeile.datum)} · ${bilderText(zeile.serie.folien.length)}`}
      auftrag={
        zeile.auftrag
          ? `Auftrag: „${zeile.auftrag}“`
          : "Auftrag: etwas zum Tag (ohne Text)"
      }
      marken={
        <>
          {frisch ? (
            <span className={cn(PILLE, "bg-gold/15 text-gold-ink")}>Neu</span>
          ) : null}
          {gepostet ? (
            <span className={cn(PILLE, "bg-ink-petrol/15 text-ink-petrol")}>
              gepostet
            </span>
          ) : null}
          {lokal ? (
            <span
              className={cn(
                PILLE,
                "border-border text-muted-foreground border",
              )}
            >
              nur dieses Gerät
            </span>
          ) : null}
        </>
      }
      offen={offen}
      onToggle={onToggle}
    >
      <SerienBetrachter serie={zeile.serie} datum={zeile.datum} />
      <div className="border-border mt-4 border-t pt-4">
        {fragt ? (
          <div
            role="group"
            aria-label="Serie löschen"
            className="flex flex-wrap items-center gap-2"
          >
            <p className="w-full text-[15px] leading-6">
              Diese Serie löschen? Das lässt sich nicht rückgängig machen.
            </p>
            <button
              type="button"
              onClick={loeschen}
              disabled={pending}
              className={cn(HELL, "border-ink-olive/40 text-ink-olive")}
            >
              {pending && laeuft === "loeschen" ? (
                <Loader2
                  className="h-4 w-4 motion-safe:animate-spin"
                  aria-label="Löscht"
                />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
              Ja, löschen
            </button>
            <button
              type="button"
              // Der Knopf „Löschen“ ist weg: Der Fokus geht auf den sicheren Ausweg.
              ref={(el) => el?.focus({ preventScroll: true })}
              onClick={() => setFragt(false)}
              disabled={pending}
              className={HELL}
            >
              Abbrechen
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={gepostet}
              onClick={haken}
              disabled={pending}
              className={gepostet ? DUNKEL : HELL}
            >
              {pending && laeuft === "haken" ? (
                <Loader2
                  className="h-4 w-4 motion-safe:animate-spin"
                  aria-label="Speichert"
                />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
              {gepostet ? "Gepostet" : "Als gepostet abhaken"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMeldung(null);
                setFragt(true);
              }}
              disabled={pending}
              className={HELL}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Löschen
            </button>
          </div>
        )}
        <p
          role={meldung?.art === "fehler" ? "alert" : "status"}
          className={cn(
            "mt-2 min-h-5 text-[14px]",
            meldung?.art === "fehler"
              ? "text-ink-olive"
              : "text-ink-petrol font-medium",
          )}
        >
          {meldung?.text}
        </p>
      </div>
    </Klappe>
  );
}

export function SerienStudio({
  tag,
  heute,
  bereit,
  vorschlaege,
  tagesSerie,
  auftraege,
  auftraegeFehler = false,
  start = null,
  eingeklappt = false,
}: {
  /** Gewählter Kalendertag (yyyy-mm-dd). */
  tag: string;
  /** Heute in Hamburg (yyyy-mm-dd). */
  heute: string;
  /** Hat die Redaktion ihren Schlüssel (lib/redaktion/konfig.ts)? */
  bereit: boolean;
  vorschlaege: Vorschlag[];
  /** Serie des Tages vom Morgenlauf oder null. */
  tagesSerie: StorySerie | null;
  /** Gespeicherte Aufträge, neueste zuerst; null ohne Datenbank-Update. */
  auftraege: SerieZeile[] | null;
  /** Die Aufträge ließen sich nicht laden (Datenbank antwortet nicht). */
  auftraegeFehler?: boolean;
  /** Aus ?serie=: Diese Serie ist aufgeklappt und wird angesteuert. */
  start?: SerieZiel | null;
  /** Alles zugeklappt lassen (etwa wenn ?post= einen einzelnen Post öffnet). */
  eingeklappt?: boolean;
}) {
  const router = useRouter();
  /** Serien, die sich nur dieses Gerät merkt (ohne Datenbank, neueste zuerst). */
  const [lokal, setLokal] = useState<SerieZeile[]>([]);
  const lokalJetzt = useRef<SerieZeile[]>([]);
  const [geladen, setGeladen] = useState(false);
  /** Das frische Ergebnis der Redaktion, bis die Seite neu geladen wird. */
  const [neu, setNeu] = useState<SerieZeile | null>(null);
  /** In der Datenbank gelöscht, aber die Seite hat noch den alten Stand. */
  const [weg, setWeg] = useState<string[]>([]);
  const [offen, setOffen] = useState<string | null>(() =>
    start
      ? start.art === "id"
        ? start.id
        : TAG
      : !eingeklappt && tagesSerie
        ? TAG
        : null,
  );
  const [alle, setAlle] = useState(false);
  /** Diese Serie nach dem nächsten Zeichnen ansteuern (Kennung oder TAG). */
  const sprung = useRef<string | null>(
    start ? (start.art === "id" ? start.id : TAG) : null,
  );

  const setzeLokal = (liste: SerieZeile[]) => {
    lokalJetzt.current = liste;
    setLokal(liste);
    lokalSchreiben(liste);
  };

  useEffect(() => {
    const liste = lokalLesen();
    lokalJetzt.current = liste;
    setLokal(liste);
    setGeladen(true);
  }, []);

  // Eine verlinkte oder frische Serie an den oberen Rand holen.
  useEffect(() => {
    const ziel = sprung.current;
    if (!ziel) return;
    const karte = document.getElementById(`serie-${ziel}`);
    if (!karte) return;
    sprung.current = null;
    karte.scrollIntoView({ block: "start" });
    karte
      .querySelector<HTMLElement>("[data-kopf]")
      ?.focus({ preventScroll: true });
  });

  const uebernehmen = (ergebnis: RedaktionErgebnis) => {
    const jetzt = new Date();
    let zeile: SerieZeile;
    if (ergebnis.id === null) {
      // Nicht gespeichert: Dieses Gerät merkt sich die Serie.
      zeile = lokaleZeile(ergebnis.serie, ergebnis.auftrag, tag, jetzt);
      setzeLokal(lokaleSerienMit(lokalJetzt.current, zeile));
    } else {
      zeile = {
        id: ergebnis.id,
        created_at: jetzt.toISOString(),
        datum: tag,
        auftrag: ergebnis.auftrag,
        serie: ergebnis.serie,
        gepostet_at: null,
      };
    }
    setNeu(zeile);
    setOffen(zeile.id);
    sprung.current = zeile.id;
    // „Deine Aufträge“ kommt vom Server: neu laden.
    router.refresh();
  };

  const lokalGepostet = (zeile: SerieZeile, gepostet: boolean) =>
    setzeLokal(
      lokalJetzt.current.map((z) =>
        z.id === zeile.id
          ? { ...z, gepostet_at: gepostet ? new Date().toISOString() : null }
          : z,
      ),
    );
  const vergessen = (zeile: SerieZeile) => {
    if (neu?.id === zeile.id) setNeu(null);
    if (offen === zeile.id) setOffen(null);
  };
  const lokalLoeschen = (zeile: SerieZeile) => {
    setzeLokal(lokalJetzt.current.filter((z) => z.id !== zeile.id));
    vergessen(zeile);
  };
  const geloescht = (zeile: SerieZeile) => {
    setWeg((alt) => [...alt, zeile.id]);
    vergessen(zeile);
  };

  const zeilen = [...lokal, ...(auftraege ?? [])].filter(
    (z) => !weg.includes(z.id),
  );
  // Das frische Ergebnis steht oben; nach dem Neuladen gilt der Stand vom Server.
  const frisch = neu ? (zeilen.find((z) => z.id === neu.id) ?? neu) : null;
  const liste = zeilen.filter((z) => z.id !== frisch?.id);
  const gezeigt = alle ? liste : liste.slice(0, ZUERST);
  // Eine verlinkte Serie steht weiter unten: nicht hinter „Ältere zeigen“ verstecken.
  const sichtbar =
    offen && !gezeigt.some((z) => z.id === offen)
      ? [...gezeigt, ...liste.filter((z) => z.id === offen)]
      : gezeigt;
  const verlinktFehlt =
    start?.art === "id" &&
    geladen &&
    !zeilen.some((z) => z.id === start.id) &&
    !weg.includes(start.id);
  const umschalten = (schluessel: string) =>
    setOffen((alt) => (alt === schluessel ? null : schluessel));
  const karte = (zeile: SerieZeile, istFrisch = false) => (
    <AuftragKarte
      zeile={zeile}
      frisch={istFrisch}
      offen={offen === zeile.id}
      onToggle={() => umschalten(zeile.id)}
      onLokalGepostet={lokalGepostet}
      onLokalLoeschen={lokalLoeschen}
      onGeloescht={geloescht}
    />
  );

  return (
    <div className="mt-4">
      {tag < heute ? (
        <RedaktionVergangen />
      ) : bereit ? (
        <Redaktion
          datum={tag}
          heute={tag === heute}
          vorschlaege={vorschlaege}
          onSerie={uebernehmen}
        />
      ) : (
        <RedaktionOhneSchluessel />
      )}

      <p role="status" className="sr-only">
        {frisch
          ? `Die Serie „${frisch.serie.titel}“ ist fertig: ${bilderText(frisch.serie.folien.length)}.`
          : ""}
      </p>
      {frisch ? <div className="mt-3">{karte(frisch, true)}</div> : null}

      <div role="region" aria-labelledby="tagesserie-title" className="mt-7">
        <h2
          id="tagesserie-title"
          className="mb-2 text-[17px] font-semibold tracking-tight"
        >
          Story-Serie des Tages
        </h2>
        {tagesSerie ? (
          <Klappe
            domId={`serie-${TAG}`}
            titel={tagesSerie.titel}
            meta={`${tagKurz(tag)} · ${bilderText(tagesSerie.folien.length)} · vom Morgenlauf`}
            offen={offen === TAG}
            onToggle={() => umschalten(TAG)}
          >
            <SerienBetrachter serie={tagesSerie} datum={tag} />
          </Klappe>
        ) : (
          <p className={LEER}>
            {tag === heute
              ? "Für heute gibt es noch keine Serie. Der Morgenlauf schreibt sie jeden Morgen gegen 5 Uhr."
              : tag < heute
                ? "Für diesen Tag gibt es keine Serie."
                : "Die Serie für diesen Tag schreibt der Morgenlauf am Morgen gegen 5 Uhr."}
          </p>
        )}
      </div>

      <div role="region" aria-labelledby="auftraege-title" className="mt-7">
        <h2
          id="auftraege-title"
          className="mb-2 text-[17px] font-semibold tracking-tight"
        >
          Deine Aufträge
        </h2>
        {auftraegeFehler ? (
          <p className="text-muted-foreground mb-2 text-[14px] leading-5">
            Deine gespeicherten Aufträge lassen sich gerade nicht laden. Bei
            schwachem Netz hilft meist „Neu laden“.
          </p>
        ) : auftraege === null ? (
          <p className="text-muted-foreground mb-2 text-[14px] leading-5">
            Speichern geht nach dem Datenbank-Update. Bis dahin merkt sich nur
            dieses Gerät deine letzten Serien, bis du dich abmeldest.
          </p>
        ) : null}
        {verlinktFehlt ? (
          <p className="text-muted-foreground mb-2 text-[14px] leading-5">
            Die verlinkte Serie gibt es nicht mehr.
          </p>
        ) : null}
        {liste.length === 0 ? (
          <p className={LEER}>
            {frisch
              ? "Weitere Aufträge gibt es noch nicht."
              : bereit
                ? "Noch kein Auftrag. Oben gibst du den Agenten den ersten."
                : "Noch kein Auftrag."}
          </p>
        ) : (
          <ul className="space-y-2">
            {sichtbar.map((z) => (
              <li key={z.id}>{karte(z)}</li>
            ))}
          </ul>
        )}
        {liste.length > ZUERST && !alle ? (
          <button
            type="button"
            onClick={() => setAlle(true)}
            className={cn(HELL, "mt-2")}
          >
            Ältere zeigen ({liste.length - gezeigt.length})
          </button>
        ) : null}
      </div>
    </div>
  );
}
