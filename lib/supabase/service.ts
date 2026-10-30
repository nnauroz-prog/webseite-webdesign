import "server-only";

import { createClient } from "@supabase/supabase-js";

import { supabaseServiceKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Supabase-Client mit service_role-Schlüssel. Umgeht RLS — darf nur
 * im Server-Code verwendet werden, und im Admin-Bereich erst nach
 * requireAdmin(). `server-only` bricht den Build, falls das Modul je
 * in einer Client-Komponente landet.
 *
 * null, wenn Supabase nicht konfiguriert ist.
 */
export function serviceClient() {
  const url = supabaseUrl();
  const key = supabaseServiceKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
