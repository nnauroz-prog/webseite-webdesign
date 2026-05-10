import type { Metadata } from "next";
import Link from "next/link";
import { Eye, EyeOff, ExternalLink, FileText } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageCreateForm } from "@/components/dashboard/pages/page-create-form";
import { PageRow as PageRowComp } from "@/components/dashboard/pages/page-row";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listAllPagesForOwner } from "@/lib/page-data";
import { requireCurrentWebsite } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Seiten" };

export default async function PagesPage() {
  const { website } = await requireCurrentWebsite();
  const pages = await listAllPagesForOwner(website.id);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Seiten</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Lege Unterseiten an wie „Über uns”, „Karriere” oder „Standorte”.
          Veröffentlichte Seiten erscheinen automatisch in der Navigation.
        </p>
      </header>

      {/* Home — informational, can't be edited from here */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">Startseite</CardTitle>
              <CardDescription>
                Wird unter „Website” bearbeitet — Hero, Leistungen, Team, Galerie.
              </CardDescription>
            </div>
            <Link
              href={`/site/${website.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline"
            >
              Vorschau
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neue Seite</CardTitle>
          <CardDescription>
            Titel + URL-Kürzel — den Inhalt fügst du danach hinzu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PageCreateForm />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-medium">
          Eigene Seiten ({pages.length})
        </h2>
        {pages.length === 0 ? (
          <EmptyState
            icon={FileText}
            tone="indigo"
            title="Noch keine Unterseiten"
            description="Tippe „Über uns”, „Karriere”, „Standorte” oder was auch immer — die Navigation aktualisiert sich automatisch."
          />
        ) : (
          <ul className="space-y-3">
            {pages.map((p) => (
              <li key={p.id}>
                <PageRowComp page={p} websiteSlug={website.slug} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {pages.some((p) => !p.is_published) ? (
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <EyeOff className="h-3.5 w-3.5" /> = unveröffentlicht ·{" "}
          <Eye className="ml-2 h-3.5 w-3.5" /> = öffentlich
        </p>
      ) : null}
    </div>
  );
}
