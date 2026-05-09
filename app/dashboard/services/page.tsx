import type { Metadata } from "next";

import { ServiceCreateForm } from "@/components/dashboard/services/service-create-form";
import { ServiceRow } from "@/components/dashboard/services/service-row";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import type { ServiceRow as ServiceModel } from "@/types/website";

export const metadata: Metadata = { title: "Leistungen" };

export default async function ServicesPage() {
  const { supabase, website } = await requireCurrentWebsite();

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("website_id", website.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const services = (data as ServiceModel[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leistungen</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Was du anbietest. Wird im Leistungs-Bereich der Website angezeigt.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neue Leistung</CardTitle>
          <CardDescription>
            Trage Titel und Kurzbeschreibung ein.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceCreateForm />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-base font-medium">
          Bestehende Leistungen ({services.length})
        </h2>
        {services.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            Du hast noch keine Leistungen angelegt.
          </p>
        ) : (
          <div className="space-y-3">
            {services.map((s) => (
              <ServiceRow key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
