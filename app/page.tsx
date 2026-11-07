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
import { PaketKacheln } from "@/components/marketing/hafen/paket-kacheln";
import { paketeKurz } from "@/components/marketing/hafen/paket-kurz";
import { RevealRoot } from "@/components/marketing/hafen/reveal";
import { Steigend } from "@/components/marketing/hafen/steigend";
import { VorherNachher as VorherNachherRegler } from "@/components/marketing/hafen/vorher-nachher";
import { LivePreview } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { HamburgPanorama } from "@/components/marketing/hamburg-panorama";
import { MONATSBEITRAEGE, PAKETE, PREIS_HINWEIS, getPaketBySlug } from "@/lib/pakete-data";

const CONTACT_EMAIL = "info@sitalo.de";

// Der Pegel St. Pauli im Kopf (components/marketing/hafen/pegel.ts) wird
// alle zehn Minuten neu geholt; die Seite folgt im selben Takt. Steht hier
// ausdrücklich, damit die Absicht nicht nur am fetch hängt.
export const revalidate = 600;

export const metadata: Metadata = {
  // Absoluter Titel — sonst hängt das Layout-Template noch ein
  // „· Sitalo" an den ohnehin gebrandeten Home-Titel.
  // Die Startseite führt Marke und „Webdesign Hamburg“. „Website erstellen
  // lassen“ steht im Titel der Geldseite /website-erstellen-lassen, damit
  // sich beide Seiten bei Google keine Konkurrenz machen; die H1 im Hero
  // nennt den Begriff weiterhin, Preise() verlinkt auf die Geldseite.
  title: { absolute: `Webdesign Hamburg · Websites zum Festpreis ${PAKETE[0].setup} | Sitalo` },
  description: `Webdesign aus Hamburg für Betriebe in ganz Deutschland: Websites zum Festpreis ${PAKETE[0].setup}, Test-Link vor dem Start und kleine Änderungen im Monatsbeitrag.`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Sitalo · Webdesign Hamburg",
    description: `Websites für Betriebe in ganz Deutschland, gestaltet in Hamburg. Festpreis ${PAKETE[0].setup}, Test-Link vor dem Start.`,
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    // Bild wird automatisch aus app/opengraph-image.tsx übernommen.
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitalo · Webdesign Hamburg",
    description: `Websites für Betriebe in ganz Deutschland, gestaltet in Hamburg. Festpreis ${PAKETE[0].setup}.`,
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
    a: `Ja, einen Monatsbeitrag für Hosting, Pflege und kleine Änderungen: je nach Paket ${MONATSBEITRAEGE}, inkl. 19\u00A0% MwSt. Nach sechs Monaten Mindestlaufzeit ist er zum Monatsende kündbar. Beim Ausstieg übergeben wir den kompletten Bestand.`,
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
const STARTER_PRICE = STARTER ? STARTER.setup.replace(/^ab\s*/, "") : "599\u00A0€";
const MONTHLY_FROM = STARTER ? STARTER.monthly.replace(/\s*\/\s*Monat$/, "") : "ab 59\u00A0€";
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
 * Helle Abschnitte trennen sich nur über den Flächenwechsel Elbnebel ↔
 * Karte, ohne Haarlinien. Jeder Kopf ist eine große Aussage
 * (.buehne-titel) mit einem vorhandenen Satz in Grau darunter
 * (.buehne-unter), Abstände über .buehne-abschnitt und .buehne-kopf
 * (app/hafen.css, Block „Bühne“). Regel für die Köpfe: helle
 * Präsentations-Abschnitte zentriert (Leistungen, Lotse, Vorschau,
 * Preise, Vorher/Nachher), dunkle Hafen-Abschnitte linksbündig und am
 * Rechner zweispaltig (Ladeliste, Ablauf), Fragen und Kontakt in der
 * kleinen Stufe linksbündig. Ein Kopf hat zwei Stufen; weiterer
 * Fließtext steht beim Inhalt.
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
      <main id="main" tabIndex={-1} className="buehne flex-1">
        <RevealRoot />
        <HafenHero />
        <Leistungen />
        <Ladeliste
          id="ladeliste"
          top={<Ladehafen />}
          head={<LadelisteKopf />}
          pakete={PAKETE_KURZ}
          className="spaeter-geladen"
          style={spaeter(2830, 2080)}
        />
        <section id="lotse" className="spaeter-geladen buehne-abschnitt scroll-mt-20" style={spaeter(1950, 1420)}>
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
 *  px schmal / ab 1024 px. Gemessen bei 390, 1024 und 1440 px; bei
 *  Textänderungen grob nachziehen. Die Ablauf-Szene setzt ihre Höhe am
 *  Rechner selbst (app/hafen.css, Block „Ablauf-Szene“). */
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
      className="spaeter-geladen buehne-abschnitt bg-card scroll-mt-20"
      style={spaeter(1905, 1320)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="buehne-kopf buehne-mitte">
          <h2 data-reveal="rise" className="buehne-titel">
            <Steigend text="Was zu Ihrer Website gehört" />
          </h2>
          <p data-reveal="fade" className="buehne-unter">
            Auf jedem Container steht, ab welchem Paket er mitfährt. Geladen wird nur, was Ihr Betrieb braucht.
          </p>
          <p className="mt-5">
            <Link href="/leistungen" className="link-pfeil text-[15px] font-semibold">
              Alle <span className="whitespace-nowrap">Leistungen{ARROW}</span>
            </Link>
          </p>
        </div>
        <div>
          <ContainerStack />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Ladehafen: Hamburg als Linienzeichnung oben im dunklen Abschnitt der
 * Ladeliste. Zeichnet sich beim Hinscrollen, danach gehen die Lichter
 * an. Darunter steht die Ladeliste – der Hafen, in dem geladen wird.
 * ---------------------------------------------------------------- */
function Ladehafen() {
  return (
    <div className="pt-8 sm:pt-14">
      <HamburgPanorama tone="dark" />
      <p className="label-mono text-stahl-hell mx-auto -mt-2 w-full max-w-6xl px-5 sm:-mt-4 sm:px-6">
        Ladehafen Hamburg<span className="hidden sm:inline"> · Köhlbrandbrücke bis Speicherstadt</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Ladeliste: Kopf der linken Spalte. Auswahl und Frachtpapier
 * liegen in components/marketing/hafen/ladeliste.tsx.
 * ---------------------------------------------------------------- */
function LadelisteKopf() {
  return (
    <>
      <div className="buehne-kopf buehne-kopf-zweispaltig">
        <h2 data-reveal="rise" className="buehne-titel">
          <Steigend text="Die Ladeliste für Ihre Branche" />
        </h2>
        <div>
          <p data-reveal="fade" className="buehne-unter text-stahl-hell">
            Wer einen Pflegedienst sucht, hat andere Fragen als jemand, der einen Tisch reservieren will.
          </p>
          <p className="mt-5">
            <Link href="/branchen" className="link-pfeil link-pfeil-dunkel text-[15px] font-semibold">
              Alle Branchen im <span className="whitespace-nowrap">Einzelnen{ARROW}</span>
            </Link>
          </p>
        </div>
      </div>
      {/* Die Anleitung gehört zum Werkzeug und steht direkt darüber. */}
      <p data-reveal="fade" className="text-stahl-hell mb-8 max-w-[38em] text-[17px] leading-relaxed lg:mb-10">
        Wählen Sie Ihre Branche: Die Liste zeigt, was auf Ihre Seite gehört, wo es steht und warum.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------
 * Live-Vorschau: Betriebsname eintippen, Skizze entsteht sofort.
 * ---------------------------------------------------------------- */
function Vorschau() {
  return (
    <section id="vorschau" className="spaeter-geladen buehne-abschnitt scroll-mt-20" style={spaeter(1200, 1600)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="buehne-kopf buehne-mitte">
          <h2 data-reveal="rise" className="buehne-titel">
            <Steigend text="Eine erste Skizze mit Ihrem Namen" />
          </h2>
          <p data-reveal="fade" className="buehne-unter">
            Geben Sie den Namen Ihres Betriebs ein und wählen Sie die Branche.
          </p>
        </div>
        {/* Das Gerät fährt beim Hinscrollen auf die Bühne (.buehne-einzug). */}
        <div className="buehne-einzug mx-auto max-w-5xl min-w-0">
          <LivePreview />
        </div>
        <div className="text-muted-foreground mx-auto mt-10 grid max-w-5xl gap-4 text-[17px] leading-relaxed md:mt-12 md:grid-cols-2 md:gap-8">
          <p data-reveal="fade">Die Skizze entsteht sofort hier im Browser, gespeichert wird nichts.</p>
          <p data-reveal="fade">
            Gefällt Ihnen die Richtung, schicken Sie die Skizze als Anfrage. Die echte Seite entwerfen wir danach mit
            Ihren Fotos und Texten.
          </p>
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
      className="ablauf-spur spaeter-geladen buehne-abschnitt bg-foreground text-background scroll-mt-16"
      style={spaeter(1320, 1040)}
    >
      {/* Die eine Scroll-Szene der Seite: Am Rechner bleibt die Bühne
          stehen, während die Fähre die Halte abfährt (app/hafen.css,
          Block „Ablauf-Szene“; Fortschritt in faehrlinie.tsx). Mobil, auf
          niedrigen Fenstern, ohne Script und bei reduzierter Bewegung
          ein normaler Abschnitt. */}
      <div className="ablauf-buehne">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="buehne-kopf buehne-kopf-zweispaltig">
            <h2 data-reveal="rise" className="buehne-titel">
              <Steigend text="Der Weg zur fertigen Seite, kurz gefasst" />
            </h2>
            <div>
              <p data-reveal="fade" className="buehne-unter">
                Vom ersten Anruf an sprechen Sie mit uns selbst, auch wenn die Seite längst online ist.
              </p>
            </div>
          </div>
          <div>
            <Faehrlinie />
          </div>
          <div className="ablauf-fuss border-background/15 text-stahl-hell mt-14 flex flex-col justify-between gap-2 border-t pt-5 font-mono text-[12px] sm:mt-16 sm:flex-row">
            <span>Antwort auf Anrufe und Mails meist am selben Werktag.</span>
            <Link href="/ablauf" className="link-pfeil link-pfeil-dunkel link-pfeil-zeile self-start">
              Ablauf im Detail <span className="pfeil">→</span>
            </Link>
          </div>
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
    <section
      id="preise"
      className="spaeter-geladen buehne-abschnitt bg-card scroll-mt-20"
      style={spaeter(2950, 1900)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="buehne-kopf buehne-mitte">
          <h2 data-reveal="rise" className="buehne-titel">
            <Steigend text={`Festpreis ab ${STARTER_PRICE}`} />
          </h2>
          <p data-reveal="fade" className="buehne-unter">
            Den Preis bekommen Sie schriftlich, bevor wir anfangen.
          </p>
        </div>
        <PaketKacheln flaeche="bg-background" />

        {/* Hafen-Akzent: die Abfahrtstafel als schmales Band, nur Linie,
            Name und Preis. Die Sätze stehen schon auf den Kacheln. */}
        <div className="mx-auto mt-12 max-w-2xl min-w-0 lg:mt-16">
          <Abfahrtstafel pakete={PAKETE_KURZ} schmal />
        </div>

        {/* Abschluss zentriert: ein Absatz, darunter Knopf und Link als
            Paar, das Kleingedruckte zuletzt. */}
        <div className="mx-auto mt-14 max-w-[40em] text-center lg:mt-20">
          <p data-reveal="fade" className="text-muted-foreground text-[17px] leading-relaxed text-pretty">
            Kommt später etwas dazu, sprechen wir vorher darüber. Welches Paket passt, klären wir im ersten Telefonat.
            Für die meisten Betriebe empfehlen wir Business; die{" "}
            <Link href="#ladeliste" className="text-foreground underline decoration-[var(--gold)] decoration-2 underline-offset-4">
              Ladeliste
            </Link>{" "}
            nennt die Empfehlung für Ihre Branche.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href="/anfrage" className="btn-signal btn-ruhig">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href="/pakete#vergleich" className="link-pfeil text-[15px] font-semibold">
              Pakete <span className="whitespace-nowrap">vergleichen{ARROW}</span>
            </Link>
          </div>
          <div className="mt-10">
            <p className="text-muted-foreground font-mono text-[12px] leading-relaxed">
              Einmalpreise, dazu ein Monatsbeitrag {MONTHLY_FROM}.
              {STUDIO ? (
                <>
                  {" "}
                  Für ein neues Erscheinungsbild gibt es{" "}
                  <Link
                    href={`/pakete/${STUDIO.slug}`}
                    className="text-foreground underline decoration-[var(--gold)] underline-offset-4"
                  >
                    {STUDIO.name} {STUDIO.setup}
                  </Link>
                  .
                </>
              ) : null}{" "}
              {PREIS_HINWEIS}
            </p>
            <p className="mt-3">
              <Link
                href="/website-erstellen-lassen"
                className="link-pfeil text-muted-foreground hover:text-foreground text-[14.5px] font-semibold"
              >
                Website erstellen lassen: Preise und <span className="whitespace-nowrap">Ablauf{ARROW}</span>
              </Link>
            </p>
          </div>
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
    <section className="spaeter buehne-abschnitt" style={spaeter(820, 1410)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="buehne-kopf buehne-mitte">
          <h2 data-reveal="rise" className="buehne-titel">
            <Steigend text="Dieselben Inhalte, neu gebaut" />
          </h2>
          <p data-reveal="fade" className="buehne-unter">
            Ziehen Sie den Regler.
          </p>
        </div>
        <div className="buehne-einzug">
          <VorherNachherRegler />
        </div>
        <p data-reveal="fade" className="text-muted-foreground mx-auto mt-10 max-w-[38em] text-center text-[17px] leading-relaxed md:mt-12">
          Links steht eine Seite, wie sie viele Betriebe seit Jahren haben. Rechts stehen dieselben Angaben, geordnet
          nach dem, was Kunden zuerst wissen wollen. Die Tischlerei ist frei erfunden.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Fragen: offen gesetzt wie ein kurzes Interview, nichts zum Aufklappen.
 * ---------------------------------------------------------------- */
function Fragen() {
  return (
    <section id="faq" className="spaeter buehne-abschnitt bg-card scroll-mt-20" style={spaeter(1600, 1000)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="buehne-kopf">
          <h2 data-reveal="rise" className="buehne-titel-klein">
            <Steigend text="Was vor dem ersten Anruf oft gefragt wird" />
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-1">
            <li>
              <Link href="/faq" className="link-pfeil text-[15px] font-semibold">
                Alle <span className="whitespace-nowrap">Fragen{ARROW}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/webseite-erstellen"
                className="link-pfeil text-muted-foreground hover:text-foreground text-[14.5px] font-semibold"
              >
                Selbst bauen: Webseite erstellen in sieben <span className="whitespace-nowrap">Schritten{ARROW}</span>
              </Link>
            </li>
          </ul>
        </div>
        <dl data-reveal="stagger" className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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

/** Telefonnummer als Ziffern in Masken (Kontakt-Finale). --n zählt die
 *  Ziffern, --p ist die Pause zwischen Vorwahl und Rufnummer. */
const TEL_TEILE = ["0160", "7621876"];

function TelZiffern() {
  let n = 0;
  return (
    <span aria-hidden="true" className="tel-ziffern">
      {TEL_TEILE.map((teil, t) => (
        <span key={teil}>
          {t > 0 ? "\u00A0" : null}
          {teil.split("").map((z, i) => (
            <span key={i} className="tel-m">
              <span style={{ "--n": n++, "--p": t } as CSSProperties}>{z}</span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------
 * Kontakt: Telefonnummer groß, daneben Mail und Anfrage. Die Nummer ist
 * das Finale der Seite: Beim ersten Sichtkontakt steigen die Ziffern aus
 * ihren Masken, darunter zeichnet sich eine orange Linie (app/hafen.css,
 * Block „Reveal“, data-reveal="tel").
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <section
      id="kontakt"
      className="spaeter buehne-abschnitt grain bg-foreground text-background scroll-mt-20"
      style={spaeter(650, 610)}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:flex lg:flex-col lg:justify-between">
          <h2 data-reveal="rise" className="buehne-titel-klein">
            <Steigend text="Am schnellsten geht es am Telefon." />
          </h2>
          <a
            href="tel:+491607621876"
            aria-label="0160 7621876"
            data-reveal="tel"
            className="tel-finale mt-5 inline-block self-start text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap sm:text-[4.2rem] lg:mt-10 lg:text-[4.4rem] xl:text-[4.9rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            <TelZiffern />
            <span className="tel-linie" aria-hidden="true" />
          </a>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p data-reveal="fade" className="text-stahl-hell text-[16.5px] leading-relaxed">
            Eine Viertelstunde reicht meistens. Danach kennen Sie den Festpreis und den Termin. Wer lieber schreibt,
            erreicht uns per Mail oder über das Anfrageformular. Die Antwort kommt meist am selben Werktag.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mail-link relative mt-6 inline-block text-[19px] font-semibold after:absolute after:inset-x-0 after:-inset-y-2"
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
    </section>
  );
}
