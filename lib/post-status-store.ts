import "server-only";

import type { PostFormat, PostStatusRow } from "@/lib/admin/post-planer";

import { DbError, isMissingTable } from "@/lib/admin/db-errors";
import {
  POST_STATUS_COLUMNS,
  postStatusAusZeile,
} from "@/lib/admin/post-planer";
import { serviceClient } from "@/lib/supabase/service";

/*
 * Speicher für den Post-Planer (Tabelle public.post_status, Migration
 * 20261116000000_ausbau.sql): Welcher Post eines Tages als Story bzw.
 * Beitrag gepostet ist. Nur auf dem Server und erst nach
 * requireAdmin() aufrufen.
 *
 * - Abhaken legt eine Zeile an, Zurücknehmen löscht sie. Ist sie schon
 *   da (23505), wird nur der Satz aufgefrischt (kein Upsert, siehe
 *   Test-Attrappe).
 * - Fehler: DbError mit PostgREST-Code. Fehlt die Tabelle, liefert die
 *   Liste null statt zu werfen.
 */

type PgError = { message: string; code?: string };

const COLS = POST_STATUS_COLUMNS.join(",");

function dbError(prefix: string, error: PgError): DbError {
  return new DbError(`${prefix}: ${error.message}`, error.code);
}

function needDb() {
  const db = serviceClient();
  if (!db) throw new DbError("Supabase ist nicht konfiguriert.");
  return db;
}

/**
 * Was zwischen von und bis (je einschließlich, yyyy-mm-dd) gepostet
 * wurde, älteste zuerst. null, wenn die Tabelle fehlt oder Supabase
 * nicht konfiguriert ist.
 */
export async function listPostStatus(
  von: string,
  bis: string,
): Promise<PostStatusRow[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("post_status")
    .select(COLS)
    .gte("datum", von)
    .lte("datum", bis)
    .order("datum", { ascending: true })
    .limit(1000);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Post-Status konnte nicht geladen werden", error);
  }
  return (Array.isArray(data) ? data : [])
    .map(postStatusAusZeile)
    .filter((r): r is PostStatusRow => r !== null);
}

export type PostKennung = { datum: string; platz: number; format: PostFormat };

/**
 * Post als gepostet eintragen (mit dem Satz, der online ging) oder
 * wieder austragen. Wirft DbError.
 */
export async function setzePostStatus(
  post: PostKennung & { text: string },
  gepostet: boolean,
): Promise<void> {
  const db = needDb();
  if (gepostet) {
    const { error } = await db.from("post_status").insert({
      datum: post.datum,
      platz: post.platz,
      format: post.format,
      text: post.text,
    });
    if (!error) return;
    if (error.code !== "23505")
      throw dbError("Post-Status konnte nicht gespeichert werden", error);
    // Schon eingetragen (doppelt getippt, zweites Gerät oder vorher eine
    // andere Karte an diesem Platz gepostet): Satz und Zeit auffrischen.
    const { error: e2 } = await db
      .from("post_status")
      .update({ text: post.text, gepostet_at: new Date().toISOString() })
      .eq("datum", post.datum)
      .eq("platz", post.platz)
      .eq("format", post.format);
    if (e2) throw dbError("Post-Status konnte nicht gespeichert werden", e2);
    return;
  }
  const { error } = await db
    .from("post_status")
    .delete()
    .eq("datum", post.datum)
    .eq("platz", post.platz)
    .eq("format", post.format);
  if (error)
    throw dbError("Post-Status konnte nicht gespeichert werden", error);
}
