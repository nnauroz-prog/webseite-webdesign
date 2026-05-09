import type { Metadata } from "next";

import { AdminApplicationRow } from "@/components/admin/admin-application-row";
import { requireAdmin } from "@/lib/supabase/auth";
import type {
  ApplicationRow as ApplicationModel,
  WebsiteRow,
} from "@/types/website";

export const metadata: Metadata = { title: "Alle Bewerbungen" };

export default async function AdminApplicationsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: applicationsData }, { data: websitesData }] =
    await Promise.all([
      supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("websites").select("id, slug, business_name"),
    ]);

  const applications = (applicationsData as ApplicationModel[] | null) ?? [];
  const websites =
    (websitesData as
      | Pick<WebsiteRow, "id" | "slug" | "business_name">[]
      | null) ?? [];
  const websiteById = new Map(websites.map((w) => [w.id, w]));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bewerbungen (alle Kunden)
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Plattform-weite Übersicht. Nur Admins können Bewerbungen löschen.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          Es liegen keine Bewerbungen vor.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => {
            const w = websiteById.get(a.website_id);
            return (
              <AdminApplicationRow
                key={a.id}
                application={a}
                websiteSlug={w?.slug ?? null}
                websiteName={w?.business_name ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
