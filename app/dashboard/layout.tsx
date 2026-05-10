import { User } from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { requireUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();

  return (
    <div className="flex flex-1">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/80 sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b px-6 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <span className="bg-secondary inline-flex h-8 w-8 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-4 w-4" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-muted-foreground text-[11px] tracking-wide uppercase">
                Eingeloggt als
              </span>
              <span className="text-foreground max-w-[60vw] truncate text-sm font-medium">
                {user.email}
              </span>
            </div>
          </div>
          <SignOutButton />
        </header>
        <main className="bg-muted/30 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
