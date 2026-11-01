import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SitaloStempel } from "@/components/marketing/sitalo-stempel";
import { SITE_URL } from "@/lib/site";

const ARTICLE_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sitalo Manifest — acht Sätze",
  description:
    "Was Sitalo macht, was Sitalo nicht macht, woran sich Inhaber wie Kunden verlassen können.",
  author: { "@type": "Organization", name: "Sitalo Webdesign", url: SITE_URL },
  publisher: { "@id": `${SITE_URL}/#business` },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/manifest` },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Manifest",
      item: `${SITE_URL}/manifest`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Manifest · Wie wir Websites bauen",
  description:
    "Acht Sätze. Was Sitalo macht, was Sitalo nicht macht, woran sich Inhaber wie Kunden verlassen können.",
  alternates: { canonical: "/manifest" },
};

/**
 * `/manifest` — ein einzelnes Blatt, gesetzt wie ein Aushang im
 * Kontor: Papierfläche mit kräftiger Oberkante, acht Sätze, am Fuß
 * der Firmenstempel. Die Sätze haben keine Reihenfolge, deshalb
 * keine Nummern; links steht in Mono, worum es jeweils geht.
 *
 * Jede Aussage muss sich mit dem Rest der Seite decken (Festpreis,
 * Test-Link, Monatsbeitrag, Übergabe beim Wechsel, Antwortzeit).
 */
const SAETZE: { thema: string; lead: string; coda: string }[] = [
  {
    thema: "Für wen",
    lead: "Wir bauen Websites für kleine Betriebe.",
    coda: "Wir sitzen in Hamburg. Wo Ihr Betrieb ist, spielt für die Arbeit keine Rolle.",
  },
  {
    thema: "Preis",
    lead: "Den Festpreis bekommen Sie schriftlich, bevor wir anfangen.",
    coda: "Kommt später etwas dazu, sprechen wir vorher darüber.",
  },
  {
    thema: "Unterlagen",
    lead: "Von Ihnen brauchen wir Handyfotos und ein paar Stichpunkte.",
    coda: "Den Text schreiben wir. Sie streichen, was nicht stimmt.",
  },
  {
    thema: "Test-Link",
    lead: "Ihre Seite sehen Sie auf einem Test-Link, bevor sie online geht.",
    coda: "Was Sie dort freigeben, geht genau so online.",
  },
  {
    thema: "Kapazität",
    lead: "Wir nehmen höchstens drei neue Aufträge im Monat an.",
    coda: "So bleibt für jeden Auftrag die Zeit, die er braucht.",
  },
  {
    thema: "Google",
    lead: "Einen Platz bei Google versprechen wir nicht.",
    coda: "Wir bauen die Seite so, dass Google sie gut lesen kann. Die Reihenfolge der Treffer kann niemand zusagen.",
  },
  {
    thema: "Antwortzeit",
    lead: "Wir antworten meist am selben Werktag.",
    coda: "Nachts schlafen wir, und am Wochenende bleibt die Mail bis Montag liegen.",
  },
  {
    thema: "Eigentum",
    lead: "Die Seite gehört Ihnen.",
    coda: "Wechseln Sie später den Anbieter, bekommen Sie Quellcode und Inhalte vollständig übergeben.",
  },
];

export default function ManifestPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Manifest" />
      <main id="main" tabIndex={-1} className="flex-1">
        <section>
          <div className="mx-auto w-full max-w-6xl px-5 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
            <article className="bg-card border-border mx-auto max-w-4xl border border-t-foreground border-t-[3px] shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)]">
              <header className="border-border grid gap-6 border-b px-5 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-10 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="label-mono text-muted-foreground">Sitalo Webdesign · Hamburg</p>
                  <h1 className="mt-5 text-[3.2rem] leading-[0.9] tracking-[-0.045em] sm:text-[5rem] lg:text-[5.75rem]">
                    Manifest
                  </h1>
                </div>
                <p className="text-muted-foreground max-w-xs text-pretty text-[15.5px] leading-relaxed">
                  Acht Sätze darüber, wie wir arbeiten. Wir haben sie aufgeschrieben, damit Sie uns daran messen
                  können.
                </p>
              </header>

              <ul>
                {SAETZE.map((s) => (
                  <li
                    key={s.thema}
                    className="border-border grid gap-3 border-b px-5 py-7 sm:grid-cols-[9.5rem_1fr] sm:gap-8 sm:px-10 sm:py-9"
                  >
                    <span className="label-mono text-muted-foreground sm:pt-2.5">{s.thema}</span>
                    <div>
                      <p
                        className="text-balance text-[1.45rem] leading-[1.18] tracking-[-0.022em] sm:text-[1.9rem]"
                        style={{ fontStretch: "110%", fontWeight: 720 }}
                      >
                        {s.lead}
                      </p>
                      <p className="text-muted-foreground mt-3 max-w-xl text-pretty text-[16.5px] leading-relaxed">
                        {s.coda}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <footer className="flex flex-wrap items-center justify-between gap-6 px-5 py-8 sm:px-10 sm:py-10">
                <p className="text-muted-foreground font-mono text-[12px] leading-relaxed">
                  Sitalo Webdesign, Hamburg
                  <br />
                  <a href="tel:+491607621876" className="hover:text-foreground underline-offset-4 hover:underline">
                    0160 7621876
                  </a>
                  {" · "}
                  <a href="mailto:info@sitalo.de" className="hover:text-foreground underline-offset-4 hover:underline">
                    info@sitalo.de
                  </a>
                </p>
                <SitaloStempel size="md" className="text-ink-olive -rotate-6 opacity-90" />
              </footer>
            </article>

            <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/anfrage" className="btn-signal">
                Website anfragen <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/atelier"
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
              >
                Wie ein Auftrag bei uns läuft <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([ARTICLE_LD, BREADCRUMB_LD]),
        }}
      />
    </div>
  );
}
