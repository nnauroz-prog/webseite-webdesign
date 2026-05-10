import { z } from "zod";

/** Block type discriminator — must stay in sync with the DB CHECK. */
export const blockTypeSchema = z.enum([
  "faq",
  "testimonials",
  "opening_hours",
  "cta_banner",
  "map",
  "video",
  "stats",
  "rich_text",
  "pricing_table",
  "steps",
  "image_text_split",
  "logo_cloud",
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

export const mapDataSchema = z.object({
  title: trimOptional(120),
  address: trimNonEmpty(400, "Adresse"),
});

export const videoDataSchema = z.object({
  title: trimOptional(120),
  url: z
    .string()
    .trim()
    .min(1, "URL erforderlich.")
    .max(2000)
    .refine((v) => /^https?:\/\//i.test(v), {
      message: "URL muss mit http(s):// beginnen.",
    })
    .refine(
      (v) =>
        /youtube\.com|youtu\.be|vimeo\.com/i.test(v),
      {
        message: "Nur YouTube oder Vimeo werden unterstützt.",
      },
    ),
  caption: trimOptional(400),
});

export const statsDataSchema = z.object({
  title: trimOptional(120),
  items: z
    .array(
      z.object({
        value: trimNonEmpty(40, "Zahl"),
        label: trimNonEmpty(120, "Beschreibung"),
      }),
    )
    .min(1, "Mindestens eine Kennzahl.")
    .max(8, "Maximal 8 Kennzahlen pro Block."),
});

export const richTextDataSchema = z.object({
  title: trimOptional(160),
  body: trimNonEmpty(8000, "Text"),
});

export const pricingTableDataSchema = z.object({
  title: trimOptional(120),
  items: z
    .array(
      z.object({
        name: trimNonEmpty(80, "Paket-Name"),
        price: trimNonEmpty(40, "Preis"),
        unit: trimOptional(40),
        description: trimOptional(280),
        features: z
          .array(z.string().trim().min(1).max(160))
          .max(10, "Maximal 10 Features pro Paket.")
          .optional(),
        highlight: z.coerce.boolean().optional(),
      }),
    )
    .min(1, "Mindestens ein Paket erforderlich.")
    .max(4, "Maximal 4 Pakete pro Tabelle."),
});

export const stepsDataSchema = z.object({
  title: trimOptional(120),
  items: z
    .array(
      z.object({
        title: trimNonEmpty(120, "Schritt-Titel"),
        body: trimNonEmpty(600, "Schritt-Beschreibung"),
      }),
    )
    .min(2, "Mindestens 2 Schritte.")
    .max(8, "Maximal 8 Schritte."),
});

export const imageTextSplitDataSchema = z.object({
  title: trimOptional(160),
  body: trimNonEmpty(2000, "Text"),
  image_url: z
    .string()
    .trim()
    .min(1, "Bild-URL erforderlich.")
    .max(2000)
    .refine((v) => /^https?:\/\//i.test(v), {
      message: "Bild-URL muss mit http(s):// beginnen.",
    }),
  image_side: z.enum(["left", "right"]).optional(),
});

export const logoCloudDataSchema = z.object({
  title: trimOptional(120),
  items: z
    .array(
      z.object({
        name: trimNonEmpty(80, "Name"),
        url: trimOptional(2000),
      }),
    )
    .min(2, "Mindestens 2 Einträge.")
    .max(16, "Maximal 16 Einträge."),
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
    case "map":
      return mapDataSchema;
    case "video":
      return videoDataSchema;
    case "stats":
      return statsDataSchema;
    case "rich_text":
      return richTextDataSchema;
    case "pricing_table":
      return pricingTableDataSchema;
    case "steps":
      return stepsDataSchema;
    case "image_text_split":
      return imageTextSplitDataSchema;
    case "logo_cloud":
      return logoCloudDataSchema;
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
