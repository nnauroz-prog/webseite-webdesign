import "server-only";

import type { AngebotHinweis, AngebotKurz } from "@/lib/admin/angebote";

import { angebotHinweis, angeboteNachAnfrage } from "@/lib/admin/angebote";
import { listAngeboteKurz } from "@/lib/angebote-store";

/**
 * Angebots-Hinweise je Anfrage („Angebot gesendet“ …) für die Karten
 * der Übersicht und der Suche. Fehlt die Tabelle oder klemmt die
 * Abfrage, gibt es einfach keine Hinweise: Übersicht und Suche sollen
 * daran nie scheitern. Nur Admin-Kontext (nach requireAdmin).
 */
export async function loadAngebotHinweise(): Promise<
  Map<string, AngebotHinweis>
> {
  let rows: AngebotKurz[] | null = null;
  try {
    rows = await listAngeboteKurz();
  } catch (err) {
    console.error("[admin] Angebots-Hinweise nicht geladen", {
      code:
        err && typeof err === "object" && "code" in err
          ? String(err.code)
          : "unbekannt",
    });
  }
  const out = new Map<string, AngebotHinweis>();
  for (const [leadId, list] of angeboteNachAnfrage(rows ?? [])) {
    const h = angebotHinweis(list);
    if (h) out.set(leadId, h);
  }
  return out;
}
