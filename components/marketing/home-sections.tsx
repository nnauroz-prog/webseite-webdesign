import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BeforeAfter } from "@/components/marketing/before-after";
import { getBrancheBySlug } from "@/lib/branchen-data";
import { getPaketBySlug } from "@/lib/pakete-data";

/**
 * Startseiten-Sektionen. Ein Raster für alle: links eine schmale
 * Spalte mit dem Abschnittsnamen, rechts Überschrift und Inhalt. Keine
 * Symbol-Kärtchen, sondern Typografie, Haarlinien und Weißraum.
 */

const SECTION = "border-border/50 border-t";

/** Einzug für Inhalte unter einem SectionHead: beginnt auf der zweiten
 *  Kante (Spalte 4 von 12 inkl. Abstand), mobil ohne Einzug. */
export const BODY_OFFSET = "lg:pl-[calc(25%+0.5rem)]";
const INNER = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24";

/** Abschnittskopf: Name links (ab lg eigene Spalte), Überschrift rechts. */
export function SectionHead({
  label,
  title,
  link,
  dark = false,
}: {
  label: string;
  title: React.ReactNode;
  link?: { href: string; text: string };
  dark?: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
      <p
        className={`flex items-center gap-2.5 self-start text-[13px] font-medium lg:col-span-3 lg:pt-4 ${
          dark ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        <span aria-hidden="true" className="bg-gold inline-block h-px w-8" />
        {label}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 lg:col-span-9">
        <h2 className="min-w-0 max-w-2xl flex-1 basis-[18rem] text-balance text-3xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[2.75rem] lg:text-[3.1rem]">
          {title}
        </h2>
        {link ? (
          <Link
            href={link.href}
            className={`inline-flex shrink-0 items-center gap-1.5 pb-1 text-[14px] font-medium underline-offset-4 hover:underline ${
              dark ? "text-background" : "text-foreground"
            }`}
          >
            {link.text} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Vorteile — links eine große Zahl, rechts vier Zusagen als Liste.
 * Nur Zusagen, die an anderer Stelle der Site belegt sind.
 * ---------------------------------------------------------------- */
const VORTEILE = [
  { title: "Festpreis vorab", text: "Schwarz auf weiß, ab 499 €. Keine Nachträge." },
  { title: "Erst sehen, dann live", text: "Sie prüfen alles in Ruhe auf einem Test-Link." },
  { title: "Schnell und auffindbar", text: "Kurze Ladezeiten und eine saubere Struktur für Google." },
  { title: "Änderungen per Nachricht", text: "Kleine Anpassungen sind im Monatsbeitrag enthalten." },
];

export function Vorteile() {
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <SectionHead label="Warum Sitalo" title="Schnell, verbindlich und persönlich betreut." />
        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:col-start-4">
            <p className="serif text-foreground text-[5.5rem] lining-nums leading-none tracking-[-0.04em] sm:text-[7rem]">
              1–2
            </p>
            <p className="mt-3 text-lg font-semibold tracking-tight">Werktage, bis kleine Seiten online sind.</p>
            <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
              Stichpunkte reichen. Die Texte formulieren wir mit Ihnen.
            </p>
          </div>
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:col-span-6">
            {VORTEILE.map((v, i) => (
              <div key={v.title} className="border-border border-t py-5">
                <dt className="flex items-baseline gap-3 text-[16px] font-semibold tracking-tight">
                  <span className="text-gold text-[12px] tabular-nums">0{i + 1}</span>
                  {v.title}
                </dt>
                <dd className="text-muted-foreground mt-1.5 pl-7 text-[14.5px] leading-relaxed">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Einstiege nach Anliegen — als Index-Liste mit Haarlinien.
 * ---------------------------------------------------------------- */
export function Voranbringen() {
  const starter = getPaketBySlug("starter");
  const items = [
    { title: "Eine neue Website erstellen lassen", text: "Für Betriebe ohne Seite oder mit einer, die nicht mehr passt.", meta: starter ? starter.setup : "", href: "/website-erstellen-lassen" },
    { title: "Die bestehende Seite pflegen", text: "Hosting, Updates und Änderungen, auch wenn wir sie nicht gebaut haben.", meta: "ab 49 € / Monat", href: "/wartung" },
    { title: "Bei Google gefunden werden", text: "Wir prüfen Ihre Seite und schicken konkrete Punkte.", meta: "kostenlos, in 48 h", href: "/audit" },
  ];
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <SectionHead label="Leistungen" title="Was möchten Sie voranbringen?" link={{ href: "/leistungen", text: "Alle Leistungen" }} />
        <ul className="border-border mt-12 border-t lg:mt-16">
          {items.map((it, i) => (
            <li key={it.title} className="border-border border-b">
              <Link
                href={it.href}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6 sm:py-8 lg:grid-cols-12 lg:gap-8"
              >
                <span className="text-gold hidden text-[13px] tabular-nums lg:col-span-3 lg:block">0{i + 1}</span>
                <span className="lg:col-span-5">
                  <span className="block text-xl font-semibold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                    {it.title}
                  </span>
                  <span className="text-muted-foreground mt-1 hidden text-[14.5px] leading-relaxed sm:block">{it.text}</span>
                </span>
                <span className="text-muted-foreground col-start-1 row-start-2 text-[14px] lg:col-span-2 lg:col-start-auto lg:row-start-auto">
                  {it.meta}
                </span>
                <span className="border-border group-hover:bg-foreground group-hover:text-background group-hover:border-foreground row-span-2 inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full border transition-colors lg:col-span-2 lg:row-span-1">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
 * Ablauf — drei Schritte auf einer Linie, die sich beim Scrollen
 * zeichnet (globals.css: .ablauf-line).
 * ---------------------------------------------------------------- */
const SCHRITTE = [
  { title: "Sie schreiben uns", text: "Drei Felder. Antwort meist am selben Werktag." },
  { title: "Kurzes Gespräch", text: "15 Minuten. Danach Festpreis und Termin." },
  { title: "Wir bauen, Sie geben frei", text: "Kleine Seiten oft in 1–2 Werktagen." },
];

export function AblaufKompakt() {
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <SectionHead label="Ablauf" title="So läuft es ab." link={{ href: "/ablauf", text: "Ablauf im Detail" }} />
        <div className="relative mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-9 lg:col-start-4">
            <div aria-hidden="true" className="bg-border absolute top-[7px] right-0 left-0 hidden h-px md:block" />
            <div
              aria-hidden="true"
              className="ablauf-line bg-gold absolute top-[7px] right-0 left-0 hidden h-px md:block"
            />
            <ol className="relative grid gap-8 md:grid-cols-3">
              {SCHRITTE.map((s, i) => (
                <li key={s.title} className="flex gap-4 md:block">
                  <span
                    aria-hidden="true"
                    className="ablauf-dot border-gold bg-background mt-1 block h-[15px] w-[15px] shrink-0 rounded-full border-2 md:mt-0"
                  />
                  <div>
                    <p className="text-gold text-[13px] font-semibold tabular-nums md:mt-5">0{i + 1}</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight">{s.title}</p>
                    <p className="text-muted-foreground mt-1 text-[14.5px] leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Vorher / Nachher — Regler über einer typischen Betriebsseite.
 * ---------------------------------------------------------------- */
export function VorherNachher() {
  return (
    <section className={SECTION}>
      <div className={INNER}>
        <SectionHead
          label="Vorher · Nachher"
          title={
            <>
              Dieselbe Tischlerei. <span className="text-muted-foreground">Ein anderer erster Eindruck.</span>
            </>
          }
        />
        <p className={`text-muted-foreground mt-6 max-w-xl text-[15.5px] leading-relaxed ${BODY_OFFSET}`}>
          Ziehen Sie den Regler. Links eine Seite, wie sie bei vielen Betrieben noch online ist, rechts dieselben
          Inhalte so, wie wir sie bauen. Beispielbetrieb, frei erfunden.
        </p>
        <div className={`mt-10 lg:mt-12 ${BODY_OFFSET}`}>
          <BeforeAfter />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Arbeiten — große Bildstrecke mit Beispielseiten nach Branche.
 * Scrollt waagerecht bis zum Bildschirmrand, rastet pro Karte ein.
 * ---------------------------------------------------------------- */
const ARBEITEN = ["pflege", "handwerker", "praxis", "kanzlei", "hotel", "kosmetik"];

export function Arbeiten() {
  const items = ARBEITEN.flatMap((slug) => {
    const b = getBrancheBySlug(slug);
    return b?.image ? [{ slug: b.slug, label: b.label, src: b.image.src, alt: b.image.alt }] : [];
  });
  return (
    <section className={`${SECTION} overflow-hidden`}>
      <div className={INNER}>
        <SectionHead
          label="Arbeiten"
          title={
            <>
              Beispielseiten nach Branche. <span className="text-muted-foreground">Jede anders gebaut.</span>
            </>
          }
          link={{ href: "/branchen", text: "Alle Branchen" }}
        />
      </div>
      {/* Die Strecke beginnt auf der zweiten Kante und läuft rechts aus dem Bild. */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <ul
          className={`-mb-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${BODY_OFFSET}`}
          style={{ scrollPaddingLeft: "calc(25% + 0.5rem)" }}
        >
          {items.map((it, i) => (
            <li key={it.slug} className="w-[82vw] shrink-0 snap-start sm:w-[30rem]">
              <Link href={`/branchen/${it.slug}`} className="group block">
                <div className="bg-secondary relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-black/5">
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    sizes="(min-width: 640px) 480px, 82vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <p className="text-lg font-semibold tracking-tight">Website für {it.label}</p>
                  <span className="text-gold text-[13px] tabular-nums">0{i + 1}</span>
                </div>
              </Link>
            </li>
          ))}
          <li aria-hidden="true" className="w-px shrink-0" />
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Hamburg-Bildband — ein großes Foto über die volle Breite mit einem
 * Satz. Atempause zwischen den Textsektionen.
 * ---------------------------------------------------------------- */
export function HamburgBand() {
  return (
    <section className="relative h-[60vh] min-h-[26rem] overflow-hidden">
      <Image
        src="/images/hamburg-speicherstadt.webp"
        alt="Hamburger Speicherstadt am Abend, Backsteinspeicher am Fleet"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0b1526]/85 via-[#0b1526]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-6 sm:pb-16">
          <p className="text-gold flex items-center gap-2.5 text-[13px] font-medium">
            <span aria-hidden="true" className="bg-gold inline-block h-px w-8" />
            Hamburg
          </p>
          <p className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl">
            Gestaltet in Hamburg. <span className="text-white/60">Gebaut für Betriebe in ganz Deutschland.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
