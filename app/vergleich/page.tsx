import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus, X } from "lucide-react";

import { MehrLink } from "@/components/marketing/apple";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { formatDate } from "@/lib/journal-data";
import { baukastenKosten } from "@/lib/fremdpreise";
import { getPaketBySlug } from "@/lib/pakete-data";
import { SEITEN_STAND } from "@/lib/seiten-stand";
import { SITE_URL } from "@/lib/site";

const TITLE = "Wix, Jimdo, Squarespace oder Webdesigner?";
const DESCRIPTION =
  "Wix, Squarespace, Jimdo, Selbstbau mit ChatGPT oder Webdesign-Büro: wann welcher Weg für lokale Betriebe passt, was er kostet und worauf Sie achten sollten.";
/** Erstveröffentlichung und letzte inhaltliche Überarbeitung (ISO), lib/seiten-stand.ts. */
const { veroeffentlicht: VEROEFFENTLICHT, stand: STAND } =
  SEITEN_STAND["/vergleich"];

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
      {
        "@type": "ListItem",
        position: 1,
        name: "Sitalo",
        item: `${SITE_URL}/`,
      },
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
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Vergleich"
          eyebrow="Baukasten · Selbstbau · Webdesign"
          titel="Wix, Squarespace, Jimdo und Selbstbau im Vergleich"
          unter="Für manche Betriebe reicht ein Baukasten, und wer gern tüftelt, kommt mit ChatGPT inzwischen weit. Hier steht, wann welcher Weg passt und wann es sich lohnt, uns zu beauftragen."
          aktionen={
            <>
              <Link href="/audit" className="btn-signal btn-gross">
                Seite prüfen lassen
              </Link>
              <MehrLink href="#tabelle" groesse="unter">
                Zur Kurzfassung
              </MehrLink>
            </>
          }
          meta={
            <>
              Stand <time dateTime={STAND}>{formatDate(STAND)}</time>
            </>
          }
          bild={
            <FotoRahmen
              vorab
              src="/images/workspace-laptop.webp"
              alt="Aufgeklappter Laptop auf einem hellen Schreibtisch"
              aspect="21 / 9"
              aspectMobil="16 / 9"
              position="50% 50%"
            />
          }
          unterschrift="Drei Wege zur eigenen Website, ehrlich nebeneinander"
        />
        <Faustregel />
        <DeepDives />
        <TableSummary />
        <FinalCta />
      </UnterseiteMain>
      <MarketingFooter crumb="Vergleich" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

const STARTER_MONTHLY = (
  getPaketBySlug("starter")?.monthly ?? "ab 59\u00A0€ / Monat"
).replace(/\s*\/\s*Monat$/, "");

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
    link: {
      href: "/webseite-erstellen#schritte",
      label: "Webseite mit Baukasten selbst erstellen: die Schritte",
    },
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
    link: {
      href: "/website-erstellen-lassen",
      label: "Website erstellen lassen: Festpreis und Ablauf",
    },
    sitalo: true,
  },
];

function Faustregel() {
  return (
    <Abschnitt
      id="faustregel"
      fett="Die Faustregel."
      grau="Wer womit am besten fährt."
    >
      <ul role="list" className="grid gap-3 sm:gap-5 lg:grid-cols-3">
        {FAUSTREGEL.map((f) => (
          <li
            key={f.weg}
            className={`flex flex-col rounded-[18px] p-6 sm:rounded-[28px] sm:p-8 ${
              f.sitalo
                ? "bg-white shadow-[0_4px_16px_rgb(0_0_0/0.06),inset_0_0_0_2px_var(--gold)]"
                : "bg-white shadow-[0_4px_16px_rgb(0_0_0/0.06)]"
            }`}
          >
            <p className="kennzeile-mono">{f.weg}</p>
            <p className="mt-4 text-[21px] leading-snug font-semibold tracking-[-0.018em] sm:text-[24px]">
              {f.wann}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
              {f.detail}
            </p>
            {f.link ? (
              <div className="mt-auto pt-5">
                <MehrLink href={f.link.href} groesse="klein">
                  {f.link.label}
                </MehrLink>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Abschnitt>
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
    realCost: `${baukastenKosten("Squarespace")} Nach unserer Einschätzung etwas weniger Aufwand als bei Wix, beim Aufbau wie bei der Pflege.`,
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
    tagline:
      "Sie beschreiben einem Chat-Programm wie ChatGPT, was Sie wollen, und es schreibt den Code.",
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
    <Abschnitt
      id="alternativen"
      fett="Die vier Alternativen im Einzelnen."
      grau="Auch wenn es gegen uns spricht."
    >
      <nav
        aria-label="Alternativen auf dieser Seite"
        className={`${u.chips} mb-5`}
      >
        {DEEP_DIVES.map((d) => (
          <a key={d.id} href={`#${d.id}`} className={u.chip}>
            {d.label}
          </a>
        ))}
      </nav>
      <div className="grid gap-3 sm:gap-5">
        {DEEP_DIVES.map((d) => (
          <DeepDiveBlock key={d.id} d={d} />
        ))}
      </div>
    </Abschnitt>
  );
}

function DeepDiveBlock({ d }: { d: DeepDive }) {
  return (
    <article
      id={d.id}
      className={`${u.blatt} grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:gap-8`}
    >
      <div className="lg:col-span-4">
        <p className="notiz-mono">{d.kategorie}</p>
        <h3 className="mt-2 text-[28px] leading-[1.1] tracking-[-0.02em] sm:text-[32px]">
          {d.label}
        </h3>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-pretty text-[#6e6e73] sm:text-[17px]">
          {d.tagline}
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
        <div>
          <h4 className="border-b border-black/10 pb-2 text-[14px] font-semibold text-[#1d1d1f]">
            Passt für
          </h4>
          <ul className="mt-3 space-y-2.5">
            {d.goodFor.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 text-[15px] leading-snug text-[#1d1d1f]"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#1d1d1f]"
                  aria-hidden="true"
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="border-b border-black/10 pb-2 text-[14px] font-semibold text-[#1d1d1f]">
            Darauf achten
          </h4>
          <ul className="mt-3 space-y-2.5">
            {d.watchOut.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 text-[15px] leading-snug text-[#424245]"
              >
                <Minus
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#6e6e73]"
                  aria-hidden="true"
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-1.5 rounded-[14px] bg-[#f5f5f7] px-5 py-4 sm:col-span-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
          <p className="notiz-mono sm:pt-[2px]">Kosten</p>
          <p className="text-[15px] leading-relaxed text-[#1d1d1f]">
            {d.realCost}
          </p>
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
  {
    feature: "Fester Ansprechpartner, der Ihre Seite kennt",
    wix: "no",
    squarespace: "no",
    jimdo: "no",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Handy-Ansicht ohne Nacharbeit",
    wix: "partial",
    squarespace: "partial",
    jimdo: "partial",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Grundlagen für die lokale Suche",
    hinweis: "Bei Sitalo ab dem Paket Business",
    wix: "partial",
    squarespace: "partial",
    jimdo: "partial",
    ki: "no",
    sitalo: "partial",
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
  {
    feature: "Texte werden für Sie geschrieben",
    wix: "no",
    squarespace: "no",
    jimdo: "no",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Updates laufen ohne Ihr Zutun",
    wix: "yes",
    squarespace: "yes",
    jimdo: "yes",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Gestaltung lässt sich als Ganzes mitnehmen",
    hinweis: "Bei Sitalo und im Selbstbau über den Quellcode",
    wix: "no",
    squarespace: "partial",
    jimdo: "no",
    ki: "yes",
    sitalo: "yes",
  },
  {
    feature: "Günstiger Einstiegstarif",
    wix: "yes",
    squarespace: "yes",
    jimdo: "yes",
    ki: "yes",
    sitalo: "no",
  },
];

const SPALTEN: {
  key: Exclude<keyof TableRow, "feature" | "hinweis">;
  label: string;
}[] = [
  { key: "wix", label: "Wix" },
  { key: "squarespace", label: "Squarespace" },
  { key: "jimdo", label: "Jimdo" },
  { key: "ki", label: "Selbstbau" },
  { key: "sitalo", label: "Sitalo" },
];

function TableSummary() {
  return (
    <Abschnitt
      id="tabelle"
      fett="Die Kurzfassung als Tabelle."
      unter={
        <>
          Beim Preis liegen die Baukästen vorn. Sitalo kostet {STARTER_MONTHLY}{" "}
          im Monat inkl. MwSt., dazu kommt der Aufbau.
        </>
      }
    >
      <div className={u.blatt}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[14px] sm:min-w-[640px] sm:text-[15px]">
            <caption className="sr-only">
              Vergleich von Wix, Squarespace, Jimdo, Selbstbau und Sitalo
            </caption>
            <thead>
              <tr className="border-b border-black/15">
                <th
                  scope="col"
                  className="notiz-mono py-3 pr-3 align-bottom font-normal sm:pr-4"
                >
                  Kriterium
                </th>
                {SPALTEN.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={`w-10 px-1 py-3 text-center align-bottom text-[12px] font-semibold sm:w-auto sm:px-2 sm:text-[14px] ${
                      c.key === "sitalo"
                        ? "text-gold-ink rounded-t-[12px] bg-[#f5f5f7]"
                        : "text-[#6e6e73]"
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
                <tr
                  key={row.feature}
                  className="border-t border-black/10 first:border-t-0"
                >
                  <th
                    scope="row"
                    className="py-3.5 pr-3 leading-snug font-medium text-[#1d1d1f] sm:pr-4"
                  >
                    {row.feature}
                    {row.hinweis ? (
                      <span className="mt-0.5 block text-[12.5px] leading-snug font-normal text-[#6e6e73]">
                        {row.hinweis}
                      </span>
                    ) : null}
                  </th>
                  {SPALTEN.map((c) => (
                    <Cell
                      key={c.key}
                      value={row[c.key]}
                      highlight={c.key === "sitalo"}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 text-[13px] leading-relaxed text-[#6e6e73]">
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-4 w-4 text-[#1d1d1f]" aria-hidden="true" />{" "}
          erfüllt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Minus className="h-4 w-4" aria-hidden="true" /> bedingt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <X className="h-3.5 w-3.5" aria-hidden="true" /> fehlt meistens
        </span>
        <span>
          Unsere Einschätzung, Stand{" "}
          <time dateTime={STAND}>{formatDate(STAND)}</time>. Tarife und
          Funktionen der Anbieter ändern sich, im Zweifel lohnt ein Blick auf
          deren Seite.
        </span>
      </p>
      <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
        <li>
          <MehrLink href="/rechner">
            Gesamtkosten über drei Jahre berechnen
          </MehrLink>
        </li>
        <li>
          <MehrLink href="/pakete">Unsere Pakete und Preise</MehrLink>
        </li>
      </ul>
    </Abschnitt>
  );
}

function Cell({ value, highlight }: { value: Wert; highlight?: boolean }) {
  const cls = `px-1 py-3.5 text-center sm:px-2 ${highlight ? "bg-[#f5f5f7]" : ""}`;
  if (value === "yes") {
    return (
      <td className={`text-[#1d1d1f] ${cls}`}>
        <Check className="mx-auto h-4 w-4" aria-label="erfüllt" />
      </td>
    );
  }
  if (value === "partial") {
    return (
      <td className={`text-[#6e6e73] ${cls}`}>
        <Minus className="mx-auto h-4 w-4" aria-label="bedingt" />
      </td>
    );
  }
  return (
    <td className={`text-[#a1a1a6] ${cls}`}>
      <X className="mx-auto h-3.5 w-3.5" aria-label="fehlt meistens" />
    </td>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: aktuelle Seite prüfen lassen, als Briefkarte.
 * ---------------------------------------------------------------- */
function FinalCta() {
  return (
    <KontaktKarte
      id="abschluss"
      titel="Schicken Sie uns den Link zu Ihrer jetzigen Seite."
      zeile="Sie bekommen drei bis fünf konkrete Punkte per Mail, kostenlos. Darin steht auch, ob sich ein Neubau lohnt oder ob Ihr Baukasten reicht."
      pille={{ href: "/audit", label: "Seite prüfen lassen" }}
      link={{
        href: "/website-erstellen-lassen",
        label: "Website erstellen lassen bei Sitalo",
      }}
      foto={{
        src: "/images/workspace-typing.webp",
        alt: "Hände auf der Tastatur eines Laptops in warmem Licht",
      }}
    />
  );
}
