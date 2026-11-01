import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { BRANCHEN } from "@/lib/branchen-data";
import { PAKETE } from "@/lib/pakete-data";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/**
 * Landingpage für die Suchanfragen „Website erstellen lassen",
 * „Webseite erstellen lassen", „Homepage erstellen lassen" (auch mit
 * „Hamburg" oder „Kosten"). Eine Seite für alle Schreibweisen statt
 * mehrerer dünner Kopien — Google wertet Synonyme selbst zusammen.
 *
 * Inhalt bewusst ausführlicher als die übrigen Unterseiten: Wer so
 * sucht, will Kosten, Ablauf und Unterschiede verstehen, bevor er
 * schreibt. Alle Preise kommen aus lib/pakete-data.ts.
 *
 * Rhythmus: Preisaushang (Liste), Leistungen als Fließtext, Ablauf auf
 * dunkler Fläche, Vergleich als Tabelle, Branchen als Register, Fragen
 * offen gesetzt, Abschluss mit Telefonnummer.
 */

const TITLE =
  "Website erstellen lassen ab 499\u00A0€ | Festpreis · Sitalo";
const DESCRIPTION =
  "Website erstellen lassen zum Festpreis: individuell gestaltet, für Handy und Google optimiert, betreut aus Hamburg. Kleine Seiten oft in 1–2 Werktagen online.";

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

const STARTER = PAKETE[0];
const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** „ab 2.499 €" → „2.499 €", „ab 79 € / Monat" → „79 €" */
function betrag(label: string) {
  return label.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");
}

const SCHRITTE = [
  {
    title: "Anfrage",
    text: "Sie beschreiben in drei Feldern, was Sie brauchen. Wir melden uns meist am selben Werktag.",
  },
  {
    title: "Gespräch und Festpreis",
    text: "Eine Viertelstunde am Telefon oder per Video. Danach bekommen Sie ein verbindliches Angebot.",
  },
  {
    title: "Gestaltung und Bau",
    text: "Sie schicken Logo, Fotos und Stichpunkte. Wir schreiben die Texte, gestalten und bauen.",
  },
  {
    title: "Test-Link und Start",
    text: "Sie prüfen alles auf einem Test-Link. Nach Ihrer Freigabe geht die Seite online.",
  },
];

/** Fairer Vergleich: In den ersten beiden Zeilen liegt der Baukasten vorn. */
const VERGLEICH: { label: string; selbst: string; lassen: string; vorn: "selbst" | "lassen" }[] = [
  {
    label: "Kosten für eine sehr einfache Seite",
    selbst: "Günstiger, Sie zahlen nur das Abo des Anbieters",
    lassen: `${STARTER.setup} einmalig, dazu ${STARTER.monthly.replace(" / Monat", " im Monat")}`,
    vorn: "selbst",
  },
  {
    label: "Wann Sie anfangen können",
    selbst: "Sofort, auch am Sonntagabend",
    lassen: "Nach einem kurzen Gespräch; kleine Seiten stehen oft nach ein bis zwei Werktagen",
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
    selbst: "Klären Sie selbst",
    lassen: "Wir legen die Seiten an. Den Rechtstext liefern Sie, wir sagen Ihnen, woher",
    vorn: "lassen",
  },
  {
    label: "Wenn etwas hakt",
    selbst: "Support des Anbieters",
    lassen: "Ein Anruf bei uns",
    vorn: "lassen",
  },
];

const FAQ = [
  {
    q: "Was kostet es, eine Website erstellen zu lassen?",
    a: `Bei uns ${PAKETE[0].setup} einmalig für eine Onepage-Website, ${PAKETE[1].setup} für eine mehrseitige Website. Dazu kommt ein Monatsbeitrag ab 49\u00A0€ für Hosting, Updates und kleine Änderungen. Den genauen Festpreis bekommen Sie vor Auftrag schriftlich.`,
  },
  {
    q: "Wie lange dauert es, bis meine Website online ist?",
    a: "Ab vollständigen Unterlagen ist eine einzelne Seite oft in 1–2 Werktagen online, Business meist in 5–10 Werktagen, Premium in 2–3 Wochen und Studio in 3–5 Wochen. Den genauen Termin nennen wir Ihnen vorab.",
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
    a: "Ja. Domain und Inhalte laufen auf Ihren Namen. Wenn Sie den Monatsvertrag nach der Mindestlaufzeit kündigen, übergeben wir Ihnen den kompletten Bestand.",
  },
  {
    q: "Kann ich später selbst Inhalte ändern?",
    a: "Kleine Änderungen erledigen wir für Sie, eine kurze Nachricht genügt. Auf Wunsch bauen wir Bereiche ein, die Sie selbst pflegen, etwa Speisekarte, Öffnungszeiten oder Angebote.",
  },
  {
    q: "Warum nicht einfach einen Baukasten wie Wix oder Jimdo nehmen?",
    a: "Für eine sehr einfache Seite reicht ein Baukasten oft, und er ist günstiger. Soll die Seite Anfragen bringen, kommt es auf Ladezeit, Google und einen kurzen Weg zum Formular an. Das richten wir von Anfang an ein, und Sie verbringen keine Abende damit.",
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

  const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";
  const H2 = "text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]";
  const TEXTLINK = "inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline";

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Website erstellen lassen"
          eyebrow="Webdesign zum Festpreis"
          title={`Website erstellen lassen, zum Festpreis ${STARTER.setup}`}
          meta={
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
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
          }
        >
          Sie schicken uns Stichpunkte und Handyfotos. Wir bauen daraus Ihre Website und halten sie danach aktuell.
        </PageHero>

        {/* Kosten: Preisaushang */}
        <section id="kosten" className="scroll-mt-20">
          <div className={INNER}>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 className={`${H2} lg:col-span-6`}>Was kostet eine Website?</h2>
              <div className="lg:col-span-5 lg:col-start-8">
                <p className="text-muted-foreground text-[15.5px] leading-relaxed">
                  Einmalig für die Erstellung, dazu ein Monatsbeitrag für Hosting, Updates und kleine Änderungen. Alle
                  Preise zzgl. MwSt.; den Festpreis bekommen Sie schriftlich, bevor wir anfangen.
                </p>
                <Link href="/website-kosten" className={`${TEXTLINK} mt-4`}>
                  Kosten im Detail {ARROW}
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-12">
              <div className="border-foreground text-muted-foreground hidden grid-cols-[11rem_minmax(0,1fr)_9rem_8rem] gap-x-8 border-b-[1.5px] pb-3 sm:grid">
                <span className="label-mono text-[11px]">Paket</span>
                <span className="label-mono text-[11px]">Für wen</span>
                <span className="label-mono text-right text-[11px]">Einmalig</span>
                <span className="label-mono text-right text-[11px]">Monatlich</span>
              </div>
              <ul className="border-foreground border-t-[1.5px] sm:border-t-0">
                {PAKETE.map((p) => (
                  <li key={p.slug} className="border-border border-b">
                    <Link
                      href={`/pakete/${p.slug}`}
                      className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1.5 py-5 sm:grid-cols-[11rem_minmax(0,1fr)_9rem_8rem] sm:gap-x-8"
                    >
                      <span className="text-[18px] font-semibold tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
                        {p.name}
                      </span>
                      <span className="text-muted-foreground col-span-2 row-start-2 text-[14.5px] leading-snug sm:col-span-1 sm:col-start-2 sm:row-start-1">
                        {p.description}
                      </span>
                      <span className="col-start-2 row-start-1 text-right sm:col-start-3">
                        <span className="text-muted-foreground mr-1.5 text-[13px]">ab</span>
                        <span className="serif text-[1.6rem] leading-none tracking-[-0.02em] whitespace-nowrap">
                          {betrag(p.setup)}
                        </span>
                      </span>
                      <span className="text-muted-foreground col-span-2 row-start-3 text-[13.5px] sm:col-span-1 sm:col-start-4 sm:row-start-1 sm:text-right">
                        <span className="sm:hidden">dazu monatlich </span>ab{" "}
                        <span className="serif text-foreground text-[1.05rem]">{betrag(p.monthly)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Leistungen als Fließtext */}
        <section className="bg-card border-foreground border-t">
          <div className={`${INNER} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
            <div className="lg:col-span-4">
              <p className="label-mono text-muted-foreground">Leistungen</p>
              <h2 className={`${H2} mt-4`}>Was zu jeder Website von uns gehört</h2>
              <Link href="/leistungen" className={`${TEXTLINK} mt-6`}>
                Leistungsverzeichnis {ARROW}
              </Link>
            </div>
            <div className="text-foreground/85 max-w-2xl space-y-5 text-[16.5px] leading-[1.7] lg:col-span-7 lg:col-start-6">
              <p>
                <strong className="text-foreground font-semibold">Gestaltung und Bau.</strong> Wir gestalten die Seite für
                Ihren Betrieb und bauen sie direkt im Code, ohne Baukasten. Vor dem Start prüfen wir sie auf echten
                Handys und nicht nur am großen Bildschirm.
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
                richten wir Titel, Beschreibungen, Sitemap und Ihr Google-Unternehmensprofil ein. Impressum und
                Datenschutz binden wir in jedem Paket ein.
              </p>
              <p>
                <strong className="text-foreground font-semibold">Nach dem Start.</strong> Hosting auf einem Server in der
                EU, SSL-Zertifikat und Domain richten wir ein und halten alles aktuell. Kleine Änderungen sind im
                Monatsbeitrag enthalten: Sie schreiben uns eine Mail, wir setzen sie um.
              </p>
            </div>
          </div>
        </section>

        {/* Ablauf auf dunkler Fläche */}
        <section className="grain bg-foreground text-background">
          <div className={INNER}>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <h2 className={`${H2} max-w-2xl`}>Vom ersten Anruf bis zum Start</h2>
              <Link href="/ablauf" className={`${TEXTLINK} text-background`}>
                Ablauf im Detail {ARROW}
              </Link>
            </div>
            <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
              {SCHRITTE.map((s, i) => (
                <li key={s.title} className="border-background/25 border-t pt-5">
                  <p className="label-mono text-gold">Halt {i + 1}</p>
                  <h3 className="mt-2 text-[1.3rem] leading-tight tracking-[-0.015em]">{s.title}</h3>
                  <p className="text-stahl-hell mt-2 text-[15px] leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Vergleich */}
        <section>
          <div className={INNER}>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 className={`${H2} lg:col-span-7`}>Baukasten oder erstellen lassen: ein Vergleich</h2>
              <div className="lg:col-span-4 lg:col-start-9">
                <p className="text-muted-foreground text-[15.5px] leading-relaxed">
                  Für eine sehr einfache Seite ist ein Baukasten günstiger. Die übrigen Zeilen zeigen, wofür Sie bei uns
                  bezahlen.
                </p>
                <Link href="/vergleich" className={`${TEXTLINK} mt-4`}>
                  Ausführlicher Vergleich {ARROW}
                </Link>
              </div>
            </div>

            {/* Tabelle ab md */}
            <table className="mt-10 hidden w-full border-collapse text-left text-[15px] md:table lg:mt-12">
              <caption className="sr-only">Website mit Baukasten selbst erstellen oder erstellen lassen</caption>
              <thead>
                <tr className="border-foreground border-b-[1.5px]">
                  <td className="w-[28%] py-3 pr-6" />
                  <th scope="col" className="label-mono text-muted-foreground py-3 pr-6 text-[11px] font-medium">
                    Mit Baukasten selbst
                  </th>
                  <th scope="col" className="label-mono py-3 text-[11px] font-medium">
                    Mit Sitalo erstellen lassen
                  </th>
                </tr>
              </thead>
              <tbody>
                {VERGLEICH.map((v) => (
                  <tr key={v.label} className="border-border border-b">
                    <th scope="row" className="py-4 pr-6 align-top font-semibold">
                      {v.label}
                    </th>
                    <td className={`py-4 pr-6 align-top ${v.vorn === "selbst" ? "text-foreground" : "text-muted-foreground"}`}>
                      {v.selbst}
                      {v.vorn === "selbst" ? <Vorn /> : null}
                    </td>
                    <td className={`py-4 align-top ${v.vorn === "lassen" ? "text-foreground" : "text-muted-foreground"}`}>
                      {v.lassen}
                      {v.vorn === "lassen" ? <Vorn /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobil: je Zeile ein Block */}
            <dl className="border-foreground mt-10 border-t-[1.5px] md:hidden">
              {VERGLEICH.map((v) => (
                <div key={v.label} className="border-border border-b py-4">
                  <dt className="text-[16px] font-semibold">{v.label}</dt>
                  <dd className="mt-2 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-[14.5px] leading-snug">
                    <span className="label-mono text-muted-foreground pt-[2px] text-[10.5px]">Baukasten</span>
                    <span className={v.vorn === "selbst" ? "text-foreground" : "text-muted-foreground"}>
                      {v.selbst}
                      {v.vorn === "selbst" ? <Vorn /> : null}
                    </span>
                    <span className="label-mono text-muted-foreground pt-[2px] text-[10.5px]">Sitalo</span>
                    <span className={v.vorn === "lassen" ? "text-foreground" : "text-muted-foreground"}>
                      {v.lassen}
                      {v.vorn === "lassen" ? <Vorn /> : null}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Branchen als Register */}
        <section className="bg-card border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-[1.5rem] leading-[1.1] tracking-[-0.02em]">Nach Branche</h2>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                Was auf die Seite gehört, hängt vom Betrieb ab.
              </p>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
              {BRANCHEN.map((b) => (
                <li key={b.slug} className="border-border border-t">
                  <Link
                    href={`/branchen/${b.slug}`}
                    className="group flex items-center justify-between gap-4 py-3 text-[15px]"
                  >
                    <span className="group-hover:underline group-hover:underline-offset-4">Website für {b.label}</span>
                    <ArrowRight
                      className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
              <li className="border-border border-t">
                <Link href="/branchen" className="group flex items-center justify-between gap-4 py-3 text-[15px] font-semibold">
                  <span className="group-hover:underline group-hover:underline-offset-4">Alle Branchen</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* Fragen offen gesetzt */}
        <section id="fragen" className="border-foreground scroll-mt-20 border-t">
          <div className={`${INNER} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
            <div className="lg:col-span-4">
              <h2 className={H2}>Fragen zur Website-Erstellung</h2>
              <Link href="/faq" className={`${TEXTLINK} mt-6`}>
                Alle Fragen {ARROW}
              </Link>
            </div>
            <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-8">
              {FAQ.map((f) => (
                <div key={f.q} className="border-foreground border-t pt-5">
                  <dt className="text-[17.5px] font-semibold leading-snug tracking-[-0.01em]">{f.q}</dt>
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
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold"
              >
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
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </div>
  );
}

/** Kleine Markierung für die Spalte, die in einer Zeile vorn liegt. */
function Vorn() {
  return <span className="label-mono text-gold ml-2 inline-block text-[10px] whitespace-nowrap">Vorteil</span>;
}
