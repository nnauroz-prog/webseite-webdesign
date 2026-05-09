/**
 * Supabase generated types.
 *
 * This file is a placeholder for Phase 1. In Phase 2 we will replace it with
 * output from:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 *
 * Keeping the shape `Database` makes our typed Supabase clients work today
 * (untyped) and stay typed once real types land.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
