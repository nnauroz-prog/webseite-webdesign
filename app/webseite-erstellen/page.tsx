import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { WegFinder } from "@/components/marketing/ratgeber/weg-finder";
import { FAUSTREGEL } from "@/components/marketing/ratgeber/weg-finder-logic";
import { BAUKASTEN_OHNE_BETRAG, BAUKASTEN_PREISE } from "@/lib/fremdpreise";
import { formatDate } from "@/lib/journal-data";
import { PREIS_HINWEIS, getPaketBySlug, type Paket } from "@/lib/pakete-data";
import { SEITEN_STAND } from "@/lib/seiten-stand";
import { SITE_URL } from "@/lib/site";

/**
 * Ratgeber für Selbstbauer: „Webseite erstellen“, „Website erstellen“,
 * „Homepage erstellen“ (Google wertet die Schreibweisen zusammen) und
 * Long Tail wie „Webseite selbst erstellen oder erstellen lassen“.
 *
 * Neutral aufgebaut: alle Wege nebeneinander, auch die, bei denen man
 * uns nicht braucht. Sitalo kommt erst im letzten Abschnitt vor.
 * Abgrenzung zu den Nachbarseiten, damit sie sich keine Konkurrenz
 * machen: Was das Erstellenlassen kostet, steht auf /website-kosten;
 * Anbieter im Einzelnen auf /vergleich; die Geldseite ist
 * /website-erstellen-lassen.
 *
 * Fakten: eigene Preise und Dauer aus lib/pakete-data.ts; Zeitangaben
 * als Einschätzung (dieselben wie auf /vergleich); Fremdpreise nur mit
 * Beleg aus lib/fremdpreise.ts (derzeit ohne Betrag); keine Statistiken,
 * keine Kundengeschichten, kein HowTo- oder Bewertungs-Schema. Die
 * Faustregel kommt aus weg-finder-logic.ts, wie die Regeln der
 * Entscheidungshilfe.
 */

/** Erstveröffentlichung und letzte inhaltliche Überarbeitung (ISO), lib/seiten-stand.ts. */
const { veroeffentlicht: VEROEFFENTLICHT, stand: STAND } =
  SEITEN_STAND["/webseite-erstellen"];

const PATH = "/webseite-erstellen";
const TITLE = "Webseite erstellen: Anleitung, Kosten und Wege";
const H1 = "Webseite erstellen: Schritte, Wege und Kosten";
const DESCRIPTION =
  "Webseite erstellen in sieben Schritten: Ziel, Domain, Inhalte, Werkzeug, Impressum, Google, Pflege. Mit Kosten, Dauer und Entscheidungshilfe in vier Fragen.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    publishedTime: VEROEFFENTLICHT,
    modifiedTime: STAND,
  },
};

const STARTER = getPaketBySlug("starter");
const BUSINESS = getPaketBySlug("business");
const STARTER_MONTHLY = (STARTER?.monthly ?? "ab 49 € / Monat").replace(
  /\s*\/\s*Monat$/,
  "",
);

const ARROW = <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />;
const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";
const H2 =
  "text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]";
const TEXTLINK =
  "inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline";
const INLINE =
  "text-foreground underline decoration-foreground/35 underline-offset-4 hover:decoration-current";
/** Spalten der Wege-Übersicht ab lg und der Kostenposten ab md. */
const WEGE_SPALTEN =
  "lg:grid-cols-[19fr_24fr_18fr_17fr_22fr] lg:items-start lg:gap-x-5";
const POSTEN_SPALTEN =
  "md:grid-cols-[26%_28%_minmax(0,1fr)] md:items-start md:gap-x-5";

const INHALT = [
  { href: "#wege", label: "Vier Wege" },
  { href: "#entscheidung", label: "Entscheidungshilfe" },
  { href: "#schritte", label: "Sieben Schritte" },
  { href: "#kosten", label: "Kosten und Dauer" },
  { href: "#checkliste", label: "Checkliste" },
  { href: "#fragen", label: "Häufige Fragen" },
];

/* ------------------------------------------------------------------
 * Vier Wege
 * ---------------------------------------------------------------- */

type Weg = {
  name: string;
  beispiel: string;
  selbst: string;
  kosten: React.ReactNode;
  zeit: string;
  /** Setzt den Satz „Passt, wenn …“ fort. */
  passt: string;
};

const WEGE: Weg[] = [
  {
    name: "Homepage-Baukasten",
    beispiel: "z. B. Wix, Jimdo, Squarespace",
    selbst:
      "Vorlage wählen, Texte und Bilder einsetzen, Impressum und Datenschutzerklärung selbst einbinden.",
    kosten: (
      <>
        Abo beim Anbieter, je nach Tarif; mehr unter{" "}
        <a href="#kosten" className={INLINE}>
          Kosten
        </a>
      </>
    ),
    zeit: "10 bis 40 Stunden Aufbau, danach 1 bis 3 Stunden Pflege im Monat",
    passt: "die Seite einfach bleibt und Sie einige Abende Zeit haben.",
  },
  {
    name: "WordPress mit eigenem Hosting",
    beispiel: "Software kostenlos, Hosting gemietet",
    selbst:
      "Hosting und Domain buchen, Theme und Erweiterungen wählen, Updates und Backups selbst einspielen.",
    kosten:
      "Hosting ab wenigen Euro im Monat, Themes und Erweiterungen teils kostenpflichtig",
    zeit: "Hängt stark von Theme und Erweiterungen ab, eine belastbare Zahl gibt es nicht",
    passt: "sich Inhalte oft ändern und Technik Sie nicht abschreckt.",
  },
  {
    name: "Selbst programmieren",
    beispiel:
      "HTML und CSS, auf Wunsch mit Hilfe von Chat-Programmen wie ChatGPT",
    selbst:
      "Alles, vom Code über Hosting, Formular und Spamschutz bis zu den Tests am Handy.",
    kosten: "Domain und Hosting, oft wenige Euro im Monat",
    zeit: "30 bis 80 Stunden mit Einarbeitung",
    passt:
      "Sie Code lernen wollen und die Seite ein eigenes Projekt sein darf.",
  },
  {
    name: "Erstellen lassen",
    beispiel:
      "Freelancer, Agentur, Designservice eines Baukasten-Anbieters, Büros wie Sitalo",
    selbst:
      "Ein Gespräch führen, Stichpunkte und Fotos liefern, den Entwurf prüfen und freigeben.",
    kosten: (
      <Link href="/website-kosten" className={INLINE}>
        Was es kostet, eine Website erstellen zu lassen
      </Link>
    ),
    zeit: "Ein Gespräch und das Sammeln Ihrer Unterlagen",
    passt:
      "Ihnen die Zeit fehlt oder sich nach dem Start jemand anderes um Technik und Pflege kümmern soll.",
  },
];

/* ------------------------------------------------------------------
 * Kosten des Selbstbaus
 * ---------------------------------------------------------------- */

type Posten = {
  posten: string;
  richtwert: React.ReactNode;
  hinweis: React.ReactNode;
};

const POSTEN: Posten[] = [
  {
    posten: "Domain (.de)",
    richtwert: "meist unter 20 € im Jahr",
    hinweis:
      "Bei Baukästen im ersten Jahr oft im Tarif enthalten. Prüfen Sie den Preis ab dem zweiten Jahr.",
  },
  {
    posten: "Baukasten-Abo",
    // Beträge nur, wenn in lib/fremdpreise.ts geprüft eingetragen.
    richtwert: BAUKASTEN_PREISE.some((p) => p.betrag) ? (
      <span className="grid gap-1">
        {BAUKASTEN_PREISE.filter((p) => p.betrag).map((p) => (
          <span key={p.anbieter}>
            {p.anbieter} {p.betrag}
          </span>
        ))}
      </span>
    ) : (
      "monatlich, je nach Tarif"
    ),
    hinweis: `Wix, Squarespace, Jimdo, IONOS, STRATO und andere haben eigene Tarife, oft mit Aktionspreisen. ${BAUKASTEN_OHNE_BETRAG.replace(/^Abo beim Anbieter\. /, "")} Gratistarife zeigen Werbung und laufen unter einer Adresse des Anbieters.`,
  },
  {
    posten: "Hosting für WordPress oder eine eigene Seite",
    richtwert: "ab wenigen Euro im Monat",
    hinweis: "Achten Sie auf Server in der EU und automatische Backups.",
  },
  {
    posten: "Themes und Erweiterungen",
    richtwert: "kostenlos bis kostenpflichtig",
    hinweis:
      "Bezahlte Erweiterungen laufen oft als Jahreslizenz und verlängern sich.",
  },
  {
    posten: "Rechtstexte",
    richtwert: "kostenlos bis Abo",
    hinweis:
      "Generatoren gibt es teils kostenlos, sonst als Abo, bei Verbänden oder über eine Anwältin.",
  },
  {
    posten: "Fotos",
    richtwert: "eigene oder lizenziert",
    hinweis:
      "Eigene Fotos kosten nichts. Bilder aus Datenbanken nur mit passender Lizenz.",
  },
  {
    posten: "Ihre Zeit",
    richtwert: "meist der größte Posten",
    hinweis: (
      <>
        Stunden je Weg stehen unter{" "}
        <a href="#dauer" className={INLINE}>
          Wie lange es dauert
        </a>
        .{" "}
        <Link href="/rechner" className={INLINE}>
          Ihre Zeit mitrechnen: 3{"\u2011"}Jahres{"\u2011"}Rechner
        </Link>
      </>
    ),
  },
];

/* ------------------------------------------------------------------
 * Checkliste und Fragen
 * ---------------------------------------------------------------- */

const CHECKLISTE = [
  "Domain läuft auf Ihren Namen",
  "Impressum vollständig, mit ladungsfähiger Anschrift",
  "Datenschutzerklärung nennt alle eingesetzten Dienste",
  "Karten und Videos laden erst nach Zustimmung",
  "Telefonnummer lässt sich am Handy antippen",
  "Testnachricht über das Formular ist angekommen",
  "Auf dem eigenen Handy durchgeklickt",
  "Titel und Beschreibung für jede Seite",
  "Rechte an allen Fotos geklärt",
  "Öffnungszeiten gleich wie im Unternehmensprofil",
  "Search Console eingerichtet, Sitemap eingereicht",
  "Geklärt, wer Updates und Backups macht",
];

type Frage = { q: string; a: string; link?: { href: string; label: string } };

const FAQ: Frage[] = [
  {
    q: "Kann ich eine Webseite kostenlos erstellen?",
    a: "Ja, viele Baukästen haben einen Gratistarif. Die Seite zeigt dann Werbung des Anbieters und läuft unter dessen Adresse, etwa ihr-betrieb.anbieter.com. Eine eigene Domain gibt es meist erst ab einem bezahlten Tarif, und für einen Betrieb wirkt sie seriöser. Ein Impressum brauchen Sie auch auf einer kostenlosen Seite, sobald sie geschäftlich ist.",
  },
  {
    q: "Welcher Homepage-Baukasten passt zu mir?",
    a: "Das hängt davon ab, was die Seite leisten soll. Wix bietet viele Vorlagen und Erweiterungen, Squarespace legt den Schwerpunkt auf Bilder und Gestaltung, Jimdo aus Hamburg ist bewusst einfach gehalten. Bauen Sie bei zwei Anbietern dieselbe Startseite in der Gratis- oder Testversion, bevor Sie ein Jahresabo abschließen.",
    link: {
      href: "/vergleich",
      label: "Wix, Squarespace und Jimdo im Vergleich",
    },
  },
  {
    q: "Kann ChatGPT eine Webseite für mich erstellen?",
    a: "Es schreibt Code und Texte als Entwurf, und technisch Interessierte kommen damit weit. Domain, Hosting, Impressum und Datenschutz, Tests auf dem Handy und die Pflege bleiben aber bei Ihnen. Lesen Sie jeden erzeugten Text, bevor er online geht, besonders Angaben zu Preisen und Rechtlichem.",
  },
  {
    q: "Wie lange dauert es, eine Webseite zu erstellen?",
    a: "Mit einem Baukasten nach unserer Einschätzung 10 bis 40 Stunden, selbst programmiert 30 bis 80 Stunden mit Einarbeitung. Am meisten Zeit kosten fast immer Texte und Fotos. Wer die Seite erstellen lässt, wartet je nach Anbieter und Umfang einige Tage bis mehrere Wochen, gezählt ab vollständigen Unterlagen.",
  },
  {
    q: "Brauche ich ein Impressum, auch für eine kleine Seite?",
    a: "Ja, sobald die Seite geschäftlich ist, also auch für die einzelne Visitenkarten-Seite eines Selbstständigen. Name, ladungsfähige Anschrift und Wege zur schnellen Kontaktaufnahme müssen hinein, bei einer GmbH, UG oder einem Verein auch die vertretungsberechtigte Person; eine Postfachadresse reicht nicht. Rein private Seiten, etwa für Familie und Freunde, brauchen in der Regel keins.",
  },
  {
    q: "Brauche ich einen Cookie-Banner?",
    a: "Nur, wenn Ihre Seite Cookies setzt oder Daten abruft, die technisch nicht notwendig sind, vor allem für Tracking, Werbung oder eingebettete Karten und Videos. Wer darauf verzichtet und Karten erst nach einem Klick lädt, braucht in der Regel keinen. Prüfen Sie bei einem Baukasten, welche Dienste der Anbieter von sich aus einbindet.",
  },
  {
    q: "Kann ich später vom Baukasten wechseln?",
    a: "Ja, aber selten mit einem Klick. Texte und Bilder nehmen Sie mit, wenn Sie die Originaldateien gesichert haben. Die Gestaltung wird beim neuen Anbieter meist neu gebaut. Die Domain kommt mit, wenn sie auf Ihren Namen läuft.",
    link: {
      href: "/journal/was-wir-an-wix-migrationen-lernen",
      label: "Was beim Umzug von einem Baukasten Arbeit macht",
    },
  },
];

const WEITERLESEN = [
  {
    href: "/vergleich",
    label: "Wix, Squarespace, Jimdo oder Webdesigner: der Vergleich",
  },
  {
    href: "/website-kosten",
    label: "Was kostet eine Website? Preise im Überblick",
  },
  { href: "/rechner", label: "3-Jahres-Rechner: Gesamtkosten mit Ihrer Zeit" },
  { href: "/pakete", label: "Website-Pakete im Vergleich" },
  { href: "/lexikon", label: "Lexikon: Webbegriffe in Alltagsdeutsch" },
  {
    href: "/journal/wann-eine-website-warten-kann",
    label: "Wann eine Website warten kann",
  },
];

/* ------------------------------------------------------------------
 * Seite
 * ---------------------------------------------------------------- */

export default function WebseiteErstellenPage() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: H1,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      datePublished: VEROEFFENTLICHT,
      dateModified: STAND,
      image: `${SITE_URL}${PATH}/opengraph-image`,
      author: { "@id": `${SITE_URL}/#business` },
      publisher: { "@id": `${SITE_URL}/#business` },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${PATH}` },
    },
    {
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
          name: "Webseite erstellen",
          item: `${SITE_URL}${PATH}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Webseite erstellen"
          eyebrow="Ratgeber"
          title={H1}
          meta={
            <div className="space-y-8">
              <p className="text-stahl-hell font-mono text-[12.5px] leading-relaxed">
                Sitalo Webdesign, Hamburg · zuletzt überarbeitet am{" "}
                <time dateTime={STAND}>{formatDate(STAND)}</time> ·{" "}
                <Link
                  href="/atelier"
                  className="text-background underline underline-offset-4"
                >
                  Wer wir sind
                </Link>
              </p>
              <nav aria-label="Auf dieser Seite">
                <p className="label-mono text-stahl-hell text-[11px]">
                  Auf dieser Seite
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                  {INHALT.map((i) => (
                    <li key={i.href} className="border-background/15 border-t">
                      <a
                        href={i.href}
                        className="text-background/90 hover:text-background group flex items-center justify-between gap-3 py-2.5 text-[14.5px]"
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4">
                          {i.label}
                        </span>
                        <ArrowDown
                          className="text-stahl-hell h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          }
        >
          Eine Webseite erstellen Sie in sieben Schritten: Ziel klären, Domain
          sichern, Texte und Fotos sammeln, Werkzeug wählen, Impressum und
          Datenschutz einbauen, für Google einrichten, pflegen. Mit einem
          Baukasten schaffen das viele selbst, wenn sie einige Abende Zeit
          haben. Hier stehen alle Wege nebeneinander, auch die, bei denen Sie
          uns nicht brauchen. Ob Webseite, Website oder Homepage: gemeint ist
          dasselbe.
        </PageHero>

        {/* Vier Wege: Tabelle ab lg, darunter je Weg ein Block */}
        <section
          id="wege"
          className="scroll-mt-24"
          aria-labelledby="wege-titel"
        >
          <div className={INNER}>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 id="wege-titel" className={`${H2} lg:col-span-7`}>
                Vier Wege zur eigenen Webseite
              </h2>
              <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
                Welcher Weg passt, hängt weniger vom Geld ab als von Ihrer Zeit
                und davon, was die Seite leisten soll.
              </p>
            </div>

            {/* Eine Struktur für alle Breiten (keine Tabelle plus Mobil-Kopie):
                ab lg fünf Spalten mit Kopfzeile, darunter je Weg ein Block. */}
            <div
              aria-hidden="true"
              className={`border-foreground mt-12 hidden border-t-[3px] py-3 lg:grid ${WEGE_SPALTEN}`}
            >
              {[
                "Weg",
                "Was Sie selbst machen",
                "Laufende Kosten",
                "Ihr Zeitaufwand*",
                "Passt, wenn …",
              ].map((h) => (
                <span
                  key={h}
                  className="label-mono text-muted-foreground text-[11px]"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="border-foreground mt-10 border-t-[3px] lg:mt-0 lg:border-t-0">
              {WEGE.map((w) => (
                <div
                  key={w.name}
                  className={`border-border border-b py-6 lg:grid lg:border-t lg:border-b-0 lg:py-5 lg:text-[14.5px] ${WEGE_SPALTEN}`}
                >
                  <div>
                    <h3 className="text-[1.25rem] leading-tight tracking-[-0.015em] lg:text-[16.5px] lg:leading-snug lg:font-semibold lg:tracking-[-0.01em]">
                      {w.name}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-[14px] leading-snug lg:text-[13.5px]">
                      {w.beispiel}
                    </p>
                  </div>
                  <dl className="mt-4 grid gap-x-4 gap-y-2.5 text-[15px] leading-snug sm:grid-cols-[10rem_minmax(0,1fr)] lg:contents">
                    <dt className="label-mono text-muted-foreground pt-[3px] text-[10.5px] lg:sr-only">
                      Selbst machen
                    </dt>
                    <dd className="lg:text-[14.5px] lg:leading-relaxed">
                      {w.selbst}
                    </dd>
                    <dt className="label-mono text-muted-foreground pt-[3px] text-[10.5px] lg:sr-only">
                      Laufende Kosten
                    </dt>
                    <dd className="text-muted-foreground lg:text-[14.5px] lg:leading-relaxed">
                      {w.kosten}
                    </dd>
                    <dt className="label-mono text-muted-foreground pt-[3px] text-[10.5px] lg:sr-only">
                      Zeitaufwand*
                    </dt>
                    <dd className="text-muted-foreground lg:text-[14.5px] lg:leading-relaxed">
                      {w.zeit}
                    </dd>
                  </dl>
                  <p className="mt-4 text-[15.5px] leading-relaxed lg:mt-0 lg:text-[14.5px]">
                    <span className="font-semibold lg:sr-only">
                      Passt, wenn
                    </span>
                    <span aria-hidden="true" className="hidden lg:inline">
                      …
                    </span>{" "}
                    {w.passt}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <p className="text-muted-foreground max-w-2xl text-[13.5px] leading-relaxed">
                * Unsere Einschätzung für eine einfache Seite eines kleinen
                Betriebs. Tarife und Funktionen der Anbieter ändern sich.
              </p>
              <Link href="/vergleich" className={TEXTLINK}>
                Wix, Squarespace und Jimdo im Einzelnen {ARROW}
              </Link>
            </div>
          </div>
        </section>

        {/* Entscheidungshilfe auf dunkler Fläche */}
        <section
          id="entscheidung"
          className="grain bg-foreground text-background scroll-mt-24"
          aria-labelledby="entscheidung-titel"
        >
          <div className={INNER}>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 id="entscheidung-titel" className={`${H2} lg:col-span-7`}>
                Selbst machen oder machen lassen: vier Fragen
              </h2>
              <p className="text-stahl-hell max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
                Antworten Sie so, wie es bei Ihnen gerade ist, nicht wie es sein
                sollte. Die Regeln dahinter stehen unter den Fragen; es gilt die
                erste, die passt.
              </p>
            </div>
            <div className="mt-12 lg:mt-14">
              <WegFinder />
            </div>

            <div className="border-background/25 mt-16 grid gap-6 border-t pt-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
              <h3 className="text-[1.4rem] leading-tight tracking-[-0.015em] lg:col-span-3">
                Die Regeln dahinter
              </h3>
              <dl className="lg:col-span-9">
                {FAUSTREGEL.map((f, i) => (
                  <div
                    key={`${i}-${f.wenn}`}
                    className="border-background/15 grid gap-1 border-b py-4 first:pt-0 sm:grid-cols-[19rem_minmax(0,1fr)] sm:gap-6"
                  >
                    <dt className="text-[15.5px] font-semibold">
                      <span className="text-gold mr-2 tabular-nums">
                        {i + 1}.
                      </span>
                      {f.wenn}
                    </dt>
                    <dd className="text-stahl-hell text-[15.5px] leading-relaxed">
                      {f.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Sieben Schritte */}
        <section
          id="schritte"
          className="scroll-mt-24"
          aria-labelledby="schritte-titel"
        >
          <div className={INNER}>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 id="schritte-titel" className={`${H2} lg:col-span-7`}>
                Eine Webseite erstellen in sieben Schritten
              </h2>
              <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
                Die Reihenfolge gilt für jeden Weg. Wer die Seite erstellen
                lässt, entscheidet bei den Schritten 1 bis 3 trotzdem mit: das
                Ziel, eine Domain auf den eigenen Namen, Stichpunkte und Fotos.
                Den Rest übernimmt der Anbieter.
              </p>
            </div>

            <ol className="mt-12 lg:mt-14">
              <Schritt
                nr={1}
                id="ziel"
                titel="Ziel und Umfang festlegen"
                kurz="Wer soll die Seite finden, und was soll danach passieren?"
              >
                <p>
                  Bevor Sie ein Werkzeug öffnen, klären Sie, wer die Seite
                  finden soll und was danach passieren soll: ein Anruf, eine
                  Anfrage über das Formular, eine Reservierung, ein Besuch im
                  Laden oder eine Bewerbung. Daraus ergibt sich, was ganz oben
                  stehen muss.
                </p>
                <p>
                  Dann der Umfang. Wer weniger als fünf Leistungen anbietet und
                  keine eigenen Bereiche für Team, Neuigkeiten oder Stellen
                  braucht, kommt mit einer einzigen Seite oft aus. Mehrere
                  Seiten lohnen sich, wenn Sie zu jeder Leistung viel zu sagen
                  haben oder für einzelne Leistungen bei Google gefunden werden
                  wollen. Skizzieren Sie den Seitenplan auf Papier: welche
                  Seiten es gibt und was auf jeder steht.
                </p>
                <Weiter
                  links={[
                    { href: "/branchen", label: "Seitenpläne nach Branche" },
                    {
                      href: "/branchen/handwerker",
                      label: "Beispiel: Seitenplan für Handwerksbetriebe",
                    },
                    {
                      href: "/branchen/pflege",
                      label: "Beispiel: Seitenplan für Pflegedienste",
                    },
                  ]}
                />
              </Schritt>

              <Schritt
                nr={2}
                id="domain"
                titel="Domain wählen und sichern"
                kurz="Ihre Adresse im Netz, etwa ihr-betrieb.de."
              >
                <p>
                  Gut ist eine kurze, merkbare Adresse, die man am Telefon
                  buchstabieren kann. Für Betriebe in Deutschland ist .de die
                  naheliegende Endung. Ob die Wunschadresse noch frei ist, zeigt
                  die Domainabfrage bei der DENIC, der Registrierungsstelle für
                  .de.
                </p>
                <p>
                  Eine .de-Adresse kostet meist weniger als 20&nbsp;€ im Jahr.
                  Lassen Sie sie immer auf Ihren eigenen Namen eintragen, nicht
                  auf den einer Agentur oder eines Bekannten. Bei Baukästen ist
                  die Domain im ersten Jahr oft im Tarif enthalten; prüfen Sie,
                  was sie ab dem zweiten Jahr kostet. Mit der Domain bekommen
                  Sie auch eine E-Mail-Adresse wie info@ihr-betrieb.de; ob das
                  E-Mail-Konto im Tarif steckt oder extra kostet, ist je nach
                  Anbieter verschieden.
                </p>
                <Weiter
                  links={[
                    { href: "/lexikon#domain", label: "Domain im Lexikon" },
                    {
                      href: "https://www.denic.de/",
                      label: "Domainabfrage bei der DENIC",
                      extern: true,
                    },
                  ]}
                />
              </Schritt>

              <Schritt
                nr={3}
                id="inhalte"
                titel="Texte und Fotos sammeln"
                kurz="Meist der größte Zeitposten, egal auf welchem Weg."
              >
                <p>Legen Sie ein Dokument an und sammeln Sie darin:</p>
                <ul className="border-border grid border-t sm:grid-cols-2 sm:gap-x-8">
                  {[
                    "Ihre Leistungen, jede in zwei oder drei Sätzen",
                    "Einsatzgebiet oder Adresse mit Anfahrt",
                    "Öffnungs- oder Sprechzeiten",
                    "Telefon, E-Mail und Zeiten für Rückrufe",
                    "Preise oder einen Preisrahmen",
                    "Offene Stellen mit Ansprechpartner",
                    "Ihr Logo als Datei in guter Auflösung",
                  ].map((t) => (
                    <li
                      key={t}
                      className="border-border text-foreground border-b py-3 text-[15.5px] leading-snug"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <p>
                  Bei den Fotos zeigen eigene Bilder vom Betrieb, vom Team und
                  von fertigen Arbeiten, wie es bei Ihnen wirklich aussieht.
                  Handyfotos bei Tageslicht reichen oft. Fremde Fotos verwenden
                  Sie nur mit Lizenz, und wer auf einem Bild zu erkennen ist,
                  sollte der Veröffentlichung zugestimmt haben.
                </p>
              </Schritt>

              <Schritt
                nr={4}
                id="werkzeug"
                titel="Werkzeug wählen und einrichten"
                kurz="Je Weg ein paar Prüfpunkte, bevor Sie sich festlegen."
              >
                <p>
                  Welcher Weg zu Ihnen passt, zeigen die{" "}
                  <a href="#wege" className={INLINE}>
                    Übersicht der vier Wege
                  </a>{" "}
                  und die{" "}
                  <a href="#entscheidung" className={INLINE}>
                    Entscheidungshilfe
                  </a>
                  . Bevor Sie ein Abo abschließen oder etwas unterschreiben,
                  lohnen sich diese Fragen:
                </p>
                <dl className="border-foreground border-t">
                  <Pruefpunkt
                    weg="Baukasten"
                    text="Was kostet der Tarif nach dem Aktionszeitraum, und wie lange ist die Mindestlaufzeit? Zeigt der Gratistarif Werbung? Lässt sich die Seite bei einem Wechsel mitnehmen?"
                    link={{
                      href: "/journal/was-wir-an-wix-migrationen-lernen",
                      label: "Was beim Umzug von Wix Arbeit macht",
                    }}
                  />
                  <Pruefpunkt
                    weg="WordPress"
                    text="Wer spielt Updates für WordPress, Theme und Erweiterungen ein? Wie oft gibt es Backups, und wie spielen Sie eines zurück? Stehen die Server in der EU?"
                  />
                  <Pruefpunkt
                    weg="Selbst programmieren"
                    text="Wie kommen Nachrichten aus dem Formular bei Ihnen an, und was hält Spam ab? Haben Sie die Seite auf mehreren Handys getestet? Wer bemerkt es, wenn sie nicht erreichbar ist?"
                  />
                  <Pruefpunkt
                    weg="Erstellen lassen"
                    text="Ist der Preis ein Festpreis oder eine Schätzung? Wem gehören Domain und Inhalte? Was kosten Pflege und kleine Änderungen im Monat?"
                    link={{
                      href: "/website-kosten#checkliste",
                      label: "Sechs Fragen an jedes Angebot",
                    }}
                  />
                </dl>
              </Schritt>

              <Schritt
                nr={5}
                id="recht"
                titel="Impressum, Datenschutzerklärung und Cookie-Hinweis"
                kurz="Pflicht für jede geschäftliche Seite, auch für eine kleine."
              >
                <p>
                  <strong className="text-foreground font-semibold">
                    Impressum.
                  </strong>{" "}
                  Jede geschäftliche Webseite braucht eines (§&nbsp;5 DDG).
                  Hinein gehören Name und Rechtsform, die ladungsfähige
                  Anschrift (eine Postfachadresse reicht nicht), Wege zur
                  schnellen Kontaktaufnahme, mindestens eine E-Mail-Adresse, bei
                  GmbH, UG oder Verein die vertretungsberechtigte Person, dazu
                  gegebenenfalls Handelsregister und Registernummer, die
                  Umsatzsteuer-Identifikationsnummer, falls Sie eine haben, bei
                  erlaubnispflichtigen Tätigkeiten die zuständige
                  Aufsichtsbehörde und bei reglementierten Berufen Kammer und
                  Berufsbezeichnung. Das Impressum muss leicht erkennbar und
                  unmittelbar erreichbar sein; am sichersten verlinken Sie es
                  auf jeder Seite, etwa in der Fußzeile.
                </p>
                <p>
                  <strong className="text-foreground font-semibold">
                    Datenschutzerklärung.
                  </strong>{" "}
                  Sie beschreibt nach Art.&nbsp;13 DSGVO, welche Daten die Seite
                  verarbeitet, wofür und auf welcher Rechtsgrundlage, welche
                  Dienste beteiligt sind (Hosting, Kontaktformular, Karten,
                  Schriften, Statistik) und welche Rechte Besucher haben, etwa
                  auf Auskunft und Löschung. Kommt später ein Dienst dazu, wird
                  die Erklärung ergänzt.
                </p>
                <p>
                  <strong className="text-foreground font-semibold">
                    Cookie-Hinweis.
                  </strong>{" "}
                  Eine Einwilligung (§&nbsp;25 TDDDG) brauchen Sie nur für
                  Cookies und Zugriffe, die technisch nicht notwendig sind, vor
                  allem für Tracking und Werbung. Eingebettete Karten und Videos
                  laden am besten erst nach einem Klick. Ohne Tracking und mit
                  solchen Karten braucht eine Seite in der Regel keinen
                  Cookie-Banner.
                </p>
                <p>
                  <strong className="text-foreground font-semibold">
                    Barrierefreiheit und Preise.
                  </strong>{" "}
                  Seit dem 28.&nbsp;Juni 2025 gilt das
                  Barrierefreiheits&shy;stärkungsgesetz (BFSG) für bestimmte
                  Angebote an Verbraucher, vor allem, wenn über die Seite ein
                  Vertrag geschlossen wird, etwa in einem Onlineshop.
                  Kleinstunternehmen, die Dienstleistungen anbieten, sind
                  ausgenommen; das sind Betriebe mit weniger als zehn
                  Beschäftigten und höchstens zwei Millionen Euro Jahresumsatz
                  oder Bilanzsumme. Prüfen Sie, ob es Sie betrifft. Preise für
                  Privatkunden nennen Sie als Endpreise, so wie sie tatsächlich
                  zu zahlen sind.
                </p>
                <div className="border-foreground bg-card border-l-[3px] px-5 py-4">
                  <p className="label-mono text-muted-foreground text-[11px]">
                    Kein Rechtsrat
                  </p>
                  <p className="text-foreground mt-2 text-[15px] leading-relaxed">
                    Diese Übersicht ersetzt keine Prüfung im Einzelfall.
                    Rechtstexte bekommen Sie von einer Anwältin, Ihrem Verband
                    oder einem Generator.
                  </p>
                </div>
                <Weiter
                  links={[
                    { href: "/lexikon#impressum", label: "Impressumspflicht" },
                    { href: "/lexikon#dsgvo", label: "DSGVO" },
                    { href: "/lexikon#cookie-banner", label: "Cookie-Banner" },
                    {
                      href: "/lexikon#barrierefreiheit",
                      label: "Barrierefreiheit",
                    },
                    {
                      href: "https://www.gesetze-im-internet.de/ddg/__5.html",
                      label: "§ 5 DDG im Wortlaut",
                      extern: true,
                    },
                  ]}
                />
              </Schritt>

              <Schritt
                nr={6}
                id="google"
                titel="Für Google einrichten"
                kurz="Grundlagen, die jede Seite braucht, und das Unternehmensprofil."
              >
                <p>
                  Geben Sie jeder Seite einen eigenen Titel und eine
                  Beschreibung; beides erscheint in den Suchergebnissen. Wenn
                  Sie für einzelne Leistungen bei Google gefunden werden wollen,
                  bekommt jede davon eine eigene Unterseite; auf einer einzelnen
                  Seite steht jede Leistung mit eigener Zwischenüberschrift. Der
                  Ort, an dem Sie arbeiten, steht im Text, nicht nur im
                  Impressum. Auf dem Handy muss die Seite schnell laden.
                </p>
                <p>
                  Richten Sie die Google Search Console ein, das kostenlose
                  Werkzeug, in dem Google zeigt, wie Ihre Seite gefunden wird,
                  und reichen Sie dort die Sitemap ein. Für lokale Betriebe
                  gehört das kostenlose Google-Unternehmensprofil dazu: mit
                  passender Kategorie, Einzugsgebiet, denselben Öffnungszeiten
                  wie auf der Seite und eigenen Fotos. Bitten Sie zufriedene
                  Kunden um eine echte Bewertung, kaufen Sie nie welche.
                </p>
                <p>
                  Platz eins kann niemand garantieren. Gute Grundlagen sorgen
                  dafür, dass Google versteht, was Sie anbieten und wo.
                </p>
                <Weiter
                  links={[
                    { href: "/check", label: "Ladezeit Ihrer Seite testen" },
                    {
                      href: "/lexikon#google-business-profil",
                      label: "Google-Unternehmensprofil",
                    },
                    { href: "/lexikon#seo", label: "SEO in Alltagsdeutsch" },
                  ]}
                />
              </Schritt>

              <Schritt
                nr={7}
                id="pflege"
                titel="Starten und pflegen"
                kurz="Vor dem Start prüfen, danach aktuell halten."
              >
                <p>
                  Vor dem Start öffnen Sie die Seite auf Ihrem eigenen Handy,
                  schicken eine Testnachricht über das Formular und klicken
                  jeden Link einmal an. Erst dann geben Sie die Adresse weiter.
                </p>
                <p>
                  Danach halten Sie Öffnungszeiten und Preise aktuell, spielen
                  bei WordPress Updates ein und prüfen die Backups. Sobald ein
                  neuer Dienst dazukommt, etwa eine Terminbuchung, passen Sie
                  die Datenschutzerklärung an. Und behalten Sie im Blick, wann
                  sich die Domain verlängert.
                </p>
                <Weiter
                  links={[
                    {
                      href: "/audit",
                      label: "Kostenlose Durchsicht Ihrer fertigen Seite",
                    },
                  ]}
                />
              </Schritt>
            </ol>
          </div>
        </section>

        {/* Kosten und Zeitaufwand */}
        <section
          id="kosten"
          className="bg-card border-foreground scroll-mt-24 border-t"
          aria-labelledby="kosten-titel"
        >
          <div className={INNER}>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 id="kosten-titel" className={`${H2} lg:col-span-7`}>
                Kosten und Zeitaufwand
              </h2>
              <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
                Selbst gebaut ist eine Webseite günstig, solange Sie Ihre Zeit
                nicht mitrechnen.
              </p>
            </div>

            <h3 className="mt-12 text-[1.4rem] leading-tight tracking-[-0.015em] lg:mt-14">
              Was der Selbstbau kostet
            </h3>

            {/* Eine Struktur für alle Breiten: ab md drei Spalten mit Kopfzeile. */}
            <div
              aria-hidden="true"
              className={`border-foreground mt-5 hidden border-t-[3px] py-3 md:grid ${POSTEN_SPALTEN}`}
            >
              {["Posten", "Richtwert", "Hinweis"].map((h) => (
                <span
                  key={h}
                  className="label-mono text-muted-foreground text-[11px]"
                >
                  {h}
                </span>
              ))}
            </div>
            <dl className="border-foreground mt-5 border-t-[3px] md:mt-0 md:border-t-0">
              {POSTEN.map((p) => (
                <div
                  key={p.posten}
                  className={`border-border border-b py-4 md:grid md:border-t md:border-b-0 ${POSTEN_SPALTEN}`}
                >
                  <dt className="text-[16px] font-semibold md:text-[15px]">
                    {p.posten}
                  </dt>
                  <dd className="mt-1 text-[15px] md:mt-0">{p.richtwert}</dd>
                  <dd className="text-muted-foreground mt-1.5 text-[14.5px] leading-relaxed md:mt-0 md:text-[15px]">
                    {p.hinweis}
                  </dd>
                </div>
              ))}
            </dl>

            {BAUKASTEN_PREISE.some((p) => p.betrag && p.beleg) ? (
              <p className="text-muted-foreground mt-5 max-w-3xl text-[13px] leading-relaxed">
                {BAUKASTEN_PREISE.filter((p) => p.betrag && p.beleg)
                  .map((p) => `${p.anbieter}: ${p.beleg}.`)
                  .join(" ")}{" "}
                Tarife ändern sich, maßgeblich ist die Preisseite des Anbieters.
              </p>
            ) : null}

            <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-8">
              <div id="dauer" className="scroll-mt-24">
                <h3 className="text-[1.4rem] leading-tight tracking-[-0.015em]">
                  Wie lange es dauert
                </h3>
                <dl className="border-foreground mt-5 grid grid-cols-2 border-t">
                  <div className="border-border border-r py-5 pr-4">
                    <dt className="label-mono text-muted-foreground text-[11px]">
                      Baukasten
                    </dt>
                    <dd className="serif mt-2 text-[1.55rem] leading-none tracking-[-0.02em] whitespace-nowrap sm:text-[1.9rem]">
                      10–40 Std.
                    </dd>
                    <dd className="text-muted-foreground mt-2 text-[13.5px] leading-snug">
                      Aufbau, danach 1–3 Std. im Monat
                    </dd>
                  </div>
                  <div className="py-5 pl-5">
                    <dt className="label-mono text-muted-foreground text-[11px]">
                      Selbst programmiert
                    </dt>
                    <dd className="serif mt-2 text-[1.55rem] leading-none tracking-[-0.02em] whitespace-nowrap sm:text-[1.9rem]">
                      30–80 Std.
                    </dd>
                    <dd className="text-muted-foreground mt-2 text-[13.5px] leading-snug">
                      mit Einarbeitung
                    </dd>
                  </div>
                </dl>
                <div className="text-foreground/85 border-border mt-0 space-y-4 border-t pt-5 text-[15.5px] leading-relaxed">
                  <p>
                    Beides ist unsere Einschätzung für eine einfache Seite. Für
                    WordPress nennen wir keine Zahl, das hängt zu sehr von Theme
                    und Erweiterungen ab. Den größten Teil der Zeit kosten auf
                    jedem Weg die Texte und Fotos.
                  </p>
                  <p>
                    Wenn Sie die Seite erstellen lassen, hängt die Dauer vom
                    Umfang ab. Fragen Sie nach einem Termin, gezählt ab
                    vollständigen Unterlagen.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-[1.4rem] leading-tight tracking-[-0.015em]">
                  Wenn Sie die Webseite erstellen lassen
                </h3>
                <div className="text-foreground/85 border-foreground mt-5 space-y-4 border-t pt-5 text-[15.5px] leading-relaxed">
                  <p>
                    Dann zahlen Sie statt mit Abenden mit Geld: einmalig für den
                    Bau und meist monatlich für Hosting und Pflege. Was
                    Freelancer, Agenturen und Büros dafür verlangen und wovon
                    der Preis abhängt, steht im Preis-Ratgeber.
                  </p>
                  <Link href="/website-kosten" className={TEXTLINK}>
                    Was es kostet, eine Website erstellen zu lassen {ARROW}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Checkliste wie ein Zettel */}
        <section
          id="checkliste"
          className="border-border scroll-mt-24 border-t"
          aria-labelledby="checkliste-titel"
        >
          <div className={`${INNER} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
            <div className="lg:col-span-4">
              <h2 id="checkliste-titel" className={H2}>
                Checkliste vor dem Start
              </h2>
              <p className="text-muted-foreground mt-5 text-[15.5px] leading-relaxed">
                Gehen Sie die Liste durch, bevor Sie die Adresse weitergeben.
                Sie gilt für jeden Weg, auch wenn jemand anderes die Seite baut.
              </p>
            </div>
            <div className="bg-card border-border border px-5 py-6 shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)] sm:px-9 sm:py-9 lg:col-span-8">
              <p className="label-mono text-muted-foreground flex flex-wrap justify-between gap-x-4 gap-y-1">
                <span>Vor dem Start</span>
                <span>Webseite ________</span>
              </p>
              <ul className="mt-5 grid sm:grid-cols-2 sm:gap-x-8">
                {CHECKLISTE.map((c) => (
                  <li
                    key={c}
                    className="border-border flex gap-4 border-b py-3.5 text-[15.5px] leading-snug"
                  >
                    <span
                      aria-hidden="true"
                      className="border-foreground mt-0.5 inline-block h-[18px] w-[18px] shrink-0 rounded-[2px] border-[1.5px]"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fragen offen gesetzt */}
        <section
          id="fragen"
          className="bg-card border-border scroll-mt-24 border-t"
          aria-labelledby="fragen-titel"
        >
          <div className={`${INNER} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
            <div className="lg:col-span-4">
              <h2 id="fragen-titel" className={H2}>
                Häufige Fragen zum Erstellen einer Webseite
              </h2>
            </div>
            <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
              {FAQ.map((f) => (
                <div key={f.q} className="border-foreground border-t pt-5">
                  <dt className="text-[17.5px] leading-snug font-semibold tracking-[-0.01em]">
                    {f.q}
                  </dt>
                  <dd className="text-muted-foreground mt-3 text-[15.5px] leading-relaxed">
                    {f.a}
                    {f.link ? (
                      <>
                        {" "}
                        <Link href={f.link.href} className={INLINE}>
                          {f.link.label}
                        </Link>
                      </>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Sitalo, dezent und erst am Ende */}
        <section
          id="sitalo"
          className="border-foreground scroll-mt-24 border-t"
          aria-labelledby="sitalo-titel"
        >
          <div className={`${INNER} grid gap-12 lg:grid-cols-12 lg:gap-8`}>
            <div className="min-w-0 lg:col-span-7">
              <h2 id="sitalo-titel" className={H2}>
                Wann Sie uns brauchen und wann nicht
              </h2>
              <div className="text-foreground/85 mt-6 max-w-2xl space-y-4 text-[16.5px] leading-[1.7]">
                <p>
                  Wenn Sie keine Abende für die eigene Seite frei haben oder die
                  Seite Anfragen bringen soll und Sie Technik und Pflege lieber
                  abgeben, bauen wir sie für Sie. Sie schicken Stichpunkte und
                  Fotos, wir schreiben die Texte, gestalten und bauen die Seite
                  und kümmern uns danach um Hosting und Updates. Den Festpreis
                  bekommen Sie schriftlich, bevor wir anfangen.
                </p>
                <p>
                  Wenn ein Baukasten für Sie reicht, sagen wir Ihnen das im
                  Gespräch.
                </p>
              </div>

              {STARTER && BUSINESS ? (
                <PaketZeilen pakete={[STARTER, BUSINESS]} />
              ) : null}
              <p className="text-muted-foreground mt-4 text-[13.5px] leading-relaxed">
                {PREIS_HINWEIS} Dauer ab vollständigen Unterlagen. Dazu kommt
                ein Monatsbeitrag {STARTER_MONTHLY} für Hosting, Updates und
                kleine Änderungen; er hat sechs Monate Mindestlaufzeit und ist
                danach monatlich kündbar.{" "}
                <Link href="/pakete" className={INLINE}>
                  Alle vier Pakete
                </Link>
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href="/website-erstellen-lassen"
                  className="btn-line h-auto min-h-12 py-3 text-left text-[15px] whitespace-normal"
                >
                  Webseite erstellen lassen: Festpreis und Ablauf {ARROW}
                </Link>
                <p className="text-[15px]">
                  <a
                    href="tel:+491607621876"
                    className="font-semibold whitespace-nowrap underline-offset-4 hover:underline"
                  >
                    0160&nbsp;7621876
                  </a>
                  <span className="text-muted-foreground">
                    {" "}
                    · Antwort meist am selben Werktag
                  </span>
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-[15px]">
                <li>
                  <Link href="/sprechstunde" className={INLINE}>
                    Offene Telefonsprechstunde, auch wenn Sie selbst bauen
                  </Link>
                </li>
                <li>
                  <Link href="/audit" className={INLINE}>
                    Kostenlose Durchsicht Ihrer Seite
                  </Link>
                </li>
              </ul>
            </div>

            <nav
              aria-labelledby="weiterlesen-titel"
              className="min-w-0 lg:col-span-4 lg:col-start-9"
            >
              <p
                id="weiterlesen-titel"
                className="label-mono text-muted-foreground"
              >
                Weiterlesen
              </p>
              <ul className="border-foreground mt-4 border-t">
                {WEITERLESEN.map((w) => (
                  <li key={w.href} className="border-border border-b">
                    <Link
                      href={w.href}
                      className="group flex items-start justify-between gap-4 py-3.5 text-[15px] leading-snug"
                    >
                      <span className="group-hover:underline group-hover:underline-offset-4">
                        {w.label}
                      </span>
                      <ArrowRight
                        className="text-muted-foreground mt-[3px] h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Bausteine
 * ---------------------------------------------------------------- */

/** Ein Schritt der Anleitung: Nummer und Titel links, Inhalt rechts. */
function Schritt({
  nr,
  id,
  titel,
  kurz,
  children,
}: {
  nr: number;
  id: string;
  titel: string;
  kurz: string;
  children: React.ReactNode;
}) {
  return (
    <li
      id={id}
      className="border-border first:border-foreground grid scroll-mt-24 gap-5 border-t py-9 first:border-t-[3px] lg:grid-cols-12 lg:gap-8 lg:py-12"
    >
      <div className="lg:col-span-4">
        <h3 className="text-[1.45rem] leading-[1.12] tracking-[-0.018em] text-balance sm:text-[1.65rem]">
          <span className="text-gold">{nr}.</span> {titel}
        </h3>
        <p className="text-muted-foreground mt-2.5 max-w-xs text-[15px] leading-snug">
          {kurz}
        </p>
      </div>
      <div className="text-foreground/85 max-w-2xl min-w-0 space-y-5 text-[16.5px] leading-[1.7] lg:col-span-8">
        {children}
      </div>
    </li>
  );
}

/** Weiterführende Links unter einem Schritt. */
function Weiter({
  links,
}: {
  links: { href: string; label: string; extern?: boolean }[];
}) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[14.5px]">
      {links.map((l) => (
        <li key={l.href}>
          {l.extern ? (
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${TEXTLINK} text-[14.5px]`}
            >
              {l.label}
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(öffnet in neuem Fenster)</span>
            </a>
          ) : (
            <Link href={l.href} className={`${TEXTLINK} text-[14.5px]`}>
              {l.label} {ARROW}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Prüfpunkte je Weg in Schritt 4. */
function Pruefpunkt({
  weg,
  text,
  link,
}: {
  weg: string;
  text: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="border-border grid gap-1.5 border-b py-4 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-5">
      <dt className="label-mono text-muted-foreground pt-[4px] text-[11px]">
        {weg}
      </dt>
      <dd className="text-[15.5px] leading-relaxed">
        {text}
        {link ? (
          <>
            {" "}
            <Link href={link.href} className={INLINE}>
              {link.label}
            </Link>
          </>
        ) : null}
      </dd>
    </div>
  );
}

/** Starter und Business als kurze Preiszeilen, Werte aus lib/pakete-data.ts. */
function PaketZeilen({ pakete }: { pakete: Paket[] }) {
  return (
    <ul className="border-foreground mt-8 max-w-2xl border-t">
      {pakete.map((p) => (
        <li key={p.slug} className="border-border border-b">
          <Link
            href={`/pakete/${p.slug}`}
            className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-4"
          >
            <span className="text-[17px] font-semibold group-hover:underline group-hover:underline-offset-4">
              {p.name}
              <span className="text-muted-foreground ml-2 text-[14px] font-normal">
                {p.slug === "starter" ? "eine Seite" : "mehrere Seiten"}
              </span>
            </span>
            <span className="serif text-[1.35rem] leading-none whitespace-nowrap">
              {p.setup}
            </span>
            <span className="text-muted-foreground col-span-2 text-[14px]">
              Dauer bis online: {p.dauer}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
