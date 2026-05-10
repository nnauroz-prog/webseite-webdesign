import { z } from "zod";

/** Slugs reserved for built-in routes — same set the DB CHECK enforces. */
const RESERVED_SLUGS = new Set([
  "imprint",
  "privacy",
  "site",
  "admin",
  "api",
  "dashboard",
]);

export const pageSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "URL-Kürzel zu kurz.")
  .max(63, "URL-Kürzel zu lang.")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    "Nur Kleinbuchstaben, Zahlen und Bindestriche.",
  )
  .refine((s) => !RESERVED_SLUGS.has(s), {
    message: "Dieses URL-Kürzel ist reserviert.",
  });

export const createPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titel ist Pflicht.")
    .max(120, "Maximal 120 Zeichen."),
  slug: pageSlugSchema,
  body: z.string().max(40000, "Maximal 40.000 Zeichen.").optional(),
});

export const updatePageSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .trim()
    .min(1, "Titel ist Pflicht.")
    .max(120, "Maximal 120 Zeichen."),
  slug: pageSlugSchema,
  body: z.string().max(40000, "Maximal 40.000 Zeichen.").optional(),
  is_published: z.coerce.boolean(),
  show_in_nav: z.coerce.boolean(),
});

export const deletePageSchema = z.object({
  id: z.string().uuid(),
});
