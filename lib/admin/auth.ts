import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { adminConfigured, adminEmails } from "@/lib/supabase/env";
import { sessionClient } from "@/lib/supabase/server";

/**
 * Zentrale Zugangsprüfung für den Admin-Bereich.
 *
 * Jede Admin-Seite und jede Server Action ruft requireAdmin() auf —
 * proxy.ts erneuert nur die Sitzung und ist kein Zugangsschutz.
 *
 * getUser() fragt bei Supabase nach (statt nur das Cookie zu lesen),
 * damit gesperrte oder gelöschte Nutzer sofort keinen Zugriff mehr
 * haben. Zusätzlich muss die E-Mail auf ADMIN_EMAILS stehen — falls
 * im Supabase-Projekt versehentlich Selbst-Registrierung an ist,
 * kommt ein fremdes Konto trotzdem nicht rein.
 */
export const getAdminEmail = cache(async (): Promise<string | null> => {
  if (!adminConfigured()) return null;
  const supabase = await sessionClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (error || !email) return null;
  return adminEmails().includes(email) ? email : null;
});

export async function requireAdmin(): Promise<string> {
  if (!adminConfigured()) redirect("/admin/login");
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");
  return email;
}
