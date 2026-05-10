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
      className="border-border/40 border-b py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Branchen
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Welche Website brauchen Sie?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Wählen Sie Ihre Branche — wir zeigen Ihnen, was wir typischerweise
            für diese Art Unternehmen umsetzen.
          </p>
        </header>

        {/* Chips */}
        <div className="-mx-6 mt-10 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 sm:flex-wrap sm:justify-center sm:w-auto">
            {INDUSTRIES.map((industry) => {
              const active = industry.slug === selected.slug;
              return (
                <button
                  key={industry.slug}
                  type="button"
                  onClick={() => setSelected(industry)}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "border-foreground bg-foreground text-background shadow-md"
                      : "border-border bg-card hover:border-foreground/40 hover:bg-secondary"
                  }`}
                >
                  {industry.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail card */}
        <div className="bg-card border-border/60 mx-auto mt-8 max-w-3xl rounded-3xl border p-8 shadow-md sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em]">
                {selected.label}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {selected.headline}
              </h3>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                {selected.body}
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {selected.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5"
                  >
                    <span className="bg-primary inline-block h-1.5 w-1.5 shrink-0 rounded-full mt-2" />
                    <span className="text-foreground/85">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={`/anfrage?branche=${selected.slug}`}
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-tight shadow-md transition-all hover:shadow-lg sm:self-start"
            >
              Diese Website anfragen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
