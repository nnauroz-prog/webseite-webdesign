/**
 * Thin Unsplash REST-API client. Centralises the access-key check so
 * every caller can degrade gracefully ("Stock-Photo nicht konfiguriert")
 * instead of crashing when `UNSPLASH_ACCESS_KEY` isn't set.
 *
 * We never call Unsplash from the browser — the access key has a tight
 * rate limit per IP and must stay server-side. Browser callers go
 * through `/api/unsplash/search` instead.
 */

const ENDPOINT = "https://api.unsplash.com";

export function isUnsplashConfigured(): boolean {
  return Boolean(process.env.UNSPLASH_ACCESS_KEY);
}

export type UnsplashPhoto = {
  id: string;
  description: string | null;
  /** Square thumbnail URL — fast to load in the picker grid. */
  thumb_url: string;
  /** Large URL (~2000 px) — what we actually download + store. */
  full_url: string;
  /** Original Unsplash photo page — used in the photographer credit link. */
  link_html: string;
  photographer_name: string;
  photographer_url: string;
  /** Per Unsplash ToS we must hit this URL when the user picks a photo. */
  download_location: string;
  width: number;
  height: number;
};

type RawUnsplashSearchHit = {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: { thumb: string; small: string; regular: string; full: string };
  links: { html: string; download_location: string };
  user: { name: string; links: { html: string } };
  width: number;
  height: number;
};

type RawUnsplashSearchResponse = {
  total: number;
  total_pages: number;
  results: RawUnsplashSearchHit[];
};

export type UnsplashSearchResult =
  | { ok: true; photos: UnsplashPhoto[] }
  | { ok: false; configured: false; message: string }
  | { ok: false; configured: true; message: string };

/**
 * Search the Unsplash photo library. Returns a tidy `UnsplashPhoto[]`
 * shape rather than the verbose raw response.
 */
export async function unsplashSearch(
  query: string,
  opts: { perPage?: number; orientation?: "landscape" | "portrait" | "squarish" } = {},
): Promise<UnsplashSearchResult> {
  if (!isUnsplashConfigured()) {
    return {
      ok: false,
      configured: false,
      message:
        "Stock-Fotos sind nicht konfiguriert. UNSPLASH_ACCESS_KEY fehlt.",
    };
  }

  const q = query.trim();
  if (!q) return { ok: true, photos: [] };

  const params = new URLSearchParams({
    query: q,
    per_page: String(Math.min(Math.max(opts.perPage ?? 12, 1), 30)),
    content_filter: "high",
  });
  if (opts.orientation) params.set("orientation", opts.orientation);

  let response: Response;
  try {
    response = await fetch(`${ENDPOINT}/search/photos?${params.toString()}`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
      cache: "no-store",
    });
  } catch (err) {
    return {
      ok: false,
      configured: true,
      message: `Unsplash nicht erreichbar: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      message: `Unsplash antwortet mit ${response.status}.`,
    };
  }

  const json = (await response.json()) as RawUnsplashSearchResponse;
  const photos: UnsplashPhoto[] = json.results.map((hit) => ({
    id: hit.id,
    description: hit.description ?? hit.alt_description ?? null,
    thumb_url: hit.urls.thumb,
    full_url: hit.urls.regular,
    link_html: hit.links.html,
    photographer_name: hit.user.name,
    photographer_url: hit.user.links.html,
    download_location: hit.links.download_location,
    width: hit.width,
    height: hit.height,
  }));

  return { ok: true, photos };
}

/**
 * Per Unsplash ToS § 4: when a user picks a photo from search results,
 * we must trigger the photo's `download_location` endpoint. This counts
 * the download in Unsplash's stats and is what differentiates the free
 * API tier from terms violations. Best-effort — failures don't block
 * the actual import.
 */
export async function unsplashTrackDownload(
  downloadLocation: string,
): Promise<void> {
  if (!isUnsplashConfigured()) return;
  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
      cache: "no-store",
    });
  } catch {
    // Tracking failures are non-fatal.
  }
}

/**
 * Fetches the actual JPEG bytes for the chosen photo. Used by the
 * "pick photo" server action to mirror the asset into our Supabase
 * Storage so the public site keeps serving it even if Unsplash ever
 * deletes the original.
 */
export async function unsplashDownload(
  fullUrl: string,
): Promise<
  | { ok: true; bytes: ArrayBuffer; contentType: string }
  | { ok: false; message: string }
> {
  try {
    const response = await fetch(fullUrl, { cache: "no-store" });
    if (!response.ok) {
      return {
        ok: false,
        message: `Bild-Download fehlgeschlagen (${response.status}).`,
      };
    }
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const bytes = await response.arrayBuffer();
    return { ok: true, bytes, contentType };
  } catch (err) {
    return {
      ok: false,
      message: `Bild-Download fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
