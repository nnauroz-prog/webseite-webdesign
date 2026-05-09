import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

type ActiveSite = { slug: string; updated_at: string | null };

/**
 * Dynamic sitemap. Lists the marketing landing plus every public site under
 * /site/[slug]. RLS filters to is_active=true automatically (anon read).
 *
 * We deliberately exclude imprint/privacy pages — those are tagged noindex
 * via metadata in Phase 4.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("websites")
      .select("slug, updated_at")
      .eq("is_active", true)
      .limit(5000);

    for (const site of (data as ActiveSite[] | null) ?? []) {
      entries.push({
        url: `${baseUrl}/site/${site.slug}`,
        lastModified: site.updated_at ? new Date(site.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // If Supabase is unreachable at request time, return the marketing root
    // only. Better to serve a partial sitemap than a 500 to crawlers.
  }

  return entries;
}
