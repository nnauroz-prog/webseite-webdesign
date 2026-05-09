import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const createServiceSchema = z.object({
  title: z.string().trim().min(2, "Mindestens 2 Zeichen.").max(120),
  description: z.preprocess(
    emptyToUndef,
    z.string().trim().max(2000).optional(),
  ),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});
export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.extend({
  id: z.string().uuid(),
});

export const deleteServiceSchema = z.object({
  id: z.string().uuid(),
});
