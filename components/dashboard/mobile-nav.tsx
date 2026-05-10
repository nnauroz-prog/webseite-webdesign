"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import { SiteSwitcher } from "@/components/dashboard/site-switcher";
import { SitaloLogo } from "@/components/sitalo-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WebsiteRow } from "@/types/website";

/**
 * Mobile navigation drawer for the dashboard. Hamburger button visible
 * only below `md`. Drawer slides in from the left with the same nav
 * items as the desktop sidebar.
 *
 * Stacking:
 *   - hamburger button: stays in normal flow
 *   - backdrop:        z-[80] — strong opacity so dashboard chrome
 *                      behind doesn't bleed through
 *   - drawer:          z-[90] — above the backdrop and the sticky
 *                      dashboard header (z-10 / z-30)
 */
export function MobileNav({
  websites = [],
  activeWebsiteId = "",
}: {
  websites?: WebsiteRow[];
  activeWebsiteId?: string;
} = {}) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  // Close drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Menü öffnen"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Backdrop — high opacity so the dashboard behind disappears */}
      <div
        className={cn(
          "fixed inset-0 z-[80] bg-black/75 backdrop-blur-md transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer — full width on phones, max 320px on tablets */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[90] flex w-full max-w-[320px] flex-col border-r bg-background shadow-2xl transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="border-border bg-background flex h-16 items-center justify-between border-b px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <SitaloLogo size="sm" />
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Menü schließen"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {websites.length > 0 ? (
          <div className="border-border border-b p-3">
            <SiteSwitcher websites={websites} activeId={activeWebsiteId} />
          </div>
        ) : null}

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4 text-sm">
          {NAV_ITEMS.map(({ label, href, icon: Icon, tone }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all",
                  active
                    ? "bg-primary/10 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active ? "text-primary" : tone,
                  )}
                />
                <span className="text-[15px]">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-border border-t px-5 py-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-xs transition-colors"
          >
            ← Zur Startseite
          </Link>
        </div>
      </aside>
    </>
  );
}
