"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import {
  notifyInquiryReceived,
  notifyNewInquiry,
} from "@/lib/email/notifications";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  inquiryStatusSchema,
  submitInquirySchema,
} from "@/lib/validations/inquiries";

/** Configurable via env. Falls back to a placeholder so dev still
 * works. `LEAD_NOTIFICATION_EMAIL` is the new name; `SITALO_INQUIRY_TO`
 * stays supported for the duration of the current Vercel deploy so
 * nothing breaks if only one of the two is configured. */
function getInquiryRecipient(): string {
  return (
    process.env.LEAD_NOTIFICATION_EMAIL ??
    process.env.SITALO_INQUIRY_TO ??
    "hallo@sitalo.de"
  );
}

/**
 * Anonymous-callable. Captures a project inquiry from the public
 * /anfrage form and emails the Sitalo team. Honeypot field
 * `website_url` silently absorbs bot submissions.
 */
export async function submitInquiryAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // Honeypot — bots fill the hidden field, humans don't.
  if ((formData.get("website_url") ?? "").toString().trim() !== "") {
    return ok("Vielen Dank für deine Anfrage.");
  }

  const parsed = submitInquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    industry: formData.get("industry"),
    phone: formData.get("phone"),
    has_website: formData.get("has_website") === "ja",
    current_website: formData.get("current_website"),
    needs: formData.getAll("needs"),
    selected_package: formData.get("selected_package"),
    special_features: formData.getAll("special_features"),
    timeframe: formData.get("timeframe"),
    message: formData.get("message"),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const data = parsed.data;
  const supabase = await createClient();

  // Structured log so the entry is grep-able in Vercel Runtime Logs.
  // Helps confirm the action even ran when "no mail arrived" reports
  // come in — if you see no [submitInquiryAction] line at all, the
  // request never reached the server.
  console.log("[submitInquiryAction] received", {
    email: data.email,
    selected_package: data.selected_package ?? null,
  });

  const { error } = await supabase.from("inquiries").insert({
    name: data.name,
    email: data.email,
    company: data.company ?? null,
    industry: data.industry ?? null,
    phone: data.phone ?? null,
    has_website: data.has_website,
    current_website: data.current_website ?? null,
    needs: data.needs,
    selected_package: data.selected_package ?? null,
    special_features: data.special_features,
    timeframe: data.timeframe ?? null,
    message: data.message ?? null,
  });

  if (error) {
    console.error("[submitInquiryAction] insert failed", {
      message: error.message,
      code: (error as { code?: string }).code,
    });
    return fail(
      "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt per WhatsApp.",
    );
  }
  console.log("[submitInquiryAction] inserted into inquiries");

  // Best-effort email — never blocks the success response.
  try {
    await notifyNewInquiry({
      toEmail: getInquiryRecipient(),
      inquiry: {
        name: data.name,
        email: data.email,
        company: data.company ?? null,
        industry: data.industry ?? null,
        phone: data.phone ?? null,
        has_website: data.has_website,
        current_website: data.current_website ?? null,
        needs: data.needs,
        selected_package: data.selected_package ?? null,
        special_features: data.special_features,
        timeframe: data.timeframe ?? null,
        message: data.message ?? null,
      },
    });
  } catch (err) {
    console.error("[submitInquiryAction] notification failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Best-effort customer-confirmation. Same fail-soft semantics —
  // a missing/failed receipt mail never blocks the success response.
  try {
    await notifyInquiryReceived({
      toEmail: data.email,
      name: data.name,
    });
  } catch (err) {
    console.error("[submitInquiryAction] customer receipt failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  revalidatePath("/admin/inquiries");
  return ok(
    "Danke für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns zeitnah.",
  );
}

/** Admin-only — flip status from the admin inquiries list. */
export async function updateInquiryStatusAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = inquiryStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return fail("Ungültiger Status.", flattenZodErrors(parsed.error));
  }

  await requireAdmin();
  // Use service-role client so the update works even if RLS evolves.
  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from("inquiries") as any)
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  if (error) return fail(error.message);

  revalidatePath("/admin/inquiries");
  return ok("Status aktualisiert.");
}
