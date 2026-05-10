import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Image as ImageIcon,
  Inbox,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
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
        <div className="from-primary inline-flex items-center gap-2 rounded-full bg-gradient-to-r to-violet-500 px-3 py-1 text-xs font-medium text-white shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Willkommen
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Lass uns deine Website bauen.
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Drei Angaben — den Rest erledigen wir. Du landest auf einer fertigen
          Seite, passt nur Details an.
        </p>
        <div className="mt-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Neue Website</CardTitle>
              <CardDescription>
                Firmenname, URL, Branche. Beispiel-Inhalte werden automatisch
                eingefügt.
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
    { count: newLeadCount },
    { count: newApplicationCount },
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
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id)
      .eq("status", "new"),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("website_id", website.id)
      .eq("status", "new"),
  ]);

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
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Hero header */}
      <div className="from-primary/5 via-background to-background border-primary/10 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8">
        <div className="bg-primary/10 pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                  website.is_active
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    website.is_active ? "bg-emerald-500" : "bg-amber-500",
                  )}
                />
                {website.is_active ? "Öffentlich" : "Privat"}
              </span>
              <span className="text-muted-foreground font-mono text-xs">
                /site/{website.slug}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {website.business_name}
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {website.industry
                ? `Dein ${website.industry}-Auftritt — bearbeite Inhalte links, sieh die Wirkung sofort rechts.`
                : "Bearbeite Inhalte links, sieh die Wirkung sofort rechts."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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
      </div>

      {showSeedBanner ? (
        <div className="from-primary/10 to-violet-500/10 border-primary/30 mt-6 flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-gradient-to-r p-5">
          <div className="flex items-start gap-3">
            <span className="from-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br to-violet-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Deine Website ist noch leer
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Wir setzen passende Beispiel-Inhalte ein — Hero, Leistungen,
                Team, Über-uns. Anpassen oder löschen jederzeit möglich.
              </p>
            </div>
          </div>
          <SeedDemoButton />
        </div>
      ) : null}

      {/* Completeness card */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="text-primary h-4 w-4" />
                Website-Fortschritt
              </CardTitle>
              <CardDescription>
                {doneCount} von {checklist.length} Schritten erledigt
              </CardDescription>
            </div>
            <span className="text-primary text-3xl font-semibold tabular-nums">
              {completeness}%
            </span>
          </div>
          <div className="bg-secondary mt-4 h-2 w-full overflow-hidden rounded-full">
            <div
              className="from-primary h-full rounded-full bg-gradient-to-r to-violet-500 transition-all"
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
                      ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "border-border inline-flex h-5 w-5 items-center justify-center rounded-full border"
                  }
                >
                  {item.done ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
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

      {/* Stat cards — color-coded per section */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Leistungen"
          value={serviceCount ?? 0}
          href="/dashboard/services"
          icon={Settings}
          tone="sky"
        />
        <StatCard
          label="Team"
          value={teamCount ?? 0}
          href="/dashboard/team"
          icon={Users}
          tone="emerald"
        />
        <StatCard
          label="Galerie"
          value={galleryCount ?? 0}
          href="/dashboard/gallery"
          icon={ImageIcon}
          tone="pink"
        />
        <StatCard
          label="Anfragen"
          value={leadCount ?? 0}
          newCount={newLeadCount ?? 0}
          href="/dashboard/leads"
          icon={Inbox}
          tone="amber"
        />
        <StatCard
          label="Bewerbungen"
          value={applicationCount ?? 0}
          newCount={newApplicationCount ?? 0}
          href="/dashboard/applications"
          icon={Briefcase}
          tone="orange"
        />
      </div>
    </div>
  );
}

const TONE_CLASSES: Record<
  string,
  { bg: string; text: string; ring: string; badge: string }
> = {
  sky: {
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    ring: "group-hover:ring-sky-500/30",
    badge: "bg-sky-500 text-white",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "group-hover:ring-emerald-500/30",
    badge: "bg-emerald-500 text-white",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400",
    ring: "group-hover:ring-pink-500/30",
    badge: "bg-pink-500 text-white",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    ring: "group-hover:ring-amber-500/30",
    badge: "bg-amber-500 text-white",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    ring: "group-hover:ring-orange-500/30",
    badge: "bg-orange-500 text-white",
  },
};

function StatCard({
  label,
  value,
  newCount,
  href,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  newCount?: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: keyof typeof TONE_CLASSES;
}) {
  const classes = TONE_CLASSES[tone];
  const hasNew = (newCount ?? 0) > 0;
  return (
    <Link
      href={href}
      className={cn(
        "bg-card group relative block rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        "ring-1 ring-transparent",
        classes.ring,
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg",
            classes.bg,
            classes.text,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        {hasNew ? (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
              classes.badge,
            )}
          >
            {newCount} neu
          </span>
        ) : null}
      </div>
      <div className="text-muted-foreground mt-3 text-xs tracking-wide uppercase">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        <ArrowRight className="text-muted-foreground/0 group-hover:text-muted-foreground ml-auto h-4 w-4 transition-all" />
      </div>
    </Link>
  );
}
