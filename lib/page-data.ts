import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { PageRow } from "@/types/website";

/**
 * Fetch a single custom page by `(website_id, slug)`.
 *
 * RLS handles visibility: the public-read policy only returns
 * published pages of active websites; owner+admin policies expand
 * that to drafts on their own sites. Wrapped in React's `cache` so
 * generateMetadata + the page handler share one round-trip.
 */
export const getCustomPage = cache(
  async (websiteId: string, slug: string): Promise<PageRow | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("website_id", websiteId)
      .eq("slug", slug)
      .maybeSingle();
    return (data as PageRow | null) ?? null;
  },
);

/**
 * List all nav-eligible pages of a website (published + show_in_nav)
 * sorted as the owner arranged them. Used by the public site header
 * and by the page-management dashboard.
 */
export const listNavPages = cache(
  async (websiteId: string): Promise<PageRow[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("website_id", websiteId)
      .eq("is_published", true)
      .eq("show_in_nav", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return (data as PageRow[] | null) ?? [];
  },
);

/** All pages incl. drafts — for the owner's dashboard list view. */
export async function listAllPagesForOwner(
  websiteId: string,
): Promise<PageRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("website_id", websiteId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data as PageRow[] | null) ?? [];
}
