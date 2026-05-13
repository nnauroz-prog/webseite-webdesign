"use client";

import Image from "next/image";
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
  /** Beispiel-Mockup für die Vorschau-Karte. */
  image: { src: string; alt: string };
  /** Atmosphäre-Foto als kleine Detail-Karte unten links auf dem Mockup. */
  atmosphere?: { src: string; alt: string };
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
    image: {
      src: "/images/sitalo-pflege-laptop.png",
      alt: "Beispiel-Layout für einen Pflegedienst auf einem Laptop — warmes Tageslicht, Notizbuch daneben.",
    },
    atmosphere: {
      src: "/images/atmosphere/pflege-eingang.png",
      alt: "Empfangsbereich eines Pflegedienstes — Holzkommode, Pflanze.",
    },
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
    image: {
      src: "/images/sitalo-praxis-laptop.png",
      alt: "Beispiel-Layout für eine Arztpraxis auf einem Laptop — heller Schreibtisch.",
    },
    atmosphere: {
      src: "/images/atmosphere/praxis-raum.png",
      alt: "Ruhiges Wartezimmer einer Arztpraxis — Tageslicht, Pflanzen.",
    },
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
    image: {
      src: "/images/sitalo-praxis-laptop.png",
      alt: "Beispiel-Layout für eine Zahnarztpraxis auf einem Laptop.",
    },
    atmosphere: {
      src: "/images/atmosphere/praxis-raum.png",
      alt: "Helle Praxisräume mit warmem Holzboden.",
    },
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
    image: {
      src: "/images/sitalo-friseur-mobile.png",
      alt: "Beispiel-Layout für einen Friseur-Salon auf einem Smartphone — warmes Tageslicht.",
    },
    atmosphere: {
      src: "/images/atmosphere/friseur-stuhl.png",
      alt: "Friseurstuhl im warmen Licht eines Salons.",
    },
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
    image: {
      src: "/images/sitalo-kosmetik-laptop.png",
      alt: "Beispiel-Layout für ein Kosmetik-Studio auf einem Laptop.",
    },
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
    image: {
      src: "/images/sitalo-cafe-mobile.png",
      alt: "Beispiel-Layout für ein Café auf einem Smartphone — Espressotasse daneben.",
    },
    atmosphere: {
      src: "/images/atmosphere/gastro-cafe.png",
      alt: "Café-Interieur mit Tresen und Espressomaschine.",
    },
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
    image: {
      src: "/images/sitalo-handwerker-laptop.png",
      alt: "Beispiel-Layout für einen Handwerker-Betrieb auf einem Laptop.",
    },
    atmosphere: {
      src: "/images/atmosphere/handwerker-werkbank.png",
      alt: "Werkbank mit Werkzeug im warmen Licht einer Werkstatt.",
    },
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
    image: {
      src: "/images/sitalo-reinigung-laptop.png",
      alt: "Beispiel-Layout für eine Reinigungsfirma auf einem Laptop.",
    },
    atmosphere: {
      src: "/images/atmosphere/reinigung-flur.png",
      alt: "Sauberer Bürogang im Tageslicht.",
    },
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
    image: {
      src: "/images/sitalo-kanzlei-laptop.png",
      alt: "Beispiel-Layout für eine Kanzlei auf einem Laptop.",
    },
    atmosphere: {
      src: "/images/atmosphere/kanzlei-buecher.png",
      alt: "Bücherregal mit juristischer Fachliteratur in einer Kanzlei.",
    },
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
    image: {
      src: "/images/workspace-laptop.png",
      alt: "Arbeitsplatz mit Laptop und Notizbuch — Platzhalter für individuelle Branchen.",
    },
  },
];

export function IndustryPicker() {
  const [selected, setSelected] = useState<Industry>(INDUSTRIES[0]);

  return (
    <section
      id="branchen"
      className="border-border/40 relative overflow-hidden border-t scroll-mt-20"
    >
      {/* Dezenter warmer Backdrop — gibt der Sektion Atmosphäre. */}
      <div
        aria-hidden="true"
        className="from-accent/20 via-background to-background pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b"
      />
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-40 right-[-15%] -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px]"
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
            Branchen-Vorschau
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
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
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium tracking-tight transition-all duration-300 ${
                    active
                      ? "border-foreground bg-foreground text-background shadow-[0_10px_24px_-12px_rgb(0_0_0/0.35)]"
                      : "border-border/70 bg-background/60 text-foreground/65 hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="bg-gold inline-block h-1.5 w-1.5 rounded-full"
                    />
                  ) : null}
                  {industry.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail-Karte — bei Tab-Wechsel komplett neu gemountet → Crossfade. */}
        <div
          key={selected.slug}
          className="industry-fade mt-14 grid items-start gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16"
        >
          {/* Linke Spalte: Text + Bullets + CTA */}
          <div className="flex flex-col">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em]">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-1 w-6"
              />
              {selected.label}
            </p>
            <h3 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-[2.75rem]">
              {selected.headline}
            </h3>
            <p className="text-muted-foreground mt-5 max-w-md text-pretty text-base leading-relaxed">
              {selected.body}
            </p>
            <ul className="divide-border/60 mt-8 divide-y border-y">
              {selected.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="text-foreground/85 flex items-baseline gap-4 py-3.5 text-[15px] leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="bg-foreground/40 mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/anfrage?branche=${selected.slug}`}
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
              >
                Diese Seite anfragen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/branchen"
                className="text-muted-foreground hover:text-foreground inline-flex h-12 items-center text-[14px] font-medium underline-offset-4 hover:underline"
              >
                Branche im Detail
              </Link>
            </div>
          </div>

          {/* Rechte Spalte: Mockup mit Atmosphäre-Detail */}
          <div className="relative">
            <div className="border-border/50 bg-card/60 ring-foreground/5 relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-[0_30px_80px_-40px_rgb(0_0_0/0.4)] ring-1">
              <Image
                src={selected.image.src}
                alt={selected.image.alt}
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
                priority={false}
              />
              {/* sanfter Vignetten-Schatten für mehr Tiefe */}
              <div
                aria-hidden="true"
                className="from-foreground/15 pointer-events-none absolute inset-0 bg-gradient-to-tr to-transparent"
              />
            </div>
            {selected.atmosphere ? (
              <div
                className="border-border/60 bg-background ring-foreground/5 absolute -bottom-6 -left-4 hidden aspect-[4/3] w-32 overflow-hidden rounded-2xl border shadow-[0_18px_40px_-22px_rgb(0_0_0/0.45)] ring-1 sm:block sm:-bottom-8 sm:-left-8 sm:w-44"
                aria-hidden="true"
              >
                <Image
                  src={selected.atmosphere.src}
                  alt={selected.atmosphere.alt}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>
            ) : null}
            {/* Caption unter dem Mockup */}
            <p className="text-muted-foreground/80 mt-10 text-center text-[12px] tracking-[0.18em] uppercase sm:mt-12 sm:text-left">
              Beispiel-Layout · {selected.label}
            </p>
          </div>
        </div>

        <div className="mt-16">
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
