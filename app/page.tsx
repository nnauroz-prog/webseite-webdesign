import type { Metadata } from "next";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { VorherNachher as VorherNachherRegler } from "@/components/marketing/hafen/vorher-nachher";
import { Bildreihe } from "@/components/marketing/laden/bildreihe";
import { LadenDefs } from "@/components/marketing/laden/bilder/defs";
import {
  BildBusiness,
  BildPremium,
  BildStarter,
  BildStudio,
  BildWartung,
} from "@/components/marketing/laden/bilder/paket-bilder";
import {
  KachelBlasen,
  KachelContainer,
  KachelFeder,
  KachelHoerer,
  KachelNadel,
  KachelPinsel,
  KachelStift,
} from "@/components/marketing/laden/bilder/symbole";
import { WegBand } from "@/components/marketing/laden/bilder/weg-band";
import {
  KarteEndeBild,
  KarteGross,
  KarteKlein,
  KarteMittel,
  KarteWeg,
  kartenStil as s,
  LadenBild,
} from "@/components/marketing/laden/karten";
import { KranBanner } from "@/components/marketing/laden/kran-banner";
import { LadenKopf } from "@/components/marketing/laden/laden-kopf";
import { LadenRegal } from "@/components/marketing/laden/laden-regal";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { STUNDENSATZ_EUR } from "@/lib/honorar-data";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { brancheFuerPreset, presetFuer } from "@/lib/muster-presets";
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

/** Einmal- und Monatspreis eines Pakets, „ab 599 €“ und „ab 59 € / Monat“. */
function paket(slug: Paket["slug"]) {
  const p = getPaketBySlug(slug);
  return { name: p?.name ?? slug, setup: p?.setup ?? "", monat: p?.monthly ?? "" };
}
const STARTER = paket("starter");
const BUSINESS = paket("business");
const PREMIUM = paket("premium");
const STUDIO = paket("studio");
const MONTHLY_FROM = STARTER.monat.replace(/\s*\/\s*Monat$/, "");
/** Die vier neuesten Ratgeber fürs Journal-Regal. */
const JOURNAL_NEU = JOURNAL_POSTS.slice(0, 4);

/** Journal-Motiv nach Slug (Dateien aus scripts/laden-bilder.mjs). */
function journalBild(slug: string) {
  if (slug.includes("google")) return "journal-google";
  if (slug.includes("pflichtangaben")) return "journal-pflichtangaben";
  if (slug.includes("domain")) return "journal-domain";
  return "journal-skyline";
}

/** Reihenfolge der Muster-Websites; das Gerät je Karte wechselt (scripts/laden-bilder.mjs). */
// Pflege (Business-Karte) und Handwerk (Starter-Karte) nicht vorn, damit
// beim Wischen nicht zweimal dieselbe Musterseite nacheinander kommt.
const MUSTER = ["praxis", "friseur", "gastro", "pflege", "reinigung", "handwerk", "kanzlei", "fitness", "hotel", "kosmetik"];

/*
 * Startseite wie die Startseite eines Ladens: Kopf mit Hilfe-Hinweisen,
 * Bildreihe, dann Regal an Regal mit Karten zum Wischen. Fläche
 * durchgehend #f5f5f7 (main.buehne.laden), Karten weiß, Business und
 * Kontakt schwarz, Branchenkarten getönt. Bilder sind Inline-SVG
 * (components/marketing/laden/bilder), die Kran-Szene ist das Banner im
 * ersten Regal. Ab dem zweiten Regal content-visibility:auto.
 */
export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      <MarketingHeader cta={false} />
      {/* Lokale Produktleiste: direktes Kind des Wrappers, sonst klebt
          sie am iPhone nicht (components/marketing/produktleiste.tsx). */}
      <Produktleiste
        titel="Sitalo Webdesign"
        titelHref="#start"
        links={[
          { href: "#preise", label: "Pakete" },
          { href: "#branchen", label: "Branchen" },
          { href: "#werkzeuge", label: "Werkzeuge" },
          { href: "#faq", label: "Fragen" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <main id="main" tabIndex={-1} className={`buehne laden flex-1 ${s.seite}`}>
        <LadenDefs />
        <LadenKopf />
        <Bildreihe />
        <KranBanner />
        <Pakete />
        <Muster />
        <Unterschied />
        <VorherNachher />
        <Weg />
        <Werkzeuge />
        <Journal />
        <Fragen />
        <Kontakt />
      </main>
      <div className="border-t border-[#d2d2d7]">
        <MarketingFooter ohnePreisHinweis ohneNachOben />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * 3. Die Pakete: vier Pakete und die Wartung (Kran-Banner steht davor).
 * ---------------------------------------------------------------- */
function Pakete() {
  return (
    <LadenRegal
      id="preise"
      fett="Die Pakete."
      grau={`Festpreis ${STARTER.setup}, schriftlich vor dem Start.`}
      link={{ href: "/pakete#vergleich", label: "Pakete vergleichen" }}
      notiz={
        <>
          Dazu ein Monatsbeitrag {MONTHLY_FROM}. {PREIS_HINWEIS}
        </>
      }
    >
      <KarteGross
        eyebrow="Eine Seite"
        titel={STARTER.name}
        zeile="Leistungen, Öffnungszeiten und Kontakt."
        preis={STARTER.setup}
        monat={STARTER.monat}
        href="/pakete/starter"
        bildHintergrund="linear-gradient(180deg, #fbe9df 0%, #f5f5f7 100%)"
        bild={<BildStarter />}
      />
      <KarteGross
        ton="schwarz"
        dunkel
        eyebrow="Für die meisten Betriebe empfohlen"
        titel={BUSINESS.name}
        zeile="Eigene Seiten für Leistungen, Team und Galerie."
        preis={BUSINESS.setup}
        monat={BUSINESS.monat}
        href="/pakete/business"
        bildHintergrund="radial-gradient(120% 90% at 85% 10%, #2a2a2d 0%, #000 70%)"
        bild={<BildBusiness />}
      />
      <KarteGross
        eyebrow="Selbst pflegen"
        titel={PREMIUM.name}
        zeile="Speisekarte, Wochenangebot oder Termine ändern Sie selbst."
        preis={PREMIUM.setup}
        monat={PREMIUM.monat}
        href="/pakete/premium"
        bildHintergrund="linear-gradient(180deg, #f3ebe4 0%, #f5f5f7 100%)"
        bild={<BildPremium />}
      />
      <KarteGross
        eyebrow="Neues Erscheinungsbild"
        titel={STUDIO.name}
        zeile="Schrift, Farben und Bildsprache, neu entworfen."
        preis={STUDIO.setup}
        monat={STUDIO.monat}
        href="/pakete/studio"
        bildHintergrund="linear-gradient(180deg, #ececf0 0%, #f5f5f7 100%)"
        bild={<BildStudio />}
      />
      <KarteGross
        eyebrow="Schon eine Website?"
        titel="Wartung"
        zeile="Updates, Backups und kleine Änderungen."
        preis={`ab ${WARTUNG_PREISE.basis}`}
        monat="im Monat"
        href="/wartung"
        bildHintergrund="linear-gradient(180deg, #eef2f3 0%, #e3e8ea 100%)"
        bild={<BildWartung />}
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
      fett="Muster-Websites."
      grau="So können Seiten für Ihre Branche aussehen."
      link={{ href: "/branchen", label: "Alle Branchen" }}
      notiz="Alle Betriebe sind frei erfundene Beispiele."
      spaet={{ h: 660, hMobil: 640 }}
    >
      {MUSTER.map((key) => {
        const p = presetFuer(key);
        const slug = brancheFuerPreset(key);
        return (
          <KarteGross
            key={key}
            ton="getoent"
            hintergrund={p.tint}
            eyebrow={`Musterseite · ${p.chip}`}
            titel={p.defaultName}
            zeile={p.headline}
            mehr="Was auf Ihre Seite gehört"
            href={slug ? `/branchen/${slug}` : "/branchen"}
            bild={<LadenBild name={`branche-${key}`} w={400} h={310} />}
          />
        );
      })}
      <KarteEndeBild
        eyebrow="Erste Skizze"
        titel="Mit Ihrem Namen."
        zeile="Namen eingeben, Branche wählen."
        href="/branchen#vorschau"
        bildHintergrund="linear-gradient(180deg, #fff 0%, #f5f5f7 100%)"
        bild={<LadenBild name="skizze" w={400} h={310} />}
      />
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 5. Der Unterschied: was zu jeder Website gehört (wortnah aus BOXES).
 * ---------------------------------------------------------------- */
const UNTERSCHIED = [
  { fett: "Für Ihren Betrieb gestaltet.", grau: "Ohne Baukasten, direkt im Code gebaut.", href: "/leistungen", symbol: <KachelPinsel /> },
  { fett: "Hosting und Pflege.", grau: "Server in der EU, Updates und Backups.", href: "/wartung", symbol: <KachelContainer /> },
  { fett: "Texte.", grau: "Sie schicken Stichpunkte, wir formulieren.", href: "/ablauf", symbol: <KachelFeder /> },
  { fett: "Anfragen.", grau: "Formular mit Spamschutz und Anruf-Knopf.", href: "/leistungen", symbol: <KachelHoerer /> },
  {
    fett: "Bei Google.",
    grau: "Titel, Sitemap und Unternehmensprofil. Ab Business.",
    href: "/pakete/business",
    symbol: <KachelNadel />,
  },
  {
    fett: "Selbst pflegen.",
    grau: "Speisekarte oder Termine selbst ändern. Ab Premium.",
    href: "/pakete/premium",
    symbol: <KachelStift />,
  },
  {
    fett: "Direkt mit uns.",
    grau: "Vom ersten Anruf an, auch wenn die Seite online ist.",
    href: "/kontakt",
    symbol: <KachelBlasen />,
  },
];

function Unterschied() {
  return (
    <LadenRegal
      id="leistungen"
      fett="Der Unterschied."
      grau="Was zu jeder Website gehört."
      link={{ href: "/leistungen", label: "Alle Leistungen" }}
      spaet={{ h: 356, hMobil: 368 }}
    >
      {UNTERSCHIED.map((u) => (
        <KarteKlein key={u.fett} symbol={u.symbol} fett={u.fett} grau={u.grau} href={u.href} />
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
          <div>
            <p className={s.eyebrow}>Vorher / Nachher</p>
            <h2 id="vn-titel" className={s.titelGross}>
              Dieselben Inhalte, neu gebaut.
            </h2>
            <p className={s.zeile}>Ziehen Sie den Regler.</p>
            <p className={`${s.zeile} mt-3 text-[12px] leading-4`}>Die Tischlerei ist frei erfunden.</p>
          </div>
          <div className={s.vnGeraet}>
            <VorherNachherRegler griffRing geraetKlasse={s.vnLaptop} />
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
      fett="Der Weg."
      grau="Vier Halte bis online."
      link={{ href: "/ablauf", label: "Ablauf im Detail" }}
      notiz="Antwort auf Anrufe und Anfragen meist am selben Werktag."
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
    <LadenRegal id="werkzeuge" fett="Werkzeuge." grau="Kostenlos ausprobieren." spaet={{ h: 540, hMobil: 500 }}>
      <KarteMittel
        eyebrow="Werkzeug"
        titel="Kostenlose Durchsicht"
        zeile="Drei bis fünf konkrete Punkte, von Hand."
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
        titel="Kosten über 3 Jahre"
        zeile="Ihre eigene Arbeitszeit eingerechnet."
        href="/rechner"
        bild={<LadenBild name="werkzeug-kosten" w={320} h={240} />}
        bildHintergrund={weiss}
      />
      <KarteMittel
        eyebrow="Termin"
        titel="Kostenloses Erstgespräch"
        zeile="Bis zu 30 Minuten."
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
          eyebrow={`${post.readingMinutes} Min. Lesezeit`}
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
    <LadenRegal
      id="faq"
      fett="Häufige Fragen."
      grau="Was vor dem ersten Anruf oft gefragt wird."
      link={{ href: "/faq", label: "Alle Fragen" }}
      spaet={{ h: 528, hMobil: 610 }}
      ohneSpur
      notiz={
        <MehrLink href="/webseite-erstellen" frei={false} groesse="klein" className="inline-block py-[14px] text-[12px]">
          Selbst bauen: Webseite erstellen in sieben Schritten
        </MehrLink>
      }
    >
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
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * 11. Kontakt: schwarze breite Karte, Anfrageformular als Hauptweg,
 * Telefon als Alternative, Nachthafen. Bewusst ohne E-Mail-Link: Anfragen
 * sollen über das Formular kommen (landen gesammelt im Admin).
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <section
      id="kontakt"
      aria-labelledby="kontakt-titel"
      className={`${s.regal} ${s.spaet}`}
      style={{ "--h": "550px", "--h-mobil": "600px" } as React.CSSProperties}
    >
      <div className="inhalt">
        <div className={`on-dark ${s.kontakt}`} data-flaeche-dunkel="">
          <div className={s.kontaktText}>
            <p className={s.eyebrow}>Kontakt</p>
            <h2 id="kontakt-titel" className={s.titelGross}>
              Erzählen Sie uns von Ihrem Betrieb.
            </h2>
            <p className={s.zeile}>
              Das Anfrageformular hat drei Pflichtfelder. Wir antworten meist am selben Werktag.
            </p>
            <div className={s.bannerAktionen}>
              <Link href="/anfrage" className="btn-signal">
                Anfrage schreiben
              </Link>
              <MehrLink href="/termin">Erstgespräch buchen</MehrLink>
            </div>
            <p className={s.kontaktTel}>
              Lieber am Telefon?{" "}
              <a href="tel:+491607621876">
                0160&nbsp;7621876<span aria-hidden="true"> ›</span>
              </a>
            </p>
          </div>
          <div className={s.kontaktBild} aria-hidden="true">
            <LadenBild name="nachthafen" w={440} h={400} />
          </div>
        </div>
      </div>
      <div className={s.fuss} />
    </section>
  );
}
