import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { OnboardingForm } from "@/components/dashboard/onboarding-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import type { TemplateRow } from "@/types/website";

export const metadata: Metadata = { title: "Neue Website" };

/**
 * Standalone onboarding page reachable via the SiteSwitcher's
 * "+ Neue Website anlegen" link. Re-uses the existing OnboardingForm —
 * createWebsiteAction now allows multi-site so we just render it here
 * without the dashboard-home nudge wrapper.
 */
export default async function NewSitePage() {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("name");
  const templates = (data as TemplateRow[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Weitere Website anlegen
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Du kannst beliebig viele Sites verwalten — z.B. für mehrere Kunden
        oder Standorte. Jede Site hat eigene Inhalte, eigene Domain, eigene
        Anfragen-Postfächer.
      </p>
      <div className="mt-6">
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Branche + Daten</CardTitle>
            <CardDescription>
              Drei Schritte — Beispiel-Inhalte werden automatisch eingefügt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm templates={templates} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
