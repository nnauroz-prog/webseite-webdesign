import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { BODY_OFFSET, SectionHead } from "@/components/marketing/home-sections";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { BRANCHEN } from "@/lib/branchen-data";
import { PAKETE } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

/**
 * Landingpage für die Suchanfragen „Website erstellen lassen",
 * „Webseite erstellen lassen", „Homepage erstellen lassen" (auch mit
 * „Hamburg" oder „Kosten"). Eine Seite für alle Schreibweisen statt
 * mehrerer dünner Kopien — Google wertet Synonyme selbst zusammen.
 *
 * Inhalt bewusst ausführlicher als die übrigen Unterseiten: Wer so
 * sucht, will Kosten, Ablauf und Unterschiede verstehen, bevor er
 * schreibt. Alle Preise kommen aus lib/pakete-data.ts.
 */

const TITLE =
  "Website erstellen lassen ab 499 € — Festpreis, persönlich aus Hamburg";
const DESCRIPTION =
  "Website erstellen lassen zum Festpreis: individuell gestaltet, für Handy optimiert, bei Google auffindbar. Persönlich betreut aus Hamburg, für Betriebe in ganz Deutschland. Kleine Seiten oft in 1–2 Werktagen.";

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
};

const ENTHALTEN = [
  {
    title: "Individuelles Design",
    text: "Gestaltet für Ihren Betrieb, ohne Baukasten-Vorlage.",
  },
  {
    title: "Für Handy, Tablet und PC",
    text: "Über die Hälfte Ihrer Besucher kommt mit dem Smartphone.",
  },
  {
    title: "Texte mit Ihnen formuliert",
    text: "Sie schicken Stichpunkte, wir machen klare Sätze daraus.",
  },
  {
    title: "Bei Google auffindbar",
    text: "Saubere Struktur, Titel, Beschreibungen und lokale Suchbegriffe.",
  },
  {
    title: "Kontaktformular und Anruf-Knopf",
    text: "Anfragen kommen direkt per E-Mail bei Ihnen an.",
  },
  {
    title: "Hosting, SSL und Domain",
    text: "Wir richten alles ein und halten es aktuell.",
  },
  {
    title: "Impressum und Datenschutz",
    text: "Die Pflichtseiten sind sauber eingebunden.",
  },
  {
    title: "Betreuung nach dem Start",
    text: "Kleine Änderungen sind im Monatsbeitrag enthalten.",
  },
];

const SCHRITTE = [
  {
    title: "Anfrage",
    text: "Sie beschreiben in drei Feldern, was Sie brauchen. Wir melden uns meist am selben Werktag.",
  },
  {
    title: "Gespräch und Festpreis",
    text: "15 Minuten am Telefon oder per Video. Danach bekommen Sie ein verbindliches Angebot.",
  },
  {
    title: "Gestaltung und Bau",
    text: "Sie schicken Logo, Bilder und Stichpunkte. Wir gestalten, schreiben und bauen.",
  },
  {
    title: "Vorschau und Start",
    text: "Sie prüfen alles auf einem Test-Link. Nach Ihrer Freigabe geht die Seite online.",
  },
];

const VERGLEICH = [
  {
    label: "Zeitaufwand für Sie",
    selbst: "Viele Abende mit Baukasten und Anleitungen",
    lassen: "Ein Gespräch und Ihre Unterlagen",
  },
  {
    label: "Gestaltung",
    selbst: "Vorlage, die viele andere auch nutzen",
    lassen: "Eigenes Design für Ihren Betrieb",
  },
  {
    label: "Google und Technik",
    selbst: "Müssen Sie selbst herausfinden",
    lassen: "Von Anfang an eingerichtet",
  },
  {
    label: "Rechtliches",
    selbst: "Impressum, Datenschutz, Cookies selbst klären",
    lassen: "Sauber eingebunden",
  },
  {
    label: "Wenn etwas hakt",
    selbst: "Support-Ticket beim Anbieter",
    lassen: "Ein Anruf bei uns",
  },
];

const FAQ = [
  {
    q: "Was kostet es, eine Website erstellen zu lassen?",
    a: `Bei uns ab ${PAKETE[0].setup} einmalig für eine Onepage-Website, ab ${PAKETE[1].setup} für eine mehrseitige Website. Dazu kommt ein Monatsbeitrag ab 49 € für Hosting, Updates und kleine Änderungen. Den genauen Festpreis bekommen Sie vor Auftrag schriftlich.`,
  },
  {
    q: "Wie lange dauert es, bis meine Website online ist?",
    a: "Kleine Seiten stehen oft nach 1–2 Werktagen, sobald alle Unterlagen da sind. Für größere Projekte vereinbaren wir vorab einen verbindlichen Termin.",
  },
  {
    q: "Was muss ich selbst liefern?",
    a: "Ihr Logo, ein paar Bilder (Handy-Fotos reichen) und Stichpunkte zu Ihren Leistungen. Die Texte formulieren wir mit Ihnen. Fehlt etwas, helfen wir.",
  },
  {
    q: "Arbeiten Sie nur in Hamburg?",
    a: "Nein. Wir sitzen in Hamburg und betreuen Betriebe in ganz Deutschland, per Telefon, Video und E-Mail. In Hamburg treffen wir uns auf Wunsch auch persönlich.",
  },
  {
    q: "Gehört die Website danach mir?",
    a: "Ja. Domain und Inhalte laufen auf Ihren Namen. Wenn Sie den Monatsvertrag nach der Mindestlaufzeit kündigen, übergeben wir Ihnen den kompletten Bestand.",
  },
  {
    q: "Kann ich später selbst Inhalte ändern?",
    a: "Kleine Änderungen erledigen wir für Sie, eine kurze Nachricht genügt. Auf Wunsch bauen wir Bereiche ein, die Sie selbst pflegen, etwa Speisekarte, Öffnungszeiten oder Angebote.",
  },
  {
    q: "Warum nicht einfach einen Baukasten wie Wix oder Jimdo nehmen?",
    a: "Für manche reicht das. Wenn Ihre Website Kunden gewinnen soll, zählen eigenes Design, Ladezeit, Google-Struktur und klare Wege zur Anfrage. Das richten wir von Anfang an ein, ohne dass Sie Abende damit verbringen.",
  },
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
      provider: {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "Sitalo Webdesign",
      },
      areaServed: { "@type": "Country", name: "Deutschland" },
      offers: PAKETE.map((p) => ({
        "@type": "Offer",
        name: `Website ${p.name}`,
        price: p.setup.replace(/[^\d]/g, ""),
        priceCurrency: "EUR",
        url: `${SITE_URL}/pakete/${p.slug}`,
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
        {
          "@type": "ListItem",
          position: 1,
          name: "Sitalo",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Website erstellen lassen",
          item: `${SITE_URL}/website-erstellen-lassen`,
        },
      ],
    },
  ];

  const SECTION = "border-border/50 border-t";
  const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Website erstellen lassen" />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero */}
        <section>
          <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
            <p className="text-muted-foreground flex items-center gap-2.5 text-[13px] font-medium">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-8"
              />
              Webdesign zum Festpreis
            </p>
            <h1 className="mt-5 max-w-4xl text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-[4.5rem]">
              Website erstellen lassen.{" "}
              <span className="text-muted-foreground">
                Persönlich, schnell, zum Festpreis.
              </span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
              Sie möchten eine professionelle Webseite, aber keine Abende mit
              Baukästen verbringen? Wir gestalten und bauen Ihre Website
              individuell, kümmern uns um Technik, Google und Rechtliches und
              bleiben danach Ihr Ansprechpartner. Aus Hamburg, für Betriebe in
              ganz Deutschland.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/anfrage"
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              >
                Kostenlos anfragen
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <a
                href="tel:+491607621876"
                className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
              >
                0160 7621876
              </a>
            </div>
            <ul className="border-border mt-12 grid gap-x-8 border-t sm:grid-cols-3">
              {[
                ["ab 499 €", "Festpreis, schriftlich vorab"],
                ["1–2 Werktage", "bis kleine Seiten online sind"],
                ["1 Ansprechpartner", "von der Anfrage bis zur Pflege"],
              ].map(([k, t]) => (
                <li
                  key={k}
                  className="border-border border-b py-5 sm:border-b-0"
                >
                  <p className="serif text-3xl leading-none tracking-[-0.02em] lining-nums">
                    {k}
                  </p>
                  <p className="text-muted-foreground mt-2 text-[14px]">{t}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Kosten */}
        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Kosten"
              title="Was kostet eine Website?"
              link={{ href: "/pakete", text: "Alle Pakete im Detail" }}
            />
            <p
              className={`text-muted-foreground mt-6 max-w-2xl text-[15.5px] leading-relaxed ${BODY_OFFSET}`}
            >
              Einmalig für die Erstellung, dazu ein fairer Monatsbeitrag für
              Hosting, Updates und kleine Änderungen. Alle Preise zzgl. MwSt.,
              den verbindlichen Festpreis bekommen Sie vor Auftrag.
            </p>
            <div className={`mt-10 lg:mt-12 ${BODY_OFFSET}`}>
              <ul className="border-border border-t">
                {PAKETE.map((p) => (
                  <li key={p.slug} className="border-border border-b">
                    <Link
                      href={`/pakete/${p.slug}`}
                      className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 sm:grid-cols-[10rem_1fr_auto]"
                    >
                      <span className="text-[17px] font-semibold tracking-tight">
                        {p.name}
                      </span>
                      <span className="text-muted-foreground col-span-2 row-start-2 text-[14.5px] sm:col-span-1 sm:col-start-2 sm:row-start-1">
                        {p.description}
                      </span>
                      <span className="serif col-start-2 row-start-1 text-right text-2xl lining-nums sm:col-start-3">
                        {p.setup}
                        <span className="text-muted-foreground block font-sans text-[12.5px]">
                          + {p.monthly}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Enthalten */}
        <section className={`${SECTION} bg-secondary/30`}>
          <div className={INNER}>
            <SectionHead label="Leistungen" title="Was bei uns dabei ist." />
            <dl
              className={`mt-10 grid gap-x-8 sm:grid-cols-2 lg:mt-14 ${BODY_OFFSET}`}
            >
              {ENTHALTEN.map((e) => (
                <div
                  key={e.title}
                  className="border-border flex gap-3 border-t py-5"
                >
                  <Check
                    className="text-gold mt-1 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-[16px] font-semibold tracking-tight">
                      {e.title}
                    </dt>
                    <dd className="text-muted-foreground mt-1 text-[14.5px] leading-relaxed">
                      {e.text}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Ablauf */}
        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Ablauf"
              title="In vier Schritten zur fertigen Website."
              link={{ href: "/ablauf", text: "Ablauf im Detail" }}
            />
            <ol
              className={`mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-14 ${BODY_OFFSET}`}
            >
              {SCHRITTE.map((s, i) => (
                <li key={s.title} className="border-border border-t pt-5">
                  <p className="text-gold text-[13px] font-semibold tabular-nums">
                    0{i + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-[14.5px] leading-relaxed">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Selbst machen oder erstellen lassen */}
        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Vergleich"
              title="Selbst erstellen oder erstellen lassen?"
              link={{ href: "/vergleich", text: "Ausführlicher Vergleich" }}
            />
            <div className={`mt-10 overflow-x-auto lg:mt-14 ${BODY_OFFSET}`}>
              <table className="w-full min-w-[34rem] border-collapse text-left text-[14.5px]">
                <thead>
                  <tr className="border-border border-b">
                    <th scope="col" className="w-1/4 py-3 pr-4 font-medium" />
                    <th
                      scope="col"
                      className="text-muted-foreground py-3 pr-4 font-medium"
                    >
                      Mit Baukasten selbst
                    </th>
                    <th scope="col" className="py-3 font-semibold">
                      Mit Sitalo erstellen lassen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VERGLEICH.map((v) => (
                    <tr key={v.label} className="border-border border-b">
                      <th
                        scope="row"
                        className="py-4 pr-4 align-top font-medium"
                      >
                        {v.label}
                      </th>
                      <td className="text-muted-foreground py-4 pr-4 align-top">
                        {v.selbst}
                      </td>
                      <td className="py-4 align-top">{v.lassen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Branchen */}
        <section className={`${SECTION} bg-secondary/30`}>
          <div className={INNER}>
            <SectionHead
              label="Branchen"
              title="Websites für Ihre Branche."
              link={{ href: "/branchen", text: "Alle Branchen" }}
            />
            <ul
              className={`mt-10 flex flex-wrap gap-2 lg:mt-14 ${BODY_OFFSET}`}
            >
              {BRANCHEN.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/branchen/${b.slug}`}
                    className="border-border/70 bg-card hover:border-foreground/40 inline-flex rounded-full border px-4 py-2 text-[14px] transition-colors"
                  >
                    Website für {b.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className={SECTION}>
          <div className={INNER}>
            <SectionHead
              label="Fragen"
              title="Häufige Fragen zur Website-Erstellung."
            />
            <div
              className={`divide-border/60 border-border/60 mt-10 divide-y border-y lg:mt-14 ${BODY_OFFSET}`}
            >
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <h3 className="text-[16px] leading-snug font-medium sm:text-[17px]">
                      {f.q}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground text-xl transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Abschluss */}
        <section className="bg-foreground text-background">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
            <h2 className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
              Ihre Website, zum Festpreis.{" "}
              <span className="text-background/65">Schreiben Sie uns.</span>
            </h2>
            <Link
              href="/anfrage"
              className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              Website anfragen
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
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
