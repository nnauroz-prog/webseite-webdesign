import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { KarteGross, KarteMittel, LadenBild, LadenFoto } from "@/components/marketing/laden/karten";
import { LadenRegal } from "@/components/marketing/laden/laden-regal";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  FotoRahmen,
  KontaktKarte,
  MusterPille,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import {
  STRICH,
  VergleichZelle,
  type PaketSpalte,
  type VergleichGruppe,
  type VergleichZeile,
} from "@/components/marketing/pakete/vergleich-daten";
import { VergleichMobil } from "@/components/marketing/pakete/vergleich-mobil";
import { PAKETE, PREIS_HINWEIS, PREIS_HINWEIS_KURZ, getPaketBySlug, type Paket } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: `Website-Pakete und Preise: ${PAKETE[0].setup} zum Festpreis`,
  description: `Vier Website-Pakete ${PAKETE[0].setup} einmalig, Pflege ${PAKETE[0].monthly.replace(/\s*\/\s*Monat$/, "")} im Monat, inkl. MwSt. Festpreis schriftlich vor Auftrag. Paket wählen und anfragen.`,
  alternates: { canonical: "/pakete" },
  openGraph: ogFor("/pakete", undefined, undefined, "website", { defaultImage: true }),
};

type Slug = Paket["slug"];

const STARTER = getPaketBySlug("starter");
const STARTER_SETUP = STARTER?.setup ?? "ab 599\u00A0€";
/** „ab 59 € / Monat" → „ab 59 €" */
const STARTER_MONTHLY = (STARTER?.monthly ?? "ab 59\u00A0€ / Monat").replace(/\s*\/\s*Monat$/, "");

/** „ab 2.999 €" → „2.999 €", „ab 99 € / Monat" → „99 €" */
function betrag(label: string) {
  return label.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");
}

/** Richtwert bis online aus pakete-data, „meist 5–10 Werktage“. */
function dauer(slug: Slug) {
  return getPaketBySlug(slug)?.dauer ?? "–";
}

function gross(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Vergleich als Tabelle: Pakete sind Spalten, Leistungen sind Zeilen.
 * Preise kommen aus lib/pakete-data.ts, die Zeilen fassen die
 * Leistungslisten dort zusammen. Ein Strich heißt: nicht in diesem Paket
 * (dargestellt als „—“ mit „Nicht enthalten“ für Screenreader).
 * Die Dauer folgt den kanonischen Richtwerten (ab vollständigen
 * Unterlagen), siehe auch pakete-data detailIntro.
 */
const ZEILEN: VergleichZeile[] = [
  {
    label: "Umfang",
    art: "text",
    werte: {
      starter: "Eine Seite mit allem Wichtigen",
      business: "Bis zu fünf Unterseiten",
      premium: "Eigene Struktur nach Ihrem Bedarf",
      studio: "Bis zu zwölf Bereiche oder Seiten",
    },
  },
  {
    label: "Typisch dabei",
    art: "text",
    werte: {
      starter: "Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten",
      business: "Team mit Fotos, Leistungen, Galerie, Formular für Bewerbung oder Terminanfrage",
      premium: "Formulare für Kontakt, Bewerbung und Online-Buchung",
      studio: "Neues Erscheinungsbild: Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden",
    },
  },
  {
    label: "Inhalte selbst pflegen",
    art: "hakenText",
    werte: {
      starter: STRICH,
      business: STRICH,
      premium: "Auf Wunsch: Speisekarte, Angebote, Termine",
      studio: "In bis zu zwölf Bereichen",
    },
  },
  {
    label: "Google-Profil und lokale Suche",
    art: "haken",
    werte: { starter: STRICH, business: "Richten wir ein", premium: "Richten wir ein", studio: "Richten wir ein" },
  },
  {
    label: "Kleine Änderungen im Monat",
    art: "zahl",
    werte: { starter: "Bis zu 1", business: "Bis zu 3", premium: "Bis zu 6", studio: "Bis zu 10" },
  },
  {
    label: "Dauer bis online",
    art: "text",
    werte: {
      starter: gross(dauer("starter")),
      business: gross(dauer("business")),
      premium: gross(dauer("premium")),
      studio: gross(dauer("studio")),
    },
  },
  {
    label: "Persönliches Treffen",
    art: "text",
    werte: {
      starter: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      business: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      premium: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      studio: "Vor dem Entwurf, in Hamburg oder bei Ihnen",
    },
  },
];

const zeile = (label: string) => ZEILEN.find((z) => z.label === label)!;

/** Zeilen gruppiert wie im Apple-Vergleich: Preis, Umfang, Nach dem Start. */
const GRUPPEN: VergleichGruppe[] = [
  {
    titel: "Preis",
    zeilen: [
      {
        label: "Einmalig",
        art: "preis",
        werte: Object.fromEntries(PAKETE.map((p) => [p.slug, p.setup])) as Record<Slug, string>,
      },
      {
        label: "Monatlich",
        art: "preis",
        werte: Object.fromEntries(PAKETE.map((p) => [p.slug, `ab\u00A0${betrag(p.monthly)}`])) as Record<Slug, string>,
      },
    ],
  },
  {
    titel: "Umfang",
    zeilen: [
      zeile("Umfang"),
      zeile("Typisch dabei"),
      {
        label: "Typisches Projekt",
        art: "text",
        werte: Object.fromEntries(PAKETE.map((p) => [p.slug, p.examples[0]])) as Record<Slug, string>,
      },
    ],
  },
  {
    titel: "Nach dem Start",
    zeilen: [
      zeile("Inhalte selbst pflegen"),
      zeile("Google-Profil und lokale Suche"),
      zeile("Kleine Änderungen im Monat"),
      zeile("Dauer bis online"),
      zeile("Persönliches Treffen"),
    ],
  },
];

/** Was der mobile Vergleich (Client) von den Paketen braucht. */
const SPALTEN: PaketSpalte[] = PAKETE.map((p) => ({
  slug: p.slug,
  name: p.name,
  setup: p.setup,
  monthly: p.monthly,
  highlight: !!p.highlight,
}));

/*
 * Aufbau wie eine Apple-Produktseite. Flächen: Kopf #fff · Modelle
 * #f5f5f7 · Vergleich #fff · Monatsbeitrag #f5f5f7 · Weiterlesen #fff ·
 * Abschluss #000. Die Produktleiste verlinkt die Anker der Abschnitte.
 */
export default function PaketePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      {/* Lokale Produktleiste: direktes Kind des Wrappers (klebt am iPhone). */}
      <Produktleiste
        titel="Pakete"
        titelHref="#modelle"
        links={[
          { href: "#modelle", label: "Modelle" },
          { href: "#vergleich", label: "Vergleich" },
          { href: "#monatsbeitrag", label: "Monatsbeitrag" },
          { href: "#weiterlesen", label: "Weiterlesen" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Pakete"
          eyebrow="Liegeplatz 1 · Pakete und Preise"
          titel={`Website-Pakete ${STARTER_SETUP}`}
          unter={
            <>
              Dazu kommt ein Monatsbeitrag {STARTER_MONTHLY} für Hosting, Updates und kleine Änderungen. Den Festpreis
              bekommen Sie schriftlich, bevor wir anfangen.
            </>
          }
          aktionen={
            <>
              <Link href="/anfrage" className="btn-signal btn-gross">
                Anfrage schreiben
              </Link>
              <MehrLink href="#vergleich" groesse="unter">
                Pakete vergleichen
              </MehrLink>
            </>
          }
          meta={<>{PREIS_HINWEIS_KURZ} · Mindestlaufzeit 6 Monate</>}
          bild={
            <FotoRahmen
              vorab
              muster
              src="/images/sitalo-kosmetik-laptop.webp"
              alt="Laptop auf einer Marmorplatte in einem Kosmetikstudio, auf dem Bildschirm die Musterseite des Studios"
              aspect="21 / 10"
              aspectMobil="4 / 3"
              position="50% 55%"
            />
          }
          unterschrift={<>Musterseite eines Kosmetikstudios, frei erfunden · Paket Business</>}
        />
        <Modelle />
        <Vergleich />
        <Monatsbeitrag />
        <Weiterlesen />
        <KontaktKarte
          id="abschluss"
          titel="Welches Paket passt, klären wir am Telefon."
          zeile="Eine Viertelstunde reicht meistens. Wer lieber schreibt, nimmt das Formular, wir antworten meist am selben Werktag."
          link={{ href: "/branchen", label: "Musterseiten ansehen" }}
          foto={{
            src: "/images/cafe-eimsbuettel.webp",
            alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Pakete" />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Modelle: die vier Pakete als große Karten. Die Karten tragen die
 * Anker #starter, #business usw. (Deep-Links aus Branchen-Seiten).
 * ---------------------------------------------------------------- */
const MODELL_BILD: Record<Slug, { src: string; alt: string; position: string; eyebrow: string; zeile: string }> = {
  starter: {
    src: "/images/sitalo-friseur-mobile.webp",
    alt: "Handy mit einer einseitigen Musterseite für einen Friseur, daneben Visitenkarten",
    position: "58% 50%",
    eyebrow: "Eine Seite",
    zeile: "Leistungen, Öffnungszeiten und Kontakt.",
  },
  business: {
    src: "/images/sitalo-pflege-laptop.webp",
    alt: "Laptop mit der mehrseitigen Musterseite eines Pflegedienstes auf einem hellen Schreibtisch",
    position: "40% 55%",
    eyebrow: "Für die meisten Betriebe",
    zeile: "Eigene Seiten für Leistungen, Team und Galerie.",
  },
  premium: {
    src: "/images/sitalo-cafe-mobile.webp",
    alt: "Handy mit der Musterseite eines Cafés mit Speisekarte auf einem Holztisch",
    position: "50% 50%",
    eyebrow: "Selbst pflegen",
    zeile: "Speisekarte, Wochenangebot oder Termine ändern Sie selbst.",
  },
  studio: {
    src: "/images/sitalo-kanzlei-laptop.webp",
    alt: "Laptop mit der Musterseite einer Kanzlei neben einer grünen Schreibtischlampe und alten Büchern",
    position: "50% 55%",
    eyebrow: "Neues Erscheinungsbild",
    zeile: "Schrift, Farben und Bildsprache, neu entworfen.",
  },
};

function Modelle() {
  return (
    <LadenRegal
      id="modelle"
      fett="Alle Pakete."
      grau="Wählen Sie, was Ihr Betrieb braucht."
      notiz={PREIS_HINWEIS}
      className="scroll-mt-24"
    >
      {PAKETE.map((p) => {
        const b = MODELL_BILD[p.slug];
        return (
          <KarteGross
            key={p.slug}
            id={p.slug}
            ton={p.highlight ? "schwarz" : "weiss"}
            eyebrow={b.eyebrow}
            titel={p.name}
            zeile={b.zeile}
            preis={p.setup}
            monat={p.monthly.replace(/\s*\/\s*Monat$/, "") + " im Monat"}
            href={`/pakete/${p.slug}`}
            bildBeschrieben
            bild={
              <>
                <LadenFoto src={b.src} position={b.position} alt={b.alt} />
                <MusterPille text="Musterseite" />
              </>
            }
          />
        );
      })}
    </LadenRegal>
  );
}

/* ------------------------------------------------------------------
 * Vergleich. Ab 834 px eine Apple-Vergleichstabelle mit klebendem
 * Glas-Kopf (Produktbild, Name, Preis, Anfragen) und Gruppenzeilen;
 * darunter zwei Auswahlen (vergleich-mobil.tsx). Kein Vorfahr der
 * Tabelle darf overflow setzen, sonst klebt der Kopf nicht.
 * ---------------------------------------------------------------- */
function Vergleich() {
  return (
    <section id="vergleich" aria-labelledby="vergleich-titel" className={`${u.abschnitt} scroll-mt-24`}>
      <div className="inhalt">
        <div className={u.abschnittKopf}>
          <h2 id="vergleich-titel" className={u.zweiton}>
            <span>Die vier Pakete im Vergleich.</span>{" "}
            <span>Wir empfehlen meistens Business.</span>
          </h2>
          <p className={u.abschnittUnter}>Wenn Starter reicht, sagen wir Ihnen das auch.</p>
        </div>

        {/* Tabelle ab 834 px */}
        <div className={`${u.blatt} hidden min-[834px]:block`}>
          <table className="vergleich-tabelle">
            <caption className="sr-only">Pakete im Vergleich: Preise und Leistungen</caption>
            <colgroup>
              <col className="w-[18%]" />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <td className="text-left">
                  <span className="sr-only">Paket</span>
                </td>
                {PAKETE.map((p) => (
                  <th key={p.slug} id={`vergleich-${p.slug}`} scope="col" className="text-center font-normal">
                    {p.highlight ? (
                      <span className="text-gold-ink mt-2 block h-4 text-[12px] leading-4 font-semibold">Empfehlung</span>
                    ) : (
                      <span className="mt-2 block h-4" aria-hidden="true" />
                    )}
                    <Link
                      href={`/pakete/${p.slug}`}
                      className="relative mt-1 block text-[17px] leading-[1.24] font-semibold tracking-[-0.022em] after:absolute after:inset-x-0 after:-inset-y-3 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="text-muted-foreground mt-0.5 block text-[14px]">{p.setup}</span>
                    <Link
                      href={`/anfrage?paket=${p.slug}`}
                      aria-describedby={`vergleich-${p.slug}`}
                      className={`${p.highlight ? "btn-signal" : "btn-line"} btn-mittel mt-3`}
                    >
                      Anfragen
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            {GRUPPEN.map((g) => (
              <tbody key={g.titel}>
                <tr className="gruppe">
                  <th colSpan={5} scope="rowgroup">
                    {g.titel}
                  </th>
                </tr>
                {g.zeilen.map((z) => (
                  <tr key={z.label}>
                    <th scope="row">{z.label}</th>
                    {PAKETE.map((p) => (
                      <td key={p.slug}>
                        <VergleichZelle zeile={z} slug={p.slug} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
            <tfoot>
              <tr>
                <td className="text-left">
                  <span className="t-fuss block text-left">Preise inkl. 19&nbsp;% MwSt.</span>
                  <span className="t-fuss mt-2 block text-left">Dauer jeweils ab vollständigen Unterlagen.</span>
                </td>
                {PAKETE.map((p) => (
                  <td key={p.slug}>
                    <Link
                      href={`/anfrage?paket=${p.slug}`}
                      className={`${p.highlight ? "btn-signal" : "btn-line"} btn-mittel`}
                    >
                      {p.name} anfragen
                    </Link>
                    <div className="mt-1">
                      <MehrLink href={`/pakete/${p.slug}`} groesse="klein">
                        Alles zu {p.name}
                      </MehrLink>
                    </div>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobil: zwei Auswahlen nebeneinander */}
        <div className="min-[834px]:hidden">
          <VergleichMobil pakete={SPALTEN} gruppen={GRUPPEN} />
          <p className="t-fuss mt-6">Preise inkl. 19&nbsp;% MwSt. Dauer jeweils ab vollständigen Unterlagen.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Monatsbeitrag: drei Kacheln. Links groß Hosting auf Schwarz, rechts
 * die Änderungen als große Zahlen und Domain/E-Mail. Texte wie bisher,
 * Änderungswünsche über das Formular oder das Telefon.
 * ---------------------------------------------------------------- */
function Monatsbeitrag() {
  return (
    <Abschnitt
      id="monatsbeitrag"
      fett="Jeden Monat dabei."
      grau={`Monatsbeitrag ${STARTER_MONTHLY}.`}
      rechts={<MehrLink href="/wartung">Mehr zu Wartung und Pflege</MehrLink>}
    >
      <BildRaster>
        <BildKachel
          ton="nacht"
          spalten={7}
          gross
          eyebrow="Hosting und Sicherheit"
          titel="Server in der EU, Backups 30 Tage."
          zeile="Ihre Seite liegt auf einem Server in der EU. Das SSL-Zertifikat verlängert sich von selbst, Sicherheits-Updates spielen wir ein. Gesichert wird jeden Tag, die Backups reichen 30 Tage zurück."
          bildInhalt={<BackupKalender />}
        />
        <BildKachel
          spalten={5}
          eyebrow="Kleine Änderungen im Monat"
          zahl="1 · 3 · 6 · 10"
          titel="Starter, Business, Premium, Studio."
          zeile="Neue Öffnungszeiten, ein anderes Foto, ein neuer Name im Team. Sie schreiben uns kurz über das Formular oder rufen an, wir setzen es um."
          kinder={
            <p className={`${u.kachelZeile} !mt-5 border-t border-black/10 pt-5`}>
              Domain und E-Mail-Adressen richten wir auf Wunsch mit ein. Größere Erweiterungen beziffern wir vorher. Der
              Vertrag läuft mindestens sechs Monate und ist danach monatlich kündbar.
            </p>
          }
        />
      </BildRaster>
    </Abschnitt>
  );
}

/**
 * Gestaltete Übersicht der täglichen Sicherungen (Beispiel): 30 Tage,
 * jeder Tag ein Backup, dazu Server-Standort und Zertifikat.
 */
function BackupKalender() {
  const tage = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="rounded-[14px] bg-[#1c1c1e] p-4 text-left shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[14px] leading-5 font-semibold text-[#f5f5f7]">Sicherungen, letzte 30 Tage</p>
        <p className="text-[12px] text-[#a1a1a6]">jede Nacht um 02:00 Uhr</p>
      </div>
      <ul role="list" className="mt-4 grid grid-cols-10 gap-1.5">
        {tage.map((t) => (
          <li
            key={t}
            className={`flex aspect-square items-center justify-center rounded-[6px] text-[10px] tabular-nums ${
              t === 30 ? "bg-[#f45b1e] font-bold text-[#1d1d1f]" : "bg-[#2c2c2e] text-[#a1a1a6]"
            }`}
          >
            {t}
          </li>
        ))}
      </ul>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-[13px] leading-[18px]">
        <div>
          <dt className="text-[#a1a1a6]">Server</dt>
          <dd className="mt-0.5 font-semibold text-[#f5f5f7]">in der EU</dd>
        </div>
        <div>
          <dt className="text-[#a1a1a6]">SSL-Zertifikat</dt>
          <dd className="mt-0.5 font-semibold text-[#f5f5f7]">verlängert sich selbst</dd>
        </div>
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Weiterlesen: die Werkzeug-Karten der Startseite.
 * ---------------------------------------------------------------- */
function Weiterlesen() {
  const weiss = "linear-gradient(180deg, #fff 0%, #f5f5f7 100%)";
  return (
    <LadenRegal id="weiterlesen" einfach fett="Noch unsicher?" grau="Drei Hilfen für die Wahl." className="scroll-mt-24">
      <KarteMittel
        eyebrow="Empfehlung"
        titel="Welches Paket passt?"
        zeile="Fünf Fragen, danach schlagen wir ein Paket vor."
        href="/empfehlung"
        bild={<LadenBild name="werkzeug-paketwahl" w={320} h={240} />}
        bildHintergrund="linear-gradient(180deg, #fff 0%, #eef1f2 100%)"
      />
      <KarteMittel
        eyebrow="Kalkulation"
        titel="So kommen die Preise zustande"
        zeile="Stundensatz und Stunden je Paket."
        href="/honorar"
        bild={<LadenBild name="werkzeug-honorar" w={320} h={240} />}
        bildHintergrund="linear-gradient(180deg, #fff 0%, #ececf0 100%)"
      />
      <KarteMittel
        eyebrow="3-Jahres-Rechner"
        titel="Kosten über 3 Jahre"
        zeile="Neben Wix, Squarespace und Jimdo."
        href="/rechner"
        bild={<LadenBild name="werkzeug-kosten" w={320} h={240} />}
        bildHintergrund={weiss}
      />
    </LadenRegal>
  );
}
