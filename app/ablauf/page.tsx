import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Ablauf | Sitalo Webdesign",
  description:
    "So einfach läuft Ihre Website-Erstellung ab: Anfrage senden, Daten liefern, Website erhalten.",
  alternates: { canonical: "/ablauf" },
};

const STEPS = [
  {
    number: "01",
    title: "Anfrage senden",
    body: "Sie senden uns das ausgefüllte Anfrage-Formular oder eine WhatsApp mit kurzer Projektbeschreibung. Wir melden uns innerhalb von 24 Stunden mit einer ersten Einschätzung — Umfang, Zeitplan, Preisrahmen.",
    bullets: [
      "Anfrage über das Formular oder WhatsApp",
      "Kurze Beschreibung Ihres Vorhabens",
      "Erste Rückmeldung innerhalb von 24 Stunden",
      "Kostenfrei und unverbindlich",
    ],
  },
  {
    number: "02",
    title: "Daten liefern",
    body: "Sie senden uns Logo, Bilder, Texte und alle Inhalte, die auf der Website stehen sollen. Was fehlt, klären wir gemeinsam — wir helfen bei Struktur und Formulierung.",
    bullets: [
      "Logo, Bilder, Texte",
      "Leistungen, Öffnungszeiten, Kontaktdaten",
      "Bestehende Website (falls vorhanden) als Referenz",
      "Bei fehlenden Inhalten: gemeinsame Erarbeitung",
    ],
  },
  {
    number: "03",
    title: "Struktur & Design",
    body: "Wir ordnen Ihre Inhalte, planen die Seitenstruktur und gestalten das Design passend zu Ihrer Branche. Sie bekommen einen klaren Plan, was wo zu sehen sein wird.",
    bullets: [
      "Inhalte werden in eine sinnvolle Reihenfolge gebracht",
      "Seitenstruktur (Onepager oder mehrseitig) wird festgelegt",
      "Design wird branchengerecht entwickelt",
      "Mobile-Layout wird parallel geplant",
    ],
  },
  {
    number: "04",
    title: "Vorschau & Abstimmung",
    body: "Sie erhalten eine vollständige Vorschau Ihrer Website. Änderungswünsche sammeln wir gebündelt — kein endloses Hin und Her, sondern eine klare Korrekturrunde.",
    bullets: [
      "Vollständige Vorschau auf einem Test-Link",
      "Eine Runde gesammelter Änderungen inklusive",
      "Wir setzen Korrekturen sauber um",
      "Freigabe erfolgt schriftlich und eindeutig",
    ],
  },
  {
    number: "05",
    title: "Veröffentlichung",
    body: "Nach Ihrer Freigabe geht die Website online. Wir kümmern uns um Domain, technische Einrichtung und die letzten Tests auf Mobilgeräten und im Kontaktformular.",
    bullets: [
      "Technische Einrichtung (Domain, SSL, Hosting)",
      "Mobile Tests auf echten Geräten",
      "Kontaktformular und Tracking-Tests",
      "Live-Schaltung am vereinbarten Termin",
    ],
  },
  {
    number: "06",
    title: "Betreuung",
    body: "Nach dem Launch übernehmen wir Hosting, Wartung und kleinere Änderungen. Größere Erweiterungen besprechen wir im Einzelfall — Sie haben einen festen Ansprechpartner.",
    bullets: [
      "Hosting und Sicherheits-Updates inklusive",
      "Kleinere Inhaltsänderungen monatlich enthalten",
      "Erweiterungen jederzeit möglich",
      "Persönlicher Ansprechpartner statt Hotline",
    ],
  },
];

export default function AblaufPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <Steps />
        <Tempo />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
          Ablauf
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          So läuft Ihre Website-Erstellung ab.
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
          Sechs klare Schritte. Sie liefern die Daten, wir bauen die Website.
        </p>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="border-border/40 border-b py-16 sm:py-24">
      <div className="mx-auto w-full max-w-4xl px-6">
        <ol className="space-y-8">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="border-border/60 bg-card rounded-3xl border p-6 shadow-sm sm:p-9"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
                <div className="text-primary text-3xl font-semibold tracking-tight sm:text-4xl">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                    {step.body}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm">
                        <Check className="text-emerald-600 mt-0.5 h-4 w-4 shrink-0" />
                        <span className="text-foreground/85">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Tempo() {
  return (
    <section className="bg-secondary/30 border-border/40 border-b py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em]">
          Wie schnell?
        </p>
        <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          Viele einfache Websites können innerhalb von 1–2 Werktagen nach
          vollständiger Datenlieferung umgesetzt werden.
        </h2>
        <p className="text-muted-foreground mt-4 text-pretty text-[15px] leading-relaxed">
          Bei größeren Projekten oder fehlenden Inhalten klären wir den
          Zeitplan vor Beginn — transparent und verbindlich.
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
          Lass uns dein Projekt starten.
        </h2>
        <p className="text-background/70 mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg">
          Beantworten Sie ein paar kurze Fragen — Sie erhalten innerhalb von
          24 Stunden eine persönliche Einschätzung.
        </p>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
        >
          Projekt starten
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
