"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  Check,
  ChevronRight,
  Circle,
  CircleCheck,
  ExternalLink,
  Loader2,
  RotateCcw,
  Send,
  TriangleAlert,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type {
  Fortschritt,
  FortschrittEreignis,
  PostAusgang,
  PostSpur,
} from "@/lib/admin/instagram-strom";
import type {
  InstagramArt,
  InstagramStand,
  PostFehlerCode,
  PostQuelle,
  UploadAntwort,
} from "@/lib/instagram/vertrag";
import type { StoryKarte } from "@/lib/story-bild";

import {
  instagramStandAction,
  instagramUploadAction,
} from "@/app/admin/instagram-actions";
import { isRedirect } from "@/app/admin/run-action";
import {
  DUNKEL,
  HELL,
  standbildDatei,
  Vorschau,
} from "@/app/admin/story/buehne";
import {
  artText,
  auftragProblem,
  captionKappen,
  captionLaenge,
  captionProblem,
  FEHLER_TEXT,
  fortschrittMit,
  fortschrittNeu,
  hashtagsIn,
  KEINE_VERBINDUNG,
  kontingentFrei,
  linkText,
  NEU_ANMELDEN,
  postAuftrag,
  postSenden,
  quelleSchluessel,
  schrittSatz,
  schrittZaehler,
  spurenAus,
  spurenMit,
  spurSatz,
  STUDIO_SCHRITT_LABEL,
  STUDIO_SCHRITTE,
  WEITER,
} from "@/lib/admin/instagram-strom";
import {
  BILD_BYTES_MAX,
  CAPTION_MAX,
  HASHTAGS_MAX,
  INSTAGRAM_BUCKET,
} from "@/lib/instagram/vertrag";
import { FORMATE } from "@/lib/story-bild";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { cn } from "@/lib/utils";

/**
 * „Auf Instagram posten“ im Story-Studio: ein Knopf und das Blatt dazu.
 * Eine Story-Serie geht als Stories (Standard) oder als Karussell raus,
 * ein einzelner Post als Story oder Beitrag.
 *
 * Ablauf im Blatt (Vertrag: lib/instagram/vertrag.ts):
 * 1. Wahl: Art, Vorschau der Bilder in Reihenfolge, beim Beitrag die
 *    Bildunterschrift (vorbelegt, höchstens HASHTAGS_MAX Hashtags und
 *    CAPTION_MAX Zeichen). Ohne Verbindung steht hier, wie man sie
 *    einrichtet.
 * 2. Frage: „Jetzt auf @konto posten?“ – das ist öffentlich.
 * 3. Läuft: Bilder zeichnen (wie „Alle Bilder teilen“, mit dem Design,
 *    das gerade zu sehen ist), hochladen, dann die Schritte des Servers
 *    aus dem Antwortstrom. Abbrechen geht nur, solange der Auftrag noch
 *    nicht beim Server ist: Danach könnte Instagram schon veröffentlichen.
 * 4. Ergebnis: „Gepostet.“ mit Links, oder der Fehler mit dem nächsten
 *    Schritt. Sind schon Stories live, steht das da, ohne einen blinden
 *    zweiten Versuch (sonst wären sie doppelt).
 *
 * Was dieses Gerät gepostet hat, merkt es sich (localStorage), damit
 * das Blatt vor einem zweiten Posten derselben Serie warnt.
 */

/** Gerätespeicher für die Spuren (keine Kundendaten). */
const SPUREN_KEY = "sitalo-instagram-spuren";
/** So lange gilt ein gelesener Stand der Verbindung. */
const STAND_GILT_MS = 60_000;

let standCache: {
  wann: number;
  versprechen: Promise<InstagramStand | null>;
} | null = null;

/**
 * Stand der Verbindung (instagramStandAction), für Zeile und Blatt
 * gemeinsam: höchstens einmal pro Minute nachfragen. null, wenn die
 * Frage scheitert (dann weiß das Studio es nicht).
 */
function standLesen(frisch = false): Promise<InstagramStand | null> {
  const jetzt = Date.now();
  if (!frisch && standCache && jetzt - standCache.wann < STAND_GILT_MS)
    return standCache.versprechen;
  const versprechen = instagramStandAction().catch(() => null);
  standCache = { wann: jetzt, versprechen };
  void versprechen.then((s) => {
    if (s === null && standCache?.versprechen === versprechen)
      standCache = null;
  });
  return versprechen;
}

/** Stand der Verbindung für eine Komponente (lädt einmal beim Zeigen). */
export function useInstagramStand(): {
  stand: InstagramStand | null;
  laedt: boolean;
} {
  const [zustand, setZustand] = useState<{
    stand: InstagramStand | null;
    laedt: boolean;
  }>({ stand: null, laedt: true });
  useEffect(() => {
    let aktiv = true;
    void standLesen().then((stand) => {
      if (aktiv) setZustand({ stand, laedt: false });
    });
    return () => {
      aktiv = false;
    };
  }, []);
  return zustand;
}

/**
 * Kleine Zeile im Story-Studio: „Instagram: verbunden als @x“ oder
 * „Instagram verbinden“, führt zu /admin/instagram.
 */
export function InstagramZeile({ className }: { className?: string }) {
  const { stand, laedt } = useInstagramStand();
  const warnen = !laedt && (!stand?.verbunden || stand.problem !== null);
  const text = laedt
    ? "Instagram: wird geprüft …"
    : stand === null
      ? "Instagram: Stand unbekannt"
      : !stand.verbunden
        ? "Instagram verbinden"
        : stand.problem
          ? "Instagram: Verbindung prüfen"
          : stand.konto
            ? `Instagram: verbunden als @${stand.konto.name}`
            : "Instagram: verbunden";
  return (
    <Link
      href="/admin/instagram"
      className={cn(
        "inline-flex min-h-11 max-w-full items-center gap-1.5 text-[14px] underline-offset-4 hover:underline",
        warnen ? "text-foreground font-medium" : "text-muted-foreground",
        className,
      )}
    >
      {warnen && stand?.verbunden ? (
        <TriangleAlert
          className="text-gold-ink h-4 w-4 shrink-0"
          aria-hidden="true"
        />
      ) : (
        <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span className="truncate">{text}</span>
      <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </Link>
  );
}

function spurenLesen(): PostSpur[] {
  try {
    return spurenAus(window.localStorage.getItem(SPUREN_KEY));
  } catch {
    return [];
  }
}

/** Merkt sich eine Spur und gibt die Spuren dieser Quelle zurück. */
function spurMerken(spur: PostSpur): PostSpur[] {
  const alle = spurenMit(spurenLesen(), spur);
  try {
    window.localStorage.setItem(SPUREN_KEY, JSON.stringify(alle));
  } catch {
    // Nicht speicherbar (privates Fenster): gilt nur bis zum Neuladen.
  }
  return alle.filter((s) => s.schluessel === spur.schluessel);
}

let speicher: SupabaseClient | null = null;

/** Browser-Client nur für den Speicher (ohne Anmeldung, nur Upload-Token). */
async function speicherClient(): Promise<SupabaseClient | null> {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) return null;
  if (!speicher) {
    const { createClient } = await import("@supabase/supabase-js");
    speicher = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: "sitalo-instagram-upload",
      },
    });
  }
  return speicher;
}

type Fehler = Extract<PostAusgang, { art: "fehler" }>;

function fehlerAus(
  code: PostFehlerCode,
  text: string,
  extra: Partial<Fehler> = {},
): Fehler {
  return {
    art: "fehler",
    code,
    text,
    teil: null,
    unklar: false,
    sitzung: false,
    ...extra,
  };
}

/** Holt Upload-Plätze und lädt die Bilder hoch; Pfade in Reihenfolge. */
async function hochladen(
  dateien: File[],
  signal: AbortSignal,
  aufBild: (nr: number) => void,
): Promise<{ ok: true; pfade: string[] } | { ok: false; fehler: Fehler }> {
  let antwort: UploadAntwort;
  try {
    antwort = await instagramUploadAction(dateien.length);
  } catch (err) {
    return {
      ok: false,
      fehler: isRedirect(err)
        ? fehlerAus("unbekannt", NEU_ANMELDEN, { sitzung: true })
        : fehlerAus("instagram", KEINE_VERBINDUNG),
    };
  }
  if (!antwort.ok)
    return {
      ok: false,
      fehler: fehlerAus(
        antwort.code,
        antwort.text || FEHLER_TEXT[antwort.code],
      ),
    };
  if (antwort.plaetze.length !== dateien.length)
    return { ok: false, fehler: fehlerAus("unbekannt", FEHLER_TEXT.unbekannt) };
  const client = await speicherClient().catch(() => null);
  if (!client)
    return {
      ok: false,
      fehler: fehlerAus(
        "unbekannt",
        "Der Speicher für die Bilder ist nicht erreichbar. Lade die Seite neu.",
      ),
    };
  for (let i = 0; i < dateien.length; i++) {
    if (signal.aborted) break;
    aufBild(i + 1);
    const platz = antwort.plaetze[i];
    try {
      const { error } = await client.storage
        .from(INSTAGRAM_BUCKET)
        .uploadToSignedUrl(platz.pfad, platz.token, dateien[i], {
          contentType: "image/jpeg",
        });
      if (error) throw error;
    } catch {
      return {
        ok: false,
        fehler: fehlerAus(
          "unbekannt",
          "Ein Bild ließ sich nicht hochladen. Prüf das Netz und versuch es noch einmal.",
        ),
      };
    }
  }
  return { ok: true, pfade: antwort.plaetze.map((p) => p.pfad) };
}

/** Was beim Tipp auf „Weiter“ feststeht: genau diese Bilder gehen raus. */
type Schnappschuss = {
  karten: StoryKarte[];
  versatz: number;
  art: InstagramArt;
  caption: string;
  quelle: PostQuelle;
};

type FehlerPhase = {
  p: "fehler";
  ab: number;
  fehler: Fehler;
  art: InstagramArt;
  /** Bilder der ganzen Serie. */
  anzahl: number;
  /** So viele sind sicher live (mit den früheren). */
  live: number;
  links: string[];
};

type Phase =
  | { p: "wahl"; notiz: string | null }
  | {
      p: "frage";
      /** So viele Bilder vorne sind schon live („Nur die restlichen“). */
      ab: number;
      /** Links der schon veröffentlichten Stories. */
      links: string[];
      /** Der letzte Versuch endete ohne Antwort (unklar). */
      nachUnklar: boolean;
      /** Zurück führt hierhin (zum Fehler), sonst zur Wahl. */
      vorher: FehlerPhase | null;
    }
  | { p: "laeuft"; ab: number; f: Fortschritt; gesendet: boolean }
  | {
      p: "fertig";
      art: InstagramArt;
      anzahl: number;
      konto: string;
      links: string[];
      hinweis: string | null;
    }
  | FehlerPhase;

const KASTEN = "rounded-[3px] border px-3 py-2 text-[14px] leading-5";

/** Das Blatt: natives <dialog>, am iPhone unten, ab lg mittig. */
function Blatt({
  offen,
  schliessbar,
  titel,
  titelId,
  kopf,
  onZu,
  children,
}: {
  offen: boolean;
  /** false, solange Instagram veröffentlicht: kein Schließen per Escape oder Hintergrund. */
  schliessbar: boolean;
  titel: string;
  titelId: string;
  kopf: React.RefObject<HTMLHeadingElement | null>;
  onZu: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (offen && !d.open) d.showModal();
    if (!offen && d.open) d.close();
  }, [offen]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titelId}
      onCancel={(e) => {
        if (!schliessbar) e.preventDefault();
      }}
      onClose={onZu}
      onClick={(e) => {
        if (schliessbar && e.target === e.currentTarget)
          e.currentTarget.close();
      }}
      className="bg-card text-foreground backdrop:bg-foreground/40 mx-auto mt-auto mb-0 max-h-[90dvh] w-full max-w-2xl overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-[4px] p-0 lg:my-auto lg:max-w-lg lg:rounded-[4px] lg:shadow-xl"
    >
      <div className="pt-2 pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(env(safe-area-inset-bottom)+1rem)] pl-[max(1rem,env(safe-area-inset-left))] lg:pb-5">
        <div className="flex min-h-11 items-center justify-between gap-2">
          <h2
            id={titelId}
            ref={kopf}
            tabIndex={-1}
            className="text-[17px] leading-snug font-semibold tracking-tight outline-none"
          >
            {titel}
          </h2>
          {schliessbar ? (
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Schließen"
              className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </dialog>
  );
}

/** Die Bilder in der Reihenfolge, klein; schon veröffentlichte blass. */
function Bildreihe({
  karten,
  versatz,
  art,
  ab = 0,
}: {
  karten: StoryKarte[];
  versatz: number;
  art: InstagramArt;
  ab?: number;
}) {
  return (
    <ol
      aria-label={`${artText(art, karten.length)}, in dieser Reihenfolge`}
      className="mt-3 flex gap-2 overflow-x-auto pb-1"
    >
      {karten.map((k, i) => (
        <li key={i} className={cn("w-14 shrink-0", i < ab && "opacity-40")}>
          <span className="sr-only">
            {i < ab ? `Bild ${i + 1}, schon live` : `Bild ${i + 1}`}
          </span>
          <Vorschau
            karte={k}
            versatz={versatz}
            format={art === "story" ? "story" : "beitrag"}
          />
          <span
            aria-hidden="true"
            className="text-muted-foreground mt-0.5 block text-center text-[12px] leading-4 tabular-nums"
          >
            {i < ab ? "live" : i + 1}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** „Story 4“, „Story 3 und 4“, „Story 2 bis 5“. */
function storyBereich(von: number, bis: number): string {
  if (von >= bis) return `Story ${bis}`;
  return `Story ${von} ${bis - von === 1 ? "und" : "bis"} ${bis}`;
}

function Links({ links, art }: { links: string[]; art: InstagramArt }) {
  if (links.length === 0) return null;
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {links.map((link, i) => (
        <li key={`${i}-${link}`}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(HELL, "px-3")}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {linkText(i, links.length, art)}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function InstagramPosten({
  karten,
  versatz,
  quelle,
  caption: captionVorlage,
  start = "story",
  serie = false,
  gesperrt = false,
  className,
  onGepostet,
}: {
  /** Die Bilder in der Reihenfolge, in der sie gepostet werden. */
  karten: StoryKarte[];
  /** „Anderes Design“, wie es gerade zu sehen ist (0: Design des Tages). */
  versatz: number;
  quelle: PostQuelle;
  /** Vorlage für die Bildunterschrift eines Beitrags. */
  caption: string;
  /** Art beim Öffnen. */
  start?: InstagramArt;
  /** Story-Serie (Beschriftung „Als Karussell“) statt einzelnem Post. */
  serie?: boolean;
  /** Knopf gesperrt (etwa während ein Video entsteht). */
  gesperrt?: boolean;
  className?: string;
  /** Alles ist live: Das Studio hakt die Quelle als gepostet ab. */
  onGepostet?: (quelle: PostQuelle, art: InstagramArt) => void;
}) {
  const titelId = useId();
  const feldId = useId();
  const kopf = useRef<HTMLHeadingElement | null>(null);
  const [offen, setOffen] = useState(false);
  const [art, setArt] = useState<InstagramArt>(start);
  const [caption, setCaption] = useState(() => captionKappen(captionVorlage));
  const [phase, setPhase] = useState<Phase>({ p: "wahl", notiz: null });
  const [stand, setStand] = useState<{
    stand: InstagramStand | null;
    laedt: boolean;
  }>({ stand: null, laedt: true });
  const schluessel = quelleSchluessel(quelle);
  const [spuren, setSpuren] = useState<PostSpur[]>([]);
  const [schnapp, setSchnapp] = useState<Schnappschuss | null>(null);
  /** Läuft ein Auftrag (gegen doppeltes Tippen, auch vor dem nächsten Zeichnen). */
  const laeuft = useRef(false);
  const abbruch = useRef<AbortController | null>(null);
  /** Nach jedem Wechsel der Phase die Überschrift ansteuern. */
  const fokusHolen = useRef(false);

  useEffect(() => {
    setSpuren(spurenLesen().filter((s) => s.schluessel === schluessel));
  }, [schluessel]);

  // Beim Öffnen den Stand holen (höchstens einmal pro Minute frisch).
  useEffect(() => {
    if (!offen) return;
    let aktiv = true;
    void standLesen().then((s) => {
      if (aktiv) setStand({ stand: s, laedt: false });
    });
    return () => {
      aktiv = false;
    };
  }, [offen]);

  useEffect(() => {
    if (!fokusHolen.current) return;
    fokusHolen.current = false;
    kopf.current?.focus({ preventScroll: true });
  }, [phase.p]);

  // Während des Postens warnt der Browser vor dem Verlassen der Seite.
  const laeuftJetzt = phase.p === "laeuft";
  useEffect(() => {
    if (!laeuftJetzt) return;
    const warnen = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warnen);
    return () => window.removeEventListener("beforeunload", warnen);
  }, [laeuftJetzt]);

  // Verlässt man das Studio vor dem Senden, endet das Zeichnen und Hochladen.
  useEffect(() => () => abbruch.current?.abort(), []);

  const wechsel = useCallback((neu: Phase) => {
    fokusHolen.current = true;
    setPhase(neu);
  }, []);

  const fort = (e: FortschrittEreignis) =>
    setPhase((ph) =>
      ph.p === "laeuft" ? { ...ph, f: fortschrittMit(ph.f, e) } : ph,
    );

  const posten = async (ab: number, vorher: string[]) => {
    const s = schnapp;
    if (!s || laeuft.current) return;
    laeuft.current = true;
    const alle = s.karten.length;
    const karten = s.karten.slice(ab);
    const von = karten.length;
    const ende = (ausgang: Fehler) => {
      const live = ab + (ausgang.teil?.veroeffentlicht ?? 0);
      const links = [...vorher, ...(ausgang.teil?.links ?? [])];
      if (live > 0 || ausgang.unklar)
        setSpuren(
          spurMerken({
            schluessel: quelleSchluessel(s.quelle),
            art: s.art,
            anzahl: alle,
            wann: new Date().toISOString(),
            ergebnis: ausgang.unklar ? "unklar" : "teil",
            live,
            links,
          }),
        );
      wechsel({
        p: "fehler",
        ab,
        fehler: ausgang,
        art: s.art,
        anzahl: alle,
        live,
        links,
      });
    };
    const stopp = new AbortController();
    abbruch.current = stopp;
    try {
      if (navigator.onLine === false)
        return ende(fehlerAus("instagram", KEINE_VERBINDUNG));
      wechsel({ p: "laeuft", ab, f: fortschrittNeu(), gesendet: false });
      const abgebrochen = () => {
        wechsel({
          p: "wahl",
          notiz: "Abgebrochen. Es wurde nichts gepostet.",
        });
      };

      // 1. Bilder zeichnen, mit dem Design, das gerade zu sehen ist.
      const format = FORMATE[s.art === "story" ? "story" : "beitrag"];
      const dateien: File[] = [];
      for (let i = 0; i < von; i++) {
        if (stopp.signal.aborted) return abgebrochen();
        fort({ schritt: "bilder", stand: "laeuft", nr: i + 1, von });
        const datei = await standbildDatei(
          karten[i],
          s.versatz,
          `sitalo-instagram-${ab + i + 1}`,
          { format, maxBytes: BILD_BYTES_MAX },
        );
        if (!datei)
          return ende(
            fehlerAus(
              "unbekannt",
              "Die Bilder konnten nicht erzeugt werden. Lade die Seite neu und versuch es noch einmal.",
            ),
          );
        if (datei.size > BILD_BYTES_MAX)
          return ende(
            fehlerAus(
              "bild",
              `Bild ${ab + i + 1} ist zu groß für Instagram (über 8 MB).`,
            ),
          );
        dateien.push(datei);
      }
      fort({ schritt: "bilder", stand: "fertig" });

      // 2. Hochladen in den Speicher (direkt, nicht über Vercel).
      if (stopp.signal.aborted) return abgebrochen();
      fort({ schritt: "hochladen", stand: "laeuft", nr: 1, von });
      const hoch = await hochladen(dateien, stopp.signal, (nr) =>
        fort({ schritt: "hochladen", stand: "laeuft", nr, von }),
      );
      if (stopp.signal.aborted) return abgebrochen();
      if (!hoch.ok) return ende(hoch.fehler);
      fort({ schritt: "hochladen", stand: "fertig" });

      // 3. Ab hier kein Abbrechen mehr: Der Server kann veröffentlichen.
      abbruch.current = null;
      setPhase((ph) => (ph.p === "laeuft" ? { ...ph, gesendet: true } : ph));
      const aus = await postSenden(
        postAuftrag(s.art, hoch.pfade, s.caption, s.quelle),
        { aufSchritt: (e) => fort(e) },
      );
      if (aus.art === "fehler") return ende(aus);
      // Die Kontingent-Zahl hat sich geändert.
      standCache = null;
      setSpuren(
        spurMerken({
          schluessel: quelleSchluessel(s.quelle),
          art: s.art,
          anzahl: alle,
          wann: new Date().toISOString(),
          ergebnis: "gepostet",
          live: alle,
          links: [...vorher, ...aus.links],
        }),
      );
      wechsel({
        p: "fertig",
        art: s.art,
        anzahl: alle,
        konto: aus.konto,
        links: [...vorher, ...aus.links],
        hinweis: aus.hinweis,
      });
      onGepostet?.(s.quelle, s.art);
    } finally {
      if (abbruch.current === stopp) abbruch.current = null;
      laeuft.current = false;
    }
  };

  const zu = () => {
    setOffen(false);
    // Vor dem Senden: Schließen bricht ab.
    if (phase.p === "laeuft" && !phase.gesendet) abbruch.current?.abort();
    // Ein fertiges Ergebnis oder ein einfacher Fehler beginnt beim
    // nächsten Öffnen neu; ein Teil-Ergebnis bleibt stehen.
    if (
      phase.p === "fertig" ||
      phase.p === "frage" ||
      (phase.p === "fehler" && phase.live === 0 && !phase.fehler.unklar)
    )
      setPhase({ p: "wahl", notiz: null });
    if (phase.p === "wahl" && phase.notiz) setPhase({ p: "wahl", notiz: null });
  };

  const st = stand.stand;
  const konto = st?.verbunden && st.konto ? st.konto.name : null;
  const nichtVerbunden = !stand.laedt && st !== null && !st.verbunden;
  const anzahl = karten.length;
  const brauchtPlaetze = art === "story" ? anzahl : 1;
  const frei = kontingentFrei(st);
  const problem =
    auftragProblem(art, anzahl) ??
    (art === "beitrag" ? captionProblem(caption) : null) ??
    (frei !== null && frei < brauchtPlaetze
      ? `Instagram lässt heute nur noch ${frei === 1 ? "einen Beitrag" : `${frei} Beiträge`} zu, für ${artText(art, anzahl)} brauchst du ${brauchtPlaetze}. Versuch es später.`
      : null);

  const titel =
    phase.p === "frage"
      ? konto
        ? `Jetzt auf @${konto} posten?`
        : "Jetzt auf Instagram posten?"
      : phase.p === "laeuft"
        ? "Wird gepostet …"
        : phase.p === "fertig"
          ? "Gepostet."
          : phase.p === "fehler"
            ? phase.fehler.unklar
              ? "Unklar, ob gepostet wurde."
              : phase.live > 0
                ? "Nur zum Teil gepostet."
                : "Nicht gepostet."
            : "Auf Instagram posten";

  const gepostet = spuren.some((sp) => sp.ergebnis === "gepostet");
  const sendet = phase.p === "laeuft";
  const s = schnapp;

  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(true)}
        disabled={gesperrt && !sendet}
        aria-haspopup="dialog"
        className={cn(gepostet && !sendet ? HELL : DUNKEL, "px-3", className)}
      >
        {sendet ? (
          <Loader2
            className="h-4 w-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
        ) : gepostet ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {sendet
          ? "Wird gepostet …"
          : gepostet
            ? "Auf Instagram gepostet"
            : "Auf Instagram posten"}
      </button>

      <Blatt
        offen={offen}
        schliessbar={!(phase.p === "laeuft" && phase.gesendet)}
        titel={titel}
        titelId={titelId}
        kopf={kopf}
        onZu={zu}
      >
        {offen ? (
          <>
            {phase.p === "wahl" ? (
              <div>
                {/* Verbindung */}
                {stand.laedt ? (
                  <p className="text-muted-foreground mt-1 flex items-center gap-2 text-[14px] leading-5">
                    <Loader2
                      className="h-4 w-4 motion-safe:animate-spin"
                      aria-hidden="true"
                    />
                    Verbindung wird geprüft …
                  </p>
                ) : st === null ? (
                  <p className="text-muted-foreground mt-1 text-[14px] leading-5">
                    Der Stand der Verbindung ist gerade unbekannt. Du kannst es
                    trotzdem versuchen.
                  </p>
                ) : st.verbunden ? (
                  <p className="text-muted-foreground mt-1 text-[14px] leading-5">
                    {konto ? (
                      <>
                        Konto:{" "}
                        <span className="text-foreground font-medium">
                          @{konto}
                        </span>
                      </>
                    ) : (
                      "Instagram ist verbunden."
                    )}
                    {frei !== null && st.kontingent
                      ? ` · Heute noch ${frei} von ${st.kontingent.gesamt} Beiträgen frei.`
                      : null}
                  </p>
                ) : null}
                {st?.verbunden && st.problem ? (
                  <p className={cn(KASTEN, "border-gold mt-2")}>
                    {st.problem}{" "}
                    <Link
                      href="/admin/instagram"
                      className="font-medium underline underline-offset-2"
                    >
                      Verbindung ansehen
                    </Link>
                  </p>
                ) : null}

                {nichtVerbunden ? (
                  <div className="mt-2">
                    <p className="text-[15px] leading-6">
                      {st.grund === "kein_speicher"
                        ? "Instagram ist fast eingerichtet: Es fehlt noch der Speicher für die Bilder."
                        : "Instagram ist noch nicht verbunden. Einmal einrichten, dann gehen Serien und Posts von hier direkt raus."}
                    </p>
                    <Link
                      href="/admin/instagram"
                      className={cn(DUNKEL, "mt-3 w-full sm:w-auto")}
                    >
                      Instagram verbinden
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <p className="text-muted-foreground mt-3 text-[14px] leading-5">
                      Bis dahin geht es wie bisher: „
                      {serie ? "Alle Bilder teilen" : "Bild teilen"}“ antippen
                      und in Instagram posten.
                    </p>
                  </div>
                ) : (
                  <>
                    {spuren.map((sp) => (
                      <p
                        key={sp.art}
                        className={cn(KASTEN, "border-gold mt-2 font-medium")}
                      >
                        {spurSatz(sp)}
                      </p>
                    ))}
                    <div
                      role="group"
                      aria-label="Wie posten?"
                      className="border-border mt-3 grid grid-cols-2 rounded-[3px] border p-0.5"
                    >
                      {(
                        [
                          ["story", serie ? `${anzahl} Stories` : "Story"],
                          ["beitrag", serie ? "Als Karussell" : "Beitrag"],
                        ] as const
                      ).map(([wert, label]) => (
                        <button
                          key={wert}
                          type="button"
                          aria-pressed={art === wert}
                          onClick={() => setArt(wert)}
                          className={cn(
                            "h-11 rounded-[2px] text-[14px] font-medium transition-colors",
                            art === wert && "bg-foreground text-background",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-2 text-[14px] leading-5">
                      {art === "story"
                        ? anzahl > 1
                          ? "Jedes Bild wird eine eigene Story, in dieser Reihenfolge (9:16)."
                          : "Eine Story im Format 9:16."
                        : anzahl > 1
                          ? "Ein Beitrag zum Durchwischen, alle Bilder im Format 4:5."
                          : "Ein Beitrag im Feed, im Format 4:5."}
                    </p>
                    <Bildreihe karten={karten} versatz={versatz} art={art} />

                    {art === "beitrag" ? (
                      <div className="mt-3">
                        <label
                          htmlFor={feldId}
                          className="mb-1 block text-[14px] font-medium"
                        >
                          Bildunterschrift
                        </label>
                        <textarea
                          id={feldId}
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          maxLength={CAPTION_MAX}
                          rows={6}
                          aria-describedby={`${feldId}-zaehler`}
                          className="border-border bg-card focus:border-foreground/60 block w-full resize-y rounded-[4px] border px-3 py-2.5 text-base leading-snug outline-none"
                        />
                        <p
                          id={`${feldId}-zaehler`}
                          className={cn(
                            "mt-1 text-[13px] tabular-nums",
                            hashtagsIn(caption).length > HASHTAGS_MAX
                              ? "text-ink-olive font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {captionLaenge(caption)} von {CAPTION_MAX} Zeichen ·{" "}
                          {hashtagsIn(caption).length} von {HASHTAGS_MAX}{" "}
                          Hashtags
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-2 text-[14px] leading-5">
                        Stories zeigen keine Bildunterschrift. Die Sätze stehen
                        ja im Bild.
                      </p>
                    )}

                    {problem ? (
                      <p
                        role="alert"
                        className="text-ink-olive mt-3 text-[14px]"
                      >
                        {problem}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      disabled={problem !== null}
                      onClick={() => {
                        setSchnapp({
                          karten: [...karten],
                          versatz,
                          art,
                          caption: art === "beitrag" ? caption : "",
                          quelle,
                        });
                        wechsel({
                          p: "frage",
                          ab: 0,
                          links: [],
                          nachUnklar: false,
                          vorher: null,
                        });
                      }}
                      className={cn(DUNKEL, "mt-3 w-full sm:w-auto sm:px-6")}
                    >
                      Weiter
                    </button>
                    <p
                      role="status"
                      className="text-muted-foreground mt-2 min-h-5 text-[14px]"
                    >
                      {phase.notiz}
                    </p>
                  </>
                )}
              </div>
            ) : null}

            {phase.p === "frage" && s ? (
              <div>
                <p className="mt-1 text-[15px] leading-6">
                  {phase.ab > 0
                    ? `${storyBereich(phase.ab + 1, s.karten.length)} von ${s.karten.length}, in dieser Reihenfolge.`
                    : `${artText(s.art, s.karten.length)}${s.karten.length > 1 ? ", in dieser Reihenfolge" : ""}.`}
                </p>
                <Bildreihe
                  karten={s.karten}
                  versatz={s.versatz}
                  art={s.art}
                  ab={phase.ab}
                />
                {s.art === "beitrag" ? (
                  s.caption.trim() ? (
                    <div className="mt-2">
                      <p className="text-[14px] font-medium">
                        Bildunterschrift
                      </p>
                      <p className="text-muted-foreground line-clamp-4 text-[14px] leading-5 whitespace-pre-line">
                        {s.caption}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-2 text-[14px]">
                      Ohne Bildunterschrift.
                    </p>
                  )
                ) : null}
                {phase.ab > 0 ? (
                  <p className={cn(KASTEN, "border-gold mt-3 font-medium")}>
                    {phase.ab === 1
                      ? "Story 1 ist schon live."
                      : `${storyBereich(1, phase.ab)} sind schon live.`}{" "}
                    Schau vorher in Instagram nach, dass dort wirklich nur{" "}
                    {phase.ab === 1 ? "diese eine" : `diese ${phase.ab}`} zu
                    sehen {phase.ab === 1 ? "ist" : "sind"}.
                  </p>
                ) : null}
                {phase.nachUnklar ? (
                  <p className={cn(KASTEN, "border-gold mt-3 font-medium")}>
                    Beim letzten Versuch ist die Verbindung abgerissen. Schau
                    vorher in Instagram nach, ob schon etwas gepostet ist.
                  </p>
                ) : null}
                {phase.ab === 0 && !phase.nachUnklar
                  ? spuren.map((sp) => (
                      <p
                        key={sp.art}
                        className={cn(KASTEN, "border-gold mt-3 font-medium")}
                      >
                        {spurSatz(sp)}
                      </p>
                    ))
                  : null}
                <p className={cn(KASTEN, "border-border mt-3")}>
                  Das ist öffentlich: Alle, die dir folgen, sehen es sofort.
                  Löschen geht danach nur in der Instagram-App.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => void posten(phase.ab, phase.links)}
                    className={cn(DUNKEL, "px-3")}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Ja, jetzt posten
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      wechsel(phase.vorher ?? { p: "wahl", notiz: null })
                    }
                    className={cn(HELL, "px-3")}
                  >
                    Zurück
                  </button>
                </div>
              </div>
            ) : null}

            {phase.p === "laeuft" ? (
              <div aria-busy="true">
                <ol className="mt-2">
                  {STUDIO_SCHRITTE.map((schritt) => {
                    const zustand = phase.f.staende[schritt];
                    const zaehler = schrittZaehler(phase.f, schritt);
                    return (
                      <li
                        key={schritt}
                        aria-current={zustand === "laeuft" ? "step" : undefined}
                        className="flex min-h-8 items-center gap-2.5 text-[15px]"
                      >
                        {zustand === "fertig" ? (
                          <Check
                            className="text-ink-petrol h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                        ) : zustand === "laeuft" ? (
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
                            zustand === "laeuft" && "font-semibold",
                            zustand === "wartet" && "text-muted-foreground",
                          )}
                        >
                          {STUDIO_SCHRITT_LABEL[schritt]}
                          {zaehler ? (
                            <span className="text-muted-foreground font-normal tabular-nums">
                              {" "}
                              · {zaehler}
                            </span>
                          ) : null}
                        </span>
                        <span className="sr-only">
                          {zustand === "fertig"
                            ? "fertig"
                            : zustand === "laeuft"
                              ? "läuft"
                              : "wartet"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <p
                  aria-live="polite"
                  className="text-muted-foreground mt-1 min-h-5 text-[14px] leading-5"
                >
                  {schrittSatz(phase.f, s?.art ?? art)}
                </p>
                {phase.gesendet ? (
                  <p className={cn(KASTEN, "border-border mt-3")}>
                    Instagram ist dran. Lass die Seite offen, bis es fertig ist.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => abbruch.current?.abort()}
                    className={cn(HELL, "mt-3")}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Abbrechen
                  </button>
                )}
              </div>
            ) : null}

            {phase.p === "fertig" ? (
              <div>
                <p className="mt-1 flex items-start gap-2 text-[15px] leading-6">
                  <CircleCheck
                    className="text-ink-petrol mt-1 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {artText(phase.art, phase.anzahl)}
                    {phase.konto ? ` auf @${phase.konto}` : " auf Instagram"}.
                  </span>
                </p>
                <Links links={phase.links} art={phase.art} />
                {phase.links.length === 0 ? (
                  <p className="text-muted-foreground mt-2 text-[14px] leading-5">
                    {phase.art === "story"
                      ? "Für Stories schickt Instagram keinen Link. Du findest sie oben in deinem Profil."
                      : "Du findest den Beitrag in deinem Profil."}
                  </p>
                ) : null}
                {phase.hinweis ? (
                  <p className={cn(KASTEN, "border-gold mt-3")}>
                    {phase.hinweis}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOffen(false)}
                  className={cn(DUNKEL, "mt-4 w-full sm:w-auto sm:px-6")}
                >
                  Fertig
                </button>
              </div>
            ) : null}

            {phase.p === "fehler" ? (
              <FehlerAnsicht
                phase={phase}
                konto={konto}
                onRest={() =>
                  wechsel({
                    p: "frage",
                    ab: phase.live,
                    links: phase.links,
                    nachUnklar: false,
                    vorher: phase,
                  })
                }
                onNochmal={(nachUnklar) =>
                  wechsel({
                    p: "frage",
                    ab: 0,
                    links: [],
                    nachUnklar,
                    vorher: phase,
                  })
                }
                onZurueck={() => wechsel({ p: "wahl", notiz: null })}
                onZu={() => setOffen(false)}
              />
            ) : null}
          </>
        ) : null}
      </Blatt>
    </>
  );
}

function FehlerAnsicht({
  phase,
  konto,
  onRest,
  onNochmal,
  onZurueck,
  onZu,
}: {
  phase: FehlerPhase;
  konto: string | null;
  onRest: () => void;
  onNochmal: (nachUnklar: boolean) => void;
  onZurueck: () => void;
  onZu: () => void;
}) {
  const { fehler: f, live, anzahl, art, links } = phase;
  const weiter = WEITER[f.code];
  /** Sicher bekannt, was live ist (aus der Fehlerzeile), aber nicht alles. */
  const teil = !f.unklar && live > 0 && live < anzahl;
  const restMoeglich = teil && art === "story" && f.teil !== null;
  const profil = konto ? `https://www.instagram.com/${konto}/` : null;
  const knopf = cn(DUNKEL, "w-full sm:w-auto sm:px-5");
  const leise = cn(HELL, "w-full sm:w-auto sm:px-5");

  return (
    <div>
      <p role="alert" className="mt-1 text-[15px] leading-6">
        {f.text}
      </p>

      {teil ? (
        <div className={cn(KASTEN, "border-gold mt-3")}>
          <p className="font-medium">
            {live} von {artText(art, anzahl)} {live === 1 ? "ist" : "sind"}{" "}
            schon live.
          </p>
          <p className="mt-1">
            Poste nicht alles noch einmal, sonst{" "}
            {live === 1 ? "ist sie" : "sind sie"} doppelt.
            {restMoeglich
              ? ` Du kannst nur die restlichen ${anzahl - live === 1 ? "Story" : `${anzahl - live} Stories`} posten.`
              : " Den Rest postest du am besten von Hand."}
          </p>
          <Links links={links} art={art} />
        </div>
      ) : null}

      {f.unklar ? (
        <div className={cn(KASTEN, "border-gold mt-3")}>
          <p className="font-medium">
            {live > 0
              ? `Mindestens ${live} von ${artText(art, anzahl)} ${live === 1 ? "ist" : "sind"} schon live.`
              : "Vielleicht ist schon etwas live."}
          </p>
          <p className="mt-1">
            Schau in Instagram nach, bevor du es noch einmal versuchst. Sonst
            ist es womöglich doppelt da.
          </p>
          {profil ? (
            <a
              href={profil}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(HELL, "mt-2 px-3")}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Profil auf Instagram öffnen
            </a>
          ) : null}
        </div>
      ) : null}

      {!teil && !f.unklar && !f.sitzung ? (
        <p className="text-muted-foreground mt-2 text-[14px] leading-5">
          {weiter.satz}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {restMoeglich ? (
          <button type="button" onClick={onRest} className={knopf}>
            <Send className="h-4 w-4" aria-hidden="true" />
            Nur die restlichen posten
          </button>
        ) : null}
        {f.sitzung ? (
          <Link href="/admin/login" className={knopf}>
            Neu anmelden
          </Link>
        ) : weiter.schritt === "verbinden" ? (
          <Link href="/admin/instagram" className={teil ? leise : knopf}>
            Instagram-Verbindung ansehen
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
        {!teil && !f.unklar && !f.sitzung && weiter.schritt === "nochmal" ? (
          <button
            type="button"
            onClick={() => onNochmal(false)}
            className={knopf}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Nochmal versuchen
          </button>
        ) : null}
        {!teil && !f.unklar && weiter.schritt === "zurueck" ? (
          <button type="button" onClick={onZurueck} className={knopf}>
            Zurück zur Auswahl
          </button>
        ) : null}
        {f.unklar ? (
          <button
            type="button"
            onClick={() => onNochmal(true)}
            className={leise}
          >
            Trotzdem noch einmal posten
          </button>
        ) : null}
        <button
          type="button"
          onClick={onZu}
          className={
            !restMoeglich &&
            !f.sitzung &&
            !f.unklar &&
            (weiter.schritt === "spaeter" || weiter.schritt === "design")
              ? knopf
              : leise
          }
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
