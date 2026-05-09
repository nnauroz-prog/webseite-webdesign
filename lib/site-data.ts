import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type {
  GalleryImageRow,
  ServiceRow,
  TeamMemberRow,
  TemplateRow,
  WebsiteRow,
} from "@/types/website";

export type PublicSite = {
  website: WebsiteRow;
  services: ServiceRow[];
  team: TeamMemberRow[];
  gallery: GalleryImageRow[];
  template: TemplateRow | null;
  /** True iff the website is_active is false but the viewer can see it (owner). */
  isPreview: boolean;
};

/**
 * Fetch all data needed to render a public website page.
 *
 * Returns null if the slug doesn't exist or the viewer isn't allowed to see it
 * (RLS handles the "active or owner" rule). Wrapped in React's `cache` so a
 * single request that calls this from `generateMetadata` and from the page
 * itself only hits Supabase once.
 */
export const getPublicSite = cache(
  async (slug: string): Promise<PublicSite | null> => {
    const supabase = await createClient();

    const { data: websiteRow } = await supabase
      .from("websites")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!websiteRow) return null;
    const website = websiteRow as WebsiteRow;

    // If the row came back even though it's not active, the viewer must be
    // the owner (or admin) — RLS already enforced that. We still expose this
    // as a flag so the UI can show a "preview" banner.
    const isPreview = !website.is_active;

    const [servicesRes, teamRes, galleryRes, templateRes] = await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("website_id", website.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("team_members")
        .select("*")
        .eq("website_id", website.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("gallery_images")
        .select("*")
        .eq("website_id", website.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      website.template_id
        ? supabase
            .from("templates")
            .select("*")
            .eq("id", website.template_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    return {
      website,
      services: (servicesRes.data as ServiceRow[] | null) ?? [],
      team: (teamRes.data as TeamMemberRow[] | null) ?? [],
      gallery: (galleryRes.data as GalleryImageRow[] | null) ?? [],
      template: (templateRes.data as TemplateRow | null) ?? null,
      isPreview,
    };
  },
);
