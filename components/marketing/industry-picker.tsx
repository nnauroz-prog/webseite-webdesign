"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Industry = {
  slug: string;
  label: string;
  /** Headline shown above the description after selection. */
  headline: string;
  /** Short, outcome-focused description. */
  body: string;
  /** Bullet features specific to this industry. */
  bullets: string[];
};

const INDUSTRIES: Industry[] = [
  {
    slug: "pflegedienst",
    label: "Pflegedienst",
    headline: "Pflegedienst-Website",
    body: "Leistungen, Kontakt, Bewerbungen und Vertrauen auf einen Blick.",
    bullets: [
      "Leistungen klar strukturiert",
      "Bewerbungsformular für Pflegekräfte",
      "Notfall- & Direktkontakt prominent",
    ],
  },
  {
    slug: "arztpraxis",
    label: "Arztpraxis",
    headline: "Praxis-Website",
    body: "Seriöser Auftritt, Sprechzeiten, Leistungen, klare Patienteninformation.",
    bullets: [
      "Sprechzeiten + Notdienst + Anfahrt",
      "Team-Bereich mit Qualifikationen",
      "Online-Termin-Anfrage",
    ],
  },
  {
    slug: "zahnarzt",
    label: "Zahnarzt",
    headline: "Zahnarzt-Website",
    body: "Behandlungen, Praxis-Atmosphäre und Termin-Anfragen modern präsentiert.",
    bullets: [
      "Behandlungen mit Beschreibung",
      "Team & Praxis-Bilder",
      "Online-Termin + Rückruf",
    ],
  },
  {
    slug: "friseur",
    label: "Friseur",
    headline: "Friseur-Website",
    body: "Bilder, Preise und Termin-Anfragen hochwertig in Szene gesetzt.",
    bullets: [
      "Galerie mit Lightbox",
      "Leistungen + Preise transparent",
      "Termin-Anfrage per Formular",
    ],
  },
  {
    slug: "kosmetik",
    label: "Kosmetik",
    headline: "Kosmetik-Website",
    body: "Behandlungen, Atmosphäre und Anfragen elegant darstellen.",
    bullets: [
      "Behandlungen mit Beschreibung",
      "Vorher/Nachher-Galerie",
      "Termin-Anfrage",
    ],
  },
  {
    slug: "cafe",
    label: "Café / Restaurant",
    headline: "Gastro-Website",
    body: "Speisekarte, Öffnungszeiten, Wochenangebote — alles selbst pflegbar.",
    bullets: [
      "Verwaltbare Speisekarte",
      "Wochenangebot änderbar",
      "Reservierungs-Anfrage",
    ],
  },
  {
    slug: "handwerker",
    label: "Handwerker",
    headline: "Handwerker-Website",
    body: "Leistungen, Einsatzgebiet, Anfrageformular und Referenzen professionell darstellen.",
    bullets: [
      "Leistungen + Einsatzgebiet",
      "Galerie umgesetzter Projekte",
      "Rückruf-Anfrage",
    ],
  },
  {
    slug: "reinigung",
    label: "Reinigung",
    headline: "Reinigungs-Website",
    body: "Service-Pakete, Angebotsanfrage und Erreichbarkeit klar dargestellt.",
    bullets: [
      "Service-Pakete im Vergleich",
      "Angebot anfragen mit Auswahl",
      "Notdienst + Direktkontakt",
    ],
  },
  {
    slug: "kanzlei",
    label: "Kanzlei",
    headline: "Kanzlei-Website",
    body: "Rechtsgebiete, Team und vertrauliche Erstberatung.",
    bullets: [
      "Rechtsgebiete strukturiert",
      "Team mit Spezialisierungen",
      "Vertrauliche Erstberatungs-Anfrage",
    ],
  },
  {
    slug: "sonstiges",
    label: "Sonstiges",
    headline: "Individuelle Website",
    body: "Sie haben eine andere Branche? Wir bauen die Website für Ihr Geschäft individuell.",
    bullets: [
      "Persönliche Beratung",
      "Individuelle Struktur",
      "Auf Wunsch verwaltbare Inhalte",
    ],
  },
];

export function IndustryPicker() {
  const [selected, setSelected] = useState<Industry>(INDUSTRIES[0]);

  return (
    <section
      id="branchen"
      className="border-border/40 border-t scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Welche Seite
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              brauchen Sie?
            </span>
          </h2>
          <p className="text-muted-foreground mt-8 max-w-lg text-pretty text-lg leading-relaxed">
            Wählen Sie Ihre Branche. Jede bekommt ein Layout, das wirklich
            zu Ihrem Alltag passt — nicht eine Vorlage von der Stange.
          </p>
        </div>

        {/* Chips */}
        <div className="-mx-6 mt-12 overflow-x-auto px-6 sm:mt-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {INDUSTRIES.map((industry) => {
              const active = industry.slug === selected.slug;
              return (
                <button
                  key={industry.slug}
                  type="button"
                  onClick={() => setSelected(industry)}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-medium tracking-tight transition-all ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/70 text-foreground/65 hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {industry.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail card — editorial */}
        <div className="border-border/60 mt-12 grid gap-10 border-t pt-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
              {selected.label}
            </p>
            <h3 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              {selected.headline}
            </h3>
            <p className="text-muted-foreground mt-5 text-pretty text-base leading-relaxed">
              {selected.body}
            </p>
            <Link
              href={`/anfrage?branche=${selected.slug}`}
              className="bg-foreground text-background hover:bg-foreground/90 group mt-8 inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
            >
              Diese Seite anfragen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul className="divide-border/60 divide-y">
            {selected.bullets.map((bullet) => (
              <li
                key={bullet}
                className="text-foreground/85 flex items-baseline gap-4 py-4 text-[15px] leading-relaxed sm:text-base"
              >
                <span className="text-muted-foreground/70 font-mono text-xs">
                  ·
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <Link
            href="/branchen"
            className="text-foreground inline-flex items-center gap-2 text-[15px] font-medium underline-offset-4 hover:underline"
          >
            Alle Branchen im Detail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
