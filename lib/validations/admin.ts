import { z } from "zod";

import { slugSchema } from "@/lib/validations/website";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const adminWebsiteIdSchema = z.object({
  website_id: z.string().uuid(),
});

export const adminWebsiteSlugSchema = z.object({
  website_id: z.string().uuid(),
  slug: slugSchema,
});

export const adminWebsitePublishSchema = z.object({
  website_id: z.string().uuid(),
  is_active: z.coerce.boolean(),
});

export const adminWebsiteTemplateSchema = z.object({
  website_id: z.string().uuid(),
  template_id: z.preprocess(emptyToUndef, z.string().uuid().optional()),
});

export const deleteByIdSchema = z.object({
  id: z.string().uuid(),
});

export const createTemplateSchema = z.object({
  name: z.string().trim().min(2, "Mindestens 2 Zeichen.").max(120),
  industry: z.string().trim().min(2).max(60),
  preview_image_url: z.preprocess(
    emptyToUndef,
    z.string().url("Muss eine gültige URL sein.").max(2000).optional(),
  ),
});

export const toggleTemplateSchema = z.object({
  id: z.string().uuid(),
  is_active: z.coerce.boolean(),
});
