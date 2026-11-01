import Link from "next/link";

import { BackToTop } from "@/components/marketing/back-to-top";
import { ElbeLinie } from "@/components/marketing/hafen/elbe-linie";
import { SitaloLogo } from "@/components/sitalo-logo";

/**
 * Marketing-Footer: Logo + ein Satz, vier kurze Link-Spalten,
 * darunter Copyright und Rechtliches.
 *
 * Ankertexte mit Absicht: „Website erstellen lassen" zeigt nur auf die
 * Geldseite, „Webseite erstellen" ohne „lassen" nur auf den Ratgeber.
 * Die Ratgeber-Spalte bündelt die Seiten für Leute, die sich erst
 * informieren wollen.
 *
 * Bewusst keine Social-Icons (haben wir nicht), keine Newsletter-Box
 * (haben wir nicht), kein „Made with React"-Marker (peinlich).
 */
export function MarketingFooter() {
  const year = new Date().getFullYear();
  // Bewusst kurz: die wichtigsten Wege, Kontakt, Rechtliches.
  // Alle übrigen Seiten bleiben über Sitemap und ⌘K erreichbar.
  return (
    <>
      <BackToTop />
      <footer className="bg-foreground text-background relative overflow-hidden print:hidden">
        <ElbeLinie />
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-5 pt-10 pb-16 sm:gap-x-12 sm:px-6 sm:pt-12 sm:pb-20 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-x-10">
          <div className="col-span-2 max-w-xs lg:col-span-1">
            <SitaloLogo size="md" tone="light" />
            <p className="text-background/75 mt-6 text-[14px] leading-relaxed">
              Websites für Betriebe in ganz Deutschland. Gestaltet und gebaut in Hamburg.
            </p>
          </div>
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
            <li>
              <a
                href="tel:+491607621876"
                className="text-background/85 hover:text-background underline-offset-4 transition-colors hover:underline"
              >
                0160&nbsp;7621876
              </a>
            </li>
            <li>
              <a
                href="mailto:info@sitalo.de"
                className="text-background/85 hover:text-background underline-offset-4 transition-colors hover:underline"
              >
                info@sitalo.de
              </a>
            </li>
            <FooterLink href="/termin">Termin buchen</FooterLink>
          </FooterCol>
        </div>

        <div className="border-background/10 border-t">
          <div className="text-background/60 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 font-mono text-[12px] sm:px-6">
            <span>© {year} Sitalo Webdesign</span>
            <span className="flex gap-5">
              <Link href="/impressum" className="hover:text-background transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-background transition-colors">
                Datenschutz
              </Link>
              <Link href="/admin" rel="nofollow" className="hover:text-background transition-colors">
                Login
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="label-mono text-stahl-hell mb-5">
        {title}
      </h2>
      <ul className="space-y-3 text-[15px]">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-background/85 hover:text-background underline-offset-4 transition-colors hover:underline"
      >
        {children}
      </Link>
    </li>
  );
}
