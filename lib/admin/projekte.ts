/**
 * Kunden & Projekte: Jedes angenommene Angebot ist ein Projekt mit fünf
 * Schritten (Anzahlung bis Livegang). Dazu die monatliche Pflege der
 * Kunden, deren Angebot einen Monatsbeitrag hat.
 *
 * Rein (ohne Server- oder Next-Importe): in Seiten, Client-Komponenten,
 * Server Actions und unter node --test nutzbar. Gespeichert wird über
 * lib/projekte-store.ts (server-only), Tabelle public.projekte
 * (supabase/migrations/20261116000000_ausbau.sql).
 *
 * Alle Daten sind Hamburger Kalendertage (yyyy-mm-dd), Beträge ganze
 * Cent brutto wie im Angebot (berechneSummen).
 */

import type { Angebot, AngebotSummen } from "@/lib/admin/angebote";

import { berechneSummen } from "@/lib/admin/angebote";
import { addDays, berlinDateIso } from "@/lib/admin/berlin-time";

// ---------------------------------------------------------------------
// Schritte
// ---------------------------------------------------------------------

/** In dieser Reihenfolge. */
export const PROJEKT_SCHRITTE = [
  "anzahlung",
  "inhalte",
  "entwurf",
  "korrektur",
  "livegang",
] as const;
export type ProjektSchritt = (typeof PROJEKT_SCHRITTE)[number];

export const SCHRITT_LABELS: Record<ProjektSchritt, string> = {
  anzahlung: "Anzahlung",
  inhalte: "Inhalte",
  entwurf: "Entwurf",
  korrektur: "Korrektur",
  livegang: "Livegang",
};

/** Was der Schritt bedeutet (du-Form, kurz). */
export const SCHRITT_HINWEISE: Record<ProjektSchritt, string> = {
  anzahlung: "Die Anzahlung ist eingegangen.",
  inhalte: "Texte, Fotos und Logo sind da.",
  entwurf: "Der Kunde hat den Entwurf gesehen.",
  korrektur: "Die Korrekturen sind eingearbeitet.",
  livegang: "Die Seite ist online.",
};

/** Schritt → Tag, an dem er erledigt war. Fehlt ein Schritt, ist er offen. */
export type Schritte = Partial<Record<ProjektSchritt, string>>;

/** Notiz: höchstens so viele Zeichen (die Datenbank erlaubt 2000). */
export const PROJEKT_NOTIZ_MAX = 1000;

// ---------------------------------------------------------------------
// Zeilen
// ---------------------------------------------------------------------

/** Eine Zeile der Tabelle public.projekte. */
export type ProjektRow = {
  id: string;
  angebot_id: string;
  lead_id: string;
  created_at: string;
  updated_at: string;
  schritte: Schritte;
  livegang_am: string | null;
  pflege_seit: string | null;
  pflege_bis: string | null;
  notiz: string | null;
};

/** Alle Spalten (select und Schema-Prüfung). */
export const PROJEKT_COLUMNS = [
  "id",
  "angebot_id",
  "lead_id",
  "created_at",
  "updated_at",
  "schritte",
  "livegang_am",
  "pflege_seit",
  "pflege_bis",
  "notiz",
] as const satisfies readonly (keyof ProjektRow)[];

/** Was ein Projekt vom Angebot braucht (ohne Token, Texte, E-Mail). */
export const PROJEKT_ANGEBOT_COLUMNS = [
  "id",
  "lead_id",
  "nummer",
  "status",
  "titel",
  "kunde_name",
  "kunde_firma",
  "accepted_at",
  "positionen",
  "ust_satz",
] as const satisfies readonly (keyof Angebot)[];
export type ProjektAngebot = Pick<
  Angebot,
  (typeof PROJEKT_ANGEBOT_COLUMNS)[number]
>;

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Echtes Kalenderdatum yyyy-mm-dd zwischen 2020 und 2100, sonst null. */
export function parseProjektDatum(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const m = ISO_DATE_RE.exec(v);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  if (
    t.getUTCFullYear() !== y ||
    t.getUTCMonth() !== mo - 1 ||
    t.getUTCDate() !== d ||
    y < 2020 ||
    y > 2100
  )
    return null;
  return v;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

/**
 * schritte aus jsonb, nachsichtig: Unbekannte Schritte und kaputte
 * Daten fallen weg, statt die Seite zu sprengen.
 */
export function schritteAusDb(v: unknown): Schritte {
  const out: Schritte = {};
  if (!isRecord(v)) return out;
  for (const s of PROJEKT_SCHRITTE) {
    const datum = parseProjektDatum(v[s]);
    if (datum) out[s] = datum;
  }
  return out;
}

const dateOrNull = (v: unknown): string | null =>
  typeof v === "string" ? parseProjektDatum(v.slice(0, 10)) : null;

/** Datenbank-Zeile → Projekt (Schritte und Daten geprüft). */
export function projektAusZeile(data: unknown): ProjektRow {
  const row = isRecord(data) ? data : {};
  return {
    id: String(row.id),
    angebot_id: String(row.angebot_id),
    lead_id: String(row.lead_id),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
    schritte: schritteAusDb(row.schritte),
    livegang_am: dateOrNull(row.livegang_am),
    pflege_seit: dateOrNull(row.pflege_seit),
    pflege_bis: dateOrNull(row.pflege_bis),
    notiz: typeof row.notiz === "string" ? row.notiz : null,
  };
}

// ---------------------------------------------------------------------
// Eingaben (Server Actions)
// ---------------------------------------------------------------------

export function parseSchritt(v: unknown): ProjektSchritt | null {
  return typeof v === "string" &&
    (PROJEKT_SCHRITTE as readonly string[]).includes(v)
    ? (v as ProjektSchritt)
    : null;
}

/**
 * Datum, an dem ein Schritt erledigt war: echtes Datum, nicht in der
 * Zukunft (Hamburger Zeit), nicht vor 2020.
 */
export function parseSchrittDatum(v: unknown, now: Date): string | null {
  const iso = parseProjektDatum(v);
  if (!iso) return null;
  return iso <= berlinDateIso(now) ? iso : null;
}

/** Notiz: getrimmt, höchstens PROJEKT_NOTIZ_MAX Zeichen; leer wird null. */
export function parseProjektNotiz(v: unknown): { notiz: string | null } | null {
  if (typeof v !== "string") return null;
  const text = v.replace(/\r\n?/g, "\n").trim();
  if (text.length > PROJEKT_NOTIZ_MAX) return null;
  return { notiz: text || null };
}

// ---------------------------------------------------------------------
// Fortschritt
// ---------------------------------------------------------------------

export type Fortschritt = {
  erledigt: number;
  gesamt: number;
  /** Erster offener Schritt in der Reihenfolge; null, wenn alles erledigt ist. */
  naechster: ProjektSchritt | null;
  fertig: boolean;
};

export function fortschritt(schritte: Schritte): Fortschritt {
  const erledigt = PROJEKT_SCHRITTE.filter((s) => schritte[s]).length;
  const naechster = PROJEKT_SCHRITTE.find((s) => !schritte[s]) ?? null;
  return {
    erledigt,
    gesamt: PROJEKT_SCHRITTE.length,
    naechster,
    fertig: naechster === null,
  };
}

/** „3 von 5“ */
export function fortschrittText(f: Pick<Fortschritt, "erledigt" | "gesamt">) {
  return `${f.erledigt} von ${f.gesamt}`;
}

/**
 * Schritt abhaken (datum) oder wieder öffnen (null). Der Livegang setzt
 * zugleich livegang_am (und leert es beim Öffnen). Gibt den Patch für
 * die Datenbank zurück.
 */
export function mitSchritt(
  schritte: Schritte,
  schritt: ProjektSchritt,
  datum: string | null,
): { schritte: Schritte; livegang_am?: string | null } {
  const next: Schritte = { ...schritte };
  if (datum) next[schritt] = datum;
  else delete next[schritt];
  // Feste Reihenfolge im gespeicherten Objekt (lesbar im Dashboard).
  const sortiert: Schritte = {};
  for (const s of PROJEKT_SCHRITTE) if (next[s]) sortiert[s] = next[s];
  return schritt === "livegang"
    ? { schritte: sortiert, livegang_am: datum }
    : { schritte: sortiert };
}

// ---------------------------------------------------------------------
// Pflege
// ---------------------------------------------------------------------

/** Monatlicher Betrag brutto in Cent (0 ohne Monatsposition). */
export function monatlichBrutto(
  a: Pick<ProjektAngebot, "positionen" | "ust_satz">,
): number {
  return berechneSummen(a.positionen, a.ust_satz).monatlich.brutto;
}

/**
 * Seit wann die Pflege läuft: gespeichert, sonst der Livegang, sonst
 * der Tag der Annahme.
 */
export function pflegeSeit(
  projekt: Pick<ProjektRow, "pflege_seit" | "livegang_am"> | null,
  angenommenAm: string | null,
): string | null {
  return projekt?.pflege_seit ?? projekt?.livegang_am ?? angenommenAm;
}

/**
 * Läuft die Pflege? Nur mit Monatsbeitrag und solange pflege_bis leer
 * ist oder in der Zukunft liegt.
 */
export function pflegeAktiv(
  monatlich: number,
  pflegeBis: string | null,
  heute: string,
): boolean {
  return monatlich > 0 && (pflegeBis === null || pflegeBis > heute);
}

/**
 * Letzter Tag der Pflege: echtes Datum, nicht vor dem Beginn und höchstens
 * ein Jahr voraus.
 */
export function parsePflegeBis(
  v: unknown,
  seit: string | null,
  now: Date,
): string | null {
  const iso = parseProjektDatum(v);
  if (!iso) return null;
  if (seit && iso < seit) return null;
  return iso <= addDays(berlinDateIso(now), 366) ? iso : null;
}

/**
 * Beginn der Pflege: echtes Datum, höchstens ein Jahr voraus und nicht
 * nach einem schon gesetzten Ende.
 */
export function parsePflegeSeit(
  v: unknown,
  bis: string | null,
  now: Date,
): string | null {
  const iso = parseProjektDatum(v);
  if (!iso) return null;
  if (bis && iso > bis) return null;
  return iso <= addDays(berlinDateIso(now), 366) ? iso : null;
}

// ---------------------------------------------------------------------
// Sicht für die Seiten
// ---------------------------------------------------------------------

export type ProjektSicht = {
  angebot: ProjektAngebot;
  /** null, solange noch nichts abgehakt ist. */
  projekt: ProjektRow | null;
  schritte: Schritte;
  fortschritt: Fortschritt;
  summen: AngebotSummen;
  /** Tag der Annahme (Hamburg) oder null. */
  angenommenAm: string | null;
  /** Firma, sonst Name. */
  kunde: string;
  /** Name, wenn eine Firma dasteht (sonst null). */
  ansprechpartner: string | null;
  pflege: {
    monatlich: number;
    seit: string | null;
    bis: string | null;
    aktiv: boolean;
  };
};

export function projektSicht(
  angebot: ProjektAngebot,
  projekt: ProjektRow | null,
  now: Date,
): ProjektSicht {
  const heute = berlinDateIso(now);
  const schritte = projekt?.schritte ?? {};
  const summen = berechneSummen(angebot.positionen, angebot.ust_satz);
  const angenommenAm = angebot.accepted_at
    ? berlinDateIso(new Date(angebot.accepted_at))
    : null;
  const firma = angebot.kunde_firma?.trim() || null;
  const name = angebot.kunde_name.trim();
  const bis = projekt?.pflege_bis ?? null;
  return {
    angebot,
    projekt,
    schritte,
    fortschritt: fortschritt(schritte),
    summen,
    angenommenAm,
    kunde: firma ?? (name || "Ohne Namen"),
    ansprechpartner: firma && name ? name : null,
    pflege: {
      monatlich: summen.monatlich.brutto,
      seit: pflegeSeit(projekt, angenommenAm),
      bis,
      aktiv: pflegeAktiv(summen.monatlich.brutto, bis, heute),
    },
  };
}

/** Projekte zu den angenommenen Angeboten (je Angebot höchstens eins). */
export function projektSichten(
  angebote: readonly ProjektAngebot[],
  projekte: readonly ProjektRow[],
  now: Date,
): ProjektSicht[] {
  const nachAngebot = new Map(projekte.map((p) => [p.angebot_id, p]));
  return angebote
    .filter((a) => a.status === "angenommen")
    .map((a) => projektSicht(a, nachAngebot.get(a.id) ?? null, now));
}

const schrittIndex = (s: ProjektSchritt | null) =>
  s === null ? PROJEKT_SCHRITTE.length : PROJEKT_SCHRITTE.indexOf(s);

/**
 * In Arbeit: nach dem nächsten Schritt (Anzahlung zuerst), bei gleichem
 * Schritt das länger angenommene zuerst. Fertig: zuletzt live
 * gegangene zuerst.
 */
export function sortiereProjekte(list: readonly ProjektSicht[]): {
  inArbeit: ProjektSicht[];
  fertig: ProjektSicht[];
} {
  const inArbeit = list
    .filter((p) => !p.fortschritt.fertig)
    .sort(
      (a, b) =>
        schrittIndex(a.fortschritt.naechster) -
          schrittIndex(b.fortschritt.naechster) ||
        (a.angebot.accepted_at ?? "").localeCompare(
          b.angebot.accepted_at ?? "",
        ),
    );
  const fertig = list
    .filter((p) => p.fortschritt.fertig)
    .sort((a, b) =>
      (b.schritte.livegang ?? "").localeCompare(a.schritte.livegang ?? ""),
    );
  return { inArbeit, fertig };
}

/**
 * Pflege-Kunden: laufende (nach Beginn sortiert) und beendete, dazu die
 * Summe aller laufenden je Monat.
 */
export function pflegeUebersicht(list: readonly ProjektSicht[]): {
  aktiv: ProjektSicht[];
  beendet: ProjektSicht[];
  summeMonatlich: number;
} {
  const mitBeitrag = list.filter((p) => p.pflege.monatlich > 0);
  const aktiv = mitBeitrag
    .filter((p) => p.pflege.aktiv)
    .sort((a, b) => (a.pflege.seit ?? "").localeCompare(b.pflege.seit ?? ""));
  const beendet = mitBeitrag
    .filter((p) => !p.pflege.aktiv)
    .sort((a, b) => (b.pflege.bis ?? "").localeCompare(a.pflege.bis ?? ""));
  return {
    aktiv,
    beendet,
    summeMonatlich: aktiv.reduce((sum, p) => sum + p.pflege.monatlich, 0),
  };
}
