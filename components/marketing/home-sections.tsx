import { ArrowRight, CalendarCheck, FileCheck2, Globe, MapPin, MessageSquare, Search, Wrench } from "lucide-react";
import Link from "next/link";

import type { ShowcaseItem } from "@/components/marketing/hero-showcase";
import { SpotlightLink } from "@/components/marketing/motion-bits";
import { getBrancheBySlug } from "@/lib/branchen-data";
import { getPaketBySlug } from "@/lib/pakete-data";

/**
 * Kompakte Startseiten-Sektionen. Prinzip: eine Aufgabe pro Sektion,
 * so wenig Text wie möglich, ein Link weiter. Ausführliches steht auf
 * den Unterseiten.
 */

const SECTION = "border-border/40 border-t";
const INNER = "mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20";

/* ------------------------------------------------------------------
 * Branchen-Layouts für den Kartenstapel im Hero.
 * ---------------------------------------------------------------- */
const SHOWCASE = ["pflege", "praxis", "handwerker", "kanzlei", "hotel"];

export function showcaseItems(): ShowcaseItem[] {
  return SHOWCASE.flatMap((slug) => {
    const b = getBrancheBySlug(slug);
    return b?.image ? [{ slug: b.slug, label: b.label, src: b.image.src, alt: b.image.alt }] : [];
  });
}

/* ------------------------------------------------------------------
 * Fakten-Leiste — an der Stelle, an der andere Kundenlogos zeigen.
 * Nur Zusagen, die an anderer Stelle der Site belegt sind.
 * ---------------------------------------------------------------- */
const FAKTEN = [
  { icon: FileCheck2, title: "Festpreis vorab" },
  { icon: MapPin, title: "Persönlich aus Hamburg" },
  { icon: MessageSquare, title: "Antwort meist am selben Werktag" },
  { icon: CalendarCheck, title: "Monatlich kündbar" },
];

export function FaktenLeiste() {
  return (
    <section aria-label="Was Sie sicher haben" className="bg-secondary/40 border-border/40 border-y">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-4 gap-y-4 px-5 py-6 sm:px-6 lg:grid-cols-4 lg:py-7">
        {FAKTEN.map(({ icon: Icon, title }) => (
          <li key={title} className="flex items-center gap-2.5">
            <Icon className="text-gold h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-[13.5px] font-medium leading-snug tracking-tight sm:text-[14.5px]">{title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Was möchten Sie voranbringen? — drei Einstiege nach Anliegen.
 * Mobil als kompakte Zeilen, ab md als Karten mit Maus-Licht.
 * ---------------------------------------------------------------- */
export function Voranbringen() {
  const starter = getPaketBySlug("starter");
  const items = [
    {
      icon: Globe,
      title: "Eine neue Website",
      text: "Für Betriebe ohne Seite oder mit einer, die nicht mehr passt.",
      meta: starter ? starter.setup : "",
      href: "/pakete",
    },
    {
      icon: Wrench,
      title: "Die bestehende Seite pflegen",
      text: "Hosting, Updates, Änderungen — auch wenn wir sie nicht gebaut haben.",
      meta: "ab 49 € / Monat",
      href: "/wartung",
    },
    {
      icon: Search,
      title: "Bei Google gefunden werden",
      text: "Wir prüfen Ihre Seite und schicken drei bis fünf konkrete Punkte.",
      meta: "kostenlos, in 48 h",
      href: "/audit",
    },
  ];
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Was möchten Sie voranbringen?</h2>
        <ul className="mt-8 grid gap-3 md:mt-10 md:grid-cols-3 md:gap-4">
          {items.map(({ icon: Icon, title, text, meta, href }) => (
            <li key={title}>
              <SpotlightLink
                href={href}
                className="border-border/70 bg-card hover:border-gold/50 group flex h-full items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-[border-color,translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgb(40_25_10/0.35)] md:flex-col md:items-start md:p-6"
              >
                <Icon className="text-gold h-6 w-6 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold tracking-tight md:mt-1 md:text-lg">{title}</span>
                  <span className="text-muted-foreground mt-2 hidden text-[14.5px] leading-relaxed md:block">{text}</span>
                  <span className="text-foreground/70 mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] md:mt-4">
                    {meta}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 md:mt-auto"
                  aria-hidden="true"
                />
              </SpotlightLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Ablauf — drei Schritte auf einer Linie, die sich beim Scrollen
 * zeichnet (globals.css: .ablauf-line).
 * ---------------------------------------------------------------- */
const SCHRITTE = [
  { title: "Sie schreiben uns", text: "Drei Felder. Antwort meist am selben Werktag." },
  { title: "Kurzes Gespräch", text: "15 Minuten. Danach: Festpreis und Termin." },
  { title: "Wir bauen, Sie geben frei", text: "Kleine Seiten oft in 1–2 Werktagen." },
];

export function AblaufKompakt() {
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">So läuft es ab.</h2>
          <Link
            href="/ablauf"
            className="text-foreground inline-flex items-center gap-1.5 text-[14px] font-medium underline-offset-4 hover:underline"
          >
            Ablauf im Detail <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="relative mt-10">
          <div aria-hidden="true" className="bg-border/70 absolute top-[7px] right-0 left-0 hidden h-px md:block" />
          <div
            aria-hidden="true"
            className="ablauf-line from-gold via-gold/70 to-gold/20 absolute top-[7px] right-0 left-0 hidden h-px bg-gradient-to-r md:block"
          />
          <ol className="relative grid gap-7 md:grid-cols-3 md:gap-8">
            {SCHRITTE.map((s, i) => (
              <li key={s.title} className="flex gap-4 md:block">
                <span
                  aria-hidden="true"
                  className="ablauf-dot border-gold bg-background mt-1 block h-[15px] w-[15px] shrink-0 rounded-full border-2 md:mt-0"
                />
                <div>
                  <p className="text-gold font-mono text-[11px] tracking-[0.2em] md:mt-5">0{i + 1}</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">{s.title}</p>
                  <p className="text-muted-foreground mt-1 text-[14.5px] leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
