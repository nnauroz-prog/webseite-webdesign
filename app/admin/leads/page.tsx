import type { Metadata } from "next";

import { AdminLeadRow } from "@/components/admin/admin-lead-row";
import { requireAdmin } from "@/lib/supabase/auth";
import type { LeadRow as LeadModel, WebsiteRow } from "@/types/website";

export const metadata: Metadata = { title: "Alle Anfragen" };

export default async function AdminLeadsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: leadsData }, { data: websitesData }] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("websites").select("id, slug, business_name"),
  ]);

  const leads = (leadsData as LeadModel[] | null) ?? [];
  const websites =
    (websitesData as
      | Pick<WebsiteRow, "id" | "slug" | "business_name">[]
      | null) ?? [];
  const websiteById = new Map(websites.map((w) => [w.id, w]));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Anfragen (alle Kunden)
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Plattform-weite Übersicht. Nur Admins können Anfragen löschen.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          Es liegen keine Anfragen vor.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => {
            const w = websiteById.get(l.website_id);
            return (
              <AdminLeadRow
                key={l.id}
                lead={l}
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
