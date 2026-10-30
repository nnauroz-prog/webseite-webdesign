import type { LeadKind } from "@/lib/lead-mail";

export type SubmitLeadInput = {
  kind: LeadKind;
  subject: string;
  fields: [string, string | undefined | null][];
  replyTo: string;
  /** Wert des Honeypot-Felds — wird server-seitig ausgewertet. */
  hp: string;
};

const NETWORK_ERROR =
  "Die Verbindung ist gerade abgebrochen. Bitte erneut versuchen — oder schreiben Sie uns direkt an info@sitalo.de.";

/** Schickt ein Formular an /api/anfrage. Leere Felder werden weggelassen. */
export async function submitLead(
  input: SubmitLeadInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const fields = input.fields.filter(
    (f): f is [string, string] => typeof f[1] === "string" && f[1].trim() !== "",
  );
  try {
    const res = await fetch("/api/anfrage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, fields }),
    });
    const data = (await res.json().catch(() => null)) as
      | { ok: boolean; error?: string }
      | null;
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: data?.error || NETWORK_ERROR };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}
