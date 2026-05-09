import { z } from "zod";

/** Empty string -> undefined, then trim. */
const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const optionalString = (max: number, label = "Text") =>
  z.preprocess(
    emptyToUndef,
    z.string().trim().max(max, `${label}: max. ${max} Zeichen.`).optional(),
  );

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Mindestens 3 Zeichen.")
  .max(63, "Maximal 63 Zeichen.")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    "Nur Kleinbuchstaben, Zahlen und Bindestriche.",
  );

export const createWebsiteSchema = z.object({
  business_name: z
    .string()
    .trim()
    .min(2, "Mindestens 2 Zeichen.")
    .max(120, "Maximal 120 Zeichen."),
  slug: slugSchema,
  industry: optionalString(60, "Branche"),
  template_id: z.preprocess(emptyToUndef, z.string().uuid().optional()),
});
export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;

export const websiteMetaSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  industry: optionalString(60, "Branche"),
  phone: optionalString(40, "Telefon"),
  email: z.preprocess(
    emptyToUndef,
    z.string().email("Ungültige E-Mail-Adresse.").optional(),
  ),
  address: optionalString(500, "Adresse"),
  opening_hours_text: optionalString(500, "Öffnungszeiten"),
});
export type WebsiteMetaInput = z.infer<typeof websiteMetaSchema>;

export const heroSchema = z.object({
  hero_title: optionalString(120, "Hero-Überschrift"),
  hero_subtitle: optionalString(300, "Hero-Untertext"),
});

export const aboutSchema = z.object({
  about_text: optionalString(4000, "Über-uns-Text"),
});

export const seoSchema = z.object({
  seo_title: optionalString(70, "SEO-Titel"),
  seo_description: optionalString(180, "SEO-Beschreibung"),
});

export const legalSchema = z.object({
  imprint_text: optionalString(8000, "Impressum"),
  privacy_text: optionalString(12000, "Datenschutz"),
});

export const formsToggleSchema = z.object({
  contact_form_enabled: z.coerce.boolean(),
  application_form_enabled: z.coerce.boolean(),
});

export const publishSchema = z.object({
  is_active: z.coerce.boolean(),
});

export const slugUpdateSchema = z.object({
  slug: slugSchema,
});
