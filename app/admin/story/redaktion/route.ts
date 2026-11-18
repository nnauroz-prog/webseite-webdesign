import { requireAdmin } from "@/lib/admin/auth";
import { bearbeiteAuftrag } from "@/lib/redaktion/redaktion";
import { ndjsonAntwort } from "@/lib/redaktion/strom";

/**
 * Die Redaktion des Story-Studios: POST /admin/story/redaktion
 *
 * Nimmt einen Auftrag entgegen ({ auftrag, datum }) und antwortet als
 * Strom von JSON-Zeilen, eine je Ereignis: erst die Arbeitsschritte,
 * zuletzt die fertige Serie oder ein Fehler. Form und Verhalten stehen
 * in lib/redaktion/vertrag.ts, der Ablauf in lib/redaktion/ablauf.ts.
 *
 * Nur für Admins (requireAdmin; proxy.ts leitet ohne Sitzung zum
 * Login). Der Schlüssel für das Modell bleibt auf dem Server.
 */

// Das SDK und die Datenbank brauchen Node, nicht die Edge-Laufzeit.
export const runtime = "nodejs";

// Sekunden. Die Redaktion bricht selbst nach rund 100 Sekunden ab
// (FRIST_MS in lib/redaktion/redaktion.ts); der Rest ist Luft für
// Anmeldung, Datenbank und das Speichern am Ende.
export const maxDuration = 120;

/** Mehr braucht ein Auftrag nicht (Text höchstens 500 Zeichen). */
const BODY_MAX = 8000;

export async function POST(request: Request): Promise<Response> {
  await requireAdmin();
  let roh: unknown = null;
  try {
    const text = await request.text();
    roh = text.length <= BODY_MAX ? (JSON.parse(text) as unknown) : null;
  } catch {
    roh = null;
  }
  return ndjsonAntwort((sende, signal) =>
    bearbeiteAuftrag(roh, sende, { signal }),
  );
}
