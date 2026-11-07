"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

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
// „Preise" zeigt auf die Geldseite /website-erstellen-lassen: Dort stehen
// alle Pakete mit Preis und Dauer, und sie ist das Ziel für den wichtigsten
// Suchbegriff. /pakete bleibt über die Geldseite und die Fußzeile erreichbar.
const DEFAULT_NAV: NavItem[] = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/branchen", label: "Branchen" },
  { href: "/ablauf", label: "Ablauf" },
  { href: "/website-erstellen-lassen", label: "Preise" },
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
 * Klebende Kopfzeile: oben auf der Seite ruhig (transparent bzw. auf
 * Teer), nach 80 px Scrollweg aus hellem Milchglas mit dünner Haarlinie
 * (.kopf-glas, app/globals.css, Block „Laden-Linie“), auch auf Seiten
 * mit dunklem Hero. Die Linie ist ein box-shadow, die Höhe bleibt 64 px.
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
  // Dunkle Seiten: Ungescrollt steht der Kopf auf Teer mit hellem Logo.
  // Nach dem Hero wird er zu hellem Milchglas mit dunklem Logo, denn
  // darunter folgen helle Abschnitte; dunkles Glas darüber würde grau.
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
          "sticky top-0 z-40 transition-[background-color,box-shadow] duration-[var(--t-mittel)] ease-[var(--ease-wechsel)] motion-reduce:transition-none print:hidden",
          scrolled
            ? "kopf-glas"
            : onDark
              ? "bg-foreground"
              : "bg-transparent",
          className,
        )}
      >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center"
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

          {/* Mobile compact CTA + burger. Sichtbar 36 px hoch, die
              Trefferfläche reicht per ::after auf 44 px. */}
          <Link
            href="/anfrage"
            className={cn(
              "relative inline-flex h-9 items-center after:absolute after:-inset-1 justify-center rounded-[2px] px-3.5 text-[13px] font-semibold transition-colors lg:hidden",
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
              "relative inline-flex h-9 w-9 items-center justify-center rounded-[2px] border transition-colors after:absolute after:-inset-1 lg:hidden",
              onDark ? "border-background/40 text-background hover:bg-background/10" : "border-foreground/70 bg-transparent hover:bg-secondary",
            )}
          >
            <Burger offen={menuOpen} />
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

/** Zwei Striche, die zum X werden (.burger, app/globals.css). */
function Burger({ offen }: { offen: boolean }) {
  return (
    <span className="burger" data-offen={offen} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

const KONTAKT_KNOPF =
  "border-background/40 text-background hover:bg-background hover:text-foreground inline-flex h-11 items-center rounded-[2px] border px-5 text-[13.5px] font-semibold transition-colors";

/**
 * Vollbild-Menü auf dem Handy: dunkles Milchglas (.menue-glas), oben
 * dieselbe Zeile wie die Kopfzeile (64 px, Logo links, X genau auf dem
 * Burger), darunter große ruhige Einträge mit Haarlinien. Die Einträge
 * kommen gestaffelt von oben (opacity, transform), beim Schließen gehen
 * sie ohne Staffel. Bei reduzierter Bewegung nur eine kurze Blende.
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
        "menue-glas text-background fixed inset-0 z-[60] flex flex-col transition-[opacity,visibility] lg:hidden print:hidden motion-reduce:duration-150",
        open
          ? "visible opacity-100 duration-[var(--t-mittel)] ease-[var(--ease-aus)]"
          : "pointer-events-none invisible opacity-0 duration-[var(--t-kurz)] ease-[var(--ease-ab)]",
      )}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)",
      }}
    >
      {/* Gleiche Geometrie wie die Kopfzeile: nichts springt beim Öffnen. */}
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 px-5 sm:px-6">
        <SitaloLogo size="md" hideTaglineOnMobile tone="light" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Menü schließen"
          className="border-background/40 text-background hover:bg-background/10 relative inline-flex h-9 w-9 items-center justify-center rounded-[2px] border transition-colors after:absolute after:-inset-1"
        >
          <Burger offen={open} />
        </button>
      </div>

      {/* Hauptnavigation, scrollbar wenn der Viewport zu klein ist.
          min-h-0 lässt die flex-1 Fläche unter ihre Inhaltshöhe
          schrumpfen; overscroll-contain hält das Scrollen im Menü. */}
      <nav
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pt-4 pb-6 sm:px-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {MOBILE_NAV.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "border-background/10 text-background flex min-h-12 shrink-0 items-center border-b py-2 text-[1.75rem] font-bold tracking-[-0.025em] [font-stretch:112%] transition-[opacity,transform] motion-reduce:transform-none motion-reduce:transition-none sm:text-4xl",
              open
                ? "translate-y-0 opacity-100 duration-[var(--t-mittel)] ease-[var(--ease-aus)]"
                : "-translate-y-2 opacity-0 duration-[var(--t-kurz)] ease-[var(--ease-ab)]",
            )}
            style={{ transitionDelay: open ? `${Math.min(40 * i, 240)}ms` : "0ms" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Fußzeile mit Hauptaktion und Kontakt */}
      <div className="border-background/10 space-y-6 border-t px-5 pt-6 pb-4 sm:px-6">
        <Link href="/anfrage" onClick={onClose} className="btn-signal w-full">
          Website anfragen
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2.5">
            <a href="tel:+491607621876" className={KONTAKT_KNOPF}>
              Anrufen
            </a>
            <a href="mailto:info@sitalo.de" className={KONTAKT_KNOPF}>
              Schreiben
            </a>
            <a href="/sitalo-kontakt.vcf" download="Sitalo-Webdesign.vcf" className={KONTAKT_KNOPF}>
              Speichern
            </a>
          </div>
          <span className="label-mono text-stahl-hell">0160&nbsp;7621876 · Hamburg</span>
        </div>
      </div>
    </div>
  );
}
