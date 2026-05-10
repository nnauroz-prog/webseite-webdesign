"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  fail,
  flattenZodErrors,
  isUniqueViolation,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { deleteStorageObjectByPublicUrl, uploadImage } from "@/lib/storage";
import { requireCurrentWebsite, requireUser } from "@/lib/supabase/auth";
import {
  aboutSchema,
  createWebsiteSchema,
  formsToggleSchema,
  heroSchema,
  legalSchema,
  publishSchema,
  seoSchema,
  slugUpdateSchema,
  templateUpdateSchema,
  websiteMetaSchema,
} from "@/lib/validations/website";


// ---------------------------------------------------------------------------
//  createWebsiteAction (onboarding)
// ---------------------------------------------------------------------------
export async function createWebsiteAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createWebsiteSchema.safeParse({
    business_name: formData.get("business_name"),
    slug: formData.get("slug"),
    industry: formData.get("industry"),
    template_id: formData.get("template_id"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, user } = await requireUser();

  // Don't allow a second website to be created via this onboarding action.
  const { data: existing } = await supabase
    .from("websites")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing) return fail("Du hast bereits eine Website.");

  const { error } = await supabase.from("websites").insert({
    user_id: user.id,
    business_name: parsed.data.business_name,
    slug: parsed.data.slug,
    industry: parsed.data.industry ?? null,
    template_id: parsed.data.template_id ?? null,
  });

  if (error) {
    if (isUniqueViolation(error)) {
      return fail("Diese URL ist bereits vergeben.", {
        slug: "Bereits vergeben.",
      });
    }
    return fail(error.message);
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/website");
}

// ---------------------------------------------------------------------------
//  updateWebsiteMetaAction
// ---------------------------------------------------------------------------
export async function updateWebsiteMetaAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = websiteMetaSchema.safeParse({
    business_name: formData.get("business_name"),
    industry: formData.get("industry"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    opening_hours_text: formData.get("opening_hours_text"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();

  const opening = parsed.data.opening_hours_text?.trim()
    ? { text: parsed.data.opening_hours_text.trim() }
    : null;

  const { error } = await supabase
    .from("websites")
    .update({
      business_name: parsed.data.business_name,
      industry: parsed.data.industry ?? null,
      phone: parsed.data.phone ?? null,
      email: parsed.data.email ?? null,
      address: parsed.data.address ?? null,
      opening_hours: opening,
    })
    .eq("id", website.id);

  if (error) return fail(error.message);

  revalidatePath("/dashboard", "layout");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Stammdaten gespeichert.");
}

// ---------------------------------------------------------------------------
//  updateHeroAction
// ---------------------------------------------------------------------------
export async function updateHeroAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = heroSchema.safeParse({
    hero_title: formData.get("hero_title"),
    hero_subtitle: formData.get("hero_subtitle"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({
      hero_title: parsed.data.hero_title ?? null,
      hero_subtitle: parsed.data.hero_subtitle ?? null,
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Hero-Bereich gespeichert.");
}

// ---------------------------------------------------------------------------
//  updateAboutAction
// ---------------------------------------------------------------------------
export async function updateAboutAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = aboutSchema.safeParse({
    about_text: formData.get("about_text"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({ about_text: parsed.data.about_text ?? null })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Über-uns gespeichert.");
}

// ---------------------------------------------------------------------------
//  updateSeoAction
// ---------------------------------------------------------------------------
export async function updateSeoAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = seoSchema.safeParse({
    seo_title: formData.get("seo_title"),
    seo_description: formData.get("seo_description"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({
      seo_title: parsed.data.seo_title ?? null,
      seo_description: parsed.data.seo_description ?? null,
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("SEO gespeichert.");
}

// ---------------------------------------------------------------------------
//  updateLegalAction
// ---------------------------------------------------------------------------
export async function updateLegalAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = legalSchema.safeParse({
    imprint_text: formData.get("imprint_text"),
    privacy_text: formData.get("privacy_text"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({
      imprint_text: parsed.data.imprint_text ?? null,
      privacy_text: parsed.data.privacy_text ?? null,
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Impressum & Datenschutz gespeichert.");
}

// ---------------------------------------------------------------------------
//  updateFormsAction (toggle contact / application forms)
// ---------------------------------------------------------------------------
export async function updateFormsAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = formsToggleSchema.safeParse({
    contact_form_enabled: formData.get("contact_form_enabled") === "on",
    application_form_enabled: formData.get("application_form_enabled") === "on",
  });
  if (!parsed.success) {
    return fail("Ungültige Formulareinstellungen.");
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({
      contact_form_enabled: parsed.data.contact_form_enabled,
      application_form_enabled: parsed.data.application_form_enabled,
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Formular-Einstellungen gespeichert.");
}

// ---------------------------------------------------------------------------
//  updatePublishAction (activate / deactivate)
//
//  Going public requires an access-granting subscription status. Going back
//  to private is always allowed. If the user's payment fails or they cancel,
//  the DB trigger on `subscriptions` will deactivate them automatically;
//  this guard prevents re-publishing without billing in good standing.
// ---------------------------------------------------------------------------
export async function updatePublishAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = publishSchema.safeParse({
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) return fail("Ungültiger Wert.");

  const { supabase, user, website } = await requireCurrentWebsite();

  if (parsed.data.is_active) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    const status = (sub as { status: string | null } | null)?.status ?? null;
    if (!status || !["active", "trialing"].includes(status)) {
      return fail(
        "Bitte wähle zuerst ein Paket, um deine Website öffentlich zu schalten.",
      );
    }
  }

  const { error } = await supabase
    .from("websites")
    .update({ is_active: parsed.data.is_active })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  return ok(
    parsed.data.is_active
      ? "Website ist jetzt öffentlich."
      : "Website wurde auf privat gestellt.",
  );
}

// ---------------------------------------------------------------------------
//  updateSlugAction
// ---------------------------------------------------------------------------
export async function updateSlugAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = slugUpdateSchema.safeParse({ slug: formData.get("slug") });
  if (!parsed.success) {
    return fail("Bitte prüfe die URL.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  if (parsed.data.slug === website.slug) {
    return ok("URL unverändert.");
  }

  const { error } = await supabase
    .from("websites")
    .update({ slug: parsed.data.slug })
    .eq("id", website.id);
  if (error) {
    if (isUniqueViolation(error)) {
      return fail("Diese URL ist bereits vergeben.", {
        slug: "Bereits vergeben.",
      });
    }
    return fail(error.message);
  }

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath(`/site/${parsed.data.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  return ok("Neue URL gespeichert.");
}

// ---------------------------------------------------------------------------
//  uploadLogoAction
// ---------------------------------------------------------------------------
export async function uploadLogoAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return fail("Bitte wähle eine Bilddatei aus.");
  }

  const { supabase, user, website } = await requireCurrentWebsite();
  const previousLogo = website.logo_url;

  const result = await uploadImage({
    supabase,
    bucket: "logos",
    file,
    userId: user.id,
    subPath: `${website.id}/logo`,
  });
  if (!result.ok) return fail(result.message);

  const { error } = await supabase
    .from("websites")
    .update({ logo_url: result.publicUrl })
    .eq("id", website.id);
  if (error) {
    await deleteStorageObjectByPublicUrl(supabase, "logos", result.publicUrl);
    return fail(error.message);
  }

  await deleteStorageObjectByPublicUrl(supabase, "logos", previousLogo);

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  return ok("Logo aktualisiert.");
}

// ---------------------------------------------------------------------------
//  removeLogoAction
// ---------------------------------------------------------------------------
export async function removeLogoAction(): Promise<ActionState> {
  const { supabase, website } = await requireCurrentWebsite();
  const previous = website.logo_url;

  const { error } = await supabase
    .from("websites")
    .update({ logo_url: null })
    .eq("id", website.id);
  if (error) return fail(error.message);

  await deleteStorageObjectByPublicUrl(supabase, "logos", previous);

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  return ok("Logo entfernt.");
}

// ---------------------------------------------------------------------------
//  updateTemplateAction
// ---------------------------------------------------------------------------
export async function updateTemplateAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = templateUpdateSchema.safeParse({
    template_id: formData.get("template_id"),
  });
  if (!parsed.success) {
    return fail("Ungültiges Template.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({ template_id: parsed.data.template_id ?? null })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath("/dashboard/website");
  return ok("Template aktualisiert.");
}

