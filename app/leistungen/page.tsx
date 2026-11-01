import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { getPaketBySlug } from "@/lib/pakete-data";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Webdesign-Leistungen für lokale Unternehmen",
  description:
    "Was wir für Sie machen: Website bauen, Texte, Anfragen, Google-Basis, Hosting und Pflege. Alles von Sitalo Webdesign aus Hamburg.",
  alternates: { canonical: "/leistungen" },
};

const MONTHLY_FROM = (getPaketBySlug("starter")?.monthly ?? "ab 49 € / Monat").replace(/\s*\/\s*Monat$/, "");

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** Strukturierte Daten: die Leistungsbereiche als einzelne Services. */
const SERVICES = [
  {
    name: "Website gestalten und bauen",
    description: "Eine Seite oder mehrere, eigens für Ihren Betrieb gestaltet und ohne Baukasten gebaut.",
  },
  {
    name: "Texte aus Ihren Stichpunkten",
    description: "Sie schicken Stichpunkte, wir formulieren daraus die Texte. Sie lesen gegen und geben frei.",
  },
  {
    name: "Anfragen per Formular und Telefon",
    description:
      "Was jemand ins Formular tippt, kommt direkt in Ihrem Postfach an. Auf dem Handy reicht ein Tipp auf die Telefonnummer.",
  },
  {
    name: "Bei Google auffindbar",
    description: "Titel, Beschreibungen, strukturierte Daten und lokale Suchbegriffe, damit man Sie in Ihrer Region findet.",
  },
  {
    name: "Hosting und Pflege",
    description: "Server in der EU, Updates, Backups und kleine Änderungen im Monatsbeitrag.",
  },
  {
    name: "Inhalte selbst pflegen",
    description: "Speisekarte, Öffnungszeiten oder Angebote ändern Sie auf Wunsch selbst. Ab dem Premium-Paket enthalten.",
  },
];

const SERVICES_LD = {
  "@context": "https://schema.org",
  "@graph": SERVICES.map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Sitalo Webdesign",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Webdesign",
  })),
};

export default function LeistungenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Leistungen"
          eyebrow="Leistungen"
          title="Was wir für Ihre Website machen"
          meta={
            <span className="text-stahl-hell font-mono text-[12px]">
              Festpreis vor dem Start · Monatsbeitrag {MONTHLY_FROM}
            </span>
          }
        >
          Hier steht, was wir übernehmen und in welchem Paket es steckt. Von der ersten Zeile bis zum Hosting liegt die
          Arbeit bei uns, und Sie sprechen dabei immer mit uns selbst.
        </PageHero>
        <Bauplan />
        <Verzeichnis />
        <Abschluss />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_LD) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Bauplan: eine Startseite als Skizze, die fünf wichtigsten Stellen
 * markiert. Die Zahlen sind Legende, keine Rangfolge.
 * ---------------------------------------------------------------- */
const STELLEN = [
  {
    titel: "Seitentitel und Beschreibung",
    text: "Das steht bei Google über und unter dem Link. Wir schreiben beides mit Ihrer Leistung und Ihrem Ort.",
  },
  {
    titel: "Anruf-Knopf",
    text: "Auf dem Handy wählt ein Tipp auf die Nummer direkt. Am Rechner steht sie gut lesbar oben rechts.",
  },
  {
    titel: "Öffnungszeiten und Adresse",
    text: "Als Text auf der Seite, nicht als PDF oder Bild. So kann Google sie lesen, und ändern lassen Sie sie per Mail.",
  },
  {
    titel: "Kontaktformular",
    text: "Was jemand hier eintippt, kommt direkt in Ihrem Postfach an. Gegen Spam schützen wir das Formular, ohne dass Besucher Bilderrätsel lösen müssen.",
  },
  {
    titel: "Impressum und Datenschutz",
    text: "Beide Pflichtseiten binden wir ein und verlinken sie am Fuß jeder Seite.",
  },
];

function Marke({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      className={`bg-gold text-foreground inline-flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[12px] font-semibold leading-none ${className}`}
    >
      {n}
    </span>
  );
}

function Bauplan() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="max-w-3xl text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.75rem] lg:text-[3.1rem]">
          Eine Startseite, beschriftet
        </h2>
        <p className="text-muted-foreground mt-5 max-w-xl text-[16.5px] leading-relaxed">
          Die Skizze zeigt fünf Stellen, an denen Kunden auf der Seite eines Betriebs zuerst suchen. Wir achten bei jeder
          Seite darauf, dass sie da sind und funktionieren.
        </p>

        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <figure className="min-w-0 lg:col-span-7">
            <div aria-hidden="true" className="border-foreground bg-card border-[1.5px] select-none">
              {/* Adresszeile mit Seitentitel */}
              <div className="border-foreground bg-background flex items-center gap-3 border-b-[1.5px] px-3 py-2.5 sm:px-4">
                <Marke n={1} />
                <span className="border-border bg-card min-w-0 flex-1 truncate border px-2.5 py-1 font-mono text-[11px] sm:text-[12px]">
                  Ihr Betrieb · Ihre Leistung in Ihrem Ort
                </span>
              </div>
              {/* Kopf der Seite */}
              <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
                <span className="bg-foreground block h-3 w-16 sm:w-24" />
                <span className="hidden gap-4 sm:flex">
                  <span className="bg-foreground/25 block h-1.5 w-10" />
                  <span className="bg-foreground/25 block h-1.5 w-10" />
                  <span className="bg-foreground/25 block h-1.5 w-10" />
                </span>
                <span className="flex items-center gap-2">
                  <span className="bg-foreground text-background px-2.5 py-1 font-mono text-[10.5px] sm:text-[11px]">
                    Anrufen
                  </span>
                  <Marke n={2} />
                </span>
              </div>
              {/* Bühne: Überschrift, Text, Bild */}
              <div className="grid grid-cols-5 gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8">
                <div className="col-span-3 space-y-2.5">
                  <span className="bg-foreground block h-3 w-[85%] sm:h-4" />
                  <span className="bg-foreground block h-3 w-[60%] sm:h-4" />
                  <span className="bg-foreground/20 mt-4 block h-1.5 w-full" />
                  <span className="bg-foreground/20 block h-1.5 w-[92%]" />
                  <span className="bg-foreground/20 block h-1.5 w-[70%]" />
                  <span className="bg-gold mt-4 block h-5 w-24 sm:w-28" />
                </div>
                <div className="bg-zink/45 border-border relative col-span-2 border">
                  <svg className="text-foreground/25 absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>
              {/* Öffnungszeiten und Formular */}
              <div className="grid grid-cols-2 gap-3 px-4 pb-6 sm:gap-6 sm:px-6 sm:pb-8">
                <div className="border-border border p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10.5px] sm:text-[11px]">Öffnungszeiten</span>
                    <Marke n={3} />
                  </div>
                  <span className="bg-foreground/20 mt-3 block h-1.5 w-[80%]" />
                  <span className="bg-foreground/20 mt-2 block h-1.5 w-[65%]" />
                  <span className="bg-foreground/20 mt-2 block h-1.5 w-[72%]" />
                </div>
                <div className="border-border border p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10.5px] sm:text-[11px]">Anfrage</span>
                    <Marke n={4} />
                  </div>
                  <span className="border-border bg-background mt-3 block h-4 border" />
                  <span className="border-border bg-background mt-1.5 block h-4 border" />
                  <span className="bg-foreground mt-2 block h-4 w-16" />
                </div>
              </div>
              {/* Fuß */}
              <div className="border-border flex items-center justify-end gap-3 border-t px-4 py-2.5 sm:px-6">
                <span className="text-muted-foreground font-mono text-[10.5px] sm:text-[11px]">Impressum · Datenschutz</span>
                <Marke n={5} />
              </div>
            </div>
            <figcaption className="text-muted-foreground mt-3 font-mono text-[12px] leading-relaxed">
              Skizze einer Startseite. Die Zahlen gehören zur Liste.
            </figcaption>
          </figure>

          <ol className="min-w-0 lg:col-span-5">
            {STELLEN.map((s, i) => (
              <li key={s.titel} className="border-border grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 border-t py-5 first:border-foreground first:pt-5 last:border-b">
                <Marke n={i + 1} className="mt-0.5" />
                <div>
                  <h3 className="text-[17px] leading-snug tracking-[-0.01em]">{s.titel}</h3>
                  <p className="text-muted-foreground mt-1.5 text-[15px] leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Leistungsverzeichnis wie im Handwerk: Positionen mit Angabe, in
 * welchem Paket sie stecken. Quelle der Paketzuordnung:
 * lib/pakete-data.ts und die Vergleichstabelle auf /pakete.
 * ---------------------------------------------------------------- */
type Posten = { nr: string; text: string; umfang: string };

const VERZEICHNIS: { nr: string; titel: string; posten: Posten[] }[] = [
  {
    nr: "1",
    titel: "Die Website",
    posten: [
      { nr: "1.1", text: "Gestaltung für Ihren Betrieb, direkt im Code gebaut, ohne Baukasten", umfang: "Alle Pakete" },
      { nr: "1.2", text: "Ansicht für Handy, Tablet und Rechner, vor dem Start auf echten Geräten geprüft", umfang: "Alle Pakete" },
      { nr: "1.3", text: "Test-Link, auf dem Sie die fertige Seite vor dem Start ansehen", umfang: "Alle Pakete" },
      { nr: "1.4", text: "Eine Seite mit allem Wichtigen", umfang: "Starter" },
      { nr: "1.5", text: "Bis zu fünf Unterseiten, etwa für Leistungen, Team und Galerie", umfang: "Business" },
      { nr: "1.6", text: "Eigene Struktur nach Ihrem Bedarf", umfang: "Premium" },
      { nr: "1.7", text: "Neues Erscheinungsbild: Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden", umfang: "Studio" },
    ],
  },
  {
    nr: "2",
    titel: "Texte und Bilder",
    posten: [
      { nr: "2.1", text: "Texte aus Ihren Stichpunkten. Sie lesen gegen und geben frei.", umfang: "Alle Pakete" },
      { nr: "2.2", text: "Team-Bereich mit Fotos und eine Galerie", umfang: "Ab Business" },
      { nr: "2.3", text: "Aufbereitung Ihrer Fotos für die Seite", umfang: "Ab Business" },
    ],
  },
  {
    nr: "3",
    titel: "Anfragen",
    posten: [
      { nr: "3.1", text: "Kontaktformular mit Spam-Schutz ohne Bilderrätsel, Anfragen kommen per Mail bei Ihnen an", umfang: "Alle Pakete" },
      { nr: "3.2", text: "Anruf-Knopf, Karte und Öffnungszeiten", umfang: "Alle Pakete" },
      { nr: "3.3", text: "Formular für Bewerbung oder Terminanfrage, kommt per Mail bei Ihnen an", umfang: "Ab Business" },
      { nr: "3.4", text: "Online-Buchung mit festen Terminen", umfang: "Ab Premium" },
    ],
  },
  {
    nr: "4",
    titel: "Google",
    posten: [
      { nr: "4.1", text: "Titel und Beschreibung für jede Seite, Sitemap, strukturierte Daten", umfang: "Ab Business" },
      { nr: "4.2", text: "Google-Unternehmensprofil einrichten, lokale Suchbegriffe", umfang: "Ab Business" },
    ],
  },
  {
    nr: "5",
    titel: `Nach dem Start, im Monatsbeitrag ${MONTHLY_FROM}`,
    posten: [
      { nr: "5.1", text: "Hosting auf einem Server in der EU, SSL-Zertifikat", umfang: "Alle Pakete" },
      { nr: "5.2", text: "Sicherheits-Updates und tägliche Backups, die 30 Tage zurückreichen", umfang: "Alle Pakete" },
      { nr: "5.3", text: "Kleine Änderungen im Monat: Starter 1, Business 3, Premium 6, Studio 10", umfang: "Je nach Paket" },
      { nr: "5.4", text: "Bereiche, die Sie selbst pflegen, etwa Speisekarte, Angebote oder Termine", umfang: "Ab Premium, auf Wunsch" },
      { nr: "5.5", text: "Domain und E-Mail-Adressen einrichten", umfang: "Auf Wunsch" },
    ],
  },
];

function Verzeichnis() {
  return (
    <section className="bg-card border-foreground border-b">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="label-mono text-muted-foreground">Leistungsverzeichnis</p>
            <h2 className="mt-4 text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
              Was in welchem Paket steckt
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
            Gezählt wird wie im Handwerk: Position für Position. Die Preise der Pakete stehen auf der{" "}
            <Link href="/pakete" className="text-foreground underline decoration-[var(--gold)] decoration-2 underline-offset-4">
              Paketseite
            </Link>
            .
          </p>
        </div>

        <table className="mt-10 w-full border-collapse text-left text-[15px] lg:mt-12">
          <caption className="sr-only">Leistungsverzeichnis mit Paketzuordnung</caption>
          <thead>
            <tr className="border-foreground border-b-[1.5px]">
              <th scope="col" className="label-mono text-muted-foreground w-[3.25rem] py-3 pr-3 text-[11px] font-medium sm:w-20">
                Pos.
              </th>
              <th scope="col" className="label-mono text-muted-foreground py-3 pr-4 text-[11px] font-medium">
                Leistung
              </th>
              <th scope="col" className="label-mono text-muted-foreground hidden w-44 py-3 text-right text-[11px] font-medium sm:table-cell">
                Enthalten in
              </th>
            </tr>
          </thead>
          {VERZEICHNIS.map((gruppe) => (
            <tbody key={gruppe.nr}>
              <tr>
                <th scope="colgroup" colSpan={3} className="pt-8 pb-2 text-left">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px] tabular-nums">{gruppe.nr}</span>
                    <span className="text-[17px] tracking-[-0.01em]" style={{ fontStretch: "106%", fontWeight: 680 }}>
                      {gruppe.titel}
                    </span>
                  </span>
                </th>
              </tr>
              {gruppe.posten.map((p) => (
                <tr key={p.nr} className="border-border border-t align-baseline">
                  <td className="text-muted-foreground py-3 pr-3 font-mono text-[13px] tabular-nums">{p.nr}</td>
                  <td className="py-3 pr-4 leading-snug">
                    {p.text}
                    <span className="label-mono text-muted-foreground mt-1 block text-[10.5px] sm:hidden">{p.umfang}</span>
                  </td>
                  <td
                    className={`hidden py-3 text-right text-[14px] sm:table-cell ${
                      p.umfang === "Alle Pakete" ? "text-foreground font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {p.umfang}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>

        <div className="border-foreground mt-10 grid gap-6 border-t-[1.5px] pt-6 lg:grid-cols-12 lg:gap-8">
          <p className="label-mono text-muted-foreground lg:col-span-3">Nicht im Verzeichnis</p>
          <p className="text-foreground/85 max-w-2xl text-[15.5px] leading-relaxed lg:col-span-9">
            Werbekampagnen und Newsletter machen wir nicht. Logo-Entwicklung und Fotoshootings bieten wir ebenfalls nicht
            an: Fotos liefern Sie, Handyfotos reichen oft, und für einen Fotografen bekommen Sie von uns eine kurze
            Motivliste. Online-Shops und Apps besprechen wir im Einzelfall.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: Telefonnummer groß, daneben Mail und Anfrage.
 * ---------------------------------------------------------------- */
function Abschluss() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-stahl-hell text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
            Welche Positionen Sie brauchen, klären wir am Telefon.
          </h2>
          <a
            href="tel:+491607621876"
            className="hover:text-gold mt-5 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[4rem] lg:text-[4.4rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160 7621876
          </a>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-stahl-hell text-[16px] leading-relaxed">
            Wer lieber schreibt, schickt eine Mail oder die Anfrage. Wir antworten meist am selben Werktag.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold">
            {CONTACT_EMAIL}
          </a>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href="/pakete" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
              Preise ansehen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
