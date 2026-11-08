import type { Metadata } from "next";

import { MehrLink } from "@/components/marketing/apple";
import { MusterFenster } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { Briefkarte } from "@/components/marketing/vertical-landing";
import { BRANCHEN } from "@/lib/branchen-data";
import { BRANCHEN_SEO } from "@/lib/branchen-seo";
import { getPaketBySlug } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: "Branchen · Websites für Ihren Betrieb",
  description:
    "Websites für Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien und Fitnessstudios — jede Seite individuell gebaut.",
  alternates: { canonical: "/branchen" },
};

const ZAHLWORT: Record<number, string> = { 8: "Acht", 9: "Neun", 10: "Zehn", 11: "Elf", 12: "Zwölf" };

/** Branchen mit eigener Landingpage (/pflege, /praxen), aus lib/branchen-seo.ts. */
const LANDINGS = BRANCHEN.flatMap((b) => {
  const landing = BRANCHEN_SEO[b.slug]?.landing;
  return landing ? [landing] : [];
});

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
          Eine Praxis braucht anderes als ein Café. Für jede Branche haben wir aufgeschrieben, worauf Ihre Kundschaft zuerst
          schaut, und eine Musterseite gebaut.
        </PageHero>
        <Register />
        <Briefkarte title="Wir bauen auch für Betriebe, die hier nicht stehen.">
          Schreiben Sie uns zwei, drei Sätze zu Ihrem Betrieb. Den Festpreis bekommen Sie schriftlich, bevor wir
          anfangen.
        </Briefkarte>
      </main>
      <MarketingFooter crumb="Branchen" />
    </div>
  );
}

/**
 * Branchen als Karten-Raster wie ein Apple-Regal: Musterseite als Bild
 * oben, Name, kurze Einordnung, das meist empfohlene Paket und
 * „Mehr erfahren ›“. Details stehen auf /branchen/[slug].
 */
function Register() {
  return (
    <section className="flaeche-hell abschnitt">
      <ul role="list" className="mx-auto grid max-w-[1200px] gap-3 px-[max(var(--rinne),env(safe-area-inset-left))] sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {BRANCHEN.map((b) => {
          const paket = getPaketBySlug(b.recommendedPackage);
          return (
            <li key={b.slug} id={b.slug} className="flex scroll-mt-24">
              <article data-auftritt="" className="karte karte-regal flex w-full flex-col p-6 sm:p-7">
                <div className="overflow-hidden rounded-[12px]">
                  <MusterFenster branche={b.slug} rahmen={false} />
                </div>
                <h2 className="t-karte mt-6">{b.label}</h2>
                <p className="text-muted-foreground mt-2 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty">
                  {b.shortBody}
                </p>
                {paket ? (
                  <p className="mt-4 text-[14px] leading-[1.43]">
                    Meist empfohlen: <span className="font-semibold">{paket.name}</span>{" "}
                    <span className="text-muted-foreground tabular-nums">{paket.setup}</span>
                  </p>
                ) : null}
                <div className="mt-auto pt-6">
                  <MehrLink href={`/branchen/${b.slug}`} kontext={b.label} groesse="klein" frei={false} className="karte-link">
                    Mehr erfahren
                  </MehrLink>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <div className="inhalt mt-10 text-center">
        <p className="t-fuss text-[14px]">Preise sind Einmalpreise inkl. MwSt., dazu kommt ein Monatsbeitrag je Paket.</p>
        <p className="mt-1">
          <MehrLink href="/pakete" groesse="klein">
            Alle Pakete
          </MehrLink>
        </p>
        {/* Landingpages mit Ablauf und Preisen: sie führen „… erstellen lassen", die Branchenseiten den Seitenplan. */}
        <h2 className="t-karte mt-12 text-[21px]">Eigene Seiten mit Ablauf</h2>
        <ul className="mt-2 flex flex-wrap justify-center gap-x-8">
          {LANDINGS.map((l) => (
            <li key={l.href}>
              <MehrLink href={l.href}>{l.label}</MehrLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
