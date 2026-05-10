"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { notifyNewInquiry } from "@/lib/email/notifications";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  inquiryStatusSchema,
  submitInquirySchema,
} from "@/lib/validations/inquiries";

/** Configurable via env. Falls back to a placeholder so dev still works. */
function getInquiryRecipient(): string {
  return process.env.SITALO_INQUIRY_TO ?? "hallo@sitalo.de";
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
    });
    return fail(
      "Wir konnten deine Anfrage gerade nicht speichern. Bitte versuche es später erneut oder schreib uns direkt per WhatsApp.",
    );
  }

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

  revalidatePath("/admin/inquiries");
  return ok("Danke für deine Anfrage. Wir melden uns innerhalb von 24 Stunden.");
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
