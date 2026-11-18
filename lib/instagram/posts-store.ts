import "server-only";

import type { InstagramArt, PostQuelle } from "@/lib/instagram/vertrag";

import { DbError, isMissingGrant, isMissingTable } from "@/lib/admin/db-errors";
import { parseId } from "@/lib/admin/validate";
import { instagramLink, kennung } from "@/lib/instagram/graph";
import { parseArt, quelleAusZeile } from "@/lib/instagram/eingabe";
import { BILDER_MAX } from "@/lib/instagram/vertrag";
import { serviceClient } from "@/lib/supabase/service";

/*
 * Verlauf der Posts auf Instagram (Tabelle public.instagram_posts,
 * Migration 20261118000000_instagram.sql): was das Story-Studio wann als
 * Stories oder Beitrag veröffentlicht hat. Daraus zeigt das Studio
 * „schon gepostet“. Nur auf dem Server und erst nach requireAdmin()
 * aufrufen.
 *
 * - Fehlt die Tabelle oder fehlen ihr die Rechte (Datenbank-Update
 *   ausstehend), liefern alle Funktionen null statt zu werfen: Posten
 *   geht trotzdem, nur ohne Verlauf.
 * - Sonst Fehler als DbError mit PostgREST-Code.
 */

export type InstagramPostZeile = {
  id: string;
  /** Zeitpunkt des Posts (ISO). */
  created_at: string;
  art: InstagramArt;
  quelle: PostQuelle;
  /** Wie viele Bilder der Auftrag hatte. */
  bilder: number;
  /** Kennungen der veröffentlichten Beiträge oder Stories bei Instagram. */
  media_ids: string[];
  /** Links zu den veröffentlichten Beiträgen oder Stories (kann leer sein). */
  links: string[];
};

/** Alle Spalten (select und Schema-Prüfung). */
export const INSTAGRAM_POSTS_COLUMNS = [
  "id",
  "created_at",
  "art",
  "quelle",
  "bilder",
  "media_ids",
  "links",
] as const satisfies readonly (keyof InstagramPostZeile)[];

type PgError = { message: string; code?: string };

const COLS = INSTAGRAM_POSTS_COLUMNS.join(",");

function dbError(prefix: string, error: PgError): DbError {
  return new DbError(`${prefix}: ${error.message}`, error.code);
}

/** Tabelle fehlt oder ist für den Server ohne Rechte. */
function nichtDa(error: PgError): boolean {
  return isMissingTable(error) || isMissingGrant(error);
}

function zeitpunkt(v: unknown): string | null {
  return typeof v === "string" && !Number.isNaN(Date.parse(v)) ? v : null;
}

function liste<T>(v: unknown, pruefe: (x: unknown) => T | null): T[] | null {
  if (!Array.isArray(v)) return null;
  const out: T[] = [];
  for (const x of v) {
    const ok = pruefe(x);
    if (ok === null) return null;
    out.push(ok);
  }
  return out;
}

/** Zeile aus der Datenbank, geprüft; null, wenn etwas nicht stimmt. */
export function postAusZeile(data: unknown): InstagramPostZeile | null {
  if (!data || typeof data !== "object") return null;
  const z = data as Record<string, unknown>;
  const id = parseId(z.id);
  const created_at = zeitpunkt(z.created_at);
  const art = parseArt(z.art);
  const quelle = quelleAusZeile(z.quelle);
  const bilder = z.bilder;
  const media_ids = liste(z.media_ids, kennung);
  const links = liste(z.links, instagramLink);
  if (
    !id ||
    !created_at ||
    !art ||
    !quelle ||
    typeof bilder !== "number" ||
    !Number.isInteger(bilder) ||
    bilder < 1 ||
    bilder > BILDER_MAX ||
    !media_ids ||
    !links
  )
    return null;
  return { id, created_at, art, quelle, bilder, media_ids, links };
}

/** Nur die Felder der Quelle, in fester Form (für Speichern und Suche). */
function quelleJson(q: PostQuelle): PostQuelle {
  return q.typ === "serie"
    ? {
        typ: "serie",
        datum: q.datum,
        id: q.id,
        ...(q.lokal ? { lokal: true as const } : {}),
      }
    : { typ: "post", datum: q.datum, platz: q.platz };
}

/** Genau dieselbe Quelle (auch lokal gleich)? */
function gleicheQuelle(a: PostQuelle, b: PostQuelle): boolean {
  return JSON.stringify(quelleJson(a)) === JSON.stringify(quelleJson(b));
}

/** So viele Zeilen prüft lastPostFor höchstens (lokale Serien desselben Tages). */
const SUCHE_MAX = 20;

/**
 * Hält einen Post fest und gibt seine Kennung zurück. null, wenn die
 * Tabelle fehlt oder Supabase nicht konfiguriert ist. Wirft DbError bei
 * allem anderen, auch bei ungültigen Werten.
 */
export async function savePost(eintrag: {
  art: InstagramArt;
  quelle: PostQuelle;
  bilder: number;
  media_ids: readonly string[];
  links: readonly string[];
}): Promise<string | null> {
  const art = parseArt(eintrag.art);
  const quelle = quelleAusZeile(eintrag.quelle);
  const media_ids = liste([...eintrag.media_ids], kennung);
  const links = liste([...eintrag.links], instagramLink);
  if (
    !art ||
    !quelle ||
    !Number.isInteger(eintrag.bilder) ||
    eintrag.bilder < 1 ||
    eintrag.bilder > BILDER_MAX ||
    !media_ids ||
    !links
  )
    throw new DbError("Post konnte nicht gespeichert werden: ungültig.");
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("instagram_posts")
    .insert({
      art,
      quelle: quelleJson(quelle),
      bilder: eintrag.bilder,
      media_ids,
      links,
    })
    .select("id")
    .single();
  if (error) {
    if (nichtDa(error)) return null;
    throw dbError("Post konnte nicht gespeichert werden", error);
  }
  const id = (data as { id?: unknown } | null)?.id;
  return typeof id === "string" ? id : null;
}

/**
 * Die neuesten Posts, neueste zuerst. null, wenn die Tabelle fehlt oder
 * Supabase nicht konfiguriert ist.
 */
export async function listPosts(
  limit = 20,
): Promise<InstagramPostZeile[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const anzahl = Math.min(200, Math.max(1, Math.floor(limit) || 1));
  const { data, error } = await db
    .from("instagram_posts")
    .select(COLS)
    .order("created_at", { ascending: false })
    .limit(anzahl);
  if (error) {
    if (nichtDa(error)) return null;
    throw dbError("Posts konnten nicht geladen werden", error);
  }
  return (Array.isArray(data) ? data : [])
    .map(postAusZeile)
    .filter((z): z is InstagramPostZeile => z !== null);
}

/**
 * Der letzte Post aus dieser Quelle (optional nur dieser Art), für den
 * Hinweis „schon gepostet“. null, wenn es keinen gibt, die Tabelle fehlt
 * oder Supabase nicht konfiguriert ist. Wirft DbError.
 *
 * Die Serie des Tages (id null) und Serien nur auf einem Gerät (id null,
 * lokal) zählen getrennt: contains() fände für die Serie des Tages auch
 * die lokalen, deshalb zählt nur eine Zeile mit genau dieser Quelle.
 */
export async function lastPostFor(
  quelle: PostQuelle,
  art?: InstagramArt,
): Promise<InstagramPostZeile | null> {
  const q = quelleAusZeile(quelle);
  if (!q) return null;
  const db = serviceClient();
  if (!db) return null;
  let abfrage = db
    .from("instagram_posts")
    .select(COLS)
    .contains("quelle", quelleJson(q));
  if (art) abfrage = abfrage.eq("art", art);
  const { data, error } = await abfrage
    .order("created_at", { ascending: false })
    .limit(SUCHE_MAX);
  if (error) {
    if (nichtDa(error)) return null;
    throw dbError("Posts konnten nicht geladen werden", error);
  }
  for (const zeile of Array.isArray(data) ? data : []) {
    const post = postAusZeile(zeile);
    if (post && gleicheQuelle(post.quelle, q)) return post;
  }
  return null;
}
