import Link from "next/link";

import { BackToTop } from "@/components/marketing/back-to-top";
import { ElbeLinie } from "@/components/marketing/hafen/elbe-linie";
import { SitaloLogo } from "@/components/sitalo-logo";

/**
 * Marketing-Footer: Logo + ein Satz, drei kurze Link-Spalten,
 * darunter Copyright und Rechtliches.
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
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <SitaloLogo size="md" tone="light" />
            <p className="text-background/75 mt-6 text-[14px] leading-relaxed">
              Websites für Betriebe in ganz Deutschland. Gestaltet und gebaut in Hamburg.
            </p>
          </div>
          <FooterCol title="Angebot">
            <FooterLink href="/website-erstellen-lassen">Website erstellen lassen</FooterLink>
            <FooterLink href="/website-kosten">Was kostet eine Website?</FooterLink>
            <FooterLink href="/leistungen">Leistungen</FooterLink>
            <FooterLink href="/pakete">Pakete</FooterLink>
            <FooterLink href="/wartung">Wartung</FooterLink>
            <FooterLink href="/branchen">Branchen</FooterLink>
            <FooterLink href="/audit">Kostenloser Google-Check</FooterLink>
          </FooterCol>
          <FooterCol title="Sitalo">
            <FooterLink href="/atelier">Das Atelier</FooterLink>
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
                0160 7621876
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
      <h3 className="label-mono text-stahl-hell mb-5">
        {title}
      </h3>
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
