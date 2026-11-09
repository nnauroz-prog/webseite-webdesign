import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { presetFuer } from "@/lib/muster-presets";
import { getPaketBySlug } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Webdesign-Leistungen für lokale Unternehmen",
  description:
    "Was wir für Sie machen: Website bauen, Texte, Anfragen, Google-Basis, Hosting und Pflege. Alles von Sitalo Webdesign aus Hamburg.",
  alternates: { canonical: "/leistungen" },
  openGraph: ogFor("/leistungen", undefined, undefined, "website", { defaultImage: true }),
};

const MONTHLY_FROM = (getPaketBySlug("starter")?.monthly ?? "ab 59\u00A0€ / Monat").replace(/\s*\/\s*Monat$/, "");

/** Strukturierte Daten: die Leistungsbereiche als einzelne Services. */
const SERVICES = [
  {
    name: "Website gestalten und bauen",
    description: "Eine Seite oder mehrere, eigens für Ihren Betrieb gestaltet und ohne Baukasten gebaut.",
  },
  {
    name: "Texte aus Ihren Stichpunkten",
    description: "Sie schicken Stichpunkte, wir formulieren daraus die Texte. Sie lesen gegen und geben frei.",
  },
  {
    name: "Anfragen per Formular und Telefon",
    description:
      "Was jemand ins Formular tippt, kommt direkt in Ihrem Postfach an. Auf dem Handy reicht ein Tipp auf die Telefonnummer.",
  },
  {
    name: "Bei Google auffindbar",
    description: "Titel, Beschreibungen, strukturierte Daten und lokale Suchbegriffe, damit man Sie in Ihrer Region findet.",
  },
  {
    name: "Hosting und Pflege",
    description: "Server in der EU, Updates, Backups und kleine Änderungen im Monatsbeitrag.",
  },
  {
    name: "Inhalte selbst pflegen",
    description: "Speisekarte, Öffnungszeiten oder Angebote ändern Sie auf Wunsch selbst. Ab dem Premium-Paket enthalten.",
  },
];

const SERVICES_LD = {
  "@context": "https://schema.org",
  "@graph": SERVICES.map((s) => ({
    "@type": "Service",
    name: s.name,
    description: s.description,
    // Verweist auf die Firmenangaben im Layout (ein Eintrag für Google).
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Webdesign",
  })),
};

export default function LeistungenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <Produktleiste
        titel="Leistungen"
        links={[
          { href: "#bauplan", label: "Startseite" },
          { href: "#verzeichnis", label: "Verzeichnis" },
          { href: "#kontakt", label: "Kontakt" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Leistungen"
          eyebrow="Werkstatt · Leistungen"
          titel="Was wir für Ihre Website machen"
          unter="Hier steht, was wir übernehmen und in welchem Paket es steckt. Von der ersten Zeile bis zum Hosting liegt die Arbeit bei uns, und Sie sprechen dabei immer mit uns selbst."
          aktionen={
            <>
              <Link href="/anfrage" className="btn-signal btn-gross">
                Anfrage schreiben
              </Link>
              <MehrLink href="/pakete" groesse="unter">
                Preise ansehen
              </MehrLink>
            </>
          }
          meta={<span>Festpreis vor dem Start · Monatsbeitrag {MONTHLY_FROM}</span>}
          bild={
            <FotoRahmen
              vorab
              src="/images/sitalo-reinigung-laptop.webp"
              alt="Laptop auf einer Edelstahl-Arbeitsfläche mit der Musterseite einer Gebäudereinigung"
              aspect="21 / 9"
              aspectMobil="16 / 10"
              position="45% 55%"
              muster
            />
          }
          unterschrift="Musterseite einer Gebäudereinigung auf der Arbeitsfläche · frei erfunden"
        />
        <Bauplan />
        <Verzeichnis />
        <KontaktKarte
          titel="Welche Positionen Sie brauchen, klären wir am Telefon."
          zeile="Wer lieber schreibt, schickt uns die Anfrage über das Formular. Wir antworten meist am selben Werktag."
          link={{ href: "/pakete", label: "Preise ansehen" }}
          foto={{
            src: "/images/atmosphere/gastro-espresso.webp",
            alt: "Helles Café mit Siebträgermaschine am Tresen und Holztischen am Fenster",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Leistungen" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_LD) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Bauplan: eine Startseite als Skizze, die fünf wichtigsten Stellen
 * markiert. Die Zahlen sind Legende, keine Rangfolge.
 * ---------------------------------------------------------------- */
const STELLEN = [
  {
    titel: "Seitentitel und Beschreibung",
    text: "Das steht bei Google über und unter dem Link. Wir schreiben beides mit Ihrer Leistung und Ihrem Ort.",
  },
  {
    titel: "Anruf-Knopf",
    text: "Auf dem Handy wählt ein Tipp auf die Nummer direkt. Am Rechner steht sie gut lesbar oben rechts.",
  },
  {
    titel: "Öffnungszeiten und Adresse",
    text: "Als Text auf der Seite, nicht als PDF oder Bild. So kann Google sie lesen, und ändern lassen Sie sie mit einem kurzen Anruf oder über das Formular.",
  },
  {
    titel: "Kontaktformular",
    text: "Was jemand hier eintippt, kommt direkt in Ihrem Postfach an. Gegen Spam schützen wir das Formular, ohne dass Besucher Bilderrätsel lösen müssen.",
  },
  {
    titel: "Impressum und Datenschutz",
    text: "Beide Pflichtseiten binden wir ein und verlinken sie am Fuß jeder Seite.",
  },
];

function Marke({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-[12px] leading-none font-bold text-[#1d1d1f] tabular-nums shadow-[0_0_0_3px_#fff] ${className}`}
    >
      {n}
    </span>
  );
}

/**
 * Eine Musterseite (Praxis, frei erfunden) in echter Größe statt einer
 * Skizze: lesbare Schrift, echte Farbflächen, Foto. Die Marken 1–5
 * sitzen an den Stellen aus der Liste daneben.
 */
function MusterPraxis() {
  const p = presetFuer("praxis");
  const { accent, tint } = p;
  return (
    <div className="overflow-hidden rounded-[18px] bg-white text-[#1b2333] shadow-[0_4px_16px_rgb(0_0_0/0.08)] select-none sm:rounded-[20px]">
      {/* Browserzeile mit Seitentitel */}
      <div className="flex items-center gap-2.5 border-b border-black/5 bg-[#f5f5f7] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d2d2d7]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d2d2d7]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d2d2d7]" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-white px-2.5 py-1 text-[12px] text-[#424245]">
          Hausarzt in Hamburg · {p.defaultName}
        </span>
        <Marke n={1} />
      </div>
      {/* Kopf */}
      <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-3 sm:px-6">
        <span className="serif truncate text-[17px] font-medium sm:text-[19px]" style={{ color: accent }}>
          {p.defaultName}
        </span>
        <span className="flex items-center gap-4 text-[13px] text-[#4b5563]">
          <span className="hidden sm:inline">{p.nav[0]}</span>
          <span className="hidden sm:inline">{p.nav[1]}</span>
          <span className="flex items-center gap-1.5">
            <Marke n={2} />
            <span className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: accent }}>
              Anrufen
            </span>
          </span>
        </span>
      </div>
      {/* Bühne */}
      <div className="grid gap-5 px-4 py-6 sm:grid-cols-[1.1fr_1fr] sm:gap-6 sm:px-6 sm:py-8" style={{ background: tint }}>
        <div className="flex flex-col justify-center">
          <p className="text-[12px] font-semibold" style={{ color: accent }}>
            Allgemeinmedizin in Hamburg
          </p>
          <p className="mt-2 text-[24px] leading-[1.1] font-semibold tracking-[-0.02em] sm:text-[28px]">{p.headline}</p>
          <p className="mt-3 text-[14px] leading-[1.45] text-[#4b5563]">{p.sub}</p>
          <span
            className="mt-4 inline-flex w-fit rounded-full px-4 py-2 text-[13px] font-semibold text-white"
            style={{ background: accent }}
          >
            {p.cta}
          </span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
          <Image
            src={p.image}
            alt=""
            fill
            sizes="(min-width: 1068px) 280px, (min-width: 640px) 40vw, calc(100vw - 64px)"
            className="object-cover"
          />
        </div>
      </div>
      {/* Öffnungszeiten und Formular */}
      <div className="grid gap-3 px-4 py-5 sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-6">
        <div className="relative rounded-[12px] border border-black/8 p-4">
          <Marke n={3} className="absolute -top-3 -right-2" />
          <p className="text-[14px] font-semibold">Sprechzeiten</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[13px] text-[#4b5563]">
            <dt>Mo–Fr</dt>
            <dd>8–12 Uhr</dd>
            <dt>Di, Do</dt>
            <dd>15–18 Uhr</dd>
            <dt>Adresse</dt>
            <dd>Musterweg 12, Hamburg</dd>
          </dl>
        </div>
        <div className="relative rounded-[12px] border border-black/8 p-4">
          <Marke n={4} className="absolute -top-3 -right-2" />
          <p className="text-[14px] font-semibold">Terminanfrage</p>
          <span className="mt-2 block rounded-md border border-black/10 px-2.5 py-1.5 text-[12px] text-[#6e6e73]">Ihr Name</span>
          <span className="mt-1.5 block rounded-md border border-black/10 px-2.5 py-1.5 text-[12px] text-[#6e6e73]">
            Telefon oder E-Mail
          </span>
          <span className="mt-2 inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: accent }}>
            Absenden
          </span>
        </div>
      </div>
      {/* Fuß */}
      <div className="flex items-center justify-between gap-3 border-t border-black/5 px-4 py-3 text-[12px] text-[#6e6e73] sm:px-6">
        <span>{p.defaultName}</span>
        <span className="flex items-center gap-2">
          Impressum · Datenschutz
          <Marke n={5} />
        </span>
      </div>
    </div>
  );
}

function Bauplan() {
  return (
    <Abschnitt
      id="bauplan"
      fett="Eine Startseite, beschriftet."
      grau="Fünf Stellen, die zuerst gesucht werden."
      unter="Die Musterseite zeigt fünf Stellen, an denen Kunden auf der Seite eines Betriebs zuerst suchen. Wir achten bei jeder Seite darauf, dass sie da sind und funktionieren."
    >
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-5">
        <figure className="min-w-0 lg:col-span-7">
          <div role="img" aria-label="Musterseite einer Hausarztpraxis mit fünf markierten Stellen">
            <MusterPraxis />
          </div>
          <figcaption className="mt-3 text-[12px] leading-4 text-[#6e6e73]">
            Musterseite, frei erfunden. Die Zahlen gehören zur Liste.
          </figcaption>
        </figure>

        <ol className={`${u.blatt} min-w-0 divide-y divide-black/10 self-start !py-2 lg:col-span-5`}>
          {STELLEN.map((s, i) => (
            <li key={s.titel} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 py-5">
              <Marke n={i + 1} className="mt-0.5 !shadow-none" />
              <div>
                <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.016em]">{s.titel}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.47] text-[#6e6e73]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Leistungsverzeichnis wie im Handwerk: Positionen mit Angabe, in
 * welchem Paket sie stecken. Quelle der Paketzuordnung:
 * lib/pakete-data.ts und die Vergleichstabelle auf /pakete.
 * ---------------------------------------------------------------- */
type Posten = { nr: string; text: string; umfang: string };

const VERZEICHNIS: { nr: string; titel: string; posten: Posten[] }[] = [
  {
    nr: "1",
    titel: "Die Website",
    posten: [
      { nr: "1.1", text: "Gestaltung für Ihren Betrieb, direkt im Code gebaut, ohne Baukasten", umfang: "Alle Pakete" },
      { nr: "1.2", text: "Ansicht für Handy, Tablet und Rechner, vor dem Start auf echten Geräten geprüft", umfang: "Alle Pakete" },
      { nr: "1.3", text: "Test-Link, auf dem Sie die fertige Seite vor dem Start ansehen", umfang: "Alle Pakete" },
      { nr: "1.4", text: "Eine Seite mit allem Wichtigen", umfang: "Starter" },
      { nr: "1.5", text: "Bis zu fünf Unterseiten, etwa für Leistungen, Team und Galerie", umfang: "Business" },
      { nr: "1.6", text: "Eigene Struktur nach Ihrem Bedarf", umfang: "Premium" },
      { nr: "1.7", text: "Neues Erscheinungsbild: Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden", umfang: "Studio" },
    ],
  },
  {
    nr: "2",
    titel: "Texte und Bilder",
    posten: [
      { nr: "2.1", text: "Texte aus Ihren Stichpunkten. Sie lesen gegen und geben frei.", umfang: "Alle Pakete" },
      { nr: "2.2", text: "Team-Bereich mit Fotos und eine Galerie", umfang: "Ab Business" },
      { nr: "2.3", text: "Aufbereitung Ihrer Fotos für die Seite", umfang: "Ab Business" },
    ],
  },
  {
    nr: "3",
    titel: "Anfragen",
    posten: [
      { nr: "3.1", text: "Kontaktformular mit Spam-Schutz ohne Bilderrätsel, Anfragen kommen per Mail bei Ihnen an", umfang: "Alle Pakete" },
      { nr: "3.2", text: "Anruf-Knopf, Karte und Öffnungszeiten", umfang: "Alle Pakete" },
      { nr: "3.3", text: "Formular für Bewerbung oder Terminanfrage, kommt per Mail bei Ihnen an", umfang: "Ab Business" },
      { nr: "3.4", text: "Online-Buchung mit festen Terminen", umfang: "Ab Premium" },
    ],
  },
  {
    nr: "4",
    titel: "Google",
    posten: [
      { nr: "4.1", text: "Seitentitel und Beschreibung für Google, mit Leistung und Ort", umfang: "Alle Pakete" },
      { nr: "4.2", text: "Eigener Titel und eigene Beschreibung für jede Unterseite, Sitemap, strukturierte Daten", umfang: "Ab Business" },
      { nr: "4.3", text: "Google-Unternehmensprofil einrichten, lokale Suchbegriffe", umfang: "Ab Business" },
    ],
  },
  {
    nr: "5",
    titel: `Nach dem Start, im Monatsbeitrag ${MONTHLY_FROM}`,
    posten: [
      { nr: "5.1", text: "Hosting auf einem Server in der EU, SSL-Zertifikat", umfang: "Alle Pakete" },
      { nr: "5.2", text: "Sicherheits-Updates und tägliche Backups, die 30 Tage zurückreichen", umfang: "Alle Pakete" },
      { nr: "5.3", text: "Kleine Änderungen im Monat: Starter 1, Business 3, Premium 6, Studio 10", umfang: "Je nach Paket" },
      { nr: "5.4", text: "Bereiche, die Sie selbst pflegen, etwa Speisekarte, Angebote oder Termine", umfang: "Ab Premium, auf Wunsch" },
      { nr: "5.5", text: "Domain und E-Mail-Adressen einrichten", umfang: "Auf Wunsch" },
    ],
  },
];

/** Die fünf Gruppen des Verzeichnisses als Kacheln (Kurzfassung). */
const GRUPPEN_KACHEL: {
  zeile: string;
  ton: "weiss" | "nacht" | "hell";
  spalten: 4 | 5 | 7;
  foto?: { src: string; alt: string; position?: string; muster?: boolean };
  /** gestalteter Ausschnitt statt Foto */
  ui?: "google" | "pflege";
}[] = [
  {
    zeile: "Gestaltet für Ihren Betrieb, ohne Baukasten. Vor dem Start auf echten Geräten geprüft.",
    ton: "weiss",
    spalten: 7,
    foto: {
      src: "/images/sitalo-fitness-laptop.webp",
      alt: "Laptop in einem Fitnessstudio mit der Musterseite eines Studios",
      position: "50% 60%",
      muster: true,
    },
  },
  {
    zeile: "Texte aus Ihren Stichpunkten, Fotos für die Seite aufbereitet.",
    ton: "weiss",
    spalten: 5,
    foto: {
      src: "/images/workspace-prints.webp",
      alt: "Drei gerahmte Entwürfe mit Logo, Farben und Schrift an einer hellen Wand",
      position: "50% 40%",
    },
  },
  {
    zeile: "Formular mit Spam-Schutz, Anruf-Knopf, Karte und Öffnungszeiten.",
    ton: "weiss",
    spalten: 4,
    foto: {
      src: "/images/sitalo-friseur-mobile.webp",
      alt: "Handy mit der Musterseite eines Friseurs und einem Knopf für die Terminanfrage",
      position: "60% 50%",
      muster: true,
    },
  },
  { zeile: "Titel, Beschreibung und Unternehmensprofil, damit man Sie in Ihrer Region findet.", ton: "nacht", spalten: 4, ui: "google" },
  { zeile: "Hosting in der EU, Updates, Backups und kleine Änderungen.", ton: "weiss", spalten: 4, ui: "pflege" },
];

/**
 * Gestalteter Google-Treffer der Musterpraxis (frei erfunden): so stehen
 * Seitentitel und Beschreibung aus Position 4.1 in der Suche.
 */
function GoogleTreffer() {
  const p = presetFuer("praxis");
  return (
    <div className="rounded-[14px] bg-[#1c1c1e] p-4 text-left shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
      <div className="flex items-center gap-2 rounded-full bg-[#2c2c2e] px-3 py-2 text-[13px] text-[#e5e5ea]">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="shrink-0 text-[#a1a1a6]">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="truncate">hausarzt hamburg</span>
      </div>
      <div className="mt-4 flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
          style={{ background: p.accent }}
          aria-hidden="true"
        >
          {p.defaultName.charAt(0)}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[13px] text-[#f5f5f7]">{p.defaultName}</span>
          <span className="block truncate text-[12px] text-[#a1a1a6]">Hamburg · Allgemeinmedizin</span>
        </span>
      </div>
      <p className="mt-2 text-[17px] leading-[22px] font-medium text-[#8ab4f8]">Hausarzt in Hamburg · {p.defaultName}</p>
      <p className="mt-1 text-[13px] leading-[19px] text-[#bfbfc4]">
        Allgemeinmedizin mit Sprechzeiten am Nachmittag. Termin online anfragen oder direkt anrufen.
      </p>
      <p className="mt-3 text-[11px] leading-4 text-[#8e8e93]">Musterpraxis, frei erfunden</p>
    </div>
  );
}

/** Pflegeprotokoll aus dem Monatsbeitrag: Hosting, Updates, Backups. */
function PflegeProtokoll() {
  const zeilen = [
    { t: "Update eingespielt", z: "Di, 03:12" },
    { t: "Backup erstellt", z: "Di, 02:00" },
    { t: "Zertifikat gültig", z: "74 Tage" },
    { t: "Zeiten geändert", z: "Mo, 16:40" },
  ];
  return (
    <div className="rounded-[14px] bg-[#f5f5f7] p-4 text-left">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-[#1d1d1f]">Pflegeprotokoll</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#1d1d1f] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34c759]" aria-hidden="true" />
          Online
        </span>
      </div>
      <ul role="list" className="mt-3 divide-y divide-black/8">
        {zeilen.map((r) => (
          <li key={r.t} className="flex items-baseline justify-between gap-3 py-2 text-[13px] leading-[18px]">
            <span className="flex min-w-0 items-baseline gap-2 text-[#1d1d1f]">
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" className="shrink-0 translate-y-[1px]">
                <path d="M2 6.5 4.8 9 10 3" fill="none" stroke="#f45b1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="min-w-0">{r.t}</span>
            </span>
            <span className="shrink-0 text-[12px] text-[#6e6e73] tabular-nums">{r.z}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] leading-4 text-[#6e6e73]">Beispiel: was im Monat an Ihrer Seite passiert.</p>
    </div>
  );
}

function Verzeichnis() {
  return (
    <Abschnitt
      id="verzeichnis"
      fett="Leistungsverzeichnis."
      grau="Was in welchem Paket steckt."
      unter={
        <>
          Gezählt wird wie im Handwerk: Position für Position. Die Preise der Pakete stehen auf der{" "}
          <Link href="/pakete" className="text-gold-ink underline underline-offset-2 hover:decoration-2">
            Paketseite
          </Link>
          .
        </>
      }
    >
      <BildRaster>
        {VERZEICHNIS.map((g, i) => {
          const k = GRUPPEN_KACHEL[i];
          return (
            <BildKachel
              key={g.nr}
              ton={k.ton}
              spalten={k.spalten}
              eyebrow={`${g.posten.length} Positionen`}
              titel={g.nr === "5" ? "Nach dem Start" : g.titel}
              zeile={k.zeile}
              href={`#gruppe-${g.nr}`}
              foto={
                k.foto
                  ? {
                      ...k.foto,
                      sizes:
                        k.spalten === 7
                          ? "(min-width: 1068px) 560px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                          : "(min-width: 1068px) 400px, (min-width: 640px) 50vw, calc(100vw - 32px)",
                    }
                  : undefined
              }
              bildInhalt={k.ui === "google" ? <GoogleTreffer /> : k.ui === "pflege" ? <PflegeProtokoll /> : undefined}
            />
          );
        })}
      </BildRaster>

      <details className={`${u.blatt} group mt-5`}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <span className="text-[19px] leading-6 font-semibold tracking-[-0.015em] sm:text-[21px]">Alle Positionen</span>
          <span aria-hidden="true" className="text-[22px] leading-none font-light text-[#6e6e73] transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <table className="mt-2 w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">Leistungsverzeichnis mit Paketzuordnung</caption>
          <thead>
            <tr className="border-b border-black/15">
              <th scope="col" className="w-[3.25rem] py-3 pr-3 text-[12px] font-semibold text-[#6e6e73] sm:w-20">
                Pos.
              </th>
              <th scope="col" className="py-3 pr-4 text-[12px] font-semibold text-[#6e6e73]">
                Leistung
              </th>
              <th scope="col" className="hidden w-44 py-3 text-right text-[12px] font-semibold text-[#6e6e73] sm:table-cell">
                Enthalten in
              </th>
            </tr>
          </thead>
          {VERZEICHNIS.map((gruppe) => (
            <tbody key={gruppe.nr} id={`gruppe-${gruppe.nr}`} className="scroll-mt-28">
              <tr>
                <th scope="colgroup" colSpan={3} className="pt-7 pb-2 text-left">
                  <span className="text-[17px] font-semibold tracking-[-0.016em]">
                    {gruppe.nr}. {gruppe.titel}
                  </span>
                </th>
              </tr>
              {gruppe.posten.map((p) => (
                <tr key={p.nr} className="border-t border-black/10 align-baseline">
                  <td className="py-3 pr-3 text-[13px] text-[#6e6e73] tabular-nums">{p.nr}</td>
                  <td className="py-3 pr-4 leading-snug">
                    {p.text}
                    <span className="mt-1 block text-[12px] text-[#6e6e73] sm:hidden">{p.umfang}</span>
                  </td>
                  <td
                    className={`hidden py-3 text-right text-[14px] sm:table-cell ${
                      p.umfang === "Alle Pakete" ? "font-semibold" : "text-[#6e6e73]"
                    }`}
                  >
                    {p.umfang}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </details>

      <div className="mt-10 max-w-[680px]">
        <h3 className="text-[21px] leading-[25px] font-bold">Nicht im Verzeichnis</h3>
        <p className={`${u.text} mt-3 text-[#6e6e73]`}>
          Werbekampagnen und Newsletter machen wir nicht. Logo-Entwicklung und Fotoshootings bieten wir ebenfalls nicht
          an: Fotos liefern Sie, Handyfotos reichen oft, und für einen Fotografen bekommen Sie von uns eine kurze
          Motivliste. Online-Shops und Apps besprechen wir im Einzelfall.
        </p>
      </div>
    </Abschnitt>
  );
}
