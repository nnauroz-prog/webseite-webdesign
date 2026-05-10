import type { Metadata } from "next";
import { Users } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { TeamCreateForm } from "@/components/dashboard/team/team-create-form";
import { TeamRow } from "@/components/dashboard/team/team-row";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import type { TeamMemberRow as TeamModel } from "@/types/website";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const { supabase, website } = await requireCurrentWebsite();

  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("website_id", website.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const members = (data as TeamModel[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Wer arbeitet bei dir? Wird im Team-Bereich der Website angezeigt.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neues Teammitglied</CardTitle>
          <CardDescription>
            Foto kann nach dem Anlegen hochgeladen werden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamCreateForm />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-base font-medium">
          Bestehende Mitglieder ({members.length})
        </h2>
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            tone="emerald"
            title="Noch keine Team-Mitglieder"
            description="Stell dein Team vor — Name, Rolle, kurzer Steckbrief. Foto kannst du nach dem Anlegen hochladen."
          />
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <TeamRow key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
