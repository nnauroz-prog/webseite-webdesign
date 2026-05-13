import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Häufige Fragen rund um Ihre neue Website | Sitalo",
  description:
    "Antworten auf das, was Kunden mich am häufigsten fragen — Preise, Ablauf, Hosting, SEO, Betreuung.",
  alternates: { canonical: "/faq" },
};

type Group = {
  label: string;
  items: { q: string; a: string }[];
};

const GROUPS: Group[] = [
  {
    label: "Anfrage & Ablauf",
    items: [
      {
        q: "Muss ich mich irgendwo registrieren?",
        a: "Nein. Schicken Sie mir einfach das Formular oder schreiben Sie kurz auf WhatsApp — kein Account, kein Login, nichts dergleichen.",
      },
      {
        q: "Wie schnell ist meine Seite fertig?",
        a: "Wenn Sie mir alle Unterlagen geschickt haben, dauert eine einfache Seite bei mir oft nur 1–2 Werktage. Größere Projekte besprechen wir vorher in Ruhe und ich nenne Ihnen einen verbindlichen Termin — ich verspreche nichts, was ich nicht halten kann.",
      },
      {
        q: "Was brauchen Sie von mir?",
        a: "Ihr Logo (falls vorhanden), ein paar Bilder von Ihnen oder Ihrem Betrieb, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, sage ich Ihnen, was ich noch brauche — und helfe bei Formulierungen oder Bildauswahl.",
      },
      {
        q: "Was passiert nach meiner Anfrage?",
        a: "Sie bekommen sofort eine kurze Bestätigung per E-Mail. Ich schaue mir Ihre Angaben in Ruhe an und melde mich innerhalb von 24 Stunden — meist deutlich schneller — persönlich bei Ihnen. Kein Vertrag, keine Kosten, kein Druck.",
      },
      {
        q: "Kann ich per WhatsApp anfragen?",
        a: "Sehr gerne. Auf der Anfrage-Seite finden Sie einen Knopf mit vorgefüllter Nachricht. Für die vollständige Aufnahme bitte trotzdem einmal das Formular ausfüllen — dann habe ich alles strukturiert vorliegen und kann Ihnen schneller antworten.",
      },
    ],
  },
  {
    label: "Preise & Betreuung",
    items: [
      {
        q: "Was kostet das Ganze?",
        a: "Ich arbeite mit drei Einstiegspreisen: Starter ab 499 €, Business ab 899 €, Premium ab 1.499 € — jeweils einmalig für die Erstellung. Dazu kommt ein Monatsbeitrag ab 49 € / 79 € / 129 € für Hosting, Pflege und kleine Änderungen. Den genauen Endpreis nenne ich Ihnen nach Ihrer Anfrage — verbindlich, kein böses Erwachen.",
      },
      {
        q: "Warum gibt es nur Einstiegspreise?",
        a: "Weil ehrlich gesagt jedes Projekt anders ist. Manche schicken mir komplette Unterlagen, andere brauchen mehr Hilfe. Manche wollen eine Seite, andere fünf. Die Einstiegspreise zeigen Ihnen, wo es losgeht — den endgültigen Preis vereinbaren wir vorher, schwarz auf weiß.",
      },
      {
        q: "Kann ich später noch Sachen ändern lassen?",
        a: "Klar. Kleine Änderungen sind in der monatlichen Betreuung dabei (1, 3 oder 6 pro Monat, je nach Paket). Sie schreiben mir kurz, was geändert werden soll — ich melde mich, mache es, und melde mich wieder, wenn es online ist.",
      },
      {
        q: "Kann ich bestimmte Inhalte selbst pflegen?",
        a: "Wenn Sie möchten, ja. Im Premium-Paket kann ich Ihnen Bereiche einbauen, die Sie selbst aktualisieren können — Öffnungszeiten, Wochenangebot, Speisekarte, Bilder. Wenn Sie das nicht wollen, übernehme ich das. Sie entscheiden.",
      },
    ],
  },
  {
    label: "Technik & Rechtliches",
    items: [
      {
        q: "Ist Hosting dabei?",
        a: "Ja, alles inklusive. Server stehen in der EU, SSL ist Pflicht, Backups laufen automatisch. Sie müssen sich um nichts kümmern — auch nicht um Updates oder Sicherheit. Das ist mein Job.",
      },
      {
        q: "Funktioniert die Seite auch auf dem Handy?",
        a: "Ja, immer. Die meisten Ihrer Kunden schauen heute zuerst aufs Handy — also baue ich auch zuerst für das Handy. Vor dem Live-Gang teste ich auf echten Geräten, nicht nur im Simulator.",
      },
      {
        q: "Wird man die Seite bei Google finden?",
        a: "Ich lege die Basis sauber: Titel, Beschreibungen, klare Struktur, schnelle Ladezeiten, lokale Suchbegriffe, Sitemap. Garantieren kann Ihnen Platz 1 niemand seriös — aber das Fundament passt, und für lokale Suchen („Friseur Eimsbüttel\", „Pflegedienst Altona\") sind die Chancen sehr gut.",
      },
      {
        q: "Sind Impressum und Datenschutz dabei?",
        a: "Die Seiten lege ich technisch an. Den juristisch sicheren Text dazu sollten Sie aber von einer geeigneten Quelle beziehen — Generator, Anwalt oder Verband. Ich empfehle Ihnen gerne, was zu Ihrem Fall passt.",
      },
      {
        q: "Ich habe schon eine Website — kann die modernisiert werden?",
        a: 'Ja, schauen wir uns gerne an. Im Formular wählen Sie „Redesign" und schicken mir die URL. Ich melde mich nach einer ersten Sichtung mit ehrlicher Einschätzung — manchmal lohnt sich ein Update, manchmal ein Neuaufbau. Ich sage Ihnen, was sinnvoller ist.',
      },
      {
        q: "Für welche Branchen arbeiten Sie?",
        a: "Vor allem für lokale Unternehmen in und um Hamburg: Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés und Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios. Wenn Sie nicht sicher sind, ob Ihre Branche passt — fragen Sie einfach.",
      },
    ],
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        {GROUPS.map((g) => (
          <Group key={g.label} group={g} />
        ))}
        <Closer />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 pb-16 sm:pt-32 sm:pb-20 lg:pt-40">
        <h1 className="serif text-balance text-6xl font-normal leading-[1.0] tracking-[-0.025em] sm:text-7xl lg:text-[8rem]">
          Häufige
          <br />
          <span className="serif-italic">Fragen.</span>
        </h1>
        <p className="text-muted-foreground mt-10 max-w-xl text-pretty text-lg leading-relaxed">
          Was Kunden mich am häufigsten fragen. Eine Antwort fehlt?{" "}
          <Link href="/kontakt" className="text-foreground underline underline-offset-4">
            Schreiben Sie mir.
          </Link>
        </p>
      </div>
    </section>
  );
}

function Group({ group }: { group: Group }) {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          {group.label}
        </p>
        <dl className="divide-border/60 mt-10 divide-y">
          {group.items.map((item) => (
            <details key={item.q} className="group py-8 sm:py-10">
              <summary className="grid cursor-pointer list-none items-baseline gap-8 sm:grid-cols-[2fr_1fr] lg:grid-cols-[2.5fr_1fr]">
                <h3 className="text-foreground text-2xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-3xl">
                  {item.q}
                </h3>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-muted-foreground/60 group-open:text-foreground font-mono text-xs uppercase tracking-[0.25em] transition-colors">
                    Antwort
                  </span>
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
                </div>
              </summary>
              <p className="text-foreground/75 mt-6 max-w-3xl text-pretty text-[16px] leading-[1.7] sm:text-[17px]">
                {item.a}
              </p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Closer() {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="serif text-foreground max-w-xl text-balance text-3xl leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Etwas fehlt?{" "}
            <span className="serif-italic text-muted-foreground">
              Fragen Sie mich direkt.
            </span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/anfrage"
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-6 text-[15px] font-medium tracking-tight transition-all"
            >
              Projekt anfragen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/kontakt"
              className="border-foreground/20 text-foreground hover:border-foreground inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
