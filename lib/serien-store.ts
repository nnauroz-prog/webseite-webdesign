import "server-only";

import type { StorySerie } from "@/lib/story-serie";

/** Eine gespeicherte Serie aus einem Auftrag an die Redaktion. */
export type SerieZeile = {
  id: string;
  /** Zeitpunkt des Auftrags (ISO). */
  created_at: string;
  /** Kalendertag in Hamburg (yyyy-mm-dd), für den die Serie gedacht ist. */
  datum: string;
  /** Der Auftrag im Wortlaut (leer: „Mach was zu heute“). */
  auftrag: string;
  serie: StorySerie;
  /** Zeitpunkt, an dem die Serie als gepostet abgehakt wurde, sonst null. */
  gepostet_at: string | null;
};

/**
 * Die neuesten Serien aus Aufträgen, neueste zuerst. null, wenn die
 * Tabelle noch fehlt (Datenbank-Update ausstehend).
 */
export async function listSerien(limit = 20): Promise<SerieZeile[] | null> {
  void limit;
  return null;
}
