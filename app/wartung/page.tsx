import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website-Wartung und Pflege ab 49\u00A0€ im Monat",
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
 * Aufbau: Tarife als Zeilen (kein Kartentrio), Anlässe als Liste,
 * Fragen offen gesetzt, Abschluss mit Telefonnummer und Durchsicht.
 */

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

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
    price: "49\u00A0€",
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
    price: "99\u00A0€",
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
    price: "299\u00A0€",
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
        price: "49",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 49,
          priceCurrency: "EUR",
          unitText: "MONTH",
        },
      },
      {
        "@type": "Offer",
        name: "Wartung Plus",
        price: "99",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 99,
          priceCurrency: "EUR",
          unitText: "MONTH",
        },
      },
      {
        "@type": "Offer",
        name: "Werkbank",
        price: "299",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 299,
          priceCurrency: "EUR",
          unitText: "MONTH",
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
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Wartung"
          eyebrow="Wartung und Pflege"
          title="Website-Wartung für Seiten, die schon laufen"
          meta={
            <span className="text-stahl-hell font-mono text-[12px]">
              Ab 49&nbsp;€ im Monat · nach 6 Monaten monatlich kündbar
            </span>
          }
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
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Tarife als Zeilen: Name und Preis links, Inhalt in der Mitte,
 * Abgrenzung und Knopf rechts.
 * ---------------------------------------------------------------- */
function Plans() {
  return (
    <section id="tarife" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="max-w-2xl text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
            Drei Tarife für die laufende Pflege
          </h2>
          <p className="text-muted-foreground max-w-sm text-[14.5px] leading-relaxed">
            Preise zzgl. MwSt. Die Übernahme Ihrer Seite (Zugänge prüfen, Bestand sichern) kostet einmalig ab 199&nbsp;€ und
            entfällt, wenn Sie auf unser Hosting umziehen.
          </p>
        </div>

        <div className="border-foreground mt-10 border-b lg:mt-12">
          {PLANS.map((plan) => (
            <PlanRow key={plan.slug} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanRow({ plan }: { plan: Plan }) {
  // „Alles aus Basis" steht als Vorzeile über der Liste, nicht als Punkt darin.
  const basis = plan.contents[0]?.startsWith("Alles aus") ? plan.contents[0] : null;
  const items = basis ? plan.contents.slice(1) : plan.contents;
  return (
    <article
      id={plan.slug}
      className="border-foreground grid scroll-mt-24 gap-6 border-t-[3px] py-8 lg:grid-cols-12 lg:gap-8 lg:py-10"
    >
      <div className="lg:col-span-3">
        <h3 className="text-[1.5rem] leading-tight tracking-[-0.02em]">{plan.name}</h3>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-muted-foreground text-[13px]">ab</span>
          <span className="serif text-[2.4rem] leading-none tracking-[-0.03em]">{plan.price}</span>
          <span className="text-muted-foreground text-[13px]">im Monat</span>
        </p>
      </div>

      <div className="min-w-0 lg:col-span-6">
        <p className="text-foreground/85 max-w-xl text-[16px] leading-relaxed">{plan.description}</p>
        {basis ? <p className="label-mono text-muted-foreground mt-5 text-[11px]">{basis}, dazu</p> : null}
        <ul className={`${basis ? "mt-2" : "mt-5"} grid gap-x-6 text-[14.5px] leading-snug sm:grid-cols-2`}>
          {items.map((item) => (
            <li key={item} className="border-border border-t py-2.5">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:col-span-3">
        <div>
          <p className="label-mono text-muted-foreground text-[11px]">Nicht enthalten</p>
          <ul className="text-muted-foreground mt-2 space-y-1.5 text-[13.5px] leading-snug">
            {plan.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <Link
          href={`/anfrage?vorhaben=Wartung+${plan.name}`}
          className="btn-line mt-auto h-11 self-start px-4 text-[14.5px] lg:self-stretch"
        >
          {plan.name} anfragen {ARROW}
        </Link>
      </div>
    </article>
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
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="label-mono text-muted-foreground">Typische Anlässe</p>
          <h2 className="mt-4 text-balance text-[1.9rem] leading-[1.04] tracking-[-0.03em] sm:text-[2.3rem]">
            Wann eine Übergabe sinnvoll ist
          </h2>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {CASES.map((c) => (
            <li key={c.title} className="border-border border-t py-5">
              <h3 className="text-[17px] leading-snug tracking-[-0.01em]">{c.title}</h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
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
    <section className="border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">Fragen zur Wartung</h2>
        <dl className="border-foreground mt-10 border-b lg:mt-12">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="border-border grid gap-2 border-t py-6 first:border-foreground lg:grid-cols-12 lg:gap-8">
              <dt className="text-[17.5px] font-semibold leading-snug tracking-[-0.01em] lg:col-span-5">{item.q}</dt>
              <dd className="text-muted-foreground text-[15.5px] leading-relaxed lg:col-span-7">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: Telefonnummer groß, daneben Durchsicht und Mail.
 * ---------------------------------------------------------------- */
function Abschluss() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-stahl-hell text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
            Bevor Sie einen Tarif wählen, sehen wir uns Ihre Seite an.
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
            Schicken Sie uns die Adresse Ihrer Seite. Meist innerhalb von zwei Werktagen bekommen Sie drei bis fünf Punkte
            per Mail, kostenlos.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold">
            {CONTACT_EMAIL}
          </a>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/audit" className="btn-signal">
              Durchsicht anfordern {ARROW}
            </Link>
            <Link
              href="/anfrage?vorhaben=Wartung"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
            >
              Anfrage schreiben
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
