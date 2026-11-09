import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";
import Link from "next/link";

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
import { ANGEBOT_CHECKLISTE } from "@/lib/angebot-checkliste";
import { formatDate } from "@/lib/journal-data";
import {
  PAKETE,
  PREIS_HINWEIS,
  getPaketBySlug,
  nachDauer,
  type Paket,
} from "@/lib/pakete-data";
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

const TITLE = "Website-Kosten 2026: Was eine Homepage kostet";
const DESCRIPTION =
  "Was kostet es, eine Homepage erstellen zu lassen? Baukasten, Freelancer und Agentur im Vergleich, laufende Kosten und Checkliste. Festpreis bei uns anfragen.";
/** Erstveröffentlichung und letzte inhaltliche Überarbeitung (ISO), lib/seiten-stand.ts.
 *  Speist die sichtbare Zeile im Kopf, das Article-Schema und die Sitemap. */
const { veroeffentlicht: VEROEFFENTLICHT, stand: STAND } =
  SEITEN_STAND["/website-kosten"];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · Sitalo` },
  description: DESCRIPTION,
  alternates: { canonical: "/website-kosten" },
  // Ein eigenes openGraph ersetzt das aus dem Layout, deshalb siteName und locale hier mit.
  openGraph: ogFor("/website-kosten", TITLE, DESCRIPTION, "article", {
    publishedTime: VEROEFFENTLICHT,
    modifiedTime: STAND,
  }),
};

const STARTER = getPaketBySlug("starter");
const BUSINESS = getPaketBySlug("business") as Paket;
const PREMIUM = getPaketBySlug("premium") as Paket;
const STARTER_SETUP = STARTER?.setup ?? "ab 599\u00A0€";
/** „ab 59 € / Monat" → „ab 59 €" */
const STARTER_MONTHLY = (STARTER?.monthly ?? "ab 59\u00A0€ / Monat").replace(
  /\s*\/\s*Monat$/,
  "",
);

/** Was im Paket steckt, in einem Satz. Angaben aus lib/pakete-data.ts. */
const PAKET_KURZ: Record<Paket["slug"], string> = {
  starter:
    "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten.",
  business:
    "Bis zu fünf Unterseiten mit Team, Leistungen und Galerie. Ihre Fotos bereiten wir mit auf.",
  premium:
    "Eine eigene Struktur für Ihren Betrieb. Auf Wunsch pflegen Sie Speisekarte, Angebote oder Termine selbst.",
  studio:
    "Eigene Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden und ein Treffen vor Ort.",
};

type Verweis = { href: string; label: string };

const WEGE: {
  name: string;
  einmalig: string;
  laufend: string;
  passt: string;
  link?: Verweis;
}[] = [
  {
    name: "Baukasten selbst",
    einmalig: "0\u00A0€",
    laufend: "Abo je nach Tarif",
    passt:
      "Wenn Sie Zeit haben und Gestaltung, Texte, Technik und Rechtliches selbst übernehmen.",
    link: {
      href: "/webseite-erstellen",
      label: "Webseite selbst erstellen: was dazugehört",
    },
  },
  {
    name: "Freelancer",
    einmalig: "ca. 800–5.000\u00A0€",
    laufend: "oft nach Aufwand",
    passt:
      "Wenn Sie jemanden finden, der auch nach dem Start verlässlich erreichbar bleibt.",
  },
  {
    name: "Agentur",
    einmalig: "ab ca. 5.000\u00A0€",
    laufend: "Wartungsvertrag, oft 100–500\u00A0€ / Monat",
    passt:
      "Für größere Unternehmen mit Shop, Schnittstellen oder eigener Marketing-Abteilung.",
  },
];

const FAKTOREN = [
  {
    title: "Umfang",
    text: "Eine Seite mit allem Wichtigen ist günstiger als zehn Unterseiten mit Team, Galerie und Leistungen.",
  },
  {
    title: "Texte und Bilder",
    text: "Liegen gute Inhalte vor, geht es schneller. Müssen Texte erst geschrieben werden, steigt der Aufwand.",
  },
  {
    title: "Funktionen",
    text: "Terminbuchung, Bewerbungsformular, mehrere Sprachen oder ein Shop kosten jeweils extra.",
  },
  {
    title: "Gestaltung",
    text: "Eine angepasste Vorlage ist günstiger als eine Gestaltung, die eigens für Ihren Betrieb entworfen wird.",
  },
  {
    title: "Google-Sichtbarkeit",
    text: "Saubere Struktur, Titel, Beschreibungen und lokale Suchbegriffe gehören dazu, werden aber nicht überall mitgeliefert.",
  },
  {
    title: "Betreuung danach",
    text: "Hosting, Updates, Sicherheit und kleine Änderungen fallen jeden Monat an, auch wenn das im Angebot nicht steht.",
  },
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
    hinweis:
      "Läuft immer auf Ihren Namen. Prüfen Sie den Preis ab dem zweiten Jahr, im ersten ist sie oft im Tarif enthalten.",
  },
  {
    posten: "Hosting",
    richtwert: "ab wenigen Euro im Monat",
    hinweis:
      "Der Speicherplatz für Ihre Seite. Achten Sie auf Server in der EU und automatische Backups.",
  },
  {
    posten: "SSL-Zertifikat",
    richtwert: "meist im Hosting enthalten",
    hinweis:
      "Sorgt für das Schloss in der Adresszeile. Extra kosten sollte es für eine einfache Seite nichts.",
  },
  {
    posten: "E-Mail-Postfach",
    richtwert: "im Tarif oder extra",
    hinweis:
      "Adressen wie info@ihr-betrieb.de. Ob das Postfach im Tarif steckt, ist je nach Anbieter verschieden.",
  },
  {
    posten: "Updates und Wartung",
    richtwert: "Ihre Zeit oder ein Monatsbeitrag",
    hinweis:
      "Bei WordPress und eigenem Code fallen Updates und Backups regelmäßig an. Beim Baukasten übernimmt der Anbieter die Technik.",
  },
  {
    posten: "Änderungen",
    richtwert: "im Beitrag oder nach Aufwand",
    hinweis:
      "Neue Öffnungszeiten, ein anderes Foto, eine neue Leistung. Fragen Sie, wie viele Änderungen im Monat enthalten sind.",
  },
  {
    posten: "Rechtstexte",
    richtwert: "kostenlos bis Abo",
    hinweis:
      "Generatoren gibt es teils kostenlos, sonst als Abo, über Ihren Verband oder eine Anwältin.",
  },
  {
    posten: "Erweiterungen",
    richtwert: "oft eigene Abos",
    hinweis:
      "Terminbuchung, Newsletter oder Bezahlfunktionen laufen häufig über eigene Anbieter mit Monats- oder Jahrespreis.",
  },
];

/** Was eine Website nach Umfang braucht, mit unserem Paket als Beispiel. */
const UMFANG: {
  titel: string;
  text: string;
  paket?: Paket;
  hinweis: string;
}[] = [
  {
    titel: "Eine einzelne Seite",
    text: "Leistungen, Öffnungszeiten, Anfahrt und Kontakt auf einer Seite, die man von oben nach unten liest. Passt für Selbstständige und kleine Betriebe mit wenigen Leistungen.",
    paket: STARTER as Paket,
    hinweis:
      "Fragen Sie, ob Texte und Fotos enthalten sind oder ob Sie alles fertig liefern müssen.",
  },
  {
    titel: "Mehrere Seiten, etwa fünf",
    text: "Eigene Seiten für Leistungen, Team, Referenzen oder Galerie und Kontakt. Jede Seite bekommt einen eigenen Titel für Google, damit Sie für einzelne Leistungen gefunden werden.",
    paket: BUSINESS,
    hinweis:
      "Fragen Sie, wie viele Unterseiten im Preis sind und was jede weitere kostet.",
  },
  {
    titel: "Mit Bereichen zum Selbstpflegen oder Online-Buchung",
    text: "Speisekarte, Wochenangebot, Kursplan oder Termine tragen Sie selbst ein. Dafür braucht die Seite eine Anmeldung und Bereiche, die nur Sie ändern können.",
    paket: PREMIUM,
    hinweis:
      "Fragen Sie, wer die Buchungssoftware stellt und ob dafür ein eigenes Abo anfällt.",
  },
  {
    titel: "Mit Onlineshop",
    text: "Warenkorb, Zahlungsarten, Versandkosten und Widerrufsbelehrung. Dazu kommen meist Gebühren je Zahlung beim Zahlungsanbieter. Shops bauen wir nur im Einzelfall, ein Shopsystem passt dann oft besser.",
    hinweis:
      "Rechnen Sie die Abo- und Zahlungsgebühren über ein Jahr zusammen, bevor Sie sich entscheiden.",
  },
];

const FAQ = [
  {
    q: "Was kostet eine einfache Website für ein kleines Unternehmen?",
    a: `Eine professionell gebaute Onepage-Website kostet nach unserer Einschätzung je nach Anbieter meist zwischen einigen hundert und wenigen tausend Euro. Bei uns beginnt sie bei ${STARTER_SETUP.replace(/^ab\s*/, "")}, dazu kommt ein Monatsbeitrag ${STARTER_MONTHLY} für Hosting und Pflege, jeweils inkl. 19\u00A0% MwSt.`,
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
        {
          "@type": "ListItem",
          position: 1,
          name: "Sitalo",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Website-Kosten",
          item: `${SITE_URL}/website-kosten`,
        },
      ],
    },
  ];
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Website-Kosten"
          eyebrow="Ratgeber · Preise"
          titel="Was kostet eine Website?"
          unter="Zwischen null Euro und mehreren zehntausend, je nachdem, wer sie baut und was sie können muss. Für kleine Betriebe liegt eine professionell gebaute Website nach unserer Einschätzung meist bei einigen hundert bis wenigen tausend Euro, dazu kommen laufende Kosten. Hier steht, wovon der Preis abhängt, was jeden Monat anfällt und was Sie im Angebot prüfen sollten."
          aktionen={
            <>
              <Link href="/anfrage" className="btn-signal btn-gross">
                Angebot anfragen
              </Link>
              <MehrLink href="#checkliste" groesse="unter">
                Sechs Fragen an jedes Angebot
              </MehrLink>
            </>
          }
          meta={
            <>
              Sitalo Webdesign, Hamburg · zuletzt überarbeitet am{" "}
              <time dateTime={STAND}>{formatDate(STAND)}</time>
            </>
          }
          bild={
            <FotoRahmen
              vorab
              src="/images/workspace-macbook.webp"
              alt="Hände an einer Laptop-Tastatur, daneben ein Notizbuch mit Stichpunkten und eine Tasse Kaffee"
              aspect="21 / 9"
              aspectMobil="16 / 9"
              position="50% 50%"
            />
          }
          unterschrift="Erst rechnen, dann entscheiden"
        />

        {/* Drei Wege als Tabelle */}
        <Abschnitt
          id="wege"
          fett="Baukasten, Freelancer oder Agentur."
          unter="Nach unserer Einschätzung, für kleine Betriebe in Deutschland ohne Shop. Das ist keine Statistik; einzelne Angebote können deutlich abweichen."
        >
          <div className={`${u.blatt} hidden sm:block`}>
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-black/15">
                  <th scope="col" className="notiz-mono pr-4 pb-3 font-normal">
                    Weg
                  </th>
                  <th scope="col" className="notiz-mono pr-4 pb-3 font-normal">
                    Einmalig
                  </th>
                  <th scope="col" className="notiz-mono pr-4 pb-3 font-normal">
                    Laufend
                  </th>
                  <th scope="col" className="notiz-mono pb-3 font-normal">
                    Passt, wenn …
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEGE.map((w) => (
                  <tr
                    key={w.name}
                    className="border-b border-black/10 align-top"
                  >
                    <th
                      scope="row"
                      className="py-5 pr-4 text-[17px] font-semibold"
                    >
                      {w.name}
                    </th>
                    <td className="py-5 pr-4 whitespace-nowrap">
                      {w.einmalig}
                    </td>
                    <td className="py-5 pr-4 text-[#6e6e73]">{w.laufend}</td>
                    <td className="py-5 text-[#6e6e73]">
                      {w.passt}
                      {w.link ? <WegLink link={w.link} /> : null}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#f5f5f7] align-top">
                  <th
                    scope="row"
                    className="rounded-l-[12px] py-5 pr-4 pl-4 text-[17px] font-semibold"
                  >
                    Sitalo
                  </th>
                  <td className="py-5 pr-4 font-semibold whitespace-nowrap">
                    {STARTER_SETUP}
                  </td>
                  <td className="py-5 pr-4">
                    {STARTER_MONTHLY} im Monat, mit Hosting und kleinen
                    Änderungen; inkl. MwSt.
                  </td>
                  <td className="rounded-r-[12px] py-5 pr-4">
                    Sie möchten einen Festpreis vorab und eine Telefonnummer,
                    unter der Sie uns selbst erreichen.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobil: je Weg eine Karte */}
          <dl className="grid gap-3 sm:hidden">
            {[
              ...WEGE,
              {
                link: undefined,
                name: "Sitalo",
                einmalig: STARTER_SETUP,
                laufend: `${STARTER_MONTHLY} im Monat, mit Hosting und kleinen Änderungen; inkl. MwSt.`,
                passt:
                  "Sie möchten einen Festpreis vorab und eine Telefonnummer, unter der Sie uns selbst erreichen.",
              },
            ].map((w) => (
              <div
                key={w.name}
                className={`rounded-[18px] bg-white p-5 shadow-[0_4px_16px_rgb(0_0_0/0.06)] ${w.name === "Sitalo" ? "shadow-[0_4px_16px_rgb(0_0_0/0.06),inset_0_0_0_2px_var(--gold)]" : ""}`}
              >
                <dt className="flex items-baseline justify-between gap-4">
                  <span className="text-[17px] font-semibold">{w.name}</span>
                  <span className="text-[15px] font-semibold">
                    {w.einmalig}
                  </span>
                </dt>
                <dd className="mt-1 text-[14px] text-[#6e6e73]">
                  Laufend: {w.laufend}
                </dd>
                <dd className="mt-2 text-[15px] leading-relaxed text-[#424245]">
                  {w.passt}
                  {w.link ? <WegLink link={w.link} /> : null}
                </dd>
              </div>
            ))}
          </dl>
        </Abschnitt>

        {/* Laufende Kosten */}
        <Abschnitt
          id="laufende-kosten"
          fett="Laufende Kosten im Monat."
          grau="Auch eine fertige Seite kostet etwas."
          unter={
            <>
              Diese Posten kommen zusammen, einzeln bezahlt oder in einem
              Monatsbeitrag gebündelt, selbst wenn Sie die Seite selbst gebaut
              haben. Wenn Sie selbst bauen:{" "}
              <Link
                href="/webseite-erstellen#kosten"
                className="text-gold-ink underline-offset-4 hover:underline"
              >
                was der Selbstbau kostet
              </Link>
              .
            </>
          }
        >
          <div
            className={`rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10`}
          >
            <div
              aria-hidden="true"
              className="hidden grid-cols-[11rem_12rem_minmax(0,1fr)] gap-x-6 border-b border-black/15 pt-6 pb-3 md:grid"
            >
              {["Posten", "Richtwert", "Worauf Sie achten"].map((h) => (
                <span key={h} className="notiz-mono">
                  {h}
                </span>
              ))}
            </div>
            <dl className="divide-y divide-black/10">
              {LAUFEND.map((l) => (
                <div
                  key={l.posten}
                  className="grid gap-1 py-4 md:grid-cols-[11rem_12rem_minmax(0,1fr)] md:gap-x-6"
                >
                  <dt className="text-[17px] font-semibold md:text-[15px]">
                    {l.posten}
                  </dt>
                  <dd className="text-[15px]">{l.richtwert}</dd>
                  <dd className="text-[15px] leading-relaxed text-[#6e6e73]">
                    {l.hinweis}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
            Bei uns stecken Hosting in der EU, SSL-Zertifikat, Backups, Updates
            und kleine Änderungen im Monatsbeitrag, {STARTER_MONTHLY} inkl.
            MwSt. Rechtstexte und Abos für Erweiterungen kommen wie überall
            dazu.
          </p>
        </Abschnitt>

        {/* Preisfaktoren */}
        <Abschnitt
          id="faktoren"
          fett="Wovon der Preis abhängt."
          unter="Liegen zwei Angebote weit auseinander, steckt der Grund meistens in einem dieser sechs Punkte."
        >
          <dl className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {FAKTOREN.map((f) => (
              <div
                key={f.title}
                className={`rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:p-8`}
              >
                <dt className="text-[19px] font-semibold tracking-[-0.016em] sm:text-[21px]">
                  {f.title}
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
                  {f.text}
                </dd>
              </div>
            ))}
          </dl>
        </Abschnitt>

        {/* Nach Umfang: vier Stufen, mit unserem Paket als Beispiel */}
        <Abschnitt
          id="umfang"
          fett="Was eine Website nach Umfang kostet."
          unter="Der größte Hebel beim Preis ist der Umfang. Als Anhaltspunkt steht bei jeder Stufe, was sie bei uns kostet. Holen Sie für den Vergleich zwei, drei Angebote ein."
        >
          <div className="grid gap-3 sm:gap-5 md:grid-cols-2">
            {UMFANG.map((stufe) => (
              <article
                key={stufe.titel}
                className={`rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:p-8`}
              >
                <h3 className="text-[21px] leading-tight tracking-[-0.018em] sm:text-[24px]">
                  {stufe.titel}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#424245] sm:text-[17px]">
                  {stufe.text}
                </p>
                <p className="mt-4 rounded-[14px] bg-[#f5f5f7] px-4 py-3 text-[15px] leading-relaxed">
                  <span className="notiz-mono mr-2">Bei uns</span>
                  {stufe.paket ? (
                    <>
                      <Link
                        href={`/pakete/${stufe.paket.slug}`}
                        className="text-gold-ink font-semibold underline-offset-4 hover:underline"
                      >
                        {stufe.paket.name}
                      </Link>
                      , {stufe.paket.setup} einmalig und{" "}
                      {stufe.paket.monthly.replace(/\s*\/\s*Monat$/, "")} im
                      Monat, inkl. MwSt.; online {nachDauer(stufe.paket.dauer)}{" "}
                      ab vollständigen Unterlagen.
                    </>
                  ) : (
                    "nur im Einzelfall, den Preis nennen wir nach einem Gespräch."
                  )}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">
                  {stufe.hinweis}
                </p>
              </article>
            ))}
          </div>
        </Abschnitt>

        {/* Eigene Preise als Preisliste */}
        <Abschnitt
          id="preise"
          fett="Was eine Website bei uns kostet."
          rechts={
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              <li>
                <MehrLink href="/pakete">Pakete im Vergleich</MehrLink>
              </li>
              <li>
                <MehrLink href="/website-erstellen-lassen">
                  Website erstellen lassen: Leistungen und Ablauf
                </MehrLink>
              </li>
            </ul>
          }
        >
          <ul
            role="list"
            className={`divide-y divide-black/10 rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10`}
          >
            {PAKETE.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/pakete/${p.slug}`}
                  className="group grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[14rem_minmax(0,1fr)_auto]"
                >
                  <span className="text-[21px] leading-tight font-semibold tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4">
                    {p.name}
                  </span>
                  <span className="max-w-xl text-[15px] leading-relaxed text-[#6e6e73] sm:col-start-1 lg:col-start-2 lg:row-start-1">
                    {PAKET_KURZ[p.slug]}
                  </span>
                  <span className="text-left sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:text-right lg:col-start-3 lg:row-span-1">
                    <span className="block text-[24px] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap">
                      {p.setup}
                    </span>
                    <span className="mt-1.5 block text-[13px] whitespace-nowrap text-[#6e6e73]">
                      + {p.monthly}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">
            {PREIS_HINWEIS} Im{" "}
            <Link
              href="/rechner"
              className="text-gold-ink underline-offset-4 hover:underline"
            >
              3-Jahres-Rechner
            </Link>{" "}
            sehen Sie die Gesamtkosten neben angenommenen Baukasten-Tarifen,
            Ihre eigene Arbeitszeit eingerechnet.
          </p>
        </Abschnitt>

        {/* Checkliste wie ein Zettel zum Abhaken. Anker #checkliste wird von
            /website-erstellen-lassen und /webseite-erstellen verlinkt. */}
        <Abschnitt
          id="checkliste"
          fett="Sechs Fragen an jedes Angebot."
          unter={
            <>
              Legen Sie die Liste neben jedes Angebot, das Sie bekommen. Auch
              neben unseres:{" "}
              <Link
                href="/website-erstellen-lassen#zusagen"
                className="text-gold-ink underline-offset-4 hover:underline"
              >
                unsere Antworten auf die sechs Fragen
              </Link>
              .
            </>
          }
        >
          <div className={`${u.blatt} max-w-3xl`}>
            <p className="notiz-mono flex flex-wrap justify-between gap-x-4 gap-y-1">
              <span>Checkliste</span>
              <span>Angebot von ________</span>
            </p>
            <ul className="mt-4 divide-y divide-black/10">
              {CHECKLISTE.map((c) => (
                <li
                  key={c}
                  className="flex gap-4 py-4 text-[17px] leading-snug"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-block h-[18px] w-[18px] shrink-0 rounded-[5px] border-[1.5px] border-[#1d1d1f]"
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Abschnitt>

        {/* Fragen */}
        <Abschnitt id="fragen" fett="Häufige Fragen zu Website-Kosten.">
          <dl className="grid gap-3 sm:grid-cols-2 sm:gap-5">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className={`rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:p-8`}
              >
                <dt className="text-[19px] leading-snug font-semibold tracking-[-0.016em]">
                  {f.q}
                </dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </Abschnitt>

        <KontaktKarte
          id="abschluss"
          titel="Ihren Festpreis bekommen Sie schriftlich, bevor wir anfangen."
          zeile="Schreiben Sie uns, was die Seite können soll. Wir antworten meist am selben Werktag."
          pille={{ href: "/anfrage", label: "Angebot anfragen" }}
          link={{ href: "/pakete", label: "Pakete im Vergleich" }}
          foto={{
            src: "/images/cafe-eimsbuettel.webp",
            alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Website-Kosten" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
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
        className="text-gold-ink font-semibold underline-offset-4 hover:underline"
      >
        {link.label}
        <span aria-hidden="true"> ›</span>
      </Link>
    </>
  );
}
