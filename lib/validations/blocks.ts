import { z } from "zod";

/** Block type discriminator — must stay in sync with the DB CHECK. */
export const blockTypeSchema = z.enum([
  "faq",
  "testimonials",
  "opening_hours",
  "cta_banner",
]);
export type BlockType = z.infer<typeof blockTypeSchema>;

const trimNonEmpty = (max: number, label = "Feld") =>
  z
    .string()
    .trim()
    .min(1, `${label} darf nicht leer sein.`)
    .max(max, `Maximal ${max} Zeichen.`);

const trimOptional = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const faqDataSchema = z.object({
  title: trimOptional(120),
  items: z
    .array(
      z.object({
        question: trimNonEmpty(200, "Frage"),
        answer: trimNonEmpty(2000, "Antwort"),
      }),
    )
    .min(1, "Mindestens eine Frage erforderlich.")
    .max(20, "Maximal 20 Fragen pro Block."),
});

export const testimonialsDataSchema = z.object({
  title: trimOptional(120),
  items: z
    .array(
      z.object({
        name: trimNonEmpty(120, "Name"),
        role: trimOptional(120),
        quote: trimNonEmpty(800, "Zitat"),
      }),
    )
    .min(1, "Mindestens ein Zitat erforderlich.")
    .max(12, "Maximal 12 Zitate pro Block."),
});

export const openingHoursDataSchema = z.object({
  title: trimOptional(120),
  text: trimNonEmpty(2000, "Öffnungszeiten"),
});

export const ctaBannerDataSchema = z.object({
  headline: trimNonEmpty(160, "Überschrift"),
  subtitle: trimOptional(400),
  button_label: trimNonEmpty(60, "Button-Text"),
  button_href: z
    .string()
    .trim()
    .min(1, "Ziel-Link erforderlich.")
    .max(2000)
    .refine(
      (v) =>
        v.startsWith("/") ||
        v.startsWith("#") ||
        v.startsWith("mailto:") ||
        v.startsWith("tel:") ||
        /^https?:\/\//i.test(v),
      { message: "Link muss mit /, #, http(s):, mailto: oder tel: beginnen." },
    ),
});

/**
 * Validate a block's `data` payload by its declared `type`. The full
 * server actions layer this on top of a discriminated-union check.
 */
export function dataSchemaFor(type: BlockType) {
  switch (type) {
    case "faq":
      return faqDataSchema;
    case "testimonials":
      return testimonialsDataSchema;
    case "opening_hours":
      return openingHoursDataSchema;
    case "cta_banner":
      return ctaBannerDataSchema;
  }
}

/* ---------- input shapes for server actions ---------- */

export const addBlockSchema = z.object({
  page_id: z.string().uuid(),
  type: blockTypeSchema,
});

export const updateBlockSchema = z.object({
  id: z.string().uuid(),
  /** JSON-encoded payload. Parsed + revalidated server-side per type. */
  data: z.string().min(2).max(40000),
  is_published: z.coerce.boolean(),
});

export const deleteBlockSchema = z.object({
  id: z.string().uuid(),
});

export const reorderBlockSchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(["up", "down"]),
});
