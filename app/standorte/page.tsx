import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { BODY_OFFSET, SectionHead } from "@/components/marketing/home-sections";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import { STANDORTE } from "@/lib/standorte-data";

export const metadata: Metadata = {
  title: "Website erstellen lassen in Hamburg — nach Stadtteil",
  description:
    "Website erstellen lassen in Hamburg: Webdesign für Betriebe in Eimsbüttel, Altona, Eppendorf, St. Pauli, Winterhude und weiteren Stadtteilen. Ab 499 €.",
  alternates: { canonical: "/standorte" },
};

export default function StandortePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Standorte" />
      <main id="main" tabIndex={-1} className="flex-1">
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
    <section>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-14 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <EditorialEyebrow>Nach Stadtteil</EditorialEyebrow>
          <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            Website erstellen lassen{" "}
            <span className="text-muted-foreground">in Hamburg.</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed text-pretty sm:text-lg">
            Ihre Kunden suchen nicht „Webdesign Hamburg“, sondern „Friseur
            Eimsbüttel“ oder „Café Ottensen“. Für diese Suchen bauen wir,
            Stadtteil für Stadtteil.
          </p>
        </div>
        <HamburgMap />
      </div>
    </section>
  );
}

function Liste() {
  return (
    <section className="border-border/50 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHead
          label="Stadtteile"
          title="Zwölf Stadtteile, die wir besonders gut kennen."
        />
        <div className={`mt-10 lg:mt-14 ${BODY_OFFSET}`}>
          <ul className="border-border grid border-t sm:grid-cols-2 sm:gap-x-8">
            {STANDORTE.map((standort) => (
              <li key={standort.slug} className="border-border border-b">
                <Link
                  href={`/standorte/${standort.slug}`}
                  className="group flex items-start justify-between gap-4 py-5"
                >
                  <span>
                    <span className="block text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                      {standort.name}
                    </span>
                    <span className="text-muted-foreground mt-1 block text-[14px] leading-relaxed">
                      {standort.tagline}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FinalNote() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
        <h2 className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
          Stadtteil nicht dabei?{" "}
          <span className="text-background/65">Wir bauen trotzdem.</span>
        </h2>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
        >
          Website anfragen
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
