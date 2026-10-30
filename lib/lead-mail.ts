/**
 * Zustellung von Anfragen (Anfrage, Audit, Termin) — server-seitig.
 *
 * Vorher hat der Browser direkt an Formspree geschickt. Ging dort
 * etwas schief (Formular nicht bestätigt, Limit erreicht, falsche
 * ID), gab es keine Stelle, an der man das sehen konnte. Jetzt läuft
 * jede Anfrage über /api/anfrage, und jeder Fehler landet im
 * Vercel-Log.
 *
 * Zustellweg, in dieser Reihenfolge:
 *   1. Resend (RESEND_API_KEY gesetzt) — direkte Mail an LEAD_MAIL_TO
 *   2. Formspree (FORMSPREE_FORM_ID gesetzt) — bisheriger Weg, jetzt
 *      server-seitig, damit nichts bricht, bevor Resend eingerichtet ist
 *   3. Keins von beiden → LeadDeliveryError „not_configured"
 */

export type LeadKind = "anfrage" | "audit" | "termin";

export type Lead = {
  kind: LeadKind;
  subject: string;
  /** Feld-Label → Wert, in Anzeige-Reihenfolge. */
  fields: [string, string][];
  replyTo: string;
};

export class LeadDeliveryError extends Error {
  constructor(
    public readonly reason: "not_configured" | "provider_rejected" | "network",
    message: string,
  ) {
    super(message);
  }
}

export function leadMailTo(): string {
  return process.env.LEAD_MAIL_TO?.trim() || "info@sitalo.de";
}

function textBody(lead: Lead): string {
  const width = Math.max(...lead.fields.map(([k]) => k.length));
  const lines = lead.fields.map(([k, v]) =>
    v.includes("\n") ? `${k}:\n${v}\n` : `${k.padEnd(width)}  ${v}`,
  );
  return `${lines.join("\n")}\n\n—\nGesendet über sitalo.de (${lead.kind})`;
}

async function viaResend(lead: Lead, apiKey: string): Promise<void> {
  const from =
    process.env.LEAD_MAIL_FROM?.trim() || "Sitalo Website <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [leadMailTo()],
      reply_to: lead.replyTo,
      subject: lead.subject,
      text: textBody(lead),
    }),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 500);
    throw new LeadDeliveryError(
      "provider_rejected",
      `Resend ${res.status}: ${detail}`,
    );
  }
}

async function viaFormspree(lead: Lead, formId: string): Promise<void> {
  const payload: Record<string, string> = Object.fromEntries(lead.fields);
  payload._subject = lead.subject;
  payload._replyto = lead.replyTo;
  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 500);
    throw new LeadDeliveryError(
      "provider_rejected",
      `Formspree ${res.status}: ${detail}`,
    );
  }
}

export async function deliverLead(lead: Lead): Promise<"resend" | "formspree"> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const formspreeId = process.env.FORMSPREE_FORM_ID?.trim();
  try {
    if (resendKey) {
      await viaResend(lead, resendKey);
      return "resend";
    }
    if (formspreeId) {
      await viaFormspree(lead, formspreeId);
      return "formspree";
    }
  } catch (err) {
    if (err instanceof LeadDeliveryError) throw err;
    throw new LeadDeliveryError(
      "network",
      err instanceof Error ? err.message : String(err),
    );
  }
  throw new LeadDeliveryError(
    "not_configured",
    "Weder RESEND_API_KEY noch FORMSPREE_FORM_ID ist gesetzt.",
  );
}
