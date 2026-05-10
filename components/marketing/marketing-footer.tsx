import Link from "next/link";

import { SitaloLogo } from "@/components/sitalo-logo";

/**
 * Shared marketing footer. Mirrors the marketing header's CTA
 * hierarchy — primary action is "Website anfragen", login is a quiet
 * link, no "Kostenlos starten".
 */
export function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border/40 bg-background border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-3">
          <SitaloLogo size="sm" />
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Wir erstellen professionelle Websites für lokale Unternehmen —
            schnell, persönlich, ohne Technik-Stress.
          </p>
        </div>
        <FooterCol title="Service">
          <FooterLink href="/#leistungen">Leistungen</FooterLink>
          <FooterLink href="/#ablauf">Ablauf</FooterLink>
          <FooterLink href="/#beispiele">Beispiele</FooterLink>
          <FooterLink href="/pricing">Preise</FooterLink>
        </FooterCol>
        <FooterCol title="Sitalo">
          <FooterLink href="/anfrage">Website anfragen</FooterLink>
          <FooterLink href="/#faq">FAQ</FooterLink>
          <FooterLink href="/#kontakt">Kontakt</FooterLink>
        </FooterCol>
        <FooterCol title="Rechtliches">
          <FooterLink href="/impressum">Impressum</FooterLink>
          <FooterLink href="/datenschutz">Datenschutz</FooterLink>
        </FooterCol>
      </div>
      <div className="border-border/40 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs sm:flex-row">
          <span>© {year} Sitalo Webdesign. Alle Rechte vorbehalten.</span>
          <span className="text-muted-foreground/80">Made in Germany</span>
        </div>
      </div>
    </footer>
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
      <h3 className="text-foreground/80 mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">{children}</ul>
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
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
