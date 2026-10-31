"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads-meta";
import { deliverLead, explainDeliveryError, mailSetup } from "@/lib/lead-mail";
import { updateLead } from "@/lib/leads-store";
import { adminConfigured, adminEmails } from "@/lib/supabase/env";
import { sessionClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; saved?: boolean; info?: string };

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
  if (error) {
    // Grund im Vercel-Log festhalten und verständlich anzeigen — „falsches
    // Passwort" und „falscher Schlüssel" sehen sonst gleich aus.
    console.error(`[admin] Login fehlgeschlagen: ${error.status ?? "?"} ${error.code ?? ""} ${error.message}`);
    const msg = `${error.code ?? ""} ${error.message}`.toLowerCase();
    if (msg.includes("api key") || error.status === 401) {
      return {
        error:
          "Supabase lehnt den Schlüssel ab. NEXT_PUBLIC_SUPABASE_ANON_KEY passt nicht zur Project URL — bitte beide aus demselben Supabase-Projekt in Vercel eintragen und neu deployen.",
      };
    }
    if (msg.includes("not_confirmed") || msg.includes("not confirmed")) {
      return { error: "Dieses Konto ist in Supabase noch nicht bestätigt (Authentication → Users → Confirm)." };
    }
    if (msg.includes("invalid_credentials") || msg.includes("invalid login")) {
      return { error: "E-Mail oder Passwort stimmt nicht." };
    }
    return { error: `Anmeldung nicht möglich: ${error.message}` };
  }

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

/** Schickt eine Test-Mail über denselben Weg wie echte Anfragen. */
export async function sendTestMail(): Promise<ActionState> {
  const adminEmail = await requireAdmin();
  const { to } = mailSetup();
  try {
    const via = await deliverLead({
      kind: "anfrage",
      subject: "Test-Mail von sitalo.de/admin",
      fields: [
        ["Hinweis", "Wenn diese Mail ankommt, erreichen Sie alle Anfragen von der Website."],
        ["Ausgelöst von", adminEmail],
      ],
      replyTo: adminEmail,
    });
    return {
      saved: true,
      info: `Gesendet über ${via === "resend" ? "Resend" : "Formspree"} an ${to}. Bitte auch im Spam-Ordner nachsehen.`,
    };
  } catch (err) {
    return { error: explainDeliveryError(err instanceof Error ? err.message : String(err)) };
  }
}
