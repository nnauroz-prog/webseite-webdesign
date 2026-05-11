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
    "Professionelle Websites für lokale Unternehmen — Design, Technik, Hosting, SEO-Grundlagen und Betreuung.",
  alternates: { canonical: "/leistungen" },
};

const SECTIONS = [
  {
    icon: Layout,
    title: "Website-Erstellung",
    intro:
      "Vom kompakten Onepager bis zur vollständigen Unternehmens-Website. Wir gestalten Struktur, Design und alle Inhaltsbereiche.",
    bullets: [
      "Onepager-Websites — alles auf einer starken Seite",
      "Mehrseitige Websites mit eigenen Bereichen für Leistungen, Team, Galerie, Kontakt",
      "Moderne, branchenpassende Designsprache",
      "Komplette Mobiloptimierung (Smartphone & Tablet)",
      "Schnelle Ladezeiten als Standard",
      "Klare Kontakt- und Anfrageführung",
    ],
  },
  {
    icon: Sparkles,
    title: "Inhalte & Struktur",
    intro:
      "Wir helfen Ihnen, Ihre Inhalte so zu strukturieren, dass sie Vertrauen aufbauen und zur Anfrage führen — auch ohne Texterfahrung.",
    bullets: [
      "Leistungen verständlich präsentieren",
      "Team-Bereich mit Fotos und Qualifikationen",
      "Galerie mit Bildaufbereitung",
      "Öffnungszeiten und Standort prominent",
      "Über-uns-Bereich für Vertrauensaufbau",
      "Beratung zu Aufbau und Reihenfolge der Inhalte",
    ],
  },
  {
    icon: Inbox,
    title: "Kontakt & Anfragen",
    intro:
      "Anfragen müssen ohne Hürden bei Ihnen landen — am besten direkt aufs Handy.",
    bullets: [
      "Kontaktformular mit Spam-Schutz",
      "WhatsApp-Button für direkten Draht",
      "Google Maps mit Einsatzgebiet oder Standort",
      "Klick-zum-Anrufen auf mobilen Geräten",
      "Optional: Bewerbungsformular oder Reservierungs-Anfrage",
    ],
  },
  {
    icon: Search,
    title: "SEO-Grundlagen",
    intro:
      "Wir legen eine saubere SEO-Basis, damit Sie bei lokalen Suchanfragen gefunden werden können. Keine Platz-1-Garantien — aber solide Voraussetzungen.",
    bullets: [
      "Sinnvolle Seiten-Titel und Meta-Beschreibungen",
      "Klare Überschriftenstruktur (H1/H2/H3)",
      "Lokale Suchbegriffe in den Inhalten",
      "Sitemap und maschinenlesbare Daten",
      "Schnelle Ladezeiten und Mobile-First",
      "Optional: Anbindung an Google Search Console",
    ],
  },
  {
    icon: ServerCog,
    title: "Hosting & Betreuung",
    intro:
      "Sie müssen sich um nichts kümmern. Hosting, Wartung und kleinere Änderungen laufen bei uns.",
    bullets: [
      "Hosting in der EU inklusive",
      "Sicherheits-Updates und Backups",
      "Kleinere Inhaltsänderungen pro Monat",
      "Technische Pflege und Monitoring",
      "Erweiterungen und neue Sektionen jederzeit möglich",
      "Persönlicher Ansprechpartner für Rückfragen",
    ],
  },
  {
    icon: Globe2,
    title: "Verwaltbare Inhalte (optional)",
    intro:
      "Auf Wunsch können bestimmte Inhalte direkt auf Ihrer Website verwaltbar gemacht werden — zum Beispiel Öffnungszeiten, Speisekarte, Wochenangebot, Leistungen oder Bilder.",
    bullets: [
      "Speisekarte oder Wochenangebot selbst pflegen",
      "Öffnungszeiten kurzfristig ändern",
      "Bilder und Galerie selbst aktualisieren",
      "Leistungen und Preise jederzeit anpassen",
      "Hinweisbanner aktivieren (z.B. Feiertag, Sommerpause)",
      "Premium-Feature — nicht erforderlich",
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
          Webdesign-Service für lokale Unternehmen.
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
          Wir erstellen Ihre Website fertig für Sie — von Struktur und Design
          bis zur Veröffentlichung.
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
          Bereit für eine Website, die professionell wirkt?
        </h2>
        <p className="text-background/70 mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg">
          Schicken Sie uns kurz Ihre Anfrage — wir melden uns innerhalb von
          24 Stunden mit einer persönlichen Einschätzung.
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
