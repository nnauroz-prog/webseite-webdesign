/**
 * Angebote: Typen, Standard-Angebot aus einer Anfrage, Paketwechsel,
 * Summen und Beträge, Eingabeprüfung, Token, Statusübergänge und die
 * Texte rund ums Senden.
 *
 * Rein (ohne Server- oder Next-Importe): im Editor (Client), in Server
 * Actions, auf der öffentlichen Seite /angebot/[token] und unter
 * node --test nutzbar. Gespeichert wird über lib/angebote-store.ts
 * (server-only).
 *
 * Beträge sind immer ganze Cent, netto. Texte für Kunden in Sie-Form,
 * Fehlermeldungen für den Inhaber (Admin) in du-Form.
 */

import type { LeadRow } from "@/lib/leads-meta";
import type { Paket } from "@/lib/pakete-data";

import {
  addDays,
  berlinDateIso,
  berlinParts,
  MONTHS_LONG,
} from "@/lib/admin/berlin-time";
import { mailtoHref, safeEmail } from "@/lib/admin/links";
import { fieldValue } from "@/lib/leads-meta";
import { PAKETE } from "@/lib/pakete-data";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, SITE_URL } from "@/lib/site";
import { PACKAGE_LABELS } from "@/lib/validations/inquiries";

// ---------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------

export const ANGEBOT_STATUSES = [
  "entwurf",
  "gesendet",
  "angenommen",
  "abgelehnt",
  "zurueckgezogen",
] as const;
export type AngebotStatus = (typeof ANGEBOT_STATUSES)[number];

export const ANGEBOT_STATUS_LABELS: Record<AngebotStatus, string> = {
  entwurf: "Entwurf",
  gesendet: "Gesendet",
  angenommen: "Angenommen",
  abgelehnt: "Abgelehnt",
  zurueckgezogen: "Zurückgezogen",
};

export const POSITION_ARTEN = ["einmalig", "monatlich"] as const;
export type PositionArt = (typeof POSITION_ARTEN)[number];

export const POSITION_ART_LABELS: Record<PositionArt, string> = {
  einmalig: "einmalig",
  monatlich: "monatlich",
};

/** Eine Zeile im Angebot. preis_cent ist der Einzelpreis netto. */
export type AngebotPosition = {
  id: string;
  titel: string;
  beschreibung: string;
  /** Ganzzahl 1–999. */
  menge: number;
  /** Ganzzahl in Cent, 0 bis 100.000.000 (1.000.000 €), netto. */
  preis_cent: number;
  art: PositionArt;
};

/** 19 % oder 0 (Kleinunternehmer nach § 19 UStG). */
export type UstSatz = 0 | 19;
export const UST_SAETZE: readonly UstSatz[] = [19, 0];
export const UST_LABELS: Record<UstSatz, string> = {
  19: "19 % USt",
  0: "keine USt (§ 19 UStG)",
};

/** Eine Zeile der Tabelle public.angebote. */
export type Angebot = {
  id: string;
  lead_id: string;
  /** „A-2026-0001“, vergibt die Datenbank. */
  nummer: string;
  /** Öffentlicher Link /angebot/<token>. Nie loggen. */
  token: string;
  status: AngebotStatus;
  created_at: string;
  /** Letzte inhaltliche Änderung (nicht Senden/Öffnen/Annehmen). */
  updated_at: string;
  sent_at: string | null;
  first_viewed_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  /** yyyy-mm-dd, einschließlich (Hamburger Kalendertag). */
  gueltig_bis: string;
  kunde_name: string;
  kunde_firma: string | null;
  kunde_email: string | null;
  titel: string;
  einleitung: string;
  hinweise: string;
  positionen: AngebotPosition[];
  ust_satz: UstSatz;
  angenommen_von: string | null;
  abgelehnt_grund: string | null;
};

/** Alle Spalten (select und Schema-Prüfung). */
export const ANGEBOT_COLUMNS = [
  "id",
  "lead_id",
  "nummer",
  "token",
  "status",
  "created_at",
  "updated_at",
  "sent_at",
  "first_viewed_at",
  "accepted_at",
  "declined_at",
  "gueltig_bis",
  "kunde_name",
  "kunde_firma",
  "kunde_email",
  "titel",
  "einleitung",
  "hinweise",
  "positionen",
  "ust_satz",
  "angenommen_von",
  "abgelehnt_grund",
] as const satisfies readonly (keyof Angebot)[];

/** Was der Inhaber im Editor ändert. */
export const ANGEBOT_INHALT_FELDER = [
  "kunde_name",
  "kunde_firma",
  "kunde_email",
  "titel",
  "einleitung",
  "hinweise",
  "positionen",
  "ust_satz",
  "gueltig_bis",
] as const satisfies readonly (keyof Angebot)[];
export type AngebotInhalt = Pick<
  Angebot,
  (typeof ANGEBOT_INHALT_FELDER)[number]
>;

/**
 * Nur die Inhaltsfelder (z. B. aus einem vollen Angebot). Der Speicher
 * schreibt nie mehr als diese, damit Status, Token oder Nummer nicht
 * versehentlich mitgeschickt werden.
 */
export function nurInhalt(a: AngebotInhalt): AngebotInhalt {
  return {
    kunde_name: a.kunde_name,
    kunde_firma: a.kunde_firma,
    kunde_email: a.kunde_email,
    titel: a.titel,
    einleitung: a.einleitung,
    hinweise: a.hinweise,
    positionen: a.positionen,
    ust_satz: a.ust_satz,
    gueltig_bis: a.gueltig_bis,
  };
}

/**
 * Was die öffentliche Seite bekommt: nur Angebotsfelder, ohne
 * Anfrage-ID, Token, E-Mail-Adresse, Ablehnungsgrund und
 * Öffnungszeitpunkt.
 */
export const ANGEBOT_PUBLIC_COLUMNS = [
  "nummer",
  "status",
  "created_at",
  "updated_at",
  "sent_at",
  "accepted_at",
  "declined_at",
  "gueltig_bis",
  "kunde_name",
  "kunde_firma",
  "titel",
  "einleitung",
  "hinweise",
  "positionen",
  "ust_satz",
  "angenommen_von",
] as const satisfies readonly (keyof Angebot)[];
export type AngebotOeffentlich = Pick<
  Angebot,
  (typeof ANGEBOT_PUBLIC_COLUMNS)[number]
>;

/** Kurzform für Listen (Übersicht, Detailseite der Anfrage). */
export const ANGEBOT_KURZ_COLUMNS = [
  "id",
  "lead_id",
  "nummer",
  "status",
  "created_at",
  "sent_at",
  "first_viewed_at",
  "accepted_at",
  "declined_at",
  "gueltig_bis",
] as const satisfies readonly (keyof Angebot)[];
export type AngebotKurz = Pick<Angebot, (typeof ANGEBOT_KURZ_COLUMNS)[number]>;

export const ANGEBOT_GRENZEN = {
  kundeName: 120,
  kundeFirma: 160,
  titel: 160,
  einleitung: 2000,
  hinweise: 4000,
  positionTitel: 160,
  positionBeschreibung: 600,
  mengeMax: 999,
  /** 1.000.000 € */
  preisMaxCent: 100_000_000,
  positionenMax: 30,
  annahmeName: 120,
  ablehnGrund: 500,
} as const;

/** Standard-Gültigkeit neuer Angebote in Tagen. */
export const GUELTIG_TAGE = 30;

/** Kontakt für Kundentexte (kein Name des Inhabers). */
export const ANGEBOT_KONTAKT = {
  telefon: "0160 7621876",
  telHref: "tel:+491607621876",
  email: CONTACT_EMAIL,
} as const;

// ---------------------------------------------------------------------
// Zeilen aus der Datenbank
// ---------------------------------------------------------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function oneOf<T extends string>(list: readonly T[], v: unknown): T | null {
  return typeof v === "string" && (list as readonly string[]).includes(v)
    ? (v as T)
    : null;
}

const strOrNull = (v: unknown): string | null =>
  typeof v === "string" ? v : null;

/**
 * Positionen aus jsonb, nachsichtig: Kaputte Einträge fallen weg,
 * statt die Seite zu sprengen (geschrieben wird nur Geprüftes).
 */
export function positionenAusDb(v: unknown): AngebotPosition[] {
  if (!Array.isArray(v)) return [];
  const out: AngebotPosition[] = [];
  for (const p of v) {
    if (!isRecord(p)) continue;
    const art = oneOf(POSITION_ARTEN, p.art);
    const menge = Number(p.menge);
    const preis = Number(p.preis_cent);
    if (
      !art ||
      typeof p.id !== "string" ||
      typeof p.titel !== "string" ||
      !Number.isInteger(menge) ||
      !Number.isInteger(preis)
    )
      continue;
    out.push({
      id: p.id,
      titel: p.titel,
      beschreibung: typeof p.beschreibung === "string" ? p.beschreibung : "",
      menge,
      preis_cent: preis,
      art,
    });
  }
  return out;
}

/** Datenbank-Zeile → Angebot (Positionen und Steuersatz geprüft). */
export function angebotAusZeile(data: unknown): Angebot {
  const row = isRecord(data) ? data : {};
  return {
    id: String(row.id),
    lead_id: String(row.lead_id),
    nummer: String(row.nummer ?? ""),
    token: String(row.token ?? ""),
    status: oneOf(ANGEBOT_STATUSES, row.status) ?? "entwurf",
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
    sent_at: strOrNull(row.sent_at),
    first_viewed_at: strOrNull(row.first_viewed_at),
    accepted_at: strOrNull(row.accepted_at),
    declined_at: strOrNull(row.declined_at),
    gueltig_bis: String(row.gueltig_bis ?? ""),
    kunde_name: String(row.kunde_name ?? ""),
    kunde_firma: strOrNull(row.kunde_firma),
    kunde_email: strOrNull(row.kunde_email),
    titel: String(row.titel ?? ""),
    einleitung: String(row.einleitung ?? ""),
    hinweise: String(row.hinweise ?? ""),
    positionen: positionenAusDb(row.positionen),
    ust_satz: Number(row.ust_satz) === 0 ? 0 : 19,
    angenommen_von: strOrNull(row.angenommen_von),
    abgelehnt_grund: strOrNull(row.abgelehnt_grund),
  };
}

/** Nur die öffentlichen Felder (für die Kundenseite). */
export function oeffentlicheSicht(
  a: Pick<Angebot, (typeof ANGEBOT_PUBLIC_COLUMNS)[number]>,
): AngebotOeffentlich {
  const out: Record<string, unknown> = {};
  for (const c of ANGEBOT_PUBLIC_COLUMNS) out[c] = a[c];
  return out as AngebotOeffentlich;
}

// ---------------------------------------------------------------------
// Beträge
// ---------------------------------------------------------------------

function groupThousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** „1.299,50 €“ mit geschütztem Leerzeichen vor €. */
export function formatEuro(cent: number): string {
  const neg = cent < 0;
  const abs = Math.abs(Math.round(cent));
  const euros = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  return `${neg ? "-" : ""}${groupThousands(euros)},${rest} €`;
}

/** Wert fürs Eingabefeld: „1.299,50“ bzw. „899“ (ohne €). */
export function centZuEingabe(cent: number): string {
  const abs = Math.abs(Math.round(cent));
  const euros = groupThousands(Math.floor(abs / 100));
  const rest = abs % 100;
  return rest ? `${euros},${String(rest).padStart(2, "0")}` : euros;
}

function thousandsOk(s: string, sep: string): boolean {
  const groups = s.split(sep);
  return (
    /^\d{1,3}$/.test(groups[0]) &&
    // „0.499“ ist kein Tausenderbetrag, sondern ein Tippfehler.
    groups[0] !== "0" &&
    groups.slice(1).every((g) => /^\d{3}$/.test(g))
  );
}

/**
 * Euro-Eingabe → Cent. Akzeptiert „1.299,50“, „1299,5“, „1299.5“,
 * „1.299“, „1,299.50“, „899 €“; sonst null. Ein einzelnes Trennzeichen
 * mit 1–2 Ziffern danach ist das Dezimalzeichen. Nur der Punkt darf
 * allein als Tausendertrenner stehen („1.299“); ein Komma ist im
 * Deutschen das Dezimalzeichen, „1,299“ ist also ein Tippfehler (null)
 * und wird nicht stillschweigend zu 1.299 €. Prüft keine Grenzen
 * (siehe parsePreisCent).
 */
export function parseEuroEingabe(input: unknown): number | null {
  if (typeof input !== "string") return null;
  const s = input.replace(/[\s  ]/g, "").replace(/€|eur/gi, "");
  if (!s || !/^[0-9.,]+$/.test(s) || !/\d/.test(s)) return null;
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  let intPart: string;
  let frac = "";
  if (lastDot >= 0 && lastComma >= 0) {
    const dec = Math.max(lastDot, lastComma);
    const decChar = s[dec];
    const sep = decChar === "." ? "," : ".";
    intPart = s.slice(0, dec);
    frac = s.slice(dec + 1);
    if (intPart.includes(decChar) || !thousandsOk(intPart, sep)) return null;
    intPart = intPart.split(sep).join("");
  } else if (lastDot >= 0 || lastComma >= 0) {
    const sep = lastDot >= 0 ? "." : ",";
    const parts = s.split(sep);
    if (parts.length === 2 && parts[1].length <= 2) {
      [intPart, frac] = parts;
    } else if (sep === "." && thousandsOk(s, sep)) {
      intPart = parts.join("");
    } else {
      return null;
    }
  } else {
    intPart = s;
  }
  if (intPart === "") intPart = "0";
  if (!/^\d{1,10}$/.test(intPart) || !/^\d{0,2}$/.test(frac)) return null;
  return Number(intPart) * 100 + Number(frac.padEnd(2, "0"));
}

export type Summe = { netto: number; ust: number; brutto: number };
export type AngebotSummen = {
  einmalig: Summe;
  monatlich: Summe;
  ust_satz: UstSatz;
};

export function positionNetto(
  p: Pick<AngebotPosition, "menge" | "preis_cent">,
): number {
  return p.menge * p.preis_cent;
}

/** USt auf eine Summe, kaufmännisch auf Cent gerundet. */
export function ustBetrag(netto: number, satz: UstSatz): number {
  return Math.round((netto * satz) / 100);
}

/** Summen getrennt nach einmalig und monatlich, USt je Summe. */
export function berechneSummen(
  positionen: readonly Pick<AngebotPosition, "menge" | "preis_cent" | "art">[],
  ust_satz: UstSatz,
): AngebotSummen {
  const netto = { einmalig: 0, monatlich: 0 };
  for (const p of positionen) netto[p.art] += positionNetto(p);
  const summe = (n: number): Summe => {
    const ust = ustBetrag(n, ust_satz);
    return { netto: n, ust, brutto: n + ust };
  };
  return {
    einmalig: summe(netto.einmalig),
    monatlich: summe(netto.monatlich),
    ust_satz,
  };
}

// ---------------------------------------------------------------------
// Pakete
// ---------------------------------------------------------------------

export type PaketSlug = Paket["slug"];
export const STANDARD_PAKET: PaketSlug = "business";

function paketBySlug(slug: PaketSlug): Paket {
  return PAKETE.find((p) => p.slug === slug) ?? PAKETE[0];
}

function isPaketSlug(v: string): v is PaketSlug {
  return PAKETE.some((p) => p.slug === v);
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Paket aus einem Formular-Label: „Business-Auftritt“
 * (PACKAGE_LABELS), „Premium“, „Sitalo Studio“, „starter“ …
 * „Empfehlung gewünscht“ und Unbekanntes ergeben null.
 */
export function paketSlugAus(label: string | undefined): PaketSlug | null {
  if (!label) return null;
  const v = norm(label);
  for (const [slug, text] of Object.entries(PACKAGE_LABELS)) {
    if (norm(text) === v) return isPaketSlug(slug) ? slug : null;
  }
  for (const p of PAKETE) {
    if (norm(p.name) === v || p.slug === v) return p.slug;
  }
  for (const p of PAKETE) {
    if (new RegExp(`(^|[^a-z])${p.slug}([^a-z]|$)`).test(v)) return p.slug;
  }
  return null;
}

/** Paket aus „Paket“ oder „Paket-Wunsch“ der Anfrage, sonst Business. */
export function paketAusAnfrage(lead: Pick<LeadRow, "fields">): PaketSlug {
  return (
    paketSlugAus(fieldValue(lead, "Paket")) ??
    paketSlugAus(fieldValue(lead, "Paket-Wunsch")) ??
    STANDARD_PAKET
  );
}

/** „ab 2.499 €“ → 249900 (nur die Ziffern zählen). */
export function centAusPreistext(text: string): number {
  const digits = text.replace(/\D/g, "");
  return digits ? Number(digits) * 100 : 0;
}

/** Laufende Leistungen gehören in den Monatsbeitrag, nicht in den Einmalpreis. */
const LAUFEND_RE = /hosting|kleine änderung|bevorzugt/i;

const PAKET_POS_RE = new RegExp(
  `^paket-(${PAKETE.map((p) => p.slug).join("|")})-(einmalig|monatlich)$`,
);

/** Die beiden Paket-Positionen (IDs „paket-<slug>-einmalig|monatlich“). */
export function paketPositionen(
  slug: PaketSlug,
): [AngebotPosition, AngebotPosition] {
  const p = paketBySlug(slug);
  const umfang = p.contents.filter((c) => !LAUFEND_RE.test(c)).slice(0, 6);
  const laufend = [
    "Hosting in der EU mit SSL und Backups",
    "Updates und technische Pflege",
    ...p.contents.filter((c) => /kleine änderung|bevorzugt/i.test(c)),
  ];
  return [
    {
      id: `paket-${p.slug}-einmalig`,
      titel: `Website-Paket ${p.name}`,
      beschreibung: umfang.join(" · "),
      menge: 1,
      preis_cent: centAusPreistext(p.setup),
      art: "einmalig",
    },
    {
      id: `paket-${p.slug}-monatlich`,
      titel: `Monatsbeitrag ${p.name}: Hosting, Updates, kleine Änderungen`,
      beschreibung: laufend.join(" · "),
      menge: 1,
      preis_cent: centAusPreistext(p.monthly),
      art: "monatlich",
    },
  ];
}

export function istPaketPosition(p: Pick<AngebotPosition, "id">): boolean {
  return PAKET_POS_RE.test(p.id);
}

/** Gewähltes Paket laut Positionen (für das Raster im Editor), sonst null. */
export function paketAusPositionen(
  positionen: readonly Pick<AngebotPosition, "id">[],
): PaketSlug | null {
  for (const p of positionen) {
    const m = PAKET_POS_RE.exec(p.id);
    if (m && isPaketSlug(m[1])) return m[1];
  }
  return null;
}

/**
 * Paketwechsel: ersetzt nur die Paket-Positionen an ihrer Stelle,
 * eigene Positionen bleiben. Hat der Inhaber eine der beiden entfernt
 * (z. B. den Monatsbeitrag), bleibt sie weg. Gibt es keine, kommen
 * beide nach vorn.
 */
export function paketWechseln(
  positionen: readonly AngebotPosition[],
  slug: PaketSlug,
): AngebotPosition[] {
  const [einmalig, monatlich] = paketPositionen(slug);
  if (!positionen.some(istPaketPosition)) {
    return [einmalig, monatlich, ...positionen];
  }
  return positionen.map((p) => {
    const m = PAKET_POS_RE.exec(p.id);
    if (!m) return p;
    return m[2] === "monatlich" ? monatlich : einmalig;
  });
}

/** Wert aus ANGEBOT_UST_SATZ: nur '0' ergibt 0, sonst 19. */
export function ustSatzAusUmgebung(v: string | undefined): UstSatz {
  return v?.trim() === "0" ? 0 : 19;
}

// ---------------------------------------------------------------------
// Datum
// ---------------------------------------------------------------------

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Echtes Kalenderdatum yyyy-mm-dd zwischen 2020 und 2100, sonst null. */
export function parseDatum(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const m = ISO_DATE_RE.exec(v.trim());
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
  return m[0];
}

/** „1. Dezember 2026“ */
export function formatDatumLang(iso: string): string {
  const m = ISO_DATE_RE.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])}. ${MONTHS_LONG[Number(m[2]) - 1]} ${m[1]}`;
}

/** „01.12.2026“ */
export function formatDatum(iso: string): string {
  const m = ISO_DATE_RE.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Zeitpunkt für den Admin, Hamburger Zeit: „1.11., 14:02“, aus einem
 * anderen Jahr „1.11.2025, 14:02“.
 */
export function formatZeitpunkt(iso: string, now: Date): string {
  const p = berlinParts(new Date(iso));
  const year = p.year === berlinParts(now).year ? "" : String(p.year);
  return `${p.day}.${p.month}.${year}, ${pad(p.hour)}:${pad(p.minute)}`;
}

/** Zeitpunkt für Kunden: „1. November 2026 um 14:02 Uhr“. */
export function formatZeitpunktLang(iso: string): string {
  const d = new Date(iso);
  const p = berlinParts(d);
  return `${formatDatumLang(berlinDateIso(d))} um ${pad(p.hour)}:${pad(p.minute)} Uhr`;
}

/** Datum des Angebots: Tag des (letzten) Sendens, sonst der Erstellung. */
export function angebotsDatum(
  a: Pick<Angebot, "sent_at" | "created_at">,
): string {
  return berlinDateIso(new Date(a.sent_at ?? a.created_at));
}

/** gueltig_bis gilt einschließlich; danach ist das Angebot abgelaufen. */
export function istAbgelaufen(gueltig_bis: string, now: Date): boolean {
  return gueltig_bis < berlinDateIso(now);
}

// ---------------------------------------------------------------------
// Standard-Angebot aus einer Anfrage
// ---------------------------------------------------------------------

function einzeilig(v: string): string {
  return v
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mehrzeilig(v: string): string {
  return v
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

/** „Angebot: Website für Pflegedienst Elbblick“ */
export function standardTitel(name: string, firma: string | null): string {
  const wer = firma || name;
  const titel = wer
    ? `Angebot: Website für ${wer}`
    : "Angebot: Ihre neue Website";
  return titel.slice(0, ANGEBOT_GRENZEN.titel);
}

/** Anrede ohne geratenes Geschlecht, dann ein kurzer Absatz. */
export function standardEinleitung(name: string, firma: string | null): string {
  const anrede = name ? `Guten Tag ${name},` : "Guten Tag,";
  const fuer = firma
    ? `für die neue Website von ${firma}`
    : "für Ihre neue Website";
  return `${anrede}\n\nvielen Dank für Ihre Anfrage. Gern machen wir Ihnen ${fuer} das folgende Angebot. Wenn Sie Fragen haben oder etwas anders brauchen, rufen Sie uns an oder schreiben Sie uns.`;
}

/** Wovon die Standard-Hinweise abhängen. */
export type HinweisKontext = {
  paket: PaketSlug | null;
  /** Gibt es mindestens eine monatliche Position? */
  monatlich: boolean;
  ust_satz: UstSatz;
  gueltig_bis: string;
};

export function hinweisKontext(
  inhalt: Pick<AngebotInhalt, "positionen" | "ust_satz" | "gueltig_bis">,
): HinweisKontext {
  return {
    paket: paketAusPositionen(inhalt.positionen),
    monatlich: inhalt.positionen.some((p) => p.art === "monatlich"),
    ust_satz: inhalt.ust_satz,
    gueltig_bis: inhalt.gueltig_bis,
  };
}

const HINWEIS_FESTPREIS =
  "Alle Preise sind Festpreise für den beschriebenen Umfang. Erweiterungen besprechen wir vorher mit Ihnen und nennen Ihnen den Preis, bevor wir damit anfangen.";

/** Satz zur Umsatzsteuer (auch für die Summen der Kundenseite). */
export function ustHinweis(satz: UstSatz): string {
  return satz === 0
    ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
    : "Alle Beträge verstehen sich netto zuzüglich 19 % Umsatzsteuer.";
}

/** Die Absätze der Standard-Hinweise in fester Reihenfolge ("" = entfällt). */
function hinweisBausteine(k: HinweisKontext): string[] {
  const dauer = k.paket ? paketBySlug(k.paket).dauer : null;
  const ablauf =
    "Ablauf: Sie schicken uns Stichpunkte und Fotos, wir bauen daraus die Seite. Bevor sie online geht, bekommen Sie einen Test-Link und sehen sich alles in Ruhe an." +
    (dauer
      ? ` Bis die Seite online ist, vergehen ${dauer} ab vollständigen Unterlagen.`
      : " Den Zeitplan stimmen wir mit Ihnen ab.");
  return [
    HINWEIS_FESTPREIS,
    ablauf,
    k.monatlich
      ? "Der Monatsbeitrag beginnt mit dem Livegang. Mindestlaufzeit 6 Monate, danach monatlich kündbar."
      : "",
    ustHinweis(k.ust_satz),
    `Dieses Angebot gilt bis zum ${formatDatumLang(k.gueltig_bis)}.`,
  ];
}

/** Standard-Hinweise als Absätze (durch Leerzeile getrennt). */
export function standardHinweise(k: HinweisKontext): string {
  return hinweisBausteine(k).filter(Boolean).join("\n\n");
}

/**
 * Hält die Standard-Sätze in den Hinweisen passend, wenn sich Paket,
 * Monatsbeitrag, Steuersatz oder „Gültig bis“ ändern. Ersetzt nur
 * Sätze, die noch wortgleich im Text stehen; Eigenes bleibt. Fällt ein
 * Baustein weg (keine monatliche Position mehr), verschwindet sein
 * Absatz; kommt einer dazu, wird er an seiner Stelle eingefügt,
 * solange der Text noch erkennbar der Standardtext ist.
 *
 * Im Editor bei jeder Änderung aufrufen; in der Server Action
 * ebenfalls (mit dem gespeicherten Stand als alt), dann ist es egal,
 * ob der Client es schon getan hat.
 */
export function syncHinweise(
  text: string,
  alt: HinweisKontext,
  neu: HinweisKontext,
): string {
  const a = hinweisBausteine(alt);
  const n = hinweisBausteine(neu);
  let out = text;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === n[i]) continue;
    if (a[i] && out.includes(a[i])) {
      if (n[i]) {
        out = out.replace(a[i], () => n[i]);
      } else {
        out = out
          .replace(`\n\n${a[i]}`, "")
          .replace(`${a[i]}\n\n`, "")
          .replace(a[i], "");
      }
    } else if (!a[i] && n[i]) {
      const next = n.slice(i + 1).find((s) => s && out.includes(s));
      if (next) out = out.replace(next, () => `${n[i]}\n\n${next}`);
      else if (n.slice(0, i).some((s) => s && out.includes(s)))
        out = `${out}\n\n${n[i]}`;
    }
  }
  return out;
}

export type EntwurfOptionen = {
  now: Date;
  /** Standard 19; auf dem Server ustSatzAusUmgebung(process.env.ANGEBOT_UST_SATZ). */
  ustSatz?: UstSatz;
  /** Sonst aus der Anfrage (paketAusAnfrage). */
  paket?: PaketSlug;
};

/**
 * Standard-Angebot aus einer Anfrage: Kunde aus den Formularfeldern
 * (Name, Firma, E-Mail bzw. reply_to, nur sichere Adressen), zwei
 * Paket-Positionen, Titel, Einleitung, Hinweise, gültig 30 Tage.
 */
export function angebotAusAnfrage(
  lead: Pick<LeadRow, "fields" | "reply_to">,
  opts: EntwurfOptionen,
): AngebotInhalt {
  const name = einzeilig(fieldValue(lead, "Name") ?? "").slice(
    0,
    ANGEBOT_GRENZEN.kundeName,
  );
  const firma =
    einzeilig(fieldValue(lead, "Firma") ?? "").slice(
      0,
      ANGEBOT_GRENZEN.kundeFirma,
    ) || null;
  const rawEmail = (fieldValue(lead, "E-Mail") ?? lead.reply_to ?? "").trim();
  const kunde_email = rawEmail ? safeEmail(rawEmail) : null;
  const ust_satz = opts.ustSatz ?? 19;
  const gueltig_bis = addDays(berlinDateIso(opts.now), GUELTIG_TAGE);
  const positionen = paketPositionen(opts.paket ?? paketAusAnfrage(lead));
  return {
    kunde_name: name,
    kunde_firma: firma,
    kunde_email,
    titel: standardTitel(name, firma),
    einleitung: standardEinleitung(name, firma),
    hinweise: standardHinweise(
      hinweisKontext({ positionen, ust_satz, gueltig_bis }),
    ),
    positionen,
    ust_satz,
    gueltig_bis,
  };
}

// ---------------------------------------------------------------------
// Token und IDs
// ---------------------------------------------------------------------

const B64URL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/** base64url ohne Auffüllzeichen (wie Buffer#toString('base64url')). */
export function base64Url(bytes: Uint8Array): string {
  let out = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out +=
      B64URL[(n >> 18) & 63] +
      B64URL[(n >> 12) & 63] +
      B64URL[(n >> 6) & 63] +
      B64URL[n & 63];
  }
  const rest = bytes.length - i;
  if (rest === 1) {
    const n = bytes[i] << 16;
    out += B64URL[(n >> 18) & 63] + B64URL[(n >> 12) & 63];
  } else if (rest === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    out +=
      B64URL[(n >> 18) & 63] + B64URL[(n >> 12) & 63] + B64URL[(n >> 6) & 63];
  }
  return out;
}

function randomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

/** Öffentlicher Link-Schlüssel: 32 Zufallsbytes, 43 Zeichen base64url. */
export function erzeugeToken(): string {
  return base64Url(randomBytes(32));
}

const TOKEN_RE = /^[A-Za-z0-9_-]{32,128}$/;

/** Token aus der Adresse prüfen (vor jeder Abfrage), sonst null. */
export function parseToken(v: unknown): string | null {
  return typeof v === "string" && TOKEN_RE.test(v) ? v : null;
}

/** ID für eine neue eigene Position („p-…“, 14 Zeichen). */
export function neuePositionId(): string {
  return `p-${base64Url(randomBytes(9))}`;
}

/** Leere eigene Position für „Position hinzufügen“. */
export function leerePosition(art: PositionArt = "einmalig"): AngebotPosition {
  return {
    id: neuePositionId(),
    titel: "",
    beschreibung: "",
    menge: 1,
    preis_cent: 0,
    art,
  };
}

// ---------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------

const UEBERGAENGE: Record<AngebotStatus, readonly AngebotStatus[]> = {
  entwurf: ["gesendet"],
  // gesendet → gesendet: erneut senden (z. B. nach einer Änderung).
  gesendet: ["gesendet", "angenommen", "abgelehnt", "zurueckgezogen"],
  angenommen: [],
  abgelehnt: [],
  zurueckgezogen: [],
};

/** Ist der Statuswechsel von → nach erlaubt? */
export function darfWechseln(von: AngebotStatus, nach: AngebotStatus): boolean {
  return UEBERGAENGE[von].includes(nach);
}

/**
 * Bearbeiten ist im Entwurf und nach dem Senden erlaubt (der Kunde
 * sieht immer den aktuellen Stand); nach Annahme, Ablehnung oder
 * Zurückziehen ist das Angebot gesperrt.
 */
export const BEARBEITBAR: readonly AngebotStatus[] = ["entwurf", "gesendet"];

export function istBearbeitbar(status: AngebotStatus): boolean {
  return BEARBEITBAR.includes(status);
}

/** Was die Kundenseite zeigt. */
export type KundenAnsicht =
  | "entwurf"
  | "offen"
  | "abgelaufen"
  | "angenommen"
  | "abgelehnt"
  | "zurueckgezogen";

export function kundenAnsicht(
  a: Pick<Angebot, "status" | "gueltig_bis">,
  now: Date,
): KundenAnsicht {
  if (a.status === "gesendet")
    return istAbgelaufen(a.gueltig_bis, now) ? "abgelaufen" : "offen";
  return a.status;
}

/** Kann der Kunde jetzt annehmen? */
export function kannAnnehmen(
  a: Pick<Angebot, "status" | "gueltig_bis">,
  now: Date,
): boolean {
  return kundenAnsicht(a, now) === "offen";
}

/**
 * Was vor dem Senden fehlt (leer = sendebereit). Eine fehlende
 * E-Mail-Adresse ist kein Hindernis: Dann bleiben Teilen und Link
 * kopieren (siehe kundenMailHref).
 */
export function sendeProbleme(
  a: Pick<
    Angebot,
    "status" | "kunde_name" | "titel" | "positionen" | "gueltig_bis"
  >,
  now: Date,
): string[] {
  const out: string[] = [];
  if (!darfWechseln(a.status, "gesendet")) {
    out.push(
      `Ein Angebot im Status „${ANGEBOT_STATUS_LABELS[a.status]}“ lässt sich nicht mehr senden.`,
    );
  }
  if (!a.kunde_name.trim()) out.push("Der Name des Kunden fehlt.");
  if (!a.titel.trim()) out.push("Der Titel fehlt.");
  if (a.positionen.length === 0) out.push("Es gibt noch keine Position.");
  if (istAbgelaufen(a.gueltig_bis, now))
    out.push("„Gültig bis“ liegt in der Vergangenheit.");
  return out;
}

/**
 * Statuszeile für den Admin: „Entwurf“, „Gesendet am 1.11., 14:02“,
 * „Vom Kunden geöffnet am …“, „Angenommen am … von …“, „Abgelehnt am …“,
 * „Zurückgezogen“; bei abgelaufenen gesendeten Angeboten „· abgelaufen“.
 */
export function statusZeile(
  a: Pick<
    Angebot,
    | "status"
    | "sent_at"
    | "first_viewed_at"
    | "accepted_at"
    | "declined_at"
    | "angenommen_von"
    | "gueltig_bis"
  >,
  now: Date,
): string {
  const at = (iso: string | null) =>
    iso ? ` am ${formatZeitpunkt(iso, now)}` : "";
  switch (a.status) {
    case "entwurf":
      return "Entwurf";
    case "gesendet": {
      const text = a.first_viewed_at
        ? `Vom Kunden geöffnet${at(a.first_viewed_at)}`
        : `Gesendet${at(a.sent_at)}`;
      return istAbgelaufen(a.gueltig_bis, now) ? `${text} · abgelaufen` : text;
    }
    case "angenommen":
      return `Angenommen${at(a.accepted_at)}${a.angenommen_von ? ` von ${a.angenommen_von}` : ""}`;
    case "abgelehnt":
      return `Abgelehnt${at(a.declined_at)}`;
    case "zurueckgezogen":
      return "Zurückgezogen";
  }
}

/** Hinweis auf einer Karte der Übersicht. */
export type AngebotHinweis = {
  status: "angenommen" | "gesendet";
  text: "Angebot angenommen" | "Angebot gesendet" | "Angebot geöffnet";
  nummer: string;
};

/**
 * Wichtigster Angebots-Hinweis einer Anfrage: angenommen vor gesendet
 * (geöffnet bzw. noch nicht geöffnet); Entwürfe und erledigte
 * Angebote zeigen nichts.
 */
export function angebotHinweis(
  rows: readonly Pick<AngebotKurz, "status" | "nummer" | "first_viewed_at">[],
): AngebotHinweis | null {
  const angenommen = rows.find((r) => r.status === "angenommen");
  if (angenommen)
    return {
      status: "angenommen",
      text: "Angebot angenommen",
      nummer: angenommen.nummer,
    };
  const gesendet = rows.find((r) => r.status === "gesendet");
  if (gesendet) {
    return {
      status: "gesendet",
      text: gesendet.first_viewed_at ? "Angebot geöffnet" : "Angebot gesendet",
      nummer: gesendet.nummer,
    };
  }
  return null;
}

/** Kurzzeilen nach Anfrage gruppiert (Reihenfolge bleibt erhalten). */
export function angeboteNachAnfrage<T extends Pick<AngebotKurz, "lead_id">>(
  rows: readonly T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const r of rows) {
    const list = map.get(r.lead_id);
    if (list) list.push(r);
    else map.set(r.lead_id, [r]);
  }
  return map;
}

// ---------------------------------------------------------------------
// Eingabeprüfung (Server Actions)
// ---------------------------------------------------------------------

/** Feldpfad → Meldung, z. B. "kunde_email" oder "positionen.2.preis_cent". */
export type FeldFehler = Record<string, string>;

export type InhaltErgebnis =
  | { ok: true; inhalt: AngebotInhalt }
  | { ok: false; fehler: FeldFehler };

const zuLang = (n: number) => `Höchstens ${groupThousands(n)} Zeichen.`;
const UNGUELTIG = "Ungültige Eingabe.";

function textOf(v: unknown): string | null {
  if (v == null) return "";
  return typeof v === "string" ? v : null;
}

/** 0 oder 19 (Zahl oder Text), sonst null. */
export function parseUstSatz(v: unknown): UstSatz | null {
  if (v === 0 || v === "0") return 0;
  if (v === 19 || v === "19") return 19;
  return null;
}

/** Ganzzahl aus Zahl oder Ziffern-Text. */
function intOf(v: unknown): number | null {
  if (typeof v === "number") return Number.isInteger(v) ? v : null;
  if (typeof v === "string" && /^\d{1,12}$/.test(v.trim()))
    return Number(v.trim());
  return null;
}

/** Menge 1–999, sonst null. */
export function parseMenge(v: unknown): number | null {
  const n = intOf(v);
  return n !== null && n >= 1 && n <= ANGEBOT_GRENZEN.mengeMax ? n : null;
}

/** Preis in Cent (Zahl/Ziffern) im Bereich 0 bis 1.000.000 €, sonst null. */
export function parsePreisCent(v: unknown): number | null {
  const n = intOf(v);
  return n !== null && n >= 0 && n <= ANGEBOT_GRENZEN.preisMaxCent ? n : null;
}

const POSITION_ID_RE = /^[A-Za-z0-9_-]{1,40}$/;

function parsePositionen(raw: unknown, fehler: FeldFehler): AngebotPosition[] {
  let list: unknown = raw ?? [];
  if (typeof list === "string") {
    try {
      list = list.length <= 200_000 ? JSON.parse(list) : undefined;
    } catch {
      list = undefined;
    }
  }
  if (!Array.isArray(list)) {
    fehler.positionen = "Positionen ungültig.";
    return [];
  }
  const out: AngebotPosition[] = [];
  const ids = new Set<string>();
  list.forEach((item: unknown, i: number) => {
    const key = `positionen.${i}`;
    if (!isRecord(item)) {
      fehler[key] = UNGUELTIG;
      return;
    }
    const titelRaw = textOf(item.titel);
    const beschreibungRaw = textOf(item.beschreibung);
    const preisRaw = item.preis_cent ?? item.preis;
    const titel = titelRaw === null ? null : einzeilig(titelRaw);
    const beschreibung =
      beschreibungRaw === null ? null : mehrzeilig(beschreibungRaw);
    // Ganz leere Zeile (hinzugefügt, nicht ausgefüllt): still weglassen.
    if (
      titel === "" &&
      beschreibung === "" &&
      (preisRaw == null ||
        preisRaw === "" ||
        preisRaw === 0 ||
        preisRaw === "0")
    )
      return;

    let ok = true;
    if (titel === null) {
      fehler[`${key}.titel`] = UNGUELTIG;
      ok = false;
    } else if (!titel) {
      fehler[`${key}.titel`] = "Titel fehlt.";
      ok = false;
    } else if (titel.length > ANGEBOT_GRENZEN.positionTitel) {
      fehler[`${key}.titel`] = zuLang(ANGEBOT_GRENZEN.positionTitel);
      ok = false;
    }
    if (beschreibung === null) {
      fehler[`${key}.beschreibung`] = UNGUELTIG;
      ok = false;
    } else if (beschreibung.length > ANGEBOT_GRENZEN.positionBeschreibung) {
      fehler[`${key}.beschreibung`] = zuLang(
        ANGEBOT_GRENZEN.positionBeschreibung,
      );
      ok = false;
    }
    const menge = parseMenge(item.menge);
    if (menge === null) {
      fehler[`${key}.menge`] = `Menge: 1 bis ${ANGEBOT_GRENZEN.mengeMax}.`;
      ok = false;
    }
    const preisCent =
      item.preis_cent != null
        ? parsePreisCent(item.preis_cent)
        : parsePreisCent(parseEuroEingabe(item.preis));
    if (preisCent === null) {
      fehler[`${key}.preis_cent`] = "Betrag ungültig (0 bis 1.000.000 €).";
      ok = false;
    }
    const art = oneOf(POSITION_ARTEN, item.art);
    if (!art) {
      fehler[`${key}.art`] = "Bitte „einmalig“ oder „monatlich“ wählen.";
      ok = false;
    }
    if (!ok) return;
    let id = typeof item.id === "string" ? item.id : "";
    if (!POSITION_ID_RE.test(id) || ids.has(id)) id = neuePositionId();
    ids.add(id);
    out.push({
      id,
      titel: titel as string,
      beschreibung: beschreibung as string,
      menge: menge as number,
      preis_cent: preisCent as number,
      art: art as PositionArt,
    });
  });
  if (out.length > ANGEBOT_GRENZEN.positionenMax) {
    fehler.positionen = `Höchstens ${ANGEBOT_GRENZEN.positionenMax} Positionen.`;
  }
  return out;
}

/**
 * Prüft den ganzen Angebotsinhalt aus dem Editor. Erwartet ein Objekt
 * mit den Feldern aus ANGEBOT_INHALT_FELDER; positionen als Array
 * oder JSON-Text, je Position preis_cent (Cent) oder preis (Text wie
 * „1.299,50“). Leere Positionszeilen fallen still weg.
 *
 * Gültig bis wird hier nur als echtes Datum geprüft; „nicht in der
 * Vergangenheit“ gilt erst beim Senden (sendeProbleme).
 */
export function parseAngebotInhalt(raw: unknown): InhaltErgebnis {
  const r = isRecord(raw) ? raw : {};
  const fehler: FeldFehler = {};

  const line = (
    key: string,
    max: number,
    required: string | null,
  ): string | null => {
    const v = textOf(r[key]);
    if (v === null) {
      fehler[key] = UNGUELTIG;
      return null;
    }
    const t = einzeilig(v);
    if (!t && required) fehler[key] = required;
    else if (t.length > max) fehler[key] = zuLang(max);
    return t;
  };
  const block = (key: string, max: number): string | null => {
    const v = textOf(r[key]);
    if (v === null) {
      fehler[key] = UNGUELTIG;
      return null;
    }
    const t = mehrzeilig(v);
    if (t.length > max) fehler[key] = zuLang(max);
    return t;
  };

  const kunde_name = line(
    "kunde_name",
    ANGEBOT_GRENZEN.kundeName,
    "Name fehlt.",
  );
  const kunde_firma = line("kunde_firma", ANGEBOT_GRENZEN.kundeFirma, null);
  const titel = line("titel", ANGEBOT_GRENZEN.titel, "Titel fehlt.");
  const einleitung = block("einleitung", ANGEBOT_GRENZEN.einleitung);
  const hinweise = block("hinweise", ANGEBOT_GRENZEN.hinweise);

  let kunde_email: string | null = null;
  const emailRaw = textOf(r.kunde_email);
  if (emailRaw === null) fehler.kunde_email = UNGUELTIG;
  else if (emailRaw.trim()) {
    kunde_email = safeEmail(emailRaw.trim());
    if (!kunde_email) fehler.kunde_email = "E-Mail-Adresse sieht ungültig aus.";
  }

  const gueltig_bis = parseDatum(r.gueltig_bis);
  if (!gueltig_bis) fehler.gueltig_bis = "Datum ungültig.";

  const ust_satz = parseUstSatz(r.ust_satz);
  if (ust_satz === null)
    fehler.ust_satz = "Bitte 19 % oder „keine USt (§ 19 UStG)“ wählen.";

  const positionen = parsePositionen(r.positionen, fehler);

  if (Object.keys(fehler).length > 0) return { ok: false, fehler };
  return {
    ok: true,
    inhalt: {
      kunde_name: kunde_name as string,
      kunde_firma: kunde_firma || null,
      kunde_email,
      titel: titel as string,
      einleitung: einleitung as string,
      hinweise: hinweise as string,
      positionen,
      ust_satz: ust_satz as UstSatz,
      gueltig_bis: gueltig_bis as string,
    },
  };
}

/**
 * Rohdaten aus einem Editor-Formular: Textfelder unter ihren
 * Spaltennamen, positionen als JSON-Text im Feld „positionen“.
 * Danach parseAngebotInhalt aufrufen.
 */
export function angebotRohAusFormData(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ANGEBOT_INHALT_FELDER) {
    const v = fd.get(key);
    out[key] = typeof v === "string" ? v : undefined;
  }
  return out;
}

/** updated_at aus dem Editor (für „wurde inzwischen geändert“), sonst null. */
export function parseZeitstempel(v: unknown): string | null {
  return typeof v === "string" &&
    v.length <= 40 &&
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}(:?\d{2})?)$/.test(
      v,
    ) &&
    !Number.isNaN(Date.parse(v))
    ? v
    : null;
}

/** Name beim Annehmen: 2–120 Zeichen, eine Zeile; sonst null. */
export function parseAnnahmeName(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = einzeilig(v);
  return t.length >= 2 && t.length <= ANGEBOT_GRENZEN.annahmeName ? t : null;
}

/**
 * Optionaler Grund beim Ablehnen: { grund: null } bei leer,
 * { grund } bei bis zu 500 Zeichen, null bei ungültiger Eingabe.
 */
export function parseAblehnGrund(v: unknown): { grund: string | null } | null {
  if (v == null) return { grund: null };
  if (typeof v !== "string") return null;
  const t = mehrzeilig(v);
  if (t.length > ANGEBOT_GRENZEN.ablehnGrund) return null;
  return { grund: t || null };
}

/** Honeypot-Feld der Kundenseite: nur leer ist in Ordnung. */
export function honeypotLeer(v: unknown): boolean {
  return v == null || v === "";
}

// ---------------------------------------------------------------------
// Links und Texte rund ums Senden
// ---------------------------------------------------------------------

/** https://www.sitalo.de/angebot/<token> (Basis aus SITE_URL). */
export function angebotUrl(token: string, base: string = SITE_URL): string {
  return `${base}/angebot/${token}`;
}

/** /admin/anfragen/<leadId>/angebot/<angebotId> */
export function editorPfad(leadId: string, angebotId: string): string {
  return `/admin/anfragen/${leadId}/angebot/${angebotId}`;
}

/** Volle Admin-Adresse einer Anfrage (für die Benachrichtigung). */
export function adminAnfrageUrl(
  leadId: string,
  base: string = SITE_URL,
): string {
  return `${base}/admin/anfragen/${leadId}`;
}

/** „Pflegedienst Elbblick (Jana Petersen)“ bzw. nur der Name. */
export function kundeAnzeige(
  a: Pick<Angebot, "kunde_name" | "kunde_firma">,
): string {
  const name = a.kunde_name.trim();
  const firma = a.kunde_firma?.trim();
  if (firma && name) return `${firma} (${name})`;
  return firma || name || "Kunde";
}

/**
 * „899,00 € einmalig und 79,00 € im Monat, jeweils zuzüglich 19 %
 * Umsatzsteuer“ (mit geschützten Leerzeichen); "" ohne Positionen.
 */
export function preisSatz(summen: AngebotSummen): string {
  const teile: string[] = [];
  if (summen.einmalig.netto > 0)
    teile.push(`${formatEuro(summen.einmalig.netto)} einmalig`);
  if (summen.monatlich.netto > 0)
    teile.push(`${formatEuro(summen.monatlich.netto)} im Monat`);
  if (teile.length === 0) return "";
  const steuer =
    summen.ust_satz === 0
      ? "ohne Umsatzsteuer (§ 19 UStG)"
      : `${teile.length > 1 ? "jeweils " : ""}zuzüglich 19 % Umsatzsteuer`;
  return `${teile.join(" und ")}, ${steuer}`;
}

const plain = (s: string) => s.replace(/[  ]/g, " ");

const SIGNATUR = `Viele Grüße\nSitalo Webdesign\n${CONTACT_PHONE_DISPLAY} · sitalo.de`;

type MailAngebot = Pick<
  Angebot,
  "nummer" | "token" | "kunde_name" | "positionen" | "ust_satz" | "gueltig_bis"
>;

/**
 * Mail an den Kunden: Betreff „Ihr Angebot <Nummer> von Sitalo
 * Webdesign“, kurzer Text mit Preis, Gültigkeit und Link.
 */
export function kundenMail(
  a: MailAngebot,
  base: string = SITE_URL,
): { subject: string; body: string } {
  const name = a.kunde_name.trim();
  const preis = preisSatz(berechneSummen(a.positionen, a.ust_satz));
  const body = [
    name ? `Guten Tag ${name},` : "Guten Tag,",
    `vielen Dank für Ihre Anfrage. Ihr Angebot ${a.nummer} finden Sie hier:\n${angebotUrl(a.token, base)}`,
    [
      preis ? `Preis: ${preis}.` : "",
      `Das Angebot gilt bis zum ${formatDatumLang(a.gueltig_bis)}. Sie können es direkt auf der Seite annehmen oder als PDF speichern.`,
    ]
      .filter(Boolean)
      .join("\n"),
    "Wenn Sie Fragen haben, rufen Sie uns gern an oder antworten Sie auf diese Mail.",
    SIGNATUR,
  ].join("\n\n");
  return {
    subject: `Ihr Angebot ${a.nummer} von Sitalo Webdesign`,
    body: plain(body),
  };
}

/** mailto:-Link an kunde_email, oder null ohne (sichere) Adresse. */
export function kundenMailHref(
  a: MailAngebot & Pick<Angebot, "kunde_email">,
  base: string = SITE_URL,
): string | null {
  if (!a.kunde_email) return null;
  const { subject, body } = kundenMail(a, base);
  return mailtoHref(a.kunde_email, subject, body);
}

/** Daten für navigator.share (WhatsApp, SMS …). */
export function teilenDaten(
  a: MailAngebot,
  base: string = SITE_URL,
): { title: string; text: string; url: string } {
  const preis = preisSatz(berechneSummen(a.positionen, a.ust_satz));
  return {
    title: `Ihr Angebot ${a.nummer} von Sitalo Webdesign`,
    text: plain(
      `Ihr Angebot ${a.nummer} von Sitalo Webdesign${preis ? `: ${preis}` : ""}. Gültig bis zum ${formatDatumLang(a.gueltig_bis)}.`,
    ),
    url: angebotUrl(a.token, base),
  };
}

/** „899,00 € netto + 170,81 € USt (19 %) = 1.069,81 €“ bzw. ohne USt. */
function summenText(s: Summe, satz: UstSatz): string {
  return satz === 19
    ? `${formatEuro(s.netto)} netto + ${formatEuro(s.ust)} USt (19 %) = ${formatEuro(s.brutto)}`
    : `${formatEuro(s.netto)} (keine Umsatzsteuer nach § 19 UStG)`;
}

/**
 * Bestätigung an den Kunden direkt nach der Annahme (Eingangsbestätigung
 * nach § 312i Abs. 1 Nr. 3 BGB und zugleich sein Beleg): Nummer, Titel,
 * wann und von wem angenommen, alle Positionen mit Summen (netto, USt,
 * brutto), die Hinweise und der Link zum Angebot. Sie-Form.
 */
export function kundenBestaetigung(
  a: Pick<
    Angebot,
    | "nummer"
    | "token"
    | "kunde_name"
    | "titel"
    | "positionen"
    | "ust_satz"
    | "hinweise"
    | "accepted_at"
    | "angenommen_von"
  >,
  base: string = SITE_URL,
): { subject: string; text: string } {
  const summen = berechneSummen(a.positionen, a.ust_satz);
  const name = a.kunde_name.trim();
  const leistungen: string[] = [];
  for (const art of POSITION_ARTEN) {
    const liste = a.positionen.filter((p) => p.art === art);
    if (!liste.length) continue;
    const monatlich = art === "monatlich";
    leistungen.push(monatlich ? "Monatliche Leistungen:" : "Einmalige Leistungen:");
    for (const p of liste) {
      const netto = positionNetto(p);
      const menge = p.menge > 1 ? `${p.menge} × ` : "";
      const betrag =
        netto === 0 ? "inklusive" : `${formatEuro(netto)}${monatlich ? " im Monat" : ""}`;
      leistungen.push(`- ${menge}${einzeilig(p.titel)}: ${betrag}`);
    }
    const summe = monatlich ? summen.monatlich : summen.einmalig;
    leistungen.push(
      `Summe ${monatlich ? "monatlich" : "einmalig"}: ${summenText(summe, a.ust_satz)}${monatlich ? " im Monat" : ""}`,
    );
    leistungen.push("");
  }
  const hinweise = a.hinweise.trim();
  const text = [
    name ? `Guten Tag ${name},` : "Guten Tag,",
    "vielen Dank für Ihren Auftrag. Hiermit bestätigen wir, dass Ihre Annahme bei uns eingegangen ist.",
    [
      `Angebot: ${a.nummer} · ${einzeilig(a.titel)}`,
      ...(a.accepted_at
        ? [`Angenommen am: ${formatZeitpunktLang(a.accepted_at)}`]
        : []),
      ...(a.angenommen_von ? [`Angenommen von: ${a.angenommen_von}`] : []),
    ].join("\n"),
    leistungen.join("\n").trim(),
    ...(hinweise ? [`Hinweise:\n${hinweise}`] : []),
    `Das vollständige Angebot finden Sie jederzeit hier, dort können Sie es auch als PDF speichern:\n${angebotUrl(a.token, base)}`,
    `Wir melden uns in Kürze mit dem Starttermin. Bei Fragen rufen Sie uns gern an oder antworten Sie auf diese Mail.`,
    SIGNATUR,
  ]
    .filter(Boolean)
    .join("\n\n");
  return {
    subject: plain(`Bestätigung: Angebot ${a.nummer} angenommen`),
    text: plain(text),
  };
}

/**
 * Benachrichtigung an den Inhaber, wenn ein Kunde annimmt oder
 * ablehnt. Betreff „Angebot A-… angenommen: <Kunde>“. Ohne Token.
 */
export function inhaberBenachrichtigung(
  art: "angenommen" | "abgelehnt",
  a: Pick<
    Angebot,
    | "lead_id"
    | "nummer"
    | "kunde_name"
    | "kunde_firma"
    | "positionen"
    | "ust_satz"
    | "accepted_at"
    | "declined_at"
    | "angenommen_von"
    | "abgelehnt_grund"
  >,
  base: string = SITE_URL,
): { subject: string; text: string } {
  const kunde = kundeAnzeige(a);
  const preis = preisSatz(berechneSummen(a.positionen, a.ust_satz));
  const wann = art === "angenommen" ? a.accepted_at : a.declined_at;
  const lines = [
    `Angebot ${a.nummer} wurde ${art === "angenommen" ? "angenommen" : "abgelehnt"}.`,
    "",
    `Kunde: ${kunde}`,
    ...(art === "angenommen" && a.angenommen_von
      ? [`Angenommen von: ${a.angenommen_von}`]
      : []),
    ...(wann ? [`Zeitpunkt: ${formatZeitpunktLang(wann)}`] : []),
    ...(preis ? [`Preis: ${preis}`] : []),
    ...(art === "abgelehnt" && a.abgelehnt_grund
      ? ["", "Grund:", a.abgelehnt_grund]
      : []),
    "",
    `Im Admin öffnen: ${adminAnfrageUrl(a.lead_id, base)}`,
  ];
  return {
    subject: plain(`Angebot ${a.nummer} ${art}: ${kunde}`),
    text: plain(lines.join("\n")),
  };
}

// ---------------------------------------------------------------------
// Verlauf (lead_events, action 'angebot')
// ---------------------------------------------------------------------

export const ANGEBOT_EREIGNISSE = [
  "erstellt",
  "gesendet",
  "angesehen",
  "angenommen",
  "abgelehnt",
  "zurueckgezogen",
  "verworfen",
  "mail_fehler",
  "bestaetigt",
  "bestaetigung_fehler",
] as const;
export type AngebotEreignis = (typeof ANGEBOT_EREIGNISSE)[number];

/** Detail eines Verlaufseintrags: nur Art und Nummer, keine Inhalte. */
export type AngebotEventDetail = {
  was: AngebotEreignis;
  nummer: string;
  erneut?: true;
};

const NUMMER_RE = /^A-\d{4}-\d{4,}$/;

/** Verlaufszeile zu action 'angebot'. */
export function angebotEventText(detail: Record<string, unknown>): string {
  const nr =
    typeof detail.nummer === "string" && NUMMER_RE.test(detail.nummer)
      ? `Angebot ${detail.nummer}`
      : "Angebot";
  switch (oneOf(ANGEBOT_EREIGNISSE, detail.was)) {
    case "erstellt":
      return `${nr} erstellt`;
    case "gesendet":
      return detail.erneut ? `${nr} erneut gesendet` : `${nr} gesendet`;
    case "angesehen":
      return `${nr} vom Kunden geöffnet`;
    case "angenommen":
      return `${nr} angenommen`;
    case "abgelehnt":
      return `${nr} abgelehnt`;
    case "zurueckgezogen":
      return `${nr} zurückgezogen`;
    case "verworfen":
      return `${nr} (Entwurf) verworfen`;
    case "mail_fehler":
      return `Benachrichtigung zu ${nr} fehlgeschlagen`;
    case "bestaetigt":
      return `Bestätigung zu ${nr} an den Kunden geschickt`;
    case "bestaetigung_fehler":
      return `Bestätigung zu ${nr} an den Kunden fehlgeschlagen`;
    default:
      return nr;
  }
}
