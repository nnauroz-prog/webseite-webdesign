import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus, X } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { formatDate } from "@/lib/journal-data";
import { baukastenKosten } from "@/lib/fremdpreise";
import { getPaketBySlug } from "@/lib/pakete-data";
import { SEITEN_STAND } from "@/lib/seiten-stand";
import { SITE_URL } from "@/lib/site";

const TITLE = "Wix, Jimdo, Squarespace oder Webdesigner?";
const DESCRIPTION =
  "Wix, Squarespace, Jimdo, Selbstbau mit ChatGPT oder Webdesign-Büro: wann welcher Weg für lokale Betriebe passt, was er kostet und worauf Sie achten sollten.";
/** Erstveröffentlichung und letzte inhaltliche Überarbeitung (ISO), lib/seiten-stand.ts. */
const { veroeffentlicht: VEROEFFENTLICHT, stand: STAND } = SEITEN_STAND["/vergleich"];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/vergleich" },
  // Ein eigenes openGraph ersetzt das aus dem Layout, deshalb siteName und locale hier mit.
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/vergleich`,
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    publishedTime: VEROEFFENTLICHT,
    modifiedTime: STAND,
  },
};

/**
 * `/vergleich` — Sitalo neben Wix, Squarespace, Jimdo und dem
 * Selbstbau mit Chat-Programmen wie ChatGPT. Jede Option bekommt die Fälle,
 * in denen sie passt, auch wenn das gegen uns spricht.
 *
 * Abgrenzung: Diese Seite vergleicht Anbieter mit Namen. Die Wege
 * allgemein und die Schritte zum Selbstbau stehen im Ratgeber
 * /webseite-erstellen, das Erstellenlassen auf /website-erstellen-lassen.
 *
 * Fremdpreise nur mit Tarif, Beleg und Prüfdatum aus lib/fremdpreise.ts,
 * gleichlautend mit dem Ratgeber. Derzeit ohne Beträge, weil die
 * Preisseiten der Anbieter nicht geprüft werden konnten (UWG §§ 5, 6).
 */
export default function VergleichPage() {
  // Article-Schema für die Vergleichs-Page + Breadcrumb. Article
  // statt ComparisonTable, weil das die Editorial-Substanz besser
  // abbildet — Tabelle ist nur ein Element davon, der größere Teil
  // ist Pro/Contra-Prosa pro Anbieter.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    inLanguage: "de-DE",
    datePublished: VEROEFFENTLICHT,
    dateModified: STAND,
    image: `${SITE_URL}/vergleich/opengraph-image`,
    author: { "@id": `${SITE_URL}/#business` },
    publisher: { "@id": `${SITE_URL}/#business` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/vergleich`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vergleich",
        item: `${SITE_URL}/vergleich`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero crumb="Vergleich" eyebrow="Baukasten · Selbstbau · Webdesign" title="Wix, Squarespace, Jimdo und Selbstbau im Vergleich">
          Für manche Betriebe reicht ein Baukasten, und wer gern tüftelt, kommt mit ChatGPT inzwischen weit. Hier steht,
          wann welcher Weg passt und wann es sich lohnt, uns zu beauftragen.
        </PageHero>
        <Faustregel />
        <DeepDives />
        <TableSummary />
        <FinalCta />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;
const STARTER_MONTHLY = (getPaketBySlug("starter")?.monthly ?? "ab 49\u00A0€ / Monat").replace(/\s*\/\s*Monat$/, "");

/* ------------------------------------------------------------------
 * Faustregel: drei Zeilen, wer womit am besten fährt.
 * ---------------------------------------------------------------- */
const FAUSTREGEL: {
  weg: string;
  wann: string;
  detail: string;
  link?: { href: string; label: string };
  sitalo?: boolean;
}[] = [
  {
    weg: "Wix oder Squarespace",
    wann: "Sie haben Zeit und Freude am Selbstbauen.",
    detail:
      "Günstig, solange Sie die Stunden für Texte, Bilder, die Ansicht am Handy und Google selbst aufbringen.",
    link: { href: "/webseite-erstellen#schritte", label: "Webseite mit Baukasten selbst erstellen: die Schritte" },
  },
  {
    weg: "Selbst programmieren mit ChatGPT",
    wann: "Sie sind technisch interessiert und basteln gern.",
    detail:
      "Damit kommen Sie heute weiter als vor zwei Jahren. Domain, Hosting, Datenschutz, Tests am Handy und Updates bleiben trotzdem bei Ihnen.",
  },
  {
    weg: "Sitalo",
    wann: "Sie haben für die eigene Website keine freien Abende.",
    detail:
      "Sie schicken Stichpunkte und Fotos, wir schreiben die Texte und bauen die Seite. Hosting, Updates und kleine Änderungen laufen danach über den Monatsbeitrag.",
    link: { href: "/website-erstellen-lassen", label: "Website erstellen lassen: Festpreis und Ablauf" },
    sitalo: true,
  },
];

function Faustregel() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">Die Faustregel</h2>
        <ul className="border-foreground mt-10 border-t-[3px] lg:mt-12">
          {FAUSTREGEL.map((f) => (
            <li
              key={f.weg}
              className={`border-border grid gap-2 border-b py-6 sm:py-7 lg:grid-cols-12 lg:gap-8 ${f.sitalo ? "bg-card -mx-5 px-5 sm:-mx-6 sm:px-6" : ""}`}
            >
              <p className={`label-mono lg:col-span-3 lg:pt-2 ${f.sitalo ? "text-foreground" : "text-muted-foreground"}`}>
                {f.weg}
              </p>
              <p className="text-[1.3rem] leading-snug tracking-[-0.015em] sm:text-[1.5rem] lg:col-span-4" style={{ fontStretch: "106%", fontWeight: 650 }}>
                {f.wann}
              </p>
              <div className="lg:col-span-5">
                <p className="text-foreground/80 text-[15.5px] leading-relaxed">{f.detail}</p>
                {f.link ? (
                  <Link
                    href={f.link.href}
                    className="text-foreground mt-2.5 inline-flex items-center gap-1 text-[14.5px] font-semibold underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
                  >
                    {f.link.label}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type DeepDive = {
  id: string;
  kategorie: string;
  label: string;
  tagline: string;
  goodFor: string[];
  watchOut: string[];
  realCost: string;
};

const DEEP_DIVES: DeepDive[] = [
  {
    id: "wix",
    kategorie: "Baukasten",
    label: "Wix",
    tagline: "Baukasten mit großer Auswahl an Vorlagen.",
    goodFor: [
      "Sehr einfache Visitenkarten-Seiten, die Sie selbst bauen wollen",
      "Wenn Sie lernen möchten, wie Handy-Ansicht und Suchmaschinen funktionieren",
    ],
    watchOut: [
      "Die Gestaltung einer Wix-Seite lässt sich nicht zu einem anderen Anbieter mitnehmen. Texte und Bilder nehmen Sie mit, die Seite wird neu gebaut",
      "Die Ladezeit am Handy hängt stark von Vorlage, Bildern und Zusatz-Apps ab",
    ],
    realCost: `${baukastenKosten("Wix")} Dazu nach unserer Einschätzung 10 bis 40 Stunden für den Aufbau und 1 bis 3 Stunden Pflege im Monat, je nachdem, wie oft sich etwas ändert.`,
  },
  {
    id: "squarespace",
    kategorie: "Baukasten",
    label: "Squarespace",
    tagline: "Baukasten mit Schwerpunkt auf Bildern und Gestaltung.",
    goodFor: [
      "Portfolios von Fotografen, Designern und Architekten",
      "Wenn Ihnen die Optik wichtiger ist als viele Einstellungen",
    ],
    watchOut: [
      "Impressum und Datenschutzerklärung nach deutschem Recht müssen Sie selbst erstellen und einbinden",
      "Telefon-Knopf, Anfahrt oder Speisekarte am Handy richten Sie selbst ein",
    ],
    realCost: `${baukastenKosten("Squarespace")} Nach unserer Einschätzung etwas weniger Pflege als bei Wix, dafür mehr Aufwand am Anfang, bis die Rechtstexte für Deutschland stimmen.`,
  },
  {
    id: "jimdo",
    kategorie: "Baukasten",
    label: "Jimdo",
    tagline: "Baukasten aus Hamburg, bewusst einfach gehalten.",
    goodFor: [
      "Sehr kleine Betriebe wie Friseur oder Bäckerei mit einfachem Bedarf",
      "Wenn Sie Datenschutz-Standardtexte direkt aus dem System brauchen",
      "Wenn Sie sich beim ersten Aufbau von einem Assistenten durch Fragen führen lassen möchten",
    ],
    watchOut: [
      "Wenig Spielraum für eine eigene Gestaltung, viele Jimdo-Seiten sehen sich ähnlich",
      "Der Export ist begrenzt. Bei einem Wechsel wird die Seite meist neu gebaut",
    ],
    realCost: `${baukastenKosten("Jimdo")} Für eine einfache Seite ein günstiger Einstieg, für größere Seiten schnell begrenzt.`,
  },
  {
    id: "ki-eigenbau",
    kategorie: "Selbstbau",
    label: "Selbstbau mit ChatGPT",
    tagline: "Sie beschreiben einem Chat-Programm wie ChatGPT, was Sie wollen, und es schreibt den Code.",
    goodFor: [
      "Inhaber mit Technik-Interesse, die gern basteln",
      "Schnelle Entwürfe, um eine Idee auszuprobieren",
      "Wenn Sie Code lesen können oder es lernen wollen",
    ],
    watchOut: [
      "Domain, Hosting, SSL, Datenschutz und E-Mail richten Sie weiterhin selbst ein",
      "Updates und Sicherheitslücken sind Ihre Sache",
      "Der erzeugte Code ist selten auf Handy und Suchmaschinen geprüft, Tests fehlen meist",
      "Wenn nach dem Start etwas kaputtgeht, gibt es niemanden, den Sie anrufen können",
    ],
    realCost:
      "Werkzeuge ca. 0 bis 30\u00A0€ im Monat. Dazu nach unserer Einschätzung 30 bis 80 Stunden mit Einarbeitung, danach laufende Pflege. Riskant, wenn der Betrieb auf die Seite angewiesen ist.",
  },
];

function DeepDives() {
  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem] lg:col-span-7">
            Die vier Alternativen im Einzelnen
          </h2>
          <nav aria-label="Alternativen auf dieser Seite" className="lg:col-span-5">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12.5px] lg:justify-end">
              {DEEP_DIVES.map((d) => (
                <li key={d.id}>
                  <a href={`#${d.id}`} className="text-muted-foreground hover:text-foreground underline decoration-[var(--border)] underline-offset-4 hover:decoration-current">
                    {d.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 lg:mt-14">
          {DEEP_DIVES.map((d) => (
            <DeepDiveBlock key={d.id} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeepDiveBlock({ d }: { d: DeepDive }) {
  return (
    <article id={d.id} className="border-foreground grid scroll-mt-24 gap-8 border-t-2 py-10 first:pt-8 lg:grid-cols-12 lg:gap-8 lg:py-12">
      <div className="lg:col-span-4">
        <p className="label-mono text-muted-foreground">{d.kategorie}</p>
        <h3 className="mt-3 text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.3rem]">{d.label}</h3>
        <p className="text-foreground/75 mt-3 max-w-sm text-[15.5px] leading-relaxed text-pretty">{d.tagline}</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
        <div>
          <h4 className="label-mono text-muted-foreground border-border border-b pb-2">Passt für</h4>
          <ul className="mt-3 space-y-2.5">
            {d.goodFor.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] leading-snug">
                <Check className="text-ink-petrol mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="label-mono text-muted-foreground border-border border-b pb-2">Darauf achten</h4>
          <ul className="mt-3 space-y-2.5">
            {d.watchOut.map((p) => (
              <li key={p} className="text-foreground/85 flex items-start gap-3 text-[15px] leading-snug">
                <Minus className="text-ink-olive mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-foreground grid gap-1.5 border-t pt-4 sm:col-span-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
          <p className="label-mono text-muted-foreground text-[11px] sm:pt-[3px]">Kosten</p>
          <p className="text-[15px] leading-relaxed">{d.realCost}</p>
        </div>
      </div>
    </article>
  );
}

type Wert = "yes" | "partial" | "no";

type TableRow = {
  feature: string;
  /** Kurze Einschränkung direkt unter dem Kriterium. */
  hinweis?: string;
  wix: Wert;
  squarespace: Wert;
  jimdo: Wert;
  ki: Wert;
  sitalo: Wert;
};

const TABLE: TableRow[] = [
  { feature: "Fester Ansprechpartner, der Ihre Seite kennt", wix: "no", squarespace: "no", jimdo: "no", ki: "no", sitalo: "yes" },
  { feature: "Handy-Ansicht ohne Nacharbeit", wix: "partial", squarespace: "partial", jimdo: "partial", ki: "no", sitalo: "yes" },
  {
    feature: "Grundlagen für die lokale Suche",
    hinweis: "Bei Sitalo ab dem Paket Business",
    wix: "partial",
    squarespace: "partial",
    jimdo: "partial",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Rechtstexte im Preis",
    hinweis: "Bei Jimdo gibt es Rechtstexte im System, je nach Tarif",
    wix: "no",
    squarespace: "no",
    jimdo: "partial",
    ki: "no",
    sitalo: "no",
  },
  { feature: "Texte werden für Sie geschrieben", wix: "no", squarespace: "no", jimdo: "no", ki: "no", sitalo: "yes" },
  { feature: "Updates laufen ohne Ihr Zutun", wix: "yes", squarespace: "yes", jimdo: "yes", ki: "no", sitalo: "yes" },
  {
    feature: "Gestaltung lässt sich als Ganzes mitnehmen",
    hinweis: "Bei Sitalo und im Selbstbau über den Quellcode",
    wix: "no",
    squarespace: "partial",
    jimdo: "no",
    ki: "yes",
    sitalo: "yes",
  },
  { feature: "Einstiegstarif bis 30\u00A0€ im Monat", wix: "yes", squarespace: "yes", jimdo: "yes", ki: "yes", sitalo: "no" },
];

const SPALTEN: { key: Exclude<keyof TableRow, "feature" | "hinweis">; label: string }[] = [
  { key: "wix", label: "Wix" },
  { key: "squarespace", label: "Squarespace" },
  { key: "jimdo", label: "Jimdo" },
  { key: "ki", label: "Selbstbau" },
  { key: "sitalo", label: "Sitalo" },
];

function TableSummary() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem] lg:col-span-7">
            Die Kurzfassung als Tabelle
          </h2>
          <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-5">
            Beim Preis liegen die Baukästen vorn. Sitalo kostet {STARTER_MONTHLY} im Monat zzgl. USt., dazu kommt der Aufbau.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto lg:mt-12">
          <table className="w-full border-collapse text-left text-[14px] sm:min-w-[640px] sm:text-[14.5px]">
            <caption className="sr-only">Vergleich von Wix, Squarespace, Jimdo, Selbstbau und Sitalo</caption>
            <thead>
              <tr className="border-foreground border-t-[3px]">
                <th scope="col" className="label-mono text-muted-foreground py-3 pr-3 align-bottom text-[11px] font-medium sm:pr-4">
                  Kriterium
                </th>
                {SPALTEN.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={`label-mono w-10 px-1 py-3 text-center align-bottom text-[11px] font-medium sm:w-auto sm:px-2 ${
                      c.key === "sitalo" ? "bg-card text-foreground border-gold border-t-[3px]" : "text-muted-foreground"
                    }`}
                  >
                    {/* Mobil senkrecht gesetzt, damit alle fünf Spalten auf den Schirm passen */}
                    <span className="inline-block rotate-180 [writing-mode:vertical-rl] sm:rotate-0 sm:[writing-mode:horizontal-tb]">
                      {c.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE.map((row) => (
                <tr key={row.feature} className="border-border border-t">
                  <th scope="row" className="py-3.5 pr-3 leading-snug font-medium sm:pr-4">
                    {row.feature}
                    {row.hinweis ? (
                      <span className="text-muted-foreground mt-0.5 block text-[12.5px] leading-snug font-normal">
                        {row.hinweis}
                      </span>
                    ) : null}
                  </th>
                  {SPALTEN.map((c) => (
                    <Cell key={c.key} value={row[c.key]} highlight={c.key === "sitalo"} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground mt-6 flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 text-[13px] leading-relaxed">
          <span className="inline-flex items-center gap-1.5">
            <Check className="text-foreground h-4 w-4" aria-hidden="true" /> erfüllt
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Minus className="h-4 w-4" aria-hidden="true" /> bedingt
          </span>
          <span className="inline-flex items-center gap-1.5">
            <X className="h-3.5 w-3.5" aria-hidden="true" /> fehlt meistens
          </span>
          <span>
            Unsere Einschätzung, Stand <time dateTime={STAND}>{formatDate(STAND)}</time>. Tarife und Funktionen der
            Anbieter ändern sich, im Zweifel lohnt ein Blick auf deren Seite.
          </span>
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
          <li>
            <Link href="/rechner" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
              Gesamtkosten über drei Jahre berechnen {ARROW}
            </Link>
          </li>
          <li>
            <Link href="/pakete" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
              Unsere Pakete und Preise {ARROW}
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Cell({ value, highlight }: { value: Wert; highlight?: boolean }) {
  const cls = `px-1 py-3.5 text-center sm:px-2 ${highlight ? "bg-card" : ""}`;
  if (value === "yes") {
    return (
      <td className={`text-foreground ${cls}`}>
        <Check className="mx-auto h-4 w-4" aria-label="erfüllt" />
      </td>
    );
  }
  if (value === "partial") {
    return (
      <td className={`text-muted-foreground ${cls}`}>
        <Minus className="mx-auto h-4 w-4" aria-label="bedingt" />
      </td>
    );
  }
  return (
    <td className={`text-muted-foreground/70 ${cls}`}>
      <X className="mx-auto h-3.5 w-3.5" aria-label="fehlt meistens" />
    </td>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: aktuelle Seite prüfen lassen.
 * ---------------------------------------------------------------- */
function FinalCta() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-balance text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.9rem]">
            Schicken Sie uns den Link zu Ihrer jetzigen Seite.
          </h2>
          <p className="text-stahl-hell mt-6 max-w-xl text-[16.5px] leading-relaxed">
            Sie bekommen drei bis fünf konkrete Punkte per Mail, kostenlos. Darin steht auch, ob sich ein Neubau lohnt oder ob
            Ihr Baukasten reicht.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
          <Link href="/audit" className="btn-signal grow sm:grow-0">
            Seite prüfen lassen {ARROW}
          </Link>
          <a href="tel:+491607621876" className="text-background text-[15px] font-semibold whitespace-nowrap underline-offset-4 hover:underline">
            0160&nbsp;7621876
          </a>
          <Link
            href="/website-erstellen-lassen"
            className="text-stahl-hell hover:text-background inline-flex basis-full items-center gap-1.5 text-[14.5px] font-semibold underline-offset-4 hover:underline lg:justify-end"
          >
            Website erstellen lassen bei Sitalo {ARROW}
          </Link>
        </div>
      </div>
    </section>
  );
}
