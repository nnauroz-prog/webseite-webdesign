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
export type BookingStatus =
  | "new"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "completed";

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
  hero_image_url: string | null;
  about_image_url: string | null;
  brand_primary_color: string | null;
  custom_domain: string | null;
  custom_domain_verified_at: string | null;
  imprint_text: string | null;
  privacy_text: string | null;
  is_active: boolean;
  contact_form_enabled: boolean;
  application_form_enabled: boolean;
  booking_form_enabled: boolean;
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

export type BlockType =
  | "faq"
  | "testimonials"
  | "opening_hours"
  | "cta_banner"
  | "map"
  | "video"
  | "stats"
  | "rich_text";

export type FaqBlockData = {
  title?: string;
  items: Array<{ question: string; answer: string }>;
};

export type TestimonialsBlockData = {
  title?: string;
  items: Array<{ name: string; role?: string; quote: string }>;
};

export type OpeningHoursBlockData = {
  title?: string;
  /** Free-text multi-line, e.g. "Mo–Fr: 9–18 Uhr\nSa: 10–14 Uhr" */
  text: string;
};

export type CtaBannerBlockData = {
  headline: string;
  subtitle?: string;
  button_label: string;
  button_href: string;
};

export type MapBlockData = {
  title?: string;
  /** Free-form address — geocoded by the embed itself. */
  address: string;
};

export type VideoBlockData = {
  title?: string;
  /** YouTube or Vimeo URL — we extract the ID and embed. */
  url: string;
  caption?: string;
};

export type StatsBlockData = {
  title?: string;
  items: Array<{ value: string; label: string }>;
};

export type RichTextBlockData = {
  title?: string;
  /** Plain text with paragraphs separated by blank lines. */
  body: string;
};

export type PageBlockRow = {
  id: string;
  website_id: string;
  page_id: string | null;
  type: BlockType;
  data:
    | FaqBlockData
    | TestimonialsBlockData
    | OpeningHoursBlockData
    | CtaBannerBlockData
    | MapBlockData
    | VideoBlockData
    | StatsBlockData
    | RichTextBlockData
    | Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PageRow = {
  id: string;
  website_id: string;
  slug: string;
  title: string;
  body: string;
  sort_order: number;
  is_published: boolean;
  show_in_nav: boolean;
  created_at: string;
  updated_at: string;
};

export type BookingRow = {
  id: string;
  website_id: string;
  service_id: string | null;
  service_title: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  /** ISO date `YYYY-MM-DD`. */
  preferred_date: string;
  /** ISO time `HH:MM:SS` or null when the customer left it open. */
  preferred_time: string | null;
  message: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};
