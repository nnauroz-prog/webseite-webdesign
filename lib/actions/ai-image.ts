"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import {
  defaultPromptFor,
  generateImage,
  type ImageKind,
} from "@/lib/ai-images";
import { deleteStorageObjectByPublicUrl } from "@/lib/storage";
import { requireCurrentWebsite } from "@/lib/supabase/auth";

const VALID_KINDS: readonly ImageKind[] = ["logo", "hero", "about", "gallery"];

function bucketFor(kind: ImageKind): "logos" | "gallery" {
  // Logos go into the logos bucket. Hero/about/gallery share the
  // gallery bucket — same RLS, same path convention.
  return kind === "logo" ? "logos" : "gallery";
}

function fieldFor(
  kind: ImageKind,
): "logo_url" | "hero_image_url" | "about_image_url" | null {
  switch (kind) {
    case "logo":
      return "logo_url";
    case "hero":
      return "hero_image_url";
    case "about":
      return "about_image_url";
    case "gallery":
      // Gallery doesn't update a single field — caller inserts a row
      // into gallery_images instead. Returning null signals that.
      return null;
  }
}

function subPathFor(kind: ImageKind, websiteId: string): string {
  switch (kind) {
    case "logo":
      return `${websiteId}/logo-ai`;
    case "hero":
      return `${websiteId}/hero_image-ai`;
    case "about":
      return `${websiteId}/about_image-ai`;
    case "gallery":
      return `${websiteId}/gallery-ai`;
  }
}

/**
 * Generate an AI image, upload it to Supabase storage, attach it to
 * the right field on the websites row (or insert a gallery row).
 *
 * This is wrapped in try/catch so any unexpected failure surfaces as
 * a friendly fail() in the form, never the global error boundary.
 */
export async function generateAiImageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  try {
    const kindRaw = formData.get("kind");
    const kind = VALID_KINDS.find((k) => k === kindRaw);
    if (!kind) return fail("Ungültiger Bild-Typ.");

    const userPrompt = (formData.get("prompt") ?? "").toString().trim();

    const { supabase, user, website } = await requireCurrentWebsite();

    const prompt =
      userPrompt.length > 0
        ? userPrompt
        : defaultPromptFor(kind, website.industry, website.business_name);

    const result = await generateImage(prompt);
    if (!result.ok) return fail(result.message);

    const bucket = bucketFor(kind);
    const ext = result.image.mimeType.includes("jpeg") ? "jpg" : "png";
    const id = crypto.randomUUID();
    const path = `${user.id}/${subPathFor(kind, website.id)}/${id}.${ext}`;

    // Use the Supabase storage SDK directly — uploadImage() takes a
    // browser File object; we have a Buffer here.
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, result.image.bytes, {
        cacheControl: "3600",
        upsert: false,
        contentType: result.image.mimeType,
      });
    if (uploadError) return fail(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    const field = fieldFor(kind);
    if (field) {
      const previous = (
        website as unknown as Record<string, string | null>
      )[field];
      const { error: updateError } = await supabase
        .from("websites")
        .update({ [field]: publicUrl })
        .eq("id", website.id);
      if (updateError) {
        await deleteStorageObjectByPublicUrl(supabase, bucket, publicUrl);
        return fail(updateError.message);
      }
      // Best-effort cleanup of the previous image — same pattern as the
      // manual upload action.
      await deleteStorageObjectByPublicUrl(supabase, bucket, previous);
    } else {
      // Gallery: insert a new row.
      const { error: insertError } = await supabase
        .from("gallery_images")
        .insert({
          website_id: website.id,
          image_url: publicUrl,
          alt_text: null,
          sort_order: 0,
        });
      if (insertError) {
        await deleteStorageObjectByPublicUrl(supabase, bucket, publicUrl);
        return fail(insertError.message);
      }
    }

    revalidatePath(`/site/${website.slug}`, "layout");
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/gallery");
    return ok("KI-Bild erstellt und gespeichert.");
  } catch (err) {
    console.error("[generateAiImageAction] thrown", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return fail(
      err instanceof Error
        ? `KI-Bildgenerierung fehlgeschlagen: ${err.message}`
        : "KI-Bildgenerierung gerade nicht möglich.",
    );
  }
}
