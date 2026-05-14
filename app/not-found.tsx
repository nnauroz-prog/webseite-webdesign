import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

/**
 * 404-Seite im Brand-Stil. Statt einer trockenen „Page Not Found"-
 * Meldung eine kurze editoriale Notiz mit dem typischen Sitalo-Layout
 * (Masthead, Gold-Pulse-Eyebrow, dunkler Pull-Quote-Block) plus 4
 * sinnvolle Wege zurück.
 */
export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Fehler 404" />
      <main className="flex-1">
        <section className="border-border/40 relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
          />
          <div className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Seite nicht gefunden · 404
            </p>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">
              Hier ist nichts.
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                Aber gleich um die Ecke schon.
              </span>
            </h1>
            <p className="text-foreground/80 mt-8 max-w-xl text-pretty text-lg leading-relaxed">
              Die Seite, die Sie suchen, existiert nicht — oder nicht
              mehr. Vier Wege zurück, die irgendwohin führen:
            </p>

            <ul className="divide-border/60 mt-12 divide-y border-y">
              <NotFoundLink
                href="/"
                label="Zurück zur Startseite"
                detail="Was wir machen, für wen, zu welchem Preis."
              />
              <NotFoundLink
                href="/branchen"
                label="Branchen ansehen"
                detail="Zehn typische Layouts — vielleicht passt eins zu Ihnen."
              />
              <NotFoundLink
                href="/standorte"
                label="Nach Hamburger Stadtteil"
                detail="Eimsbüttel, Altona, Eppendorf, St. Pauli und mehr."
              />
              <NotFoundLink
                href="/anfrage"
                label="Anfrage starten"
                detail="Drei Felder, zwei Minuten — wir melden uns persönlich."
              />
            </ul>

            <p className="serif-italic text-foreground/80 mt-12 max-w-xl text-pretty text-xl leading-snug">
              Falls Sie hier gelandet sind, weil ein Link auf
              sitalo.de kaputt ist —{" "}
              <a
                href="mailto:info@sitalo.de"
                className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
              >
                schreiben Sie uns kurz
              </a>
              , wir fixen es noch heute.
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

function NotFoundLink({
  href,
  label,
  detail,
}: {
  href: string;
  label: string;
  detail: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-7"
      >
        <div className="flex items-baseline gap-4">
          <span className="bg-ink-olive inline-block h-1 w-1 shrink-0 translate-y-[-0.2em] rounded-full" />
          <div>
            <p className="text-foreground text-xl font-medium tracking-[-0.015em] sm:text-2xl">
              {label}
            </p>
            <p className="text-muted-foreground mt-1 text-[15px] leading-relaxed">
              {detail}
            </p>
          </div>
        </div>
        <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors">
          Öffnen
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}
