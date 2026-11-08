import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

import { MehrLink } from "@/components/marketing/apple";
import a from "@/components/marketing/hafen/atelier.module.css";
import { kennung } from "@/components/marketing/hafen/paket-kacheln";
import {
  Abschnitt,
  Brotkrumen,
  KontaktKarte,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PAKETE, getAllPaketSlugs, getPaketBySlug, type Paket } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

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

/** Produktbild je Paket: Musterseite auf einem Gerät (frei erfunden). */
const BILD: Record<Paket["slug"], { src: string; alt: string; position: string }> = {
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
  const description = basis.length + zusatz.length <= 158 ? basis + zusatz : basis;
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
        valueAddedTaxIncluded: true,
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
      <MarketingHeader cta={false} />

      <UnterseiteMain>
        {/* Kopf auf Teer: Brotkrumen, Name und Einleitung links, Produktbild
            rechts, darunter der Frachtbrief-Kopf mit den Eckdaten. */}
        <section className="on-dark grain relative bg-[#1b1d1e] text-[#f3f2ee]" data-flaeche-dunkel="">
          <div className="inhalt pt-5 pb-14 sm:pt-7 sm:pb-20">
            <Brotkrumen krumen={[{ href: "/pakete", label: "Pakete" }, { label: paket.name }]} />
            <div className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
              <div>
                <p className={u.eyebrow}>
                  Frachtbrief · Paket {PAKETE.findIndex((p) => p.slug === paket.slug) + 1} von {PAKETE.length}
                </p>
                <h1 className={`${u.titel} mt-5`}>
                  <span className="whitespace-nowrap">Website-Paket</span>{" "}
                  <span className="underline decoration-[var(--gold)] decoration-[0.07em] underline-offset-[0.14em]">{paket.name}</span>
                </h1>
                <p className="mt-6 max-w-xl text-[18px] leading-[1.5] text-pretty text-[#a3a8a9] sm:text-[19px]">
                  {LEAD[paket.slug]}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Link href={`/anfrage?paket=${paket.slug}`} className="btn-signal btn-gross">
                    {paket.name} anfragen
                  </Link>
                  <MehrLink href="/pakete#vergleich" groesse="unter" className="link-pfeil-dunkel text-[#f3f2ee]">
                    Alle Pakete im Vergleich
                  </MehrLink>
                </div>
              </div>
              <figure className="mx-0 w-full max-w-[440px] lg:max-w-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#26292b]">
                  <Image
                    src={BILD[paket.slug].src}
                    alt={BILD[paket.slug].alt}
                    fill
                    preload
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1068px) 400px, (min-width: 480px) 440px, calc(100vw - 32px)"
                    className="object-cover"
                    style={{ objectPosition: BILD[paket.slug].position }}
                  />
                </div>
                <figcaption className={`${u.unterschrift} text-[#a3a8a9]!`}>Musterseite, frei erfunden</figcaption>
              </figure>
            </div>
            <dl className={`${a.felder} mt-12 sm:mt-16`}>
              <div className={a.feld}>
                <dt className={a.feldName}>Paket</dt>
                <dd className={a.feldWert}>{paket.name}</dd>
              </div>
              <div className={a.feld}>
                <dt className={a.feldName}>Festpreis, einmalig</dt>
                <dd className={a.feldWert}>{paket.setup}</dd>
              </div>
              <div className={a.feld}>
                <dt className={a.feldName}>Monatlich</dt>
                <dd className={a.feldWert}>ab {betrag(paket.monthly)}</dd>
              </div>
              <div className={a.feld}>
                <dt className={a.feldName}>Liegezeit bis online</dt>
                <dd className={a.feldWert}>{paket.dauer ?? "nach Absprache"}</dd>
              </div>
            </dl>
            <p className="mt-4 font-mono text-[12px] leading-[1.6] text-[#a3a8a9]">
              Inkl. 19&nbsp;% MwSt. · Hosting, Updates und {aenderungen} pro Monat · Mindestlaufzeit sechs Monate · Kennung{" "}
              {kennung(paket.setup)}
            </p>
          </div>
        </section>

        {/* Für wen: Einleitung links, typische Projekte rechts */}
        <Abschnitt id="fuer-wen" eyebrow="Ladung · für wen" fett={`Für wen ${paket.name} gedacht ist`}>
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
            <aside className="kante-stark self-start pt-4 lg:col-span-5">
              <h3 className={a.eyebrow}>Typische Projekte</h3>
              <ul className="mt-2 divide-y divide-[#1b1d1e]/10">
                {paket.examples.map((e) => (
                  <li key={e} className="py-3 text-[15px] leading-snug">
                    {e}
                  </li>
                ))}
              </ul>
              <h3 className={`${a.eyebrow} mt-8`}>Musterseiten nach Branche</h3>
              <ul className="mt-2 space-y-1">
                {paket.recommendedFor.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/branchen/${r.slug}`}
                      className="link-pfeil text-[15px] font-semibold"
                    >
                      {r.label}&nbsp;<span className="pfeil" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Abschnitt>

        {/* Umfang: drei Spalten mit Kästchen wie im Lotsen, ohne Karten */}
        <Abschnitt id="umfang" eyebrow="Ladeliste · Umfang" fett="Was im Paket steckt, und was nicht">
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            <div className="kante-stark pt-4">
              <h3 className={a.eyebrow}>Im Paket</h3>
              <ul className="mt-2 divide-y divide-[#1b1d1e]/10">
                {paket.contents.map((c) => (
                  <li key={c} className="flex gap-3 py-3 text-[15px] leading-snug">
                    <span aria-hidden="true" className={`${a.kasten} ${a.kastenVoll} mt-0.5 shrink-0`} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="kante-stark pt-4">
              <h3 className={a.eyebrow}>Nicht im Paket</h3>
              <ul className="mt-2 divide-y divide-[#1b1d1e]/10">
                {paket.limits.map((l) => (
                  <li key={l} className="text-muted-foreground flex gap-3 py-3 text-[15px] leading-snug">
                    <span aria-hidden="true" className={`${a.kasten} mt-0.5 shrink-0`} />
                    {l}
                  </li>
                ))}
              </ul>
              {naechstes ? (
                <p className="text-muted-foreground mt-4 text-[14px] leading-relaxed">
                  {naechstes.slug === "studio" ? "Ein neues Erscheinungsbild gibt es mit " : "Ein Wechsel zu "}
                  <Link href={`/pakete/${naechstes.slug}`} className="text-foreground underline decoration-[var(--gold)] underline-offset-4">
                    {naechstes.name}
                  </Link>
                  {naechstes.slug === "studio"
                    ? ". Dafür gestalten wir die Seite neu, den Preis nennen wir Ihnen vorher."
                    : " geht jederzeit, die Seite wird erweitert und nicht neu gebaut."}
                </p>
              ) : null}
            </div>
            <div className="kante-stark pt-4">
              <h3 className={a.eyebrow}>Jeden Monat · {paket.monthly}</h3>
              <ul className="mt-2 divide-y divide-[#1b1d1e]/10">
                {paket.afterLaunch.map((item) => (
                  <li key={item} className="flex gap-3 py-3 text-[15px] leading-snug">
                    <span aria-hidden="true" className="mt-[7px] inline-block h-2 w-2 shrink-0 bg-[var(--gold)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Abschnitt>

        {/* Fragen offen gesetzt wie ein Interview */}
        <Abschnitt
          id="fragen"
          eyebrow="Kaimauer · Fragen"
          fett={`Was zu ${paket.name} oft gefragt wird`}
          rechts={<MehrLink href="/faq">Alle Fragen</MehrLink>}
        >
          <dl className={a.interview}>
            {paket.faq.map((item) => (
              <div key={item.q}>
                <dt className={a.frage}>{item.q}</dt>
                <dd className={a.antwort}>{item.a}</dd>
              </div>
            ))}
          </dl>
          <div className={a.fragenMobil}>
            {paket.faq.map((item, i) => (
              <details key={item.q} open={i < 3}>
                <summary>
                  <h3 className={a.frage}>{item.q}</h3>
                </summary>
                <p className={a.antwort}>{item.a}</p>
              </details>
            ))}
          </div>
        </Abschnitt>

        {/* Die anderen Pakete als Verzeichnis */}
        <Abschnitt
          id="andere"
          eyebrow="Fahrplan · weitere Abfahrten"
          fett="Die anderen Pakete, alle mit Festpreis"
          rechts={<MehrLink href="/pakete#vergleich">Alle vier im Vergleich</MehrLink>}
        >
          <ol className={`${a.lvListe} kante-stark`}>
            {otherPakete.map((other) => (
              <li key={other.slug}>
                <Link href={`/pakete/${other.slug}`} className={a.lvZeile}>
                  <span className={a.lvNr}>{PAKETE.findIndex((p) => p.slug === other.slug) + 1}</span>
                  <span>
                    <span className={a.lvTitel}>{other.name}</span>
                    <span className={a.lvSatz}>{LEAD[other.slug].split(". ")[0].replace(/\.$/, "") + "."}</span>
                  </span>
                  <span className={a.lvWert}>
                    {other.setup} <span className={a.lvPfeil}>→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Abschnitt>

        <KontaktKarte
          eyebrow={paket.name}
          titel={
            paket.slug === "premium" || paket.slug === "studio"
              ? `Ob ${paket.name} zu Ihrem Betrieb passt oder ein kleineres Paket genügt, klären wir in einem kurzen Telefonat.`
              : `Ob ${paket.name} für Ihren Betrieb reicht, klären wir in einem kurzen Telefonat.`
          }
          zeile="Oder Sie schicken die Anfrage gleich mit dem gewählten Paket. Wir antworten meist am selben Werktag, den Festpreis bekommen Sie schriftlich."
          pille={{ href: `/anfrage?paket=${paket.slug}`, label: `${paket.name} anfragen` }}
          link={{ href: "/termin", label: "Erstgespräch buchen" }}
        />
      </UnterseiteMain>

      <MarketingFooter ohnePreisHinweis />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
