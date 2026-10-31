import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Globe2,
  Inbox,
  Layout,
  Search,
  ServerCog,
  Sparkles,
} from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Webdesign-Leistungen für lokale Unternehmen",
  description:
    "Was wir für Sie machen: Website bauen, Texte, Anfragen, Google-Basis, Hosting und Pflege — aus einer Hand, aus Hamburg.",
  alternates: { canonical: "/leistungen" },
};

const SECTIONS = [
  {
    icon: Layout,
    title: "Ihre Website bauen",
    intro: "Vom Onepager bis zur Mehrseiten-Website — individuell gebaut, ohne Baukasten-Vorlage.",
    bullets: ["Onepager oder mehrere Seiten", "Für Handy, Tablet und PC", "Kurze Ladezeiten"],
  },
  {
    icon: Sparkles,
    title: "Texte, die Vertrauen schaffen",
    intro: "Sie schicken Stichpunkte, wir formulieren daraus klare Texte. Sie geben frei.",
    bullets: ["Leistungen verständlich erklärt", "Team und Galerie", "Öffnungszeiten und Standort"],
  },
  {
    icon: Inbox,
    title: "Anfragen, die ankommen",
    intro: "Formular, Anruf-Knopf, Karte — jede Anfrage geht per E-Mail direkt an Sie.",
    bullets: ["Spam-Schutz ohne Captcha", "Ein Tipp zum Anrufen", "Auf Wunsch Bewerbung oder Reservierung"],
  },
  {
    icon: Search,
    title: "Bei Google auffindbar",
    intro: "Eine saubere technische Basis, damit man Sie in Ihrer Region findet.",
    bullets: ["Titel, Beschreibungen, strukturierte Daten", "Lokale Suchbegriffe", "Google-Unternehmensprofil auf Wunsch"],
  },
  {
    icon: ServerCog,
    title: "Hosting & Pflege",
    intro: "Hosting, Updates, Backups und kleine Änderungen aus einer Hand.",
    bullets: ["Hosting in Deutschland", "Updates und Backups automatisch", "Kleine Änderungen im Monatsbeitrag"],
  },
  {
    icon: Globe2,
    title: "Selbst pflegen",
    intro: "Speisekarte, Öffnungszeiten, Angebote — auf Wunsch ändern Sie das selbst.",
    bullets: ["Ohne Programmierkenntnisse", "Bilder und Preise anpassen", "Im Premium-Paket enthalten"],
  },
];

const SERVICES_LD = {
  "@context": "https://schema.org",
  "@graph": SECTIONS.map((s) => ({
    "@type": "Service",
    name: s.title,
    description: s.intro,
    provider: {
      "@type": "LocalBusiness",
      name: "Sitalo Webdesign",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Webdesign",
  })),
};

export default function LeistungenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Leistungen" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Sections />
        <FinalCta />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_LD) }}
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
          Leistungen
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Alles für Ihre Website.{" "}
          <span className="serif-italic text-muted-foreground font-normal">Aus einer Hand.</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
          Sie kümmern sich um Ihren Betrieb, wir um Ihren Auftritt im Netz.
        </p>
      </div>
    </section>
  );
}

function Sections() {
  return (
    <section className="border-border/40 border-t">
      <ul className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-12 sm:grid-cols-2 sm:px-6 sm:py-16 lg:grid-cols-3">
        {SECTIONS.map(({ icon: Icon, title, intro, bullets }) => (
          <li key={title} className="border-border/70 bg-card flex flex-col rounded-2xl border p-6">
            <span className="bg-foreground text-background inline-flex h-10 w-10 items-center justify-center rounded-full">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
            <p className="text-muted-foreground mt-2 text-[14.5px] leading-relaxed">{intro}</p>
            <ul className="border-border/60 mt-5 space-y-2 border-t pt-4 text-[14px]">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <Check className="text-gold mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="text-foreground/85">{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
          Klingt passend?{" "}
          <span className="serif-italic text-background/70">Wir melden uns persönlich.</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
          >
            Website anfragen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/pakete"
            className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-colors"
          >
            Preise ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
