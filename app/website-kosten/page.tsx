import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { BODY_OFFSET, SectionHead } from "@/components/marketing/home-sections";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PAKETE } from "@/lib/pakete-data";
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
  { title: "Gestaltung", text: "Eine angepasste Vorlage ist günstiger als ein eigenes Design, das sich klar von der Konkurrenz abhebt." },
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
    a: `Eine professionelle Onepage-Website kostet je nach Anbieter meist zwischen einigen hundert und wenigen tausend Euro. Bei uns beginnt sie bei ${PAKETE[0].setup}, dazu kommt ein Monatsbeitrag ab 49 € für Hosting und Pflege.`,
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
    a: "Weil sehr Unterschiedliches enthalten ist. Vergleichen Sie Angebote anhand der Checkliste oben: Festpreis, Inhalte, Rechtstexte, Betreuung und wem die Seite am Ende gehört.",
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
  const SECTION = "border-border/50 border-t";
  const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Website-Kosten" />
      <main id="main" tabIndex={-1} className="flex-1">
        <section>
          <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20">
            <p className="text-muted-foreground flex items-center gap-2.5 text-[13px] font-medium">
              <span aria-hidden="true" className="bg-gold inline-block h-px w-8" />
              Ratgeber · Stand November 2026
            </p>
            <h1 className="mt-5 max-w-4xl text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Was kostet eine Website?
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg">
              Die ehrliche Antwort: zwischen null Euro und mehreren zehntausend. Für kleine Unternehmen liegt eine
              professionelle Website meist im Bereich von einigen hundert bis wenigen tausend Euro, dazu kommen
              laufende Kosten. Hier sehen Sie, wovon der Preis abhängt und worauf Sie beim Angebot achten sollten.
            </p>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead label="Überblick" title="Drei Wege zur Website im Vergleich." />
            <p className={`text-muted-foreground mt-6 max-w-2xl text-[15px] leading-relaxed ${BODY_OFFSET}`}>
              Grobe Erfahrungswerte für kleine Betriebe in Deutschland, ohne Shop. Einzelne Angebote können deutlich
              abweichen.
            </p>
            <div className={`mt-10 overflow-x-auto lg:mt-12 ${BODY_OFFSET}`}>
              <table className="w-full min-w-[36rem] border-collapse text-left text-[14.5px]">
                <thead>
                  <tr className="border-border border-b">
                    <th scope="col" className="py-3 pr-4 font-semibold">Weg</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Einmalig</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Laufend</th>
                    <th scope="col" className="py-3 font-semibold">Passt, wenn …</th>
                  </tr>
                </thead>
                <tbody>
                  {WEGE.map((w) => (
                    <tr key={w.name} className="border-border border-b align-top">
                      <th scope="row" className="py-4 pr-4 font-medium">{w.name}</th>
                      <td className="py-4 pr-4 whitespace-nowrap">{w.einmalig}</td>
                      <td className="text-muted-foreground py-4 pr-4">{w.laufend}</td>
                      <td className="text-muted-foreground py-4">{w.passt}</td>
                    </tr>
                  ))}
                  <tr className="border-border bg-secondary/40 border-b align-top">
                    <th scope="row" className="py-4 pr-4 pl-2 font-semibold">Sitalo</th>
                    <td className="py-4 pr-4 font-medium whitespace-nowrap">ab {PAKETE[0].setup.replace("ab ", "")}</td>
                    <td className="py-4 pr-4">ab 49 € / Monat, inkl. Hosting und Änderungen</td>
                    <td className="py-4 pr-2">Sie möchten Festpreis, eigenes Design und einen festen Ansprechpartner.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`${SECTION} bg-secondary/30`}>
          <div className={INNER}>
            <SectionHead label="Preisfaktoren" title="Wovon der Preis abhängt." />
            <ol className={`mt-10 grid gap-x-8 sm:grid-cols-2 lg:mt-14 ${BODY_OFFSET}`}>
              {FAKTOREN.map((f, i) => (
                <li key={f.title} className="border-border border-t py-5">
                  <p className="text-gold text-[13px] font-semibold tabular-nums">0{i + 1}</p>
                  <h3 className="mt-1 text-[17px] font-semibold tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground mt-1 text-[14.5px] leading-relaxed">{f.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead label="Unsere Preise" title="Was eine Website bei uns kostet." link={{ href: "/pakete", text: "Alle Pakete" }} />
            <div className={`mt-10 lg:mt-12 ${BODY_OFFSET}`}>
              <ul className="border-border border-t">
                {PAKETE.map((p) => (
                  <li key={p.slug} className="border-border border-b">
                    <Link href={`/pakete/${p.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                      <span>
                        <span className="block text-[17px] font-semibold tracking-tight group-hover:underline">{p.name}</span>
                        <span className="text-muted-foreground mt-1 block text-[14.5px]">{p.description}</span>
                      </span>
                      <span className="serif shrink-0 text-right text-2xl lining-nums">
                        {p.setup}
                        <span className="text-muted-foreground block font-sans text-[12.5px]">+ {p.monthly}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 text-[14px]">
                Festpreis vor Auftrag, Preise zzgl. MwSt.{" "}
                <Link href="/rechner" className="text-foreground underline underline-offset-4">
                  Im 3-Jahres-Rechner
                </Link>{" "}
                vergleichen Sie die Gesamtkosten mit Baukasten und Agentur.
              </p>
            </div>
          </div>
        </section>

        <section className={`${SECTION} bg-secondary/30`}>
          <div className={INNER}>
            <SectionHead label="Checkliste" title="Sechs Fragen an jedes Angebot." />
            <ul className={`mt-10 grid gap-x-8 sm:grid-cols-2 lg:mt-14 ${BODY_OFFSET}`}>
              {CHECKLISTE.map((c) => (
                <li key={c} className="border-border flex gap-3 border-t py-4 text-[15.5px]">
                  <span aria-hidden="true" className="text-gold">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead label="Fragen" title="Häufige Fragen zu Website-Kosten." />
            <div className={`divide-border/60 border-border/60 mt-10 divide-y border-y lg:mt-14 ${BODY_OFFSET}`}>
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <h3 className="text-[16px] font-medium leading-snug sm:text-[17px]">{f.q}</h3>
                    <span aria-hidden="true" className="text-muted-foreground text-xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
              Ihr Festpreis, schriftlich. <span className="text-background/65">Kostenlos anfragen.</span>
            </h2>
            <Link
              href="/anfrage"
              className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              Angebot anfragen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
