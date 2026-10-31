import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { BODY_OFFSET, SectionHead } from "@/components/marketing/home-sections";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wartung & Werkbank",
  description:
    "Hosting, Updates, kleine Änderungen — und auf Wunsch echte Werkbank-Stunden für Design, Dev und Strategie. Auch für Websites, die wir nicht selbst gebaut haben.",
  alternates: { canonical: "/wartung" },
};

/**
 * `/wartung` — eigenständige Produkt-Seite für laufende Pflege und
 * On-Demand-Werkbank-Stunden.
 *
 * Zielgruppe: Inhaber existierender Websites (nicht von uns gebaut),
 * die einen verlässlichen Wartungs-Partner suchen, statt jedes Mal
 * jemand neuen zu beauftragen. Bei Bedarf mit echten Atelier-Stunden
 * für Design/Dev/Strategie als Werkbank On-Demand (dritter Plan).
 *
 * Ausdrücklich kein Re-Launch-Pitch — wer den Anlass für einen
 * Neubau sucht, landet auf /anfrage. Hier geht es um den ruhigen
 * Hintergrund-Dienst plus optional die Werkbank.
 */

type Plan = {
  slug: string;
  name: string;
  monthly: string;
  description: string;
  highlight?: boolean;
  contents: string[];
  limits: string[];
};

const PLANS: Plan[] = [
  {
    slug: "basis",
    name: "Basis",
    monthly: "ab 49 € / Monat",
    description:
      "Damit Ihre Seite läuft, sicher ist und immer auf dem aktuellen Stand bleibt.",
    contents: [
      "Hosting in Deutschland (Umzug auf Wunsch inklusive)",
      "SSL-Zertifikat, automatisch verlängert",
      "Sicherheits- und Software-Updates monatlich",
      "Tägliche Backups, 30 Tage rückrollbar",
      "Eine kleine Inhalts-Änderung pro Monat",
      "Antwort auf Mails meist am selben Tag",
    ],
    limits: [
      "Keine größeren Layout-Umbauten",
      "Maximal eine Änderungsrunde pro Monat",
      "Keine Neuentwicklung von Funktionen",
    ],
  },
  {
    slug: "plus",
    name: "Plus",
    monthly: "ab 99 € / Monat",
    description:
      "Wenn die Seite öfter atmet — neue Speisekarte, neue Aktion, neue Mitarbeiter.",
    highlight: true,
    contents: [
      "Alles aus Basis",
      "Bis zu drei kleine Änderungen pro Monat",
      "Monatlicher Health-Check (Performance, Mobile, Formulare)",
      "Priorisierte Antwort, meist innerhalb von 4 Stunden",
      "Saisonale Anpassungen (Weihnachten, Sommerpause) inklusive",
      "Telefonischer Direktdraht bei Notfällen",
    ],
    limits: [
      "Keine SEO-Kampagnen, keine bezahlten Anzeigen",
      "Maximal drei Änderungsrunden pro Monat",
      "Neue Bereiche (eigene Seite) auf Stundenbasis dazu",
    ],
  },
  {
    slug: "werkbank",
    name: "Werkbank On-Demand",
    monthly: "ab 299 € / Monat",
    description:
      "Wartung plus echte Atelier-Stunden für Design, Dev, Strategie — nutzbar wofür Sie wollen, ohne neues Projekt aufzusetzen.",
    contents: [
      "Alles aus Plus",
      "Zwei Werkbank-Stunden pro Monat, frei einsetzbar",
      "Übertragbar in den Folgemonat (bis maximal vier Stunden Speicher)",
      "Stunden nutzbar für Design, Dev, Content, Strategie-Sparring",
      "Auch für neuen Bereich, A/B-Test, Performance-Tuning, Re-Strukturierung",
      "Quartalsweise Sprechstunde — wir gucken gemeinsam drauf",
      "Vorrang bei kurzfristigen Anfragen",
    ],
    limits: [
      "Größere Neubauten (komplette Seite, Shop ab 30 Artikeln) brauchen ein eigenes Projekt",
      "Nicht-genutzte Stunden verfallen nach zwei Monaten",
      "Stunden nicht in Geld auszahlbar",
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
    name: "Website-Wartung & Werkbank On-Demand",
    description:
      "Hosting, Updates, kleine Änderungen und auf Wunsch echte Atelier-Stunden für Design, Dev und Strategie — auch für Websites, die wir nicht selbst gebaut haben.",
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
        name: "Werkbank On-Demand",
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
      <MarketingHeader />
      <EditorialMasthead section="Wartung & Pflege" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Plans />
        <ForWhom />
        <Faq />
        <FinalCta />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10">
        <span />
        <span />
        <span />
      </div>
      <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-8 sm:px-6 sm:pt-20 sm:pb-10">
        <EditorialEyebrow>Wartung & Werkbank</EditorialEyebrow>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Für die Seite,{" "}
          <span className="serif-italic text-muted-foreground font-normal">die schon läuft.</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
          Hosting, Updates und kleine Änderungen — auch wenn wir die Seite nicht selbst gebaut haben.
        </p>
        <ul className="text-foreground/80 mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          {["Auch für WordPress, Wix, Squarespace", "Umzug aufs Sitalo-Hosting kostenlos", "Nach 6 Monaten monatlich kündbar"].map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <Check className="text-gold h-4 w-4" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.slug} plan={plan} />
          ))}
        </div>
        <p className="text-muted-foreground mt-6 text-[13px]">
          Preise zzgl. MwSt. Einmaliges Onboarding ab 199 € — entfällt beim Umzug auf unser Hosting.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const dark = plan.highlight;
  return (
    <article
      className={`relative flex flex-col rounded-3xl border p-6 ${
        dark ? "bg-foreground text-background border-foreground" : "border-border/70 bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{plan.name}</h2>
        {dark ? (
          <span className="bg-gold text-foreground whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold">
            Häufigste Wahl
          </span>
        ) : null}
      </div>
      <p className="serif mt-5 text-4xl lining-nums leading-none tracking-[-0.03em]">{plan.monthly}</p>
      <p className={`mt-4 text-[14px] leading-relaxed ${dark ? "text-background/80" : "text-foreground/75"}`}>
        {plan.description}
      </p>
      <ul className={`mt-5 space-y-2 border-t pt-5 text-[14px] ${dark ? "border-background/15" : "border-border/60"}`}>
        {plan.contents.slice(0, 4).map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check className="text-gold mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={dark ? "text-background/90" : "text-foreground/85"}>{item}</span>
          </li>
        ))}
      </ul>
      <p className={`mt-4 mb-6 text-[12.5px] leading-relaxed ${dark ? "text-background/55" : "text-muted-foreground"}`}>
        Nicht enthalten: {plan.limits.join(" · ")}
      </p>
      <Link
        href={`/anfrage?vorhaben=Wartung+${plan.name}`}
        className={`mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-tight transition-colors ${
          dark ? "bg-background text-foreground hover:bg-background/90" : "bg-foreground text-background hover:bg-foreground/90"
        }`}
      >
        {plan.name} anfragen
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

const CASES = [
  { title: "Der Vorgänger ist weg", body: "Wir übernehmen, sichern den Bestand und führen weiter." },
  { title: "Die Seite altert", body: "Updates, Zertifikate, Plugins — wir bringen alles auf Stand, ohne Neustart." },
  { title: "Jemand, der ans Telefon geht", body: "Formular streikt am Freitag? Kein Ticket, sondern eine Person." },
  { title: "Hände statt neues Projekt", body: "Mit der Werkbank zwei Stunden im Monat für Kleines, ohne Angebot." },
];

function ForWhom() {
  return (
    <section className="border-border/40 bg-secondary/30 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHead label="Für wen" title="Wann das hilft." />
        <ul className={`mt-10 lg:mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2 ${BODY_OFFSET}`}>
          {CASES.map((c) => (
            <li key={c.title} className="border-border/60 border-t pt-4">
              <p className="text-[16px] font-semibold tracking-tight">{c.title}</p>
              <p className="text-muted-foreground mt-1 text-[14.5px] leading-relaxed">{c.body}</p>
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
    a: "Ja. Wir machen Inhalts-Pflege, Backups (per Export), Performance-Checks und kleinere Layout-Anpassungen auch auf den Baukasten-Systemen. Den Hosting-Teil bezahlt in dem Fall weiterhin Wix bzw. Squarespace direkt.",
  },
  {
    q: "Was passiert mit meiner Domain?",
    a: "Die Domain bleibt auf Ihren Namen registriert — wir verwalten nur die DNS-Einträge auf Wunsch. Sie behalten jederzeit die volle Kontrolle.",
  },
  {
    q: "Kann ich kündigen, wenn ich nicht zufrieden bin?",
    a: "Ja, zum Ende eines jeden Monats nach den ersten sechs Monaten. Wir liefern Ihnen den kompletten Bestand (Seite, Datenbank, Inhalte) als Export für einen sauberen Übergang.",
  },
  {
    q: "Was kostet die Aufstockung von Basis auf Plus?",
    a: "Differenz monatlich, anteilig. Sie können jederzeit hoch oder runter wechseln — ohne neue Mindestlaufzeit.",
  },
  {
    q: "Übernehmen Sie auch Sites mit Online-Shop?",
    a: "Bis ungefähr 30 Artikel ja. Größere Shops mit Lagerverwaltung, Versand-APIs oder ähnlichem empfehlen wir lieber an spezialisierte Shop-Wartungs-Partner weiter.",
  },
  {
    q: "Wofür kann ich die Werkbank-Stunden nutzen?",
    a: "Für alles, was im Atelier sonst auch passiert — Design-Anpassungen, neuer Bereich, Performance-Tuning, Texte feilen, A/B-Test einrichten, Schema-Markup nachbessern, Strategie-Sparring zur Conversion-Rate. Keine eigene Layout-Welt, kein neuer Shop, kein App-Bau — dafür braucht's ein Projekt.",
  },
  {
    q: "Was passiert mit nicht genutzten Werkbank-Stunden?",
    a: "Sie verfallen nicht sofort: bis zu vier Stunden Speicher übertragen sich in den Folgemonat. Was darüber liegt oder zwei Monate lang nicht genutzt wurde, verfällt — sonst sammeln sich Reste, die wir nie aufholen.",
  },
];

function Faq() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHead label="Fragen" title="Häufige Fragen." />
        <div className={`divide-border/60 mt-10 lg:mt-14 divide-y ${BODY_OFFSET}`}>
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium">
                {item.q}
                <span aria-hidden="true" className="text-muted-foreground text-xl transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="text-muted-foreground mt-3 text-[14.5px] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-dark pointer-events-none absolute inset-0">
        <span />
        <span />
        <span />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
        <h2 className="serif text-balance text-3xl leading-tight sm:text-5xl">
          Erst ansehen,{" "}
          <span className="serif-italic text-background/70">dann entscheiden.</span>
        </h2>
        <Link
          href="/audit"
          className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight"
        >
          Kostenlosen Audit anfordern
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
