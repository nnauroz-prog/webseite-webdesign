import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Check, Minus } from "lucide-react";

import { MehrLink } from "@/components/marketing/apple";
import { KarteGross, LadenFoto } from "@/components/marketing/laden/karten";
import { LadenRegal } from "@/components/marketing/laden/laden-regal";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  KontaktKarte,
  MusterPille,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import {
  PAKETE,
  getAllPaketSlugs,
  getPaketBySlug,
  type Paket,
} from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";
import { ogFor } from "@/lib/seo";

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
  business:
    "Bis zu fünf Unterseiten für Leistungen, Team, Galerie und Kontakt, dazu die Grundlagen für Google.",
  premium:
    "Eine Struktur, die wir für Ihren Betrieb anlegen. Speisekarte, Angebote oder Termine pflegen Sie auf Wunsch selbst.",
  studio:
    "Ein neues Erscheinungsbild: Schrift, Farben und Bildsprache entwerfen wir eigens für Ihren Betrieb. Vor dem Entwurf treffen wir uns in Hamburg oder bei Ihnen.",
};

/** Produktbild je Paket: Musterseite auf einem Gerät (frei erfunden). */
const BILD: Record<
  Paket["slug"],
  { src: string; alt: string; position: string }
> = {
  starter: {
    src: "/images/sitalo-friseur-mobile.webp",
    alt: "Handy mit einer einseitigen Musterseite für einen Friseur, daneben Visitenkarten",
    position: "60% 50%",
  },
  business: {
    src: "/images/sitalo-pflege-laptop.webp",
    alt: "Laptop mit der mehrseitigen Musterseite eines Pflegedienstes auf einem hellen Schreibtisch",
    position: "42% 55%",
  },
  premium: {
    src: "/images/sitalo-cafe-mobile.webp",
    alt: "Handy mit der Musterseite eines Cafés mit Speisekarte auf einem Holztisch",
    position: "50% 50%",
  },
  studio: {
    src: "/images/sitalo-kanzlei-laptop.webp",
    alt: "Laptop mit der Musterseite einer Kanzlei neben einer grünen Schreibtischlampe und alten Büchern",
    position: "50% 55%",
  },
};

/** „ab 2.999 €" → „2.999 €", „ab 99 € / Monat" → „99 €" */
function betrag(label: string) {
  return label.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");
}

export function generateStaticParams() {
  return getAllPaketSlugs().map((slug) => ({ slug }));
}

/** Eigene Beschreibung, wo die gebaute zu lang wird oder die Aufforderung fehlt. */
const META_DESCRIPTION: Partial<Record<string, string>> = {
  premium:
    "Website-Paket Premium ab 2.999 € inkl. MwSt.: eigene Struktur für Ihren Betrieb, Bereiche wie Speisekarte oder Termine pflegen Sie selbst. Jetzt anfragen.",
  studio:
    "Sitalo Studio ab 3.990 € inkl. MwSt.: neues Erscheinungsbild und Website, Treffen vor Ort, bis zu drei Korrekturrunden. Jetzt unverbindlich anfragen.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paket = getPaketBySlug(slug);
  if (!paket) return {};

  // Starter führt „Onepager erstellen lassen"; die übrigen Pakete den Paketnamen.
  const onepager = paket.slug === "starter";
  const title = onepager
    ? `Onepager erstellen lassen ${paket.setup}: Paket ${paket.name}`
    : `Website-Paket ${paket.name}: ${paket.setup} Festpreis`;
  const basis = onepager
    ? "Onepage-Website mit Leistungen, Öffnungszeiten und Kontakt, fürs Handy gebaut."
    : paket.description;
  // Preis und Dauer anhängen, solange die Beschreibung unter 158 Zeichen bleibt.
  const zusatz = ` Festpreis ${paket.setup} inkl. MwSt., online ${paket.dauer}.`;
  const gebaut = basis.length + zusatz.length <= 158 ? basis + zusatz : basis;
  // Aufforderung anhängen, solange die Beschreibung unter 160 Zeichen bleibt.
  const cta = " Jetzt anfragen.";
  const description =
    META_DESCRIPTION[paket.slug] ??
    (gebaut.length + cta.length <= 160 ? gebaut + cta : gebaut);
  return {
    title,
    description,
    alternates: { canonical: `/pakete/${paket.slug}` },
    openGraph: ogFor(`/pakete/${paket.slug}`, title, description),
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Abschlussbild je Paket: Atmosphäre der Branche, deren Muster das Paket zeigt (Studio: Hafenszene). */
const ABSCHLUSS_FOTO: Record<
  string,
  { src: string; alt: string; position?: string } | undefined
> = {
  starter: {
    src: "/images/atmosphere/friseur-stuhl.webp",
    alt: "Lederner Friseurstuhl vor einem runden Spiegel",
  },
  business: {
    src: "/images/atmosphere/pflege-eingang.webp",
    alt: "Heller Empfang eines Pflegedienstes mit Holztresen und Pflanze",
    position: "50% 60%",
  },
  premium: {
    src: "/images/atmosphere/gastro-cafe.webp",
    alt: "Café mit kupferner Espressomaschine und Holztischen",
  },
};

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
  const setup = paket.setup.replace(/[^\d]/g, "");
  const monthly = paket.monthly.replace(/[^\d]/g, "");
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Website-Paket ${paket.name}`,
    description: paket.description,
    // Das Unternehmen selbst beschreibt das Root-Layout (ProfessionalService).
    provider: { "@id": `${SITE_URL}/#business` },
    // Einmalpreis und Monatsbeitrag getrennt, damit der Monatsbeitrag
    // nicht als Preis des Pakets gelesen wird.
    offers: [
      {
        "@type": "Offer",
        name: "Einmalpreis",
        price: setup,
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: setup,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: true,
        },
      },
      {
        "@type": "Offer",
        name: "Monatsbeitrag",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: monthly,
          priceCurrency: "EUR",
          unitCode: "MON",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "MON",
          },
          valueAddedTaxIncluded: true,
        },
      },
    ],
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
      <MarketingHeader cta={false} />
      <Produktleiste
        titel={paket.name}
        titelHref="/pakete"
        links={[]}
        cta={{ href: `/anfrage?paket=${paket.slug}`, label: "Anfragen" }}
      />

      <UnterseiteMain>
        {/* Kopf schwarz: Name und Einleitung links, Produktbild und Preis rechts */}
        <section
          className="on-dark bg-black text-[#f5f5f7]"
          data-flaeche-dunkel=""
        >
          <div className="inhalt pt-6 pb-14 sm:pt-8 sm:pb-20">
            <nav aria-label="Brotkrumen">
              <ol className="flex flex-wrap items-center gap-2 text-[12px] text-[#a1a1a6]">
                <li>
                  <Link
                    href="/"
                    className="inline-flex min-h-6 items-center hover:text-white"
                  >
                    Start
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link
                    href="/pakete"
                    className="inline-flex min-h-6 items-center hover:text-white"
                  >
                    Pakete
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-[#f5f5f7]">
                  {paket.name}
                </li>
              </ol>
            </nav>
            <div className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14">
              <div>
                <p className="text-[14px] leading-5 font-semibold text-[#ff9f5a] sm:text-[17px] sm:leading-6">
                  Paket {PAKETE.findIndex((p) => p.slug === paket.slug) + 1} von{" "}
                  {PAKETE.length}
                </p>
                <h1 className={`${u.titel} !mx-0 mt-2 text-left`}>
                  <span className="whitespace-nowrap">Website-Paket</span>{" "}
                  {paket.name}
                </h1>
                <p className="mt-5 max-w-xl text-[19px] leading-[1.32] text-pretty text-[#a1a1a6] sm:text-[21px]">
                  {LEAD[paket.slug]}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Link
                    href={`/anfrage?paket=${paket.slug}`}
                    className="btn-signal btn-gross"
                  >
                    {paket.name} anfragen
                  </Link>
                  <MehrLink
                    href="/pakete#vergleich"
                    groesse="unter"
                    className="!text-[#ff9f5a]"
                  >
                    Alle Pakete im Vergleich
                  </MehrLink>
                </div>
              </div>
              <div className="w-full max-w-[460px] lg:max-w-none">
                <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#1d1d1f] sm:rounded-[28px]">
                  <Image
                    src={BILD[paket.slug].src}
                    alt={BILD[paket.slug].alt}
                    fill
                    preload
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1068px) 420px, (min-width: 500px) 460px, calc(100vw - 32px)"
                    className="object-cover"
                    style={{ objectPosition: BILD[paket.slug].position }}
                  />
                  <MusterPille />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-5 border-t border-white/15 pt-5">
                  <div>
                    <p className="text-[12px] font-semibold text-[#a1a1a6]">
                      Festpreis, einmalig
                    </p>
                    <p className="mt-1 text-[32px] leading-[36px] font-bold tracking-[-0.02em] tabular-nums sm:text-[40px] sm:leading-[44px]">
                      <span className="mr-1 text-[15px] font-normal text-[#a1a1a6]">
                        ab
                      </span>
                      {betrag(paket.setup)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#a1a1a6]">
                      Im Monat
                    </p>
                    <p className="mt-1 text-[32px] leading-[36px] font-bold tracking-[-0.02em] tabular-nums sm:text-[40px] sm:leading-[44px]">
                      <span className="mr-1 text-[15px] font-normal text-[#a1a1a6]">
                        ab
                      </span>
                      {betrag(paket.monthly)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[14px] leading-5 text-[#a1a1a6]">
                  Inkl. 19&nbsp;% MwSt. Hosting, Updates und {aenderungen} pro
                  Monat. Mindestlaufzeit sechs Monate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Für wen: Einleitung links, typische Projekte rechts */}
        <Abschnitt id="fuer-wen" fett={`Für wen ${paket.name} gedacht ist.`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-5">
            <div className="space-y-5 lg:col-span-7">
              {paket.detailIntro.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[19px] leading-[1.5] tracking-[-0.01em] text-pretty sm:text-[21px]"
                      : `${u.text} text-[#424245]`
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <aside className={`${u.blatt} self-start lg:col-span-5`}>
              <h3 className="text-[14px] font-semibold text-[#6e6e73]">
                Typische Projekte
              </h3>
              <ul className="mt-2 divide-y divide-black/10">
                {paket.examples.map((e) => (
                  <li key={e} className="py-3 text-[15px] leading-snug">
                    {e}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-[14px] font-semibold text-[#6e6e73]">
                Musterseiten nach Branche
              </h3>
              <ul className="mt-2 space-y-1">
                {paket.recommendedFor.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/branchen/${r.slug}`}
                      className="group text-gold-ink inline-flex min-h-8 items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                    >
                      {r.label}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Abschnitt>

        {/* Umfang: drei Kacheln */}
        <Abschnitt
          id="umfang"
          fett="Was im Paket steckt."
          grau="Und was nicht."
        >
          {/* Am Handy drei Reiter statt drei Listen untereinander (reines CSS
              mit :has; ohne Unterstützung stehen alle drei Listen da). */}
          <div className="umfang">
            <div
              className="umfang-reiter"
              role="radiogroup"
              aria-label="Umfang anzeigen"
            >
              <input
                type="radio"
                name="umfang"
                id="um-1"
                defaultChecked
                className="sr-only"
              />
              <label htmlFor="um-1">Im Paket</label>
              <input type="radio" name="umfang" id="um-2" className="sr-only" />
              <label htmlFor="um-2">Nicht dabei</label>
              <input type="radio" name="umfang" id="um-3" className="sr-only" />
              <label htmlFor="um-3">Jeden Monat</label>
            </div>
            <BildRaster>
              <BildKachel
                spalten={4}
                titel="Im Paket"
                kinder={
                  <ul className="mt-3 divide-y divide-black/10">
                    {paket.contents.map((c) => (
                      <li
                        key={c}
                        className="flex gap-3 py-3 text-[15px] leading-snug"
                      >
                        <Check
                          className="haken text-gold-ink mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                }
              />
              <BildKachel
                spalten={4}
                titel="Nicht im Paket"
                kinder={
                  <>
                    <ul className="mt-3 divide-y divide-black/10">
                      {paket.limits.map((l) => (
                        <li
                          key={l}
                          className="flex gap-3 py-3 text-[15px] leading-snug text-[#6e6e73]"
                        >
                          <Minus
                            className="mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          {l}
                        </li>
                      ))}
                    </ul>
                    {naechstes ? (
                      <p className="mt-4 text-[14px] leading-relaxed text-[#6e6e73]">
                        {naechstes.slug === "studio"
                          ? "Ein neues Erscheinungsbild gibt es mit "
                          : "Ein Wechsel zu "}
                        <Link
                          href={`/pakete/${naechstes.slug}`}
                          className="text-foreground underline underline-offset-4"
                        >
                          {naechstes.name}
                        </Link>
                        {naechstes.slug === "studio"
                          ? ". Dafür gestalten wir die Seite neu, den Preis nennen wir Ihnen vorher."
                          : " geht jederzeit, die Seite wird erweitert und nicht neu gebaut."}
                      </p>
                    ) : null}
                  </>
                }
              />
              <BildKachel
                ton="nacht"
                spalten={4}
                breit
                className="min-[1068px]:!col-span-4"
                eyebrow={`Nach dem Start · ${paket.monthly}`}
                titel="Jeden Monat dabei"
                kinder={
                  <ul className="mt-3 divide-y divide-white/15">
                    {paket.afterLaunch.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 py-3 text-[15px] leading-snug"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff9f5a]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                }
              />
            </BildRaster>
          </div>
        </Abschnitt>

        {/* Fragen */}
        <Abschnitt
          id="fragen"
          fett={`Fragen zu ${paket.name}.`}
          grau="Kurz beantwortet."
          rechts={<MehrLink href="/faq">Alle Fragen</MehrLink>}
        >
          <div
            data-ein=""
            className="divide-y divide-black/10 rounded-[18px] bg-white px-[22px] shadow-[0_14px_40px_-10px_rgb(16_32_48/0.14)] sm:rounded-[28px] sm:px-8"
          >
            {paket.faq.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-[17px] leading-snug font-semibold tracking-[-0.016em] sm:text-[19px]">
                    {item.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center text-[22px] leading-none font-light text-[#6e6e73] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty text-[#424245]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Abschnitt>

        {/* Die anderen Pakete als Regal mit Bildkarten */}
        <LadenRegal
          id="andere"
          fett="Die anderen Pakete."
          grau="Alle mit Festpreis."
          link={{ href: "/pakete#vergleich", label: "Alle vier im Vergleich" }}
        >
          {otherPakete.map((other) => (
            <KarteGross
              key={other.slug}
              ton={other.highlight ? "schwarz" : "weiss"}
              eyebrow={`Paket ${PAKETE.findIndex((p) => p.slug === other.slug) + 1}`}
              titel={other.name}
              zeile={LEAD[other.slug].split(". ")[0].replace(/\.$/, "") + "."}
              preis={other.setup}
              monat={`${betrag(other.monthly)} im Monat`}
              href={`/pakete/${other.slug}`}
              bildBeschrieben
              bild={
                <>
                  <LadenFoto
                    src={BILD[other.slug].src}
                    alt={BILD[other.slug].alt}
                    position={BILD[other.slug].position}
                  />
                  <MusterPille text="Musterseite" />
                </>
              }
            />
          ))}
        </LadenRegal>

        <KontaktKarte
          eyebrow={paket.name}
          titel={
            paket.slug === "premium" || paket.slug === "studio"
              ? `Ob ${paket.name} zu Ihrem Betrieb passt oder ein kleineres Paket genügt, klären wir in einem kurzen Telefonat.`
              : `Ob ${paket.name} für Ihren Betrieb reicht, klären wir in einem kurzen Telefonat.`
          }
          zeile="Oder Sie schicken die Anfrage gleich mit dem gewählten Paket. Wir antworten meist am selben Werktag, den Festpreis bekommen Sie schriftlich."
          pille={{
            href: `/anfrage?paket=${paket.slug}`,
            label: `${paket.name} anfragen`,
          }}
          link={{ href: "/termin", label: "Erstgespräch buchen" }}
          foto={ABSCHLUSS_FOTO[paket.slug]}
        />
      </UnterseiteMain>

      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
