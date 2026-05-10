import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const optional = (max: number, label = "Text") =>
  z.preprocess(
    emptyToUndef,
    z.string().trim().max(max, `${label}: max. ${max} Zeichen.`).optional(),
  );

/**
 * What the customer can request via the /anfrage form. Free-text
 * tags rather than an enum so we can extend without a migration.
 */
export const INQUIRY_NEEDS = [
  "neue-website",
  "redesign",
  "onepager",
  "mehrseitig",
  "kundenbereich",
  "speisekarte",
  "bewerbungsformular",
  "kontaktformular",
] as const;
export type InquiryNeed = (typeof INQUIRY_NEEDS)[number];

export const INQUIRY_TIMEFRAMES = [
  "asap",
  "2-wochen",
  "1-monat",
  "spaeter",
  "offen",
] as const;

export const INQUIRY_BUDGETS = [
  "unter-1000",
  "1000-2000",
  "2000-5000",
  "ueber-5000",
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
  timeframe: z.preprocess(
    emptyToUndef,
    z.enum(INQUIRY_TIMEFRAMES).optional(),
  ),
  budget: z.preprocess(emptyToUndef, z.enum(INQUIRY_BUDGETS).optional()),
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
