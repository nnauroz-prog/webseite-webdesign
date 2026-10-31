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

/** Welcher Zustellweg ist eingerichtet? Für die Statusanzeige in /admin. */
export function mailSetup(): { provider: "resend" | "formspree" | null; to: string } {
  const provider = process.env.RESEND_API_KEY?.trim()
    ? "resend"
    : process.env.FORMSPREE_FORM_ID?.trim()
      ? "formspree"
      : null;
  return { provider, to: leadMailTo() };
}

/** Übersetzt typische Anbieter-Fehler in einen konkreten Hinweis. */
export function explainDeliveryError(message: string): string {
  if (/own email address|testing emails/i.test(message)) {
    return "Resend darf ohne eigene Domain nur an die E-Mail-Adresse des Resend-Kontos senden. LEAD_MAIL_TO muss genau diese Adresse sein — oder sitalo.de bei Resend unter Domains verifizieren.";
  }
  if (/api key is invalid|invalid_api_key|missing_api_key|restricted_api_key|Resend 401/i.test(message)) {
    return "Der RESEND_API_KEY wird abgelehnt. Bitte in Resend einen neuen Schlüssel (Sending access) erstellen und in Vercel ersetzen, dann neu deployen.";
  }
  if (/domain.*not verified|verify a domain/i.test(message)) {
    return "Die Absender-Domain in LEAD_MAIL_FROM ist bei Resend nicht verifiziert. LEAD_MAIL_FROM leer lassen oder die Domain verifizieren.";
  }
  if (/fetch failed|ENOTFOUND|ECONN|ETIMEDOUT|network/i.test(message)) {
    return "Der Mail-Dienst war gerade nicht erreichbar. Bitte in einer Minute noch einmal versuchen.";
  }
  if (/Formspree/i.test(message)) {
    return "Formspree lehnt ab — meist ist das Formular nicht bestätigt oder das Monatslimit erreicht.";
  }
  return message;
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
