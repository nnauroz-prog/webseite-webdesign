import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Passwort zurücksetzen — Sitalo" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Passwort vergessen?</CardTitle>
          <CardDescription>
            Trage deine E-Mail ein. Wir schicken dir einen Link, mit dem du ein
            neues Passwort vergeben kannst — gültig für eine Stunde.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-sm">
        Doch noch erinnert?{" "}
        <Link
          href="/login"
          className="text-foreground underline-offset-2 hover:underline"
        >
          Zurück zum Login
        </Link>
      </p>
    </div>
  );
}
