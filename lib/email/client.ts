import { Resend } from "resend";

let cached: Resend | null = null;

/**
 * Lazily-initialised Resend client. Returns null if RESEND_API_KEY is not
 * configured — callers should treat that as "email disabled" rather than
 * an error so leads/applications still save to the DB without crashing.
 */
export function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

/**
 * From-address used for outgoing notifications. Must be a domain you've
 * verified in Resend. Defaults to onboarding@resend.dev which works
 * out-of-the-box for development without DNS setup.
 */
export function getMailFrom(): string {
  return process.env.MAIL_FROM ?? "SitePilot <onboarding@resend.dev>";
}
