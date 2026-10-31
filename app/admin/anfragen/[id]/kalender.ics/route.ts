import { requireAdmin } from "@/lib/admin/auth";
import { buildTerminIcs, terminIcsFilename } from "@/lib/admin/termin-ics";
import { parseTerminSlot } from "@/lib/admin/termin-slot";
import { parseId } from "@/lib/admin/validate";
import { getLead } from "@/lib/leads-store";

/**
 * Termin einer Anfrage als Kalender-Datei für den Inhaber:
 * /admin/anfragen/<id>/kalender.ics
 *
 * Nur für Admins (requireAdmin, proxy.ts leitet ohne Sitzung zum
 * Login). Inhalt siehe lib/admin/termin-ics.ts: keine internen
 * Notizen, kein Admin-Link.
 */

export const dynamic = "force-dynamic";

const NO_STORE = "private, no-store";

function plain(status: number, text: string): Response {
  return new Response(text, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": NO_STORE,
    },
  });
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  await requireAdmin();
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (!id) return plain(404, "Diese Anfrage gibt es nicht.");

  let lead;
  try {
    lead = await getLead(id);
  } catch (err) {
    console.error("[admin] Kalender-Datei: Laden fehlgeschlagen", {
      leadId: id,
      code: (err as { code?: string }).code ?? "?",
    });
    return plain(
      503,
      "Die Anfrage lässt sich gerade nicht laden. Bitte gleich noch einmal versuchen.",
    );
  }
  if (!lead) return plain(404, "Diese Anfrage gibt es nicht.");

  const slot = parseTerminSlot(lead);
  if (!slot) return plain(404, "Für diese Anfrage ist kein Termin hinterlegt.");

  return new Response(buildTerminIcs(lead, slot, new Date()), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="${terminIcsFilename(slot)}"`,
      "cache-control": NO_STORE,
    },
  });
}
