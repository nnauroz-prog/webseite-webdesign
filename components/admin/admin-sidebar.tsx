"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CreditCard,
  Globe,
  Inbox,
  LayoutDashboard,
  Palette,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { label: "Übersicht", href: "/admin", icon: LayoutDashboard },
  { label: "Websites", href: "/admin/websites", icon: Globe },
  { label: "Templates", href: "/admin/templates", icon: Palette },
  { label: "Anfragen", href: "/admin/leads", icon: Inbox },
  { label: "Bewerbungen", href: "/admin/applications", icon: Briefcase },
  { label: "Abos", href: "/admin/subscriptions", icon: CreditCard },
] as const;

export function AdminSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="border-border bg-card hidden w-60 shrink-0 border-r md:flex md:flex-col">
      <div className="border-border flex h-14 items-center border-b px-5 text-sm font-semibold">
        Sitalo · Admin
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-border border-t px-3 py-4">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground block rounded-md px-3 py-2 text-sm transition-colors"
        >
          ← Zum Kunden-Dashboard
        </Link>
      </div>
    </aside>
  );
}
