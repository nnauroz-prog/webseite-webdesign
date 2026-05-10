"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionState } from "@/lib/actions/shared";
import { deleteStorageObjectByPublicUrl } from "@/lib/storage";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import {
  isUnsplashConfigured,
  unsplashDownload,
  unsplashTrackDownload,
} from "@/lib/unsplash/client";

type StockKind = "hero" | "about" | "gallery";

const VALID_KINDS: readonly StockKind[] = ["hero", "about", "gallery"];

function bucketAndField(kind: StockKind): {
  bucket: "gallery";
  field: "hero_image_url" | "about_image_url" | null;
  subPath: string;
} {
  switch (kind) {
    case "hero":
      return { bucket: "gallery", field: "hero_image_url", subPath: "hero_image-unsplash" };
    case "about":
      return { bucket: "gallery", field: "about_image_url", subPath: "about_image-unsplash" };
    case "gallery":
      return { bucket: "gallery", field: null, subPath: "gallery-unsplash" };
  }
}

/**
 * Imports a photo the user picked from the Unsplash search into our
 * own Supabase Storage and attaches it to the right website field (or
 * inserts a gallery row). Mirroring rather than hot-linking keeps the
 * site stable if Unsplash ever pulls the original.
 *
 * Per Unsplash ToS we trigger their `download_location` endpoint as
 * part of the import — failure there is non-fatal.
 */
export async function pickUnsplashPhotoAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  try {
    const kindRaw = formData.get("kind");
    const kind = VALID_KINDS.find((k) => k === kindRaw);
    if (!kind) return fail("Ungültiger Bild-Typ.");

    const fullUrl = (formData.get("full_url") ?? "").toString();
    const downloadLocation = (
      formData.get("download_location") ?? ""
    ).toString();
    const photographerName = (
      formData.get("photographer_name") ?? ""
    ).toString();

    if (!/^https:\/\/images\.unsplash\.com\//.test(fullUrl)) {
      return fail("Ungültige Unsplash-URL.");
    }

    if (!isUnsplashConfigured()) {
      return fail("Stock-Fotos sind nicht konfiguriert.");
    }

    // Track the download with Unsplash (required by ToS) before we
    // even fetch the bytes — that way attribution stats reflect the
    // pick regardless of whether the mirror upload succeeds.
    await unsplashTrackDownload(downloadLocation);

    const download = await unsplashDownload(fullUrl);
    if (!download.ok) return fail(download.message);

    const { bucket, field, subPath } = bucketAndField(kind);
    const { supabase, user, website } = await requireCurrentWebsite();

    const id = crypto.randomUUID();
    const ext = download.contentType.includes("png") ? "png" : "jpg";
    const path = `${user.id}/${website.id}/${subPath}/${id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, download.bytes, {
        cacheControl: "3600",
        upsert: false,
        contentType: download.contentType,
      });
    if (uploadError) return fail(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    const altText = photographerName
      ? `Foto von ${photographerName} auf Unsplash`
      : "Foto von Unsplash";

    if (field) {
      const previous = (
        website as unknown as Record<string, string | null>
      )[field];
      const { error } = await supabase
        .from("websites")
        .update({ [field]: publicUrl })
        .eq("id", website.id);
      if (error) {
        await deleteStorageObjectByPublicUrl(supabase, bucket, publicUrl);
        return fail(error.message);
      }
      await deleteStorageObjectByPublicUrl(supabase, bucket, previous);
    } else {
      const { error } = await supabase.from("gallery_images").insert({
        website_id: website.id,
        image_url: publicUrl,
        alt_text: altText,
        sort_order: 0,
      });
      if (error) {
        await deleteStorageObjectByPublicUrl(supabase, bucket, publicUrl);
        return fail(error.message);
      }
    }

    revalidatePath(`/site/${website.slug}`, "layout");
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/gallery");
    return ok("Stock-Foto übernommen.");
  } catch (err) {
    console.error("[pickUnsplashPhotoAction] thrown", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return fail(
      err instanceof Error
        ? `Stock-Foto konnte nicht übernommen werden: ${err.message}`
        : "Stock-Foto konnte nicht übernommen werden.",
    );
  }
}
