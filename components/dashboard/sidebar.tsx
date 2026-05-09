"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: NavItem[] = [
  { label: "Übersicht", href: "/dashboard", icon: LayoutDashboard },
  { label: "Website", href: "/dashboard/website", icon: Home },
  { label: "Leistungen", href: "/dashboard/services", icon: Settings },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Galerie", href: "/dashboard/gallery", icon: ImageIcon },
  { label: "Anfragen", href: "/dashboard/leads", icon: Inbox },
];

export function DashboardSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="border-border bg-card hidden w-60 shrink-0 border-r md:flex md:flex-col">
      <div className="border-border flex h-14 items-center border-b px-5 text-sm font-semibold">
        SitePilot
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
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
    </aside>
  );
}
