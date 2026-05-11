import { NextResponse } from "next/server";

import { getMailFrom, getResend } from "@/lib/email/client";

/**
 * GET /api/diag/lead-test
 *
 * Production-debugging endpoint. Triggers a real Resend send to the
 * configured lead recipient and returns Resend's full response — id
 * on success, the actual error message on failure. Reveals the most
 * common reasons "no mail arrives":
 *
 *   - RESEND_API_KEY missing / wrong / expired
 *   - MAIL_FROM uses an unverified domain → Resend 403
 *   - Free-tier recipient restriction (Resend only sends to the
 *     account owner email until you verify a sending domain)
 *   - The mail leaves the server but the recipient's provider
 *     puts it in spam / blocks it (Resend reports ok=true here —
 *     check your spam folder next)
 *
 * Not auth-gated: the recipient is always whatever the operator put
 * in LEAD_NOTIFICATION_EMAIL — a random visitor can at worst fill
 * the operator's own inbox with test mails, which Resend's rate
 * limit caps anyway. Remove this route once the lead path is
 * verified working in production.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      {
        ok: false,
        error: "RESEND_API_KEY is not set. No mail provider configured.",
      },
      { status: 500 },
    );
  }

  const recipient =
    process.env.LEAD_NOTIFICATION_EMAIL?.trim() ||
    process.env.SITALO_INQUIRY_TO?.trim() ||
    "hallo@sitalo.de";
  const from = getMailFrom();

  try {
    const result = await resend.emails.send({
      from,
      to: recipient,
      subject: "Sitalo · Test-Anfrage (Diagnostic)",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 8px 0;">Test-Mail von /api/diag/lead-test</h2>
          <p style="color: #555; margin: 0 0 16px 0;">Wenn diese Mail ankommt, funktioniert der Resend-Pfad. Falls reale Anfragen trotzdem nicht durchgehen, liegt das Problem an der Action selbst oder am Spam-Filter.</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Empfänger</td><td>${escape(recipient)}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Absender</td><td>${escape(from)}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">Zeitpunkt</td><td>${new Date().toISOString()}</td></tr>
          </table>
        </div>
      `,
    });

    // Resend SDK returns either { data: { id }, error: null } or
    // { data: null, error: { message, name, statusCode } }.
    if (result.error) {
      return NextResponse.json(
        {
          ok: false,
          stage: "resend.send",
          from,
          to: recipient,
          error: {
            name: result.error.name,
            message: result.error.message,
          },
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      stage: "delivered_to_resend",
      from,
      to: recipient,
      message_id: result.data?.id,
      note: "Resend accepted the message. If it never lands in the inbox, check spam / sender-domain verification in your Resend dashboard.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        stage: "exception",
        from,
        to: recipient,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
