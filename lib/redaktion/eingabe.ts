/**
 * Prüft, was das Story-Studio an die Redaktion schickt, bevor irgendetwas
 * Geld kostet: Auftragstext ohne Steuerzeichen und höchstens AUFTRAG_MAX
 * Zeichen, Tag als echter Kalendertag von gestern bis zwei Wochen voraus
 * (Hamburger Zeit). Rein (ohne Server-Importe).
 */
import { addDays, berlinDateIso } from "@/lib/admin/berlin-time";
import { AUFTRAG_MAX, type RedaktionAuftrag } from "@/lib/redaktion/vertrag";

/** Frühester Tag: gestern (kurz nach Mitternacht noch für „heute“ arbeiten). */
export const TAGE_ZURUECK = 1;
/** Spätester Tag: zwei Wochen voraus (so weit reicht der Kalender der Anlässe). */
export const TAGE_VORAUS = 14;

export type EingabeErgebnis =
  | { ok: true; auftrag: RedaktionAuftrag }
  | { ok: false; text: string };

const UNLESBAR =
  "Der Auftrag ließ sich nicht lesen. Lade die Seite neu und versuch es noch einmal.";
const ZU_LANG = `Der Auftrag ist zu lang (höchstens ${AUFTRAG_MAX} Zeichen).`;
const TAG_PASST_NICHT =
  "Der Tag passt nicht: Serien gehen für gestern bis zwei Wochen voraus.";

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Echter Kalendertag yyyy-mm-dd, sonst null. */
function echterTag(wert: unknown): string | null {
  if (typeof wert !== "string") return null;
  const m = ISO_DATE_RE.exec(wert);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  return t.getUTCFullYear() === y &&
    t.getUTCMonth() === mo - 1 &&
    t.getUTCDate() === d
    ? wert
    : null;
}

/**
 * Auftragstext für den Prompt: Steuer- und unsichtbare Zeichen raus,
 * Zeilenumbrüche werden Leerzeichen, spitze Klammern werden zu ‹ ›
 * (damit der Text die Markierung im Prompt nicht verlassen kann).
 */
export function saubererAuftrag(roh: string): string {
  return roh
    .replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, " ")
    .replace(/\p{Cf}/gu, "")
    .replace(/</g, "‹")
    .replace(/>/g, "›")
    .replace(/\s+/g, " ")
    .trim();
}

/** Prüft die Eingabe gegen die Uhr (jetzt) und räumt den Auftragstext auf. */
export function pruefeEingabe(roh: unknown, jetzt: Date): EingabeErgebnis {
  if (!roh || typeof roh !== "object" || Array.isArray(roh))
    return { ok: false, text: UNLESBAR };
  const { auftrag, datum } = roh as Partial<Record<string, unknown>>;
  if (typeof auftrag !== "string") return { ok: false, text: UNLESBAR };
  // Vor dem Aufräumen messen: Niemand soll mit einem riesigen Text erst
  // Rechenzeit verbrauchen.
  if (auftrag.length > AUFTRAG_MAX * 4) return { ok: false, text: ZU_LANG };
  const text = saubererAuftrag(auftrag);
  if (text.length > AUFTRAG_MAX) return { ok: false, text: ZU_LANG };

  const tag = echterTag(datum);
  if (!tag) return { ok: false, text: TAG_PASST_NICHT };
  const heute = berlinDateIso(jetzt);
  if (tag < addDays(heute, -TAGE_ZURUECK) || tag > addDays(heute, TAGE_VORAUS))
    return { ok: false, text: TAG_PASST_NICHT };

  return { ok: true, auftrag: { auftrag: text, datum: tag } };
}
