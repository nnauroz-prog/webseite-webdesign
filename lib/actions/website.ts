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
import { getDemoContent } from "@/lib/onboarding/demo-content";
import { deleteStorageObjectByPublicUrl, uploadImage } from "@/lib/storage";
import { requireCurrentWebsite, requireUser } from "@/lib/supabase/auth";
import { resolveTemplateKey } from "@/lib/templates";
import {
  aboutSchema,
  createWebsiteSchema,
  formsToggleSchema,
  heroSchema,
  integrationsSchema,
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

  // Resolve which industry template the user picked so we can seed the
  // matching demo content (services, team, hero copy, opening hours…).
  const templateKey = resolveTemplateKey(
    parsed.data.industry
      ? {
          id: "",
          name: "",
          industry: parsed.data.industry,
          preview_image_url: null,
          is_active: true,
          created_at: "",
        }
      : null,
  );
  const demo = getDemoContent(templateKey);

  const { data: created, error } = await supabase
    .from("websites")
    .insert({
      user_id: user.id,
      business_name: parsed.data.business_name,
      slug: parsed.data.slug,
      industry: parsed.data.industry ?? null,
      template_id: parsed.data.template_id ?? null,
      hero_title: demo.hero_title,
      hero_subtitle: demo.hero_subtitle,
      about_text: demo.about_text,
      opening_hours: { text: demo.opening_hours_text },
      imprint_text: demo.imprint_placeholder,
      privacy_text: demo.privacy_placeholder,
      contact_form_enabled: true,
    })
    .select("id")
    .maybeSingle();

  if (error || !created) {
    if (error && isUniqueViolation(error)) {
      return fail("Diese URL ist bereits vergeben.", {
        slug: "Bereits vergeben.",
      });
    }
    return fail(error?.message ?? "Website konnte nicht angelegt werden.");
  }

  const websiteId = (created as { id: string }).id;

  // Seed services + team in best-effort fashion. Errors here don't roll
  // back the website — the user can re-seed from the dashboard.
  if (demo.services.length > 0) {
    await supabase.from("services").insert(
      demo.services.map((s, i) => ({
        website_id: websiteId,
        title: s.title,
        description: s.description,
        sort_order: i,
      })),
    );
  }
  if (demo.team.length > 0) {
    await supabase.from("team_members").insert(
      demo.team.map((t, i) => ({
        website_id: websiteId,
        name: t.name,
        role: t.role,
        bio: t.bio,
        sort_order: i,
      })),
    );
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/website");
}

// ---------------------------------------------------------------------------
//  seedDemoContentAction
//  Owner-callable: re-applies the demo content for the website's industry
//  to fields that are still empty. Doesn't overwrite custom data the user
//  already entered.
// ---------------------------------------------------------------------------
export async function seedDemoContentAction(): Promise<ActionState> {
  const { supabase, website } = await requireCurrentWebsite();
  const templateKey = resolveTemplateKey(
    website.industry
      ? {
          id: "",
          name: "",
          industry: website.industry,
          preview_image_url: null,
          is_active: true,
          created_at: "",
        }
      : null,
  );
  const demo = getDemoContent(templateKey);

  // Only fill empty fields on the website itself.
  const patch: Record<string, unknown> = {};
  if (!website.hero_title?.trim()) patch.hero_title = demo.hero_title;
  if (!website.hero_subtitle?.trim()) patch.hero_subtitle = demo.hero_subtitle;
  if (!website.about_text?.trim()) patch.about_text = demo.about_text;
  if (!website.opening_hours?.text?.trim())
    patch.opening_hours = { text: demo.opening_hours_text };
  if (!website.imprint_text?.trim())
    patch.imprint_text = demo.imprint_placeholder;
  if (!website.privacy_text?.trim())
    patch.privacy_text = demo.privacy_placeholder;

  if (Object.keys(patch).length > 0) {
    await supabase.from("websites").update(patch).eq("id", website.id);
  }

  // Only insert services/team if the lists are currently empty —
  // we never want to duplicate the user's own entries.
  const [{ count: serviceCount }, { count: teamCount }] = await Promise.all([
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id),
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id),
  ]);

  if ((serviceCount ?? 0) === 0 && demo.services.length > 0) {
    await supabase.from("services").insert(
      demo.services.map((s, i) => ({
        website_id: website.id,
        title: s.title,
        description: s.description,
        sort_order: i,
      })),
    );
  }
  if ((teamCount ?? 0) === 0 && demo.team.length > 0) {
    await supabase.from("team_members").insert(
      demo.team.map((t, i) => ({
        website_id: website.id,
        name: t.name,
        role: t.role,
        bio: t.bio,
        sort_order: i,
      })),
    );
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Demo-Inhalte eingefügt.");
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
//  updateIntegrationsAction (Google Search Console, Bing, GA4)
// ---------------------------------------------------------------------------
export async function updateIntegrationsAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = integrationsSchema.safeParse({
    seo_google_site_verification: formData.get("seo_google_site_verification"),
    seo_bing_site_verification: formData.get("seo_bing_site_verification"),
    analytics_ga4_id: formData.get("analytics_ga4_id"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const empty = (s: string | undefined) =>
    s && s.length > 0 ? s : null;

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({
      seo_google_site_verification: empty(parsed.data.seo_google_site_verification),
      seo_bing_site_verification: empty(parsed.data.seo_bing_site_verification),
      analytics_ga4_id: empty(parsed.data.analytics_ga4_id),
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Suchmaschinen-Integrationen gespeichert.");
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
//  Hero & About images — same upload pattern as the logo. We re-use the
//  existing `gallery` bucket so the storage policies already cover it.
// ---------------------------------------------------------------------------
async function uploadSiteImage(
  field: "hero_image_url" | "about_image_url",
  formField: string,
  formData: FormData,
  successMessage: string,
): Promise<ActionState> {
  const file = formData.get(formField);
  if (!(file instanceof File) || file.size === 0) {
    return fail("Bitte wähle eine Bilddatei aus.");
  }

  const { supabase, user, website } = await requireCurrentWebsite();
  const previous = (website as unknown as Record<string, string | null>)[field];

  const result = await uploadImage({
    supabase,
    bucket: "gallery",
    file,
    userId: user.id,
    subPath: `${website.id}/${formField}`,
  });
  if (!result.ok) return fail(result.message);

  const { error } = await supabase
    .from("websites")
    .update({ [field]: result.publicUrl })
    .eq("id", website.id);
  if (error) {
    await deleteStorageObjectByPublicUrl(supabase, "gallery", result.publicUrl);
    return fail(error.message);
  }

  await deleteStorageObjectByPublicUrl(supabase, "gallery", previous);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok(successMessage);
}

async function removeSiteImage(
  field: "hero_image_url" | "about_image_url",
  successMessage: string,
): Promise<ActionState> {
  const { supabase, website } = await requireCurrentWebsite();
  const previous = (website as unknown as Record<string, string | null>)[field];

  const { error } = await supabase
    .from("websites")
    .update({ [field]: null })
    .eq("id", website.id);
  if (error) return fail(error.message);

  await deleteStorageObjectByPublicUrl(supabase, "gallery", previous);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok(successMessage);
}

export async function uploadHeroImageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  return uploadSiteImage(
    "hero_image_url",
    "hero_image",
    formData,
    "Hero-Bild aktualisiert.",
  );
}

export async function removeHeroImageAction(): Promise<ActionState> {
  return removeSiteImage("hero_image_url", "Hero-Bild entfernt.");
}

export async function uploadAboutImageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  return uploadSiteImage(
    "about_image_url",
    "about_image",
    formData,
    "Über-uns-Bild aktualisiert.",
  );
}

export async function removeAboutImageAction(): Promise<ActionState> {
  return removeSiteImage("about_image_url", "Über-uns-Bild entfernt.");
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

