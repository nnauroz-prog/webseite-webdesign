/**
 * Reine Helfer für die Story-Serien im Story-Studio (/admin/story):
 *
 * - den Antwortstrom der Redaktion lesen (eine JSON-Zeile je Ereignis,
 *   lib/redaktion/vertrag.ts): zeilenLeser, redaktionBeauftragen,
 * - den Stand der vier Arbeitsschritte führen (fortschrittMit),
 * - Serien prüfen, bevor sie gezeichnet werden (serieAusWert),
 * - die Texte einer Serie zum Kopieren (serieAlsText),
 * - ?serie= lesen (parseSerieZiel),
 * - Serien, die sich nur dieses Gerät merkt (lokaleSerienAus).
 *
 * Ohne React und ohne Browser-Zustand, damit die Tests sie laden können
 * (tests/studio-serie.test.ts). Diese Datei lädt auch der Browser.
 */
import type {
  RedaktionAuftrag,
  RedaktionEreignis,
  RedaktionFehlerCode,
  RedaktionSchritt,
} from "@/lib/redaktion/vertrag";
import type { SerieZeile } from "@/lib/serien-store";
import type { Spruch } from "@/lib/sprueche-data";
import type { SerieFolie, SerieRolle, StorySerie } from "@/lib/story-serie";

import {
  AUFTRAG_MAX,
  REDAKTION_PFAD,
  REDAKTION_SCHRITTE,
} from "@/lib/redaktion/vertrag";
import { KICKER, THEMA_LABEL } from "@/lib/sprueche-data";
import {
  ROLLE_LABEL,
  SERIE_MAX,
  SERIE_MIN,
  SERIE_ROLLEN,
} from "@/lib/story-serie";

/** Kam keine brauchbare Antwort (kein Netz, Strom bricht ab). */
export const KEINE_VERBINDUNG =
  "Keine Verbindung zur Redaktion. Versuch es gleich nochmal.";
/** Die Redaktion meldet einen Fehler, aber ohne Satz dazu. */
export const FEHLER_OHNE_TEXT =
  "Das hat nicht geklappt. Versuch es gleich nochmal.";
/** Die Anmeldung ist abgelaufen (die Antwort ist die Login-Seite). */
export const NEU_ANMELDEN = "Bitte neu anmelden.";

/** Längste Zeile im Strom; alles darüber ist keine Antwort der Redaktion. */
const ZEILE_MAX = 200_000;
const HINWEIS_MAX = 240;
const FEHLERTEXT_MAX = 400;

const FEHLER_CODES: readonly RedaktionFehlerCode[] = [
  "kein_schluessel",
  "zu_viele",
  "eingabe",
  "modell",
  "regeln",
  "unbekannt",
];

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function folieAusWert(wert: unknown): SerieFolie | null {
  if (!istObjekt(wert)) return null;
  const { kicker, text, betont, zusatz, thema, rolle } = wert;
  if (
    typeof kicker !== "string" ||
    !(KICKER as readonly string[]).includes(kicker) ||
    typeof thema !== "string" ||
    !Object.hasOwn(THEMA_LABEL, thema) ||
    typeof rolle !== "string" ||
    !(SERIE_ROLLEN as readonly string[]).includes(rolle) ||
    typeof text !== "string" ||
    text.trim() === "" ||
    typeof zusatz !== "string" ||
    zusatz.trim() === "" ||
    typeof betont !== "string"
  )
    return null;
  return {
    kicker: kicker as Spruch["kicker"],
    text,
    betont,
    zusatz,
    thema: thema as Spruch["thema"],
    rolle: rolle as SerieRolle,
  };
}

/**
 * Eine Serie aus einem ungeprüften Wert (Antwortstrom, Gerätespeicher):
 * nur die Form, die der Zeichner braucht (bekannter Kicker, bekanntes
 * Thema, bekannte Aufgabe, drei bis fünf Bilder). Die Text-Regeln prüft
 * die Redaktion auf dem Server (pruefeSerie). Sonst null.
 */
export function serieAusWert(wert: unknown): StorySerie | null {
  if (!istObjekt(wert)) return null;
  const { titel, folien, quelle } = wert;
  if (typeof titel !== "string" || titel.trim() === "") return null;
  if (
    !Array.isArray(folien) ||
    folien.length < SERIE_MIN ||
    folien.length > SERIE_MAX
  )
    return null;
  const bilder: SerieFolie[] = [];
  for (const f of folien as unknown[]) {
    const folie = folieAusWert(f);
    if (!folie) return null;
    bilder.push(folie);
  }
  return {
    titel,
    folien: bilder,
    ...(typeof quelle === "string" && /^https:\/\/\S+$/.test(quelle)
      ? { quelle }
      : {}),
  };
}

/** Eine Zeile des Antwortstroms als Ereignis; null, wenn sie keins ist. */
export function ereignisAusZeile(zeile: string): RedaktionEreignis | null {
  const text = zeile.trim();
  if (text === "" || text[0] !== "{") return null;
  let wert: unknown;
  try {
    wert = JSON.parse(text);
  } catch {
    return null;
  }
  if (!istObjekt(wert)) return null;
  if (wert.typ === "schritt") {
    const { schritt, stand, hinweis } = wert;
    if (
      typeof schritt !== "string" ||
      !(REDAKTION_SCHRITTE as readonly string[]).includes(schritt) ||
      (stand !== "laeuft" && stand !== "fertig")
    )
      return null;
    const satz =
      typeof hinweis === "string" ? hinweis.trim().slice(0, HINWEIS_MAX) : "";
    return {
      typ: "schritt",
      schritt: schritt as RedaktionSchritt,
      stand,
      ...(satz ? { hinweis: satz } : {}),
    };
  }
  if (wert.typ === "serie") {
    const serie = serieAusWert(wert.serie);
    if (!serie) return null;
    const id = typeof wert.id === "string" && wert.id !== "" ? wert.id : null;
    return { typ: "serie", serie, id };
  }
  if (wert.typ === "fehler") {
    const code = FEHLER_CODES.includes(wert.code as RedaktionFehlerCode)
      ? (wert.code as RedaktionFehlerCode)
      : "unbekannt";
    const satz =
      typeof wert.text === "string"
        ? wert.text.trim().slice(0, FEHLERTEXT_MAX)
        : "";
    return { typ: "fehler", code, text: satz || FEHLER_OHNE_TEXT };
  }
  return null;
}

/**
 * Liest den Antwortstrom stückweise: nimmt Stücke entgegen (Bytes oder
 * Text, auch mitten in einer Zeile oder mitten in einem Umlaut geteilt)
 * und gibt die fertigen Ereignisse zurück. Zeilen, die kein Ereignis
 * sind, fallen weg. ende() liefert, was nach dem letzten Zeilenumbruch
 * noch steht.
 */
export function zeilenLeser(): {
  lies: (stueck: Uint8Array | string) => RedaktionEreignis[];
  ende: () => RedaktionEreignis[];
} {
  const dekoder = new TextDecoder();
  let rest = "";
  /** Eine überlange Zeile wird bis zu ihrem Zeilenumbruch übersprungen. */
  let ueberlang = false;
  const aus = (text: string): RedaktionEreignis[] => {
    const ereignisse: RedaktionEreignis[] = [];
    const teile = (rest + text).split("\n");
    rest = teile.pop() ?? "";
    teile.forEach((zeile, i) => {
      if (i === 0 && ueberlang) {
        ueberlang = false;
        return;
      }
      const e = ereignisAusZeile(zeile);
      if (e) ereignisse.push(e);
    });
    if (teile.length > 0) ueberlang = false;
    if (rest.length > ZEILE_MAX) {
      rest = "";
      ueberlang = true;
    }
    return ereignisse;
  };
  return {
    lies: (stueck) =>
      aus(
        typeof stueck === "string"
          ? stueck
          : dekoder.decode(stueck, { stream: true }),
      ),
    ende: () => {
      const letzte = rest + dekoder.decode();
      rest = "";
      if (ueberlang) {
        ueberlang = false;
        return [];
      }
      const e = ereignisAusZeile(letzte);
      return e ? [e] : [];
    },
  };
}

export type SchrittEreignis = Extract<RedaktionEreignis, { typ: "schritt" }>;

/** Wie ein Auftrag ausgegangen ist. */
export type RedaktionAusgang =
  | { art: "serie"; serie: StorySerie; id: string | null }
  | {
      art: "fehler";
      /** „verbindung“: keine Antwort; „sitzung“: Anmeldung abgelaufen. */
      code: RedaktionFehlerCode | "verbindung" | "sitzung";
      text: string;
    }
  | { art: "abbruch" };

const OHNE_ANTWORT: RedaktionAusgang = {
  art: "fehler",
  code: "verbindung",
  text: KEINE_VERBINDUNG,
};

/** Was redaktionBeauftragen von einer Antwort braucht (wie fetch sie gibt). */
type Antwort = Pick<Response, "body" | "redirected" | "url" | "text">;

/**
 * Schickt einen Auftrag an die Redaktion und liest die Antwort mit:
 * Jeder Arbeitsschritt geht sofort an aufSchritt, am Ende steht die
 * Serie oder ein Fehler. Wirft nie: Ohne Netz, bei abgebrochenem Strom
 * oder einer Antwort ohne Serie und ohne Fehlerzeile kommt der Fehler
 * „verbindung“ zurück, nach signal.abort() der Ausgang „abbruch“.
 */
export async function redaktionBeauftragen(
  auftrag: RedaktionAuftrag,
  optionen: {
    signal?: AbortSignal;
    aufSchritt?: (ereignis: SchrittEreignis) => void;
    /** Für Tests: eigener Abruf statt fetch. */
    holen?: (adresse: string, init: RequestInit) => Promise<Antwort>;
  } = {},
): Promise<RedaktionAusgang> {
  const { signal, aufSchritt } = optionen;
  const holen = optionen.holen ?? ((adresse, init) => fetch(adresse, init));
  // In einem Objekt, weil nimm() es aus der Schleife heraus setzt.
  const stand: { ausgang: RedaktionAusgang | null } = { ausgang: null };
  const nimm = (ereignisse: RedaktionEreignis[]) => {
    for (const e of ereignisse) {
      // Nach Serie oder Fehler ist Schluss, was danach kommt, zählt nicht.
      if (stand.ausgang) return;
      if (e.typ === "schritt") aufSchritt?.(e);
      else if (e.typ === "serie")
        stand.ausgang = { art: "serie", serie: e.serie, id: e.id };
      else stand.ausgang = { art: "fehler", code: e.code, text: e.text };
    }
  };
  try {
    const antwort = await holen(REDAKTION_PFAD, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/x-ndjson",
      },
      body: JSON.stringify({
        auftrag: auftrag.auftrag.slice(0, AUFTRAG_MAX),
        datum: auftrag.datum,
      } satisfies RedaktionAuftrag),
      cache: "no-store",
      signal,
    });
    // Abgelaufene Anmeldung: Die Redaktion leitet zum Login um.
    if (antwort.redirected && /\/admin\/login(\?|$)/.test(antwort.url))
      return { art: "fehler", code: "sitzung", text: NEU_ANMELDEN };
    const leser = zeilenLeser();
    if (antwort.body) {
      const strom = antwort.body.getReader();
      try {
        while (!stand.ausgang) {
          const { done, value } = await strom.read();
          if (done) break;
          nimm(leser.lies(value));
        }
      } finally {
        void strom.cancel().catch(() => undefined);
      }
    } else {
      nimm(leser.lies(await antwort.text()));
    }
    nimm(leser.ende());
  } catch {
    if (signal?.aborted) return { art: "abbruch" };
    // Die Serie war schon da, bevor der Strom riss: Sie zählt.
    return stand.ausgang ?? OHNE_ANTWORT;
  }
  if (signal?.aborted && !stand.ausgang) return { art: "abbruch" };
  return stand.ausgang ?? OHNE_ANTWORT;
}

export type SchrittStand = "wartet" | "laeuft" | "fertig";

/** Stand der vier Arbeitsschritte, während ein Auftrag läuft. */
export type Fortschritt = {
  staende: Record<RedaktionSchritt, SchrittStand>;
  /** Der Schritt, an dem gerade gearbeitet wird (oder der zuletzt fertig wurde). */
  aktiv: RedaktionSchritt | null;
  /** Der Satz der Redaktion zum aktiven Schritt, falls sie einen schickt. */
  hinweis: string | null;
};

export function fortschrittNeu(): Fortschritt {
  return {
    staende: {
      idee: "wartet",
      text: "wartet",
      lektorat: "wartet",
      gestaltung: "wartet",
    },
    aktiv: null,
    hinweis: null,
  };
}

/**
 * Der Stand nach einem Ereignis: Alles vor dem gemeldeten Schritt ist
 * fertig, alles danach wartet (auch wenn das Lektorat den Text noch
 * einmal zurückgibt). Fehlt eine „fertig“-Zeile, stimmt die Liste so
 * trotzdem.
 */
export function fortschrittMit(
  bisher: Fortschritt,
  ereignis: SchrittEreignis,
): Fortschritt {
  const stelle = REDAKTION_SCHRITTE.indexOf(ereignis.schritt);
  const staende = { ...bisher.staende };
  REDAKTION_SCHRITTE.forEach((schritt, i) => {
    staende[schritt] =
      i < stelle ? "fertig" : i === stelle ? ereignis.stand : "wartet";
  });
  return {
    staende,
    aktiv: ereignis.schritt,
    hinweis:
      ereignis.hinweis ??
      (bisher.aktiv === ereignis.schritt ? bisher.hinweis : null),
  };
}

/** „1 Bild“, „4 Bilder“. */
export function bilderText(anzahl: number): string {
  return anzahl === 1 ? "1 Bild" : `${anzahl} Bilder`;
}

/**
 * Die Texte aller Bilder einer Serie als einfacher Text zum Kopieren:
 * Titel, dann je Bild Nummer und Aufgabe, Satz und Zusatz.
 */
export function serieAlsText(serie: StorySerie): string {
  const bilder = serie.folien.map(
    (f, i) => `Bild ${i + 1} · ${ROLLE_LABEL[f.rolle]}\n${f.text}\n${f.zusatz}`,
  );
  return [serie.titel, ...bilder].join("\n\n");
}

const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

/**
 * „Fr 27.11.“ für einen Kalendertag (yyyy-mm-dd), wie formatShortDay in
 * lib/admin/berlin-time.ts, aber ohne dessen Kalender (auch im Browser).
 */
export function tagKurz(datum: string): string {
  const [y, m, d] = datum.split("-").map(Number);
  const tag = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(tag.getTime())) return datum;
  return `${WOCHENTAGE[tag.getUTCDay()]} ${d}.${m}.`;
}

/** Dateiname eines Bildes der Serie, ohne Endung; sortiert sich nach der Reihenfolge. */
export function serieDateiname(datum: string, nr: number, von: number): string {
  return `sitalo-${datum}-serie-bild-${nr}-von-${von}`;
}

/** Welche Serie ?serie= öffnen soll. */
export type SerieZiel =
  /** Die Serie des Tages; tag (yyyy-mm-dd), wenn die Adresse einen nennt. */
  { art: "tag"; tag: string | null } | { art: "id"; id: string };

/**
 * ?serie= lesen: „tag“ oder „heute“ (Serie des Tages), ein Kalendertag
 * (yyyy-mm-dd, Serie dieses Tages) oder die Kennung eines Auftrags.
 */
export function parseSerieZiel(roh: unknown): SerieZiel | null {
  if (typeof roh !== "string") return null;
  if (roh === "tag" || roh === "heute") return { art: "tag", tag: null };
  if (/^\d{4}-\d{2}-\d{2}$/.test(roh)) {
    const [y, m, d] = roh.split("-").map(Number);
    const t = new Date(Date.UTC(y, m - 1, d));
    const echt =
      t.getUTCFullYear() === y &&
      t.getUTCMonth() === m - 1 &&
      t.getUTCDate() === d;
    return echt ? { art: "tag", tag: roh } : null;
  }
  return /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(roh)
    ? { art: "id", id: roh }
    : null;
}

/** Vorsilbe der Kennung einer Serie, die sich nur dieses Gerät merkt. */
export const GERAET_ID = "geraet-";
/** So viele Serien merkt sich ein Gerät höchstens. */
export const LOKAL_MAX = 10;

export function istLokal(id: string): boolean {
  return id.startsWith(GERAET_ID);
}

function zeileAusWert(wert: unknown): SerieZeile | null {
  if (!istObjekt(wert)) return null;
  const { id, created_at, datum, auftrag, gepostet_at } = wert;
  const serie = serieAusWert(wert.serie);
  if (
    !serie ||
    typeof id !== "string" ||
    !istLokal(id) ||
    typeof created_at !== "string" ||
    Number.isNaN(Date.parse(created_at)) ||
    typeof datum !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(datum) ||
    typeof auftrag !== "string" ||
    (gepostet_at !== null && typeof gepostet_at !== "string")
  )
    return null;
  return {
    id,
    created_at,
    datum,
    auftrag: auftrag.slice(0, AUFTRAG_MAX),
    serie,
    gepostet_at,
  };
}

/**
 * Die Serien, die sich dieses Gerät gemerkt hat, aus dem Rohtext des
 * Speichers. Kaputte oder fremde Einträge fallen weg.
 */
export function lokaleSerienAus(roh: string | null | undefined): SerieZeile[] {
  if (!roh) return [];
  let wert: unknown;
  try {
    wert = JSON.parse(roh);
  } catch {
    return [];
  }
  if (!Array.isArray(wert)) return [];
  const zeilen: SerieZeile[] = [];
  for (const w of wert as unknown[]) {
    const zeile = zeileAusWert(w);
    if (zeile && !zeilen.some((z) => z.id === zeile.id)) zeilen.push(zeile);
  }
  return zeilen.slice(0, LOKAL_MAX);
}

/** Eine frische Serie als Eintrag für den Gerätespeicher. */
export function lokaleZeile(
  serie: StorySerie,
  auftrag: string,
  datum: string,
  jetzt: Date,
): SerieZeile {
  return {
    id: `${GERAET_ID}${jetzt.getTime().toString(36)}`,
    created_at: jetzt.toISOString(),
    datum,
    auftrag: auftrag.slice(0, AUFTRAG_MAX),
    serie,
    gepostet_at: null,
  };
}

/** Neueste zuerst, höchstens LOKAL_MAX; eine gleiche Kennung wird ersetzt. */
export function lokaleSerienMit(
  bisher: readonly SerieZeile[],
  neu: SerieZeile,
): SerieZeile[] {
  return [neu, ...bisher.filter((z) => z.id !== neu.id)].slice(0, LOKAL_MAX);
}
