import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { ABLAUF_HALTE, type AblaufHalt } from "@/lib/ablauf-data";
import { ANGEBOT_CHECKLISTE } from "@/lib/angebot-checkliste";
import { BRANCHEN, getBrancheBySlug, type Branche } from "@/lib/branchen-data";
import { BRANCHEN_SEO, erstellenLassenZiel } from "@/lib/branchen-seo";
import {
  PAKETE,
  PREIS_HINWEIS,
  PREIS_HINWEIS_KURZ,
  getPaketBySlug,
  nachDauer,
  type Paket,
} from "@/lib/pakete-data";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/**
 * Geldseite für „Website erstellen lassen", „Webseite erstellen lassen"
 * und „Homepage erstellen lassen" (bundesweit, auch mit „Festpreis" und
 * „für kleine Unternehmen"). Eine Seite für alle Schreibweisen: Title
 * „Website …", Beschreibung „Webseite …", Fragen „Homepage …".
 *
 * Abgrenzung, damit sich die Seiten keine Konkurrenz machen:
 *  - Marktpreise und „Was kostet eine Website?" stehen auf /website-kosten.
 *    Hier stehen nur die eigenen Festpreise.
 *  - Selbstbau („Webseite erstellen" ohne „lassen") steht im Ratgeber
 *    /webseite-erstellen. Links dorthin tragen nie „erstellen lassen".
 *  - Die Startseite führt „Webdesign Hamburg" im Titel.
 *
 * Alle Preise, Dauern, Änderungen pro Monat und Grenzen kommen aus
 * lib/pakete-data.ts, die Halte des Ablaufs aus lib/ablauf-data.ts.
 *
 * Rhythmus: Preisliste mit Monatsbeitrag als Tabelle, Leistungen als
 * Fließtext, „Für wen" zweispaltig, Ablauf dunkel, Wege als Verzeichnis
 * mit Vergleichstabelle, Seitenpläne nach Branche, Zusagen als
 * Haarlinien-Liste, Hamburg-Zeile, Fragen offen, Abschluss dunkel.
 */

const TITLE = "Website erstellen lassen ab 499 € | Festpreis · Sitalo";
// Google-Grundlagen gibt es erst ab Business, deshalb hier nicht neben „ab 499 €".
const DESCRIPTION =
  "Webseite erstellen lassen zum Festpreis ab 499\u00A0€ zzgl. USt.: für Ihren Betrieb gestaltet, fürs Handy gebaut, Test-Link vor dem Start. Betreut aus Hamburg.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/website-erstellen-lassen" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/website-erstellen-lassen`,
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const STARTER = PAKETE[0];
const BUSINESS = PAKETE[1];
const PREMIUM = PAKETE[2];
const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;
/** Mindestlaufzeit des Monatsbeitrags (fakten.md Nr. 4, /faq). */
const MINDESTLAUFZEIT = "sechs Monate";
const MINDESTLAUFZEIT_DATIV = "sechs Monaten";

/** „ab 2.499 €" → „2.499 €", „ab 79 € / Monat" → „79 €" */
function betrag(label: string) {
  return label.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");
}

/** „ab 79 € / Monat" → „ab 79 €" */
function monatlich(p: Paket) {
  return p.monthly.replace(/\s*\/\s*Monat$/, "");
}

/** „Sitalo Studio" → „Studio" für enge Tabellenköpfe. */
function kurzName(p: Paket) {
  return p.name.replace(/^Sitalo\s+/, "");
}

/** Kleine Änderungen pro Monat aus „Bis zu N kleine Änderung(en) pro Monat". */
function aenderungen(p: Paket) {
  const hit = p.contents.map((c) => /Bis zu (\d+) kleine Änderung/.exec(c)).find(Boolean);
  return hit ? hit[1] : "–";
}

/** Bevorzugte Bearbeitung steht in pakete-data bei Premium und Studio. */
function bevorzugt(p: Paket) {
  return [...p.contents, ...p.afterLaunch].some((s) => /bevorzugt|Vorrang/i.test(s));
}

const MONATSBEITRAG: { label: string; wert: (p: Paket) => string }[] = [
  { label: "Hosting in der EU, SSL-Zertifikat, Backups und Updates", wert: () => "inklusive" },
  { label: "Kleine Änderungen pro Monat", wert: aenderungen },
  { label: "Bevorzugte Bearbeitung, meist noch am selben Tag", wert: (p) => (bevorzugt(p) ? "ja" : "–") },
  { label: "Monatsbeitrag", wert: monatlich },
];

const TEIL: Record<AblaufHalt["wer"], string> = {
  Sie: "Ihr Teil",
  Wir: "Unser Teil",
  "Sie und wir": "Gemeinsam",
};

const LOHNT: { text: string; link?: { href: string; label: string } }[] = [
  { text: "Sie für die eigene Seite keine freien Abende haben." },
  { text: "über die Seite Anfragen kommen sollen und Sie Technik und Google-Einstellungen lieber abgeben." },
  { text: "sich nach dem Start jemand um Updates, Technik und Änderungen kümmern soll." },
  { text: "Sie den Preis vorab kennen wollen, schriftlich und als Festpreis." },
];

const ANDERER_WEG: { text: string; link?: { href: string; label: string } }[] = [
  {
    text: "eine einfache Visitenkarte reicht und Sie Zeit haben, die Seite mit einem Baukasten selbst zu bauen.",
    link: { href: "/webseite-erstellen", label: "Webseite selbst erstellen: Anleitung in sieben Schritten" },
  },
  {
    text: "Sie vor allem online verkaufen wollen. Shops bauen wir nur im Einzelfall, ein Shopsystem passt dann meist besser.",
  },
  {
    text: "die eigene Seite gerade nicht dran ist, etwa weil das Angebot noch nicht steht oder die Saison läuft.",
    link: { href: "/journal/wann-eine-website-warten-kann", label: "Wann eine Website warten kann" },
  },
];

/** Die Wege am Markt, sachlich und ohne Anbieternamen (UWG § 6). */
const WEGE: {
  name: string;
  bekommen: string;
  achten: string;
  link?: { href: string; label: string };
  sitalo?: boolean;
}[] = [
  {
    name: "Baukasten, selbst gebaut",
    bekommen:
      "Vorlagen, Hosting und einen Editor im Abo. Texte, Bilder, Rechtstexte und die Einstellungen für Google übernehmen Sie selbst.",
    achten: "Was der Tarif nach dem Aktionszeitraum kostet und ob Sie die Seite bei einem Wechsel mitnehmen können.",
    link: { href: "/webseite-erstellen", label: "Webseite selbst erstellen: die Schritte" },
  },
  {
    name: "Designservice eines Baukastens",
    bekommen:
      "Einige Baukasten- und Hosting-Anbieter bauen die Seite gegen Aufpreis für Sie, im eigenen System des Anbieters.",
    achten:
      "Abgerechnet wird meist als Einrichtung plus Monatsbeitrag. Fragen Sie, ob Sie die Seite bei einem Wechsel mitnehmen können.",
  },
  {
    name: "Freelancer",
    bekommen: "Eine Person, die gestaltet und baut, oft mit eigenem Schwerpunkt bei Gestaltung oder Technik.",
    achten: "Wer nach dem Start erreichbar ist und was Updates und kleine Änderungen kosten.",
  },
  {
    name: "Agentur",
    bekommen: "Ein Team für Konzept, Gestaltung und Technik, auch für Shops, Schnittstellen und große Seiten.",
    achten: "Für eine kleine Seite oft mehr, als Sie brauchen. Fragen Sie nach dem Wartungsvertrag und seinen laufenden Kosten.",
  },
  {
    name: "Plattformen und Marktplätze",
    bekommen: "Vermittlung von Einzelpersonen, zum Festpreis oder nach Stunden abgerechnet.",
    achten: "Referenzen mit echten Adressen, und wem Domain und Zugänge nach dem Projekt gehören.",
  },
  {
    name: "Sitalo",
    bekommen: `Gestaltung, Texte aus Ihren Stichpunkten, Bau und Betreuung zum Festpreis ${STARTER.setup}, mit einem Ansprechpartner am Telefon.`,
    achten: "Shops und eigene Apps besprechen wir nur im Einzelfall. Dafür passt ein Shopsystem oder eine Agentur oft besser.",
    sitalo: true,
  },
];

/**
 * Fairer Vergleich: In den ersten beiden Zeilen liegt der Baukasten vorn,
 * bei den Rechtstexten keiner (beide Male beziehen Sie den Text selbst).
 */
const VERGLEICH: { label: string; selbst: string; lassen: string; vorn: "selbst" | "lassen" | null }[] = [
  {
    label: "Kosten für eine sehr einfache Seite",
    selbst: "Günstiger, Sie zahlen nur das Abo des Anbieters",
    lassen: `${STARTER.setup} einmalig, dazu ${monatlich(STARTER)} im Monat, jeweils zzgl. USt.`,
    vorn: "selbst",
  },
  {
    label: "Wann Sie anfangen können",
    selbst: "Sofort, auch am Sonntagabend",
    lassen: `Den Starttermin nennen wir im ersten Gespräch; eine einzelne Seite steht ab vollständigen Unterlagen ${nachDauer(STARTER.dauer)}`,
    vorn: "selbst",
  },
  {
    label: "Zeitaufwand für Sie",
    selbst: "Abende mit Baukasten und Anleitungen",
    lassen: "Ein Gespräch und Ihre Unterlagen",
    vorn: "lassen",
  },
  {
    label: "Gestaltung",
    selbst: "Eine Vorlage des Anbieters, die Sie anpassen",
    lassen: "Für Ihren Betrieb gestaltet, mit Ihrem Logo, Ihren Farben und Fotos",
    vorn: "lassen",
  },
  {
    label: "Google und Technik",
    selbst: "Richten Sie selbst ein",
    lassen: "Technik richten wir ein, die Grundlagen für Google ab Business",
    vorn: "lassen",
  },
  {
    label: "Impressum und Datenschutz",
    selbst: "Seiten anlegen und Rechtstext beziehen Sie selbst",
    lassen: "Wir legen die Seiten an und nennen Ihnen alle Dienste für die Datenschutzerklärung; den Rechtstext beziehen Sie selbst",
    vorn: null,
  },
  {
    label: "Wenn etwas hakt",
    selbst: "Support des Anbieters",
    lassen: "Ein Anruf bei uns",
    vorn: "lassen",
  },
];

/** Drei Branchen mit Seitenplan; die übrigen stehen im Register darunter. */
const BEISPIELE = ["handwerker", "pflege", "gastro"]
  .map((slug) => getBrancheBySlug(slug))
  .filter((b): b is Branche => Boolean(b));

const ZUSAGEN: { titel: string; text: string }[] = [
  {
    titel: "Festpreis, schriftlich",
    text: "Den Preis bekommen Sie schriftlich, bevor wir anfangen. Kommt später etwas dazu, sprechen wir vorher darüber.",
  },
  {
    titel: "Test-Link vor dem Start",
    text: "Sie sehen die fertige Seite unter einer Testadresse, bevor sie online geht. Eine Korrekturrunde ist im Preis, bei Studio sind es bis zu drei.",
  },
  {
    titel: "Die Seite gehört Ihnen",
    text: "Domain, Inhalte und Quellcode gehören Ihnen. Wechseln Sie später den Anbieter, übergeben wir alles.",
  },
  {
    titel: "Hosting in der EU",
    text: "Ihre Seite liegt auf einem Server in der EU, mit SSL-Zertifikat und automatischen Backups.",
  },
  {
    titel: "Eine Nummer, ein Ansprechpartner",
    text: "Sie erreichen uns direkt unter 0160 7621876, vor dem Auftrag und nach dem Start. Auf Mails und Anfragen antworten wir meist am selben Werktag.",
  },
];

const ZUSAGEN_LINKS: { href: string; label: string }[] = [
  { href: "/atelier", label: "Wer hinter Sitalo steht" },
  { href: "/honorar", label: "Unser Stundensatz, offen vorgerechnet" },
  { href: "/erreichbarkeit", label: "Wann wir erreichbar sind" },
  { href: "/audit", label: "Kostenlose Durchsicht Ihrer jetzigen Seite" },
  { href: "/sprechstunde", label: "Telefonsprechstunde" },
  { href: "/website-kosten#checkliste", label: "Die Checkliste für andere Angebote" },
];

const FAQ: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "Was kostet eine Website bei Sitalo?",
    a: `${STARTER.setup.replace(/^ab/, "Ab")} einmalig für eine Onepage-Website, ${BUSINESS.setup} für eine mehrseitige Website. Dazu kommt ein Monatsbeitrag ${monatlich(STARTER)} für Hosting, Updates und kleine Änderungen. Alle Preise zzgl. USt.; unser Angebot richtet sich an Betriebe und Selbstständige. Den genauen Festpreis bekommen Sie vor Auftrag schriftlich.`,
    link: { href: "/website-kosten", label: "Was Websites allgemein kosten" },
  },
  {
    q: "Wie lange dauert es, bis meine Website online ist?",
    a: `Das hängt vom Paket ab und zählt ab vollständigen Unterlagen: ${PAKETE.map((p) => `${kurzName(p)} ${p.dauer}`).join(", ")}. Den genauen Termin nennen wir Ihnen vorab.`,
  },
  {
    q: "Website, Webseite oder Homepage: Gibt es einen Unterschied?",
    a: "Im Alltag meinen alle drei dasselbe: den Auftritt Ihres Betriebs im Internet. Ob Sie eine Website, eine Webseite oder eine Homepage erstellen lassen möchten, der Ablauf und die Preise bei uns sind gleich.",
  },
  {
    q: "Was muss ich selbst liefern?",
    a: "Ihr Logo, ein paar Bilder (Handy-Fotos reichen) und Stichpunkte zu Ihren Leistungen. Die Texte formulieren wir daraus, Sie lesen gegen. Fehlt etwas, helfen wir.",
  },
  {
    q: "Arbeiten Sie nur in Hamburg?",
    a: "Nein. Wir sitzen in Hamburg und betreuen Betriebe in ganz Deutschland, per Telefon, Video und E-Mail. In Hamburg treffen wir uns auf Wunsch auch persönlich.",
  },
  {
    q: "Gehört die Website danach mir?",
    a: "Ja. Die Domain läuft auf Ihren Namen, Inhalte und Quellcode gehören Ihnen. Wechseln Sie später den Anbieter, übergeben wir alles, was zur Seite gehört.",
  },
  {
    q: "Kann ich später selbst Inhalte ändern?",
    a: `Kleine Änderungen erledigen wir für Sie, eine kurze Nachricht genügt. Bereiche, die Sie selbst pflegen, etwa Speisekarte, Öffnungszeiten oder Angebote, gehören zum Paket ${PREMIUM.name} (${PREMIUM.setup}). Ein späterer Wechsel dorthin ist möglich, neu gebaut wird Ihre Seite dafür nicht.`,
  },
  {
    q: "Warum nicht einfach einen Baukasten wie Wix oder Jimdo nehmen?",
    a: `Für eine sehr einfache Seite reicht ein Baukasten oft, und er ist günstiger. Soll die Seite Anfragen bringen, kommt es auf Ladezeit, Google und einen kurzen Weg zum Formular an. Das richten wir von Anfang an ein, die Grundlagen für Google ab dem Paket ${BUSINESS.name}, und Sie verbringen keine Abende damit. Wie Sie selbst vorgehen, steht in unserer Anleitung.`,
    link: { href: "/webseite-erstellen", label: "Webseite selbst erstellen: Anleitung" },
  },
  {
    q: "Kann ich meine bestehende Domain behalten?",
    a: "Ja. Die Domain bleibt in Ihrem Konto, etwa bei IONOS, Strato oder GoDaddy, und wir richten sie auf unseren Server. Wenn Sie wollen, ziehen wir sie auch zu unserem Anbieter um; eingetragen bleibt sie auf Ihren Namen. Was mit vorhandenen E-Mail-Postfächern passiert, klären wir vor der Umstellung mit Ihnen.",
  },
  {
    q: `Was passiert nach den ${MINDESTLAUFZEIT_DATIV} Mindestlaufzeit?`,
    a: "Der Monatsbeitrag läuft weiter wie vereinbart und ist ab dann zum Monatsende kündbar. Kündigen Sie, übergeben wir Ihnen die Seite, die Inhalte und den Zugang zur Domain.",
  },
  {
    q: "Ziehen Sie meine Wix- oder Jimdo-Seite um?",
    a: "Ja. Vorher sichern wir alle Bilder der alten Seite, einen Teil der Texte schreiben wir neu. Alte Adressen leiten wir per 301-Weiterleitung auf die passenden neuen Seiten um und prüfen danach in der Google Search Console, ob Google alles findet. Die Gestaltung aus dem Baukasten lässt sich meist nicht mitnehmen, die Seite bauen wir deshalb neu.",
    link: { href: "/journal/was-wir-an-wix-migrationen-lernen", label: "Was beim Umzug von Wix Arbeit macht" },
  },
  {
    q: "Wer liefert Impressum und Datenschutzerklärung?",
    a: "Die Seiten legen wir technisch an. Den rechtlich geprüften Text beziehen Sie aus einer geeigneten Quelle, etwa einem Generator, einer Anwältin oder Ihrem Verband. Wir nennen Ihnen dafür alle Dienste, die auf Ihrer Seite laufen, etwa Hosting, Kontaktformular und Karte.",
  },
];

const SPRUNGMARKEN: { href: string; label: string }[] = [
  { href: "#kosten", label: "Preise" },
  { href: "#fuer-wen", label: "Für wen" },
  { href: "#ablauf", label: "Ablauf" },
  { href: "#wege", label: "Wege im Vergleich" },
  { href: "#beispiele", label: "Branchen" },
  { href: "#zusagen", label: "Zusagen" },
  { href: "#fragen", label: "Fragen" },
];

export default function WebsiteErstellenLassenPage() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Website erstellen lassen",
      serviceType: "Webdesign",
      description: DESCRIPTION,
      url: `${SITE_URL}/website-erstellen-lassen`,
      // Das Unternehmen selbst beschreibt das Root-Layout (ProfessionalService).
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: { "@type": "Country", name: "Deutschland" },
      offers: PAKETE.map((p) => ({
        "@type": "Offer",
        name: `Website ${p.name}`,
        url: `${SITE_URL}/pakete/${p.slug}`,
        priceCurrency: "EUR",
        // „ab"-Preise zzgl. MwSt., deshalb Mindestpreis statt Festbetrag.
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: Number(p.setup.replace(/\D/g, "")),
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
        },
      })),
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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Website erstellen lassen",
          item: `${SITE_URL}/website-erstellen-lassen`,
        },
      ],
    },
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Website erstellen lassen"
          eyebrow="Webdesign zum Festpreis"
          title={`Website erstellen lassen zum Festpreis ${STARTER.setup}`}
          meta={<HeroMeta />}
        >
          Sie schicken uns Stichpunkte und Handyfotos, wir schreiben die Texte, gestalten und bauen Ihre Website und
          halten sie danach aktuell. Eine einzelne Seite kostet {STARTER.setup} einmalig und steht{" "}
          {nachDauer(STARTER.dauer)}, mehrere Seiten {BUSINESS.setup} {nachDauer(BUSINESS.dauer)}, jeweils ab
          vollständigen Unterlagen. Dazu kommt ein Monatsbeitrag {monatlich(STARTER)} für Hosting, Updates und kleine
          Änderungen.
        </PageHero>

        <Kosten />
        <Leistungen />
        <FuerWen />
        <Ablauf />
        <Wege />
        <Beispiele />
        <Zusagen />
        <Hamburg />
        <Fragen />
        <Abschluss />
      </main>
      <MarketingFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}

const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";
const H2 = "text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]";
const H3 = "text-balance text-[1.4rem] leading-[1.1] tracking-[-0.02em] sm:text-[1.6rem]";
/** Textlink mit Pfeil. inline-block statt inline-flex, damit der Pfeil bei
 *  Umbruch hinter dem letzten Wort steht und nicht am rechten Rand. Inhalt
 *  über <MitPfeil>, damit der Pfeil nie allein in einer Zeile landet. */
const TEXTLINK =
  "inline-block text-[15px] font-semibold underline-offset-4 hover:underline [&_svg]:ml-1.5 [&_svg]:inline [&_svg]:align-[-3px]";
const INLINELINK =
  "text-foreground font-semibold underline decoration-[var(--border)] underline-offset-4 hover:decoration-current";

/* ------------------------------------------------------------------
 * Kopf: Zusagen in einer Zeile, Kontakt, Sprungmarken.
 * ---------------------------------------------------------------- */
function HeroMeta() {
  return (
    <div className="space-y-7 pt-2">
      <p className="text-stahl-hell -mt-2 text-[13.5px] leading-relaxed">{PREIS_HINWEIS_KURZ}</p>
      {/* Jede Zusage mit eigenem Marker statt Trennpunkt: bricht die Zeile um,
          beginnt sie nie mit einem „·". Mobil untereinander. */}
      <ul className="label-mono text-stahl-hell grid gap-y-1.5 text-[11px] leading-relaxed sm:flex sm:flex-wrap sm:gap-x-6">
        {["Festpreis schriftlich vor Start", "Test-Link vor Freigabe", "Hosting in der EU", "Antwort meist am selben Werktag"].map(
          (z) => (
            <li key={z} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="bg-gold inline-block h-[5px] w-[5px] shrink-0" />
              {z}
            </li>
          ),
        )}
      </ul>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Link href="/anfrage" className="btn-signal">
          Anfrage schreiben {ARROW}
        </Link>
        <a
          href="tel:+491607621876"
          className="text-background text-[15.5px] font-semibold underline-offset-[6px] hover:underline"
        >
          0160&nbsp;7621876
        </a>
      </div>
      <nav aria-label="Auf dieser Seite" className="border-background/15 border-t pt-5">
        <p className="label-mono text-stahl-hell text-[11px]">Auf dieser Seite</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12.5px]">
          {SPRUNGMARKEN.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                className="text-background/85 hover:text-background underline decoration-background/30 underline-offset-4 hover:decoration-current"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Preise und Dauer: Preisliste je Paket, darunter der Monatsbeitrag.
 * ---------------------------------------------------------------- */
function Kosten() {
  const kopf = "label-mono text-[11px]";
  return (
    <section id="kosten" className="scroll-mt-20">
      <div className={INNER}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className={`${H2} lg:col-span-6`}>Preise und Dauer je Paket</h2>
          <p className="text-muted-foreground text-[15.5px] leading-relaxed lg:col-span-5 lg:col-start-8">
            Sie zahlen die Erstellung einmal, dazu einen Monatsbeitrag für Hosting, Updates und kleine Änderungen. Den
            Festpreis bekommen Sie schriftlich, bevor wir anfangen.
          </p>
        </div>

        <div className="mt-10 lg:mt-12">
          <div className="border-foreground text-muted-foreground hidden grid-cols-[10rem_minmax(0,1fr)_9.5rem_7.5rem_7rem] gap-x-8 border-b-[1.5px] pb-3 lg:grid">
            <span className={kopf}>Paket</span>
            <span className={kopf}>Für wen</span>
            <span className={kopf}>Online in</span>
            <span className={`${kopf} text-right`}>Einmalig</span>
            <span className={`${kopf} text-right`}>Monatlich</span>
          </div>
          <ul className="border-foreground border-t-[1.5px] lg:border-t-0">
            {PAKETE.map((p) => (
              <li key={p.slug} className="group border-border relative border-b">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-2 py-5 lg:grid-cols-[10rem_minmax(0,1fr)_9.5rem_7.5rem_7rem] lg:gap-x-8">
                  <Link
                    href={`/pakete/${p.slug}`}
                    className="text-[18px] font-semibold tracking-[-0.01em] underline-offset-4 group-hover:underline after:absolute after:inset-0"
                  >
                    {p.name}
                  </Link>
                  <span className="col-start-2 row-start-1 text-right lg:col-start-4">
                    <span className="text-muted-foreground mr-1.5 text-[13px]">ab</span>
                    <span className="serif text-[1.6rem] leading-none tracking-[-0.02em] whitespace-nowrap">
                      {betrag(p.setup)}
                    </span>
                  </span>
                  <div className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
                    <p className="text-muted-foreground text-[14.5px] leading-snug">{p.description}</p>
                    {p.limits.length > 0 ? (
                      <p className="text-muted-foreground/90 mt-2 text-[13px] leading-snug">
                        <span className="label-mono mr-2 text-[10px]">Nicht enthalten</span>
                        {p.limits.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <span className="row-start-3 text-[14px] lg:col-start-3 lg:row-start-1">
                    <span className="text-muted-foreground lg:hidden">Online </span>
                    {p.dauer}
                  </span>
                  <span className="text-muted-foreground col-start-2 row-start-3 text-right text-[13.5px] lg:col-start-5 lg:row-start-1">
                    <span className="lg:hidden">monatlich </span>ab{" "}
                    <span className="serif text-foreground text-[1.05rem]">{betrag(p.monthly)}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-5 max-w-3xl text-[14px] leading-relaxed">
            {PREIS_HINWEIS} Die Dauer zählt ab vollständigen Unterlagen, also Stichpunkten und Fotos. Der Monatsbeitrag
            hat {MINDESTLAUFZEIT} Mindestlaufzeit und ist danach zum Monatsende kündbar.
          </p>
        </div>

        {/* Monatsbeitrag */}
        <div className="border-border mt-14 grid gap-8 border-t pt-10 lg:mt-16 lg:grid-cols-12 lg:gap-8 lg:pt-12">
          <div className="lg:col-span-4">
            <h3 className={H3}>Was der Monatsbeitrag enthält</h3>
            <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
              Als kleine Änderung zählt, was wir in 15 bis 30 Minuten erledigen: einen Text anpassen, ein Bild tauschen
              oder Öffnungszeiten ändern. Größeres besprechen wir vorher und nennen Ihnen den Preis.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-8">
            {/* Eine Struktur für alle Breiten (keine Tabelle plus Mobil-Kopie):
                ab sm stehen die Paketnamen als Kopfzeile, mobil über jedem Wert. */}
            <div
              aria-hidden="true"
              className="border-foreground hidden grid-cols-[minmax(0,1fr)_repeat(4,5.75rem)] border-b-[1.5px] py-3 sm:grid"
            >
              <span />
              {PAKETE.map((p) => (
                <span key={p.slug} className="label-mono text-muted-foreground px-2 text-right text-[11px]">
                  {kurzName(p)}
                </span>
              ))}
            </div>
            <dl className="border-foreground border-t-[1.5px] sm:border-t-0">
              {MONATSBEITRAG.map((row) => (
                <div
                  key={row.label}
                  className="border-border grid gap-y-2.5 border-b py-4 sm:grid-cols-[minmax(0,1fr)_repeat(4,5.75rem)] sm:items-start sm:py-3.5"
                >
                  <dt className="text-[15px] leading-snug font-semibold sm:pr-4 sm:text-[14.5px] sm:font-medium">
                    {row.label}
                  </dt>
                  <dd className="grid grid-cols-4 gap-2 sm:col-span-4 sm:gap-0">
                    {PAKETE.map((p) => (
                      <span key={p.slug} className="min-w-0 sm:px-2 sm:text-right">
                        <span className="label-mono text-muted-foreground block text-[9.5px] sm:sr-only">
                          {kurzName(p)}
                        </span>
                        <span className="mt-0.5 block text-[14px] tabular-nums sm:mt-0 sm:text-[14.5px] sm:whitespace-nowrap">
                          {row.wert(p)}
                        </span>
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
              <li>
                <Link href="/pakete" className={TEXTLINK}>
                  <MitPfeil>Pakete im Vergleich</MitPfeil>
                </Link>
              </li>
              <li>
                <Link href="/rechner" className={TEXTLINK}>
                  <MitPfeil>Gesamtkosten über drei Jahre berechnen</MitPfeil>
                </Link>
              </li>
              <li>
                <Link href="/honorar" className={TEXTLINK}>
                  <MitPfeil>Wie sich der Preis zusammensetzt</MitPfeil>
                </Link>
              </li>
              <li>
                <Link href="/website-kosten" className={TEXTLINK}>
                  <MitPfeil>Was Websites allgemein kosten</MitPfeil>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Leistungen als Fließtext.
 * ---------------------------------------------------------------- */
function Leistungen() {
  return (
    <section id="leistungen" className="bg-card border-foreground scroll-mt-20 border-t">
      <div className={`${INNER} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-4">
          <p className="label-mono text-muted-foreground">Leistungen</p>
          <h2 className={`${H2} mt-4`}>Was zu jeder Website von uns gehört</h2>
          <Link href="/leistungen" className={`${TEXTLINK} mt-6`}>
            <MitPfeil>Leistungsverzeichnis</MitPfeil>
          </Link>
        </div>
        <div className="text-foreground/85 max-w-2xl space-y-5 text-[16.5px] leading-[1.7] lg:col-span-7 lg:col-start-6">
          <p>
            <strong className="text-foreground font-semibold">Gestaltung und Bau.</strong> Wir gestalten die Seite für
            Ihren Betrieb und bauen sie direkt im Code, ohne Baukasten. Vor dem Start prüfen wir sie auf echten Handys und
            nicht nur am großen Bildschirm.
          </p>
          <p>
            <strong className="text-foreground font-semibold">Texte.</strong> Sie schicken Stichpunkte, wir machen klare
            Sätze daraus. Sie lesen gegen, ändern, was nicht stimmt, und geben frei.
          </p>
          <p>
            <strong className="text-foreground font-semibold">Anfragen.</strong> Was jemand ins Kontaktformular tippt,
            kommt direkt in Ihrem Postfach an. Auf dem Handy reicht ein Tipp auf die Telefonnummer.
          </p>
          <p>
            <strong className="text-foreground font-semibold">Google und Pflichtseiten.</strong> Ab dem Business-Paket
            richten wir Titel, Beschreibungen, Sitemap und Ihr Google-Unternehmensprofil ein. Impressum und Datenschutz
            legen wir in jedem Paket an; den geprüften Rechtstext beziehen Sie, wir sagen Ihnen, woher.
          </p>
          <p>
            <strong className="text-foreground font-semibold">Nach dem Start.</strong> Hosting auf einem Server in der EU,
            SSL-Zertifikat und Domain richten wir ein und halten alles aktuell. Kleine Änderungen sind im Monatsbeitrag
            enthalten: Sie schreiben uns eine Mail, wir setzen sie um.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Für wen: zwei Spalten mit Haarlinien, auch mit den Fällen, in denen
 * ein anderer Weg besser passt.
 * ---------------------------------------------------------------- */
function FuerWen() {
  return (
    <section id="fuer-wen" className="border-foreground scroll-mt-20 border-t">
      <div className={INNER}>
        <h2 className={`${H2} max-w-3xl`}>Für wen es sich lohnt, eine Webseite erstellen zu lassen</h2>
        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-10 lg:mt-12">
          <ListeSpalte titel="Es lohnt sich, wenn …" eintraege={LOHNT} />
          <ListeSpalte titel="Ein anderer Weg passt besser, wenn …" eintraege={ANDERER_WEG} gedaempft />
        </div>
      </div>
    </section>
  );
}

function ListeSpalte({
  titel,
  eintraege,
  gedaempft = false,
}: {
  titel: string;
  eintraege: { text: string; link?: { href: string; label: string } }[];
  gedaempft?: boolean;
}) {
  return (
    <div>
      <h3 className="text-[1.25rem] leading-tight tracking-[-0.015em]">{titel}</h3>
      <ul className={`mt-5 border-t-[1.5px] ${gedaempft ? "border-border" : "border-foreground"}`}>
        {eintraege.map((e) => (
          <li key={e.text} className="border-border border-b py-4 text-[16px] leading-relaxed">
            <span className="text-muted-foreground" aria-hidden="true">
              …{" "}
            </span>
            {e.text}
            {e.link ? (
              <>
                {" "}
                <Link href={e.link.href} className={`${INLINELINK} inline-flex items-center gap-1 text-[15px]`}>
                  {e.link.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Ablauf auf dunkler Fläche: sechs Halte, nur Titel, wer dran ist und
 * Hinweis. Die Fließtexte stehen auf /ablauf.
 * ---------------------------------------------------------------- */
function Ablauf() {
  const last = ABLAUF_HALTE.length - 1;
  return (
    <section id="ablauf" className="grain bg-foreground text-background scroll-mt-20">
      <div className={INNER}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className={`${H2} max-w-2xl`}>Von der ersten Nachricht bis zum Start</h2>
          <Link href="/ablauf" className={`${TEXTLINK} text-background`}>
            <MitPfeil>Ablauf im Detail</MitPfeil>
          </Link>
        </div>
        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {ABLAUF_HALTE.map((h, i) => (
            <li key={h.number} className="border-background/25 border-t pt-5">
              <p className="label-mono text-gold">
                {i === last ? "Endhalt" : `Halt ${i + 1}`} · {TEIL[h.wer]}
              </p>
              <h3 className="mt-2 text-[1.3rem] leading-tight tracking-[-0.015em]">{h.title}</h3>
              <p className="text-stahl-hell mt-2 text-[15px] leading-relaxed">{h.hinweis}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Wege am Markt als Verzeichnis, dann Monatsmodell und der Vergleich
 * mit dem Baukasten Zeile für Zeile.
 * ---------------------------------------------------------------- */
function Wege() {
  return (
    <section id="wege" className="border-foreground scroll-mt-20 border-t">
      <div className={INNER}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className={`${H2} lg:col-span-7`}>Baukasten, Designservice, Freelancer, Agentur: die Wege im Vergleich</h2>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-muted-foreground text-[15.5px] leading-relaxed">
              Jeder Weg hat Fälle, in denen er passt. Was die Wege am Markt kosten, steht im Kosten-Ratgeber.
            </p>
            <Link href="/website-kosten" className={`${TEXTLINK} mt-4`}>
              <MitPfeil>Was die Wege kosten: Marktpreise im Überblick</MitPfeil>
            </Link>
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          <div className="border-foreground text-muted-foreground hidden grid-cols-[13rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 border-b-[1.5px] pb-3 lg:grid">
            <span className="label-mono text-[11px]">Weg</span>
            <span className="label-mono text-[11px]">Was Sie bekommen</span>
            <span className="label-mono text-[11px]">Worauf Sie achten</span>
          </div>
          <dl className="border-foreground border-t-[1.5px] lg:border-t-0">
            {WEGE.map((w) => (
              <div
                key={w.name}
                className={`border-border grid gap-x-8 gap-y-2 border-b py-5 lg:grid-cols-[13rem_minmax(0,1fr)_minmax(0,1fr)] ${
                  w.sitalo ? "bg-card -mx-5 px-5 sm:-mx-6 sm:px-6" : ""
                }`}
              >
                <dt className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">{w.name}</dt>
                <dd className="text-[15px] leading-relaxed">
                  <span className="label-mono text-muted-foreground mr-2 text-[10px] lg:hidden">Sie bekommen</span>
                  {w.bekommen}
                  {w.link ? (
                    <>
                      {" "}
                      <Link href={w.link.href} className={`${INLINELINK} inline-flex items-center gap-1`}>
                        {w.link.label}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </>
                  ) : null}
                </dd>
                <dd className="text-muted-foreground text-[15px] leading-relaxed">
                  <span className="label-mono mr-2 text-[10px] lg:hidden">Darauf achten</span>
                  {w.achten}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Einmalpreis oder Monatsmodell */}
        <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <h3 className={`${H3} lg:col-span-4`}>Einmalpreis oder Monatsmodell</h3>
          <div className="text-foreground/85 max-w-2xl space-y-4 text-[16px] leading-[1.7] lg:col-span-7 lg:col-start-6">
            <p>
              Bei uns zahlen Sie die Erstellung einmal und danach einen Monatsbeitrag für Hosting, Updates und kleine
              Änderungen. Nach {MINDESTLAUFZEIT_DATIV} ist der Beitrag zum Monatsende kündbar. Kündigen Sie, übergeben wir
              Ihnen die Seite, die Inhalte, den Quellcode und den Zugang zur Domain.
            </p>
            <p>
              Manche Anbieter rechnen ganz im Monatsmodell ab, mit niedrigem oder ohne Einmalpreis. Das kann passen. Fragen
              Sie bei jedem Monatsmodell, was nach einer Kündigung mit Seite, Inhalten und Domain passiert.
            </p>
          </div>
        </div>

        {/* Baukasten oder erstellen lassen, Zeile für Zeile */}
        <div className="border-border mt-14 border-t pt-10 lg:mt-16 lg:pt-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h3 className={`${H3} lg:col-span-7`}>Baukasten oder erstellen lassen, Zeile für Zeile</h3>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Für eine sehr einfache Seite ist ein Baukasten günstiger. Die übrigen Zeilen zeigen, wofür Sie bei uns
                bezahlen.
              </p>
              <Link href="/vergleich" className={`${TEXTLINK} mt-4`}>
                <MitPfeil>Wix, Jimdo und Squarespace im Einzelnen</MitPfeil>
              </Link>
            </div>
          </div>

          {/* Eine Struktur für alle Breiten: ab md drei Spalten mit Kopfzeile,
              mobil je Zeile ein Block mit „Baukasten" und „Sitalo" davor. */}
          <div
            aria-hidden="true"
            className="border-foreground mt-8 hidden grid-cols-[28%_minmax(0,1fr)_minmax(0,1fr)] gap-x-6 border-b-[1.5px] py-3 md:grid lg:mt-10"
          >
            <span />
            <span className="label-mono text-muted-foreground text-[11px]">Mit Baukasten selbst</span>
            <span className="label-mono text-[11px]">Mit Sitalo erstellen lassen</span>
          </div>
          <dl className="border-foreground mt-8 border-t-[1.5px] md:mt-0 md:border-t-0">
            {VERGLEICH.map((v) => (
              <div
                key={v.label}
                className="border-border grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 border-b py-4 text-[14.5px] leading-snug md:grid-cols-[28%_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-6 md:text-[15px] md:leading-normal"
              >
                <dt className="col-span-2 text-[16px] font-semibold md:col-span-1 md:text-[15px]">{v.label}</dt>
                <dd className="contents">
                  <span className="label-mono text-muted-foreground pt-[2px] text-[10.5px] md:sr-only">Baukasten</span>
                  <span className={v.vorn === "lassen" ? "text-muted-foreground" : "text-foreground"}>
                    {v.selbst}
                    {v.vorn === "selbst" ? <Vorn /> : null}
                  </span>
                </dd>
                <dd className="contents">
                  <span className="label-mono text-muted-foreground pt-[2px] text-[10.5px] md:sr-only">Sitalo</span>
                  <span className={v.vorn === "selbst" ? "text-muted-foreground" : "text-foreground"}>
                    {v.lassen}
                    {v.vorn === "lassen" ? <Vorn /> : null}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Branchen: drei Seitenpläne als Beispiel, darunter das Register.
 * ---------------------------------------------------------------- */
function Beispiele() {
  return (
    <section id="beispiele" className="bg-card border-border scroll-mt-20 border-t">
      <div className={INNER}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className={`${H2} lg:col-span-7`}>Seitenpläne und Musterseiten nach Branche</h2>
          <p className="text-muted-foreground text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
            Was auf die Seite gehört, hängt vom Betrieb ab. Hier drei Seitenpläne als Beispiel. Jede Branchenseite zeigt
            dazu eine Musterseite, die Betriebe darauf sind frei erfunden.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-12">
          {BEISPIELE.map((b) => {
            const [root, ...pages] = b.typicalPages;
            const paket = getPaketBySlug(b.recommendedPackage);
            // Pflege und Praxis haben eigene Landingpages, die „erstellen lassen" führen.
            const ziel = erstellenLassenZiel(b.slug, b.label);
            return (
              <article key={b.slug} className="border-foreground flex flex-col border-t-2 pt-5">
                <p className="label-mono text-muted-foreground text-[11px]">Seitenplan</p>
                <h3 className="mt-2 text-[1.35rem] leading-tight tracking-[-0.015em]">{b.label}</h3>
                <p className="mt-5 flex items-center gap-3 text-[15px] font-semibold">
                  <span aria-hidden="true" className="bg-foreground inline-block h-[9px] w-[9px] shrink-0" />
                  {root}
                </p>
                <ul className="border-foreground/35 mt-1 ml-[4px] border-l">
                  {pages.map((page) => (
                    <li
                      key={page}
                      className="before:bg-foreground/35 last:after:bg-card relative py-1.5 pl-5 text-[14.5px] leading-snug before:absolute before:top-[16px] before:left-0 before:h-px before:w-3.5 last:after:absolute last:after:top-[17px] last:after:bottom-0 last:after:-left-px last:after:w-px"
                    >
                      {page}
                    </li>
                  ))}
                </ul>
                {paket ? (
                  <p className="text-muted-foreground mt-5 text-[14px] leading-relaxed">
                    Meist empfohlen: {paket.name}, {paket.setup}
                  </p>
                ) : null}
                <Link href={ziel.href} className={`${TEXTLINK} mt-3`}>
                  <MitPfeil>{ziel.label}</MitPfeil>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="border-border mt-14 grid gap-6 border-t pt-8 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <p className="label-mono text-muted-foreground lg:col-span-3 lg:pt-3">Alle Branchen</p>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
            {BRANCHEN.map((b) => {
              const landing = BRANCHEN_SEO[b.slug]?.landing;
              return (
              <li key={b.slug} className="border-border border-t">
                <Link
                  href={landing?.href ?? `/branchen/${b.slug}`}
                  className="group flex items-center justify-between gap-4 py-3 text-[15px]"
                >
                  <span className="group-hover:underline group-hover:underline-offset-4">
                    {landing?.label ?? `Website für ${b.label}`}
                  </span>
                  <ArrowRight
                    className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              );
            })}
            <li className="border-border border-t">
              <Link href="/branchen" className="group flex items-center justify-between gap-4 py-3 text-[15px] font-semibold">
                <span className="group-hover:underline group-hover:underline-offset-4">Branchen im Überblick</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Zusagen: was schriftlich gilt, mit Belegen zum Nachlesen.
 * ---------------------------------------------------------------- */
function Zusagen() {
  return (
    <section id="zusagen" className="border-border scroll-mt-20 border-t">
      <div className={`${INNER} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-4">
          <h2 className={H2}>Woran Sie uns festhalten können</h2>
          <p className="text-muted-foreground mt-5 text-[15.5px] leading-relaxed">
            Diese Punkte gelten für jedes Paket. Wie wir arbeiten und rechnen, können Sie auf den verlinkten Seiten nachlesen.
          </p>
        </div>
        <div className="lg:col-span-8">
          <dl className="border-foreground border-t-[1.5px]">
            {ZUSAGEN.map((z) => (
              <div key={z.titel} className="border-border grid gap-1.5 border-b py-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8">
                <dt className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">{z.titel}</dt>
                <dd className="text-muted-foreground text-[15.5px] leading-relaxed">{z.text}</dd>
              </div>
            ))}
          </dl>

          {/* Die Checkliste aus /website-kosten, für uns selbst beantwortet (lib/angebot-checkliste.ts). */}
          <div className="mt-12">
            <h3 className="text-[1.25rem] leading-tight tracking-[-0.015em]">
              Die sechs Fragen an jedes Angebot, für uns beantwortet
            </h3>
            <ol className="border-foreground mt-5 border-t-[1.5px]">
              {ANGEBOT_CHECKLISTE.map((c, i) => (
                <li
                  key={c.frage}
                  className="border-border grid gap-1.5 border-b py-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-x-4"
                >
                  <span className="label-mono text-muted-foreground pt-[3px] text-[11px]" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15.5px] leading-snug font-semibold">{c.frage}</p>
                    <p className="text-muted-foreground mt-1.5 text-[15px] leading-relaxed">{c.sitalo}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
            {ZUSAGEN_LINKS.map((l) => (
              <li key={l.href} className="border-border border-b">
                <Link href={l.href} className="group flex items-center justify-between gap-4 py-3 text-[15px]">
                  <span className="group-hover:underline group-hover:underline-offset-4">{l.label}</span>
                  <ArrowRight className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Hamburg und bundesweit: kurze Zeile mit Verweis auf die Stadtteile.
 * ---------------------------------------------------------------- */
function Hamburg() {
  return (
    <section className="bg-card border-border border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 className="text-balance text-[1.6rem] leading-[1.1] tracking-[-0.02em] sm:text-[2rem] lg:col-span-7">
          In Hamburg persönlich, in ganz Deutschland per Telefon und Video
        </h2>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-muted-foreground text-[15.5px] leading-relaxed">
            Wir sitzen in Hamburg und treffen uns hier auf Wunsch persönlich, etwa zum ersten Gespräch. Betriebe in ganz
            Deutschland betreuen wir am Telefon, per Video und per E-Mail, mit demselben Festpreis und demselben Ablauf.
          </p>
          <Link href="/standorte" className={`${TEXTLINK} mt-4`}>
            <MitPfeil>Webdesign in Hamburgs Stadtteilen</MitPfeil>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Fragen offen gesetzt.
 * ---------------------------------------------------------------- */
function Fragen() {
  return (
    <section id="fragen" className="border-foreground scroll-mt-20 border-t">
      <div className={`${INNER} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-4">
          <h2 className={H2}>Häufige Fragen, bevor Sie eine Homepage erstellen lassen</h2>
          <Link href="/faq" className={`${TEXTLINK} mt-6`}>
            <MitPfeil>Alle Fragen</MitPfeil>
          </Link>
        </div>
        <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-8">
          {FAQ.map((f) => (
            <div key={f.q} className="border-foreground border-t pt-5">
              <dt className="text-[17.5px] leading-snug font-semibold tracking-[-0.01em]">{f.q}</dt>
              <dd className="text-muted-foreground mt-3 text-[15.5px] leading-relaxed">
                {f.a}
                {f.link ? (
                  <>
                    {" "}
                    <Link href={f.link.href} className={`${INLINELINK} inline-flex items-center gap-1`}>
                      {f.link.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
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
            Den Festpreis nennen wir Ihnen nach einem kurzen Gespräch.
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
            Wer lieber schreibt, schickt eine Mail oder die Anfrage. Wir antworten meist am selben Werktag.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold">
            {CONTACT_EMAIL}
          </a>
          <div className="mt-7">
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben {ARROW}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Linktext mit Pfeil: letztes Wort und Pfeil bleiben in einer Zeile. */
function MitPfeil({ children }: { children: string }) {
  const i = children.lastIndexOf(" ");
  return (
    <>
      {i > 0 ? children.slice(0, i + 1) : null}
      <span className="whitespace-nowrap">
        {children.slice(i + 1)}
        {ARROW}
      </span>
    </>
  );
}

/** Kleine Markierung für die Spalte, die in einer Zeile vorn liegt. */
function Vorn() {
  return <span className="label-mono text-gold ml-2 inline-block text-[10px] whitespace-nowrap">Vorteil</span>;
}
