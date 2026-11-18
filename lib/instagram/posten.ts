import "server-only";

import type {
  PostAuftrag,
  PostEreignis,
  PostSchritt,
} from "@/lib/instagram/vertrag";

import { DbError } from "@/lib/admin/db-errors";
import {
  leseAdressen,
  loescheDateien,
  raeumeAuf,
  speicherBereit,
  SpeicherFehler,
  TEXT_KEIN_BUCKET,
  TEXT_KEIN_SPEICHER,
} from "@/lib/instagram/bilder";
import { pruefeAuftrag } from "@/lib/instagram/eingabe";
import {
  FEHLER_TEXT,
  graph,
  type Graph,
  InstagramAbbruch,
  InstagramFehler,
  instagramLink,
  kennung,
  kontingentLesen,
  kontoFinden,
  ordneEin,
  TEXT_TAGESLIMIT,
  warte as echtesWarten,
  type Warte,
} from "@/lib/instagram/graph";
import { instagramKonfig } from "@/lib/instagram/konfig";
import { savePost } from "@/lib/instagram/posts-store";
import { setzePostStatus } from "@/lib/post-status-store";
import { setSerieGepostet } from "@/lib/serien-store";
import { postsFuer } from "@/lib/sprueche-aktuell";

/*
 * Ein Auftrag des Story-Studios bis auf Instagram. Nur auf dem Server
 * und erst nach requireAdmin() aufrufen (app/admin/instagram/posten/route.ts).
 * Form der Ereignisse: lib/instagram/vertrag.ts.
 *
 * Reihenfolge:
 *   1. Schlüssel da?               sonst nicht_verbunden (eine Zeile)
 *   2. Auftrag gültig?             sonst eingabe (eine Zeile)
 *   3. pruefen: Konto, Kontingent, signierte Adressen der Bilder
 *   4. vorbereiten: alle Container anlegen und warten, bis sie fertig
 *      sind (Karussell: erst die Bilder, dann der Rahmen). Scheitert hier
 *      ein Bild, ist noch nichts veröffentlicht.
 *   5. veroeffentlichen: Stories einzeln in der Reihenfolge (nr/von),
 *      Beitrag auf einmal; je Veröffentlichung der Link, falls Instagram
 *      ihn nennt.
 *   6. Verlauf speichern und die Quelle als gepostet abhaken. Scheitert
 *      das, bleibt der Post ein Erfolg (Hinweis statt Fehler).
 *   Danach (immer): die Bilder des Laufs aus dem Speicher löschen.
 *
 * Nie doppelt posten: Schlägt eine Veröffentlichung fehl, fragt der
 * Server erst nach, ob der Container trotzdem veröffentlicht ist, bevor
 * er es einmal wiederholt. Bleibt auch die Nachfrage ohne Antwort, ist
 * offen, ob der Post online ist: Die Fehlerzeile sagt dann „unklar“
 * (mit dem, was sicher online ist), statt „nicht gepostet“. Eine
 * laufende Veröffentlichung wird bei einem Abbruch nicht abgeschnitten;
 * danach beginnt keine neue mehr.
 *
 * Geloggt werden nur Codes und fbtrace, nie Schlüssel, Adressen oder Texte.
 */

/** Nach dieser Zeit bricht das Posten ab (die Route erlaubt etwas mehr). */
export const FRIST_MS = 100_000;
/** So oft wird nach dem Stand eines Containers gefragt. */
export const POLL_MS = 2_000;
/** So lange wird höchstens auf einen Container gewartet. */
export const POLL_MAX_MS = 60_000;

export type PostenOptionen = {
  /** Abbruch von außen (Studio hat die Verbindung geschlossen). */
  signal?: AbortSignal;
  /** Nur für Tests: Uhr, Frist, Wartezeiten und fetch für die Graph API. */
  jetzt?: Date;
  fristMs?: number;
  pollMs?: number;
  pollMaxMs?: number;
  wiederholMs?: number;
  fetch?: typeof fetch;
  warte?: Warte;
};

const TEXT_BILD_FEHLT =
  "Ein Bild ist nicht im Speicher angekommen. Versuch es noch einmal.";
const TEXT_ZU_LANGSAM =
  "Instagram hat zu lange gebraucht. Versuch es in ein paar Minuten noch einmal.";
const TEXT_CONTAINER_LANGSAM =
  "Instagram braucht zu lange für die Bilder. Versuch es in ein paar Minuten noch einmal.";
const TEXT_ABGELAUFEN =
  "Instagram hat ein Bild verworfen, bevor es online ging. Versuch es noch einmal.";
const TEXT_ABGEBROCHEN =
  "Abgebrochen: Die Verbindung zum Studio ist abgerissen.";
const TEXT_UNKLAR_VOR = "Instagram hat beim Veröffentlichen nicht geantwortet.";
const HINWEIS_GEMELDET =
  "Instagram hat einen Fehler gemeldet, der Post ist aber online. Den Link findest du in der Instagram-App.";
const HINWEIS_VERLAUF =
  "Der Post ist online, aber der Verlauf im Studio ließ sich nicht speichern.";
const HINWEIS_ABHAKEN =
  "Der Post ist online, aber das Abhaken im Studio hat nicht geklappt. Hak ihn bitte selbst ab.";

const CONFIG_ISSUE: Record<string, string> = {
  CAPTION_NOT_ATTACHED:
    "Instagram hat den Beitrag ohne Bildunterschrift veröffentlicht. Du kannst sie in der Instagram-App nachtragen.",
  USER_TAGGING_FAILURE:
    "Instagram hat die Markierungen von Personen weggelassen.",
};
const CONFIG_ISSUE_SONST = "Instagram hat einen Teil des Posts weggelassen.";

type Lauf = {
  g: Graph;
  /** Frist und Abbruch zusammen. */
  signal: AbortSignal;
  pollMs: number;
  pollMaxMs: number;
  wiederholMs: number;
  warte: Warte;
};

type Veroeffentlicht = {
  /** Kennung des Beitrags; null, wenn Instagram sie nicht genannt hat. */
  id: string | null;
  /** Satz, wenn Instagram etwas weggelassen hat. */
  hinweis: string | null;
};

/** Wo ein Fehler auftrat (fürs Log): Posten selbst oder ein Nebenschritt. */
type LogOrt = "posten" | "kontingent" | "verlauf" | "abhaken";

/** Loggt nur Codes, fbtrace und den Schritt; nie Adressen, Texte oder den Schlüssel. */
function logFehler(wo: LogOrt, err: unknown, schritt: PostSchritt | null) {
  if (err instanceof InstagramFehler)
    console.error("[instagram] Fehler", {
      wo,
      code: err.code,
      graph: err.graphCode,
      subcode: err.subcode,
      fbtrace: err.fbtrace,
      schritt,
    });
  else if (err instanceof SpeicherFehler)
    console.error("[instagram] Fehler", {
      wo,
      code: `speicher_${err.art}`,
      schritt,
    });
  else
    console.error("[instagram] Fehler", {
      wo,
      code:
        err instanceof DbError
          ? (err.code ?? "db")
          : err instanceof Error
            ? err.name
            : "unbekannt",
      schritt,
    });
}

function speicherAlsFehler(err: SpeicherFehler): InstagramFehler {
  if (err.art === "fehlt")
    return new InstagramFehler("bild", { text: TEXT_BILD_FEHLT });
  if (err.art === "kein_bucket")
    return new InstagramFehler("unbekannt", { text: TEXT_KEIN_BUCKET });
  if (err.art === "kein_speicher")
    return new InstagramFehler("unbekannt", { text: TEXT_KEIN_SPEICHER });
  return new InstagramFehler("unbekannt");
}

/** Legt einen Container an und gibt seine Kennung zurück. */
async function containerAnlegen(
  lauf: Lauf,
  igId: string,
  parameter: Record<string, string | boolean>,
): Promise<string> {
  const antwort = await lauf.g.post<{ id?: unknown }>(
    `${igId}/media`,
    parameter,
  );
  const id = kennung(antwort.id);
  if (!id) throw new InstagramFehler("instagram");
  return id;
}

/** Stand eines Containers (FINISHED, IN_PROGRESS, ERROR, EXPIRED, PUBLISHED). */
async function containerStand(
  g: Graph,
  id: string,
  signal?: AbortSignal | null,
): Promise<{ code: string; status: string }> {
  const s = await g.get<{ status_code?: unknown; status?: unknown }>(
    id,
    { fields: "status_code,status" },
    signal === undefined ? {} : { signal },
  );
  return {
    code: typeof s.status_code === "string" ? s.status_code : "",
    status: typeof s.status === "string" ? s.status : "",
  };
}

/** Wartet, bis ein Container fertig ist (alle pollMs, höchstens pollMaxMs). */
async function bisFertig(lauf: Lauf, id: string): Promise<void> {
  let gewartet = 0;
  for (;;) {
    const { code, status } = await containerStand(lauf.g, id);
    if (code === "FINISHED" || code === "PUBLISHED") return;
    if (code === "ERROR") {
      // Der Status nennt teils den Subcode („… error code 2207003“).
      const sub = /\b(2207\d{3})\b/.exec(status)?.[1];
      const eingeordnet = sub ? ordneEin({ subcode: Number(sub) }) : "bild";
      throw new InstagramFehler(
        eingeordnet === "instagram" ? "bild" : eingeordnet,
        { subcode: sub ? Number(sub) : null },
      );
    }
    if (code === "EXPIRED")
      throw new InstagramFehler("instagram", { text: TEXT_ABGELAUFEN });
    if (gewartet + lauf.pollMs > lauf.pollMaxMs)
      throw new InstagramFehler("instagram", { text: TEXT_CONTAINER_LANGSAM });
    await lauf.warte(lauf.pollMs, lauf.signal);
    gewartet += lauf.pollMs;
  }
}

/** Ob der Container online ist, ließ sich nicht klären. */
function unklarAus(err: InstagramFehler | null): InstagramFehler {
  return new InstagramFehler(err?.code ?? "instagram", {
    graphCode: err?.graphCode,
    subcode: err?.subcode,
    fbtrace: err?.fbtrace,
    status: err?.status,
    netz: err?.netz,
    unklar: true,
  });
}

/** Ist der Container schon veröffentlicht? null, wenn die Frage scheitert. */
async function schonVeroeffentlicht(
  lauf: Lauf,
  creationId: string,
): Promise<string | null> {
  try {
    return (await containerStand(lauf.g, creationId, null)).code;
  } catch {
    return null;
  }
}

/**
 * Veröffentlicht einen fertigen Container. Scheitert das, wird erst
 * nachgefragt, ob er trotzdem online ist; nur wenn er sicher noch nicht
 * online ist (FINISHED) und der Fehler kurzfristig war, wird einmal
 * wiederholt. Bleibt die Nachfrage ohne Antwort, wirft sie einen Fehler
 * mit unklar.
 */
async function veroeffentliche(
  lauf: Lauf,
  igId: string,
  creationId: string,
): Promise<Veroeffentlicht> {
  for (let versuch = 0; ; versuch++) {
    let antwort: { id?: unknown; config_issue?: unknown };
    try {
      antwort = await lauf.g.post(
        `${igId}/media_publish`,
        { creation_id: creationId },
        // Nicht mitten in der Veröffentlichung abbrechen; nicht blind wiederholen.
        { wiederholen: false, signal: null },
      );
    } catch (err) {
      if (!(err instanceof InstagramFehler) || err.code === "zugang") throw err;
      const stand = await schonVeroeffentlicht(lauf, creationId);
      if (stand === "PUBLISHED") return { id: null, hinweis: HINWEIS_GEMELDET };
      // Keine Antwort auf die Nachfrage: Vielleicht ist er doch online.
      if (stand === null) throw unklarAus(err);
      if (!err.voruebergehend || stand !== "FINISHED" || versuch >= 1)
        throw err;
      await lauf.warte(lauf.wiederholMs);
      continue;
    }
    const issue =
      typeof antwort.config_issue === "string" ? antwort.config_issue : null;
    const hinweis = issue ? (CONFIG_ISSUE[issue] ?? CONFIG_ISSUE_SONST) : null;
    const id = kennung(antwort.id);
    if (id) return { id, hinweis };
    // Antwort ohne Kennung: nachsehen statt raten.
    const stand = await schonVeroeffentlicht(lauf, creationId);
    if (stand === "PUBLISHED") return { id: null, hinweis };
    if (stand === null) throw unklarAus(null);
    throw new InstagramFehler("instagram");
  }
}

/** Link zu einem veröffentlichten Beitrag; null, wenn Instagram keinen nennt. */
async function linkZu(
  lauf: Lauf,
  mediaId: string | null,
): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const antwort = await lauf.g.get<{ permalink?: unknown }>(
      mediaId,
      { fields: "permalink" },
      { wiederholen: false, signal: null },
    );
    return instagramLink(antwort.permalink);
  } catch {
    return null;
  }
}

function zahlwort(n: number): string {
  return n === 1 ? "eine Story" : `${n} Stories`;
}

/**
 * Verlauf speichern und die Quelle abhaken (nur bei vollständigem
 * Erfolg). Gibt Hinweise zurück; wirft nie.
 */
async function buchen(
  auftrag: PostAuftrag,
  mediaIds: string[],
  links: string[],
  vollstaendig: boolean,
): Promise<string[]> {
  const hinweise: string[] = [];
  try {
    await savePost({
      art: auftrag.art,
      quelle: auftrag.quelle,
      bilder: auftrag.bilder.length,
      media_ids: mediaIds,
      links,
    });
  } catch (err) {
    logFehler("verlauf", err, null);
    hinweise.push(HINWEIS_VERLAUF);
  }
  if (!vollstaendig) return hinweise;
  try {
    const q = auftrag.quelle;
    if (q.typ === "serie") {
      if (q.id) await setSerieGepostet(q.id, true);
    } else {
      const post = postsFuer(q.datum).find((p) => p.platz === q.platz);
      if (!post) throw new Error("Post nicht gefunden");
      await setzePostStatus(
        {
          datum: q.datum,
          platz: q.platz,
          format: auftrag.art,
          text: post.text,
        },
        true,
      );
    }
  } catch (err) {
    logFehler("abhaken", err, null);
    hinweise.push(HINWEIS_ABHAKEN);
  }
  return hinweise;
}

/**
 * Die letzte Zeile nach einem Fehler. teil nennt nur, was sicher online
 * ist; unklar heißt, die nächste Veröffentlichung ist vielleicht auch
 * online (Instagram hat nicht geantwortet).
 */
function fehlerZeile(
  fehler: InstagramFehler,
  auftrag: PostAuftrag,
  veroeffentlicht: number,
  links: string[],
): PostEreignis {
  const { code } = fehler;
  const von = auftrag.bilder.length;
  const story = auftrag.art === "story";
  const teil =
    story && veroeffentlicht > 0
      ? { veroeffentlicht, von, links: [...links] }
      : null;
  const sind = veroeffentlicht === 1 ? "ist" : "sind";
  if (fehler.unklar) {
    const was = !story
      ? "der Beitrag"
      : von > 1
        ? `Story ${veroeffentlicht + 1}`
        : "die Story";
    return {
      typ: "fehler",
      code,
      text: `${TEXT_UNKLAR_VOR} Ob ${was} online ist, ist unklar.${teil ? ` ${zahlwort(veroeffentlicht)} von ${von} ${sind} sicher online.` : ""}`,
      ...(teil ? { teil } : {}),
      unklar: true,
    };
  }
  if (!teil) return { typ: "fehler", code, text: fehler.text };
  return {
    typ: "fehler",
    code,
    text: `${fehler.text} ${zahlwort(veroeffentlicht)} von ${von} ${sind} schon online.`,
    teil,
  };
}

export async function posteAuftrag(
  roh: unknown,
  sende: (ereignis: PostEreignis) => void,
  optionen: PostenOptionen = {},
): Promise<void> {
  const konfig = instagramKonfig();
  if (!konfig) {
    sende({
      typ: "fehler",
      code: "nicht_verbunden",
      text: FEHLER_TEXT.nicht_verbunden,
    });
    return;
  }
  const jetzt = optionen.jetzt ?? new Date();
  const eingabe = pruefeAuftrag(roh, jetzt);
  if (!eingabe.ok) {
    sende({ typ: "fehler", code: "eingabe", text: eingabe.text });
    return;
  }
  const { auftrag } = eingabe;
  if (!speicherBereit()) {
    sende({ typ: "fehler", code: "unbekannt", text: TEXT_KEIN_SPEICHER });
    return;
  }

  const frist = AbortSignal.timeout(optionen.fristMs ?? FRIST_MS);
  const signal = optionen.signal
    ? AbortSignal.any([frist, optionen.signal])
    : frist;
  const warte = optionen.warte ?? echtesWarten;
  const lauf: Lauf = {
    g: graph(konfig, {
      fetch: optionen.fetch,
      signal,
      wiederholMs: optionen.wiederholMs,
      warte,
    }),
    signal,
    pollMs: optionen.pollMs ?? POLL_MS,
    pollMaxMs: optionen.pollMaxMs ?? POLL_MAX_MS,
    wiederholMs: optionen.wiederholMs ?? 1500,
    warte,
  };

  // Alte Ordner aufräumen, nebenher (darf scheitern).
  const aufraeumen = raeumeAuf(jetzt);
  const von = auftrag.bilder.length;
  const mediaIds: string[] = [];
  const links: string[] = [];
  let veroeffentlicht = 0;
  let schritt: PostSchritt | null = null;
  const schrittMelden = (
    s: PostSchritt,
    stand: "laeuft" | "fertig",
    nr?: number,
  ) => {
    schritt = s;
    sende(
      nr !== undefined && von > 1
        ? { typ: "schritt", schritt: s, stand, nr, von }
        : { typ: "schritt", schritt: s, stand },
    );
  };

  try {
    // 1) Verbindung prüfen: Konto, Kontingent, Adressen der Bilder.
    schrittMelden("pruefen", "laeuft");
    const konto = await kontoFinden(lauf.g, konfig.kontoId);
    const noetig = auftrag.art === "story" ? von : 1;
    try {
      const k = await kontingentLesen(lauf.g, konto.id);
      if (k && k.genutzt + noetig > k.gesamt) {
        const frei = Math.max(0, k.gesamt - k.genutzt);
        throw new InstagramFehler("limit", {
          text:
            frei === 0
              ? TEXT_TAGESLIMIT
              : `Das Tageslimit von Instagram reicht heute nur noch für ${frei} ${frei === 1 ? "Post" : "Posts"}. Morgen geht es weiter.`,
        });
      }
    } catch (err) {
      // Ohne Kontingent geht es weiter; Zugang, Konto und Limit nicht.
      if (
        !(err instanceof InstagramFehler) ||
        ["zugang", "konto", "limit"].includes(err.code)
      )
        throw err;
      logFehler("kontingent", err, "pruefen");
    }
    const adressen = await leseAdressen(auftrag.bilder);
    schrittMelden("pruefen", "fertig");

    // 2) Bilder an Instagram geben: alle Container, bis sie fertig sind.
    schrittMelden("vorbereiten", "laeuft");
    const container: string[] = [];
    if (auftrag.art === "story") {
      for (const image_url of adressen) {
        const id = await containerAnlegen(lauf, konto.id, {
          image_url,
          media_type: "STORIES",
        });
        await bisFertig(lauf, id);
        container.push(id);
      }
    } else if (von === 1) {
      const id = await containerAnlegen(lauf, konto.id, {
        image_url: adressen[0],
        caption: auftrag.caption,
      });
      await bisFertig(lauf, id);
      container.push(id);
    } else {
      const kinder: string[] = [];
      for (const image_url of adressen) {
        const id = await containerAnlegen(lauf, konto.id, {
          image_url,
          is_carousel_item: true,
        });
        await bisFertig(lauf, id);
        kinder.push(id);
      }
      const id = await containerAnlegen(lauf, konto.id, {
        media_type: "CAROUSEL",
        children: kinder.join(","),
        caption: auftrag.caption,
      });
      await bisFertig(lauf, id);
      container.push(id);
    }
    schrittMelden("vorbereiten", "fertig");

    // 3) Veröffentlichen: Stories einzeln in der Reihenfolge.
    const hinweise: string[] = [];
    for (let i = 0; i < container.length; i++) {
      if (signal.aborted) throw new InstagramAbbruch();
      const nr = auftrag.art === "story" ? i + 1 : undefined;
      schrittMelden("veroeffentlichen", "laeuft", nr);
      const ergebnis = await veroeffentliche(lauf, konto.id, container[i]);
      veroeffentlicht += auftrag.art === "story" ? 1 : von;
      if (ergebnis.id) mediaIds.push(ergebnis.id);
      if (ergebnis.hinweis && !hinweise.includes(ergebnis.hinweis))
        hinweise.push(ergebnis.hinweis);
      const link = await linkZu(lauf, ergebnis.id);
      if (link) links.push(link);
      schrittMelden("veroeffentlichen", "fertig", nr);
    }

    // 4) Verlauf und Abhaken; ein Fehler hier ist nur ein Hinweis.
    hinweise.push(...(await buchen(auftrag, mediaIds, links, true)));
    sende({
      typ: "fertig",
      links: [...links],
      konto: konto.name,
      ...(hinweise.length ? { hinweis: hinweise.join(" ") } : {}),
    });
  } catch (err) {
    let fehler: InstagramFehler;
    if (err instanceof InstagramFehler) fehler = err;
    else if (err instanceof SpeicherFehler) fehler = speicherAlsFehler(err);
    else if (err instanceof InstagramAbbruch || signal.aborted)
      fehler = frist.aborted
        ? new InstagramFehler("instagram", { text: TEXT_ZU_LANGSAM })
        : new InstagramFehler("unbekannt", { text: TEXT_ABGEBROCHEN });
    else fehler = new InstagramFehler("unbekannt");
    if (!(err instanceof InstagramAbbruch) || frist.aborted)
      logFehler("posten", fehler, schritt);
    // Was schon online ist, kommt in den Verlauf (nicht abgehakt).
    if (veroeffentlicht > 0) await buchen(auftrag, mediaIds, links, false);
    sende(fehlerZeile(fehler, auftrag, veroeffentlicht, links));
  } finally {
    // Instagram hat die Bilder beim Anlegen der Container geladen.
    if (!(await loescheDateien(auftrag.bilder)))
      console.error("[instagram] Bilder nicht gelöscht", { code: "speicher" });
    await aufraeumen;
  }
}
