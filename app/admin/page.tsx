import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin" };

export default function AdminHomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Admin-Bereich</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Verwaltung aller Kunden, Websites, Templates, Leads und Bewerbungen.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kunden &amp; Websites</CardTitle>
            <CardDescription>
              Slug ändern, aktivieren, Template zuweisen.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Wird in Phase 7 freigeschaltet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads</CardTitle>
            <CardDescription>Kontaktformular-Eingänge.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Wird in Phase 7 freigeschaltet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bewerbungen</CardTitle>
            <CardDescription>Eingehende Bewerbungen.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Wird in Phase 7 freigeschaltet.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
