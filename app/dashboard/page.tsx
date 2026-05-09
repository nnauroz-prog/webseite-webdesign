import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardHomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Übersicht</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Willkommen bei SitePilot. Hier verwaltest du später deine Inhalte.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Website</CardTitle>
            <CardDescription>Stammdaten, Hero, Über-uns, SEO.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Wird in Phase 3 freigeschaltet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Anfragen</CardTitle>
            <CardDescription>
              Eingehende Kontakt- und Bewerbungs-Formulare.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Wird in Phase 6 freigeschaltet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vorschau</CardTitle>
            <CardDescription>
              Öffentliche Website unter /site/&lt;slug&gt;.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Wird in Phase 4 freigeschaltet.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
