import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";

import { MehrLink } from "@/components/marketing/apple";
import { Briefkarte } from "@/components/marketing/hafen/briefkarte";
import { Notiz } from "@/components/marketing/hafen/notiz";
import { VorherNachher as VorherNachherRegler } from "@/components/marketing/hafen/vorher-nachher";
import { LadenDefs } from "@/components/marketing/laden/bilder/defs";
import { WegBand } from "@/components/marketing/laden/bilder/weg-band";
import {
  KarteEndeBild,
  KarteGross,
  KarteMittel,
  KarteWeg,
  kartenStil as s,
  LadenBild,
  LadenFoto,
} from "@/components/marketing/laden/karten";
import { LadenKopf } from "@/components/marketing/laden/laden-kopf";
import { LadenRegal } from "@/components/marketing/laden/laden-regal";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { STUNDENSATZ_EUR } from "@/lib/honorar-data";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { brancheFuerPreset } from "@/lib/muster-presets";
import { getPaketBySlug, MONATSBEITRAEGE, PAKETE, PREIS_HINWEIS, WARTUNG_PREISE, type Paket } from "@/lib/pakete-data";

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
  description: `Webdesign aus Hamburg für Betriebe in ganz Deutschland: Websites zum Festpreis ${PAKETE[0].setup}, Test-Link vor dem Start. Jetzt unverbindlich anfragen.`,
  alternates: { canonical: "/" },
  // Bild wird automatisch aus app/opengraph-image.tsx übernommen.
  openGraph: ogFor(
    "/",
    "Sitalo · Webdesign Hamburg",
    `Websites für Betriebe in ganz Deutschland, gestaltet in Hamburg. Festpreis ${PAKETE[0].setup}, Test-Link vor dem Start.`,
  ),
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

/** Einmal- und Monatspreis eines Pakets, „ab 599 €“ und „ab 59 € / Monat“. */
function paket(slug: Paket["slug"]) {
  const p = getPaketBySlug(slug);
  return { name: p?.name ?? slug, setup: p?.setup ?? "", monat: p?.monthly ?? "" };
}
const STARTER = paket("starter");
const BUSINESS = paket("business");
const PREMIUM = paket("premium");
const STUDIO = paket("studio");
/** Die vier neuesten Ratgeber fürs Journal-Regal. */
const JOURNAL_NEU = JOURNAL_POSTS.slice(0, 4);
const DATUM = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

/** Journal-Motiv nach Slug (Dateien aus scripts/laden-bilder.mjs). */
function journalBild(slug: string) {
  if (slug.includes("google")) return "journal-google";
  if (slug.includes("pflichtangaben")) return "journal-pflichtangaben";
  if (slug.includes("domain")) return "journal-domain";
  return "journal-skyline";
}

/**
 * Muster-Websites als Fotos (public/images/sitalo-*-laptop.webp): echte
 * Geräte statt gezeichneter Hüllen. Titel nennen die Branche, nicht den
 * Betrieb, weil die Seiten im Foto eigene, frei erfundene Namen tragen.
 * Friseur, Café und Hotel stehen schon bei den Paketen.
 * pos: Bildausschnitt (object-position), damit der Bildschirm in der
 * Bildzone sitzt.
 */
const MUSTER = [
  { key: "praxis", titel: "Arztpraxis", zeile: "Sprechzeiten, Leistungen, Terminanfrage.", bild: "sitalo-praxis-laptop", pos: "50% 62%", alt: "Laptop mit der Musterseite einer Zahnarztpraxis auf einem Empfangstresen" },
  { key: "handwerk", titel: "Handwerk", zeile: "Leistungen, Referenzen, Anfrage.", bild: "sitalo-handwerker-laptop", pos: "50% 58%", alt: "Laptop mit der Musterseite einer Tischlerei in einer Werkstatt" },
  { key: "pflege", titel: "Pflegedienst", zeile: "Leistungen, Team, Rückruf.", bild: "sitalo-pflege-laptop", pos: "50% 62%", alt: "Laptop mit der Musterseite eines Pflegedienstes in einem hellen Büro" },
  { key: "kanzlei", titel: "Kanzlei", zeile: "Rechtsgebiete, Team, Termin.", bild: "sitalo-kanzlei-laptop", pos: "50% 60%", alt: "Laptop mit der Musterseite einer Kanzlei auf einem Schreibtisch mit Leselampe" },
  { key: "reinigung", titel: "Gebäudereinigung", zeile: "Leistungen, Einsatzgebiet, Angebot.", bild: "sitalo-reinigung-laptop", pos: "38% 50%", alt: "Laptop mit der Musterseite einer Gebäudereinigung auf einer Edelstahlfläche" },
  { key: "fitness", titel: "Fitnessstudio", zeile: "Kurse, Preise, Probetraining.", bild: "sitalo-fitness-laptop", pos: "50% 64%", alt: "Laptop mit der Musterseite eines Fitnessstudios am Empfang" },
  { key: "kosmetik", titel: "Kosmetik", zeile: "Behandlungen, Preise, Termin.", bild: "sitalo-kosmetik-laptop", pos: "55% 62%", alt: "Laptop mit der Musterseite eines Kosmetikstudios auf einer Marmorablage" },
];

/*
 * Startseite: Apple-Gerüst mit Atelier-Details. Fläche durchgehend
 * #f5f5f7 (main.buehne.laden), Karten weiß und rund, Regale zum Wischen,
 * große Fotos. Dazu aus dem Atelier: Kran-Bühne mit Tageslicht und Gruß,
 * Mono-Ortsmarken und -Notizen, die Notiz aus dem Büro, die Briefkarte
 * als Abschluss und die Elbe-Linie im Fuß.
 *
 * Ein gefüllter Knopf je Bildschirm: Der Kopf trägt „Anfrage schreiben“,
 * die Leiste deshalb keine zweite Pille. Ab dem zweiten Regal
 * content-visibility:auto.
 */
export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      <MarketingHeader cta={false} />
      <main id="main" tabIndex={-1} className={`buehne laden flex-1 ${s.seite}`}>
        <LadenDefs />
        <LadenKopf />
        <Pakete />
        <Muster />
        <Unterschied />
        <Notiz id="notiz">
          Wer einen Pflegedienst sucht, hat andere Fragen als jemand, der einen Tisch reservieren will. Deshalb fängt
          jede Seite bei uns mit einem Gespräch an.
        </Notiz>
        <VorherNachher />
        <Weg />
        <Werkzeuge />
        <Journal />
        <Fragen />
        <Kontakt />
      </main>
      <div className={s.fussRand}>
        <MarketingFooter ohnePreisHinweis ohneNachOben />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * 2. Die Pakete: vier Pakete und die Wartung.
 * ---------------------------------------------------------------- */
function Pakete() {
  return (
    <LadenRegal
      id="preise"
      ort="Liegeplatz 1 · Pakete"
      fett="Was Ihre Website kostet."
      grau="Den Preis bekommen Sie schriftlich, bevor wir anfangen."
      link={{ href: "/pakete#vergleich", label: "Pakete vergleichen" }}
      notiz={PREIS_HINWEIS}
    >
      <KarteGross
        eyebrow="Eine Seite"
        titel={STARTER.name}
        zeile="Leistungen, Öffnungszeiten und Kontakt."
        preis={STARTER.setup}
        monat={STARTER.monat}
        href="/pakete/starter"
        bildBeschrieben
        bild={<LadenFoto src="/images/sitalo-friseur-mobile.webp" position="58% 50%" alt="Handy mit einer einseitigen Musterseite für einen Friseur, daneben Visitenkarten" />}
      />
      <KarteGross
        ton="schwarz"
        eyebrow="Für die meisten Betriebe"
        titel={BUSINESS.name}
        zeile="Eigene Seiten für Leistungen, Team und Galerie."
        preis={BUSINESS.setup}
        monat={BUSINESS.monat}
        href="/pakete/business"
        bildBeschrieben
        bild={<LadenFoto src="/images/sitalo-hotel-laptop.webp" position="42% 64%" alt="Laptop mit der mehrseitigen Musterseite eines Hotels an einer Rezeption" />}
      />
      <KarteGross
        eyebrow="Selbst pflegen"
        titel={PREMIUM.name}
        zeile="Speisekarte, Wochenangebot oder Termine ändern Sie selbst."
        preis={PREMIUM.setup}
        monat={PREMIUM.monat}
        href="/pakete/premium"
        bildBeschrieben
        bild={<LadenFoto src="/images/sitalo-cafe-mobile.webp" position="50% 50%" alt="Handy mit der Musterseite eines Cafés mit Speisekarte auf einem Holztisch" />}
      />
      <KarteGross
        eyebrow="Neues Erscheinungsbild"
        titel={STUDIO.name}
        zeile="Schrift, Farben und Bildsprache, neu entworfen."
        preis={STUDIO.setup}
        monat={STUDIO.monat}
        href="/pakete/studio"
        bildBeschrieben
        bild={<LadenFoto src="/images/workspace-prints.webp" position="50% 40%" alt="Drei gerahmte Entwürfe mit Logo, Farben und Schrift an einer hellen Wand" />}
      />
      <KarteGross
        eyebrow="Schon eine Website?"
        titel="Wartung"
        zeile="Updates, Backups und kleine Änderungen."
        preis={`ab ${WARTUNG_PREISE.basis}`}
        monat="im Monat"
        href="/wartung"
        bildBeschrieben
        bild={<LadenFoto src="/images/workspace-macbook.webp" position="40% 40%" alt="Hände an einer Laptop-Tastatur, daneben ein Notizbuch und eine Tasse" />}
      />
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 4. Muster-Websites: zehn Branchen, Geräte im Wechsel.
 * ---------------------------------------------------------------- */
function Muster() {
  return (
    <LadenRegal
      id="branchen"
      ort="Liegeplatz 2 · Branchen"
      fett="Muster-Websites."
      grau="Für Ihre Branche."
      link={{ href: "/branchen", label: "Alle Branchen" }}
      notiz="Alle Betriebe sind frei erfundene Beispiele."
      spaet={{ h: 660, hMobil: 640 }}
    >
      {MUSTER.map((m) => {
        const slug = brancheFuerPreset(m.key);
        return (
          <KarteGross
            key={m.key}
            eyebrow="Musterseite"
            titel={m.titel}
            zeile={m.zeile}
            mehr="Was auf Ihre Seite gehört"
            href={slug ? `/branchen/${slug}` : "/branchen"}
            bildBeschrieben
            bild={<LadenFoto src={`/images/${m.bild}.webp`} position={m.pos} alt={m.alt} />}
          />
        );
      })}
      <KarteEndeBild
        eyebrow="Erste Skizze"
        titel="Mit Ihrem Namen."
        zeile="Namen eingeben, Branche wählen."
        href="/branchen#vorschau"
        bild={<LadenFoto src="/images/workspace-typing.webp" position="40% 50%" sizes="(min-width: 734px) 300px, 320px" alt="" />}
      />
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 5. Der Unterschied: was zu jeder Website gehört (wortnah aus BOXES).
 * ---------------------------------------------------------------- */
const UNTERSCHIED = [
  {
    eyebrow: "Gestaltung",
    fett: "Für Ihren Betrieb gestaltet.",
    grau: "Ohne Baukasten, direkt im Code gebaut.",
    href: "/leistungen",
    foto: { src: "/images/atmosphere/handwerker-werkbank.webp", pos: "50% 55%" },
  },
  {
    eyebrow: "Hosting",
    fett: "Hosting und Pflege.",
    grau: "Server in der EU, Updates und Backups.",
    href: "/wartung",
    foto: { src: "/images/atmosphere/reinigung-flur.webp", pos: "50% 50%" },
  },
  {
    eyebrow: "Texte",
    fett: "Texte.",
    grau: "Sie schicken Stichpunkte, wir formulieren.",
    href: "/ablauf",
    foto: { src: "/images/atmosphere/kanzlei-buecher.webp", pos: "40% 50%" },
  },
  {
    eyebrow: "Anfragen",
    fett: "Anfragen.",
    grau: "Formular mit Spamschutz und Anruf-Knopf.",
    href: "/leistungen",
    foto: { src: "/images/atmosphere/praxis-raum.webp", pos: "60% 60%" },
  },
  {
    eyebrow: "Ab Business",
    fett: "Bei Google.",
    grau: "Titel, Sitemap und Unternehmensprofil.",
    href: "/pakete/business",
    foto: { src: "/images/atmosphere/pflege-eingang.webp", pos: "50% 60%" },
  },
  {
    eyebrow: "Ab Premium",
    fett: "Selbst pflegen.",
    grau: "Speisekarte oder Termine selbst ändern.",
    href: "/pakete/premium",
    foto: { src: "/images/atmosphere/gastro-cafe.webp", pos: "50% 50%" },
  },
  {
    eyebrow: "Kontakt",
    fett: "Direkt mit uns.",
    grau: "Vom ersten Anruf an, auch wenn die Seite online ist.",
    href: "/kontakt",
    foto: { src: "/images/cafe-eimsbuettel.webp", pos: "50% 60%" },
  },
];

function Unterschied() {
  return (
    <LadenRegal
      id="leistungen"
      ort="Liegeplatz 3 · Ladung"
      fett="Was zu Ihrer Website gehört."
      grau="Geladen wird nur, was Ihr Betrieb braucht."
      link={{ href: "/leistungen", label: "Alle Leistungen" }}
      spaet={{ h: 540, hMobil: 500 }}
    >
      {UNTERSCHIED.map((u) => (
        <KarteMittel
          key={u.fett}
          eyebrow={u.eyebrow}
          titel={u.fett.replace(/\.$/, "")}
          zeile={u.grau}
          href={u.href}
          bild={<LadenFoto src={u.foto.src} position={u.foto.pos} alt="" sizes="(min-width: 734px) 320px, 280px" />}
        />
      ))}
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 6. Vorher / Nachher als breite Karte (außerhalb jeder Spur).
 * ---------------------------------------------------------------- */
function VorherNachher() {
  return (
    <section id="vorher-nachher" aria-labelledby="vn-titel" className={`${s.regal} ${s.spaet}`} style={{ "--h": "620px", "--h-mobil": "500px" } as React.CSSProperties}>
      <div className={`inhalt ${s.block}`}>
        <div className={s.breit}>
          <div className={s.vnText}>
            <p className="kennzeile-mono">Werkbank · Vorher / Nachher</p>
            <h2 id="vn-titel" className={s.vnTitel}>
              Dieselben Inhalte, neu gebaut.
            </h2>
            <p className={s.vnZeile}>
              Links steht eine Seite, wie sie viele Betriebe seit Jahren haben. Rechts stehen dieselben Angaben, geordnet
              nach dem, was Kunden zuerst wissen wollen. Die Tischlerei ist frei erfunden.
            </p>
            <p className={`notiz-mono ${s.vnHinweis}`}>Ziehen Sie den Regler.</p>
          </div>
          <div className={s.vnGeraet}>
            <VorherNachherRegler griffRing />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 7. Der Weg: vier Halte, ein durchgehendes Elbe-Band.
 * ---------------------------------------------------------------- */
const HALTE = [
  { eyebrow: "Halt 1", fett: "Anruf.", grau: "Eine Viertelstunde, danach Festpreis und Termin." },
  { eyebrow: "Halt 2", fett: "Entwurf.", grau: "Mit Ihren Fotos und Stichpunkten." },
  { eyebrow: "Halt 3", fett: "Test-Link.", grau: "In Ruhe ansehen, am Handy und am Rechner." },
  { eyebrow: "Endhalt", fett: "Online.", grau: "Kleine Seiten oft nach ein bis zwei Werktagen." },
];

function Weg() {
  return (
    <LadenRegal
      id="ablauf"
      ort="Fährlinie · in Kürze"
      fett="Der Weg zur fertigen Seite."
      grau="Vom ersten Anruf an sprechen Sie mit uns selbst."
      link={{ href: "/ablauf", label: "Ablauf im Detail" }}
      spaet={{ h: 350, hMobil: 360 }}
    >
      {HALTE.map((h, i) => (
        <KarteWeg key={h.fett} band={<WegBand i={i} />} eyebrow={h.eyebrow} fett={h.fett} grau={h.grau} />
      ))}
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 8. Werkzeuge: sechs mittlere Karten mit Bild unten.
 * ---------------------------------------------------------------- */
function Werkzeuge() {
  const weiss = "linear-gradient(180deg, #fff 0%, #f5f5f7 100%)";
  return (
    <LadenRegal id="werkzeuge" einfach fett="Werkzeuge." grau="Kostenlos ausprobieren." spaet={{ h: 540, hMobil: 500 }}>
      <KarteMittel
        eyebrow="Werkzeug"
        titel="Kostenlose Durchsicht"
        zeile="Drei bis fünf konkrete Punkte zu Ihrer Website, von Hand."
        href="/audit"
        bild={<LadenBild name="werkzeug-durchsicht" w={320} h={240} />}
        bildHintergrund={weiss}
      />
      <KarteMittel
        eyebrow="Werkzeug"
        titel="Ladezeit testen"
        zeile="Ergebnis in etwa 30 Sekunden."
        href="/check"
        bild={<LadenBild name="werkzeug-ladezeit" w={320} h={240} />}
        bildHintergrund={weiss}
      />
      <KarteMittel
        eyebrow="Werkzeug"
        titel="Welches Paket passt?"
        zeile="Fünf Fragen, eine begründete Empfehlung."
        href="/empfehlung"
        bild={<LadenBild name="werkzeug-paketwahl" w={320} h={240} />}
        bildHintergrund="linear-gradient(180deg, #fff 0%, #eef1f2 100%)"
      />
      <KarteMittel
        eyebrow="Kalkulation"
        titel="Kosten über drei Jahre"
        zeile="Ihre eigene Arbeitszeit eingerechnet."
        href="/rechner"
        bild={<LadenBild name="werkzeug-kosten" w={320} h={240} />}
        bildHintergrund={weiss}
      />
      <KarteMittel
        eyebrow="Termin"
        titel="Kostenloses Erstgespräch"
        zeile="Bis zu 30 Minuten, am Telefon."
        href="/termin"
        bild={<LadenBild name="werkzeug-termin" w={320} h={240} />}
        bildHintergrund="linear-gradient(180deg, #fff 0%, #fbeee6 100%)"
      />
      <KarteMittel
        eyebrow="Kalkulation"
        titel="Honorar offen vorgerechnet"
        zeile={`Stundensatz ${STUNDENSATZ_EUR}\u00A0€ inkl. MwSt.`}
        href="/honorar"
        bild={<LadenBild name="werkzeug-honorar" w={320} h={240} />}
        bildHintergrund="linear-gradient(180deg, #fff 0%, #ececf0 100%)"
      />
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 9. Journal: die vier neuesten Ratgeber, Bild oben.
 * ---------------------------------------------------------------- */
function Journal() {
  return (
    <LadenRegal
      id="journal"
      einfach
      fett="Journal."
      grau="Ratgeber für Betriebe."
      link={{ href: "/journal", label: "Alle Artikel" }}
      spaet={{ h: 520, hMobil: 500 }}
    >
      {JOURNAL_NEU.map((post) => (
        <KarteMittel
          key={post.slug}
          bildOben
          kurz
          eyebrowUnten
          eyebrow={
            <>
              <time dateTime={post.publishedAt}>{DATUM.format(new Date(post.publishedAt))}</time> · {post.readingMinutes}{" "}
              Min. Lesezeit
            </>
          }
          titel={post.title}
          href={`/journal/${post.slug}`}
          bild={<LadenBild name={journalBild(post.slug)} w={320} h={200} position="50% 50%" />}
        />
      ))}
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 10. Fragen: eine weiße Karte, sechs Fragen zum Aufklappen.
 * ---------------------------------------------------------------- */
function Fragen() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-titel"
      className={`${s.regal} ${s.spaet}`}
      style={{ "--h": "560px", "--h-mobil": "760px" } as React.CSSProperties}
    >
      <div className={`inhalt ${s.block}`}>
        <div className={s.fragenRaster}>
          <div className={s.fragenSeite}>
            <p className={`kennzeile-mono ${s.ortsmarke}`}>Kaimauer · Fragen</p>
            <h2 id="faq-titel" className={s.regalTitel}>
              Häufige Fragen
            </h2>
            <p className={s.regalUnter}>Was vor dem ersten Anruf oft gefragt wird.</p>
            <MehrLink href="/faq" frei={false} className={s.fragenLink}>
              Alle Fragen
            </MehrLink>
            <MehrLink href="/webseite-erstellen" frei={false} className={s.fragenLink}>
              Selbst bauen: in sieben Schritten
            </MehrLink>
          </div>
          <div className={s.fragen}>
            {FAQ.map((item) => (
              <details key={item.q} className={s.frage}>
                <summary className={s.frageKopf}>
                  <h3 className={s.frageTitel}>{item.q}</h3>
                  <span aria-hidden="true" className={s.plus} />
                </summary>
                <p className={s.antwort}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * 11. Abschluss: die Briefkarte in der dunklen Fassung, rechts das
 * Speicherstadt-Foto als letzter Fotomoment. Bewusst ohne E-Mail-Link:
 * Schriftliche Anfragen kommen über das Formular.
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <Briefkarte
      ton="dunkel"
      title="Am schnellsten geht es am Telefon."
      foto={{
        src: "/images/hamburg-speicherstadt.webp",
        alt: "Speicherstadt in Hamburg in der Abendsonne, im Hintergrund die Elbphilharmonie",
      }}
    >
      Eine Viertelstunde reicht meistens. Danach kennen Sie den Festpreis und den Termin. Die Antwort auf Anrufe und
      Anfragen kommt meist am selben Werktag.
    </Briefkarte>
  );
}
