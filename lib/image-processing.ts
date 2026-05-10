/**
 * Client-side image preprocessing before upload.
 *
 * Most logo / hero / gallery upload failures we see come from phone
 * photos that are 3-6 MB and sometimes HEIC. Rather than reject these
 * users, we transparently:
 *   - decode the file in-browser
 *   - resize so the longest side ≤ 1600 px (logo) or 2400 px (hero/gallery)
 *   - re-encode to JPEG quality 0.85
 *
 * Result: every upload comfortably fits under the 4 MB limit and is in
 * a universally renderable format. The original File is returned
 * unchanged when:
 *   - it's already small AND a supported MIME type
 *   - the browser can't decode it (HEIC on Chrome/Firefox) — caller
 *     gets a `decodeFailed` flag so the UI can show a helpful tip
 */

const SUPPORTED_DIRECT_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const SMALL_FILE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB

export type ProcessImageOptions = {
  /** Longest-side cap in pixels. Default 2400. */
  maxSize?: number;
  /** JPEG quality 0..1. Default 0.85. */
  quality?: number;
};

export type ProcessedImage =
  | { ok: true; file: File; resized: boolean }
  | { ok: false; message: string };

export async function processImageForUpload(
  file: File,
  options: ProcessImageOptions = {},
): Promise<ProcessedImage> {
  const maxSize = options.maxSize ?? 2400;
  const quality = options.quality ?? 0.85;

  if (!file || file.size === 0) {
    return { ok: false, message: "Keine Datei ausgewählt." };
  }

  // Sanity check — even after compression a 50MB file is suspicious.
  if (file.size > 30 * 1024 * 1024) {
    return { ok: false, message: "Datei zu groß (über 30 MB)." };
  }

  // Files that are already small + a directly-supported format pass
  // through unchanged. Skips the decode/encode roundtrip.
  if (
    file.size <= SMALL_FILE_BYTES &&
    SUPPORTED_DIRECT_MIME.has(file.type)
  ) {
    return { ok: true, file, resized: false };
  }

  // Decode → canvas → re-encode.
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return {
      ok: false,
      message:
        'Dieses Bildformat konnte nicht gelesen werden. Bitte als JPG oder PNG speichern und erneut versuchen (in der Foto-App: Teilen → "Als JPG speichern").',
    };
  }

  const { width, height } = bitmap;
  const longest = Math.max(width, height);
  const scale = longest > maxSize ? maxSize / longest : 1;
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return { ok: false, message: "Browser unterstützt das Verarbeiten nicht." };
  }
  // Fill with white — JPEG has no alpha, so transparent PNG/WebP would
  // otherwise become black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality),
  );
  if (!blob) {
    return { ok: false, message: "Bild konnte nicht komprimiert werden." };
  }

  // Replace extension on the original filename so the server-side
  // extension inference picks up "jpg".
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const out = new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  return { ok: true, file: out, resized: scale < 1 || file.size > SMALL_FILE_BYTES };
}

/**
 * Drop-in replacement for forms that submit a single <input type="file">
 * via React server actions. Wraps the file from FormData with a
 * processed version. Returns the FormData for chaining.
 *
 * Usage in an `<form action={...} onSubmit={(e) => preprocessFileField(...)}>` style
 * is awkward; prefer calling processImageForUpload() and rebuilding the
 * FormData manually in form components.
 */
export async function replaceFormFile(
  formData: FormData,
  fieldName: string,
  options?: ProcessImageOptions,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const raw = formData.get(fieldName);
  if (!(raw instanceof File)) return { ok: true };
  const result = await processImageForUpload(raw, options);
  if (!result.ok) return result;
  formData.set(fieldName, result.file);
  return { ok: true };
}
