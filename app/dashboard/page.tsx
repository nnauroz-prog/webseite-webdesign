import type { Metadata } from "next";
import Link from "next/link";

import { OnboardingForm } from "@/components/dashboard/onboarding-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentWebsite } from "@/lib/supabase/auth";
import type { TemplateRow } from "@/types/website";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardHomePage() {
  const { supabase, website } = await getCurrentWebsite();

  if (!website) {
    const { data } = await supabase
      .from("templates")
      .select("*")
      .eq("is_active", true)
      .order("name");
    const templates = (data as TemplateRow[] | null) ?? [];

    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Willkommen bei SitePilot
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Lege jetzt deine Website an. Du kannst alle Inhalte später jederzeit
          ändern.
        </p>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Neue Website</CardTitle>
              <CardDescription>
                Wir brauchen nur drei Angaben, um zu starten.
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

  const [
    { count: serviceCount },
    { count: teamCount },
    { count: galleryCount },
    { count: leadCount },
  ] = await Promise.all([
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id),
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id),
    supabase
      .from("gallery_images")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id),
  ]);

  const publicHref = `/site/${website.slug}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {website.business_name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Status:{" "}
            {website.is_active ? (
              <span className="text-foreground font-medium">öffentlich</span>
            ) : (
              <span className="text-foreground font-medium">privat</span>
            )}{" "}
            · URL{" "}
            <span className="text-foreground font-mono">{publicHref}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={publicHref} target="_blank" rel="noreferrer">
              Vorschau öffnen
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/website">Website bearbeiten</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Leistungen"
          value={serviceCount ?? 0}
          href="/dashboard/services"
        />
        <StatCard label="Team" value={teamCount ?? 0} href="/dashboard/team" />
        <StatCard
          label="Galerie"
          value={galleryCount ?? 0}
          href="/dashboard/gallery"
        />
        <StatCard
          label="Anfragen"
          value={leadCount ?? 0}
          href="/dashboard/leads"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-card hover:bg-accent group block rounded-xl border p-5 transition-colors"
    >
      <div className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </Link>
  );
}
