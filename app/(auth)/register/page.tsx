import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";

import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Konto erstellen — SitePilot" };

const onboardingHighlights = [
  "Im Dashboard Texte, Bilder, Leistungen, Team und Galerie pflegen.",
  "Vorschau ansehen, bevor jemand sie sieht — der Demo-Modus ist gratis.",
  "Erst zahlen, wenn du live gehen willst. Monatlich kündbar.",
];

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">SitePilot starten</CardTitle>
          <CardDescription>
            Lege ein Konto an — kostenlos, ohne Kreditkarte. Du zahlst erst,
            wenn du deine Website öffentlich schaltest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>

      <div className="border-border bg-secondary/30 rounded-2xl border p-6">
        <p className="text-foreground/80 text-xs tracking-wide uppercase">
          Was nach der Registrierung passiert
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {onboardingHighlights.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-pretty">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-5 text-xs">
          Schon ein Konto?{" "}
          <Link
            href="/login"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Hier einloggen
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
