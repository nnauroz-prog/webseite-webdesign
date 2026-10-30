"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads-meta";
import { updateLead } from "@/lib/leads-store";
import { adminConfigured, adminEmails } from "@/lib/supabase/env";
import { sessionClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; saved?: boolean };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!adminConfigured()) {
    return { error: "Der Admin-Bereich ist noch nicht eingerichtet (Supabase-Variablen fehlen)." };
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Bitte E-Mail und Passwort eingeben." };

  const supabase = await sessionClient();
  if (!supabase) return { error: "Supabase ist nicht konfiguriert." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-Mail oder Passwort stimmt nicht." };

  if (!adminEmails().includes(email)) {
    await supabase.auth.signOut();
    return { error: "Dieses Konto hat keinen Zugang zum Admin-Bereich." };
  }
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await sessionClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function updateLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  if (!UUID_RE.test(id) || !LEAD_STATUSES.includes(status)) {
    return { error: "Ungültige Eingabe." };
  }

  try {
    await updateLead(id, { status, notes });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Speichern fehlgeschlagen." };
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/anfragen/${id}`);
  return { saved: true };
}
