/**
 * Kleiner Anschluss an die Graph API von Meta (Instagram über Facebook
 * Login). Rein: Zugang (Schlüssel, Version, Adresse) und fetch kommen von
 * außen, damit Tests eine Attrappe benutzen können.
 *
 * - Der Schlüssel geht nur im Header „Authorization: Bearer“ mit, nie in
 *   der Adresse. Parameter stehen bei POST im JSON-Körper.
 * - Fehler von Instagram werden zu InstagramFehler mit einem Code aus dem
 *   Vertrag (PostFehlerCode) und einem Satz für den Inhaber. Die
 *   Rohmeldung von Instagram wird nie weitergegeben: Sie kann die
 *   Bildadresse samt Signatur enthalten.
 * - Kurzfristige Fehler (is_transient, 2207001, 2207032, 24/2207008,
 *   Netz, 5xx ohne Fehlerobjekt) werden einmal nach kurzer Pause
 *   wiederholt, Code 190 (Zugang) nie.
 */
import type { PostFehlerCode } from "@/lib/instagram/vertrag";

/** Was die Graph API braucht. */
export type GraphZugang = {
  token: string;
  /** Etwa „v26.0“. */
  version: string;
  /** Ursprung, etwa https://graph.facebook.com. */
  basis: string;
};

/** Wartet ms Millisekunden; bricht mit InstagramAbbruch ab, wenn signal feuert. */
export type Warte = (ms: number, signal?: AbortSignal) => Promise<void>;

export type GraphOptionen = {
  /** Nur für Tests: anderes fetch. */
  fetch?: typeof fetch;
  /** Abbruch von außen (Frist oder Studio hat die Verbindung geschlossen). */
  signal?: AbortSignal;
  /** Pause vor der einen Wiederholung (Standard 1500 ms). */
  wiederholMs?: number;
  /** Höchstdauer eines einzelnen Aufrufs (Standard 20 s). */
  zeitMs?: number;
  /** Nur für Tests: andere Uhr zum Warten. */
  warte?: Warte;
};

export type GraphAufruf = {
  /** false: auch kurzfristige Fehler nicht wiederholen. */
  wiederholen?: boolean;
  /**
   * null: den Abbruch von außen für diesen Aufruf nicht weiterreichen
   * (Veröffentlichen läuft zu Ende, nur die eigene Höchstdauer gilt).
   */
  signal?: AbortSignal | null;
};

/** Sätze für den Inhaber je Code (Du-Form, einfaches Deutsch). */
export const FEHLER_TEXT: Record<PostFehlerCode, string> = {
  nicht_verbunden:
    "Instagram ist noch nicht verbunden: In Vercel fehlt der Zugangsschlüssel INSTAGRAM_TOKEN aus dem Meta Business Manager.",
  zugang:
    "Instagram lehnt den Zugang ab: Der Zugangsschlüssel ist abgelaufen, widerrufen oder ihm fehlen Rechte. Erstell im Meta Business Manager einen neuen und trag ihn in Vercel ein.",
  eingabe:
    "Der Auftrag passt nicht. Lade die Seite neu und versuch es noch einmal.",
  limit:
    "Instagram lässt gerade nichts mehr zu: Das Tageslimit für Posts ist erreicht oder es waren zu viele Aufrufe. Versuch es später noch einmal.",
  bild: "Instagram konnte ein Bild nicht laden oder lehnt es ab (Größe, Format oder Seitenverhältnis). Versuch es noch einmal.",
  konto:
    "Instagram lässt dieses Konto gerade nicht posten. Es muss ein Business-Konto sein, das mit einer Facebook-Seite verknüpft ist. Schau auch in der Instagram-App nach, ob dort etwas zu bestätigen ist.",
  instagram:
    "Instagram hat einen Fehler gemeldet. Versuch es in ein paar Minuten noch einmal.",
  unbekannt: "Da ist etwas schiefgelaufen. Versuch es gleich noch einmal.",
};

/** Feste Sätze für besondere Fälle. */
export const TEXT_TAGESLIMIT =
  "Für heute ist das Limit von Instagram erreicht. Morgen geht es weiter.";
export const TEXT_NETZ =
  "Instagram ist gerade nicht erreichbar. Versuch es in ein paar Minuten noch einmal.";

/** Ein Fehler beim Aufruf der Graph API, eingeordnet nach dem Vertrag. */
export class InstagramFehler extends Error {
  readonly code: PostFehlerCode;
  /** Satz für den Inhaber. */
  readonly text: string;
  /** Code und Subcode von Meta, falls Instagram geantwortet hat. */
  readonly graphCode: number | null;
  readonly subcode: number | null;
  /** Kennung des Aufrufs bei Meta (für den Support), sonst null. */
  readonly fbtrace: string | null;
  /** HTTP-Status der Antwort, sonst null. */
  readonly status: number | null;
  /** Kurzfristig: Einmal wiederholen lohnt sich. */
  readonly voruebergehend: boolean;
  /** Keine Antwort von Instagram (Netz, Zeit überschritten). */
  readonly netz: boolean;

  constructor(
    code: PostFehlerCode,
    mehr: {
      text?: string;
      graphCode?: number | null;
      subcode?: number | null;
      fbtrace?: string | null;
      status?: number | null;
      voruebergehend?: boolean;
      netz?: boolean;
    } = {},
  ) {
    // Die Meldung enthält nur Codes: nie Adresse, Schlüssel oder Rohtext.
    super(
      `Instagram-Fehler ${code} (${mehr.graphCode ?? "-"}/${mehr.subcode ?? "-"})`,
    );
    this.name = "InstagramFehler";
    this.code = code;
    this.text = mehr.text ?? FEHLER_TEXT[code];
    this.graphCode = mehr.graphCode ?? null;
    this.subcode = mehr.subcode ?? null;
    this.fbtrace = mehr.fbtrace ?? null;
    this.status = mehr.status ?? null;
    this.voruebergehend = mehr.voruebergehend ?? false;
    this.netz = mehr.netz ?? false;
  }
}

/** Der Lauf wurde von außen abgebrochen (Frist oder Studio weg). */
export class InstagramAbbruch extends Error {
  constructor() {
    super("Abgebrochen");
    this.name = "InstagramAbbruch";
  }
}

/** Was Instagram im Fehlerobjekt schickt (nur die Teile, die wir brauchen). */
export type GraphFehlerDaten = {
  code?: number;
  subcode?: number;
  meldung?: string;
  transient?: boolean;
};

const BILD_SUBCODES = new Set([
  2207052, 2207003, 2207004, 2207005, 2207009, 2207010,
]);
const BILD_CODES = new Set([36000, 36001, 36002, 36003, 36004, 9004]);
const LIMIT_CODES = new Set([4, 17, 32, 613, 80002]);
const KONTO_SUBCODES = new Set([2207050, 2207051]);
const VORUEBERGEHEND_SUBCODES = new Set([2207001, 2207032]);
/** Meldungen, die ein ungeeignetes Konto beschreiben (kein Business-Konto). */
const KEIN_BUSINESS = /business[ -]?account|not an? instagram business/i;

/** Ordnet einen Fehler von Instagram einem Code des Vertrags zu. */
export function ordneEin(d: GraphFehlerDaten): PostFehlerCode {
  const code = d.code ?? null;
  const sub = d.subcode ?? null;
  if (code === 190 || code === 102) return "zugang";
  if (
    (sub !== null && KONTO_SUBCODES.has(sub)) ||
    KEIN_BUSINESS.test(d.meldung ?? "")
  )
    return "konto";
  if (sub === 2207042) return "limit";
  if (code !== null && LIMIT_CODES.has(code)) return "limit";
  if (
    (sub !== null && BILD_SUBCODES.has(sub)) ||
    (code !== null && BILD_CODES.has(code))
  )
    return "bild";
  if (code === 10 || (code !== null && code >= 200 && code <= 299))
    return "zugang";
  return "instagram";
}

/** Lohnt es sich, den Aufruf einmal zu wiederholen? 190 nie. */
export function istVoruebergehend(d: GraphFehlerDaten): boolean {
  if (d.code === 190 || d.code === 102) return false;
  if (ordneEin(d) === "limit") return false;
  return (
    d.transient === true ||
    (d.subcode !== undefined && VORUEBERGEHEND_SUBCODES.has(d.subcode)) ||
    (d.code === 24 && d.subcode === 2207008)
  );
}

function zahl(v: unknown): number | undefined {
  return typeof v === "number" && Number.isInteger(v) ? v : undefined;
}

/** Fehlerobjekt einer Antwort → InstagramFehler; null ohne Fehlerobjekt. */
export function fehlerAusAntwort(
  status: number,
  daten: unknown,
): InstagramFehler | null {
  const e =
    daten && typeof daten === "object"
      ? (daten as { error?: unknown }).error
      : undefined;
  if (!e || typeof e !== "object") return null;
  const roh = e as Record<string, unknown>;
  const d: GraphFehlerDaten = {
    code: zahl(roh.code),
    subcode: zahl(roh.error_subcode),
    meldung: [roh.message, roh.error_user_msg, roh.error_user_title]
      .filter((m): m is string => typeof m === "string")
      .join(" "),
    transient: roh.is_transient === true,
  };
  const code = ordneEin(d);
  const fbtrace =
    typeof roh.fbtrace_id === "string" && /^[\w-]{1,64}$/.test(roh.fbtrace_id)
      ? roh.fbtrace_id
      : null;
  return new InstagramFehler(code, {
    text: code === "limit" && d.subcode === 2207042 ? TEXT_TAGESLIMIT : undefined,
    graphCode: d.code ?? null,
    subcode: d.subcode ?? null,
    fbtrace,
    status,
    voruebergehend: istVoruebergehend(d),
  });
}

/** Wartet, bis ms vorbei sind oder signal abbricht (dann InstagramAbbruch). */
export const warte: Warte = (ms, signal) =>
  new Promise<void>((fertig, scheitern) => {
    if (signal?.aborted) {
      scheitern(new InstagramAbbruch());
      return;
    }
    const abbrechen = () => {
      clearTimeout(uhr);
      scheitern(new InstagramAbbruch());
    };
    const uhr = setTimeout(() => {
      signal?.removeEventListener("abort", abbrechen);
      fertig();
    }, ms);
    signal?.addEventListener("abort", abbrechen, { once: true });
  });

/** Pfad in der Graph API: Kennungen und Kanten, nichts anderes. */
const PFAD = /^[A-Za-z0-9_]+(\/[A-Za-z0-9_]+)*$/;

export type GraphParameter = Record<string, string | number | boolean>;

export type Graph = {
  get<T>(pfad: string, query?: GraphParameter, aufruf?: GraphAufruf): Promise<T>;
  post<T>(pfad: string, body: GraphParameter, aufruf?: GraphAufruf): Promise<T>;
};

/** Ein Anschluss an die Graph API mit diesem Zugang. */
export function graph(zugang: GraphZugang, optionen: GraphOptionen = {}): Graph {
  const holen = optionen.fetch ?? fetch;
  const pause = optionen.warte ?? warte;
  const wiederholMs = optionen.wiederholMs ?? 1500;
  const zeitMs = optionen.zeitMs ?? 20_000;
  const aussen = optionen.signal;

  async function einmal<T>(
    methode: "GET" | "POST",
    pfad: string,
    parameter: GraphParameter | undefined,
    signal: AbortSignal | undefined,
  ): Promise<T> {
    const url = new URL(`${zugang.basis}/${zugang.version}/${pfad}`);
    const headers: Record<string, string> = {
      authorization: `Bearer ${zugang.token}`,
      accept: "application/json",
    };
    let body: string | undefined;
    if (methode === "GET") {
      for (const [k, v] of Object.entries(parameter ?? {}))
        url.searchParams.set(k, String(v));
    } else {
      headers["content-type"] = "application/json";
      body = JSON.stringify(parameter ?? {});
    }
    const zeit = AbortSignal.timeout(zeitMs);
    let antwort: Response;
    let text: string;
    try {
      antwort = await holen(url, {
        method: methode,
        headers,
        body,
        signal: signal ? AbortSignal.any([signal, zeit]) : zeit,
        cache: "no-store",
        redirect: "error",
      });
      text = await antwort.text();
    } catch {
      if (signal?.aborted) throw new InstagramAbbruch();
      throw new InstagramFehler("instagram", {
        text: TEXT_NETZ,
        voruebergehend: true,
        netz: true,
      });
    }
    let daten: unknown = null;
    try {
      daten = text ? (JSON.parse(text) as unknown) : null;
    } catch {
      daten = null;
    }
    const fehler = fehlerAusAntwort(antwort.status, daten);
    if (fehler) throw fehler;
    if (!antwort.ok || !daten || typeof daten !== "object")
      throw new InstagramFehler("instagram", {
        status: antwort.status,
        voruebergehend: antwort.status >= 500,
      });
    return daten as T;
  }

  async function aufrufen<T>(
    methode: "GET" | "POST",
    pfad: string,
    parameter: GraphParameter | undefined,
    aufruf: GraphAufruf = {},
  ): Promise<T> {
    if (!PFAD.test(pfad)) throw new InstagramFehler("unbekannt");
    const signal = aufruf.signal === null ? undefined : (aufruf.signal ?? aussen);
    for (let versuch = 0; ; versuch++) {
      if (signal?.aborted) throw new InstagramAbbruch();
      try {
        return await einmal<T>(methode, pfad, parameter, signal);
      } catch (err) {
        if (
          !(err instanceof InstagramFehler) ||
          !err.voruebergehend ||
          err.graphCode === 190 ||
          aufruf.wiederholen === false ||
          versuch >= 1
        )
          throw err;
        await pause(wiederholMs, signal);
      }
    }
  }

  return {
    get: (pfad, query, aufruf) => aufrufen("GET", pfad, query, aufruf),
    post: (pfad, body, aufruf) => aufrufen("POST", pfad, body, aufruf),
  };
}

/** Kennungen bei Meta sind Ziffernfolgen; alles andere wird nicht benutzt. */
export function kennung(v: unknown): string | null {
  return typeof v === "string" && /^\d{1,40}$/.test(v) ? v : null;
}

/** Instagram-Nutzername (ohne @), sonst null. */
export function nutzername(v: unknown): string | null {
  return typeof v === "string" && /^[A-Za-z0-9._]{1,30}$/.test(v) ? v : null;
}

/** Link zu einem Beitrag auf instagram.com, sonst null. */
export function instagramLink(v: unknown): string | null {
  if (typeof v !== "string" || v.length > 300) return null;
  try {
    const url = new URL(v);
    return url.protocol === "https:" &&
      (url.hostname === "instagram.com" ||
        url.hostname === "www.instagram.com")
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export type Konto = { id: string; name: string };

/**
 * Das Instagram-Konto zum Schlüssel: mit kontoId (INSTAGRAM_KONTO_ID)
 * direkt, sonst die erste Facebook-Seite mit verknüpftem Business-Konto
 * (me/accounts). Wirft InstagramFehler („konto“, wenn keins da ist).
 */
export async function kontoFinden(
  g: Graph,
  kontoId: string | null,
): Promise<Konto> {
  let id = kontoId;
  let name: string | null = null;
  if (!id) {
    const seiten = await g.get<{ data?: unknown }>("me/accounts", {
      fields: "name,instagram_business_account{id,username}",
    });
    const liste = Array.isArray(seiten.data) ? seiten.data : [];
    for (const seite of liste) {
      const ig =
        seite && typeof seite === "object"
          ? (seite as { instagram_business_account?: unknown })
              .instagram_business_account
          : undefined;
      if (!ig || typeof ig !== "object") continue;
      const gefunden = kennung((ig as { id?: unknown }).id);
      if (!gefunden) continue;
      id = gefunden;
      name = nutzername((ig as { username?: unknown }).username);
      break;
    }
    if (!id)
      throw new InstagramFehler("konto", {
        text: "Zum Zugangsschlüssel gehört kein Instagram-Business-Konto. Verknüpf das Instagram-Konto mit einer Facebook-Seite und gib dem Systemnutzer Zugriff darauf, oder trag die Kennung des Kontos in Vercel als INSTAGRAM_KONTO_ID ein.",
      });
  }
  if (!name) {
    const konto = await g.get<{ username?: unknown }>(id, {
      fields: "username",
    });
    name = nutzername(konto.username);
  }
  return { id, name: name ?? "" };
}

export type Kontingent = { genutzt: number; gesamt: number };

/**
 * Wie viele Veröffentlichungen in den letzten 24 Stunden genutzt sind und
 * wie viele Instagram erlaubt (50 oder 100, daher zur Laufzeit gelesen).
 * null, wenn die Antwort nicht passt. Wirft InstagramFehler.
 */
export async function kontingentLesen(
  g: Graph,
  igId: string,
): Promise<Kontingent | null> {
  const antwort = await g.get<{ data?: unknown }>(
    `${igId}/content_publishing_limit`,
    { fields: "quota_usage,config" },
  );
  const erstes = Array.isArray(antwort.data) ? antwort.data[0] : undefined;
  if (!erstes || typeof erstes !== "object") return null;
  const e = erstes as { quota_usage?: unknown; config?: unknown };
  const genutzt = e.quota_usage;
  const gesamt =
    e.config && typeof e.config === "object"
      ? (e.config as { quota_total?: unknown }).quota_total
      : undefined;
  if (
    typeof genutzt !== "number" ||
    typeof gesamt !== "number" ||
    !Number.isInteger(genutzt) ||
    !Number.isInteger(gesamt) ||
    genutzt < 0 ||
    gesamt <= 0
  )
    return null;
  return { genutzt, gesamt };
}
