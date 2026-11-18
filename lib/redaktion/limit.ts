/**
 * Tageslimit für Aufträge an die Redaktion (Schutz vor versehentlichen
 * Kosten). Gezählt wird doppelt:
 * - in der Datenbank: gespeicherte Serien des Tages (gilt für alle
 *   Server zusammen, sobald es die Tabelle serien gibt),
 * - hier im Speicher: jeder begonnene Auftrag auf diesem Server, auch
 *   wenn er scheitert. Das ist nur eine Näherung: Der Zähler beginnt
 *   bei jedem Neustart des Servers bei null.
 * Es gilt die größere der beiden Zahlen. Rein (ohne Server-Importe).
 */

const begonnen = new Map<string, number>();

/** Begonnene Aufträge an einem Kalendertag (yyyy-mm-dd) auf diesem Server. */
export function begonneneAuftraege(tag: string): number {
  return begonnen.get(tag) ?? 0;
}

/** Zählt einen begonnenen Auftrag; frühere Tage werden vergessen. */
export function merkeAuftrag(tag: string): void {
  for (const alt of [...begonnen.keys()]) if (alt !== tag) begonnen.delete(alt);
  begonnen.set(tag, begonneneAuftraege(tag) + 1);
}

/**
 * Ob das Limit erreicht ist. inDb: gespeicherte Serien des Tages oder
 * null, wenn die Datenbank nicht zählen kann.
 */
export function limitErreicht(
  tag: string,
  inDb: number | null,
  limit: number,
): boolean {
  return Math.max(inDb ?? 0, begonneneAuftraege(tag)) >= limit;
}

/** Nur für Tests: Zähler zurücksetzen. */
export function vergissAuftraege(): void {
  begonnen.clear();
}
