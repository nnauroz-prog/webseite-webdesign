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
    <section className="bg-secondary/40 border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-36">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Ablauf
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
              Sechs Schritte.
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                Vom Hallo zum Live-Gang.
              </span>
            </h1>
          </div>
          <p className="text-foreground/80 max-w-md text-pretty text-lg leading-relaxed sm:text-xl">
            Sie schreiben mir, wir sprechen, ich baue — und danach bleibe
            ich da. Kein Papierkram dazwischen, kein verlorenes Ticket.
          </p>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-32">
        {/* Vertical timeline spine — hidden on mobile, centered on lg+ */}
        <div
          aria-hidden="true"
          className="border-border/70 absolute top-20 bottom-20 left-1/2 hidden -translate-x-1/2 border-l lg:block"
        />
        <ol className="space-y-20 sm:space-y-28">
          {STEPS.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={step.number}
                className={`relative grid gap-10 lg:grid-cols-2 lg:gap-20 ${
                  right ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div
                  className={
                    right
                      ? "lg:pl-16 lg:text-left"
                      : "lg:pr-16 lg:text-right"
                  }
                >
                  <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                    {step.title}
                  </h2>
                  <p className="text-foreground/75 mt-6 text-pretty text-base leading-relaxed sm:text-lg">
                    {step.body}
                  </p>
                </div>
                <div
                  className={
                    right
                      ? "lg:pr-16 lg:text-right"
                      : "lg:pl-16 lg:text-left"
                  }
                >
                  <ul
                    className={
                      right
                        ? "lg:[&>li]:justify-end space-y-3"
                        : "space-y-3"
                    }
                  >
                    {step.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-foreground/80 flex items-baseline gap-3 text-[15px] leading-relaxed sm:text-base"
                      >
                        <span className="text-muted-foreground/60 font-mono text-xs">
                          ·
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Spine marker — large numeral on the center line */}
                <div
                  aria-hidden="true"
                  className="bg-background absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 px-3 lg:block"
                >
                  <span className="serif text-foreground/25 block text-[6rem] font-normal leading-none tracking-[-0.04em]">
                    {step.number}
                  </span>
                </div>

                {/* Mobile: numeral on top, no spine */}
                <span className="serif text-foreground/20 absolute -top-12 left-0 text-[5rem] font-normal leading-none tracking-[-0.04em] lg:hidden">
                  {step.number}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Tempo() {
  return (
    <section className="bg-secondary/40 border-border/40 border-t border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-24 text-center sm:py-32">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          Tempo
        </p>
        <h2 className="text-foreground mx-auto mt-8 max-w-3xl text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-5xl">
          Viele einfache Seiten sind bei mir{" "}
          <span className="serif-italic text-foreground/50 font-normal">
            in 1–2 Werktagen
          </span>{" "}
          fertig.
        </h2>
        <p className="text-muted-foreground mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Bei größeren Projekten oder fehlenden Inhalten besprechen wir
          vorab einen verbindlichen Termin.
          <span className="serif-italic"> Ich verspreche nichts, was ich nicht halten kann.</span>
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
        <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Schritt 01.
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                Sie schreiben mir.
              </span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
              Antwort innerhalb von 24 Stunden. Persönlich, von mir.
            </p>
          </div>
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
          >
            Anfrage starten
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

