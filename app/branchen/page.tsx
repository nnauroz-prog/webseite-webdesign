import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Branchen | Sitalo Webdesign",
  description:
    "Websites für Pflegedienste, Praxen, Friseure, Cafés, Handwerker und lokale Dienstleister.",
  alternates: { canonical: "/branchen" },
};

type BranchEntry = {
  slug: string;
  label: string;
  body: string;
  bullets: string[];
  /** Used to build the /anfrage?branche=... deep link. */
  inquirySlug: string;
  /** Optional photograph rendered above the card title. */
  image?: { src: string; alt: string };
};

const BRANCHEN: BranchEntry[] = [
  {
    slug: "pflege",
    label: "Pflegedienste",
    inquirySlug: "pflege",
    image: {
      src: "/images/sitalo-pflege-laptop.png",
      alt: "Pflegedienst-Website von Sitalo auf einem Laptop, im warmen Tageslicht eines Büros mit Pflanzen und Notizbuch.",
    },
    body: "Pflegedienste verkaufen Vertrauen. Die Website muss Leistungen, Einzugsgebiet und seriöse Kontaktwege auf einen Blick zeigen — und gleichzeitig ein gutes Bewerbungsformular bieten, weil neue Pflegekräfte die teuerste Ressource sind.",
    bullets: [
      "Leistungen klar strukturiert (Grundpflege, Behandlungspflege, Verhinderungspflege …)",
      "Einsatzgebiet auf Karte oder als Liste",
      "Notfall- und Direktkontakt prominent",
      "Bewerbungsformular für Pflegekräfte",
      "Vertrauensaufbau über Team, Werte und Zertifikate",
    ],
  },
  {
    slug: "praxis",
    label: "Arzt- und Zahnarztpraxen",
    inquirySlug: "praxis",
    image: {
      src: "/images/sitalo-praxis-laptop.png",
      alt: 'Zahnarztpraxis-Website von Sitalo („Moderne Zahnmedizin für Ihr schönstes Lächeln.") auf einem Laptop im hellen Praxisempfang.',
    },
    body: "Patient:innen recherchieren vor dem ersten Termin. Die Website muss seriös wirken, Sprechzeiten und Leistungen sofort liefern und eine reibungslose Termin-Anfrage erlauben — am Handy genauso wie am Desktop.",
    bullets: [
      "Sprechzeiten, Notdienst und Anfahrt prominent",
      "Behandlungen und Schwerpunkte verständlich erklärt",
      "Team-Bereich mit Qualifikationen",
      "Online-Termin-Anfrage mit Bestätigungs-Mail",
      "Seriöser, ruhiger Auftritt ohne Effekthascherei",
    ],
  },
  {
    slug: "friseur",
    label: "Friseure & Kosmetikstudios",
    inquirySlug: "friseur",
    image: {
      src: "/images/sitalo-friseur-mobile.png",
      alt: 'Friseur-Website von Sitalo auf einem iPhone, daneben gedruckte Visitenkarten und ein Flyer für „Friseur am Markt".',
    },
    body: "Bilder verkaufen. Die Website lebt von hochwertigen Aufnahmen, klaren Leistungen und transparenten Preisen — und einem direkten Weg zur Termin-Anfrage.",
    bullets: [
      "Galerie mit Lightbox für vor/nach-Bilder",
      "Leistungen und Preise transparent",
      "Termin-Anfrage per Formular oder WhatsApp",
      "Online-Reservierungsmöglichkeit auf Wunsch",
      "Hochwertige Atmosphäre durch ruhiges Design",
    ],
  },
  {
    slug: "gastro",
    label: "Cafés & Restaurants",
    inquirySlug: "gastro",
    image: {
      src: "/images/sitalo-cafe-mobile.png",
      alt: "Café-Website von Sitalo auf einem iPhone, vor einem Café im Hintergrund — daneben eine Sitalo-Webdesign-Visitenkarte.",
    },
    body: "Die meisten Gäste googeln vorm Besuch. Die Website muss Speisekarte, Öffnungszeiten und Anfahrt sofort liefern — am besten verwaltbar, damit Wochenangebote ohne Webdesign-Termin geändert werden können.",
    bullets: [
      "Speisekarte als verwaltbarer Inhalt",
      "Wochenangebot oder Mittagstisch änderbar",
      "Öffnungszeiten und Feiertage prominent",
      "Reservierungs-Anfrage per Formular oder WhatsApp",
      "Google Maps und Direktwahl-Telefon",
    ],
  },
  {
    slug: "handwerker",
    label: "Handwerker",
    inquirySlug: "handwerker",
    image: {
      src: "/images/sitalo-handwerker-laptop.png",
      alt: 'Tischlerei-Website von Sitalo („Maßarbeit mit Tradition und Leidenschaft") auf einem Laptop auf einer Werkbank.',
    },
    body: "Im Handwerk kommt der Auftrag oft schon vor dem ersten Telefonat. Eine Website mit klaren Leistungen, Referenz-Bildern und kurzem Anfrageweg gewinnt Aufträge, die sonst beim nächsten Konkurrenten landen.",
    bullets: [
      "Leistungen und Einsatzgebiet klar dargestellt",
      "Galerie mit umgesetzten Projekten",
      "Rückruf-Anfrage und WhatsApp",
      "Notfall- und Direktkontakt sichtbar",
      "Vertrauen durch Team, Innung und Zertifikate",
    ],
  },
  {
    slug: "reinigung",
    label: "Reinigungsfirmen",
    inquirySlug: "reinigung",
    image: {
      src: "/images/sitalo-reinigung-laptop.png",
      alt: 'Reinigungs-Website von Sitalo („Saubere Räume. Besseres Arbeiten.") auf einem Laptop, daneben Sprühflasche, Tasse und Wischmopp.',
    },
    body: "Reinigung wird über Service-Pakete verkauft. Die Website muss Pakete vergleichbar machen, ein Angebots-Formular bieten und Vertrauen aufbauen — denn der Kunde lässt fremde Menschen in seine Räume.",
    bullets: [
      "Service-Pakete im direkten Vergleich",
      "Angebot anfragen mit konfigurierbarer Auswahl",
      "Einsatzgebiet und Objektarten klar",
      "Vertrauen durch Versicherungs- und DSGVO-Hinweise",
      "24/7-Notdienst, falls angeboten",
    ],
  },
  {
    slug: "kanzlei",
    label: "Kanzleien",
    inquirySlug: "kanzlei",
    image: {
      src: "/images/sitalo-kanzlei-laptop.png",
      alt: 'Kanzlei-Website von Sitalo („Recht, das Klarheit schafft.") auf einem Laptop im Büro mit Aktenordnern und Tasse.',
    },
    body: "Bei Kanzleien zählt Seriosität. Klare Rechtsgebiete, ein ruhiger Auftritt, vertrauliche Erstkontakt-Anfrage — und ein Design, das mehr wie ein traditionelles Boutique-Office wirkt als wie ein Start-up.",
    bullets: [
      "Rechtsgebiete übersichtlich strukturiert",
      "Team mit Spezialisierungen",
      "Vertrauliche Erstberatungs-Anfrage",
      "Seriöse Typografie, ruhiges Farbschema",
      "Kontakt mit klaren Sprech- und Rückrufzeiten",
    ],
  },
  {
    slug: "fitness",
    label: "Fitnessstudios",
    inquirySlug: "fitness",
    image: {
      src: "/images/sitalo-fitness-laptop.png",
      alt: 'Fitnessstudio-Website von Sitalo („Stronger Every Day. Premium Training.") auf einem Laptop im Studio.',
    },
    body: "Studios verkaufen Mitgliedschaften. Probetraining und Kursplan müssen ohne Hürden zu finden sein, und der Anmeldeweg darf nicht in einer veralteten PDF enden.",
    bullets: [
      "Kursplan und Trainer:innen sichtbar",
      "Probetraining mit einer Anfrage gebucht",
      "Mitgliedschaftsanfrage per Formular oder WhatsApp",
      "Öffnungszeiten und Standort prominent",
      "Bildergalerie der Räumlichkeiten",
    ],
  },
];

export default function BranchenPage() {
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
            Websites,
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              die zu Ihrer Branche passen.
            </span>
          </h1>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
            Ich passe Struktur, Design und Inhalte an Ihren Alltag an —
            vom Pflegedienst bis zum Café um die Ecke.
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
          {BRANCHEN.map((b, i) => (
            <li
              key={b.slug}
              className="grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20"
            >
              <div
                className={
                  i % 2 === 0 ? "lg:order-1" : "lg:order-2"
                }
              >
                {b.image ? (
                  <div className="bg-secondary/40 relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-[0_24px_48px_-16px_rgb(0_0_0/0.18)] ring-1 ring-black/5">
                    <Image
                      src={b.image.src}
                      alt={b.image.alt}
                      fill
                      sizes="(min-width: 1024px) 720px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-secondary/30 flex aspect-[16/10] w-full items-center justify-center rounded-2xl">
                    <span className="serif text-foreground/20 text-[8rem] font-normal leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
              <div
                className={
                  i % 2 === 0
                    ? "flex flex-col justify-center lg:order-2"
                    : "flex flex-col justify-center lg:order-1"
                }
              >
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
                  Branche
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  {b.label}
                </h2>
                <p className="text-foreground/80 mt-6 max-w-xl text-pretty text-lg leading-relaxed">
                  {b.body}
                </p>
                <ul className="divide-border/60 mt-8 divide-y">
                  {b.bullets.map((item) => (
                    <li
                      key={item}
                      className="text-foreground/85 flex items-baseline gap-4 py-3 text-[15px] leading-relaxed"
                    >
                      <span className="text-muted-foreground/70 font-mono text-xs">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    href={`/anfrage?branche=${b.inquirySlug}`}
                    className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
                  >
                    Diese Seite anfragen
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
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
          Ihre Branche
          <br />
          <span className="serif-italic text-background/70 font-normal">
            nicht dabei?
          </span>
        </h2>
        <p className="text-background/65 mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Ich baue Websites für lokale Unternehmen aller Art — sagen Sie mir
          einfach, was Sie brauchen.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Anfrage starten
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
