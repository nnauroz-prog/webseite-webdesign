import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Briefkarte } from "@/components/marketing/vertical-landing";
import { STANDORTE } from "@/lib/standorte-data";

export const metadata: Metadata = {
  title: "Website erstellen lassen in Hamburg — nach Stadtteil",
  description:
    "Website erstellen lassen in Hamburg: Webdesign für Betriebe in Eimsbüttel, Altona, Eppendorf, St. Pauli, Winterhude und weiteren Stadtteilen. Ab 499\u00A0€.",
  alternates: { canonical: "/standorte" },
};

const ZAHLWORT: Record<number, string> = { 10: "Zehn", 11: "Elf", 12: "Zwölf", 13: "Dreizehn", 14: "Vierzehn" };

export default function StandortePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Standorte" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Liste />
        <Briefkarte title="Betriebe außerhalb dieser Stadtteile bekommen dieselbe Website.">
          Das erste Gespräch führen wir am Telefon oder per Video. In Hamburg kommen wir auf Wunsch auch bei Ihnen
          vorbei.
        </Briefkarte>
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-5">
          <p className="label-mono text-muted-foreground">Nach Stadtteil</p>
          <h1 className="mt-6 text-balance text-[2.4rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[3.6rem]">
            Website erstellen lassen in Hamburg
          </h1>
          <p className="mt-6 max-w-md text-pretty text-[17px] leading-relaxed text-[#33383a] sm:text-[18px]">
            Wer einen Friseur in der Nähe sucht, tippt „Friseur Eimsbüttel“ oder „Friseur Osterstraße“. Auf solche
            Suchen richten wir Seitentitel und Texte aus.
          </p>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <HamburgMap />
        </div>
      </div>
    </section>
  );
}

/** Stadtteile als Tabelle: Name, Einordnung, gefragte Branchen. */
function Liste() {
  const anzahl = ZAHLWORT[STANDORTE.length] ?? String(STANDORTE.length);
  return (
    <section className="bg-card border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl lg:col-span-7">
            {anzahl} Stadtteile mit eigener Seite
          </h2>
          <p className="text-muted-foreground max-w-md text-[16.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
            Auf jeder Seite steht, welche Betriebe es im Viertel gibt und wonach dort gesucht wird.
          </p>
        </div>

        <div className="label-mono text-muted-foreground mt-12 hidden pb-3 sm:mt-14 lg:grid lg:grid-cols-12 lg:gap-8">
          <span className="lg:col-span-3">Stadtteil</span>
          <span className="lg:col-span-5">Kurz gesagt</span>
          <span className="lg:col-span-4">Passende Branchen</span>
        </div>
        <ul className="border-foreground mt-10 border-t lg:mt-0">
          {STANDORTE.map((s) => (
            <li key={s.slug} className="border-border border-b">
              <Link
                href={`/standorte/${s.slug}`}
                className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-5 lg:grid-cols-12 lg:gap-8"
              >
                <h3 className="text-[20px] leading-tight tracking-[-0.02em] underline-offset-4 group-hover:underline lg:col-span-3">
                  {s.name}
                </h3>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 lg:order-last lg:col-span-1 lg:justify-self-end"
                  aria-hidden="true"
                />
                <p className="text-muted-foreground col-span-2 text-pretty text-[15px] leading-relaxed lg:col-span-5">
                  {s.tagline}
                </p>
                <p className="col-span-2 text-[14px] leading-relaxed lg:col-span-3">
                  <span className="text-muted-foreground lg:hidden">Passende Branchen: </span>
                  {s.empfohleneBranchen.map((b) => b.label).join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
