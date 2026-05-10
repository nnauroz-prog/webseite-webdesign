import { User } from "lucide-react";

import { MobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { SitaloLogo } from "@/components/sitalo-logo";
import { getActiveWebsiteId } from "@/lib/active-website";
import { getCurrentPlan } from "@/lib/billing/current-plan";
import { getSiteLimit } from "@/lib/stripe/plans";
import {
  listUserWebsites,
  requireUser,
} from "@/lib/supabase/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();

  // Multi-site: load website list + cookie-selected active id once
  // at the layout level so every dashboard child gets the same
  // context via the SiteSwitcher. Plan-gating: figure out whether
  // the user is allowed to create another site so the switcher's
  // footer flips between "+ Neue Website" and "Premium für mehr
  // Sites" automatically.
  const websites = await listUserWebsites();
  const cookieId = await getActiveWebsiteId();
  const activeWebsiteId =
    websites.find((w) => w.id === cookieId)?.id ?? websites[0]?.id ?? "";
  const plan = await getCurrentPlan(user.id);
  const canAddMore = websites.length < getSiteLimit(plan);

  return (
    <div className="flex flex-1">
      <DashboardSidebar
        websites={websites}
        activeWebsiteId={activeWebsiteId}
        canAddMore={canAddMore}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sticky header
         *  - z-30 sits below the mobile-drawer backdrop (z-[80]) and
         *    the drawer itself (z-[90]) so the email/SignOut bleeds
         *    don't show through when the drawer is open.
         *  - On phones we hide the user-email text and just show a
         *    compact icon + the sign-out button so the row never
         *    overflows. */}
        <header className="border-border bg-background/85 sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b px-3 backdrop-blur sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <MobileNav
              websites={websites}
              activeWebsiteId={activeWebsiteId}
              canAddMore={canAddMore}
            />
            <span className="md:hidden">
              <SitaloLogo size="sm" />
            </span>
            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              <span className="bg-secondary inline-flex h-8 w-8 items-center justify-center rounded-full">
                <User className="text-muted-foreground h-4 w-4" />
              </span>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-muted-foreground text-[11px] tracking-wide uppercase">
                  Eingeloggt als
                </span>
                <span className="text-foreground max-w-[60vw] truncate text-sm font-medium">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
          <SignOutButton />
        </header>
        <main className="bg-muted/30 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
