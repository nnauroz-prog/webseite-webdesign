"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { SitaloLogo } from "@/components/sitalo-logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

/**
 * Default nav for the marketing site. Each entry points to a real
 * page route — these used to be `/#anchor` references back when the
 * site was a single long onepager. Now every nav item opens a
 * dedicated subpage with full content, while the homepage carries a
 * short overview that deep-links into the same routes.
 */
const DEFAULT_NAV: NavItem[] = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/branchen", label: "Branchen" },
  { href: "/ablauf", label: "Ablauf" },
  { href: "/pakete", label: "Pakete" },
  { href: "/journal", label: "Journal" },
  { href: "/kontakt", label: "Kontakt" },
];

// Auf Mobile zeigen wir das Vollbild-Menü mit "Startseite" als
// erstem Eintrag — das Logo oben ist im Vollbild-Menü versteckt,
// also brauchts den expliziten Home-Link. FAQ ist aus der
// Desktop-Nav gewichen (Journal trägt dort mehr Profil), bleibt
// aber im Mobile-Menü, das mehr Platz hat. Abgeleitet aus
// DEFAULT_NAV, damit Desktop und Mobile nicht auseinanderdriften:
// FAQ wird vor dem letzten Eintrag (Kontakt) eingeschoben.
const MOBILE_NAV: NavItem[] = [
  { href: "/", label: "Startseite" },
  ...DEFAULT_NAV.slice(0, -1),
  { href: "/faq", label: "FAQ" },
  ...DEFAULT_NAV.slice(-1),
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
  tone = "light",
}: {
  nav?: NavItem[];
  className?: string;
  /** "dark": die Seite beginnt mit einem dunklen Hero — Logo, Links und
   *  Knöpfe sind hell, bis der Besucher scrollt und der Header seinen
   *  hellen Hintergrund bekommt. */
  tone?: "light" | "dark";
}) {
  const [scrolled, setScrolled] = useState(false);
  const onDark = tone === "dark" && !scrolled;
  const [menuOpen, setMenuOpen] = useState(false);

  // Subtle visual shift when the user scrolls past the hero.
  // Trigger erst bei 80px, damit der Effekt nicht beim leichten
  // Scrollen flackert. Ein einziger sauberer Übergang.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Each link in the sheet calls onClose directly, so menu state is
  // already shut by the time navigation happens — no pathname effect
  // needed.

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
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,border-color] duration-300 print:hidden",
          scrolled
            ? "border-border border-b bg-background"
            : onDark
              ? "bg-foreground border-b border-transparent"
              : "border-transparent border-b bg-transparent",
          className,
        )}
      >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
        <Link
          href="/"
          className="shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <SitaloLogo size="md" hideTaglineOnMobile tone={onDark ? "light" : "dark"} />
        </Link>

        {/* Desktop nav — Gold-Underline-Animation auf Hover über das
            ::after-Pseudo-Element via .nav-link-underline (globals.css). */}
        <nav className="hidden items-center gap-1 text-[14.5px] lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-link-underline relative px-2.5 py-2 font-medium transition-colors lg:px-3",
                onDark ? "text-background/80 hover:text-background" : "text-foreground/80 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+491607621876"
            className={cn(
              "mr-2 hidden text-[14.5px] font-semibold tabular-nums transition-colors xl:inline",
              onDark ? "text-background hover:text-gold" : "text-foreground hover:text-gold-ink",
            )}
          >
            0160&nbsp;7621876
          </a>
          {/* Desktop CTA */}
          <Link
            href="/anfrage"
            className={cn(
              "hidden h-10 items-center justify-center rounded-[2px] px-5 text-[14px] font-semibold transition-colors lg:inline-flex",
              onDark ? "bg-gold text-foreground hover:bg-background" : "bg-foreground text-background hover:bg-gold hover:text-foreground",
            )}
          >
            Website anfragen
          </Link>

          {/* Mobile compact CTA + burger */}
          <Link
            href="/anfrage"
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-[2px] px-3.5 text-[13px] font-semibold transition-colors lg:hidden",
              onDark ? "bg-gold text-foreground" : "bg-foreground text-background",
            )}
          >
            Anfragen
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-[2px] border transition-colors lg:hidden",
              onDark ? "border-background/40 text-background hover:bg-background/10" : "border-foreground/70 bg-transparent hover:bg-secondary",
            )}
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      </header>

      {/* Vollbild-Mobile-Menü — bewusst AUSSERHALB vom <header>,
          weil der Header backdrop-blur hat. backdrop-filter erzeugt
          einen Containing Block, der fixed-positionierte Kinder auf
          die Header-Größe (64px) clippt — das Menü wäre sonst
          unsichtbar. */}
      <MobileFullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

/**
 * Editorial-Vollbild-Menü auf Mobile. Inspiriert von hochwertigen
 * Praxis-/Studio-Sites: dunkle Take-over-Fläche, große ruhige Nav-
 * Items, kein Card-Lärm. Kommt von oben mit kurzem Fade.
 */
function MobileFullscreenMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Hauptmenü"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "bg-foreground text-background fixed inset-0 z-[60] flex flex-col transition-all duration-300 ease-out lg:hidden print:hidden",
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 1rem)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)",
      }}
    >
      {/* Header-Zeile innerhalb des Menüs: Wordmark links, X rechts */}
      <div className="flex items-center justify-between px-6 pt-4">
        <SitaloLogo size="sm" tone="light" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Menü schließen"
          className="border-background/30 text-background hover:bg-background/10 inline-flex h-10 w-10 items-center justify-center rounded-[2px] border transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Hauptnavigation — scrollbar wenn der Viewport zu klein ist.
          min-h-0 ist wichtig, sonst kann die flex-1 Fläche nicht
          unter die Höhe ihres Inhalts schrumpfen → kein Scroll. */}
      <nav
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-6 py-6 sm:gap-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {MOBILE_NAV.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "text-background block shrink-0 py-2.5 text-[2rem] font-bold tracking-[-0.025em] [font-stretch:112%] transition-opacity sm:text-4xl",
              open
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0",
            )}
            style={{
              transitionDuration: "500ms",
              transitionDelay: open ? `${100 + i * 60}ms` : "0ms",
              transitionProperty: "opacity, transform",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer-Zeile mit primärem CTA + Kontakt-Mini-Block */}
      <div className="space-y-6 border-t border-white/10 px-6 pt-6 pb-4">
        <Link
          href="/anfrage"
          onClick={onClose}
          className="btn-signal w-full"
        >
          Website anfragen
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2.5">
            <a
              href="tel:+491607621876"
              className="border-background/40 text-background hover:bg-background hover:text-foreground inline-flex h-10 items-center rounded-[2px] border px-5 text-[13.5px] font-semibold transition-colors"
            >
              Anrufen
            </a>
            <a
              href="mailto:info@sitalo.de"
              className="border-background/40 text-background hover:bg-background hover:text-foreground inline-flex h-10 items-center rounded-[2px] border px-5 text-[13.5px] font-semibold transition-colors"
            >
              Schreiben
            </a>
            <a
              href="/sitalo-kontakt.vcf"
              download="Sitalo-Webdesign.vcf"
              className="border-background/40 text-background hover:bg-background hover:text-foreground inline-flex h-10 items-center rounded-[2px] border px-5 text-[13.5px] font-semibold transition-colors"
            >
              Speichern
            </a>
          </div>
          <span className="label-mono text-stahl-hell">0160&nbsp;7621876 · Hamburg</span>
        </div>
      </div>
    </div>
  );
}
