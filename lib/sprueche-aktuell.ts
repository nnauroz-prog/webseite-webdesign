import "server-only";

import type { AktuelleKarten, SpruchTag } from "@/lib/sprueche-data";

import { POSTS_AKTUELL } from "@/lib/posts-aktuell";
import {
  kartenFenster,
  postsFuer as postsAus,
  tagInHamburg,
} from "@/lib/sprueche-data";

/*
 * Posts je Tag mit allen tagesaktuellen Karten aus lib/posts-aktuell.ts,
 * nur auf dem Server (Seiten, Server Actions, Tests). Die Liste wächst
 * jeden Tag und enthält die Quellen, die nur im Mitgliederbereich
 * erscheinen. Der Browser bekommt sie deshalb nie ganz: /journal gibt der
 * Karte nur einen Ausschnitt ohne Quelle mit (journalKarten).
 */

export { POSTS_AKTUELL };

/** Alle Posts eines Kalendertags (yyyy-mm-dd), Karten zum Tag vor der Reserve. */
export function postsFuer(
  datum: string,
  aktuell: AktuelleKarten = POSTS_AKTUELL,
): SpruchTag[] {
  return postsAus(datum, aktuell);
}

/**
 * Was /journal der Karte im Browser mitgibt: die Karten von acht Tagen
 * vor heute bis morgen, ohne Quelle (kartenFenster in lib/sprueche-data.ts).
 */
export function journalKarten(jetzt: Date): AktuelleKarten {
  return kartenFenster(tagInHamburg(jetzt), POSTS_AKTUELL);
}
