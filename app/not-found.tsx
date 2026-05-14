import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
            <p className="text-muted-foreground font-mono text-xs tracking-[0.3em]">
              404
            </p>
            <h1 className="mt-8 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">
              Hier ist nichts.
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                Aber rechts neben Ihnen schon.
              </span>
            </h1>
            <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed">
              Die Seite, die Sie suchen, existiert nicht — oder existiert
              nicht mehr. Hier ein paar Wege, die irgendwohin führen:
            </p>

            <ul className="divide-border/60 mt-12 divide-y border-t border-b">
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
                href="/anfrage"
                label="Anfrage starten"
                detail="Ein paar kurze Fragen — wir melden uns persönlich."
              />
              <NotFoundLink
                href="/kontakt"
                label="Kontakt"
                detail="Per E-Mail, Telefon oder Formular."
              />
            </ul>

            <p className="text-muted-foreground mt-12 max-w-xl text-pretty text-[15px]">
              Falls Sie hier gelandet sind, weil ein Link auf{" "}
              <span className="text-foreground font-medium">sitalo.de</span>{" "}
              kaputt ist —{" "}
              <a
                href="mailto:info@sitalo.de"
                className="text-foreground underline underline-offset-4"
              >
                schreiben Sie uns kurz
              </a>
              , wir fixen es.
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
        className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
      >
        <div>
          <p className="text-foreground text-xl font-medium tracking-[-0.015em] sm:text-2xl">
            {label}
          </p>
          <p className="text-muted-foreground mt-1 text-[15px] leading-relaxed">
            {detail}
          </p>
        </div>
        <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors">
          Öffnen
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}
