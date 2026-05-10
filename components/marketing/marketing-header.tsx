"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { SitaloLogo } from "@/components/sitalo-logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

/**
 * Default nav for the homepage onepager — each entry is either an
 * absolute path or a `/#anchor` reference that smooth-scrolls (CSS
 * scroll-margin on the target sections handles the sticky-header
 * offset).
 */
const DEFAULT_NAV: NavItem[] = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#branchen", label: "Branchen" },
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/#pakete", label: "Pakete" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#kontakt", label: "Kontakt" },
];

/**
 * Shared marketing header used on /, /pricing, /anfrage.
 *
 * CTA hierarchy reflects the "we build it for you" positioning:
 *   - "Website anfragen" is the primary action — solid button
 * No login / register / dashboard links in the public surface —
 * Sitalo is positioned as a done-for-you agency, not a self-service
 * SaaS portal. Existing customers reach /login by direct URL.
 *
 * Sticky header with a subtle scroll-triggered shadow + intensified
 * backdrop blur once the user starts scrolling — keeps the bar quiet
 * at the top of the page and gives it presence over content below.
 */
export function MarketingHeader({
  nav = DEFAULT_NAV,
  className,
}: {
  nav?: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Subtle visual shift when the user scrolls past the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on navigation. Path-change is the safest signal —
  // anchor clicks within the same page don't trigger this, so we
  // additionally close it from the per-link onClick below.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Escape closes the sheet.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200",
        scrolled
          ? "border-border/60 bg-background/95 shadow-[0_1px_0_0_rgb(0_0_0/0.02)]"
          : "border-border/40 bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-6">
        <Link
          href="/"
          aria-label="Sitalo Webdesign"
          className="shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <SitaloLogo size="md" priority />
        </Link>

        {/* Desktop nav */}
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
          {/* Desktop CTA */}
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 hidden h-10 items-center justify-center rounded-full px-5 text-sm font-medium tracking-tight shadow-sm transition-all hover:shadow md:inline-flex"
          >
            Website anfragen
          </Link>

          {/* Mobile compact CTA + burger */}
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-9 items-center justify-center rounded-full px-3.5 text-xs font-medium tracking-tight shadow-sm transition-all md:hidden"
          >
            Anfragen
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="border-border bg-background hover:bg-secondary inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors md:hidden"
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <MobileSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={nav}
      />
    </header>
  );
}

function MobileSheet({
  open,
  onClose,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
}) {
  return (
    <>
      {/* Backdrop — fades in/out, click closes. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 top-16 z-30 bg-foreground/40 transition-opacity duration-200 md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />
      {/* Sheet */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Hauptmenü"
        className={cn(
          "bg-background fixed inset-x-0 top-16 z-40 border-b shadow-2xl transition-transform duration-200 md:hidden",
          open ? "translate-y-0" : "pointer-events-none -translate-y-2 opacity-0",
        )}
        style={{
          maxHeight: "calc(100dvh - 4rem)",
          overflowY: "auto",
        }}
      >
        <nav className="flex flex-col gap-1 px-6 py-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-foreground hover:bg-secondary -mx-2 rounded-lg px-4 py-3 text-base font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-border/60 mt-3 border-t pt-4">
            <Link
              href="/anfrage"
              onClick={onClose}
              className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-base font-medium shadow-md transition-all"
            >
              Website anfragen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
