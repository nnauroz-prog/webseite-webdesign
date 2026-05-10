"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import {
  notifyBookingConfirmation,
  notifyNewBooking,
} from "@/lib/email/notifications";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import {
  bookingStatusSchema,
  submitBookingSchema,
} from "@/lib/validations/bookings";

// ---------------------------------------------------------------------------
//  submitBookingAction (anonymous-callable from /site/[slug])
// ---------------------------------------------------------------------------
export async function submitBookingAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // Honeypot — bots fill in any visible-looking input.
  if ((formData.get("website_url") ?? "").toString().trim() !== "") {
    return ok("Vielen Dank — wir bestätigen den Termin in Kürze.");
  }

  const parsed = submitBookingSchema.safeParse({
    slug: formData.get("slug"),
    customer_name: formData.get("customer_name"),
    customer_email: formData.get("customer_email"),
    customer_phone: formData.get("customer_phone"),
    service_id: formData.get("service_id"),
    preferred_date: formData.get("preferred_date"),
    preferred_time: formData.get("preferred_time"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const supabase = await createClient();
  const { data: site } = await supabase
    .from("websites")
    .select("id, slug, user_id, business_name, is_active, booking_form_enabled")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (!site) return fail("Website nicht gefunden.");
  const w = site as {
    id: string;
    slug: string;
    user_id: string;
    business_name: string;
    is_active: boolean;
    booking_form_enabled: boolean;
  };
  if (!w.is_active || !w.booking_form_enabled) {
    return fail("Online-Termine sind aktuell nicht verfügbar.");
  }

  // Snapshot the chosen service title so the dashboard list can show
  // it even if the service is later edited or deleted.
  let serviceTitle: string | null = null;
  if (parsed.data.service_id) {
    const { data: svc } = await supabase
      .from("services")
      .select("title")
      .eq("id", parsed.data.service_id)
      .eq("website_id", w.id)
      .maybeSingle();
    serviceTitle = (svc as { title: string } | null)?.title ?? null;
  }

  const insertPayload = {
    website_id: w.id,
    service_id: parsed.data.service_id ?? null,
    service_title: serviceTitle,
    customer_name: parsed.data.customer_name,
    customer_email: parsed.data.customer_email,
    customer_phone: parsed.data.customer_phone ?? null,
    preferred_date: parsed.data.preferred_date,
    preferred_time:
      parsed.data.preferred_time && parsed.data.preferred_time.length > 0
        ? parsed.data.preferred_time
        : null,
    message:
      parsed.data.message && parsed.data.message.length > 0
        ? parsed.data.message
        : null,
  };

  const { error } = await supabase.from("bookings").insert(insertPayload);
  if (error) {
    return fail(
      "Wir konnten den Termin nicht speichern. Bitte versuche es später erneut.",
    );
  }

  // Best-effort owner notification.
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", w.user_id)
      .maybeSingle();
    const ownerEmail = (profile as { email: string | null } | null)?.email;
    if (ownerEmail) {
      await notifyNewBooking({
        ownerEmail,
        businessName: w.business_name,
        slug: w.slug,
        booking: {
          customer_name: insertPayload.customer_name,
          customer_email: insertPayload.customer_email,
          customer_phone: insertPayload.customer_phone,
          service_title: insertPayload.service_title,
          preferred_date: insertPayload.preferred_date,
          preferred_time: insertPayload.preferred_time,
          message: insertPayload.message,
        },
      });
    }
  } catch (err) {
    console.error("[submitBookingAction] notification failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/bookings");
  return ok("Vielen Dank — wir bestätigen den Termin in Kürze.");
}

// ---------------------------------------------------------------------------
//  updateBookingStatusAction (owner-callable from dashboard)
// ---------------------------------------------------------------------------
export async function updateBookingStatusAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = bookingStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return fail("Ungültiger Status.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();

  // We need the previous status + customer details to know whether to
  // fire the customer-facing confirmation email — only on the
  // new→confirmed transition.
  const { data: existing } = await supabase
    .from("bookings")
    .select(
      "status, customer_email, customer_name, preferred_date, preferred_time, service_title",
    )
    .eq("id", parsed.data.id)
    .eq("website_id", website.id)
    .maybeSingle();
  if (!existing) return fail("Buchung nicht gefunden.");
  const prev = existing as {
    status: string;
    customer_email: string;
    customer_name: string;
    preferred_date: string;
    preferred_time: string | null;
    service_title: string | null;
  };

  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  // Fire-and-forget customer notification when an owner confirms a
  // booking. Errors don't fail the action — the status change is the
  // source of truth.
  if (
    parsed.data.status === "confirmed" &&
    prev.status !== "confirmed" &&
    prev.customer_email
  ) {
    try {
      await notifyBookingConfirmation({
        customerEmail: prev.customer_email,
        customerName: prev.customer_name,
        businessName: website.business_name,
        slug: website.slug,
        preferred_date: prev.preferred_date,
        preferred_time: prev.preferred_time,
        service_title: prev.service_title,
      });
    } catch (err) {
      console.error(
        "[updateBookingStatusAction] confirmation email failed",
        {
          message: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard", "layout");
  return ok(
    parsed.data.status === "confirmed" && prev.status !== "confirmed"
      ? "Termin bestätigt — Bestätigungs-E-Mail an Kund:in geschickt."
      : "Status aktualisiert.",
  );
}
