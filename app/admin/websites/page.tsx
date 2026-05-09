import type { Metadata } from "next";
import Link from "next/link";

import { StatusPill } from "@/components/dashboard/status-pill";
import { requireAdmin } from "@/lib/supabase/auth";
import type { WebsiteRow } from "@/types/website";

type ProfileLite = { id: string; email: string; full_name: string | null };

export const metadata: Metadata = { title: "Alle Websites" };

export default async function AdminWebsitesPage() {
  const { supabase } = await requireAdmin();

  // Fetch in parallel: all websites and all profile rows. RLS lets admin
  // read both. Joining client-side keeps the SQL simple.
  const [{ data: websites }, { data: profiles }] = await Promise.all([
    supabase
      .from("websites")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, email, full_name"),
  ]);

  const ws = (websites as WebsiteRow[] | null) ?? [];
  const ownerById = new Map<string, ProfileLite>();
  for (const p of (profiles as ProfileLite[] | null) ?? []) {
    ownerById.set(p.id, p);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Alle Websites</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Plattform-weite Übersicht. Klicke auf eine Zeile für Details.
        </p>
      </div>

      {ws.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          Es wurden noch keine Websites angelegt.
        </div>
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-left text-xs tracking-wide uppercase">
              <tr>
                <th className="px-4 py-3">Firma / Slug</th>
                <th className="px-4 py-3">Inhaber:in</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Angelegt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ws.map((w) => {
                const owner = ownerById.get(w.user_id);
                return (
                  <tr key={w.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/websites/${w.id}`}
                        className="text-foreground block font-medium hover:underline"
                      >
                        {w.business_name}
                      </Link>
                      <div className="text-muted-foreground font-mono text-xs">
                        /site/{w.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">
                        {owner?.full_name?.trim() || "—"}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {owner?.email ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill
                        status={w.is_active ? "accepted" : "closed"}
                        label={w.is_active ? "Öffentlich" : "Privat"}
                      />
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-xs">
                      {formatDate(w.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}
