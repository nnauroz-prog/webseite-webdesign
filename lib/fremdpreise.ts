/**
 * Preise von Baukasten-Anbietern für den Ratgeber /webseite-erstellen und
 * /vergleich. Beide Seiten lesen nur aus dieser Datei, damit sie
 * gleichlautend bleiben.
 *
 * Stand 1. November 2026: bewusst ohne Beträge. Die Preisseiten von Wix,
 * Squarespace und Jimdo ließen sich bisher nicht prüfen, und Fremdpreise
 * nennen wir nur mit Beleg (fakten.md, UWG §§ 5 und 6).
 *
 * Wer einen Betrag ergänzt, öffnet vorher die Preisseite des Anbieters im
 * Browser und trägt ein: Betrag als „ab ca. … € im Monat", Tarif,
 * Zahlweise (jährlich oder monatlich), „inkl. USt." und das Prüfdatum.
 */

export type Fremdpreis = {
  anbieter: "Wix" | "Squarespace" | "Jimdo";
  /** z. B. „ab ca. 17 € im Monat". null, solange nicht geprüft. */
  betrag: string | null;
  /** Tarif, Zahlweise, brutto oder netto und Prüfdatum. Pflicht, sobald ein Betrag steht. */
  beleg: string | null;
};

export const BAUKASTEN_PREISE: Fremdpreis[] = [
  { anbieter: "Wix", betrag: null, beleg: null },
  { anbieter: "Squarespace", betrag: null, beleg: null },
  { anbieter: "Jimdo", betrag: null, beleg: null },
];

/** Satz für die Kosten eines Baukastens, solange kein geprüfter Betrag vorliegt. */
export const BAUKASTEN_OHNE_BETRAG =
  "Abo beim Anbieter. Tarife und Preise stehen auf dessen Preisseite; achten Sie auf den Preis nach dem Aktionszeitraum und darauf, ob er die Umsatzsteuer enthält.";

/** Kosten-Satz für einen Anbieter: mit Betrag und Beleg, wenn geprüft, sonst ohne Betrag. */
export function baukastenKosten(anbieter: Fremdpreis["anbieter"]): string {
  const p = BAUKASTEN_PREISE.find((x) => x.anbieter === anbieter);
  if (p?.betrag && p.beleg)
    return `${p.betrag[0].toUpperCase()}${p.betrag.slice(1)} (${p.beleg}).`;
  return BAUKASTEN_OHNE_BETRAG;
}
