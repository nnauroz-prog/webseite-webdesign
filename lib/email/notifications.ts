import { getMailFrom, getResend } from "@/lib/email/client";
import { getSiteUrl } from "@/lib/site-url";

type NewLeadPayload = {
  ownerEmail: string;
  businessName: string;
  slug: string;
  lead: {
    name: string;
    email: string;
    phone: string | null;
    message: string;
  };
};

type NewApplicationPayload = {
  ownerEmail: string;
  businessName: string;
  slug: string;
  application: {
    name: string;
    email: string;
    phone: string | null;
    desired_position: string | null;
    message: string;
  };
};

/**
 * Sends a "new contact request" notification to the website owner. Failure
 * is logged and swallowed — the lead is already saved in the DB so the user
 * can still see it in the dashboard, the email is just a nice-to-have.
 */
export async function notifyNewLead(payload: NewLeadPayload): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const dashboardUrl = `${getSiteUrl()}/dashboard/leads`;
  const phoneRow = payload.lead.phone
    ? `<tr><td><strong>Telefon:</strong></td><td>${escape(payload.lead.phone)}</td></tr>`
    : "";

  try {
    await resend.emails.send({
      from: getMailFrom(),
      to: payload.ownerEmail,
      subject: `Neue Anfrage über ${payload.businessName}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 8px 0;">Neue Kontaktanfrage</h2>
          <p style="color: #666; margin: 0 0 24px 0;">über deine Website <strong>${escape(payload.businessName)}</strong></p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 4px 0;"><strong>Name:</strong></td><td>${escape(payload.lead.name)}</td></tr>
            <tr><td style="padding: 4px 0;"><strong>E-Mail:</strong></td><td><a href="mailto:${escape(payload.lead.email)}">${escape(payload.lead.email)}</a></td></tr>
            ${phoneRow}
          </table>
          <h3 style="margin: 24px 0 8px 0;">Nachricht</h3>
          <p style="white-space: pre-line; background: #f5f5f5; padding: 16px; border-radius: 8px;">${escape(payload.lead.message)}</p>
          <p style="margin-top: 32px;">
            <a href="${dashboardUrl}" style="display: inline-block; background: #111; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Im Dashboard öffnen</a>
          </p>
        </div>
      `,
      replyTo: payload.lead.email,
    });
  } catch (err) {
    console.error("[notifyNewLead] resend failed", {
      message: err instanceof Error ? err.message : String(err),
      slug: payload.slug,
    });
  }
}

/**
 * Sends a "new application" notification to the website owner. Same
 * fail-soft semantics as notifyNewLead.
 */
export async function notifyNewApplication(
  payload: NewApplicationPayload,
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const dashboardUrl = `${getSiteUrl()}/dashboard/applications`;
  const phoneRow = payload.application.phone
    ? `<tr><td><strong>Telefon:</strong></td><td>${escape(payload.application.phone)}</td></tr>`
    : "";
  const positionRow = payload.application.desired_position
    ? `<tr><td><strong>Stelle:</strong></td><td>${escape(payload.application.desired_position)}</td></tr>`
    : "";

  try {
    await resend.emails.send({
      from: getMailFrom(),
      to: payload.ownerEmail,
      subject: `Neue Bewerbung über ${payload.businessName}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 8px 0;">Neue Bewerbung</h2>
          <p style="color: #666; margin: 0 0 24px 0;">über deine Website <strong>${escape(payload.businessName)}</strong></p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 4px 0;"><strong>Name:</strong></td><td>${escape(payload.application.name)}</td></tr>
            <tr><td style="padding: 4px 0;"><strong>E-Mail:</strong></td><td><a href="mailto:${escape(payload.application.email)}">${escape(payload.application.email)}</a></td></tr>
            ${phoneRow}
            ${positionRow}
          </table>
          <h3 style="margin: 24px 0 8px 0;">Nachricht</h3>
          <p style="white-space: pre-line; background: #f5f5f5; padding: 16px; border-radius: 8px;">${escape(payload.application.message)}</p>
          <p style="margin-top: 32px;">
            <a href="${dashboardUrl}" style="display: inline-block; background: #111; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Im Dashboard öffnen</a>
          </p>
        </div>
      `,
      replyTo: payload.application.email,
    });
  } catch (err) {
    console.error("[notifyNewApplication] resend failed", {
      message: err instanceof Error ? err.message : String(err),
      slug: payload.slug,
    });
  }
}

type NewBookingPayload = {
  ownerEmail: string;
  businessName: string;
  slug: string;
  booking: {
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    service_title: string | null;
    preferred_date: string;
    preferred_time: string | null;
    message: string | null;
  };
};

/**
 * Sends a "new booking" notification to the website owner. Same
 * fail-soft semantics as notifyNewLead.
 */
export async function notifyNewBooking(
  payload: NewBookingPayload,
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const dashboardUrl = `${getSiteUrl()}/dashboard/bookings`;
  const b = payload.booking;

  const phoneRow = b.customer_phone
    ? `<tr><td><strong>Telefon:</strong></td><td>${escape(b.customer_phone)}</td></tr>`
    : "";
  const serviceRow = b.service_title
    ? `<tr><td><strong>Leistung:</strong></td><td>${escape(b.service_title)}</td></tr>`
    : "";
  const timeStr = b.preferred_time
    ? `${escape(b.preferred_date)} um ${escape(b.preferred_time)} Uhr`
    : escape(b.preferred_date);
  const messageBlock = b.message
    ? `
      <h3 style="margin: 24px 0 8px 0;">Nachricht</h3>
      <p style="white-space: pre-line; background: #f5f5f5; padding: 16px; border-radius: 8px;">${escape(b.message)}</p>
    `
    : "";

  try {
    await resend.emails.send({
      from: getMailFrom(),
      to: payload.ownerEmail,
      subject: `Neue Terminanfrage über ${payload.businessName}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 8px 0;">Neue Terminanfrage</h2>
          <p style="color: #666; margin: 0 0 24px 0;">über deine Website <strong>${escape(payload.businessName)}</strong></p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 4px 0;"><strong>Wunschtermin:</strong></td><td>${timeStr}</td></tr>
            ${serviceRow}
            <tr><td style="padding: 4px 0;"><strong>Name:</strong></td><td>${escape(b.customer_name)}</td></tr>
            <tr><td style="padding: 4px 0;"><strong>E-Mail:</strong></td><td><a href="mailto:${escape(b.customer_email)}">${escape(b.customer_email)}</a></td></tr>
            ${phoneRow}
          </table>
          ${messageBlock}
          <p style="margin-top: 32px;">
            <a href="${dashboardUrl}" style="display: inline-block; background: #3a2a1c; color: #fbf6e8; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Termin im Dashboard prüfen</a>
          </p>
        </div>
      `,
      replyTo: b.customer_email,
    });
  } catch (err) {
    console.error("[notifyNewBooking] resend failed", {
      message: err instanceof Error ? err.message : String(err),
      slug: payload.slug,
    });
  }
}

/**
 * Customer-facing confirmation email — fired when the owner flips a
 * booking from `new` → `confirmed` in the dashboard. Best-effort: if
 * Resend isn't configured, we silently skip.
 */
export type BookingConfirmationPayload = {
  customerEmail: string;
  customerName: string;
  businessName: string;
  slug: string;
  preferred_date: string;
  preferred_time: string | null;
  service_title: string | null;
};

export async function notifyBookingConfirmation(
  payload: BookingConfirmationPayload,
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const siteUrl = `${getSiteUrl()}/site/${payload.slug}`;
  const timeStr = payload.preferred_time
    ? `${escape(payload.preferred_date)} um ${escape(payload.preferred_time.slice(0, 5))} Uhr`
    : escape(payload.preferred_date);
  const serviceRow = payload.service_title
    ? `<tr><td style="padding: 4px 0;"><strong>Leistung:</strong></td><td>${escape(payload.service_title)}</td></tr>`
    : "";

  try {
    await resend.emails.send({
      from: getMailFrom(),
      to: payload.customerEmail,
      subject: `Termin bestätigt — ${payload.businessName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 8px 0;">Termin bestätigt</h2>
          <p style="color: #666; margin: 0 0 24px 0;">Hallo ${escape(payload.customerName)},<br/>dein Termin bei <strong>${escape(payload.businessName)}</strong> wurde bestätigt.</p>
          <table style="width: 100%; border-collapse: collapse; background: #f5ecd9; padding: 16px; border-radius: 8px;">
            <tr><td style="padding: 8px;"><strong>Termin:</strong></td><td style="padding: 8px;">${timeStr}</td></tr>
            ${serviceRow}
          </table>
          <p style="margin-top: 32px; color: #666;">
            Bei Rückfragen oder Änderungen antworte einfach auf diese Mail.
          </p>
          <p style="margin-top: 24px;">
            <a href="${siteUrl}" style="color: #3a2a1c; text-decoration: underline;">Zur Website</a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[notifyBookingConfirmation] resend failed", {
      message: err instanceof Error ? err.message : String(err),
      slug: payload.slug,
    });
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
