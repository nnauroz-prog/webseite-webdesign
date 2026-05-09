import type { SupabaseClient } from "@supabase/supabase-js";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

export type ImageBucket = "logos" | "team-images" | "gallery";

export type UploadImageInput = {
  supabase: SupabaseClient;
  bucket: ImageBucket;
  file: File;
  /** Owner user id; MUST be the first segment of the storage path. */
  userId: string;
  /** Subfolder under the user folder (e.g. websiteId, websiteId/team/memberId). */
  subPath: string;
};

export type UploadImageResult =
  | { ok: true; path: string; publicUrl: string }
  | { ok: false; message: string };

/**
 * Validate + upload an image into a Supabase storage bucket.
 *
 *  - Checks mime type and size client/server side
 *  - Uses the `<userId>/...` prefix required by storage RLS
 *  - Returns the public URL for direct usage in <Image src=...>
 */
export async function uploadImage({
  supabase,
  bucket,
  file,
  userId,
  subPath,
}: UploadImageInput): Promise<UploadImageResult> {
  if (!file || file.size === 0) {
    return { ok: false, message: "Keine Datei ausgewählt." };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      ok: false,
      message: "Nur JPEG, PNG, WebP oder AVIF erlaubt.",
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { ok: false, message: "Datei darf maximal 4 MB groß sein." };
  }

  const ext = inferExtension(file);
  const id = crypto.randomUUID();
  const path = `${userId}/${trimSlashes(subPath)}/${id}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) return { ok: false, message: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { ok: true, path, publicUrl };
}

/**
 * Best-effort delete of a previously uploaded object. Errors are swallowed —
 * we don't fail the user-facing action just because cleanup didn't work.
 */
export async function deleteStorageObjectByPublicUrl(
  supabase: SupabaseClient,
  bucket: ImageBucket,
  publicUrl: string | null,
) {
  if (!publicUrl) return;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}

function inferExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

function trimSlashes(s: string) {
  return s.replace(/^\/+|\/+$/g, "");
}
