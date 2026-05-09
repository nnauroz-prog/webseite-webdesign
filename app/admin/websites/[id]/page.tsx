import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AdminPublishForm,
  AdminSlugForm,
  AdminTemplateForm,
} from "@/components/admin/website-admin-forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/supabase/auth";
import type { TemplateRow, WebsiteRow } from "@/types/website";

type RouteParams = { id: string };

export const metadata: Metadata = { title: "Website-Detail" };

export default async function AdminWebsiteDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: websiteRow } = await supabase
    .from("websites")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!websiteRow) notFound();
  const website = websiteRow as WebsiteRow;

  const [
    { data: templatesData },
    { data: ownerData },
    { count: serviceCount },
    { count: teamCount },
    { count: galleryCount },
    { count: leadCount },
    { count: applicationCount },
  ] = await Promise.all([
    supabase.from("templates").select("*").eq("is_active", true).order("name"),
    supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", website.user_id)
      .maybeSingle(),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("website_id", id),
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("website_id", id),
    supabase
      .from("gallery_images")
      .select("id", { count: "exact", head: true })
      .eq("website_id", id),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("website_id", id),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("website_id", id),
  ]);

  const templates = (templatesData as TemplateRow[] | null) ?? [];
  const owner = ownerData as { email: string; full_name: string | null } | null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <div>
        <Link
          href="/admin/websites"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← Alle Websites
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {website.business_name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {owner?.full_name ?? owner?.email ?? "Inhaber:in unbekannt"}{" "}
              {owner?.email && (
                <span className="font-mono text-xs">· {owner.email}</span>
              )}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/site/${website.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              Public-View öffnen
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inhalte</CardTitle>
          <CardDescription>
            Vom Kunden gepflegt — über das Kunden-Dashboard editierbar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
          <Stat label="Leistungen" value={serviceCount ?? 0} />
          <Stat label="Team" value={teamCount ?? 0} />
          <Stat label="Galerie" value={galleryCount ?? 0} />
          <Stat label="Anfragen" value={leadCount ?? 0} />
          <Stat label="Bewerbungen" value={applicationCount ?? 0} />
        </CardContent>
      </Card>

      <AdminPublishForm website={website} />
      <AdminTemplateForm website={website} templates={templates} />
      <AdminSlugForm website={website} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
