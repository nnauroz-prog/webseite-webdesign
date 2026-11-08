import type { Metadata } from "next";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import a from "@/components/marketing/hafen/atelier.module.css";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { WARTUNG_PREISE } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `Website-Wartung und Pflege ab ${WARTUNG_PREISE.basis} im Monat`,
  description:
    "Hosting, Updates und kleine Änderungen, auf Wunsch Werkbank-Stunden für Gestaltung und Technik. Auch für Websites, die wir nicht selbst gebaut haben.",
  alternates: { canonical: "/wartung" },
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
    limits: ["Größere Umbauten der Gestaltung", "Mehr als eine kleine Änderung im Monat", "Neue Funktionen"],
  },
  {
    slug: "plus",
    name: "Plus",
    price: WARTUNG_PREISE.plus,
    description: "Für Seiten, auf denen sich öfter etwas ändert, etwa die Speisekarte, eine Aktion oder das Team.",
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
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Sitalo Webdesign",
    },
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
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
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
      <UnterseiteMain>
        <SeitenKopf
          krumen="Wartung"
          eyebrow="Liegegeld · Wartung und Pflege"
          titel="Website-Wartung für Seiten, die schon laufen"
          unter="Wir übernehmen Hosting, Updates und kleine Änderungen, auch wenn wir die Seite nicht selbst gebaut haben. Das geht mit WordPress, Wix oder Squarespace. Bei WordPress fallen jeden Monat Updates an, deshalb sehen wir uns die Seite vorher an und nennen Ihnen den passenden Tarif."
          aktionen={
            <>
              <Link href="/anfrage?vorhaben=Wartung" className="btn-signal btn-gross">
                Anfrage schreiben
              </Link>
              <MehrLink href="#tarife" groesse="unter">
                Tarife ansehen
              </MehrLink>
            </>
          }
          meta={<span>Ab {WARTUNG_PREISE.basis} im Monat · nach 6 Monaten monatlich kündbar</span>}
          bild={
            <FotoRahmen
              vorab
              src="/images/workspace-laptop.webp"
              alt="Aufgeklappter Laptop auf einem Holztisch, daneben ein Notizbuch, ein Glas Wasser und eine Tasse Kaffee"
              aspect="21 / 9"
              aspectMobil="16 / 10"
              position="50% 60%"
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
          link={{ href: "/anfrage?vorhaben=Wartung", label: "Anfrage schreiben" }}
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
          Preise inkl. 19&nbsp;% MwSt. Die Übernahme Ihrer Seite (Zugänge prüfen, Bestand sichern) kostet einmalig ab{" "}
          {WARTUNG_PREISE.uebernahme} und entfällt, wenn Sie auf unser Hosting umziehen.
        </>
      }
    >
      <ul role="list" className="grid gap-3 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto_1fr] md:gap-x-5 md:gap-y-0">
        {PLANS.map((plan) => (
          <PlanKarte key={plan.slug} plan={plan} />
        ))}
      </ul>
    </Abschnitt>
  );
}

function PlanKarte({ plan }: { plan: Plan }) {
  // „Alles aus Basis" steht als Vorzeile über der Liste, nicht als Punkt darin.
  const basis = plan.contents[0]?.startsWith("Alles aus") ? plan.contents[0] : null;
  const items = basis ? plan.contents.slice(1) : plan.contents;
  const nameId = `tarif-${plan.slug}-name`;
  return (
    <li
      id={plan.slug}
      className="grid scroll-mt-28 rounded-[18px] bg-white px-[22px] pt-7 pb-7 shadow-[0_4px_16px_rgb(0_0_0/0.08)] sm:px-7 md:row-span-5 md:grid-rows-subgrid"
    >
      <h3 id={nameId} className="text-[21px] leading-[25px] font-bold lg:text-[24px] lg:leading-[28px]">
        {plan.name}
      </h3>
      <p className="mt-2 text-[15px] leading-[22px] text-pretty text-[#6e6e73] sm:text-[17px] sm:leading-[25px]">
        {plan.description}
      </p>
      <p className="mt-5 text-[28px] leading-[32px] font-bold tracking-[-0.01em] tabular-nums">
        ab {plan.price}
        <span className="ml-1.5 text-[14px] font-normal tracking-normal text-[#6e6e73]">im Monat</span>
      </p>
      <div className="mt-5">
        <Link href={`/anfrage?vorhaben=Wartung+${plan.name}`} aria-describedby={nameId} className="btn-signal btn-mittel">
          Anfragen
        </Link>
      </div>
      <div className="mt-7 border-t border-black/10 pt-6">
        {basis ? <p className="text-[14px] leading-5 font-semibold text-[#6e6e73]">{basis}, dazu</p> : null}
        <ul role="list" className={`${basis ? "mt-3" : ""} space-y-3 text-[15px] leading-[1.4] tracking-[-0.012em]`}>
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <Haken />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-7 text-[14px] leading-5 font-semibold text-[#6e6e73]">Nicht enthalten</p>
        <ul role="list" className="mt-3 space-y-2 text-[14px] leading-5 text-[#6e6e73]">
          {plan.limits.map((l) => (
            <li key={l} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-current" />
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
    <svg aria-hidden="true" viewBox="0 0 16 16" className="text-gold-ink mt-[0.2em] h-4 w-4 shrink-0">
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

/**
 * Muster eines Wartungsbuchs: was in einem Monat anfällt, mit Kästchen
 * wie im Lotsen. Keine echten Daten, nur der Rhythmus der Arbeiten.
 */
const WARTUNGSBUCH: { wann: string; arbeit: string; erledigt: boolean }[] = [
  { wann: "täglich, 02:00", arbeit: "Sicherung der ganzen Seite, 30 Tage aufbewahrt", erledigt: true },
  { wann: "wöchentlich", arbeit: "Software und Erweiterungen auf Updates prüfen", erledigt: true },
  { wann: "wöchentlich", arbeit: "Kontaktformular mit einer Testanfrage prüfen", erledigt: true },
  { wann: "monatlich", arbeit: "SSL-Zertifikat und Ladezeit ansehen", erledigt: true },
  { wann: "bei Bedarf", arbeit: "Ihre kleine Änderung: neue Öffnungszeiten, ein Foto", erledigt: false },
];

function Anlaesse() {
  return (
    <Abschnitt id="anlaesse" eyebrow="Wartungsbuch · Anlässe" fett="Wann eine Übergabe sinnvoll ist">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <ol className={`${a.lvListe} kante-stark lg:col-span-6`}>
          {CASES.map((c, i) => (
            <li key={c.title} className={a.lvZeile}>
              <span className={a.lvNr}>{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className={a.lvTitel}>{c.title}</span>
                <span className={a.lvSatz}>{c.body}</span>
              </span>
              <span />
            </li>
          ))}
        </ol>
        <div className="min-w-0 lg:col-span-6">
          <table className={a.buch}>
            <caption className={a.mono}>Muster eines Wartungsbuchs, so sieht ein Monat bei uns aus</caption>
            <thead>
              <tr>
                <th scope="col">Wann</th>
                <th scope="col">Arbeit</th>
                <th scope="col">erledigt</th>
              </tr>
            </thead>
            <tbody>
              {WARTUNGSBUCH.map((z) => (
                <tr key={z.arbeit}>
                  <td>{z.wann}</td>
                  <th scope="row" className="font-normal!">
                    {z.arbeit}
                  </th>
                  <td>
                    <span className={`${a.kasten} ${z.erledigt ? a.kastenVoll : ""}`} aria-hidden="true" />
                    <span className="sr-only">{z.erledigt ? "erledigt" : "offen"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={a.lvFuss}>
            <span>☐ offen · ☑ erledigt</span>
            <span>Ein Eintrag je Arbeit, damit Sie nachsehen können.</span>
          </p>
        </div>
      </div>
    </Abschnitt>
  );
}

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
    <Abschnitt id="fragen" eyebrow="Kaimauer · Fragen" fett="Was zur Wartung oft gefragt wird">
      <dl className={a.interview}>
        {FAQ_ITEMS.map((item) => (
          <div key={item.q}>
            <dt className={a.frage}>{item.q}</dt>
            <dd className={a.antwort}>{item.a}</dd>
          </div>
        ))}
      </dl>
      <div className={a.fragenMobil}>
        {FAQ_ITEMS.map((item, i) => (
          <details key={item.q} open={i < 3}>
            <summary>
              <h3 className={a.frage}>{item.q}</h3>
            </summary>
            <p className={a.antwort}>{item.a}</p>
          </details>
        ))}
      </div>
    </Abschnitt>
  );
}
