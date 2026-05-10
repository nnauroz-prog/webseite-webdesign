import { NextResponse } from "next/server";

import { requireUser } from "@/lib/supabase/auth";
import { isUnsplashConfigured, unsplashSearch } from "@/lib/unsplash/client";

/**
 * GET /api/unsplash/search?q=…&orientation=landscape
 *
 * Authenticated proxy to Unsplash. Keeps the access key server-side
 * and prevents non-customers from burning our rate limit.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Any logged-in user may search. We don't gate by plan here so a
  // trialing customer can pick their first photo too.
  await requireUser();

  if (!isUnsplashConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          "Stock-Fotos sind noch nicht aktiviert. Bitte später erneut versuchen.",
      },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const orientationRaw = searchParams.get("orientation") ?? "";
  const orientation =
    orientationRaw === "landscape" ||
    orientationRaw === "portrait" ||
    orientationRaw === "squarish"
      ? orientationRaw
      : undefined;

  if (!query) {
    return NextResponse.json({ ok: true, photos: [] });
  }

  const result = await unsplashSearch(query, { orientation, perPage: 18 });
  if (!result.ok) {
    return NextResponse.json(result, {
      status: result.configured ? 502 : 503,
    });
  }
  return NextResponse.json({ ok: true, photos: result.photos });
}
