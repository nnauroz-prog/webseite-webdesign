import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const optional = (max: number, label = "Text") =>
  z.preprocess(
    emptyToUndef,
    z.string().trim().max(max, `${label}: max. ${max} Zeichen.`).optional(),
  );

/**
 * Project-type signals — what *kind* of website is needed. Stays
 * intentionally short. Optional add-ons live in
 * `INQUIRY_SPECIAL_FEATURES` below.
 */
export const INQUIRY_NEEDS = [
  "neue-website",
  "redesign",
  "onepager",
  "mehrseitig",
  "verwaltbare-inhalte",
  "speisekarte",
  "bewerbungsformular",
  "kontaktformular",
] as const;
export type InquiryNeed = (typeof INQUIRY_NEEDS)[number];

/**
 * Pricing tiers as published on the landing / pricing page. The
 * `unsicher` sentinel triggers a "we'll recommend the right tier"
 * helper note in the form.
 */
export const INQUIRY_PACKAGES = [
  "starter",
  "business",
  "premium",
  "unsicher",
] as const;
export type InquiryPackage = (typeof INQUIRY_PACKAGES)[number];

/**
 * Optional functional add-ons asked about after the package pick. Some
 * (Verwaltbare Inhalte, Speisekarte, Bewerbungsformular) overlap with
 * the `INQUIRY_NEEDS` list because customers often want to emphasise
 * an extra at scoping time.
 */
export const INQUIRY_SPECIAL_FEATURES = [
  "verwaltbare-inhalte",
  "speisekarte",
  "bewerbungsformular",
  "whatsapp-button",
  "google-maps",
  "online-reservierung",
  "mehrere-unterseiten",
  "seo-erweiterung",
  "mehrsprachigkeit",
  "unsicher",
] as const;
export type InquirySpecialFeature = (typeof INQUIRY_SPECIAL_FEATURES)[number];

export const INQUIRY_TIMEFRAMES = [
  "asap",
  "2-wochen",
  "1-monat",
  "spaeter",
  "offen",
] as const;

/**
 * Honeypot field "website_url": humans can't see it, bots will fill
 * it out, we silently accept-and-discard those submissions so the
 * spammer never knows we ignored them.
 */
export const submitInquirySchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen an.").max(120),
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse."),
  company: optional(120, "Firma"),
  industry: optional(60, "Branche"),
  phone: optional(40, "Telefon"),
  has_website: z.coerce.boolean(),
  current_website: optional(500, "URL"),
  needs: z
    .array(z.enum(INQUIRY_NEEDS))
    .max(INQUIRY_NEEDS.length)
    .default([]),
  selected_package: z.preprocess(
    emptyToUndef,
    z.enum(INQUIRY_PACKAGES).optional(),
  ),
  special_features: z
    .array(z.enum(INQUIRY_SPECIAL_FEATURES))
    .max(INQUIRY_SPECIAL_FEATURES.length)
    .default([]),
  timeframe: z.preprocess(
    emptyToUndef,
    z.enum(INQUIRY_TIMEFRAMES).optional(),
  ),
  message: optional(4000, "Nachricht"),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.literal(true)])
    .transform(() => true)
    .refine((v) => v === true, {
      message: "Bitte bestätige die Datenschutzerklärung.",
    }),
});
export type SubmitInquiryInput = z.infer<typeof submitInquirySchema>;

export const inquiryStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "won", "lost"]),
});
