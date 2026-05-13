import Link from "next/link";

import { BackToTop } from "@/components/marketing/back-to-top";
import { TrustBar } from "@/components/marketing/trust-bar";
import { SitaloLogo } from "@/components/sitalo-logo";

/**
 * Marketing footer. Editorial layout — a left-aligned statement block
 * with the signature, a small links grid on the right.
 */
export function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <>
      <BackToTop />
      <TrustBar />
      <footer className="border-border/40 bg-background border-t">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-20 sm:py-24 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <SitaloLogo size="md" />
            <p className="text-muted-foreground mt-6 text-[15px] leading-relaxed">
              Websites für lokale Unternehmen. Persönlich gemacht, in
              Hamburg.
            </p>
            <p className="serif-italic text-foreground mt-6 text-lg">
              — Sitalo, Hamburg
            </p>
          </div>
          <FooterCol title="Service">
            <FooterLink href="/leistungen">Leistungen</FooterLink>
            <FooterLink href="/ablauf">Ablauf</FooterLink>
            <FooterLink href="/branchen">Branchen</FooterLink>
            <FooterLink href="/pakete">Pakete</FooterLink>
          </FooterCol>
          <FooterCol title="Sitalo">
            <FooterLink href="/anfrage">Website anfragen</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/kontakt">Kontakt</FooterLink>
          </FooterCol>
          <FooterCol title="Rechtliches">
            <FooterLink href="/impressum">Impressum</FooterLink>
            <FooterLink href="/datenschutz">Datenschutz</FooterLink>
          </FooterCol>
        </div>
        <div className="border-border/40 border-t">
          <div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center">
            <span>© {year} Sitalo Webdesign</span>
            <span className="serif-italic text-muted-foreground/80 text-sm">
              Made in Hamburg
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
      <h3 className="text-foreground/70 mb-5 text-[11px] font-medium uppercase tracking-[0.22em]">
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
        className="text-foreground/85 hover:text-foreground underline-offset-4 transition-colors hover:underline"
      >
        {children}
      </Link>
    </li>
  );
}
