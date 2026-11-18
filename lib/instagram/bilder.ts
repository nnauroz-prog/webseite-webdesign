import "server-only";

import { randomUUID } from "node:crypto";

import type { UploadPlatz } from "@/lib/instagram/vertrag";

import { addDays, berlinDateIso } from "@/lib/admin/berlin-time";
import { istBildPfad } from "@/lib/instagram/eingabe";
import { BILDER_MAX, INSTAGRAM_BUCKET } from "@/lib/instagram/vertrag";
import { serviceClient } from "@/lib/supabase/service";

/*
 * Bilder auf dem Weg zu Instagram, im privaten Bucket INSTAGRAM_BUCKET
 * des Speichers von Supabase (Migration 20261118000000_instagram.sql).
 * Nur auf dem Server und erst nach requireAdmin() aufrufen.
 *
 * - Upload-Plätze: Der Server vergibt Pfade „<Tag in Hamburg>/<uuid>-<n>.jpg“
 *   und je Pfad ein Token; der Browser lädt damit direkt hoch.
 * - Für Instagram erzeugt der Server je Bild eine signierte Adresse, die
 *   zwei Stunden gilt. Danach löscht er die Bilder des Laufs wieder.
 * - Zu Beginn jedes Laufs räumt er Ordner auf, die älter als gestern
 *   sind (falls ein Lauf abgerissen ist).
 * Geloggt werden nur Codes, nie Pfade mit Token oder Adressen.
 */

/** So lange gilt die Adresse, über die Instagram ein Bild lädt. */
export const ADRESSE_SEKUNDEN = 2 * 60 * 60;

/** Höchstens so viele alte Ordner je Lauf aufräumen. */
const AUFRAEUMEN_ORDNER_MAX = 20;

export type SpeicherFehlerArt =
  /** Supabase ist nicht konfiguriert (URL oder service_role-Schlüssel fehlt). */
  | "kein_speicher"
  /** Der Bucket fehlt (Datenbank-Update noch nicht ausgeführt). */
  | "kein_bucket"
  /** Ein Bild fehlt im Speicher (nicht hochgeladen oder schon gelöscht). */
  | "fehlt"
  | "sonst";

export class SpeicherFehler extends Error {
  readonly art: SpeicherFehlerArt;

  constructor(art: SpeicherFehlerArt) {
    super(`Speicher: ${art}`);
    this.name = "SpeicherFehler";
    this.art = art;
  }
}

type StorageError = { message?: string; statusCode?: string; status?: number };

/** Fehler von Supabase Storage einordnen (nur Meldung und Status). */
export function speicherFehlerArt(error: unknown): SpeicherFehlerArt {
  const e = (error ?? {}) as StorageError;
  const m = typeof e.message === "string" ? e.message : "";
  if (/bucket not found/i.test(m)) return "kein_bucket";
  if (/object not found|not.?found/i.test(m) || e.statusCode === "404")
    return "fehlt";
  return "sonst";
}

function speicher() {
  const db = serviceClient();
  if (!db) throw new SpeicherFehler("kein_speicher");
  return db.storage.from(INSTAGRAM_BUCKET);
}

/** Ist Supabase für den Speicher konfiguriert? */
export function speicherBereit(): boolean {
  return serviceClient() !== null;
}

/**
 * Gibt es den Bucket? true/false, oder null, wenn die Prüfung selbst
 * scheitert (Netz, Schlüssel) oder Supabase nicht konfiguriert ist.
 */
export async function bucketDa(): Promise<boolean | null> {
  const db = serviceClient();
  if (!db) return null;
  try {
    const { data, error } = await db.storage.getBucket(INSTAGRAM_BUCKET);
    if (!error) return Boolean(data);
    return speicherFehlerArt(error) === "kein_bucket" ? false : null;
  } catch {
    return null;
  }
}

/**
 * Upload-Plätze für einen Lauf: anzahl Pfade unter dem heutigen Tag in
 * Hamburg, alle mit derselben Kennung, nummeriert ab 1. Wirft
 * SpeicherFehler.
 */
export async function erzeugePlaetze(
  anzahl: number,
  jetzt: Date,
): Promise<UploadPlatz[]> {
  if (!Number.isInteger(anzahl) || anzahl < 1 || anzahl > BILDER_MAX)
    throw new SpeicherFehler("sonst");
  const bucket = speicher();
  const lauf = randomUUID();
  const tag = berlinDateIso(jetzt);
  const pfade = Array.from(
    { length: anzahl },
    (_, i) => `${tag}/${lauf}-${i + 1}.jpg`,
  );
  return Promise.all(
    pfade.map(async (pfad): Promise<UploadPlatz> => {
      const { data, error } = await bucket.createSignedUploadUrl(pfad);
      if (error || !data?.token)
        throw new SpeicherFehler(speicherFehlerArt(error));
      return { pfad, token: data.token };
    }),
  );
}

/**
 * Signierte Adressen (zwei Stunden gültig), über die Instagram die Bilder
 * lädt, in derselben Reihenfolge. Wirft SpeicherFehler („fehlt“, wenn
 * ein Bild nicht im Speicher ist).
 */
export async function leseAdressen(
  pfade: readonly string[],
): Promise<string[]> {
  if (!pfade.every(istBildPfad)) throw new SpeicherFehler("sonst");
  const bucket = speicher();
  return Promise.all(
    pfade.map(async (pfad) => {
      const { data, error } = await bucket.createSignedUrl(
        pfad,
        ADRESSE_SEKUNDEN,
      );
      if (error || !data?.signedUrl)
        throw new SpeicherFehler(speicherFehlerArt(error));
      return data.signedUrl;
    }),
  );
}

/** Löscht die Bilder eines Laufs. false, wenn es nicht geklappt hat; wirft nie. */
export async function loescheDateien(
  pfade: readonly string[],
): Promise<boolean> {
  const gueltig = pfade.filter(istBildPfad);
  if (gueltig.length === 0) return true;
  try {
    const { error } = await speicher().remove([...gueltig]);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Löscht Bilder in Ordnern, die älter als gestern sind (Hamburger Zeit).
 * Gibt die Zahl gelöschter Dateien zurück; wirft nie.
 */
export async function raeumeAuf(jetzt: Date): Promise<number> {
  try {
    const bucket = speicher();
    const gestern = addDays(berlinDateIso(jetzt), -1);
    const { data: ordner, error } = await bucket.list("", { limit: 100 });
    if (error || !Array.isArray(ordner)) return 0;
    const alt = ordner
      .map((o) => o.name)
      .filter((n) => /^\d{4}-\d{2}-\d{2}$/.test(n) && n < gestern)
      .slice(0, AUFRAEUMEN_ORDNER_MAX);
    let geloescht = 0;
    for (const tag of alt) {
      const { data: dateien, error: e2 } = await bucket.list(tag, {
        limit: 1000,
      });
      if (e2 || !Array.isArray(dateien)) continue;
      const pfade = dateien
        .filter((d) => d.id !== null && /^[\w.-]{1,120}$/.test(d.name))
        .map((d) => `${tag}/${d.name}`);
      if (pfade.length === 0) continue;
      const { error: e3 } = await bucket.remove(pfade);
      if (!e3) geloescht += pfade.length;
    }
    return geloescht;
  } catch {
    return 0;
  }
}
