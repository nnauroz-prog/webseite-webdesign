import Link from "next/link";

import { SitaloLogo } from "@/components/sitalo-logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

const DEFAULT_NAV: NavItem[] = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#beispiele", label: "Beispiele" },
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/pricing", label: "Preise" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Shared marketing header used on /, /pricing, /anfrage.
 *
 * CTA hierarchy reflects the new "we build it for you" positioning:
 *   - "Website anfragen" is the primary action — solid button
 *   - "Kundenlogin" is secondary — text link
 * Self-service onboarding ("Kostenlos starten") is intentionally
 * absent here. The customer reaches the dashboard via /login after
 * the agency engagement starts.
 */
export function MarketingHeader({
  nav = DEFAULT_NAV,
  className,
}: {
  nav?: NavItem[];
  className?: string;
}) {
  return (
    <header
      className={cn(
        "border-border/40 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6">
        <Link href="/" aria-label="Sitalo Webdesign" className="shrink-0">
          <SitaloLogo size="md" priority />
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground rounded-full px-3 py-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground hidden rounded-full px-4 py-2 text-sm font-medium transition-colors sm:inline-flex"
          >
            Kundenlogin
          </Link>
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium tracking-tight shadow-sm transition-all hover:shadow"
          >
            Website anfragen
          </Link>
        </div>
      </div>
    </header>
  );
}
