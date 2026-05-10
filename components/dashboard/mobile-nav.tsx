"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobile navigation drawer for the dashboard. Hamburger button visible
 * only below `md`. Drawer slides in from the left with the same nav
 * items as the desktop sidebar.
 */
export function MobileNav() {
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

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "from-background to-secondary/60 fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r bg-gradient-to-b shadow-xl transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="border-border flex h-16 items-center justify-between border-b px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="from-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br to-violet-600 text-[15px] font-bold text-white shadow-sm">
              S
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                SitePilot
              </span>
              <span className="text-muted-foreground text-[11px]">
                Dashboard
              </span>
            </div>
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
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
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
                <span className="text-base">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-border border-t px-5 py-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            ← Zur Startseite
          </Link>
        </div>
      </aside>
    </>
  );
}
