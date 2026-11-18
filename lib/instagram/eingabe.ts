/**
 * Prüft, was das Story-Studio an INSTAGRAM_POSTEN_PFAD schickt (PostAuftrag
 * aus lib/instagram/vertrag.ts), bevor irgendetwas zu Instagram geht.
 * Rein (ohne Server-Importe), unter node --test prüfbar.
 *
 * Bildpfade sind streng: nur die Form, die instagramUploadAction vergibt
 * („<Tag in Hamburg>/<uuid>-<n>.jpg“), nur aus den Ordnern von heute und
 * gestern, alle aus demselben Lauf. So kann ein gefälschter Auftrag
 * Instagram nicht auf beliebige Dateien im Speicher zeigen lassen.
 */
import { addDays, berlinDateIso } from "@/lib/admin/berlin-time";
import { NACHTRAGEN_TAGE, parsePlatz } from "@/lib/admin/post-planer";
import { parseId, parseStoredDate } from "@/lib/admin/validate";
import {
  BILDER_MAX,
  CAPTION_MAX,
  HASHTAGS_MAX,
  INSTAGRAM_ARTEN,
  KARUSSELL_MAX,
  type InstagramArt,
  type PostAuftrag,
  type PostQuelle,
} from "@/lib/instagram/vertrag";

/** Quelle: so weit voraus darf der Tag liegen (wie die Serien der Redaktion). */
export const QUELLE_TAGE_VORAUS = 14;

/** Pfad eines Bildes im Bucket: Tag, Kennung des Laufs, Nummer 1 bis 10. */
const BILD_PFAD =
  /^(\d{4}-\d{2}-\d{2})\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-([1-9]|10)\.jpg$/;

export type BildPfad = {
  pfad: string;
  /** Ordner: Kalendertag in Hamburg (yyyy-mm-dd). */
  tag: string;
  /** Kennung des Laufs (eine je Aufruf von instagramUploadAction). */
  lauf: string;
  /** Nummer des Bildes im Lauf (1 bis BILDER_MAX). */
  nr: number;
};

export type AuftragErgebnis =
  | { ok: true; auftrag: PostAuftrag }
  | { ok: false; text: string };

export const TEXT_UNLESBAR =
  "Der Auftrag ließ sich nicht lesen. Lade die Seite neu und versuch es noch einmal.";
export const TEXT_ANZAHL = `Ein Post braucht 1 bis ${BILDER_MAX} Bilder.`;
export const TEXT_KARUSSELL = `Ein Karussell hat höchstens ${KARUSSELL_MAX} Bilder.`;
export const TEXT_PFADE =
  "Die Bilder passen nicht zu diesem Post. Lade die Seite neu und versuch es noch einmal.";
export const TEXT_CAPTION = `Die Bildunterschrift ist zu lang (höchstens ${CAPTION_MAX} Zeichen).`;
export const TEXT_HASHTAGS = `Nimm höchstens ${HASHTAGS_MAX} Hashtags in die Bildunterschrift.`;
export const TEXT_QUELLE =
  "Woher die Bilder stammen, ließ sich nicht lesen. Lade die Seite neu und versuch es noch einmal.";
export const TEXT_ZU_ALT = `Dieser Tag liegt mehr als ${NACHTRAGEN_TAGE} Tage zurück. Von hier aus lässt er sich nicht mehr posten. Teil die Bilder von Hand, wenn du sie noch posten willst.`;
export const TEXT_ZU_WEIT = `Dieser Tag liegt mehr als ${QUELLE_TAGE_VORAUS} Tage in der Zukunft. Posten geht von hier aus erst, wenn er näher ist.`;

/** Echter Kalendertag (yyyy-mm-dd), sonst null. */
function tagOderNull(v: unknown): string | null {
  return parseStoredDate(v);
}

/**
 * Ein Bildpfad aus einem Auftrag: genau unsere Form und nur aus den
 * Ordnern von heute oder gestern (Hamburger Zeit), sonst null.
 */
export function bildPfad(v: unknown, jetzt: Date): BildPfad | null {
  if (typeof v !== "string" || v.length > 80) return null;
  const m = BILD_PFAD.exec(v);
  if (!m) return null;
  const tag = tagOderNull(m[1]);
  if (!tag) return null;
  const heute = berlinDateIso(jetzt);
  if (tag !== heute && tag !== addDays(heute, -1)) return null;
  return { pfad: v, tag, lauf: m[2], nr: Number(m[3]) };
}

/** Ein Pfad, den der Server selbst vergeben hat (ohne Bezug auf heute). */
export function istBildPfad(v: unknown): v is string {
  return typeof v === "string" && BILD_PFAD.test(v);
}

/** Wie viele Hashtags in einem Text stehen. */
export function zaehleHashtags(text: string): number {
  return [...text.matchAll(/(?:^|[^\p{L}\p{N}_&#])#[\p{L}\p{N}_]+/gu)].length;
}

/** Bildunterschrift: Windows-Umbrüche vereinheitlicht, Steuerzeichen raus. */
export function saubereCaption(roh: string): string {
  return roh
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

/**
 * Quelle aus einem Auftrag: Story-Serie (Tag, Kennung oder null, bei
 * null wahlweise lokal) oder Post des Tages (Tag, Platz 0 bis 2). Der
 * Tag liegt höchstens NACHTRAGEN_TAGE zurück und QUELLE_TAGE_VORAUS
 * voraus.
 */
export function pruefeQuelle(v: unknown, jetzt: Date): PostQuelle | null {
  const q = quelleAusZeile(v);
  if (!q) return null;
  return zeitraumProblem(q.datum, jetzt) ? null : q;
}

/**
 * Liegt der Tag einer Quelle außerhalb dessen, was sich posten lässt
 * (höchstens NACHTRAGEN_TAGE zurück, QUELLE_TAGE_VORAUS voraus)? Dann
 * ein Satz für den Inhaber, sonst null. Das Studio sperrt damit den
 * Knopf, der Server lehnt mit demselben Satz ab.
 */
export function zeitraumProblem(datum: string, jetzt: Date): string | null {
  const heute = berlinDateIso(jetzt);
  if (datum < addDays(heute, -NACHTRAGEN_TAGE)) return TEXT_ZU_ALT;
  if (datum > addDays(heute, QUELLE_TAGE_VORAUS)) return TEXT_ZU_WEIT;
  return null;
}

/** Quelle aus einer gespeicherten Zeile (ohne Bezug auf heute), sonst null. */
export function quelleAusZeile(v: unknown): PostQuelle | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const q = v as Record<string, unknown>;
  const datum = tagOderNull(q.datum);
  if (!datum) return null;
  if (q.typ === "serie") {
    // lokal: Serie nur auf einem Gerät, gibt es nur ohne Kennung.
    if (q.id === null)
      return q.lokal === true
        ? { typ: "serie", datum, id: null, lokal: true }
        : { typ: "serie", datum, id: null };
    if (q.lokal !== undefined) return null;
    const id = parseId(q.id);
    return id ? { typ: "serie", datum, id } : null;
  }
  if (q.typ === "post") {
    const platz = parsePlatz(q.platz);
    return platz === null ? null : { typ: "post", datum, platz };
  }
  return null;
}

export function parseArt(v: unknown): InstagramArt | null {
  return typeof v === "string" &&
    (INSTAGRAM_ARTEN as readonly string[]).includes(v)
    ? (v as InstagramArt)
    : null;
}

/** Höchstzahl Bilder je Art (Stories: BILDER_MAX, Beitrag: KARUSSELL_MAX). */
export function bilderMax(art: InstagramArt): number {
  return art === "beitrag" ? Math.min(BILDER_MAX, KARUSSELL_MAX) : BILDER_MAX;
}

/** Prüft einen Auftrag gegen die Uhr (jetzt). */
export function pruefeAuftrag(roh: unknown, jetzt: Date): AuftragErgebnis {
  if (!roh || typeof roh !== "object" || Array.isArray(roh))
    return { ok: false, text: TEXT_UNLESBAR };
  const r = roh as Partial<Record<string, unknown>>;
  const art = parseArt(r.art);
  if (!art || !Array.isArray(r.bilder) || typeof r.caption !== "string")
    return { ok: false, text: TEXT_UNLESBAR };

  if (r.bilder.length < 1 || r.bilder.length > BILDER_MAX)
    return { ok: false, text: TEXT_ANZAHL };
  if (r.bilder.length > bilderMax(art))
    return { ok: false, text: TEXT_KARUSSELL };
  const pfade: BildPfad[] = [];
  for (const b of r.bilder) {
    const p = bildPfad(b, jetzt);
    if (!p) return { ok: false, text: TEXT_PFADE };
    pfade.push(p);
  }
  // Alle aus demselben Lauf, keine Nummer doppelt.
  const erster = pfade[0];
  if (
    pfade.some((p) => p.tag !== erster.tag || p.lauf !== erster.lauf) ||
    new Set(pfade.map((p) => p.nr)).size !== pfade.length
  )
    return { ok: false, text: TEXT_PFADE };

  // Vor dem Aufräumen messen: kein Rechnen mit riesigen Texten.
  if (r.caption.length > CAPTION_MAX * 2)
    return { ok: false, text: TEXT_CAPTION };
  let caption = "";
  if (art === "beitrag") {
    caption = saubereCaption(r.caption);
    if (caption.length > CAPTION_MAX) return { ok: false, text: TEXT_CAPTION };
    if (zaehleHashtags(caption) > HASHTAGS_MAX)
      return { ok: false, text: TEXT_HASHTAGS };
  }

  const quelle = quelleAusZeile(r.quelle);
  if (!quelle) return { ok: false, text: TEXT_QUELLE };
  // Ein Tag außerhalb des Zeitraums: klar sagen, Neuladen hilft nicht.
  const zeitraum = zeitraumProblem(quelle.datum, jetzt);
  if (zeitraum) return { ok: false, text: zeitraum };

  return {
    ok: true,
    auftrag: { art, bilder: pfade.map((p) => p.pfad), caption, quelle },
  };
}
