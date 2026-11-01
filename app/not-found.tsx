import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

/**
 * 404-Seite: links die Meldung, rechts vier Wege weiter, jeweils mit
 * Ziel-Adresse in Mono. Darunter die Bitte, kaputte Links zu melden.
 */
const WEGE: { href: string; label: string; detail: string }[] = [
  {
    href: "/",
    label: "Startseite",
    detail: "Was wir bauen und was es kostet.",
  },
  {
    href: "/branchen",
    label: "Branchen",
    detail: "Was auf die Website Ihrer Branche gehört.",
  },
  {
    href: "/standorte",
    label: "Hamburger Stadtteile",
    detail: "Eimsbüttel, Altona, Eppendorf, St. Pauli und weitere.",
  },
  {
    href: "/anfrage",
    label: "Website anfragen",
    detail: "Zum Formular. Wir antworten meist am selben Werktag.",
  },
];

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Fehler 404" />
      <main id="main" tabIndex={-1} className="flex-1">
        <section>
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8 lg:py-28">
            <div className="lg:col-span-5">
              <p className="label-mono text-muted-foreground">Fehler 404</p>
              <h1 className="mt-6 text-balance text-[2.5rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[4rem]">
                Diese Seite gibt es nicht.
              </h1>
              <p className="text-muted-foreground mt-6 max-w-md text-pretty text-[16.5px] leading-relaxed sm:text-lg">
                Vielleicht hat sich die Adresse geändert, oder im Link steckt ein Tippfehler. Einer dieser Wege führt
                weiter.
              </p>
            </div>

            <nav aria-label="Wege weiter" className="lg:col-span-6 lg:col-start-7 lg:pt-2">
              <ul className="border-foreground border-t">
                {WEGE.map((w) => (
                  <li key={w.href} className="border-border border-b">
                    <Link href={w.href} className="group flex items-center justify-between gap-6 py-5 sm:py-6">
                      <span className="min-w-0">
                        <span className="block text-[1.25rem] font-semibold leading-snug tracking-[-0.015em] underline-offset-4 group-hover:underline sm:text-[1.4rem]">
                          {w.label}
                        </span>
                        <span className="text-muted-foreground mt-1 block text-[15px] leading-relaxed">{w.detail}</span>
                      </span>
                      <span className="text-muted-foreground group-hover:text-foreground flex shrink-0 items-center gap-1.5 font-mono text-[12px] transition-colors">
                        <span className="hidden sm:inline">{w.href}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-8 max-w-lg text-pretty text-[15.5px] leading-relaxed">
                Führt ein Link auf sitalo.de ins Leere, schreiben Sie uns kurz an{" "}
                <a
                  href="mailto:info@sitalo.de"
                  className="text-foreground font-semibold underline decoration-[var(--gold)] decoration-2 underline-offset-4"
                >
                  info@sitalo.de
                </a>
                . Dann reparieren wir ihn.
              </p>
            </nav>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
