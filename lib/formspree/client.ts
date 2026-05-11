/**
 * Thin client for Formspree's REST API. Centralises the form-id
 * check so callers can degrade gracefully when it isn't set.
 *
 * We use Formspree as a reliable transport for inquiry mails — it
 * handles delivery, spam filtering and inbox-reputation issues that
 * a self-managed Resend-on-shared-domain setup struggles with.
 *
 * Get your form ID at https://formspree.io → Forms → New Form → the
 * URL ends in /f/<form_id>. Sign in with the email that should
 * receive the inquiries.
 */

export function isFormspreeConfigured(): boolean {
  return Boolean(process.env.FORMSPREE_FORM_ID);
}

export type FormspreePayload = {
  /** Subject line for the email Formspree sends. */
  subject: string;
  /** Reply-to header so the operator can hit reply and answer the
   *  inquirer directly. */
  replyTo?: string;
  /** Field map rendered into the email body. Plain key/value rows. */
  fields: Record<string, string | undefined | null>;
};

export type FormspreeResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

/**
 * Submit an inquiry to Formspree. Returns ok/error rather than
 * throwing so the action layer can keep going (DB write must not be
 * blocked by mail delivery).
 */
export async function sendToFormspree(
  payload: FormspreePayload,
): Promise<FormspreeResult> {
  const formId = process.env.FORMSPREE_FORM_ID?.trim();
  if (!formId) {
    return {
      ok: false,
      status: 0,
      error: "FORMSPREE_FORM_ID not set",
    };
  }

  // Formspree renders a key/value table from the JSON body in the
  // email. Drop empty fields to keep the body tidy.
  const body: Record<string, unknown> = {
    _subject: payload.subject,
  };
  if (payload.replyTo) body._replyto = payload.replyTo;
  for (const [key, value] of Object.entries(payload.fields)) {
    if (value && value.toString().trim() !== "") {
      body[key] = value;
    }
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      let detail = "";
      try {
        const json = (await response.json()) as { error?: string };
        detail = json.error ?? "";
      } catch {
        detail = await response.text().catch(() => "");
      }
      return {
        ok: false,
        status: response.status,
        error: detail || `HTTP ${response.status}`,
      };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
