import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Diagnostic endpoint. Returns whether the runtime sees the env vars we
 * need, plus the length and a short prefix of the URLs (never secrets)
 * so the operator can spot typos / wrong values without leaking keys.
 *
 * Visit https://<your-domain>/api/health to verify config from outside.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const stripeSecret = process.env.STRIPE_SECRET_KEY ?? "";
  const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  const stripeBasic = process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC ?? "";
  const stripePro = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "";
  const stripePremium = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM ?? "";
  const resendKey = process.env.RESEND_API_KEY ?? "";
  const mailFrom = process.env.MAIL_FROM ?? "";
  const leadEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? "";
  const inquiryTo = process.env.SITALO_INQUIRY_TO ?? "";
  const whatsappNumber = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER ?? "";

  // Show which lead recipient the action would actually use right
  // now, with the same fallback chain as lib/actions/inquiries.ts.
  const resolvedLeadRecipient =
    leadEmail.trim() || inquiryTo.trim() || "hallo@sitalo.de";

  return NextResponse.json({
    runtime: process.version,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: presence(supabaseUrl, { showPrefix: true }),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: presence(supabaseAnon),
      SUPABASE_SERVICE_ROLE_KEY: presence(serviceRole),
      NEXT_PUBLIC_APP_URL: presence(appUrl, { showPrefix: true }),
      STRIPE_SECRET_KEY: presence(stripeSecret),
      STRIPE_WEBHOOK_SECRET: presence(stripeWebhook),
      NEXT_PUBLIC_STRIPE_PRICE_BASIC: presence(stripeBasic),
      NEXT_PUBLIC_STRIPE_PRICE_PRO: presence(stripePro),
      NEXT_PUBLIC_STRIPE_PRICE_PREMIUM: presence(stripePremium),
      RESEND_API_KEY: presence(resendKey),
      MAIL_FROM: presence(mailFrom, { showPrefix: true }),
      LEAD_NOTIFICATION_EMAIL: presence(leadEmail, { showPrefix: true }),
      SITALO_INQUIRY_TO: presence(inquiryTo, { showPrefix: true }),
      NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER: presence(whatsappNumber, {
        showPrefix: true,
      }),
    },
    leads: {
      resolved_recipient: resolvedLeadRecipient,
      mail_from: mailFrom || "(empty — Resend will reject)",
      hint:
        resendKey && mailFrom
          ? "Visit /api/diag/lead-test?secret=<CRON_SECRET> to send a real test email and see Resend's response."
          : "RESEND_API_KEY and MAIL_FROM must both be set for the agency notification to leave the server.",
    },
  });
}

function presence(
  value: string,
  opts: { showPrefix?: boolean } = {},
): {
  set: boolean;
  length: number;
  prefix?: string;
  trailingWhitespace?: boolean;
} {
  if (!value) return { set: false, length: 0 };
  const trimmed = value.trim();
  return {
    set: true,
    length: value.length,
    prefix: opts.showPrefix ? value.slice(0, 20) : undefined,
    trailingWhitespace: value !== trimmed ? true : undefined,
  };
}
