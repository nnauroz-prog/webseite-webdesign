"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  idleState,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { deleteStorageObjectByPublicUrl, uploadImage } from "@/lib/storage";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import {
  deleteGalleryImageSchema,
  galleryUploadSchema,
} from "@/lib/validations/gallery";

export const initialGalleryState: ActionState = idleState;

export async function uploadGalleryImageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = galleryUploadSchema.safeParse({
    alt_text: formData.get("alt_text"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return fail("Bitte wähle eine Bilddatei aus.");
  }

  const { supabase, user, website } = await requireCurrentWebsite();

  const result = await uploadImage({
    supabase,
    bucket: "gallery",
    file,
    userId: user.id,
    subPath: `${website.id}/gallery`,
  });
  if (!result.ok) return fail(result.message);

  const { error } = await supabase.from("gallery_images").insert({
    website_id: website.id,
    image_url: result.publicUrl,
    alt_text: parsed.data.alt_text ?? null,
    sort_order: 0,
  });
  if (error) {
    await deleteStorageObjectByPublicUrl(supabase, "gallery", result.publicUrl);
    return fail(error.message);
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Bild hochgeladen.");
}

export async function deleteGalleryImageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteGalleryImageSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültiges Bild.");

  const { supabase, website } = await requireCurrentWebsite();

  const { data: existing } = await supabase
    .from("gallery_images")
    .select("image_url")
    .eq("id", parsed.data.id)
    .eq("website_id", website.id)
    .maybeSingle();

  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  if (existing) {
    await deleteStorageObjectByPublicUrl(
      supabase,
      "gallery",
      (existing as { image_url: string | null }).image_url,
    );
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Bild gelöscht.");
}
