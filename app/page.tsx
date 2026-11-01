import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Abfahrtstafel } from "@/components/marketing/hafen/abfahrtstafel";
import { ContainerStack } from "@/components/marketing/hafen/container-stack";
import { Faehrlinie } from "@/components/marketing/hafen/faehrlinie";
import { HafenHero } from "@/components/marketing/hafen/hafen-hero";
import { Ladeliste } from "@/components/marketing/hafen/ladeliste";
import { Lotse } from "@/components/marketing/hafen/lotse";
import { paketeKurz } from "@/components/marketing/hafen/paket-kurz";
import { RevealRoot } from "@/components/marketing/hafen/reveal";
import { VorherNachher as VorherNachherRegler } from "@/components/marketing/hafen/vorher-nachher";
import { WellenKante } from "@/components/marketing/hafen/wellen-kante";
import { LivePreview } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { HamburgPanorama } from "@/components/marketing/hamburg-panorama";
import { getPaketBySlug } from "@/lib/pakete-data";

const CONTACT_EMAIL = "info@sitalo.de";

// Der Pegel St. Pauli im Kopf (components/marketing/hafen/pegel.ts) wird
// alle zehn Minuten neu geholt; die Seite folgt im selben Takt. Steht hier
// ausdrücklich, damit die Absicht nicht nur am fetch hängt.
export const revalidate = 600;

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
    a: "Ab vollständigen Unterlagen ist eine einzelne Seite oft in 1–2 Werktagen online, Business meist in 5–10 Werktagen, Premium in 2–3 Wochen und Studio in 3–5 Wochen. Den genauen Termin nennen wir Ihnen vorab.",
  },
  {
    q: "Was brauchen Sie von mir?",
    a: "Ihr Logo, falls vorhanden, ein paar Fotos, Stichpunkte zu Ihren Leistungen, Öffnungszeiten und Kontaktdaten. Fehlt etwas, sagen wir Bescheid und helfen beim Formulieren.",
  },
  {
    q: "Muss ich die Texte selbst schreiben?",
    a: "Nein. Sie schicken Stichpunkte, wir formulieren daraus die Texte für Ihre Seite. Sie lesen gegen, ändern, was nicht passt, und geben frei.",
  },
  {
    q: "Gibt es laufende Kosten?",
    a: "Ja, einen Monatsbeitrag für Hosting, Pflege und kleine Änderungen: je nach Paket ab 49 €, 79 €, 179 € oder 249 €. Nach sechs Monaten Mindestlaufzeit ist er zum Monatsende kündbar. Beim Ausstieg übergeben wir den kompletten Bestand.",
  },
  {
    q: "Kann ich später noch etwas ändern lassen?",
    a: "Ja. Kleine Änderungen sind im Monatsbeitrag enthalten: Sie schreiben uns kurz, wir setzen sie um. Auf Wunsch bauen wir Bereiche ein, die Sie selbst pflegen.",
  },
  {
    q: "Gehört die Seite mir?",
    a: "Ja. Wechseln Sie später zu einem anderen Anbieter, bekommen Sie den vollständigen Quellcode und alle Inhalte übergeben.",
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
const MONTHLY_FROM = STARTER ? STARTER.monthly.replace(/\s*\/\s*Monat$/, "") : "ab 49 €";
const STUDIO = getPaketBySlug("studio");
/** Name und Preise je Paket für Ladeliste und Abfahrtstafel (Client). */
const PAKETE_KURZ = paketeKurz();

/*
 * Reihenfolge der Abschnitte und warum:
 *  1. Kopf: wer wir sind, was es kostet.
 *  2. Leistungen: was zu jeder Website gehört (Containerstapel).
 *  3. Ladeliste: was davon in IHRER Branche zählt. Hier entsteht das
 *     Gefühl „die kennen sich aus“, deshalb früh und dunkel abgesetzt.
 *  4. Lotse: wer was tut. Nimmt die Sorge vor Aufwand.
 *  5. Ablauf: wie es läuft (Fährlinie).
 *  6. Vorschau: eine Skizze mit dem eigenen Namen. Steht bewusst nicht
 *     direkt hinter der Ladeliste, damit nicht zwei Branchenwähler
 *     aufeinander folgen.
 *  7. Preise: erst jetzt, wenn Nutzen und Aufwand klar sind.
 *  8. Vorher/Nachher: Beleg für die Qualität.
 *  9. Fragen: letzte Zweifel. 10. Kontakt mit Skyline.
 * Hell und dunkel wechseln sich ab, jeder Abschnitt ist anders gebaut.
 * Eine einzige Wellenkante (Leistungen → Ladeliste) markiert den
 * Übergang aufs Wasser; die übrigen Kanten sind gerade. RevealRoot
 * blendet alle data-reveal-Elemente beim Scrollen ein (API in
 * components/marketing/hafen/reveal.tsx).
 */
export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <MarketingHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        <RevealRoot />
        <HafenHero />
        <Leistungen />
        <WellenKante from="card" to="foreground" />
        <Ladeliste
          id="ladeliste"
          head={<LadelisteKopf />}
          pakete={PAKETE_KURZ}
          className="spaeter-geladen"
          style={spaeter(2400, 1600)}
        />
        <section id="lotse" className="spaeter-geladen bg-card scroll-mt-20" style={spaeter(1800, 1130)}>
          <Lotse />
        </section>
        <Ablauf />
        <Vorschau />
        <Preise />
        <VorherNachher />
        <Fragen />
        <Kontakt />
      </main>
      <MarketingFooter />
    </div>
  );
}

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** Startgröße für .spaeter und .spaeter-geladen (app/hafen.css): Höhe in
 *  px schmal / ab 1024 px. Gemessen bei 390 bis 1440 px; bei
 *  Textänderungen grob nachziehen. */
function spaeter(h: number, hLg: number) {
  return { "--spaeter-h": `${h}px`, "--spaeter-h-lg": `${hLg}px` } as CSSProperties;
}

/* ------------------------------------------------------------------
 * Leistungen als Containerstapel.
 * ---------------------------------------------------------------- */
function Leistungen() {
  return (
    <section
      id="leistungen"
      className="spaeter-geladen bg-card border-foreground scroll-mt-20 border-t"
      style={spaeter(1600, 970)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 pb-12 sm:px-6 sm:pt-28 sm:pb-16">
        <h2
          data-reveal="rise"
          className="max-w-4xl text-balance text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:text-[3.6rem]"
        >
          Was zu Ihrer Website gehört
        </h2>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mt-8">
          <p data-reveal="fade" className="text-muted-foreground max-w-xl text-[17px] leading-relaxed">
            Auf jedem Container steht, ab welchem Paket er mitfährt. Geladen wird nur, was Ihr Betrieb braucht.
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
 * Ladeliste: Kopf der linken Spalte. Auswahl und Frachtpapier
 * liegen in components/marketing/hafen/ladeliste.tsx.
 * ---------------------------------------------------------------- */
function LadelisteKopf() {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
      <h2
        data-reveal="rise"
        className="text-balance text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:col-span-7 lg:text-[3.6rem]"
      >
        Die Ladeliste für Ihre Branche
      </h2>
      <div className="max-w-md lg:col-span-4 lg:col-start-9">
        <p data-reveal="fade" className="text-stahl-hell text-[16.5px] leading-relaxed">
          Wer einen Pflegedienst sucht, hat andere Fragen als jemand, der einen Tisch reservieren will. Wählen Sie Ihre
          Branche: Die Liste zeigt, was auf Ihre Seite gehört, wo es steht und warum.
        </p>
        <Link
          href="/branchen"
          className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
        >
          Alle Branchen im Einzelnen {ARROW}
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Live-Vorschau: Betriebsname eintippen, Skizze entsteht sofort.
 * ---------------------------------------------------------------- */
function Vorschau() {
  return (
    <section id="vorschau" className="spaeter-geladen scroll-mt-20" style={spaeter(1050, 900)}>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4 lg:pt-2">
          <h2 data-reveal="rise" className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
            Eine erste Skizze mit Ihrem Namen
          </h2>
          <p data-reveal="fade" className="text-muted-foreground mt-5 text-[16.5px] leading-relaxed">
            Geben Sie den Namen Ihres Betriebs ein und wählen Sie die Branche. Die Skizze entsteht sofort hier im
            Browser, gespeichert wird nichts.
          </p>
          <p data-reveal="fade" className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
            Gefällt Ihnen die Richtung, schicken Sie die Skizze als Anfrage. Die echte Seite entwerfen wir danach mit
            Ihren Fotos und Texten.
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
    <section
      id="ablauf"
      className="spaeter-geladen grain bg-foreground text-background scroll-mt-20"
      style={spaeter(1200, 820)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            data-reveal="rise"
            className="text-balance text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:col-span-7 lg:text-[3.6rem]"
          >
            Der Weg zur fertigen Seite, kurz gefasst
          </h2>
          <p data-reveal="fade" className="text-stahl-hell max-w-md text-[17px] leading-relaxed lg:col-span-4 lg:col-start-9">
            Vom ersten Anruf an sprechen Sie mit uns selbst, auch wenn die Seite längst online ist.
          </p>
        </div>
        <div className="mt-14 sm:mt-20">
          <Faehrlinie />
        </div>
        <div className="border-background/15 text-stahl-hell mt-14 flex flex-col justify-between gap-2 border-t pt-5 font-mono text-[12px] sm:mt-16 sm:flex-row">
          <span>Antwort auf Anrufe und Mails meist am selben Werktag.</span>
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
    <section id="preise" className="spaeter-geladen border-border scroll-mt-20 border-t" style={spaeter(1100, 700)}>
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2
            data-reveal="rise"
            className="text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:text-[3.6rem]"
          >
            Festpreis ab {STARTER_PRICE}
          </h2>
          <p data-reveal="fade" className="text-muted-foreground mt-6 text-[16.5px] leading-relaxed">
            Den Preis bekommen Sie schriftlich, bevor wir anfangen. Kommt später etwas dazu, sprechen wir vorher darüber.
          </p>
          <p data-reveal="fade" className="text-muted-foreground mt-4 text-[16.5px] leading-relaxed">
            Welches Paket passt, klären wir im ersten Telefonat. Für die meisten Betriebe empfehlen wir Business; die{" "}
            <Link href="#ladeliste" className="text-foreground underline decoration-[var(--gold)] decoration-2 underline-offset-4">
              Ladeliste
            </Link>{" "}
            nennt die Empfehlung für Ihre Branche.
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
        <div className="min-w-0 lg:col-span-8 lg:col-start-5">
          <Abfahrtstafel pakete={PAKETE_KURZ} />
          <p className="text-muted-foreground mt-3 font-mono text-[12px] leading-relaxed">
            Einmalpreise, dazu ein Monatsbeitrag {MONTHLY_FROM}.
            {STUDIO ? ` ${STUDIO.name} ${STUDIO.setup} steht auf der Paketseite.` : null}
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
    <section className="spaeter bg-card border-border border-t" style={spaeter(760, 1140)}>
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            data-reveal="rise"
            className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl lg:col-span-6"
          >
            Dieselben Inhalte, neu gebaut
          </h2>
          <p
            data-reveal="fade"
            className="text-muted-foreground max-w-lg text-[16.5px] leading-relaxed lg:col-span-5 lg:col-start-8"
          >
            Ziehen Sie den Regler. Links steht eine Seite, wie sie viele Betriebe seit Jahren haben. Rechts stehen
            dieselben Angaben, geordnet nach dem, was Kunden zuerst wissen wollen. Die Tischlerei ist frei erfunden.
          </p>
        </div>
        <div className="mt-12 lg:mt-14">
          <VorherNachherRegler />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Fragen: offen gesetzt wie ein kurzes Interview, nichts zum Aufklappen.
 * ---------------------------------------------------------------- */
function Fragen() {
  return (
    <section id="faq" className="spaeter border-border scroll-mt-20 border-t" style={spaeter(1450, 880)}>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 data-reveal="rise" className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
            Was vor dem ersten Anruf oft gefragt wird
          </h2>
          <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
            Alle Fragen {ARROW}
          </Link>
        </div>
        <dl data-reveal="stagger" className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
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
    <section id="kontakt" className="spaeter grain bg-foreground text-background scroll-mt-20" style={spaeter(740, 744)}>
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-20 pb-14 sm:px-6 sm:pt-28 sm:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2
            data-reveal="rise"
            className="text-stahl-hell text-[1.6rem] leading-[1.1] tracking-[-0.02em] sm:text-[2rem]"
          >
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
          <p data-reveal="fade" className="text-stahl-hell text-[16.5px] leading-relaxed">
            Eine Viertelstunde reicht meistens. Danach kennen Sie den Festpreis und den Termin. Wer lieber schreibt,
            erreicht uns per Mail oder über das Anfrageformular. Die Antwort kommt meist am selben Werktag.
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
