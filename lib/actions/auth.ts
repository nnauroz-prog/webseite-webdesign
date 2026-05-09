"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/validations/auth";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const idle: AuthActionState = { status: "idle" };

function fail(
  message: string,
  fieldErrors?: Record<string, string>,
): AuthActionState {
  return { status: "error", message, fieldErrors };
}

function success(message: string): AuthActionState {
  return { status: "success", message };
}

function flattenZodErrors(
  error: import("zod").ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// ---------------------------------------------------------------------------
//  registerAction
// ---------------------------------------------------------------------------
export async function registerAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.full_name },
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard`,
      },
    });

    if (error) return fail(error.message);

    return success(
      "Konto erstellt. Bitte bestätige deine E-Mail über den Link, den wir dir geschickt haben.",
    );
  } catch {
    return fail(
      "Konto-Erstellung gerade nicht möglich. Bitte später erneut versuchen.",
    );
  }
}

// ---------------------------------------------------------------------------
//  loginAction
// ---------------------------------------------------------------------------
export async function loginAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) return fail("E-Mail oder Passwort ist falsch.");
  } catch {
    return fail("Login gerade nicht möglich. Bitte später erneut versuchen.");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
//  logoutAction
// ---------------------------------------------------------------------------
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ---------------------------------------------------------------------------
//  forgotPasswordAction
// ---------------------------------------------------------------------------
export async function forgotPasswordAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return fail(
      "Bitte prüfe deine E-Mail-Adresse.",
      flattenZodErrors(parsed.error),
    );
  }

  const supabase = await createClient();
  // Don't leak whether the email exists — always return success.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/update-password`,
  });

  return success(
    "Wenn ein Konto mit dieser E-Mail existiert, haben wir einen Link zum Zurücksetzen gesendet.",
  );
}

// ---------------------------------------------------------------------------
//  updatePasswordAction
// ---------------------------------------------------------------------------
export async function updatePasswordAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return fail("Sitzung abgelaufen. Bitte fordere einen neuen Reset-Link an.");
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) return fail(error.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export const initialAuthState = idle;
