/**
 * Kleiner, gemeinsamer Client-Zustand des Admin-Bereichs:
 *
 * - Kontakt-Vormerkung: Nach dem Tipp auf „Anrufen“ oder eine
 *   Mail-Vorlage wird {leadId, kanal, at} gemerkt. Kommt die Seite
 *   danach wieder in den Vordergrund (nach mindestens 5 s im
 *   Hintergrund), fragt der Kontakt-Streifen nach.
 * - Rücksprung: Welche Detail- und Angebotsseiten aus dem Admin heraus
 *   geöffnet wurden („‹ Zurück“ nutzt dann router.back() und behält
 *   Suche und Reiter).
 * - Ungespeicherte Angebots-Entwürfe des Editors.
 * - Suchbegriff: wird nur nach einer Zurück-Navigation (popstate) und
 *   höchstens 10 Min lang erneut gesucht.
 * - Ereignisse zwischen Teilen der Detailseite (Status geändert,
 *   Ergebnis-Schritt öffnen).
 *
 * clearAdminSession() leert alles (Abmelden, endgültiges Löschen):
 * Suchbegriff, Vormerkung und Entwürfe enthalten oft Kundendaten.
 *
 * sessionStorage kann fehlen oder werfen (privates Fenster); dann
 * gilt der Speicher im Modul als Rückfallebene.
 */

import type { LeadSnapshot, LeadStatus } from "@/lib/leads-meta";

import { STATUS_LABELS } from "@/lib/leads-meta";

export type ContactMark = {
  leadId: string;
  kanal: "anruf" | "mail";
  /** Zeitpunkt des Tipps (ms). */
  at: number;
  /** Seit wann die Seite verborgen ist (ms), sonst nicht gesetzt. */
  hiddenAt?: number;
  vorlage?: string;
  name?: string;
};

const CONTACT_KEY = "sitalo-admin-kontakt";
const BACK_KEY = "sitalo-admin-zurueck";
const SEARCH_KEY = "sitalo-admin-suche";
export const CONTACT_MAX_AGE = 30 * 60_000;
export const CONTACT_MIN_HIDDEN = 5_000;
export const SEARCH_MAX_AGE = 10 * 60_000;
/** So kurz nach einem popstate gilt ein Seitenaufbau als „Zurück“. */
const POP_WINDOW = 3_000;

type SearchMark = { q: string; at: number };

let memoryMark: ContactMark | null = null;
let memoryBack: string | null = null;
let memorySearch: SearchMark | null = null;
let poppedAt = 0;

function isMark(v: unknown): v is ContactMark {
  if (!v || typeof v !== "object") return false;
  const m = v as Record<string, unknown>;
  return (
    typeof m.leadId === "string" &&
    (m.kanal === "anruf" || m.kanal === "mail") &&
    typeof m.at === "number"
  );
}

export function readContact(): ContactMark | null {
  try {
    const raw = window.sessionStorage.getItem(CONTACT_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      return isMark(parsed) ? parsed : null;
    }
  } catch {
    // ohne Speicher: Modulzustand
  }
  return memoryMark;
}

function writeContact(mark: ContactMark | null): void {
  memoryMark = mark;
  try {
    if (mark) window.sessionStorage.setItem(CONTACT_KEY, JSON.stringify(mark));
    else window.sessionStorage.removeItem(CONTACT_KEY);
  } catch {
    // Modulzustand reicht
  }
}

export function markContact(mark: Omit<ContactMark, "at" | "hiddenAt">): void {
  writeContact({ ...mark, at: Date.now() });
}

export function clearContact(): void {
  writeContact(null);
}

/** Beim Verbergen der Seite festhalten, seit wann. */
export function noteHidden(now: number): void {
  const mark = readContact();
  if (mark && mark.hiddenAt === undefined) writeContact({ ...mark, hiddenAt: now });
}

/**
 * Beim Sichtbarwerden: Vormerkung zurückgeben, wenn die Seite danach
 * wirklich mindestens 5 s verborgen war und der Tipp jünger als
 * 30 Min ist. Die Vormerkung wird dabei gelöscht (einmalig).
 */
export function takeContact(now: number): ContactMark | null {
  const mark = readContact();
  if (!mark) return null;
  if (now - mark.at > CONTACT_MAX_AGE) {
    clearContact();
    return null;
  }
  if (mark.hiddenAt === undefined || mark.hiddenAt < mark.at) return null;
  if (now - mark.hiddenAt < CONTACT_MIN_HIDDEN) {
    // Nur kurz weg (z. B. „Anrufen?“ abgebrochen): weiter warten.
    writeContact({ ...mark, hiddenAt: undefined });
    return null;
  }
  clearContact();
  return mark;
}

/** So viele zuletzt aus dem Admin geöffnete Seiten merken (Anfrage → Angebot → …). */
const BACK_MAX = 6;

function readBackList(): string[] {
  try {
    const raw = window.sessionStorage.getItem(BACK_KEY);
    if (raw) {
      // Früher stand hier ein einzelner Pfad.
      if (raw.startsWith("/")) return [raw];
      const v: unknown = JSON.parse(raw);
      if (Array.isArray(v)) return v.filter((p): p is string => typeof p === "string");
      return [];
    }
  } catch {
    // Modulzustand
  }
  return memoryBack ? (JSON.parse(memoryBack) as string[]) : [];
}

/**
 * Seite, die per Tipp aus dem Admin geöffnet wurde. Gemerkt werden die
 * letzten paar Pfade, damit „Zurück“ auch nach Anfrage → Angebot →
 * zurück zur Anfrage noch bis zur Liste mit router.back() springt.
 */
export function rememberBackTarget(pathname: string): void {
  const list = [...readBackList().filter((p) => p !== pathname), pathname].slice(-BACK_MAX);
  memoryBack = JSON.stringify(list);
  try {
    window.sessionStorage.setItem(BACK_KEY, memoryBack);
  } catch {
    // Modulzustand reicht
  }
}

/** Zuletzt aus dem Admin geöffnete Seite (oder null). */
export function backTarget(): string | null {
  const list = readBackList();
  return list[list.length - 1] ?? null;
}

/** Wurde diese Seite per Tipp aus dem Admin geöffnet (dann gibt es ein „Zurück“)? */
export function openedFromAdmin(pathname: string): boolean {
  return readBackList().includes(pathname);
}

// --- Ungespeicherte Angebots-Entwürfe (Editor) ---

const DRAFT_PREFIX = "sitalo-admin-angebot-";

/**
 * Ungespeicherter Stand des Angebots-Editors, damit beim Zurück-Wischen
 * oder Neuladen nichts verloren geht. `base` ist updated_at des
 * gespeicherten Stands, auf dem der Entwurf aufbaut.
 */
export type AngebotDraft = { base: string; at: number; data: unknown };

export function readAngebotDraft(id: string): AngebotDraft | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_PREFIX + id);
    if (!raw) return null;
    const v: unknown = JSON.parse(raw);
    if (
      v &&
      typeof v === "object" &&
      typeof (v as AngebotDraft).base === "string" &&
      typeof (v as AngebotDraft).at === "number"
    ) {
      return v as AngebotDraft;
    }
  } catch {
    // ohne Speicher kein Entwurf
  }
  return null;
}

export function writeAngebotDraft(id: string, draft: AngebotDraft | null): void {
  try {
    if (draft) window.sessionStorage.setItem(DRAFT_PREFIX + id, JSON.stringify(draft));
    else window.sessionStorage.removeItem(DRAFT_PREFIX + id);
  } catch {
    // ohne Speicher: Warnung beim Verlassen bleibt
  }
}

// --- Suchbegriff ---

export function rememberSearch(q: string, now: number): void {
  memorySearch = q ? { q, at: now } : null;
  try {
    if (memorySearch) window.sessionStorage.setItem(SEARCH_KEY, JSON.stringify(memorySearch));
    else window.sessionStorage.removeItem(SEARCH_KEY);
  } catch {
    // Modulzustand reicht
  }
}

function readSearch(): SearchMark | null {
  try {
    const raw = window.sessionStorage.getItem(SEARCH_KEY);
    if (raw) {
      const v: unknown = JSON.parse(raw);
      if (
        v &&
        typeof v === "object" &&
        typeof (v as SearchMark).q === "string" &&
        typeof (v as SearchMark).at === "number"
      ) {
        return v as SearchMark;
      }
      return null;
    }
  } catch {
    // Modulzustand
  }
  return memorySearch;
}

// Zeitpunkt jeder Zurück-/Vor-Navigation (Geste, router.back()). Next
// rendert die wiederhergestellte Seite synchron im eigenen popstate-
// Handler; die Suche fragt deshalb erst per setTimeout nach.
if (typeof window !== "undefined") {
  window.addEventListener(
    "popstate",
    () => {
      poppedAt = Date.now();
    },
    true,
  );
}

/**
 * Letzten Suchbegriff zurückgeben, aber nur direkt nach einer Zurück-
 * Navigation und wenn er jünger als 10 Min ist. Ein frischer Aufruf von
 * /admin (App geöffnet, Kopf-Link) startet ohne Suche.
 */
export function recallSearch(now: number): string {
  const mark = readSearch();
  if (!mark) return "";
  if (now - mark.at > SEARCH_MAX_AGE) {
    rememberSearch("", now);
    return "";
  }
  if (now - poppedAt > POP_WINDOW) return "";
  return mark.q;
}

/** Alles vergessen: Abmelden, endgültiges Löschen. */
export function clearAdminSession(): void {
  memoryMark = null;
  memoryBack = null;
  memorySearch = null;
  poppedAt = 0;
  try {
    for (const key of [CONTACT_KEY, BACK_KEY, SEARCH_KEY]) {
      window.sessionStorage.removeItem(key);
    }
    // Angebots-Entwürfe enthalten Kundendaten.
    for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
      const key = window.sessionStorage.key(i);
      if (key?.startsWith(DRAFT_PREFIX)) window.sessionStorage.removeItem(key);
    }
  } catch {
    // Modulzustand ist schon leer
  }
}

// --- Ereignisse innerhalb der Detailseite ---

export const STATUS_DONE_EVENT = "sitalo-admin:status";
export const OPEN_OUTCOME_EVENT = "sitalo-admin:ergebnis";
export const OPEN_REPLY_EVENT = "sitalo-admin:antworten";
/** Offene Suche schließen (nach langer Zeit im Hintergrund). */
export const SEARCH_RESET_EVENT = "sitalo-admin:suche-zuruecksetzen";

export type StatusDone = {
  /** Text im Streifen, z. B. „Auf Erledigt gesetzt“. */
  label: string;
  undo: LeadSnapshot;
  /** Schritt „Wie ist es ausgegangen?“ anbieten. */
  askOutcome: boolean;
};

/** „Auf „In Arbeit“ gesetzt“: Statusname in Anführungszeichen, sonst liest es sich holprig. */
export function statusDoneLabel(status: LeadStatus): string {
  return `Auf „${STATUS_LABELS[status]}“ gesetzt`;
}

export function emitStatusDone(detail: StatusDone): void {
  window.dispatchEvent(new CustomEvent<StatusDone>(STATUS_DONE_EVENT, { detail }));
}

export function openOutcome(): void {
  window.dispatchEvent(new Event(OPEN_OUTCOME_EVENT));
}

export function openReply(): void {
  window.dispatchEvent(new Event(OPEN_REPLY_EVENT));
}
