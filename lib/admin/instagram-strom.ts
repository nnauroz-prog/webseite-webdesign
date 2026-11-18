/**
 * Reine Helfer fürs Posten auf Instagram aus dem Story-Studio
 * (app/admin/story/instagram-posten.tsx), nach dem Vertrag in
 * lib/instagram/vertrag.ts:
 *
 * - den Antwortstrom der Route lesen (eine JSON-Zeile je Ereignis, auch
 *   mitten in einem Umlaut geteilt): zeilenLeser, postSenden,
 * - den Fortschritt führen, vom Zeichnen der Bilder bis zum
 *   Veröffentlichen (fortschrittMit),
 * - Fehler in einfache Sätze mit einem nächsten Schritt übersetzen,
 * - die Bildunterschrift vorbereiten und prüfen (Hashtags, Länge),
 * - sich auf diesem Gerät merken, was schon gepostet ist (spurenAus),
 *   damit nichts aus Versehen doppelt rausgeht.
 *
 * Großzügig beim Lesen wie lib/admin/studio-serie.ts für die Redaktion:
 * Unbekannte Zeilen fallen weg, fehlende Sätze bekommen einen Ersatz,
 * Links zählen nur, wenn sie zu Instagram führen. Ohne React und ohne
 * Browser-Zustand, damit die Tests sie laden können
 * (tests/instagram-strom.test.ts). Diese Datei lädt auch der Browser.
 */
import type {
  InstagramArt,
  InstagramStand,
  PostAuftrag,
  PostEreignis,
  PostFehlerCode,
  PostQuelle,
  PostSchritt,
} from "@/lib/instagram/vertrag";
import type { StorySerie } from "@/lib/story-serie";

import {
  BILDER_MAX,
  CAPTION_MAX,
  HASHTAGS_MAX,
  INSTAGRAM_ARTEN,
  INSTAGRAM_POSTEN_PFAD,
  KARUSSELL_MAX,
  POST_SCHRITT_LABEL,
  POST_SCHRITTE,
} from "@/lib/instagram/vertrag";
import { storyBeschriftung } from "@/lib/sprueche-data";

/** Kam keine brauchbare Antwort, bevor etwas losging. */
export const KEINE_VERBINDUNG =
  "Keine Verbindung. Prüf das Netz und versuch es gleich nochmal.";
/** Die Anmeldung ist abgelaufen (die Antwort ist die Login-Seite). */
export const NEU_ANMELDEN = "Bitte neu anmelden.";
/** Der Strom riss ab, bevor die letzte Zeile kam. */
export const UNKLAR =
  "Die Verbindung ist abgerissen, bevor Instagram fertig war. Vielleicht ist schon etwas gepostet.";

/** Längste Zeile im Strom; alles darüber ist keine Antwort der Route. */
const ZEILE_MAX = 20_000;
const TEXT_MAX = 400;
const LINKS_MAX = BILDER_MAX;

const FEHLER_CODES: readonly PostFehlerCode[] = [
  "nicht_verbunden",
  "zugang",
  "eingabe",
  "limit",
  "bild",
  "konto",
  "instagram",
  "unbekannt",
];

/** Satz, wenn die Route zu einem Fehler keinen eigenen mitschickt. */
export const FEHLER_TEXT: Record<PostFehlerCode, string> = {
  nicht_verbunden: "Instagram ist noch nicht verbunden.",
  zugang:
    "Der Zugang zu Instagram gilt nicht mehr. Er ist abgelaufen, wurde zurückgezogen oder hat nicht die nötigen Rechte.",
  eingabe: "Der Auftrag war nicht vollständig.",
  limit:
    "Instagram nimmt gerade keine weiteren Beiträge an (Tageslimit oder zu viele Versuche).",
  bild: "Instagram hat ein Bild nicht angenommen.",
  konto:
    "Dein Instagram-Konto passt nicht. Es muss ein Business-Konto sein, verbunden mit einer Facebook-Seite.",
  instagram: "Instagram hat einen Fehler gemeldet oder war nicht erreichbar.",
  unbekannt: "Das hat nicht geklappt.",
};

/** Was der Inhaber nach einem Fehler tun kann. */
export type NaechsterSchritt =
  /** Zur Seite /admin/instagram (Verbindung einrichten oder prüfen). */
  | "verbinden"
  /** Später noch einmal (Tageslimit). */
  | "spaeter"
  /** Ein anderes Design wählen. */
  | "design"
  /** Zurück zur Auswahl (Bildunterschrift prüfen). */
  | "zurueck"
  /** Gleich noch einmal versuchen. */
  | "nochmal";

export const WEITER: Record<
  PostFehlerCode,
  { satz: string; schritt: NaechsterSchritt }
> = {
  nicht_verbunden: {
    satz: "Richte die Verbindung einmal ein, dann geht es hier direkt.",
    schritt: "verbinden",
  },
  zugang: {
    satz: "Erzeuge im Meta Business Manager einen neuen Zugangsschlüssel und trag ihn in Vercel ein.",
    schritt: "verbinden",
  },
  konto: {
    satz: "Prüf in der Instagram-App, ob es ein Business-Konto ist und mit deiner Facebook-Seite verbunden ist.",
    schritt: "verbinden",
  },
  limit: {
    satz: "Versuch es in ein paar Stunden noch einmal.",
    schritt: "spaeter",
  },
  bild: {
    satz: "Wähl im Studio ein anderes Design und versuch es dann noch einmal.",
    schritt: "design",
  },
  eingabe: {
    satz: "Prüf die Auswahl (beim Beitrag auch die Bildunterschrift) und versuch es noch einmal. Hilft das nicht, lade die Seite neu.",
    schritt: "zurueck",
  },
  instagram: { satz: "Versuch es gleich noch einmal.", schritt: "nochmal" },
  unbekannt: {
    satz: "Versuch es gleich noch einmal. Hilft das nicht, lade die Seite neu.",
    schritt: "nochmal",
  },
};

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

/** Ganze Zahl ab min, sonst null. */
function ganzzahl(wert: unknown, min: number): number | null {
  return typeof wert === "number" && Number.isInteger(wert) && wert >= min
    ? wert
    : null;
}

/**
 * Ein Link zu Instagram (https, instagram.com oder instagr.am), sonst
 * null. Andere Adressen zeigt das Studio nicht als Link.
 */
export function instagramLink(wert: unknown): string | null {
  if (typeof wert !== "string") return null;
  let url: URL;
  try {
    url = new URL(wert.trim());
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || url.username || url.password) return null;
  return host === "instagram.com" ||
    host.endsWith(".instagram.com") ||
    host === "instagr.am"
    ? url.href
    : null;
}

function linksAus(wert: unknown): string[] {
  if (!Array.isArray(wert)) return [];
  const links: string[] = [];
  for (const w of wert as unknown[]) {
    const link = instagramLink(w);
    if (link && !links.includes(link)) links.push(link);
  }
  return links.slice(0, LINKS_MAX);
}

/** Kontoname ohne @ (Buchstaben, Ziffern, Punkt, Unterstrich), sonst "". */
export function kontoName(wert: unknown): string {
  if (typeof wert !== "string") return "";
  const name = wert.trim().replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(name) ? name : "";
}

function satzAus(wert: unknown): string {
  return typeof wert === "string"
    ? wert.trim().replace(/\s+/g, " ").slice(0, TEXT_MAX)
    : "";
}

/** Eine Zeile des Antwortstroms als Ereignis; null, wenn sie keins ist. */
export function ereignisAusZeile(zeile: string): PostEreignis | null {
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
    const { schritt, stand } = wert;
    if (
      typeof schritt !== "string" ||
      !(POST_SCHRITTE as readonly string[]).includes(schritt) ||
      (stand !== "laeuft" && stand !== "fertig")
    )
      return null;
    const nr = ganzzahl(wert.nr, 1);
    const von = ganzzahl(wert.von, 1);
    // nr/von nur zusammen und stimmig, sonst ohne Zähler.
    const zaehler = nr !== null && von !== null && nr <= von;
    return {
      typ: "schritt",
      schritt: schritt as PostSchritt,
      stand,
      ...(zaehler ? { nr, von } : {}),
    };
  }
  if (wert.typ === "fertig") {
    const hinweis = satzAus(wert.hinweis);
    return {
      typ: "fertig",
      links: linksAus(wert.links),
      konto: kontoName(wert.konto),
      ...(hinweis ? { hinweis } : {}),
    };
  }
  if (wert.typ === "fehler") {
    const code = FEHLER_CODES.includes(wert.code as PostFehlerCode)
      ? (wert.code as PostFehlerCode)
      : "unbekannt";
    const ereignis: PostEreignis = {
      typ: "fehler",
      code,
      text: satzAus(wert.text) || FEHLER_TEXT[code],
    };
    if (istObjekt(wert.teil)) {
      const veroeffentlicht = ganzzahl(wert.teil.veroeffentlicht, 0);
      const von = ganzzahl(wert.teil.von, 1);
      // Nur ein stimmiger Teil zählt; 0 heißt: nichts ist live.
      if (
        veroeffentlicht !== null &&
        von !== null &&
        veroeffentlicht > 0 &&
        veroeffentlicht <= von
      )
        ereignis.teil = {
          veroeffentlicht,
          von,
          links: linksAus(wert.teil.links),
        };
    }
    if (wert.unklar === true) ereignis.unklar = true;
    return ereignis;
  }
  return null;
}

/**
 * Liest einen Strom aus JSON-Zeilen stückweise: nimmt Stücke entgegen
 * (Bytes oder Text, auch mitten in einer Zeile oder mitten in einem
 * Umlaut geteilt) und gibt die fertigen Ereignisse zurück. Zeilen, die
 * kein Ereignis sind, fallen weg; eine überlange Zeile wird bis zu ihrem
 * Zeilenumbruch übersprungen. ende() liefert, was nach dem letzten
 * Zeilenumbruch noch steht.
 */
export function zeilenLeser(): {
  lies: (stueck: Uint8Array | string) => PostEreignis[];
  ende: () => PostEreignis[];
} {
  const dekoder = new TextDecoder();
  let rest = "";
  let ueberlang = false;
  const aus = (text: string): PostEreignis[] => {
    const ereignisse: PostEreignis[] = [];
    const teile = (rest + text).split("\n");
    rest = teile.pop() ?? "";
    teile.forEach((zeile, i) => {
      if (i === 0 && ueberlang) return;
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

export type SchrittEreignis = Extract<PostEreignis, { typ: "schritt" }>;

/** Was schon live ist, wenn ein Fehler kommt (nur bei Stories). */
export type PostTeil = {
  veroeffentlicht: number;
  von: number;
  links: string[];
};

/** Wie ein Auftrag ausgegangen ist. */
export type PostAusgang =
  | { art: "fertig"; links: string[]; konto: string; hinweis: string | null }
  | {
      art: "fehler";
      code: PostFehlerCode;
      text: string;
      /** Schon veröffentlichte Stories (aus der Fehlerzeile), sonst null. */
      teil: PostTeil | null;
      /**
       * Ob schon (mehr) veröffentlicht ist, weiß niemand: Der Auftrag war
       * unterwegs, aber die letzte Zeile kam nie, oder der Server meldet
       * selbst unklar (Instagram hat nicht geantwortet). teil nennt dann,
       * was sicher live ist.
       */
      unklar: boolean;
      /** Die Anmeldung ist abgelaufen (die Antwort war die Login-Seite). */
      sitzung: boolean;
    };

/** Was postSenden von einer Antwort braucht (wie fetch sie gibt). */
type Antwort = Pick<
  Response,
  "body" | "ok" | "status" | "headers" | "redirected" | "url" | "text"
>;

function fehler(
  code: PostFehlerCode,
  text: string,
  extra: Partial<Extract<PostAusgang, { art: "fehler" }>> = {},
): PostAusgang {
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

/**
 * Schickt den Auftrag an die Route und liest die Antwort mit: Jeder
 * Schritt geht sofort an aufSchritt, am Ende steht „fertig“ oder ein
 * Fehler. Wirft nie.
 *
 * - Antwort ohne 2xx oder mit anderem Inhaltstyp (etwa die Login-Seite):
 *   Code „unbekannt“ (Vertrag), nach abgelaufener Anmeldung mit sitzung.
 * - Strom endet oder reißt ab ohne letzte Zeile, oder der Abruf scheitert,
 *   nachdem er losgeschickt war: Fehler mit unklar = true. Dann kann
 *   schon etwas veröffentlicht sein; teil nennt, was die Schritte sicher
 *   gemeldet haben.
 */
export async function postSenden(
  auftrag: PostAuftrag,
  optionen: {
    signal?: AbortSignal;
    aufSchritt?: (ereignis: SchrittEreignis) => void;
    /** Für Tests: eigener Abruf statt fetch. */
    holen?: (adresse: string, init: RequestInit) => Promise<Antwort>;
  } = {},
): Promise<PostAusgang> {
  const { signal, aufSchritt } = optionen;
  const holen = optionen.holen ?? ((adresse, init) => fetch(adresse, init));
  const stand: { ausgang: PostAusgang | null; live: number; von: number } = {
    ausgang: null,
    live: 0,
    von: 0,
  };
  const nimm = (ereignisse: PostEreignis[]) => {
    for (const e of ereignisse) {
      // Nach „fertig“ oder „fehler“ ist Schluss (Vertrag).
      if (stand.ausgang) return;
      if (e.typ === "schritt") {
        if (
          e.schritt === "veroeffentlichen" &&
          e.stand === "fertig" &&
          e.nr !== undefined &&
          e.von !== undefined
        ) {
          stand.live = Math.max(stand.live, e.nr);
          stand.von = e.von;
        }
        aufSchritt?.(e);
      } else if (e.typ === "fertig")
        stand.ausgang = {
          art: "fertig",
          links: e.links,
          konto: e.konto,
          hinweis: e.hinweis ?? null,
        };
      else
        stand.ausgang = fehler(e.code, e.text, {
          teil: e.teil
            ? {
                veroeffentlicht: e.teil.veroeffentlicht,
                von: e.teil.von,
                links: e.teil.links,
              }
            : null,
          unklar: e.unklar === true,
        });
    }
  };
  /** Ohne letzte Zeile: Was die Schritte sicher gemeldet haben, zählt. */
  const ohneEnde = (): PostAusgang =>
    fehler("unbekannt", UNKLAR, {
      unklar: true,
      teil:
        stand.live > 0
          ? { veroeffentlicht: stand.live, von: stand.von, links: [] }
          : null,
    });

  let antwort: Antwort;
  try {
    antwort = await holen(INSTAGRAM_POSTEN_PFAD, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/x-ndjson",
      },
      body: JSON.stringify(auftrag),
      cache: "no-store",
      signal,
    });
  } catch {
    // Unterwegs verloren: Ob die Route ihn bekommen hat, ist offen.
    return ohneEnde();
  }
  if (antwort.redirected && /\/admin\/login(\?|$)/.test(antwort.url))
    return fehler("unbekannt", NEU_ANMELDEN, { sitzung: true });
  const typ = antwort.headers.get("content-type") ?? "";
  if (!antwort.ok || !/^application\/x-ndjson\b/i.test(typ)) {
    void antwort.body?.cancel().catch(() => undefined);
    return fehler("unbekannt", FEHLER_TEXT.unbekannt);
  }
  const leser = zeilenLeser();
  try {
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
    // Strom gerissen: Was schon da war, zählt.
  }
  return stand.ausgang ?? ohneEnde();
}

/** Alle Schritte, die das Studio zeigt: erst im Browser, dann auf dem Server. */
export const STUDIO_SCHRITTE = [
  "bilder",
  "hochladen",
  ...POST_SCHRITTE,
] as const;
export type StudioSchritt = (typeof STUDIO_SCHRITTE)[number];

export const STUDIO_SCHRITT_LABEL: Record<StudioSchritt, string> = {
  bilder: "Bilder erstellen",
  hochladen: "Bilder hochladen",
  ...POST_SCHRITT_LABEL,
};

export type SchrittStand = "wartet" | "laeuft" | "fertig";

export type Fortschritt = {
  staende: Record<StudioSchritt, SchrittStand>;
  /** Der Schritt, an dem gerade gearbeitet wird (oder der zuletzt fertig wurde). */
  aktiv: StudioSchritt | null;
  /** Zähler zum aktiven Schritt (Bild 2 von 4, Story 3 von 4), sonst null. */
  nr: number | null;
  von: number | null;
};

export type FortschrittEreignis = {
  schritt: StudioSchritt;
  stand: "laeuft" | "fertig";
  nr?: number;
  von?: number;
};

export function fortschrittNeu(): Fortschritt {
  return {
    staende: {
      bilder: "wartet",
      hochladen: "wartet",
      pruefen: "wartet",
      vorbereiten: "wartet",
      veroeffentlichen: "wartet",
    },
    aktiv: null,
    nr: null,
    von: null,
  };
}

/**
 * Der Stand nach einem Ereignis: Alles vor dem gemeldeten Schritt ist
 * fertig, alles danach wartet. Fehlt eine Zeile, stimmt die Liste so
 * trotzdem. Ein Zähler gilt, bis der Schritt wechselt.
 */
export function fortschrittMit(
  bisher: Fortschritt,
  e: FortschrittEreignis,
): Fortschritt {
  const stelle = STUDIO_SCHRITTE.indexOf(e.schritt);
  const staende = { ...bisher.staende };
  STUDIO_SCHRITTE.forEach((schritt, i) => {
    staende[schritt] =
      i < stelle ? "fertig" : i === stelle ? e.stand : "wartet";
  });
  const gleich = bisher.aktiv === e.schritt;
  const zaehler = e.nr !== undefined && e.von !== undefined;
  return {
    staende,
    aktiv: e.schritt,
    nr: zaehler ? (e.nr ?? null) : gleich ? bisher.nr : null,
    von: zaehler ? (e.von ?? null) : gleich ? bisher.von : null,
  };
}

/** Zähler hinter einem Schritt („2 von 4“), nur am aktiven Schritt. */
export function schrittZaehler(
  f: Fortschritt,
  schritt: StudioSchritt,
): string | null {
  return f.aktiv === schritt && f.nr !== null && f.von !== null && f.von > 1
    ? `${f.nr} von ${f.von}`
    : null;
}

/** Ein Satz zum aktiven Schritt, für Screenreader und die Zeile darunter. */
export function schrittSatz(f: Fortschritt, art: InstagramArt): string {
  const zaehler =
    f.nr !== null && f.von !== null && f.von > 1 ? ` ${f.nr} von ${f.von}` : "";
  switch (f.aktiv) {
    case "bilder":
      return `Bild${zaehler} entsteht.`;
    case "hochladen":
      return `Bild${zaehler} wird hochgeladen.`;
    case "pruefen":
      return "Die Verbindung zu Instagram wird geprüft.";
    case "vorbereiten":
      return "Instagram holt sich die Bilder.";
    case "veroeffentlichen":
      return art === "story" && zaehler
        ? `Story${zaehler} wird veröffentlicht.`
        : "Wird veröffentlicht.";
    default:
      return "Geht los.";
  }
}

/** „4 Stories“, „1 Story“, „1 Beitrag“, „Karussell mit 4 Bildern“. */
export function artText(art: InstagramArt, anzahl: number): string {
  if (art === "story") return anzahl === 1 ? "1 Story" : `${anzahl} Stories`;
  return anzahl === 1 ? "1 Beitrag" : `Karussell mit ${anzahl} Bildern`;
}

/** Beschriftung eines Links im Ergebnis. */
export function linkText(i: number, anzahl: number, art: InstagramArt): string {
  if (anzahl <= 1) return "Auf Instagram ansehen";
  return `${art === "story" ? "Story" : "Beitrag"} ${i + 1} ansehen`;
}

/** Passt die Zahl der Bilder zur Art? Sonst ein Satz, warum nicht. */
export function auftragProblem(
  art: InstagramArt,
  anzahl: number,
): string | null {
  if (!INSTAGRAM_ARTEN.includes(art)) return "Unbekannte Art.";
  if (anzahl < 1) return "Es gibt keine Bilder zum Posten.";
  if (anzahl > BILDER_MAX) return `Höchstens ${BILDER_MAX} Bilder auf einmal.`;
  if (art === "beitrag" && anzahl > KARUSSELL_MAX)
    return `Ein Karussell hat höchstens ${KARUSSELL_MAX} Bilder.`;
  return null;
}

/** Freie Beiträge im Kontingent von Instagram, falls bekannt. */
export function kontingentFrei(stand: InstagramStand | null): number | null {
  if (!stand?.verbunden || !stand.kontingent) return null;
  const { genutzt, gesamt } = stand.kontingent;
  return Math.max(0, gesamt - genutzt);
}

/**
 * Der Auftrag für die Route. Bei Stories geht keine Bildunterschrift mit
 * (Vertrag), beim Beitrag immer (auch leer).
 */
export function postAuftrag(
  art: InstagramArt,
  bilder: string[],
  caption: string,
  quelle: PostQuelle,
): PostAuftrag {
  return {
    art,
    bilder,
    caption: art === "story" ? "" : caption.trim(),
    quelle,
  };
}

/* ---------- Wege nach einem Fehler ---------- */

/** Was nach einem Fehler feststeht (Studio: Phase „fehler“). */
export type FehlerStand = {
  art: InstagramArt;
  /** Bilder der ganzen Serie. */
  anzahl: number;
  /** So viele sind sicher live (mit denen aus früheren Versuchen). */
  live: number;
  /** Ob (mehr) online ist, ist offen. */
  unklar: boolean;
};

/**
 * Welche Wege das Blatt nach einem Fehler anbietet, damit nichts doppelt
 * rausgeht:
 * - teil: sicher ist ein Teil live, nicht alles (kein „Nochmal“ für alles).
 * - rest: „Nur die restlichen posten“ (Stories). Gilt auch, wenn erst der
 *   letzte Versuch nichts veröffentlicht hat: Was vorher live war, steht
 *   fest.
 * - allesLive: unklar, aber laut den Schritten ist schon alles live.
 * - nochmalAb: Ab hier beginnt ein neuer Versuch nach einem unklaren
 *   Ergebnis (nach den Stories, die sicher live sind).
 * - bleibt: Das Ergebnis bleibt beim nächsten Öffnen stehen.
 */
export function fehlerWege(f: FehlerStand): {
  teil: boolean;
  rest: boolean;
  allesLive: boolean;
  nochmalAb: number;
  bleibt: boolean;
} {
  const story = f.art === "story";
  const teil = !f.unklar && f.live > 0 && f.live < f.anzahl;
  return {
    teil,
    rest: teil && story,
    allesLive: f.unklar && story && f.live >= f.anzahl,
    nochmalAb:
      f.unklar && story ? Math.max(0, Math.min(f.live, f.anzahl - 1)) : 0,
    bleibt: f.live > 0 || f.unklar,
  };
}

/* ---------- Bildunterschrift ---------- */

/** Ein Hashtag: # mit Buchstaben, Ziffern oder _, nicht mitten im Wort. */
const HASHTAG = /(^|[^\p{L}\p{N}_&#])(#[\p{L}\p{N}_]+)/gu;

/** Die Hashtags eines Textes, in der Reihenfolge (auch doppelte). */
export function hashtagsIn(text: string): string[] {
  return [...text.matchAll(HASHTAG)].map((m) => m[2]);
}

/** Schneidet nach höchstens max UTF-16-Zeichen ab, ohne ein Emoji zu teilen. */
function kuerzen(text: string, max: number): string {
  if (text.length <= max) return text;
  let ende = max;
  const code = text.charCodeAt(ende - 1);
  if (code >= 0xd800 && code <= 0xdbff) ende -= 1;
  return text.slice(0, ende);
}

/**
 * Bildunterschrift zum Vorbelegen: Hashtags nach dem fünften fallen weg
 * (HASHTAGS_MAX), höchstens CAPTION_MAX Zeichen, ohne Leerzeichen am
 * Zeilenende.
 */
export function captionKappen(text: string): string {
  let n = 0;
  const ohne = text.replace(HASHTAG, (voll, davor: string) => {
    n += 1;
    return n <= HASHTAGS_MAX ? voll : davor;
  });
  const sauber = ohne
    .replace(/[ \t]+$/gm, "")
    .replace(/ {2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return kuerzen(sauber, CAPTION_MAX).trim();
}

/** Zeichen zählen wie das Textfeld (maxLength zählt UTF-16-Einheiten). */
export function captionLaenge(text: string): number {
  return text.length;
}

/** Was an der Bildunterschrift nicht passt, sonst null. */
export function captionProblem(text: string): string | null {
  const tags = hashtagsIn(text).length;
  if (captionLaenge(text) > CAPTION_MAX)
    return `Höchstens ${CAPTION_MAX} Zeichen (jetzt ${captionLaenge(text)}).`;
  if (tags > HASHTAGS_MAX)
    return `Höchstens ${HASHTAGS_MAX} Hashtags (jetzt ${tags}). Lösch ${tags - HASHTAGS_MAX === 1 ? "einen" : tags - HASHTAGS_MAX}.`;
  return null;
}

/**
 * Bildunterschrift für eine Serie als Karussell: Titel, dann je Bild Satz
 * und Zusatz (wie serieAlsText, aber ohne die Aufgaben der Bilder, die
 * nur fürs Studio sind), dazu die Hashtags wie beim Beitrag des Tages.
 */
export function serieAlsCaption(serie: StorySerie): string {
  const erste = serie.folien[0];
  const tags = erste
    ? (storyBeschriftung(erste).split("\n\n").pop() ?? "")
    : "";
  const bilder = serie.folien.map((f) => `${f.text}\n${f.zusatz}`);
  return captionKappen(
    [serie.titel, ...bilder, ...(tags.startsWith("#") ? [tags] : [])].join(
      "\n\n",
    ),
  );
}

/* ---------- Was dieses Gerät schon gepostet hat ---------- */

/** Ein Post, den dieses Gerät abgeschickt hat (Schutz vor Doppeltem). */
export type PostSpur = {
  /** quelleSchluessel der Quelle. */
  schluessel: string;
  art: InstagramArt;
  /** Bilder im Auftrag (bei „Nur die restlichen“: die ganze Serie). */
  anzahl: number;
  /** Zeitpunkt (ISO). */
  wann: string;
  /** gepostet: alles live; teil: nur live; unklar: Strom abgerissen. */
  ergebnis: "gepostet" | "teil" | "unklar";
  /** So viele Bilder sind sicher live. */
  live: number;
  links: string[];
};

/** So viele Spuren merkt sich ein Gerät höchstens. */
export const SPUREN_MAX = 40;

/**
 * Schlüssel einer Quelle, etwa „serie:2026-11-19:tag“ oder
 * „post:2026-11-19:0“. Eine Serie nur auf diesem Gerät (lokal) hat
 * einen eigenen: lokalSchluessel mit ihrer Kennung auf dem Gerät.
 */
export function quelleSchluessel(q: PostQuelle): string {
  if (q.typ === "post") return `post:${q.datum}:${q.platz}`;
  return `serie:${q.datum}:${q.id ?? (q.lokal ? "lokal" : "tag")}`;
}

/** Schlüssel einer Serie, die nur auf diesem Gerät liegt (Kennung dort). */
export function lokalSchluessel(datum: string, id: string): string {
  return `serie:${datum}:lokal:${id}`.slice(0, 120);
}

/**
 * Eine Spur aus dem Verlauf auf dem Server (Tabelle instagram_posts), damit
 * „schon gepostet“ auch auf anderen Geräten und nach dem Neuladen gilt.
 * Stories mit weniger Kennungen als Bildern zählen als Teil (live: so
 * viele Kennungen), ganz ohne Kennung als unklar. Solche Spuren warnen
 * nur; „Nur die restlichen posten“ bietet das Studio allein aus den
 * genauen Spuren dieses Geräts an.
 */
export function spurAusPost(
  post: {
    created_at: string;
    art: InstagramArt;
    bilder: number;
    media_ids: readonly string[];
    links: readonly string[];
  },
  schluessel: string,
): PostSpur {
  const ids = post.media_ids.length;
  const ergebnis =
    post.art !== "story" || ids >= post.bilder
      ? "gepostet"
      : ids === 0
        ? "unklar"
        : "teil";
  return {
    schluessel,
    art: post.art,
    anzahl: post.bilder,
    wann: post.created_at,
    ergebnis,
    live: ergebnis === "gepostet" ? post.bilder : ids,
    links: linksAus([...post.links]),
  };
}

/**
 * Spuren dieses Geräts und vom Server zusammen: je Art die neueste.
 * gepostet ist true, sobald eine davon „gepostet“ sagt.
 */
export function spurenVereint(
  geraet: readonly PostSpur[],
  server: readonly PostSpur[],
): { spuren: PostSpur[]; gepostet: boolean } {
  const alle = [...geraet, ...server];
  const spuren: PostSpur[] = [];
  for (const art of INSTAGRAM_ARTEN) {
    const neueste = alle
      .filter((sp) => sp.art === art)
      .sort((a, b) => Date.parse(b.wann) - Date.parse(a.wann))[0];
    if (neueste) spuren.push(neueste);
  }
  return {
    spuren,
    gepostet: alle.some((sp) => sp.ergebnis === "gepostet"),
  };
}

/**
 * „Nur die restlichen posten“ aus einer Spur dieses Geräts: Stories,
 * zum Teil (oder unklar) live, für genau diese Zahl Bilder. Sonst null.
 */
export function restAusSpur(
  geraet: readonly PostSpur[],
  anzahl: number,
): PostSpur | null {
  return (
    geraet.find(
      (sp) =>
        sp.art === "story" &&
        (sp.ergebnis === "teil" || sp.ergebnis === "unklar") &&
        sp.live > 0 &&
        sp.live < sp.anzahl &&
        sp.anzahl === anzahl,
    ) ?? null
  );
}

function spurAusWert(wert: unknown): PostSpur | null {
  if (!istObjekt(wert)) return null;
  const { schluessel, art, anzahl, wann, ergebnis, live } = wert;
  if (
    typeof schluessel !== "string" ||
    !/^(serie|post):/.test(schluessel) ||
    schluessel.length > 120 ||
    !INSTAGRAM_ARTEN.includes(art as InstagramArt) ||
    ganzzahl(anzahl, 1) === null ||
    typeof wann !== "string" ||
    Number.isNaN(Date.parse(wann)) ||
    (ergebnis !== "gepostet" && ergebnis !== "teil" && ergebnis !== "unklar") ||
    ganzzahl(live, 0) === null
  )
    return null;
  return {
    schluessel,
    art: art as InstagramArt,
    anzahl: anzahl as number,
    wann,
    ergebnis,
    live: Math.min(live as number, anzahl as number),
    links: linksAus(wert.links),
  };
}

/** Die Spuren aus dem Rohtext des Speichers; Kaputtes fällt weg. */
export function spurenAus(roh: string | null | undefined): PostSpur[] {
  if (!roh) return [];
  let wert: unknown;
  try {
    wert = JSON.parse(roh);
  } catch {
    return [];
  }
  if (!Array.isArray(wert)) return [];
  const spuren: PostSpur[] = [];
  for (const w of wert as unknown[]) {
    const s = spurAusWert(w);
    if (
      s &&
      !spuren.some((x) => x.schluessel === s.schluessel && x.art === s.art)
    )
      spuren.push(s);
  }
  return spuren.slice(0, SPUREN_MAX);
}

/** Neueste zuerst; dieselbe Quelle in derselben Art wird ersetzt. */
export function spurenMit(
  bisher: readonly PostSpur[],
  neu: PostSpur,
): PostSpur[] {
  return [
    neu,
    ...bisher.filter(
      (s) => !(s.schluessel === neu.schluessel && s.art === neu.art),
    ),
  ].slice(0, SPUREN_MAX);
}

const ZEIT = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "numeric",
  month: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** „am 19.11. um 10:42“ */
export function wannText(iso: string): string {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return "";
  const teile = Object.fromEntries(
    ZEIT.formatToParts(t).map((p) => [p.type, p.value]),
  );
  return `am ${teile.day}.${teile.month}. um ${teile.hour}:${teile.minute}`;
}

/** Ein Satz zu einer Spur, als Warnung vor dem nächsten Posten. */
export function spurSatz(s: PostSpur): string {
  const wann = wannText(s.wann);
  if (s.ergebnis === "gepostet")
    return `Schon auf Instagram: ${artText(s.art, s.anzahl)}, ${wann}.`;
  if (s.ergebnis === "teil")
    return `Zum Teil auf Instagram: ${s.live} von ${artText(s.art, s.anzahl)}, ${wann}.`;
  return `Unklar, ob gepostet: ${artText(s.art, s.anzahl)}, ${wann}. Schau in Instagram nach.`;
}
