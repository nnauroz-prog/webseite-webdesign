import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const galleryUploadSchema = z.object({
  alt_text: z.preprocess(emptyToUndef, z.string().trim().max(200).optional()),
});

export const deleteGalleryImageSchema = z.object({
  id: z.string().uuid(),
});
