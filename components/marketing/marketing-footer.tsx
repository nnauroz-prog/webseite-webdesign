import Link from "next/link";

import { BackToTop } from "@/components/marketing/back-to-top";
import { TrustBar } from "@/components/marketing/trust-bar";
import { SitaloLogo } from "@/components/sitalo-logo";

/**
 * Marketing-Footer im Editorial-Stil. Aufgebaut wie eine
 * Zeitschriften-Rückseite: oben eine ruhige Mast-Linie mit der
 * Brand-Adresse und den wichtigsten Kontaktwegen, darunter ein
 * grosses serif-italic Schluss-Statement, dann das Link-Grid und
 * ganz unten die Copyright-Zeile.
 *
 * Bewusst keine Social-Icons (haben wir nicht), keine Newsletter-Box
 * (haben wir nicht), kein „Made with React"-Marker (peinlich).
 */
export function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <>
      <BackToTop />
      <TrustBar />
      <footer className="bg-card text-foreground relative overflow-hidden">
        {/* Atmosphärischer Gold-Halo links oben — passt zur Brand. */}
        <div
          aria-hidden="true"
          className="bg-gold/10 pointer-events-none absolute -top-32 -left-20 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
        />
        {/* Editorial-Mast oben */}
        <div className="border-foreground/10 mx-auto flex w-full max-w-7xl flex-col gap-4 border-b px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            <p className="text-foreground/55 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              Sitalo · Professionell aus Hamburg
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[13px]">
            <a
              href="tel:+4915224437370"
              className="border-foreground/20 text-foreground/85 hover:border-foreground hover:bg-foreground hover:text-background inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium tracking-tight transition-all"
            >
              Anrufen
            </a>
            <a
              href="mailto:info@sitalo.de"
              className="border-foreground/20 text-foreground/85 hover:border-foreground hover:bg-foreground hover:text-background inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium tracking-tight transition-all"
            >
              Schreiben
            </a>
            <a
              href="/sitalo-kontakt.vcf"
              download="Sitalo-Webdesign.vcf"
              className="border-foreground/20 text-foreground/85 hover:border-foreground hover:bg-foreground hover:text-background inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium tracking-tight transition-all"
            >
              In Kontakte speichern
            </a>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 py-20 sm:py-24 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <SitaloLogo size="md" />
            <p className="serif mt-8 text-balance text-2xl font-normal leading-[1.2] tracking-[-0.015em] sm:text-3xl">
              Drei Sachen reichen.{" "}
              <span className="serif-italic text-foreground/65">
                Den Rest bauen wir.
              </span>
            </p>
            <p className="text-foreground/65 mt-5 max-w-xs text-[14px] leading-relaxed">
              Professionelle Websites für lokale Unternehmen. Persönlich
              gemacht, aus einem kleinen Atelier in Hamburg.
            </p>
            <Link
              href="/anfrage"
              className="bg-gold text-background hover:bg-gold/90 group mt-8 inline-flex h-11 items-center rounded-full px-6 text-[14px] font-medium tracking-tight transition-all"
            >
              Anfrage starten
              <span
                aria-hidden="true"
                className="ml-2 transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
          <FooterCol title="Service">
            <FooterLink href="/leistungen">Leistungen</FooterLink>
            <FooterLink href="/ablauf">Ablauf</FooterLink>
            <FooterLink href="/branchen">Branchen</FooterLink>
            <FooterLink href="/standorte">Standorte</FooterLink>
            <FooterLink href="/pakete">Pakete</FooterLink>
          </FooterCol>
          <FooterCol title="Sitalo">
            <FooterLink href="/atelier">Das Atelier</FooterLink>
            <FooterLink href="/anfrage">Website anfragen</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/kontakt">Kontakt</FooterLink>
          </FooterCol>
          <FooterCol title="Rechtliches">
            <FooterLink href="/impressum">Impressum</FooterLink>
            <FooterLink href="/datenschutz">Datenschutz</FooterLink>
          </FooterCol>
        </div>

        {/* Editorial-Schluss */}
        <div className="border-foreground/10 border-t">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs sm:flex-row sm:items-center">
            <span className="text-foreground/55">
              © {year} Sitalo Webdesign
            </span>
            {/* Hanseatic-ehrlich: keine festen Bürozeiten, aber
                schnelle Antwort. Anstelle der „Mo–Fr 9–17"-Floskel,
                die eh nicht stimmt. */}
            <span className="text-foreground/55 inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-ink-olive inline-block h-1 w-1 rounded-full"
              />
              Erreichbar jederzeit · Antwort meist noch am selben Tag
            </span>
            <span className="serif-italic text-foreground/60 text-sm">
              53.5511° N · 9.9937° E — Hamburg
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
      <h3 className="text-foreground/55 mb-5 text-[11px] font-medium uppercase tracking-[0.22em]">
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
