import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import a from "@/components/marketing/hafen/atelier.module.css";
import { Briefkarte } from "@/components/marketing/hafen/briefkarte";
import { SitaloSignatur } from "@/components/marketing/hafen/sitalo-signatur";
import { PageHero } from "@/components/marketing/page-hero";
import { ATELIER_GERADE, ATELIER_NOTES } from "@/lib/atelier-notes";
import { getHamburgWeather, type HamburgWeather } from "@/lib/hamburg-weather";
import { LEXIKON } from "@/lib/lexikon-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über Sitalo: ein kleines Webdesign-Büro in Hamburg",
  description:
    "Sitalo ist ein kleines Büro für Webdesign in Hamburg: wie ein Auftrag bei uns abläuft, woran wir uns halten und was wir nicht machen.",
  alternates: { canonical: "/atelier" },
};

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/* ============================================================
 * Über-uns-Seite als nüchterner Werkstattbericht: wie ein Auftrag
 * abläuft, woran wir uns halten, was wir ablehnen, warum der Ort
 * für die lokale Suche zählt. Bewusst ohne Team-Fotos, Awards und
 * Bio; der Name des Inhabers steht nur im Impressum.
 *
 * Rhythmus: dunkler Kopf → Bericht mit Foto (hell) → Grundsätze als
 * Fließtext (Karte) → Hamburg (dunkel) → Register der übrigen
 * Seiten → Kontakt (dunkel). Jeder Abschnitt ist anders gebaut.
 * ============================================================ */
/** Wetterzeile und Datum im Tagebuch: höchstens eine Stunde alt. */
export const revalidate = 3600;

export default async function AtelierPage() {
  // Wetter vom Rathausmarkt, serverseitig mit 1 h Cache (lib/hamburg-weather.ts).
  const wetter = await getHamburgWeather();
  const aboutPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Über Sitalo Webdesign",
    description:
      "Über Sitalo in Hamburg: wie ein Auftrag abläuft, woran wir uns halten und warum der Ort bei der lokalen Suche zählt.",
    url: `${SITE_URL}/atelier`,
    mainEntity: { "@id": `${SITE_URL}/#business` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Über uns",
        item: `${SITE_URL}/atelier`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero crumb="Über uns" eyebrow="Über Sitalo · Hamburg" title="Sitalo ist ein kleines Büro für Webdesign in Hamburg.">
          Wer bei uns anruft, spricht mit jemandem, der die Seiten auch selbst baut. Damit das so bleibt, nehmen wir nur
          so viele Aufträge an, wie wir sorgfältig fertig bekommen. Den Starttermin nennen wir Ihnen im ersten Gespräch.
        </PageHero>
        <Werkstattbericht />
        <Tagebuch wetter={wetter} />
        <Grundsaetze />
        <Hamburg />
        <Register />
        <Kontakt />
      </main>
      <MarketingFooter crumb="Über uns" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([aboutPageLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Wie ein Auftrag läuft: Foto mit Bildunterschrift, daneben Fließtext.
 * ---------------------------------------------------------------- */
function Werkstattbericht() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <figure className="lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px]">
            <Image
              src="/images/workspace-macbook.webp"
              alt="Blick von oben auf einen Schreibtisch: Hände auf einer Laptop-Tastatur, daneben ein Notizbuch mit Skizzen und eine Tasse Kaffee."
              fill
              priority
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover contrast-[1.05] grayscale"
            />
          </div>
          <figcaption className="text-muted-foreground border-border mt-3 border-b pb-3 font-mono text-[12px] leading-relaxed">
            Am Schreibtisch in Hamburg.
          </figcaption>
        </figure>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
            So läuft ein Auftrag bei uns
          </h2>
          <div className="text-foreground/85 mt-6 space-y-5 text-[16.5px] leading-[1.7]">
            <p>
              Meist beginnt es mit einem Anruf. Wir fragen, was Ihr Betrieb macht und wer Ihre Kunden sind. Danach nennen
              wir einen Festpreis, und den bekommen Sie schriftlich, bevor wir anfangen.
            </p>
            <p>
              Von Ihnen brauchen wir Handyfotos und ein paar Stichpunkte. Die Texte formulieren wir daraus, Sie streichen,
              was nicht stimmt. Kleine Seiten stehen oft nach ein bis zwei Werktagen auf einem Test-Link, den Sie in Ruhe
              auf dem eigenen Handy ansehen.
            </p>
            <p>
              Online geht die Seite erst, wenn Sie sie freigeben. Danach bleiben wir Ihr Ansprechpartner: Kleine Änderungen
              schicken Sie uns über das Formular oder sagen sie am Telefon durch, sie sind im Monatsbeitrag enthalten.
            </p>
          </div>
          <Link
            href="/ablauf"
            className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
          >
            Der Ablauf im Detail {ARROW}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Werkstatt-Tagebuch: eine linierte Notizbuchseite mit dem, was gerade
 * auf dem Schreibtisch liegt (lib/atelier-notes.ts, nur echte Einträge),
 * im Kopf das Wetter am Rathausmarkt. Das Wetter kommt serverseitig mit
 * einer Stunde Cache; fehlt es, steht nur der Ort da.
 * ---------------------------------------------------------------- */
const DATUM = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", weekday: "long", day: "numeric", month: "long" });

function Tagebuch({ wetter }: { wetter: HamburgWeather | null }) {
  const eintraege = [...ATELIER_NOTES.map((n) => ({ label: n.when, text: n.text })), ...ATELIER_GERADE];
  if (eintraege.length === 0) return null;
  return (
    <section aria-labelledby="tagebuch-titel">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 sm:px-6 sm:pb-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className={a.eyebrow}>Werkstatt-Tagebuch</p>
          <h2 id="tagebuch-titel" className="mt-5 text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
            Was gerade auf dem Schreibtisch liegt
          </h2>
          <p className={`${a.mono} mt-5`}>
            Nur was wirklich passiert. Kundenprojekte stehen hier erst, wenn der Kunde zugestimmt hat.
          </p>
        </div>
        <div className={`${a.notizbuch} lg:col-span-7 lg:col-start-6`}>
          <p className={a.notizDatum}>
            {DATUM.format(new Date())} · Rathausmarkt
            {wetter ? `, ${wetter.temperatureC}\u00A0°C, ${wetter.conditionLabel.toLowerCase()}` : ""}
          </p>
          {eintraege.map((e) => (
            <div key={e.label + e.text} className={a.notizEintrag}>
              <p className={a.notizDatum}>{e.label}</p>
              <p className={a.notizText}>{e.text}</p>
            </div>
          ))}
          <SitaloSignatur className="mt-4 max-w-[180px]" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Grundsätze als Fließtext in großer Schrift, daneben was wir ablehnen.
 * ---------------------------------------------------------------- */
function Grundsaetze() {
  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <h2 className="label-mono text-muted-foreground">Woran wir uns halten</h2>
          <p
            className="mt-6 text-balance text-[1.55rem] leading-[1.25] tracking-[-0.02em] sm:text-[2.1rem] sm:leading-[1.2]"
            style={{ fontStretch: "108%", fontWeight: 640 }}
          >
            Lieber nächste Woche eine gute Seite als im Frühjahr eine perfekte. Einen Platz bei Google sagen wir nicht zu,
            eine sauber gebaute Seite schon. Und die fertige Seite gehört Ihnen, mit Quellcode und allen Inhalten.
          </p>
        </div>
        <div className="border-border border-t pt-6 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:border-l lg:pt-1 lg:pl-8">
          <h2 className="label-mono text-muted-foreground">Was wir nicht machen</h2>
          <p className="mt-4 text-[16px] leading-relaxed">
            Werbekampagnen und Newsletter. Das ist ein eigenes Fach, und das sagen wir Ihnen lieber gleich zu Beginn.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Hamburg: ein konkretes Detail aus der lokalen Suche statt Bekenntnis.
 * ---------------------------------------------------------------- */
function Hamburg() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.034em] sm:text-5xl lg:text-[3.4rem]">
            Ottensen ist nicht Altona-Altstadt
          </h2>
          <div
            aria-hidden="true"
            className="border-background/25 text-background/85 mt-8 flex max-w-md items-center gap-3 rounded-[12px] border px-4 py-3 font-mono text-[14px]"
          >
            <Search className="text-stahl-hell h-4 w-4 shrink-0" />
            <span className="truncate">physiotherapie ottensen</span>
          </div>
        </div>
        <div className="text-stahl-hell space-y-4 text-[16.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
          <p>
            Beide Stadtteile gehören zum Bezirk Altona. Wer aber „Physiotherapie Ottensen“ sucht, will nicht nach
            Altona-Altstadt. Solche Unterschiede kennen wir, weil wir hier wohnen, und wir schreiben sie in Seitentitel und
            Texte.
          </p>
          <p>
            Für Betriebe außerhalb Hamburgs machen wir dasselbe mit Ihrem Ort. Besprochen wird dann am Telefon oder per
            Video.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Register der übrigen Seiten, gesetzt wie ein Inhaltsverzeichnis.
 * ---------------------------------------------------------------- */
const SEITEN: { href: string; title: string; line: string }[] = [
  { href: "/manifest", title: "Manifest", line: "Acht Grundsätze darüber, wie wir arbeiten." },
  { href: "/auswahl", title: "Auswahl", line: "Welche Aufträge wir annehmen und wie wir das entscheiden." },
  { href: "/inventar", title: "Inventar", line: "Womit wir bauen und wo wir hosten, jeweils mit Begründung." },
  { href: "/erreichbarkeit", title: "Erreichbarkeit", line: "Wann wir antworten und was im Urlaub passiert." },
  { href: "/honorar", title: "Honorar", line: "Unser Stundensatz und wie daraus die Paketpreise entstehen." },
  { href: "/lexikon", title: "Lexikon", line: `${LEXIKON.length} Webbegriffe, in Alltagsdeutsch erklärt.` },
  { href: "/journal", title: "Journal", line: "Längere Texte über Preise, Baukästen und die Suche bei Google." },
];

function Register() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="max-w-2xl text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
          Was wir sonst noch aufgeschrieben haben
        </h2>
        <ul className="border-foreground mt-10 border-t">
          {SEITEN.map((s) => (
            <li key={s.href} className="border-border border-b">
              <Link
                href={s.href}
                className="group grid gap-1 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <span className="text-[1.3rem] font-semibold tracking-[-0.02em] underline-offset-4 group-hover:underline sm:col-span-3 sm:text-[1.45rem]">
                  {s.title}
                </span>
                <span className="text-muted-foreground text-[15.5px] leading-relaxed sm:col-span-7">{s.line}</span>
                <span className="text-muted-foreground group-hover:text-foreground hidden items-center justify-end gap-1.5 font-mono text-[12px] transition-colors sm:col-span-2 sm:flex">
                  {s.href}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss wie auf allen Unterseiten: die Briefkarte aus dem Kontor.
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <Briefkarte
      id="kontakt"
      title="Eine Viertelstunde am Telefon klärt das meiste."
      link={{ href: "/ablauf", label: "So läuft ein Auftrag" }}
    >
      Am Telefon sprechen Sie mit dem, der Ihre Seite baut. Wer lieber schreibt, nimmt das Formular, wir antworten meist
      am selben Werktag.
    </Briefkarte>
  );
}
