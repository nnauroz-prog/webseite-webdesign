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
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
          Leistungen
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          Was ich für Sie übernehme.
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
          Von der ersten Idee bis zur fertigen Seite — und danach genauso.
          Sie kümmern sich um Ihren Betrieb, ich kümmere mich um Ihre Online-Präsenz.
        </p>
      </div>
    </section>
  );
}

function Sections() {
  return (
    <section className="border-border/40 border-b py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <ul className="space-y-10 sm:space-y-14">
          {SECTIONS.map(({ icon: Icon, title, intro, bullets }) => (
            <li
              key={title}
              className="border-border/60 bg-card rounded-3xl border p-6 shadow-sm sm:p-9"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                <span className="bg-primary/10 text-primary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                    {title}
                  </h2>
                  <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                    {intro}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {bullets.map((b) => (
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
        </ul>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
          Klingt nach dem, was Sie suchen?
        </h2>
        <p className="text-background/70 mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg">
          Schreiben Sie mir kurz Ihre Anfrage — ich melde mich innerhalb
          von 24 Stunden persönlich mit einer ehrlichen Einschätzung.
        </p>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
        >
          Website anfragen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
