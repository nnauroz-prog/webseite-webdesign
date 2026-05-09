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
        <header className="border-border bg-background flex h-14 items-center justify-between border-b px-6">
          <div className="text-muted-foreground text-sm">
            Eingeloggt als{" "}
            <span className="text-foreground font-medium">{user.email}</span>
          </div>
          <SignOutButton />
        </header>
        <main className="bg-muted/20 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
