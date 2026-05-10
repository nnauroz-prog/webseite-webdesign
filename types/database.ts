/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Supabase generated types — placeholder.
 *
 * In Phase 2/3 we use a permissive shape so `supabase.from("websites")` etc.
 * compile without errors. Replace this file with real generated types once
 * the project is connected:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 *
 * After regeneration, all queries become fully typed automatically and the
 * domain types in `types/website.ts` can be removed.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericTable = {
  Row: any;
  Insert: any;
  Update: any;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: GenericTable;
      admin_roles: GenericTable;
      templates: GenericTable;
      websites: GenericTable;
      services: GenericTable;
      team_members: GenericTable;
      gallery_images: GenericTable;
      leads: GenericTable;
      applications: GenericTable;
      subscriptions: {
        Row: {
          user_id: string;
          provider: "stripe" | "lemon";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          lemon_customer_id: string | null;
          lemon_subscription_id: string | null;
          lemon_variant_id: string | null;
          plan: string | null;
          status: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          provider?: "stripe" | "lemon";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          lemon_customer_id?: string | null;
          lemon_subscription_id?: string | null;
          lemon_variant_id?: string | null;
          plan?: string | null;
          status?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          provider?: "stripe" | "lemon";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          lemon_customer_id?: string | null;
          lemon_subscription_id?: string | null;
          lemon_variant_id?: string | null;
          plan?: string | null;
          status?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [key: string]: { Row: any } };
    Functions: { [key: string]: { Args: any; Returns: any } };
    Enums: { [key: string]: string };
    CompositeTypes: { [key: string]: any };
  };
};
