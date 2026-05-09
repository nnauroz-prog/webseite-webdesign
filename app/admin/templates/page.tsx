import type { Metadata } from "next";

import { TemplateCreateForm } from "@/components/admin/template-create-form";
import { TemplateRow } from "@/components/admin/template-row";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/supabase/auth";
import type { TemplateRow as TemplateModel } from "@/types/website";

export const metadata: Metadata = { title: "Templates" };

export default async function AdminTemplatesPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });
  const templates = (data as TemplateModel[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Branchen-Designs, die Kunden in ihrem Dashboard auswählen können.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neues Template</CardTitle>
          <CardDescription>
            Branche bestimmt das visuelle Theme:{" "}
            <span className="font-mono text-xs">pflegedienst</span>,{" "}
            <span className="font-mono text-xs">arztpraxis</span>,{" "}
            <span className="font-mono text-xs">friseur</span> ergeben jeweils
            eine eigene Farbpalette. Andere Branchen fallen auf den Default-Look
            zurück.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateCreateForm />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-medium">
          Bestehende Templates ({templates.length})
        </h2>
        {templates.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            Es wurden noch keine Templates angelegt.
          </div>
        ) : (
          <div className="bg-card overflow-hidden rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-left text-xs tracking-wide uppercase">
                <tr>
                  <th className="px-4 py-3">Name / Branche</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {templates.map((t) => (
                  <TemplateRow key={t.id} template={t} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
