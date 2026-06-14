import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { EmpfehlungWizard } from "@/components/marketing/empfehlung-wizard";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Welches Paket passt?",
  description:
    "Fünf Fragen, eine ehrliche Empfehlung. Unser Quiz schaut sich Branche, Größe, vorhandene Materialien, Timing und Ihre aktuelle Seite an — und gibt eine begründete Paket-Empfehlung.",
  alternates: { canonical: "/empfehlung" },
};

/**
 * `/empfehlung` — interaktives Quiz-Tool.
 *
 * Anders als das frühere /anfrage-Wizard (rückgebaut wegen zu
 * vieler Klicks für Erstkontakt): hier ist das Quiz das Hauptziel,
 * nicht ein vorgelagertes Hindernis. User bekommt eine personali-
 * sierte Empfehlung mit nachvollziehbarer Begründung.
 *
 * Zustand wird in localStorage gespeichert — User kann zurück-
 * kommen, ohne von vorn anzufangen.
 */
export default function EmpfehlungPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Paket-Empfehlung" />
      <main id="main" tabIndex={-1} className="flex-1">
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
                Fünf Fragen · ehrliche Empfehlung
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Welches Paket
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  passt zu Ihnen?
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
                Wir gucken auf Branche, Größe, vorhandene Materialien,
                Timing und Ihre aktuelle Seite — und sagen ehrlich,
                womit Sie am besten fahren. Kein Lockruf, keine
                E-Mail-Pflicht.
              </p>
            </div>

            <div className="mt-12 sm:mt-16">
              <EmpfehlungWizard />
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
              Lieber selbst entscheiden
            </p>
            <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug sm:text-3xl">
              Drei Pakete, klar erklärt.{" "}
              <span className="serif-italic text-muted-foreground">
                Mehr Detail, mehr Beispiele.
              </span>
            </p>
            <Link
              href="/pakete"
              className="text-foreground mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
            >
              Alle Pakete im Detail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
