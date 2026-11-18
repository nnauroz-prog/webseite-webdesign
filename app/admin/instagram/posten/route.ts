import { requireAdmin } from "@/lib/admin/auth";
import { ndjsonAntwortAus } from "@/lib/ndjson-strom";
import { posteAuftrag } from "@/lib/instagram/posten";
import {
  INSTAGRAM_INHALTSTYP,
  type PostEreignis,
} from "@/lib/instagram/vertrag";

/**
 * Posten auf Instagram aus dem Story-Studio: POST /admin/instagram/posten
 *
 * Nimmt einen Auftrag entgegen (PostAuftrag: Art, Pfade der hochgeladenen
 * Bilder, Bildunterschrift, Quelle) und antwortet als Strom von
 * JSON-Zeilen, eine je Ereignis: erst die Schritte, zuletzt „fertig“ oder
 * „fehler“. Form und Verhalten stehen in lib/instagram/vertrag.ts, der
 * Ablauf in lib/instagram/posten.ts.
 *
 * Nur für Admins (requireAdmin; proxy.ts leitet ohne Sitzung zum
 * Login). Der Zugangsschlüssel für Instagram bleibt auf dem Server.
 */

// Supabase und die Graph API laufen über Node, nicht die Edge-Laufzeit.
export const runtime = "nodejs";

// Sekunden. Das Posten bricht selbst nach rund 100 Sekunden ab
// (FRIST_MS in lib/instagram/posten.ts); der Rest ist Luft für
// Anmeldung, Verlauf und das Löschen der Bilder am Ende.
export const maxDuration = 120;

/**
 * Mehr braucht ein Auftrag nicht: zehn Pfade und eine Bildunterschrift
 * mit höchstens 2200 Zeichen (auch wenn JSON jedes Zeichen maskiert).
 */
const BODY_MAX = 20_000;

const UNBEKANNT: PostEreignis = {
  typ: "fehler",
  code: "unbekannt",
  text: "Da ist etwas schiefgelaufen. Versuch es gleich noch einmal.",
};

export async function POST(request: Request): Promise<Response> {
  await requireAdmin();
  let roh: unknown = null;
  try {
    const laenge = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(laenge) && laenge <= BODY_MAX * 4) {
      const text = await request.text();
      roh = text.length <= BODY_MAX ? (JSON.parse(text) as unknown) : null;
    }
  } catch {
    roh = null;
  }
  return ndjsonAntwortAus<PostEreignis>(
    (sende, signal) => posteAuftrag(roh, sende, { signal }),
    UNBEKANNT,
    INSTAGRAM_INHALTSTYP,
  );
}
