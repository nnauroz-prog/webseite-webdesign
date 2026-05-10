import type { Metadata } from "next";
import { Briefcase } from "lucide-react";

import { ApplicationRow } from "@/components/dashboard/applications/application-row";
import { EmptyState } from "@/components/dashboard/empty-state";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import type { ApplicationRow as ApplicationModel } from "@/types/website";

export const metadata: Metadata = { title: "Bewerbungen" };

export default async function ApplicationsPage() {
  const { supabase, website } = await requireCurrentWebsite();

  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("website_id", website.id)
    .order("created_at", { ascending: false });

  const applications = (data as ApplicationModel[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bewerbungen</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Eingegangene Bewerbungen aus dem Bewerbungsformular deiner Website.
        </p>
      </div>

      {!website.application_form_enabled && (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          Hinweis: Dein Bewerbungsformular ist aktuell deaktiviert. Du erhältst
          keine neuen Bewerbungen, bis du es in den Website-Einstellungen wieder
          aktivierst.
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          tone="orange"
          title="Noch keine Bewerbungen"
          description={
            website.application_form_enabled
              ? "Sobald sich jemand über deine Website bewirbt, erscheint die Bewerbung hier."
              : "Aktiviere das Bewerbungsformular in den Website-Einstellungen, damit Bewerbungen reinkommen können."
          }
          primaryAction={
            !website.application_form_enabled
              ? {
                  label: "Bewerbungsformular aktivieren",
                  href: "/dashboard/website",
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <ApplicationRow key={a.id} application={a} />
          ))}
        </div>
      )}
    </div>
  );
}
