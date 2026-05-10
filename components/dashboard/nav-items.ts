import {
  Briefcase,
  CreditCard,
  FileText,
  Globe,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind class for the icon's color tint when not active. */
  tone: string;
};

/** Single source of truth for dashboard sidebar + mobile drawer. */
export const NAV_ITEMS: NavItem[] = [
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
    label: "Seiten",
    href: "/dashboard/pages",
    icon: FileText,
    tone: "text-indigo-500",
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
    label: "SEO",
    href: "/dashboard/seo",
    icon: Search,
    tone: "text-violet-500",
  },
  {
    label: "Abrechnung",
    href: "/dashboard/billing",
    icon: CreditCard,
    tone: "text-rose-500",
  },
];
