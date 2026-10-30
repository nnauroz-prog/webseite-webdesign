import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  FileCheck2,
  Globe,
  MapPin,
  MessageSquare,
  Search,
  Wrench,
} from "lucide-react";

import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import { getBrancheBySlug } from "@/lib/branchen-data";
import { getPaketBySlug } from "@/lib/pakete-data";

/**
 * Kompakte Startseiten-Sektionen. Prinzip: eine Aufgabe pro Sektion,
 * ein Satz pro Karte, ein Link weiter. Wer mehr wissen will, landet
 * auf der Unterseite, die das Thema ausführlich behandelt.
 */

const SECTION = "border-border/40 border-t";
const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";

/* ------------------------------------------------------------------
 * Fakten-Leiste — an der Stelle, an der andere Kundenlogos zeigen.
 * Nur Zusagen, die an anderer Stelle der Site belegt sind.
 * ---------------------------------------------------------------- */
const FAKTEN = [
  { icon: FileCheck2, title: "Festpreis vorab", text: "Schwarz auf weiß, keine Nachträge." },
  { icon: MapPin, title: "Persönlich aus Hamburg", text: "Kein Callcenter, kein Ticket-System." },
  { icon: MessageSquare, title: "Antwort meist am selben Werktag", text: "Von uns, nicht von einem Bot." },
  { icon: CalendarCheck, title: "Monatlich kündbar", text: "Nach sechs Monaten, Bestand inklusive." },
];

export function FaktenLeiste() {
  return (
    <section aria-label="Was Sie sicher haben" className="bg-secondary/40 border-border/40 border-y">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:px-6 lg:grid-cols-4 lg:py-12">
        {FAKTEN.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col gap-2">
            <Icon className="text-gold h-5 w-5" aria-hidden="true" />
            <p className="text-[15px] font-medium leading-snug tracking-tight">{title}</p>
            <p className="text-muted-foreground text-[13.5px] leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Einblicke — vier Branchen-Layouts als Bildkarten.
 * ---------------------------------------------------------------- */
const EINBLICKE = ["pflege", "praxis", "gastro", "handwerker"];

export function Einblicke() {
  const branchen = EINBLICKE.map((s) => getBrancheBySlug(s)).filter(
    (b): b is NonNullable<typeof b> => Boolean(b?.image),
  );
  return (
    <section id="beispiele" className={`${SECTION} scroll-mt-20`}>
      <div className={INNER}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <EditorialEyebrow>Layouts nach Branche</EditorialEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Einblicke in unsere Arbeit.
            </h2>
          </div>
          <Link
            href="/branchen"
            className="text-foreground inline-flex items-center gap-1.5 text-[14px] font-medium underline-offset-4 hover:underline"
          >
            Alle zehn Branchen <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4 lg:gap-5">
          {branchen.map((b) => (
            <li key={b.slug}>
              <Link href={`/branchen/${b.slug}`} className="group block">
                <div className="bg-secondary/40 relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-black/5">
                  <Image
                    src={b.image!.src}
                    alt={b.image!.alt}
                    fill
                    sizes="(min-width: 1024px) 280px, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 text-[14px] font-medium leading-snug tracking-tight sm:text-[15px]">
                  {b.label}
                </p>
                <p className="text-muted-foreground mt-1 hidden text-[13.5px] leading-relaxed sm:block">
                  {b.shortBody.split(". ")[0].replace(/\.$/, "")}.
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Was möchten Sie voranbringen? — drei Einstiege nach Anliegen.
 * ---------------------------------------------------------------- */
export function Voranbringen() {
  const starter = getPaketBySlug("starter");
  const items = [
    {
      icon: Globe,
      title: "Eine neue Website",
      text: "Für Betriebe ohne Seite oder mit einer, die nicht mehr passt.",
      meta: starter ? starter.setup : undefined,
      href: "/pakete",
      cta: "Pakete ansehen",
    },
    {
      icon: Wrench,
      title: "Die bestehende Seite pflegen",
      text: "Hosting, Updates, Änderungen — auch wenn wir sie nicht gebaut haben.",
      meta: "ab 49 € / Monat",
      href: "/wartung",
      cta: "Wartung ansehen",
    },
    {
      icon: Search,
      title: "Bei Google gefunden werden",
      text: "Wir sehen uns Ihre Seite an und schicken drei bis fünf konkrete Punkte.",
      meta: "kostenlos, in 48 h",
      href: "/audit",
      cta: "Audit anfordern",
    },
  ];
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Was möchten Sie voranbringen?
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text, meta, href, cta }) => (
            <li key={title}>
              <Link
                href={href}
                className="border-border/70 bg-card hover:border-foreground/30 group flex h-full flex-col rounded-2xl border p-6 transition-colors"
              >
                <Icon className="text-gold h-6 w-6" aria-hidden="true" />
                <p className="mt-5 text-lg font-semibold tracking-tight">{title}</p>
                <p className="text-muted-foreground mt-2 text-[14.5px] leading-relaxed">{text}</p>
                {meta ? (
                  <p className="text-foreground/80 mt-4 font-mono text-[11px] uppercase tracking-[0.18em]">
                    {meta}
                  </p>
                ) : null}
                <span className="text-foreground mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-medium">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Ablauf — drei Schritte, je ein Satz.
 * ---------------------------------------------------------------- */
const SCHRITTE = [
  {
    title: "Sie schreiben uns",
    text: "Drei Felder, fertig. Wir melden uns persönlich, meist am selben Werktag.",
  },
  {
    title: "Kurzes Gespräch",
    text: "15 Minuten am Telefon oder bei einem Kaffee in Hamburg. Danach: Festpreis und Termin.",
  },
  {
    title: "Wir bauen, Sie geben frei",
    text: "Kleine Seiten stehen oft nach 1–2 Werktagen, größere zum vereinbarten Termin.",
  },
];

export function AblaufKompakt() {
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            So läuft es ab.
          </h2>
          <Link
            href="/ablauf"
            className="text-foreground inline-flex items-center gap-1.5 text-[14px] font-medium underline-offset-4 hover:underline"
          >
            Ablauf im Detail <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {SCHRITTE.map((s, i) => (
            <li key={s.title} className="border-border/60 border-t pt-5">
              <span className="text-gold font-mono text-[12px] tracking-[0.2em]" style={{ fontVariantNumeric: "lining-nums" }}>
                0{i + 1}
              </span>
              <p className="mt-3 text-lg font-semibold tracking-tight">{s.title}</p>
              <p className="text-muted-foreground mt-2 text-[14.5px] leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
