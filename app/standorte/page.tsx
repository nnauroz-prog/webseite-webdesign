import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { STANDORTE } from "@/lib/standorte-data";

export const metadata: Metadata = {
  title: "Webdesign nach Hamburger Stadtteil — Sitalo aus dem Atelier nebenan",
  description:
    "Websites für Hamburger Unternehmen, sortiert nach Stadtteil: Eimsbüttel, Altona, Eppendorf, St. Pauli, Winterhude. Lokale Stichwörter, konkrete Beispiele, persönliche Beratung.",
  alternates: { canonical: "/standorte" },
};

export default function StandortePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Standorte" />
      <main className="flex-1">
        <Hero />
        <Liste />
        <FinalNote />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1 w-6"
          />
          Nach Stadtteil
        </p>
        <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">
          Websites für Ihren Hamburger Stadtteil.
        </h1>
        <p className="text-muted-foreground mt-8 max-w-2xl text-pretty text-lg leading-relaxed sm:text-xl">
          „Webdesign Hamburg" ist die falsche Suche. Ihre Kunden tippen
          „Friseur Eimsbüttel" oder „Café Ottensen". Genau für diese
          lokalen Phrasen bauen wir — Stadtteil für Stadtteil.
        </p>
      </div>
    </section>
  );
}

function Liste() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <ul className="grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {STANDORTE.map((standort, i) => (
            <li key={standort.slug}>
              <Link
                href={`/standorte/${standort.slug}`}
                className="border-border/60 bg-card/60 ring-foreground/5 group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 ring-1 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="serif text-foreground/15 text-[2.5rem] font-normal leading-none tracking-[-0.04em] sm:text-[3rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="text-muted-foreground mt-3 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
                <h2 className="text-foreground mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
                  {standort.name}
                </h2>
                <p className="serif-italic text-muted-foreground mt-3 text-pretty text-base leading-snug sm:text-lg">
                  {standort.tagline}
                </p>
                <div className="text-muted-foreground/85 mt-6 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px]">
                  {standort.anker.slice(0, 3).map((ank) => (
                    <span
                      key={ank}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-ink-olive inline-block h-1 w-1 rounded-full"
                      />
                      {ank}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalNote() {
  return (
    <section>
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <p className="serif text-foreground text-balance text-2xl leading-[1.3] tracking-[-0.015em] sm:text-3xl lg:text-4xl">
          Ihr Stadtteil ist nicht dabei?{" "}
          <span className="serif-italic text-muted-foreground">
            Wir bauen trotzdem.
          </span>
        </p>
        <p className="text-muted-foreground mt-6 max-w-xl text-pretty text-[15px] leading-relaxed">
          Wir arbeiten für Unternehmen aus ganz Hamburg und Umland —
          die Stadtteil-Seiten zeigen nur, wofür wir besonders viel
          lokales Detail-Wissen haben. Wenn Sie aus Bergedorf, Harburg
          oder dem Speckgürtel kommen, fragen Sie gerne trotzdem an.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Anfrage starten
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/branchen"
            className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-4 hover:underline"
          >
            Branchen ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
