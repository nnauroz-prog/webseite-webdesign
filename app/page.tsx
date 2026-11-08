import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, CalendarDays, Gauge, ListChecks, Phone, Receipt, ScanSearch, Search } from "lucide-react";

import {
  Abschluss,
  BentoKachel,
  BentoRaster,
  BrowserMotiv,
  ContainerMitIcon,
  ContainerMitZeilen,
  ContainerMotiv,
  IconMotiv,
  KreisMotiv,
  MehrLink,
  PflegeMotiv,
  Regal,
  RegalKarte,
  TextSzene,
} from "@/components/marketing/apple";
import { Faehrlinie } from "@/components/marketing/hafen/faehrlinie";
import { HafenHero } from "@/components/marketing/hafen/hafen-hero";
import { Ladeliste } from "@/components/marketing/hafen/ladeliste";
import { Lotse } from "@/components/marketing/hafen/lotse";
import { PaketKacheln } from "@/components/marketing/hafen/paket-kacheln";
import { paketeKurz } from "@/components/marketing/hafen/paket-kurz";
import { RevealRoot } from "@/components/marketing/hafen/reveal";
import { VorherNachher as VorherNachherRegler } from "@/components/marketing/hafen/vorher-nachher";
import { LivePreview } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { STUNDENSATZ_EUR } from "@/lib/honorar-data";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { BOXES } from "@/lib/leistungen-kacheln";
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
const STARTER_PRICE = STARTER ? STARTER.setup.replace(/^ab\s*/, "") : "599 €";
const MONTHLY_FROM = STARTER ? STARTER.monthly.replace(/\s*\/\s*Monat$/, "") : "ab 59 €";
const STUDIO = getPaketBySlug("studio");
/** Name und Preise je Paket für die Ladeliste (Client). */
const PAKETE_KURZ = paketeKurz();
/** Die vier neuesten Ratgeber fürs Journal-Regal. */
const JOURNAL_NEU = JOURNAL_POSTS.slice(0, 4);

/*
 * Reihenfolge der Abschnitte (Apple-Produktseite) und Flächen:
 *  1. Kopf (#fff): Kennzeile, große Botschaft, Pille + Link, darunter
 *     die Containerbrücke als Produktbild.
 *  2. Leistungen (#fff): Bento-Kacheln, hell und schwarz im Wechsel.
 *  3. Text-Szene (#000): eine Aussage, die beim Scrollen hell aufgeht.
 *  4. Werkzeuge (#f5f5f7): Regal mit den kostenlosen Werkzeugen.
 *  5. Ladeliste (#fff): was davon in IHRER Branche zählt.
 *  6. Lotse (#f5f5f7): wer was tut, zwei große Kacheln.
 *  7. Ablauf (#000): die Fährlinie als Scroll-Szene.
 *  8. Vorschau (#fff): eine Skizze mit dem eigenen Namen. Steht bewusst
 *     nicht direkt hinter der Ladeliste (zwei Branchenwähler).
 *  9. Preise (#f5f5f7): die Pakete als Modelle.
 * 10. Vorher/Nachher (#fff): Beleg für die Qualität.
 * 11. Fragen (#f5f5f7): letzte Zweifel, Zweiton-Kopf links.
 * 12. Journal (#fff): Regal mit den neuesten Ratgebern.
 * 13. Kontakt (#000): Telefonnummer groß, Pille und Mail.
 * Danach der Fuß (#f5f5f7).
 * Köpfe: zentriert (.abschnitt-kopf, .t-abschnitt + .t-unter), Regale
 * und Fragen mit Zweiton-Kopf an der linken Inhaltskante. Bewegung nur
 * per CSS (data-auftritt, app/apple.css, Block 12); RevealRoot treibt
 * nur noch die Telefonnummer im Kontakt (data-reveal="tel") und setzt
 * .seite-geladen für .spaeter-geladen.
 */
export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <MarketingHeader cta={false} />
      {/* Lokale Produktleiste: direktes Kind des Wrappers, sonst klebt
          sie am iPhone nicht (components/marketing/produktleiste.tsx). */}
      <Produktleiste
        titel="Sitalo Webdesign"
        titelHref="#start"
        links={[
          { href: "#leistungen", label: "Übersicht" },
          { href: "#werkzeuge", label: "Werkzeuge" },
          { href: "#preise", label: "Pakete" },
          { href: "#faq", label: "Fragen" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <main id="main" tabIndex={-1} className="buehne flex-1">
        <RevealRoot />
        <HafenHero />
        <Leistungen />
        <TextSzene>
          Vom ersten Anruf an sprechen Sie <span className="leuchtet">mit uns selbst</span>, auch wenn die Seite längst
          online ist.
        </TextSzene>
        <Werkzeuge />
        <Ladeliste
          id="ladeliste"
          head={<LadelisteKopf />}
          pakete={PAKETE_KURZ}
          className="spaeter-geladen"
          style={spaeter(1880, 1280)}
        />
        <section id="lotse" className="spaeter-geladen flaeche-hell abschnitt" style={spaeter(1990, 1060)}>
          <Lotse />
        </section>
        <Ablauf />
        <Vorschau />
        <Preise />
        <VorherNachher />
        <Fragen />
        <Journal />
        <Kontakt />
      </main>
      <MarketingFooter ohnePreisHinweis ohneNachOben />
    </div>
  );
}

/** Startgröße für .spaeter und .spaeter-geladen (app/hafen.css): Höhe in
 *  px schmal / ab 1024 px. WICHTIG: contain-intrinsic-block-size gilt nur
 *  für die Inhaltsbox, also die gemessene Gesamthöhe MINUS Innenabstand
 *  oben und unten eintragen (.abschnitt 128/224 px, .abschluss 160/256 px,
 *  Regal nur oben 64/112 px), sonst springen Anker beim weichen Scrollen. Gemessen bei 390, 1024 und 1440 px; bei
 *  Textänderungen grob nachziehen. Die Ablauf-Szene setzt ihre Höhe am
 *  Rechner selbst (app/hafen.css, Block „Ablauf-Szene“). */
function spaeter(h: number, hLg: number) {
  return { "--spaeter-h": `${h}px`, "--spaeter-h-lg": `${hLg}px` } as CSSProperties;
}

/* ------------------------------------------------------------------
 * 2. Leistungen als Bento-Kacheln (Texte: lib/leistungen-kacheln.ts).
 * Desktop: [Website · 7] [Hosting · 5] / [Texte · 4] [Anfragen · 4]
 * [Google · 4] / [Selbst pflegen · 12, Querformat].
 * Töne so gewählt, dass Schwarz und Hell in jeder Anordnung wechseln:
 * gestapelt (s h s h s h), zweispaltig (app/apple.css tauscht dort
 * Anfragen und Google) und im 12er-Raster. Die letzte Kachel ist hell,
 * weil danach die schwarze Text-Szene kommt.
 * ---------------------------------------------------------------- */
const BENTO: Record<
  string,
  { ton: "hell" | "schwarz"; spalten: 4 | 5 | 7 | 12; gross?: boolean; quer?: boolean; motiv: React.ReactNode }
> = {
  "Die Website selbst": { ton: "schwarz", spalten: 7, gross: true, motiv: <BrowserMotiv /> },
  "Hosting und Pflege": {
    ton: "hell",
    spalten: 5,
    gross: true,
    motiv: <ContainerMotiv groesse="l" stapel={["signal", "zink", "gruen"]} />,
  },
  Texte: { ton: "schwarz", spalten: 4, motiv: <ContainerMitZeilen ton="gruen" /> },
  Anfragen: { ton: "hell", spalten: 4, motiv: <KreisMotiv icon={Phone} /> },
  "Bei Google": { ton: "schwarz", spalten: 4, motiv: <ContainerMitIcon ton="signal" icon={Search} /> },
  "Selbst pflegen": { ton: "hell", spalten: 12, quer: true, motiv: <PflegeMotiv /> },
};

function Leistungen() {
  return (
    <section id="leistungen" className="spaeter-geladen flaeche-weiss abschnitt" style={spaeter(3160, 1800)}>
      <div className="inhalt abschnitt-kopf">
        <h2 data-auftritt="titel" className="t-abschnitt">
          Was zu Ihrer Website gehört
        </h2>
        <p className="t-unter">
          Auf jedem Container steht, ab welchem Paket er mitfährt. Geladen wird nur, was Ihr Betrieb braucht.
        </p>
        <p className="mt-3">
          <MehrLink href="/leistungen">Alle Leistungen</MehrLink>
        </p>
      </div>
      <BentoRaster zwoelf>
        {BOXES.map((b) => {
          const k = BENTO[b.title];
          return (
            <BentoKachel
              key={b.title}
              ton={k?.ton ?? "hell"}
              spalten={k?.spalten}
              gross={k?.gross}
              quer={k?.quer}
              eyebrow={b.tag}
              titel={b.title}
              text={b.text}
              href={b.href}
              motiv={k?.motiv}
            />
          );
        })}
      </BentoRaster>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 4. Werkzeuge als Regal. Titel und Sätze wortnah aus den Seiten.
 * ---------------------------------------------------------------- */
function Werkzeuge() {
  return (
    <Regal id="werkzeuge" fett="Werkzeuge." grau="Kostenlos ausprobieren." flaeche="hell">
      <RegalKarte
        eyebrow="Werkzeug"
        titel="Kostenlose Durchsicht Ihrer Website"
        text="Wir sehen uns Ihre Website von Hand an und schicken drei bis fünf konkrete Punkte per Mail, meist innerhalb von zwei Werktagen."
        href="/audit"
        linkText="Ausprobieren"
        motiv={<IconMotiv icon={ScanSearch} />}
      />
      <RegalKarte
        eyebrow="Werkzeug"
        titel="Website-Ladezeit kostenlos testen"
        text="Ladezeit, Barrierefreiheit, Technik und Google-Grundlagen Ihrer Website in etwa 30 Sekunden."
        href="/check"
        linkText="Ausprobieren"
        motiv={<IconMotiv icon={Gauge} />}
      />
      <RegalKarte
        eyebrow="Werkzeug"
        titel="Welches Paket passt? Fünf Fragen"
        text="Fünf Fragen zu Branche, Größe und Zeitplan, danach eine begründete Empfehlung."
        href="/empfehlung"
        linkText="Ausprobieren"
        motiv={<IconMotiv icon={ListChecks} />}
      />
      <RegalKarte
        eyebrow="Kalkulation"
        titel="Website-Kosten über 3 Jahre berechnen"
        text="Sitalo neben Wix, Squarespace, Jimdo und dem Selbstbau, Ihre eigene Arbeitszeit eingerechnet."
        href="/rechner"
        linkText="Ausprobieren"
        motiv={<IconMotiv icon={Calculator} />}
      />
      <RegalKarte
        eyebrow="Termin"
        titel="Kostenloses Erstgespräch buchen"
        text="Bis zu 30 Minuten. Tag und Uhrzeit wählen, Bestätigung per E-Mail meist am selben Werktag."
        href="/termin"
        linkText="Termin wählen"
        motiv={<IconMotiv icon={CalendarDays} />}
      />
      <RegalKarte
        eyebrow="Kalkulation"
        titel="Honorar offen vorgerechnet"
        text={`Stundensatz ${STUNDENSATZ_EUR} € inkl. MwSt., Stunden je Paket und was wir nicht abrechnen.`}
        href="/honorar"
        motiv={<IconMotiv icon={Receipt} />}
      />
    </Regal>
  );
}

/* ------------------------------------------------------------------
 * 5. Ladeliste: Kopf zentriert. Auswahl und Frachtpapier liegen in
 * components/marketing/hafen/ladeliste.tsx.
 * ---------------------------------------------------------------- */
function LadelisteKopf() {
  return (
    <div className="abschnitt-kopf">
      <h2 data-auftritt="titel" className="t-abschnitt">
        Die Ladeliste für Ihre Branche
      </h2>
      <p className="t-unter">
        Wer einen Pflegedienst sucht, hat andere Fragen als jemand, der einen Tisch reservieren will. Wählen Sie Ihre
        Branche: Die Liste zeigt, was auf Ihre Seite gehört, wo es steht und warum.
      </p>
      <p className="mt-2">
        <MehrLink href="/branchen">Alle Branchen im Einzelnen</MehrLink>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
 * 7. Ablauf als Fährlinie auf Schwarz.
 * ---------------------------------------------------------------- */
function Ablauf() {
  return (
    <section
      id="ablauf"
      className="ablauf-spur spaeter-geladen abschnitt bg-black text-[#f5f5f7]"
      style={spaeter(960, 890)}
    >
      {/* Die eine Scroll-Szene der Seite: Am Rechner bleibt die Bühne
          stehen, während die Fähre die Halte abfährt (app/hafen.css,
          Block „Ablauf-Szene“; Fortschritt in faehrlinie.tsx). Mobil, auf
          niedrigen Fenstern, ohne Script und bei reduzierter Bewegung
          ein normaler Abschnitt. */}
      <div className="ablauf-buehne">
        <div className="inhalt">
          <div className="buehne-kopf abschnitt-kopf">
            <h2 data-auftritt="titel" className="t-abschnitt">
              Der Weg zur fertigen Seite, kurz gefasst
            </h2>
          </div>
          <div>
            <Faehrlinie />
          </div>
          <div className="ablauf-fuss text-text-2-dark mt-14 flex flex-col items-center justify-center gap-x-6 gap-y-1 border-t border-[#424245] pt-5 text-center text-[14px] leading-[1.43] sm:mt-16 sm:flex-row">
            <span>Antwort auf Anrufe und Mails meist am selben Werktag.</span>
            <MehrLink href="/ablauf" groesse="klein">
              Ablauf im Detail
            </MehrLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 8. Live-Vorschau: Betriebsname eintippen, Skizze entsteht sofort.
 * ---------------------------------------------------------------- */
function Vorschau() {
  return (
    <section id="vorschau" className="spaeter-geladen flaeche-weiss abschnitt" style={spaeter(1000, 1230)}>
      <div className="inhalt">
        <div className="abschnitt-kopf">
          <h2 data-auftritt="titel" className="t-abschnitt">
            Eine erste Skizze mit Ihrem Namen
          </h2>
          <p className="t-unter">Geben Sie den Namen Ihres Betriebs ein und wählen Sie die Branche.</p>
        </div>
        {/* Das Gerät steht frei auf der Fläche (keine Karte um die Karte)
            und fährt beim Hinscrollen ein (.buehne-einzug). */}
        <div className="buehne-einzug mx-auto max-w-5xl min-w-0">
          <LivePreview />
        </div>
        <div className="text-muted-foreground mx-auto mt-10 max-w-[36em] space-y-3 text-center text-[17px] leading-[1.47] md:mt-12">
          <p>Die Skizze entsteht sofort hier im Browser, gespeichert wird nichts.</p>
          <p>
            Gefällt Ihnen die Richtung, schicken Sie die Skizze als Anfrage. Die echte Seite entwerfen wir danach mit
            Ihren Fotos und Texten.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 9. Preise: die vier Pakete als Modelle.
 * ---------------------------------------------------------------- */
function Preise() {
  return (
    <section id="preise" className="spaeter-geladen flaeche-hell abschnitt" style={spaeter(1150, 1300)}>
      <div className="inhalt abschnitt-kopf">
        <h2 data-auftritt="titel" className="t-abschnitt">
          Festpreis ab {STARTER_PRICE}
        </h2>
        <p className="t-unter">Den Preis bekommen Sie schriftlich, bevor wir anfangen.</p>
      </div>
      <PaketKacheln flaeche="weiss" />

      {/* Abschluss zentriert: ein Absatz, darunter Pille und Link als
          Paar, das Kleingedruckte zuletzt. */}
      <div className="inhalt mt-12 text-center lg:mt-16">
        <p className="text-muted-foreground mx-auto max-w-[40em] text-[17px] leading-[1.47] text-pretty">
          Kommt später etwas dazu, sprechen wir vorher darüber. Welches Paket passt, klären wir im ersten Telefonat. Für
          die meisten Betriebe empfehlen wir Business; die{" "}
          <Link href="#ladeliste" className="text-gold-ink hover:underline">
            Ladeliste
          </Link>{" "}
          nennt die Empfehlung für Ihre Branche.
        </p>
        <div className="aktionen mt-8">
          <Link href="/anfrage" className="btn-signal btn-gross">
            Anfrage schreiben
          </Link>
          <MehrLink href="/pakete#vergleich">Pakete vergleichen</MehrLink>
        </div>
        <p className="t-fuss mx-auto mt-10 max-w-[48em]">
          Einmalpreise, dazu ein Monatsbeitrag {MONTHLY_FROM}.
          {STUDIO ? (
            <>
              {" "}
              Für ein neues Erscheinungsbild gibt es{" "}
              <Link href={`/pakete/${STUDIO.slug}`} className="text-gold-ink inline-block py-1 hover:underline">
                {STUDIO.name} {STUDIO.setup}
              </Link>
              .
            </>
          ) : null}{" "}
          {PREIS_HINWEIS}
        </p>
        <p className="mt-2">
          <MehrLink href="/website-erstellen-lassen" groesse="klein">
            Website erstellen lassen: Preise und Ablauf
          </MehrLink>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 10. Vorher / Nachher.
 * ---------------------------------------------------------------- */
function VorherNachher() {
  return (
    <section className="spaeter flaeche-weiss abschnitt" style={spaeter(600, 1080)}>
      <div className="inhalt">
        <div className="abschnitt-kopf">
          <h2 data-auftritt="titel" className="t-abschnitt">
            Dieselben Inhalte, neu gebaut
          </h2>
          <p className="t-unter">Ziehen Sie den Regler.</p>
        </div>
        {/* Bühne erst ab 640 px; am Handy steht das Gerät frei auf der
            Fläche (sonst Karte in Karte mit schmalem grauem Rand). */}
        <div className="karte max-sm:overflow-visible max-sm:rounded-none max-sm:bg-transparent sm:p-10 lg:p-16">
          <div className="buehne-einzug">
            <VorherNachherRegler />
          </div>
        </div>
        <p className="text-muted-foreground mx-auto mt-10 max-w-[38em] text-center text-[17px] leading-[1.47] md:mt-12">
          Links steht eine Seite, wie sie viele Betriebe seit Jahren haben. Rechts stehen dieselben Angaben, geordnet
          nach dem, was Kunden zuerst wissen wollen. Die Tischlerei ist frei erfunden.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 11. Fragen: eine ruhige Liste zum Aufklappen wie bei Apple (details,
 * ohne Script). Die Antworten stehen im Markup (FAQ_LD und Suchmaschinen
 * sehen sie), sichtbar werden sie per Tipp auf die Frage.
 * ---------------------------------------------------------------- */
function Fragen() {
  return (
    <section id="faq" aria-labelledby="faq-titel" className="spaeter flaeche-hell abschnitt" style={spaeter(690, 560)}>
      <div className="inhalt">
        <h2 id="faq-titel" data-auftritt="titel" className="zweiton">
          <span>Häufige Fragen.</span> <span className="grau">Was vor dem ersten Anruf oft gefragt wird.</span>
        </h2>
        <ul className="mt-2 flex flex-col items-start sm:flex-row sm:flex-wrap sm:gap-x-8">
          <li>
            <MehrLink href="/faq">Alle Fragen</MehrLink>
          </li>
          <li>
            <MehrLink href="/webseite-erstellen">Selbst bauen: Webseite erstellen in sieben Schritten</MehrLink>
          </li>
        </ul>
        <div className="karte karte-weiss fragen-liste mt-6 lg:mt-8">
          {FAQ.map((item) => (
            <details key={item.q} className="frage">
              <summary className="frage-kopf">
                <h3 className="frage-titel">{item.q}</h3>
                <span aria-hidden="true" className="frage-zeichen" />
              </summary>
              <p className="frage-antwort">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 12. Journal als Regal: die vier neuesten Ratgeber.
 * ---------------------------------------------------------------- */
function Journal() {
  return (
    <Regal
      id="journal"
      fett="Journal."
      grau="Ratgeber für Betriebe."
      flaeche="weiss"
      raster
      className="spaeter"
      style={spaeter(550, 680)}
    >
      {JOURNAL_NEU.map((post) => (
        <RegalKarte
          key={post.slug}
          eyebrow={`${post.readingMinutes} Min. Lesezeit`}
          titel={post.title}
          text={post.dek}
          href={`/journal/${post.slug}`}
          linkText="Lesen"
        />
      ))}
    </Regal>
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
 * 13. Kontakt: schwarzer Abschluss, die Telefonnummer groß in der
 * Mitte. Beim ersten Sichtkontakt steigen die Ziffern aus ihren Masken
 * (app/hafen.css, Block „Reveal“, data-reveal="tel").
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <Abschluss
      id="kontakt"
      className="spaeter"
      style={spaeter(400, 430)}
      titel="Am schnellsten geht es am Telefon."
      zwischen={
        <a
          href="tel:+491607621876"
          aria-label="0160 7621876"
          data-reveal="tel"
          className="abschluss-nummer tel-finale"
        >
          <TelZiffern />
        </a>
      }
      unter="Eine Viertelstunde reicht meistens. Danach kennen Sie den Festpreis und den Termin. Wer lieber schreibt, erreicht uns per Mail oder über das Anfrageformular. Die Antwort kommt meist am selben Werktag."
      link={{ href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL }}
    />
  );
}
