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
import { setActiveWebsiteId } from "@/lib/active-website";
import { getCurrentPlan } from "@/lib/billing/current-plan";
import { ensureTrialSubscription } from "@/lib/billing/start-trial";
import { getSiteLimit } from "@/lib/stripe/plans";
import { resolveTemplateKey } from "@/lib/templates";
import {
  isVercelConfigured,
  vercelAddDomain,
  vercelGetDomainConfig,
  vercelRemoveDomain,
} from "@/lib/vercel/client";
import {
  aboutSchema,
  createWebsiteSchema,
  bannerSchema,
  brandColorSchema,
  customDomainSchema,
  formsToggleSchema,
  heroSchema,
  integrationsSchema,
  legalSchema,
  publishSchema,
  seoSchema,
  slugUpdateSchema,
  templateUpdateSchema,
  websiteMetaSchema,
  whatsappSchema,
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

  // Multi-site is gated by plan: Basic/Pro/Trial = 1 site, Premium = up
  // to 10. We only block AFTER the user already owns sites — the very
  // first website is always free so onboarding works without a paid
  // subscription.
  const { count: existingCount } = await supabase
    .from("websites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((existingCount ?? 0) > 0) {
    const plan = await getCurrentPlan(user.id);
    const limit = getSiteLimit(plan);
    if ((existingCount ?? 0) >= limit) {
      return fail(
        plan === "premium"
          ? `Du hast das Maximum von ${limit} Websites erreicht. Schreib uns wenn du mehr brauchst.`
          : "Mehrere Websites sind ein Premium-Feature. Bitte upgrade auf Premium, um weitere Sites anzulegen.",
      );
    }
  }

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

  // Make the new website the active one so the dashboard reflects it
  // immediately after the redirect.
  await setActiveWebsiteId(websiteId);

  // Auto-publish: start a 7-day trial (idempotent — no-op if the user
  // already has a subscription row) and flip the website live. Without
  // this step, customers wonder why their applicants get "nicht
  // verfügbar" until they hunt for the publish toggle.
  //
  // Best-effort: if the trial start or the publish flip fails, we keep
  // the website in private mode so the user can still publish manually
  // later. Onboarding doesn't roll back.
  try {
    const trial = await ensureTrialSubscription(user.id);
    if (trial.ok) {
      await supabase
        .from("websites")
        .update({ is_active: true })
        .eq("id", websiteId);
    }
  } catch (err) {
    console.error("[createWebsiteAction] auto-publish failed", {
      message: err instanceof Error ? err.message : String(err),
      website_id: websiteId,
    });
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/website");
}

// ---------------------------------------------------------------------------
//  switchActiveWebsiteAction (multi-site site switcher)
// ---------------------------------------------------------------------------
export async function switchActiveWebsiteAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("website_id");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    return fail("Ungültige Website-ID.");
  }

  const { supabase, user } = await requireUser();

  // Make sure the user actually owns the target website before we
  // hand out a cookie pointing at it.
  const { data } = await supabase
    .from("websites")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return fail("Website nicht gefunden.");

  await setActiveWebsiteId(id);
  revalidatePath("/dashboard", "layout");
  return ok("Website gewechselt.");
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
    booking_form_enabled: formData.get("booking_form_enabled") === "on",
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
      booking_form_enabled: parsed.data.booking_form_enabled,
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
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();
    const row = sub as
      | {
          status: string | null;
          current_period_end: string | null;
        }
      | null;
    const status = row?.status ?? null;
    const periodEnd = row?.current_period_end
      ? new Date(row.current_period_end).getTime()
      : null;
    const trialStillValid =
      periodEnd === null || periodEnd > Date.now();

    const eligible =
      status &&
      ["active", "trialing"].includes(status) &&
      trialStillValid;

    if (!eligible) {
      // First-publish path: no row yet → start a 7-day trial without
      // requiring payment. Same helper used by createWebsiteAction's
      // auto-publish path.
      if (!row) {
        const trial = await ensureTrialSubscription(user.id);
        if (!trial.ok) {
          return fail(
            "Wir konnten den Probezeitraum nicht starten. Bitte versuche es erneut.",
          );
        }
      } else {
        // Row exists but is expired or in a non-active state — must add
        // a payment method to revive.
        return fail(
          "Dein Probezeitraum ist abgelaufen. Bitte hinterlege eine Zahlungsmethode, um deine Website wieder zu veröffentlichen.",
        );
      }
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
//
//  Wrapped in a try/catch so any unexpected throw (storage outage, schema
//  drift, missing bucket, …) returns a friendly fail() instead of bubbling
//  up to the global Next.js error boundary. The original error is logged
//  to Vercel Runtime Logs for debugging.
// ---------------------------------------------------------------------------
export async function uploadLogoAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  try {
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
      await deleteStorageObjectByPublicUrl(
        supabase,
        "logos",
        result.publicUrl,
      );
      return fail(error.message);
    }

    await deleteStorageObjectByPublicUrl(supabase, "logos", previousLogo);

    revalidatePath(`/site/${website.slug}`, "layout");
    revalidatePath("/dashboard", "layout");
    return ok("Logo aktualisiert.");
  } catch (err) {
    console.error("[uploadLogoAction] thrown", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return fail(
      err instanceof Error
        ? `Logo-Upload fehlgeschlagen: ${err.message}`
        : "Logo-Upload gerade nicht möglich.",
    );
  }
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
  try {
    const file = formData.get(formField);
    if (!(file instanceof File) || file.size === 0) {
      return fail("Bitte wähle eine Bilddatei aus.");
    }

    const { supabase, user, website } = await requireCurrentWebsite();
    const previous = (
      website as unknown as Record<string, string | null>
    )[field];

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
      await deleteStorageObjectByPublicUrl(
        supabase,
        "gallery",
        result.publicUrl,
      );
      return fail(error.message);
    }

    await deleteStorageObjectByPublicUrl(supabase, "gallery", previous);

    revalidatePath(`/site/${website.slug}`, "layout");
    return ok(successMessage);
  } catch (err) {
    console.error(`[uploadSiteImage:${field}] thrown`, {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return fail(
      err instanceof Error
        ? `Upload fehlgeschlagen: ${err.message}`
        : "Upload gerade nicht möglich.",
    );
  }
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
//  Brand color override
// ---------------------------------------------------------------------------
export async function updateBrandColorAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = brandColorSchema.safeParse({
    brand_primary_color: formData.get("brand_primary_color"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe die Farbe.", flattenZodErrors(parsed.error));
  }

  const value = parsed.data.brand_primary_color;
  const next = value && value.length > 0 ? value : null;

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("websites")
    .update({ brand_primary_color: next })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok(next ? "Farbe gespeichert." : "Auf Template-Farbe zurückgesetzt.");
}

// ---------------------------------------------------------------------------
//  WhatsApp floating button
// ---------------------------------------------------------------------------
export async function updateWhatsappAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = whatsappSchema.safeParse({
    whatsapp_number: formData.get("whatsapp_number"),
    whatsapp_message: formData.get("whatsapp_message"),
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
      whatsapp_number: empty(parsed.data.whatsapp_number),
      whatsapp_message: empty(parsed.data.whatsapp_message),
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("WhatsApp gespeichert.");
}

// ---------------------------------------------------------------------------
//  Sticky promo banner
// ---------------------------------------------------------------------------
export async function updateBannerAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = bannerSchema.safeParse({
    banner_text: formData.get("banner_text"),
    banner_link: formData.get("banner_link"),
    banner_enabled: formData.get("banner_enabled") === "on",
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
      banner_text: empty(parsed.data.banner_text),
      banner_link: empty(parsed.data.banner_link),
      banner_enabled: parsed.data.banner_enabled,
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Banner gespeichert.");
}

// ---------------------------------------------------------------------------
//  Custom domain actions
//
//  When VERCEL_API_TOKEN + VERCEL_PROJECT_ID are configured, save/remove
//  also call the Vercel REST API so the domain is attached/detached
//  automatically — no operator intervention needed. Without those env
//  vars we fall back to the manual workflow (operator adds the domain
//  in Vercel UI + sets verified_at directly in Supabase).
// ---------------------------------------------------------------------------
export async function setCustomDomainAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = customDomainSchema.safeParse({
    custom_domain: formData.get("custom_domain"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe die Domain.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();

  // Saving the same domain again is a no-op — keep verified_at.
  if (parsed.data.custom_domain === website.custom_domain) {
    return ok("Domain unverändert.");
  }

  // If a previous domain was set, detach it from Vercel best-effort.
  if (website.custom_domain) {
    const removed = await vercelRemoveDomain(website.custom_domain);
    if (!removed.ok && removed.configured) {
      console.warn("[setCustomDomainAction] vercel detach failed", {
        domain: website.custom_domain,
        message: removed.message,
      });
    }
  }

  // Attach the new domain to Vercel BEFORE saving — if Vercel rejects
  // (already used by another project, invalid format, …) we want the
  // user to fix it before the DB row diverges from reality.
  const attached = await vercelAddDomain(parsed.data.custom_domain);
  if (!attached.ok && attached.configured) {
    return fail(`Vercel-Anbindung fehlgeschlagen: ${attached.message}`);
  }

  const { error } = await supabase
    .from("websites")
    .update({
      custom_domain: parsed.data.custom_domain,
      // Reset verification on every change — DNS may need to be redone.
      custom_domain_verified_at: null,
    })
    .eq("id", website.id);

  if (error) {
    if (
      error.code === "23505" ||
      /duplicate key|unique/i.test(error.message)
    ) {
      return fail("Diese Domain wird bereits von einer anderen Site genutzt.");
    }
    return fail(error.message);
  }

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  return ok(
    attached.ok && attached.configured
      ? "Domain gespeichert + bei Vercel angebunden. Sobald DNS steht, wird automatisch verifiziert."
      : "Domain gespeichert. Bitte DNS einrichten.",
  );
}

export async function removeCustomDomainAction(): Promise<ActionState> {
  const { supabase, website } = await requireCurrentWebsite();

  // Detach from Vercel best-effort first.
  if (website.custom_domain) {
    const removed = await vercelRemoveDomain(website.custom_domain);
    if (!removed.ok && removed.configured) {
      console.warn("[removeCustomDomainAction] vercel detach failed", {
        domain: website.custom_domain,
        message: removed.message,
      });
    }
  }

  const { error } = await supabase
    .from("websites")
    .update({
      custom_domain: null,
      custom_domain_verified_at: null,
    })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  return ok("Domain entfernt.");
}

/**
 * Manually re-check the Vercel-verification state of the customer's
 * domain. Polls vercelGetDomainConfig — when Vercel reports the
 * domain is no longer misconfigured (DNS resolves), we set
 * custom_domain_verified_at = now() so the proxy starts serving
 * the customer's site at their domain.
 *
 * Returns useful state via the message string so the UI can show
 * progress without us inventing a new ActionState shape.
 */
export async function verifyCustomDomainAction(): Promise<ActionState> {
  const { supabase, website } = await requireCurrentWebsite();
  if (!website.custom_domain) {
    return fail("Keine Domain hinterlegt.");
  }
  if (!isVercelConfigured()) {
    return fail(
      "Vercel-API ist nicht konfiguriert — verifiziere die Domain manuell oder setze VERCEL_API_TOKEN + VERCEL_PROJECT_ID.",
    );
  }

  const config = await vercelGetDomainConfig(website.custom_domain);
  if (!config.ok) {
    return fail(config.message);
  }
  const isReady = config.data.misconfigured === false;

  if (!isReady) {
    return fail(
      "DNS zeigt noch nicht auf Vercel. Bitte Einträge prüfen — kann bis zu 48 Stunden dauern.",
    );
  }

  // Already verified? Just confirm.
  if (website.custom_domain_verified_at) {
    return ok("Domain bereits verifiziert.");
  }

  const { error } = await supabase
    .from("websites")
    .update({ custom_domain_verified_at: new Date().toISOString() })
    .eq("id", website.id);
  if (error) return fail(error.message);

  revalidatePath(`/site/${website.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  return ok("Domain verifiziert — deine Site ist jetzt unter dieser Adresse erreichbar.");
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

