import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

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
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
          Ablauf
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          So läuft es bei mir ab.
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
          Sechs Schritte, ein Ansprechpartner. Sie schreiben mir, wir
          sprechen, ich baue — und danach bleibe ich da.
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
          Viele einfache Seiten sind bei mir in 1–2 Werktagen fertig — wenn
          Sie mir Ihre Unterlagen geschickt haben.
        </h2>
        <p className="text-muted-foreground mt-4 text-pretty text-[15px] leading-relaxed">
          Bei größeren Projekten oder fehlenden Inhalten besprechen wir vorab
          einen verbindlichen Termin. Ich verspreche nichts, was ich nicht
          halten kann.
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
          Klingt nach einem guten Weg?
        </h2>
        <p className="text-background/70 mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg">
          Beantworten Sie ein paar kurze Fragen im Formular — ich melde
          mich innerhalb von 24 Stunden persönlich bei Ihnen.
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
