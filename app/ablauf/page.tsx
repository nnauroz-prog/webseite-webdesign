import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "So läuft Ihr Website-Projekt ab — Schritt für Schritt",
  description:
    "So läuft es bei uns: Sie schreiben uns, wir sprechen kurz, wir bauen, Sie schauen drüber, wir gehen live. Persönlich, ohne Papierkram.",
  alternates: { canonical: "/ablauf" },
};

const STEPS = [
  {
    number: "01",
    title: "Sie schreiben uns",
    body: "Drei Felder im Formular oder eine kurze Mail — wir antworten persönlich, meist am selben Werktag.",
    bullets: ["Formular oder E-Mail", "Antwort von einem Menschen", "Kostenlos und unverbindlich"],
  },
  {
    number: "02",
    title: "Wir lernen uns kennen",
    body: "15 Minuten am Telefon, per Video oder — in Hamburg — bei einem Kaffee. Danach bekommen Sie ein verbindliches Angebot.",
    bullets: ["Telefon, Video oder Treffen", "Ehrliche Einschätzung", "Festpreis schwarz auf weiß"],
  },
  {
    number: "03",
    title: "Sie schicken drei Sachen",
    body: "Logo, ein paar Bilder und Stichpunkte zu Ihren Leistungen. Fehlt etwas, helfen wir.",
    bullets: ["Logo in jedem Format", "Handy-Fotos reichen", "Stichpunkte statt fertiger Texte"],
  },
  {
    number: "04",
    title: "Wir bauen Ihre Seite",
    body: "Aufbau, Texte, Bilder und Design in einem Zug. Kleine Seiten stehen oft nach 1–2 Werktagen.",
    bullets: ["Für Handy, Tablet und PC", "Passende Suchbegriffe eingebaut", "Test-Link, sobald sie steht"],
  },
  {
    number: "05",
    title: "Sie schauen drüber",
    body: "Sie sehen alles auf dem Test-Link und schicken Änderungswünsche gesammelt — wir setzen sie in einem Rutsch um.",
    bullets: ["Vollständige Vorschau", "Eine Änderungsrunde inklusive", "Freigabe erst, wenn es passt"],
  },
  {
    number: "06",
    title: "Ihre Seite geht online",
    body: "Domain, SSL, Hosting und Tests auf echten Geräten übernehmen wir. Danach bleiben wir Ihr Ansprechpartner.",
    bullets: ["Alles technisch eingerichtet", "Formular und Karte geprüft", "Live zum vereinbarten Termin"],
  },
];

export default function AblaufPage() {
  // HowTo-Schema mit den 6 Schritten — Google rendert das auf
  // mobile SERPs als nummerierte Carousel-Steps direkt im Treffer.
  // Plus BreadcrumbList für die Hierarchie.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "So läuft Ihr Website-Projekt mit Sitalo ab",
    description:
      "Sechs Schritte vom ersten Hallo zur Live-Schaltung — persönlich, ohne Papierkram, mit verbindlichem Termin.",
    totalTime: "P14D",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
      url: `${SITE_URL}/ablauf#step-${s.number}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ablauf",
        item: `${SITE_URL}/ablauf`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Ablauf" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Steps />
        <FinalCta />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([howToLd, breadcrumbLd]),
        }}
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
        <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
          <span aria-hidden="true" className="bg-gold inline-block h-px w-8" />
          Ablauf
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Sechs Schritte.{" "}
          <span className="serif-italic text-muted-foreground font-normal">Vom Hallo bis online.</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
          Kein Angebots-Pingpong, kein Ticket-System. Größere Projekte bekommen vorab einen verbindlichen Termin.
        </p>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="border-border/40 border-t">
      <ol className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-10 px-5 py-12 sm:grid-cols-2 sm:px-6 sm:py-16 lg:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.number} id={`step-${step.number}`} className="border-border/60 scroll-mt-24 border-t pt-5">
            <p className="text-gold font-mono text-[12px] tracking-[0.2em]">{step.number}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h2>
            <p className="text-muted-foreground mt-2 text-[14.5px] leading-relaxed">{step.body}</p>
            <ul className="mt-4 space-y-1.5 text-[14px]">
              {step.bullets.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <Check className="text-gold mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="text-foreground/85">{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
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
          Schritt 01:{" "}
          <span className="serif-italic text-background/70">Sie schreiben uns.</span>
        </h2>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
        >
          Website anfragen
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
