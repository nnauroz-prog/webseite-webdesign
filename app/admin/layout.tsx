import Link from "next/link";

import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { requireAdmin } from "@/lib/supabase/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-border bg-background flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-6 text-sm">
          <Link href="/admin" className="font-semibold tracking-tight">
            SitePilot · Admin
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Mein Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="bg-muted/20 flex-1">{children}</main>
    </div>
  );
}
