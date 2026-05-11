import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

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
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
          Branchen
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          Websites für lokale Unternehmen,
          <br className="hidden sm:inline" /> die professionell wirken müssen.
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
          Wir passen Struktur, Design und Inhalte an Ihre Branche an — vom
          Pflegedienst bis zum Café um die Ecke.
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
          {BRANCHEN.map((b) => (
            <li
              key={b.slug}
              className="border-border/60 bg-card overflow-hidden rounded-3xl border shadow-sm"
            >
              {b.image ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/40">
                  <Image
                    src={b.image.src}
                    alt={b.image.alt}
                    fill
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="p-6 sm:p-9">
                <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em]">
                  Branche
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {b.label}
                </h2>
                <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                  {b.body}
                </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {b.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="text-emerald-600 mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
                <div className="mt-6">
                  <Link
                    href={`/anfrage?branche=${b.inquirySlug}`}
                    className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-tight shadow-sm transition-all hover:shadow"
                  >
                    Website für diese Branche anfragen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
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
          Ihre Branche nicht dabei?
        </h2>
        <p className="text-background/70 mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg">
          Wir bauen Websites für lokale Unternehmen aller Art — sagen Sie uns
          einfach, was Sie brauchen.
        </p>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
        >
          Anfrage starten
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
