import type { Metadata } from "next";
import { Fragment } from "react";
import { ogFor } from "@/lib/seo";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { WARTUNG_PREISE } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `Website-Wartung und Pflege ab ${WARTUNG_PREISE.basis} im Monat`,
  description: `Website-Wartung ab ${WARTUNG_PREISE.basis} im Monat: Hosting, Updates und kleine Änderungen, auch für Seiten, die wir nicht gebaut haben. Jetzt anfragen.`,
  alternates: { canonical: "/wartung" },
  openGraph: ogFor("/wartung"),
};

/**
 * `/wartung` — eigenständige Produkt-Seite für laufende Pflege und
 * On-Demand-Werkbank-Stunden.
 *
 * Zielgruppe: Inhaber existierender Websites (nicht von uns gebaut),
 * die einen verlässlichen Wartungs-Partner suchen, statt jedes Mal
 * jemand neuen zu beauftragen. Bei Bedarf mit festen Stunden für
 * Gestaltung und Technik als Werkbank (dritter Tarif).
 *
 * Ausdrücklich kein Re-Launch-Pitch — wer den Anlass für einen
 * Neubau sucht, landet auf /anfrage. Hier geht es um den ruhigen
 * Hintergrund-Dienst plus optional die Werkbank.
 *
 * Aufbau (Apple-Stil): Tarife als drei gerundete Karten wie die
 * Paket-Modelle, Anlässe als Bento-Kacheln, Fragen als Karten,
 * schwarzer Abschluss mit Telefonnummer und Durchsicht.
 */

/** „359 €" → 359 für die strukturierten Daten. */
const zahl = (betrag: string) => Number(betrag.replace(/\D/g, ""));

type Plan = {
  slug: string;
  /** Name wie im Anfrage-Link (?vorhaben=Wartung+…), nicht ändern. */
  name: string;
  /** Betrag ohne „ab“ und Zeiteinheit. */
  price: string;
  description: string;
  contents: string[];
  limits: string[];
};

const PLANS: Plan[] = [
  {
    slug: "basis",
    name: "Basis",
    price: WARTUNG_PREISE.basis,
    description: "Für Seiten, die vor allem sicher und aktuell bleiben sollen.",
    contents: [
      "Hosting auf einem Server in der EU, Umzug zu uns inklusive (Wix und Squarespace bleiben beim Anbieter)",
      "SSL-Zertifikat, das sich selbst verlängert",
      "Sicherheits- und Software-Updates jeden Monat",
      "Tägliche Backups, 30 Tage zurück abrufbar",
      "Eine kleine Änderung am Inhalt pro Monat",
      "Antwort meist am selben Werktag",
    ],
    limits: [
      "Größere Umbauten der Gestaltung",
      "Mehr als eine kleine Änderung im Monat",
      "Neue Funktionen",
    ],
  },
  {
    slug: "plus",
    name: "Plus",
    price: WARTUNG_PREISE.plus,
    description:
      "Für Seiten, auf denen sich öfter etwas ändert, etwa die Speisekarte, eine Aktion oder das Team.",
    contents: [
      "Alles aus Basis",
      "Bis zu drei kleine Änderungen pro Monat",
      "Monatliche Prüfung von Ladezeit, Handy-Ansicht und Formularen",
      "Bevorzugte Bearbeitung, Antwort meist noch am selben Tag",
      "Saisonale Anpassungen, etwa zu Weihnachten oder zur Sommerpause",
    ],
    limits: [
      "Werbekampagnen und bezahlte Anzeigen",
      "Mehr als drei kleine Änderungen im Monat",
      "Neue Bereiche mit eigener Seite, die rechnen wir nach Stunden ab",
    ],
  },
  {
    slug: "werkbank",
    name: "Werkbank",
    price: WARTUNG_PREISE.werkbank,
    description:
      "Wartung plus feste Stunden im Monat für Gestaltung und Technik, ohne für jede Kleinigkeit ein neues Projekt aufzusetzen.",
    contents: [
      "Alles aus Plus",
      "Zwei Werkbank-Stunden pro Monat, frei einsetzbar",
      "Ungenutzte Stunden gehen in den Folgemonat mit, bis zu vier",
      "Für Gestaltung, Technik, Texte oder eine Beratung",
      "Etwa für einen neuen Bereich, kürzere Ladezeiten oder eine neue Gliederung",
      "Einmal im Quartal ein Termin, bei dem wir gemeinsam auf die Seite schauen",
    ],
    limits: [
      "Größere Neubauten wie eine komplette Seite oder ein Shop ab 30 Artikeln, dafür gibt es ein eigenes Projekt",
      "Stunden, die zwei Monate liegen bleiben, verfallen",
      "Eine Auszahlung der Stunden",
    ],
  },
];

export default function WartungPage() {
  // Service + Breadcrumb + FAQPage als JSON-LD-Trio — gleicher
  // SEO-Footprint wie auf /branchen/[slug] und den Vertikal-Landings.
  // Macht /wartung als eigenständiges Service-Angebot indexierbar
  // („Website-Wartung Hamburg" als separater Suchpfad neben
  // „Webdesign Hamburg").
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Website-Wartung & Werkbank",
    description:
      "Hosting, Updates, kleine Änderungen und auf Wunsch Stunden für Gestaltung, Technik und Beratung, auch für Websites, die wir nicht selbst gebaut haben.",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Website-Wartung",
    url: `${SITE_URL}/wartung`,
    offers: [
      {
        "@type": "Offer",
        name: "Wartung Basis",
        price: String(zahl(WARTUNG_PREISE.basis)),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: zahl(WARTUNG_PREISE.basis),
          priceCurrency: "EUR",
          unitText: "MONTH",
          valueAddedTaxIncluded: true,
        },
      },
      {
        "@type": "Offer",
        name: "Wartung Plus",
        price: String(zahl(WARTUNG_PREISE.plus)),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: zahl(WARTUNG_PREISE.plus),
          priceCurrency: "EUR",
          unitText: "MONTH",
          valueAddedTaxIncluded: true,
        },
      },
      {
        "@type": "Offer",
        name: "Werkbank",
        price: String(zahl(WARTUNG_PREISE.werkbank)),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: zahl(WARTUNG_PREISE.werkbank),
          priceCurrency: "EUR",
          unitText: "MONTH",
          valueAddedTaxIncluded: true,
        },
      },
    ],
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
        name: "Wartung & Werkbank",
        item: `${SITE_URL}/wartung`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const jsonLd = [serviceLd, breadcrumbLd, faqLd];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <Produktleiste
        titel="Wartung"
        links={[
          { href: "#tarife", label: "Tarife" },
          { href: "#anlaesse", label: "Anlässe" },
          { href: "#fragen", label: "Fragen" },
        ]}
        cta={{ href: "/anfrage?vorhaben=Wartung", label: "Anfragen" }}
      />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Wartung"
          eyebrow="Liegegeld · Wartung und Pflege"
          titel="Website-Wartung für Seiten, die schon laufen"
          unter="Wir übernehmen Hosting, Updates und kleine Änderungen, auch wenn wir die Seite nicht selbst gebaut haben. Das geht mit WordPress, Wix oder Squarespace. Bei WordPress fallen jeden Monat Updates an, deshalb sehen wir uns die Seite vorher an und nennen Ihnen den passenden Tarif."
          aktionen={
            <>
              <Link
                href="/anfrage?vorhaben=Wartung"
                className="btn-signal btn-gross"
              >
                Anfrage schreiben
              </Link>
              <MehrLink href="#tarife" groesse="unter">
                Tarife ansehen
              </MehrLink>
            </>
          }
          meta={
            <span>
              Ab {WARTUNG_PREISE.basis} im Monat · nach 6 Monaten monatlich
              kündbar
            </span>
          }
          bild={
            <FotoRahmen
              vorab
              src="/images/workspace-macbook.webp"
              alt="Hände an einer Laptop-Tastatur von oben, daneben ein aufgeschlagenes Notizbuch und eine Tasse Kaffee"
              aspect="21 / 9"
              aspectMobil="16 / 10"
              position="45% 45%"
            />
          }
          unterschrift="Am Schreibtisch: die Seite ansehen, bevor wir einen Tarif nennen"
        />
        <Plans />
        <Anlaesse />
        <Faq />
        <KontaktKarte
          eyebrow="Durchsicht"
          titel="Bevor Sie einen Tarif wählen, sehen wir uns Ihre Seite an."
          zeile="Schicken Sie uns die Adresse Ihrer Seite. Meist innerhalb von zwei Werktagen bekommen Sie drei bis fünf konkrete Punkte, kostenlos."
          pille={{ href: "/audit", label: "Durchsicht anfordern" }}
          link={{
            href: "/anfrage?vorhaben=Wartung",
            label: "Anfrage schreiben",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Wartung" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Tarife als drei weiße Karten. Per Subgrid liegen Name, Satz, Preis
 * und Knopf in allen drei Karten auf einer Linie; Werkbank schwarz.
 * ---------------------------------------------------------------- */
function Plans() {
  return (
    <Abschnitt
      id="tarife"
      fett="Drei Tarife."
      grau="Für die laufende Pflege."
      unter={
        <>
          Preise inkl. 19&nbsp;% MwSt. Die Übernahme Ihrer Seite (Zugänge
          prüfen, Bestand sichern) kostet einmalig ab{" "}
          {WARTUNG_PREISE.uebernahme} und entfällt, wenn Sie auf unser Hosting
          umziehen.
        </>
      }
    >
      {/* Am Handy drei Reiter statt drei Tarifkarten untereinander (reines
          CSS mit :has; ohne Unterstützung stehen alle drei Karten da). */}
      <div className="umfang umfang-md">
        <div
          className="umfang-reiter"
          role="radiogroup"
          aria-label="Tarif anzeigen"
        >
          {PLANS.map((plan, i) => (
            <Fragment key={plan.slug}>
              <input
                type="radio"
                name="tarif"
                id={`wt-${i + 1}`}
                defaultChecked={i === 0}
                className="sr-only"
              />
              <label htmlFor={`wt-${i + 1}`}>{plan.name}</label>
            </Fragment>
          ))}
        </div>
        <ul
          role="list"
          className="grid gap-3 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto_1fr] md:gap-x-5 md:gap-y-0"
        >
          {PLANS.map((plan) => (
            <PlanKarte key={plan.slug} plan={plan} />
          ))}
        </ul>
      </div>
    </Abschnitt>
  );
}

function PlanKarte({ plan }: { plan: Plan }) {
  // „Alles aus Basis" steht als Vorzeile über der Liste, nicht als Punkt darin.
  const basis = plan.contents[0]?.startsWith("Alles aus")
    ? plan.contents[0]
    : null;
  const items = basis ? plan.contents.slice(1) : plan.contents;
  const nameId = `tarif-${plan.slug}-name`;
  return (
    <li
      id={plan.slug}
      className="grid scroll-mt-28 rounded-[18px] bg-white px-[22px] pt-7 pb-7 shadow-[0_4px_16px_rgb(0_0_0/0.08)] sm:px-7 md:row-span-5 md:grid-rows-subgrid"
    >
      <h3
        id={nameId}
        className="text-[21px] leading-[25px] font-bold lg:text-[24px] lg:leading-[28px]"
      >
        {plan.name}
      </h3>
      <p className="mt-2 text-[15px] leading-[22px] text-pretty text-[#6e6e73] sm:text-[17px] sm:leading-[25px]">
        {plan.description}
      </p>
      <p className="mt-5 text-[28px] leading-[32px] font-bold tracking-[-0.01em] tabular-nums">
        <span data-zaehl="">ab {plan.price}</span>
        <span className="ml-1.5 text-[14px] font-normal tracking-normal text-[#6e6e73]">
          im Monat
        </span>
      </p>
      <div className="mt-5">
        <Link
          href={`/anfrage?vorhaben=Wartung+${plan.name}`}
          aria-describedby={nameId}
          className="btn-signal btn-mittel"
        >
          Anfragen
        </Link>
      </div>
      <div className="mt-7 border-t border-black/10 pt-6">
        {basis ? (
          <p className="text-[14px] leading-5 font-semibold text-[#6e6e73]">
            {basis}, dazu
          </p>
        ) : null}
        <ul
          role="list"
          className={`${basis ? "mt-3" : ""} space-y-3 text-[15px] leading-[1.4] tracking-[-0.012em]`}
        >
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <Haken />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-7 text-[14px] leading-5 font-semibold text-[#6e6e73]">
          Nicht enthalten
        </p>
        <ul
          role="list"
          className="mt-3 space-y-2 text-[14px] leading-5 text-[#6e6e73]"
        >
          {plan.limits.map((l) => (
            <li key={l} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.6em] h-px w-3 shrink-0 bg-current"
              />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function Haken() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="text-gold-ink mt-[0.2em] h-4 w-4 shrink-0"
    >
      <path
        d="M3 8.5l3.2 3L13 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------
 * Anlässe: warum jemand mit einer fertigen Seite zu uns kommt.
 * ---------------------------------------------------------------- */
const CASES = [
  {
    title: "Der Vorgänger ist nicht mehr erreichbar",
    body: "Wir übernehmen die Zugänge, sichern den Bestand und pflegen die Seite weiter.",
  },
  {
    title: "Die Seite ist lange nicht gepflegt worden",
    body: "Wir bringen Software, Zertifikat und Erweiterungen (Plugins) auf den aktuellen Stand, ohne die Seite neu aufzusetzen.",
  },
  {
    title: "Das Formular geht am Freitag nicht",
    body: "Rufen Sie an. Im Tarif Plus kümmern wir uns bevorzugt darum, meist noch am selben Tag.",
  },
  {
    title: "Kleine Arbeiten ohne eigenes Angebot",
    body: "Mit der Werkbank haben Sie zwei Stunden im Monat, ohne jedes Mal ein Angebot einzuholen.",
  },
];

function Anlaesse() {
  const [vorgaenger, lange, formular, klein] = CASES;
  return (
    <Abschnitt
      id="anlaesse"
      fett="Typische Anlässe."
      grau="Wann eine Übergabe sinnvoll ist."
    >
      <BildRaster>
        <BildKachel
          spalten={7}
          gross
          titel={vorgaenger.title}
          zeile={vorgaenger.body}
          foto={{
            src: "/images/atmosphere/handwerker-werkbank.webp",
            alt: "Werkbank mit Hobel, Stechbeiteln und Holzspänen in warmem Licht",
            position: "50% 55%",
            sizes: "(min-width: 1068px) 560px, calc(100vw - 32px)",
          }}
        />
        <BildKachel
          ton="nacht"
          spalten={5}
          titel={lange.title}
          zeile={lange.body}
          bildInhalt={<UpdateHinweis />}
        />
        <BildKachel
          ton="nacht"
          spalten={5}
          titel={formular.title}
          zeile={formular.body}
          bildInhalt={<FormularFehler />}
        />
        <BildKachel
          spalten={7}
          gross
          titel={klein.title}
          zeile={klein.body}
          foto={{
            src: "/images/sitalo-pflege-laptop.webp",
            alt: "Laptop am Empfang eines Pflegedienstes mit der Musterseite des Dienstes",
            position: "50% 50%",
            sizes: "(min-width: 1068px) 560px, calc(100vw - 32px)",
            muster: true,
          }}
        />
      </BildRaster>
    </Abschnitt>
  );
}

/** Gestalteter Hinweis einer lange nicht gepflegten Seite (Beispiel). */
function UpdateHinweis() {
  const zeilen = [
    { t: "Seiten-Software", v: "6.1 → 6.7" },
    { t: "Kontaktformular-Erweiterung", v: "3 Versionen alt" },
    { t: "SSL-Zertifikat", v: "läuft in 6 Tagen ab" },
  ];
  return (
    <div className="rounded-[14px] bg-[#1c1c1e] p-4 text-left shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff9f0a] text-[13px] leading-none font-bold text-[#1c1c1e]">
          !
        </span>
        <p className="text-[14px] leading-5 font-semibold text-[#f5f5f7]">
          3 Punkte veraltet
        </p>
      </div>
      <ul role="list" className="mt-3 divide-y divide-white/10">
        {zeilen.map((r) => (
          <li
            key={r.t}
            className="flex items-baseline justify-between gap-3 py-2 text-[13px] leading-[18px]"
          >
            <span className="min-w-0 text-[#e5e5ea]">{r.t}</span>
            <span className="shrink-0 text-[12px] text-[#ff9f5a]">{r.v}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-semibold text-[#f5f5f7]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#30d158]" />
        Nach der Übernahme: alles aktuell
      </p>
    </div>
  );
}

/** Gestaltete Fehlermeldung eines Kontaktformulars (Beispiel). */
function FormularFehler() {
  return (
    <div className="rounded-[14px] bg-[#1c1c1e] p-4 text-left shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
      <p className="text-[13px] font-semibold text-[#f5f5f7]">Kontakt</p>
      <span className="mt-2 block rounded-md bg-[#2c2c2e] px-2.5 py-1.5 text-[12px] text-[#e5e5ea]">
        Jana Beispiel
      </span>
      <span className="mt-1.5 block rounded-md bg-[#2c2c2e] px-2.5 py-1.5 text-[12px] text-[#e5e5ea]">
        Termin für Samstag möglich?
      </span>
      <div className="mt-3 flex items-start gap-2 rounded-md bg-[#3a1d1d] px-2.5 py-2 text-[12px] leading-[17px] text-[#ffb4ab]">
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          className="mt-[1px] shrink-0"
        >
          <circle
            cx="8"
            cy="8"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 4.5v4M8 11h.01"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es
        später erneut.
      </div>
      <p className="mt-3 text-[12px] leading-[17px] text-[#a1a1a6]">
        Freitag, 17:48 Uhr. Ein Anruf bei uns, und das Formular läuft wieder.
      </p>
    </div>
  );
}

// FAQ-Items modul-level gehoben, damit JSON-LD und Render aus
// derselben Quelle ziehen können.
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Können Sie auch Wix oder Squarespace warten?",
    a: "Ja. Wir pflegen Inhalte, sichern per Export, prüfen die Ladezeit und passen kleinere Dinge an der Gestaltung an, auch auf diesen Baukästen. Das Hosting bleibt in dem Fall beim Anbieter, Sie bezahlen es weiter direkt bei Wix oder Squarespace. Unser Beitrag deckt dann Pflege, Sicherung und kleine Änderungen. Mitnehmen lässt sich eine Wix-Seite nicht und eine Squarespace-Seite nur teilweise. Wer dort weg will, braucht meist eine neu gebaute Seite.",
  },
  {
    q: "Was passiert mit meiner Domain?",
    a: "Die Domain bleibt auf Ihren Namen registriert. Auf Wunsch verwalten wir die Einstellungen Ihrer Domain, die Kontrolle behalten Sie.",
  },
  {
    q: "Kann ich kündigen, wenn ich nicht zufrieden bin?",
    a: "Ja, nach den ersten sechs Monaten zum Ende jedes Monats. Sie bekommen den kompletten Bestand mit Seite, Datenbank und Inhalten als Export.",
  },
  {
    q: "Was kostet der Wechsel von Basis auf Plus?",
    a: "Die Differenz, monatlich und anteilig. Sie können jederzeit hoch- oder herunterwechseln, eine neue Mindestlaufzeit beginnt dadurch nicht.",
  },
  {
    q: "Übernehmen Sie auch Seiten mit Online-Shop?",
    a: "Bis etwa 30 Artikel ja. Für größere Shops mit Lagerverwaltung oder angebundenem Versand empfehlen wir Anbieter, die sich auf Shops spezialisiert haben.",
  },
  {
    q: "Wofür kann ich die Werkbank-Stunden nutzen?",
    a: "Für Arbeiten an der Gestaltung, einen neuen Bereich, kürzere Ladezeiten, Texte, strukturierte Daten für Google oder eine Beratung dazu, was auf der Seite mehr Anfragen bringen könnte. Für einen neuen Shop oder eine App braucht es ein eigenes Projekt.",
  },
  {
    q: "Was passiert mit nicht genutzten Werkbank-Stunden?",
    a: "Bis zu vier Stunden nehmen Sie in den Folgemonat mit. Was darüber liegt oder zwei Monate ungenutzt bleibt, verfällt. Sonst sammeln sich Reste an, die wir nie abarbeiten könnten.",
  },
];

/* ------------------------------------------------------------------
 * Fragen zum Aufklappen in einem weißen Blatt wie auf /faq.
 * ---------------------------------------------------------------- */
function Faq() {
  return (
    <Abschnitt id="fragen" fett="Fragen zur Wartung." grau="Kurz beantwortet.">
      <div className="min-w-0 divide-y divide-black/10 rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-8">
        {FAQ_ITEMS.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
              <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.016em] sm:text-[19px]">
                {item.q}
              </h3>
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[22px] leading-none font-light text-[#6e6e73] transition-colors group-open:text-[#1d1d1f] group-hover:text-[#1d1d1f]"
              >
                <span className="transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-[17px] leading-[1.5] tracking-[-0.022em] text-pretty text-[#424245] sm:pr-12">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </Abschnitt>
  );
}
