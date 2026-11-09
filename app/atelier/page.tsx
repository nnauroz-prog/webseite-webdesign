import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";
import Link from "next/link";
import { Search } from "lucide-react";

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
import { SitaloSignatur } from "@/components/marketing/hafen/sitalo-signatur";
import { LEXIKON } from "@/lib/lexikon-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über Sitalo: ein kleines Webdesign-Büro in Hamburg",
  description:
    "Sitalo ist ein kleines Büro für Webdesign in Hamburg: wie ein Auftrag bei uns abläuft, woran wir uns halten und was wir nicht machen.",
  alternates: { canonical: "/atelier" },
  openGraph: ogFor("/atelier"),
};

/* ============================================================
 * Über-uns-Seite als nüchterner Werkstattbericht: wie ein Auftrag
 * abläuft, woran wir uns halten, was wir ablehnen, warum der Ort
 * für die lokale Suche zählt. Bewusst ohne Team-Fotos, Awards und
 * Bio; der Name des Inhabers steht nur im Impressum.
 *
 * Rhythmus: Seitenkopf mit Foto → Bericht als weiße Karte →
 * Grundsätze → Hamburg mit Suchfeld → Register der übrigen Seiten →
 * Briefkarte als Abschluss.
 * ============================================================ */
export default function AtelierPage() {
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Sitalo",
        item: `${SITE_URL}/`,
      },
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
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Über uns"
          eyebrow="Über Sitalo · Hamburg"
          titel="Sitalo ist ein kleines Büro für Webdesign in Hamburg."
          unter="Wer bei uns anruft, spricht mit jemandem, der die Seiten auch selbst baut. Damit das so bleibt, nehmen wir nur so viele Aufträge an, wie wir sorgfältig fertig bekommen. Den Starttermin nennen wir Ihnen im ersten Gespräch."
          aktionen={
            <>
              <a href="tel:+491607621876" className="btn-signal btn-gross">
                0160&nbsp;7621876 anrufen
              </a>
              <MehrLink href="/ablauf" groesse="unter">
                Der Ablauf im Detail
              </MehrLink>
            </>
          }
          bild={
            <FotoRahmen
              vorab
              src="/images/workspace-macbook.webp"
              alt="Blick von oben auf einen Schreibtisch: Hände auf einer Laptop-Tastatur, daneben ein Notizbuch mit Skizzen und eine Tasse Kaffee."
              aspect="21 / 10"
              aspectMobil="4 / 3"
              position="50% 50%"
            />
          }
          unterschrift="Am Schreibtisch in Hamburg."
        />
        <Werkstattbericht />
        <Grundsaetze />
        <Hamburg />
        <Register />
        <KontaktKarte
          id="abschluss"
          titel="Eine Viertelstunde am Telefon klärt das meiste."
          zeile="Wer lieber schreibt, schickt uns die Anfrage über das Formular. Wir antworten meist am selben Werktag."
          link={{ href: "/ablauf", label: "Der Ablauf im Detail" }}
          foto={{
            src: "/images/hamburg-speicherstadt.webp",
            alt: "Speicherstadt in Hamburg mit Backsteinfassaden am Fleet",
          }}
        />
      </UnterseiteMain>
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
 * Wie ein Auftrag läuft: Fließtext auf weißer Karte, Signatur darunter.
 * ---------------------------------------------------------------- */
function Werkstattbericht() {
  return (
    <Abschnitt
      id="auftrag"
      fett="So läuft ein Auftrag bei uns."
      grau="Ohne Umwege."
    >
      <div className={u.blatt}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className={`${u.text} text-[#424245]`}>
              Meist beginnt es mit einem Anruf. Wir fragen, was Ihr Betrieb
              macht und wer Ihre Kunden sind. Danach nennen wir einen Festpreis,
              und den bekommen Sie schriftlich, bevor wir anfangen.
            </p>
            <p className={`${u.text} text-[#424245]`}>
              Von Ihnen brauchen wir Handyfotos und ein paar Stichpunkte. Die
              Texte formulieren wir daraus, Sie streichen, was nicht stimmt.
              Kleine Seiten stehen oft nach ein bis zwei Werktagen auf einem
              Test-Link, den Sie in Ruhe auf dem eigenen Handy ansehen.
            </p>
            <p className={`${u.text} text-[#424245]`}>
              Online geht die Seite erst, wenn Sie sie freigeben. Danach bleiben
              wir Ihr Ansprechpartner: Kleine Änderungen schicken Sie uns per
              Mail, sie sind im Monatsbeitrag enthalten.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-5 lg:col-span-4">
            <SitaloSignatur
              caption="Aus dem Büro in Hamburg"
              className="max-w-[180px]"
            />
            <MehrLink href="/ablauf">Der Ablauf im Detail</MehrLink>
          </div>
        </div>
      </div>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Grundsätze als Fließtext in großer Schrift, daneben was wir ablehnen.
 * ---------------------------------------------------------------- */
function Grundsaetze() {
  return (
    <section aria-labelledby="grundsaetze-titel" className={u.abschnitt}>
      <div className="inhalt grid gap-3 sm:gap-5 lg:grid-cols-12">
        <div className={`${u.blatt} lg:col-span-8`}>
          <h2 id="grundsaetze-titel">
            <span className="kennzeile-mono">Woran wir uns halten</span>
          </h2>
          <p className="mt-5 text-[24px] leading-[1.25] font-semibold tracking-[-0.02em] text-balance sm:text-[32px] sm:leading-[1.2]">
            Lieber nächste Woche eine gute Seite als im Frühjahr eine perfekte.
            Einen Platz bei Google sagen wir nicht zu, eine sauber gebaute Seite
            schon. Und die fertige Seite gehört Ihnen, mit Quellcode und allen
            Inhalten.
          </p>
        </div>
        <div className={`${u.blatt} lg:col-span-4`}>
          <h2>
            <span className="kennzeile-mono">Was wir nicht machen</span>
          </h2>
          <p className="mt-5 text-[17px] leading-[1.5] tracking-[-0.022em] text-[#424245]">
            Werbekampagnen und Newsletter. Das ist ein eigenes Fach, und das
            sagen wir Ihnen lieber gleich zu Beginn.
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
    <Abschnitt
      id="hamburg"
      fett="Ottensen ist nicht Altona-Altstadt."
      grau="Der Ort zählt bei der Suche."
    >
      <div className={`${u.blatt} grid gap-8 lg:grid-cols-12 lg:items-center`}>
        <div className="lg:col-span-5">
          <div
            aria-hidden="true"
            className="flex max-w-md items-center gap-3 rounded-full bg-[#f5f5f7] px-5 py-3.5 text-[17px] text-[#1d1d1f]"
          >
            <Search className="h-4 w-4 shrink-0 text-[#6e6e73]" />
            <span className="truncate">physiotherapie ottensen</span>
          </div>
          <p className="notiz-mono mt-3">Ottensen · Bezirk Altona</p>
        </div>
        <div className="space-y-4 text-[17px] leading-[1.5] tracking-[-0.022em] text-[#424245] lg:col-span-7">
          <p>
            Beide Stadtteile gehören zum Bezirk Altona. Wer aber „Physiotherapie
            Ottensen“ sucht, will nicht nach Altona-Altstadt. Solche
            Unterschiede kennen wir, weil wir hier wohnen, und wir schreiben sie
            in Seitentitel und Texte.
          </p>
          <p>
            Für Betriebe außerhalb Hamburgs machen wir dasselbe mit Ihrem Ort.
            Besprochen wird dann am Telefon oder per Video.
          </p>
        </div>
      </div>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Register der übrigen Seiten, gesetzt wie ein Inhaltsverzeichnis.
 * ---------------------------------------------------------------- */
const SEITEN: { href: string; title: string; line: string }[] = [
  {
    href: "/manifest",
    title: "Manifest",
    line: "Acht Grundsätze darüber, wie wir arbeiten.",
  },
  {
    href: "/auswahl",
    title: "Auswahl",
    line: "Welche Aufträge wir annehmen und wie wir das entscheiden.",
  },
  {
    href: "/inventar",
    title: "Inventar",
    line: "Womit wir bauen und wo wir hosten, jeweils mit Begründung.",
  },
  {
    href: "/jetzt",
    title: "Jetzt",
    line: "Was gerade ansteht: freie Gesprächstage, Sprechstunde, neue Texte.",
  },
  {
    href: "/erreichbarkeit",
    title: "Erreichbarkeit",
    line: "Wann wir antworten und was im Urlaub passiert.",
  },
  {
    href: "/honorar",
    title: "Honorar",
    line: "Unser Stundensatz und wie daraus die Paketpreise entstehen.",
  },
  {
    href: "/lexikon",
    title: "Lexikon",
    line: `${LEXIKON.length} Webbegriffe, in Alltagsdeutsch erklärt.`,
  },
  {
    href: "/journal",
    title: "Journal",
    line: "Längere Texte über Preise, Baukästen und die Suche bei Google.",
  },
];

function Register() {
  return (
    <Abschnitt
      id="register"
      fett="Was wir sonst noch aufgeschrieben haben."
      grau="Zum Nachlesen."
    >
      <ul
        role="list"
        className="divide-y divide-black/10 rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10"
      >
        {SEITEN.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group grid gap-1 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
            >
              <span className="text-[19px] font-semibold tracking-[-0.02em] underline-offset-4 group-hover:underline sm:col-span-3 sm:text-[21px]">
                {s.title}
              </span>
              <span className="text-[15px] leading-relaxed text-[#6e6e73] sm:col-span-7 sm:text-[17px]">
                {s.line}
              </span>
              <span className="notiz-mono hidden justify-end sm:col-span-2 sm:flex">
                {s.href} <span aria-hidden="true">&nbsp;›</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Abschnitt>
  );
}
