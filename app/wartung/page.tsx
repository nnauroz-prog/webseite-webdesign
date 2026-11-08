import type { Metadata } from "next";
import Link from "next/link";

import { Abschluss as AppleAbschluss, ContainerMotiv, MehrLink } from "@/components/marketing/apple";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { WARTUNG_PREISE } from "@/lib/pakete-data";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

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
      "Antwort auf Mails meist am selben Werktag",
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
      <MarketingHeader tone="dark" cta={false} />
      <Produktleiste
        titel="Wartung"
        links={[
          { href: "#tarife", label: "Tarife" },
          { href: "#anlaesse", label: "Anlässe" },
          { href: "#fragen", label: "Fragen" },
        ]}
        cta={{ href: "/anfrage?vorhaben=Wartung", label: "Anfragen" }}
      />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Wartung"
          eyebrow="Wartung und Pflege"
          title="Website-Wartung für Seiten, die schon laufen"
          aktionen={
            <>
              <Link href="/anfrage?vorhaben=Wartung" className="btn-signal">
                Anfrage schreiben
              </Link>
              <MehrLink href="#tarife" groesse="unter">
                Tarife ansehen
              </MehrLink>
            </>
          }
          meta={<span>Ab {WARTUNG_PREISE.basis} im Monat · nach 6 Monaten monatlich kündbar</span>}
        >
          Wir übernehmen Hosting, Updates und kleine Änderungen, auch wenn wir die Seite nicht selbst gebaut haben. Das
          geht mit WordPress, Wix oder Squarespace. Bei WordPress fallen jeden Monat Updates an, deshalb sehen wir uns
          die Seite vorher an und nennen Ihnen den passenden Tarif.
        </PageHero>
        <Plans />
        <Anlaesse />
        <Faq />
        <Abschluss />
      </main>
      <MarketingFooter crumb="Wartung" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Tarife als drei gerundete Karten (wie die Paket-Modelle): Name
 * groß, Preis groß, Satz, Pille und Inhalt; „Nicht enthalten“ grau.
 * ---------------------------------------------------------------- */
function Plans() {
  return (
    <section id="tarife" className="flaeche-hell abschnitt scroll-mt-20">
      <div className="inhalt abschnitt-kopf">
        <h2 data-auftritt="titel" className="t-abschnitt">
          Drei Tarife für die laufende Pflege
        </h2>
        <p className="t-unter">
          Preise inkl. 19&nbsp;% MwSt. Die Übernahme Ihrer Seite (Zugänge prüfen, Bestand sichern) kostet einmalig ab{" "}
          {WARTUNG_PREISE.uebernahme} und entfällt, wenn Sie auf unser Hosting umziehen.
        </p>
      </div>
      <ul role="list" className="mx-auto grid max-w-[1200px] gap-3 px-[max(var(--rinne),env(safe-area-inset-left))] md:grid-cols-3 lg:gap-5">
        {PLANS.map((plan, i) => (
          <PlanKarte key={plan.slug} plan={plan} stapel={i + 1} />
        ))}
      </ul>
    </section>
  );
}

const TARIF_TON = ["zink", "signal", "teer"] as const;

function PlanKarte({ plan, stapel }: { plan: Plan; stapel: number }) {
  // „Alles aus Basis" steht als Vorzeile über der Liste, nicht als Punkt darin.
  const basis = plan.contents[0]?.startsWith("Alles aus") ? plan.contents[0] : null;
  const items = basis ? plan.contents.slice(1) : plan.contents;
  const nameId = `tarif-${plan.slug}-name`;
  return (
    <li className="flex">
      <article id={plan.slug} data-auftritt="" className="karte karte-weiss flex w-full scroll-mt-24 flex-col p-7 text-center sm:p-9">
        <div className="modell-bild" aria-hidden="true">
          <ContainerMotiv stapel={Array.from({ length: stapel }, () => TARIF_TON[stapel - 1])} />
        </div>
        <h3 id={nameId} className="t-karte mt-5">
          {plan.name}
        </h3>
        <p className="modell-satz mx-auto !max-w-[28ch] text-pretty lg:min-h-[5.88em]">
          {plan.description}
        </p>
        <p className="modell-preis">ab {plan.price}</p>
        <p className="modell-monat">im Monat</p>
        <div className="modell-aktionen">
          <Link href={`/anfrage?vorhaben=Wartung+${plan.name}`} aria-describedby={nameId} className="btn-signal btn-mittel">
            Anfragen
          </Link>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-6 text-left">
          {basis ? <p className="text-muted-foreground text-[14px] leading-[1.43] font-semibold">{basis}, dazu</p> : null}
          <ul role="list" className={`${basis ? "mt-3" : ""} space-y-3 text-[15px] leading-[1.4] tracking-[-0.012em]`}>
            {items.map((item) => (
              <li key={item} className="flex gap-3">
                <Haken />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-7 text-[14px] leading-[1.43] font-semibold">Nicht enthalten</p>
          <ul role="list" className="text-muted-foreground mt-3 space-y-2 text-[14px] leading-[1.43]">
            {plan.limits.map((l) => (
              <li key={l} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-current" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
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

function Anlaesse() {
  return (
    <section id="anlaesse" className="flaeche-weiss abschnitt scroll-mt-20">
      <div className="inhalt abschnitt-kopf">
        <p className="t-eyebrow">Typische Anlässe</p>
        <h2 data-auftritt="titel" className="t-abschnitt mt-2">
          Wann eine Übergabe sinnvoll ist
        </h2>
      </div>
      <ul role="list" className="bento mx-auto max-w-[1200px] px-[max(var(--rinne),env(safe-area-inset-left))]">
        {CASES.map((c, i) => (
          <li
            key={c.title}
            data-auftritt="skala"
            className={`karte ${i === 1 || i === 2 ? "karte-schwarz" : ""} flex min-h-[220px] flex-col items-center justify-center p-8 text-center sm:p-12`}
          >
            <h3 className="t-kachel max-w-[18ch] text-[clamp(24px,20px+1vw,32px)]">{c.title}</h3>
            <p className="text-muted-foreground mt-3 max-w-[34ch] text-[17px] leading-[1.47] tracking-[-0.022em]">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
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
 * Fragen offen gesetzt: Frage links, Antwort rechts.
 * ---------------------------------------------------------------- */
function Faq() {
  return (
    <section id="fragen" className="flaeche-hell abschnitt scroll-mt-20">
      <div className="inhalt">
        <h2 data-auftritt="titel" className="zweiton">
          <span>Fragen zur Wartung.</span> <span className="grau">Kurz beantwortet.</span>
        </h2>
        <dl className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-10">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} data-auftritt="" className="karte karte-weiss p-7 sm:p-8">
              <dt className="text-[21px] leading-[1.19] font-semibold tracking-[-0.015em]">{item.q}</dt>
              <dd className="text-muted-foreground mt-3 text-[17px] leading-[1.47] tracking-[-0.022em]">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: schwarz, Telefonnummer groß, Pille zur Durchsicht.
 * ---------------------------------------------------------------- */
function Abschluss() {
  return (
    <AppleAbschluss
      id="kontakt"
      titel="Bevor Sie einen Tarif wählen, sehen wir uns Ihre Seite an."
      zwischen={
        <a href="tel:+491607621876" className="abschluss-nummer">
          0160&nbsp;7621876
        </a>
      }
      unter="Schicken Sie uns die Adresse Ihrer Seite. Meist innerhalb von zwei Werktagen bekommen Sie drei bis fünf Punkte per Mail, kostenlos."
      pille={{ href: "/audit", label: "Durchsicht anfordern" }}
      link={{ href: "/anfrage?vorhaben=Wartung", label: "Anfrage schreiben" }}
    >
      <MehrLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</MehrLink>
    </AppleAbschluss>
  );
}
