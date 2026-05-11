import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "FAQ | Sitalo Webdesign",
  description:
    "Antworten auf häufige Fragen zur Website-Erstellung, Preisen, Hosting, SEO und Betreuung.",
  alternates: { canonical: "/faq" },
};

const FAQ: Array<{ question: string; answer: string }> = [
  {
    question: "Muss ich mich registrieren?",
    answer:
      "Nein. Für eine Anfrage reicht das Formular oder WhatsApp. Sie müssen keinen Account erstellen.",
  },
  {
    question: "Wie schnell ist meine Website fertig?",
    answer:
      "Viele einfache Websites können innerhalb von 1–2 Werktagen nach vollständiger Datenlieferung umgesetzt werden. Bei größeren Projekten klären wir den Zeitplan vor Projektbeginn — transparent und verbindlich.",
  },
  {
    question: "Was muss ich liefern?",
    answer:
      "Logo, Bilder, Texte, Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, klären wir das gemeinsam — wir helfen bei Struktur und Formulierung.",
  },
  {
    question: "Kann ich später Inhalte ändern lassen?",
    answer:
      "Ja. Änderungen können wir im Rahmen der monatlichen Betreuung übernehmen. Je nach Paket sind 1, 3 oder 6 Änderungen pro Monat inklusive.",
  },
  {
    question: "Kann ich bestimmte Inhalte selbst verwalten?",
    answer:
      "Auf Wunsch ja. Im Premium-System können bestimmte Inhalte direkt auf Ihrer Website verwaltbar gemacht werden — zum Beispiel Öffnungszeiten, Speisekarte, Wochenangebot, Leistungen oder Bilder. Das ist eine optionale Funktion, kein zentrales Login-Portal.",
  },
  {
    question: "Was kostet eine Website?",
    answer:
      "Wir arbeiten mit drei Einstiegspaketen: Starter-Projekt ab 499 €, Business-Auftritt ab 899 €, Premium-System ab 1.499 € (jeweils einmalig). Dazu kommt eine monatliche Betreuung ab 49 € / 79 € / 129 €. Der finale Preis hängt vom Projekt-Umfang ab.",
  },
  {
    question: "Warum gibt es Einstiegspreise statt fester Endpreise?",
    answer:
      "Die Pakete geben eine klare Orientierung. Der finale Preis hängt davon ab, welche Inhalte vorhanden sind, welche Funktionen gewünscht werden und wie umfangreich die Website wird. Nach Ihrer Anfrage erhalten Sie eine klare und verbindliche Einschätzung.",
  },
  {
    question: "Ist Hosting enthalten?",
    answer:
      "Ja. Hosting ist im monatlichen Beitrag enthalten — Server in der EU, SSL-Verschlüsselung, regelmäßige Backups. Sie brauchen kein eigenes Hosting zu organisieren.",
  },
  {
    question: "Wird meine Website mobil optimiert?",
    answer:
      "Ja, immer. Wir bauen Mobile-First — die Website funktioniert auf Smartphone, Tablet und Desktop gleichermaßen gut. Wir testen auf echten Geräten vor der Live-Schaltung.",
  },
  {
    question: "Sind SEO-Grundlagen enthalten?",
    answer:
      "Ja. Saubere Seiten-Titel, Meta-Beschreibungen, klare Überschriften-Struktur, lokale Suchbegriffe, Sitemap und schnelle Ladezeiten sind in allen Paketen enthalten. Wir versprechen keine Google-Platz-1-Garantien, aber legen die solide Basis.",
  },
  {
    question: "Sind Impressum und Datenschutz enthalten?",
    answer:
      "Wir integrieren die entsprechenden Seiten und Bereiche technisch. Rechtssichere Inhalte (Impressums-Text, Datenschutzerklärung) sollten Sie selbst oder von einem geeigneten Anbieter beziehen — wir können bei Bedarf Empfehlungen aussprechen.",
  },
  {
    question: "Kann ich meine bestehende Website modernisieren lassen?",
    answer:
      'Ja. Im Anfrage-Formular können Sie „Redesign" auswählen und die URL Ihrer aktuellen Website angeben. Wir prüfen den Bestand und schlagen eine Modernisierung vor — manchmal lohnt sich auch ein Neuaufbau, das klären wir nach Ihrer Anfrage.',
  },
  {
    question: "Für welche Branchen erstellt Sitalo Websites?",
    answer:
      "Wir sind auf lokale Unternehmen spezialisiert: Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés und Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios und weitere lokale Dienstleister. Eine Übersicht steht auf der Branchen-Seite.",
  },
  {
    question: "Kann ich per WhatsApp anfragen?",
    answer:
      "Ja. Auf der Anfrage-Seite finden Sie einen WhatsApp-Link mit vorgefüllter Nachricht. Für eine vollständige Projekt-Aufnahme ist das Formular allerdings besser geeignet, weil wir dann alle relevanten Angaben strukturiert vorliegen haben.",
  },
  {
    question: "Was passiert nach dem Absenden der Anfrage?",
    answer:
      "Sie erhalten eine kurze Empfangsbestätigung. Wir prüfen Ihre Angaben und melden uns innerhalb von 24 Stunden persönlich mit einer ersten Einschätzung — Umfang, Zeitplan, verbindlicher Preisrahmen. Es entstehen für Sie noch keine Kosten.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <Accordion />
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
          FAQ
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          Häufige Fragen
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
          Antworten auf die Fragen, die wir am häufigsten gestellt bekommen.
          Sollte etwas fehlen, schreiben Sie uns einfach.
        </p>
      </div>
    </section>
  );
}

function Accordion() {
  return (
    <section className="border-border/40 border-b py-16 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-6">
        <dl className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="bg-card border-border/60 group rounded-xl border p-5 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                {item.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed text-pretty">
                {item.answer}
              </p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
          Weitere Frage?
        </h2>
        <p className="text-background/70 mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg">
          Schreiben Sie uns über das Anfrage-Formular oder WhatsApp — wir
          antworten innerhalb von 24 Stunden.
        </p>
        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Projekt anfragen
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/kontakt"
            className="border-background/30 text-background hover:bg-background/10 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-7 text-[15px] font-medium tracking-tight transition-colors"
          >
            Kontakt-Seite
          </Link>
        </div>
      </div>
    </section>
  );
}
