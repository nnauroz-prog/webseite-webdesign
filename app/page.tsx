import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BeforeAfter } from "@/components/marketing/before-after";
import { Abfahrtstafel } from "@/components/marketing/hafen/abfahrtstafel";
import { ContainerStack } from "@/components/marketing/hafen/container-stack";
import { Faehrlinie } from "@/components/marketing/hafen/faehrlinie";
import { HafenHero } from "@/components/marketing/hafen/hafen-hero";
import { LivePreview } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { HamburgPanorama } from "@/components/marketing/hamburg-panorama";
import { getPaketBySlug } from "@/lib/pakete-data";

const CONTACT_EMAIL = "info@sitalo.de";

export const metadata: Metadata = {
  // Absoluter Titel — sonst hängt das Layout-Template noch ein
  // „· Sitalo" an den ohnehin gebrandeten Home-Titel.
  title: { absolute: "Website erstellen lassen · Webdesign aus Hamburg | Sitalo" },
  description:
    "Website erstellen lassen zum Festpreis ab 499 €: individuell gestaltet, für Handy und Google optimiert. Persönlich aus Hamburg, für Betriebe in ganz Deutschland.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Sitalo — Webdesign aus Hamburg",
    description:
      "Websites für Betriebe in ganz Deutschland, gestaltet in Hamburg. Festpreis ab 499 €, Test-Link vor dem Start.",
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    // Bild wird automatisch aus app/opengraph-image.tsx übernommen.
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitalo — Webdesign aus Hamburg",
    description: "Websites für Betriebe in ganz Deutschland, gestaltet in Hamburg. Festpreis ab 499 €.",
  },
};

const FAQ = [
  {
    q: "Wie schnell ist meine Seite fertig?",
    a: "Wenn Sie uns alle Unterlagen geschickt haben, oft schon nach 1–2 Werktagen. Bei größeren Projekten vereinbaren wir vorab einen verbindlichen Termin.",
  },
  {
    q: "Was brauchen Sie von mir?",
    a: "Ihr Logo (falls vorhanden), ein paar Bilder, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, sagen wir Bescheid und helfen bei Formulierungen.",
  },
  {
    q: "Gibt es laufende Kosten?",
    a: "Ja, für Hosting, Pflege und kleine Änderungen: je nach Paket ab 49 €, 79 € oder 179 € im Monat. Nach sechs Monaten Mindestlaufzeit ist der Vertrag zum Monatsende kündbar. Beim Ausstieg übergeben wir den kompletten Bestand.",
  },
  {
    q: "Kann ich später noch Sachen ändern lassen?",
    a: "Ja. Kleine Änderungen sind in der monatlichen Betreuung dabei. Sie schreiben uns kurz, wir setzen es um. Auf Wunsch bauen wir auch Bereiche ein, die Sie selbst pflegen.",
  },
];

// FAQPage-Strukturierte Daten für die Startseiten-Fragen.
const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const STARTER = getPaketBySlug("starter");
const STARTER_PRICE = STARTER ? STARTER.setup.replace(/^ab\s*/, "") : "499 €";

export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <MarketingHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        <HafenHero />
        <Leistungen />
        <Vorschau />
        <Ablauf />
        <Preise />
        <VorherNachher />
        <Musterseiten />
        <Fragen />
        <Kontakt />
      </main>
      <MarketingFooter />
    </div>
  );
}

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/* ------------------------------------------------------------------
 * Leistungen als Containerstapel.
 * ---------------------------------------------------------------- */
function Leistungen() {
  return (
    <section id="leistungen" className="bg-card border-foreground scroll-mt-20 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <h2 className="max-w-4xl text-balance text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:text-[4.4rem]">
          Was zu Ihrer Website gehört
        </h2>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mt-8">
          <p className="text-muted-foreground max-w-xl text-[17px] leading-relaxed">
            Ein Teil fährt in jedem Paket mit, der Rest je nach Bedarf. Was Ihr Betrieb nicht braucht, bleibt an Land.
          </p>
          <Link href="/leistungen" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
            Alle Leistungen {ARROW}
          </Link>
        </div>
        <div className="mt-12 sm:mt-16">
          <ContainerStack />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Live-Vorschau: Betriebsname eintippen, Skizze entsteht sofort.
 * ---------------------------------------------------------------- */
function Vorschau() {
  return (
    <section id="vorschau" className="border-border scroll-mt-20 border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4 lg:pt-2">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">Wie sähe Ihre Seite aus?</h2>
          <p className="text-muted-foreground mt-5 text-[16.5px] leading-relaxed">
            Tippen Sie den Namen Ihres Betriebs ein und wählen Sie die Branche. Die Skizze entsteht hier im Browser, ohne
            Anmeldung.
          </p>
          <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
            Gefällt Ihnen die Richtung, schicken Sie die Skizze mit einem Klick als Anfrage. Die echte Seite gestalten wir
            danach für Ihren Betrieb.
          </p>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <LivePreview />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Ablauf als Fährlinie.
 * ---------------------------------------------------------------- */
function Ablauf() {
  return (
    <section id="ablauf" className="grain bg-foreground text-background scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:col-span-7">Eine Linie, vier Halte.</h2>
          <p className="text-stahl-hell max-w-md text-[17px] leading-relaxed lg:col-span-4 lg:col-start-9">
            Vom ersten Anruf bis zur fertigen Seite sprechen Sie mit denselben Leuten.
          </p>
        </div>
        <div className="mt-14 sm:mt-20">
          <Faehrlinie />
        </div>
        <div className="border-background/15 text-stahl-hell mt-14 flex flex-col justify-between gap-2 border-t pt-5 font-mono text-[12px] sm:mt-16 sm:flex-row">
          <span>Verkehrt werktags. Bei Nebel auch.</span>
          <Link href="/ablauf" className="hover:text-background underline-offset-4 hover:underline">
            Ablauf im Detail →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Preise als Abfahrtstafel.
 * ---------------------------------------------------------------- */
function Preise() {
  return (
    <section id="preise" className="border-border scroll-mt-20 border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2 className="text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:text-[3.6rem]">
            Festpreis ab {STARTER_PRICE}
          </h2>
          <p className="text-muted-foreground mt-6 text-[16.5px] leading-relaxed">
            Den Preis bekommen Sie schriftlich, bevor wir anfangen. Kommt später etwas dazu, sprechen wir vorher darüber.
          </p>
          <p className="text-muted-foreground mt-4 text-[16.5px] leading-relaxed">
            Welches Paket passt, klären wir meist in einem kurzen Telefonat. Wir empfehlen meistens Business.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href="/pakete" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
              Pakete vergleichen {ARROW}
            </Link>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7 lg:col-start-6">
          <Abfahrtstafel />
          <p className="text-muted-foreground mt-3 font-mono text-[12px] leading-relaxed">
            Einmalpreise, dazu ein Monatsbeitrag je Paket. Das größere Paket Studio steht auf der Paketseite.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Vorher / Nachher.
 * ---------------------------------------------------------------- */
function VorherNachher() {
  return (
    <section className="bg-card border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl lg:col-span-6">
            Dieselben Inhalte, neu gebaut
          </h2>
          <p className="text-muted-foreground max-w-lg text-[16.5px] leading-relaxed lg:col-span-5 lg:col-start-8">
            Ziehen Sie den Regler. Links eine Seite, wie viele Betriebe sie seit Jahren haben, rechts dieselben Angaben so,
            wie wir sie bauen. Die Tischlerei ist frei erfunden.
          </p>
        </div>
        <div className="mt-12 lg:mt-14">
          <BeforeAfter />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Musterseiten nach Branche: Bildstrecke wie in einer Zeitung, ein
 * großes Bild, zwei kleine daneben, darunter drei gleich große.
 * ---------------------------------------------------------------- */
const MUSTER = [
  { slug: "pflege", label: "Pflegedienst", src: "/images/sitalo-pflege-laptop.webp" },
  { slug: "handwerker", label: "Tischlerei", src: "/images/sitalo-handwerker-laptop.webp" },
  { slug: "praxis", label: "Arztpraxis", src: "/images/sitalo-praxis-laptop.webp" },
  { slug: "kanzlei", label: "Kanzlei", src: "/images/sitalo-kanzlei-laptop.webp" },
  { slug: "hotel", label: "Hotel", src: "/images/sitalo-hotel-laptop.webp" },
  { slug: "kosmetik", label: "Kosmetikstudio", src: "/images/sitalo-kosmetik-laptop.webp" },
];

function Musterseiten() {
  return (
    <section className="border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="max-w-2xl text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
            Musterseiten aus sechs Branchen
          </h2>
          <Link href="/branchen" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
            Alle Branchen {ARROW}
          </Link>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:mt-14 lg:grid-cols-12 lg:gap-y-10">
          {MUSTER.map((m, i) => (
            <li
              key={m.slug}
              className={
                i === 0
                  ? "col-span-2 lg:col-span-7 lg:row-span-2"
                  : i < 3
                    ? "col-span-1 lg:col-span-5"
                    : "col-span-1 lg:col-span-4"
              }
            >
              <Link href={`/branchen/${m.slug}`} className="group flex h-full flex-col">
                <div className={`bg-secondary relative overflow-hidden ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:flex-1" : "aspect-[4/3]"}`}>
                  <Image
                    src={m.src}
                    alt={`Musterseite für ${m.label} auf einem Laptop`}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 440px, 50vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="text-[16px] font-semibold tracking-tight sm:text-[17px]">{m.label}</span>
                  <span className="label-mono text-muted-foreground text-[11px]">Musterseite</span>
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
 * Fragen: offen gesetzt wie ein kurzes Interview, nichts zum Aufklappen.
 * ---------------------------------------------------------------- */
function Fragen() {
  return (
    <section id="faq" className="bg-card border-border scroll-mt-20 border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
            Was vor dem ersten Anruf oft gefragt wird
          </h2>
          <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
            Alle Fragen {ARROW}
          </Link>
        </div>
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          {FAQ.map((item) => (
            <div key={item.q} className="border-foreground border-t pt-5">
              <dt className="text-[18px] font-semibold leading-snug tracking-[-0.01em]">{item.q}</dt>
              <dd className="text-muted-foreground mt-3 text-[15.5px] leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Kontakt: Telefonnummer groß, daneben Mail und Anfrage.
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <section id="kontakt" className="grain bg-foreground text-background scroll-mt-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-20 pb-14 sm:px-6 sm:pt-28 sm:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-stahl-hell text-[1.6rem] leading-[1.1] tracking-[-0.02em] sm:text-[2rem]">
            Am schnellsten geht es am Telefon.
          </h2>
          <a
            href="tel:+491607621876"
            className="hover:text-gold mt-5 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[4.2rem] lg:text-[4.4rem] xl:text-[4.9rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160 7621876
          </a>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-stahl-hell text-[16.5px] leading-relaxed">
            Eine Viertelstunde reicht meistens. Danach wissen Sie, was es kostet und wann es losgeht. Wer lieber schreibt,
            schreibt eine Mail oder schickt eine Anfrage. Antwort meist am selben Werktag.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="border-gold mt-6 inline-block border-b-[1.5px] pb-0.5 text-[19px] font-semibold"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="mt-8">
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben {ARROW}
            </Link>
          </div>
        </div>
      </div>
      {/* Hamburg als Linienzeichnung, zeichnet sich beim Hinscrollen.
          Darunter beginnt der Fuß mit der Elbe-Linie. */}
      <HamburgPanorama tone="dark" />
    </section>
  );
}
