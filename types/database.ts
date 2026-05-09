/**
 * Supabase generated types — placeholder.
 *
 * In Phase 2 we use a permissive shape so `supabase.from("websites")` etc.
 * compile without errors. Replace this file with real generated types once
 * the project is connected:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 *
 * After regeneration, all queries become fully typed automatically.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      [key: string]: GenericTable;
    };
    Views: {
      [key: string]: { Row: Record<string, unknown> };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: { [key: string]: string };
    CompositeTypes: { [key: string]: Record<string, unknown> };
  };
};
