/**
 * Zahlen & Überblick im Mitgliederbereich (/admin/zahlen).
 *
 * Rein (ohne Server- oder Next-Importe), unter node --test prüfbar.
 * Gelesen wird in lib/admin/zahlen-store.ts (server-only), hier wird
 * nur gezählt und gerechnet.
 *
 * - Alle Zeiträume als Hamburger Kalendertage (Europe/Berlin), Wochen
 *   beginnen am Montag, Kalenderwochen nach ISO 8601.
 * - Beträge in ganzen Cent und brutto (inkl. USt), wie im Angebot
 *   (berechneSummen).
 * - Nur echte Daten: Was nicht in der Datenbank steht, wird nicht
 *   geschätzt. Unter MIN_… Datenpunkten gibt es keinen Wert (null).
 */

import type { Angebot, AngebotPosition, UstSatz } from "@/lib/admin/angebote";
import type { ProjektAngebot, ProjektRow } from "@/lib/admin/projekte";
import type {
  LeadEvent,
  LeadKind,
  LeadOutcome,
  LeadRow,
} from "@/lib/leads-meta";

import {
  berechneSummen,
  formatEuro,
  istAbgelaufen,
} from "@/lib/admin/angebote";
import {
  addDays,
  berlinDateIso,
  berlinWallToUtc,
  daysBetween,
  MONTHS_LONG,
  weekdayOf,
} from "@/lib/admin/berlin-time";
import { pflegeUebersicht, projektSichten } from "@/lib/admin/projekte";
import { replyDue } from "@/lib/admin/reply-due";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Wie viele Wochen die Balkenreihe zeigt (die laufende eingeschlossen). */
export const WOCHEN = 12;
/** Zeitfenster für die Antwortzeit in Tagen. */
export const ANTWORT_TAGE = 90;
/** Weniger beantwortete Anfragen: „Noch zu wenig Daten“. */
export const MIN_ANTWORTEN = 3;
/** Weniger entschiedene Angebote: keine Annahmequote. */
export const MIN_ENTSCHIEDEN = 3;

// ---------------------------------------------------------------------
// Zeiträume
// ---------------------------------------------------------------------

/** Montag der Woche eines ISO-Datums (yyyy-mm-dd). */
export function wochenStart(iso: string): string {
  return addDays(iso, -((weekdayOf(iso) + 6) % 7));
}

/** Kalenderwoche nach ISO 8601 (die Woche mit dem 4. Januar ist KW 1). */
export function kalenderwoche(iso: string): number {
  const montag = wochenStart(iso);
  const jahr = Number(addDays(montag, 3).slice(0, 4));
  return Math.floor(daysBetween(wochenStart(`${jahr}-01-04`), montag) / 7) + 1;
}

export type Zeitraeume = {
  heute: string;
  /** Montag dieser Woche. */
  woche: string;
  vorwoche: string;
  /** Erster Tag dieses Monats. */
  monat: string;
  vormonat: string;
  /** 1. Januar dieses Jahres. */
  jahr: string;
  /** Montage der letzten WOCHEN Wochen, älteste zuerst, die laufende zuletzt. */
  wochen: string[];
};

export function zeitraeume(now: Date): Zeitraeume {
  const heute = berlinDateIso(now);
  const woche = wochenStart(heute);
  const monat = `${heute.slice(0, 7)}-01`;
  return {
    heute,
    woche,
    vorwoche: addDays(woche, -7),
    monat,
    vormonat: `${addDays(monat, -1).slice(0, 7)}-01`,
    jahr: `${heute.slice(0, 4)}-01-01`,
    wochen: Array.from({ length: WOCHEN }, (_, i) =>
      addDays(woche, (i - (WOCHEN - 1)) * 7),
    ),
  };
}

/**
 * Ab wann Anfragen gelesen werden müssen: der früheste Tag, den eine
 * Kachel braucht (1. Januar, Beginn der Balkenreihe, Vormonat) bzw.
 * ANTWORT_TAGE zurück, je nachdem, was früher liegt.
 */
export function leseAb(now: Date): Date {
  const z = zeitraeume(now);
  const frueh = [z.jahr, z.wochen[0], z.vormonat].sort()[0];
  const mitternacht = berlinWallToUtc(frueh, "00:00").getTime();
  return new Date(Math.min(mitternacht, now.getTime() - ANTWORT_TAGE * DAY));
}

/** Hamburger Kalendertag eines Zeitstempels, null bei Unsinn. */
function tagVon(stamp: string | null | undefined): string | null {
  if (!stamp) return null;
  const t = Date.parse(stamp);
  return Number.isNaN(t) ? null : berlinDateIso(new Date(t));
}

/** „November“ für ein ISO-Datum. */
export function monatsName(iso: string): string {
  return MONTHS_LONG[Number(iso.slice(5, 7)) - 1] ?? "";
}

/** „3.–9.11.“ bzw. „27.10.–2.11.“ für die Woche ab montag. */
export function wochenSpanne(montag: string): string {
  const sonntag = addDays(montag, 6);
  const d = (iso: string) => Number(iso.slice(8, 10));
  const m = (iso: string) => Number(iso.slice(5, 7));
  return m(montag) === m(sonntag)
    ? `${d(montag)}.–${d(sonntag)}.${m(sonntag)}.`
    : `${d(montag)}.${m(montag)}.–${d(sonntag)}.${m(sonntag)}.`;
}

// ---------------------------------------------------------------------
// Anfragen
// ---------------------------------------------------------------------

export const ARTEN: readonly LeadKind[] = ["anfrage", "audit", "termin"];

export type ArtZahlen = { alle: number } & Record<LeadKind, number>;

const leer = (): ArtZahlen => ({ alle: 0, anfrage: 0, audit: 0, termin: 0 });

function zaehle(z: ArtZahlen, kind: string) {
  z.alle += 1;
  if ((ARTEN as readonly string[]).includes(kind)) z[kind as LeadKind] += 1;
}

export type WochenBalken = {
  montag: string;
  kw: number;
  zahlen: ArtZahlen;
  /** Die laufende Woche (noch nicht vorbei). */
  laufend: boolean;
};

export type AnfragenZahlen = {
  dieseWoche: ArtZahlen;
  letzteWoche: ArtZahlen;
  dieserMonat: ArtZahlen;
  letzterMonat: ArtZahlen;
  monatName: string;
  vormonatName: string;
  wochen: WochenBalken[];
  /** Größter Wochenwert (für die Balkenhöhe), mindestens 1. */
  max: number;
  /** Summe über alle WOCHEN Wochen. */
  summe: number;
};

export function anfragenZahlen(
  leads: readonly Pick<LeadRow, "created_at" | "kind">[],
  now: Date,
): AnfragenZahlen {
  const z = zeitraeume(now);
  const out = {
    dieseWoche: leer(),
    letzteWoche: leer(),
    dieserMonat: leer(),
    letzterMonat: leer(),
  };
  const wochen: WochenBalken[] = z.wochen.map((montag) => ({
    montag,
    kw: kalenderwoche(montag),
    zahlen: leer(),
    laufend: montag === z.woche,
  }));
  const index = new Map(z.wochen.map((m, i) => [m, i]));

  for (const lead of leads) {
    const tag = tagVon(lead.created_at);
    if (!tag || tag > z.heute) continue;
    if (tag >= z.woche) zaehle(out.dieseWoche, lead.kind);
    else if (tag >= z.vorwoche) zaehle(out.letzteWoche, lead.kind);
    if (tag >= z.monat) zaehle(out.dieserMonat, lead.kind);
    else if (tag >= z.vormonat) zaehle(out.letzterMonat, lead.kind);
    const i = index.get(wochenStart(tag));
    if (i !== undefined) zaehle(wochen[i].zahlen, lead.kind);
  }

  return {
    ...out,
    monatName: monatsName(z.monat),
    vormonatName: monatsName(z.vormonat),
    wochen,
    max: Math.max(1, ...wochen.map((w) => w.zahlen.alle)),
    summe: wochen.reduce((s, w) => s + w.zahlen.alle, 0),
  };
}

// ---------------------------------------------------------------------
// Angebote
// ---------------------------------------------------------------------

export type ZahlenAngebot = Pick<
  Angebot,
  "status" | "gueltig_bis" | "accepted_at"
> & {
  positionen: readonly Pick<AngebotPosition, "menge" | "preis_cent" | "art">[];
  ust_satz: UstSatz;
};

/** Anzahl und Summen (Cent, brutto). */
export type Summen = { anzahl: number; einmalig: number; monatlich: number };

const keineSummen = (): Summen => ({ anzahl: 0, einmalig: 0, monatlich: 0 });

/**
 * Wo ein Angebot steht: Entwurf, offen (gesendet und noch gültig),
 * angenommen oder entschieden ohne Annahme (abgelehnt, zurückgezogen
 * oder gesendet und abgelaufen).
 */
export type AngebotLage =
  | "entwurf"
  | "offen"
  | "angenommen"
  | "nicht_angenommen";

export function angebotLage(
  a: Pick<Angebot, "status" | "gueltig_bis">,
  now: Date,
): AngebotLage {
  switch (a.status) {
    case "entwurf":
      return "entwurf";
    case "gesendet":
      return istAbgelaufen(a.gueltig_bis, now) ? "nicht_angenommen" : "offen";
    case "angenommen":
      return "angenommen";
    default:
      return "nicht_angenommen";
  }
}

export type AngeboteZahlen = {
  offen: Summen;
  angenommenMonat: Summen;
  angenommenJahr: Summen;
  monatName: string;
  jahr: number;
  /** Entschiedene Angebote (angenommen + nicht angenommen). */
  entschieden: number;
  angenommen: number;
  /** angenommen / entschieden, null unter MIN_ENTSCHIEDEN. */
  quote: number | null;
  /**
   * Angenommene Angebote mit Monatsbeitrag > 0 und deren Summe. Für die
   * Kachel „Laufende Pflege“ nur ohne Tabelle projekte (pflegeAusAngeboten).
   */
  pflege: { anzahl: number; monatlich: number };
};

export function angeboteZahlen(
  rows: readonly ZahlenAngebot[],
  now: Date,
): AngeboteZahlen {
  const z = zeitraeume(now);
  const offen = keineSummen();
  const monat = keineSummen();
  const jahr = keineSummen();
  const pflege = { anzahl: 0, monatlich: 0 };
  let entschieden = 0;
  let angenommen = 0;

  for (const a of rows) {
    const lage = angebotLage(a, now);
    if (lage === "entwurf") continue;
    const s = berechneSummen(a.positionen, a.ust_satz);
    const dazu = (t: Summen) => {
      t.anzahl += 1;
      t.einmalig += s.einmalig.brutto;
      t.monatlich += s.monatlich.brutto;
    };
    if (lage === "offen") {
      dazu(offen);
      continue;
    }
    entschieden += 1;
    if (lage !== "angenommen") continue;
    angenommen += 1;
    if (s.monatlich.brutto > 0) {
      pflege.anzahl += 1;
      pflege.monatlich += s.monatlich.brutto;
    }
    const tag = tagVon(a.accepted_at);
    if (tag && tag <= z.heute) {
      if (tag >= z.monat) dazu(monat);
      if (tag >= z.jahr) dazu(jahr);
    }
  }

  return {
    offen,
    angenommenMonat: monat,
    angenommenJahr: jahr,
    monatName: monatsName(z.monat),
    jahr: Number(z.jahr.slice(0, 4)),
    entschieden,
    angenommen,
    quote: entschieden >= MIN_ENTSCHIEDEN ? angenommen / entschieden : null,
    pflege,
  };
}

// ---------------------------------------------------------------------
// Laufende Pflege
// ---------------------------------------------------------------------

export type PflegeKachel = {
  /** Summe der laufenden Pflege je Monat (Cent, brutto). */
  monatlich: number;
  /** Wie viele Kunden bzw. Angebote darin stecken. */
  anzahl: number;
  /** Sätze unter der Zahl, in dieser Reihenfolge. */
  hinweise: string[];
};

/**
 * „Laufende Pflege“ mit der Tabelle projekte: dieselbe Rechnung wie
 * auf /admin/kunden (projektSichten + pflegeUebersicht). Es zählt nur
 * Pflege, die begonnen hat (Livegang oder gespeicherter Beginn) und
 * nicht beendet ist. `grenze`: Obergrenze der Liste angenommener
 * Angebote, wenn sie erreicht wurde, sonst null.
 */
export function pflegeAusProjekten(
  angebote: readonly ProjektAngebot[],
  projekte: readonly ProjektRow[],
  now: Date,
  grenze: number | null,
): PflegeKachel {
  const u = pflegeUebersicht(projektSichten(angebote, projekte, now));
  const hinweise: string[] = [];
  if (u.aktiv.length > 0) {
    hinweise.push(
      `${anzahl(u.aktiv.length, "Kunde", "Kunden")} mit laufender Pflege, inkl. USt. Gezählt ab dem Livegang bis zum Ende, wie unter Kunden & Projekte.`,
    );
  } else if (u.geplant.length > 0 || u.beendet.length > 0) {
    hinweise.push("Gerade läuft bei keinem Kunden eine Pflege.");
  } else {
    hinweise.push("Noch kein angenommenes Angebot mit Monatsbeitrag.");
  }
  const ohne = [
    u.geplant.length > 0 ? `${u.geplant.length} noch nicht begonnen` : null,
    u.beendet.length > 0 ? `${u.beendet.length} beendet` : null,
  ].filter(Boolean);
  if (ohne.length > 0) hinweise.push(`Nicht mitgezählt: ${ohne.join(", ")}.`);
  if (grenze !== null) {
    hinweise.push(
      `Gezählt wurden die zuletzt angenommenen ${grenze} Angebote.`,
    );
  }
  return { monatlich: u.summeMonatlich, anzahl: u.aktiv.length, hinweise };
}

/**
 * Ohne Tabelle projekte (Datenbank-Update fehlt): nur die angenommenen
 * Angebote aus angeboteZahlen, Beginn und Ende sind dann unbekannt.
 * `grenze`: Obergrenze der Angebotsliste, wenn sie erreicht wurde.
 */
export function pflegeAusAngeboten(
  pflege: AngeboteZahlen["pflege"],
  grenze: number | null,
): PflegeKachel {
  const hinweise = [
    pflege.anzahl === 0
      ? "Noch kein angenommenes Angebot mit Monatsbeitrag."
      : `Monatsbeiträge aus ${anzahl(
          pflege.anzahl,
          "angenommenen Angebot",
          "angenommenen Angeboten",
        )}, inkl. USt. Kündigungen sind hier nicht erfasst.`,
  ];
  if (grenze !== null) {
    hinweise.push(
      `Gezählt wurden die neuesten ${grenze} Angebote, ältere Monatsbeiträge können fehlen.`,
    );
  }
  return { monatlich: pflege.monatlich, anzahl: pflege.anzahl, hinweise };
}

// ---------------------------------------------------------------------
// Antwortzeit
// ---------------------------------------------------------------------

/** Aktionen, unter denen eine erste Reaktion stehen kann (für .in()). */
export const REAKTION_AKTIONEN = ["status", "kontakt", "angebot"] as const;

export type ZahlenEvent = Pick<
  LeadEvent,
  "lead_id" | "created_at" | "action" | "detail"
>;

/**
 * Zählt dieser Verlaufseintrag als erste Reaktion? Status weg von
 * „Neu“ (nicht als Rückgängig), Anruf erreicht, Mail gesendet oder
 * Angebot freigegeben bzw. an den Kunden geschickt.
 */
export function istReaktion(e: Pick<LeadEvent, "action" | "detail">): boolean {
  const d = e.detail ?? {};
  switch (e.action) {
    case "status":
      return d.from === "neu" && d.to !== "neu" && !d.rueckgaengig;
    case "kontakt":
      return d.ergebnis === "erreicht" || d.ergebnis === "gesendet";
    case "angebot":
      return d.was === "freigegeben" || d.was === "gesendet";
    default:
      return false;
  }
}

/** Spielraum für Uhrzeiten von Anfrage und Verlauf (Server-Uhren). */
const UHR_SPIELRAUM = MINUTE;

/** Nimmt dieser Eintrag einen Statuswechsel weg von „Neu“ zurück? */
function zurueckAufNeu(e: Pick<LeadEvent, "action" | "detail">): boolean {
  const d = e.detail ?? {};
  return e.action === "status" && Boolean(d.rueckgaengig) && d.to === "neu";
}

/**
 * Früheste Reaktion je Anfrage (lead_id → Zeitpunkt in ms). Mit
 * `eingang` (lead_id → Eingang in ms) zählen nur Einträge ab dem
 * Eingang; ältere können nicht zu dieser Anfrage gehören.
 *
 * Der Verlauf wird je Anfrage der Zeit nach nachgespielt: Ein
 * Statuswechsel weg von „Neu“ zählt nur, bis er mit „Rückgängig“
 * zurückgenommen wird (zurück auf Neu). Anruf erreicht, Mail gesendet
 * oder Angebot verschickt beenden die Suche; gilt dann noch ein
 * früherer Statuswechsel, zählt dieser.
 */
export function ersteReaktionen(
  events: readonly ZahlenEvent[],
  eingang?: ReadonlyMap<string, number>,
): Map<string, number> {
  const jeAnfrage = new Map<string, { t: number; e: ZahlenEvent }[]>();
  for (const e of events) {
    if (!istReaktion(e) && !zurueckAufNeu(e)) continue;
    const t = Date.parse(e.created_at);
    if (Number.isNaN(t)) continue;
    const list = jeAnfrage.get(e.lead_id);
    if (list) list.push({ t, e });
    else jeAnfrage.set(e.lead_id, [{ t, e }]);
  }

  const out = new Map<string, number>();
  for (const [leadId, list] of jeAnfrage) {
    // Stabil: Bei gleichem Zeitpunkt bleibt die gelesene Reihenfolge.
    list.sort((a, b) => a.t - b.t);
    const ab = eingang?.get(leadId);
    /** Statuswechsel weg von Neu, der (noch) nicht zurückgenommen ist. */
    let offen: number | null = null;
    let ergebnis: number | null = null;
    for (const { t, e } of list) {
      if (zurueckAufNeu(e)) {
        offen = null;
        continue;
      }
      if (ab !== undefined && t < ab - UHR_SPIELRAUM) continue;
      if (e.action === "status") {
        offen ??= t;
        continue;
      }
      ergebnis = offen ?? t;
      break;
    }
    ergebnis ??= offen;
    if (ergebnis !== null) out.set(leadId, ergebnis);
  }
  return out;
}

/** Median (bei gerader Anzahl Mittel der beiden mittleren Werte). */
export function median(werte: readonly number[]): number | null {
  if (werte.length === 0) return null;
  const s = [...werte].sort((a, b) => a - b);
  const mitte = Math.floor(s.length / 2);
  return s.length % 2 ? s[mitte] : (s[mitte - 1] + s[mitte]) / 2;
}

export type AntwortZahlen = {
  /** Anfragen der letzten ANTWORT_TAGE Tage. */
  anfragen: number;
  /** Davon mit erfasster erster Reaktion. */
  beantwortet: number;
  /** Davon bis zum Antwortziel (replyDue … .ziel). */
  imZiel: number;
  ohneReaktion: number;
  /** Median bis zur ersten Reaktion in ms, null unter MIN_ANTWORTEN. */
  medianMs: number | null;
  /** imZiel / beantwortet, null unter MIN_ANTWORTEN. */
  anteilImZiel: number | null;
};

export function antwortZahlen(
  leads: readonly Pick<LeadRow, "id" | "created_at" | "kind">[],
  events: readonly ZahlenEvent[],
  now: Date,
): AntwortZahlen {
  const ab = now.getTime() - ANTWORT_TAGE * DAY;
  const eingang = new Map<string, number>();
  for (const lead of leads) {
    const t = Date.parse(lead.created_at);
    if (!Number.isNaN(t)) eingang.set(lead.id, t);
  }
  const erste = ersteReaktionen(events, eingang);
  const dauern: number[] = [];
  let anfragen = 0;
  let imZiel = 0;
  for (const lead of leads) {
    const t = Date.parse(lead.created_at);
    if (Number.isNaN(t) || t < ab || t > now.getTime()) continue;
    anfragen += 1;
    const r = erste.get(lead.id);
    if (r === undefined) continue;
    dauern.push(Math.max(0, r - t));
    if (r <= replyDue(lead.kind, new Date(t)).ziel.getTime()) imZiel += 1;
  }
  const genug = dauern.length >= MIN_ANTWORTEN;
  return {
    anfragen,
    beantwortet: dauern.length,
    imZiel,
    ohneReaktion: anfragen - dauern.length,
    medianMs: genug ? median(dauern) : null,
    anteilImZiel: genug ? imZiel / dauern.length : null,
  };
}

/** IDs der Anfragen im Antwort-Zeitfenster (für das Lesen des Verlaufs). */
export function antwortFensterIds(
  leads: readonly Pick<LeadRow, "id" | "created_at">[],
  now: Date,
): string[] {
  const ab = now.getTime() - ANTWORT_TAGE * DAY;
  return leads
    .filter((l) => {
      const t = Date.parse(l.created_at);
      return !Number.isNaN(t) && t >= ab && t <= now.getTime();
    })
    .map((l) => l.id);
}

// ---------------------------------------------------------------------
// Ergebnis
// ---------------------------------------------------------------------

export type ErgebnisZahlen = {
  jahr: number;
  gewonnen: number;
  verloren: number;
};

/** Ergebnisse der Anfragen, die seit dem 1. Januar eingegangen sind. */
export function ergebnisZahlen(
  leads: readonly (Pick<LeadRow, "created_at"> & {
    outcome?: LeadOutcome | null;
  })[],
  now: Date,
): ErgebnisZahlen {
  const z = zeitraeume(now);
  let gewonnen = 0;
  let verloren = 0;
  for (const lead of leads) {
    const tag = tagVon(lead.created_at);
    if (!tag || tag < z.jahr || tag > z.heute) continue;
    if (lead.outcome === "gewonnen") gewonnen += 1;
    else if (lead.outcome === "verloren") verloren += 1;
  }
  return { jahr: Number(z.jahr.slice(0, 4)), gewonnen, verloren };
}

// ---------------------------------------------------------------------
// Anzeige
// ---------------------------------------------------------------------

/** „35 Min“, „2 Std 10 Min“, „1 Tag 4 Std“, „5 Tage“. */
export function formatDauer(ms: number): string {
  const minuten = Math.max(0, Math.round(ms / MINUTE));
  if (minuten < 60) return `${Math.max(1, minuten)} Min`;
  const stunden = Math.floor(minuten / 60);
  if (stunden < 24) {
    const rest = minuten % 60;
    return rest && stunden < 10
      ? `${stunden} Std ${rest} Min`
      : `${stunden} Std`;
  }
  const tage = Math.floor(stunden / 24);
  const rest = stunden % 24;
  const tageText = tage === 1 ? "1 Tag" : `${tage} Tage`;
  return rest && tage < 3 ? `${tageText} ${rest} Std` : tageText;
}

/** „67 %“ (gerundet, geschütztes Leerzeichen). */
export function formatAnteil(anteil: number): string {
  return `${Math.round(anteil * 100)} %`;
}

/** „3.497 €“, mit Cent nur, wenn es welche gibt („3.497,50 €“). */
export function formatEuroGanz(cent: number): string {
  return formatEuro(cent).replace(/,00(?=\s€$)/, "");
}

/** „1 Angebot“ / „3 Angebote“. */
export function anzahl(n: number, eins: string, mehr: string): string {
  return `${n} ${n === 1 ? eins : mehr}`;
}
