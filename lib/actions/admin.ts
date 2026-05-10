"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  isUniqueViolation,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  adminWebsitePublishSchema,
  adminWebsiteSlugSchema,
  adminWebsiteTemplateSchema,
  createTemplateSchema,
  deleteByIdSchema,
  toggleTemplateSchema,
} from "@/lib/validations/admin";


// ---------------------------------------------------------------------------
//  Helpers — RLS allows admin to update/delete across all owners. The
//  matching `is_admin()` check inside our policies makes these queries
//  succeed when run by an admin user.
// ---------------------------------------------------------------------------
async function revalidateWebsite(slug: string) {
  revalidatePath(`/site/${slug}`, "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/websites");
}

// ---------------------------------------------------------------------------
//  Websites
// ---------------------------------------------------------------------------

export async function adminUpdateWebsitePublishAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = adminWebsitePublishSchema.safeParse({
    website_id: formData.get("website_id"),
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) return fail("Ungültige Eingabe.");

  const { supabase } = await requireAdmin();
  const { data: site, error: e1 } = await supabase
    .from("websites")
    .update({ is_active: parsed.data.is_active })
    .eq("id", parsed.data.website_id)
    .select("slug")
    .maybeSingle();
  if (e1) return fail(e1.message);
  if (!site) return fail("Website nicht gefunden.");

  await revalidateWebsite((site as { slug: string }).slug);
  revalidatePath(`/admin/websites/${parsed.data.website_id}`);
  return ok(
    parsed.data.is_active
      ? "Website wurde öffentlich gestellt."
      : "Website wurde auf privat gestellt.",
  );
}

export async function adminUpdateWebsiteSlugAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = adminWebsiteSlugSchema.safeParse({
    website_id: formData.get("website_id"),
    slug: formData.get("slug"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe die URL.", flattenZodErrors(parsed.error));
  }

  const { supabase } = await requireAdmin();
  const { data: previous } = await supabase
    .from("websites")
    .select("slug")
    .eq("id", parsed.data.website_id)
    .maybeSingle();
  const previousSlug = (previous as { slug: string } | null)?.slug;

  const { error } = await supabase
    .from("websites")
    .update({ slug: parsed.data.slug })
    .eq("id", parsed.data.website_id);
  if (error) {
    if (isUniqueViolation(error)) {
      return fail("Diese URL ist bereits vergeben.", {
        slug: "Bereits vergeben.",
      });
    }
    return fail(error.message);
  }

  if (previousSlug) await revalidateWebsite(previousSlug);
  await revalidateWebsite(parsed.data.slug);
  revalidatePath(`/admin/websites/${parsed.data.website_id}`);
  return ok("Slug aktualisiert.");
}

export async function adminUpdateWebsiteTemplateAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = adminWebsiteTemplateSchema.safeParse({
    website_id: formData.get("website_id"),
    template_id: formData.get("template_id"),
  });
  if (!parsed.success) return fail("Ungültiges Template.");

  const { supabase } = await requireAdmin();
  const { data: site, error } = await supabase
    .from("websites")
    .update({ template_id: parsed.data.template_id ?? null })
    .eq("id", parsed.data.website_id)
    .select("slug")
    .maybeSingle();
  if (error) return fail(error.message);
  if (!site) return fail("Website nicht gefunden.");

  await revalidateWebsite((site as { slug: string }).slug);
  revalidatePath(`/admin/websites/${parsed.data.website_id}`);
  return ok("Template aktualisiert.");
}

// ---------------------------------------------------------------------------
//  Leads & Applications — admin delete (owner cannot delete; RLS allows
//  admins to clear data after retention review).
// ---------------------------------------------------------------------------

export async function adminDeleteLeadAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteByIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültige Anfrage.");

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", parsed.data.id);
  if (error) return fail(error.message);

  revalidatePath("/admin/leads");
  return ok("Anfrage gelöscht.");
}

export async function adminDeleteApplicationAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteByIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültige Bewerbung.");

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", parsed.data.id);
  if (error) return fail(error.message);

  revalidatePath("/admin/applications");
  return ok("Bewerbung gelöscht.");
}

// ---------------------------------------------------------------------------
//  Templates
// ---------------------------------------------------------------------------

export async function adminCreateTemplateAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createTemplateSchema.safeParse({
    name: formData.get("name"),
    industry: formData.get("industry"),
    preview_image_url: formData.get("preview_image_url"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe die Felder.", flattenZodErrors(parsed.error));
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("templates").insert({
    name: parsed.data.name,
    industry: parsed.data.industry.toLowerCase(),
    preview_image_url: parsed.data.preview_image_url ?? null,
    is_active: true,
  });
  if (error) {
    if (isUniqueViolation(error)) {
      return fail("Ein Template mit diesem Namen existiert bereits.", {
        name: "Bereits vergeben.",
      });
    }
    return fail(error.message);
  }

  revalidatePath("/admin/templates");
  return ok("Template angelegt.");
}

export async function adminToggleTemplateAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = toggleTemplateSchema.safeParse({
    id: formData.get("id"),
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) return fail("Ungültiger Wert.");

  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("templates")
    .update({ is_active: parsed.data.is_active })
    .eq("id", parsed.data.id);
  if (error) return fail(error.message);

  revalidatePath("/admin/templates");
  return ok(
    parsed.data.is_active ? "Template aktiviert." : "Template deaktiviert.",
  );
}

export async function adminDeleteTemplateAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteByIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültiges Template.");

  const { supabase } = await requireAdmin();
  // FK on websites.template_id is "on delete set null" (see schema.sql),
  // so this won't break customer sites — they fall back to the default theme.
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", parsed.data.id);
  if (error) return fail(error.message);

  revalidatePath("/admin/templates");
  return ok("Template gelöscht.");
}
