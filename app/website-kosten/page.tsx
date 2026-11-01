import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { PAKETE, getPaketBySlug, type Paket } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

/**
 * Ratgeber für die Suchanfragen „Was kostet eine Website",
 * „Website Kosten", „Homepage erstellen lassen Kosten". Informations-
 * Suche, die direkt vor einer Beauftragung steht — führt am Ende auf
 * unsere Pakete und die Anfrage.
 *
 * Marktspannen sind bewusst als grobe Erfahrungswerte formuliert, nicht
 * als Statistik. Eigene Preise kommen aus lib/pakete-data.ts.
 */

const TITLE = "Was kostet eine Website? Preise 2026 im Überblick";
const DESCRIPTION =
  "Was eine Website für kleine Unternehmen kostet: Baukasten, Freelancer, Agentur im Vergleich, laufende Kosten und worauf Sie beim Angebot achten sollten.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · Sitalo` },
  description: DESCRIPTION,
  alternates: { canonical: "/website-kosten" },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/website-kosten` },
};

const STARTER = getPaketBySlug("starter");
const STARTER_SETUP = STARTER?.setup ?? "ab 499 €";
/** „ab 49 € / Monat" → „ab 49 €" */
const STARTER_MONTHLY = (STARTER?.monthly ?? "ab 49 € / Monat").replace(/\s*\/\s*Monat$/, "");

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** Was im Paket steckt, in einem Satz. Angaben aus lib/pakete-data.ts. */
const PAKET_KURZ: Record<Paket["slug"], string> = {
  starter: "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten.",
  business: "Bis zu fünf Unterseiten mit Team, Leistungen und Galerie. Ihre Fotos bereiten wir mit auf.",
  premium: "Eine eigene Struktur für Ihren Betrieb. Auf Wunsch pflegen Sie Speisekarte, Angebote oder Termine selbst.",
  studio: "Eigene Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden und ein Treffen vor Ort.",
};

const WEGE = [
  {
    name: "Baukasten selbst",
    einmalig: "0 €",
    laufend: "ca. 10–40 € / Monat",
    passt: "Wenn Sie Zeit haben und Gestaltung, Texte, Technik und Rechtliches selbst übernehmen.",
  },
  {
    name: "Freelancer",
    einmalig: "ca. 800–5.000 €",
    laufend: "oft nach Aufwand",
    passt: "Wenn Sie jemanden finden, der auch nach dem Start verlässlich erreichbar bleibt.",
  },
  {
    name: "Agentur",
    einmalig: "ab ca. 5.000 €",
    laufend: "Wartungsvertrag, oft 100–500 € / Monat",
    passt: "Für größere Unternehmen mit Shop, Schnittstellen oder eigener Marketing-Abteilung.",
  },
];

const FAKTOREN = [
  { title: "Umfang", text: "Eine Seite mit allem Wichtigen ist günstiger als zehn Unterseiten mit Team, Galerie und Leistungen." },
  { title: "Texte und Bilder", text: "Liegen gute Inhalte vor, geht es schneller. Müssen Texte erst geschrieben werden, steigt der Aufwand." },
  { title: "Funktionen", text: "Terminbuchung, Bewerbungsformular, mehrere Sprachen oder ein Shop kosten jeweils extra." },
  { title: "Gestaltung", text: "Eine angepasste Vorlage ist günstiger als eine Gestaltung, die eigens für Ihren Betrieb entworfen wird." },
  { title: "Google-Sichtbarkeit", text: "Saubere Struktur, Titel, Beschreibungen und lokale Suchbegriffe gehören dazu, werden aber nicht überall mitgeliefert." },
  { title: "Betreuung danach", text: "Hosting, Updates, Sicherheit und kleine Änderungen fallen jeden Monat an, auch wenn das im Angebot nicht steht." },
];

const CHECKLISTE = [
  "Ist der Preis ein Festpreis oder eine Schätzung?",
  "Sind Texte, Bildbearbeitung und Rechtstexte enthalten?",
  "Wem gehören Domain und Inhalte, wenn Sie wechseln möchten?",
  "Was kosten Hosting, Updates und kleine Änderungen im Monat?",
  "Wie schnell bekommen Sie eine Antwort, wenn etwas nicht funktioniert?",
  "Wird die Seite für Handy und Google eingerichtet?",
];

const FAQ = [
  {
    q: "Was kostet eine einfache Website für ein kleines Unternehmen?",
    a: `Eine professionelle Onepage-Website kostet je nach Anbieter meist zwischen einigen hundert und wenigen tausend Euro. Bei uns beginnt sie bei ${STARTER_SETUP.replace(/^ab\s*/, "")}, dazu kommt ein Monatsbeitrag ${STARTER_MONTHLY} für Hosting und Pflege.`,
  },
  {
    q: "Welche laufenden Kosten hat eine Website?",
    a: "Domain, Hosting, SSL-Zertifikat, Updates und Sicherheit. Je nach Anbieter zahlen Sie dafür einzeln oder in einem Monatsbeitrag. Dazu kommen Änderungen, wenn sich Öffnungszeiten, Preise oder Angebote ändern.",
  },
  {
    q: "Ist ein Baukasten nicht günstiger?",
    a: "Auf dem Papier ja. Rechnen Sie aber Ihre eigene Zeit mit ein: Gestaltung, Texte, Technik, Rechtliches und Pflege übernehmen Sie dann selbst. Unser Rechner zeigt den Vergleich über drei Jahre.",
  },
  {
    q: "Warum unterscheiden sich Angebote so stark?",
    a: "Weil sehr Unterschiedliches enthalten ist. Vergleichen Sie Angebote anhand der Checkliste auf dieser Seite. Am meisten verraten der Festpreis, die enthaltenen Rechtstexte und die Frage, wem die Seite am Ende gehört.",
  },
];

export default function WebsiteKostenPage() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      dateModified: "2026-11-01",
      author: { "@type": "Organization", name: "Sitalo Webdesign", url: SITE_URL },
      publisher: { "@id": `${SITE_URL}/#business` },
      mainEntityOfPage: `${SITE_URL}/website-kosten`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Website-Kosten", item: `${SITE_URL}/website-kosten` },
      ],
    },
  ];
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero crumb="Website-Kosten" eyebrow="Ratgeber · Preise 2026" title="Was kostet eine Website?">
          Zwischen null Euro und mehreren zehntausend, je nachdem, wer sie baut und was sie können muss. Für kleine
          Betriebe liegt eine professionell gebaute Website meist bei einigen hundert bis wenigen tausend Euro, dazu kommen
          laufende Kosten. Hier steht, wovon der Preis abhängt und was Sie im Angebot prüfen sollten.
        </PageHero>

        {/* Drei Wege als Tabelle */}
        <section>
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem] lg:col-span-7">
                Baukasten, Freelancer oder Agentur
              </h2>
              <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
                Grobe Erfahrungswerte für kleine Betriebe in Deutschland, ohne Shop. Einzelne Angebote können deutlich
                abweichen.
              </p>
            </div>

            <table className="mt-10 hidden w-full border-collapse text-left text-[15px] sm:table lg:mt-12">
              <thead>
                <tr className="border-foreground border-t-[3px]">
                  <th scope="col" className="label-mono text-muted-foreground py-3 pr-4 text-[11px] font-medium">Weg</th>
                  <th scope="col" className="label-mono text-muted-foreground py-3 pr-4 text-[11px] font-medium">Einmalig</th>
                  <th scope="col" className="label-mono text-muted-foreground py-3 pr-4 text-[11px] font-medium">Laufend</th>
                  <th scope="col" className="label-mono text-muted-foreground py-3 text-[11px] font-medium">Passt, wenn …</th>
                </tr>
              </thead>
              <tbody>
                {WEGE.map((w) => (
                  <tr key={w.name} className="border-border border-t align-top">
                    <th scope="row" className="py-5 pr-4 text-[16px] font-semibold">{w.name}</th>
                    <td className="py-5 pr-4 whitespace-nowrap">{w.einmalig}</td>
                    <td className="text-muted-foreground py-5 pr-4">{w.laufend}</td>
                    <td className="text-muted-foreground py-5">{w.passt}</td>
                  </tr>
                ))}
                <tr className="border-foreground bg-card border-y-2 align-top">
                  <th scope="row" className="py-5 pr-4 pl-3 text-[16px] font-semibold">
                    Sitalo
                  </th>
                  <td className="py-5 pr-4 font-semibold whitespace-nowrap">{STARTER_SETUP}</td>
                  <td className="py-5 pr-4">{STARTER_MONTHLY} im Monat, mit Hosting und kleinen Änderungen</td>
                  <td className="py-5 pr-3">Sie möchten einen Festpreis vorab und eine Telefonnummer, unter der Sie uns selbst erreichen.</td>
                </tr>
              </tbody>
            </table>

            {/* Mobil: je Weg ein Block */}
            <dl className="border-foreground mt-10 border-t-[3px] sm:hidden">
              {[
                ...WEGE,
                {
                  name: "Sitalo",
                  einmalig: STARTER_SETUP,
                  laufend: `${STARTER_MONTHLY} im Monat, mit Hosting und kleinen Änderungen`,
                  passt: "Sie möchten einen Festpreis vorab und eine Telefonnummer, unter der Sie uns selbst erreichen.",
                },
              ].map((w) => (
                <div key={w.name} className={`border-border border-b py-5 ${w.name === "Sitalo" ? "bg-card -mx-5 px-5" : ""}`}>
                  <dt className="flex items-baseline justify-between gap-4">
                    <span className="text-[17px] font-semibold">{w.name}</span>
                    <span className="text-[15px] font-semibold">{w.einmalig}</span>
                  </dt>
                  <dd className="text-muted-foreground mt-1 text-[14.5px]">Laufend: {w.laufend}</dd>
                  <dd className="mt-2 text-[14.5px] leading-relaxed">{w.passt}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Preisfaktoren als Glossar */}
        <section className="bg-card border-foreground border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">Wovon der Preis abhängt</h2>
              <p className="text-muted-foreground mt-5 text-[15.5px] leading-relaxed">
                Liegen zwei Angebote weit auseinander, steckt der Grund meistens in einem dieser sechs Punkte.
              </p>
            </div>
            <dl className="lg:col-span-8">
              {FAKTOREN.map((f) => (
                <div key={f.title} className="border-border grid gap-1 border-t py-5 first:border-foreground sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-[17px] font-semibold tracking-[-0.01em]">{f.title}</dt>
                  <dd className="text-muted-foreground text-[15.5px] leading-relaxed">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Eigene Preise als Preisliste */}
        <section className="border-border border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <h2 className="max-w-2xl text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Was eine Website bei uns kostet
              </h2>
              <Link href="/pakete" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
                Pakete im Vergleich {ARROW}
              </Link>
            </div>
            <ul className="border-foreground mt-10 border-t lg:mt-12">
              {PAKETE.map((p) => (
                <li key={p.slug} className="border-border border-b">
                  <Link
                    href={`/pakete/${p.slug}`}
                    className="group grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[14rem_minmax(0,1fr)_auto]"
                  >
                    <span className="text-[1.3rem] leading-tight tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4" style={{ fontStretch: "110%", fontWeight: 700 }}>
                      {p.name}
                    </span>
                    <span className="text-muted-foreground max-w-xl text-[15px] leading-relaxed sm:col-start-1 lg:col-start-2 lg:row-start-1">
                      {PAKET_KURZ[p.slug]}
                    </span>
                    <span className="text-left sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:text-right lg:col-start-3 lg:row-span-1">
                      <span className="serif block text-[1.6rem] leading-none whitespace-nowrap">{p.setup}</span>
                      <span className="text-muted-foreground mt-1.5 block text-[13px] whitespace-nowrap">+ {p.monthly}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-6 text-[14.5px] leading-relaxed">
              Alle Preise zzgl. MwSt. Im{" "}
              <Link href="/rechner" className="text-foreground underline underline-offset-4">
                3-Jahres-Rechner
              </Link>{" "}
              sehen Sie die Gesamtkosten neben Wix, Squarespace und Jimdo, Ihre eigene Arbeitszeit eingerechnet.
            </p>
          </div>
        </section>

        {/* Checkliste wie ein Zettel zum Abhaken */}
        <section className="border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Sechs Fragen an jedes Angebot
              </h2>
              <p className="text-muted-foreground mt-5 text-[15.5px] leading-relaxed">
                Legen Sie die Liste neben jedes Angebot, das Sie bekommen. Auch neben unseres.
              </p>
            </div>
            <div className="bg-card border-border border px-5 py-6 shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)] sm:px-9 sm:py-9 lg:col-span-7 lg:col-start-6">
              <p className="label-mono text-muted-foreground flex flex-wrap justify-between gap-x-4 gap-y-1">
                <span>Checkliste</span>
                <span>Angebot von ________</span>
              </p>
              <ul className="mt-5">
                {CHECKLISTE.map((c) => (
                  <li key={c} className="border-border flex gap-4 border-b py-4 text-[16px] leading-snug last:border-b-0">
                    <span aria-hidden="true" className="border-foreground mt-0.5 inline-block h-[18px] w-[18px] shrink-0 rounded-[2px] border-[1.5px]" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fragen: offen gesetzt */}
        <section className="bg-card border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Häufige Fragen zu Website-Kosten
              </h2>
            </div>
            <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
              {FAQ.map((f) => (
                <div key={f.q} className="border-foreground border-t pt-5">
                  <dt className="text-[17.5px] leading-snug font-semibold tracking-[-0.01em]">{f.q}</dt>
                  <dd className="text-muted-foreground mt-3 text-[15.5px] leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Abschluss */}
        <section className="grain bg-foreground text-background">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-balance text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.9rem]">
                Ihren Festpreis bekommen Sie schriftlich, bevor wir anfangen.
              </h2>
              <p className="text-stahl-hell mt-6 max-w-xl text-[16.5px] leading-relaxed">
                Schreiben Sie uns, was die Seite können soll. Wir antworten meist am selben Werktag. Telefon:{" "}
                <a href="tel:+491607621876" className="text-background font-semibold whitespace-nowrap underline-offset-4 hover:underline">
                  0160 7621876
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
              <Link href="/anfrage" className="btn-signal grow sm:grow-0">
                Angebot anfragen {ARROW}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
