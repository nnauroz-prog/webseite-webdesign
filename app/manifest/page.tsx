import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SitaloStempel } from "@/components/marketing/sitalo-stempel";

export const metadata: Metadata = {
  title: "Manifest",
  description:
    "Acht Sätze. Was Sitalo macht, was Sitalo nicht macht, woran sich Inhaber wie Kunden verlassen können.",
  alternates: { canonical: "/manifest" },
};

/**
 * `/manifest` — bewusst karger Stand-alone-Artefakt.
 *
 * Kein Editorial-Masthead, kein üblicher Hero-Pattern, kein CTA-
 * Lärm. Acht durchnumerierte Sätze im Serif, viel Weißraum, am
 * Ende der Sitalo-Stempel als Siegel. Soll sich anfühlen wie eine
 * gedruckte Broadside — ein Wandblatt, kein Marketing.
 *
 * Bewusst weglassen: Navigations-Kontext zwischen den Sätzen,
 * Erklärungen, Verweise. Wer das hier liest, soll es als
 * Erklärung von uns selbst nehmen, nicht als Verkaufstext.
 */

const DECLARATIONS: { roman: string; lead: string; coda?: string }[] = [
  {
    roman: "I",
    lead: "Wir bauen Websites für lokale Unternehmen.",
    coda: "Aus Hamburg, persönlich, aus einer Hand.",
  },
  {
    roman: "II",
    lead: "Drei Sachen reichen.",
    coda: "Den Rest bauen wir.",
  },
  {
    roman: "III",
    lead: "Wir nehmen pro Monat höchstens drei neue Aufträge an.",
    coda: "Das ist keine Geste, sondern eine arithmetische Realität.",
  },
  {
    roman: "IV",
    lead: "Wir versprechen keine Plätze bei Google, die niemand halten kann.",
    coda: "Wir bauen die Basis sauber. Den Rest macht Zeit und Konsistenz.",
  },
  {
    roman: "V",
    lead: "Wir bauen direkt das Echte.",
    coda: "Keine Mockups, die anders aussehen als das, was am Ende live geht.",
  },
  {
    roman: "VI",
    lead: "Wenn wir nachts schlafen, sagen wir das.",
    coda: "Wir antworten meist am selben Tag. Nicht in derselben Sekunde.",
  },
  {
    roman: "VII",
    lead: "Wir kennen die Praxen, die Pflegedienste, die Cafés und die Handwerker, für die wir bauen — weil wir hier leben.",
  },
  {
    roman: "VIII",
    lead: "Was wir tun, gehört Ihnen.",
    coda: "Hosting, Code, Inhalte. Sie sind nicht in unserer Mietwohnung.",
  },
];

export default function ManifestPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main id="main" className="flex-1">
        <section>
          <div className="mx-auto w-full max-w-2xl px-6 pt-20 pb-12 text-center sm:pt-28 sm:pb-16 lg:pt-36">
            <p className="text-muted-foreground inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em]">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-10"
              />
              Sitalo Atelier · Hamburg · MMXXVI
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-10"
              />
            </p>
            <h1 className="serif mt-8 text-balance text-6xl font-normal leading-[0.94] tracking-[-0.02em] sm:text-7xl lg:text-[5.5rem]">
              Manifest.
            </h1>
            <p className="text-muted-foreground mx-auto mt-7 max-w-md text-pretty text-[15px] leading-relaxed">
              Acht Sätze. Eine Erklärung darüber, was wir tun und was wir
              nicht tun. Geschrieben für Inhaber, denen Verbindlichkeit
              wichtiger ist als Verkaufstext.
            </p>
          </div>
        </section>

        <section className="border-border/40 border-t border-b">
          <ol className="divide-border/30 mx-auto w-full max-w-2xl divide-y px-6">
            {DECLARATIONS.map((d) => (
              <li
                key={d.roman}
                className="grid items-baseline gap-5 py-16 sm:grid-cols-[4.5rem_1fr] sm:gap-8 sm:py-20"
              >
                <span
                  aria-hidden="true"
                  className="serif-italic text-gold text-3xl font-normal leading-none tabular-nums sm:text-4xl"
                >
                  {d.roman}.
                </span>
                <div>
                  <p className="serif text-foreground text-balance text-2xl font-normal leading-[1.25] tracking-[-0.01em] sm:text-3xl">
                    {d.lead}
                  </p>
                  {d.coda && (
                    <p className="serif-italic text-muted-foreground mt-4 text-balance text-xl leading-snug sm:text-2xl">
                      {d.coda}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <div className="mx-auto w-full max-w-2xl px-6 py-20 text-center sm:py-28">
            <div className="text-muted-foreground/55 inline-flex flex-col items-center gap-4">
              <SitaloStempel size="md" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em]">
                Sitalo Atelier · Hamburg
              </p>
            </div>
            <div className="text-muted-foreground/65 mt-10 inline-flex flex-col items-center gap-3 text-[13px]">
              <p>
                Wer dieses Manifest gelesen hat, weiß genug, um eine
                Anfrage zu schicken.
              </p>
              <Link
                href="/anfrage"
                className="text-foreground inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
              >
                Anfrage starten
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
