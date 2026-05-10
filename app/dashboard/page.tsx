import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { OnboardingForm } from "@/components/dashboard/onboarding-form";
import { SeedDemoButton } from "@/components/dashboard/seed-demo-button";
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
          Lege jetzt deine Website an. Wir füllen sie automatisch mit
          Beispiel-Inhalten — du musst nur noch deine Daten anpassen.
        </p>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Neue Website</CardTitle>
              <CardDescription>
                Drei Angaben — Firmenname, URL, Branche. Mehr brauchen wir
                nicht.
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
    { count: applicationCount },
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
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id),
  ]);

  // Compute completeness — 8 fields/lists that contribute when filled.
  const checklist = [
    { label: "Hero-Überschrift", done: !!website.hero_title?.trim() },
    { label: "Über-uns-Text", done: !!website.about_text?.trim() },
    { label: "Logo hochgeladen", done: !!website.logo_url },
    {
      label: "Kontaktdaten (Telefon oder E-Mail)",
      done: !!website.phone?.trim() || !!website.email?.trim(),
    },
    { label: "Mindestens 1 Leistung", done: (serviceCount ?? 0) > 0 },
    { label: "Mindestens 1 Team-Mitglied", done: (teamCount ?? 0) > 0 },
    { label: "Mindestens 1 Galerie-Bild", done: (galleryCount ?? 0) > 0 },
    { label: "Veröffentlicht", done: website.is_active },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const completeness = Math.round((doneCount / checklist.length) * 100);

  const showSeedBanner = (serviceCount ?? 0) === 0 && (teamCount ?? 0) === 0;

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

      {showSeedBanner ? (
        <div className="border-primary/40 bg-primary/5 mt-6 flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5">
          <div className="flex items-start gap-3">
            <span className="bg-primary text-primary-foreground inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Deine Website ist noch leer
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Wir können dir mit einem Klick passende Beispiel-Inhalte
                einsetzen — Hero, Leistungen, Team, Über-uns. Du kannst
                anschließend alles anpassen oder löschen.
              </p>
            </div>
          </div>
          <SeedDemoButton />
        </div>
      ) : null}

      {/* Completeness checklist */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                Website-Fortschritt
              </CardTitle>
              <CardDescription>
                {doneCount} von {checklist.length} Schritten erledigt
              </CardDescription>
            </div>
            <span className="text-2xl font-semibold tabular-nums">
              {completeness}%
            </span>
          </div>
          <div className="bg-secondary mt-4 h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className={
                    item.done
                      ? "inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-border inline-flex h-4 w-4 items-center justify-center rounded-full border"
                  }
                >
                  {item.done ? (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6.5L5 9.5L10 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <span
                  className={
                    item.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
        <StatCard
          label="Bewerbungen"
          value={applicationCount ?? 0}
          href="/dashboard/applications"
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
