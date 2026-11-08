import Link from "next/link";

import { BackToTop } from "@/components/marketing/back-to-top";
import { SitaloLogo } from "@/components/sitalo-logo";
import { PREIS_HINWEIS } from "@/lib/pakete-data";

/**
 * Marketing-Fuß im Apple-Stil: helle Fläche (#f5f5f7), 12-px-Schrift in
 * #6e6e73, oben Fußnoten, darunter Brotkrumen, vier Spalten mit kleinen
 * fetten Titeln, Kontaktzeile und Rechtszeile unter Haarlinien.
 *
 * Ankertexte mit Absicht: „Website erstellen lassen" zeigt nur auf die
 * Geldseite, „Webseite erstellen" ohne „lassen" nur auf den Ratgeber.
 *
 * crumb: Name der aktuellen Seite für die Brotkrumen-Zeile (optional).
 */
export function MarketingFooter({ crumb }: { crumb?: string } = {}) {
  const year = new Date().getFullYear();
  return (
    <>
      <BackToTop />
      <footer className="flaeche-hell text-muted-foreground relative text-[12px] leading-[1.33] tracking-[-0.01em] print:hidden">
        <div className="inhalt pt-[17px] pb-[calc(21px+env(safe-area-inset-bottom))]">
          {/* Fußnoten */}
          <div className="space-y-2 border-b border-[var(--border)] pb-4">
            <p>Websites für Betriebe in ganz Deutschland. Gestaltet und gebaut in Hamburg.</p>
            <p>{PREIS_HINWEIS}</p>
          </div>

          {/* Brotkrumen */}
          <nav aria-label="Fußzeile, Standort" className="flex min-h-11 items-center gap-2">
            <Link href="/" className="inline-flex min-h-11 items-center text-[#1d1d1f]">
              <SitaloLogo size="xs" hideTagline className="!text-[#1d1d1f] [&_.font-logo]:!text-[14px]" />
            </Link>
            {crumb ? (
              <>
                <span aria-hidden="true">›</span>
                <span aria-current="page" className="text-[#424245]">
                  {crumb}
                </span>
              </>
            ) : null}
          </nav>

          {/* Spalten */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-[var(--border)] pt-2 pb-6 sm:grid-cols-4 sm:gap-x-8 lg:pt-4 lg:pb-8">
            <FooterCol title="Angebot">
              <FooterLink href="/website-erstellen-lassen">Website erstellen lassen</FooterLink>
              <FooterLink href="/leistungen">Leistungen</FooterLink>
              <FooterLink href="/pakete">Pakete</FooterLink>
              <FooterLink href="/wartung">Wartung</FooterLink>
              <FooterLink href="/branchen">Branchen</FooterLink>
              <FooterLink href="/pflege">Website für Pflegedienste</FooterLink>
              <FooterLink href="/praxen">Praxis-Website</FooterLink>
              <FooterLink href="/audit">Kostenlose Durchsicht Ihrer Website</FooterLink>
            </FooterCol>
            <FooterCol title="Ratgeber">
              <FooterLink href="/webseite-erstellen">Webseite erstellen: Anleitung</FooterLink>
              <FooterLink href="/website-kosten">Was kostet eine Website?</FooterLink>
              <FooterLink href="/vergleich">Baukasten oder Webdesigner: Vergleich</FooterLink>
              <FooterLink href="/lexikon">Lexikon</FooterLink>
            </FooterCol>
            <FooterCol title="Sitalo">
              <FooterLink href="/atelier">Über uns</FooterLink>
              <FooterLink href="/ablauf">Ablauf</FooterLink>
              <FooterLink href="/journal">Journal</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </FooterCol>
            <FooterCol title="Kontakt">
              <FooterLink href="tel:+491607621876" extern>
                0160&nbsp;7621876
              </FooterLink>
              <FooterLink href="mailto:info@sitalo.de" extern>
                info@sitalo.de
              </FooterLink>
              <FooterLink href="/termin">Termin buchen</FooterLink>
            </FooterCol>
          </div>

          {/* Kontaktzeile */}
          <p className="flex flex-wrap items-center gap-x-1 pt-3">
            <a href="tel:+491607621876" className="text-gold-ink inline-flex min-h-11 items-center hover:underline lg:min-h-0">
              0160&nbsp;7621876
            </a>
            <span aria-hidden="true">·</span>
            <a href="mailto:info@sitalo.de" className="text-gold-ink inline-flex min-h-11 items-center hover:underline lg:min-h-0">
              info@sitalo.de
            </a>
            <span aria-hidden="true">·</span>
            <Link href="/termin" className="text-gold-ink inline-flex min-h-11 items-center hover:underline lg:min-h-0">
              Termin buchen
            </Link>
          </p>

          {/* Rechtszeile */}
          <div className="mt-2 flex flex-col gap-y-1 border-t border-[var(--border)] pt-2 lg:mt-3 lg:flex-row lg:items-center lg:justify-between lg:pt-3">
            <div className="flex flex-col gap-y-1 lg:flex-row lg:items-center lg:gap-x-8">
              <span>Copyright © {year} Sitalo Webdesign. Alle Rechte vorbehalten.</span>
              <ul className="flex items-center">
                <RechtLink href="/impressum">Impressum</RechtLink>
                <RechtLink href="/datenschutz">Datenschutz</RechtLink>
                <RechtLink href="/admin" nofollow>
                  Login
                </RechtLink>
              </ul>
            </div>
            <span>Hamburg, Deutschland</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1 text-[12px] leading-[1.33] font-semibold tracking-[-0.01em] text-[#1d1d1f] lg:mb-2">
        {title}
      </h2>
      <ul>{children}</ul>
    </div>
  );
}

const LINK = "inline-flex min-h-11 items-center text-[#424245] hover:text-[#1d1d1f] hover:underline lg:min-h-0 lg:py-[3px]";

function FooterLink({
  href,
  children,
  extern = false,
}: {
  href: string;
  children: React.ReactNode;
  extern?: boolean;
}) {
  return (
    <li>
      {extern ? (
        <a href={href} className={LINK}>
          {children}
        </a>
      ) : (
        <Link href={href} className={LINK}>
          {children}
        </Link>
      )}
    </li>
  );
}

function RechtLink({
  href,
  children,
  nofollow = false,
}: {
  href: string;
  children: React.ReactNode;
  nofollow?: boolean;
}) {
  return (
    <li className="flex items-center leading-none not-first:before:mx-[10px] not-first:before:h-3 not-first:before:w-px not-first:before:bg-[var(--border)] not-first:before:content-['']">
      <Link
        href={href}
        rel={nofollow ? "nofollow" : undefined}
        className="inline-flex min-h-11 items-center text-[#424245] hover:text-[#1d1d1f] hover:underline lg:min-h-0"
      >
        {children}
      </Link>
    </li>
  );
}
