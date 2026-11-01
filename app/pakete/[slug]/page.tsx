import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Minus } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PAKETE, getAllPaketSlugs, getPaketBySlug, type Paket } from "@/lib/pakete-data";
import { CONTACT_EMAIL } from "@/lib/site";
import { SITE_URL } from "@/lib/site";

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** Kleine Änderungen im Monatsbeitrag, je Paket (siehe lib/pakete-data.ts). */
const AENDERUNGEN: Record<Paket["slug"], string> = {
  starter: "eine kleine Änderung",
  business: "drei kleine Änderungen",
  premium: "sechs kleine Änderungen",
  studio: "zehn kleine Änderungen",
};

/**
 * Einleitung im Kopf: was das Paket konkret ist, in ein, zwei Sätzen.
 * Die Angaben stammen aus lib/pakete-data.ts (Inhalte, Detailtext, FAQ).
 */
const LEAD: Record<Paket["slug"], string> = {
  starter:
    "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten. Wer nur wenige Leistungen anbietet, braucht oft nicht mehr.",
  business: "Bis zu fünf Unterseiten für Leistungen, Team, Galerie und Kontakt, dazu die Grundlagen für Google.",
  premium:
    "Eine Struktur, die wir für Ihren Betrieb anlegen. Speisekarte, Angebote oder Termine pflegen Sie auf Wunsch selbst.",
  studio:
    "Ein neues Erscheinungsbild: Schrift, Farben und Bildsprache entwerfen wir eigens für Ihren Betrieb. Vor dem Entwurf treffen wir uns in Hamburg oder bei Ihnen.",
};

/** „ab 2.499 €" → „2.499 €", „ab 79 € / Monat" → „79 €" */
function betrag(label: string) {
  return label.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");
}

export function generateStaticParams() {
  return getAllPaketSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paket = getPaketBySlug(slug);
  if (!paket) return {};

  const title = `Website-Paket ${paket.name}: ${paket.setup} Festpreis`;
  const description = paket.description;
  return {
    title,
    description,
    alternates: { canonical: `/pakete/${paket.slug}` },
    openGraph: { type: "article", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PaketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paket = getPaketBySlug(slug);
  if (!paket) notFound();

  const otherPakete = PAKETE.filter((p) => p.slug !== paket.slug);

  /* JSON-LD: Service-Schema (mit Offer + FAQPage) + BreadcrumbList
   * als Array. Service beschreibt das Paket-Angebot mit Preis und FAQ,
   * BreadcrumbList gibt Google die Hierarchie für Rich-Results in
   * den SERPs. */
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${paket.name}-Webdesign-Paket`,
    description: paket.description,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Sitalo Webdesign",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: paket.setup.replace(/[^\d]/g, ""),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "EUR",
        price: paket.monthly.replace(/[^\d]/g, ""),
        billingDuration: "P1M",
      },
    },
    url: `https://www.sitalo.de/pakete/${paket.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sitalo",
        item: "https://www.sitalo.de/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pakete",
        item: "https://www.sitalo.de/pakete",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: paket.name,
        item: `https://www.sitalo.de/pakete/${paket.slug}`,
      },
    ],
  };

  /* FAQPage-Schema aus den paket-spezifischen FAQs — schaltet auf
   * der SERP-Seite expandable FAQ-Snippets unter dem normalen
   * Treffer frei. */
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: paket.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const jsonLd = [serviceLd, breadcrumbLd, faqLd];

  const aenderungen = AENDERUNGEN[paket.slug];
  const naechstes = PAKETE[PAKETE.findIndex((p) => p.slug === paket.slug) + 1];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />

      <main id="main" tabIndex={-1} className="flex-1">
        {/* Kopf: Name und Kurzbeschreibung links, Preiszettel rechts */}
        <section className="grain bg-foreground text-background relative overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-5 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-20 lg:pb-24">
            <nav aria-label="Brotkrumen">
              <ol className="text-stahl-hell flex flex-wrap items-center gap-2 font-mono text-[12px]">
                <li>
                  <Link href="/" className="hover:text-background transition-colors">
                    Start
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link href="/pakete" className="hover:text-background transition-colors">
                    Pakete
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-background/85">
                  {paket.name}
                </li>
              </ol>
            </nav>
            <div className="mt-12 grid gap-12 sm:mt-16 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <p className="label-mono text-stahl-hell flex items-center gap-3">
                  <span aria-hidden="true" className="bg-gold inline-block h-2.5 w-2.5 shrink-0" />
                  Paket {PAKETE.findIndex((p) => p.slug === paket.slug) + 1} von {PAKETE.length}
                </p>
                <h1 className="mt-6 text-balance text-[2.5rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[4.25rem]">
                  <span className="whitespace-nowrap">Website-Paket</span> {paket.name}
                </h1>
                <p className="text-stahl-hell mt-6 max-w-xl text-pretty text-[16.5px] leading-relaxed sm:text-lg">
                  {LEAD[paket.slug]}
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={`/anfrage?paket=${paket.slug}`} className="btn-signal grow sm:grow-0">
                    {paket.name} anfragen {ARROW}
                  </Link>
                  <Link href="/pakete#vergleich" className="btn-line grow sm:grow-0">
                    Alle Pakete im Vergleich
                  </Link>
                </div>
              </div>
              <div className="border-background/15 border-t pt-7 lg:col-span-4 lg:col-start-9 lg:self-end lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                <p className="label-mono text-stahl-hell">Festpreis</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-stahl-hell text-[15px]">ab</span>
                  <span className="serif text-[3.4rem] leading-none tracking-[-0.03em] sm:text-6xl">
                    {betrag(paket.setup)}
                  </span>
                </p>
                <p className="text-stahl-hell mt-2 text-[14px]">einmalig, zzgl. MwSt.</p>
                <div className="border-background/15 mt-6 border-t pt-5">
                  <p className="flex items-baseline gap-2">
                    <span className="text-stahl-hell text-[14px]">ab</span>
                    <span className="serif text-[1.6rem] leading-none">{betrag(paket.monthly)}</span>
                    <span className="text-stahl-hell text-[14px]">im Monat</span>
                  </p>
                  <p className="text-stahl-hell mt-2 text-[14px] leading-relaxed">
                    Hosting, Updates und {aenderungen} pro Monat. Mindestlaufzeit sechs Monate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Für wen: Einleitung links, typische Projekte rechts */}
        <section>
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Für wen {paket.name} gedacht ist
              </h2>
              <div className="mt-8 max-w-2xl space-y-5">
                {paket.detailIntro.map((paragraph, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-foreground text-[19px] leading-[1.55] tracking-[-0.005em] text-pretty"
                        : "text-foreground/80 text-[16px] leading-[1.7] text-pretty"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <aside className="lg:col-span-4 lg:col-start-9 lg:pt-3">
              <h3 className="label-mono text-muted-foreground">Typische Projekte</h3>
              <ul className="border-foreground mt-4 border-t">
                {paket.examples.map((e) => (
                  <li key={e} className="border-border border-b py-3 text-[15px] leading-snug">
                    {e}
                  </li>
                ))}
              </ul>
              <h3 className="label-mono text-muted-foreground mt-10">Musterseiten nach Branche</h3>
              <ul className="mt-3 space-y-2">
                {paket.recommendedFor.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/branchen/${r.slug}`}
                      className="group inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                    >
                      {r.label}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* Umfang: drei Spalten wie ein Tabellenkopf */}
        <section className="bg-card border-foreground border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <h2 className="max-w-3xl text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
              Was im Paket steckt und was nicht
            </h2>
            <div className="mt-10 grid gap-12 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
              <div>
                <h3 className="label-mono border-foreground border-t-2 pt-3">Im Paket</h3>
                <ul className="mt-2">
                  {paket.contents.map((c) => (
                    <li key={c} className="border-border flex gap-3 border-b py-3 text-[15px] leading-snug">
                      <Check className="text-ink-petrol mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="label-mono border-foreground border-t-2 pt-3">Nicht im Paket</h3>
                <ul className="mt-2">
                  {paket.limits.map((l) => (
                    <li key={l} className="border-border text-muted-foreground flex gap-3 border-b py-3 text-[15px] leading-snug">
                      <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {l}
                    </li>
                  ))}
                </ul>
                {naechstes ? (
                  <p className="text-muted-foreground mt-4 text-[14px] leading-relaxed">
                    {naechstes.slug === "studio" ? "Ein neues Erscheinungsbild gibt es mit " : "Ein Wechsel zu "}
                    <Link href={`/pakete/${naechstes.slug}`} className="text-foreground underline underline-offset-4">
                      {naechstes.name}
                    </Link>
                    {naechstes.slug === "studio"
                      ? ". Dafür gestalten wir die Seite neu, den Preis nennen wir Ihnen vorher."
                      : " geht jederzeit, die Seite wird erweitert und nicht neu gebaut."}
                  </p>
                ) : null}
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <h3 className="label-mono border-foreground border-t-2 pt-3">Nach dem Start · {paket.monthly}</h3>
                <ul className="mt-2">
                  {paket.afterLaunch.map((item) => (
                    <li key={item} className="border-border flex gap-3 border-b py-3 text-[15px] leading-snug">
                      <span aria-hidden="true" className="bg-foreground mt-[7px] inline-block h-1.5 w-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fragen: offen gesetzt, nichts zum Aufklappen */}
        <section className="border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Fragen zu {paket.name}
              </h2>
              <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
                Alle Fragen {ARROW}
              </Link>
            </div>
            <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
              {paket.faq.map((item) => (
                <div key={item.q} className="border-foreground border-t pt-5">
                  <dt className="text-[17.5px] leading-snug font-semibold tracking-[-0.01em]">{item.q}</dt>
                  <dd className="text-muted-foreground mt-3 text-[15.5px] leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Die anderen Pakete als Preisliste */}
        <section className="bg-card border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="label-mono text-muted-foreground">Die anderen Pakete</h2>
              <Link
                href="/pakete#vergleich"
                className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
              >
                Alle vier im Vergleich {ARROW}
              </Link>
            </div>
            <ul className="border-foreground border-t lg:col-span-8">
              {otherPakete.map((other) => (
                <li key={other.slug} className="border-border border-b">
                  <Link href={`/pakete/${other.slug}`} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                    <span className="text-[1.3rem] tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4" style={{ fontStretch: "110%", fontWeight: 700 }}>
                      {other.name}
                    </span>
                    <span className="text-muted-foreground text-[14.5px] tabular-nums">
                      {other.setup} einmalig · {other.monthly}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Abschluss: Telefon groß, daneben Anfrage */}
        <section className="grain bg-foreground text-background">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-stahl-hell text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
                Ob {paket.name} für Ihren Betrieb reicht, klären wir in einem kurzen Telefonat.
              </h2>
              <a
                href="tel:+491607621876"
                className="hover:text-gold mt-5 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[4rem] lg:text-[4.4rem]"
                style={{ fontStretch: "118%", fontWeight: 780 }}
              >
                0160&nbsp;7621876
              </a>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-stahl-hell text-[16px] leading-relaxed">
                Oder Sie schicken die Anfrage gleich mit dem gewählten Paket. Wir antworten meist am selben Werktag, den Festpreis
                bekommen Sie schriftlich.
              </p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold">
                {CONTACT_EMAIL}
              </a>
              <div className="mt-7">
                <Link href={`/anfrage?paket=${paket.slug}`} className="btn-signal">
                  {paket.name} anfragen {ARROW}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
