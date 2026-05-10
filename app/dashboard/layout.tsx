import { User } from "lucide-react";

import { MobileNav } from "@/components/dashboard/mobile-nav";
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
        <header className="border-border bg-background/80 sticky top-0 z-10 flex h-16 items-center justify-between gap-2 border-b px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <MobileNav />
            <span className="bg-secondary inline-flex h-8 w-8 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-4 w-4" />
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-muted-foreground hidden text-[11px] tracking-wide uppercase sm:block">
                Eingeloggt als
              </span>
              <span className="text-foreground max-w-[40vw] truncate text-sm font-medium sm:max-w-[60vw]">
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
