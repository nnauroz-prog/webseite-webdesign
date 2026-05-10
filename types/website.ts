/**
 * Domain types for the dashboard / public-site rendering.
 *
 * These mirror the columns defined in supabase/schema.sql. Once you run
 * `npx supabase gen types typescript`, replace `types/database.ts` with the
 * real generated types and migrate consumers from these manual types to
 * `Database["public"]["Tables"]["…"]["Row"]`.
 */

export type Industry = string;

export type LeadStatus = "new" | "contacted" | "closed";
export type ApplicationStatus = "new" | "reviewed" | "accepted" | "rejected";

export type WebsiteRow = {
  id: string;
  user_id: string;
  template_id: string | null;
  slug: string;
  business_name: string;
  industry: Industry | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  opening_hours: { text?: string } | null;
  logo_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  about_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_google_site_verification: string | null;
  seo_bing_site_verification: string | null;
  analytics_ga4_id: string | null;
  imprint_text: string | null;
  privacy_text: string | null;
  is_active: boolean;
  contact_form_enabled: boolean;
  application_form_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  website_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TeamMemberRow = {
  id: string;
  website_id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryImageRow = {
  id: string;
  website_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TemplateRow = {
  id: string;
  name: string;
  industry: string;
  preview_image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type LeadRow = {
  id: string;
  website_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export type ApplicationRow = {
  id: string;
  website_id: string;
  name: string;
  email: string;
  phone: string | null;
  desired_position: string | null;
  message: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};
