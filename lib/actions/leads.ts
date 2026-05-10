"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { notifyNewLead } from "@/lib/email/notifications";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import { leadStatusSchema, submitLeadSchema } from "@/lib/validations/leads";


// ---------------------------------------------------------------------------
//  submitLeadAction (anonymous-callable from /site/[slug])
// ---------------------------------------------------------------------------
export async function submitLeadAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // Honeypot — bots fill in any visible-looking input. Humans ignore it.
  // We silently return success so bots don't learn what to avoid.
  if ((formData.get("website_url") ?? "").toString().trim() !== "") {
    return ok("Vielen Dank, wir melden uns zeitnah.");
  }

  const parsed = submitLeadSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const supabase = await createClient();
  const { data: site } = await supabase
    .from("websites")
    .select("id, slug, user_id, business_name, is_active, contact_form_enabled")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (!site) return fail("Website nicht gefunden.");
  // Defense in depth — RLS already enforces these, but a clearer error.
  const w = site as {
    id: string;
    slug: string;
    user_id: string;
    business_name: string;
    is_active: boolean;
    contact_form_enabled: boolean;
  };
  if (!w.is_active || !w.contact_form_enabled) {
    return fail("Das Kontaktformular ist aktuell nicht verfügbar.");
  }

  const { error } = await supabase.from("leads").insert({
    website_id: w.id,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    message: parsed.data.message,
  });

  if (error) {
    return fail(
      "Wir konnten deine Nachricht nicht zustellen. Bitte versuche es später erneut.",
    );
  }

  // Best-effort owner notification. We use the service-role client to fetch
  // the owner email since the anon client can't read auth.users.
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", w.user_id)
      .maybeSingle();
    const ownerEmail = (profile as { email: string | null } | null)?.email;
    if (ownerEmail) {
      await notifyNewLead({
        ownerEmail,
        businessName: w.business_name,
        slug: w.slug,
        lead: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone ?? null,
          message: parsed.data.message,
        },
      });
    }
  } catch (err) {
    console.error("[submitLeadAction] notification failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/leads");
  return ok("Vielen Dank — wir melden uns zeitnah.");
}

// ---------------------------------------------------------------------------
//  updateLeadStatusAction (owner-callable from dashboard)
// ---------------------------------------------------------------------------
export async function updateLeadStatusAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = leadStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return fail("Ungültiger Status.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard", "layout");
  return ok("Status aktualisiert.");
}
