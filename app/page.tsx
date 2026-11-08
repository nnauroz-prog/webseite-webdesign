import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Abfahrtstafel } from "@/components/marketing/hafen/abfahrtstafel";
import { ContainerStack } from "@/components/marketing/hafen/container-stack";
import { Faehrlinie } from "@/components/marketing/hafen/faehrlinie";
import { Ladeliste, type LadelisteFoto } from "@/components/marketing/hafen/ladeliste";
import { Lotse } from "@/components/marketing/hafen/lotse";
import { Notiz } from "@/components/marketing/hafen/notiz";
import { paketeKurz } from "@/components/marketing/hafen/paket-kurz";
import { RevealRoot } from "@/components/marketing/hafen/reveal";
import s from "@/components/marketing/hafen/start.module.css";
import { Steigend } from "@/components/marketing/hafen/steigend";
import { VorherNachher as VorherNachherRegler } from "@/components/marketing/hafen/vorher-nachher";
import { KranBanner } from "@/components/marketing/laden/kran-banner";
import { LadenKopf } from "@/components/marketing/laden/laden-kopf";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { STUNDENSATZ_EUR } from "@/lib/honorar-data";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { PAKETE, PREIS_HINWEIS, MONATSBEITRAEGE } from "@/lib/pakete-data";

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

/** Name und Preise je Paket für Ladeliste und Abfahrtstafel (Client). */
const PAKETE_KURZ = paketeKurz();
/** Die drei neuesten Beiträge fürs Verzeichnis. */
const JOURNAL_NEU = JOURNAL_POSTS.slice(0, 3);
const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/**
 * Je Branche der Ladeliste genau ein Foto (public/images). Die Seiten im
 * Foto tragen frei erfundene Namen. Der Friseur nimmt das Raumfoto, das
 * Handyfoto bleibt /pakete vorbehalten.
 */
const LADELISTE_FOTOS: Record<string, LadelisteFoto> = {
  pflege: { src: "/images/sitalo-pflege-laptop.webp", pos: "50% 62%", alt: "Laptop mit der Musterseite eines Pflegedienstes in einem hellen Büro" },
  praxis: { src: "/images/sitalo-praxis-laptop.webp", pos: "50% 62%", alt: "Laptop mit der Musterseite einer Zahnarztpraxis auf einem Empfangstresen" },
  handwerk: { src: "/images/sitalo-handwerker-laptop.webp", pos: "50% 58%", alt: "Laptop mit der Musterseite einer Tischlerei in einer Werkstatt" },
  gastro: { src: "/images/atmosphere/gastro-cafe.webp", pos: "50% 50%", alt: "Tresen eines kleinen Cafés mit Siebträgermaschine" },
  friseur: { src: "/images/atmosphere/friseur-stuhl.webp", pos: "50% 50%", alt: "Friseurstuhl vor einem Spiegel in einem hellen Salon" },
  kanzlei: { src: "/images/sitalo-kanzlei-laptop.webp", pos: "50% 60%", alt: "Laptop mit der Musterseite einer Kanzlei auf einem Schreibtisch mit Leselampe" },
  reinigung: { src: "/images/sitalo-reinigung-laptop.webp", pos: "38% 50%", alt: "Laptop mit der Musterseite einer Gebäudereinigung auf einer Edelstahlfläche" },
  fitness: { src: "/images/sitalo-fitness-laptop.webp", pos: "50% 64%", alt: "Laptop mit der Musterseite eines Fitnessstudios am Empfang" },
  hotel: { src: "/images/sitalo-hotel-laptop.webp", pos: "42% 64%", alt: "Laptop mit der mehrseitigen Musterseite eines Hotels an einer Rezeption" },
};

/** Startgröße für .spaeter und .spaeter-geladen (app/hafen.css): Höhe in
 *  px schmal / ab 1024 px. Grob gemessen; bei Textänderungen nachziehen. */
function spaeter(h: number, hLg: number) {
  return { "--spaeter-h": `${h}px`, "--spaeter-h-lg": `${hLg}px` } as CSSProperties;
}

/*
 * Startseite im Atelier. Reihenfolge und Form, nie zweimal dieselbe
 * Form hintereinander:
 *  1. Kopf: Mono-Kennzeile (H1), großer Satz, persönlicher Absatz.
 *  2. Kran: randlos, Bildunterschrift mit Pegel.
 *  3. Containerstapel: was zu jeder Website gehört.
 *  4. Notiz aus dem Büro: reiner Text-Moment, ohne Karte und Knopf.
 *  5. Ladeliste als Frachtpapier mit Stempel (Teer).
 *  6. Abfahrtstafel mit den Preisen.
 *  7. Lotse: Ihr Teil, unser Teil (Kästchen).
 *  8. Vorher/Nachher-Regler.
 *  9. Fährlinie: der Weg zur fertigen Seite (Teer).
 * 10. Verzeichnis: Werkzeuge und Journal, nummeriert wie ein
 *     Leistungsverzeichnis.
 * 11. Fragen offen gesetzt (am Handy zum Aufklappen).
 * 12. Telefon-Finale (Teer mit Korn), danach der Fuß mit der Elbe-Linie.
 * RevealRoot blendet data-reveal-Elemente beim Scrollen ein; die H2
 * steigen Wort für Wort aus Masken (Steigend). Nie die H1, nie das LCP.
 */
export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      {/* Ein gefüllter Knopf je Bildschirm: Der Kopf trägt „Anfrage
          schreiben“, die Leiste deshalb keine zweite Pille. */}
      <MarketingHeader cta={false} />
      <main id="main" tabIndex={-1} className="buehne flex-1">
        <RevealRoot />
        <LadenKopf />
        <KranBanner />
        <Leistungen />
        <Notiz id="notiz">
          Wer einen Pflegedienst sucht, hat andere Fragen als jemand, der einen Tisch reservieren will. Deshalb fängt
          jede Seite bei uns mit einem Gespräch an.
        </Notiz>
        <Ladeliste
          id="branchen"
          head={<LadelisteKopf />}
          pakete={PAKETE_KURZ}
          fotos={LADELISTE_FOTOS}
          className="on-dark spaeter-geladen"
          style={spaeter(1900, 1500)}
        />
        <Preise />
        <section id="lotse" className="spaeter-geladen buehne-abschnitt bg-card scroll-mt-20" style={spaeter(1700, 1250)}>
          <Lotse />
        </section>
        <VorherNachher />
        <Ablauf />
        <Verzeichnis />
        <Fragen />
        <Kontakt />
      </main>
      <MarketingFooter ohnePreisHinweis />
    </div>
  );
}

/* ------------------------------------------------------------------
 * 3. Containerstapel.
 * ---------------------------------------------------------------- */
function Leistungen() {
  return (
    <section id="leistungen" className="spaeter-geladen buehne-abschnitt bg-card scroll-mt-20" style={spaeter(1850, 1250)}>
      <div className="inhalt">
        <div className="buehne-kopf buehne-kopf-zweispaltig">
          <div>
            <p className={s.eyebrow}>Liegeplatz 1 · Ladung</p>
            <h2 data-reveal="rise" className="buehne-titel">
              <Steigend text="Was zu Ihrer Website gehört" />
            </h2>
          </div>
          <div>
            <p data-reveal="fade" className="buehne-unter">
              Auf jedem Container steht, ab welchem Paket er mitfährt. Geladen wird nur, was Ihr Betrieb braucht.
            </p>
            <p className="mt-4">
              <Link href="/leistungen" className="link-pfeil text-[15px] font-semibold">
                Alle Leistungen im <span className="whitespace-nowrap">Einzelnen{ARROW}</span>
              </Link>
            </p>
          </div>
        </div>
        <ContainerStack />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 5. Ladeliste: Kopf der linken Spalte. Auswahl, Frachtpapier, Stempel
 * und Foto liegen in components/marketing/hafen/ladeliste.tsx.
 * ---------------------------------------------------------------- */
function LadelisteKopf() {
  return (
    <>
      <div className="buehne-kopf buehne-kopf-zweispaltig">
        <div>
          <p className={s.eyebrow}>Liegeplatz 2 · Frachtpapier</p>
          <h2 data-reveal="rise" className="buehne-titel">
            <Steigend text="Die Ladeliste für Ihre Branche" />
          </h2>
        </div>
        <div>
          <p data-reveal="fade" className="buehne-unter">
            Wählen Sie Ihre Branche: Die Liste zeigt, was auf Ihre Seite gehört, wo es steht und warum. Alle
            Betriebe in den Fotos sind frei erfundene Beispiele.
          </p>
          <p className="mt-4">
            <Link href="/branchen" className="link-pfeil link-pfeil-dunkel text-[15px] font-semibold">
              Alle Branchen im <span className="whitespace-nowrap">Einzelnen{ARROW}</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
 * 6. Preise als Abfahrtstafel. Für Screenreader und Suchmaschinen
 * stehen die Preise zusätzlich als Tabelle mit Beschriftung.
 * ---------------------------------------------------------------- */
function Preise() {
  return (
    <section id="preise" className="spaeter-geladen buehne-abschnitt scroll-mt-20" style={spaeter(1400, 1150)}>
      <div className="inhalt">
        <div className="buehne-kopf buehne-kopf-zweispaltig">
          <div>
            <p className={s.eyebrow}>Liegeplatz 3 · Pakete</p>
            <h2 data-reveal="rise" className="buehne-titel">
              <Steigend text="Was Ihre Website kostet" />
            </h2>
          </div>
          <p data-reveal="fade" className="buehne-unter">
            Den Preis bekommen Sie schriftlich, bevor wir anfangen. Welches Paket passt, klären wir im ersten
            Telefonat.
          </p>
        </div>
        <div className="mx-auto max-w-3xl min-w-0">
          <Abfahrtstafel pakete={PAKETE_KURZ} />
          <table className="sr-only">
            <caption>Festpreise und Monatsbeiträge der Pakete, inklusive 19 % MwSt.</caption>
            <thead>
              <tr>
                <th scope="col">Paket</th>
                <th scope="col">Festpreis</th>
                <th scope="col">Monatsbeitrag</th>
              </tr>
            </thead>
            <tbody>
              {PAKETE.map((p) => (
                <tr key={p.slug}>
                  <th scope="row">{p.name}</th>
                  <td>{p.setup}</td>
                  <td>{p.monthly}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.preisFuss}>
            <p className={s.preisNotiz}>
              Einmalpreise, dazu der Monatsbeitrag ({MONATSBEITRAEGE}). {PREIS_HINWEIS}
            </p>
            <Link href="/pakete" className="link-pfeil text-[15px] font-semibold">
              Alle Pakete im <span className="whitespace-nowrap">Einzelnen{ARROW}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 8. Vorher / Nachher.
 * ---------------------------------------------------------------- */
function VorherNachher() {
  return (
    <section id="vorher-nachher" className="spaeter buehne-abschnitt scroll-mt-20" style={spaeter(900, 760)}>
      <div className={`inhalt ${s.vnRaster}`}>
        <div>
          <p className={s.eyebrow}>Werkbank · Vorher / Nachher</p>
          <h2 data-reveal="rise" className="buehne-titel-klein">
            <Steigend text="Dieselben Inhalte, neu gebaut" />
          </h2>
          <p data-reveal="fade" className="text-muted-foreground mt-5 max-w-[30em] text-[16.5px] leading-relaxed">
            Links steht eine Seite, wie sie viele Betriebe seit Jahren haben. Rechts stehen dieselben Angaben, geordnet
            nach dem, was Kunden zuerst wissen wollen. Die Tischlerei ist frei erfunden.
          </p>
          <p className={s.vnHinweis}>Ziehen Sie den Regler.</p>
        </div>
        <div className="min-w-0">
          <VorherNachherRegler griffRing />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 9. Ablauf als Fährlinie (die eine klebende Szene der Seite).
 * ---------------------------------------------------------------- */
function Ablauf() {
  return (
    <section
      id="ablauf"
      className="ablauf-spur spaeter-geladen buehne-abschnitt bg-foreground text-background scroll-mt-16"
      style={spaeter(1250, 1000)}
    >
      <div className="ablauf-buehne">
        <div className="inhalt">
          <div className="buehne-kopf buehne-kopf-zweispaltig">
            <div>
              <p className={s.eyebrow}>Fährlinie · Vier Halte</p>
              <h2 data-reveal="rise" className="buehne-titel">
                <Steigend text="Der Weg zur fertigen Seite" />
              </h2>
            </div>
            <p data-reveal="fade" className="buehne-unter">
              Vom ersten Anruf an sprechen Sie mit uns selbst, auch wenn die Seite längst online ist.
            </p>
          </div>
          <div>
            <Faehrlinie />
          </div>
          <div className="ablauf-fuss border-background/15 text-stahl-hell mt-10 flex flex-col justify-between gap-2 border-t pt-5 font-mono text-[12px] sm:mt-16 sm:flex-row">
            <span>Antwort meist am selben Werktag.</span>
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
 * 10. Verzeichnis: Werkzeuge links, die drei neuesten Beiträge rechts,
 * nummeriert wie ein Leistungsverzeichnis, ohne Fotos.
 * ---------------------------------------------------------------- */
const WERKZEUGE = [
  { href: "/audit", titel: "Kostenlose Durchsicht", satz: "Drei bis fünf konkrete Punkte zu Ihrer Website, von Hand." },
  { href: "/check", titel: "Ladezeit testen", satz: "Ergebnis in etwa 30 Sekunden." },
  { href: "/empfehlung", titel: "Welches Paket passt?", satz: "Fünf Fragen, eine begründete Empfehlung." },
  { href: "/rechner", titel: "Kosten über drei Jahre", satz: "Ihre eigene Arbeitszeit eingerechnet." },
  { href: "/termin", titel: "Kostenloses Erstgespräch", satz: "Bis zu 30 Minuten, am Telefon." },
  { href: "/honorar", titel: "Honorar offen vorgerechnet", satz: `Stundensatz ${STUNDENSATZ_EUR}\u00A0€ inkl. MwSt.` },
];

const DATUM = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

function Verzeichnis() {
  return (
    <section id="werkzeuge" className="spaeter buehne-abschnitt bg-card scroll-mt-20" style={spaeter(1500, 820)}>
      <div className="inhalt">
        <div className="buehne-kopf">
          <p className={s.eyebrow}>Werkstatt · Verzeichnis</p>
          <h2 data-reveal="rise" className="buehne-titel-klein">
            <Steigend text="Werkzeuge und Notizen für Betriebe" />
          </h2>
        </div>
        <div className={s.lv}>
          <div>
            <p className={s.lvKopf}>
              <span>5 · Werkzeuge</span>
              <span>kostenlos</span>
            </p>
            <ol className={`${s.lvListe} ${s.lvWerkzeuge}`}>
              {WERKZEUGE.map((w, i) => (
                <li key={w.href} className={s.lvZeile}>
                  <Link href={w.href} className={s.lvLink}>
                    <span className={s.lvNr}>5.{i + 1}</span>
                    <span>
                      <span className={s.lvTitel}>{w.titel}</span>
                      <span className={s.lvSatz}>{w.satz}</span>
                    </span>
                    <span className={s.lvPfeil} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className={s.lvKopf}>
              <span>6 · Journal</span>
              <span>neueste Beiträge</span>
            </p>
            <ol className={`${s.lvListe} ${s.lvJournal}`}>
              {JOURNAL_NEU.map((post, i) => (
                <li key={post.slug} className={s.lvZeile}>
                  <Link href={`/journal/${post.slug}`} className={s.lvLink}>
                    <span className={s.lvNr}>6.{i + 1}</span>
                    <span>
                      <span className={s.lvTitel}>{post.title}</span>
                      <span className={s.lvSatz}>
                        <time dateTime={post.publishedAt}>{DATUM.format(new Date(post.publishedAt))}</time> ·{" "}
                        {post.readingMinutes} Min. Lesezeit
                      </span>
                    </span>
                    <span className={s.lvPfeil} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className={s.lvFuss}>
          <span>Gezählt wird wie im Handwerk.</span>
          <Link href="/journal" className="link-pfeil link-pfeil-zeile font-sans text-[15px] font-semibold">
            Alle Beiträge im <span className="whitespace-nowrap">Journal{ARROW}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 11. Fragen: am Rechner offen gesetzt wie ein Interview, am Handy zum
 * Aufklappen (die ersten drei offen). FAQ und JSON-LD wie zuvor.
 * ---------------------------------------------------------------- */
function Fragen() {
  return (
    <section id="faq" className="spaeter buehne-abschnitt scroll-mt-20" style={spaeter(1200, 900)}>
      <div className="inhalt">
        <div className="buehne-kopf">
          <p className={s.eyebrow}>Kaimauer · Fragen</p>
          <h2 data-reveal="rise" className="buehne-titel-klein">
            <Steigend text="Was vor dem ersten Anruf oft gefragt wird" />
          </h2>
          <p className={s.fragenLinks}>
            <Link href="/faq" className="link-pfeil text-[15px] font-semibold">
              Alle <span className="whitespace-nowrap">Fragen{ARROW}</span>
            </Link>
            <Link href="/webseite-erstellen" className="link-pfeil text-[15px] font-semibold">
              Selbst bauen: in sieben <span className="whitespace-nowrap">Schritten{ARROW}</span>
            </Link>
          </p>
        </div>
        <dl className={s.interview}>
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className={s.frageMono}>{item.q}</dt>
              <dd className={s.antwort}>{item.a}</dd>
            </div>
          ))}
        </dl>
        <div className={s.fragenMobil}>
          {FAQ.map((item, i) => (
            <details key={item.q} open={i < 3}>
              <summary>
                <h3 className={s.frageMono}>{item.q}</h3>
              </summary>
              <p className={s.antwort}>{item.a}</p>
            </details>
          ))}
        </div>
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
 * 12. Telefon-Finale: Beim ersten Sichtkontakt steigen die Ziffern
 * einzeln aus ihren Masken, darunter zeichnet sich die orange Linie
 * (app/hafen.css, Block „Reveal“, data-reveal="tel"). Kein Foto, keine
 * Mail: Schriftlich geht es über das Anfrageformular.
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <section
      id="kontakt"
      className="spaeter buehne-abschnitt grain bg-foreground text-background scroll-mt-20"
      style={spaeter(620, 560)}
    >
      <div className={`inhalt ${s.telRaster}`}>
        <div className="min-w-0">
          <p className={s.eyebrow}>Anleger · Kontakt</p>
          <h2 data-reveal="rise" className="buehne-titel-klein">
            <Steigend text="Am schnellsten geht es am Telefon." />
          </h2>
          <a
            href="tel:+491607621876"
            aria-label="0160 7621876 anrufen"
            data-reveal="tel"
            className="tel-finale mt-6 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap sm:text-[4.2rem] lg:mt-10 lg:text-[4.4rem] xl:text-[4.9rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            <TelZiffern />
            <span className="tel-linie" aria-hidden="true" />
          </a>
        </div>
        <div>
          <p data-reveal="fade" className="text-stahl-hell text-[16.5px] leading-relaxed">
            Eine Viertelstunde reicht meistens. Danach kennen Sie den Festpreis und den Termin. Die Antwort auf Anrufe
            und Anfragen kommt meist am selben Werktag.
          </p>
          <p className={s.telSchriftlich}>
            <Link href="/anfrage" className="link-pfeil link-pfeil-dunkel font-semibold">
              Lieber schriftlich? Das Anfrageformular hat drei <span className="whitespace-nowrap">Pflichtfelder{ARROW}</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
