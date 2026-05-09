import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminHomePage() {
  const { supabase } = await requireAdmin();

  const [
    { count: customerCount },
    { count: websiteCount },
    { count: activeWebsiteCount },
    { count: templateCount },
    { count: leadCount },
    { count: applicationCount },
    { count: newLeadCount },
    { count: newApplicationCount },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("websites").select("id", { count: "exact", head: true }),
    supabase
      .from("websites")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("templates")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("applications").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin-Bereich</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Plattform-weite Übersicht über alle Kunden und Inhalte.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Kunden" value={customerCount ?? 0} />
        <StatCard
          label="Websites"
          value={websiteCount ?? 0}
          sub={`${activeWebsiteCount ?? 0} öffentlich`}
          href="/admin/websites"
        />
        <StatCard
          label="Templates aktiv"
          value={templateCount ?? 0}
          href="/admin/templates"
        />
        <StatCard
          label="Anfragen"
          value={leadCount ?? 0}
          sub={`${newLeadCount ?? 0} neu`}
          href="/admin/leads"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bewerbungen</CardTitle>
            <CardDescription>
              {applicationCount ?? 0} insgesamt — {newApplicationCount ?? 0}{" "}
              neu.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <Link
              href="/admin/applications"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Bewerbungen ansehen →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Websites</CardTitle>
            <CardDescription>
              Slug ändern, aktivieren, Template zuweisen.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <Link
              href="/admin/websites"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Alle Websites verwalten →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Templates</CardTitle>
            <CardDescription>
              Branchen-Designs anlegen oder deaktivieren.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <Link
              href="/admin/templates"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Templates verwalten →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: number;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-muted-foreground mt-1 text-xs">{sub}</div>}
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="bg-card hover:bg-accent block rounded-xl border p-5 transition-colors"
      >
        {inner}
      </Link>
    );
  }
  return <div className="bg-card rounded-xl border p-5">{inner}</div>;
}
