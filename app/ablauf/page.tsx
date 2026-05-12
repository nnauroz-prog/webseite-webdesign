import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Ablauf | Sitalo Webdesign",
  description:
    "So läuft es bei mir: Sie schreiben mir, wir sprechen kurz, ich baue, Sie schauen drüber, wir gehen live. Persönlich, ohne Papierkram.",
  alternates: { canonical: "/ablauf" },
};

const STEPS = [
  {
    number: "01",
    title: "Sie schreiben mir",
    body: "Schicken Sie mir das Anfrageformular oder eine kurze WhatsApp — egal was Sie bequemer finden. Ich melde mich innerhalb von 24 Stunden persönlich mit einer ersten Einschätzung: Umfang, Zeitplan, ehrlicher Preisrahmen.",
    bullets: [
      "Anfrage übers Formular oder WhatsApp",
      "Kurze Beschreibung, was Sie vorhaben",
      "Antwort von mir innerhalb von 24 Stunden",
      "Kostet nichts, verpflichtet zu nichts",
    ],
  },
  {
    number: "02",
    title: "Wir lernen uns kurz kennen",
    body: "Kurzes Telefonat oder Treffen auf einen Kaffee in Hamburg — wie es Ihnen lieber ist. Sie erzählen mir, was Ihnen wichtig ist, ich frage nach, wir klären Erwartungen. Erst danach starten wir.",
    bullets: [
      "Telefon oder Treffen — Sie entscheiden",
      "Ich höre zu, frage nach, mache mir Notizen",
      "Ehrliche Einschätzung, was sinnvoll ist",
      "Verbindliches Angebot, schwarz auf weiß",
    ],
  },
  {
    number: "03",
    title: "Sie schicken mir Ihre Unterlagen",
    body: "Logo, Bilder, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten, Kontaktdaten. Wenn etwas fehlt, sage ich Bescheid — und helfe Ihnen bei Formulierungen oder Bildauswahl.",
    bullets: [
      "Logo, Bilder, Texte",
      "Leistungen, Öffnungszeiten, Kontaktdaten",
      "Bestehende Seite (falls vorhanden) als Referenz",
      "Bei fehlenden Inhalten: ich helfe",
    ],
  },
  {
    number: "04",
    title: "Ich baue Ihre Seite",
    body: "Ich ordne Ihre Inhalte, gestalte das Design passend zu Ihrer Branche und mache eine Vorschau. Während ich baue, melde ich mich bei Bedarf mit kurzen Rückfragen — sonst bekommen Sie das Ergebnis am Stück.",
    bullets: [
      "Aufbau und Reihenfolge der Inhalte",
      "Design, das zur Branche und zu Ihnen passt",
      "Parallel für Handy und PC gebaut",
      "Sie bekommen einen Test-Link zum Anschauen",
    ],
  },
  {
    number: "05",
    title: "Sie schauen drüber, ich passe an",
    body: "Sie gehen die Seite in Ruhe durch, schicken mir Ihre Änderungswünsche gesammelt. Ich setze sie um — kein endloses Hin und Her, sondern eine saubere Korrekturrunde. Erst wenn Sie zufrieden sind, geht es weiter.",
    bullets: [
      "Vollständige Vorschau auf einem Test-Link",
      "Eine Runde gesammelter Änderungen inklusive",
      "Ich setze Ihre Wünsche sauber um",
      "Freigabe erfolgt schriftlich, klar und eindeutig",
    ],
  },
  {
    number: "06",
    title: "Ihre Seite geht online",
    body: "Nach Ihrer Freigabe übernehme ich Domain, Technik und die letzten Tests. Ab da bin ich weiter Ihr Ansprechpartner — für Hosting, kleine Änderungen, Erweiterungen. Sie schreiben mir, ich kümmere mich.",
    bullets: [
      "Domain, SSL, Hosting — alles eingerichtet",
      "Tests auf echten Geräten (Handy, Tablet, PC)",
      "Formular und Tracking geprüft",
      "Live-Schaltung am vereinbarten Termin",
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
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
            So läuft es
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              bei mir ab.
            </span>
          </h1>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
            Sechs Schritte, ein Ansprechpartner. Sie schreiben mir, wir
            sprechen, ich baue — und danach bleibe ich da.
          </p>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <ol className="divide-border/60 divide-y">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.7fr_1.6fr] lg:gap-20"
            >
              <div>
                <span className="serif text-foreground/15 block text-[6rem] font-normal leading-none tracking-[-0.04em] sm:text-[8rem]">
                  {step.number}
                </span>
                <h2 className="mt-6 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
                  {step.title}
                </h2>
              </div>
              <div>
                <p className="text-foreground/80 max-w-xl text-pretty text-lg leading-relaxed">
                  {step.body}
                </p>
                <ul className="divide-border/60 mt-8 divide-y">
                  {step.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-foreground/85 flex items-baseline gap-4 py-3 text-[15px] leading-relaxed sm:text-base"
                    >
                      <span className="text-muted-foreground/70 font-mono text-xs">
                        ·
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
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
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
          Wie schnell
        </p>
        <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          Viele einfache Seiten sind bei mir{" "}
          <span className="serif-italic text-muted-foreground font-normal">
            in 1–2 Werktagen
          </span>{" "}
          fertig — wenn Sie mir Ihre Unterlagen geschickt haben.
        </h2>
        <p className="text-muted-foreground mt-8 max-w-2xl text-pretty text-lg leading-relaxed">
          Bei größeren Projekten oder fehlenden Inhalten besprechen wir
          vorab einen verbindlichen Termin. Ich verspreche nichts, was ich
          nicht halten kann.
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute top-10 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 text-center sm:py-32">
        <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Klingt nach einem
          <br />
          <span className="serif-italic text-background/70 font-normal">
            guten Weg?
          </span>
        </h2>
        <p className="text-background/65 mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Beantworten Sie ein paar kurze Fragen im Formular — ich melde
          mich innerhalb von 24 Stunden persönlich bei Ihnen.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Projekt starten
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="serif-italic text-background/80 mt-12 text-xl">
          — Nadim Nauroz, Hamburg
        </p>
      </div>
    </section>
  );
}
