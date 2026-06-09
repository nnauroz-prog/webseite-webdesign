import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { TcoRechner } from "@/components/marketing/tco-rechner";

export const metadata: Metadata = {
  title: "3-Jahres-Kostenrechner",
  description:
    "Was kostet Ihre Website über 3 Jahre? Sitalo vs Wix, Squarespace, Jimdo, ChatGPT-Selbstbau. Inkl. Eigenzeit als echtes Geld.",
  alternates: { canonical: "/rechner" },
};

/**
 * `/rechner` — 3-Jahres-TCO-Rechner.
 *
 * Hochwertiges Beratungs-Tool für Visitor in der Consideration-
 * Phase. Zeigt in Echtzeit, wie sich Gesamtkosten verschieben,
 * wenn man Eigenzeit ehrlich einrechnet.
 *
 * Bewusst transparent — die Logik steht offen im Code, keine
 * Sitalo-Bias-Multiplikatoren. Wenn jemand Eigenzeit auf 0 €/h
 * setzt, gewinnt der Baukasten. Das gehört zur Ehrlichkeit.
 */
export default function RechnerPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="3-Jahres-Rechner" />
      <main id="main" className="flex-1">
        <section className="border-border/40 relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-[60px] sm:blur-[120px]"
          />
          <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20 lg:py-24">
            <div className="text-center">
              <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <span
                  aria-hidden="true"
                  className="bg-gold gold-pulse inline-block h-1 w-6"
                />
                Eigenzeit als echtes Geld
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Was kostet's
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  über 3 Jahre?
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg">
                Sitalo, Wix, Squarespace, Jimdo, ChatGPT-Selbstbau —
                drei Slider, fünf Balken. Inklusive Ihrer Eigenzeit
                zum Stunden-Wert Ihrer Wahl. Wenn Sie ehrlich 80 €/h
                einsetzen, sieht der Vergleich anders aus als bei 0 €.
              </p>
            </div>

            <div className="mt-12 sm:mt-16">
              <TcoRechner />
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Lieber jemand erklärt's
            </p>
            <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug sm:text-3xl">
              Wir reden 30 Minuten über Ihre Situation.{" "}
              <span className="serif-italic text-muted-foreground">
                Kostenlos, ohne Verkaufsschnack.
              </span>
            </p>
            <Link
              href="/termin"
              className="bg-foreground text-background hover:bg-foreground/90 group mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              Termin direkt buchen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
