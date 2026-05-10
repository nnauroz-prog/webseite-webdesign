import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { OnboardingForm } from "@/components/dashboard/onboarding-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentPlan } from "@/lib/billing/current-plan";
import { getSiteLimit } from "@/lib/stripe/plans";
import { listUserWebsites, requireUser } from "@/lib/supabase/auth";
import type { TemplateRow } from "@/types/website";

export const metadata: Metadata = { title: "Neue Website" };

export default async function NewSitePage() {
  const { supabase, user } = await requireUser();

  // Show the upgrade CTA when the user has already hit their site
  // quota — same gate the server action enforces, just rendered up
  // front so the user doesn't fill in the wizard for nothing.
  const websites = await listUserWebsites();
  const plan = await getCurrentPlan(user.id);
  const limit = getSiteLimit(plan);
  const atLimit = websites.length >= limit;

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
        Du kannst mehrere Sites verwalten — z.B. für mehrere Kunden oder
        Standorte. Jede Site hat eigene Inhalte, eigene Domain, eigene
        Anfragen-Postfächer.
      </p>

      {atLimit ? (
        <Card className="border-primary/40 from-primary/10 mt-6 bg-gradient-to-br to-amber-700/10 shadow-md">
          <CardHeader>
            <span className="bg-primary/20 text-primary mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full">
              <Sparkles className="h-5 w-5" />
            </span>
            <CardTitle className="text-lg">
              {plan === "premium"
                ? `Maximum von ${limit} Websites erreicht`
                : "Mehrere Websites sind ein Premium-Feature"}
            </CardTitle>
            <CardDescription>
              {plan === "premium"
                ? "Schreib uns kurz wenn du mehr Sites brauchst — wir heben das Limit individuell."
                : "Mit Premium kannst du bis zu 10 Websites verwalten — perfekt für Agenturen oder Multi-Standort-Betriebe."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Aktuell: <strong className="text-foreground">{websites.length}</strong> von{" "}
              <strong className="text-foreground">{limit}</strong> Sites genutzt
              {plan ? ` · Plan: ${plan}` : ""}.
            </p>
            {plan !== "premium" ? (
              <Button asChild className="mt-5">
                <Link href="/pricing">Auf Premium upgraden</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}
