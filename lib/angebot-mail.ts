import "server-only";

import type { Angebot } from "@/lib/admin/angebote";

import {
  ANGEBOT_KONTAKT,
  inhaberBenachrichtigung,
  kundenBestaetigung,
} from "@/lib/admin/angebote";
import { safeEmail } from "@/lib/admin/links";
import { LeadDeliveryError, leadMailTo } from "@/lib/lead-mail";
import { SITE_URL } from "@/lib/site";

/**
 * Benachrichtigung an den Inhaber, wenn ein Kunde auf /angebot/[token]
 * annimmt oder ablehnt. Gleicher Zustellweg wie bei Anfragen
 * (lib/lead-mail.ts): Resend, sonst Formspree, an LEAD_MAIL_TO.
 *
 * Betreff und Text kommen aus inhaberBenachrichtigung (ohne Token, mit
 * Link in den Admin). Antworten gehen an den Kunden, wenn im Angebot
 * eine E-Mail-Adresse steht.
 *
 * Wirft LeadDeliveryError (not_configured, provider_rejected, network).
 * Der Aufrufer fängt das ab: Eine gescheiterte Mail darf die Annahme
 * nicht verhindern.
 */

export type AngebotMailArt = "angenommen" | "abgelehnt";

type MailAngebot = Parameters<typeof inhaberBenachrichtigung>[1] &
  Pick<Angebot, "kunde_email">;

async function detail(res: Response): Promise<string> {
  return (await res.text().catch(() => "")).slice(0, 500);
}

export async function sendeAngebotBenachrichtigung(
  art: AngebotMailArt,
  angebot: MailAngebot,
  base: string = SITE_URL,
): Promise<"resend" | "formspree"> {
  const { subject, text } = inhaberBenachrichtigung(art, angebot, base);
  const replyTo = angebot.kunde_email || undefined;
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const formspreeId = process.env.FORMSPREE_FORM_ID?.trim();

  try {
    if (resendKey) {
      const from =
        process.env.LEAD_MAIL_FROM?.trim() ||
        "Sitalo Website <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [leadMailTo()],
          ...(replyTo ? { reply_to: replyTo } : {}),
          subject,
          text,
        }),
      });
      if (!res.ok) {
        throw new LeadDeliveryError(
          "provider_rejected",
          `Resend ${res.status}: ${await detail(res)}`,
        );
      }
      return "resend";
    }
    if (formspreeId) {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nachricht: text,
          _subject: subject,
          ...(replyTo ? { _replyto: replyTo } : {}),
        }),
      });
      if (!res.ok) {
        throw new LeadDeliveryError(
          "provider_rejected",
          `Formspree ${res.status}: ${await detail(res)}`,
        );
      }
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

type BestaetigungAngebot = Parameters<typeof kundenBestaetigung>[0] &
  Pick<Angebot, "kunde_email">;

/**
 * Bestätigung an den Kunden nach der Annahme (Text aus
 * kundenBestaetigung). Nur über Resend: Formspree schickt nur an das
 * eigene Postfach. Absender LEAD_MAIL_FROM (muss eine bei Resend
 * bestätigte Domain sein, sonst lehnt Resend fremde Empfänger ab),
 * Antworten gehen an info@sitalo.de.
 *
 * null, wenn im Angebot keine E-Mail-Adresse steht (dann gibt es nichts
 * zu senden). Wirft LeadDeliveryError wie oben.
 */
export async function sendeKundenBestaetigung(
  angebot: BestaetigungAngebot,
  base: string = SITE_URL,
): Promise<"resend" | null> {
  const to = angebot.kunde_email ? safeEmail(angebot.kunde_email) : null;
  if (!to) return null;
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    throw new LeadDeliveryError(
      "not_configured",
      "RESEND_API_KEY ist nicht gesetzt.",
    );
  }
  const { subject, text } = kundenBestaetigung(angebot, base);
  const from =
    process.env.LEAD_MAIL_FROM?.trim() ||
    "Sitalo Webdesign <onboarding@resend.dev>";
  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: ANGEBOT_KONTAKT.email,
        subject,
        text,
      }),
    });
  } catch (err) {
    throw new LeadDeliveryError(
      "network",
      err instanceof Error ? err.message : String(err),
    );
  }
  if (!res.ok) {
    throw new LeadDeliveryError(
      "provider_rejected",
      `Resend ${res.status}: ${await detail(res)}`,
    );
  }
  return "resend";
}
