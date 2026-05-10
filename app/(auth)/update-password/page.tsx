import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Neues Passwort setzen — Sitalo" };

export default async function UpdatePasswordPage() {
  // The user must be authenticated via the recovery callback before they can
  // set a new password. If no session is present, send them back to the
  // forgot-password flow so they can request a fresh link.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Neues Passwort setzen</CardTitle>
        <CardDescription>
          Vergib ein sicheres Passwort für dein Sitalo-Konto. Mindestens 8
          Zeichen — danach bist du direkt eingeloggt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );
}
