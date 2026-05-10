import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import type { WebsiteRow } from "@/types/website";

export function SiteFooter({ website }: { website: WebsiteRow }) {
  const year = new Date().getFullYear();
  const phone = website.phone?.trim();
  const email = website.email?.trim();
  const address = website.address?.trim();
  const hours = website.opening_hours?.text?.trim();
  const showImprint = !!website.imprint_text?.trim();
  const showPrivacy = !!website.privacy_text?.trim();

  return (
    <footer className="bg-muted/30 border-border/60 border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-foreground text-base font-semibold tracking-tight">
              {website.business_name}
            </p>
            {website.industry && (
              <p className="text-muted-foreground mt-1 text-sm capitalize">
                {website.industry}
              </p>
            )}
            {hours && (
              <p className="text-muted-foreground mt-4 text-sm whitespace-pre-line">
                <span className="text-foreground/80 mb-1 block text-xs tracking-wide uppercase">
                  Öffnungszeiten
                </span>
                {hours}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <p className="text-foreground/80 text-xs tracking-wide uppercase">
              Kontakt
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {phone && (
                <li className="flex items-start gap-2">
                  <Phone className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="hover:underline"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-2">
                  <Mail className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <a href={`mailto:${email}`} className="break-all hover:underline">
                    {email}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
              )}
              {!phone && !email && !address && (
                <li className="text-muted-foreground text-sm">
                  Über das Kontaktformular auf der Seite.
                </li>
              )}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-foreground/80 text-xs tracking-wide uppercase">
              Schnellzugriff
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#leistungen" className="hover:underline">
                  Leistungen
                </a>
              </li>
              <li>
                <a href="#ueber-uns" className="hover:underline">
                  Über uns
                </a>
              </li>
              <li>
                <a href="#kontakt" className="hover:underline">
                  Kontakt
                </a>
              </li>
              {website.application_form_enabled && (
                <li>
                  <a href="#bewerbung" className="hover:underline">
                    Bewerbung
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-border/60 text-muted-foreground mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {website.business_name}
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {showImprint && (
              <Link
                href={`/site/${website.slug}/imprint`}
                className="hover:text-foreground transition-colors"
              >
                Impressum
              </Link>
            )}
            {showPrivacy && (
              <Link
                href={`/site/${website.slug}/privacy`}
                className="hover:text-foreground transition-colors"
              >
                Datenschutz
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* "Erstellt mit Sitalo" — Shopify-style attribution. Drives traffic
          back to the marketing site so each customer site is also a sales
          channel. */}
      <div className="border-border/40 border-t bg-black/[0.02] py-3 dark:bg-white/[0.02]">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl items-center justify-center gap-1.5 px-6 text-[11px]">
          <span>Erstellt mit</span>
          <Link
            href="/"
            target="_blank"
            rel="noopener"
            className="text-foreground hover:text-primary inline-flex items-center gap-1 font-semibold tracking-tight transition-colors"
          >
            <span className="from-primary inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-gradient-to-br to-violet-600 text-[8px] font-bold text-white">
              S
            </span>
            Sitalo
          </Link>
        </div>
      </div>
    </footer>
  );
}
