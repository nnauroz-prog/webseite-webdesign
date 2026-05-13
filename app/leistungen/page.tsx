import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Inbox,
  Layout,
  Search,
  ServerCog,
  Sparkles,
} from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Webdesign-Leistungen für lokale Unternehmen aus Hamburg",
  description:
    "Was ich für Sie mache: Webdesign, Inhalte strukturieren, Kontakt sauber, Google-Basis, Hosting, laufende Pflege. Aus Hamburg.",
  alternates: { canonical: "/leistungen" },
};

const SECTIONS = [
  {
    icon: Layout,
    title: "Ihre Website bauen",
    intro:
      "Vom kompakten Onepager bis zur größeren Seite mit mehreren Bereichen. Ich gestalte Aufbau, Design und Inhalte so, dass es zu Ihrem Betrieb passt — nicht zu einer Vorlage.",
    bullets: [
      "Onepager — alles Wichtige auf einer starken Seite",
      "Mehrseitige Seiten mit Bereichen für Leistungen, Team, Galerie, Kontakt",
      "Modernes Design, passend zur Branche und zu Ihnen",
      "Funktioniert auf Handy und Tablet genauso gut wie am PC",
      "Schnelle Ladezeiten sind bei mir Standard",
      "Klare Wege zur Anfrage — kein Kunde verirrt sich",
    ],
  },
  {
    icon: Sparkles,
    title: "Inhalte, die Vertrauen schaffen",
    intro:
      "Sie müssen kein Texter sein. Ich helfe Ihnen, Ihre Leistungen so zu beschreiben, dass Besucher sich abgeholt fühlen — und am Ende zum Hörer greifen oder schreiben.",
    bullets: [
      "Leistungen verständlich erklären, ohne Fachchinesisch",
      "Team-Bereich mit Fotos — Menschen vertrauen Menschen",
      "Galerie mit gut aufbereiteten Bildern",
      "Öffnungszeiten und Standort an der richtigen Stelle",
      "Über-uns-Bereich mit Ihrer Geschichte",
      "Beratung zu Aufbau, Reihenfolge, Formulierungen",
    ],
  },
  {
    icon: Inbox,
    title: "Anfragen, die wirklich ankommen",
    intro:
      "Was nützt eine schöne Seite, wenn Anfragen verloren gehen? Bei mir landet jede Anfrage direkt auf Ihrem Handy — ohne Umwege.",
    bullets: [
      "Kontaktformular mit Spam-Schutz",
      "Direktwahl-Button auf dem Handy",
      "Google Maps mit Standort oder Einsatzgebiet",
      "Tippen-zum-Anrufen auf dem Handy",
      "Auf Wunsch: Bewerbungs- oder Reservierungsformular",
    ],
  },
  {
    icon: Search,
    title: "Bei Google auffindbar",
    intro:
      "Ich verspreche Ihnen keinen Platz 1 — das macht niemand seriös. Aber ich lege die Basis sauber, damit Sie für die richtigen Suchen gefunden werden.",
    bullets: [
      "Saubere Seiten-Titel und Beschreibungen",
      "Klare Struktur, damit Google Ihre Seite versteht",
      "Lokale Suchbegriffe (Stadtteil, Branche) eingebaut",
      "Sitemap und maschinenlesbare Daten",
      "Schnelle Ladezeiten — auch das wertet Google",
      "Auf Wunsch: Anbindung an Google Search Console",
    ],
  },
  {
    icon: ServerCog,
    title: "Hosting & laufende Pflege",
    intro:
      "Wenn Sie es haben wollen: alles aus einer Hand. Hosting, Updates, Sicherheit, kleine Änderungen — Sie müssen sich um nichts kümmern.",
    bullets: [
      "Hosting in der EU inklusive",
      "Sicherheits-Updates und Backups automatisch",
      "Kleine Änderungen jeden Monat (je nach Paket)",
      "Technische Pflege und Monitoring im Hintergrund",
      "Erweiterungen jederzeit möglich",
      "Sie schreiben mir, ich kümmere mich",
    ],
  },
  {
    icon: Globe2,
    title: "Selbst pflegen (wenn Sie möchten)",
    intro:
      "Wenn Sie bestimmte Inhalte selbst aktualisieren möchten, baue ich Ihnen entsprechende Bereiche ein. Wenn nicht, übernehme ich das.",
    bullets: [
      "Speisekarte oder Wochenangebot selbst pflegen",
      "Öffnungszeiten kurzfristig ändern",
      "Bilder und Galerie selbst aktualisieren",
      "Leistungen und Preise jederzeit anpassen",
      "Hinweisbanner aktivieren (z. B. Feiertag, Sommerpause)",
      "Premium-Funktion — Sie entscheiden, ob Sie sie brauchen",
    ],
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
      <main className="flex-1">
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
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 -right-20 h-[36rem] w-[36rem] rounded-full blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-background/55 text-[11px] font-medium uppercase tracking-[0.3em]">
              Leistungen
            </p>
            <h1 className="mt-8 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-7xl lg:text-[6rem]">
              Sechs Dinge,
              <br />
              <span className="serif-italic text-background/65 font-normal">
                die wir übernehmen.
              </span>
            </h1>
            <p className="text-background/70 mt-10 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
              Von der ersten Idee bis zur fertigen Seite — und danach
              genauso. Sie kümmern sich um Ihren Betrieb, wir um Ihre
              Online-Präsenz.
            </p>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10 lg:block">
            <Image
              src="/images/workspace-laptop.png"
              alt="Laptop auf einem warmen Holzschreibtisch, Notizbuch und Tasse — ruhige Arbeitsatmosphäre."
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Sections() {
  return (
    <>
      {SECTIONS.map(({ icon: Icon, title, intro, bullets }, i) => {
        const dark = i % 2 === 1;
        return (
          <section
            key={title}
            className={
              dark
                ? "bg-secondary/50 border-border/40 border-t"
                : "border-border/40 border-t"
            }
          >
            <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28 lg:py-36">
              <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.4fr] lg:gap-24">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="serif text-foreground/15 block text-[8rem] font-normal leading-none tracking-[-0.04em] sm:text-[10rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="bg-foreground text-background mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="text-4xl font-semibold leading-[1.0] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                    {title}
                  </h2>
                  <p className="text-foreground/80 mt-8 max-w-xl text-pretty text-lg leading-relaxed">
                    {intro}
                  </p>
                  <ul className="divide-border/60 mt-10 divide-y">
                    {bullets.map((b) => (
                      <li
                        key={b}
                        className="text-foreground/85 flex items-baseline gap-4 py-3 text-[15px] leading-relaxed sm:text-base"
                      >
                        <span className="text-muted-foreground/60 font-mono text-xs">
                          ·
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

function FinalCta() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Bereit?
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Klingt nach dem,
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                was Sie suchen?
              </span>
            </h2>
          </div>
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 shrink-0 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
          >
            Website anfragen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
