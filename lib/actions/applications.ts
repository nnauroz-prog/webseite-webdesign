"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { notifyNewApplication } from "@/lib/email/notifications";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import {
  applicationStatusSchema,
  submitApplicationSchema,
} from "@/lib/validations/applications";


// ---------------------------------------------------------------------------
//  submitApplicationAction (anonymous-callable from /site/[slug])
// ---------------------------------------------------------------------------
export async function submitApplicationAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  if ((formData.get("website_url") ?? "").toString().trim() !== "") {
    return ok("Vielen Dank für deine Bewerbung.");
  }

  const parsed = submitApplicationSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    desired_position: formData.get("desired_position"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const supabase = await createClient();
  const { data: site } = await supabase
    .from("websites")
    .select("id, slug, user_id, business_name, is_active, application_form_enabled")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (!site) return fail("Website nicht gefunden.");
  const w = site as {
    id: string;
    slug: string;
    user_id: string;
    business_name: string;
    is_active: boolean;
    application_form_enabled: boolean;
  };
  if (!w.is_active || !w.application_form_enabled) {
    return fail("Das Bewerbungsformular ist aktuell nicht verfügbar.");
  }

  const { error } = await supabase.from("applications").insert({
    website_id: w.id,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    desired_position: parsed.data.desired_position ?? null,
    message: parsed.data.message,
  });

  if (error) {
    return fail(
      "Wir konnten deine Bewerbung nicht zustellen. Bitte versuche es später erneut.",
    );
  }

  // Best-effort owner notification — see leads.ts for the same pattern.
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", w.user_id)
      .maybeSingle();
    const ownerEmail = (profile as { email: string | null } | null)?.email;
    if (ownerEmail) {
      await notifyNewApplication({
        ownerEmail,
        businessName: w.business_name,
        slug: w.slug,
        application: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone ?? null,
          desired_position: parsed.data.desired_position ?? null,
          message: parsed.data.message,
        },
      });
    }
  } catch (err) {
    console.error("[submitApplicationAction] notification failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/applications");
  return ok("Vielen Dank — wir melden uns zeitnah.");
}

// ---------------------------------------------------------------------------
//  updateApplicationStatusAction (owner-callable from dashboard)
// ---------------------------------------------------------------------------
export async function updateApplicationStatusAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = applicationStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return fail("Ungültiger Status.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard", "layout");
  return ok("Status aktualisiert.");
}
