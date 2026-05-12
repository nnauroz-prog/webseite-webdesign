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
    question: "Muss ich mich irgendwo registrieren?",
    answer:
      "Nein. Schicken Sie mir einfach das Formular oder schreiben Sie kurz auf WhatsApp — kein Account, kein Login, nichts dergleichen.",
  },
  {
    question: "Wie schnell ist meine Seite fertig?",
    answer:
      "Wenn Sie mir alle Unterlagen geschickt haben, dauert eine einfache Seite bei mir oft nur 1–2 Werktage. Größere Projekte besprechen wir vorher in Ruhe und ich nenne Ihnen einen verbindlichen Termin — ich verspreche nichts, was ich nicht halten kann.",
  },
  {
    question: "Was brauchen Sie von mir?",
    answer:
      "Ihr Logo (falls vorhanden), ein paar Bilder von Ihnen oder Ihrem Betrieb, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, sage ich Ihnen, was ich noch brauche — und helfe bei Formulierungen oder Bildauswahl.",
  },
  {
    question: "Kann ich später noch Sachen ändern lassen?",
    answer:
      "Klar. Kleine Änderungen sind in der monatlichen Betreuung dabei (1, 3 oder 6 pro Monat, je nach Paket). Sie schreiben mir kurz, was geändert werden soll — ich melde mich, mache es, und melde mich wieder, wenn es online ist.",
  },
  {
    question: "Kann ich bestimmte Inhalte selbst pflegen?",
    answer:
      "Wenn Sie möchten, ja. Im Premium-Paket kann ich Ihnen Bereiche einbauen, die Sie selbst aktualisieren können — Öffnungszeiten, Wochenangebot, Speisekarte, Bilder. Wenn Sie das nicht wollen, übernehme ich das. Sie entscheiden.",
  },
  {
    question: "Was kostet das Ganze?",
    answer:
      "Ich arbeite mit drei Einstiegspreisen: Starter ab 499 €, Business ab 899 €, Premium ab 1.499 € — jeweils einmalig für die Erstellung. Dazu kommt ein Monatsbeitrag ab 49 € / 79 € / 129 € für Hosting, Pflege und kleine Änderungen. Den genauen Endpreis nenne ich Ihnen nach Ihrer Anfrage — verbindlich, kein böses Erwachen.",
  },
  {
    question: "Warum gibt es nur Einstiegspreise?",
    answer:
      "Weil ehrlich gesagt jedes Projekt anders ist. Manche schicken mir komplette Unterlagen, andere brauchen mehr Hilfe. Manche wollen eine Seite, andere fünf. Die Einstiegspreise zeigen Ihnen, wo es losgeht — den endgültigen Preis vereinbaren wir vorher, schwarz auf weiß.",
  },
  {
    question: "Ist Hosting dabei?",
    answer:
      "Ja, alles inklusive. Server stehen in der EU, SSL ist Pflicht, Backups laufen automatisch. Sie müssen sich um nichts kümmern — auch nicht um Updates oder Sicherheit. Das ist mein Job.",
  },
  {
    question: "Funktioniert die Seite auch auf dem Handy?",
    answer:
      "Ja, immer. Die meisten Ihrer Kunden schauen heute zuerst aufs Handy — also baue ich auch zuerst für das Handy. Vor dem Live-Gang teste ich auf echten Geräten, nicht nur im Simulator.",
  },
  {
    question: "Wird man die Seite bei Google finden?",
    answer:
      "Ich lege die Basis sauber: Titel, Beschreibungen, klare Struktur, schnelle Ladezeiten, lokale Suchbegriffe, Sitemap. Garantieren kann Ihnen Platz 1 niemand seriös — aber das Fundament passt, und für lokale Suchen („Friseur Eimsbüttel\", „Pflegedienst Altona\") sind die Chancen sehr gut.",
  },
  {
    question: "Sind Impressum und Datenschutz dabei?",
    answer:
      "Die Seiten lege ich technisch an. Den juristisch sicheren Text dazu sollten Sie aber von einer geeigneten Quelle beziehen — Generator, Anwalt oder Verband. Ich empfehle Ihnen gerne, was zu Ihrem Fall passt.",
  },
  {
    question: "Ich habe schon eine Website — kann die modernisiert werden?",
    answer:
      'Ja, schauen wir uns gerne an. Im Formular wählen Sie „Redesign\" und schicken mir die URL. Ich melde mich nach einer ersten Sichtung mit ehrlicher Einschätzung — manchmal lohnt sich ein Update, manchmal ein Neuaufbau. Ich sage Ihnen, was sinnvoller ist.',
  },
  {
    question: "Für welche Branchen arbeiten Sie?",
    answer:
      "Vor allem für lokale Unternehmen in und um Hamburg: Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés und Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios. Wenn Sie nicht sicher sind, ob Ihre Branche passt — fragen Sie einfach.",
  },
  {
    question: "Kann ich per WhatsApp anfragen?",
    answer:
      "Sehr gerne. Auf der Anfrage-Seite finden Sie einen Knopf mit vorgefüllter Nachricht. Für die vollständige Aufnahme bitte trotzdem einmal das Formular ausfüllen — dann habe ich alles strukturiert vorliegen und kann Ihnen schneller antworten.",
  },
  {
    question: "Was passiert nach meiner Anfrage?",
    answer:
      "Sie bekommen sofort eine kurze Bestätigung per E-Mail. Ich schaue mir Ihre Angaben in Ruhe an und melde mich innerhalb von 24 Stunden — meist deutlich schneller — persönlich bei Ihnen. Kein Vertrag, keine Kosten, kein Druck.",
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
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
            Häufige
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              Fragen.
            </span>
          </h1>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
            Hier finden Sie Antworten auf das, was Kunden mich am häufigsten
            fragen. Wenn Ihre Frage nicht dabei ist — schreiben Sie mir
            einfach, ich antworte persönlich.
          </p>
        </div>
      </div>
    </section>
  );
}

function Accordion() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <dl className="divide-border/70 mx-auto max-w-4xl divide-y">
          {FAQ.map((item) => (
            <details key={item.question} className="group py-6 sm:py-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.01em] sm:text-xl">
                {item.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-5 max-w-3xl text-[15px] leading-relaxed text-pretty sm:text-base">
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
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute top-10 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 text-center sm:py-32">
        <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Noch eine Frage
          <br />
          <span className="serif-italic text-background/70 font-normal">
            offen?
          </span>
        </h2>
        <p className="text-background/65 mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Schreiben Sie mir kurz — über das Formular oder WhatsApp. Ich
          melde mich persönlich innerhalb von 24 Stunden.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Projekt anfragen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/kontakt"
            className="border-background/30 text-background hover:bg-background/10 inline-flex h-12 items-center justify-center rounded-full border px-7 text-[15px] font-medium tracking-tight transition-colors"
          >
            Kontakt
          </Link>
        </div>
        <p className="serif-italic text-background/80 mt-12 text-xl">
          — Nadim Nauroz, Hamburg
        </p>
      </div>
    </section>
  );
}
