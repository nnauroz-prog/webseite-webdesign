"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="from-background to-secondary/40 hidden w-64 shrink-0 flex-col border-r bg-gradient-to-b md:flex">
      <div className="border-border flex h-16 items-center gap-2.5 border-b px-5">
        <span className="from-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br to-violet-600 text-[15px] font-bold text-white shadow-sm">
          S
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Sitalo</span>
          <span className="text-muted-foreground text-[11px]">Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4 text-sm">
        {NAV_ITEMS.map(({ label, href, icon: Icon, tone }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                active
                  ? "bg-primary/10 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {active ? (
                <span className="bg-primary absolute top-1.5 bottom-1.5 -left-3 w-0.5 rounded-r-full" />
              ) : null}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-primary" : tone,
                )}
              />
              <span>{label}</span>
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
  );
}
