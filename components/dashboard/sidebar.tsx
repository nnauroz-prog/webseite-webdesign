"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CreditCard,
  Globe,
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
  /** Tailwind class for the icon's color tint when not active. */
  tone: string;
};

const items: NavItem[] = [
  {
    label: "Übersicht",
    href: "/dashboard",
    icon: LayoutDashboard,
    tone: "text-indigo-500",
  },
  {
    label: "Website",
    href: "/dashboard/website",
    icon: Globe,
    tone: "text-violet-500",
  },
  {
    label: "Leistungen",
    href: "/dashboard/services",
    icon: Settings,
    tone: "text-sky-500",
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
    tone: "text-emerald-500",
  },
  {
    label: "Galerie",
    href: "/dashboard/gallery",
    icon: ImageIcon,
    tone: "text-pink-500",
  },
  {
    label: "Anfragen",
    href: "/dashboard/leads",
    icon: Inbox,
    tone: "text-amber-500",
  },
  {
    label: "Bewerbungen",
    href: "/dashboard/applications",
    icon: Briefcase,
    tone: "text-orange-500",
  },
  {
    label: "Abrechnung",
    href: "/dashboard/billing",
    icon: CreditCard,
    tone: "text-rose-500",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="from-background to-secondary/40 hidden w-64 shrink-0 flex-col border-r bg-gradient-to-b md:flex">
      {/* Brand */}
      <div className="border-border flex h-16 items-center gap-2.5 border-b px-5">
        <span className="from-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br to-violet-600 text-[15px] font-bold text-white shadow-sm">
          S
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">SitePilot</span>
          <span className="text-muted-foreground text-[11px]">
            Dashboard
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4 text-sm">
        {items.map(({ label, href, icon: Icon, tone }) => {
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

      {/* Footer */}
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
