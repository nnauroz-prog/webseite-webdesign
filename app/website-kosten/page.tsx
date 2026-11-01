import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { ANGEBOT_CHECKLISTE } from "@/lib/angebot-checkliste";
import { formatDate } from "@/lib/journal-data";
import { PAKETE, PREIS_HINWEIS, getPaketBySlug, nachDauer, type Paket } from "@/lib/pakete-data";
import { SEITEN_STAND } from "@/lib/seiten-stand";
import { SITE_URL } from "@/lib/site";

/**
 * Ratgeber für die Suchanfragen „Was kostet eine Website",
 * „Website Kosten", „Homepage erstellen lassen Kosten". Informations-
 * Suche, die direkt vor einer Beauftragung steht — führt am Ende auf
 * unsere Pakete und die Anfrage.
 *
 * Marktspannen sind als unsere Einschätzung gekennzeichnet, nicht als
 * Statistik. Keine Fremdpreise einzelner Anbieter (lib/fremdpreise.ts).
 * Eigene Preise kommen aus lib/pakete-data.ts, die sechs Fragen aus
 * lib/angebot-checkliste.ts.
 *
 * Abgrenzung: Die Geldseite /website-erstellen-lassen zeigt nur die
 * eigenen Festpreise; die Marktspannen stehen ausschließlich hier. Der
 * Ratgeber /webseite-erstellen behandelt die Kosten des Selbstbaus und
 * verlinkt für das Erstellenlassen hierher.
 */

const TITLE = "Was kostet eine Website? Preise und laufende Kosten";
const DESCRIPTION =
  "Was es kostet, eine Website erstellen zu lassen: Baukasten, Freelancer und Agentur im Vergleich, laufende Kosten und sechs Fragen an jedes Angebot.";
/** Erstveröffentlichung und letzte inhaltliche Überarbeitung (ISO), lib/seiten-stand.ts.
 *  Speist die sichtbare Zeile im Kopf, das Article-Schema und die Sitemap. */
const { veroeffentlicht: VEROEFFENTLICHT, stand: STAND } = SEITEN_STAND["/website-kosten"];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · Sitalo` },
  description: DESCRIPTION,
  alternates: { canonical: "/website-kosten" },
  // Ein eigenes openGraph ersetzt das aus dem Layout, deshalb siteName und locale hier mit.
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/website-kosten`,
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    publishedTime: VEROEFFENTLICHT,
    modifiedTime: STAND,
  },
};

const STARTER = getPaketBySlug("starter");
const BUSINESS = getPaketBySlug("business") as Paket;
const PREMIUM = getPaketBySlug("premium") as Paket;
const STARTER_SETUP = STARTER?.setup ?? "ab 499\u00A0€";
/** „ab 49 € / Monat" → „ab 49 €" */
const STARTER_MONTHLY = (STARTER?.monthly ?? "ab 49\u00A0€ / Monat").replace(/\s*\/\s*Monat$/, "");

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** Was im Paket steckt, in einem Satz. Angaben aus lib/pakete-data.ts. */
const PAKET_KURZ: Record<Paket["slug"], string> = {
  starter: "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten.",
  business: "Bis zu fünf Unterseiten mit Team, Leistungen und Galerie. Ihre Fotos bereiten wir mit auf.",
  premium: "Eine eigene Struktur für Ihren Betrieb. Auf Wunsch pflegen Sie Speisekarte, Angebote oder Termine selbst.",
  studio: "Eigene Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden und ein Treffen vor Ort.",
};

type Verweis = { href: string; label: string };

const WEGE: { name: string; einmalig: string; laufend: string; passt: string; link?: Verweis }[] = [
  {
    name: "Baukasten selbst",
    einmalig: "0\u00A0€",
    laufend: "Abo je nach Tarif",
    passt: "Wenn Sie Zeit haben und Gestaltung, Texte, Technik und Rechtliches selbst übernehmen.",
    link: { href: "/webseite-erstellen", label: "Webseite selbst erstellen: was dazugehört" },
  },
  {
    name: "Freelancer",
    einmalig: "ca. 800–5.000\u00A0€",
    laufend: "oft nach Aufwand",
    passt: "Wenn Sie jemanden finden, der auch nach dem Start verlässlich erreichbar bleibt.",
  },
  {
    name: "Agentur",
    einmalig: "ab ca. 5.000\u00A0€",
    laufend: "Wartungsvertrag, oft 100–500\u00A0€ / Monat",
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

/** Die sechs Fragen, gemeinsam mit /website-erstellen-lassen (dort für uns beantwortet). */
const CHECKLISTE = ANGEBOT_CHECKLISTE.map((c) => c.frage);

/**
 * Laufende Posten einer Website. Richtwerte nur, wo sie allgemein gelten
 * und mit dem Ratgeber /webseite-erstellen übereinstimmen; sonst ohne Zahl.
 */
const LAUFEND: { posten: string; richtwert: string; hinweis: string }[] = [
  {
    posten: "Domain (.de)",
    richtwert: "meist unter 20\u00A0€ im Jahr",
    hinweis: "Läuft immer auf Ihren Namen. Prüfen Sie den Preis ab dem zweiten Jahr, im ersten ist sie oft im Tarif enthalten.",
  },
  {
    posten: "Hosting",
    richtwert: "ab wenigen Euro im Monat",
    hinweis: "Der Speicherplatz für Ihre Seite. Achten Sie auf Server in der EU und automatische Backups.",
  },
  {
    posten: "SSL-Zertifikat",
    richtwert: "meist im Hosting enthalten",
    hinweis: "Sorgt für das Schloss in der Adresszeile. Extra kosten sollte es für eine einfache Seite nichts.",
  },
  {
    posten: "E-Mail-Postfach",
    richtwert: "im Tarif oder extra",
    hinweis: "Adressen wie info@ihr-betrieb.de. Ob das Postfach im Tarif steckt, ist je nach Anbieter verschieden.",
  },
  {
    posten: "Updates und Wartung",
    richtwert: "Ihre Zeit oder ein Monatsbeitrag",
    hinweis: "Bei WordPress und eigenem Code fallen Updates und Backups regelmäßig an. Beim Baukasten übernimmt der Anbieter die Technik.",
  },
  {
    posten: "Änderungen",
    richtwert: "im Beitrag oder nach Aufwand",
    hinweis: "Neue Öffnungszeiten, ein anderes Foto, eine neue Leistung. Fragen Sie, wie viele Änderungen im Monat enthalten sind.",
  },
  {
    posten: "Rechtstexte",
    richtwert: "kostenlos bis Abo",
    hinweis: "Generatoren gibt es teils kostenlos, sonst als Abo, über Ihren Verband oder eine Anwältin.",
  },
  {
    posten: "Erweiterungen",
    richtwert: "oft eigene Abos",
    hinweis: "Terminbuchung, Newsletter oder Bezahlfunktionen laufen häufig über eigene Anbieter mit Monats- oder Jahrespreis.",
  },
];

/** Was eine Website nach Umfang braucht, mit unserem Paket als Beispiel. */
const UMFANG: { titel: string; text: string; paket?: Paket; hinweis: string }[] = [
  {
    titel: "Eine einzelne Seite",
    text: "Leistungen, Öffnungszeiten, Anfahrt und Kontakt auf einer Seite, die man von oben nach unten liest. Passt für Selbstständige und kleine Betriebe mit wenigen Leistungen.",
    paket: STARTER as Paket,
    hinweis: "Fragen Sie, ob Texte und Fotos enthalten sind oder ob Sie alles fertig liefern müssen.",
  },
  {
    titel: "Mehrere Seiten, etwa fünf",
    text: "Eigene Seiten für Leistungen, Team, Referenzen oder Galerie und Kontakt. Jede Seite bekommt einen eigenen Titel für Google, damit Sie für einzelne Leistungen gefunden werden.",
    paket: BUSINESS,
    hinweis: "Fragen Sie, wie viele Unterseiten im Preis sind und was jede weitere kostet.",
  },
  {
    titel: "Mit Bereichen zum Selbstpflegen oder Online-Buchung",
    text: "Speisekarte, Wochenangebot, Kursplan oder Termine tragen Sie selbst ein. Dafür braucht die Seite eine Anmeldung und Bereiche, die nur Sie ändern können.",
    paket: PREMIUM,
    hinweis: "Fragen Sie, wer die Buchungssoftware stellt und ob dafür ein eigenes Abo anfällt.",
  },
  {
    titel: "Mit Onlineshop",
    text: "Warenkorb, Zahlungsarten, Versandkosten und Widerrufsbelehrung. Dazu kommen meist Gebühren je Zahlung beim Zahlungsanbieter. Shops bauen wir nur im Einzelfall, ein Shopsystem passt dann oft besser.",
    hinweis: "Rechnen Sie die Abo- und Zahlungsgebühren über ein Jahr zusammen, bevor Sie sich entscheiden.",
  },
];

const FAQ = [
  {
    q: "Was kostet eine einfache Website für ein kleines Unternehmen?",
    a: `Eine professionell gebaute Onepage-Website kostet nach unserer Einschätzung je nach Anbieter meist zwischen einigen hundert und wenigen tausend Euro. Bei uns beginnt sie bei ${STARTER_SETUP.replace(/^ab\s*/, "")}, dazu kommt ein Monatsbeitrag ${STARTER_MONTHLY} für Hosting und Pflege, jeweils zzgl. USt.`,
  },
  {
    q: "Welche laufenden Kosten hat eine Website?",
    a: "Domain, Hosting, SSL-Zertifikat, Updates und Sicherheit. Je nach Anbieter zahlen Sie dafür einzeln oder in einem Monatsbeitrag. Dazu kommen Änderungen, wenn sich Öffnungszeiten, Preise oder Angebote ändern, und Abos für Erweiterungen wie eine Terminbuchung. Die Posten im Einzelnen stehen in der Tabelle oben.",
  },
  {
    q: "Ist ein Baukasten nicht günstiger?",
    a: "Auf dem Papier ja. Rechnen Sie aber Ihre eigene Zeit mit ein: Gestaltung, Texte, Technik, Rechtliches und Pflege übernehmen Sie dann selbst. Unser Rechner zeigt den Vergleich über drei Jahre.",
  },
  {
    q: "Warum unterscheiden sich Angebote so stark?",
    a: "Weil sehr Unterschiedliches enthalten ist. Vergleichen Sie Angebote anhand der Checkliste auf dieser Seite. Am meisten verraten der Festpreis, wer die Rechtstexte liefert und die Frage, wem die Seite am Ende gehört.",
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
      datePublished: VEROEFFENTLICHT,
      dateModified: STAND,
      image: `${SITE_URL}/website-kosten/opengraph-image`,
      author: { "@id": `${SITE_URL}/#business` },
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
        <PageHero
          crumb="Website-Kosten"
          eyebrow="Ratgeber · Preise"
          title="Was kostet eine Website?"
          meta={
            <p className="label-mono text-stahl-hell text-[11px]">
              Sitalo Webdesign, Hamburg · zuletzt überarbeitet am{" "}
              <time dateTime={STAND}>{formatDate(STAND)}</time>
            </p>
          }
        >
          Zwischen null Euro und mehreren zehntausend, je nachdem, wer sie baut und was sie können muss. Für kleine
          Betriebe liegt eine professionell gebaute Website nach unserer Einschätzung meist bei einigen hundert bis wenigen
          tausend Euro, dazu kommen laufende Kosten. Hier steht, wovon der Preis abhängt, was jeden Monat anfällt und was
          Sie im Angebot prüfen sollten.
        </PageHero>

        {/* Drei Wege als Tabelle */}
        <section>
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem] lg:col-span-7">
                Baukasten, Freelancer oder Agentur
              </h2>
              <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
                Nach unserer Einschätzung, für kleine Betriebe in Deutschland ohne Shop. Das ist keine Statistik; einzelne
                Angebote können deutlich abweichen.
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
                    <td className="text-muted-foreground py-5">
                      {w.passt}
                      {w.link ? <WegLink link={w.link} /> : null}
                    </td>
                  </tr>
                ))}
                <tr className="border-foreground bg-card border-y-2 align-top">
                  <th scope="row" className="py-5 pr-4 pl-3 text-[16px] font-semibold">
                    Sitalo
                  </th>
                  <td className="py-5 pr-4 font-semibold whitespace-nowrap">{STARTER_SETUP}</td>
                  <td className="py-5 pr-4">{STARTER_MONTHLY} im Monat, mit Hosting und kleinen Änderungen; zzgl. USt.</td>
                  <td className="py-5 pr-3">Sie möchten einen Festpreis vorab und eine Telefonnummer, unter der Sie uns selbst erreichen.</td>
                </tr>
              </tbody>
            </table>

            {/* Mobil: je Weg ein Block */}
            <dl className="border-foreground mt-10 border-t-[3px] sm:hidden">
              {[
                ...WEGE,
                {
                  link: undefined,
                  name: "Sitalo",
                  einmalig: STARTER_SETUP,
                  laufend: `${STARTER_MONTHLY} im Monat, mit Hosting und kleinen Änderungen; zzgl. USt.`,
                  passt: "Sie möchten einen Festpreis vorab und eine Telefonnummer, unter der Sie uns selbst erreichen.",
                },
              ].map((w) => (
                <div key={w.name} className={`border-border border-b py-5 ${w.name === "Sitalo" ? "bg-card -mx-5 px-5" : ""}`}>
                  <dt className="flex items-baseline justify-between gap-4">
                    <span className="text-[17px] font-semibold">{w.name}</span>
                    <span className="text-[15px] font-semibold">{w.einmalig}</span>
                  </dt>
                  <dd className="text-muted-foreground mt-1 text-[14.5px]">Laufend: {w.laufend}</dd>
                  <dd className="mt-2 text-[14.5px] leading-relaxed">
                    {w.passt}
                    {w.link ? <WegLink link={w.link} /> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Laufende Kosten: eine Liste für alle Breiten, ab md drei Spalten */}
        <section id="laufende-kosten" className="border-foreground scroll-mt-20 border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Laufende Kosten im Monat
              </h2>
              <p className="text-muted-foreground mt-5 text-[15.5px] leading-relaxed">
                Auch eine fertige Website kostet jeden Monat etwas, selbst wenn Sie sie selbst gebaut haben. Diese Posten
                kommen zusammen, einzeln bezahlt oder in einem Monatsbeitrag gebündelt.
              </p>
              <p className="text-muted-foreground mt-4 text-[15.5px] leading-relaxed">
                Wenn Sie selbst bauen:{" "}
                <Link href="/webseite-erstellen#kosten" className="text-foreground underline underline-offset-4">
                  was der Selbstbau kostet
                </Link>
                .
              </p>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <div
                aria-hidden="true"
                className="border-foreground hidden grid-cols-[11rem_12rem_minmax(0,1fr)] gap-x-6 border-t-[3px] py-3 md:grid"
              >
                {["Posten", "Richtwert", "Worauf Sie achten"].map((h) => (
                  <span key={h} className="label-mono text-muted-foreground text-[11px]">
                    {h}
                  </span>
                ))}
              </div>
              <dl className="border-foreground border-t-[3px] md:border-t-0">
                {LAUFEND.map((l) => (
                  <div
                    key={l.posten}
                    className="border-border grid gap-1 border-b py-4 md:grid-cols-[11rem_12rem_minmax(0,1fr)] md:gap-x-6 md:border-t md:border-b-0"
                  >
                    <dt className="text-[16px] font-semibold md:text-[15px]">{l.posten}</dt>
                    <dd className="text-[15px]">{l.richtwert}</dd>
                    <dd className="text-muted-foreground text-[14.5px] leading-relaxed md:text-[15px]">{l.hinweis}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-muted-foreground mt-5 text-[14.5px] leading-relaxed">
                Bei uns stecken Hosting in der EU, SSL-Zertifikat, Backups, Updates und kleine Änderungen im
                Monatsbeitrag, {STARTER_MONTHLY} zzgl. USt. Rechtstexte und Abos für Erweiterungen kommen wie überall dazu.
              </p>
            </div>
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

        {/* Nach Umfang: vier Stufen, mit unserem Paket als Beispiel */}
        <section id="umfang" className="border-foreground scroll-mt-20 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem] lg:col-span-7">
                Was eine Website nach Umfang kostet
              </h2>
              <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
                Der größte Hebel beim Preis ist der Umfang. Als Anhaltspunkt steht bei jeder Stufe, was sie bei uns kostet.
                Holen Sie für den Vergleich zwei, drei Angebote ein.
              </p>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:mt-12">
              {UMFANG.map((u) => (
                <article key={u.titel} className="border-foreground border-t-2 pt-5">
                  <h3 className="text-[1.3rem] leading-tight tracking-[-0.015em]">{u.titel}</h3>
                  <p className="text-foreground/85 mt-3 text-[15.5px] leading-relaxed">{u.text}</p>
                  <p className="mt-3 text-[15px] leading-relaxed">
                    <span className="label-mono text-muted-foreground mr-2 text-[10.5px]">Bei uns</span>
                    {u.paket ? (
                      <>
                        <Link
                          href={`/pakete/${u.paket.slug}`}
                          className="font-semibold underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
                        >
                          {u.paket.name}
                        </Link>
                        , {u.paket.setup} einmalig und {u.paket.monthly.replace(/\s*\/\s*Monat$/, "")} im Monat, zzgl.
                        USt.; online {nachDauer(u.paket.dauer)} ab vollständigen Unterlagen.
                      </>
                    ) : (
                      "nur im Einzelfall, den Preis nennen wir nach einem Gespräch."
                    )}
                  </p>
                  <p className="text-muted-foreground mt-2 text-[14.5px] leading-relaxed">{u.hinweis}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Eigene Preise als Preisliste */}
        <section className="border-border border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <h2 className="max-w-2xl text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Was eine Website bei uns kostet
              </h2>
              <ul className="flex flex-wrap gap-x-7 gap-y-3">
                <li>
                  <Link href="/pakete" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
                    Pakete im Vergleich {ARROW}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/website-erstellen-lassen"
                    className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                  >
                    Website erstellen lassen: Leistungen und Ablauf {ARROW}
                  </Link>
                </li>
              </ul>
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
              {PREIS_HINWEIS} Im{" "}
              <Link href="/rechner" className="text-foreground underline underline-offset-4">
                3-Jahres-Rechner
              </Link>{" "}
              sehen Sie die Gesamtkosten neben angenommenen Baukasten-Tarifen, Ihre eigene Arbeitszeit eingerechnet.
            </p>
          </div>
        </section>

        {/* Checkliste wie ein Zettel zum Abhaken. Anker #checkliste wird von
            /website-erstellen-lassen und /webseite-erstellen verlinkt. */}
        <section id="checkliste" className="border-border scroll-mt-20 border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
                Sechs Fragen an jedes Angebot
              </h2>
              <p className="text-muted-foreground mt-5 text-[15.5px] leading-relaxed">
                Legen Sie die Liste neben jedes Angebot, das Sie bekommen. Auch neben unseres:{" "}
                <Link href="/website-erstellen-lassen#zusagen" className="text-foreground underline underline-offset-4">
                  unsere Antworten auf die sechs Fragen
                </Link>
                .
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
                  0160&nbsp;7621876
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

/** Kurzer Verweis hinter einem Tabellen- oder Listeneintrag. */
function WegLink({ link }: { link: Verweis }) {
  return (
    <>
      {" "}
      <Link
        href={link.href}
        className="text-foreground inline-flex items-center gap-1 font-semibold underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
      >
        {link.label}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </>
  );
}
