import type { Metadata } from "next";

import { LeadRow } from "@/components/dashboard/leads/lead-row";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import type { LeadRow as LeadModel } from "@/types/website";

export const metadata: Metadata = { title: "Anfragen" };

export default async function LeadsPage() {
  const { supabase, website } = await requireCurrentWebsite();

  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("website_id", website.id)
    .order("created_at", { ascending: false });

  const leads = (data as LeadModel[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Anfragen</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Eingegangene Nachrichten aus dem Kontaktformular deiner Website.
        </p>
      </div>

      {!website.contact_form_enabled && (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          Hinweis: Dein Kontaktformular ist aktuell deaktiviert. Du erhältst
          keine neuen Nachrichten, bis du es in den Website-Einstellungen wieder
          aktivierst.
        </div>
      )}

      {leads.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          Noch keine Anfragen. Sobald jemand das Kontaktformular ausfüllt,
          erscheint die Nachricht hier.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <LeadRow key={l.id} lead={l} />
          ))}
        </div>
      )}
    </div>
  );
}
