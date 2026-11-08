import type { Metadata } from "next";
import Link from "next/link";

import { Abschluss as AppleAbschluss } from "@/components/marketing/apple";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { getPaketBySlug } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Webdesign-Leistungen für lokale Unternehmen",
  description:
    "Was wir für Sie machen: Website bauen, Texte, Anfragen, Google-Basis, Hosting und Pflege. Alles von Sitalo Webdesign aus Hamburg.",
  alternates: { canonical: "/leistungen" },
};

const MONTHLY_FROM = (getPaketBySlug("starter")?.monthly ?? "ab 59\u00A0€ / Monat").replace(/\s*\/\s*Monat$/, "");

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
    // Verweist auf die Firmenangaben im Layout (ein Eintrag für Google).
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Webdesign",
  })),
};

export default function LeistungenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" cta={false} />
      <Produktleiste
        titel="Leistungen"
        links={[
          { href: "#bauplan", label: "Startseite" },
          { href: "#verzeichnis", label: "Verzeichnis" },
          { href: "#kontakt", label: "Kontakt" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Leistungen"
          eyebrow="Leistungen"
          title="Was wir für Ihre Website machen"
          meta={<span>Festpreis vor dem Start · Monatsbeitrag {MONTHLY_FROM}</span>}
        >
          Hier steht, was wir übernehmen und in welchem Paket es steckt. Von der ersten Zeile bis zum Hosting liegt die
          Arbeit bei uns, und Sie sprechen dabei immer mit uns selbst.
        </PageHero>
        <Bauplan />
        <Verzeichnis />
        <Abschluss />
      </main>
      <MarketingFooter crumb="Leistungen" />
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
      className={`bg-gold text-foreground inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold leading-none tabular-nums ${className}`}
    >
      {n}
    </span>
  );
}

function Bauplan() {
  return (
    <section id="bauplan" className="flaeche-hell abschnitt scroll-mt-20">
      <div className="mx-auto w-full max-w-[1068px] px-[max(var(--rinne),env(safe-area-inset-left))]">
        <div className="abschnitt-kopf">
        <h2 data-auftritt="titel" className="t-abschnitt">
          Eine Startseite, beschriftet
        </h2>
        <p className="t-unter">
          Die Skizze zeigt fünf Stellen, an denen Kunden auf der Seite eines Betriebs zuerst suchen. Wir achten bei jeder
          Seite darauf, dass sie da sind und funktionieren.
        </p>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <figure className="min-w-0 lg:col-span-7">
            <div aria-hidden="true" data-auftritt="skala" className="karte karte-regal overflow-hidden select-none">
              {/* Adresszeile mit Seitentitel */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--hell)] px-3 py-2.5 sm:px-4">
                <Marke n={1} />
                <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 text-[12px]">
                  Ihr Betrieb · Ihre Leistung in Ihrem Ort
                </span>
              </div>
              {/* Kopf der Seite */}
              <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
                <span className="bg-foreground block h-3 w-16 rounded-full sm:w-24" />
                <span className="hidden gap-4 sm:flex">
                  <span className="bg-foreground/25 block h-1.5 w-10" />
                  <span className="bg-foreground/25 block h-1.5 w-10" />
                  <span className="bg-foreground/25 block h-1.5 w-10" />
                </span>
                <span className="flex items-center gap-2">
                  <span className="bg-gold text-foreground rounded-full px-3 py-1 text-[12px]">
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
                  <span className="bg-gold mt-4 block h-5 w-24 rounded-full sm:w-28" />
                </div>
                <div className="relative col-span-2 overflow-hidden rounded-xl bg-[var(--hell-2)]">
                  <svg className="text-foreground/25 absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>
              {/* Öffnungszeiten und Formular */}
              <div className="grid grid-cols-2 gap-3 px-4 pb-6 sm:gap-6 sm:px-6 sm:pb-8">
                <div className="rounded-xl bg-[var(--hell)] p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12px] font-semibold">Öffnungszeiten</span>
                    <Marke n={3} />
                  </div>
                  <span className="bg-foreground/20 mt-3 block h-1.5 w-[80%]" />
                  <span className="bg-foreground/20 mt-2 block h-1.5 w-[65%]" />
                  <span className="bg-foreground/20 mt-2 block h-1.5 w-[72%]" />
                </div>
                <div className="rounded-xl bg-[var(--hell)] p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12px] font-semibold">Anfrage</span>
                    <Marke n={4} />
                  </div>
                  <span className="mt-3 block h-4 rounded-md bg-white" />
                  <span className="mt-1.5 block h-4 rounded-md bg-white" />
                  <span className="bg-foreground mt-2 block h-4 w-16 rounded-full" />
                </div>
              </div>
              {/* Fuß */}
              <div className="border-border flex items-center justify-end gap-3 border-t px-4 py-2.5 sm:px-6">
                <span className="text-muted-foreground text-[12px]">Impressum · Datenschutz</span>
                <Marke n={5} />
              </div>
            </div>
            <figcaption className="text-muted-foreground mt-4 text-center text-[12px] leading-[1.33]">
              Skizze einer Startseite. Die Zahlen gehören zur Liste.
            </figcaption>
          </figure>

          <ol className="karte karte-weiss min-w-0 divide-y divide-[var(--border)] self-start px-6 sm:px-8 lg:col-span-5">
            {STELLEN.map((s, i) => (
              <li key={s.titel} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 py-5">
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
      { nr: "4.1", text: "Seitentitel und Beschreibung für Google, mit Leistung und Ort", umfang: "Alle Pakete" },
      { nr: "4.2", text: "Eigener Titel und eigene Beschreibung für jede Unterseite, Sitemap, strukturierte Daten", umfang: "Ab Business" },
      { nr: "4.3", text: "Google-Unternehmensprofil einrichten, lokale Suchbegriffe", umfang: "Ab Business" },
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
    <section id="verzeichnis" className="flaeche-weiss abschnitt scroll-mt-20">
      <div className="mx-auto w-full max-w-[1068px] px-[max(var(--rinne),env(safe-area-inset-left))]">
        <div className="abschnitt-kopf">
          <p className="t-eyebrow">Leistungsverzeichnis</p>
          <h2 data-auftritt="titel" className="t-abschnitt mt-2">
            Was in welchem Paket steckt
          </h2>
          <p className="t-unter">
            Gezählt wird wie im Handwerk: Position für Position. Die Preise der Pakete stehen auf der{" "}
            <Link href="/pakete" className="text-gold-ink underline underline-offset-2 hover:decoration-2">
              Paketseite
            </Link>
            .
          </p>
        </div>

        <div className="karte px-5 pb-4 sm:px-8">
        <table className="w-full border-collapse text-left text-[15px]">
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
                  <span className="flex items-center gap-3">
                    <span className="bg-gold text-foreground inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold tabular-nums">{gruppe.nr}</span>
                    <span className="text-[19px] font-semibold tracking-[-0.015em]">
                      {gruppe.titel}
                    </span>
                  </span>
                </th>
              </tr>
              {gruppe.posten.map((p) => (
                <tr key={p.nr} className="border-border border-t align-baseline">
                  <td className="text-muted-foreground py-3 pr-3 text-[13px] tabular-nums">{p.nr}</td>
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
        </div>

        <div className="mx-auto mt-12 max-w-[40em] text-center">
          <h3 className="t-karte">Nicht im Verzeichnis</h3>
          <p className="text-muted-foreground mt-3 text-[17px] leading-[1.47] tracking-[-0.022em]">
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
 * Abschluss: schwarz, Telefonnummer groß, Pille und Mail.
 * ---------------------------------------------------------------- */
function Abschluss() {
  return (
    <AppleAbschluss
      id="kontakt"
      titel="Welche Positionen Sie brauchen, klären wir am Telefon."
      zwischen={
        <a href="tel:+491607621876" className="abschluss-nummer">
          0160&nbsp;7621876
        </a>
      }
      unter="Wer lieber schreibt, schickt uns die Anfrage über das Formular. Wir antworten meist am selben Werktag."
      pille={{ href: "/anfrage", label: "Anfrage schreiben" }}
      link={{ href: "/pakete", label: "Preise ansehen" }}
    />
  );
}
