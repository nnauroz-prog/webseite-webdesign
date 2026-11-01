import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MusterFenster } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { Briefkarte } from "@/components/marketing/vertical-landing";
import { BRANCHEN } from "@/lib/branchen-data";
import { getPaketBySlug } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: "Branchen — Websites für Ihren Betrieb",
  description:
    "Websites für Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien und Fitnessstudios — jede Seite individuell gebaut.",
  alternates: { canonical: "/branchen" },
};

const ZAHLWORT: Record<number, string> = { 8: "Acht", 9: "Neun", 10: "Zehn", 11: "Elf", 12: "Zwölf" };

export default function BranchenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Branchen"
          eyebrow={`${ZAHLWORT[BRANCHEN.length] ?? BRANCHEN.length} Branchen`}
          title="Websites für Ihre Branche"
        >
          Eine Praxis braucht anderes als ein Café. Für jede Branche haben wir aufgeschrieben, worauf Ihre Kunden zuerst
          schauen, und eine Musterseite gebaut.
        </PageHero>
        <Register />
        <Briefkarte title="Wir bauen auch für Betriebe, die hier nicht stehen.">
          Schreiben Sie uns zwei, drei Sätze zu Ihrem Betrieb. Den Festpreis bekommen Sie schriftlich, bevor wir
          anfangen.
        </Briefkarte>
      </main>
      <MarketingFooter />
    </div>
  );
}

/**
 * Branchen als Register: eine Zeile je Branche mit Musterseite, kurzer
 * Einordnung und dem Paket, das wir meistens empfehlen. Details stehen
 * auf /branchen/[slug].
 */
function Register() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <div className="label-mono text-muted-foreground hidden pb-3 lg:grid lg:grid-cols-12 lg:gap-8">
          <span className="lg:col-span-3">Musterseite</span>
          <span className="lg:col-span-6">Branche</span>
          <span className="text-right lg:col-span-3">Meist empfohlen</span>
        </div>
        <ul className="border-foreground border-t">
          {BRANCHEN.map((b) => {
            const paket = getPaketBySlug(b.recommendedPackage);
            return (
              <li key={b.slug} id={b.slug} className="border-border scroll-mt-24 border-b">
                <Link
                  href={`/branchen/${b.slug}`}
                  className="group grid grid-cols-[6.5rem_1fr] items-start gap-x-4 gap-y-3 py-5 sm:grid-cols-[11rem_1fr] sm:gap-x-6 sm:py-6 lg:grid-cols-12 lg:gap-8"
                >
                  <div className="w-full lg:col-span-3">
                    <MusterFenster branche={b.slug} rahmen={false} />
                  </div>
                  <div className="min-w-0 lg:col-span-6 lg:pt-1">
                    <h2 className="text-[19px] leading-tight tracking-[-0.02em] underline-offset-4 group-hover:underline sm:text-[26px]">
                      {b.label}
                    </h2>
                    <p className="text-muted-foreground mt-2 hidden max-w-xl text-pretty text-[15.5px] leading-relaxed sm:block">
                      {b.shortBody}
                    </p>
                    {paket ? (
                      <p className="text-muted-foreground mt-2 text-[14px] lg:hidden">
                        Meist {paket.name}, {paket.setup}
                      </p>
                    ) : null}
                  </div>
                  <div className="hidden items-start justify-end gap-5 lg:col-span-3 lg:flex lg:pt-2">
                    {paket ? (
                      <p className="text-right">
                        <span className="block text-[16px] font-semibold">{paket.name}</span>
                        <span className="text-muted-foreground mt-0.5 block text-[14.5px] tabular-nums">
                          {paket.setup}
                        </span>
                      </p>
                    ) : null}
                    <ArrowRight
                      className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="text-muted-foreground mt-4 font-mono text-[12px] leading-relaxed">
          Preise sind Einmalpreise, dazu kommt ein Monatsbeitrag je Paket.{" "}
          <Link href="/pakete" className="hover:text-foreground underline underline-offset-4">
            Alle Pakete
          </Link>
        </p>
      </div>
    </section>
  );
}
