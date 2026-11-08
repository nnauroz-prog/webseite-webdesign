"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { SitaloLogo } from "@/components/sitalo-logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

/**
 * Default nav for the marketing site. Each entry points to a real
 * page route. „Preise" zeigt auf die Geldseite /website-erstellen-lassen:
 * Dort stehen alle Pakete mit Preis und Dauer, und sie ist das Ziel für
 * den wichtigsten Suchbegriff. /pakete bleibt über die Geldseite und die
 * Fußzeile erreichbar.
 */
const DEFAULT_NAV: NavItem[] = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/branchen", label: "Branchen" },
  { href: "/ablauf", label: "Ablauf" },
  { href: "/website-erstellen-lassen", label: "Preise" },
  { href: "/journal", label: "Journal" },
  { href: "/kontakt", label: "Kontakt" },
];

// Mobil: „Startseite" als erster Eintrag, FAQ vor Kontakt. Abgeleitet aus
// DEFAULT_NAV, damit Desktop und Mobile nicht auseinanderdriften.
const MOBILE_NAV: NavItem[] = [
  { href: "/", label: "Startseite" },
  ...DEFAULT_NAV.slice(0, -1),
  { href: "/faq", label: "FAQ" },
  ...DEFAULT_NAV.slice(-1),
];

const SCHNELL: NavItem[] = [
  { href: "/termin", label: "Termin buchen" },
  { href: "/audit", label: "Kostenlose Durchsicht" },
  { href: "/anfrage", label: "Anfrage schreiben" },
];

/** Öffnet die Suche (command-palette.tsx, geladen über global-extras.tsx). */
function sucheOeffnen() {
  window.dispatchEvent(new Event("sitalo:suche"));
}

function istAktiv(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Globale Leiste im Apple-Stil (.globalnav, app/apple.css): 44 px hoch
 * (mobil 48 px), immer helles Milchglas, kleine 12-px-Links über die
 * ganze Breite verteilt, Logo klein links, rechts Suche und – nur auf
 * Seiten ohne lokale Produktleiste – eine kleine Pille „Anfragen“.
 *
 * Kein Scroll-Listener: Das Glas ist immer an, nichts wechselt beim
 * Scrollen (ruhig am iPhone). Auf Seiten mit Produktleiste
 * (produktleiste.tsx) scrollt diese Leiste weg (position: relative),
 * nur die Produktleiste klebt.
 *
 * Mobil: Logo, Suche und Burger; das Menü ist vollflächig hell.
 */
export function MarketingHeader({
  nav = DEFAULT_NAV,
  className,
  cta = true,
  ctaMobil = false,
}: {
  nav?: NavItem[];
  className?: string;
  /** Kleine „Anfragen“-Pille rechts. Seiten mit Produktleiste: false. */
  cta?: boolean;
  /** „Anfragen“ auch am Handy, links neben der Suche (Startseite ohne
   *  Produktleiste). Standard aus, damit Unterseiten unverändert bleiben. */
  ctaMobil?: boolean;
  /** @deprecated Wirkungslos seit der Apple-Leiste (immer hell).
   *  Bleibt im Typ, damit bestehende Aufrufe nicht brechen. */
  tone?: "light" | "dark";
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className={cn("globalnav print:hidden", className)}>
        <nav aria-label="Hauptnavigation" className="globalnav-innen">
          <ul className="globalnav-liste">
            <li>
              <Link href="/" className="globalnav-link -ml-2">
                <SitaloLogo size="xs" hideTagline />
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="globalnav-link nav-link-underline"
                  aria-current={istAktiv(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center">
              <a href="tel:+491607621876" className="globalnav-tel" aria-label="0160 7621876 anrufen">
                0160&nbsp;7621876
              </a>
              <button
                type="button"
                onClick={sucheOeffnen}
                aria-label="Seite durchsuchen"
                className="globalnav-icon"
              >
                <Search className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
              </button>
              {cta ? (
                <Link href="/anfrage" className="btn-signal btn-klein ml-2">
                  Anfragen
                </Link>
              ) : null}
            </li>
          </ul>

          {/* Mobil: Logo links, Suche und Burger rechts. */}
          <Link
            href="/"
            className="flex min-h-11 items-center min-[834px]:hidden"
           
            onClick={() => setMenuOpen(false)}
          >
            <SitaloLogo size="xs" hideTagline />
          </Link>
          <div className="globalnav-mobil">
            {ctaMobil ? (
              <Link
                href="/anfrage"
                className="btn-signal btn-klein mr-1 min-h-8 px-[14px] text-[14px]"
                onClick={() => setMenuOpen(false)}
              >
                Anfragen
              </Link>
            ) : null}
            <button
              type="button"
              onClick={sucheOeffnen}
              aria-label="Seite durchsuchen"
              className="globalnav-icon"
            >
              <Search className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="globalnav-icon"
            >
              <Burger offen={menuOpen} />
            </button>
          </div>
        </nav>
      </header>

      {/* Vollbild-Menü bewusst AUSSERHALB vom <header>: backdrop-filter
          erzeugt einen Containing Block, der fixed-Kinder clippt. */}
      <MobileFullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

/** Zwei Striche, die zum X werden (.burger, app/globals.css + apple.css). */
function Burger({ offen }: { offen: boolean }) {
  return (
    <span className="burger" data-offen={offen} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

/**
 * Vollbild-Menü auf dem Handy im Apple-Stil: helles Milchglas
 * (.menue-glas), Kopfzeile wie die Leiste (48 px, X genau auf dem
 * Burger), große Einträge ohne Haarlinien. Auftritt gestaffelt
 * (opacity, 4 px von oben, 20 ms je Eintrag), Schließen ohne Staffel,
 * bei reduzierter Bewegung nur eine kurze Blende.
 */
function MobileFullscreenMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string | null;
}) {
  const eintrag = (i: number) => ({
    className: cn(
      "transition-[opacity,transform] motion-reduce:transform-none motion-reduce:transition-none",
      open
        ? "translate-y-0 opacity-100 duration-[320ms] ease-[var(--ease-apple)]"
        : "-translate-y-1 opacity-0 duration-[160ms] ease-[var(--ease-ab)]",
    ),
    style: { transitionDelay: open ? `${Math.min(20 * i, 200)}ms` : "0ms" },
  });

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Hauptmenü"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "menue-glas fixed inset-0 z-[60] flex flex-col transition-[opacity,visibility] min-[834px]:hidden print:hidden motion-reduce:duration-150",
        open
          ? "visible opacity-100 duration-[240ms] ease-[var(--ease-apple)]"
          : "pointer-events-none invisible opacity-0 duration-[160ms] ease-[var(--ease-ab)]",
      )}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
      }}
    >
      {/* Gleiche Geometrie wie die Leiste: nichts springt beim Öffnen. */}
      <div className="globalnav-innen h-12 w-full shrink-0">
        <Link href="/" onClick={onClose} className="flex min-h-11 items-center">
          <SitaloLogo size="xs" hideTagline />
        </Link>
        <div className="globalnav-mobil">
          <button type="button" onClick={onClose} aria-label="Menü schließen" className="globalnav-icon">
            <Burger offen={open} />
          </button>
        </div>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pt-4 pb-6"
        style={{
          WebkitOverflowScrolling: "touch",
          paddingLeft: "max(48px, env(safe-area-inset-left))",
          paddingRight: "max(24px, env(safe-area-inset-right))",
        }}
      >
        <nav aria-label="Hauptmenü">
          <ul>
            {MOBILE_NAV.map((item, i) => {
              const e = eintrag(i);
              return (
                <li key={item.href} className={e.className} style={e.style}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="menue-eintrag"
                    aria-current={istAktiv(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={cn("mt-10", eintrag(MOBILE_NAV.length).className)} style={eintrag(MOBILE_NAV.length).style}>
          <p className="text-muted-foreground text-[12px] leading-[1.33]" id="menue-schnell">
            Schnellzugriff
          </p>
          <ul aria-labelledby="menue-schnell" className="mt-2">
            {SCHNELL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onClose} className="menue-eintrag-klein">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fuß mit Hauptaktion und Kontakt */}
      <div
        className="space-y-3 pt-4"
        style={{
          paddingLeft: "max(24px, env(safe-area-inset-left))",
          paddingRight: "max(24px, env(safe-area-inset-right))",
        }}
      >
        <Link href="/anfrage" onClick={onClose} className="btn-signal btn-gross w-full">
          Website anfragen
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-6 text-[17px]">
          <a href="tel:+491607621876" className="link-chevron link-chevron-frei">
            Anrufen<span aria-hidden="true" className="chev">›</span>
          </a>
          <Link href="/termin" onClick={onClose} className="link-chevron link-chevron-frei">
            Termin<span aria-hidden="true" className="chev">›</span>
          </Link>
          <a href="/sitalo-kontakt.vcf" download="Sitalo-Webdesign.vcf" className="link-chevron link-chevron-frei">
            Speichern<span aria-hidden="true" className="chev">›</span>
          </a>
        </div>
        <p className="text-muted-foreground text-center text-[12px] leading-[1.33]">0160&nbsp;7621876 · Hamburg</p>
      </div>
    </div>
  );
}
