import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Globe, ListChecks, PencilLine, Server, TrendingUp } from "lucide-react";

import {
  Abschluss,
  ContainerMotiv,
  IconMotiv,
  MehrLink,
  PAKET_TON,
  ProduktKopf,
  Regal,
  RegalKarte,
} from "@/components/marketing/apple";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { PaketKacheln } from "@/components/marketing/hafen/paket-kacheln";
import {
  STRICH,
  VergleichZelle,
  type PaketSpalte,
  type VergleichGruppe,
  type VergleichZeile,
} from "@/components/marketing/pakete/vergleich-daten";
import { VergleichMobil } from "@/components/marketing/pakete/vergleich-mobil";
import { PAKETE, PREIS_HINWEIS_KURZ, getPaketBySlug, type Paket } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: `Pakete & Preise — Websites ${PAKETE[0].setup}`,
  description: `Websites ${PAKETE[0].setup} einmalig, dazu ${PAKETE[0].monthly.replace(/\s*\/\s*Monat$/, "")} im Monat für Hosting und kleine Änderungen, inkl. MwSt. Den Festpreis bekommen Sie vor Auftrag schriftlich.`,
  alternates: { canonical: "/pakete" },
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
      <main id="main" tabIndex={-1} className="flex-1">
        <ProduktKopf
          eyebrow="Pakete und Preise"
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
              <MehrLink href="#vergleich">Pakete vergleichen</MehrLink>
            </>
          }
          meta={<>{PREIS_HINWEIS_KURZ} · Mindestlaufzeit 6 Monate</>}
        />
        <Modelle />
        <Vergleich />
        <Monatsbeitrag />
        <Weiterlesen />
        <Abschluss
          id="abschluss"
          titel="Welches Paket passt, klären wir am Telefon."
          zwischen={
            <a href="tel:+491607621876" className="abschluss-nummer">
              0160&nbsp;7621876
            </a>
          }
          unter="Wer lieber schreibt, schickt uns die Anfrage über das Formular. Wir antworten meist am selben Werktag."
          link={{ href: "/anfrage", label: "Anfrage schreiben" }}
        />
      </main>
      <MarketingFooter crumb="Pakete" />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Modelle: die vier Pakete als große Karten. Die Karten tragen die
 * Anker #starter, #business usw. (Deep-Links aus Branchen-Seiten).
 * ---------------------------------------------------------------- */
function Modelle() {
  return (
    <section id="modelle" aria-labelledby="modelle-titel" className="flaeche-hell pt-16 pb-16 sm:pt-20 sm:pb-24">
      <div className="inhalt">
        <h2 id="modelle-titel" data-auftritt="titel" className="zweiton">
          <span>Alle Pakete.</span> <span className="grau">Wählen Sie, was Ihr Betrieb braucht.</span>
        </h2>
      </div>
      <PaketKacheln idPrefix="" flaeche="weiss" className="mt-8 sm:mt-10" />
    </section>
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
    <section id="vergleich" className="flaeche-weiss abschnitt">
      <div className="inhalt-breit max-w-[1200px]">
        <div className="abschnitt-kopf">
          <h2 data-auftritt="titel" className="t-abschnitt">
            Die vier Pakete im Vergleich
          </h2>
          <p className="t-unter">Wir empfehlen meistens Business. Wenn Starter reicht, sagen wir Ihnen das auch.</p>
        </div>

        {/* Tabelle ab 834 px */}
        <div className="hidden min-[834px]:block">
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
                    <span className="flex h-[30px] items-end justify-center" aria-hidden="true">
                      <ContainerMotiv ton={PAKET_TON[p.slug] ?? "zink"} groesse="s" className="vergleich-motiv" />
                    </span>
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
        <div className="mt-10 min-[834px]:hidden">
          <VergleichMobil pakete={SPALTEN} gruppen={GRUPPEN} />
          <p className="t-fuss mt-6">Preise inkl. 19&nbsp;% MwSt. Dauer jeweils ab vollständigen Unterlagen.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Monatsbeitrag: drei Kacheln, Texte wortgleich.
 * ---------------------------------------------------------------- */
const MONAT_KACHELN = [
  {
    icon: Server,
    text: "Ihre Seite liegt auf einem Server in der EU. Das SSL-Zertifikat verlängert sich von selbst, Sicherheits-Updates spielen wir ein. Gesichert wird jeden Tag, die Backups reichen 30 Tage zurück.",
  },
  {
    icon: PencilLine,
    text: "Kleine Änderungen sind ebenfalls im Beitrag: neue Öffnungszeiten, ein anderes Foto, ein neuer Name im Team. Starter hat eine pro Monat, Business drei, Premium sechs und Studio zehn. Sie schicken uns eine Mail, wir setzen es um.",
  },
  {
    icon: Globe,
    text: "Domain und E-Mail-Adressen richten wir auf Wunsch mit ein. Größere Erweiterungen beziffern wir vorher. Der Vertrag läuft mindestens sechs Monate und ist danach monatlich kündbar.",
  },
];

function Monatsbeitrag() {
  return (
    <section id="monatsbeitrag" className="flaeche-hell abschnitt">
      <div className="inhalt">
        <div className="abschnitt-kopf">
          <p className="t-eyebrow">Monatsbeitrag · {STARTER_MONTHLY}</p>
          <h2 data-auftritt="titel" className="t-abschnitt mt-2">
            Was nach dem Start jeden Monat dazukommt
          </h2>
        </div>
        <div className="grid gap-3 min-[834px]:grid-cols-3 lg:gap-5">
          {MONAT_KACHELN.map(({ icon: Icon, text }) => (
            <div key={text} data-auftritt="" className="karte karte-weiss px-7 py-9 lg:px-8 lg:py-10">
              <Icon aria-hidden="true" className="text-gold h-10 w-10" strokeWidth={1.5} />
              <p className="mt-6 text-[17px] leading-[1.47] tracking-[-0.022em]">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <MehrLink href="/wartung">Mehr zu Wartung und Pflege</MehrLink>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Weiterlesen: Regal zu Empfehlung, Kalkulation und Rechner.
 * ---------------------------------------------------------------- */
const VERWEISE = [
  {
    href: "/empfehlung",
    label: "Empfehlung",
    text: "Fünf Fragen zu Betrieb und Zeitplan, danach schlagen wir ein Paket vor.",
    icon: ListChecks,
  },
  {
    href: "/honorar",
    label: "Kalkulation",
    text: "Stundensatz und Stunden je Paket: So kommen die Preise zustande.",
    icon: Calculator,
  },
  {
    href: "/rechner",
    label: "3-Jahres-Rechner",
    text: "Die Gesamtkosten über drei Jahre neben Wix, Squarespace und Jimdo.",
    icon: TrendingUp,
  },
];

function Weiterlesen() {
  return (
    <Regal id="weiterlesen" fett="Noch unsicher?" grau="Hier hilft Ihnen die Entscheidung." flaeche="weiss">
      {VERWEISE.map((v) => (
        <RegalKarte
          key={v.href}
          titel={v.label}
          text={v.text}
          href={v.href}
          motiv={<IconMotiv icon={v.icon} />}
        />
      ))}
    </Regal>
  );
}
