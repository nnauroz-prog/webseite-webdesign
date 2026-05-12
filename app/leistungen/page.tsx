import type { Metadata } from "next";
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
  title: "Leistungen | Sitalo Webdesign",
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
      "WhatsApp-Button für den direkten Draht",
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
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
            Was ich
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              für Sie übernehme.
            </span>
          </h1>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
            Von der ersten Idee bis zur fertigen Seite — und danach genauso.
            Sie kümmern sich um Ihren Betrieb, ich kümmere mich um Ihre
            Online-Präsenz.
          </p>
        </div>
      </div>
    </section>
  );
}

function Sections() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <ol className="divide-border/60 divide-y">
          {SECTIONS.map(({ icon: Icon, title, intro, bullets }, i) => (
            <li
              key={title}
              className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.7fr_1.6fr] lg:gap-20"
            >
              <div>
                <p className="text-muted-foreground font-mono text-xs tracking-[0.2em]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <span className="bg-foreground text-background mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-6 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
                  {title}
                </h2>
              </div>
              <div>
                <p className="text-foreground/80 max-w-xl text-pretty text-lg leading-relaxed">
                  {intro}
                </p>
                <ul className="divide-border/60 mt-8 divide-y">
                  {bullets.map((b) => (
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

function FinalCta() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute top-10 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 text-center sm:py-32">
        <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Klingt nach dem,
          <br />
          <span className="serif-italic text-background/70 font-normal">
            was Sie suchen?
          </span>
        </h2>
        <p className="text-background/65 mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Schreiben Sie mir kurz — ich melde mich innerhalb von 24 Stunden
          persönlich, mit einer ehrlichen Einschätzung.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Website anfragen
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
